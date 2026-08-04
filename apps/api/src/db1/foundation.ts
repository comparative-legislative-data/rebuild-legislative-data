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
export const D4_REFERENCE_ROUTES = [
  { id: "gb-sct.bill-types.collection", path: "/api/billtypes", url: "https://data.parliament.scot/api/billtypes" },
  { id: "gb-sct.bill-stage-types.collection", path: "/api/billstagetypes", url: "https://data.parliament.scot/api/billstagetypes" },
  { id: "gb-sct.sessions.collection", path: "/api/sessions", url: "https://data.parliament.scot/api/sessions" }
] as const;
export const D4_MAX_BYTES = 1_048_576;
export const D4C_INSTITUTIONAL_ROUTES = [
  { id: "gb-sct.constituencies.collection", path: "/api/constituencies", url: "https://data.parliament.scot/api/constituencies" },
  { id: "gb-sct.regions.collection", path: "/api/regions", url: "https://data.parliament.scot/api/regions" },
  { id: "gb-sct.committee-types.collection", path: "/api/committeetypes", url: "https://data.parliament.scot/api/committeetypes" },
  { id: "gb-sct.committee-type-links.collection", path: "/api/committeetypelinks", url: "https://data.parliament.scot/api/committeetypelinks" }
] as const;
export const D4C_INSTITUTIONAL_CATALOGUE_ID = "gb_sct_institutional_reference_d4c_v1";
export const D5_FORMAL_STAGES_ROUTE = { id: "gb-sct.bill-stages.collection", path: "/api/billstages", url: "https://data.parliament.scot/api/billstages" } as const;
export const D5_FORMAL_STAGES_RELEASE_ID = "gb_sct_formal_stages_d5_v1";
export const D6_BILLS_COLLECTION_ROUTE = { id: "gb-sct.bills.collection", path: "/api/bills", url: "https://data.parliament.scot/api/bills" } as const;
export const D6_BILLS_COLLECTION_RELEASE_ID = "gb_sct_bills_collection_d6_v1";
export const D6_MAX_BYTES = 2_097_152;
export const D7_GOVERNMENT_ROLES_ROUTE = { id: "gb-sct.government-roles.collection", path: "/api/governmentroles", url: "https://data.parliament.scot/api/governmentroles" } as const;
export const D7_GOVERNMENT_ROLES_RELEASE_ID = "gb_sct_government_roles_d7_v1";
export const D7_MAX_BYTES = 2_097_152;
export const D8_COMMITTEE_ROLES_ROUTE = { id: "gb-sct.committee-roles.collection", path: "/api/committeeroles", url: "https://data.parliament.scot/api/committeeroles" } as const;
export const D8_COMMITTEE_ROLES_RELEASE_ID = "gb_sct_committee_roles_d8_v1";
export const D8_MAX_BYTES = 2_097_152;
export const D9_PARTY_ROLES_ROUTE = { id: "gb-sct.party-roles.collection", path: "/api/partyroles", url: "https://data.parliament.scot/api/partyroles" } as const;
export const D9_PARTY_ROLES_RELEASE_ID = "gb_sct_party_roles_d9_v1";
export const D9_MAX_BYTES = 2_097_152;
export const D10_PARTIES_ROUTE = { id: "gb-sct.parties.collection", path: "/api/parties", url: "https://data.parliament.scot/api/parties" } as const;
export const D10_PARTIES_RELEASE_ID = "gb_sct_parties_d10_v1";
export const D10_MAX_BYTES = 2_097_152;
export const D11_MEMBER_CONTEXT_ROUTES = [
  { id: "gb-sct.members.collection", path: "/api/members", url: "https://data.parliament.scot/api/members", releaseId: "gb_sct_members_d11_v1" },
  { id: "gb-sct.member-constituency-statuses.collection", path: "/api/memberelectionconstituencystatuses", url: "https://data.parliament.scot/api/memberelectionconstituencystatuses", releaseId: "gb_sct_member_constituency_statuses_d11_v1" },
  { id: "gb-sct.member-region-statuses.collection", path: "/api/memberelectionregionstatuses", url: "https://data.parliament.scot/api/memberelectionregionstatuses", releaseId: "gb_sct_member_region_statuses_d11_v1" },
  { id: "gb-sct.member-parties.collection", path: "/api/memberparties", url: "https://data.parliament.scot/api/memberparties", releaseId: "gb_sct_member_parties_d11_v1" },
  { id: "gb-sct.member-party-roles.collection", path: "/api/memberpartyroles", url: "https://data.parliament.scot/api/memberpartyroles", releaseId: "gb_sct_member_party_roles_d11_v1" },
  { id: "gb-sct.member-government-roles.collection", path: "/api/membergovernmentroles", url: "https://data.parliament.scot/api/membergovernmentroles", releaseId: "gb_sct_member_government_roles_d11_v1" }
] as const;
export const D11_MAX_BYTES = 2_097_152;
export const D4B_REFERENCE_CATALOGUE_ID = "gb_sct_reference_cohort_d4a_v1";
export const D4B_REFERENCE_PROJECTIONS = [
  { routeId: "gb-sct.bill-types.collection", sourcePath: "/api/billtypes", manifestId: "6a414dbf-973a-4aa5-9aae-b217fc18c1e3", projectionName: "gb_sct_bill_types_d4a_v1" },
  { routeId: "gb-sct.bill-stage-types.collection", sourcePath: "/api/billstagetypes", manifestId: "2315af79-5903-4540-904c-0eb3f95e99c4", projectionName: "gb_sct_bill_stage_types_d4a_v1" },
  { routeId: "gb-sct.sessions.collection", sourcePath: "/api/sessions", manifestId: "e94719fb-f686-48ce-b652-d22f3b532ac3", projectionName: "gb_sct_sessions_d4a_v1" }
] as const;
const D1_MIGRATION_ID = "001_foundation";
const D2_MIGRATION_ID = "002_first_source_batch";
const D3_MIGRATION_ID = "003_first_source_projection";
const D4_MIGRATION_ID = "004_reference_reconciliation";
const D4B_MIGRATION_ID = "005_reference_catalogue";
const D4C_MIGRATION_ID = "006_institutional_reference";
const D5_MIGRATION_ID = "007_formal_stages";
const D6_MIGRATION_ID = "008_bills_collection";
const D7_MIGRATION_ID = "009_government_roles_collection";
const D8_MIGRATION_ID = "010_committee_roles_collection";
const D9_MIGRATION_ID = "011_party_roles_collection";
const D10_MIGRATION_ID = "012_parties_collection";
const D11_MIGRATION_ID = "013_member_context_collection_batch";

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
export type D4RouteState = "INITIAL" | "CHANGED" | "UNCHANGED" | "FAILED" | "BLOCKED_BY_SOURCE_DRIFT";
export interface D4ReferenceCaptureOptions extends Db1FoundationOptions { request?: typeof fetch; now?: () => Date; wait?: (milliseconds: number) => Promise<void>; }
export interface D4ReferenceRouteResult { routeId: string; state: D4RouteState; manifestId?: string; raw?: RawObjectReference; failureCode?: string; }
export interface D4ReferenceCaptureResult { cycleId: string; status: "SUCCEEDED" | "PARTIAL" | "FAILED" | "BLOCKED_BY_SOURCE_DRIFT" | "SKIPPED_OVERLAP"; routes: D4ReferenceRouteResult[]; }
export interface D4BProjectionOptions extends Db1FoundationOptions { codeRevision: string; now?: () => Date; migrate?: boolean; }
export interface D4BProjectionResult { catalogueId: string; projectionBuildIds: string[]; projectedRecords: number; rejectedRecords: number; }
export interface D4CInstitutionalResult extends D4ReferenceCaptureResult {}
export interface D5FormalStagesResult extends D4ReferenceCaptureResult {}
export interface D6BillsCollectionResult extends D4ReferenceCaptureResult {}
export interface D7GovernmentRolesResult extends D4ReferenceCaptureResult {}
export interface D8CommitteeRolesResult extends D4ReferenceCaptureResult {}
export interface D9PartyRolesResult extends D4ReferenceCaptureResult {}
export interface D10PartiesResult extends D4ReferenceCaptureResult {}
export interface D11MemberContextResult extends D4ReferenceCaptureResult {}
export interface D11MemberContextProjectionResult { releases: D4BProjectionResult[]; }

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
  const d4 = await client.query("select 1 from db1.schema_migrations where id = $1", [D4_MIGRATION_ID]);
  if (!d4.rowCount) {
    await client.query("create table db1.reconciliation_cycles (id uuid primary key, started_at timestamptz not null, finished_at timestamptz, status text not null check (status in ('IN_PROGRESS', 'SUCCEEDED', 'PARTIAL', 'FAILED', 'BLOCKED_BY_SOURCE_DRIFT', 'SKIPPED_OVERLAP'))) ");
    await client.query("create table db1.reconciliation_observations (id uuid primary key, cycle_id uuid not null references db1.reconciliation_cycles(id), source_route_id text not null references db1.source_routes(id), capture_run_id uuid not null references db1.capture_runs(id), manifest_id uuid references db1.manifest_entries(id), previous_manifest_id uuid references db1.manifest_entries(id), state text not null check (state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'FAILED', 'BLOCKED_BY_SOURCE_DRIFT')), raw_digest char(64), previous_raw_digest char(64), structure_signature jsonb, previous_structure_signature jsonb, failure_code text, observed_at timestamptz not null)");
    await client.query("create index reconciliation_observations_route_observed_idx on db1.reconciliation_observations (source_route_id, observed_at desc)");
    for (const route of D4_REFERENCE_ROUTES) {
      await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [route.id, DB1_SOURCE_ORIGIN, route.path]);
    }
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D4_MIGRATION_ID]);
  }
  const d4b = await client.query("select 1 from db1.schema_migrations where id = $1", [D4B_MIGRATION_ID]);
  if (!d4b.rowCount) {
    await client.query("create table db1.catalogue_releases (id text primary key, bill_types_projection_build_id uuid not null references db1.projection_builds(id), bill_stage_types_projection_build_id uuid not null references db1.projection_builds(id), sessions_projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D4B_MIGRATION_ID]);
  }
  const d4c = await client.query("select 1 from db1.schema_migrations where id = $1", [D4C_MIGRATION_ID]);
  if (!d4c.rowCount) {
    for (const route of D4C_INSTITUTIONAL_ROUTES) {
      await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [route.id, DB1_SOURCE_ORIGIN, route.path]);
    }
    await client.query("create table db1.institutional_catalogue_releases (id text primary key, constituencies_projection_build_id uuid not null references db1.projection_builds(id), regions_projection_build_id uuid not null references db1.projection_builds(id), committee_types_projection_build_id uuid not null references db1.projection_builds(id), committee_type_links_projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D4C_MIGRATION_ID]);
  }
  const d5 = await client.query("select 1 from db1.schema_migrations where id = $1", [D5_MIGRATION_ID]);
  if (!d5.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D5_FORMAL_STAGES_ROUTE.id, DB1_SOURCE_ORIGIN, D5_FORMAL_STAGES_ROUTE.path]);
    await client.query("create table db1.formal_stages_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D5_MIGRATION_ID]);
  }
  const d6 = await client.query("select 1 from db1.schema_migrations where id = $1", [D6_MIGRATION_ID]);
  if (!d6.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D6_BILLS_COLLECTION_ROUTE.id, DB1_SOURCE_ORIGIN, D6_BILLS_COLLECTION_ROUTE.path]);
    await client.query("create table db1.bills_collection_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D6_MIGRATION_ID]);
  }
  const d7 = await client.query("select 1 from db1.schema_migrations where id = $1", [D7_MIGRATION_ID]);
  if (!d7.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D7_GOVERNMENT_ROLES_ROUTE.id, DB1_SOURCE_ORIGIN, D7_GOVERNMENT_ROLES_ROUTE.path]);
    await client.query("create table db1.government_roles_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D7_MIGRATION_ID]);
  }
  const d8 = await client.query("select 1 from db1.schema_migrations where id = $1", [D8_MIGRATION_ID]);
  if (!d8.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D8_COMMITTEE_ROLES_ROUTE.id, DB1_SOURCE_ORIGIN, D8_COMMITTEE_ROLES_ROUTE.path]);
    await client.query("create table db1.committee_roles_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D8_MIGRATION_ID]);
  }
  const d9 = await client.query("select 1 from db1.schema_migrations where id = $1", [D9_MIGRATION_ID]);
  if (!d9.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D9_PARTY_ROLES_ROUTE.id, DB1_SOURCE_ORIGIN, D9_PARTY_ROLES_ROUTE.path]);
    await client.query("create table db1.party_roles_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D9_MIGRATION_ID]);
  }
  const d10 = await client.query("select 1 from db1.schema_migrations where id = $1", [D10_MIGRATION_ID]);
  if (!d10.rowCount) {
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [D10_PARTIES_ROUTE.id, DB1_SOURCE_ORIGIN, D10_PARTIES_ROUTE.path]);
    await client.query("create table db1.parties_releases (id text primary key, projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D10_MIGRATION_ID]);
  }
  const d11 = await client.query("select 1 from db1.schema_migrations where id = $1", [D11_MIGRATION_ID]);
  if (!d11.rowCount) {
    for (const route of D11_MEMBER_CONTEXT_ROUTES) await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1, $2, $3, 'RESTRICTED_PROJECT') on conflict (id) do nothing", [route.id, DB1_SOURCE_ORIGIN, route.path]);
    await client.query("create table db1.member_context_releases (id text primary key, source_route_id text not null unique references db1.source_routes(id), projection_build_id uuid not null references db1.projection_builds(id), integrity_status text not null check (integrity_status = 'PASS'), created_at timestamptz not null default now())");
    await client.query("insert into db1.schema_migrations (id) values ($1)", [D11_MIGRATION_ID]);
  }
}

async function withDb<T>(options: Db1FoundationOptions, action: (client: PoolClient) => Promise<T>, runMigrations = true): Promise<T> {
  const pool = new Pool({ connectionString: options.databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query("begin");
    if (runMigrations) {
      await client.query(`set role ${quoteIdentifier(options.migrationRole ?? "cld_gb_sct_migrate")}`);
      await migrate(client, options.migrationRole ?? "cld_gb_sct_migrate");
    }
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

export async function migrateD4ReferenceReconciliation(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD4BReferenceCatalogue(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD4CInstitutionalReference(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD5FormalStages(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD6BillsCollection(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD7GovernmentRoles(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}

export async function migrateD8CommitteeRoles(options: Db1FoundationOptions): Promise<void> {
  await withDb(options, async () => undefined);
}
export async function migrateD9PartyRoles(options: Db1FoundationOptions): Promise<void> { await withDb(options, async () => undefined); }
export async function migrateD10Parties(options: Db1FoundationOptions): Promise<void> { await withDb(options, async () => undefined); }
export async function migrateD11MemberContext(options: Db1FoundationOptions): Promise<void> { await withDb(options, async () => undefined); }

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

export async function fetchD4ReferenceCollection(route: (typeof D4_REFERENCE_ROUTES)[number], request: typeof fetch = fetch): Promise<D2TransportResult> {
  if (!D4_REFERENCE_ROUTES.includes(route)) throw new Error("D4 route is not in the fixed reference cohort");
  const response = await request(route.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(20_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D4_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D4_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

export async function fetchD4CInstitutionalCollection(route: (typeof D4C_INSTITUTIONAL_ROUTES)[number], request: typeof fetch = fetch): Promise<D2TransportResult> {
  if (!D4C_INSTITUTIONAL_ROUTES.includes(route)) throw new Error("D4C route is not in the fixed institutional cohort");
  const response = await request(route.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(20_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D4_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D4_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

export async function fetchD5FormalStagesCollection(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D5_FORMAL_STAGES_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(20_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D4_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D4_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

export async function fetchD6BillsCollection(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D6_BILLS_COLLECTION_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D6_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D6_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

export async function fetchD7GovernmentRoles(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D7_GOVERNMENT_ROLES_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D7_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D7_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks);
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (!Array.isArray(parsed)) throw new Error("not array"); } catch { throw new D2CaptureFailure("JSON_SHAPE"); }
  return { bytes, contentType, status: response.status };
}

export async function fetchD8CommitteeRoles(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D8_COMMITTEE_ROLES_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D8_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > D8_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new D2CaptureFailure("INVALID_JSON"); }
  if (!Array.isArray(parsed)) throw new D2CaptureFailure("TOP_LEVEL_NOT_ARRAY");
  return { bytes, contentType, status: response.status };
}

export async function fetchD9PartyRoles(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D9_PARTY_ROLES_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D9_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > D9_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); } chunks.push(value); }
  const bytes = Buffer.concat(chunks); let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new D2CaptureFailure("INVALID_JSON"); }
  if (!Array.isArray(parsed)) throw new D2CaptureFailure("TOP_LEVEL_NOT_ARRAY");
  return { bytes, contentType, status: response.status };
}

export async function fetchD10Parties(request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(D10_PARTIES_ROUTE.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D10_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > D10_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); } chunks.push(value); }
  const bytes = Buffer.concat(chunks); let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new D2CaptureFailure("INVALID_JSON"); }
  if (!Array.isArray(parsed)) throw new D2CaptureFailure("TOP_LEVEL_NOT_ARRAY");
  return { bytes, contentType, status: response.status };
}

export async function fetchD11MemberContextCollection(route: (typeof D11_MEMBER_CONTEXT_ROUTES)[number], request: typeof fetch = fetch): Promise<D2TransportResult> {
  const response = await request(route.url, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(30_000) });
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status < 200 || response.status >= 300) throw new D2CaptureFailure("HTTP_STATUS");
  if (!contentType.toLowerCase().includes("application/json")) throw new D2CaptureFailure("CONTENT_TYPE");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > D11_MAX_BYTES) throw new D2CaptureFailure("BODY_TOO_LARGE");
  if (!response.body) throw new D2CaptureFailure("EMPTY_BODY");
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > D11_MAX_BYTES) { await reader.cancel(); throw new D2CaptureFailure("BODY_TOO_LARGE"); } chunks.push(value); }
  if (total === 0) throw new D2CaptureFailure("EMPTY_BODY");
  const bytes = Buffer.concat(chunks); let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new D2CaptureFailure("INVALID_JSON"); }
  if (!Array.isArray(parsed)) throw new D2CaptureFailure("TOP_LEVEL_NOT_ARRAY");
  return { bytes, contentType, status: response.status };
}

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function structureSignature(bytes: Buffer): Record<string, string[]> {
  const parsed: unknown = JSON.parse(bytes.toString("utf8"));
  if (!Array.isArray(parsed)) throw new D2CaptureFailure("JSON_SHAPE");
  const signature = new Map<string, Set<string>>();
  for (const item of parsed) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    for (const [key, value] of Object.entries(item)) {
      const types = signature.get(key) ?? new Set<string>();
      types.add(jsonType(value));
      signature.set(key, types);
    }
  }
  return Object.fromEntries([...signature.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([key, types]) => [key, [...types].sort()]));
}

export function signaturesEqual(left: Record<string, string[]> | null, right: Record<string, string[]>): boolean {
  if (!left) return false;
  const canonical = (signature: Record<string, string[]>) => Object.fromEntries(
    Object.keys(signature).sort().map((key) => [key, [...signature[key] ?? []].sort()])
  );
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
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

export async function runD4ReferenceReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D4ReferenceCaptureResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch; const wait = options.wait ?? (async (milliseconds: number) => new Promise<void>((resolveWait) => setTimeout(resolveWait, milliseconds)));
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const results: D4ReferenceRouteResult[] = [];
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d4a-reference-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);

    for (const [index, route] of D4_REFERENCE_ROUTES.entries()) {
      if (index > 0) await wait(5_000);
      const runId = randomUUID(); const attemptedAt = now();
      await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
      const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>(
        "select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1",
        [route.id]
      );
      const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>(
        "select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1",
        [route.id]
      )).rows[0];
      try {
        const captured = await fetchD4ReferenceCollection(route, request);
        const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
        const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
        let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
        if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
        try {
          await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
          await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
          await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
          await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
        } catch (error) {
          if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined);
          throw error;
        }
        results.push({ routeId: route.id, state, manifestId, raw: stored.raw });
      } catch (error) {
        const code = failureCode(error);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
        results.push({ routeId: route.id, state: "FAILED", failureCode: code });
      }
    }
    const failed = results.filter((result) => result.state === "FAILED").length;
    const drifted = results.some((result) => result.state === "BLOCKED_BY_SOURCE_DRIFT");
    const status: D4ReferenceCaptureResult["status"] = failed === results.length ? "FAILED" : drifted ? "BLOCKED_BY_SOURCE_DRIFT" : failed ? "PARTIAL" : "SUCCEEDED";
    await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), status]);
    return { cycleId, status, routes: results };
  }, options.migrate ?? true);
}

export async function runD4CInstitutionalReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D4CInstitutionalResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch; const wait = options.wait ?? (async (milliseconds: number) => new Promise<void>((resolveWait) => setTimeout(resolveWait, milliseconds)));
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const results: D4ReferenceRouteResult[] = [];
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d4c-institutional-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    for (const [index, route] of D4C_INSTITUTIONAL_ROUTES.entries()) {
      if (index > 0) await wait(5_000);
      const runId = randomUUID(); const attemptedAt = now();
      await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
      const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
      const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
      try {
        const captured = await fetchD4CInstitutionalCollection(route, request);
        const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
        const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
        let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
        if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
        try {
          await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
          await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
          await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
          await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
        } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
        results.push({ routeId: route.id, state, manifestId, raw: stored.raw });
      } catch (error) {
        const code = failureCode(error);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
        results.push({ routeId: route.id, state: "FAILED", failureCode: code });
      }
    }
    const failed = results.filter((result) => result.state === "FAILED").length; const drifted = results.some((result) => result.state === "BLOCKED_BY_SOURCE_DRIFT");
    const status: D4CInstitutionalResult["status"] = failed === results.length ? "FAILED" : drifted ? "BLOCKED_BY_SOURCE_DRIFT" : failed ? "PARTIAL" : "SUCCEEDED";
    await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), status]);
    return { cycleId, status, routes: results };
  }, options.migrate ?? true);
}

export async function runD5FormalStagesReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D5FormalStagesResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D5_FORMAL_STAGES_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d5-formal-stages-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); const attemptedAt = now();
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD5FormalStagesCollection(request);
      const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
      if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try {
        await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
      } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]);
      return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) {
      const code = failureCode(error);
      await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
      await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]);
      return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] };
    }
  }, options.migrate ?? true);
}

export async function runD6BillsCollectionReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D6BillsCollectionResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D6_BILLS_COLLECTION_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d6-bills-collection-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); const attemptedAt = now();
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD6BillsCollection(request);
      const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
      if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try {
        await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
      } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]);
      return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) {
      const code = failureCode(error);
      await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
      await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]);
      return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] };
    }
  }, options.migrate ?? true);
}

export async function runD7GovernmentRolesReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D7GovernmentRolesResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D7_GOVERNMENT_ROLES_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d7-government-roles-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); const attemptedAt = now();
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD7GovernmentRoles(request);
      const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
      if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try {
        await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
      } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]);
      return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) {
      const code = failureCode(error);
      await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
      await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]);
      return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] };
    }
  }, options.migrate ?? true);
}

export async function runD8CommitteeRolesReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D8CommitteeRolesResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D8_COMMITTEE_ROLES_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d8-committee-roles-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) {
      await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]);
      return { cycleId, status: "SKIPPED_OVERLAP", routes: [] };
    }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); const attemptedAt = now();
    await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, attemptedAt]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD8CommitteeRoles(request);
      const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
      if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try {
        await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
      } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]);
      return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) {
      const code = failureCode(error);
      await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
      await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
      await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]);
      return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] };
    }
  }, options.migrate ?? true);
}

export async function runD9PartyRolesReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D9PartyRolesResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D9_PARTY_ROLES_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d9-party-roles-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) { await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]); return { cycleId, status: "SKIPPED_OVERLAP", routes: [] }; }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, now()]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD9PartyRoles(request); const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL"; if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try { await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]); await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]); await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]); await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]); } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]); return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) { const code = failureCode(error); await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]); await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]); await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]); await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]); return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] }; }
  }, options.migrate ?? true);
}

export async function runD10PartiesReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D10PartiesResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch;
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const route = D10_PARTIES_ROUTE;
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d10-parties-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) { await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]); return { cycleId, status: "SKIPPED_OVERLAP", routes: [] }; }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    const runId = randomUUID(); await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, now()]);
    const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
    const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
    try {
      const captured = await fetchD10Parties(request); const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
      const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
      let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL"; if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
      try { await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]); await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]); await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]); await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]); } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
      await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED"]); return { cycleId, status: state === "BLOCKED_BY_SOURCE_DRIFT" ? "BLOCKED_BY_SOURCE_DRIFT" : "SUCCEEDED", routes: [{ routeId: route.id, state, manifestId, raw: stored.raw }] };
    } catch (error) { const code = failureCode(error); await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]); await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]); await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]); await client.query("update db1.reconciliation_cycles set finished_at = $2, status = 'FAILED' where id = $1", [cycleId, now()]); return { cycleId, status: "FAILED", routes: [{ routeId: route.id, state: "FAILED", failureCode: code }] }; }
  }, options.migrate ?? true);
}

export async function runD11MemberContextReconciliation(options: D4ReferenceCaptureOptions & { migrate?: boolean }): Promise<D11MemberContextResult> {
  const now = options.now ?? (() => new Date()); const request = options.request ?? fetch; const wait = options.wait ?? (async (milliseconds: number) => new Promise<void>((resolveWait) => setTimeout(resolveWait, milliseconds)));
  return withDb(options, async (client) => {
    const cycleId = randomUUID(); const startedAt = now(); const results: D4ReferenceRouteResult[] = [];
    const lock = await client.query<{ acquired: boolean }>("select pg_try_advisory_xact_lock(hashtext('cld-gb-sct-d11-member-context-reconciliation')) as acquired");
    if (!lock.rows[0]?.acquired) { await client.query("insert into db1.reconciliation_cycles (id, started_at, finished_at, status) values ($1, $2, $2, 'SKIPPED_OVERLAP')", [cycleId, startedAt]); return { cycleId, status: "SKIPPED_OVERLAP", routes: [] }; }
    await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1, $2, 'IN_PROGRESS')", [cycleId, startedAt]);
    for (const [index, route] of D11_MEMBER_CONTEXT_ROUTES.entries()) {
      if (index > 0) await wait(1_000);
      const runId = randomUUID();
      await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1, $2, $3, $4, 'IN_PROGRESS')", [runId, route.id, DB1_SOURCE_ORIGIN, now()]);
      const previous = await client.query<{ manifest_id: string; raw_digest: string; structure_signature: Record<string, string[]> | null }>("select o.manifest_id, o.raw_digest, o.structure_signature from db1.reconciliation_observations o where o.source_route_id = $1 and o.state in ('INITIAL', 'CHANGED', 'UNCHANGED', 'BLOCKED_BY_SOURCE_DRIFT') and o.manifest_id is not null order by o.observed_at desc limit 1", [route.id]);
      const prior = previous.rows[0] ?? (await client.query<{ manifest_id: string; raw_digest: string }>("select m.id as manifest_id, m.raw_digest from db1.manifest_entries m join db1.capture_runs c on c.id = m.capture_run_id where c.source_route_id = $1 and m.status = 'SUCCEEDED' order by m.retrieved_at desc limit 1", [route.id])).rows[0];
      try {
        const captured = await fetchD11MemberContextCollection(route, request); const stored = await persistRawObject(options.rawRoot, captured.bytes); const manifestId = randomUUID(); const signature = structureSignature(captured.bytes);
        const priorSignature = "structure_signature" in (prior ?? {}) ? (prior as { structure_signature?: Record<string, string[]> | null }).structure_signature ?? null : null;
        let state: D4RouteState = prior ? (prior.raw_digest === stored.raw.digest ? "UNCHANGED" : "CHANGED") : "INITIAL";
        if (priorSignature && !signaturesEqual(priorSignature, signature)) state = "BLOCKED_BY_SOURCE_DRIFT";
        try {
          await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1, $2, $3, $4, $5) on conflict (digest) do nothing", [stored.raw.digest, DB1_SOURCE_ORIGIN, stored.raw.relativePath, stored.raw.byteLength, captured.contentType]);
          await client.query("insert into db1.manifest_entries (id, capture_run_id, raw_digest, origin_class, content_type, byte_length, status, retrieved_at) values ($1, $2, $3, $4, $5, $6, 'SUCCEEDED', $7)", [manifestId, runId, stored.raw.digest, DB1_SOURCE_ORIGIN, captured.contentType, stored.raw.byteLength, now()]);
          await client.query("update db1.capture_runs set finished_at = $2, status = 'SUCCEEDED' where id = $1", [runId, now()]);
          await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, manifest_id, previous_manifest_id, state, raw_digest, previous_raw_digest, structure_signature, previous_structure_signature, observed_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [randomUUID(), cycleId, route.id, runId, manifestId, prior?.manifest_id ?? null, state, stored.raw.digest, prior?.raw_digest ?? null, signature, priorSignature, now()]);
        } catch (error) { if (stored.created) await unlink(resolve(options.rawRoot, stored.raw.relativePath)).catch(() => undefined); throw error; }
        results.push({ routeId: route.id, state, manifestId, raw: stored.raw });
      } catch (error) {
        const code = failureCode(error);
        await client.query("insert into db1.manifest_entries (id, capture_run_id, origin_class, status, retrieved_at, failure_code) values ($1, $2, $3, 'FAILED', $4, $5)", [randomUUID(), runId, DB1_SOURCE_ORIGIN, now(), code]);
        await client.query("update db1.capture_runs set finished_at = $2, status = 'FAILED' where id = $1", [runId, now()]);
        await client.query("insert into db1.reconciliation_observations (id, cycle_id, source_route_id, capture_run_id, state, failure_code, observed_at) values ($1, $2, $3, $4, 'FAILED', $5, $6)", [randomUUID(), cycleId, route.id, runId, code, now()]);
        results.push({ routeId: route.id, state: "FAILED", failureCode: code });
      }
    }
    const failed = results.filter((result) => result.state === "FAILED").length; const drifted = results.some((result) => result.state === "BLOCKED_BY_SOURCE_DRIFT");
    const status: D11MemberContextResult["status"] = failed === results.length ? "FAILED" : drifted ? "BLOCKED_BY_SOURCE_DRIFT" : failed ? "PARTIAL" : "SUCCEEDED";
    await client.query("update db1.reconciliation_cycles set finished_at = $2, status = $3 where id = $1", [cycleId, now(), status]);
    return { cycleId, status, routes: results };
  }, options.migrate ?? true);
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

export type SourcePreservingProjectionSpec = { routeId: string; sourcePath: string; manifestId: string; projectionName: string; };

async function d4bProjectionBuild(client: PoolClient, options: D4BProjectionOptions, spec: SourcePreservingProjectionSpec): Promise<{ buildId: string; projectedRecords: number; rejectedRecords: number }> {
  const existing = await client.query<{ id: string; projected_records: number; rejected_records: number }>(
    "select id, projected_records, rejected_records from db1.projection_builds where projection_name = $1 and manifest_id = $2 and origin_class = 'SOURCE_CAPTURE' and integrity_status = 'PASS' order by created_at asc limit 1",
    [spec.projectionName, spec.manifestId]
  );
  if (existing.rows[0]) {
    return { buildId: existing.rows[0].id, projectedRecords: existing.rows[0].projected_records, rejectedRecords: existing.rows[0].rejected_records };
  }
  const source = await client.query<{
    manifest_id: string; raw_digest: string; byte_length: number; relative_path: string; content_type: string; route_id: string; origin_class: string; handling_class: string | null;
  }>(
    "select m.id as manifest_id, m.raw_digest, m.byte_length, r.relative_path, m.content_type, s.id as route_id, m.origin_class, s.handling_class from db1.manifest_entries m join db1.raw_objects r on r.digest = m.raw_digest join db1.capture_runs c on c.id = m.capture_run_id join db1.source_routes s on s.id = c.source_route_id where m.id = $1 and m.status = 'SUCCEEDED'",
    [spec.manifestId]
  );
  const item = source.rows[0];
  if (!item || item.manifest_id !== spec.manifestId || item.route_id !== spec.routeId || item.origin_class !== DB1_SOURCE_ORIGIN || item.handling_class !== "RESTRICTED_PROJECT") {
    throw new Error(`D4B input manifest identity does not match ${spec.projectionName}`);
  }
  const root = resolve(options.rawRoot);
  const target = resolve(root, item.relative_path);
  if (!insideRoot(root, target)) throw new Error("D4B raw-object path escapes configured root");
  const bytes = await readFile(target);
  if (bytes.byteLength !== Number(item.byte_length) || sha256(bytes) !== item.raw_digest) throw new Error(`D4B raw-object integrity check failed for ${spec.projectionName}`);
  let parsed: unknown;
  try { parsed = JSON.parse(bytes.toString("utf8")); } catch { throw new Error(`D4B raw object is not valid JSON for ${spec.projectionName}`); }
  if (!Array.isArray(parsed)) throw new Error(`D4B raw object is not a JSON array for ${spec.projectionName}`);

  const buildId = randomUUID();
  await client.query(
    "insert into db1.projection_builds (id, manifest_id, origin_class, projection_name, schema_version, code_revision, integrity_status) values ($1, $2, $3, $4, 'd4b-loss-aware-v1', $5, 'PASS')",
    [buildId, spec.manifestId, DB1_SOURCE_ORIGIN, spec.projectionName, options.codeRevision]
  );
  let projectedRecords = 0; let rejectedRecords = 0;
  for (const [sourcePosition, record] of parsed.entries()) {
    if (record && typeof record === "object" && !Array.isArray(record)) {
      await client.query("insert into db1.projection_records (id, projection_build_id, manifest_id, source_position, preserved_record) values ($1, $2, $3, $4, $5)", [randomUUID(), buildId, spec.manifestId, sourcePosition, record]);
      projectedRecords += 1;
    } else {
      await client.query("insert into db1.projection_rejections (id, projection_build_id, manifest_id, source_position, reason_code) values ($1, $2, $3, $4, 'NOT_AN_OBJECT')", [randomUUID(), buildId, spec.manifestId, sourcePosition]);
      rejectedRecords += 1;
    }
  }
  await client.query("update db1.projection_builds set projected_records = $2, rejected_records = $3 where id = $1", [buildId, projectedRecords, rejectedRecords]);
  return { buildId, projectedRecords, rejectedRecords };
}

export async function runD4BReferenceCatalogueProjections(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ bill_types_projection_build_id: string; bill_stage_types_projection_build_id: string; sessions_projection_build_id: string }>(
      "select bill_types_projection_build_id, bill_stage_types_projection_build_id, sessions_projection_build_id from db1.catalogue_releases where id = $1 and integrity_status = 'PASS'",
      [D4B_REFERENCE_CATALOGUE_ID]
    );
    if (existing.rows[0]) {
      const buildIds = Object.values(existing.rows[0]);
      const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = any($1::uuid[])", [buildIds]);
      if (counts.rowCount !== 3) throw new Error("D4B catalogue release does not retain all three projection builds");
      return { catalogueId: D4B_REFERENCE_CATALOGUE_ID, projectionBuildIds: buildIds, projectedRecords: counts.rows.reduce((total, item) => total + item.projected_records, 0), rejectedRecords: counts.rows.reduce((total, item) => total + item.rejected_records, 0) };
    }
    const results = [] as Array<{ buildId: string; projectedRecords: number; rejectedRecords: number }>;
    for (const spec of D4B_REFERENCE_PROJECTIONS) results.push(await d4bProjectionBuild(client, options, spec));
    if (results.length !== D4B_REFERENCE_PROJECTIONS.length) throw new Error("D4B fixed projection count is incomplete");
    const [billTypes, billStageTypes, sessions] = results as [{ buildId: string; projectedRecords: number; rejectedRecords: number }, { buildId: string; projectedRecords: number; rejectedRecords: number }, { buildId: string; projectedRecords: number; rejectedRecords: number }];
    await client.query(
      "insert into db1.catalogue_releases (id, bill_types_projection_build_id, bill_stage_types_projection_build_id, sessions_projection_build_id, integrity_status, created_at) values ($1, $2, $3, $4, 'PASS', $5)",
      [D4B_REFERENCE_CATALOGUE_ID, billTypes.buildId, billStageTypes.buildId, sessions.buildId, options.now?.() ?? new Date()]
    );
    return { catalogueId: D4B_REFERENCE_CATALOGUE_ID, projectionBuildIds: results.map((result) => result.buildId), projectedRecords: results.reduce((total, result) => total + result.projectedRecords, 0), rejectedRecords: results.reduce((total, result) => total + result.rejectedRecords, 0) };
  });
}

export async function runD4CInstitutionalCatalogueProjections(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ constituencies_projection_build_id: string; regions_projection_build_id: string; committee_types_projection_build_id: string; committee_type_links_projection_build_id: string }>("select constituencies_projection_build_id, regions_projection_build_id, committee_types_projection_build_id, committee_type_links_projection_build_id from db1.institutional_catalogue_releases where id = $1 and integrity_status = 'PASS'", [D4C_INSTITUTIONAL_CATALOGUE_ID]);
    if (existing.rows[0]) {
      const buildIds = Object.values(existing.rows[0]); const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = any($1::uuid[])", [buildIds]);
      if (counts.rowCount !== 4) throw new Error("D4C catalogue release does not retain all four projection builds");
      return { catalogueId: D4C_INSTITUTIONAL_CATALOGUE_ID, projectionBuildIds: buildIds, projectedRecords: counts.rows.reduce((total, item) => total + item.projected_records, 0), rejectedRecords: counts.rows.reduce((total, item) => total + item.rejected_records, 0) };
    }
    const specs: SourcePreservingProjectionSpec[] = [];
    for (const route of D4C_INSTITUTIONAL_ROUTES) {
      const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [route.id]);
      const manifestId = initial.rows[0]?.manifest_id;
      if (!manifestId) throw new Error(`D4C initial manifest is unavailable for ${route.id}`);
      specs.push({ routeId: route.id, sourcePath: route.path, manifestId, projectionName: route.id.replace("gb-sct.", "gb_sct_").replaceAll("-", "_").replaceAll(".", "_").replace("collection", "d4c_v1") });
    }
    const results = [] as Array<{ buildId: string; projectedRecords: number; rejectedRecords: number }>;
    for (const spec of specs) results.push(await d4bProjectionBuild(client, options, spec));
    if (results.length !== 4) throw new Error("D4C fixed projection count is incomplete");
    await client.query("insert into db1.institutional_catalogue_releases (id, constituencies_projection_build_id, regions_projection_build_id, committee_types_projection_build_id, committee_type_links_projection_build_id, integrity_status, created_at) values ($1, $2, $3, $4, $5, 'PASS', $6)", [D4C_INSTITUTIONAL_CATALOGUE_ID, results[0]!.buildId, results[1]!.buildId, results[2]!.buildId, results[3]!.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D4C_INSTITUTIONAL_CATALOGUE_ID, projectionBuildIds: results.map((result) => result.buildId), projectedRecords: results.reduce((total, result) => total + result.projectedRecords, 0), rejectedRecords: results.reduce((total, result) => total + result.rejectedRecords, 0) };
  }, options.migrate ?? true);
}

export async function runD5FormalStagesProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.formal_stages_releases where id = $1 and integrity_status = 'PASS'", [D5_FORMAL_STAGES_RELEASE_ID]);
    if (existing.rows[0]) {
      const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]);
      const count = counts.rows[0];
      if (!count) throw new Error("D5 release projection build is unavailable");
      return { catalogueId: D5_FORMAL_STAGES_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records };
    }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D5_FORMAL_STAGES_ROUTE.id]);
    const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D5 initial formal-stages manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D5_FORMAL_STAGES_ROUTE.id, sourcePath: D5_FORMAL_STAGES_ROUTE.path, manifestId, projectionName: "gb_sct_formal_stages_d5_v1" });
    await client.query("insert into db1.formal_stages_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D5_FORMAL_STAGES_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D5_FORMAL_STAGES_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD6BillsCollectionProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.bills_collection_releases where id = $1 and integrity_status = 'PASS'", [D6_BILLS_COLLECTION_RELEASE_ID]);
    if (existing.rows[0]) {
      const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]);
      const count = counts.rows[0];
      if (!count) throw new Error("D6 release projection build is unavailable");
      return { catalogueId: D6_BILLS_COLLECTION_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records };
    }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D6_BILLS_COLLECTION_ROUTE.id]);
    const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D6 initial Bills collection manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D6_BILLS_COLLECTION_ROUTE.id, sourcePath: D6_BILLS_COLLECTION_ROUTE.path, manifestId, projectionName: "gb_sct_bills_collection_d6_v1" });
    await client.query("insert into db1.bills_collection_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D6_BILLS_COLLECTION_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D6_BILLS_COLLECTION_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD7GovernmentRolesProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.government_roles_releases where id = $1 and integrity_status = 'PASS'", [D7_GOVERNMENT_ROLES_RELEASE_ID]);
    if (existing.rows[0]) {
      const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]);
      const count = counts.rows[0];
      if (!count) throw new Error("D7 release projection build is unavailable");
      return { catalogueId: D7_GOVERNMENT_ROLES_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records };
    }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D7_GOVERNMENT_ROLES_ROUTE.id]);
    const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D7 initial Government roles manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D7_GOVERNMENT_ROLES_ROUTE.id, sourcePath: D7_GOVERNMENT_ROLES_ROUTE.path, manifestId, projectionName: "gb_sct_government_roles_d7_v1" });
    await client.query("insert into db1.government_roles_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D7_GOVERNMENT_ROLES_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D7_GOVERNMENT_ROLES_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD8CommitteeRolesProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.committee_roles_releases where id = $1 and integrity_status = 'PASS'", [D8_COMMITTEE_ROLES_RELEASE_ID]);
    if (existing.rows[0]) {
      const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]);
      const count = counts.rows[0];
      if (!count) throw new Error("D8 release projection build is unavailable");
      return { catalogueId: D8_COMMITTEE_ROLES_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records };
    }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D8_COMMITTEE_ROLES_ROUTE.id]);
    const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D8 initial Committee roles manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D8_COMMITTEE_ROLES_ROUTE.id, sourcePath: D8_COMMITTEE_ROLES_ROUTE.path, manifestId, projectionName: "gb_sct_committee_roles_d8_v1" });
    await client.query("insert into db1.committee_roles_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D8_COMMITTEE_ROLES_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D8_COMMITTEE_ROLES_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD9PartyRolesProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.party_roles_releases where id = $1 and integrity_status = 'PASS'", [D9_PARTY_ROLES_RELEASE_ID]);
    if (existing.rows[0]) { const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]); const count = counts.rows[0]; if (!count) throw new Error("D9 release projection build is unavailable"); return { catalogueId: D9_PARTY_ROLES_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records }; }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D9_PARTY_ROLES_ROUTE.id]); const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D9 initial Party roles manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D9_PARTY_ROLES_ROUTE.id, sourcePath: D9_PARTY_ROLES_ROUTE.path, manifestId, projectionName: "gb_sct_party_roles_d9_v1" });
    await client.query("insert into db1.party_roles_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D9_PARTY_ROLES_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D9_PARTY_ROLES_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD10PartiesProjection(options: D4BProjectionOptions): Promise<D4BProjectionResult> {
  return withDb(options, async (client) => {
    const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.parties_releases where id = $1 and integrity_status = 'PASS'", [D10_PARTIES_RELEASE_ID]);
    if (existing.rows[0]) { const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]); const count = counts.rows[0]; if (!count) throw new Error("D10 release projection build is unavailable"); return { catalogueId: D10_PARTIES_RELEASE_ID, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records }; }
    const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [D10_PARTIES_ROUTE.id]); const manifestId = initial.rows[0]?.manifest_id;
    if (!manifestId) throw new Error("D10 initial Parties manifest is unavailable");
    const projection = await d4bProjectionBuild(client, options, { routeId: D10_PARTIES_ROUTE.id, sourcePath: D10_PARTIES_ROUTE.path, manifestId, projectionName: "gb_sct_parties_d10_v1" });
    await client.query("insert into db1.parties_releases (id, projection_build_id, integrity_status, created_at) values ($1, $2, 'PASS', $3)", [D10_PARTIES_RELEASE_ID, projection.buildId, options.now?.() ?? new Date()]);
    return { catalogueId: D10_PARTIES_RELEASE_ID, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords };
  }, options.migrate ?? true);
}

export async function runD11MemberContextProjections(options: D4BProjectionOptions): Promise<D11MemberContextProjectionResult> {
  return withDb(options, async (client) => {
    const releases: D4BProjectionResult[] = [];
    for (const route of D11_MEMBER_CONTEXT_ROUTES) {
      const existing = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.member_context_releases where id = $1 and source_route_id = $2 and integrity_status = 'PASS'", [route.releaseId, route.id]);
      if (existing.rows[0]) {
        const counts = await client.query<{ projected_records: number; rejected_records: number }>("select projected_records, rejected_records from db1.projection_builds where id = $1", [existing.rows[0].projection_build_id]);
        const count = counts.rows[0]; if (!count) throw new Error(`D11 release projection build is unavailable: ${route.id}`);
        releases.push({ catalogueId: route.releaseId, projectionBuildIds: [existing.rows[0].projection_build_id], projectedRecords: count.projected_records, rejectedRecords: count.rejected_records });
        continue;
      }
      const initial = await client.query<{ manifest_id: string }>("select manifest_id from db1.reconciliation_observations where source_route_id = $1 and state = 'INITIAL' and manifest_id is not null order by observed_at asc limit 1", [route.id]);
      const manifestId = initial.rows[0]?.manifest_id;
      if (!manifestId) throw new Error(`D11 initial manifest is unavailable: ${route.id}`);
      const projection = await d4bProjectionBuild(client, options, { routeId: route.id, sourcePath: route.path, manifestId, projectionName: route.releaseId });
      await client.query("insert into db1.member_context_releases (id, source_route_id, projection_build_id, integrity_status, created_at) values ($1, $2, $3, 'PASS', $4)", [route.releaseId, route.id, projection.buildId, options.now?.() ?? new Date()]);
      releases.push({ catalogueId: route.releaseId, projectionBuildIds: [projection.buildId], projectedRecords: projection.projectedRecords, rejectedRecords: projection.rejectedRecords });
    }
    return { releases };
  }, options.migrate ?? true);
}
