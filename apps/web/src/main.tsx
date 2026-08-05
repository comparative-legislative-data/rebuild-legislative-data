import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { FormEvent, ReactNode } from "react";
import "./styles.css";

type View = "login" | "apply" | "settings" | "admin" | "catalogue" | "db1";
type Identity = { authenticated: boolean; email: string | null; roles: string[]; logout_proof: string | null; data_layers_available: boolean };
type CatalogueRoute = {
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
type Catalogue = { legislature: "GB-SCT"; layer: "UPSTREAM_PASSTHROUGH_DESIGN"; source_requests_enabled: boolean; enabled_route_count: number; route_count: number; routes: CatalogueRoute[] };
type SourceGuide = { officialUrl?: string; observedStructure: string; variables: Array<{ name: string; note: string }>; caution: string };
type Db1Preview = {
  layer: "DB1_OPERATIONAL_PROJECTION";
  availability: "RESTRICTED_PRIVATE_BETA";
  reconciliation_state: "NOT_SCHEDULED";
  raw_access: "NOT_EXPOSED";
  source: { route_id: string; source_path: string; capture_run_id: string; manifest_id: string; retrieved_at: string; raw_sha256: string; raw_byte_length: number; content_type: string; handling_class: string };
  projection: { build_id: string; name: string; schema_version: string; code_revision: string; built_at: string; integrity_status: string; projected_records: number; rejected_records: number };
  observed_structure: Array<{ key: string; observed_types: string[]; record_count: number }>;
  limitations: string[];
  records: Array<{ source_position: number; preserved_record: Record<string, unknown> }>;
};
type Db1Catalogue = {
  layer: "DB1_OPERATIONAL_PROJECTION_CATALOGUE";
  availability: "RESTRICTED_PRIVATE_BETA";
  baseline: string;
  catalogue: { id: string; integrity_status: string; built_at: string };
  limitations: string[];
  panels: Db1Preview[];
};
type Db1AccessPlan = Omit<Db1Preview, "records"> & {
  access_mode: "ACCESS_PLAN_FIRST";
  record_lineage: { projected_record_count: number; access_note: string };
};
type Db1Paged = Omit<Db1Preview, "records"> & {
  access_mode: "SERVER_SIDE_SELECTION";
  record_page: { offset: number; limit: number; total_records: number; records: Array<{ source_position: number; preserved_record: Record<string, unknown> }> };
};
type Db1ResearchRelease = {
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
type Db1ResearchCatalogue = {
  layer: "DB1_RETAINED_SOURCE_RESPONSES";
  access: "PRIVATE_BETA";
  generated_at: string;
  limitations: string[];
  subjects: Array<{ subject: string; endpoints: Array<{ endpoint: string; releases: Db1ResearchRelease[] }> }>;
};
type Db1ResearchRecords = { release: Db1ResearchRelease; page: { offset: number; limit: number; total_records: number; records: Array<{ source_position: number; preserved_record: Record<string, unknown> }> } };

const sourceGuides: Record<string, SourceGuide> = {
  "bill-stage-types.collection": {
    officialUrl: "https://data.parliament.scot/api/billstagetypes",
    observedStructure: "Previously observed as a 34-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "BillTypeID", note: "Previously observed as numeric; source-supplied identifier." },
      { name: "ID", note: "Previously observed as numeric; source-supplied identifier." },
      { name: "Name", note: "Previously observed as text; source-supplied label." },
      { name: "Sequence", note: "Previously observed as numeric; not yet treated as a validated analytic ordering." }
    ],
    caution: "The response is live and may change. CLD makes no completeness, freshness, or ordering claim."
  },
  "bill-types.collection": {
    officialUrl: "https://data.parliament.scot/api/billtypes",
    observedStructure: "Previously observed as a 7-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "ID", note: "Source-supplied identifier; its live type is not revalidated by this relay." },
      { name: "Name", note: "Source-supplied label; it is not independently interpreted or historically completed by CLD." }
    ],
    caution: "No usable source update validator was previously observed. Do not infer a current or historically complete classification from the response."
  },
  "sessions.collection": {
    officialUrl: "https://data.parliament.scot/api/sessions",
    observedStructure: "Previously observed as a 6-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "ID", note: "Source-supplied identifier." },
      { name: "Name", note: "Source-supplied label." },
      { name: "ShortName", note: "Source-supplied short label." },
      { name: "StartDate", note: "Source date field; not yet a validated session-boundary rule." },
      { name: "EndDate", note: "Source date field; null and interval semantics are not interpreted by CLD." }
    ],
    caution: "No usable source update validator was previously observed. Do not infer complete coverage, freshness, or settled date semantics."
  },
  "constituencies.collection": {
    officialUrl: "https://data.parliament.scot/api/constituencies",
    observedStructure: "Previously observed as a 223-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "ValidFromDate", note: "Previously observed source date field; it is not a validated geographic or temporal rule." },
      { name: "Other recorded structure", note: "Existing evidence records identifier, names/codes, region, and validity-period fields but does not retain stable field names/types for every one. Inspect the raw source response." }
    ],
    caution: "This is source-defined constituency reference only. Do not infer geographic coverage, validity semantics, completeness, or freshness."
  },
  "regions.collection": {
    officialUrl: "https://data.parliament.scot/api/regions",
    observedStructure: "Previously observed as a 29-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "StartDate", note: "Previously observed source date field; it is not a validated regional boundary rule." },
      { name: "Other recorded structure", note: "Existing evidence records identifier, name/code, and end-date fields but does not retain stable field names/types for every one. Inspect the raw source response." }
    ],
    caution: "This is source-defined regional reference only. Do not infer date-boundary semantics, coverage, completeness, or freshness."
  },
  "committee-types.collection": {
    officialUrl: "https://data.parliament.scot/api/committeetypes",
    observedStructure: "Previously observed as a 3-element JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [
      { name: "Recorded structure", note: "Existing evidence records identifier and name fields, but does not retain stable field names/types. Inspect the raw source response." }
    ],
    caution: "This is source-defined taxonomy only. Do not infer committee classification, historical meaning, completeness, or freshness."
  },
  "committee-type-links.collection": {
    officialUrl: "https://data.parliament.scot/api/committeetypelinks",
    observedStructure: "Previously observed as a 168-record JSON collection with committee/type identifiers. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [{ name: "Recorded structure", note: "Existing evidence records committee/type identifiers only. Their relation, timing, membership, and classification are not interpreted." }],
    caution: "This is source-defined link material only. Do not infer a committee/type relationship, coverage, completeness, or freshness."
  },
  "mqa-event-types.collection": {
    officialUrl: "https://data.parliament.scot/api/motionsquestionsanswerseventtypes",
    observedStructure: "Previously observed as a 2-record JSON collection. This is dated structural evidence, not a check of the response you are about to open.",
    variables: [{ name: "EventTypeID", note: "Previously observed source identifier; its meaning is not independently interpreted." }, { name: "EventType", note: "Previously observed source label; it is not a validated event classification." }],
    caution: "This is source-defined event-type taxonomy only. Do not infer event meaning, coverage, completeness, or freshness."
  },
  "mqa-event-links.collection": {
    officialUrl: "https://data.parliament.scot/api/motionsquestionsanswerseventlinks",
    observedStructure: "Previously observed as a 5,721-record JSON collection (406,192 bytes). This historical observation is not a response-size guarantee.",
    variables: [{ name: "ChildUniqueID / MainUniqueID / ParentUniqueID", note: "Previously observed source identifiers. CLD does not identify the entities or interpret link direction or relationship." }],
    caution: "The raw response may be larger or slower than the prior observation. Do not infer identifier identity, link direction, event meaning, coverage, completeness, or freshness."
  }
};

const familySourceGuides: Record<string, SourceGuide> = {
  "Bills": { observedStructure: "Observed on 3 August 2026 as a 473-element JSON collection. One collection-derived detail request returned a JSON object with the same seven top-level fields.", variables: [{ name: "ID / BillTypeID / PersonID", note: "Observed numeric source fields. Their identifier stability and relationship semantics are not established." }, { name: "Reference / ShortName / FullName", note: "Observed source text fields; no title, citation, or bill-identity interpretation is made." }, { name: "ThirdPartyOrganisation", note: "Observed as null in the profiled structural value. This does not establish its possible values, content, or handling classification." }], caution: "This structural observation does not establish pagination, completeness, field definitions, source-term coverage, personal-data classification, or research fitness." },
  "Formal stages": { observedStructure: "Previously observed as a 1,754-element JSON collection; one detail response had the same four top-level fields.", variables: [{ name: "BillID / BillStageTypeID / ID", note: "Previously observed as numeric source fields; their identity and relationship semantics are not yet established." }, { name: "StageDate", note: "Previously observed as string or null; no date meaning or ordering claim is made." }], caution: "The observation does not establish a bill-stage interpretation, coverage, pagination, or identifier stability." },
  "Stage types": { observedStructure: "Collection and one detail response were previously observed as a four-field JSON structure.", variables: [{ name: "BillTypeID / ID / Sequence", note: "Previously observed numeric source fields; Sequence is not treated as a validated analytical ordering." }, { name: "Name", note: "Previously observed text label; no source-category or historical-meaning claim is made." }], caution: "Do not infer the relation between types, bills, or stages from these fields alone." },
  "Bill types": { observedStructure: "Collection and one detail response were previously observed as a two-field JSON structure.", variables: [{ name: "ID", note: "Previously observed numeric source identifier." }, { name: "Name", note: "Previously observed source text label; not an independently validated category." }], caution: "No completeness, historical classification, or update claim follows." },
  "Sessions": { observedStructure: "Collection and one detail response were previously observed as five-field JSON structures.", variables: [{ name: "ID", note: "Previously observed numeric source identifier." }, { name: "Name / ShortName", note: "Previously observed source labels." }, { name: "StartDate / EndDate", note: "Previously observed source date fields; EndDate was observed as string or null." }], caution: "No session-boundary, active-session, or record-to-session assignment rule is established." },
  "Members": { observedStructure: "Previously observed as a 416-element collection; one detail response had the same field set.", variables: [{ name: "PersonID", note: "Previously observed source identifier and the observed detail-route key." }, { name: "Names / GenderTypeID / BirthDate", note: "Previously observed source fields; no identity, gender, or birth-date interpretation is made." }, { name: "BirthDateIsProtected / IsCurrent / Notes / PhotoURL", note: "Previously observed flags, free text, and URL fields; their content and handling remain unassessed." }], caution: "This profile does not classify content or support a person-history, current-status, or reuse claim." },
  "Member constituency status": { observedStructure: "Previously observed as a 523-element collection; one detail response had the same field set.", variables: [{ name: "Person / constituency / election-status and reason", note: "Previously observed relationship fields; no membership or election interpretation is made." }, { name: "Notes / validity-period fields", note: "Previously observed free-text and date fields; interval conventions and handling remain unresolved." }], caution: "Not a validated time-varying representation series." },
  "Member region status": { observedStructure: "Previously observed as a 413-element collection; one detail response had the same field set.", variables: [{ name: "Person / region / election-status and reason", note: "Previously observed relationship fields; their meaning and linkage are not asserted." }, { name: "Notes / validity-period fields", note: "Previously observed free-text and date fields; interval conventions and handling remain unresolved." }], caution: "Not a validated time-varying representation series." },
  "Constituencies": { observedStructure: "Previously observed as a 223-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / names / codes / region", note: "Previously observed source reference fields; no geographic relation or coverage claim is made." }, { name: "Validity-period fields", note: "Previously observed date fields; no temporal rule is established." }], caution: "The raw source is not a validated geography or boundary-history dataset." },
  "Regions": { observedStructure: "Previously observed as a 29-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / name / code", note: "Previously observed source reference fields." }, { name: "StartDate / EndDate", note: "Previously observed source date fields; no boundary or interval semantics are asserted." }], caution: "The raw source is not a validated regional-history dataset." },
  "Parties": { observedStructure: "Previously observed as a 14-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / names / abbreviation", note: "Previously observed source reference fields." }, { name: "Notes / validity-period / relationship placeholders", note: "Previously observed fields; notes and relationship content remain unassessed." }], caution: "No party-system, party-history, or role interpretation follows." },
  "Member parties": { observedStructure: "Previously observed as a 976-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / person / party", note: "Previously observed relationship fields; no affiliation rule or linkage claim is made." }, { name: "Validity-period / role placeholder", note: "Previously observed date and nullable fields; interval and conflict rules are not established." }], caution: "Not a validated point-in-time party-affiliation dataset." },
  "Party roles": { observedStructure: "Previously observed as a 548-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / party / name / notes", note: "Previously observed source fields; notes handling and role semantics remain unassessed." }], caution: "This taxonomy does not establish role history or occupancy." },
  "Member party roles": { observedStructure: "Previously observed as a 1,509-element collection; one detail response had the same field set.", variables: [{ name: "Member-party / role-type / notes", note: "Previously observed relationship and text fields." }, { name: "ValidFromDate / ValidUntilDate", note: "Previously observed source dates; no interval or historical-role rule is established." }], caution: "Not a validated party-role history." },
  "Government roles": { observedStructure: "Previously observed as a 251-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / name / notes", note: "Previously observed source fields; notes handling and role semantics remain unassessed." }], caution: "This taxonomy does not establish ministerial occupancy or history." },
  "Member government roles": { observedStructure: "Previously observed as a 381-element collection; one detail response had the same field set.", variables: [{ name: "Person / government role", note: "Previously observed relationship fields; no office-holder linkage claim is made." }, { name: "ValidFromDate / ValidUntilDate", note: "Previously observed source dates; interval conventions remain unassessed." }], caution: "Not a validated government-role history." },
  "Committees": { observedStructure: "Previously observed as a 169-element collection; one detail response had the same field set.", variables: [{ name: "Names / description / contact fields", note: "Previously observed source text/contact fields; content and handling remain unassessed." }, { name: "ValidFromDate / ValidUntilDate", note: "Previously observed source dates; no committee-life-cycle rule is established." }], caution: "This route does not establish committee membership or bill assignment." },
  "Committee roles": { observedStructure: "Previously observed as an 8-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / name / notes", note: "Previously observed source fields; notes handling and role semantics remain unassessed." }], caution: "A role taxonomy is not committee membership history." },
  "Committee types": { observedStructure: "Previously observed as a 3-element collection; one detail response had the same field set.", variables: [{ name: "Identifier / name", note: "Previously observed source taxonomy fields; no historical or classification meaning is asserted." }], caution: "No completeness or taxonomy-semantics claim follows." },
  "Committee type links": { observedStructure: "Previously observed as a 168-element collection.", variables: [{ name: "Committee and type identifiers", note: "Previously observed source identifiers; their relationship, timing, and direction are not interpreted." }], caution: "This is not a validated committee/type relationship table." },
  "MQA events": { observedStructure: "The unfiltered collection did not return headers within a 30-second prior observation. The detail route has no confirmed useful key contract.", variables: [{ name: "Profile status", note: "No current safe field profile is asserted for this extreme-volume route." }], caution: "The raw route may be high-latency or very large; no schema, completeness, or event meaning is established." },
  "MQA event types": { observedStructure: "Previously observed as a two-record collection; one detail response had the same two fields.", variables: [{ name: "EventTypeID / EventType", note: "Previously observed source identifier and label; no event classification meaning is asserted." }], caution: "Do not infer event meaning or coverage from this taxonomy." },
  "MQA event subtypes": { observedStructure: "Previously observed as an 18-record collection; one detail response had the same four fields.", variables: [{ name: "EventSubTypeID / EventTypeID", note: "Previously observed source identifiers." }, { name: "EventSubType / IntroText", note: "Previously observed label and introductory text; text handling and semantics remain unassessed." }], caution: "Do not infer a substantive event classification from these fields." },
  "MQA event links": { observedStructure: "Previously observed as a 5,721-record collection; parameterised forms returned a one-element array in a limited observation.", variables: [{ name: "ChildUniqueID / MainUniqueID / ParentUniqueID", note: "Previously observed source identifiers; identity, direction, and relationship meaning are unassessed." }], caution: "This is not a validated relational link table." },
  "MQA motions": { observedStructure: "The full collection was previously observed as an 84,634-element, approximately 110 MB JSON response. Business filters are separate fixed source forms.", variables: [{ name: "Identity / event / type / representational references", note: "Previously observed broad field groups; no relation or identity semantics are asserted." }, { name: "Title/text / status-interest flags / dates", note: "Previously observed broad groups; no content interpretation, chronology, or bill linkage is established." }], caution: "The whole-history route can be large. A motion or motion-amendment vote is not thereby a bill-stage, financial-resolution, or bill-amendment record." },
  "MQA business motions": { observedStructure: "The consideration form was previously observed as 1,461 records and 22 fields; the programme form was approximately 3.6 MB in a later full audit.", variables: [{ name: "Broad motion fields", note: "Observed to match the general motion family; this profile does not retain or assert every field name." }, { name: "ApprovedDate / SubmissionDateTime / MeetingDate", note: "Previously observed source dates; no timetable, completeness, or bill linkage rule is established." }], caution: "The fixed filter does not establish a complete programme/consideration-motion series." },
  "MQA questions": { observedStructure: "The unfiltered collection did not return headers within the earlier 30-second window. The documented annual route completed for 2026 at approximately 6.5 MB.", variables: [{ name: "Profile status", note: "A full field profile remains pending for this high-volume family." }], caution: "Year acceptance does not establish annual completeness or question semantics." },
  "MQA supports": { observedStructure: "The unfiltered collection did not return headers within the earlier 30-second window; the detail contract is not established.", variables: [{ name: "Profile status", note: "No current safe field profile is asserted for this high-latency route." }], caution: "No schema, relationship, or completeness claim is made." },
  "Committee official reports": { observedStructure: "The 2025 annual response was previously observed as 82,017 elements and approximately 150 MB. A candidate detail key returned an empty object.", variables: [{ name: "Meeting / committee / time / item-of-business", note: "Previously observed nested groups; no contribution, committee, or procedural interpretation is established." }, { name: "Person / contribution detail / UpdatedElasticDate", note: "Previously observed groups; text/person handling and update-date meaning remain unassessed." }], caution: "Annual responses are large. This is not a committee-stage, amendment, speaker, or bill-linkage dataset." },
  "Plenary official reports": { observedStructure: "The 2025 annual response was previously observed as 31,843 elements and approximately 124 MB. A candidate detail key returned an empty object.", variables: [{ name: "Meeting / committee / time / item-of-business", note: "Previously observed nested groups, with plenary-specific item-of-business and contribution-text fields." }, { name: "Person / contribution detail / UpdatedElasticDate", note: "Previously observed groups; text/person handling and update-date meaning remain unassessed." }], caution: "Annual responses are large. This is not a validated Stage 1/3 debate, amendment, speaker, or bill-linkage dataset." },
  "Votes on motions": { observedStructure: "The annual 2011 response was previously observed as 13,440 elements and approximately 13 MB. Detail-key observations produced an error or empty object.", variables: [{ name: "ID / Detail / Motion / Person / Time / UpdatedElasticDate", note: "Previously observed top-level fields; Time.Start/Time.End and UpdatedElasticDate are not given a substantive interpretation by CLD." }], caution: "Votes on motions may include motion-amendment votes; they are not evidence of amendments to bills." }
};

const catalogueSections = [
  { id: "bills", title: "Bills, formal stages and bill reference data", groups: ["Bills", "Formal stages", "Stage types", "Bill types"] },
  { id: "members", title: "Sessions, members, constituencies and regions", groups: ["Sessions", "Members", "Member constituency status", "Member region status", "Constituencies", "Regions"] },
  { id: "roles", title: "Parties and government roles", groups: ["Parties", "Party roles", "Member parties", "Member party roles", "Government roles", "Member government roles"] },
  { id: "committees", title: "Committees and committee roles", groups: ["Committees", "Committee roles", "Committee types", "Committee type links"] },
  { id: "mqa", title: "Motions, questions, related records and votes on motions", groups: ["MQA business motions", "MQA events", "MQA event types", "MQA event subtypes", "MQA event links", "MQA motions", "MQA questions", "MQA supports", "Votes on motions"] },
  { id: "reports", title: "Official reports", groups: ["Committee official reports", "Plenary official reports"] }
] as const;

const memberContextDb1Routes = [
  { key: "members", title: "members · collection", endpoint: "/db1/gb-sct/members/d11-v1" },
  { key: "member-constituency-statuses", title: "member constituency statuses · collection", endpoint: "/db1/gb-sct/member-constituency-statuses/d11-v1" },
  { key: "member-region-statuses", title: "member region statuses · collection", endpoint: "/db1/gb-sct/member-region-statuses/d11-v1" },
  { key: "member-parties", title: "member parties · collection", endpoint: "/db1/gb-sct/member-parties/d11-v1" },
  { key: "member-party-roles", title: "member party roles · collection", endpoint: "/db1/gb-sct/member-party-roles/d11-v1" },
  { key: "member-government-roles", title: "member government roles · collection", endpoint: "/db1/gb-sct/member-government-roles/d11-v1" }
] as const;

const mqaTaxonomyLinkDb1Routes = [
  { key: "mqa-event-types", title: "MQA event types · collection", endpoint: "/db1/gb-sct/mqa-event-types/d13-v1" },
  { key: "mqa-event-links", title: "MQA event links · collection", endpoint: "/db1/gb-sct/mqa-event-links/d13-v1" }
] as const;
const mqaAnnualWindowDb1Routes = [
  { key: "mqa-questions-2026", title: "MQA questions · 2026", endpoint: "/db1/gb-sct/mqa-questions-2026/d17-v1" },
  { key: "votes-on-motions-2026", title: "Votes on motions · 2026", endpoint: "/db1/gb-sct/votes-on-motions-2026/d17-v1" }
] as const;
const d18AnnualWindowDb1Routes = Array.from({ length: 15 }, (_, index) => 2011 + index).flatMap((year) => [
  { key: `mqa-questions-${year}`, title: `MQA questions · ${year}`, endpoint: `/db1/gb-sct/mqa-questions-${year}/d18-v1` },
  { key: `votes-on-motions-${year}`, title: `Votes on motions · ${year}`, endpoint: `/db1/gb-sct/votes-on-motions-${year}/d18-v1` }
]);
const d19OfficialReportsDb1Routes = [
  { key: "committee-official-reports-2025", title: "Committee Official Reports · 2025", endpoint: "/db1/gb-sct/committee-official-reports-2025/d19-v1" },
  { key: "plenary-official-reports-2025", title: "Plenary Official Reports · 2025", endpoint: "/db1/gb-sct/plenary-official-reports-2025/d19-v1" }
] as const;
const d20OfficialReportsDb1Routes = [...Array.from({ length: 26 }, (_, index) => 1999 + index), 2026].flatMap((year) => [
  { key: `committee-official-reports-${year}`, title: `Committee Official Reports · ${year}`, endpoint: `/db1/gb-sct/committee-official-reports-${year}/d20-v1` },
  { key: `plenary-official-reports-${year}`, title: `Plenary Official Reports · ${year}`, endpoint: `/db1/gb-sct/plenary-official-reports-${year}/d20-v1`, downloadEndpoint: year === 2026 ? "/db1/gb-sct/plenary-official-reports-2026/d20-v1/download.jsonl" : undefined }
]);

// Retained only while the prior DB1 render branch remains in the source tree;
// the active DB1 view below derives its headings from catalogueSections.
const db1CatalogueSections = [
  { id: "db1-sessions", title: "Parliamentary sessions", routes: ["gb-sct.sessions.collection"] }
] as const;

function sourceUrl(route: CatalogueRoute, parameters: Record<string, string>, viaRelay: boolean): string {
  let template = route.template;
  for (const rule of route.parameters) {
    const value = parameters[rule.name];
    if (!value) continue;
    template = template.replace(`:${rule.name}`, encodeURIComponent(value));
    if (route.parameters.length === 1) template = template.replace(":id", encodeURIComponent(value));
  }
  if (!viaRelay) return `https://data.parliament.scot${template}`;
  const query = new URLSearchParams(parameters);
  return `/api/catalogue/gb-sct/${route.id}/source${query.size > 0 ? `?${query.toString()}` : ""}`;
}

type SourceExample = { label: string; parameters: Record<string, string>; note?: string };

const annualSourceYears: Record<string, readonly number[]> = {
  "mqa-questions.year": Array.from({ length: 18 }, (_, index) => 1999 + index),
  "committee-reports.year": Array.from({ length: 26 }, (_, index) => 1999 + index),
  "plenary-reports.year": Array.from({ length: 27 }, (_, index) => 1999 + index),
  "motion-votes.year": Array.from({ length: 15 }, (_, index) => 2011 + index)
};

const sourceExampleOverrides: Record<string, Record<string, string>> = {
  "committee-reports.detail": { id: "204795" },
  "plenary-reports.detail": { id: "1924932" },
  "motion-votes.detail": { id: "204795" }
};

function sourceExamples(route: CatalogueRoute): SourceExample[] {
  const years = annualSourceYears[route.id];
  if (years) return years.map((value) => ({ label: `Source catalogue year ${value}`, parameters: { year: String(value) }, note: `The Scottish Parliament catalogue publishes this fixed ${value} URL.` }));
  if (route.parameters.length === 0) return [{ label: "Source route", parameters: {} }];
  const parameters = Object.fromEntries(route.parameters.map((parameter) => [parameter.name, parameter.allowedValues?.[0] ?? sourceExampleOverrides[route.id]?.[parameter.name] ?? "1"]));
  return [{ label: "Scottish Parliament catalogue example", parameters, note: "This is the fixed example URL published by the Scottish Parliament catalogue; it is not a CLD search field or a claim about identifier meaning." }];
}

function RouteBadge({ route }: { route: CatalogueRoute }) {
  const relayed = route.availability === "RELAYED_PRIVATE_BETA";
  const guide = sourceGuides[route.id] ?? familySourceGuides[route.group];
  const guideText = guide ?? {
    observedStructure: "No route-specific response schema is asserted here. Open the raw source response to inspect its current JSON structure, keys, value types, and any source-supplied metadata.",
    variables: [{ name: "Current response fields", note: "CLD has not converted this raw route into a project codebook, data dictionary, or analytical variable set." }],
    caution: "The raw response may be incomplete, large, slow, or changed. Operating class describes delivery expectations only; it does not establish semantic, temporal, completeness, or freshness claims."
  };
  const action = route.sourcePresentation === "DOWNLOADS_RAW_JSON" ? "Downloads raw JSON from the Scottish Parliament source" : route.sourcePresentation === "SOURCE_PRESENTATION_UNESTABLISHED" ? "Source presentation is not yet established; it may open raw JSON or download a raw file" : "Opens raw JSON in a new browser tab";
  const actionVerb = route.sourcePresentation === "DOWNLOADS_RAW_JSON" ? "Download" : "Open";
  const examples = sourceExamples(route);
  return <details className={`route-card${relayed ? " route-card-relayed" : ""}`}><summary><div className="route-badge"><div><p className="route-group">{route.group} · {route.priority}</p><h3>{route.id}</h3><code>{route.template}</code></div><div className="route-badge-state"><span className="route-state">{route.availability.replaceAll("_", " ")}</span><span className="route-expand-label">Show details</span></div></div></summary><div className="route-details"><dl><div><dt>Operating class</dt><dd>{route.operatingClass.replaceAll("_", " ")}</dd></div><div><dt>Source action</dt><dd>{action}</dd></div><div><dt>Qualification</dt><dd>{route.qualification.replaceAll("_", " ")}</dd></div></dl><p>{route.limitation}</p>{relayed ? <div className="source-disclosure"><p><strong>Two ways to inspect this live response:</strong> the CLD relay retains neither response body nor a copy, and adds request provenance headers. The official API action leaves CLD and opens the fixed Scottish Parliament source route directly.</p><dl className="response-guide"><div><dt>Response guide</dt><dd>{guideText.observedStructure}</dd></div><div><dt>Variables and elements</dt><dd><ul>{guideText.variables.map((variable) => <li key={variable.name}><code>{variable.name}</code> — {variable.note}</li>)}</ul></dd></div><div><dt>Interpretive limit</dt><dd>{guideText.caution}</dd></div><div><dt>Citation guidance</dt><dd>Cite the Scottish Parliament Open Data endpoint and your own access date/time. Cite CLD only as the no-retention access/provenance layer, not as the source-data publisher or an immutable release.</dd></div></dl><details className="source-examples"><summary>Show {examples.length === 1 ? "the source-style API route" : `${examples.length} individual source-style API routes`}</summary><p>Each link below has its source example identifier or year already embedded. No value is entered, generated, or retained by CLD.</p><div className="source-example-list">{examples.map((example) => <section className="source-example" key={example.label}><div><strong>{example.label}</strong><code>{sourceUrl(route, example.parameters, false)}</code>{example.note ? <p>{example.note}</p> : null}</div><div className="source-actions"><a className="source-action relay-action" href={sourceUrl(route, example.parameters, true)} target="_blank" rel="noreferrer">{actionVerb} via CLD no-retention relay</a><a className="source-action official-action" href={sourceUrl(route, example.parameters, false)} target="_blank" rel="noreferrer">{actionVerb} from Scottish Parliament API directly</a></div></section>)}</div></details></div> : null}</div></details>;
}

function Db1Panel({ panel }: { panel: Db1Preview }) {
  const title = panel.source.route_id.replace("gb-sct.", "").replaceAll(".", " · ");
  const recordCount = panel.records.length;
  return <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 baseline</p><h3>{title}</h3><code>{panel.source.source_path}</code></div><div className="route-badge-state"><span className="route-state">{panel.reconciliation_state.replaceAll("_", " ")}</span><span className="route-expand-label">Show details</span></div></div></summary><div className="route-details"><dl><div><dt>Data layer</dt><dd>Retained DB1 operational projection — fixed baseline; no live source action.</dd></div><div><dt>Capture provenance</dt><dd>{new Date(panel.source.retrieved_at).toLocaleString()} · manifest <code>{panel.source.manifest_id}</code> · run <code>{panel.source.capture_run_id}</code></dd></div><div><dt>Raw-object evidence</dt><dd>{panel.source.content_type} · {panel.source.raw_byte_length} bytes · SHA-256 <code>{panel.source.raw_sha256}</code> · raw access {panel.raw_access.replaceAll("_", " ")}</dd></div><div><dt>Projection build</dt><dd><code>{panel.projection.name}</code> · build <code>{panel.projection.build_id}</code> · {panel.projection.projected_records} records / {panel.projection.rejected_records} rejections · {panel.projection.integrity_status}</dd></div></dl><section className="db1-provenance"><h3>Observed structure</h3><p className="panel-copy">Keys and types are observed in this named retained projection only. They are not a source codebook, analytical variable definition, or DB2 dataset.</p><ul className="structure-list">{panel.observed_structure.map((field) => <li key={field.key}><code>{field.key}</code> · {field.observed_types.join(", ")} · present in {field.record_count} projected record{field.record_count === 1 ? "" : "s"}</li>)}</ul></section><section className="db1-provenance"><h3>Limits and citation guidance</h3><ul>{panel.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul><p className="panel-copy">Suggested citation: Scottish Parliament Open Data, <code>{panel.source.source_path}</code>, retrieved {new Date(panel.source.retrieved_at).toISOString()}; preserved by Comparative Legislative Data as manifest <code>{panel.source.manifest_id}</code>, projection build <code>{panel.projection.build_id}</code>; accessed {new Date().toISOString()}.</p></section><section className="db1-provenance"><h3>Browse retained records</h3><p className="panel-copy">{recordCount} preserved source object{recordCount === 1 ? "" : "s"} are available for inspection. Source position is retained as technical lineage only; it is not a substantive ordering, category, or DB2 variable.</p><details className="db1-record-browser"><summary>Inspect retained records and source positions</summary><div className="db1-record-list">{panel.records.map((record) => <details className="db1-record" key={record.source_position}><summary>Record provenance · source position {record.source_position}</summary><pre>{JSON.stringify(record.preserved_record, null, 2)}</pre></details>)}</div></details></section></div></details>;
}

function Db1AccessPlanPanel({ panel }: { panel: Db1AccessPlan }) {
  return <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 baseline · access plan</p><h3>formal stages · collection</h3><code>{panel.source.source_path}</code></div><div className="route-badge-state"><span className="route-state">{panel.reconciliation_state.replaceAll("_", " ")}</span><span className="route-expand-label">Show access plan</span></div></div></summary><div className="route-details"><dl><div><dt>Data layer</dt><dd>Retained DB1 operational projection — fixed baseline; no live source action.</dd></div><div><dt>Access mode</dt><dd>Access plan first. This release provides provenance and observed structure, not a collection browser or download.</dd></div><div><dt>Capture provenance</dt><dd>{new Date(panel.source.retrieved_at).toLocaleString()} · manifest <code>{panel.source.manifest_id}</code> · run <code>{panel.source.capture_run_id}</code></dd></div><div><dt>Raw-object evidence</dt><dd>{panel.source.content_type} · {panel.source.raw_byte_length} bytes · SHA-256 <code>{panel.source.raw_sha256}</code> · raw access {panel.raw_access.replaceAll("_", " ")}</dd></div><div><dt>Projection build</dt><dd><code>{panel.projection.name}</code> · build <code>{panel.projection.build_id}</code> · {panel.projection.projected_records} records / {panel.projection.rejected_records} rejections · {panel.projection.integrity_status}</dd></div></dl><section className="db1-provenance"><h3>Observed structure</h3><p className="panel-copy">Keys and types are observed in this named retained projection only. They are not a source codebook, analytical variable definition, legislative-stage interpretation, or DB2 dataset.</p><ul className="structure-list">{panel.observed_structure.map((field) => <li key={field.key}><code>{field.key}</code> · {field.observed_types.join(", ")} · present in {field.record_count} projected record{field.record_count === 1 ? "" : "s"}</li>)}</ul></section><section className="db1-provenance"><h3>Record-level lineage</h3><p className="panel-copy">{panel.record_lineage.projected_record_count} projected source object{panel.record_lineage.projected_record_count === 1 ? "" : "s"} have retained manifest and source-position lineage. {panel.record_lineage.access_note}</p></section><section className="db1-provenance"><h3>Limits and citation guidance</h3><ul>{panel.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul><p className="panel-copy">Suggested citation: Scottish Parliament Open Data, <code>{panel.source.source_path}</code>, retrieved {new Date(panel.source.retrieved_at).toISOString()}; preserved by Comparative Legislative Data as manifest <code>{panel.source.manifest_id}</code>, projection build <code>{panel.projection.build_id}</code>; accessed {new Date().toISOString()}.</p></section></div></details>;
}

function Db1PagedPanel({ panel, title, onPage }: { panel: Db1Paged; title: string; onPage: (offset: number) => void }) {
  const { offset, limit, total_records: totalRecords, records } = panel.record_page;
  const canGoBack = offset > 0;
  const canGoForward = offset + records.length < totalRecords;
  return <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 collection · server-side selection</p><h3>{title}</h3><code>{panel.source.source_path}</code></div><div className="route-badge-state"><span className="route-state">{panel.reconciliation_state.replaceAll("_", " ")}</span><span className="route-expand-label">Show retained release</span></div></div></summary><div className="route-details"><dl><div><dt>Data layer</dt><dd>Retained DB1 operational projection — named initial baseline; no live source action.</dd></div><div><dt>Access mode</dt><dd>Server-side selection. Only fixed pagination is available; no filter, generic query, raw-object route, or download.</dd></div><div><dt>Capture provenance</dt><dd>{new Date(panel.source.retrieved_at).toLocaleString()} · manifest <code>{panel.source.manifest_id}</code> · run <code>{panel.source.capture_run_id}</code></dd></div><div><dt>Raw-object evidence</dt><dd>{panel.source.content_type} · {panel.source.raw_byte_length} bytes · SHA-256 <code>{panel.source.raw_sha256}</code> · raw access {panel.raw_access.replaceAll("_", " ")}</dd></div><div><dt>Projection build</dt><dd><code>{panel.projection.name}</code> · build <code>{panel.projection.build_id}</code> · {panel.projection.projected_records} records / {panel.projection.rejected_records} rejections · {panel.projection.integrity_status}</dd></div></dl><section className="db1-provenance"><h3>Observed structure</h3><p className="panel-copy">Keys and types are observed in this named retained projection only. They are not a source codebook, analytical variable definition, or DB2 dataset.</p><ul className="structure-list">{panel.observed_structure.map((field) => <li key={field.key}><code>{field.key}</code> · {field.observed_types.join(", ")} · present in {field.record_count} projected record{field.record_count === 1 ? "" : "s"}</li>)}</ul></section><section className="db1-provenance"><h3>Browse retained records</h3><p className="panel-copy">Showing source positions {records.length ? `${offset}–${offset + records.length - 1}` : "none"} of {totalRecords}. Source position is technical lineage only, not a substantive ordering, category, or DB2 variable.</p><div className="source-actions"><button type="button" className="secondary-button" disabled={!canGoBack} onClick={() => onPage(Math.max(0, offset - limit))}>Previous page</button><button type="button" className="secondary-button" disabled={!canGoForward} onClick={() => onPage(offset + limit)}>Next page</button></div><div className="db1-record-list">{records.map((record) => <details className="db1-record" key={record.source_position}><summary>Record provenance · source position {record.source_position}</summary><pre>{JSON.stringify(record.preserved_record, null, 2)}</pre></details>)}</div></section><section className="db1-provenance"><h3>Limits and citation guidance</h3><ul>{panel.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul><p className="panel-copy">Suggested citation: Scottish Parliament Open Data, <code>{panel.source.source_path}</code>, retrieved {new Date(panel.source.retrieved_at).toISOString()}; preserved by Comparative Legislative Data as manifest <code>{panel.source.manifest_id}</code>, projection build <code>{panel.projection.build_id}</code>; accessed {new Date().toISOString()}.</p></section></div></details>;
}

function Db1SubjectGroup({ section, releases }: { section: (typeof catalogueSections)[number]; releases: ReactNode[] }) {
  const availableReleases = releases.filter(Boolean);
  if (availableReleases.length === 0) return null;
  return <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>{section.title}</h3></div><div className="catalogue-section-state"><p>{availableReleases.length} retained release{availableReleases.length === 1 ? "" : "s"}</p><span>Show retained releases</span></div></summary><div className="catalogue-list">{releases}</div></details>;
}

function Db1RetrievalExamples({ endpoint, downloadEndpoint }: { endpoint: string; downloadEndpoint?: string }) {
  const url = `https://legislativedata.org/api${endpoint}?offset=0&limit=20`;
  const downloadUrl = downloadEndpoint ? `https://legislativedata.org/api${downloadEndpoint}` : undefined;
  return <details className="source-examples"><summary>Show fixed retrieval examples</summary><p>These examples name this retained release and fixed pagination only. Replace the placeholder with your own authenticated private-beta session cookie; they do not provide a generic query interface.</p><dl className="response-guide"><div><dt>curl</dt><dd><pre>{`curl --cookie "cld_access_session=YOUR_SESSION_COOKIE" "${url}"`}</pre></dd></div><div><dt>Python</dt><dd><pre>{`requests.get("${url}", cookies={"cld_access_session": "YOUR_SESSION_COOKIE"})`}</pre></dd></div><div><dt>JavaScript</dt><dd><pre>{`fetch("${url}", { credentials: "include" })`}</pre></dd></div>{downloadUrl ? <div><dt>JSONL pilot</dt><dd><pre>{`curl --cookie "cld_access_session=YOUR_SESSION_COOKIE" -OJ "${downloadUrl}"`}</pre></dd></div> : null}</dl></details>;
}

function researchRouteUrl(routeId: string, suffix: "raw" | "records", query = ""): string {
  return `/api/db1/gb-sct/research/releases/${encodeURIComponent(routeId)}/${suffix}${query}`;
}

function sourceCondition(release: Db1ResearchRelease): { label: string; text: string } {
  if (release.availability === "UPSTREAM_AVAILABILITY_MESSAGE") return {
    label: "Scottish Parliament availability notice",
    text: "When this response was captured, the Scottish Parliament said the data were presently unavailable. This does not establish that historical records do not exist."
  };
  if (release.availability === "EMPTY_RESPONSE") return {
    label: "No records in this retained response",
    text: "The retained response contains no records. This does not establish historical nonexistence."
  };
  if (!release.research_access.browse_available) return {
    label: "Original JSON available",
    text: "A record browser is not yet available for this response. You can still view or download the retained original JSON."
  };
  return {
    label: "Records returned in this retained response",
    text: "This is a dated retained response, not a claim of complete or current source coverage."
  };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [feedback, setFeedback] = useState<string | undefined>();
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable");
      await navigator.clipboard.writeText(value);
      setFeedback(`${label} copied.`);
    } catch {
      setFeedback("Copy is unavailable in this browser. Select the text below to copy it.");
    }
  }
  return <span className="copy-control"><button type="button" className="copy-button" onClick={() => void copy()}>Copy {label}</button>{feedback ? <span role="status" aria-live="polite">{feedback}</span> : null}</span>;
}

function Db1ResearchReleaseCard({ release, records, onBrowse, loading }: { release: Db1ResearchRelease; records?: Db1ResearchRecords | undefined; onBrowse: (routeId: string, offset: number) => void; loading: boolean }) {
  const rawUrl = researchRouteUrl(release.route_id, "raw");
  const rawDownloadUrl = researchRouteUrl(release.route_id, "raw", "?download=1");
  const page = records?.page;
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const condition = sourceCondition(release);
  const citation = `Scottish Parliament Open Data, ${release.source_url}, retrieved ${new Date(release.capture.retrieved_at).toISOString()}; retained by Comparative Legislative Data (DB1), manifest ${release.capture.manifest_id}. Accessed ${new Date().toISOString()}.`;
  useEffect(() => { if (page && !loading) resultsHeading.current?.focus(); }, [loading, page?.offset, page?.total_records]);
  return <details className="route-card route-card-db1 research-release"><summary><div className="route-badge"><div><p className="route-group">Retained response{release.source_year ? ` · ${release.source_year}` : ""}</p><h3>{release.endpoint}</h3><code>{release.source_path}</code></div><div className="route-badge-state"><span className="route-state">{condition.label}</span><span className="route-expand-label">Show data access</span></div></div></summary><div className="route-details research-workspace"><p className="release-identity">Retained Scottish Parliament response · captured {new Date(release.capture.retrieved_at).toLocaleDateString()}</p><div className="source-actions primary-actions">{release.research_access.browse_available ? <button type="button" className="source-action relay-action" onClick={() => onBrowse(release.route_id, 0)} disabled={loading}>{loading ? "Loading data…" : "View data"}</button> : null}<a className="source-action official-action" href={rawDownloadUrl}>Download original JSON</a><a className="source-action official-action" href={release.source_url} target="_blank" rel="noreferrer">Open Scottish Parliament source</a></div><section className={`source-disclosure source-condition${release.availability === "UPSTREAM_AVAILABILITY_MESSAGE" ? " source-condition-notice" : ""}`}><p><strong>{condition.label}</strong></p><p>{condition.text}</p></section>{release.research_access.browse_available ? <section className="research-section" aria-labelledby={`${release.route_id}-explore`}><h4 id={`${release.route_id}-explore`}>Explore retained records</h4><p className="panel-copy">{release.research_access.record_count?.toLocaleString()} records are available in fixed, server-side pages. Record order has no analytical meaning.</p>{page ? <div className="db1-record-list"><h5 ref={resultsHeading} tabIndex={-1}>Records {page.records.length ? `${page.offset + 1}–${page.offset + page.records.length}` : "0"} of {page.total_records.toLocaleString()}</h5><div className="source-actions"><button type="button" className="secondary-button" disabled={loading || page.offset === 0} onClick={() => onBrowse(release.route_id, Math.max(0, page.offset - page.limit))}>Previous 20</button><button type="button" className="secondary-button" disabled={loading || page.offset + page.records.length >= page.total_records} onClick={() => onBrowse(release.route_id, page.offset + page.limit)}>Next 20</button></div>{page.records.map((record) => <details className="db1-record" key={record.source_position}><summary>View retained record</summary><pre>{JSON.stringify(record.preserved_record, null, 2)}</pre><p className="record-lineage">Technical lineage: source position {record.source_position}</p></details>)}</div> : <p className="action-hint" role="status">Select “View data” to load the first 20 retained records.</p>}</section> : null}<details className="research-section"><summary>Show data guide</summary>{release.research_access.observed_structure.length > 0 ? <><p className="panel-copy">Observed in this retained response; not a DB2 codebook or validated field definition.</p><ul className="structure-list">{release.research_access.observed_structure.map((field) => <li key={field.key}><code>{field.key}</code><span>{field.observed_types.join(", ")} · present in {field.record_count.toLocaleString()} record{field.record_count === 1 ? "" : "s"}</span></li>)}</ul></> : <p className="panel-copy">No object-record profile is available for this retained response. This does not imply that the source returned no data.</p>}</details><details className="research-section"><summary>Show provenance and citation</summary><dl className="provenance-list"><div><dt>Source URL</dt><dd><a href={release.source_url} target="_blank" rel="noreferrer">{release.source_url}</a></dd></div><div><dt>Capture</dt><dd>{new Date(release.capture.retrieved_at).toLocaleString()} · {release.capture.content_type} · {release.capture.raw_byte_length.toLocaleString()} bytes</dd></div><div><dt>Integrity</dt><dd>SHA-256 <code>{release.capture.raw_sha256}</code></dd></div><div><dt>Reconciliation</dt><dd>{release.reconciliation.state.replaceAll("_", " ")}{release.reconciliation.observed_at ? ` · last recorded ${new Date(release.reconciliation.observed_at).toLocaleString()}` : ""}. Operational evidence only; not a general freshness claim.</dd></div></dl><div className="citation-block"><p><strong>Suggested citation</strong></p><pre>{citation}</pre><CopyButton label="citation" value={citation} /></div><details className="source-examples"><summary>Show request examples</summary><dl className="response-guide"><div><dt>curl</dt><dd><pre>{`curl --cookie "cld_access_session=YOUR_SESSION_COOKIE" -OJ "https://legislativedata.org${rawDownloadUrl}"`}</pre></dd></div><div><dt>Python</dt><dd><pre>{`requests.get("https://legislativedata.org${rawUrl}", cookies={"cld_access_session": "YOUR_SESSION_COOKIE"})`}</pre></dd></div><div><dt>R</dt><dd><pre>{`httr2::request("https://legislativedata.org${rawUrl}") |> httr2::req_perform()`}</pre></dd></div><div><dt>JavaScript</dt><dd><pre>{`fetch("${rawUrl}", { credentials: "include" })`}</pre></dd></div></dl></details></details></div></details>;
}

async function request(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(`/api${path}`, { ...init, cache: "no-store", credentials: "same-origin", headers });
}

function App() {
  const [view, setView] = useState<View>("login");
  const [message, setMessage] = useState("Private beta access is available. Research data is not available from this application.");
  const [formFeedback, setFormFeedback] = useState<string | undefined>();
  const [identity, setIdentity] = useState<Identity>({ authenticated: false, email: null, roles: [], logout_proof: null, data_layers_available: false });
  const [activationToken, setActivationToken] = useState<string | undefined>();
  const [applications, setApplications] = useState<Array<{ id: string; email: string; requestText: string; createdAt: string }>>([]);
  const [catalogue, setCatalogue] = useState<Catalogue | undefined>();
  const [catalogueFeedback, setCatalogueFeedback] = useState<string | undefined>();
  const [db1Catalogue, setDb1Catalogue] = useState<Db1Catalogue | undefined>();
  const [db1InstitutionalCatalogue, setDb1InstitutionalCatalogue] = useState<Db1Catalogue | undefined>();
  const [db1FormalStages, setDb1FormalStages] = useState<Db1AccessPlan | undefined>();
  const [db1Bills, setDb1Bills] = useState<Db1Paged | undefined>();
  const [db1GovernmentRoles, setDb1GovernmentRoles] = useState<Db1Paged | undefined>();
  const [db1PartyRoles, setDb1PartyRoles] = useState<Db1Paged | undefined>();
  const [db1Parties, setDb1Parties] = useState<Db1Paged | undefined>();
  const [db1CommitteeRoles, setDb1CommitteeRoles] = useState<Db1Paged | undefined>();
  const [db1Committees, setDb1Committees] = useState<Db1Paged | undefined>();
  const [db1MemberContext, setDb1MemberContext] = useState<Partial<Record<(typeof memberContextDb1Routes)[number]["key"], Db1Paged>>>({});
  const [db1MqaTaxonomyLink, setDb1MqaTaxonomyLink] = useState<Partial<Record<(typeof mqaTaxonomyLinkDb1Routes)[number]["key"], Db1Paged>>>({});
  const [db1MqaEventSubtypes, setDb1MqaEventSubtypes] = useState<Db1Paged | undefined>();
  const [db1MqaConsideration, setDb1MqaConsideration] = useState<Db1Paged | undefined>();
  const [db1MqaProgramme, setDb1MqaProgramme] = useState<Db1Paged | undefined>();
  const [db1MqaAnnualWindow, setDb1MqaAnnualWindow] = useState<Partial<Record<(typeof mqaAnnualWindowDb1Routes)[number]["key"], Db1Paged>>>({});
  const [db1D18AnnualWindow, setDb1D18AnnualWindow] = useState<Record<string, Db1Paged | undefined>>({});
  const [db1D19OfficialReports, setDb1D19OfficialReports] = useState<Partial<Record<(typeof d19OfficialReportsDb1Routes)[number]["key"], Db1Paged>>>({});
  const [db1D20OfficialReports, setDb1D20OfficialReports] = useState<Record<string, Db1Paged | undefined>>({});
  const [db1Feedback, setDb1Feedback] = useState<string | undefined>();
  const [db1ResearchCatalogue, setDb1ResearchCatalogue] = useState<Db1ResearchCatalogue | undefined>();
  const [db1ResearchRecords, setDb1ResearchRecords] = useState<Record<string, Db1ResearchRecords | undefined>>({});
  const [db1LoadingRoute, setDb1LoadingRoute] = useState<string | undefined>();

  async function refreshIdentity() {
    const response = await request("/auth/me");
    if (!response.ok) return undefined;
    const nextIdentity = await response.json() as Identity;
    setIdentity(nextIdentity);
    return nextIdentity;
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const magic = query.get("magic");
    const activation = query.get("activate");
    if (activation) {
      setActivationToken(activation);
      setMessage("Choose a password to activate your account.");
      return;
    }
    if (magic) {
      void request("/auth/magic-link/consume", { method: "POST", body: JSON.stringify({ token: magic }) }).then(async () => {
        await refreshIdentity();
        setMessage("If the link was valid, you are now signed in.");
        window.history.replaceState({}, "", "/");
      });
      return;
    }
    void refreshIdentity();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>, path: string, values: Record<string, string>, success: string) {
    event.preventDefault();
    const response = await request(path, { method: "POST", body: JSON.stringify(values) });
    if (!response.ok) {
      const failure = await response.json().catch(() => undefined) as { message?: unknown } | undefined;
      setFormFeedback(typeof failure?.message === "string" ? failure.message : "That request could not be completed. Please try again.");
      return undefined;
    }
    setFormFeedback(success);
    return refreshIdentity();
  }

  async function loadApplications() {
    const response = await request("/auth/admin/applications");
    if (response.ok) setApplications((await response.json()).applications);
  }

  async function approve(id: string) {
    const response = await request(`/auth/admin/applications/${id}/approve`, { method: "POST" });
    if (!response.ok) {
      const failure = await response.json().catch(() => undefined) as { message?: unknown } | undefined;
      setFormFeedback(typeof failure?.message === "string" ? failure.message : "Approval could not be completed. The applicant remains pending.");
      return;
    }
    await loadApplications();
    setFormFeedback("Approval complete. An activation email has been sent.");
  }

  async function loadCatalogue() {
    const response = await request("/catalogue/gb-sct");
    if (!response.ok) {
      setCatalogueFeedback("The route catalogue is unavailable for this account.");
      return;
    }
    setCatalogue(await response.json() as Catalogue);
    setCatalogueFeedback(undefined);
  }

  async function loadDb1Catalogue() {
    const response = await request("/db1/gb-sct/research/catalogue");
    if (!response.ok) {
      setDb1Feedback("The retained DB1 catalogue is unavailable for this account.");
      return;
    }
    setDb1ResearchCatalogue(await response.json() as Db1ResearchCatalogue);
    setDb1Feedback(undefined);
  }

  async function loadDb1ResearchRecords(routeId: string, offset: number) {
    setDb1LoadingRoute(routeId);
    try {
      const response = await request(`${researchRouteUrl(routeId, "records")}?offset=${offset}&limit=20`);
      if (!response.ok) {
        setDb1Feedback("The retained record page could not be loaded. The exact raw response remains available.");
        return;
      }
      const result = await response.json() as Db1ResearchRecords;
      setDb1ResearchRecords((current) => ({ ...current, [routeId]: result }));
      setDb1Feedback(undefined);
    } catch {
      setDb1Feedback("The retained record page could not be loaded. The exact raw response remains available.");
    } finally {
      setDb1LoadingRoute(undefined);
    }
  }

  async function loadDb1Bills(offset: number) {
    const response = await request(`/db1/gb-sct/bills/d6-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1Bills(await response.json() as Db1Paged);
  }

  async function loadDb1GovernmentRoles(offset: number) {
    const response = await request(`/db1/gb-sct/government-roles/d7-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1GovernmentRoles(await response.json() as Db1Paged);
  }

  async function loadDb1PartyRoles(offset: number) {
    const response = await request(`/db1/gb-sct/party-roles/d9-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1PartyRoles(await response.json() as Db1Paged);
  }

  async function loadDb1Parties(offset: number) {
    const response = await request(`/db1/gb-sct/parties/d10-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1Parties(await response.json() as Db1Paged);
  }

  async function loadDb1CommitteeRoles(offset: number) {
    const response = await request(`/db1/gb-sct/committee-roles/d8-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1CommitteeRoles(await response.json() as Db1Paged);
  }

  async function loadDb1Committees(offset: number) {
    const response = await request(`/db1/gb-sct/committees/d12-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1Committees(await response.json() as Db1Paged);
  }

  async function loadDb1MemberContext(route: (typeof memberContextDb1Routes)[number], offset: number) {
    const response = await request(`${route.endpoint}?offset=${offset}&limit=20`);
    if (!response.ok) return;
    const panel = await response.json() as Db1Paged;
    setDb1MemberContext((current) => ({ ...current, [route.key]: panel }));
  }

  async function loadDb1MqaTaxonomyLink(route: (typeof mqaTaxonomyLinkDb1Routes)[number], offset: number) {
    const response = await request(`${route.endpoint}?offset=${offset}&limit=20`);
    if (!response.ok) return;
    const panel = await response.json() as Db1Paged;
    setDb1MqaTaxonomyLink((current) => ({ ...current, [route.key]: panel }));
  }

  async function loadDb1MqaEventSubtypes(offset: number) {
    const response = await request(`/db1/gb-sct/mqa-event-subtypes/d14-v1?offset=${offset}&limit=20`);
    if (response.ok) setDb1MqaEventSubtypes(await response.json() as Db1Paged);
  }
  async function loadDb1MqaConsideration(offset: number) { const response = await request(`/db1/gb-sct/mqa-business-consideration/d15-v1?offset=${offset}&limit=20`); if (response.ok) setDb1MqaConsideration(await response.json() as Db1Paged); }
  async function loadDb1MqaProgramme(offset: number) { const response = await request(`/db1/gb-sct/mqa-business-programme/d16-v1?offset=${offset}&limit=20`); if (response.ok) setDb1MqaProgramme(await response.json() as Db1Paged); }
  async function loadDb1MqaAnnualWindow(route: (typeof mqaAnnualWindowDb1Routes)[number], offset: number) { const response = await request(`${route.endpoint}?offset=${offset}&limit=20`); if (!response.ok) return; const panel = await response.json() as Db1Paged; setDb1MqaAnnualWindow((current) => ({ ...current, [route.key]: panel })); }
  async function loadDb1D18AnnualWindow(route: (typeof d18AnnualWindowDb1Routes)[number], offset: number) { const response = await request(`${route.endpoint}?offset=${offset}&limit=20`); if (!response.ok) return; const panel = await response.json() as Db1Paged; setDb1D18AnnualWindow((current) => ({ ...current, [route.key]: panel })); }
  async function loadDb1D19OfficialReports(route: (typeof d19OfficialReportsDb1Routes)[number], offset: number) { const response = await request(`${route.endpoint}?offset=${offset}&limit=20`); if (!response.ok) { setDb1Feedback(response.status === 403 ? "This retained D19 projection is not available to this account." : "The retained D19 projection could not be loaded. Please try again."); return; } const panel = await response.json() as Db1Paged; setDb1D19OfficialReports((current) => ({ ...current, [route.key]: panel })); setDb1Feedback(undefined); }
  async function loadDb1D20OfficialReports(route: (typeof d20OfficialReportsDb1Routes)[number], offset: number) { const response = await request(`${route.endpoint}?offset=${offset}&limit=20`); if (!response.ok) { setDb1Feedback(route.key === "committee-official-reports-2006" ? "The 2006 Committee Official Reports source object is retained, but its top-level projection was rejected as NOT_AN_OBJECT. It has no browsable DB1 release." : "The retained D20 projection could not be loaded. Please try again."); return; } const panel = await response.json() as Db1Paged; setDb1D20OfficialReports((current) => ({ ...current, [route.key]: panel })); setDb1Feedback(undefined); }

  const db1ReferencePanels = db1Catalogue?.panels ?? [];
  const db1InstitutionalPanels = db1InstitutionalCatalogue?.panels ?? [];
  const panelsFor = (panels: Db1Preview[], routeIds: string[]) => panels.filter((panel) => routeIds.includes(panel.source.route_id));
  const memberContextPanels = (routes: readonly (typeof memberContextDb1Routes)[number][]) => routes.map((route) => {
    const panel = db1MemberContext[route.key];
    return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MemberContext(route, offset)} /> : null;
  });
  const d18AnnualWindowPanel = <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 historical annual windows · D18</p><h3>MQA questions and votes on motions · 2011–2025</h3><code>30 fixed source-year projections</code></div><div className="route-badge-state"><span className="route-state">weekly failure retry</span><span className="route-expand-label">Show source years</span></div></div></summary><div className="route-details"><p className="panel-copy">Each source-year release is a fixed retained DB1 projection of the named Scottish Parliament annual URL. Choose a year and source family to inspect it; this is server-side page selection, not a year-input API, generic query, download, or DB2 dataset. The current weekly D18 job retries unsuccessful routes; recurring comparison of successful historical releases is pending remediation.</p><div className="source-example-list">{Array.from({ length: 15 }, (_, index) => 2011 + index).map((year) => { const questions = d18AnnualWindowDb1Routes.find((route) => route.key === `mqa-questions-${year}`); const votes = d18AnnualWindowDb1Routes.find((route) => route.key === `votes-on-motions-${year}`); const questionPanel = questions ? db1D18AnnualWindow[questions.key] : undefined; const votePanel = votes ? db1D18AnnualWindow[votes.key] : undefined; return <section className="source-example" key={year}><div><strong>{year}</strong><p>Two fixed retained source-year releases.</p></div><div className="source-actions">{questions ? <button type="button" className="secondary-button" onClick={() => void loadDb1D18AnnualWindow(questions, 0)}>MQA questions</button> : null}{votes ? <button type="button" className="secondary-button" onClick={() => void loadDb1D18AnnualWindow(votes, 0)}>Votes on motions</button> : null}</div>{questionPanel ? <Db1PagedPanel panel={questionPanel} title={questions!.title} onPage={(offset) => void loadDb1D18AnnualWindow(questions!, offset)} /> : null}{votePanel ? <Db1PagedPanel panel={votePanel} title={votes!.title} onPage={(offset) => void loadDb1D18AnnualWindow(votes!, offset)} /> : null}</section>; })}</div></div></details>;
  const d19OfficialReportsPanel = <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 annual Official Reports · D19</p><h3>Committee and Plenary · 2025</h3><code>2 fixed source-year projections</code></div><div className="route-badge-state"><span className="route-state">weekly reconciliation</span><span className="route-expand-label">Show retained releases</span></div></div></summary><div className="route-details"><p className="panel-copy">Each release is a fixed retained DB1 projection of the named Scottish Parliament 2025 Official Reports URL. Select one source family to inspect a server-side page; this is not a live proxy, generic query, download, raw-object route, or DB2 dataset. The D19 service re-fetches both fixed URLs serially every week and compares their retained source-preserving releases.</p><div className="source-example-list">{d19OfficialReportsDb1Routes.map((route) => { const panel = db1D19OfficialReports[route.key]; return <section className="source-example" key={route.key}><div><strong>{route.title}</strong><code>{route.endpoint}</code></div><div className="source-actions"><button type="button" className="secondary-button" onClick={() => void loadDb1D19OfficialReports(route, 0)}>Inspect retained projection</button></div><Db1RetrievalExamples endpoint={route.endpoint} />{panel ? <Db1PagedPanel panel={panel} title={route.title} onPage={(offset) => void loadDb1D19OfficialReports(route, offset)} /> : null}</section>; })}</div></div></details>;
  const d20OfficialReportsPanel = <details className="route-card route-card-db1"><summary><div className="route-badge"><div><p className="route-group">Retained DB1 annual Official Reports · D20</p><h3>Committee and Plenary · 1999–2024, 2026</h3><code>53 publishable fixed source-year projections; one retained exception</code></div><div className="route-badge-state"><span className="route-state">initial capture complete</span><span className="route-expand-label">Show source years</span></div></div></summary><div className="route-details"><p className="panel-copy">Choose a fixed source year and report family to inspect its retained DB1 projection. These are dated initial releases, not live responses; 2006 Committee Official Reports is visibly retained as a non-publishable NOT_AN_OBJECT exception. The 2026 Plenary release also provides the first private-beta source-preserving JSONL download pilot.</p><div className="source-example-list">{[...Array.from({ length: 26 }, (_, index) => 1999 + index), 2026].map((year) => { const committee = d20OfficialReportsDb1Routes.find((route) => route.key === `committee-official-reports-${year}`); const plenary = d20OfficialReportsDb1Routes.find((route) => route.key === `plenary-official-reports-${year}`); const committeePanel = committee ? db1D20OfficialReports[committee.key] : undefined; const plenaryPanel = plenary ? db1D20OfficialReports[plenary.key] : undefined; return <section className="source-example" key={year}><div><strong>{year}</strong><p>{year === 2006 ? "Committee source retained but no publishable projection; Plenary release remains available." : "Two fixed retained source-year releases."}</p></div><div className="source-actions">{committee ? <button type="button" className="secondary-button" onClick={() => void loadDb1D20OfficialReports(committee, 0)}>Committee</button> : null}{plenary ? <button type="button" className="secondary-button" onClick={() => void loadDb1D20OfficialReports(plenary, 0)}>Plenary</button> : null}{plenary?.downloadEndpoint ? <a className="source-action official-action" href={`/api${plenary.downloadEndpoint}`}>Download 2026 Plenary JSONL</a> : null}</div>{committee ? <Db1RetrievalExamples endpoint={committee.endpoint} /> : null}{plenary ? <Db1RetrievalExamples endpoint={plenary.endpoint} {...(plenary.downloadEndpoint ? { downloadEndpoint: plenary.downloadEndpoint } : {})} /> : null}{committeePanel ? <Db1PagedPanel panel={committeePanel} title={committee!.title} onPage={(offset) => void loadDb1D20OfficialReports(committee!, offset)} /> : null}{plenaryPanel ? <Db1PagedPanel panel={plenaryPanel} title={plenary!.title} onPage={(offset) => void loadDb1D20OfficialReports(plenary!, offset)} /> : null}</section>; })}</div></div></details>;
  const mqaTaxonomyLinkPanels = [
    ...mqaTaxonomyLinkDb1Routes.map((route) => {
    const panel = db1MqaTaxonomyLink[route.key];
    return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MqaTaxonomyLink(route, offset)} /> : null;
    }),
    db1MqaConsideration ? <Db1PagedPanel key="mqa-business-consideration" panel={db1MqaConsideration} title="MQA business motions · consideration" onPage={(offset) => void loadDb1MqaConsideration(offset)} /> : null,
    db1MqaProgramme ? <Db1PagedPanel key="mqa-business-programme" panel={db1MqaProgramme} title="MQA business motions · programme" onPage={(offset) => void loadDb1MqaProgramme(offset)} /> : null,
    ...mqaAnnualWindowDb1Routes.map((route) => { const panel = db1MqaAnnualWindow[route.key]; return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MqaAnnualWindow(route, offset)} /> : null; }),
    d18AnnualWindowPanel
  ];

  if (view === "db1" && identity.authenticated && identity.data_layers_available) {
    return <main className="site-shell db1-shell"><header className="site-header"><a className="wordmark" href="/">Comparative <span>Legislative Data</span></a><p>Research infrastructure · Private beta</p></header><section className="db1-intro" aria-labelledby="page-title"><p className="breadcrumbs">Research access <span>/</span> Scottish Parliament <span>/</span> Retained source data</p><p className="eyebrow">DB1 research catalogue</p><h1 id="page-title">Retained Scottish Parliament data</h1><p>Explore dated source responses held by DB1. This is distinct from the live Scottish Parliament API and from the later DB2 variables layer.</p></section><p className="identity">Signed in as <strong>{identity.email}</strong>.</p><nav className="access-nav" aria-label="Access options"><span className="signed-in-badge">Private beta active</span><button type="button" onClick={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }}>Live API catalogue</button><button type="button" onClick={() => void loadDb1Catalogue()}>Refresh DB1 list</button><button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button>{identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}</nav><section className="catalogue-panel db1-panel" aria-labelledby="db1-heading"><div className="catalogue-heading"><div><p className="eyebrow">Scottish Parliament · retained source responses</p><h2 id="db1-heading">Find a source</h2><p className="panel-copy">Choose a research subject, then an endpoint and retained year or window. Each release identifies what you can inspect, download or verify.</p></div></div>{db1Feedback ? <p className="form-feedback" role="status">{db1Feedback}</p> : null}{db1ResearchCatalogue ? <><details className="source-disclosure db1-about"><summary>How DB1 differs from the live API</summary><p>DB1 preserves dated Scottish Parliament responses and their provenance. It is not a live API, a statement of complete/current coverage, or a DB2 analytical dataset.</p><ul>{db1ResearchCatalogue.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul></details><div className="catalogue-sections">{db1ResearchCatalogue.subjects.map((subject) => <details className="catalogue-section" key={subject.subject}><summary className="catalogue-section-heading"><div><p className="eyebrow">Research subject</p><h3>{subject.subject}</h3></div><div className="catalogue-section-state"><p>{subject.endpoints.length} endpoint{subject.endpoints.length === 1 ? "" : "s"}</p><span>Show endpoints</span></div></summary><div className="catalogue-list endpoint-list">{subject.endpoints.map((endpoint) => { const years = endpoint.releases.flatMap((release) => release.source_year === null ? [] : [release.source_year]); const coverage = years.length ? years.length === 1 ? `Retained year ${years[0]}` : `Retained years ${Math.min(...years)}–${Math.max(...years)}` : "Retained response"; const allYears = years.length > 1; const allYearsUrl = `/api/db1/gb-sct/research/all-years?${new URLSearchParams({ subject: subject.subject, endpoint: endpoint.endpoint }).toString()}`; return <details className="route-card route-card-db1 endpoint-card" key={endpoint.endpoint}><summary><div className="route-badge"><div><p className="route-group">{coverage}</p><h3>{endpoint.endpoint}</h3><code>{endpoint.releases.length} retained release{endpoint.releases.length === 1 ? "" : "s"}</code></div><div className="route-badge-state"><span className="route-state">View releases</span><span className="route-expand-label">Show releases</span></div></div></summary><div className="route-details">{allYears ? <section className="year-index"><p><strong>All retained years</strong></p><p>This index lists compatible DB1 releases and exceptions. It is not a combined download or one Scottish Parliament response.</p><a className="source-action official-action" href={allYearsUrl} target="_blank" rel="noreferrer">View retained year index</a></section> : null}<div className="release-list">{endpoint.releases.map((release) => <Db1ResearchReleaseCard key={release.route_id} release={release} records={db1ResearchRecords[release.route_id]} loading={db1LoadingRoute === release.route_id} onBrowse={(routeId, offset) => void loadDb1ResearchRecords(routeId, offset)} />)}</div></div></details>; })}</div></details>)}</div></> : <p className="panel-copy" role="status">Loading the retained-source catalogue…</p>}</section><p className="boundary">Private access only. DB1 provides dated retained source responses and provenance. No live source request, DB2 variable, chart, generic database query or public research release is available here.</p></main>;
  }

  if (view === "db1" && identity.authenticated && identity.data_layers_available && !db1ResearchCatalogue) {
    const billsPanels = panelsFor(db1ReferencePanels, ["gb-sct.bill-types.collection", "gb-sct.bill-stage-types.collection"]);
    const sessionPanels = panelsFor(db1ReferencePanels, ["gb-sct.sessions.collection"]);
    const representationPanels = panelsFor(db1InstitutionalPanels, ["gb-sct.constituencies.collection", "gb-sct.regions.collection"]);
    const committeeReferencePanels = panelsFor(db1InstitutionalPanels, ["gb-sct.committee-types.collection", "gb-sct.committee-type-links.collection"]);
    return <main className="site-shell"><header className="site-header"><a className="wordmark" href="/">Comparative <span>Legislative Data</span></a><p>Research infrastructure · Private beta</p></header><section className="intro" aria-labelledby="page-title"><p className="eyebrow">Scottish Parliament · Foundational release</p><h1 id="page-title">Transparent legislative data, built for research.</h1><p>Access is being opened gradually while the data architecture, provenance controls, and validation standards are put in place.</p></section><p className="status-message" role="status">{message}</p><p className="identity">Signed in as <strong>{identity.email}</strong>.</p><nav className="access-nav" aria-label="Access options"><span className="signed-in-badge">Private beta active</span><button type="button" onClick={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }}>Route catalogue</button><button type="button" onClick={() => { void loadDb1Catalogue(); }}>DB1 catalogue</button><button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button>{identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}</nav><section className="catalogue-panel db1-panel" aria-labelledby="db1-heading"><p className="eyebrow">Restricted DB1 catalogue</p><h2 id="db1-heading">Fixed retained baselines</h2><p className="panel-copy">These are retained, dated DB1 operational projections. They are not the live proxy, raw-object access, an unqualified mirror, or a canonical dataset.</p>{db1Feedback ? <p className="form-feedback" role="status">{db1Feedback}</p> : null}{db1Catalogue ? <><section className="source-disclosure"><p><strong>Fixed baselines, not live feeds:</strong> the named captures and projection records below do not change when the daily reconciliation services run. Any later projection needs its own named build and decision.</p><dl className="response-guide"><div><dt>Reference catalogue</dt><dd><code>{db1Catalogue.catalogue.id}</code> · built {new Date(db1Catalogue.catalogue.built_at).toLocaleString()} · {db1Catalogue.catalogue.integrity_status}</dd></div><div><dt>Catalogue limits</dt><dd><ul>{db1Catalogue.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul></dd></div></dl></section><div className="catalogue-sections"><Db1SubjectGroup section={catalogueSections[0]} releases={[db1Bills ? <Db1PagedPanel key="bills" panel={db1Bills} title="bills · collection" onPage={(offset) => void loadDb1Bills(offset)} /> : null, ...billsPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />), db1FormalStages ? <Db1AccessPlanPanel key="formal-stages" panel={db1FormalStages} /> : null]} /><Db1SubjectGroup section={catalogueSections[1]} releases={[...sessionPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />), ...memberContextPanels(memberContextDb1Routes.slice(0, 3)), ...representationPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)]} /><Db1SubjectGroup section={catalogueSections[2]} releases={[db1Parties ? <Db1PagedPanel key="parties" panel={db1Parties} title="parties · collection" onPage={(offset) => void loadDb1Parties(offset)} /> : null, db1PartyRoles ? <Db1PagedPanel key="party-roles" panel={db1PartyRoles} title="party roles · collection" onPage={(offset) => void loadDb1PartyRoles(offset)} /> : null, db1GovernmentRoles ? <Db1PagedPanel key="government-roles" panel={db1GovernmentRoles} title="government roles · collection" onPage={(offset) => void loadDb1GovernmentRoles(offset)} /> : null, ...memberContextPanels(memberContextDb1Routes.slice(3))]} /><Db1SubjectGroup section={catalogueSections[3]} releases={[db1Committees ? <Db1PagedPanel key="committees" panel={db1Committees} title="committees · collection" onPage={(offset) => void loadDb1Committees(offset)} /> : null, db1CommitteeRoles ? <Db1PagedPanel key="committee-roles" panel={db1CommitteeRoles} title="committee roles · collection" onPage={(offset) => void loadDb1CommitteeRoles(offset)} /> : null, ...committeeReferencePanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)]} /><Db1SubjectGroup section={catalogueSections[4]} releases={[...mqaTaxonomyLinkPanels, db1MqaEventSubtypes ? <Db1PagedPanel key="mqa-event-subtypes" panel={db1MqaEventSubtypes} title="MQA event subtypes · collection" onPage={(offset) => void loadDb1MqaEventSubtypes(offset)} /> : null]} /><Db1SubjectGroup section={catalogueSections[5]} releases={[d19OfficialReportsPanel, d20OfficialReportsPanel]} /></div></> : <p className="panel-copy">Loading the declared DB1 catalogue…</p>}</section><p className="boundary">Current boundary: private raw source relay plus, for eligible users, fixed retained DB1 releases with route-specific access modes. A single named source-preserving JSONL download pilot is available for the 2026 Plenary Official Reports release. No canonical dataset, chart, general DB1 query, or research release is available.</p></main>;
  }

  if (activationToken) {
    return <main className="site-shell"><header className="site-header"><a className="wordmark" href="/">Comparative <span>Legislative Data</span></a><p>Research infrastructure · Private beta</p></header><div className="auth-layout"><section className="access-panel activation-panel" aria-labelledby="password-heading"><p className="eyebrow">Account activation</p><h1 id="password-heading">Set your password</h1><p className="panel-copy">Create a password to finish activating your private-beta account.</p><p className="status-message" role="status">{message}</p><form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password", { token: activationToken, password }, "Your password has been set. Taking you to the beta shell…").then((nextIdentity) => { if (nextIdentity?.authenticated) { setActivationToken(undefined); setView("login"); setMessage("Your private-beta account is active."); window.history.replaceState({}, "", "/"); } else { setMessage("We could not confirm your session. Please use a new activation link."); } }); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Set password and continue</button></form></section></div></main>;
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="/">Comparative <span>Legislative Data</span></a>
        <p>Research infrastructure · Private beta</p>
      </header>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Scottish Parliament · Foundational release</p>
        <h1 id="page-title">Transparent legislative data, built for research.</h1>
        <p>Access is being opened gradually while the data architecture, provenance controls, and validation standards are put in place.</p>
      </section>
      <p className="status-message" role="status">{message}</p>
      {identity.authenticated ? <p className="identity">Signed in as <strong>{identity.email}</strong>.</p> : null}
      <nav className="access-nav" aria-label="Access options">
        {!identity.authenticated ? <><button type="button" onClick={() => { setView("login"); setFormFeedback(undefined); }}>Log in</button><button type="button" onClick={() => { setView("apply"); setFormFeedback(undefined); }}>Apply for beta access</button></> : null}
        {identity.authenticated ? <span className="signed-in-badge">Private beta active</span> : null}
        {identity.authenticated ? <button type="button" onClick={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }}>Route catalogue</button> : null}
        {identity.authenticated && identity.data_layers_available ? <button type="button" onClick={() => { setView("db1"); setFormFeedback(undefined); void loadDb1Catalogue(); }}>DB1 catalogue</button> : null}
        {identity.authenticated ? <button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button> : null}
        {identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}
      </nav>
      {identity.authenticated && view === "login" ? <section className="access-panel welcome-panel"><p className="eyebrow">Private beta active</p><h2>Welcome to the foundation release.</h2><p>Account controls are live. Research data access is intentionally not yet enabled.</p></section> : null}
      {view === "login" && !identity.authenticated ? <section className="access-panel" aria-labelledby="login-heading"><h2 id="login-heading">Log in</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/login", { identifier: String(data.get("identifier") ?? ""), password: String(data.get("password") ?? "") }, "Signed in.").then((nextIdentity) => { if (!nextIdentity?.authenticated) setFormFeedback("We could not sign you in. Check your email and password."); }); }}><label>Email or username<input name="identifier" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label><button>Log in</button></form><div className="form-divider">or use a passwordless link</div><form onSubmit={(event) => { const email = new FormData(event.currentTarget).get("email"); void submit(event, "/auth/magic-link", { email: String(email ?? "") }, "If an eligible account exists, a sign-in link will arrive shortly."); }}><label>Email for magic link<input name="email" type="email" required autoComplete="email" /></label><button className="secondary-button">Request magic link</button></form></section> : null}
      {view === "apply" ? <section className="access-panel" aria-labelledby="apply-heading"><h2 id="apply-heading">Apply for beta access</h2><p className="panel-copy">Tell us how you would use the platform. A superuser reviews each request.</p>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/applications", { email: String(data.get("email") ?? ""), requestText: String(data.get("requestText") ?? "") }, "Your request has been received. If approved, you will receive an activation link."); }}><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Why would access be useful?<textarea name="requestText" maxLength={2000} required /></label><button>Submit application</button></form></section> : null}
      {view === "settings" && identity.authenticated ? <section className="access-panel" aria-labelledby="settings-heading"><h2 id="settings-heading">Settings</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password/change", { password }, "Your password has been changed."); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Change password</button></form><button className="secondary-button" type="button" onClick={() => { void request("/auth/logout", { method: "POST", body: JSON.stringify({ logout_proof: identity.logout_proof ?? "" }) }).then(async (response) => { const outcome = await response.json().catch(() => undefined) as { signed_out?: unknown } | undefined; const nextIdentity = await refreshIdentity(); setView("login"); setMessage(response.ok && outcome?.signed_out === true && !nextIdentity?.authenticated ? "You are signed out." : "We could not confirm sign-out. Please try again."); }); }}>Log out</button></section> : null}
      {view === "admin" && identity.roles.includes("SUPERUSER") ? <section className="access-panel" aria-labelledby="admin-heading"><h2 id="admin-heading">Superuser review</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}{applications.length === 0 ? <p>No pending applications.</p> : <ul>{applications.map((application) => <li key={application.id}><p><strong>{application.email}</strong></p><p>{application.requestText}</p><button type="button" onClick={() => void approve(application.id)}>Approve</button></li>)}</ul>}</section> : null}
      {view === "catalogue" && identity.authenticated ? <section className="catalogue-panel" aria-labelledby="catalogue-heading"><p className="eyebrow">GB-SCT route inventory</p><h2 id="catalogue-heading">Transparent upstream access catalogue</h2><p className="panel-copy">This is raw, transient source access — not a CLD dataset or snapshot. Open a source family, then an endpoint badge, to inspect the fixed source-style route, response guidance, and the choice between the CLD relay and the official source.</p>{catalogueFeedback ? <p className="form-feedback" role="status">{catalogueFeedback}</p> : null}{catalogue ? <><p className="catalogue-summary"><strong>{catalogue.route_count} selected route forms</strong> · {catalogue.enabled_route_count} authenticated private no-retention relay routes available.</p><div className="catalogue-sections">{catalogueSections.map((section) => { const routes = catalogue.routes.filter((route) => (section.groups as readonly string[]).includes(route.group)); const enabled = routes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").length; return <details className="catalogue-section" key={section.id}><summary className="catalogue-section-heading"><div><p className="eyebrow">Source family</p><h3>{section.title}</h3></div><div className="catalogue-section-state"><p>{routes.length} route forms{enabled > 0 ? ` · ${enabled} live private route${enabled === 1 ? "" : "s"}` : ""}</p><span>Show endpoints</span></div></summary><div className="catalogue-list">{routes.map((route) => <RouteBadge key={route.id} route={route} />)}</div></details>; })}</div></> : <p className="panel-copy">Loading the route registry…</p>}</section> : null}
      {view === "db1" && identity.authenticated && identity.data_layers_available ? <section className="catalogue-panel db1-panel" aria-labelledby="db1-heading"><p className="eyebrow">Restricted DB1 catalogue</p><h2 id="db1-heading">Fixed retained baselines</h2><p className="panel-copy">These are retained, dated DB1 operational projections. They are not the live proxy, raw-object access, an unqualified mirror, or a canonical dataset.</p>{db1Feedback ? <p className="form-feedback" role="status">{db1Feedback}</p> : null}{db1Catalogue ? <><section className="source-disclosure"><p><strong>Fixed baselines, not live feeds:</strong> the named captures and projection records below do not change when the daily reconciliation services run. Any later projection needs its own named build and decision.</p><dl className="response-guide"><div><dt>Reference catalogue</dt><dd><code>{db1Catalogue.catalogue.id}</code> · built {new Date(db1Catalogue.catalogue.built_at).toLocaleString()} · {db1Catalogue.catalogue.integrity_status}</dd></div><div><dt>Catalogue limits</dt><dd><ul>{db1Catalogue.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul></dd></div></dl></section><div className="catalogue-sections">{(() => { const billsPanels = db1Catalogue.panels.filter((panel) => ["gb-sct.bill-types.collection", "gb-sct.bill-stage-types.collection"].includes(panel.source.route_id)); const releaseCount = billsPanels.length + (db1FormalStages ? 1 : 0) + (db1Bills ? 1 : 0); return releaseCount > 0 ? <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>Bills and formal stages</h3></div><div className="catalogue-section-state"><p>{releaseCount} retained release{releaseCount === 1 ? "" : "s"}</p><span>Show retained releases</span></div></summary><div className="catalogue-list">{db1Bills ? <Db1PagedPanel panel={db1Bills} title="bills · collection" onPage={(offset) => void loadDb1Bills(offset)} /> : null}{billsPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)}{db1FormalStages ? <Db1AccessPlanPanel panel={db1FormalStages} /> : null}</div></details> : null; })()}{db1GovernmentRoles || db1PartyRoles || db1Parties ? <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>Parties and government roles</h3></div><div className="catalogue-section-state"><p>{(db1GovernmentRoles ? 1 : 0) + (db1PartyRoles ? 1 : 0) + (db1Parties ? 1 : 0)} retained release{((db1GovernmentRoles ? 1 : 0) + (db1PartyRoles ? 1 : 0) + (db1Parties ? 1 : 0)) === 1 ? "" : "s"}</p><span>Show retained releases</span></div></summary><div className="catalogue-list">{db1Parties ? <Db1PagedPanel panel={db1Parties} title="parties · collection" onPage={(offset) => void loadDb1Parties(offset)} /> : null}{db1GovernmentRoles ? <Db1PagedPanel panel={db1GovernmentRoles} title="government roles · collection" onPage={(offset) => void loadDb1GovernmentRoles(offset)} /> : null}{db1PartyRoles ? <Db1PagedPanel panel={db1PartyRoles} title="party roles · collection" onPage={(offset) => void loadDb1PartyRoles(offset)} /> : null}</div></details> : null}{Object.keys(db1MemberContext).length > 0 ? <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>Members and representation</h3></div><div className="catalogue-section-state"><p>{Object.keys(db1MemberContext).length} retained release{Object.keys(db1MemberContext).length === 1 ? "" : "s"}</p><span>Show retained releases</span></div></summary><div className="catalogue-list">{memberContextDb1Routes.map((route) => { const panel = db1MemberContext[route.key]; return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MemberContext(route, offset)} /> : null; })}</div></details> : null}{db1CommitteeRoles ? <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>Committees and committee roles</h3></div><div className="catalogue-section-state"><p>1 retained release</p><span>Show retained release</span></div></summary><div className="catalogue-list"><Db1PagedPanel panel={db1CommitteeRoles} title="committee roles · collection" onPage={(offset) => void loadDb1CommitteeRoles(offset)} /></div></details> : null}{db1CatalogueSections.map((section) => { const panels = db1Catalogue.panels.filter((panel) => section.routes.includes(panel.source.route_id as never)); return <details className="catalogue-section" key={section.id}><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>{section.title}</h3></div><div className="catalogue-section-state"><p>{panels.length} fixed projection{panels.length === 1 ? "" : "s"}</p><span>Show projections</span></div></summary><div className="catalogue-list">{panels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)}</div></details>; })}{db1InstitutionalCatalogue || db1Committees ? <details className="catalogue-section"><summary className="catalogue-section-heading"><div><p className="eyebrow">Retained source group</p><h3>Institutional reference</h3></div><div className="catalogue-section-state"><p>{(db1InstitutionalCatalogue?.panels.length ?? 0) + (db1Committees ? 1 : 0)} retained release{((db1InstitutionalCatalogue?.panels.length ?? 0) + (db1Committees ? 1 : 0)) === 1 ? "" : "s"}</p><span>Show retained releases</span></div></summary><div className="catalogue-list">{db1Committees ? <Db1PagedPanel panel={db1Committees} title="committees · collection" onPage={(offset) => void loadDb1Committees(offset)} /> : null}{db1InstitutionalCatalogue?.panels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)}</div></details> : null}</div></> : <p className="panel-copy">Loading the declared DB1 catalogue…</p>}</section> : null}
      <p className="boundary">Current boundary: private raw source relay plus, for eligible users, fixed retained DB1 releases with route-specific access modes. No canonical dataset, chart, export, general DB1 query, or research release is available.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
