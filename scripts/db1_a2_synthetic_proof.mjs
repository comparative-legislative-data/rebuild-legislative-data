import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A2_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");

const databaseUrl = process.env.DB1_A2_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DB1_A2_DATABASE_URL is required.");
}

const workerRevision = "db1-a2-synthetic-proof-v2";
const smallV1 = Buffer.from(
  JSON.stringify({ fixture: "a2-small", version: 3, records: [{ key: "alpha", count: 3 }] }),
  "utf8"
);
const smallV2 = Buffer.from(
  JSON.stringify({ fixture: "a2-small", version: 4, records: [{ key: "alpha", count: 4 }] }),
  "utf8"
);
const large = Buffer.from(
  JSON.stringify({
    fixture: "a2-large-run-2",
    rows: Array.from({ length: 12000 }, (_, index) => ({
      index,
      label: `synthetic-${index}`,
      padding: "a2-proof-only".repeat(12)
    }))
  }),
  "utf8"
);

const sha256 = (body) => crypto.createHash("sha256").update(body).digest("hex");
const client = new Client({ connectionString: databaseUrl, application_name: "cld-db1-a2-synthetic-proof" });
let captureRunId;

async function insertResponse({ unitKey, body, captureRunId, resultKind }) {
  const parsed = JSON.parse(body.toString("utf8"));
  const existing = await client.query(
    "select source_response_id from db1.source_response where response_unit_key = $1 and body_sha256 = $2",
    [unitKey, sha256(body)]
  );

  if (existing.rowCount > 0) {
    await client.query(
      `insert into db1.response_verification
        (response_unit_key, capture_run_id, result_kind, source_response_id, upstream_status, detail)
       values ($1, $2, 'UNCHANGED', $3, 200, 'synthetic repeated bytes')`,
      [unitKey, captureRunId, existing.rows[0].source_response_id]
    );
    return { sourceResponseId: existing.rows[0].source_response_id, changed: false };
  }

  const response = await client.query(
    `insert into db1.source_response
      (response_unit_key, capture_run_id, request_method, request_locator, response_status, content_type, raw_body, body_byte_length, body_jsonb)
     select unit.response_unit_key, $2, unit.request_method, unit.request_locator, 200, 'application/json', $3::bytea, octet_length($3::bytea), $4::jsonb
     from db1.response_unit as unit
     where unit.response_unit_key = $1
     returning source_response_id, body_sha256, body_byte_length`,
    [unitKey, captureRunId, body, JSON.stringify(parsed)]
  );
  if (response.rowCount !== 1) {
    throw new Error(`registered response unit not found: ${unitKey}`);
  }

  const sourceResponseId = response.rows[0].source_response_id;
  await client.query(
    `insert into db1.schema_observation (source_response_id, shape_json, shape_sha256)
     select source_response_id, db1.json_shape(body_jsonb), encode(digest(db1.json_shape(body_jsonb)::text, 'sha256'), 'hex')
     from db1.source_response where source_response_id = $1`,
    [sourceResponseId]
  );
  await client.query(
    `insert into db1.response_verification
      (response_unit_key, capture_run_id, result_kind, source_response_id, upstream_status, detail)
     values ($1, $2, $3, $4, 200, 'synthetic JSON response')`,
    [unitKey, captureRunId, resultKind, sourceResponseId]
  );
  return { sourceResponseId, changed: true, ...response.rows[0] };
}

try {
  await client.connect();
  const start = await client.query(
    "select pg_database_size(current_database()) as database_bytes, pg_current_wal_lsn() as wal_lsn"
  );
  const run = await client.query(
    `insert into db1.capture_run (run_kind, worker_revision, configuration_revision, scope_description)
     values ('A2_SYNTHETIC_PROOF', $1, 'a2-foundation-v1', 'Synthetic-only proof; no external request')
     returning capture_run_id`,
    [workerRevision]
  );
  captureRunId = run.rows[0].capture_run_id;
  const started = performance.now();

  const first = await insertResponse({ unitKey: "a2.synthetic.small", body: smallV1, captureRunId, resultKind: "NEW" });
  const unchanged = await insertResponse({ unitKey: "a2.synthetic.small", body: smallV1, captureRunId, resultKind: "UNCHANGED" });
  const changed = await insertResponse({ unitKey: "a2.synthetic.small", body: smallV2, captureRunId, resultKind: "CHANGED" });
  const largeResult = await insertResponse({ unitKey: "a2.synthetic.large", body: large, captureRunId, resultKind: "NEW" });

  await client.query(
    `insert into db1.response_verification
      (response_unit_key, capture_run_id, result_kind, source_response_id, upstream_status, condition_code, detail)
     values ('a2.synthetic.small', $1, 'UPSTREAM_CONDITION', $2, 503, 'SYNTHETIC_UPSTREAM_CONDITION', 'synthetic condition; last good body remains retained')`,
    [captureRunId, changed.sourceResponseId]
  );

  let rejectedScope = false;
  try {
    await client.query(
      `insert into db1.source_response
        (response_unit_key, capture_run_id, request_method, request_locator, response_status, content_type, raw_body, body_byte_length, body_jsonb)
       values ('a2.not-registered', $1, 'GET', 'synthetic://not-registered', 200, 'application/json', $2::bytea, octet_length($2::bytea), $3::jsonb)`,
      [captureRunId, smallV1, smallV1.toString("utf8")]
    );
  } catch (error) {
    rejectedScope = error?.code === "23503";
  }
  if (!rejectedScope) throw new Error("non-registry response unit was not rejected");

  const direct = await client.query(
    `select encode(raw_body, 'escape') as raw_body, body_jsonb #>> '{records,0,key}' as json_key,
            body_sha256, encode(digest(raw_body, 'sha256'), 'hex') = body_sha256 as digest_matches,
            octet_length(raw_body) = body_byte_length as byte_length_matches
     from db1.source_response
     where source_response_id = $1`,
    [changed.sourceResponseId]
  );
  const current = await client.query(
    "select latest_successful_response_id, latest_condition_kind, latest_upstream_status from db1.v_current_response_unit where response_unit_key = 'a2.synthetic.small'"
  );
  const finish = await client.query(
    "select pg_database_size(current_database()) as database_bytes, pg_wal_lsn_diff(pg_current_wal_lsn(), $1) as wal_bytes", [start.rows[0].wal_lsn]
  );

  if (direct.rowCount !== 1 || direct.rows[0].json_key !== "alpha" || !direct.rows[0].digest_matches || !direct.rows[0].byte_length_matches) {
    throw new Error("direct byte/JSON integrity test failed");
  }
  if (first.changed !== true || unchanged.changed !== false || changed.changed !== true || largeResult.changed !== true) {
    throw new Error("history/idempotency test failed");
  }
  if (current.rows[0].latest_successful_response_id !== changed.sourceResponseId || current.rows[0].latest_condition_kind !== "UPSTREAM_CONDITION") {
    throw new Error("current-state condition test failed");
  }

  await client.query(
    "update db1.capture_run set finished_at = now(), result_status = 'PASS' where capture_run_id = $1",
    [captureRunId]
  );

  const elapsedMilliseconds = Math.round(performance.now() - started);
  console.log(JSON.stringify({
    status: "PASS",
    captureRunId,
    storedVersions: { small: 2, large: 1 },
    unchangedVerification: true,
    upstreamConditionRetainsLastGoodResponse: true,
    unregisteredUnitRejectedBeforeNetwork: true,
    directIntegrity: direct.rows[0],
    metrics: {
      elapsedMilliseconds,
      workerPeakRssBytes: process.resourceUsage().maxRSS * 1024,
      databaseByteDelta: Number(finish.rows[0].database_bytes) - Number(start.rows[0].database_bytes),
      walBytes: Number(finish.rows[0].wal_bytes),
      largeFixtureBytes: large.byteLength
    }
  }, null, 2));
} catch (error) {
  if (captureRunId) {
    await client.query(
      "update db1.capture_run set finished_at = now(), result_status = 'FAIL' where capture_run_id = $1 and result_status = 'RUNNING'",
      [captureRunId]
    );
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
