import { Pool } from "pg";
import {
  D3_BILL_TYPES_MANIFEST_ID,
  D3_BILL_TYPES_PROJECTION,
  D3_BILL_TYPES_ROUTE_ID
} from "./foundation.js";

export interface Db1ExplorerConfig { databaseUrl: string; }

export type Db1ExplorerRecord = { source_position: number; preserved_record: Record<string, unknown>; };

export type Db1ExplorerResponse = {
  layer: "DB1_OPERATIONAL_PROJECTION";
  availability: "RESTRICTED_PRIVATE_BETA";
  reconciliation_state: "NOT_SCHEDULED";
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
}
