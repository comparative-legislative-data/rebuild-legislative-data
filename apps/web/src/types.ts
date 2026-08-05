export type View = "login" | "apply" | "settings" | "admin" | "catalogue" | "db1";

export type Identity = {
  authenticated: boolean;
  email: string | null;
  roles: string[];
  logout_proof: string | null;
  data_layers_available: boolean;
};

export type CatalogueRoute = {
  id: string;
  group: string;
  template: string;
  priority: string;
  operatingClass: string;
  sourcePresentation: "OPENS_RAW_JSON" | "DOWNLOADS_RAW_JSON" | "SOURCE_PRESENTATION_UNESTABLISHED";
  availability: string;
  qualification: string;
  limitation: string;
  parameters: Array<{ name: string; grammar: string; required: boolean; allowedValues?: string[] }>;
};

export type Catalogue = {
  legislature: "GB-SCT";
  layer: "UPSTREAM_PASSTHROUGH_DESIGN";
  source_requests_enabled: boolean;
  enabled_route_count: number;
  route_count: number;
  routes: CatalogueRoute[];
};

export type SourceGuide = {
  officialUrl?: string;
  observedStructure: string;
  variables: Array<{ name: string; note: string }>;
  caution: string;
};

export type Db1ResearchRelease = {
  route_id: string;
  subject: string;
  endpoint: string;
  source_year: number | null;
  source_url: string;
  source_path: string;
  availability: "RECORDS_RETURNED" | "EMPTY_RESPONSE" | "UPSTREAM_AVAILABILITY_MESSAGE" | "UPSTREAM_ERROR_RESPONSE" | "NOT_YET_ASSESSED";
  availability_note: string | null;
  capture: { manifest_id: string; capture_run_id: string; retrieved_at: string; raw_sha256: string; raw_byte_length: number; content_type: string };
  reconciliation: { state: string; observed_at: string | null };
  research_access: { browse_available: boolean; record_count: number | null; observed_structure: Array<{ key: string; observed_types: string[]; record_count: number }> };
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
