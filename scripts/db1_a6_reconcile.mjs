import { statfs } from "node:fs/promises";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { classifySourceResponse, diffProfiles, sha256, sourceAvailabilityMessage } from "./db1_a6_assurance_lib.mjs";

const require = createRequire(process.env.DB1_A6_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");

const lockKey = 74126117;
const batchSize = 24;
const workerRevision = "db1-a6-reconcile-v1";
const maxBodyBytes = Number(process.env.DB1_A6_MAX_BODY_BYTES ?? 150 * 1024 * 1024);
const maxTotalBytes = Number(process.env.DB1_A6_MAX_TOTAL_BYTES ?? 20 * 1024 * 1024 * 1024);
const requestTimeoutMs = Number(process.env.DB1_A6_REQUEST_TIMEOUT_MS ?? 180_000);
const runTimeoutMs = Number(process.env.DB1_A6_RUN_TIMEOUT_MS ?? 10_800_000);
const maxObjectBytes = Number(process.env.DB1_A6_MAX_OBJECT_BYTES ?? 16 * 1024 * 1024);
const diskPath = process.env.DB1_A6_DISK_PATH ?? "/srv/cld-gb-sct";

if (!process.env.DB1_A6_DATABASE_URL) throw new Error("DB1_A6_DATABASE_URL is required.");

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const requestedCadence = option("--cadence") ?? "source-free";
if (!["daily", "weekly", "all", "source-free", "hold"].includes(requestedCadence)) {
  throw new Error("--cadence must be daily, weekly, all, source-free or hold");
}
const holdLockMs = Number(option("--hold-lock-ms") ?? 0);
if (!Number.isSafeInteger(holdLockMs) || holdLockMs < 0 || holdLockMs > 60_000) {
  throw new Error("--hold-lock-ms must be a whole number between 0 and 60000");
}

function headersForRecord(headers) {
  return Object.fromEntries(["content-type", "content-length", "etag", "last-modified"].flatMap((key) => headers.has(key) ? [[key, headers.get(key)]] : []));
}

function whitespace(raw, offset) {
  while (offset < raw.length && [0x20, 0x0a, 0x0d, 0x09].includes(raw[offset])) offset += 1;
  return offset;
}

function isJson(contentType) {
  return /(?:^|[;\s])application\/(?:[a-z0-9.+-]*\+)?json(?:[;\s]|$)/i.test(contentType ?? "");
}

function* topLevelObjects(raw) {
  let offset = whitespace(raw, 0);
  if (raw[offset++] !== 0x5b) throw new Error("not a top-level array");
  offset = whitespace(raw, offset);
  let position = 0;
  while (offset < raw.length && raw[offset] !== 0x5d) {
    if (raw[offset] !== 0x7b) throw new Error(`array item ${position} is not an object`);
    const start = offset;
    let depth = 0;
    let string = false;
    let escaped = false;
    for (; offset < raw.length; offset += 1) {
      const byte = raw[offset];
      if (string) {
        if (escaped) escaped = false;
        else if (byte === 0x5c) escaped = true;
        else if (byte === 0x22) string = false;
        continue;
      }
      if (byte === 0x22) string = true;
      else if (byte === 0x7b) depth += 1;
      else if (byte === 0x7d && --depth === 0) {
        const end = offset + 1;
        yield { position: position++, raw: raw.subarray(start, end) };
        offset = whitespace(raw, end);
        if (raw[offset] === 0x2c) offset = whitespace(raw, offset + 1);
        break;
      }
    }
    if (depth) throw new Error(`unclosed source object at position ${position}`);
  }
  if (raw[offset] !== 0x5d) throw new Error("array has no closing bracket");
}

function objectInsert(rows) {
  const values = [];
  const placeholders = rows.map((row, index) => {
    const base = index * 4;
    values.push(row.responseId, row.position, row.sha, row.json);
    return `($${base + 1},$${base + 2},$${base + 3},$${base + 4}::jsonb)`;
  });
  return {
    text: `insert into db1.response_object (source_response_id,source_position,source_object_sha256,object_jsonb) values ${placeholders.join(",")}`,
    values
  };
}

async function readBody(response, state) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBodyBytes) throw new Error("BODY_LIMIT");
  const raw = Buffer.allocUnsafe(Number.isFinite(declared) && declared > 0 ? declared : Math.min(maxBodyBytes, 1024 * 1024));
  let output = raw;
  let size = 0;
  for await (const value of response.body) {
    if (size + value.byteLength > maxBodyBytes || state.transferredBytes + size + value.byteLength > maxTotalBytes) throw new Error("BODY_LIMIT");
    if (size + value.byteLength > output.length) {
      const next = Buffer.allocUnsafe(Math.min(maxBodyBytes, Math.max(size + value.byteLength, output.length * 2)));
      output.copy(next, 0, 0, size);
      output = next;
    }
    Buffer.from(value).copy(output, size);
    size += value.byteLength;
  }
  state.transferredBytes += size;
  return output.subarray(0, size);
}

async function project(client, sourceResponseId, raw, contentType) {
  const firstByte = raw[whitespace(raw, 0)];
  const jsonCandidate = isJson(contentType) || firstByte === 0x5b || firstByte === 0x7b;
  const inserted = await client.query(
    "insert into db1.projection_run (source_response_id,parser_revision,observed_shape) values ($1,$2,$3) returning projection_run_id",
    [sourceResponseId, workerRevision, jsonCandidate ? "MALFORMED_JSON" : "NON_JSON"]
  );
  const projectionId = inserted.rows[0].projection_run_id;
  let shape = jsonCandidate ? "MALFORMED_JSON" : "NON_JSON";
  let detail = null;
  let count = 0;
  if (jsonCandidate) {
    const first = whitespace(raw, 0);
    try {
      if (raw[first] === 0x5b) {
        shape = "ARRAY_OF_OBJECTS";
        let exceedsObjectLimit = false;
        for (const slice of topLevelObjects(raw)) {
          if (slice.raw.length > maxObjectBytes) {
            exceedsObjectLimit = true;
            break;
          }
        }
        if (exceedsObjectLimit) {
          shape = "OBJECT_LIMIT";
          detail = `at least one source object exceeds ${maxObjectBytes} bytes`;
        } else {
          let pending = [];
          for (const slice of topLevelObjects(raw)) {
            pending.push({ responseId: sourceResponseId, position: slice.position, sha: sha256(slice.raw), json: slice.raw.toString("utf8") });
            count += 1;
            if (pending.length === batchSize) {
              await client.query(objectInsert(pending));
              pending = [];
            }
          }
          if (pending.length) await client.query(objectInsert(pending));
        }
      } else if (raw[first] === 0x7b) {
        const value = JSON.parse(raw.toString("utf8"));
        if (sourceAvailabilityMessage(raw)) {
          shape = "SOURCE_MESSAGE";
          detail = "upstream availability message retained";
        } else if (raw.length > maxObjectBytes) {
          shape = "OBJECT_LIMIT";
          detail = `single source object exceeds ${maxObjectBytes} bytes`;
        } else {
          shape = "SINGLE_OBJECT";
          await client.query(objectInsert([{ responseId: sourceResponseId, position: 0, sha: sha256(raw), json: JSON.stringify(value) }]));
          count = 1;
        }
      } else {
        JSON.parse(raw.toString("utf8"));
        shape = "UNSUPPORTED_ARRAY";
        detail = "valid JSON but not an object or array of objects";
      }
    } catch (error) {
      shape = "MALFORMED_JSON";
      detail = String(error?.message ?? error).slice(0, 500);
    }
  }
  if (count) {
    await client.query(`insert into db1.field_observation (projection_run_id,json_path,json_type,occurrence_count,null_count)
      select $1,key,jsonb_typeof(value),count(*)::int,count(*) filter (where value='null'::jsonb)::int
        from db1.response_object cross join lateral jsonb_each(object_jsonb)
       where source_response_id=$2 group by key,jsonb_typeof(value)`, [projectionId, sourceResponseId]);
  }
  await client.query(
    "update db1.projection_run set finished_at=now(),result_status=$2,observed_shape=$3,object_count=$4,detail=$5 where projection_run_id=$1",
    [projectionId, shape === "OBJECT_LIMIT" || shape === "UNSUPPORTED_ARRAY" ? "LIMITED" : "PASS", shape, count, detail]
  );
  return projectionId;
}

async function saveProfile(client, sourceResponseId) {
  const profile = await client.query(`select projection.observed_shape,
      jsonb_build_object('shape', projection.observed_shape, 'fields', coalesce(fields.field_types, '{}'::jsonb)) as profile_jsonb
    from db1.projection_run projection
    left join lateral (
      select jsonb_object_agg(json_path, json_types order by json_path) as field_types
        from (
          select json_path, jsonb_agg(json_type order by json_type) as json_types
            from db1.field_observation
           where projection_run_id=projection.projection_run_id
           group by json_path
        ) grouped
    ) fields on true
   where projection.source_response_id=$1
   order by projection.started_at desc limit 1`, [sourceResponseId]);
  if (!profile.rowCount) throw new Error("projection profile is missing");
  await client.query("insert into db1.response_schema_profile (source_response_id,observed_shape,profile_jsonb) values ($1,$2,$3::jsonb) on conflict (source_response_id) do nothing", [sourceResponseId, profile.rows[0].observed_shape, JSON.stringify(profile.rows[0].profile_jsonb)]);
  return (await client.query("select profile_jsonb,profile_sha256 from db1.response_schema_profile where source_response_id=$1", [sourceResponseId])).rows[0];
}

async function recordDriftIfPresent(client, runId, unitKey, currentResponseId, currentProfile) {
  const prior = await client.query(`select response.source_response_id, profile.profile_jsonb, profile.profile_sha256
      from db1.source_response response
      join db1.response_schema_profile profile using(source_response_id)
     where response.response_unit_key=$1 and response.source_response_id <> $2
     order by response.request_finished_at desc, response.source_response_id desc
     limit 1`, [unitKey, currentResponseId]);
  if (!prior.rowCount) return false;
  const drift = diffProfiles(prior.rows[0].profile_jsonb, currentProfile.profile_jsonb);
  if (!drift.changed) return false;
  await client.query(`insert into db1.schema_drift_event
    (capture_run_id,response_unit_key,prior_source_response_id,current_source_response_id,prior_profile_sha256,current_profile_sha256,drift_jsonb)
    values ($1,$2,$3,$4,$5,$6,$7::jsonb) on conflict (current_source_response_id) do nothing`, [
    runId, unitKey, prior.rows[0].source_response_id, currentResponseId,
    prior.rows[0].profile_sha256, currentProfile.profile_sha256, JSON.stringify(drift)
  ]);
  return true;
}

async function capacity(client) {
  const database = await client.query("select pg_database_size(current_database())::bigint as size");
  try {
    const disk = await statfs(diskPath);
    return { databaseSizeBytes: Number(database.rows[0].size), availableDiskBytes: Number(disk.bavail) * Number(disk.bsize) };
  } catch {
    return { databaseSizeBytes: Number(database.rows[0].size), availableDiskBytes: null };
  }
}

function limits(cadence) {
  return {
    cadence,
    request_timeout_ms: requestTimeoutMs,
    run_timeout_ms: runTimeoutMs,
    max_body_bytes: maxBodyBytes,
    max_total_bytes: maxTotalBytes,
    max_object_bytes: maxObjectBytes,
    retry_count: 0,
    mode: "serial",
    source_forms_added: 0
  };
}

async function createRun(client, { registryHash, dueHash, dueUnits, cadence, lockResult, status = "RUNNING", detail = {} }) {
  const config = limits(cadence);
  const completed = status !== "RUNNING";
  const storedCadence = cadence === "hold" ? "SOURCE_FREE" : cadence.toUpperCase().replace("-", "_");
  const capture = await client.query(`insert into db1.capture_run
    (run_kind,worker_revision,deployed_package_revision,configuration_sha256,declared_limits,finished_at,result_status,summary_jsonb)
    values ('RECONCILIATION',$1,$2,$3,$4::jsonb,case when $5 then now() else null end,$6,$7::jsonb)
    returning capture_run_id`, [
    workerRevision, process.env.DB1_A6_DEPLOYED_PACKAGE_REVISION ?? "unrecorded", sha256(JSON.stringify(config)), JSON.stringify(config),
    completed, status, JSON.stringify(detail)
  ]);
  const runId = capture.rows[0].capture_run_id;
  await client.query(`insert into db1.assurance_run
    (capture_run_id,cadence,lock_result,registry_sha256,due_set_sha256,due_units,finished_at,detail)
    values ($1,$2,$3,$4,$5,$6,case when $7 then now() else null end,$8::jsonb)`, [
    runId, storedCadence, lockResult, registryHash, dueHash, dueUnits, completed, JSON.stringify(detail)
  ]);
  return runId;
}

async function finishRun(client, runId, state, status, stopReason = null) {
  const resources = await capacity(client);
  const peakRssBytes = process.resourceUsage().maxRSS * 1024;
  const summary = {
    due_units: state.dueUnits,
    attempted_units: state.attempted,
    transferred_bytes: state.transferredBytes,
    outcomes: state.outcomes,
    schema_drift_units: state.schemaDriftUnits,
    database_size_bytes: resources.databaseSizeBytes,
    available_disk_bytes: resources.availableDiskBytes,
    peak_rss_bytes: peakRssBytes,
    stop_reason: stopReason
  };
  await client.query(`update db1.capture_run set finished_at=now(),result_status=$2,attempted_units=$3,transferred_bytes=$4,
    stop_reason=$5,summary_jsonb=$6::jsonb where capture_run_id=$1`, [runId, status, state.attempted, state.transferredBytes, stopReason, JSON.stringify(summary)]);
  await client.query(`update db1.assurance_run set finished_at=now(),unchanged_units=$2,changed_units=$3,new_units=$4,
    upstream_condition_units=$5,local_failure_units=$6,schema_drift_units=$7,database_size_bytes=$8,
    available_disk_bytes=$9,peak_rss_bytes=$10,detail=$11::jsonb where capture_run_id=$1`, [
    runId, state.outcomes.UNCHANGED ?? 0, state.outcomes.CHANGED ?? 0, state.outcomes.NEW ?? 0,
    state.outcomes.UPSTREAM_CONDITION ?? 0, state.outcomes.LOCAL_FAILURE ?? 0, state.schemaDriftUnits,
    resources.databaseSizeBytes, resources.availableDiskBytes, peakRssBytes, JSON.stringify(summary)
  ]);
  return summary;
}

function errorCode(error) {
  const text = String(error?.message ?? error);
  if (text.includes("BODY_LIMIT")) return "BODY_LIMIT";
  if (text.includes("RUN_LIMIT")) return "RUN_LIMIT";
  if (error?.name === "TimeoutError") return "TIMEOUT";
  return "TRANSPORT_OR_LOCAL_ERROR";
}

const client = new Client({ connectionString: process.env.DB1_A6_DATABASE_URL, application_name: "cld-db1-a6-reconcile" });
let runId;
let advisoryLocked = false;
const state = { dueUnits: 0, attempted: 0, transferredBytes: 0, outcomes: {}, schemaDriftUnits: 0 };

try {
  await client.connect();
  const registry = await client.query(`select response_unit_key,request_method,request_locator,later_cadence
    from db1.response_unit where not is_synthetic and retired_at is null order by response_unit_key`);
  const forms = await client.query("select count(*)::int as count from db1.source_form where not is_synthetic");
  if (forms.rows[0].count !== 64 || registry.rowCount !== 117 || new Set(registry.rows.map((row) => row.request_locator)).size !== 117 || registry.rows.some((row) => !row.request_locator.startsWith("https://data.parliament.scot/api/"))) {
    throw new Error("approved 64-form / 117-unit registry check failed");
  }
  const registryHash = sha256(JSON.stringify(registry.rows));
  const due = requestedCadence === "daily" ? registry.rows.filter((unit) => unit.later_cadence === "DAILY")
    : requestedCadence === "weekly" ? registry.rows.filter((unit) => unit.later_cadence === "WEEKLY")
      : requestedCadence === "all" ? registry.rows : [];
  state.dueUnits = due.length;
  const dueHash = sha256(JSON.stringify(due));
  const lock = await client.query("select pg_try_advisory_lock($1) as acquired", [lockKey]);
  advisoryLocked = lock.rows[0].acquired;
  if (!advisoryLocked) {
    runId = await createRun(client, { registryHash, dueHash, dueUnits: due.length, cadence: requestedCadence, lockResult: "BLOCKED", status: "BLOCKED", detail: { reason: "postgres advisory lock already held", source_requests_made: 0 } });
    console.log(JSON.stringify({ status: "BLOCKED", capture_run_id: runId, reason: "postgres advisory lock already held", source_requests_made: 0 }));
    process.exitCode = 0;
  } else {
    runId = await createRun(client, { registryHash, dueHash, dueUnits: due.length, cadence: requestedCadence, lockResult: "ACQUIRED" });
    if (requestedCadence === "hold") {
      await delay(holdLockMs || 5000);
      const summary = await finishRun(client, runId, state, "PASS");
      console.log(JSON.stringify({ status: "PASS", capture_run_id: runId, source_requests_made: 0, ...summary }));
    } else if (requestedCadence === "source-free") {
      const summary = await finishRun(client, runId, state, "PASS");
      console.log(JSON.stringify({ status: "PASS", capture_run_id: runId, source_requests_made: 0, ...summary }));
    } else {
      const deadline = Date.now() + runTimeoutMs;
      let stopReason = null;
      for (let index = 0; index < due.length; index += 1) {
        const unit = due[index];
        if (Date.now() >= deadline) {
          stopReason = "RUN_LIMIT";
          break;
        }
        state.attempted += 1;
        const startedAt = new Date();
        try {
          const response = await fetch(unit.request_locator, {
            method: unit.request_method,
            headers: { accept: "application/json" },
            redirect: "manual",
            signal: AbortSignal.timeout(Math.min(requestTimeoutMs, deadline - Date.now()))
          });
          const raw = await readBody(response, state);
          const contentType = response.headers.get("content-type") ?? "application/octet-stream";
          const saved = await client.query(`insert into db1.source_response
            (response_unit_key,capture_run_id,request_started_at,request_finished_at,request_method,request_locator,response_status,response_headers,content_type,raw_body,body_byte_length)
            values ($1,$2,$3,now(),$4,$5,$6,$7::jsonb,$8,$9::bytea,octet_length($9::bytea))
            on conflict (response_unit_key,body_sha256) do nothing returning source_response_id`, [
            unit.response_unit_key, runId, startedAt, unit.request_method, unit.request_locator, response.status,
            JSON.stringify(headersForRecord(response.headers)), contentType, raw
          ]);
          let responseId = saved.rows[0]?.source_response_id;
          if (!responseId) {
            responseId = (await client.query("select source_response_id from db1.source_response where response_unit_key=$1 and body_sha256=$2", [unit.response_unit_key, sha256(raw)])).rows[0].source_response_id;
          }
          const projectionExists = (await client.query("select exists(select 1 from db1.projection_run where source_response_id=$1) as exists", [responseId])).rows[0].exists;
          if (saved.rowCount || !projectionExists) {
            await project(client, responseId, raw, contentType);
            const currentProfile = await saveProfile(client, responseId);
            if (await recordDriftIfPresent(client, runId, unit.response_unit_key, responseId, currentProfile)) state.schemaDriftUnits += 1;
          }
          const outcome = classifySourceResponse({ status: response.status, raw, inserted: saved.rowCount === 1 });
          await client.query(`insert into db1.response_verification
            (response_unit_key,capture_run_id,result_kind,source_response_id,upstream_status,condition_code,detail)
            values ($1,$2,$3,$4,$5,$6,$7)`, [
            unit.response_unit_key, runId, outcome.resultKind, responseId, response.status, outcome.conditionCode,
            outcome.resultKind === "UPSTREAM_CONDITION" ? "exact upstream condition retained or rechecked" : "raw bytes rechecked against retained PostgreSQL response"
          ]);
          state.outcomes[outcome.resultKind] = (state.outcomes[outcome.resultKind] ?? 0) + 1;
        } catch (error) {
          const code = errorCode(error);
          await client.query(`insert into db1.response_verification
            (response_unit_key,capture_run_id,result_kind,condition_code,detail)
            values ($1,$2,'LOCAL_FAILURE',$3,$4)`, [unit.response_unit_key, runId, code, String(error?.message ?? error).slice(0, 500)]);
          state.outcomes.LOCAL_FAILURE = (state.outcomes.LOCAL_FAILURE ?? 0) + 1;
          if (code === "BODY_LIMIT" || code === "RUN_LIMIT") {
            stopReason = code;
            break;
          }
        }
      }
      if (stopReason) {
        for (const unit of due.slice(state.attempted)) {
          await client.query("insert into db1.response_verification (response_unit_key,capture_run_id,result_kind,condition_code,detail) values ($1,$2,'NOT_ATTEMPTED',$3,$4)", [unit.response_unit_key, runId, stopReason, "not requested after controlled run limit"]);
          state.outcomes.NOT_ATTEMPTED = (state.outcomes.NOT_ATTEMPTED ?? 0) + 1;
        }
      }
      const summary = await finishRun(client, runId, state, stopReason ? "BLOCKED" : "PASS", stopReason);
      console.log(JSON.stringify({ status: stopReason ? "BLOCKED" : "PASS", capture_run_id: runId, ...summary }));
    }
  }
} catch (error) {
  if (runId) {
    await finishRun(client, runId, state, "BLOCKED", String(error?.message ?? error).slice(0, 500)).catch(() => undefined);
  }
  throw error;
} finally {
  if (advisoryLocked) await client.query("select pg_advisory_unlock($1)", [lockKey]).catch(() => undefined);
  await client.end();
}
