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

function researchRouteUrl(routeId: string, suffix: "raw" | "records", query = ""): string {
  return `/api/db1/gb-sct/research/releases/${encodeURIComponent(routeId)}/${suffix}${query}`;
}

function sourceCondition(release: Db1ResearchRelease): { label: string; text: string } {
  if (release.availability === "UPSTREAM_AVAILABILITY_MESSAGE") return {
    label: "Upstream availability notice captured",
    text: "When this response was captured, the Scottish Parliament said the data were presently unavailable. This does not establish that historical records do not exist."
  };
  if (release.availability === "UPSTREAM_ERROR_RESPONSE") return {
    label: "Scottish Parliament error response retained",
    text: "The Database mirror retained the source response as received. Inspect the original JSON for the upstream response; this is not a claim that historical records do not exist."
  };
  if (release.availability === "NOT_YET_ASSESSED") return {
    label: "Raw response available",
    text: "The original JSON can be viewed and downloaded. Its source condition has not yet been published as a structured research-access aid."
  };
  if (release.availability === "EMPTY_RESPONSE") return {
    label: "No records in this retained response",
    text: "The retained response contains no records. This does not establish historical nonexistence."
  };
  if (!release.research_access.browse_available) return {
    label: "Original JSON available",
    text: "The dated source response is available to view and download. A structured record view has not yet been published; this is not an absence-of-data notice."
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

function InlineHelp({ label, children }: { label: string; children: ReactNode }) {
  return <details className="inline-help"><summary><span aria-hidden="true">?</span><span>{label}</span></summary><div>{children}</div></details>;
}

const databaseMirrorSubjectGuides: Record<string, string> = {
  "Bills, formal stages and bill reference data": "Bills, their formal stages, and the source reference lists used to describe them. These are source records, not a reconstructed legislative history.",
  "Sessions, members, constituencies and regions": "Parliamentary sessions and institutional reference records about members, constituencies and regions. No time-varying membership or representation analysis is created here.",
  "Parties and government roles": "Source reference and relationship records about parties and government-role material. The Database mirror does not infer party affiliation, office holding or historical status.",
  "Committees and committee roles": "Committee and committee-role source records. These do not by themselves establish committee membership, remit or bill assignment.",
  "Motions, questions, related records and votes on motions": "Source records concerning motions, questions, linked events and votes on motions. Votes on motions are distinct from amendments to bills.",
  "Official reports": "Annual Scottish Parliament Committee and Plenary Official Report responses. Each retained year is a separate dated source response."
};

const databaseMirrorEndpointGuides: Record<string, string> = {
  "bill stage types": "The Scottish Parliament source's reference list of bill-stage types.",
  "bill stages": "The Scottish Parliament source's collection of bill-stage records.",
  "bill types": "The Scottish Parliament source's reference list of bill types.",
  "bills": "The Scottish Parliament source's collection of bill records.",
  "committee official reports": "Annual Scottish Parliament Committee Official Report responses for the listed source years.",
  "committee roles": "The Scottish Parliament source's reference list of committee roles.",
  "committee type links": "The Scottish Parliament source's collection linking committee and committee-type identifiers.",
  "committee types": "The Scottish Parliament source's reference list of committee types.",
  "committees": "The Scottish Parliament source's collection of committee records.",
  "constituencies": "The Scottish Parliament source's collection of constituency reference records.",
  "government roles": "The Scottish Parliament source's reference list of government roles.",
  "formal stages": "The Scottish Parliament source's collection of formal bill-stage records.",
  "member constituency statuses": "The Scottish Parliament source's collection of member-constituency status records.",
  "member government roles": "The Scottish Parliament source's collection of member-government-role records.",
  "member parties": "The Scottish Parliament source's collection of member-party records.",
  "member party roles": "The Scottish Parliament source's collection of member-party-role records.",
  "member region statuses": "The Scottish Parliament source's collection of member-region status records.",
  "members": "The Scottish Parliament source's collection of member records.",
  "mqa business consideration": "The Scottish Parliament source's collection of consideration business-motion records.",
  "mqa business programme": "The Scottish Parliament source's collection of programme business-motion records.",
  "mqa event links": "The Scottish Parliament source's collection of links between motions, questions and answer events.",
  "mqa event subtypes": "The Scottish Parliament source's reference list of motions, questions and answer event subtypes.",
  "mqa event types": "The Scottish Parliament source's reference list of motions, questions and answer event types.",
  "mqa questions": "Annual Scottish Parliament motions, questions and answers question responses for the listed source years.",
  "parties": "The Scottish Parliament source's collection of party records.",
  "party roles": "The Scottish Parliament source's reference list of party roles.",
  "plenary official reports": "Annual Scottish Parliament Plenary Official Report responses for the listed source years.",
  "regions": "The Scottish Parliament source's collection of regional reference records.",
  "sessions": "The Scottish Parliament source's collection of parliamentary sessions.",
  "votes on motions": "Annual Scottish Parliament votes-on-motions responses for the listed source years; these may include votes on motion amendments, not bill amendments."
};

function databaseMirrorEndpointGuide(endpoint: string): string {
  return databaseMirrorEndpointGuides[endpoint] ?? `The Scottish Parliament source response for ${endpoint}. The Database mirror preserves the source fields without creating analytical variables.`;
}

function mirrorEndpointFromLocation(): string | undefined {
  const match = new URLSearchParams(window.location.hash.slice(1)).get("database-mirror-endpoint");
  return match || undefined;
}

function mirrorCoverage(releases: Db1ResearchRelease[]): string {
  const years = releases.flatMap((release) => release.source_year === null ? [] : [release.source_year]);
  if (!years.length) return `${releases.length} dated retained response${releases.length === 1 ? "" : "s"}`;
  const uniqueYears = [...new Set(years)].sort((left, right) => left - right);
  return uniqueYears.length === 1 ? `Retained source year ${uniqueYears[0]}` : `Retained source years ${uniqueYears[0]}–${uniqueYears.at(-1)}`;
}

function formatCapture(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function MirrorActionHelp({ label, children }: { label: string; children: ReactNode }) {
  return <details className="mirror-action-help">
    <summary aria-label={`What happens when you ${label.toLocaleLowerCase()}?`}><span aria-hidden="true">?</span><span className="sr-only">What happens when you {label.toLocaleLowerCase()}?</span></summary>
    <div role="note"><strong>{label}</strong><p>{children}</p></div>
  </details>;
}

function DatabaseMirrorReleaseDetails({ release }: { release: Db1ResearchRelease }) {
  const condition = sourceCondition(release);
  const citation = `Scottish Parliament Open Data, ${release.source_url}, retrieved ${new Date(release.capture.retrieved_at).toISOString()}; retained by Comparative Legislative Data Database mirror, manifest ${release.capture.manifest_id}.`;
  return <section className="mirror-release-details" aria-labelledby={`${release.route_id}-details`}>
    <div className={`mirror-condition${release.availability === "UPSTREAM_AVAILABILITY_MESSAGE" ? " mirror-condition-notice" : ""}`}>
      <p className="mirror-kicker">Source condition</p>
      <h3 id={`${release.route_id}-details`}>{condition.label}</h3>
      <p>{condition.text}</p>
    </div>
    <details className="mirror-secondary-details">
      <summary>Data guide</summary>
      {release.research_access.observed_structure.length > 0 ? <ul className="mirror-field-list">{release.research_access.observed_structure.map((field) => <li key={field.key}><code>{field.key}</code><span>{field.observed_types.join(", ")} · observed in {field.record_count.toLocaleString()} record{field.record_count === 1 ? "" : "s"}</span></li>)}</ul> : <p>A field guide has not yet been published for this response. This does not affect access to the original JSON.</p>}
    </details>
    <details className="mirror-secondary-details">
      <summary>Provenance and citation</summary>
      <dl className="mirror-provenance-list">
        <div><dt>Source URL</dt><dd><a href={release.source_url} target="_blank" rel="noreferrer">{release.source_url}</a></dd></div>
        <div><dt>Captured</dt><dd>{new Date(release.capture.retrieved_at).toLocaleString()} · {release.capture.content_type} · {release.capture.raw_byte_length.toLocaleString()} bytes</dd></div>
        <div><dt>Integrity</dt><dd>SHA-256 <code>{release.capture.raw_sha256}</code></dd></div>
        <div><dt>Reconciliation</dt><dd>{release.reconciliation.state.replaceAll("_", " ")}{release.reconciliation.observed_at ? ` · last recorded ${new Date(release.reconciliation.observed_at).toLocaleString()}` : ""}. Operational evidence only; not a general freshness claim.</dd></div>
      </dl>
      <p className="mirror-citation-label">Suggested citation</p>
      <pre className="mirror-citation">{citation}</pre>
      <CopyButton label="citation" value={citation} />
    </details>
  </section>;
}

function DatabaseMirrorWorkspace({ catalogue, records, loadingRoute, feedback, onBrowse, onRefresh, onBack, onSettings, isSuperuser, onSuperuser }: {
  catalogue: Db1ResearchCatalogue | undefined;
  records: Record<string, Db1ResearchRecords | undefined>;
  loadingRoute: string | undefined;
  feedback: string | undefined;
  onBrowse: (routeId: string, offset: number) => void;
  onRefresh: () => void;
  onBack: () => void;
  onSettings: () => void;
  isSuperuser: boolean;
  onSuperuser: () => void;
}) {
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | undefined>(mirrorEndpointFromLocation);
  const [selectedRelease, setSelectedRelease] = useState<string | undefined>();

  useEffect(() => {
    const sync = () => setSelectedEndpoint(mirrorEndpointFromLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const endpoints = catalogue?.subjects.flatMap((subject) => subject.endpoints.map((endpoint) => ({ ...endpoint, subject: subject.subject }))) ?? [];
  const activeEndpoint = endpoints.find((endpoint) => endpoint.endpoint === selectedEndpoint);
  const subjects = catalogue?.subjects.map((subject) => subject.subject) ?? [];
  const filteredEndpoints = endpoints.filter((endpoint) => {
    const query = search.trim().toLocaleLowerCase();
    return (subjectFilter === "All subjects" || endpoint.subject === subjectFilter) && (!query || `${endpoint.endpoint} ${endpoint.subject} ${databaseMirrorEndpointGuide(endpoint.endpoint)}`.toLocaleLowerCase().includes(query));
  });

  function openEndpoint(endpoint: string) {
    setSelectedRelease(undefined);
    setSelectedEndpoint(endpoint);
    window.location.hash = new URLSearchParams({ "database-mirror-endpoint": endpoint }).toString();
  }

  function closeEndpoint() {
    setSelectedRelease(undefined);
    setSelectedEndpoint(undefined);
    window.history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
  }

  const releaseById = activeEndpoint?.releases.find((release) => release.route_id === selectedRelease);
  const sortedReleases = activeEndpoint ? [...activeEndpoint.releases].sort((left, right) => (right.source_year ?? -Infinity) - (left.source_year ?? -Infinity) || right.capture.retrieved_at.localeCompare(left.capture.retrieved_at)) : [];
  const allYears = activeEndpoint && new Set(activeEndpoint.releases.flatMap((release) => release.source_year === null ? [] : [release.source_year])).size > 1;
  const allYearsUrl = activeEndpoint ? `/api/db1/gb-sct/research/all-years?${new URLSearchParams({ subject: activeEndpoint.subject, endpoint: activeEndpoint.endpoint }).toString()}` : undefined;

  return <main className="site-shell db1-shell">
    <header className="site-header"><a className="wordmark" href="/">Comparative <span>Legislative Data</span></a><p>Research infrastructure · Private beta</p></header>
    <section className="db1-intro mirror-page-intro" aria-label="Database mirror location">
      <p className="breadcrumbs">Research access <span>/</span> Scottish Parliament <span>/</span> Database mirror</p>
    </section>
    <nav className="access-nav" aria-label="Account and data options"><button type="button" className="secondary-button" onClick={onBack}>Live API catalogue</button><button type="button" onClick={onRefresh}>Refresh available sources</button><button type="button" onClick={onSettings}>Settings</button>{isSuperuser ? <button type="button" onClick={onSuperuser}>Superuser review</button> : null}</nav>
    {feedback ? <p className="form-feedback" role="status">{feedback}</p> : null}
    {!catalogue ? <section className="catalogue-panel db1-panel"><p role="status">Loading the Database mirror directory…</p></section> : activeEndpoint ? <section className="mirror-surface mirror-endpoint-workspace" aria-label={`${activeEndpoint.endpoint} endpoint workspace`}>
      <button type="button" className="mirror-back" onClick={closeEndpoint}>← Back to Database mirror directory</button>
      <div className="mirror-endpoint-heading"><div><p className="mirror-kicker">{activeEndpoint.subject}</p><h1>{activeEndpoint.endpoint}</h1><code>{activeEndpoint.releases[0]?.source_path}</code></div><p>{mirrorCoverage(activeEndpoint.releases)}</p></div>
      {allYears && allYearsUrl ? <section className="mirror-all-years"><div><p className="mirror-kicker">Mirror-generated access index</p><h3>All retained source years</h3><p>This index lists compatible retained releases and any availability exceptions. It is not one Scottish Parliament response or a combined download.</p></div><a className="mirror-action" href={allYearsUrl} target="_blank" rel="noreferrer">View all-years access index <span className="sr-only">in a new tab</span></a></section> : null}
      <section className="mirror-release-table-wrap" aria-labelledby="releases-heading">
        <h3 id="releases-heading">Retained responses</h3>
        <div className="mirror-table-scroll">
          <table className="mirror-release-table">
            <thead><tr><th scope="col">Source year/window</th><th scope="col">Captured</th><th scope="col">Source condition</th><th scope="col">Access</th></tr></thead>
            <tbody>{sortedReleases.flatMap((release) => {
              const condition = sourceCondition(release);
              const rawUrl = researchRouteUrl(release.route_id, "raw");
              const rawDownloadUrl = researchRouteUrl(release.route_id, "raw", "?download=1");
              const expanded = release.route_id === selectedRelease;
              const page = records[release.route_id]?.page;
              const row = <tr key={release.route_id}>
                <th scope="row">{release.source_year ?? "Single retained response"}</th>
                <td>{formatCapture(release.capture.retrieved_at)}</td>
                <td><span className={`mirror-status${release.availability === "UPSTREAM_AVAILABILITY_MESSAGE" ? " mirror-status-notice" : ""}`}>{condition.label}</span></td>
                <td><div className="mirror-row-actions">
                  <div className="mirror-action-control"><a className="mirror-table-primary" href={rawUrl} target="_blank" rel="noreferrer">View original JSON<span className="sr-only"> in a new tab</span></a><MirrorActionHelp label="View original JSON">Opens the exact dated JSON held in the Database mirror in a new browser tab.</MirrorActionHelp></div>
                  <div className="mirror-action-control"><a href={rawDownloadUrl}>Download original JSON</a><MirrorActionHelp label="Download original JSON">Downloads the exact dated JSON file held in the Database mirror.</MirrorActionHelp></div>
                  {release.research_access.browse_available ? <div className="mirror-action-control"><button type="button" onClick={() => { setSelectedRelease(release.route_id); onBrowse(release.route_id, 0); }} disabled={loadingRoute === release.route_id}>{loadingRoute === release.route_id ? "Loading…" : "Browse retained records"}</button><MirrorActionHelp label="Browse retained records">Opens CLD’s read-only, paged browser for records from this retained JSON. It does not change the source data.</MirrorActionHelp></div> : null}
                  <div className="mirror-action-control"><a className="mirror-action-external" href={release.source_url} target="_blank" rel="noreferrer">Open live source <span aria-hidden="true">↗</span><span className="sr-only"> in a new tab</span></a><MirrorActionHelp label="Open live Scottish Parliament source">Opens the current external Scottish Parliament API response. It may have changed since this dated mirror capture.</MirrorActionHelp></div>
                  <div className="mirror-action-control"><button type="button" aria-expanded={expanded} aria-controls={`${release.route_id}-details`} onClick={() => setSelectedRelease(expanded ? undefined : release.route_id)}>{expanded ? "Hide details" : "Details and citation"}</button><MirrorActionHelp label="Details and citation">Shows the recorded source condition, capture metadata, checksum, source URL and suggested citation.</MirrorActionHelp></div>
                </div></td>
              </tr>;
              if (!expanded) return [row];
              return [row, <tr className="mirror-release-detail-row" key={`${release.route_id}-details-row`}><td id={`${release.route_id}-details`} colSpan={4}>{page ? <section className="mirror-browse-results"><h4>Browse retained records</h4><p>{page.records.length ? `Records ${page.offset + 1}–${page.offset + page.records.length}` : "No records"} of {page.total_records.toLocaleString()}. This browsing aid does not change the original JSON.</p><div className="mirror-paging"><button type="button" disabled={loadingRoute === release.route_id || page.offset === 0} onClick={() => onBrowse(release.route_id, Math.max(0, page.offset - page.limit))}>Previous 20</button><button type="button" disabled={loadingRoute === release.route_id || page.offset + page.records.length >= page.total_records} onClick={() => onBrowse(release.route_id, page.offset + page.limit)}>Next 20</button></div>{page.records.map((record) => <details className="mirror-record" key={record.source_position}><summary>Inspect retained record</summary><pre>{JSON.stringify(record.preserved_record, null, 2)}</pre><p>Technical lineage: source position {record.source_position}</p></details>)}</section> : null}<DatabaseMirrorReleaseDetails release={release} /></td></tr>];
            })}</tbody>
          </table>
        </div>
      </section>
    </section> : <section className="mirror-surface mirror-directory" aria-label="Database mirror directory">
      <div className="mirror-directory-heading"><div><p className="mirror-kicker">Scottish Parliament · Database mirror</p><h1>Find a source</h1><p>Use a subject or search term to locate a retained Scottish Parliament source response.</p></div><details className="mirror-about"><summary>How the Database mirror differs from the live API</summary><p>The Database mirror ingests selected Scottish Parliament API responses on documented schedules and stores each dated response. It provides access routes that the live API does not, while retaining the original JSON. Check the capture date for each response; the mirror is not the live source.</p></details></div>
      <div className="mirror-directory-controls"><label>Research subject<select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}><option>All subjects</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label>Search sources<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. committee, bills or official reports" /></label><p role="status">{filteredEndpoints.length} source{filteredEndpoints.length === 1 ? "" : "s"} shown</p></div>
      <div className="mirror-endpoint-list">{filteredEndpoints.map((endpoint) => <article className="mirror-endpoint-row" key={endpoint.endpoint}><div><p className="mirror-kicker">{endpoint.subject}</p><h3>{endpoint.endpoint}</h3><p>{databaseMirrorEndpointGuide(endpoint.endpoint)}</p><code>{mirrorCoverage(endpoint.releases)}</code></div><button type="button" onClick={() => openEndpoint(endpoint.endpoint)}>Open endpoint</button></article>)}</div>
    </section>}
    <p className="boundary">Private access only. The Database mirror provides dated retained source responses and provenance. No live source request, DB2 variable, chart, generic database query or public research release is available here.</p>
  </main>;
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
      setCatalogueFeedback("The Live API catalogue is unavailable for this account.");
      return;
    }
    setCatalogue(await response.json() as Catalogue);
    setCatalogueFeedback(undefined);
  }

  async function loadDb1Catalogue() {
    const response = await request("/db1/gb-sct/research/catalogue");
    if (!response.ok) {
      setDb1Feedback("The Database mirror directory is unavailable for this account.");
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

  if (view === "db1" && identity.authenticated && identity.data_layers_available) {
    return <DatabaseMirrorWorkspace catalogue={db1ResearchCatalogue} records={db1ResearchRecords} loadingRoute={db1LoadingRoute} feedback={db1Feedback} onBrowse={(routeId, offset) => void loadDb1ResearchRecords(routeId, offset)} onRefresh={() => void loadDb1Catalogue()} onBack={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }} onSettings={() => { setView("settings"); setFormFeedback(undefined); }} isSuperuser={identity.roles.includes("SUPERUSER")} onSuperuser={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }} />;
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
        {identity.authenticated ? <button type="button" onClick={() => { setView("catalogue"); setFormFeedback(undefined); void loadCatalogue(); }}>Live API catalogue</button> : null}
        {identity.authenticated && identity.data_layers_available ? <button type="button" onClick={() => { setView("db1"); setFormFeedback(undefined); void loadDb1Catalogue(); }}>Database mirror</button> : null}
        {identity.authenticated ? <button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button> : null}
        {identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}
      </nav>
      {identity.authenticated && view === "login" ? <section className="access-panel welcome-panel"><p className="eyebrow">Private beta active</p><h2>Welcome to the foundation release.</h2><p>Account controls are live. Research data access is intentionally not yet enabled.</p></section> : null}
      {view === "login" && !identity.authenticated ? <section className="access-panel" aria-labelledby="login-heading"><h2 id="login-heading">Log in</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/login", { identifier: String(data.get("identifier") ?? ""), password: String(data.get("password") ?? "") }, "Signed in.").then((nextIdentity) => { if (!nextIdentity?.authenticated) setFormFeedback("We could not sign you in. Check your email and password."); }); }}><label>Email or username<input name="identifier" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label><button>Log in</button></form><div className="form-divider">or use a passwordless link</div><form onSubmit={(event) => { const email = new FormData(event.currentTarget).get("email"); void submit(event, "/auth/magic-link", { email: String(email ?? "") }, "If an eligible account exists, a sign-in link will arrive shortly."); }}><label>Email for magic link<input name="email" type="email" required autoComplete="email" /></label><button className="secondary-button">Request magic link</button></form></section> : null}
      {view === "apply" ? <section className="access-panel" aria-labelledby="apply-heading"><h2 id="apply-heading">Apply for beta access</h2><p className="panel-copy">Tell us how you would use the platform. A superuser reviews each request.</p>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/applications", { email: String(data.get("email") ?? ""), requestText: String(data.get("requestText") ?? "") }, "Your request has been received. If approved, you will receive an activation link."); }}><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Why would access be useful?<textarea name="requestText" maxLength={2000} required /></label><button>Submit application</button></form></section> : null}
      {view === "settings" && identity.authenticated ? <section className="access-panel" aria-labelledby="settings-heading"><h2 id="settings-heading">Settings</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password/change", { password }, "Your password has been changed."); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Change password</button></form><button className="secondary-button" type="button" onClick={() => { void request("/auth/logout", { method: "POST", body: JSON.stringify({ logout_proof: identity.logout_proof ?? "" }) }).then(async (response) => { const outcome = await response.json().catch(() => undefined) as { signed_out?: unknown } | undefined; const nextIdentity = await refreshIdentity(); setView("login"); setMessage(response.ok && outcome?.signed_out === true && !nextIdentity?.authenticated ? "You are signed out." : "We could not confirm sign-out. Please try again."); }); }}>Log out</button></section> : null}
      {view === "admin" && identity.roles.includes("SUPERUSER") ? <section className="access-panel" aria-labelledby="admin-heading"><h2 id="admin-heading">Superuser review</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}{applications.length === 0 ? <p>No pending applications.</p> : <ul>{applications.map((application) => <li key={application.id}><p><strong>{application.email}</strong></p><p>{application.requestText}</p><button type="button" onClick={() => void approve(application.id)}>Approve</button></li>)}</ul>}</section> : null}
      {view === "catalogue" && identity.authenticated ? <section className="catalogue-panel" aria-labelledby="catalogue-heading"><p className="eyebrow">GB-SCT route inventory</p><h2 id="catalogue-heading">Transparent upstream access catalogue</h2><p className="panel-copy">This is raw, transient source access — not a CLD dataset or snapshot. Open a source family, then an endpoint badge, to inspect the fixed source-style route, response guidance, and the choice between the CLD relay and the official source.</p>{catalogueFeedback ? <p className="form-feedback" role="status">{catalogueFeedback}</p> : null}{catalogue ? <><p className="catalogue-summary"><strong>{catalogue.route_count} selected route forms</strong> · {catalogue.enabled_route_count} authenticated private no-retention relay routes available.</p><div className="catalogue-sections">{catalogueSections.map((section) => { const routes = catalogue.routes.filter((route) => (section.groups as readonly string[]).includes(route.group)); const enabled = routes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").length; return <details className="catalogue-section" key={section.id}><summary className="catalogue-section-heading"><div><p className="eyebrow">Source family</p><h3>{section.title}</h3></div><div className="catalogue-section-state"><p>{routes.length} route forms{enabled > 0 ? ` · ${enabled} live private route${enabled === 1 ? "" : "s"}` : ""}</p><span>Show endpoints</span></div></summary><div className="catalogue-list">{routes.map((route) => <RouteBadge key={route.id} route={route} />)}</div></details>; })}</div></> : <p className="panel-copy">Loading the route registry…</p>}</section> : null}
      <p className="boundary">Current boundary: private raw source relay plus, for eligible users, dated retained Database mirror responses with route-specific access modes. No canonical dataset, chart, export, general database query, or research release is available.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
