import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { Pool, type PoolClient } from "pg";

export const DB1_SYNTHETIC_ORIGIN = "SYNTHETIC_TEST_ONLY";
export const DB1_SOURCE_ORIGIN = "SOURCE_CAPTURE";
export const D2_BILL_TYPES_URL = "https://data.parliament.scot/api/billtypes";
export const D2_MAX_BYTES = 1_048_576;
export const D3_BILL_TYPES_MANIFEST_ID = "1b13985f-1efb-48c4-ae56-caafc4d113df";
export const D3_BILL_TYPES_RAW_DIGEST = "fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b";
export const D3_BILL_TYPES_ROUTE_ID = "gb-sct.bill-types.collection";
export const D3_BILL_TYPES_PROJECTION = "gb_sct_bill_types_d2_v1";
const D1_MIGRATION_ID = "001_foundation";
const D2_MIGRATION_ID = "002_first_source_batch";
const D3_MIGRATION_ID = "003_first_source_projection";

export interface RawObjectReference { digest: string; byteLength: number; relativePath: string; }
export interface Db1FoundationOptions { databaseUrl: string; rawRoot: string; migrationRole?: string; }
export interface Db1FoundationResult {
  origin: typeof DB1_SYNTHETIC_ORIGIN;
  manifestId: string;
  projectionBuildId: string;
  raw: RawObjectReference;
  projectedRecords: number;
  rejectedRecords: number;
}
export interface D2TransportResult { bytes: Buffer; contentType: string; status: number; }
export interface D2CaptureOptions extends Db1FoundationOptions { request?: typeof fetch; now?: () => Date; }
export interface D2CaptureResult { manifestId: string; runId: string; raw: RawObjectReference; status: number; contentType: string; }
export interface D3ProjectionOptions extends Db1FoundationOptions { codeRevision: string; now?: () => Date; }
export interface D3ProjectionResult { manifestId: string; projectionBuildId: string; raw: RawObjectReference; projectedRecords: number; rejectedRecords: number; }

class D2CaptureFailure extends Error {
  constructor(readonly code: string) { super(code); }
}

function sha256(bytes: Buffer): string { return createHash("sha256").update(bytes).digest("hex"); }
function insideRoot(root: string, target: string): boolean { return target === root || target.startsWith(`${root}${sep}`); }
function quoteIdentifier(identifier: string): string {
  if (!/^[a-z_][a-z0-9_]*$/i.test(identifier)) throw new Error("invalid DB1 migration role");
  return `"${identifier}"`;
}

export function createSyntheticFixture(): Buffer {
  return Buffer.from(`${JSON.stringify({ origin: DB1_SYNTHETIC_ORIGIN, records: [{ fixture_key: "valid-alpha", label: "synthetic alpha" }, "synthetic malformed record"] })}\n`, "utf8");
}

async function persistRawObject(rawRoot: string, bytes: Buffer): Promise<{ raw: RawObjectReference; created: boolean }> {
  const root = resolve(rawRoot);
  const digest = sha256(bytes);
  const target = resolve(root, "sha256", `${digest}.json`);
  if (!insideRoot(root, target)) throw new Error("DB1 raw-object path escapes configured root");
  await mkdir(dirname(target), { recursive: true, mode: 0o750 });
  let created = false;
  try {
    const handle = await open(target, "wx", 0o640);
    try { await handle.writeFile(bytes); } finally { await handle.close(); }
    created = true;
  } catch (error: unknown) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") throw error;
    const existing = await readFile(target);
    if (sha256(existing) !== digest) throw new Error("existing DB1 raw object does not match its digest path");
  }
  return { raw: { digest, byteLength: bytes.byteLength, relativePath: relative(root, target) }, created };
}

export async function persistSyntheticRawObject(rawRoot: string, bytes: Buffer): Promise<RawObjectReference> {
  return (await persistRawObject(rawRoot, bytes)).raw;
}

async function migrate(client: PoolClient, migrationRole: string): Promise<void> {
  const role = quoteIdentifier(migrationRole);
  await client.query(`create schema if not exists db1 authorization ${role}`);
  await client.query("create table if not exists db1.schema_migrations (id text primary key, applied_at timestamptz not null default now())");
  const d1 = await client.query("select 1 from db1.schema_migrations where id = $1", [D1_MIGRATION_ID]);
  if (!d1.rowCount) {
    await client.query(`create table db1.source_routes (id text primary key, origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'), created_at timestamptz not null default now())`);
    await client.query(`create table db1.capture_runs (id uuid primary key, source_route_id text not null references db1.source_routes(id), origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'), started_at timestamptz not null, finished_at timestamptz not null, status text not null check (status in ('SUCCEEDED', 'FAILED')))`);
    await client.query(`create table db1.raw_objects (digest char(64) primary key, origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'), relative_path text not null unique, byte_length bigint not null check (byte_length >= 0), content_type text not null, created_at timestamptz not null default now())`);
    await client.query(`create table db1.manifest_entries (id uuid primary key, capture_run_id uuid not null references db1.capture_runs(id), raw_digest char(64) not null references db1.raw_objects(digest), origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'), content_type text not null, byte_length bigint not null check (byte_length >= 0), status text not null check (status = 'SUCCEEDED'), retrieved_at timestamptz not null)`);
    await client.query(`create table db1.projection_builds (id uuid primary key, manifest_id uuid not null references db1.manifest_entries(id), origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'), schema_version text not null, code_revision text not null, integrity_status text not null check (integrity_status = 'PASS'), projected_records integer not null default 0, rejected_records integer not null default 0, created_at timestamptz not null default now())`);
    await client.query("create table db1.projection_records (id uuid primary key, projection_build_id uuid not null references db1.projection_builds(id), manifest_id uuid not null references db1.manifest_entries(id), source_position integer not null check (source_position >= 0), preserved_record jsonb not null, unique (projection_build_id, source_position))");
    await client.query("create table db1.projection_rejections (id uuid primary key, projection_build_id uuid not null references db1.projection_builds(id), manifest_id uuid not null references db1.manifest_entries(id), source_position integer not null check (source_position >= 0), reason_code text not null, unique (projection_build_id, source_position))");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D1_MIGRATION_ID]);
  }
  const d2 = await client.query("select 1 from db1.schema_migrations where id = $1", [D2_MIGRATION_ID]);
  if (!d2.rowCount) {
    for (const name of ["source_routes_origin_class_check", "capture_runs_origin_class_check", "capture_runs_status_check", "raw_objects_origin_class_check", "manifest_entries_origin_class_check", "manifest_entries_status_check"]) {
      await client.query(`alter table db1.${name.startsWith("source") ? "source_routes" : name.startsWith("capture") ? "capture_runs" : name.startsWith("raw") ? "raw_objects" : "manifest_entries"} drop constraint if exists ${quoteIdentifier(name)}`);
    }
    await client.query("alter table db1.capture_runs alter column finished_at drop not null");
    await client.query("alter table db1.manifest_entries alter column raw_digest drop not null");
    await client.query("alter table db1.manifest_entries alter column content_type drop not null");
    await client.query("alter table db1.manifest_entries alter column byte_length drop not null");
    await client.query("alter table db1.source_routes add column if not exists source_path text");
    await client.query("alter table db1.source_routes add column if not exists handling_class text");
    await client.query("alter table db1.manifest_entries add column if not exists failure_code text");
    await client.query(`alter table db1.source_routes add constraint source_routes_origin_class_check check (origin_class in ('${DB1_SYNTHETIC_ORIGIN}', '${DB1_SOURCE_ORIGIN}'))`);
    await client.query(`alter table db1.capture_runs add constraint capture_runs_origin_class_check check (origin_class in ('${DB1_SYNTHETIC_ORIGIN}', '${DB1_SOURCE_ORIGIN}'))`);
    await client.query("alter table db1.capture_runs add constraint capture_runs_status_check check (status in ('IN_PROGRESS', 'SUCCEEDED', 'FAILED'))");
    await client.query(`alter table db1.raw_objects add constraint raw_objects_origin_class_check check (origin_class in ('${DB1_SYNTHETIC_ORIGIN}', '${DB1_SOURCE_ORIGIN}'))`);
    await client.query(`alter table db1.manifest_entries add constraint manifest_entries_origin_class_check check (origin_class in ('${DB1_SYNTHETIC_ORIGIN}', '${DB1_SOURCE_ORIGIN}'))`);
    await client.query("alter table db1.manifest_entries add constraint manifest_entries_status_check check (status in ('SUCCEEDED', 'FAILED'))");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D2_MIGRATION_ID]);
  }
  const d3 = await client.query("select 1 from db1.schema_migrations where id = $1", [D3_MIGRATION_ID]);
  if (!d3.rowCount) {
    await client.query("alter table db1.projection_builds drop constraint if exists projection_builds_origin_class_check");
    await client.query("alter table db1.projection_builds add column if not exists projection_name text");
    await client.query("update db1.projection_builds set projection_name = coalesce(projection_name, schema_version)");
    await client.query("alter table db1.projection_builds alter column projection_name set not null");
    await client.query(`alter table db1.projection_builds add constraint projection_builds_origin_class_check check (origin_class in ('${DB1_SYNTHETIC_ORIGIN}', '${DB1_SOURCE_ORIGIN}'))`);
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D3_MIGRATION_ID]);
  }
}

async function withDb<T>(options: Db1FoundationOptions, action: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: options.databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(`set role ${quoteIdentifier(options.migrationRole ?? "cld_gb_sct_migrate")}`);
    await migrate(client, options.migrationRole ?? "cld_gb_sct_migrate");
    const result = await action(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export async function runSyntheticFoundation(options: Db1FoundationOptions): Promise<Db1FoundationResult> {
  const bytes = createSyntheticFixture();
  const raw = await persistSyntheticRawObject(options.rawRoot, bytes);
  return withDb(options, async (client) => {
    const now = new Date(); const routeId = "synthetic.foundation.v1"; const runId = randomUUID(); const manifestId = randomUUID(); const buildId = randomUUID();
    await client.query("insert into db1.source_routes (id, origin_class) values ($1, $2) on conflict (id) do nothing", [routeId, DB1_SYNTHETIC_ORIGIN]);
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, finished_at, status) values ($1, $2, $3, $4, $4, 'SUCCEEDED')", [runId, routeId, DB1_SYNTHETIC_ORIGIN, now]);
    await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, 'application/json') on conflict (digest) do nothing", [raw.digest, DB1_SYNTHETIC_ORIGIN, raw.relativePath, raw.byteLength]);
    await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, 'application/json', $5, 'SUCCEEDED', $6)", [manifestId, runId, raw.digest, DB1_SYNTHETIC_ORIGIN, raw.byteLength, now]);
    await client.query("insert into db1.projection_builds (id, manifest_id, origin_class, projection_name, schema_version, code_revision, integrity_status) values ($1, $2, $3, 'synthetic.foundation.v1', 'synthetic-foundation-v1', 'D1', 'PASS')", [buildId, manifestId, DB1_SYNTHETIC_ORIGIN]);
    const fixture: unknown = JSON.parse(bytes.toString("utf8"));
    if (!fixture || typeof fixture !== "object" || !("records" in fixture) || !Array.isArray(fixture.records)) throw new Error("synthetic fixture contract failed");
    let projectedRecords = 0; let rejectedRecords = 0;
    for (const [sourcePosition, record] of fixture.records.entries()) {
      if (record && typeof record === "object" && !Array.isArray(record)) { await client.query("insert into db1.projection_records (id, projection_build_id, manifest_id, source_position, preserved_record) values ($1, $2, $3, $4, $5)", [randomUUID(), buildId, manifestId, sourcePosition, record]); projectedRecords += 1; }
      else { await client.query("insert into db1.projection_rejections (id, projection_build_id, manifest_id, source_position, reason_code) values ($1, $2, $3, $4, 'NOT_AN_OBJECT')", [randomUUID(), buildId, manifestId, sourcePosition]); rejectedRecords += 1; }
    }
    await client.query("update db1.projection_builds set projected_records = $2, rejected_records = $3 where id = $1", [buildId, projectedRecords, rejectedRecords]);
    return { origin: DB1_SYNTHETIC_ORIGIN, manifestId, projectionBuildId: buildId, raw, projectedRecords, rejectedRecords };
  });
}

export async function fetchD2BillTypes(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D2_BILL_TYPES_URL, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(20_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D2_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D2_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

function failureCode(error: unknown): string { return error instanceof D2CaptureFailure ? error.code : "TRANSPORT_FAILURE"; }

export async function runD2BillTypesCapture(options: D2CaptureOptions): Promise<D2CaptureResult> {
  const now = options.now ?? (() => new Date()); const routeId = "gb-sct.bill-types.collection"; const runId = randomUUID();
  await withDb(options, async (client) => {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [routeId, DB1_SOURCE_ORIGIN, "/api/billtypes"]);
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, routeId, DB1_SOURCE_ORIGIN, now()]);
  });
  let captured: D2TransportResult;
  try { captured = await fetchD2BillTypes(options.request); }
  catch (error) {
    await withDb(options, async (client) => {
      await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), failureCode(error)]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
    });
    throw error;
  }
  const stored = await persistRawObject(options.rawRoot, captured.bytes);
  const manifestId = randomUUID();
  try {
    await withDb(options, async (client) => {
      await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
      await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
    });
  } catch (error) {
    if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined);
    throw error;
  }
  return { manifestId, runId, raw: stored.raw, status: captured.status, contentType: captured.contentType };
}

export async function runD3BillTypesProjection(options: D3ProjectionOptions): Promise<D3ProjectionResult> {
  const now = options.now ?? (() => new Date());
  return withDb(options, async (client) => {
    const source = await client.query<{
      manifest_id: string; raw_digest: string; byte_length: number; relative_path: string; content_type: string; route_id: string; origin_class: string; handling_class: string | null;
    }>(
      "select m.id as manifest_id, m.raw_digest, m.byte_length, r.relative_path, m.content_type, s.id as route_id, m.origin_class, s.handling_class from db1.manifest_entries m join db1.raw_objects r on r.digest = m.raw_digest join db1.capture_runs c on c.id = m.capture_run_id join db1.source_routes s on s.id = c.source_route_id where m.id = $1 and m.status = 'SUCCEEDED'",
      [D3_BILL_TYPES_MANIFEST_ID]
    );
    const item = source.rows[0];
    if (!item || item.manifest_id !== D3_BILL_TYPES_MANIFEST_ID || item.raw_digest !== D3_BILL_TYPES_RAW_DIGEST || item.route_id !== D3_BILL_TYPES_ROUTE_ID || item.origin_class !== DB1_SOURCE_ORIGIN || item.handling_class !== "RESTRICTED_PROJECT") {
      throw new Error("D3 input manifest identity does not match DEC-0077");
    }
    const root = resolve(options.rawRoot);
    const target = resolve(root, item.relative_path);
    if (!insideRoot(root, target)) throw new Error("D3 raw-object path escapes configured root");
    const bytes = await readFile(target);
    if (bytes.byteLength !== Number(item.byte_length) || sha256(bytes) !== item.raw_digest) throw new Error("D3 raw-object integrity check failed");
    let parsed: unknown;
    try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("D3 raw object is not valid JSON"); }
    if (!Array.isArray(parsed)) throw new Error("D3 raw object is not a JSON array");

    const buildId = randomUUID();
    await client.query(
      "insert into db1.projection_builds (id, manifest_id, origin_class, projection_name, schema_version, code_revision, integrity_status) values ($1, $2, $3, $4, 'd3-loss-aware-v1', $5, 'PASS')",
      [buildId, D3_BILL_TYPES_MANIFEST_ID, DB1_SOURCE_ORIGIN, D3_BILL_TYPES_PROJECTION, options.codeRevision]
    );
    let projectedRecords = 0; let rejectedRecords = 0;
    for (const [sourcePosition, record] of parsed.entries()) {
      if (record && typeof record === "object" && !Array.isArray(record)) {
        await client.query("insert into db1.projection_records (id, projection_build_id, manifest_id, source_position, preserved_record) values ($1, $2, $3, $4, $5)", [randomUUID(), buildId, D3_BILL_TYPES_MANIFEST_ID, sourcePosition, record]);
        projectedRecords += 1;
      } else {
        await client.query("insert into db1.projection_rejections (id, projection_build_id, manifest_id, source_position, reason_code) values ($1, $2, $3, $4, 'NOT_AN_OBJECT')", [randomUUID(), buildId, D3_BILL_TYPES_MANIFEST_ID, sourcePosition]);
        rejectedRecords += 1;
      }
    }
    await client.query("update db1.projection_builds set projected_records = $2, rejected_records = $3 where id = $1", [buildId, projectedRecords, rejectedRecords]);
    return {
      manifestId: D3_BILL_TYPES_MANIFEST_ID,
      projectionBuildId: buildId,
      raw: { digest: item.raw_digest, byteLength: Number(item.byte_length), relativePath: item.relative_path },
      projectedRecords,
      rejectedRecords
    };
  });
}
