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
  availability: string;
  qualification: string;
  limitation: string;
  parameters: Array<{ name: string; grammar: string; required: boolean; allowedValues?: string[] }>;
};
type Catalogue = { legislature: "GB-SCT"; layer: "UPSTREAM_PASSTHROUGH_DESIGN"; source_requests_enabled: boolean; enabled_route_count: number; route_count: number; routes: CatalogueRoute[] };
type SourceGuide = { officialUrl: string; observedStructure: string; variables: Array<{ name: string; note: string }>; caution: string };

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
  }
};

const catalogueSections = [
  { id: "bills", title: "Bills, formal stages and bill reference data", groups: ["Bills", "Formal stages", "Stage types", "Bill types"] },
  { id: "members", title: "Sessions, members, constituencies and regions", groups: ["Sessions", "Members", "Member constituency status", "Member region status", "Constituencies", "Regions"] },
  { id: "roles", title: "Parties and government roles", groups: ["Parties", "Party roles", "Member parties", "Member party roles", "Government roles", "Member government roles"] },
  { id: "committees", title: "Committees and committee roles", groups: ["Committees", "Committee roles", "Committee types", "Committee type links"] },
  { id: "mqa", title: "Motions, questions, related records and votes on motions", groups: ["MQA business motions", "MQA events", "MQA event types", "MQA event subtypes", "MQA event links", "MQA motions", "MQA questions", "MQA supports", "Votes on motions"] },
  { id: "reports", title: "Official reports", groups: ["Committee official reports", "Plenary official reports"] }
] as const;

function RouteBadge({ route, onUnavailable }: { route: CatalogueRoute; onUnavailable: (route: CatalogueRoute) => void }) {
  const relayed = route.availability === "RELAYED_PRIVATE_BETA";
  const guide = sourceGuides[route.id];
  return <details className={`route-card${relayed ? " route-card-relayed" : ""}`}><summary><div className="route-badge"><div><p className="route-group">{route.group} · {route.priority}</p><h3>{route.id}</h3><code>{route.template}</code></div><div className="route-badge-state"><span className="route-state">{route.availability.replaceAll("_", " ")}</span><span className="route-expand-label">Show details</span></div></div></summary><div className="route-details"><dl><div><dt>Operating class</dt><dd>{route.operatingClass.replaceAll("_", " ")}</dd></div><div><dt>Qualification</dt><dd>{route.qualification.replaceAll("_", " ")}</dd></div>{route.parameters.length > 0 ? <div><dt>Allowed parameters</dt><dd>{route.parameters.map((parameter) => `${parameter.name}: ${parameter.grammar}${parameter.required ? " (required)" : ""}`).join(", ")}</dd></div> : null}</dl><p>{route.limitation}</p>{relayed && guide ? <div className="source-disclosure"><p><strong>Two ways to inspect this live response:</strong> CLD relay keeps the request within the private-beta boundary and adds provenance headers, but does not store or transform the body. The official API link leaves CLD and opens the same fixed public source route directly.</p><dl className="response-guide"><div><dt>Observed structure</dt><dd>{guide.observedStructure}</dd></div><div><dt>Known source variables</dt><dd><ul>{guide.variables.map((variable) => <li key={variable.name}><code>{variable.name}</code> — {variable.note}</li>)}</ul></dd></div><div><dt>Interpretive limit</dt><dd>{guide.caution}</dd></div><div><dt>Citation guidance</dt><dd>Cite the Scottish Parliament Open Data endpoint and your own access date/time. Cite CLD as the no-retention access/provenance layer, not as the source-data publisher or an immutable release.</dd></div></dl><div className="source-actions"><a className="source-action relay-action" href={`/api/catalogue/gb-sct/${route.id}/source`} target="_blank" rel="noreferrer">Open via CLD no-retention relay</a><a className="source-action official-action" href={guide.officialUrl} target="_blank" rel="noreferrer">Open official Scottish Parliament API directly</a></div></div> : <button type="button" className="secondary-button" onClick={() => onUnavailable(route)}>Test route boundary</button>}</div></details>;
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

  async function requestRoute(route: CatalogueRoute) {
    const parameters = Object.fromEntries(route.parameters.map((parameter) => [parameter.name, parameter.grammar === "year" ? "2025" : parameter.grammar === "fixed_value" ? parameter.allowedValues?.[0] ?? "" : "1"]));
    const response = await request(`/catalogue/gb-sct/${route.id}/request`, { method: "POST", body: JSON.stringify({ parameters }) });
    const outcome = await response.json().catch(() => undefined) as { message?: unknown; code?: unknown } | undefined;
    setCatalogueFeedback(typeof outcome?.message === "string" ? outcome.message : `This route remains unavailable (${typeof outcome?.code === "string" ? outcome.code : "unknown state"}).`);
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
      {view === "catalogue" && identity.authenticated ? <section className="catalogue-panel" aria-labelledby="catalogue-heading"><p className="eyebrow">GB-SCT route inventory</p><h2 id="catalogue-heading">Transparent upstream access catalogue</h2><p className="panel-copy">This catalogue is not a project dataset or snapshot. Select an endpoint badge to inspect its route-level evidence and access boundary.</p>{catalogueFeedback ? <p className="form-feedback" role="status">{catalogueFeedback}</p> : null}{catalogue ? <><p className="catalogue-summary"><strong>{catalogue.route_count} selected route forms</strong> · {catalogue.enabled_route_count} fixed private no-retention pass-through routes currently enabled.</p><div className="catalogue-sections">{catalogueSections.map((section) => { const routes = catalogue.routes.filter((route) => (section.groups as readonly string[]).includes(route.group)); const enabled = routes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").length; return <section className="catalogue-section" key={section.id} aria-labelledby={`${section.id}-heading`}><header className="catalogue-section-heading"><div><p className="eyebrow">Source family</p><h3 id={`${section.id}-heading`}>{section.title}</h3></div><p>{routes.length} route forms{enabled > 0 ? ` · ${enabled} live private route${enabled === 1 ? "" : "s"}` : ""}</p></header><div className="catalogue-list">{routes.map((route) => <RouteBadge key={route.id} route={route} onUnavailable={requestRoute} />)}</div></section>; })}</div></> : <p className="panel-copy">Loading the route registry…</p>}</section> : null}
      <p className="boundary">Current boundary: only six fixed live source pass-through routes are available to private beta users. No DB1 storage, canonical dataset, chart, export, or research release is available.</p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
