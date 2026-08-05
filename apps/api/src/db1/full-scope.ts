import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { link, mkdir, open, readFile, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Pool, type PoolClient } from "pg";

const ORIGIN = "SOURCE_CAPTURE";
const API_ROOT = "https://data.parliament.scot";
const DEFAULT_MAX_BYTES = 16 * 1024 * 1024;
const FIREHOSE_MAX_BYTES = 512 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 120_000;
const FIREHOSE_TIMEOUT_MS = 20 * 60_000;

export interface FullScopeOptions {
  databaseUrl: string;
  rawRoot: string;
  migrationRole?: string;
  codeRevision: string;
}

type Pattern = "DETAIL" | "FIXED_COLLECTION" | "FILTER" | "ANNUAL_DETAIL" | "BASELINE_EXISTING";

interface SourceForm {
  id: string;
  pathTemplate: string;
  pattern: Pattern;
  parentRouteIds?: readonly string[];
  candidateKeys?: readonly string[];
  parameterName?: string;
  maxBytes?: number;
  timeoutMs?: number;
  parentRoutePrefix?: string;
}

const detail = (id: string, pathTemplate: string, parentRouteId: string, candidateKeys: readonly string[]): SourceForm => ({ id, pathTemplate, pattern: "DETAIL", parentRouteIds: [parentRouteId], candidateKeys });

export const FULL_SCOPE_FORMS: readonly SourceForm[] = [
  detail("gb-sct.bills.detail", "/api/bills/{value}", "gb-sct.bills.collection", ["ID"]),
  detail("gb-sct.bill-stages.detail", "/api/billstages/{value}", "gb-sct.bill-stages.collection", ["ID"]),
  detail("gb-sct.bill-stage-types.detail", "/api/billstagetypes/{value}", "gb-sct.bill-stage-types.collection", ["ID"]),
  detail("gb-sct.bill-types.detail", "/api/billtypes/{value}", "gb-sct.bill-types.collection", ["ID"]),
  detail("gb-sct.sessions.detail", "/api/sessions/{value}", "gb-sct.sessions.collection", ["ID"]),
  detail("gb-sct.members.detail", "/api/members/{value}", "gb-sct.members.collection", ["PersonID"]),
  detail("gb-sct.member-constituency-status.detail", "/api/memberelectionconstituencystatuses/{value}", "gb-sct.member-constituency-statuses.collection", ["ID"]),
  detail("gb-sct.member-region-status.detail", "/api/memberelectionregionstatuses/{value}", "gb-sct.member-region-statuses.collection", ["ID"]),
  detail("gb-sct.constituencies.detail", "/api/constituencies/{value}", "gb-sct.constituencies.collection", ["ID"]),
  detail("gb-sct.regions.detail", "/api/regions/{value}", "gb-sct.regions.collection", ["ID"]),
  detail("gb-sct.parties.detail", "/api/parties/{value}", "gb-sct.parties.collection", ["ID"]),
  detail("gb-sct.member-parties.detail", "/api/memberparties/{value}", "gb-sct.member-parties.collection", ["ID"]),
  detail("gb-sct.party-roles.detail", "/api/partyroles/{value}", "gb-sct.party-roles.collection", ["ID"]),
  detail("gb-sct.member-party-roles.detail", "/api/memberpartyroles/{value}", "gb-sct.member-party-roles.collection", ["ID"]),
  detail("gb-sct.government-roles.detail", "/api/governmentroles/{value}", "gb-sct.government-roles.collection", ["ID"]),
  detail("gb-sct.member-government-roles.detail", "/api/membergovernmentroles/{value}", "gb-sct.member-government-roles.collection", ["ID"]),
  detail("gb-sct.committees.detail", "/api/committees/{value}", "gb-sct.committees.collection", ["ID"]),
  detail("gb-sct.committee-roles.detail", "/api/committeeroles/{value}", "gb-sct.committee-roles.collection", ["ID"]),
  detail("gb-sct.committee-types.detail", "/api/committeetypes/{value}", "gb-sct.committee-types.collection", ["ID"]),
  detail("gb-sct.mqa-event-types.detail", "/api/motionsquestionsanswerseventtypes/{value}", "gb-sct.mqa-event-types.collection", ["EventTypeID"]),
  detail("gb-sct.mqa-event-subtypes.detail", "/api/motionsquestionsanswerseventsubtypes/{value}", "gb-sct.mqa-event-subtypes.collection", ["EventSubTypeID"]),
  { id: "gb-sct.mqa-events.collection", pathTemplate: "/api/motionsquestionsanswersevents", pattern: "FIXED_COLLECTION", maxBytes: FIREHOSE_MAX_BYTES, timeoutMs: FIREHOSE_TIMEOUT_MS },
  { id: "gb-sct.mqa-motions.collection", pathTemplate: "/api/motionsquestionsanswersmotions", pattern: "FIXED_COLLECTION", maxBytes: FIREHOSE_MAX_BYTES, timeoutMs: FIREHOSE_TIMEOUT_MS },
  { id: "gb-sct.mqa-questions.collection", pathTemplate: "/api/motionsquestionsanswersquestions", pattern: "FIXED_COLLECTION", maxBytes: FIREHOSE_MAX_BYTES, timeoutMs: FIREHOSE_TIMEOUT_MS },
  { id: "gb-sct.mqa-supports.collection", pathTemplate: "/api/motionsquestionsanswerssupports", pattern: "FIXED_COLLECTION", maxBytes: FIREHOSE_MAX_BYTES, timeoutMs: FIREHOSE_TIMEOUT_MS },
  detail("gb-sct.mqa-events.detail", "/api/motionsquestionsanswersevents/{value}", "gb-sct.mqa-events.collection", ["UniqueID", "EventUniqueID", "ID"]),
  detail("gb-sct.mqa-motions.detail", "/api/motionsquestionsanswersmotions/{value}", "gb-sct.mqa-motions.collection", ["UniqueID", "MainUniqueID", "ID"]),
  detail("gb-sct.mqa-questions.detail", "/api/motionsquestionsanswersquestions/{value}", "gb-sct.mqa-questions.collection", ["MainUniqueID", "UniqueID", "ID"]),
  detail("gb-sct.mqa-supports.detail", "/api/motionsquestionsanswerssupports/{value}", "gb-sct.mqa-supports.collection", ["UniqueID", "MainUniqueID", "ID"]),
  { id: "gb-sct.mqa-event-links.child", pathTemplate: "/api/motionsquestionsanswerseventlinks?childUniqueId={value}", pattern: "FILTER", parentRouteIds: ["gb-sct.mqa-event-links.collection"], candidateKeys: ["ChildUniqueID"], parameterName: "childUniqueId" },
  { id: "gb-sct.mqa-event-links.main", pathTemplate: "/api/motionsquestionsanswerseventlinks?mainUniqueId={value}", pattern: "FILTER", parentRouteIds: ["gb-sct.mqa-event-links.collection"], candidateKeys: ["MainUniqueID"], parameterName: "mainUniqueId" },
  { id: "gb-sct.mqa-event-links.parent", pathTemplate: "/api/motionsquestionsanswerseventlinks?parentUniqueId={value}", pattern: "FILTER", parentRouteIds: ["gb-sct.mqa-event-links.collection"], candidateKeys: ["ParentUniqueID"], parameterName: "parentUniqueId" },
  { id: "gb-sct.committee-reports.detail", pathTemplate: "/api/Orscommitteemeeting/{value}", pattern: "ANNUAL_DETAIL", candidateKeys: ["ID", "UniqueID"], parentRoutePrefix: "gb-sct.committee-official-reports-" },
  { id: "gb-sct.plenary-reports.detail", pathTemplate: "/api/orsplenarymeeting/{value}", pattern: "ANNUAL_DETAIL", candidateKeys: ["ID", "UniqueID"], parentRoutePrefix: "gb-sct.plenary-official-reports-" },
  { id: "gb-sct.motion-votes.detail", pathTemplate: "/api/votesmotion/{value}", pattern: "ANNUAL_DETAIL", candidateKeys: ["ID", "UniqueID"], parentRoutePrefix: "gb-sct.votes-on-motions-" }
];

/** The previously retained 29 forms are registered once, not once per year. */
const BASELINE_FORMS: readonly SourceForm[] = [
  { id: "gb-sct.bills.collection", pathTemplate: "/api/bills", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.bill-stages.collection", pathTemplate: "/api/billstages", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.bill-stage-types.collection", pathTemplate: "/api/billstagetypes", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.bill-types.collection", pathTemplate: "/api/billtypes", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.sessions.collection", pathTemplate: "/api/sessions", pattern: "BASELINE_EXISTING" },
  { id: "gb-sct.members.collection", pathTemplate: "/api/members", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.member-constituency-statuses.collection", pathTemplate: "/api/memberelectionconstituencystatuses", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.member-region-statuses.collection", pathTemplate: "/api/memberelectionregionstatuses", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.constituencies.collection", pathTemplate: "/api/constituencies", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.regions.collection", pathTemplate: "/api/regions", pattern: "BASELINE_EXISTING" },
  { id: "gb-sct.parties.collection", pathTemplate: "/api/parties", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.member-parties.collection", pathTemplate: "/api/memberparties", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.party-roles.collection", pathTemplate: "/api/partyroles", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.member-party-roles.collection", pathTemplate: "/api/memberpartyroles", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.government-roles.collection", pathTemplate: "/api/governmentroles", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.member-government-roles.collection", pathTemplate: "/api/membergovernmentroles", pattern: "BASELINE_EXISTING" },
  { id: "gb-sct.committees.collection", pathTemplate: "/api/committees", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.committee-roles.collection", pathTemplate: "/api/committeeroles", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.committee-types.collection", pathTemplate: "/api/committeetypes", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.committee-type-links.collection", pathTemplate: "/api/committeetypelinks", pattern: "BASELINE_EXISTING" },
  { id: "gb-sct.mqa-event-types.collection", pathTemplate: "/api/motionsquestionsanswerseventtypes", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.mqa-event-subtypes.collection", pathTemplate: "/api/motionsquestionsanswerseventsubtypes", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.mqa-event-links.collection", pathTemplate: "/api/motionsquestionsanswerseventlinks", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.mqa-business-motions.consideration", pathTemplate: "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.mqa-business-motions.programme", pathTemplate: "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme", pattern: "BASELINE_EXISTING" },
  { id: "gb-sct.mqa-questions.year", pathTemplate: "/api/motionsquestionsanswersquestions?year={year}", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.motion-votes.year", pathTemplate: "/api/votesmotion?year={year}", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.committee-reports.year", pathTemplate: "/api/orscommitteemeeting?year={year}", pattern: "BASELINE_EXISTING" }, { id: "gb-sct.plenary-reports.year", pathTemplate: "/api/orsplenarymeeting?year={year}", pattern: "BASELINE_EXISTING" }
];
const ALL_SOURCE_FORMS = [...BASELINE_FORMS, ...FULL_SCOPE_FORMS] as const;
export const FULL_DB1_SOURCE_FORM_COUNT = ALL_SOURCE_FORMS.length;

const now = () => new Date().toISOString();
const rawPath = (digest: string) => `sha256/${digest}.json`;

function dynamicRouteId(formId: string, path: string): string {
  return `${formId}.${createHash("sha256").update(path).digest("hex").slice(0, 20)}`;
}

async function withClient<T>(options: FullScopeOptions, action: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: options.databaseUrl, max: 1 });
  const client = await pool.connect();
  try { return await action(client); } finally { client.release(); await pool.end(); }
}

export async function migrateFullScope(options: FullScopeOptions): Promise<void> {
  await withClient(options, async (client) => {
    await client.query("begin");
    try {
      await client.query(`set role ${quote(options.migrationRole ?? "cld_gb_sct_migrate")}`);
      const foundation = await client.query("select 1 from db1.schema_migrations where id = '023_projection_structure_profiles'");
      if (!foundation.rowCount) throw new Error("FULL_SCOPE_FOUNDATION_MISSING");
      const prior = await client.query("select 1 from db1.schema_migrations where id = '024_full_scope_capture_universes'");
      if (!prior.rowCount) {
        await client.query("create table db1.source_forms (id text primary key, route_template text not null, request_method text not null default 'GET', handling_class text not null default 'RESTRICTED_PROJECT', form_status text not null default 'ACTIVE', capture_pattern text not null check (capture_pattern in ('DETAIL','FIXED_COLLECTION','FILTER','ANNUAL_DETAIL','BASELINE_EXISTING')), created_at timestamptz not null default now())");
        await client.query("create table db1.capture_universes (id uuid primary key, source_form_id text not null references db1.source_forms(id), parent_manifest_ids jsonb not null, extraction_rule text not null, candidate_count integer not null check (candidate_count >= 0), status text not null check (status in ('READY','UNRESOLVED','COMPLETE')), created_at timestamptz not null default now())");
        await client.query("create table db1.capture_universe_members (universe_id uuid not null references db1.capture_universes(id), ordinal integer not null check (ordinal >= 0), request_path text not null, source_route_id text not null references db1.source_routes(id), primary key (universe_id, ordinal), unique (universe_id, request_path))");
        await client.query("create table db1.source_conditions (id uuid primary key, source_form_id text not null references db1.source_forms(id), source_route_id text references db1.source_routes(id), manifest_id uuid references db1.manifest_entries(id), condition_code text not null, http_status integer, observed_at timestamptz not null)");
        await client.query("create table db1.form_update_controls (source_form_id text primary key references db1.source_forms(id), cadence text not null check (cadence in ('DAILY_PARENT_WEEKLY_FULL','DAILY_FULL','WEEKLY_RECHECK')), next_due_at timestamptz, last_cycle_id uuid references db1.reconciliation_cycles(id), updated_at timestamptz not null default now())");
        await client.query("insert into db1.schema_migrations (id) values ('024_full_scope_capture_universes')");
      }
      for (const form of ALL_SOURCE_FORMS) await client.query("insert into db1.source_forms (id, route_template, capture_pattern) values ($1,$2,$3) on conflict (id) do update set route_template=excluded.route_template, capture_pattern=excluded.capture_pattern", [form.id, form.pathTemplate, form.pattern]);
      await client.query("commit");
    } catch (error) { await client.query("rollback"); throw error; }
  });
}

function quote(value: string): string { return `"${value.replaceAll('"', '""')}"`; }

async function persistResponse(rawRoot: string, response: Response, maxBytes: number): Promise<{ digest: string; byteLength: number; relativePath: string; contentType: string }> {
  if (!response.body) throw new Error("EMPTY_BODY");
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error("BODY_TOO_LARGE");
  const temporary = resolve(rawRoot, `.fullscope-${randomUUID()}.part`);
  const file = await open(temporary, "wx", 0o640);
  const hash = createHash("sha256"); let byteLength = 0;
  let completed = false;
  try {
    const reader = response.body.getReader();
    for (;;) {
      const piece = await reader.read();
      if (piece.done) break;
      byteLength += piece.value.byteLength;
      if (byteLength > maxBytes) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
      hash.update(piece.value); await file.write(piece.value);
    }
    completed = true;
  } finally {
    await file.close();
    if (!completed) await unlink(temporary).catch(() => undefined);
  }
  const digest = hash.digest("hex"); const relativePath = rawPath(digest); const target = resolve(rawRoot, relativePath);
  await mkdir(dirname(target), { recursive: true, mode: 0o750 });
  try { await link(temporary, target); } catch (error: unknown) { if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") throw error; }
  await unlink(temporary).catch(() => undefined);
  return { digest, byteLength, relativePath, contentType: response.headers.get("content-type") ?? "" };
}

async function latestParent(client: PoolClient, routeId: string): Promise<{ manifestId: string; records: Record<string, unknown>[] }> {
  const build = await client.query<{ id: string; manifest_id: string }>("select p.id, p.manifest_id from db1.projection_builds p join db1.manifest_entries m on m.id=p.manifest_id join db1.capture_runs c on c.id=m.capture_run_id where c.source_route_id=$1 and p.origin_class='SOURCE_CAPTURE' and p.integrity_status='PASS' order by p.created_at desc limit 1", [routeId]);
  const selected = build.rows[0];
  if (!selected) throw new Error(`PARENT_PROJECTION_MISSING:${routeId}`);
  const rows = await client.query<{ preserved_record: Record<string, unknown> }>("select preserved_record from db1.projection_records where projection_build_id=$1 order by source_position", [selected.id]);
  return { manifestId: selected.manifest_id, records: rows.rows.map((row) => row.preserved_record) };
}

function deriveValues(records: readonly Record<string, unknown>[], keys: readonly string[], formId: string): { key: string; values: string[] } {
  const matches = keys.filter((key) => records.length > 0 && records.every((record) => typeof record[key] === "string" || typeof record[key] === "number"));
  const key = matches[0];
  if (!key || matches.length !== 1) throw new Error(`UNIVERSE_IDENTIFIER_UNRESOLVED:${formId}`);
  return { key, values: [...new Set(records.map((record) => String(record[key])).filter(Boolean))].sort() };
}

async function createUniverse(client: PoolClient, form: SourceForm, parent: { manifestId: string; records: Record<string, unknown>[] }): Promise<{ id: string; paths: string[] }> {
  const derived = deriveValues(parent.records, form.candidateKeys ?? [], form.id); const id = randomUUID();
  const paths = derived.values.map((value) => form.pathTemplate.replace("{value}", encodeURIComponent(value)));
  await client.query("insert into db1.capture_universes (id, source_form_id, parent_manifest_ids, extraction_rule, candidate_count, status) values ($1,$2,$3,$4,$5,'READY')", [id, form.id, JSON.stringify([parent.manifestId]), `SOURCE_FIELD_${derived.key}_V1`, paths.length]);
  for (const [ordinal, path] of paths.entries()) {
    const routeId = dynamicRouteId(form.id, path);
    await client.query("insert into db1.source_routes (id, origin_class, source_path, handling_class) values ($1,$2,$3,'RESTRICTED_PROJECT') on conflict (id) do nothing", [routeId, ORIGIN, path]);
    await client.query("insert into db1.capture_universe_members (universe_id, ordinal, request_path, source_route_id) values ($1,$2,$3,$4)", [id, ordinal, path, routeId]);
  }
  return { id, paths };
}

interface CaptureResult { state: "SUCCEEDED" | "CONDITION"; manifestId?: string; raw?: { digest: string; byteLength: number; relativePath: string; contentType: string }; }

async function writeProjectionStructureProfile(client: PoolClient, buildId: string): Promise<void> {
  await client.query("insert into db1.projection_structure_profiles (projection_build_id, observed_structure, profiled_at, profile_method) select $1, coalesce(jsonb_agg(jsonb_build_object('key', key, 'observed_types', to_jsonb(observed_types), 'record_count', record_count) order by key), '[]'::jsonb), now(), 'DB1_JSON_OBJECT_FIELD_SCAN_V1' from (select field.key, array_agg(distinct jsonb_typeof(field.value) order by jsonb_typeof(field.value)) as observed_types, count(*) as record_count from db1.projection_records record cross join lateral jsonb_each(record.preserved_record) as field(key, value) where record.projection_build_id = $1 group by field.key) fields on conflict (projection_build_id) do update set observed_structure=excluded.observed_structure, profiled_at=excluded.profiled_at, profile_method=excluded.profile_method", [buildId]);
}

/**
 * This deliberately preserves object records exactly.  It is an operational
 * index for completeness and later record browsing, never a DB2 codebook.
 */
type ProjectionShape = { topLevel: "ARRAY" | "OBJECT"; objectFieldCount?: number };

async function* streamedObjectArray(path: string): AsyncGenerator<Record<string, unknown>> {
  const decoder = new TextDecoder("utf8");
  let began = false; let ended = false; let depth = 0; let inString = false; let escaped = false; let record = "";
  for await (const chunk of createReadStream(path)) {
    const text = decoder.decode(chunk, { stream: true });
    for (const character of text) {
      if (ended) { if (!/\s/.test(character)) throw new Error("JSON_TRAILING_CONTENT"); continue; }
      if (!began) { if (/\s/.test(character)) continue; if (character !== "[") throw new Error("JSON_ARRAY_REQUIRED"); began = true; continue; }
      if (depth === 0) {
        if (/\s/.test(character) || character === ",") continue;
        if (character === "]") { ended = true; continue; }
        if (character !== "{") throw new Error("JSON_ARRAY_OBJECT_REQUIRED");
        depth = 1; record = character; continue;
      }
      record += character;
      if (inString) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === '"') inString = false;
        continue;
      }
      if (character === '"') inString = true;
      else if (character === "{") depth += 1;
      else if (character === "}") {
        depth -= 1;
        if (depth === 0) {
          let parsed: unknown;
          try { parsed = JSON.parse(record); } catch { throw new Error("JSON_RECORD_PARSE_FAILURE"); }
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("JSON_ARRAY_OBJECT_REQUIRED");
          yield parsed as Record<string, unknown>;
          record = "";
        }
      }
    }
  }
  const tail = decoder.decode();
  if (tail.trim()) throw new Error("JSON_DECODER_TAIL");
  if (!began || !ended || depth !== 0 || inString) throw new Error("JSON_ARRAY_INCOMPLETE");
}

async function projectCapturedResponse(client: PoolClient, options: FullScopeOptions, manifestId: string, raw: { digest: string; byteLength: number; relativePath: string }): Promise<ProjectionShape> {
  const existing = await client.query("select 1 from db1.projection_builds where manifest_id=$1 and origin_class='SOURCE_CAPTURE' and projection_name='db1.full_scope.raw_array.v1'", [manifestId]);
  if (existing.rowCount) return { topLevel: "ARRAY" };
  const target = resolve(options.rawRoot, raw.relativePath);
  if (target !== resolve(options.rawRoot) && !target.startsWith(`${resolve(options.rawRoot)}/`)) throw new Error("RAW_PATH_ESCAPE");
  const largeArray = raw.byteLength > 32 * 1024 * 1024;
  let topLevel: ProjectionShape;
  let records: unknown[] | undefined;
  if (largeArray) topLevel = { topLevel: "ARRAY" };
  else {
    const bytes = await readFile(target);
    if (bytes.byteLength !== raw.byteLength || createHash("sha256").update(bytes).digest("hex") !== raw.digest) throw new Error("RAW_INTEGRITY_FAILURE");
    let payload: unknown;
    try { payload = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("JSON_PARSE_FAILURE"); }
    topLevel = Array.isArray(payload)
      ? { topLevel: "ARRAY" }
      : payload && typeof payload === "object" ? { topLevel: "OBJECT", objectFieldCount: Object.keys(payload).length }
        : (() => { throw new Error("JSON_OBJECT_OR_ARRAY_REQUIRED"); })();
    records = Array.isArray(payload) ? payload : [payload];
  }
  const buildId = randomUUID();
  await client.query("begin");
  try {
    await client.query("insert into db1.projection_builds (id,manifest_id,origin_class,projection_name,schema_version,code_revision,integrity_status) values ($1,$2,'SOURCE_CAPTURE','db1.full_scope.raw_array.v1','db1-full-scope-raw-array-v1',$3,'PASS')", [buildId, manifestId, options.codeRevision]);
    let projected = 0; let rejected = 0;
    let position = 0;
    const writeBatch = async (batch: readonly unknown[]): Promise<void> => {
      const accepted: Array<{ position: number; record: Record<string, unknown> }> = batch.flatMap((record, index) => record && typeof record === "object" && !Array.isArray(record) ? [{ position: position + index, record: record as Record<string, unknown> }] : []);
      const rejectedRows: Array<{ position: number }> = batch.flatMap((record, index) => record && typeof record === "object" && !Array.isArray(record) ? [] : [{ position: position + index }]);
      if (accepted.length) {
        const params: unknown[] = []; const values = accepted.map((item, index) => { const base = index * 5; params.push(randomUUID(), buildId, manifestId, item.position, item.record); return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5})`; });
        await client.query(`insert into db1.projection_records (id,projection_build_id,manifest_id,source_position,preserved_record) values ${values.join(",")}`, params);
        projected += accepted.length;
      }
      if (rejectedRows.length) {
        const params: unknown[] = []; const values = rejectedRows.map((item, index) => { const base = index * 5; params.push(randomUUID(), buildId, manifestId, item.position, "NOT_AN_OBJECT"); return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5})`; });
        await client.query(`insert into db1.projection_rejections (id,projection_build_id,manifest_id,source_position,reason_code) values ${values.join(",")}`, params);
        rejected += rejectedRows.length;
      }
      position += batch.length;
    };
    if (records) for (let start = 0; start < records.length; start += 250) await writeBatch(records.slice(start, start + 250));
    else {
      let batch: Record<string, unknown>[] = [];
      for await (const item of streamedObjectArray(target)) { batch.push(item); if (batch.length === 250) { await writeBatch(batch); batch = []; } }
      if (batch.length) await writeBatch(batch);
    }
    await client.query("update db1.projection_builds set projected_records=$2,rejected_records=$3 where id=$1", [buildId, projected, rejected]);
    await client.query("commit");
  } catch (error) { await client.query("rollback"); throw error; }
  await writeProjectionStructureProfile(client, buildId);
  return topLevel;
}

async function capturePath(client: PoolClient, options: FullScopeOptions, form: SourceForm, path: string, routeId: string): Promise<CaptureResult> {
  const cycleId = randomUUID(); const runId = randomUUID(); const started = now();
  await client.query("insert into db1.reconciliation_cycles (id, started_at, status) values ($1,$2,'IN_PROGRESS')", [cycleId, started]);
  await client.query("insert into db1.capture_runs (id, source_route_id, origin_class, started_at, status) values ($1,$2,$3,$4,'IN_PROGRESS')", [runId, routeId, ORIGIN, started]);
  try {
    const response = await fetch(`${API_ROOT}${path}`, { method: "GET", headers: { accept: "application/json" }, redirect: "manual", signal: AbortSignal.timeout(form.timeoutMs ?? DEFAULT_TIMEOUT_MS) });
    const raw = await persistResponse(options.rawRoot, response, form.maxBytes ?? DEFAULT_MAX_BYTES);
    const manifestId = randomUUID(); const success = response.status >= 200 && response.status < 300;
    await client.query("insert into db1.raw_objects (digest, origin_class, relative_path, byte_length, content_type) values ($1,$2,$3,$4,$5) on conflict (digest) do nothing", [raw.digest, ORIGIN, raw.relativePath, raw.byteLength, raw.contentType]);
    await client.query("insert into db1.manifest_entries (id,capture_run_id,raw_digest,origin_class,content_type,byte_length,status,retrieved_at) values ($1,$2,$3,$4,$5,$6,'SUCCEEDED',$7)", [manifestId, runId, raw.digest, ORIGIN, raw.contentType, raw.byteLength, now()]);
    await client.query("update db1.capture_runs set finished_at=$2,status='SUCCEEDED' where id=$1", [runId, now()]);
    await client.query("insert into db1.reconciliation_observations (id,cycle_id,source_route_id,capture_run_id,manifest_id,state,raw_digest,observed_at) values ($1,$2,$3,$4,$5,'INITIAL',$6,$7)", [randomUUID(), cycleId, routeId, runId, manifestId, raw.digest, now()]);
    if (!success) await client.query("insert into db1.source_conditions (id,source_form_id,source_route_id,manifest_id,condition_code,http_status,observed_at) values ($1,$2,$3,$4,'HTTP_STATUS',$5,$6)", [randomUUID(), form.id, routeId, manifestId, response.status, now()]);
    if (success) {
      try {
        const shape = await projectCapturedResponse(client, options, manifestId, raw);
        const contractCondition = (form.pattern === "FIXED_COLLECTION" && shape.topLevel !== "ARRAY")
          || (form.pattern === "ANNUAL_DETAIL" && shape.topLevel === "OBJECT" && shape.objectFieldCount === 0);
        if (contractCondition) {
          const code = form.pattern === "ANNUAL_DETAIL" ? "EMPTY_OBJECT_DETAIL_CONTRACT" : "COLLECTION_SHAPE_UNRESOLVED";
          await client.query("insert into db1.source_conditions (id,source_form_id,source_route_id,manifest_id,condition_code,observed_at) values ($1,$2,$3,$4,$5,$6)", [randomUUID(), form.id, routeId, manifestId, code, now()]);
          await client.query("update db1.reconciliation_cycles set finished_at=$2,status='PARTIAL' where id=$1", [cycleId, now()]);
          return { state: "CONDITION", manifestId, raw };
        }
      }
      catch (error) {
        const code = error instanceof Error ? error.message.slice(0, 100) : "PROJECTION_FAILED";
        await client.query("insert into db1.source_conditions (id,source_form_id,source_route_id,manifest_id,condition_code,observed_at) values ($1,$2,$3,$4,$5,$6)", [randomUUID(), form.id, routeId, manifestId, code, now()]);
        await client.query("update db1.reconciliation_cycles set finished_at=$2,status='PARTIAL' where id=$1", [cycleId, now()]);
        return { state: "CONDITION", manifestId, raw };
      }
    }
    await client.query("update db1.reconciliation_cycles set finished_at=$2,status='SUCCEEDED' where id=$1", [cycleId, now()]);
    return { state: success ? "SUCCEEDED" : "CONDITION", manifestId, raw };
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 100) : "CAPTURE_FAILED";
    await client.query("insert into db1.manifest_entries (id,capture_run_id,origin_class,status,retrieved_at,failure_code) values ($1,$2,$3,'FAILED',$4,$5)", [randomUUID(), runId, ORIGIN, now(), code]);
    await client.query("update db1.capture_runs set finished_at=$2,status='FAILED' where id=$1", [runId, now()]);
    await client.query("insert into db1.reconciliation_observations (id,cycle_id,source_route_id,capture_run_id,state,failure_code,observed_at) values ($1,$2,$3,$4,'FAILED',$5,$6)", [randomUUID(), cycleId, routeId, runId, code, now()]);
    await client.query("insert into db1.source_conditions (id,source_form_id,source_route_id,condition_code,observed_at) values ($1,$2,$3,$4,$5)", [randomUUID(), form.id, routeId, code, now()]);
    await client.query("update db1.reconciliation_cycles set finished_at=$2,status='FAILED' where id=$1", [cycleId, now()]);
    return { state: "CONDITION" };
  }
}

async function captureWithDedicatedClient(options: FullScopeOptions, form: SourceForm, path: string, routeId: string): Promise<CaptureResult> {
  return withClient(options, (client) => capturePath(client, options, form, path, routeId));
}

async function concurrent<T>(items: readonly T[], limit: number, action: (item: T) => Promise<void>): Promise<void> {
  let next = 0; const workers = Array.from({ length: Math.min(limit, items.length) }, async () => { for (;;) { const index = next++; if (index >= items.length) return; await action(items[index]!); } });
  await Promise.all(workers);
}

export async function runFullScopeReferenceDetails(options: FullScopeOptions): Promise<{ forms: number; attempted: number; conditions: number }> {
  await migrateFullScope(options); let attempted = 0; let conditions = 0;
  await withClient(options, async (client) => {
    const forms = FULL_SCOPE_FORMS.filter((form) => form.pattern === "DETAIL" && !["gb-sct.mqa-events.detail", "gb-sct.mqa-motions.detail", "gb-sct.mqa-questions.detail", "gb-sct.mqa-supports.detail"].includes(form.id));
    for (const form of forms) {
      const parentRouteId = form.parentRouteIds?.[0];
      if (!parentRouteId) throw new Error(`PARENT_ROUTE_MISSING:${form.id}`);
      const parent = await latestParent(client, parentRouteId);
      const universe = await createUniverse(client, form, parent);
      await concurrent(universe.paths, 4, async (path) => { attempted += 1; const result = await captureWithDedicatedClient(options, form, path, dynamicRouteId(form.id, path)); if (result.state !== "SUCCEEDED") conditions += 1; });
      await client.query("update db1.capture_universes set status='COMPLETE' where id=$1", [universe.id]);
    }
  });
  return { forms: 21, attempted, conditions };
}

export async function runFullScopeMqaCollections(options: FullScopeOptions): Promise<{ forms: number; conditions: number }> {
  await migrateFullScope(options); let conditions = 0;
  await withClient(options, async (client) => {
    for (const form of FULL_SCOPE_FORMS.filter((item) => item.pattern === "FIXED_COLLECTION")) {
      const routeId = form.id; await client.query("insert into db1.source_routes (id,origin_class,source_path,handling_class) values ($1,$2,$3,'RESTRICTED_PROJECT') on conflict (id) do nothing", [routeId, ORIGIN, form.pathTemplate]);
      if ((await captureWithDedicatedClient(options, form, form.pathTemplate, routeId)).state !== "SUCCEEDED") conditions += 1;
    }
  });
  return { forms: 4, conditions };
}

export async function runFullScopeMqaDependents(options: FullScopeOptions): Promise<{ forms: number; attempted: number; conditions: number }> {
  await migrateFullScope(options);
  let attempted = 0; let conditions = 0;
  await withClient(options, async (client) => {
    const forms = FULL_SCOPE_FORMS.filter((form) => form.pattern === "FILTER" || ["gb-sct.mqa-events.detail", "gb-sct.mqa-motions.detail", "gb-sct.mqa-questions.detail", "gb-sct.mqa-supports.detail"].includes(form.id));
    for (const form of forms) {
      const parentRouteId = form.parentRouteIds?.[0];
      if (!parentRouteId) throw new Error(`PARENT_ROUTE_MISSING:${form.id}`);
      const parent = await latestParent(client, parentRouteId);
      const universe = await createUniverse(client, form, parent);
      await concurrent(universe.paths, 4, async (path) => {
        attempted += 1;
        const result = await captureWithDedicatedClient(options, form, path, dynamicRouteId(form.id, path));
        if (result.state !== "SUCCEEDED") conditions += 1;
      });
      await client.query("update db1.capture_universes set status='COMPLETE' where id=$1", [universe.id]);
    }
  });
  return { forms: 7, attempted, conditions };
}

async function annualParents(client: PoolClient, prefix: string): Promise<Array<{ manifestId: string; records: Record<string, unknown>[] }>> {
  const routes = await client.query<{ id: string }>("select id from db1.source_routes where id like $1 order by id", [`${prefix}%`]);
  const parents: Array<{ manifestId: string; records: Record<string, unknown>[] }> = [];
  for (const route of routes.rows) {
    try { parents.push(await latestParent(client, route.id)); }
    catch (error) { if (!(error instanceof Error) || !error.message.startsWith("PARENT_PROJECTION_MISSING:")) throw error; }
  }
  if (!parents.length) throw new Error(`ANNUAL_PARENT_PROJECTION_MISSING:${prefix}`);
  return parents;
}

async function createAnnualUniverse(client: PoolClient, form: SourceForm, parents: readonly { manifestId: string; records: Record<string, unknown>[] }[]): Promise<{ id: string; paths: string[] }> {
  const derived = deriveValues(parents.flatMap((parent) => parent.records), form.candidateKeys ?? [], form.id);
  const id = randomUUID(); const paths = derived.values.map((value) => form.pathTemplate.replace("{value}", encodeURIComponent(value)));
  await client.query("insert into db1.capture_universes (id,source_form_id,parent_manifest_ids,extraction_rule,candidate_count,status) values ($1,$2,$3,$4,$5,'READY')", [id, form.id, JSON.stringify(parents.map((parent) => parent.manifestId)), `SOURCE_FIELD_${derived.key}_MULTI_PARENT_V1`, paths.length]);
  for (const [ordinal, path] of paths.entries()) {
    const routeId = dynamicRouteId(form.id, path);
    await client.query("insert into db1.source_routes (id,origin_class,source_path,handling_class) values ($1,$2,$3,'RESTRICTED_PROJECT') on conflict (id) do nothing", [routeId, ORIGIN, path]);
    await client.query("insert into db1.capture_universe_members (universe_id,ordinal,request_path,source_route_id) values ($1,$2,$3,$4)", [id, ordinal, path, routeId]);
  }
  return { id, paths };
}

/**
 * Run-D always makes a positional contract sample first.  A non-array/empty
 * detail response is retained as a source condition and stops only that form.
 */
export async function runFullScopeAnnualDetails(options: FullScopeOptions): Promise<{ forms: number; attempted: number; contractConditions: number }> {
  await migrateFullScope(options);
  let attempted = 0; let contractConditions = 0;
  await withClient(options, async (client) => {
    for (const form of FULL_SCOPE_FORMS.filter((item) => item.pattern === "ANNUAL_DETAIL")) {
      if (!form.parentRoutePrefix) throw new Error(`ANNUAL_PARENT_PREFIX_MISSING:${form.id}`);
      const universe = await createAnnualUniverse(client, form, await annualParents(client, form.parentRoutePrefix));
      const sampleIndexes = [...new Set([0, Math.floor((universe.paths.length - 1) / 2), universe.paths.length - 1])].filter((index) => index >= 0);
      let sampleFailed = false;
      for (const index of sampleIndexes) {
        const path = universe.paths[index]!; attempted += 1;
        if ((await captureWithDedicatedClient(options, form, path, dynamicRouteId(form.id, path))).state !== "SUCCEEDED") { sampleFailed = true; contractConditions += 1; }
      }
      if (sampleFailed) { await client.query("update db1.capture_universes set status='UNRESOLVED' where id=$1", [universe.id]); continue; }
      const sampleSet = new Set(sampleIndexes);
      await concurrent(universe.paths.filter((_, index) => !sampleSet.has(index)), 4, async (path) => {
        attempted += 1;
        if ((await captureWithDedicatedClient(options, form, path, dynamicRouteId(form.id, path))).state !== "SUCCEEDED") contractConditions += 1;
      });
      await client.query("update db1.capture_universes set status='COMPLETE' where id=$1", [universe.id]);
    }
  });
  return { forms: 3, attempted, contractConditions };
}
