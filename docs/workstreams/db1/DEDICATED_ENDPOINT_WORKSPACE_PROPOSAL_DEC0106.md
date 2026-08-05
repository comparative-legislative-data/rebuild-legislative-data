# DEC-0106: Database mirror directory and dedicated endpoint workspace

**Status:** `APPROVED — PRIVATELY DEPLOYED; OWNER REVIEW PENDING`
**Date:** 5 August 2026  
**Workstream:** DB1: Scottish Parliament source-preserving mirror  
**Prepared under:** owner direction to develop the next implementation proposal after review of three independent UX implementation responses

## 1. Decision requested

Approve or amend a frontend-only implementation package that replaces the
current nested Database mirror catalogue journey with a researcher-first
directory and dedicated endpoint workspace.

The proposed interaction is:

```text
Database mirror directory
  → filter or choose a research subject
  → open a named endpoint workspace
  → select a retained release or annual window
  → view/download original JSON, browse when available, or inspect provenance
```

The proposal deliberately does **not** authorise source requests, raw capture,
database mutation, projection/profile work, schedules, API-path changes, new
dependencies, public access, DB2, charts or research releases.

## 2. Why a further correction is needed

Private owner testing established that the present Database mirror is
functionally capable but does not meet the intended research-product standard:

- the normal path is a stack of subject, endpoint, release and action
  disclosures rather than a clear research task;
- internal delivery vocabulary has repeatedly appeared before source,
  coverage and data actions;
- large annual collections do not have an appropriately scannable primary
  presentation; and
- the newest `Access data` simplification has a blank-panel defect.

The defect is a user-interface failure, not evidence of missing source data or
a DB1 storage/reconciliation failure. It must not be addressed by another CSS
exception layered onto the nested-disclosure structure.

## 3. Evidence considered, and its limits

The project owner commissioned three external implementation responses from
the self-contained [external UX commission](../../archive/workstreams/db1/delivery/EXTERNAL_UX_RESEARCH_COMMISSION_2026-08-05.md).
They are design advice, not governing authority or verified technical findings.
Their terminology differed, but all three independently concluded that the
existing nested-disclosure navigation is the wrong primary structure and that
a release list/table belongs in a stable endpoint context.

The proposals considered these practical alternatives:

| Reconciled option | External pattern(s) | Strength | Limitation |
| --- | --- | --- | --- |
| Controlled in-place expansion | release cards / controlled accordion grid | Smallest change; removes the hidden-summary CSS hack. | Still concentrates discovery, releases and provenance in a long expanding page. |
| Split-pane explorer | master-detail / research workspace | Fast movement among endpoints for power users. | More responsive and keyboard/focus-state complexity; a side pane becomes cramped for many annual releases. |
| **Directory and dedicated endpoint workspace** | hub-and-spoke / flat directory and dedicated route / endpoint-first shelf | Clear discovery, stable shareable context, full-width annual release list and conventional accessibility. | Requires a contained navigation/view-state refactor. |
| Faceted catalogue with a drawer | master list plus off-canvas detail | Fast filtering in a catalogue. | A drawer is a poor primary surface for long release lists, provenance and large-response access. |

The advice occasionally overstates its conclusions. Native `<details>` is not
inherently inaccessible; it remains appropriate for small optional static
explanations. The current failure is using nested disclosure, a hidden
`<summary>` and CSS-forced content visibility as the application’s primary
state/navigation model. Similarly, a shareable endpoint URL aids navigation
but does not create a persistent research identifier: a retained
release/manifest identity remains necessary for citation and reproducibility.

## 4. Recommended product contract

### 4.1 Directory: find a source

The Database mirror landing view becomes a compact directory, not a recursive
catalogue. It shows every approved retained endpoint in the existing research
subject taxonomy and supports a simple subject filter plus text search. The
initial implementation is deliberately modest: client-side filtering over the
existing authenticated catalogue response is sufficient for the current
endpoint count. It does not create a general database search or query service.

Each endpoint row/card must show, without expansion:

- endpoint name in plain language and its fixed Scottish Parliament path;
- research subject;
- a one-sentence source description drawn from the controlled endpoint guide;
- retained coverage summary and number of dated releases;
- any source-availability condition that materially affects its coverage; and
- one primary control: **Open endpoint**.

Selecting a subject may filter the list but must not be required before a
researcher can locate an endpoint by search. On a narrow viewport, the subject
filter becomes a normal button/select/controlled panel above the list; it is
not an off-canvas task-critical drawer.

### 4.2 Endpoint workspace: understand and access a source

`Open endpoint` presents a stable endpoint workspace. The implementation must
first establish the lowest-risk way to preserve a shareable client URL with
the existing web server: a normal client route only if the existing SPA
fallback is confirmed, otherwise an explicit query/hash state. This is a
frontend routing decision, not an authorisation to change Nginx, API paths or
add React Router.

The workspace has this order:

1. breadcrumb, source title, Scottish Parliament path and a short plain
   language description;
2. concise coverage and source-condition summary;
3. a distinctly styled **mirror-generated bulk access** panel where a
   compatible all-years package exists, stating that it is assembled from
   multiple retained captures rather than one Scottish Parliament response;
4. a full-width, accessible release list/table; and
5. optional static disclosure areas for endpoint-level provenance, citation
   guidance and request examples.

The release list/table is the primary work surface. Its default columns are:

| Column | Meaning |
| --- | --- |
| Source year/window | The fixed source period, where relevant; never silently substitute capture date. |
| Captured | Date/time at which this dated response was received by the Database mirror. |
| Source condition | Data, empty collection, or a retained Scottish Parliament availability notice. This is source evidence, not a product-health indicator. |
| Access | Explicit actions appropriate to that retained response. |

For a one-release endpoint, the same source/capture/action information may be
shown as a concise release summary rather than a one-row visual table. It must
not require an additional “Access data” click.

### 4.3 Release actions and truthful labels

For every retained response, the action area uses the following labels and
brief explanatory text. Icons may reinforce a label but never replace it.

| Action | Meaning to state in the interface | Visual priority |
| --- | --- | --- |
| **View original JSON** | Opens the exact dated JSON held in the Database mirror. | Primary |
| **Download original JSON** | Downloads that same dated retained JSON as a file. | Secondary |
| **Browse retained records** | A bounded, server-side convenience view; available only where a source-preserving projection and profile have passed. | Secondary, conditional |
| **Open live Scottish Parliament source** | Leaves the Database mirror for the mutable upstream source; it may have changed since capture. | Tertiary/external |
| **Download all years (mirror-generated)** | A labelled convenience package assembled from compatible retained captures, not one original source response. | Separate endpoint-level panel, conditional |

The UI must retain access to original JSON for an upstream availability
message. It must not disable or hide that evidence merely because it is not a
data collection. The human-facing condition is, for example:

> **Upstream availability notice captured.** The Scottish Parliament returned
> an availability message for this request on [capture date]. CLD retained the
> response as received; this does not establish that historical records do not
> exist.

Where a raw retained response has no safe structured browser or field guide,
the human-facing condition is:

> **Raw response available.** The original JSON can be viewed and downloaded.
> A structured browser and field guide have not yet been published for this
> response; this does not affect access to the retained response.

### 4.4 Provenance, citation and raw data handling

Capture date, source year/window and source condition are needed to choose a
release and are therefore visible by default. Source URL, content type, byte
length, SHA-256 checksum, manifest identity, reconciliation evidence, citation
text and language snippets remain close at hand through labelled secondary
sections such as **Provenance and citation**. They are not shown ahead of the
release actions.

Citation text must identify the Scottish Parliament source, source URL,
retrieval/capture date and the named retained manifest. A stable endpoint URL
is useful context, but it must not be represented as the release identifier.

“View original JSON” remains a direct raw-response view. The workspace must
not eagerly render or syntax-highlight a large raw body in the initial page;
that would create a new high-volume reliability and accessibility problem.

## 5. Interaction, semantics and visual direction

### 5.1 State and controls

The implementation removes recursive `<details>` from catalogue/release
navigation. It may use:

- links/buttons for directory filtering and endpoint navigation;
- a conventional link or controlled button to select a release;
- semantic `<table>` markup for multi-release annual windows, with `th`
  column headers and a contained horizontal scroll wrapper when its structure
  needs two-dimensional scrolling; and
- a controlled `button`, `aria-expanded`, `aria-controls` and stable region
  ID for optional rich provenance content, or a simple native `<details>` for
  static text-only explanation.

No CSS rule may hide a `summary` and separately force a closed disclosure body
to display. A user must be able to reach any primary action through ordinary
links/buttons and predictable keyboard order.

### 5.2 Visual direction

The visual approach is a calm research workspace, not a copy of the previous
pilot or a generic administration console:

- retain a restrained navy/gold brand shell if it continues to meet contrast,
  but use a quiet neutral/near-white surface for dense data workspace areas;
- use a highly legible sans-serif system stack for controls and tables,
  tabular numerals for dates/counts, and reserve any serif face for a small
  number of editorial headings;
- use spacing, hierarchy and subtle single-pixel boundaries in preference to
  repeated heavy nested cards;
- distinguish primary mirror actions, secondary access aids and external live
  actions through text, placement and contrast—not colour alone; and
- preserve visible `:focus-visible` treatment, reduced-motion preferences and
  minimum target sizes.

The exact colour tokens and typography remain an implementation design task;
no external font, hosted design service or component library is authorised by
this proposal.

### 5.3 Responsive and accessibility contract

The directory and endpoint workspace must:

- work at a 320 CSS-pixel viewport and 200–400% zoom without page-level
  horizontal scrolling;
- confine any necessary horizontal scrolling to an identified semantic data
  table, with a visible cue and keyboard-reachable controls;
- retain a visible, unobscured focus indicator on every interactive control,
  including with any sticky page element;
- offer labels that say when a link opens the live external source/new tab;
- make all primary actions and status information understandable without
  colour, hover or icon-only interaction; and
- announce table headers and release/action labels coherently to a screen
  reader.

## 6. Contained implementation package proposed for approval

If approved, the smallest implementation package is frontend-only and is
limited to the existing private web application and its existing frontend
tests/documentation.

| In scope | Explicitly out of scope |
| --- | --- |
| Refactor the authenticated Database mirror view into directory and endpoint workspace states using existing catalogue/research-access responses. | Source request, re-fetch, capture, ingestion, parse, transformation, projection/profile creation or database mutation. |
| Remove the hidden-summary/forced-display CSS pattern and duplicated unreachable Database mirror renderer branches. | API contract/path, web-server/Nginx, Fastify, Postgres, service/timer, environment/secret or permission change. |
| Add source descriptions, coverage/status labels, action hierarchy, provenance/citation disclosures and responsive/accessibility styling. | New package/dependency, external font/service, public access, generic SQL/OData, DB2, charts, playground, research release or new bulk-data creation. |
| Add tests for directory filtering, endpoint/release selection, source condition and action semantics, keyboard focus/order and blank-state regression. | Any claim that the Database mirror is complete/current, an immutable release, a general API, or a canonical dataset. |

The package may use existing client-side navigation capabilities. If it cannot
provide stable client links without changing a server/configuration boundary,
it stops and returns with the smallest separate proposal; it must not quietly
change infrastructure or add a router dependency.

### Verification and acceptance evidence

Before private deployment, retain:

1. production build and existing automated test result;
2. new deterministic interface tests covering the directory, a single-release
   source, a multi-year source, a retained availability message and an
   unavailable browser/field-guide state;
3. a keyboard/focus and 200%/400% zoom test record, including an annual
   release table;
4. a screen-reader semantics check for table headers, status and external-link
   wording;
5. a check that primary JSON actions preserve the existing retained raw access
   URLs and that no source request occurs; and
6. owner live review before a private web-presentation deployment.

### Containment and rollback

The first package changes no data, backend or operational service. Until
owner live acceptance, it is not deployed. If deployment is later approved,
rollback is limited to restoring the preceding versioned CLD web release; the
existing authenticated API/DB1 retention/timer path is untouched.

## 7. Decision required and next step

The owner approved the contained frontend-only package on 5 August 2026.

### Local implementation and verification record

The implementation is confined to the existing web renderer, stylesheet and a
new deterministic interface-contract test. It introduces a searchable
Database mirror directory, hash-based endpoint selection that needs no web
server route change, a full-width release table, truthful raw/live action
labels, release-level provenance/citation disclosure and a neutral retained
upstream-availability state. The former CSS rule that hid an inner `summary`
while forcing its closed body visible has been removed.

`npm test` passed with 36 tests, including the new directory/action/semantic
contract tests. Production build, capability checks, documentation-link check
and whitespace check passed. The test environment does not provide an
authenticated local DB1 fixture, so this result does not substitute for a
live owner visual and interaction review. No source request, database/API,
schedule, dependency, configuration, service or deployment action occurred.

### Private deployment record

The owner explicitly authorised the bounded private web-presentation release
on 5 August 2026. The existing deployment path built and verified pushed commit
`cbb5921cc8f7e1db16d49b875865e0fa3b261320`, created a new CLD web release and
restarted only `cld-gb-sct-web.service`. Remote verification passed the
production build, all 36 automated tests, capability checks and B1 packaging.

Read-only post-release checks confirmed that `cld-gb-sct-api.service`,
`cld-gb-sct-web.service` and every named DB1 timer remained active; the API and
web health routes responded; and an unauthenticated request to
`/db1/gb-sct/research/catalogue` remained denied with `403`. No Scottish
Parliament source request, capture, database/projection/schedule/API/configuration
or unrelated VPS-service change occurred.

**What next:** the owner should conduct the live research journey through the
Database mirror directory and a representative endpoint workspace, then report
any residual usability, accessibility or data-access issue. No further DB1
feature, data, source or infrastructure work is authorised by this decision.

### Owner-directed presentation refinement

The first live owner review found three concrete presentational defects:

1. the large light workspace surface broke the established visual system;
2. endpoint pages repeated the page title and the Database mirror explainer;
   and
3. users had to guess what view, download, browse, live-source and details
   actions would do.

The owner directed a contained frontend-only correction. The local revision
restores a coherent dark research surface; keeps the general “how the Database
mirror differs” explanation only in the directory; gives each endpoint one
visible page title; renames the refresh control; adds an accessible disclosure
beside every release action stating its outcome; and makes Browse open its
associated retained-record panel. It removes duplicated access buttons from
the secondary details panel so that the release row is the one clear access
surface.

The revision is limited to the existing web renderer, stylesheet and
deterministic interface-contract test. Production build, all 37 tests,
capability checks, documentation-link check and whitespace check pass.

The owner approved the bounded web-only deployment on 5 August 2026. The
existing deployment path built and verified commit
`8be6c597537e79437c7d491e547ebe0f1ba06892`, created a new CLD web release and
restarted only `cld-gb-sct-web.service`. Read-only post-release checks confirmed
that API/web services and all named DB1 D4A–D12 timers remained active, the API
and web health routes responded, and unauthenticated
`/db1/gb-sct/research/catalogue` remained denied with `403`. No source request,
capture, database/projection/schedule/API/configuration, dependency or
unrelated-service change occurred.

**What next:** owner live review of the corrected Database mirror directory and
endpoint journey. No further DB1 feature, data or infrastructure work is
authorised by this decision.
