import { Pool } from "pg";
import {
  D4B_REFERENCE_CATALOGUE_ID,
  D4B_REFERENCE_PROJECTIONS,
  D4C_INSTITUTIONAL_CATALOGUE_ID,
  D4C_INSTITUTIONAL_ROUTES,
  D5_FORMAL_STAGES_RELEASE_ID,
  D5_FORMAL_STAGES_ROUTE,
  D6_BILLS_COLLECTION_RELEASE_ID,
  D6_BILLS_COLLECTION_ROUTE,
  D7_GOVERNMENT_ROLES_RELEASE_ID,
  D7_GOVERNMENT_ROLES_ROUTE,
  D8_COMMITTEE_ROLES_RELEASE_ID,
  D8_COMMITTEE_ROLES_ROUTE,
  D9_PARTY_ROLES_RELEASE_ID,
  D9_PARTY_ROLES_ROUTE,
  D10_PARTIES_RELEASE_ID,
  D10_PARTIES_ROUTE,
  D11_MEMBER_CONTEXT_ROUTES,
  D12_COMMITTEES_RELEASE_ID,
  D12_COMMITTEES_ROUTE,
  D13_MQA_TAXONOMY_LINK_ROUTES,
  D14_MQA_EVENT_SUBTYPES_RELEASE_ID,
  D14_MQA_EVENT_SUBTYPES_ROUTE,
  D15_MQA_CONSIDERATION_RELEASE_ID,
  D15_MQA_CONSIDERATION_ROUTE,
  D16_MQA_PROGRAMME_RELEASE_ID,
  D16_MQA_PROGRAMME_ROUTE,
  type SourcePreservingProjectionSpec,
  D3_BILL_TYPES_MANIFEST_ID,
  D3_BILL_TYPES_PROJECTION,
  D3_BILL_TYPES_ROUTE_ID
} from "./foundation.js";

export interface Db1ExplorerConfig { databaseUrl: string; }

export type Db1ExplorerRecord = { source_position: number; preserved_record: Record<string, unknown>; };

export type Db1ExplorerResponse = {
  layer: "DB1_OPERATIONAL_PROJECTION";
  availability: "RESTRICTED_PRIVATE_BETA";
  reconciliation_state: string;
  raw_access: "NOT_EXPOSED";
  source: {
    route_id: string;
    source_path: string;
    capture_run_id: string;
    manifest_id: string;
    retrieved_at: string;
    raw_sha256: string;
    raw_byte_length: number;
    content_type: string;
    handling_class: string;
  };
  projection: {
    build_id: string;
    name: string;
    schema_version: string;
    code_revision: string;
    built_at: string;
    integrity_status: string;
    projected_records: number;
    rejected_records: number;
  };
  observed_structure: Array<{ key: string; observed_types: string[]; record_count: number }>;
  limitations: string[];
  records: Db1ExplorerRecord[];
};

export type Db1ReferenceCatalogueResponse = {
  layer: "DB1_OPERATIONAL_PROJECTION_CATALOGUE";
  availability: "RESTRICTED_PRIVATE_BETA";
  baseline: string;
  catalogue: { id: string; integrity_status: string; built_at: string; };
  limitations: string[];
  panels: Db1ExplorerResponse[];
};

export type Db1AccessPlanResponse = Omit<Db1ExplorerResponse, "records"> & {
  access_mode: "ACCESS_PLAN_FIRST";
  record_lineage: { projected_record_count: number; access_note: string; };
};

export type Db1PagedResponse = Omit<Db1ExplorerResponse, "records"> & {
  access_mode: "SERVER_SIDE_SELECTION";
  record_page: { offset: number; limit: number; total_records: number; records: Db1ExplorerRecord[]; };
};

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing required DB1 explorer configuration: ${name}`);
  return value;
}

export function loadDb1ExplorerConfig(): Db1ExplorerConfig | undefined {
  if (!process.env.CLD_DB1_READER_DB?.trim()) return undefined;
  return { databaseUrl: requiredEnvironment("CLD_DB1_READER_DB") };
}

function observedType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function observedStructure(records: Db1ExplorerRecord[]): Db1ExplorerResponse["observed_structure"] {
  const values = new Map<string, { types: Set<string>; count: number }>();
  for (const record of records) {
    for (const [key, value] of Object.entries(record.preserved_record)) {
      const item = values.get(key) ?? { types: new Set<string>(), count: 0 };
      item.types.add(observedType(value));
      item.count += 1;
      values.set(key, item);
    }
  }
  return [...values.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => ({ key, observed_types: [...item.types].sort(), record_count: item.count }));
}

export class Db1Explorer {
  private readonly pool: Pool;

  constructor(config: Db1ExplorerConfig) {
    this.pool = new Pool({ connectionString: config.databaseUrl, max: 2, idleTimeoutMillis: 10_000 });
  }

  async close(): Promise<void> { await this.pool.end(); }

  async billTypesD2(): Promise<Db1ExplorerResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const build = await client.query<{
        build_id: string; projection_name: string; schema_version: string; code_revision: string; built_at: Date; integrity_status: string; projected_records: number; rejected_records: number;
        route_id: string; source_path: string; capture_run_id: string; manifest_id: string; retrieved_at: Date; raw_sha256: string; raw_byte_length: number; content_type: string; handling_class: string;
      }>(
        "select p.id as build_id, p.projection_name, p.schema_version, p.code_revision, p.created_at as built_at, p.integrity_status, p.projected_records, p.rejected_records, s.id as route_id, s.source_path, c.id as capture_run_id, m.id as manifest_id, m.retrieved_at, m.raw_digest as raw_sha256, m.byte_length as raw_byte_length, m.content_type, s.handling_class from db1.projection_builds p join db1.manifest_entries m on m.id = p.manifest_id join db1.capture_runs c on c.id = m.capture_run_id join db1.source_routes s on s.id = c.source_route_id where p.projection_name = $1 and p.manifest_id = $2 and s.id = $3 and p.origin_class = 'SOURCE_CAPTURE' and p.integrity_status = 'PASS' order by p.created_at desc limit 1",
        [D3_BILL_TYPES_PROJECTION, D3_BILL_TYPES_MANIFEST_ID, D3_BILL_TYPES_ROUTE_ID]
      );
      const item = build.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const records = await client.query<Db1ExplorerRecord>(
        "select source_position, preserved_record from db1.projection_records where projection_build_id = $1 and manifest_id = $2 order by source_position asc",
        [item.build_id, D3_BILL_TYPES_MANIFEST_ID]
      );
      await client.query("commit");
      return {
        layer: "DB1_OPERATIONAL_PROJECTION",
        availability: "RESTRICTED_PRIVATE_BETA",
        reconciliation_state: "NOT_SCHEDULED",
        raw_access: "NOT_EXPOSED",
        source: {
          route_id: item.route_id,
          source_path: item.source_path,
          capture_run_id: item.capture_run_id,
          manifest_id: item.manifest_id,
          retrieved_at: item.retrieved_at.toISOString(),
          raw_sha256: item.raw_sha256,
          raw_byte_length: Number(item.raw_byte_length),
          content_type: item.content_type,
          handling_class: item.handling_class
        },
        projection: {
          build_id: item.build_id,
          name: item.projection_name,
          schema_version: item.schema_version,
          code_revision: item.code_revision,
          built_at: item.built_at.toISOString(),
          integrity_status: item.integrity_status,
          projected_records: item.projected_records,
          rejected_records: item.rejected_records
        },
        observed_structure: observedStructure(records.rows),
        limitations: [
          "This is a retained DB1 operational projection, not a live Scottish Parliament response or an unqualified mirror.",
          "The raw object is not exposed through this interface. Preserved records are the loss-aware projection representation.",
          "Observed keys and types are structural evidence from this named projection, not a semantic codebook or DB2 variable definition.",
          "This one capture is NOT_SCHEDULED. It makes no freshness, completeness, historical-coverage, or source-update claim."
        ],
        records: records.rows
      };
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async referenceCohortD4a(): Promise<Db1ReferenceCatalogueResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{
        id: string; integrity_status: string; created_at: Date; bill_types_projection_build_id: string; bill_stage_types_projection_build_id: string; sessions_projection_build_id: string;
      }>(
        "select id, integrity_status, created_at, bill_types_projection_build_id, bill_stage_types_projection_build_id, sessions_projection_build_id from db1.catalogue_releases where id = $1 and integrity_status = 'PASS'",
        [D4B_REFERENCE_CATALOGUE_ID]
      );
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const buildIds: [string, string, string] = [item.bill_types_projection_build_id, item.bill_stage_types_projection_build_id, item.sessions_projection_build_id];
      const panels = await Promise.all(D4B_REFERENCE_PROJECTIONS.map((spec, index) => this.referencePanel(client, spec, buildIds[index]!)));
      if (panels.some((panel) => !panel)) throw new Error("D4B catalogue release does not match its fixed projection contract");
      await client.query("commit");
      return {
        layer: "DB1_OPERATIONAL_PROJECTION_CATALOGUE",
        availability: "RESTRICTED_PRIVATE_BETA",
        baseline: "FIXED_D4A_RETAINED_BASELINE",
        catalogue: { id: item.id, integrity_status: item.integrity_status, built_at: item.created_at.toISOString() },
        limitations: [
          "This is a fixed retained D4A baseline, not a live Scottish Parliament response or a general DB1 mirror.",
          "Later D4A timer observations do not alter these projection records. A later projection requires its own named build and decision.",
          "The catalogue has no raw-object route, source action, generic query, download, canonical variable, chart, or research-release claim."
        ],
        panels: panels as Db1ExplorerResponse[]
      };
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async institutionalReferenceD4c(): Promise<Db1ReferenceCatalogueResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; created_at: Date; constituencies_projection_build_id: string; regions_projection_build_id: string; committee_types_projection_build_id: string; committee_type_links_projection_build_id: string }>("select id, integrity_status, created_at, constituencies_projection_build_id, regions_projection_build_id, committee_types_projection_build_id, committee_type_links_projection_build_id from db1.institutional_catalogue_releases where id = $1 and integrity_status = 'PASS'", [D4C_INSTITUTIONAL_CATALOGUE_ID]);
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const buildIds = [item.constituencies_projection_build_id, item.regions_projection_build_id, item.committee_types_projection_build_id, item.committee_type_links_projection_build_id];
      const panels = [] as Db1ExplorerResponse[];
      for (const [index, route] of D4C_INSTITUTIONAL_ROUTES.entries()) {
        const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [buildIds[index]!]);
        const row = projection.rows[0];
        if (!row) throw new Error("D4C catalogue build is unavailable");
        const panel = await this.referencePanel(client, { routeId: route.id, sourcePath: route.path, manifestId: row.manifest_id, projectionName: row.projection_name }, buildIds[index]!);
        if (!panel) throw new Error("D4C catalogue release does not match its fixed projection contract");
        panels.push(panel);
      }
      await client.query("commit");
      return { layer: "DB1_OPERATIONAL_PROJECTION_CATALOGUE", availability: "RESTRICTED_PRIVATE_BETA", baseline: "FIXED_D4C_RETAINED_BASELINE", catalogue: { id: item.id, integrity_status: item.integrity_status, built_at: item.created_at.toISOString() }, limitations: ["This is a fixed retained D4C institutional-reference baseline, not a live Scottish Parliament response or a general DB1 mirror.", "Later D4C timer observations do not alter these projection records. A later projection requires its own named build and decision.", "The catalogue has no raw-object route, source action, generic query, download, canonical variable, chart, or research-release claim."], panels };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async formalStagesD5(): Promise<Db1AccessPlanResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.formal_stages_releases where id = $1 and integrity_status = 'PASS'", [D5_FORMAL_STAGES_RELEASE_ID]);
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]);
      const build = projection.rows[0];
      if (!build) throw new Error("D5 formal-stages release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D5_FORMAL_STAGES_ROUTE.id, sourcePath: D5_FORMAL_STAGES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id);
      if (!panel) throw new Error("D5 formal-stages release does not match its fixed projection contract");
      await client.query("commit");
      const { records, ...response } = panel;
      return {
        ...response,
        access_mode: "ACCESS_PLAN_FIRST",
        record_lineage: {
          projected_record_count: panel.projection.projected_records,
          access_note: "Record-level provenance is retained in DB1, but individual records are not exposed through this first access-plan release."
        },
        limitations: [
          "This is a fixed retained D5 formal-stages projection, not a live Scottish Parliament response, Bills dataset, or general DB1 mirror.",
          "The raw object and individual projected records are not exposed through this access-plan release. A later access mode requires its own named decision.",
          "Observed keys and types are structural evidence from this named projection, not a semantic codebook, stage interpretation, or DB2 variable definition.",
          `The latest D5 reconciliation state is ${panel.reconciliation_state}; it does not alter this fixed baseline projection or establish freshness or completeness.`
        ]
      };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async billsCollectionD6(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.bills_collection_releases where id = $1 and integrity_status = 'PASS'", [D6_BILLS_COLLECTION_RELEASE_ID]);
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]);
      const build = projection.rows[0];
      if (!build) throw new Error("D6 Bills collection release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D6_BILLS_COLLECTION_ROUTE.id, sourcePath: D6_BILLS_COLLECTION_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D6 Bills collection release does not match its fixed projection contract");
      await client.query("commit");
      return {
        ...panel,
        access_mode: "SERVER_SIDE_SELECTION",
        record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records },
        limitations: [
          "This is a fixed retained D6 Bills collection projection, not a live Scottish Parliament response, Bills detail route, or unqualified mirror.",
          "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, or DB2 variable is offered.",
          "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, or DB2 variable definition.",
          `The latest Bills reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness or completeness beyond that scope.`
        ]
      };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async governmentRolesD7(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.government_roles_releases where id = $1 and integrity_status = 'PASS'", [D7_GOVERNMENT_ROLES_RELEASE_ID]);
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]);
      const build = projection.rows[0];
      if (!build) throw new Error("D7 Government roles release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D7_GOVERNMENT_ROLES_ROUTE.id, sourcePath: D7_GOVERNMENT_ROLES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D7 Government roles release does not match its fixed projection contract");
      await client.query("commit");
      return {
        ...panel,
        access_mode: "SERVER_SIDE_SELECTION",
        record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records },
        limitations: [
          "This is a fixed retained D7 Government roles projection, not a live Scottish Parliament response, role-detail route, ministerial-occupancy history, or unqualified mirror.",
          "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, or DB2 variable is offered.",
          "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, role-history claim, or DB2 variable definition.",
          `The latest Government roles reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness or completeness beyond that scope.`
        ]
      };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async committeeRolesD8(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.committee_roles_releases where id = $1 and integrity_status = 'PASS'", [D8_COMMITTEE_ROLES_RELEASE_ID]);
      const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]);
      const build = projection.rows[0];
      if (!build) throw new Error("D8 Committee roles release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D8_COMMITTEE_ROLES_ROUTE.id, sourcePath: D8_COMMITTEE_ROLES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D8 Committee roles release does not match its fixed projection contract");
      await client.query("commit");
      return {
        ...panel,
        access_mode: "SERVER_SIDE_SELECTION",
        record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records },
        limitations: [
          "This is a fixed retained D8 Committee roles projection, not a live Scottish Parliament response, role-detail route, committee-membership history, or unqualified mirror.",
          "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, or DB2 variable is offered.",
          "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, committee-history claim, or DB2 variable definition.",
          `The latest Committee roles reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness or completeness beyond that scope.`
        ]
      };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async partyRolesD9(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.party_roles_releases where id = $1 and integrity_status = 'PASS'", [D9_PARTY_ROLES_RELEASE_ID]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error("D9 Party roles release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D9_PARTY_ROLES_ROUTE.id, sourcePath: D9_PARTY_ROLES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D9 Party roles release does not match its fixed projection contract");
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D9 Party roles projection, not a live Scottish Parliament response, role-detail route, party-membership history, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, party-role history claim, or DB2 variable definition.", `The latest Party roles reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness or completeness beyond that scope.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async partiesD10(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.parties_releases where id = $1 and integrity_status = 'PASS'", [D10_PARTIES_RELEASE_ID]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error("D10 Parties release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D10_PARTIES_ROUTE.id, sourcePath: D10_PARTIES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D10 Parties release does not match its fixed projection contract");
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D10 Parties projection, not a live Scottish Parliament response, party-detail route, party-affiliation history, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, party-validity or party-history claim, or DB2 variable definition.", `The latest Parties reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness or completeness beyond that scope.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async committeesD12(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.committees_releases where id = $1 and integrity_status = 'PASS'", [D12_COMMITTEES_RELEASE_ID]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error("D12 Committees release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D12_COMMITTEES_ROUTE.id, sourcePath: D12_COMMITTEES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D12 Committees release does not match its fixed projection contract");
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D12 Committees projection for /api/committees, not a live Scottish Parliament response, committee-detail route, committee-membership or bill-assignment record, status history, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, contact/description/free-text interpretation, validity-period claim, or DB2 variable definition.", `The latest Committees reconciliation state is ${panel.reconciliation_state}; it is evidence for the fixed route comparison only and does not establish freshness, completeness, membership, assignment, or cross-route consistency.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  private async referencePanel(client: import("pg").PoolClient, spec: SourcePreservingProjectionSpec, buildId: string, page?: { offset: number; limit: number }): Promise<Db1ExplorerResponse | undefined> {
    const build = await client.query<{
      build_id: string; projection_name: string; schema_version: string; code_revision: string; built_at: Date; integrity_status: string; projected_records: number; rejected_records: number;
      route_id: string; source_path: string; capture_run_id: string; manifest_id: string; retrieved_at: Date; raw_sha256: string; raw_byte_length: number; content_type: string; handling_class: string;
    }>(
      "select p.id as build_id, p.projection_name, p.schema_version, p.code_revision, p.created_at as built_at, p.integrity_status, p.projected_records, p.rejected_records, s.id as route_id, s.source_path, c.id as capture_run_id, m.id as manifest_id, m.retrieved_at, m.raw_digest as raw_sha256, m.byte_length as raw_byte_length, m.content_type, s.handling_class from db1.projection_builds p join db1.manifest_entries m on m.id = p.manifest_id join db1.capture_runs c on c.id = m.capture_run_id join db1.source_routes s on s.id = c.source_route_id where p.id = $1 and p.projection_name = $2 and p.manifest_id = $3 and s.id = $4 and p.origin_class = 'SOURCE_CAPTURE' and p.integrity_status = 'PASS'",
      [buildId, spec.projectionName, spec.manifestId, spec.routeId]
    );
    const item = build.rows[0];
    if (!item) return undefined;
    const allRecords = await client.query<Db1ExplorerRecord>(
      "select source_position, preserved_record from db1.projection_records where projection_build_id = $1 and manifest_id = $2 order by source_position asc",
      [item.build_id, spec.manifestId]
    );
    const records = page
      ? await client.query<Db1ExplorerRecord>("select source_position, preserved_record from db1.projection_records where projection_build_id = $1 and manifest_id = $2 order by source_position asc offset $3 limit $4", [item.build_id, spec.manifestId, page.offset, page.limit])
      : allRecords;
    const reconciliation = await client.query<{ state: string; observed_at: Date }>(
      "select state, observed_at from db1.reconciliation_observations where source_route_id = $1 order by observed_at desc limit 1",
      [spec.routeId]
    );
    const latest = reconciliation.rows[0];
    return {
      layer: "DB1_OPERATIONAL_PROJECTION",
      availability: "RESTRICTED_PRIVATE_BETA",
      reconciliation_state: latest?.state ?? "NOT_RECORDED",
      raw_access: "NOT_EXPOSED",
      source: {
        route_id: item.route_id,
        source_path: item.source_path,
        capture_run_id: item.capture_run_id,
        manifest_id: item.manifest_id,
        retrieved_at: item.retrieved_at.toISOString(),
        raw_sha256: item.raw_sha256,
        raw_byte_length: Number(item.raw_byte_length),
        content_type: item.content_type,
        handling_class: item.handling_class
      },
      projection: {
        build_id: item.build_id,
        name: item.projection_name,
        schema_version: item.schema_version,
        code_revision: item.code_revision,
        built_at: item.built_at.toISOString(),
        integrity_status: item.integrity_status,
        projected_records: item.projected_records,
        rejected_records: item.rejected_records
      },
      observed_structure: observedStructure(allRecords.rows),
      limitations: [
        "This is a retained fixed D4A baseline projection, not a live Scottish Parliament response or an unqualified mirror.",
        "The raw object is not exposed through this interface. Preserved records are the loss-aware projection representation.",
        "Observed keys and types are structural evidence from this named projection, not a semantic codebook or DB2 variable definition.",
        `The latest D4A reconciliation state is ${latest?.state ?? "NOT_RECORDED"}; it does not alter this fixed baseline projection or establish freshness or completeness.`
      ],
      records: records.rows
    };
  }

  async memberContextD11(route: (typeof D11_MEMBER_CONTEXT_ROUTES)[number], offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.member_context_releases where id = $1 and source_route_id = $2 and integrity_status = 'PASS'", [route.releaseId, route.id]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error(`D11 release build is unavailable: ${route.id}`);
      const panel = await this.referencePanel(client, { routeId: route.id, sourcePath: route.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error(`D11 release does not match fixed projection contract: ${route.id}`);
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: [`This is a fixed retained D11 Member-context projection for ${route.path}, not a live Scottish Parliament response, detail route, joined member record, or unqualified mirror.`, "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, person-status, relationship, validity-period, affiliation, office, or DB2 variable definition.", `The latest reconciliation state is ${panel.reconciliation_state}; it is evidence for this fixed route comparison only and does not establish freshness, completeness, or cross-route consistency.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async mqaTaxonomyLinkD13(route: (typeof D13_MQA_TAXONOMY_LINK_ROUTES)[number], offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.mqa_taxonomy_link_releases where id = $1 and source_route_id = $2 and integrity_status = 'PASS'", [route.releaseId, route.id]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error(`D13 release build is unavailable: ${route.id}`);
      const panel = await this.referencePanel(client, { routeId: route.id, sourcePath: route.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error(`D13 release does not match fixed projection contract: ${route.id}`);
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: [`This is a fixed retained D13 MQA taxonomy/link projection for ${route.path}, not a live Scottish Parliament response, event-detail route, joined event record, semantic relationship table, or unqualified mirror.`, "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, event taxonomy, link direction, relationship, timing, coverage, or DB2 variable definition.", `The latest reconciliation state is ${panel.reconciliation_state}; it is evidence for this fixed route comparison only and does not establish freshness, completeness, or cross-route consistency.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async mqaEventSubtypesD14(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const release = await client.query<{ id: string; integrity_status: string; projection_build_id: string }>("select id, integrity_status, projection_build_id from db1.mqa_event_subtypes_releases where id = $1 and integrity_status = 'PASS'", [D14_MQA_EVENT_SUBTYPES_RELEASE_ID]); const item = release.rows[0];
      if (!item) { await client.query("commit"); return undefined; }
      const projection = await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id]); const build = projection.rows[0];
      if (!build) throw new Error("D14 MQA Event subtypes release build is unavailable");
      const panel = await this.referencePanel(client, { routeId: D14_MQA_EVENT_SUBTYPES_ROUTE.id, sourcePath: D14_MQA_EVENT_SUBTYPES_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit });
      if (!panel) throw new Error("D14 MQA Event subtypes release does not match its fixed projection contract");
      await client.query("commit");
      return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D14 MQA Event subtypes projection, not a live Scottish Parliament response, detail route, event taxonomy, free-text interpretation, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no source-field filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence from this named projection, not a semantic codebook, source-field definition, event-subtype classification, IntroText interpretation, coverage, or DB2 variable definition.", `The latest reconciliation state is ${panel.reconciliation_state}; it is evidence for this fixed route comparison only and does not establish freshness, completeness, or cross-route consistency.`] };
    } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async mqaConsiderationD15(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try { await client.query("begin read only"); const release = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.mqa_consideration_releases where id = $1 and integrity_status = 'PASS'", [D15_MQA_CONSIDERATION_RELEASE_ID]); const item = release.rows[0]; if (!item) { await client.query("commit"); return undefined; } const build = (await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id])).rows[0]; if (!build) throw new Error("D15 release build is unavailable"); const panel = await this.referencePanel(client, { routeId: D15_MQA_CONSIDERATION_ROUTE.id, sourcePath: D15_MQA_CONSIDERATION_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit }); if (!panel) throw new Error("D15 release contract mismatch"); await client.query("commit"); return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D15 source-defined consideration-motion projection, not a live source response, complete motion series, bill-stage/vote dataset, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence only; no motion, bill, vote, date, or text semantics are asserted.", `The latest reconciliation state is ${panel.reconciliation_state}; it does not establish freshness, completeness, or cross-route consistency.`] }; } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }

  async mqaProgrammeD16(offset: number, limit: number): Promise<Db1PagedResponse | undefined> {
    const client = await this.pool.connect();
    try { await client.query("begin read only"); const release = await client.query<{ projection_build_id: string }>("select projection_build_id from db1.mqa_programme_releases where id = $1 and integrity_status = 'PASS'", [D16_MQA_PROGRAMME_RELEASE_ID]); const item = release.rows[0]; if (!item) { await client.query("commit"); return undefined; } const build = (await client.query<{ manifest_id: string; projection_name: string }>("select manifest_id, projection_name from db1.projection_builds where id = $1 and integrity_status = 'PASS'", [item.projection_build_id])).rows[0]; if (!build) throw new Error("D16 release build is unavailable"); const panel = await this.referencePanel(client, { routeId: D16_MQA_PROGRAMME_ROUTE.id, sourcePath: D16_MQA_PROGRAMME_ROUTE.path, manifestId: build.manifest_id, projectionName: build.projection_name }, item.projection_build_id, { offset, limit }); if (!panel) throw new Error("D16 release contract mismatch"); await client.query("commit"); return { ...panel, access_mode: "SERVER_SIDE_SELECTION", record_page: { offset, limit, total_records: panel.projection.projected_records, records: panel.records }, limitations: ["This is a fixed retained D16 source-defined programme-motion projection, not a live source response, complete motion series, bill-stage/vote dataset, or unqualified mirror.", "The raw object is not exposed. Pagination is the only current selection contract; no filter, generic query, download, join, or DB2 variable is offered.", "Observed keys and types are structural evidence only; no motion, bill, vote, date, or text semantics are asserted.", `The latest reconciliation state is ${panel.reconciliation_state}; it does not establish freshness, completeness, or cross-route consistency.`] }; } catch (error) { await client.query("rollback").catch(() => undefined); throw error; } finally { client.release(); }
  }
}
