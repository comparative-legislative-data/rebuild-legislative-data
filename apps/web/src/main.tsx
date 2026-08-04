import { StrictMode, useEffect, useState } from "react";
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
  const [db1Feedback, setDb1Feedback] = useState<string | undefined>();

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
    const response = await request("/db1/gb-sct/reference-cohort/d4a-v1");
    if (!response.ok) {
      setDb1Feedback("The declared DB1 catalogue is unavailable for this account.");
      return;
    }
    setDb1Catalogue(await response.json() as Db1Catalogue);
    setDb1Feedback(undefined);
    const institutional = await request("/db1/gb-sct/institutional-reference/d4c-v1");
    if (institutional.ok) setDb1InstitutionalCatalogue(await institutional.json() as Db1Catalogue);
    const formalStages = await request("/db1/gb-sct/formal-stages/d5-v1");
    if (formalStages.ok) setDb1FormalStages(await formalStages.json() as Db1AccessPlan);
    await loadDb1Bills(0);
    await loadDb1GovernmentRoles(0);
    await loadDb1PartyRoles(0);
    await loadDb1Parties(0);
    await loadDb1CommitteeRoles(0);
    await loadDb1Committees(0);
    await Promise.all(memberContextDb1Routes.map((route) => loadDb1MemberContext(route, 0)));
    await Promise.all(mqaTaxonomyLinkDb1Routes.map((route) => loadDb1MqaTaxonomyLink(route, 0)));
    await loadDb1MqaEventSubtypes(0);
    await loadDb1MqaConsideration(0);
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

  const db1ReferencePanels = db1Catalogue?.panels ?? [];
  const db1InstitutionalPanels = db1InstitutionalCatalogue?.panels ?? [];
  const panelsFor = (panels: Db1Preview[], routeIds: string[]) => panels.filter((panel) => routeIds.includes(panel.source.route_id));
  const memberContextPanels = (routes: readonly (typeof memberContextDb1Routes)[number][]) => routes.map((route) => {
    const panel = db1MemberContext[route.key];
    return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MemberContext(route, offset)} /> : null;
  });
  const mqaTaxonomyLinkPanels = [
    ...mqaTaxonomyLinkDb1Routes.map((route) => {
    const panel = db1MqaTaxonomyLink[route.key];
    return panel ? <Db1PagedPanel key={route.key} panel={panel} title={route.title} onPage={(offset) => void loadDb1MqaTaxonomyLink(route, offset)} /> : null;
    }),
    db1MqaConsideration ? <Db1PagedPanel key="mqa-business-consideration" panel={db1MqaConsideration} title="MQA business motions · consideration" onPage={(offset) => void loadDb1MqaConsideration(offset)} /> : null,
  ];

  if (view === "db1" && identity.authenticated && identity.data_layers_available) {
    const billsPanels = panelsFor(db1ReferencePanels, ["gb-sct.bill-types.collection", "gb-sct.bill-stage-types.collection"]);
    const sessionPanels = panelsFor(db1ReferencePanels, ["gb-sct.sessions.collection"]);
    const representationPanels = panelsFor(db1InstitutionalPanels, ["gb-sct.constituencies.collection", "gb-sct.regions.collection"]);
    const committeeReferencePanels = panelsFor(db1InstitutionalPanels, ["gb-sct.committee-types.collection", "gb-sct.committee-type-links.collection"]);
    return <main className="site-shell"><header className="site-header"><a className="wordmark" href="/">Comparative <span>Legislative Data</span></a><p>Research infrastructure · Private beta</p></header><section className="intro" aria-labelledby="page-title"><p className="eyebrow">Scottish Parliament · Foundational release</p><h1 id="page-title">Transparent legislative data, built for research.</h1><p>Access is being opened gradually while the data architecture, provenance controls, and validation standards are put in place.</p></section><p className="status-message" role="status">{message}</p><p className="identity">Signed in as <strong>{identity.email}</strong>.</p><nav className="access-nav" aria-label="Access options"><span className="signed-in-badge">Private beta active</span><button type="button" onClick={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }}>Route catalogue</button><button type="button" onClick={() => { void loadDb1Catalogue(); }}>DB1 catalogue</button><button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button>{identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}</nav><section className="catalogue-panel db1-panel" aria-labelledby="db1-heading"><p className="eyebrow">Restricted DB1 catalogue</p><h2 id="db1-heading">Fixed retained baselines</h2><p className="panel-copy">These are retained, dated DB1 operational projections. They are not the live proxy, raw-object access, an unqualified mirror, or a canonical dataset.</p>{db1Feedback ? <p className="form-feedback" role="status">{db1Feedback}</p> : null}{db1Catalogue ? <><section className="source-disclosure"><p><strong>Fixed baselines, not live feeds:</strong> the named captures and projection records below do not change when the daily reconciliation services run. Any later projection needs its own named build and decision.</p><dl className="response-guide"><div><dt>Reference catalogue</dt><dd><code>{db1Catalogue.catalogue.id}</code> · built {new Date(db1Catalogue.catalogue.built_at).toLocaleString()} · {db1Catalogue.catalogue.integrity_status}</dd></div><div><dt>Catalogue limits</dt><dd><ul>{db1Catalogue.limitations.map((limit) => <li key={limit}>{limit}</li>)}</ul></dd></div></dl></section><div className="catalogue-sections"><Db1SubjectGroup section={catalogueSections[0]} releases={[db1Bills ? <Db1PagedPanel key="bills" panel={db1Bills} title="bills · collection" onPage={(offset) => void loadDb1Bills(offset)} /> : null, ...billsPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />), db1FormalStages ? <Db1AccessPlanPanel key="formal-stages" panel={db1FormalStages} /> : null]} /><Db1SubjectGroup section={catalogueSections[1]} releases={[...sessionPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />), ...memberContextPanels(memberContextDb1Routes.slice(0, 3)), ...representationPanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)]} /><Db1SubjectGroup section={catalogueSections[2]} releases={[db1Parties ? <Db1PagedPanel key="parties" panel={db1Parties} title="parties · collection" onPage={(offset) => void loadDb1Parties(offset)} /> : null, db1PartyRoles ? <Db1PagedPanel key="party-roles" panel={db1PartyRoles} title="party roles · collection" onPage={(offset) => void loadDb1PartyRoles(offset)} /> : null, db1GovernmentRoles ? <Db1PagedPanel key="government-roles" panel={db1GovernmentRoles} title="government roles · collection" onPage={(offset) => void loadDb1GovernmentRoles(offset)} /> : null, ...memberContextPanels(memberContextDb1Routes.slice(3))]} /><Db1SubjectGroup section={catalogueSections[3]} releases={[db1Committees ? <Db1PagedPanel key="committees" panel={db1Committees} title="committees · collection" onPage={(offset) => void loadDb1Committees(offset)} /> : null, db1CommitteeRoles ? <Db1PagedPanel key="committee-roles" panel={db1CommitteeRoles} title="committee roles · collection" onPage={(offset) => void loadDb1CommitteeRoles(offset)} /> : null, ...committeeReferencePanels.map((panel) => <Db1Panel key={panel.projection.build_id} panel={panel} />)]} /><Db1SubjectGroup section={catalogueSections[4]} releases={[...mqaTaxonomyLinkPanels, db1MqaEventSubtypes ? <Db1PagedPanel key="mqa-event-subtypes" panel={db1MqaEventSubtypes} title="MQA event subtypes · collection" onPage={(offset) => void loadDb1MqaEventSubtypes(offset)} /> : null]} /></div></> : <p className="panel-copy">Loading the declared DB1 catalogue…</p>}</section><p className="boundary">Current boundary: private raw source relay plus, for eligible users, fixed retained DB1 releases with route-specific access modes. No canonical dataset, chart, export, general DB1 query, or research release is available.</p></main>;
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
