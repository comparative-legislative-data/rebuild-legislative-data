import { createHash, randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { link, mkdir, readFile, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable, Transform } from "node:stream";
import { Pool } from "pg";
import { gbSctRoutes } from "../apps/api/dist/catalogue/gb-sct.js";

const ORIGIN = "https://data.parliament.scot";
const WORKER_VERSION = "db1-mirror-runner-r1";
const MAX_RESPONSE_BYTES = 512 * 1024 * 1024;
const MAX_RUN_BYTES = 16 * 1024 * 1024 * 1024;
const YEAR_SETS = {
  "mqa-questions.year": range(2011, 2026),
  "committee-reports.year": range(1999, 2026),
  "plenary-reports.year": range(1999, 2026),
  "motion-votes.year": range(2011, 2026)
};
const KNOWN_AVAILABILITY_PHRASES = {
  "committee-reports.year.2006": "presently unavailable"
};

function range(first, last) {
  return Array.from({ length: last - first + 1 }, (_, index) => String(first + index));
}

function isHighVolume(unit) {
  return unit.id.startsWith("committee-reports.year") || unit.id.startsWith("plenary-reports.year");
}

function matrix() {
  const fixed = gbSctRoutes
    .filter((route) => route.parameters.length === 0 || route.parameters.every((parameter) => parameter.grammar === "fixed_value"))
    .map((route) => ({ id: route.id, url: `${ORIGIN}${route.template}`, cadence: "daily" }));
  const annual = gbSctRoutes
    .filter((route) => route.parameters.length === 1 && route.parameters[0].name === "year")
    .flatMap((route) => YEAR_SETS[route.id].map((year) => {
      const id = `${route.id}.${year}`;
      return {
        id,
        url: `${ORIGIN}${route.template.replace(":year", year)}`,
        cadence: year === "2026" ? "daily" : "weekly",
        availabilityPhrase: KNOWN_AVAILABILITY_PHRASES[id] ?? null
      };
    }));
  return [...fixed, ...annual];
}

async function migrate(pool) {
  await pool.query(`
    create table if not exists db1_capture_run (
      id uuid primary key,
      mode text not null,
      started_at timestamptz not null,
      finished_at timestamptz,
      expected_units integer not null,
      worker_version text not null,
      configuration_revision text not null
    );
    create table if not exists db1_capture_unit (
      id text primary key,
      source_url text not null unique,
      cadence text not null check (cadence in ('daily','weekly'))
    );
    create table if not exists db1_observation (
      id uuid primary key,
      run_id uuid not null references db1_capture_run(id),
      unit_id text not null references db1_capture_unit(id),
      started_at timestamptz not null,
      finished_at timestamptz not null,
      status text not null,
      http_status integer,
      content_type text,
      byte_length bigint,
      sha256 text,
      raw_path text,
      request_method text not null default 'GET',
      request_headers jsonb not null default '{}'::jsonb,
      response_headers jsonb,
      source_condition text,
      error text
    );
    alter table db1_observation add column if not exists source_condition text;
    create index if not exists db1_observation_unit_finished_idx on db1_observation (unit_id, finished_at desc);
    create table if not exists db1_system_test (
      id uuid primary key,
      mode text not null,
      started_at timestamptz not null,
      finished_at timestamptz not null,
      passed boolean not null,
      byte_length bigint,
      sha256 text,
      raw_path text,
      detail text
    );
    create table if not exists db1_assurance_report (
      id uuid primary key,
      created_at timestamptz not null,
      report jsonb not null
    );
  `);
}

async function promoteTempFile(temp, destination, expectedDigest, expectedBytes) {
  await mkdir(dirname(destination), { recursive: true, mode: 0o750 });
  try {
    await link(temp, destination);
    await unlink(temp);
    return destination;
  } catch (error) {
    if (error?.code !== "EEXIST") {
      await unlink(temp).catch(() => undefined);
      throw error;
    }
    await unlink(temp).catch(() => undefined);
    const existing = await readFile(destination);
    const existingDigest = createHash("sha256").update(existing).digest("hex");
    if (existingDigest !== expectedDigest || existing.byteLength !== expectedBytes) {
      throw new Error("IMMUTABLE_ARCHIVE_CONFLICT");
    }
    return destination;
  }
}

async function persistBytes(rawRoot, bytes) {
  const digest = createHash("sha256").update(bytes).digest("hex");
  const temp = join(rawRoot, ".staging", `${randomUUID()}.part`);
  const destination = join(rawRoot, "sha256", digest);
  await mkdir(dirname(temp), { recursive: true, mode: 0o750 });
  await new Promise((resolve, reject) => {
    const output = createWriteStream(temp, { mode: 0o640 });
    output.on("error", reject);
    output.on("finish", resolve);
    output.end(bytes);
  });
  return { digest, bytes: bytes.byteLength, path: await promoteTempFile(temp, destination, digest, bytes.byteLength) };
}

async function fetchUnit(unit, rawRoot, budget) {
  const started = new Date();
  let temp;
  try {
    const response = await fetch(unit.url, { signal: AbortSignal.timeout(300000) });
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!response.body) {
      return { started, status: "FAILED_TO_RETRIEVE", httpStatus: response.status, contentType, error: "empty response body" };
    }
    temp = join(rawRoot, ".staging", `${randomUUID()}.part`);
    await mkdir(dirname(temp), { recursive: true, mode: 0o750 });
    const hash = createHash("sha256");
    let bytes = 0;
    const availabilityFragments = [];
    let availabilityBytes = 0;
    await pipeline(
      Readable.fromWeb(response.body),
      new Transform({
        transform(chunk, _encoding, callback) {
          bytes += chunk.length;
          if (bytes > MAX_RESPONSE_BYTES) callback(new Error("CAPTURE_LIMIT_EXCEEDED"));
          else if (budget.claimed + chunk.length > MAX_RUN_BYTES) {
            budget.exhausted = true;
            callback(new Error("RUN_CAPTURE_LIMIT_EXCEEDED"));
          }
          else {
            if (availabilityBytes < 131072) {
              const fragment = chunk.subarray(0, Math.min(chunk.length, 131072 - availabilityBytes));
              availabilityFragments.push(fragment);
              availabilityBytes += fragment.length;
            }
            budget.claimed += chunk.length;
            hash.update(chunk);
            callback(null, chunk);
          }
        }
      }),
      createWriteStream(temp, { mode: 0o640 })
    );
    const digest = hash.digest("hex");
    const path = await promoteTempFile(temp, join(rawRoot, "sha256", digest), digest, bytes);
    temp = undefined;
    const sourceCondition = unit.availabilityPhrase && Buffer.concat(availabilityFragments).toString("utf8").toLowerCase().includes(unit.availabilityPhrase)
      ? `SOURCE_BODY_MATCH:${unit.availabilityPhrase}`
      : response.ok ? null : `HTTP_STATUS:${response.status}`;
    return {
      started,
      status: sourceCondition ? "UPSTREAM_AVAILABILITY_MESSAGE" : "RETAINED",
      httpStatus: response.status,
      contentType,
      bytes,
      digest,
      path,
      sourceCondition,
      responseHeaders: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    await unlink(temp).catch(() => undefined);
    const message = error instanceof Error ? error.message : String(error);
    return { started, status: message === "CAPTURE_LIMIT_EXCEEDED" || message === "RUN_CAPTURE_LIMIT_EXCEEDED" ? "CAPTURE_LIMIT_EXCEEDED" : "FAILED_TO_RETRIEVE", error: message };
  }
}

async function priorDigest(pool, unitId) {
  const result = await pool.query(
    `select sha256 from db1_observation where unit_id=$1 and sha256 is not null and status in ('RETAINED','UNCHANGED','CHANGED','UPSTREAM_AVAILABILITY_MESSAGE') order by finished_at desc limit 1`,
    [unitId]
  );
  return result.rows[0]?.sha256 ?? null;
}

async function store(pool, runId, unit, result, mode) {
  let status = result.status;
  if (mode === "reconcile" && result.status === "RETAINED") {
    const previous = await priorDigest(pool, unit.id);
    status = previous === null ? "RETAINED" : previous === result.digest ? "UNCHANGED" : "CHANGED";
  }
  await pool.query(
    `insert into db1_observation (id,run_id,unit_id,started_at,finished_at,status,http_status,content_type,byte_length,sha256,raw_path,request_method,request_headers,response_headers,source_condition,error)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'GET','{}'::jsonb,$12::jsonb,$13,$14)`,
    [randomUUID(), runId, unit.id, result.started, new Date(), status, result.httpStatus ?? null, result.contentType ?? null, result.bytes ?? null, result.digest ?? null, result.path ?? null, JSON.stringify(result.responseHeaders ?? null), result.sourceCondition ?? null, result.error ?? null]
  );
  return status;
}

async function runSyntheticProof(pool, rawRoot) {
  const started = new Date();
  const payload = Buffer.from(JSON.stringify({ purpose: "DB1 source-free storage proof", generated_at: started.toISOString(), marker: randomUUID() }));
  try {
    const stored = await persistBytes(rawRoot, payload);
    const reRead = await readFile(stored.path);
    const verified = reRead.byteLength === stored.bytes && createHash("sha256").update(reRead).digest("hex") === stored.digest;
    await pool.query(
      `insert into db1_system_test (id,mode,started_at,finished_at,passed,byte_length,sha256,raw_path,detail) values ($1,'synthetic', $2, now(), $3, $4, $5, $6, $7)`,
      [randomUUID(), started, verified, stored.bytes, stored.digest, stored.path, verified ? "source-free database and immutable raw-storage proof passed" : "integrity reread failed"]
    );
    if (!verified) throw new Error("SYNTHETIC_INTEGRITY_FAILURE");
    return { passed: true, bytes: stored.bytes, sha256: stored.digest, rawPath: stored.path };
  } catch (error) {
    await pool.query(
      `insert into db1_system_test (id,mode,started_at,finished_at,passed,detail) values ($1,'synthetic',$2,now(),false,$3)`,
      [randomUUID(), started, error instanceof Error ? error.message : String(error)]
    );
    throw error;
  }
}

async function classifyKnownConditions(pool) {
  const outcomes = [];
  for (const unit of units.filter((candidate) => candidate.availabilityPhrase)) {
    const result = await pool.query(
      `select o.id, o.raw_path, o.status from db1_observation o where o.unit_id=$1 order by o.finished_at desc limit 1`,
      [unit.id]
    );
    const observation = result.rows[0];
    if (!observation?.raw_path) {
      outcomes.push({ unit: unit.id, status: "NO_RAW_RESPONSE" });
      continue;
    }
    const raw = await readFile(observation.raw_path);
    const matched = raw.toString("utf8").toLowerCase().includes(unit.availabilityPhrase);
    if (matched) {
      await pool.query(
        `update db1_observation set status='UPSTREAM_AVAILABILITY_MESSAGE', source_condition=$1 where id=$2`,
        [`SOURCE_BODY_MATCH:${unit.availabilityPhrase}`, observation.id]
      );
    }
    outcomes.push({ unit: unit.id, status: matched ? "UPSTREAM_AVAILABILITY_MESSAGE" : observation.status });
  }
  return outcomes;
}

async function buildAssuranceReport(pool) {
  const baseline = await pool.query(`select id, started_at, finished_at, expected_units from db1_capture_run where mode='baseline' and finished_at is not null order by finished_at desc limit 1`);
  const fullReconciliation = await pool.query(`select id, started_at, finished_at, expected_units from db1_capture_run where mode='reconcile' and expected_units=117 and finished_at is not null order by finished_at desc limit 1`);
  const targetedDiagnostic = await pool.query(`select id, started_at, finished_at, expected_units from db1_capture_run where mode='reconcile' and expected_units<117 and finished_at is not null order by finished_at desc limit 1`);
  if (!baseline.rows[0] || !fullReconciliation.rows[0]) throw new Error("BASELINE_AND_FULL_RECONCILIATION_REQUIRED");
  const fullRun = fullReconciliation.rows[0];
  const fullStatusCounts = Object.fromEntries(await pool.query(
    `select status, count(*)::integer as count from db1_observation where run_id=$1 group by status order by status`,
    [fullRun.id]
  ).then((result) => result.rows.map((row) => [row.status, row.count])));
  const observations = await pool.query(
    `select o.unit_id, o.status, o.http_status, o.source_condition, o.sha256, o.byte_length, o.raw_path, u.source_url, u.cadence
     from (
       select distinct on (o.unit_id) o.*
       from db1_observation o
       join db1_capture_run r on r.id=o.run_id
       where r.finished_at is not null
       order by o.unit_id, o.finished_at desc
     ) o
     join db1_capture_unit u on u.id=o.unit_id
     order by o.unit_id`
  );
  const statusCounts = Object.fromEntries(await pool.query(
    `select current.status, count(*)::integer as count
     from (
       select distinct on (o.unit_id) o.status
       from db1_observation o
       join db1_capture_run r on r.id=o.run_id
       where r.finished_at is not null
       order by o.unit_id, o.finished_at desc
     ) current
     group by current.status
     order by current.status`
  ).then((result) => result.rows.map((row) => [row.status, row.count])));
  let integrityFailures = 0;
  for (const observation of observations.rows.filter((row) => row.sha256)) {
    try {
      const raw = await readFile(observation.raw_path);
      if (raw.byteLength !== Number(observation.byte_length) || createHash("sha256").update(raw).digest("hex") !== observation.sha256) integrityFailures += 1;
    } catch {
      integrityFailures += 1;
    }
  }
  const report = {
    report_version: 2,
    generated_at: new Date().toISOString(),
    scope: { route_forms: 64, response_units: 117, daily_units: 33, weekly_units: 84 },
    baseline: baseline.rows[0],
    full_reconciliation: { ...fullRun, statuses: fullStatusCounts },
    latest_targeted_diagnostic: targetedDiagnostic.rows[0] ?? null,
    current_statuses: statusCounts,
    raw_integrity: { checked: observations.rows.filter((row) => row.sha256).length, failures: integrityFailures },
    source_conditions: observations.rows
      .filter((row) => row.status === "UPSTREAM_AVAILABILITY_MESSAGE")
      .map((row) => ({ unit_id: row.unit_id, source_url: row.source_url, http_status: row.http_status, source_condition: row.source_condition, cadence: row.cadence }))
  };
  await pool.query(`insert into db1_assurance_report (id,created_at,report) values ($1,now(),$2::jsonb)`, [randomUUID(), JSON.stringify(report)]);
  return report;
}

async function nextUnit(queue, active, budget) {
  while (queue.length) {
    if (budget.exhausted) return null;
    const index = queue.findIndex((unit) => !isHighVolume(unit) || active.highVolume < 2);
    if (index >= 0) return queue.splice(index, 1)[0];
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return null;
}

async function runCapture(pool, rawRoot, mode, selectedUnits) {
  for (const unit of selectedUnits) {
    await pool.query(
      `insert into db1_capture_unit (id,source_url,cadence) values ($1,$2,$3)
       on conflict (id) do update set source_url=excluded.source_url,cadence=excluded.cadence`,
      [unit.id, unit.url, unit.cadence]
    );
  }
  const runId = randomUUID();
  await pool.query(
    `insert into db1_capture_run (id,mode,started_at,expected_units,worker_version,configuration_revision) values ($1,$2,now(),$3,$4,$5)`,
    [runId, mode, selectedUnits.length, WORKER_VERSION, "DEC-0114-117-unit-r1"]
  );
  const queue = [...selectedUnits];
  const active = { highVolume: 0 };
  const budget = { claimed: 0, exhausted: false };
  const results = [];
  await Promise.all(Array.from({ length: 3 }, async () => {
    for (;;) {
      const unit = await nextUnit(queue, active, budget);
      if (!unit) return;
      const highVolume = isHighVolume(unit);
      if (highVolume) active.highVolume += 1;
      try {
        const result = await fetchUnit(unit, rawRoot, budget);
        const status = await store(pool, runId, unit, result, mode);
        results.push({ unit: unit.id, status });
      } finally {
        if (highVolume) active.highVolume -= 1;
      }
    }
  }));
  await pool.query(`update db1_capture_run set finished_at=now() where id=$1`, [runId]);
  return { runId, expected: selectedUnits.length, claimedBytes: budget.claimed, limitReached: budget.exhausted, results };
}

const units = matrix();
if (units.length !== 117 || new Set(units.map((unit) => unit.id)).size !== 117) {
  throw new Error("DB1 matrix must contain exactly 117 unique units");
}
if (process.env.DB1_MODE === "matrix") {
  console.log(JSON.stringify({ units, count: units.length }, null, 2));
  process.exit();
}
const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
const pool = new Pool({ connectionString: databaseUrl });
try {
  await migrate(pool);
  if (process.env.DB1_MODE === "synthetic") {
    console.log(JSON.stringify({ mode: "synthetic", ...(await runSyntheticProof(pool, rawRoot)) }));
  } else if (process.env.DB1_MODE === "classify-known-conditions") {
    console.log(JSON.stringify({ mode: "classify-known-conditions", outcomes: await classifyKnownConditions(pool) }));
  } else if (process.env.DB1_MODE === "assurance") {
    console.log(JSON.stringify({ mode: "assurance", report: await buildAssuranceReport(pool) }));
  } else {
    const mode = process.env.DB1_MODE === "reconcile" ? "reconcile" : "baseline";
    const cadence = process.env.DB1_CADENCE ?? "all";
    if (!["all", "daily", "weekly"].includes(cadence)) throw new Error("DB1_CADENCE must be all, daily or weekly");
    const requestedIds = process.env.DB1_UNIT_IDS?.split(",").filter(Boolean) ?? [];
    const unknownIds = requestedIds.filter((id) => !units.some((unit) => unit.id === id));
    if (unknownIds.length) throw new Error(`DB1_UNIT_IDS includes unapproved units: ${unknownIds.join(",")}`);
    const selectedUnits = requestedIds.length
      ? units.filter((unit) => requestedIds.includes(unit.id))
      : cadence === "all" ? units : units.filter((unit) => unit.cadence === cadence);
    console.log(JSON.stringify(await runCapture(pool, rawRoot, mode, selectedUnits)));
  }
} finally {
  await pool.end();
}
