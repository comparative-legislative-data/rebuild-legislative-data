import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { FormEvent } from "react";
import "./styles.css";

type View = "login" | "apply" | "settings" | "admin" | "catalogue";
type Identity = { authenticated: boolean; email: string | null; roles: string[]; logout_proof: string | null; data_layers_available: false };
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
  "Bills": { observedStructure: "A route-specific field profile has not yet been retained. This is an explicit profile gap, not an absence-of-fields claim.", variables: [{ name: "Profile status", note: "A controlled raw schema observation is next for this route family; no analytical codebook or field definition is implied meanwhile." }], caution: "Use the raw response for inspection. CLD does not yet assert its current fields, identifier semantics, pagination, or completeness." },
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
  return <details className={`route-card${relayed ? " route-card-relayed" : ""}`}><summary><div className="route-badge"><div><p className="route-group">{route.group} · {route.priority}</p><h3>{route.id}</h3><code>{route.template}</code></div><div className="route-badge-state"><span className="route-state">{route.availability.replaceAll("_", " ")}</span><span className="route-expand-label">Show details</span></div></div></summary><div className="route-details"><dl><div><dt>Operating class</dt><dd>{route.operatingClass.replaceAll("_", " ")}</dd></div><div><dt>Source action</dt><dd>{action}</dd></div><div><dt>Qualification</dt><dd>{route.qualification.replaceAll("_", " ")}</dd></div>{route.parameters.length > 0 ? <div><dt>Allowed parameters</dt><dd>{route.parameters.map((parameter) => `${parameter.name}: ${parameter.grammar}${parameter.required ? " (required)" : ""}`).join(", ")}</dd></div> : null}</dl><p>{route.limitation}</p>{relayed ? <div className="source-disclosure"><p><strong>Two ways to inspect this live response:</strong> the CLD relay retains neither response body nor a copy, and adds request provenance headers. The official API action leaves CLD and opens the fixed Scottish Parliament source route directly.</p><dl className="response-guide"><div><dt>Response guide</dt><dd>{guideText.observedStructure}</dd></div><div><dt>Variables and elements</dt><dd><ul>{guideText.variables.map((variable) => <li key={variable.name}><code>{variable.name}</code> — {variable.note}</li>)}</ul></dd></div><div><dt>Interpretive limit</dt><dd>{guideText.caution}</dd></div><div><dt>Citation guidance</dt><dd>Cite the Scottish Parliament Open Data endpoint and your own access date/time. Cite CLD only as the no-retention access/provenance layer, not as the source-data publisher or an immutable release.</dd></div></dl><form className="source-parameter-form" onSubmit={(event) => { event.preventDefault(); const parameters = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, string>; window.open(sourceUrl(route, parameters, true), "_blank", "noreferrer"); }}><div className="source-parameter-inputs">{route.parameters.map((parameter) => parameter.grammar === "fixed_value" ? <input key={parameter.name} name={parameter.name} type="hidden" value={parameter.allowedValues?.[0] ?? ""} /> : <label key={parameter.name}>{parameter.name}<input name={parameter.name} required={parameter.required} placeholder={parameter.grammar === "year" ? "e.g. 2025" : parameter.grammar === "positive_integer" ? "positive integer" : "source identifier"} pattern={parameter.grammar === "year" ? "199[9]|20[0-9]{2}" : undefined} /></label>)}</div><div className="source-actions"><button className="source-action relay-action">{actionVerb} via CLD no-retention relay</button><button type="button" className="source-action official-action" onClick={(event) => { const form = event.currentTarget.form; if (!form?.reportValidity()) return; const parameters = Object.fromEntries(new FormData(form).entries()) as Record<string, string>; window.open(sourceUrl(route, parameters, false), "_blank", "noreferrer"); }}>{actionVerb} from Scottish Parliament API directly</button></div></form></div> : null}</div></details>;
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
        {identity.authenticated ? <button type="button" onClick={() => { setView("settings"); setFormFeedback(undefined); }}>Settings</button> : null}
        {identity.roles.includes("SUPERUSER") ? <button type="button" onClick={() => { setView("admin"); setFormFeedback(undefined); void loadApplications(); }}>Superuser review</button> : null}
      </nav>
      {identity.authenticated && view === "login" ? <section className="access-panel welcome-panel"><p className="eyebrow">Private beta active</p><h2>Welcome to the foundation release.</h2><p>Account controls are live. Research data access is intentionally not yet enabled.</p></section> : null}
      {view === "login" && !identity.authenticated ? <section className="access-panel" aria-labelledby="login-heading"><h2 id="login-heading">Log in</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/login", { identifier: String(data.get("identifier") ?? ""), password: String(data.get("password") ?? "") }, "Signed in.").then((nextIdentity) => { if (!nextIdentity?.authenticated) setFormFeedback("We could not sign you in. Check your email and password."); }); }}><label>Email or username<input name="identifier" required autoComplete="username" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" /></label><button>Log in</button></form><div className="form-divider">or use a passwordless link</div><form onSubmit={(event) => { const email = new FormData(event.currentTarget).get("email"); void submit(event, "/auth/magic-link", { email: String(email ?? "") }, "If an eligible account exists, a sign-in link will arrive shortly."); }}><label>Email for magic link<input name="email" type="email" required autoComplete="email" /></label><button className="secondary-button">Request magic link</button></form></section> : null}
      {view === "apply" ? <section className="access-panel" aria-labelledby="apply-heading"><h2 id="apply-heading">Apply for beta access</h2><p className="panel-copy">Tell us how you would use the platform. A superuser reviews each request.</p>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const data = new FormData(event.currentTarget); void submit(event, "/auth/applications", { email: String(data.get("email") ?? ""), requestText: String(data.get("requestText") ?? "") }, "Your request has been received. If approved, you will receive an activation link."); }}><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Why would access be useful?<textarea name="requestText" maxLength={2000} required /></label><button>Submit application</button></form></section> : null}
      {view === "settings" && identity.authenticated ? <section className="access-panel" aria-labelledby="settings-heading"><h2 id="settings-heading">Settings</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}<form onSubmit={(event) => { const password = new FormData(event.currentTarget).get("password"); if (typeof password === "string") void submit(event, "/auth/password/change", { password }, "Your password has been changed."); }}><label>New password<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label><button>Change password</button></form><button className="secondary-button" type="button" onClick={() => { void request("/auth/logout", { method: "POST", body: JSON.stringify({ logout_proof: identity.logout_proof ?? "" }) }).then(async (response) => { const outcome = await response.json().catch(() => undefined) as { signed_out?: unknown } | undefined; const nextIdentity = await refreshIdentity(); setView("login"); setMessage(response.ok && outcome?.signed_out === true && !nextIdentity?.authenticated ? "You are signed out." : "We could not confirm sign-out. Please try again."); }); }}>Log out</button></section> : null}
      {view === "admin" && identity.roles.includes("SUPERUSER") ? <section className="access-panel" aria-labelledby="admin-heading"><h2 id="admin-heading">Superuser review</h2>{formFeedback ? <p className="form-feedback" role="status">{formFeedback}</p> : null}{applications.length === 0 ? <p>No pending applications.</p> : <ul>{applications.map((application) => <li key={application.id}><p><strong>{application.email}</strong></p><p>{application.requestText}</p><button type="button" onClick={() => void approve(application.id)}>Approve</button></li>)}</ul>}</section> : null}
      {view === "catalogue" && identity.authenticated ? <section className="catalogue-panel" aria-labelledby="catalogue-heading"><p className="eyebrow">GB-SCT route inventory</p><h2 id="catalogue-heading">Transparent upstream access catalogue</h2><p className="panel-copy">This is raw, transient source access — not a CLD dataset or snapshot. Select an endpoint badge to inspect the fixed route, allowed parameters, response guidance, and the choice between the CLD relay and the official source.</p>{catalogueFeedback ? <p className="form-feedback" role="status">{catalogueFeedback}</p> : null}{catalogue ? <><p className="catalogue-summary"><strong>{catalogue.route_count} selected route forms</strong> · {catalogue.enabled_route_count} authenticated private no-retention relay routes available.</p><div className="catalogue-sections">{catalogueSections.map((section) => { const routes = catalogue.routes.filter((route) => (section.groups as readonly string[]).includes(route.group)); const enabled = routes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").length; return <section className="catalogue-section" key={section.id} aria-labelledby={`${section.id}-heading`}><header className="catalogue-section-heading"><div><p className="eyebrow">Source family</p><h3 id={`${section.id}-heading`}>{section.title}</h3></div><p>{routes.length} route forms{enabled > 0 ? ` · ${enabled} live private route${enabled === 1 ? "" : "s"}` : ""}</p></header><div className="catalogue-list">{routes.map((route) => <RouteBadge key={route.id} route={route} />)}</div></section>; })}</div></> : <p className="panel-copy">Loading the route registry…</p>}</section> : null}
      <p className="boundary">Current boundary: private raw source relay only. No DB1 storage, canonical dataset, chart, export, or research release is available.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
