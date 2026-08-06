import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A5_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");
const chunkBytes = Number(process.env.DB1_A5_REPROJECT_CHUNK_BYTES ?? 2 * 1024 * 1024);
const maxObjectBytes = Number(process.env.DB1_A5_MAX_OBJECT_BYTES ?? 16 * 1024 * 1024);
const maxBatchBytes = 32 * 1024 * 1024;
const maxBatchRows = 24;
const revision = "db1-a5-chunked-reproject-v2";
if (!process.env.DB1_A5_DATABASE_URL) throw new Error("DB1_A5_DATABASE_URL is required.");
if (!Number.isSafeInteger(chunkBytes) || chunkBytes < 64 * 1024) throw new Error("DB1_A5_REPROJECT_CHUNK_BYTES must be at least 64 KiB.");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const isWhitespace = (byte) => byte === 0x20 || byte === 0x0a || byte === 0x0d || byte === 0x09;
function insert(rows) {
  const values = []; const placeholders = rows.map((row, index) => { const base = index * 4; values.push(row.id, row.position, row.sha, row.json); return `($${base + 1},$${base + 2},$${base + 3},$${base + 4}::jsonb)`; });
  return { text: `insert into db1.response_object (source_response_id,source_position,source_object_sha256,object_jsonb) values ${placeholders.join(",")}`, values };
}
async function projectArray(client, sourceResponseId, length) {
  const projection = await client.query("insert into db1.projection_run (source_response_id,parser_revision,observed_shape) values ($1,$2,'ARRAY_OF_OBJECTS') returning projection_run_id", [sourceResponseId, revision]);
  const projectionId = projection.rows[0].projection_run_id;
  const state = { begun: false, ended: false, between: true, depth: 0, inString: false, escaped: false, pieces: [], objectBytes: 0, position: 0, rows: [], rowBytes: 0 };
  const flushRows = async () => {
    if (!state.rows.length) return;
    await client.query(insert(state.rows)); state.rows = []; state.rowBytes = 0;
  };
  const finishObject = async () => {
    const raw = Buffer.concat(state.pieces, state.objectBytes);
    if (raw.length > maxObjectBytes) throw new Error(`OBJECT_LIMIT at source position ${state.position}`);
    state.rows.push({ id: sourceResponseId, position: state.position++, sha: sha256(raw), json: raw.toString("utf8") });
    state.rowBytes += raw.length; state.pieces = []; state.objectBytes = 0; state.between = true;
    if (state.rows.length >= maxBatchRows || state.rowBytes >= maxBatchBytes) await flushRows();
  };
  for (let offset = 1; offset <= length; offset += chunkBytes) {
    const chunk = (await client.query("select substring(raw_body from $2 for $3) as bytes from db1.source_response where source_response_id=$1", [sourceResponseId, offset, chunkBytes])).rows[0].bytes;
    let pieceStart = state.depth ? 0 : null;
    for (let index = 0; index < chunk.length; index += 1) {
      const byte = chunk[index];
      if (!state.begun) { if (isWhitespace(byte)) continue; if (byte !== 0x5b) throw new Error("response is not a top-level array"); state.begun = true; state.between = true; continue; }
      if (!state.depth) {
        if (isWhitespace(byte) || byte === 0x2c) continue;
        if (byte === 0x5d) { state.ended = true; continue; }
        if (byte !== 0x7b || state.ended) throw new Error(`array item ${state.position} is not an object`);
        state.depth = 1; state.between = false; state.inString = false; state.escaped = false; pieceStart = index; continue;
      }
      if (state.inString) { if (state.escaped) state.escaped = false; else if (byte === 0x5c) state.escaped = true; else if (byte === 0x22) state.inString = false; continue; }
      if (byte === 0x22) state.inString = true;
      else if (byte === 0x7b) state.depth += 1;
      else if (byte === 0x7d) {
        state.depth -= 1;
        if (!state.depth) { state.pieces.push(Buffer.from(chunk.subarray(pieceStart, index + 1))); state.objectBytes += index + 1 - pieceStart; pieceStart = null; await finishObject(); }
      }
    }
    if (state.depth && pieceStart !== null) { state.pieces.push(Buffer.from(chunk.subarray(pieceStart))); state.objectBytes += chunk.length - pieceStart; if (state.objectBytes > maxObjectBytes) throw new Error(`OBJECT_LIMIT at source position ${state.position}`); }
  }
  if (!state.begun || !state.ended || state.depth || !state.between) throw new Error("unterminated or malformed top-level array");
  await flushRows();
  if (state.position) await client.query(`insert into db1.field_observation (projection_run_id,json_path,json_type,occurrence_count,null_count)
    select $1,key,jsonb_typeof(value),count(*)::int,count(*) filter(where value='null'::jsonb)::int from db1.response_object cross join lateral jsonb_each(object_jsonb) where source_response_id=$2 group by key,jsonb_typeof(value)`, [projectionId, sourceResponseId]);
  await client.query("update db1.projection_run set finished_at=now(),result_status='PASS',object_count=$2 where projection_run_id=$1", [projectionId, state.position]);
  return state.position;
}

const client = new Client({ connectionString: process.env.DB1_A5_DATABASE_URL, application_name: "cld-db1-a5-chunked-reproject" });
try {
  await client.connect();
  const sources = await client.query(`select source_response_id,octet_length(raw_body)::bigint as body_bytes from db1.source_response response
    left join db1.projection_run projection using(source_response_id)
    where projection.source_response_id is null and response.content_type='application/octet-stream' and substring(response.raw_body from 1 for 1)=decode('5b','hex') order by response.request_finished_at`);
  let responseCount = 0; let objectCount = 0;
  for (const source of sources.rows) { objectCount += await projectArray(client, source.source_response_id, Number(source.body_bytes)); responseCount += 1; }
  console.log(JSON.stringify({ status: "PASS", reprojected_responses: responseCount, retained_source_objects_added: objectCount, chunk_bytes: chunkBytes }));
} finally { await client.end(); }
