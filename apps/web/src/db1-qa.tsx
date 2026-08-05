import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Db1ResearchCatalogue, Db1ResearchRecords, Db1ResearchRelease } from "./types.js";

export function researchRouteUrl(routeId: string, suffix: "raw" | "records", query = ""): string {
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

export function DatabaseMirrorQaWorkspace({ catalogue, records, loadingRoute, feedback, onBrowse, onRefresh, onBack, onSettings, isSuperuser, onSuperuser }: {
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
