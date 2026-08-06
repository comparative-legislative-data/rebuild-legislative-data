import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A5_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");
const targetBytes = Number(process.env.DB1_A5_TARGET_BYTES ?? 150 * 1024 * 1024);
const maxPayloadBytes = 64 * 1024;
const batchSize = 24;
const workerRevision = "db1-a5-production-proof-v1";

if (!process.env.DB1_A5_DATABASE_URL) throw new Error("DB1_A5_DATABASE_URL is required.");
if (!Number.isSafeInteger(targetBytes) || targetBytes < 1024 * 1024) throw new Error("DB1_A5_TARGET_BYTES must be at least 1 MiB.");
let peakRssBytes = 0;
const measure = () => { peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss); };
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

function objectBytes(position, payloadLength) {
  return Buffer.from(JSON.stringify({ sourceId: position, payload: "x".repeat(payloadLength) }));
}
function buildArray() {
  const raw = Buffer.allocUnsafe(targetBytes);
  let offset = 0; let position = 0;
  raw[offset++] = 0x5b;
  while (offset + 1 < targetBytes) {
    const separator = position ? 1 : 0;
    const available = targetBytes - offset - separator - 1;
    const empty = objectBytes(position, 0).byteLength;
    const payload = Math.min(maxPayloadBytes, available - empty);
    if (payload < 0) break;
    const value = objectBytes(position, payload);
    if (value.byteLength > available) break;
    if (separator) raw[offset++] = 0x2c;
    value.copy(raw, offset); offset += value.byteLength; position += 1;
  }
  raw[offset++] = 0x5d;
  if (offset !== targetBytes || !position) throw new Error(`synthetic array construction failed at ${offset} bytes`);
  measure(); return raw;
}
function whitespace(raw, offset) { while (offset < raw.length && [0x20, 0x0a, 0x0d, 0x09].includes(raw[offset])) offset += 1; return offset; }
function* objectSlices(raw) {
  let offset = whitespace(raw, 0); if (raw[offset++] !== 0x5b) throw new Error("synthetic body is not an array");
  offset = whitespace(raw, offset); let position = 0;
  while (offset < raw.length && raw[offset] !== 0x5d) {
    if (raw[offset] !== 0x7b) throw new Error(`expected object at byte ${offset}`);
    const start = offset; let depth = 0; let string = false; let escaped = false;
    for (; offset < raw.length; offset += 1) {
      const byte = raw[offset];
      if (string) { if (escaped) escaped = false; else if (byte === 0x5c) escaped = true; else if (byte === 0x22) string = false; continue; }
      if (byte === 0x22) string = true;
      else if (byte === 0x7b) depth += 1;
      else if (byte === 0x7d && --depth === 0) { const end = offset + 1; yield { position: position++, raw: raw.subarray(start, end) }; offset = whitespace(raw, end); if (raw[offset] === 0x2c) offset = whitespace(raw, offset + 1); break; }
    }
    if (depth) throw new Error(`unclosed object at ${position}`);
  }
  if (raw[offset] !== 0x5d) throw new Error("synthetic body lacks closing bracket");
}
function insertObjects(rows) {
  const values = []; const placeholders = rows.map((row, index) => { const base = index * 4; values.push(row.id, row.position, row.sha, row.json); return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}::jsonb)`; });
  return { text: `insert into db1.response_object (source_response_id, source_position, source_object_sha256, object_jsonb) values ${placeholders.join(",")}`, values };
}

const client = new Client({ connectionString: process.env.DB1_A5_DATABASE_URL, application_name: "cld-db1-a5-production-proof" });
let runId; let raw;
try {
  await client.connect();
  const unit = await client.query("select request_method, request_locator from db1.response_unit where response_unit_key = '__a5_synthetic__.large' and is_synthetic");
  if (unit.rowCount !== 1) throw new Error("production synthetic response unit is missing");
  const config = sha256(JSON.stringify({ targetBytes, maxPayloadBytes, batchSize }));
  const run = await client.query(`insert into db1.capture_run (run_kind, worker_revision, deployed_package_revision, configuration_sha256, declared_limits)
    values ('SYNTHETIC_PROOF',$1,$2,$3,$4::jsonb) returning capture_run_id`, [workerRevision, process.env.DB1_A5_DEPLOYED_PACKAGE_REVISION ?? "unrecorded", config, JSON.stringify({ target_bytes: targetBytes, max_payload_bytes: maxPayloadBytes, batch_size: batchSize })]);
  runId = run.rows[0].capture_run_id; raw = buildArray(); const bodyHash = sha256(raw); const started = new Date();
  const stored = await client.query(`insert into db1.source_response (response_unit_key,capture_run_id,request_started_at,request_finished_at,request_method,request_locator,response_status,response_headers,content_type,raw_body,body_byte_length)
    values ('__a5_synthetic__.large',$1,$2,now(),$3,$4,200,'{}','application/json',$5::bytea,octet_length($5::bytea))
    returning source_response_id,body_byte_length,body_sha256`, [runId, started, unit.rows[0].request_method, unit.rows[0].request_locator, raw]);
  const response = stored.rows[0];
  if (Number(response.body_byte_length) !== targetBytes || response.body_sha256 !== bodyHash) throw new Error("stored raw body does not equal generated body");
  const projection = await client.query(`insert into db1.projection_run (source_response_id,parser_revision,observed_shape) values ($1,$2,'ARRAY_OF_OBJECTS') returning projection_run_id`, [response.source_response_id, workerRevision]);
  let rows = []; let count = 0;
  for (const slice of objectSlices(raw)) { rows.push({ id: response.source_response_id, position: slice.position, sha: sha256(slice.raw), json: slice.raw.toString("utf8") }); count += 1; if (rows.length === batchSize) { await client.query(insertObjects(rows)); rows = []; measure(); } }
  if (rows.length) await client.query(insertObjects(rows));
  await client.query(`insert into db1.field_observation (projection_run_id,json_path,json_type,occurrence_count,null_count)
    select $1,key,jsonb_typeof(value),count(*)::int,count(*) filter (where value = 'null'::jsonb)::int from db1.response_object cross join lateral jsonb_each(object_jsonb) where source_response_id=$2 group by key,jsonb_typeof(value)`, [projection.rows[0].projection_run_id, response.source_response_id]);
  const coverage = await client.query(`select count(*)::int as count,min(source_position)::int as first,max(source_position)::int as last from db1.response_object where source_response_id=$1`, [response.source_response_id]);
  if (coverage.rows[0].count !== count || coverage.rows[0].first !== 0 || coverage.rows[0].last !== count - 1) throw new Error("object coverage check failed");
  await client.query("update db1.projection_run set finished_at=now(),result_status='PASS',object_count=$2 where projection_run_id=$1", [projection.rows[0].projection_run_id, count]);
  const summary = { target_byte_length: targetBytes, raw_response_sha256: bodyHash, object_count: count, first_source_position: 0, last_source_position: count - 1, worker_peak_rss_bytes: peakRssBytes };
  await client.query("update db1.capture_run set finished_at=now(),result_status='PASS',attempted_units=1,transferred_bytes=$2,summary_jsonb=$3::jsonb where capture_run_id=$1", [runId, targetBytes, JSON.stringify(summary)]);
  console.log(JSON.stringify({ status: "PASS", captureRunId: runId, ...summary }));
} catch (error) {
  if (runId) await client.query("update db1.capture_run set finished_at=now(),result_status='FAIL',stop_reason=$2,summary_jsonb=$3::jsonb where capture_run_id=$1 and result_status='RUNNING'", [runId, "proof failure", JSON.stringify({ error: String(error?.message ?? error), worker_peak_rss_bytes: peakRssBytes })]).catch(() => undefined);
  throw error;
} finally { raw = undefined; await client.end(); }
