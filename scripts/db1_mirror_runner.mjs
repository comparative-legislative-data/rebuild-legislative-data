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
const YEAR_SETS = {
  "mqa-questions.year": range(2011, 2026),
  "committee-reports.year": range(1999, 2026),
  "plenary-reports.year": range(1999, 2026),
  "motion-votes.year": range(2011, 2026)
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
    .flatMap((route) => YEAR_SETS[route.id].map((year) => ({
      id: `${route.id}.${year}`,
      url: `${ORIGIN}${route.template.replace(":year", year)}`,
      cadence: year === "2026" ? "daily" : "weekly"
    })));
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
      error text
    );
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

async function fetchUnit(unit, rawRoot) {
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
    await pipeline(
      Readable.fromWeb(response.body),
      new Transform({
        transform(chunk, _encoding, callback) {
          bytes += chunk.length;
          if (bytes > MAX_RESPONSE_BYTES) callback(new Error("CAPTURE_LIMIT_EXCEEDED"));
          else {
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
    return {
      started,
      status: response.ok ? "RETAINED" : "UPSTREAM_AVAILABILITY_MESSAGE",
      httpStatus: response.status,
      contentType,
      bytes,
      digest,
      path,
      responseHeaders: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    await unlink(temp).catch(() => undefined);
    return { started, status: error instanceof Error && error.message === "CAPTURE_LIMIT_EXCEEDED" ? "CAPTURE_LIMIT_EXCEEDED" : "FAILED_TO_RETRIEVE", error: error instanceof Error ? error.message : String(error) };
  }
}

async function priorDigest(pool, unitId) {
  const result = await pool.query(
    `select sha256 from db1_observation where unit_id=$1 and sha256 is not null and status in ('RETAINED','UNCHANGED','CHANGED') order by finished_at desc limit 1`,
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
    `insert into db1_observation (id,run_id,unit_id,started_at,finished_at,status,http_status,content_type,byte_length,sha256,raw_path,request_method,request_headers,response_headers,error)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'GET','{}'::jsonb,$12::jsonb,$13)`,
    [randomUUID(), runId, unit.id, result.started, new Date(), status, result.httpStatus ?? null, result.contentType ?? null, result.bytes ?? null, result.digest ?? null, result.path ?? null, JSON.stringify(result.responseHeaders ?? null), result.error ?? null]
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

async function nextUnit(queue, active) {
  while (queue.length) {
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
  const results = [];
  await Promise.all(Array.from({ length: 3 }, async () => {
    for (;;) {
      const unit = await nextUnit(queue, active);
      if (!unit) return;
      const highVolume = isHighVolume(unit);
      if (highVolume) active.highVolume += 1;
      try {
        const result = await fetchUnit(unit, rawRoot);
        const status = await store(pool, runId, unit, result, mode);
        results.push({ unit: unit.id, status });
      } finally {
        if (highVolume) active.highVolume -= 1;
      }
    }
  }));
  await pool.query(`update db1_capture_run set finished_at=now() where id=$1`, [runId]);
  return { runId, expected: selectedUnits.length, results };
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
  } else {
    const mode = process.env.DB1_MODE === "reconcile" ? "reconcile" : "baseline";
    const cadence = process.env.DB1_CADENCE ?? "all";
    if (!["all", "daily", "weekly"].includes(cadence)) throw new Error("DB1_CADENCE must be all, daily or weekly");
    const selectedUnits = cadence === "all" ? units : units.filter((unit) => unit.cadence === cadence);
    console.log(JSON.stringify(await runCapture(pool, rawRoot, mode, selectedUnits)));
  }
} finally {
  await pool.end();
}
