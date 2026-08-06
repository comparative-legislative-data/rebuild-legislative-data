import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A5_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");
const maxObjectBytes = Number(process.env.DB1_A5_MAX_OBJECT_BYTES ?? 16 * 1024 * 1024);
const batchSize = 24;
const revision = "db1-a5-reproject-retained-v1";
if (!process.env.DB1_A5_DATABASE_URL) throw new Error("DB1_A5_DATABASE_URL is required.");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
function whitespace(raw, offset) { while (offset < raw.length && [0x20, 0x0a, 0x0d, 0x09].includes(raw[offset])) offset += 1; return offset; }
function* objects(raw) {
  let offset = whitespace(raw, 0); if (raw[offset++] !== 0x5b) throw new Error("not a top-level array"); offset = whitespace(raw, offset); let position = 0;
  while (offset < raw.length && raw[offset] !== 0x5d) {
    if (raw[offset] !== 0x7b) throw new Error(`array item ${position} is not an object`);
    const start = offset; let depth = 0; let string = false; let escaped = false;
    for (; offset < raw.length; offset += 1) { const byte = raw[offset]; if (string) { if (escaped) escaped = false; else if (byte === 0x5c) escaped = true; else if (byte === 0x22) string = false; continue; } if (byte === 0x22) string = true; else if (byte === 0x7b) depth += 1; else if (byte === 0x7d && --depth === 0) { const end = offset + 1; yield { position: position++, raw: raw.subarray(start, end) }; offset = whitespace(raw, end); if (raw[offset] === 0x2c) offset = whitespace(raw, offset + 1); break; } }
    if (depth) throw new Error(`unclosed object at source position ${position}`);
  }
  if (raw[offset] !== 0x5d) throw new Error("array has no closing bracket");
}
function insert(rows) {
  const values = []; const placeholders = rows.map((row, index) => { const base = index * 4; values.push(row.id, row.position, row.sha, row.json); return `($${base + 1},$${base + 2},$${base + 3},$${base + 4}::jsonb)`; });
  return { text: `insert into db1.response_object (source_response_id,source_position,source_object_sha256,object_jsonb) values ${placeholders.join(",")}`, values };
}
const client = new Client({ connectionString: process.env.DB1_A5_DATABASE_URL, application_name: "cld-db1-a5-reproject-retained" });
try {
  await client.connect();
  const sources = await client.query(`select response.source_response_id,response.raw_body from db1.source_response response
    left join db1.projection_run projection using(source_response_id)
    where projection.source_response_id is null and response.content_type='application/octet-stream' and substring(response.raw_body from 1 for 1)=decode('5b','hex') order by response.request_finished_at`);
  let responseCount = 0; let objectCount = 0;
  for (const source of sources.rows) {
    const projection = await client.query("insert into db1.projection_run (source_response_id,parser_revision,observed_shape) values ($1,$2,'ARRAY_OF_OBJECTS') returning projection_run_id", [source.source_response_id, revision]);
    let exceedsObjectLimit = false;
    for (const slice of objects(source.raw_body)) { if (slice.raw.length > maxObjectBytes) { exceedsObjectLimit = true; break; } }
    if (exceedsObjectLimit) {
      await client.query("update db1.projection_run set finished_at=now(),result_status='LIMITED',observed_shape='OBJECT_LIMIT',detail=$2 where projection_run_id=$1", [projection.rows[0].projection_run_id, `at least one source object exceeds ${maxObjectBytes} bytes`]);
      responseCount += 1; continue;
    }
    let rows = []; let count = 0;
    for (const slice of objects(source.raw_body)) { rows.push({ id: source.source_response_id, position: slice.position, sha: sha256(slice.raw), json: slice.raw.toString("utf8") }); count += 1; if (rows.length === batchSize) { await client.query(insert(rows)); rows = []; } }
    if (rows.length) await client.query(insert(rows));
    await client.query(`insert into db1.field_observation (projection_run_id,json_path,json_type,occurrence_count,null_count)
      select $1,key,jsonb_typeof(value),count(*)::int,count(*) filter(where value='null'::jsonb)::int from db1.response_object cross join lateral jsonb_each(object_jsonb) where source_response_id=$2 group by key,jsonb_typeof(value)`, [projection.rows[0].projection_run_id, source.source_response_id]);
    await client.query("update db1.projection_run set finished_at=now(),result_status='PASS',object_count=$2 where projection_run_id=$1", [projection.rows[0].projection_run_id, count]);
    responseCount += 1; objectCount += count;
  }
  console.log(JSON.stringify({ status: "PASS", reprojected_responses: responseCount, retained_source_objects_added: objectCount }));
} finally { await client.end(); }
