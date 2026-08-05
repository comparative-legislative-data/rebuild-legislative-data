import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { Pool } from "pg";

export interface Db1ResearchAccessConfig {
  databaseUrl: string;
  rawRoot: string;
}

export type Db1Availability =
  | "RECORDS_RETURNED"
  | "EMPTY_RESPONSE"
  | "UPSTREAM_AVAILABILITY_MESSAGE"
  | "UPSTREAM_ERROR_RESPONSE"
  | "NOT_YET_ASSESSED";

export type Db1ResearchRelease = {
  route_id: string;
  subject: string;
  endpoint: string;
  source_year: number | null;
  source_url: string;
  source_path: string;
  availability: Db1Availability;
  availability_note: string | null;
  capture: {
    manifest_id: string;
    capture_run_id: string;
    retrieved_at: string;
    raw_sha256: string;
    raw_byte_length: number;
    content_type: string;
  };
  reconciliation: { state: string; observed_at: string | null };
  research_access: {
    browse_available: boolean;
    record_count: number | null;
    observed_structure: Array<{ key: string; observed_types: string[]; record_count: number }>;
  };
};

export type Db1ResearchCatalogue = {
  layer: "DB1_RETAINED_SOURCE_RESPONSES";
  access: "PRIVATE_BETA";
  generated_at: string;
  limitations: string[];
  subjects: Array<{ subject: string; endpoints: Array<{ endpoint: string; releases: Db1ResearchRelease[] }> }>;
};

export type Db1ResearchRecords = {
  release: Db1ResearchRelease;
  page: { offset: number; limit: number; total_records: number; records: Array<{ source_position: number; preserved_record: Record<string, unknown> }> };
};

export type Db1AllYearsManifest = {
  layer: "DB1_ALL_AVAILABLE_YEARS_MANIFEST";
  generated_at: string;
  subject: string;
  endpoint: string;
  included_releases: Db1ResearchRelease[];
  excluded_or_exception_releases: Db1ResearchRelease[];
  limitations: string[];
};

export type Db1AvailabilityAudit = {
  layer: "DB1_AVAILABILITY_AUDIT";
  audit_method: "DATABASE_AND_MANIFEST_ONLY_V1";
  generated_at: string;
  summary: Record<Db1Availability, number>;
  route_windows: Array<Pick<Db1ResearchRelease, "route_id" | "subject" | "endpoint" | "source_year" | "source_url" | "availability" | "availability_note" | "capture" | "reconciliation"> & { raw_response_available: true; browse_available: boolean }>;
  limitations: string[];
};

type ReleaseRow = {
  route_id: string;
  source_path: string;
  capture_run_id: string;
  manifest_id: string;
  retrieved_at: Date;
  raw_sha256: string;
  raw_byte_length: number;
  content_type: string;
  relative_path: string;
  projection_build_id: string | null;
  projected_records: number | null;
  rejected_records: number | null;
  observed_structure: Db1ResearchRelease["research_access"]["observed_structure"] | null;
  reconciliation_state: string | null;
  reconciliation_observed_at: Date | null;
};

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`missing required DB1 researcher-access configuration: ${name}`);
  return value;
}

export function loadDb1ResearchAccessConfig(): Db1ResearchAccessConfig | undefined {
  if (!process.env.CLD_DB1_READER_DB?.trim() || !process.env.CLD_DB1_RAW_ROOT?.trim()) return undefined;
  return {
    databaseUrl: requiredEnvironment("CLD_DB1_READER_DB"),
    rawRoot: requiredEnvironment("CLD_DB1_RAW_ROOT")
  };
}

function subjectFor(routeId: string): string {
  if (/(bill|formal-stage|stage-type)/.test(routeId)) return "Bills, formal stages and bill reference data";
  if (/(session|member|constituenc|region)/.test(routeId)) return "Sessions, members, constituencies and regions";
  if (/(party|government-role)/.test(routeId)) return "Parties and government roles";
  if (/(committee|committee-type)/.test(routeId) && !/official-reports/.test(routeId)) return "Committees and committee roles";
  if (/(mqa|motion|vote)/.test(routeId)) return "Motions, questions, related records and votes on motions";
  if (/official-reports/.test(routeId)) return "Official reports";
  return "Other retained Scottish Parliament sources";
}

function endpointFor(routeId: string): string {
  return routeId
    .replace(/^gb-sct\./, "")
    .replace(/\.collection$/, "")
    .replace(/-20\d{2}$/, "")
    .replace(/\.year\.20\d{2}$/, "")
    .replace(/-/g, " ");
}

function sourceYearFor(routeId: string, sourcePath: string): number | null {
  const match = routeId.match(/(?:-|\.year\.)(20\d{2})/) ?? sourcePath.match(/[?&]year=(20\d{2})/);
  return match ? Number(match[1]) : null;
}

function availabilityFor(row: ReleaseRow): Pick<Db1ResearchRelease, "availability" | "availability_note"> {
  if (row.route_id === "gb-sct.committee-official-reports-2006.collection") {
    return {
      availability: "UPSTREAM_AVAILABILITY_MESSAGE",
      availability_note: "The retained Scottish Parliament response says: “Data is presently unavailable”. This is a dated source condition, not an empty dataset or a finding that historical records do not exist."
    };
  }
  if (row.projection_build_id && (row.projected_records ?? 0) > 0) return { availability: "RECORDS_RETURNED", availability_note: null };
  if (row.projection_build_id && row.projected_records === 0) return { availability: "EMPTY_RESPONSE", availability_note: "The retained response had a valid zero-record projection. It does not establish historical nonexistence." };
  return { availability: "NOT_YET_ASSESSED", availability_note: "A retained raw response exists, but DB1 has not established a suitable record projection." };
}

function releaseFrom(row: ReleaseRow): Db1ResearchRelease {
  const availability = availabilityFor(row);
  return {
    route_id: row.route_id,
    subject: subjectFor(row.route_id),
    endpoint: endpointFor(row.route_id),
    source_year: sourceYearFor(row.route_id, row.source_path),
    source_url: `https://data.parliament.scot${row.source_path}`,
    source_path: row.source_path,
    ...availability,
    capture: {
      manifest_id: row.manifest_id,
      capture_run_id: row.capture_run_id,
      retrieved_at: row.retrieved_at.toISOString(),
      raw_sha256: row.raw_sha256,
      raw_byte_length: Number(row.raw_byte_length),
      content_type: row.content_type
    },
    reconciliation: {
      state: row.reconciliation_state ?? "NOT_RECORDED",
      observed_at: row.reconciliation_observed_at?.toISOString() ?? null
    },
    research_access: {
      browse_available: Boolean(row.projection_build_id && row.projected_records !== null),
      record_count: row.projected_records === null ? null : Number(row.projected_records),
      observed_structure: row.observed_structure ?? []
    }
  };
}

const latestReleaseSql = `
  select distinct on (c.source_route_id)
    c.source_route_id as route_id, s.source_path, c.id as capture_run_id,
    m.id as manifest_id, m.retrieved_at, m.raw_digest as raw_sha256,
    m.byte_length as raw_byte_length, m.content_type, r.relative_path,
    p.id as projection_build_id, p.projected_records, p.rejected_records,
    sp.observed_structure,
    ro.state as reconciliation_state, ro.observed_at as reconciliation_observed_at
  from db1.capture_runs c
  join db1.source_routes s on s.id = c.source_route_id
  join db1.manifest_entries m on m.capture_run_id = c.id
  join db1.raw_objects r on r.digest = m.raw_digest
  left join lateral (
    select id, projected_records, rejected_records
    from db1.projection_builds
    where manifest_id = m.id and origin_class = 'SOURCE_CAPTURE' and integrity_status = 'PASS'
    order by created_at desc
    limit 1
  ) p on true
  left join db1.projection_structure_profiles sp on sp.projection_build_id = p.id
  left join lateral (
    select state, observed_at
    from db1.reconciliation_observations
    where source_route_id = c.source_route_id
    order by observed_at desc
    limit 1
  ) ro on true
  where c.origin_class = 'SOURCE_CAPTURE' and c.status = 'SUCCEEDED'
    and m.status = 'SUCCEEDED' and m.raw_digest is not null
  order by c.source_route_id, m.retrieved_at desc
`;

function isInsideRoot(root: string, target: string): boolean {
  return target === root || target.startsWith(`${root}${sep}`);
}

export class Db1ResearchAccess {
  private readonly pool: Pool;
  private readonly rawRoot: string;

  constructor(config: Db1ResearchAccessConfig) {
    this.pool = new Pool({ connectionString: config.databaseUrl, max: 3, idleTimeoutMillis: 10_000 });
    this.rawRoot = resolve(config.rawRoot);
  }

  async close(): Promise<void> { await this.pool.end(); }

  private async releaseRows(routeId?: string): Promise<ReleaseRow[]> {
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const query = routeId
        ? `${latestReleaseSql.replace("order by c.source_route_id, m.retrieved_at desc", "and c.source_route_id = $1 order by c.source_route_id, m.retrieved_at desc")}`
        : latestReleaseSql;
      const result = await client.query<ReleaseRow>(query, routeId ? [routeId] : []);
      await client.query("commit");
      return result.rows;
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async catalogue(): Promise<Db1ResearchCatalogue> {
    const releases = (await this.releaseRows()).map(releaseFrom);
    const subjectOrder = [
      "Bills, formal stages and bill reference data",
      "Sessions, members, constituencies and regions",
      "Parties and government roles",
      "Committees and committee roles",
      "Motions, questions, related records and votes on motions",
      "Official reports",
      "Other retained Scottish Parliament sources"
    ];
    const subjects = subjectOrder.map((subject) => {
      const matching = releases.filter((release) => release.subject === subject);
      const endpointNames = [...new Set(matching.map((release) => release.endpoint))].sort();
      return {
        subject,
        endpoints: endpointNames.map((endpoint) => ({
          endpoint,
          releases: matching.filter((release) => release.endpoint === endpoint).sort((a, b) => (a.source_year ?? 0) - (b.source_year ?? 0))
        }))
      };
    }).filter((subject) => subject.endpoints.length > 0);
    return {
      layer: "DB1_RETAINED_SOURCE_RESPONSES",
      access: "PRIVATE_BETA",
      generated_at: new Date().toISOString(),
      limitations: [
        "Each item is a dated retained Scottish Parliament response held by DB1, not a live source response or an unqualified completeness/freshness claim.",
        "Exact raw retrieval returns the retained source bytes named by the manifest. Browsing and structure are separate DB1 research-access aids and create no DB2 variables or semantic codebook.",
        "The all-available-years option is a DB1-generated manifest over compatible retained windows; it is not one Scottish Parliament response."
      ],
      subjects
    };
  }

  async release(routeId: string): Promise<{ release: Db1ResearchRelease; relativePath: string } | undefined> {
    const row = (await this.releaseRows(routeId))[0];
    return row ? { release: releaseFrom(row), relativePath: row.relative_path } : undefined;
  }

  async rawStream(routeId: string): Promise<{ release: Db1ResearchRelease; stream: ReturnType<typeof createReadStream> } | undefined> {
    const found = await this.release(routeId);
    if (!found) return undefined;
    const target = resolve(this.rawRoot, found.relativePath);
    if (!isInsideRoot(this.rawRoot, target)) throw new Error("DB1 raw-object path escapes configured root");
    const information = await stat(target);
    if (information.size !== found.release.capture.raw_byte_length) throw new Error("DB1 raw-object byte length does not match its manifest");
    return { release: found.release, stream: createReadStream(target) };
  }

  async records(routeId: string, offset: number, limit: number): Promise<Db1ResearchRecords | undefined> {
    const found = await this.release(routeId);
    if (!found) return undefined;
    if (!found.release.research_access.browse_available) return { release: found.release, page: { offset, limit, total_records: 0, records: [] } };
    const client = await this.pool.connect();
    try {
      await client.query("begin read only");
      const build = await client.query<{ projection_build_id: string }>(
        "select id as projection_build_id from db1.projection_builds where manifest_id = $1 and origin_class = 'SOURCE_CAPTURE' and integrity_status = 'PASS' order by created_at desc limit 1",
        [found.release.capture.manifest_id]
      );
      const projectionBuildId = build.rows[0]?.projection_build_id;
      if (!projectionBuildId) { await client.query("commit"); return { release: found.release, page: { offset, limit, total_records: 0, records: [] } }; }
      const result = await client.query<{ source_position: number; preserved_record: Record<string, unknown> }>(
        "select source_position, preserved_record from db1.projection_records where projection_build_id = $1 and manifest_id = $2 order by source_position asc offset $3 limit $4",
        [projectionBuildId, found.release.capture.manifest_id, offset, limit]
      );
      await client.query("commit");
      return { release: found.release, page: { offset, limit, total_records: found.release.research_access.record_count ?? 0, records: result.rows } };
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async allYearsManifest(subject: string, endpoint: string): Promise<Db1AllYearsManifest | undefined> {
    const releases = (await this.releaseRows()).map(releaseFrom).filter((release) => release.subject === subject && release.endpoint === endpoint);
    if (releases.length === 0) return undefined;
    const included = releases.filter((release) => release.availability === "RECORDS_RETURNED" || release.availability === "EMPTY_RESPONSE");
    const exceptions = releases.filter((release) => !included.includes(release));
    return {
      layer: "DB1_ALL_AVAILABLE_YEARS_MANIFEST",
      generated_at: new Date().toISOString(),
      subject,
      endpoint,
      included_releases: included,
      excluded_or_exception_releases: exceptions,
      limitations: [
        "This is a DB1-generated manifest, not a single Scottish Parliament response or a claim of complete historical coverage.",
        "Each listed source year/window remains separately retrievable as its own exact retained raw response, with its own capture time and checksum.",
        "Exceptions are retained and disclosed rather than silently converted into absent years or empty datasets."
      ]
    };
  }

  async availabilityAudit(): Promise<Db1AvailabilityAudit> {
    const releases = (await this.releaseRows()).map(releaseFrom);
    const summary: Record<Db1Availability, number> = {
      RECORDS_RETURNED: 0,
      EMPTY_RESPONSE: 0,
      UPSTREAM_AVAILABILITY_MESSAGE: 0,
      UPSTREAM_ERROR_RESPONSE: 0,
      NOT_YET_ASSESSED: 0
    };
    for (const release of releases) summary[release.availability] += 1;
    return {
      layer: "DB1_AVAILABILITY_AUDIT",
      audit_method: "DATABASE_AND_MANIFEST_ONLY_V1",
      generated_at: new Date().toISOString(),
      summary,
      route_windows: releases.map((release) => ({
        route_id: release.route_id,
        subject: release.subject,
        endpoint: release.endpoint,
        source_year: release.source_year,
        source_url: release.source_url,
        availability: release.availability,
        availability_note: release.availability_note,
        capture: release.capture,
        reconciliation: release.reconciliation,
        raw_response_available: true,
        browse_available: release.research_access.browse_available
      })),
      limitations: [
        "This audit reads existing DB1 route, manifest, raw-object metadata, projection and reconciliation evidence only. It does not contact the Scottish Parliament or create a new capture.",
        "A source condition is dated to its retained capture. The audit does not establish current upstream availability, historical completeness or a DB2 data gap.",
        "UPSTREAM_AVAILABILITY_MESSAGE preserves the source's retained availability response rather than treating it as an empty dataset or a projection failure."
      ]
    };
  }
}
