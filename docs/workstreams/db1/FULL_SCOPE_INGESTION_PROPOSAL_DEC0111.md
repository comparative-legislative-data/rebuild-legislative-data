# DB1 Full-Scope Ingestion Proposal — DEC-0111

**Status:** Proposed — owner approval required before operational work.

**Decision requested:** Authorise one controlled DB1 full-scope ingestion
programme for the 35 approved GB-SCT source forms currently labelled
`FUTURE_CAPTURE`, plus the route-universe, retention and update controls
needed to make all 64 selected forms explicit DB1 holdings.

This is a proposal only. It authorises no source request, payload inspection,
capture, PostgreSQL change, raw-object write, timer/service change, frontend
work or deployment unless the owner expressly approves the implementation
package described below.

## 1. The outcome this proposal is designed to deliver

At present DB1 has 29 of the 64 selected Scottish Parliament API forms. They
expand into 113 literal route/windows, chiefly because four annual API forms
are retained by source year. The remaining 35 forms are in scope; none was
excluded as irrelevant.

After a successful programme, DB1 can make the following bounded statement:

> As of the named capture and reconciliation times, DB1 retains a source
> response or an explicit source condition for every approved GB-SCT API form
> and every controlled input/window in that form's versioned capture universe.

That is a source-preserving mirror statement, not a claim that the Scottish
Parliament source is globally complete, that every route will always return
records, or that the material has been turned into DB2 variables.

`Complete` has a precise operational meaning here. A form is not complete
merely because its parent collection is present. It must have:

1. a controlled request contract;
2. a named and versioned universe of literal inputs where it is a detail or
   filtered route;
3. one retained source result or explicit first-class source condition for
   every member of that universe;
4. raw-byte, manifest, request and capture evidence; and
5. a declared update/reconciliation control.

No form may be silently treated as represented by a different form. An
unresolved source contract, source availability message, failure or capacity
stop remains a visible gap. It requires either remediation or a named
owner-approved exception before DB1 can be described as full-scope.

## 2. Scope and the important distinction between forms and requests

The approved scope is the 64 forms in the
[expected-scope register](assurance/GB_SCT_DB1_EXPECTED_SCOPE_REGISTER_2026-08-05.md).
The outstanding 35 do **not** mean 35 HTTP requests:

- 21 are reference/institutional detail forms whose request universe is
  derived from a named retained parent response;
- 4 are unfiltered, potentially high-volume MQA collections;
- 3 are parameterised MQA event-link forms, where the literal input values
  must first be deterministically enumerated;
- 4 are MQA detail forms, whose inputs depend on the new MQA collections; and
- 3 are detail forms for annual Official Reports and Votes on Motions, whose
  route contracts need controlled confirmation because a prior sample observed
  an empty object with HTTP 200.

The programme therefore establishes the number of requests from controlled
source evidence during its first operational stage. It must never invent an ID
range, accept arbitrary user-supplied IDs, or infer that a route family is
complete from one illustrative request.

## 3. Capture cohorts and dependency order

The work is deliberately grouped into six operational cohorts, rather than 35
unrelated micro-projects. Each cohort records a single capture-run identity,
its source form(s), parent manifest(s), input-universe version, request count,
result counts, failure/availability conditions and reconciliation result.

| Cohort | Outstanding forms | Controlled input universe | Why it comes at this point |
| --- | ---: | --- | --- |
| **F0 — readiness and universe registry** | 35 forms, no captures | Existing DB1 parent manifests and route-contract evidence, plus templates that bind F3 to designated F2 outputs. | Creates the literal, reproducible plan for each form before any request is issued. |
| **F1 — reference and institutional details** | 21 | IDs from the named retained collection for bills, stages/types, sessions, members/statuses, constituencies/regions, parties/roles, government roles, committees/roles/types, MQA event types and MQA event subtypes. | These are finite parent-derived detail routes and have no dependency on high-volume MQA collections. |
| **F2 — MQA source collections** | 4 | Fixed, unfiltered source routes: events, motions, questions and supports. | Captures the source collections from which subsequent MQA detail and relation request universes are derived. |
| **F3 — MQA details and event-link filters** | 7 | Deduplicated literal identifiers/values derived from the named F2 collection manifests and the existing retained event-links collection, under a versioned extraction rule. | Cannot be complete until F2 has established its input universe. |
| **F4 — annual-source detail forms** | 3 | Literal identifiers derived from named annual Official Reports and Votes on Motions manifests, after route-contract confirmation. | Keeps the prior empty-object observation explicit rather than treating it as data or silently skipping these forms. |
| **F5 — full-scope capture closure** | no new form | Combined 64-form coverage, exception, manifest and update-control record. | Establishes whether every approved form is retained or has a visible approved exception before QA or portal work resumes. |

The individual forms in each cohort are below. This is a scope map, not a
claim that any source request has been made.

| Cohort | Forms |
| --- | --- |
| F1 | `bills.detail`; `bill-stages.detail`; `bill-stage-types.detail`; `bill-types.detail`; `sessions.detail`; `members.detail`; `member-constituency-status.detail`; `member-region-status.detail`; `constituencies.detail`; `regions.detail`; `parties.detail`; `member-parties.detail`; `party-roles.detail`; `member-party-roles.detail`; `government-roles.detail`; `member-government-roles.detail`; `committees.detail`; `committee-roles.detail`; `committee-types.detail`; `mqa-event-types.detail`; `mqa-event-subtypes.detail`. |
| F2 | `mqa-events.collection`; `mqa-motions.collection`; `mqa-questions.collection`; `mqa-supports.collection`. |
| F3 | `mqa-events.detail`; `mqa-motions.detail`; `mqa-questions.detail`; `mqa-supports.detail`; `mqa-event-links.child`; `mqa-event-links.main`; `mqa-event-links.parent`. |
| F4 | `committee-reports.detail`; `plenary-reports.detail`; `motion-votes.detail`. |

## 4. Required data-pipe and retention design

The DB1 ingestion path remains separate from the live-proxy path:

```text
Scottish Parliament API ──direct, controlled DB1 capture──> DB1 raw store + PostgreSQL evidence
Scottish Parliament API ──independent no-retention relay──> Live API catalogue
```

The two products may share the authenticated application and VPS foundation;
they must not share a response cache, source request, raw body, capture queue
or update decision. DB1 does not ingest from the proxy, and the proxy does not
read DB1.

For every capture DB1 must retain, or visibly record as unavailable/failed:

- the selected source-form identifier and literal source URL/query;
- the request method and relevant non-secret transport metadata;
- capture time, runner/configuration identity and parent-universe version;
- original response bytes, content type, byte length and SHA-256 digest;
- a manifest linking the result to its raw object and source request;
- source condition: returned, upstream availability message, source error,
  controlled failure, or unresolved contract; and
- reconciliation/update state without overwriting earlier evidence.

The enumeration registry is DB1 operational metadata, not DB2. It preserves
which literal inputs were derived from which retained parent manifest and
under what mechanical extraction rule; it makes no claim about the substantive
meaning of an identifier or relationship.

## 5. F0: the mandatory readiness record

F0 is the only preparatory stage. It prevents a large ingestion programme from
becoming an undocumented series of guesses. It must complete before F1–F4 and
may use existing DB1 metadata/retained parents plus templates that bind F3 to
the designated future F2 outputs; it does not contact the Scottish Parliament
API.

For every outstanding form, F0 creates a versioned route-universe record with:

| Field | Requirement |
| --- | --- |
| Form and contract | Exact selected form, literal path/query shape, source method, and the evidence for its parameter name/type. |
| Parent evidence | Named existing DB1 manifest(s), or the immediately preceding F2 manifest for dependent MQA forms. |
| Enumeration rule | Mechanical field/path extraction, normalisation and deduplication rule; no semantic transformation. |
| Candidate count | Exact count calculated from the named parent evidence before child requests begin. |
| Request rule | One request per literal candidate, or one fixed source request for a collection. |
| Result treatment | Returned response, upstream availability, invalid request, source failure, rate/capacity stop, or contract mismatch are distinct preserved states. |
| Refresh rule | How the universe will be re-derived, how additions/removals are recorded and when existing details are rechecked. |

F0 must not use a generic crawler. The universe must be finite, reproducible
and inspectable from retained parent evidence. If a form cannot be given such
a universe, the programme stops that form with `UNIVERSE_UNRESOLVED`; it does
not mark it complete or use a guessed substitute.

## 6. Handling the genuinely different source patterns

### 6.1 Parent-derived detail forms (F1)

For each F1 form, DB1 derives a distinct literal-ID list from its named parent
collection capture, then records one request/result per candidate. The parent
manifest and universe version are retained with every child result. A later
parent response may add or remove candidates; additions are captured, removals
remain historically evidenced, and a changed existing candidate is never
silently overwritten.

#### Legacy-control reconciliation

The early Bills-detail handling record is historical context, not an active
F1 exception. The present governing position is the owner-approved 64-form
scope and the owner direction in DEC-0110 that requires full-scope ingestion
before further DB1 work. `bills.detail` therefore follows the same
parent-derived capture pattern as the other F1 detail forms.

Before F1 begins, the implementation record will make one concise
legacy-control reconciliation: it will list any historic route restriction,
state whether it identifies a current technical/source condition, and record
why it does or does not affect the current implementation. A historic
precaution cannot become a new blocker merely because it exists in the archive.
Only an actual observed source/technical condition encountered during the
approved work package may stop an individual form.

### 6.2 Unfiltered high-volume MQA collections (F2)

F2 uses four fixed public source routes, but their response volume is not
assumed to be modest or paginated. The implementation must:

- preflight available VPS disk, database and raw-store headroom without
  inspecting unrelated workloads;
- stream source bytes directly to the DB1 raw-object path, avoiding a complete
  in-memory response; and
- enforce a declared per-request time, size and retry policy that preserves a
  partial/failure state rather than treating an interrupted transfer as a
  collection response.

No source body is parsed into DB2 variables. A structural projection may be
made only as DB1 operational evidence needed to derive a literal child-request
universe and to support source-record access later; it must retain a raw-object
link and cannot rename or reinterpret source fields.

### 6.3 MQA detail and relation forms (F3)

The four MQA detail forms derive their literal identifiers from the F2 raw
collection captures. The three event-link forms derive literal parameter
values from the versioned F2/event-links evidence under a mechanical
deduplication rule. Each filter parameter is its own source form: `child`,
`main` and `parent` must not be collapsed into one inferred relation.

The request log records the literal parameter, its universe version and the
raw result. It makes no claim about the role or direction of that identifier.
This preserves the API's response form while giving a later researcher portal
an auditable route from collection to detail or filter response.

### 6.4 Official Reports and votes detail forms (F4)

F4 is not allowed to assume that `/:id` has the same contract as the annual
collection. Earlier controlled observations recorded an empty object with
HTTP 200 for the two Official Reports detail forms and the votes detail form.
Before bulk F4 capture, the implementation must run a bounded route-contract
check against a small, predeclared sample of identifiers from named retained
annual manifests. It must record response shape and availability condition,
not source content in repository documentation.

If the source contract is confirmed, DB1 derives the full literal-id universe
from the named annual manifests and captures it with the same per-request
evidence model. If it continues to return an empty object or the input binding
cannot be established, the fact is a source-contract gap. The owner then
chooses either a documented exception or a new source-handling decision; it is
not rendered as zero records and does not disappear from the coverage matrix.

The existing `2006` Committee Official Reports availability response stays a
separate retained source condition. Its scheduled source recheck must be
declared explicitly; no later success can erase the prior availability
evidence.

## 7. Update and reconciliation controls after baseline capture

Full initial ingestion and ongoing mirror maintenance are one backend outcome,
but they are different operations. The programme must install its operating
controls at the same time as the relevant cohort, not leave them to a later
frontend project.

| Route pattern | Proposed control |
| --- | --- |
| Fixed reference/institutional collections and their details | Daily parent reconciliation. Re-derive the literal universe on change; capture new candidates immediately. Reconcile existing detail responses by a declared full-family cycle, so a detail change cannot remain permanently invisible. |
| MQA collections, details and event-link filters | Daily collection reconciliation; re-derive dependent universes on any collection change. Use a declared full-family cycle for existing details/filters, with bounded concurrency and recorded results. |
| Annual questions, votes and Official Reports | Retain the current literal year windows; continue annual-window reconciliation under an explicit cadence. Current-year windows require the most frequent control; historical years and all-years detail universes must state a non-ambiguous recurring cycle. |
| Upstream availability / invalid contract | Keep as a named route/window condition and perform the separately declared recheck. A source condition is not an empty result. |

The implementation proposal must set the actual cadence, retry window,
concurrency and capacity limits from F0/F2 operational evidence. It cannot
claim daily equality simply because a timer exists. Each scheduled run must
produce an auditable reconciliation state, next-due time and exception record.

## 8. Boundaries, stops and recovery

The implementation work package must stop the affected form or cohort—without
touching unrelated VPS services—when any of the following occurs:

- no finite or reproducible input universe can be established;
- a route contract differs from its approved literal form;
- source response size, time or rate behaviour exceeds the declared cohort
  limit;
- available project DB1 capacity is insufficient;
- source availability/error condition is returned;
- a raw object, manifest or PostgreSQL link cannot be recorded.

The stop record must identify the affected source form, parent universe and
last safe state. It must not delete earlier captures, retry indefinitely,
reuse proxy data, fall back to a different source route, or alter unrelated
services. Recovery requires a focused owner-approved amendment only where the
problem changes the approved contract or material resource boundary.

## 9. Acceptance criteria for a completed full-scope ingestion programme

F5 may be marked passed only when:

1. all 64 DEC-0045 forms are in the DB1 coverage matrix;
2. each is `RETAINED`, `RETAINED_UPSTREAM_AVAILABILITY_MESSAGE`,
   `CONTRACT_UNRESOLVED`, `FAILED`, or an explicit owner-approved exception—no
   silent future-capture state remains;
3. every parameterised/detail form has a versioned parent universe, exact
   candidate count and per-candidate outcome totals;
4. every successful capture resolves through PostgreSQL metadata to its raw
   source object and manifest;
5. all high-volume routes have capacity and incomplete-transfer evidence;
6. every route/window has a declared update/reconciliation owner and next due
   condition; and
7. the final report distinguishes successful retention, source conditions,
   known gaps and unknowns without calling DB1 a live API or DB2 dataset.

Only then may the paused Backend Assurance work resume. Stored-byte integrity,
live-source parity and the independent Research Portal remain separate follow-
on decisions; completing source-form coverage does not silently approve them.

## 10. Explicit exclusions

This proposal does not authorise:

- proxy changes or use of proxy responses for DB1;
- DB2 variables, joins, transformations, semantic codebooks, charts or the
  data playground;
- any Research Portal redesign or implementation;
- public access, generic SQL/OData, unbounded user queries or a public data
  release;
- substitution of a source document corpus for API capture; or
- deletion, replacement or reinterpretation of existing raw source evidence.

## 11. Owner approval requested

Approve, amend or decline this **full-scope DB1 ingestion programme**. If
approved, the next step is an implementation-ready work package that names the
exact F0/F1/F2/F3/F4 commands, source routes, resource controls, write targets,
schedule changes, expected output records and rollback/stop behaviour.

The implementation work package must include the short legacy-control
reconciliation and the F4 detail-contract check before source action begins.
Approval of this document alone does not contact the source or change DB1.
