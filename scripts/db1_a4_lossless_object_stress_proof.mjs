import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A4_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");

const targetBytes = Number(process.env.DB1_A4_TARGET_BYTES ?? 150 * 1024 * 1024);
const maximumPayloadBytes = 64 * 1024;
const batchSize = 24;
const workerRevision = "db1-a4-lossless-object-stress-proof-v1";

if (!Number.isSafeInteger(targetBytes) || targetBytes < 1024 * 1024) {
  throw new Error("DB1_A4_TARGET_BYTES must be a safe integer of at least 1 MiB.");
}
if (!process.env.DB1_A4_DATABASE_URL) {
  throw new Error("DB1_A4_DATABASE_URL is required.");
}

let peakRssBytes = 0;
function measureMemory() {
  peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss);
}

function sourceObject(position, payloadBytes) {
  return Buffer.from(JSON.stringify({ sourceId: position, payload: "x".repeat(payloadBytes) }), "utf8");
}

function buildSyntheticArray() {
  const raw = Buffer.allocUnsafe(targetBytes);
  let offset = 0;
  let position = 0;
  raw[offset++] = 0x5b; // [

  while (offset + 1 < targetBytes) {
    const separatorBytes = position === 0 ? 0 : 1;
    const availableForObject = targetBytes - offset - separatorBytes - 1; // final ]
    const emptyObjectBytes = sourceObject(position, 0).byteLength;
    const payloadBytes = Math.min(maximumPayloadBytes, availableForObject - emptyObjectBytes);
    if (payloadBytes < 0) break;
    const object = sourceObject(position, payloadBytes);
    if (object.byteLength > availableForObject) break;
    if (separatorBytes) raw[offset++] = 0x2c; // ,
    object.copy(raw, offset);
    offset += object.byteLength;
    position += 1;
  }

  raw[offset++] = 0x5d; // ]
  if (offset !== targetBytes || position === 0) {
    throw new Error(`Synthetic array construction failed: ${offset} bytes, ${position} objects.`);
  }
  measureMemory();
  return raw;
}

function skipWhitespace(raw, offset) {
  while (offset < raw.byteLength && (raw[offset] === 0x20 || raw[offset] === 0x0a || raw[offset] === 0x0d || raw[offset] === 0x09)) {
    offset += 1;
  }
  return offset;
}

function* topLevelObjectSlices(raw) {
  let offset = skipWhitespace(raw, 0);
  if (raw[offset++] !== 0x5b) throw new Error("Synthetic response is not a top-level array.");
  offset = skipWhitespace(raw, offset);
  let position = 0;

  while (offset < raw.byteLength && raw[offset] !== 0x5d) {
    if (raw[offset] !== 0x7b) throw new Error(`Expected an object at byte ${offset}.`);
    const start = offset;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (; offset < raw.byteLength; offset += 1) {
      const byte = raw[offset];
      if (inString) {
        if (escaped) escaped = false;
        else if (byte === 0x5c) escaped = true;
        else if (byte === 0x22) inString = false;
        continue;
      }
      if (byte === 0x22) inString = true;
      else if (byte === 0x7b) depth += 1;
      else if (byte === 0x7d) {
        depth -= 1;
        if (depth === 0) {
          const end = offset + 1;
          yield { position, raw: raw.subarray(start, end) };
          position += 1;
          offset = skipWhitespace(raw, end);
          if (raw[offset] === 0x2c) offset = skipWhitespace(raw, offset + 1);
          break;
        }
      }
    }
    if (depth !== 0) throw new Error(`Unclosed object at source position ${position}.`);
  }
  if (raw[offset] !== 0x5d) throw new Error("Synthetic array has no closing bracket.");
}

function insertStatement(rows) {
  const values = [];
  const placeholders = rows.map((row, index) => {
    const base = index * 4;
    values.push(row.sourceResponseId, row.position, row.sourceObjectSha256, row.objectJson);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}::jsonb)`;
  });
  return {
    text: `insert into db1_a4_proof.response_object
      (source_response_id, source_position, source_object_sha256, object_jsonb)
      values ${placeholders.join(", ")}`,
    values
  };
}

const configRevision = crypto.createHash("sha256").update(JSON.stringify({ targetBytes, maximumPayloadBytes, batchSize })).digest("hex");
const client = new Client({ connectionString: process.env.DB1_A4_DATABASE_URL, application_name: "cld-db1-a4-lossless-stress-proof" });
let proofRunId;
let body;

try {
  await client.connect();
  const run = await client.query(
    `insert into db1_a4_proof.proof_run (worker_revision, configuration_revision, target_byte_length)
     values ($1, $2, $3) returning proof_run_id`,
    [workerRevision, configRevision, targetBytes]
  );
  proofRunId = run.rows[0].proof_run_id;

  body = buildSyntheticArray();
  const expectedBodySha = crypto.createHash("sha256").update(body).digest("hex");
  const saved = await client.query(
    `insert into db1_a4_proof.source_response (proof_run_id, content_type, raw_body, body_byte_length)
     values ($1, 'application/json', $2::bytea, octet_length($2::bytea))
     returning source_response_id, body_byte_length, body_sha256`,
    [proofRunId, body]
  );
  const sourceResponse = saved.rows[0];
  if (Number(sourceResponse.body_byte_length) !== targetBytes || sourceResponse.body_sha256 !== expectedBodySha) {
    throw new Error("PostgreSQL raw-response byte length or digest does not match the generated response.");
  }
  measureMemory();

  const expectedObjectHashes = new Map();
  let pending = [];
  let objectCount = 0;
  for (const slice of topLevelObjectSlices(body)) {
    const sourceObjectSha256 = crypto.createHash("sha256").update(slice.raw).digest("hex");
    expectedObjectHashes.set(slice.position, sourceObjectSha256);
    pending.push({
      sourceResponseId: sourceResponse.source_response_id,
      position: slice.position,
      sourceObjectSha256,
      objectJson: slice.raw.toString("utf8")
    });
    objectCount += 1;
    if (pending.length === batchSize) {
      await client.query(insertStatement(pending));
      pending = [];
      measureMemory();
    }
  }
  if (pending.length) await client.query(insertStatement(pending));
  measureMemory();

  const coverage = await client.query(
    `select count(*)::int as object_count,
            min(source_position)::int as first_position,
            max(source_position)::int as last_position,
            count(*) filter (where object_jsonb_sha256 = encode(digest(object_jsonb::text, 'sha256'), 'hex'))::int as canonical_digest_count
       from db1_a4_proof.response_object
      where source_response_id = $1`,
    [sourceResponse.source_response_id]
  );
  const checkedCoverage = coverage.rows[0];
  if (
    checkedCoverage.object_count !== objectCount ||
    checkedCoverage.first_position !== 0 ||
    checkedCoverage.last_position !== objectCount - 1 ||
    checkedCoverage.canonical_digest_count !== objectCount
  ) {
    throw new Error("PostgreSQL object count, position coverage or canonical object digest verification failed.");
  }

  const storedHashes = await client.query(
    `select source_position, source_object_sha256
       from db1_a4_proof.response_object
      where source_response_id = $1
      order by source_position`,
    [sourceResponse.source_response_id]
  );
  if (storedHashes.rowCount !== objectCount || storedHashes.rows.some((row) => expectedObjectHashes.get(row.source_position) !== row.source_object_sha256)) {
    throw new Error("A retained object digest does not match the corresponding synthetic source object.");
  }

  const summary = {
    target_byte_length: targetBytes,
    raw_response_sha256: expectedBodySha,
    object_count: objectCount,
    first_source_position: checkedCoverage.first_position,
    last_source_position: checkedCoverage.last_position,
    canonical_object_digest_count: checkedCoverage.canonical_digest_count,
    worker_peak_rss_bytes: peakRssBytes,
    payload_rows_removed_after_verification: true
  };
  await client.query(
    `update db1_a4_proof.proof_run
        set finished_at = now(), result_status = 'PASS', summary_jsonb = $2::jsonb
      where proof_run_id = $1`,
    [proofRunId, JSON.stringify(summary)]
  );
  await client.query("delete from db1_a4_proof.source_response where proof_run_id = $1", [proofRunId]);
  console.log(JSON.stringify({ status: "PASS", proofRunId, configurationRevision: configRevision, ...summary }, null, 2));
} catch (error) {
  if (proofRunId) {
    await client.query(
      `update db1_a4_proof.proof_run
          set finished_at = now(), result_status = 'FAIL', summary_jsonb = $2::jsonb
        where proof_run_id = $1 and result_status = 'RUNNING'`,
      [proofRunId, JSON.stringify({ error: String(error?.message ?? error), worker_peak_rss_bytes: peakRssBytes })]
    ).catch(() => undefined);
    await client.query("delete from db1_a4_proof.source_response where proof_run_id = $1", [proofRunId]).catch(() => undefined);
  }
  throw error;
} finally {
  body = undefined;
  await client.end();
}
