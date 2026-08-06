# GB-SCT Database Mirror (DB1): Postgres-first rebuild plan

**Status:** proposed for owner review — planning only; no implementation authority

**Date:** 6 August 2026  
**Applies to:** the future GB-SCT Database mirror only  
**Does not authorise:** source requests, database/VPS changes, schedules,
ingestion code, a temporary test interface, a researcher portal, DB2 work or
deployment.

## 1. Decision requested

The project owner is asked to approve, amend or reject this proposed delivery
shape. Approval would authorise preparation of a separate, exact implementation
package; it would **not** itself authorise capture.

The intended product is simple:

> The Database mirror stores the approved Scottish Parliament API responses in
> PostgreSQL, source-faithfully and with enough provenance to establish what
> DB1 held at a stated time. A later portal makes that database easy and useful
> for researchers to explore and reuse.

DB1 is neither the live API proxy nor DB2. It must not create analytical
variables, semantic interpretations, record-to-record joins or derived facts.

## 2. Evidence considered

This proposal synthesises four substantive independent reviews commissioned on
6 August 2026. They were based on the supplied brief only; reviewers had no
repository, VPS or source-data access. A fifth response that consisted only of
an unrelated academic-manuscript response template is excluded from the
synthesis.

The useful common conclusions are:

1. the previous implementation failed because it tested its own internal
   machinery rather than the owner’s plain-English product requirement;
2. DB1 source data must reside in PostgreSQL, not in a filesystem archive with
   database metadata alongside it;
3. a fixed, reviewable request matrix—not identifiers found in a response—must
   control every source request;
4. response-level storage is the safe fidelity anchor; any record-level
   convenience layer must be separately declared and must never become an
   inferred crawl or DB2 transformation;
5. a small number of binary gates and direct PostgreSQL tests are more useful
   than per-endpoint approvals or a large temporary interface; and
6. backend completion and the researcher portal must be separate projects.

Some review suggestions are deliberately not adopted here. In particular,
DB1 will not derive detail requests from a parent collection, strip source
envelopes, convert timestamp types, replace blank values, or create a
researcher-facing QA dashboard during backend work. Those would either change
the source response or recreate the earlier drift.

## 3. Product boundary and non-negotiable tests

The following tests will be written before any implementation and answered
with direct evidence at every gate:

| Test | Required answer |
| --- | --- |
| Is the source data actually in PostgreSQL? | A direct SQL query can retrieve the retained response body for every approved response unit without reading a filesystem payload. |
| Is capture bounded? | The worker can request only a literal request/window listed in the owner-approved response-unit matrix. |
| Is every scope item visible? | Every matrix row has either a retained source response or a first-class upstream/local condition. Nothing is silently absent. |
| Is DB1 source-faithful? | The raw bytes, SHA-256, request URL/parameters and captured JSON representation can be tied to the same response row. |
| Has a test tool become the product? | No researcher-facing Database mirror interface is linked, deployed or accepted during Project A. |

Failure of any test stops the affected package. A narrative explanation does
not convert a `FAIL` into a pass.

## 4. Recommended DB1 architecture

### 4.1 Storage rule

PostgreSQL is the sole DB1 source-data store. For every successful approved
response unit, one immutable response row contains:

- the unaltered HTTP response body as `bytea`;
- a SHA-256 digest and byte length calculated from those bytes;
- a `jsonb` representation of the same body where it is valid JSON;
- exact request URL, method, non-secret request metadata, relevant response
  metadata, retrieval times and capture-run identifier; and
- a source condition (`OK`, an upstream availability notice, a transport/HTTP
  failure, malformed JSON, or another explicitly defined non-success state).

`bytea` preserves the received body; `jsonb` makes the same successful JSON
response queryable. The two values live in the **same PostgreSQL row**. JSONB
is an access representation, not a replacement for the original bytes. No raw
source body may be written to an application directory, VPS archive, object
store or Git repository as part of DB1 capture.

The initial DB1 product is response-level. It does not populate a generic
record table by guessing what a record is. A later, separately approved,
mechanical projection may extract an API-delineated JSON sub-document from
named forms, but it is not required for DB1 backend acceptance and must never
alter the source-response anchor.

### 4.2 Minimal relational model

The final DDL may refine names but must retain this separation:

| Table / view | Purpose |
| --- | --- |
| `source_form` | The approved 64-form inventory and its stable form key. It is not itself a queue of requests. |
| `response_unit` | The literal, finite source request/window that is allowed for capture, plus cadence, expected request count and rationale. This is the executable response-unit matrix. |
| `capture_run` | One bounded manual or scheduled run, its software/configuration revision, start/end, status and resource result. |
| `source_response` | Immutable source-body and provenance rows, held in PostgreSQL. A repeated identical body does not create a duplicate body row. |
| `response_verification` | Each check of a response unit, including an unchanged result, changed result, upstream availability condition or failure. |
| `schema_observation` | A lossless structural fingerprint of a successful JSON body, used to flag shape change without changing the stored response. |
| current-state view | The latest successful retained response and latest observed condition for each response unit. It is a view/pointer over the immutable records, not a second source store. |

Only conservative metadata indexes are required at first: response-unit/time
lookups, capture run/status and digest/idempotency. Any JSONB index must first
be justified by a measured query need and a storage budget. DB1 will not build
an all-fields index merely because JSONB permits it.

### 4.3 Change and retention rule

For a due response unit, the worker retrieves precisely the matrix request,
hashes the received bytes, and compares the result with the last successful
response for that unit.

- **New or changed bytes:** insert a new immutable `source_response` row and
  link the verification event to it.
- **Identical bytes:** insert a lightweight verification event; do not store a
  duplicate large body.
- **Upstream availability/error/malformed response:** insert a first-class
  verification/condition event. Do not replace or delete the earlier good
  response.

This produces a reproducible history of changed source responses and the dates
on which an unchanged response was checked, without pretending repeated
identical files are new data.

### 4.4 Explicitly excluded from DB1

- any request whose URL/window is not in the approved response-unit matrix;
- extracting IDs from an API response to construct a new queue of detail calls;
- envelope stripping, field renaming, type conversion, null/blank
  standardisation, semantic labelling, joining or aggregation;
- DB2 variables, codebooks, charts and research conclusions;
- filesystem raw-payload retention; and
- a researcher portal or incremental conversion of a QA screen into one.

## 5. Scope: the form inventory is not yet the capture matrix

The approved long-term inventory has 64 API **forms**. A form can be a fixed
collection, a named annual route, or a parameterised/detail route. It does not
by itself state a finite response request.

Before capture, a new versioned response-unit matrix must make the full scope
executable and auditable. For every form it must state:

- the exact upstream URL or literal parameter/window values;
- why that response is the retained unit;
- total request count and practical body-size/volume limit;
- whether it is fixed, annual, or another explicitly bounded class;
- capture and reconciliation cadence;
- source-condition handling; and
- why a parameterised/detail form is included through the stated finite rule
  or, if no defensible finite rule exists, an explicit scope gap needing an
  owner decision.

All 64 approved forms remain in long-term scope. The matrix does **not** permit
the implementer to make up an ID universe from returned source data. If an
approved detail form needs values, those values and their numerical bound are
part of the matrix and owner decision—not code discovery.

This is the one remaining design input that cannot honestly be guessed in this
proposal. It is also the safeguard against both false completeness and a repeat
of the earlier crawl.

## 6. Project A — backend completion in five gates

These gates cover the whole backend project, not individual endpoints or years.
They are deliberately few, binary and sequential.

| Gate | Bounded work | Pass evidence | Stop condition |
| --- | --- | --- | --- |
| **A1: Design lock** | Complete the response-unit matrix, data model/DDL, retention and update rule, resource budget, test list and operational design. | Owner approves one dated backend package with a total source-request bound. | A request unit, source scope, database target or no-transformation rule is unclear. |
| **A2: Source-free foundation proof** | Build the isolated PostgreSQL schema and worker path using synthetic data only. | Direct SQL retrieves a raw body and JSONB query copy from the same row; digest/byte length agree; no payload file exists. | A payload is outside PostgreSQL, queryability cannot be shown, or a non-approved live source action is attempted. |
| **A3: Full bounded ingestion** | Execute the entire approved matrix in compatible technical cohorts under the one approved package. | Every row is represented by data or an explicit source/local condition; no request outside the matrix; coverage report and direct SQL samples pass. | The code tries to expand scope, a matrix limit is exceeded, or a data/contract condition needs a new decision. |
| **A4: Operations and assurance** | Reconcile against the same matrix; test changed/unchanged/status handling, restart behaviour, resource containment, backup/restore and schema-drift signalling. | Whole-matrix verification report, successful safe restore test, non-overlap lock evidence, schedule/alert evidence and no shared-service impact. | Reconciliation cannot explain a difference, a schedule overlaps, restore fails, or the VPS resource boundary is exceeded. |
| **A5: Owner backend acceptance** | Demonstrate the accepted capability through direct PostgreSQL evidence and a concise backend report. Remove/freeze any operator instrument. | Owner accepts a factual capability statement and authorises separate portal design. | The product tests above fail or the portal is being used to paper over a backend gap. |

The only permitted implementation interface during A1–A4 is a minimal,
private operator instrument if direct SQL/log evidence alone is impractical. It
must be visibly labelled as an instrument, isolated from the user application,
not linked from the private beta, and removed or frozen at A5. It does not need
design polish and cannot become the portal by incremental patching.

## 7. Operational design requirements

The final A1 package must set concrete values, measured on the isolated shared
VPS. The following controls are mandatory:

- an isolated PostgreSQL database and least-privilege DB1 roles, separate from
  account/auth data and any future DB2 database;
- a single scheduled run lock using a transaction-scoped PostgreSQL advisory
  lock, so a stalled run cannot overlap its successor;
- small bounded concurrency, request timeout and bounded retries; limits are
  chosen from a short measured proof, not guessed as “fast” defaults;
- native systemd scheduling with explicit memory and CPU ceilings, plus a
  run-duration ceiling appropriate to the approved source matrix;
- daily routine reconciliation unless the approved matrix provides an
  evidence-based different cadence for a source unit; historical and
  high-volume units must remain visible in the schedule rather than silently
  dropping out;
- a health summary that records last start, finish, per-unit result, data/bytes
  written, availability conditions, failures, skipped/locked run and next due
  run, with an alert for failed or stalled scheduled work;
- an encrypted off-VPS database backup, and a restore test to a safe isolated
  target before A4 can pass; and
- a structural fingerprint/drift signal for successful JSON responses. It may
  report a changed shape; it must not rewrite data or assert semantic meaning.

The routine update process checks the same approved matrix. It finds changed
source responses by comparison, not new undocumented source forms. Adding a
new route or changing a response-unit rule remains a separate owner decision.

## 8. What A5 must truthfully establish

The backend acceptance report will be able to say, only within its stated
matrix and time window, that:

1. PostgreSQL holds the retained source response bodies and their provenance;
2. a named response unit has a latest retained source body or a visible source
   condition, and historical changes are retained;
3. the database can serve the future portal without recalling the Scottish
   Parliament API for the retained body;
4. DB1 can state when it last checked each response unit and whether the bytes
   changed; and
5. known upstream absences are preserved as source conditions, not disguised as
   local gaps or zero records.

It will **not** yet claim a public research release, canonical variables,
semantic field meanings, a complete historical universe beyond the approved
matrix, or a polished researcher interface.

## 9. Project B — independent researcher portal design

Project B starts only after A5. It treats the accepted database capability as a
contract and does not reuse the A-stage instrument as its visual or interaction
base.

The future portal must make two things true at once:

1. **A clear raw mirror.** A user can understand the endpoint/window, whether
   they are viewing retained DB1 data or the live Scottish Parliament source,
   what period is covered, and the relevant capture/reconciliation condition.
2. **A better research experience.** A user can discover data, inspect
   structure and fields, make bounded selections, obtain full or partial
   downloads, use reproducible snippets, and obtain citation/provenance
   information without learning internal DB1 terminology.

The A-stage backend must therefore preserve the following future portal
contract, without building the portal itself:

- endpoint/window directory and coverage/status metadata;
- retained response retrieval by stable identifier and capture time;
- database-derived JSON access and server-side streaming export capability;
- later CSV and NDJSON exports as the initial research formats; Parquet or
  other formats only when their equivalence and utility are specified;
- response/field guide inputs that clearly distinguish observed source fields
  from later DB2 definitions; and
- provenance/citation inputs: source URL, captured/verified time, response
  digest, DB1 release/capability version and known limitation.

The portal’s own design brief must include accessibility, task-based user
testing, modern responsive presentation and a direct comparison of at least
two viable information architectures. It must be approved separately.

## 10. Documentation and evidence discipline

The rebuild will use a small, human-navigable record set:

| Location | Living purpose |
| --- | --- |
| [`docs/workstreams/db1/README.md`](../workstreams/db1/README.md) | Plain-English DB1 narrative: purpose, boundaries, progress, gaps and review triggers. |
| This plan | External-review synthesis, proposed architecture and owner decision. |
| `docs/data/gb-sct/` | The approved response-unit matrix and any source-specific coverage/condition register. |
| `docs/governance/` | The eventual owner decision, material risks and review outcome. |
| PostgreSQL | Machine-readable capture, verification, source-condition and health evidence. |
| One backend acceptance report | A concise A1–A5 outcome, linked from the narrative and handover. |

Detailed implementation experiments belong in Git and test output, not in a
new pile of ad hoc active documents. The current failed attempts remain closed
in Git history; this plan is not a continuation of their technical design.

## 11. Owner choices before an implementation package

If the owner accepts this direction, the next planning package should resolve
only these concrete choices:

1. approve the exact response-unit matrix and its numerical request/volume
   bound for all 64 forms;
2. approve the dual PostgreSQL storage rule: raw `bytea` plus queryable JSONB
   for successful JSON, both in the database;
3. approve the change-retention rule: retain changed successful bodies and all
   verification/availability events, but do not duplicate identical bodies;
4. approve the measured resource/schedule/backup values proposed after the
   source-free foundation design; and
5. approve the five A-stage acceptance gates and the strict A5-to-Project-B
   hand-off.

No source capture is authorised until those choices are represented in the
response-unit matrix and a separate implementation package is approved.

## 12. Smallest next step

**Proposed documentation-only next step:** the owner reviews this plan and
either approves it as the DB1 design direction or identifies amendments. If
approved, prepare—not execute—the response-unit matrix and A1 implementation
package.
