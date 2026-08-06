import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A5_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");
const maxBodyBytes = Number(process.env.DB1_A5_MAX_BODY_BYTES ?? 150 * 1024 * 1024);
const maxTotalBytes = Number(process.env.DB1_A5_MAX_TOTAL_BYTES ?? 20 * 1024 * 1024 * 1024);
const requestTimeoutMs = Number(process.env.DB1_A5_REQUEST_TIMEOUT_MS ?? 180_000);
const runTimeoutMs = Number(process.env.DB1_A5_RUN_TIMEOUT_MS ?? 10_800_000);
const maxObjectBytes = Number(process.env.DB1_A5_MAX_OBJECT_BYTES ?? 16 * 1024 * 1024);
const batchSize = 24;
const workerRevision = "db1-a5-initial-baseline-v1";
if (!process.env.DB1_A5_DATABASE_URL) throw new Error("DB1_A5_DATABASE_URL is required.");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const isJson = (contentType) => /(?:^|[;\s])application\/(?:[a-z0-9.+-]*\+)?json(?:[;\s]|$)/i.test(contentType ?? "");

function headersForRecord(headers) {
  return Object.fromEntries(["content-type", "content-length", "etag", "last-modified"].flatMap((key) => headers.has(key) ? [[key, headers.get(key)]] : []));
}
function whitespace(raw, offset) { while (offset < raw.length && [0x20, 0x0a, 0x0d, 0x09].includes(raw[offset])) offset += 1; return offset; }
function* topLevelObjects(raw) {
  let offset = whitespace(raw, 0); if (raw[offset++] !== 0x5b) throw new Error("not a top-level array");
  offset = whitespace(raw, offset); let position = 0;
  while (offset < raw.length && raw[offset] !== 0x5d) {
    if (raw[offset] !== 0x7b) throw new Error(`array item ${position} is not an object`);
    const start = offset; let depth = 0; let string = false; let escaped = false;
    for (; offset < raw.length; offset += 1) {
      const byte = raw[offset];
      if (string) { if (escaped) escaped = false; else if (byte === 0x5c) escaped = true; else if (byte === 0x22) string = false; continue; }
      if (byte === 0x22) string = true;
      else if (byte === 0x7b) depth += 1;
      else if (byte === 0x7d && --depth === 0) { const end = offset + 1; yield { position: position++, raw: raw.subarray(start, end) }; offset = whitespace(raw, end); if (raw[offset] === 0x2c) offset = whitespace(raw, offset + 1); break; }
    }
    if (depth) throw new Error(`unclosed source object at position ${position}`);
  }
  if (raw[offset] !== 0x5d) throw new Error("array has no closing bracket");
}
function objectInsert(rows) {
  const values = []; const placeholders = rows.map((row, index) => { const base = index * 4; values.push(row.responseId, row.position, row.sha, row.json); return `($${base + 1},$${base + 2},$${base + 3},$${base + 4}::jsonb)`; });
  return { text: `insert into db1.response_object (source_response_id,source_position,source_object_sha256,object_jsonb) values ${placeholders.join(",")}`, values };
}
async function readBody(response, state) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBodyBytes) throw new Error("BODY_LIMIT");
  const raw = Buffer.allocUnsafe(Number.isFinite(declared) && declared > 0 ? declared : Math.min(maxBodyBytes, 1024 * 1024));
  let output = raw; let size = 0;
  for await (const value of response.body) {
    if (size + value.byteLength > maxBodyBytes || state.transferredBytes + size + value.byteLength > maxTotalBytes) throw new Error("BODY_LIMIT");
    if (size + value.byteLength > output.length) { const next = Buffer.allocUnsafe(Math.min(maxBodyBytes, Math.max(size + value.byteLength, output.length * 2))); output.copy(next, 0, 0, size); output = next; }
    Buffer.from(value).copy(output, size); size += value.byteLength;
  }
  state.transferredBytes += size;
  return output.subarray(0, size);
}
function sourceMessage(raw) { return /presently\s+unavailable|"Message"\s*:/i.test(raw.toString("utf8", 0, Math.min(raw.length, 65_536))); }
async function project(client, sourceResponseId, raw, contentType) {
  const firstByte = raw[whitespace(raw, 0)];
  // The Parliament supplies several JSON arrays as application/octet-stream.
  // The retained bytes, not only the descriptive header, determine whether a
  // safe JSON projection is attempted.
  const jsonCandidate = isJson(contentType) || firstByte === 0x5b || firstByte === 0x7b;
  const projection = await client.query("insert into db1.projection_run (source_response_id,parser_revision,observed_shape) values ($1,$2,$3) returning projection_run_id", [sourceResponseId, workerRevision, jsonCandidate ? "MALFORMED_JSON" : "NON_JSON"]);
  const projectionId = projection.rows[0].projection_run_id;
  let shape = jsonCandidate ? "MALFORMED_JSON" : "NON_JSON"; let detail = null; let count = 0;
  if (jsonCandidate) {
    const first = whitespace(raw, 0);
    try {
      if (raw[first] === 0x5b) {
        shape = "ARRAY_OF_OBJECTS";
        let exceedsObjectLimit = false;
        for (const slice of topLevelObjects(raw)) { if (slice.raw.length > maxObjectBytes) { exceedsObjectLimit = true; break; } }
        if (exceedsObjectLimit) { shape = "OBJECT_LIMIT"; detail = `at least one source object exceeds ${maxObjectBytes} bytes`; }
        else {
          let pending = [];
          for (const slice of topLevelObjects(raw)) { pending.push({ responseId: sourceResponseId, position: slice.position, sha: sha256(slice.raw), json: slice.raw.toString("utf8") }); count += 1; if (pending.length === batchSize) { await client.query(objectInsert(pending)); pending = []; } }
          if (pending.length) await client.query(objectInsert(pending));
        }
      } else if (raw[first] === 0x7b) {
        const value = JSON.parse(raw.toString("utf8"));
        if (sourceMessage(raw)) { shape = "SOURCE_MESSAGE"; detail = "upstream JSON availability message retained"; }
        else if (raw.length > maxObjectBytes) { shape = "OBJECT_LIMIT"; detail = `single source object exceeds ${maxObjectBytes} bytes`; }
        else { shape = "SINGLE_OBJECT"; await client.query(objectInsert([{ responseId: sourceResponseId, position: 0, sha: sha256(raw), json: JSON.stringify(value) }])); count = 1; }
      } else { JSON.parse(raw.toString("utf8")); shape = "UNSUPPORTED_ARRAY"; detail = "valid JSON but not an object or array of objects"; }
    } catch (error) { shape = "MALFORMED_JSON"; detail = String(error?.message ?? error).slice(0, 500); }
  }
  if (count) await client.query(`insert into db1.field_observation (projection_run_id,json_path,json_type,occurrence_count,null_count)
    select $1,key,jsonb_typeof(value),count(*)::int,count(*) filter (where value='null'::jsonb)::int from db1.response_object cross join lateral jsonb_each(object_jsonb) where source_response_id=$2 group by key,jsonb_typeof(value)`, [projectionId, sourceResponseId]);
  await client.query("update db1.projection_run set finished_at=now(),result_status=$2,observed_shape=$3,object_count=$4,detail=$5 where projection_run_id=$1", [projectionId, shape === "OBJECT_LIMIT" || shape === "UNSUPPORTED_ARRAY" ? "LIMITED" : "PASS", shape, count, detail]);
  return { shape, count };
}

const client = new Client({ connectionString: process.env.DB1_A5_DATABASE_URL, application_name: "cld-db1-a5-initial-baseline" });
const state = { transferredBytes: 0, attempted: 0, outcomes: {} }; let runId;
const limits = { request_timeout_ms: requestTimeoutMs, run_timeout_ms: runTimeoutMs, max_body_bytes: maxBodyBytes, max_total_bytes: maxTotalBytes, max_object_bytes: maxObjectBytes, retry_count: 0, mode: "serial" };
try {
  await client.connect();
  const registry = await client.query("select response_unit_key,request_method,request_locator from db1.response_unit where not is_synthetic and retired_at is null order by response_unit_key");
  const forms = await client.query("select count(*)::int as count from db1.source_form where not is_synthetic");
  if (forms.rows[0].count !== 64 || registry.rowCount !== 117 || new Set(registry.rows.map((row) => row.request_locator)).size !== 117 || registry.rows.some((row) => !row.request_locator.startsWith("https://data.parliament.scot/api/"))) throw new Error("approved 64-form / 117-unit registry check failed");
  const registryHash = sha256(JSON.stringify(registry.rows));
  const run = await client.query(`insert into db1.capture_run (run_kind,worker_revision,deployed_package_revision,configuration_sha256,declared_limits)
    values ('INITIAL_BASELINE',$1,$2,$3,$4::jsonb) returning capture_run_id`, [workerRevision, process.env.DB1_A5_DEPLOYED_PACKAGE_REVISION ?? "unrecorded", registryHash, JSON.stringify(limits)]);
  runId = run.rows[0].capture_run_id; const deadline = Date.now() + runTimeoutMs;
  for (const unit of registry.rows) {
    state.attempted += 1;
    if (Date.now() >= deadline) throw new Error("RUN_LIMIT");
    const startedAt = new Date(); let response; let raw;
    try {
      response = await fetch(unit.request_locator, { method: unit.request_method, headers: { accept: "application/json" }, signal: AbortSignal.timeout(Math.min(requestTimeoutMs, deadline - Date.now())) });
      raw = await readBody(response, state);
      const contentType = response.headers.get("content-type") ?? "application/octet-stream";
      const saved = await client.query(`insert into db1.source_response (response_unit_key,capture_run_id,request_started_at,request_finished_at,request_method,request_locator,response_status,response_headers,content_type,raw_body,body_byte_length)
        values ($1,$2,$3,now(),$4,$5,$6,$7::jsonb,$8,$9::bytea,octet_length($9::bytea))
        on conflict (response_unit_key,body_sha256) do nothing returning source_response_id`, [unit.response_unit_key, runId, startedAt, unit.request_method, unit.request_locator, response.status, JSON.stringify(headersForRecord(response.headers)), contentType, raw]);
      let responseId = saved.rows[0]?.source_response_id; const condition = sourceMessage(raw);
      if (!responseId) responseId = (await client.query("select source_response_id from db1.source_response where response_unit_key=$1 and body_sha256=$2", [unit.response_unit_key, sha256(raw)])).rows[0].source_response_id;
      if (saved.rowCount) await project(client, responseId, raw, contentType);
      const result = condition || !response.ok ? "UPSTREAM_CONDITION" : saved.rowCount ? "NEW" : "UNCHANGED";
      const code = condition ? "UPSTREAM_AVAILABILITY_MESSAGE" : !response.ok ? `HTTP_${response.status}` : null;
      await client.query("insert into db1.response_verification (response_unit_key,capture_run_id,result_kind,source_response_id,upstream_status,condition_code,detail) values ($1,$2,$3,$4,$5,$6,$7)", [unit.response_unit_key, runId, result, responseId, response.status, code, result === "UPSTREAM_CONDITION" ? "upstream response retained exactly in PostgreSQL" : "baseline response retained in PostgreSQL"]);
      state.outcomes[result] = (state.outcomes[result] ?? 0) + 1;
    } catch (error) {
      const code = String(error?.message ?? error).includes("BODY_LIMIT") ? "BODY_LIMIT" : String(error?.message ?? error).includes("RUN_LIMIT") ? "RUN_LIMIT" : error?.name === "TimeoutError" ? "TIMEOUT" : "TRANSPORT_ERROR";
      await client.query("insert into db1.response_verification (response_unit_key,capture_run_id,result_kind,condition_code,detail) values ($1,$2,'LOCAL_FAILURE',$3,$4)", [unit.response_unit_key, runId, code, String(error?.message ?? error).slice(0, 500)]);
      state.outcomes.LOCAL_FAILURE = (state.outcomes.LOCAL_FAILURE ?? 0) + 1;
      if (code === "RUN_LIMIT" || code === "BODY_LIMIT") throw error;
    }
  }
  const summary = { registry_units: registry.rowCount, attempted_units: state.attempted, transferred_bytes: state.transferredBytes, outcomes: state.outcomes };
  await client.query("update db1.capture_run set finished_at=now(),result_status='PASS',attempted_units=$2,transferred_bytes=$3,summary_jsonb=$4::jsonb where capture_run_id=$1", [runId, state.attempted, state.transferredBytes, JSON.stringify(summary)]);
  console.log(JSON.stringify({ status: "PASS", captureRunId: runId, ...summary }));
} catch (error) {
  if (runId) await client.query("update db1.capture_run set finished_at=now(),result_status='BLOCKED',attempted_units=$2,transferred_bytes=$3,stop_reason=$4,summary_jsonb=$5::jsonb where capture_run_id=$1 and result_status='RUNNING'", [runId, state.attempted, state.transferredBytes, "baseline stopped", JSON.stringify({ error: String(error?.message ?? error), outcomes: state.outcomes })]).catch(() => undefined);
  throw error;
} finally { await client.end(); }
