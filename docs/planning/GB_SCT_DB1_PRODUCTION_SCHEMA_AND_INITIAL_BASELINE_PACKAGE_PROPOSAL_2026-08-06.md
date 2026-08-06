# GB-SCT DB1 production schema and initial-baseline package

**Status:** proposed — owner approval required before implementation or source action

**Date:** 6 August 2026

**Proposed decision:** DEC-0125

**Builds on:** the approved 64-form/117-response model and the passing
[A4 lossless-object source-free proof](../data/gb-sct/GB_SCT_DB1_A4_LOSSLESS_OBJECT_STRESS_PROOF_RESULT_2026-08-06.md)

## 1. Decision requested

Approve one bounded backend package that will:

1. remove the **non-baseline** partial A3 `db1` schema from the isolated
   project database only;
2. install the final PostgreSQL-only DB1 schema and worker; 
3. repeat the source-free production-schema check; and then, only if it passes,
4. request each of the 117 literal Scottish Parliament URLs once, retain each
   returned response in PostgreSQL, and publish a backend assurance report.

It does **not** authorise an ID crawl, a new endpoint or year, a frontend,
DB2, a public release, a routine schedule, an off-VPS backup, or a general
researcher query API. Those each require a later decision.

The package is deliberately one clean backend build, not 117 separate
mini-projects. It has three stop gates only: final source-free check, bounded
baseline capture, and direct database assurance.

## 2. The product in plain English

For every approved Scottish Parliament response URL, DB1 will hold:

- the exact bytes received from that URL;
- when and how they were requested, their HTTP result, size and checksum;
- a collection of the unchanged source objects contained in the response,
  where the response is an object array; and
- a clear record if the source returned an availability/error response or the
  project could not obtain a response.

This gives the later research portal three truthful products without recalling
the Scottish Parliament API:

| Future access | What it means |
| --- | --- |
| Exact retained response | The precise bytes DB1 received for one named URL/window. |
| Lossless source-object access | Unchanged objects selected from that named retained response, with its capture lineage. |
| Generated research download | A stated selection or format conversion from named retained objects, accompanied by a manifest. |

The first two are DB1. The third and all visual/researcher experience work are
separate future designs. DB1 creates no analytical field, join, codebook or
claim about what a source field means.

## 3. Fixed scope

The [response-unit matrix](../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md)
is the executable boundary.

| Scope item | Count | Treatment |
| --- | ---: | --- |
| Long-term API forms | 64 | Recorded in the DB1 source-form registry. |
| Directly retained forms | 33 | 29 fixed collections and 88 literal annual URLs: **117 requests**. |
| Parent-backed detail/filter forms | 25 | No upstream call. Later access is from a named retained parent response. |
| Upstream detail limitations | 6 | No upstream call. The limitation and relevant retained parent are visible. |

The initial baseline permits **exactly one GET per one of the 117 URLs**. It
does not retry a failed initial request, derive an ID from a response, discover
a new year, follow pagination, or adapt a query parameter. A response timeout,
HTTP error, availability message, invalid JSON or local limit is a recorded
condition for that named unit—not a reason to make another source request.

The known `year=2006` Committee Official Reports availability message remains
an included source condition, never a zero-record result or a skipped year.

## 4. Controlled replacement of the old partial schema

The old A3 partial rows were written under the unsafe whole-response JSONB
design. They are not a baseline and must not be mixed with the replacement.

The implementation will make this exact, project-only change:

1. verify that `cld_gb_sct_db1` is the isolated project database on the
   loopback-only `16/cld_gb_sct` cluster;
2. verify there is no active DB1 capture/schedule service and that the only
   target is schema `db1` in that database;
3. drop schema `db1` with its dependent partial A2/A3 objects;
4. create the production `db1` schema and new least-privilege DB1 roles; and
5. leave the separate `db1_a4_proof` metadata schema and its zero-payload
   result untouched.

This deletion is limited to project-owned, disqualified partial DB1 data. It
does not touch `16-main`, application/auth data, DB2, the API, web service,
Nginx, another database, or another VPS path. The implementation must stop if
the pre-flight cannot prove this exact target.

Rollback is intentionally simple: no old source data is restored. If the new
schema proof fails, DB1 remains empty and marked blocked; the proxy and all
other services remain unaffected.

## 5. Final PostgreSQL design

The schema uses one common lossless mechanism for every form. It does **not**
create a bespoke Bills, Members or Official Reports table.

| Table/view | Purpose |
| --- | --- |
| `source_form` | The 64 approved forms, description, parent relationship and access treatment. It is not a request queue. |
| `response_unit` | The 117 literal allowed URLs, their form, fixed/annual class, proposed later cadence and source-condition rule. |
| `capture_run` | One bounded source-free, baseline or later reconciliation run; software/config revision, timestamps, result and resource summary. |
| `source_response` | One immutable response received for a named unit: request/response metadata, exact `bytea`, length and SHA-256. There is **no whole-response JSONB column**. |
| `response_object` | One unchanged top-level source object linked to its raw response, technical source position, raw-object SHA-256 and JSONB representation. |
| `projection_run` | The mechanical array/object projection version, its result, object count and any explicit shape/limit state. |
| `field_observation` | Observed source key/path/type/count information. It is a field guide input, not a DB2 codebook. |
| `response_verification` | Every `NEW`, `CHANGED`, `UNCHANGED`, upstream condition, local failure or not-due outcome. |
| current-state view | Per response unit: latest retained body and latest check/condition. It is a view over immutable records, not a second data store. |

Only conservative indexes are permitted initially: response-unit/time, digest,
run/status and object parent/position. There is no all-fields JSONB index,
full-text index, generic SQL endpoint or inferred relational schema.

### Required DDL contract

The implementation may choose ordinary PostgreSQL names and data types, but it
may not omit or reinterpret these fields:

| Entity | Required fields/control |
| --- | --- |
| `source_form` | Stable form key; route template; `RETAIN_WHOLE`, `PARENT_BACKED` or `UPSTREAM_LIMITATION` treatment; description; parent form where applicable; limitation note where applicable. |
| `response_unit` | Stable unit key; form key; literal `GET` URL; fixed/annual class; later cadence class; URL-list configuration digest. The database rejects a response whose method/URL does not exactly match an active unit. |
| `capture_run` | UUID; run kind; worker/code revision; deployed package revision; configuration digest; start/finish time; status; request/byte counters; declared resource limits and stop reason. |
| `source_response` | UUID; response-unit and run IDs; request start/finish; method/URL; HTTP status; non-secret relevant headers; content type; exact `raw_body bytea`; generated byte length and SHA-256. No update privilege is granted after insert. |
| `response_object` | UUID/identity; parent response ID; zero-based source position; source-slice SHA-256; unchanged object JSONB; canonical JSONB digest; unique parent/position pair. |
| `projection_run` | Parent response ID; parser revision; observed response shape; start/finish; object count; result/limit/rejection reason. |
| `field_observation` | Parent projection; observed JSON path/key; type; occurrence/null counts. It records observation only. |
| `response_verification` | Unit/run IDs; check time; `NEW`, `CHANGED`, `UNCHANGED`, `UPSTREAM_CONDITION`, `LOCAL_FAILURE` or `NOT_DUE`; linked retained response where one exists; HTTP/local condition and plain-language detail. |

The production migration must create restrictive grants: the worker can insert
the declared capture/projection/verification rows but cannot alter old raw
responses; public and application roles receive no DB1 table access. The
direct database assurance query uses a separate owner/read-only audit path,
not the application.

### Source shape rule

| Observed response | DB1 action |
| --- | --- |
| Top-level array of objects | Retain exact raw bytes, then store each unchanged object as one `response_object` row. |
| Top-level object | Retain exact raw bytes and store the whole object as one source object. |
| Valid JSON availability/error message | Retain the raw bytes and record the named upstream condition. Create no invented data objects. |
| HTTP error with returned body | Retain received bytes where safely obtained and record the HTTP/source condition. |
| Non-JSON, malformed JSON, oversized response or timeout | Record a first-class local/upstream condition. Preserve raw bytes only where they were safely received; never write a payload file. |

Any response shape not covered by the mechanical parser remains retained as raw
PostgreSQL bytes with a visible projection condition. It is not silently
dropped, transformed, or turned into a semantic absence claim.

## 6. Resource and run contract

The passing A4 proof is the direct evidence for the following conservative
initial limits:

| Control | Initial value | Reason |
| --- | --- | --- |
| DB1 worker | One request at a time | Prevents concurrent large bodies from recreating the memory failure. This is 117 bounded requests, not an ID crawl. |
| Worker memory | 768 MiB | A4 processed 150 MiB with measured peak RSS of about 547 MiB. |
| PostgreSQL memory | Existing isolated 2 GiB service ceiling | Unchanged infrastructure boundary; no host-wide increase. |
| Response byte ceiling | 150 MiB | A4 passed at exactly this size; a larger response is recorded as a named local limit rather than processed unsafely. |
| Per-request timeout | 3 minutes | The old package’s known high-volume request allowance, retained as a hard stop rather than a promise of normal duration. |
| Baseline run duration ceiling | 3 hours | Prevents an unnoticed stalled run. A stopped unit is visibly recorded; it is not retried or skipped. |
| Baseline transfer ceiling | 20 GiB | Above the theoretical 117 × 150 MiB upper bound, while below the available project-host storage margin. |
| Retries during baseline | None | Keeps the approved source boundary exactly 117 requests. |

The target is a predictable single bounded run, not maximum throughput.
Completion time is deliberately not promised: it depends on the source's live
response time and body sizes. The previous multi-hour failure was caused by
an unbounded record crawl and whole-document conversion, neither of which is
present here.

## 7. Three execution gates

### Gate 1 — production schema proof (no source action)

Install the new schema and worker, then run the same 150 MiB synthetic proof
against the production `db1` tables. It must prove raw byte/digest retention,
2,399 object rows, continuous positions, object digests, no filesystem payload
and successful exit inside the stated worker limit.

If it fails, stop. The DB1 database remains empty, no Scottish Parliament
request is made, and the failure is documented.

### Gate 2 — one 117-request baseline

Only after Gate 1 passes, seed the approved 64 forms and 117 literal response
units from a checked-in registry whose URL-list digest is tested against the
matrix. Run the worker once, serially.

Each unit must result in exactly one visible event: retained response,
upstream condition or local condition. A source failure does not halt unrelated
remaining units, but the worker never retries, expands scope, or manufactures
missing records. A hard run/byte limit stops subsequent units and records them
as not attempted; it does not make a completeness claim.

### Gate 3 — direct database assurance

No frontend is used for acceptance. Direct PostgreSQL queries must establish:

1. 64 source forms and 117 literal response units with the matrix URL digest;
2. one outcome for every attempted unit, and a clear state for any unattempted
   unit if a hard run limit stopped the process;
3. for every retained response: URL, timestamps, status, raw bytes, byte
   length, SHA-256, capture run and projection result;
4. for every projected response: object count, continuous source positions and
   source-object digest lineage;
5. no whole-response JSONB column and no DB1 raw payload outside PostgreSQL;
6. every parent-backed/upstream-limited form tied to its named parent or
   limitation treatment; and
7. PostgreSQL, API and web service health before and after the run.

The resulting report may say only what these checks prove within the stated
capture window. It cannot say DB1 is routinely current, fully reconciled,
publicly releasable or a completed researcher portal.

## 8. What happens after a successful baseline

The next package—not this one—will design and approve routine operation:

- daily checks for the 29 fixed responses and four current-year annual
  responses;
- weekly checks for the 84 historical annual responses;
- a PostgreSQL advisory lock so runs never overlap;
- changed/unchanged/source-condition handling on the same matrix;
- health reporting and alerting;
- encrypted off-VPS backup and isolated restore test; and
- source-structure drift reporting.

Those are essential for a robust long-term Database mirror, but keeping them
out of the initial baseline prevents a scheduler or operational tooling from
obscuring whether the PostgreSQL mirror has first been built correctly.

## 9. Explicit exclusions

This package does not permit:

- a request not in the 117 literal URL list;
- a request derived from an ID, year or value inside a response;
- a per-endpoint manual ingestion process;
- source-field renaming, type conversion, joins, variables or semantic
  definitions;
- a raw JSON file, cache or staging payload outside PostgreSQL;
- database access through the private-beta application; or
- a portal, download format, chart, snippet or researcher UX build.

## 10. Approval statement

Approve DEC-0125 only if you approve all of the following together:

1. deletion of the isolated project's non-baseline partial `db1` schema;
2. the production lossless-object PostgreSQL schema;
3. the exact 117-request, no-retry baseline boundary and limits above; and
4. the three pass/fail gates and their direct-SQL acceptance evidence.

Approval would allow the implementation to proceed through Gates 1–3 without
separate permission for each ordinary URL. It would not authorise routine
updates, a scheduler, any frontend work, DB2 or source-scope expansion.
