import { createHash, randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, rename, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable, Transform } from "node:stream";
import { Pool } from "pg";
import { gbSctRoutes } from "../apps/api/dist/catalogue/gb-sct.js";

const ORIGIN = "https://data.parliament.scot";
const YEAR_SETS = {
  "mqa-questions.year": range(2011, 2026),
  "committee-reports.year": range(1999, 2026),
  "plenary-reports.year": range(1999, 2026),
  "motion-votes.year": range(2011, 2026)
};

function range(first, last) { return Array.from({ length: last - first + 1 }, (_, index) => String(first + index)); }
function matrix() {
  const fixed = gbSctRoutes.filter(route => route.parameters.length === 0 || route.parameters.every(parameter => parameter.grammar === "fixed_value")).map(route => ({ id: route.id, url: `${ORIGIN}${route.template}`, cadence: "daily" }));
  const annual = gbSctRoutes.filter(route => route.parameters.length === 1 && route.parameters[0].name === "year").flatMap(route => YEAR_SETS[route.id].map(year => ({ id: `${route.id}.${year}`, url: `${ORIGIN}${route.template.replace(":year", year)}`, cadence: year === "2026" ? "daily" : "weekly" })));
  return [...fixed, ...annual];
}

async function migrate(pool) {
  await pool.query(`create table if not exists db1_capture_run (id uuid primary key, mode text not null, started_at timestamptz not null, finished_at timestamptz, expected_units integer not null);
    create table if not exists db1_capture_unit (id text primary key, source_url text not null unique, cadence text not null check (cadence in ('daily','weekly')));
    create table if not exists db1_observation (id uuid primary key, run_id uuid not null references db1_capture_run(id), unit_id text not null references db1_capture_unit(id), started_at timestamptz not null, finished_at timestamptz not null, status text not null, http_status integer, content_type text, byte_length bigint, sha256 text, raw_path text, error text);`);
}

async function store(pool, runId, unit, result) {
  await pool.query(`insert into db1_observation (id,run_id,unit_id,started_at,finished_at,status,http_status,content_type,byte_length,sha256,raw_path,error) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [randomUUID(), runId, unit.id, result.started, new Date(), result.status, result.httpStatus ?? null, result.contentType ?? null, result.bytes ?? null, result.digest ?? null, result.path ?? null, result.error ?? null]);
}

async function fetchUnit(unit, rawRoot) {
  const started = new Date();
  try {
    const response = await fetch(unit.url, { signal: AbortSignal.timeout(300000) });
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!response.body) return { started, status: "FAILED_TO_RETRIEVE", httpStatus: response.status, contentType, error: "empty response body" };
    const temp = join(rawRoot, ".staging", `${randomUUID()}.part`);
    await mkdir(dirname(temp), { recursive: true, mode: 0o750 });
    const hash = createHash("sha256"); let bytes = 0;
    await pipeline(Readable.fromWeb(response.body), new Transform({ transform(chunk, _encoding, callback) { bytes += chunk.length; if (bytes > 536870912) callback(new Error("CAPTURE_LIMIT_EXCEEDED")); else { hash.update(chunk); callback(null, chunk); } } }), createWriteStream(temp, { mode: 0o640 }));
    const digest = hash.digest("hex"); const path = join(rawRoot, "sha256", `${digest}.json`);
    await mkdir(dirname(path), { recursive: true, mode: 0o750 });
    try { await rename(temp, path); } catch (error) { await unlink(temp).catch(() => undefined); if (error?.code !== "EEXIST") throw error; }
    const status = response.ok ? "RETAINED" : "UPSTREAM_AVAILABILITY_MESSAGE";
    return { started, status, httpStatus: response.status, contentType, bytes, digest, path };
  } catch (error) { return { started, status: "FAILED_TO_RETRIEVE", error: error instanceof Error ? error.message : String(error) }; }
}

const units = matrix();
if (units.length !== 117 || new Set(units.map(unit => unit.id)).size !== 117) throw new Error("DB1 matrix must contain exactly 117 unique units");
if (process.env.DB1_MODE === "matrix") { console.log(JSON.stringify({ units, count: units.length }, null, 2)); process.exit(); }
const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
const pool = new Pool({ connectionString: databaseUrl });
await migrate(pool);
for (const unit of units) await pool.query(`insert into db1_capture_unit (id,source_url,cadence) values ($1,$2,$3) on conflict (id) do update set source_url=excluded.source_url,cadence=excluded.cadence`, [unit.id, unit.url, unit.cadence]);
const runId = randomUUID(); await pool.query(`insert into db1_capture_run (id,mode,started_at,expected_units) values ($1,$2,now(),$3)`, [runId, process.env.DB1_MODE ?? "baseline", units.length]);
const results = []; const queue = [...units];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) { const unit = queue.shift(); const result = await fetchUnit(unit, rawRoot); await store(pool, runId, unit, result); results.push({ unit: unit.id, status: result.status }); }
}));
await pool.query(`update db1_capture_run set finished_at=now() where id=$1`, [runId]);
await pool.end(); console.log(JSON.stringify({ runId, results }));
