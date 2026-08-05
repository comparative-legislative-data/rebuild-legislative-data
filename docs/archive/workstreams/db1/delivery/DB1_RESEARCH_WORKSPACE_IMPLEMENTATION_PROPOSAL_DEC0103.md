# DEC-0103: DB1 research workspace implementation proposal

**Status:** `APPROVED — PRIVATELY DEPLOYED; OWNER ACCEPTANCE PENDING`

**Date:** 5 August 2026
**Workstream:** DB1: Scottish Parliament source-preserving mirror

## Decision sought

Approve one bounded private-beta interface package that implements the adopted
[DEC-0102 direction](USABILITY_AND_ACCESSIBILITY_DIRECTION_PROPOSAL_DEC0102.md).
The package is deliberately frontend-only: it rearranges and relabels existing
DB1 research-access information. It does not alter the retained data, API
contract, database, capture process, source requests, schedules or access
policy.

| Pre-flight item | Position |
| --- | --- |
| Active phase | Private DB1 access, following DEC-0101 Stages A–C deployment and owner usability feedback. |
| Authorising design decision | DEC-0102, adopted by the owner on 5 August 2026. |
| Affected product | Authenticated DB1 catalogue only. Proxy, DB2, charts and playground remain outside this package. |
| Existing data contract | Reuse only `/db1/gb-sct/research/catalogue`, retained raw response/download, records and all-years manifest routes. No API addition or change is proposed. |
| Main risk | A visually improved page could obscure the DB1/raw/DB2 boundary or make a false availability, completeness or semantic claim. |
| Containment | Web application code and styles only; existing read-only API routes, reader role, raw-object store and schedules remain untouched. |
| Rollback | Restore the prior packaged web release if functional or accessibility acceptance fails; no data rollback is needed. |

## Product contract

The researcher must be able to answer, quickly and without developer
vocabulary:

1. **What is this?** A dated Scottish Parliament response retained by DB1.
2. **What can I do?** View records where available, download the original JSON,
   or open the source URL.
3. **What does it cover?** The named endpoint, retained year/window and the
   recorded source condition.
4. **How do I understand it?** An observed-field guide, explicitly not a DB2
   codebook.
5. **How do I verify or reproduce it?** Source URL, capture date, checksum,
   reconciliation evidence, citation and request examples.

No screen may describe DB1 as a complete/current mirror, a live API, or an
analytical/canonical dataset. DB1's retained raw response remains the first
class research object; the record browser and field guide are access aids.

## Exact implementation boundary

### In scope

- Refactor DB1 rendering and UI copy in
  [`apps/web/src/main.tsx`](../../../../../apps/web/src/main.tsx), using the existing
  DB1 catalogue and release response types.
- Replace the DB1-specific visual hierarchy in
  [`apps/web/src/styles.css`](../../../../../apps/web/src/styles.css) with scoped,
  token-based styles for the research workspace.
- Preserve existing authentication and all existing DB1 API paths,
  authorisation behaviour, raw stream/download behaviour, source URL and
  all-years manifest behaviour.
- Add frontend-only interaction feedback, disclosure state labels and copy
  controls where the browser supports them.
- Build/test/package/deploy the same private app service only after local
  verification succeeds.

### Explicitly out of scope

- Any Fastify/API, PostgreSQL, raw-object, manifest, reconciliation, capture,
  source-request, schedule, environment-variable, role or VPS topology change.
- Search, filtering, generic query, SQL/OData, CSV/Parquet/ZIP generation,
  all-years combined source-data download, new field inference, DB2 codebook,
  chart, playground or public release.
- New framework, component library, analytics service, remote font, external
  CSS, image asset, tracking, or dependency installation.

## Information architecture and exact interaction design

### A. DB1 catalogue: subject first

The DB1 route opens a compact research catalogue, not a hero landing page or a
delivery dashboard.

```text
Breadcrumb: Research access / Scottish Parliament / Retained source data
Title: Retained Scottish Parliament data
One-sentence DB1 boundary + “How this differs from live API” disclosure

Research subject
  Endpoint — plain description · retained coverage · available actions
    Year/window release — source condition · [View data] [Download JSON] [Source]
```

- Keep the established proxy subject ordering and headings unchanged.
- A subject is a summary/disclosure row; its endpoints appear only when opened.
- An endpoint is a compact row, not a nested full card. It shows a human title,
  route path as secondary technical reference, retained period/window summary,
  and release count.
- For multi-year endpoints, label the existing all-years route **“View retained
  year index”**. It is a DB1 manifest, not a combined data download or a single
  Scottish Parliament response.
- Do not display `NOT_YET_ASSESSED`, `projection`, `manifest`, source position,
  technical release IDs, raw hash or reconciliation state in the primary row.

### B. Release workspace: action first

Opening a release reveals one coherent workspace, with this order:

1. **Identity:** breadcrumb, endpoint name, year/window, “Retained Scottish
   Parliament response”, and capture date.
2. **Action row:**
   - **View data** (only if the existing `browse_available` is true),
   - **Download original JSON**, and
   - **Open Scottish Parliament source**.
3. **Source condition:** a short textual badge/notice. For ordinary records:
   “Records returned in this retained response.” It is not a coverage or
   freshness claim. For a valid empty response: “The retained response contains
   no records.” For the known exception use the exact DEC-0102 upstream
   availability wording. For an unprofiled response: “Original JSON is
   available; a record browser is not yet available for this response.”
4. **Explore:** only after the user selects View data. Keep the existing fixed,
   server-side 20-record pages. Label the page count and “records in this
   retained response”; retain source position only within each expanded record's
   provenance disclosure.
5. **Data guide:** observed field names, types and presence counts where the
   existing profile provides them, with the concise limit “Observed in this
   retained response; not a DB2 codebook or validated field definition.”
6. **Provenance and citation:** an initially closed disclosure containing the
   source URL, capture time, content type, byte size, checksum, reconciliation
   evidence, citation text and existing cURL/Python/R/JavaScript examples.

The source response has one set of clear verbs. “Original JSON” means the
existing exact raw retained response; “View data” means an existing DB1 record
browser, never a transformed dataset. The current API `availability` enum may
remain technical behind the UI; it must be mapped to the plain messages above.

### C. Feedback and disclosure behaviour

- Use native `<details>/<summary>` only where it provides a meaningful section
  boundary; give every closed summary a clear action label, such as “Show data
  guide” or “Show provenance and citation”.
- When View data is selected, place a concise loading status adjacent to that
  button and move focus to the loaded results heading only after the records
  arrive. Do not leave a page-level status message detached from the action.
- Use a labelled copy button for citation/request examples, with a nearby
  `aria-live="polite"` success/failure message. The full text remains selectable
  without JavaScript clipboard permission.
- Status is conveyed in text as well as colour. Loading, unavailable, source
  notice, disabled pagination and copied states must have programmatic labels.

## CSS and visual system

The implementation must feel deliberate and scholarly without recreating the
pilot. It will use a minimal CSS token layer within the existing stylesheet:

| Token family | Requirement |
| --- | --- |
| Colour | Existing navy/gold mood may remain, but define semantic foreground, muted text, surface, border, action, notice, error and focus values. No state is conveyed by gold alone. |
| Type | System sans-serif for reading/data/control text; existing restrained editorial treatment for display headings only. No remote font import. |
| Space | 8px-based spacing scale; a data workspace uses short headers and measured vertical rhythm rather than a landing-page hero. |
| Surfaces | One base page surface, one panel surface, a bordered source-notice treatment, and compact endpoint rows. Avoid panel-inside-panel accumulation. |
| Interaction | Full-width focus outline with sufficient contrast; buttons and links have distinct default, hover, focus, active and disabled states. |
| Responsive | One-column flow at narrow widths, action buttons wrap with full text, metadata never relies on two columns, and code blocks scroll horizontally rather than clipping. |
| Motion | No decorative animation; honour `prefers-reduced-motion`. |

The existing authenticated shell, proxy catalogue and account flows are not
restyled in this package beyond shared focus/semantic token corrections needed
to avoid inconsistent accessibility behaviour.

## Verification and owner acceptance

Before private deployment, run the existing build, test, capability and
documentation checks. Add focused frontend tests only where they can be
implemented without a new test framework; otherwise retain a reproducible
manual acceptance script with the release artefact.

The release passes only when the following are demonstrated at desktop width,
320 CSS pixels and 400% zoom, using keyboard-only operation as well as pointer:

| Scenario | Required outcome |
| --- | --- |
| Find | From the DB1 catalogue, find “Bill stage types” through the Bills/formal-stages subject without reading internal delivery terms. |
| Distinguish | Identify that DB1 is retained/datestamped data and the proxy is live/no-retention. |
| Retrieve | View data when browser access is available; download original JSON; open the Scottish Parliament source URL. |
| Inspect | Find fields/types and the non-DB2 limit without exposing a codebook claim. |
| Exception | Understand the 2006 Committee notice as a dated Scottish Parliament availability response, then access its retained raw response/source URL. |
| Verify | Find and copy citation/provenance information and request examples. |
| Operate | All controls have visible focus, correct accessible names/expanded state, sensible focus order, readable contrast and no colour-only status. |
| Protect boundaries | Raw/download/source links remain the existing authenticated paths; no source request is made; no new API route, database query type or data transformation appears. |

Owner acceptance will be one ordinary end-to-end test of the above flow. Any
accessibility concern or confusion stops the release and returns to this
proposal; it is not papered over by adding another nested explanatory panel.

## Delivery sequence

1. Owner approves this exact package.
2. Implement the contained frontend changes locally; run checks and the manual
   accessibility/acceptance script.
3. Present the local visual/functional result to the owner before deployment.
4. After owner acceptance, deploy the already-approved private app release,
   verify the existing access boundaries, and retain the acceptance evidence.
5. If the prototype exposes unresolved research-workflow or accessibility
   issues, pause this package and commission targeted external UX/accessibility
   research before further UI expansion.

## Owner decision

The owner approved DEC-0103 on 5 August 2026. The contained frontend
implementation passed build, automated tests, capability checks and
documentation checks, then deployed through the web-presentation path from
commit `bd30cf6`. That deployment replaced only the CLD web release. Read-only
post-deployment checks confirmed the API, web service and DB1 D19 timer active,
both local health routes responsive, and unauthenticated DB1 catalogue access
still denied with `403`. Owner acceptance of the resulting live private
interface is pending. DEC-0103 does not authorise any excluded data, backend or
infrastructure action.
