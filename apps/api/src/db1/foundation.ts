import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { Pool, type PoolClient } from "pg";

export const DB1_SYNTHETIC_ORIGIN = "SYNTHETIC_TEST_ONLY";
const MIGRATION_ID = "001_foundation";

export interface RawObjectReference {
  digest: string;
  byteLength: number;
  relativePath: string;
}

export interface Db1FoundationOptions {
  databaseUrl: string;
  rawRoot: string;
  migrationRole?: string;
}

export interface Db1FoundationResult {
  origin: typeof DB1_SYNTHETIC_ORIGIN;
  manifestId: string;
  projectionBuildId: string;
  raw: RawObjectReference;
  projectedRecords: number;
  rejectedRecords: number;
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function insideRoot(root: string, target: string): boolean {
  return target === root || target.startsWith(`${root}${sep}`);
}

function quoteIdentifier(identifier: string): string {
  if (!/^[a-z_][a-z0-9_]*$/i.test(identifier)) throw new Error("invalid DB1 migration role");
  return `"${identifier}"`;
}

export function createSyntheticFixture(): Buffer {
  return Buffer.from(`${JSON.stringify({
    origin: DB1_SYNTHETIC_ORIGIN,
    records: [
      { fixture_key: "valid-alpha", label: "synthetic alpha" },
      "synthetic malformed record"
    ]
  })}\n`, "utf8");
}

export async function persistSyntheticRawObject(rawRoot: string, bytes: Buffer): Promise<RawObjectReference> {
  const root = resolve(rawRoot);
  const digest = sha256(bytes);
  const target = resolve(root, "sha256", `${digest}.json`);
  if (!insideRoot(root, target)) throw new Error("DB1 raw-object path escapes configured root");
  await mkdir(dirname(target), { recursive: true, mode: 0o750 });

  try {
    const handle = await open(target, "wx", 0o640);
    try {
      await handle.writeFile(bytes);
    } finally {
      await handle.close();
    }
  } catch (error: unknown) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") throw error;
    const existing = await readFile(target);
    if (sha256(existing) !== digest) throw new Error("existing DB1 raw object does not match its digest path");
  }

  return { digest, byteLength: bytes.byteLength, relativePath: relative(root, target) };
}

async function migrate(client: PoolClient, migrationRole: string): Promise<void> {
  const role = quoteIdentifier(migrationRole);
  await client.query(`create schema if not exists db1 authorization ${role}`);
  await client.query(`create table if not exists db1.schema_migrations (
    id text primary key,
    applied_at timestamptz not null default now()
  )`);
  const existing = await client.query("select 1 from db1.schema_migrations where id = $1", [MIGRATION_ID]);
  if (existing.rowCount) return;
  await client.query(`create table db1.source_routes (
    id text primary key,
    origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'),
    created_at timestamptz not null default now()
  )`);
  await client.query(`create table db1.capture_runs (
    id uuid primary key,
    source_route_id text not null references db1.source_routes(id),
    origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'),
    started_at timestamptz not null,
    finished_at timestamptz not null,
    status text not null check (status in ('SUCCEEDED', 'FAILED'))
  )`);
  await client.query(`create table db1.raw_objects (
    digest char(64) primary key,
    origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'),
    relative_path text not null unique,
    byte_length bigint not null check (byte_length >= 0),
    content_type text not null,
    created_at timestamptz not null default now()
  )`);
  await client.query(`create table db1.manifest_entries (
    id uuid primary key,
    capture_run_id uuid not null references db1.capture_runs(id),
    raw_digest char(64) not null references db1.raw_objects(digest),
    origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'),
    content_type text not null,
    byte_length bigint not null check (byte_length >= 0),
    status text not null check (status = 'SUCCEEDED'),
    retrieved_at timestamptz not null
  )`);
  await client.query(`create table db1.projection_builds (
    id uuid primary key,
    manifest_id uuid not null references db1.manifest_entries(id),
    origin_class text not null check (origin_class = '${DB1_SYNTHETIC_ORIGIN}'),
    schema_version text not null,
    code_revision text not null,
    integrity_status text not null check (integrity_status = 'PASS'),
    projected_records integer not null default 0,
    rejected_records integer not null default 0,
    created_at timestamptz not null default now()
  )`);
  await client.query(`create table db1.projection_records (
    id uuid primary key,
    projection_build_id uuid not null references db1.projection_builds(id),
    manifest_id uuid not null references db1.manifest_entries(id),
    source_position integer not null check (source_position >= 0),
    preserved_record jsonb not null,
    unique (projection_build_id, source_position)
  )`);
  await client.query(`create table db1.projection_rejections (
    id uuid primary key,
    projection_build_id uuid not null references db1.projection_builds(id),
    manifest_id uuid not null references db1.manifest_entries(id),
    source_position integer not null check (source_position >= 0),
    reason_code text not null,
    unique (projection_build_id, source_position)
  )`);
  await client.query("insert into db1.schema_migrations (id) values ($1)", [MIGRATION_ID]);
}

export async function runSyntheticFoundation(options: Db1FoundationOptions): Promise<Db1FoundationResult> {
  const bytes = createSyntheticFixture();
  const raw = await persistSyntheticRawObject(options.rawRoot, bytes);
  const pool = new Pool({ connectionString: options.databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query("begin");
    const migrationRole = options.migrationRole ?? "cld_gb_sct_migrate";
    await client.query(`set role ${quoteIdentifier(migrationRole)}`);
    await migrate(client, migrationRole);
    const now = new Date();
    const routeId = "synthetic.foundation.v1";
    const runId = randomUUID();
    const manifestId = randomUUID();
    const buildId = randomUUID();
    await client.query("insert into db1.source_routes (id, origin_class) values ($1, $2) on conflict (id) do nothing", [routeId, DB1_SYNTHETIC_ORIGIN]);
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, finished_at, status) values ($1, $2, $3, $4, $4, 'SUCCEEDED')", [runId, routeId, DB1_SYNTHETIC_ORIGIN, now]);
    await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, 'application/json') on conflict (digest) do nothing", [raw.digest, DB1_SYNTHETIC_ORIGIN, raw.relativePath, raw.byteLength]);
    await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, 'application/json', $5, 'SUCCEEDED', $6)", [manifestId, runId, raw.digest, DB1_SYNTHETIC_ORIGIN, raw.byteLength, now]);
    await client.query("insert into db1.projection_builds (id, manifest_id, origin_class, schema_version, code_revision, integrity_status) values ($1, $2, $3, 'synthetic-foundation-v1', 'D1', 'PASS')", [buildId, manifestId, DB1_SYNTHETIC_ORIGIN]);
    const fixture: unknown = JSON.parse(bytes.toString("utf8"));
    if (!fixture || typeof fixture !== "object" || !("records" in fixture) || !Array.isArray(fixture.records)) throw new Error("synthetic fixture contract failed");
    let projectedRecords = 0;
    let rejectedRecords = 0;
    for (const [sourcePosition, record] of fixture.records.entries()) {
      if (record && typeof record === "object" && !Array.isArray(record)) {
        await client.query("insert into db1.projection_records (id, projection_build_id, manifest_id, source_position, preserved_record) values ($1, $2, $3, $4, $5)", [randomUUID(), buildId, manifestId, sourcePosition, record]);
        projectedRecords += 1;
      } else {
        await client.query("insert into db1.projection_rejections (id, projection_build_id, manifest_id, source_position, reason_code) values ($1, $2, $3, $4, 'NOT_AN_OBJECT')", [randomUUID(), buildId, manifestId, sourcePosition]);
        rejectedRecords += 1;
      }
    }
    await client.query("update db1.projection_builds set projected_records = $2, rejected_records = $3 where id = $1", [buildId, projectedRecords, rejectedRecords]);
    const verification = await client.query<{ projected_records: number; rejected_records: number; digest: string; byte_length: string }>(
      "select b.projected_records, b.rejected_records, m.raw_digest as digest, m.byte_length from db1.projection_builds b join db1.manifest_entries m on m.id = b.manifest_id where b.id = $1",
      [buildId]
    );
    const verified = verification.rows[0];
    if (!verified || verified.projected_records !== projectedRecords || verified.rejected_records !== rejectedRecords || verified.digest !== raw.digest || Number(verified.byte_length) !== raw.byteLength) {
      throw new Error("DB1 synthetic lineage verification failed");
    }
    await client.query("commit");
    return { origin: DB1_SYNTHETIC_ORIGIN, manifestId, projectionBuildId: buildId, raw, projectedRecords, rejectedRecords };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
