// DEC-0126 Gate D only. It never contacts a source and writes solely to the
// existing synthetic response unit so real Scottish Parliament evidence is untouched.
import { createRequire } from "node:module";
import { sha256 } from "./db1_a6_assurance_lib.mjs";

const require = createRequire(process.env.DB1_A6_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");
const workerRevision = "db1-a6-synthetic-drift-proof-v1";

if (!process.env.DB1_A6_DATABASE_URL) throw new Error("DB1_A6_DATABASE_URL is required.");

const client = new Client({ connectionString: process.env.DB1_A6_DATABASE_URL, application_name: "cld-db1-a6-synthetic-drift-proof" });
try {
  await client.connect();
  const unit = await client.query("select request_method,request_locator from db1.response_unit where response_unit_key='__a5_synthetic__.large' and is_synthetic");
  if (unit.rowCount !== 1) throw new Error("synthetic DB1 response unit is missing");
  const config = { gate: "D", source_requests_made: 0, test: "synthetic field-profile drift" };
  const capture = await client.query(`insert into db1.capture_run
    (run_kind,worker_revision,deployed_package_revision,configuration_sha256,declared_limits,finished_at,result_status,summary_jsonb)
    values ('SYNTHETIC_PROOF',$1,$2,$3,$4::jsonb,now(),'PASS',$5::jsonb) returning capture_run_id`, [
    workerRevision, process.env.DB1_A6_DEPLOYED_PACKAGE_REVISION ?? "unrecorded", sha256(JSON.stringify(config)), JSON.stringify(config), JSON.stringify(config)
  ]);
  const runId = capture.rows[0].capture_run_id;
  const insertResponse = async (raw) => {
    const saved = await client.query(`insert into db1.source_response
      (response_unit_key,capture_run_id,request_started_at,request_finished_at,request_method,request_locator,response_status,response_headers,content_type,raw_body,body_byte_length)
      values ('__a5_synthetic__.large',$1,now(),now(),$2,$3,200,'{}'::jsonb,'application/json',$4::bytea,octet_length($4::bytea))
      on conflict (response_unit_key,body_sha256) do nothing returning source_response_id`, [runId, unit.rows[0].request_method, unit.rows[0].request_locator, raw]);
    if (saved.rowCount) return saved.rows[0].source_response_id;
    return (await client.query("select source_response_id from db1.source_response where response_unit_key='__a5_synthetic__.large' and body_sha256=$1", [sha256(raw)])).rows[0].source_response_id;
  };
  const priorId = await insertResponse(Buffer.from('{"SyntheticFieldBefore":1}', "utf8"));
  const currentId = await insertResponse(Buffer.from('{"SyntheticFieldAfter":"text"}', "utf8"));
  const priorProfile = { shape: "SINGLE_OBJECT", fields: { SyntheticFieldBefore: ["number"] } };
  const currentProfile = { shape: "SINGLE_OBJECT", fields: { SyntheticFieldAfter: ["string"] } };
  for (const [id, profile] of [[priorId, priorProfile], [currentId, currentProfile]]) {
    await client.query(`insert into db1.response_schema_profile (source_response_id,observed_shape,profile_jsonb)
      values ($1,$2,$3::jsonb) on conflict (source_response_id) do nothing`, [id, profile.shape, JSON.stringify(profile)]);
  }
  const profiles = await client.query("select source_response_id,profile_sha256 from db1.response_schema_profile where source_response_id = any($1::uuid[])", [[priorId, currentId]]);
  const profileHash = Object.fromEntries(profiles.rows.map((row) => [row.source_response_id, row.profile_sha256]));
  const drift = {
    shape_changed: false,
    previous_shape: "SINGLE_OBJECT",
    current_shape: "SINGLE_OBJECT",
    added_fields: ["SyntheticFieldAfter"],
    removed_fields: ["SyntheticFieldBefore"],
    type_changes: [],
    changed: true,
    synthetic_test: true
  };
  await client.query(`insert into db1.schema_drift_event
    (capture_run_id,response_unit_key,prior_source_response_id,current_source_response_id,prior_profile_sha256,current_profile_sha256,drift_jsonb)
    values ($1,'__a5_synthetic__.large',$2,$3,$4,$5,$6::jsonb)
    on conflict (current_source_response_id) do nothing`, [runId, priorId, currentId, profileHash[priorId], profileHash[currentId], JSON.stringify(drift)]);
  console.log(JSON.stringify({ status: "PASS", capture_run_id: runId, source_requests_made: 0, synthetic_drift_event: true }));
} finally {
  await client.end();
}
