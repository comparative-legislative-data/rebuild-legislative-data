# External commission: GB-SCT Database Mirror research portal

**Status:** `DRAFT FOR OWNER USE — NO IMPLEMENTATION AUTHORITY`  
**Date:** 6 August 2026  
**Purpose:** obtain independent product, research-UX and visual-design input
before the Database Mirror research portal is specified  
**Out of scope:** implementation, deployment, source capture, database change,
DB2 work or public release

## 1. Commission request

Comparative Legislative Data is building transparent, reproducible legislative
data infrastructure. Its first legislature is the Scottish Parliament.

We want independent advice on a **world-class research portal** for our
Database Mirror. We do not want an incremental improvement to an internal
engineering dashboard, nor a dry academic website that treats usability as
secondary. The aim is a modern, accessible, delightful and rigorous interface
through which an academic, journalist, policy researcher, student or
technically capable member of the public can understand and use a transparent
copy of official parliamentary API data.

Please provide two or three materially different design proposals, recommend
one, and give concrete information-architecture, interaction and visual
implementation suggestions. You have no repository access; this brief contains
the relevant context.

## 2. Product purpose and non-negotiable principles

The portal must help a user establish:

1. what data exists;
2. where it came from;
3. when it was captured and last checked;
4. what it contains and how it is structured;
5. how to inspect, query, download and cite it; and
6. what the source does not provide or what the project has not established.

Accuracy, provenance, reproducibility, accessibility and plain language are
core product features. Technical truthfulness must be visible without turning
the interface into a developer console.

Three layers must remain unmistakably distinct:

| Layer | What it is | What it is not |
| --- | --- | --- |
| **Live API catalogue** | A private, no-retention guide to the live Scottish Parliament API, with relay and direct-source access. | A retained dataset or a completeness claim. |
| **Database Mirror (DB1)** | Dated Scottish Parliament source responses held in PostgreSQL with provenance and routine reconciliation. | A live API, a promise of continuous currency, or an analytical dataset. |
| **DB2, later** | Tier 1/2 variables, codebooks, research releases, charts and playground tools. | Part of this commission. |

This commission is for **DB1 only**. Design it so it can sit coherently beside
the live catalogue and later DB2 without blending their meanings.

## 3. Current Database Mirror backend

The backend has been built and checked before this design work. It is an
isolated PostgreSQL service, separate from the live API relay.

### Scope and storage

- 64 Scottish Parliament API forms are in the selected project scope.
- They are represented by 117 exact approved source URLs: 29 fixed
  collections and 88 named annual responses.
- DB1 stores original response bytes **inside PostgreSQL**, not in a raw-JSON
  filesystem archive.
- It also stores 4,063,556 unchanged top-level source-object rows, linked to
  their raw parent response, source position and checksum.
- Each raw response records its source URL, retrieval times, HTTP status,
  relevant headers, content type, byte length and SHA-256 checksum.
- The current database is about 7.6 GB.

### API-form treatment

| Treatment | Count | Later DB1 capability |
| --- | ---: | --- |
| Whole response retained | 33 forms | Dated raw collection or annual response access. |
| Parent-backed detail/filter | 25 forms | Retrieval of the unchanged matching source object/filter result from a named retained parent response. |
| Scottish Parliament route limitation | 6 forms | Clear upstream-error/empty/no-ordinary-ID explanation and parent data where available. |

For example, live `/api/billtypes/1` returned:

```json
{"ID":1,"Name":"Executive"}
```

DB1 can return the same unchanged object from its retained `/api/billtypes`
parent response and disclose the parent URL, capture time, checksum and source
position.

### Verification and maintenance

After baseline capture, DB1 rechecked all 117 of the same URLs: 114 were
byte-for-byte unchanged; three returned the same named Scottish Parliament
conditions; zero had an unexpected source change, local failure, omitted check
or production schema-drift event.

The known source conditions are visible rather than hidden:

- 2006 Committee Official Reports returns the Parliament’s own “Data is
  presently unavailable” message.
- MQA Events and MQA Questions return Scottish Parliament HTTP 500 responses.

Fixed/current units are checked daily; historic annual units weekly. Changed
responses are retained append-only. DB1 cannot claim to be perfectly current
between checks.

### What does not yet exist

There is no researcher portal, user-facing DB1 API contract, download service,
general query UI, DB2 variable layer or public release. This is deliberate: we
want portal design to define the minimum backend access/export contracts it
actually needs, rather than letting ingest/QA mechanics dictate the user
experience.

Off-VPS backup and restore is deliberately deferred. Do not make it the focus
of this commission, but the portal must never imply recoverability.

## 4. Core user tasks

Design for a user who needs to:

1. find a topic, endpoint or source family without knowing API names;
2. understand coverage, time range, source condition and whether access is a
   whole response or parent-backed;
3. inspect raw JSON and, where useful, browse/filter source objects without
   mistaking a projection for transformed research data;
4. choose an appropriate option to view, download, get a bulk/all-years
   package, or use a documented API/query route;
5. obtain citation, manifest, checksum, capture time and code examples; and
6. distinguish a normal retained response, a source limitation, a live-source
   link and a dated Database Mirror response.

## 5. Questions for the review

### A. Product and information architecture

Propose a route through the portal that avoids a long nested click-through
catalogue. Address:

- directory/search/filter versus subject-first navigation;
- stable endpoint workspace URLs;
- separation of data access from provenance, field guidance and citation;
- small collections, large annual Official Reports, all-years access and
  source-limit cases;
- how to distinguish a dated mirror from the live Scottish Parliament API; and
- how to leave room for DB2 without blending DB1 and DB2 now.

### B. Research-grade data interaction

Recommend a graduated access model. Consider raw JSON view/download, table or
list browsing where genuinely useful, field/JSON-structure guides, server-side
search/filter, JSON/CSV/Parquet/SQLite, bulk/all-years packages, snippets for
cURL/Python/R/JavaScript, citations/manifests/checksums, clear external links,
and calm intelligible source-limit notices.

For each model, distinguish interface features from the backend access/export
contract needed to support them. A generic SQL console is not an acceptable
answer to researcher UX.

### C. Visual and interaction direction

We explicitly seek ambitious but disciplined visual input. The result must
feel contemporary and high quality, not like a 2001 research-lab application.
It should be memorable, calm and trustworthy rather than flashy for its own
sake.

Please consider and comment on:

- modern editorial/data-product layouts, typography, density and responsive
  behaviour;
- colour systems that distinguish provenance, status and actions without
  relying on colour alone;
- whether restrained **glassmorphism**—translucent surfaces, depth, blur and
  layered navigation—supports hierarchy and focus, or a paper/data-workspace
  model would be more appropriate;
- dark, light or adaptive themes; brand shell versus highly legible workspace;
- progressive disclosure, contextual help and question-mark/help affordances;
- loading/progress states for large responses and downloads; and
- accessibility: contrast, focus, keyboard operation, screen-reader semantics,
  zoom/reflow, motion sensitivity and mobile behaviour.

Do not recommend glass effects, animation or visual density merely because
they are fashionable. Recommend them only where they improve comprehension and
remain accessible.

### D. Technology and implementation direction

The application currently uses React, Vite and Fastify. You may recommend
design-system, component, visualisation, table, download or search tools if
they materially improve the product. Distinguish a reasonable stack enhancement
from a justified structural change and a premature technology change.

We welcome component hierarchies, interaction state models, CSS/tokens,
semantic HTML/ARIA patterns, React/TypeScript snippets, text wireframes and
pseudocode. Avoid generic tool lists without a user problem and rationale.

## 6. Constraints

- Private beta now, but not a disposable prototype.
- The frontend must not calculate, silently transform or invent research data.
- It must not claim live freshness, source completeness or semantic meaning
  beyond displayed evidence.
- Provenance must be easy to find but not obstruct first access to data.
- Large source responses cannot always be rendered as one browser table.
- An upstream availability/error response is source evidence, not a local
  product failure and not proof that historical records do not exist.
- No design should require public database access, public SQL, or a relaxation
  of the present private access boundary.

## 7. Requested deliverable

Please return:

1. a short diagnosis of the core UX/product challenge;
2. **two or three distinct portal models**, each with journey, information
   architecture, strengths, risks and accessibility implications;
3. a clear recommendation and rationale;
4. a visual-direction proposal: palette, typography, surface/layout approach,
   component character and rationale, including glassmorphism or alternatives;
5. examples of the directory, endpoint workspace, release/data-access row,
   provenance/citation view and source-limitation state;
6. practical CSS/component/code suggestions where useful;
7. minimum backend access/export contracts for each model; and
8. a staged implementation and task-based usability-testing plan.

## 8. Acceptance questions

A first-time user should be able to answer:

1. Where is the retained Scottish Parliament Bills response?
2. Is it live source data or a dated Database Mirror response?
3. How do I obtain exact retained JSON, and how is that different from the
   live Scottish Parliament link?
4. Where do I find capture time, verification and citation?
5. What happened to 2006 Committee Official Reports?
6. How do I get an all-years package where one is offered?
7. Can I complete these tasks with keyboard navigation and 200% zoom?

## 9. Self-contained brief

This commission is self-contained. Reviewers should rely on the project,
backend, user-task and constraint information in this document; no repository
access, linked documents, screenshots or other project material is assumed.

**What next:** owner review of this draft, then external responses can be
gathered and compared before any Database Mirror portal proposal or
implementation begins.
