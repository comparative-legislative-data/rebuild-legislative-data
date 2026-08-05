# GB-SCT DB1 Official Reports 2025 cohort — DEC-0098

**Status:** `APPROVED — IMPLEMENTATION IN PROGRESS`
**Decision requested:** DEC-0098  
**Date:** 4 August 2026

## Decision in brief

Approve one deliberately bounded DB1 cohort for the two 2025 annual Official
Reports source responses:

- Committee Official Report: `/api/orscommitteemeeting?year=2025`
- Plenary Official Report: `/api/orsplenarymeeting?year=2025`

The cohort would create two separately named, source-preserving DB1 releases.
It would retain the literal source bytes and their technical lineage, not a
claim about bills, stages, amendments, speakers, committees, contributions, or
any other analytical relationship. DB2 is not a purpose or dependency of this
work.

The owner approved implementation on 4 August 2026. The source-free streaming
proof is recorded in the [implementation packet](GB_SCT_DB1_OFFICIAL_REPORTS_2025_IMPLEMENTATION_PACKET_DEC0098.md).
No live source request, capture, database write, deployment, schedule, or
interface change has occurred at the time of that record.

## Why this is the right next bounded cohort

The current DB1 coverage is recorded in the [coverage snapshot](../../../../workstreams/db1/CURRENT_COVERAGE_AND_OPERATIONS.md).
The two annual Official Reports are the principal remaining bounded API sources
for parliamentary proceedings. They are also materially different from the
small collections already retained:

| Source | Completed reconnaissance evidence | D19 implication |
| --- | --- | --- |
| Committee Official Report, 2025 | 150,496,374 bytes; 82,017 observed array elements | Treat as a large annual raw object; one source at a time. |
| Plenary Official Report, 2025 | 123,955,194 bytes; 31,843 observed array elements | Treat as a separate large annual raw object; one source at a time. |

The observed responses have no pagination field or link. That is evidence about
the observed 2025 response, not a general API-contract claim. The full evidence
and its limits are in the [high-volume route audit](../../../data/gb-sct/reconnaissance/GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md)
and the [high-volume operational register](../../../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md).

## Proposed DB1 operating shape

If approved, D19 would use a single serial runner and two literal, closed
source URLs. There would be no year field, identifier input, generic DB1 query,
or route discovery mechanism.

For each named URL, the runner must:

1. make one source request within an explicit route budget;
2. stream the response to controlled temporary storage while computing its
   digest, rather than retaining the complete response in application memory;
3. atomically retain the unchanged source bytes only after the byte count,
   digest, and source response checks pass;
4. create a manifest, capture-run, reconciliation observation, and a
   source-position-only projection; and
5. preserve a failed attempt as a failure record without converting it into a
   successful or partial release.

The candidate initial operating limits are a **192 MiB / 10 minute** cap for
Committee and **160 MiB / 10 minute** for Plenary. These are deliberately above
the observed 2025 bodies but finite. A source-free test using equivalent-sized
synthetic bytes must prove the streaming, cap, cancellation, temporary-file
cleanup, and failure-record behaviour before either live source is requested.

The two sources run serially. A failed Committee request must not prevent the
separate Plenary source from receiving its own recorded outcome, and neither
may overlap another D19 source request.

## Update and reconciliation model

An initial capture is only a dated baseline. It is not evidence that the source
will never be corrected.

After a successful initial release, D19 would re-request each same literal 2025
URL **weekly**, serially, and compare the new raw digest and observed structural
signature with the last successful release. The resulting state is `UNCHANGED`,
`CHANGED`, `BLOCKED_BY_SOURCE_DRIFT`, or a recorded failure. A changed body may
be retained as a new raw object and manifest; a structural drift blocks the
reader update pending an explicit decision. No schedule may silently skip a
previously successful route and call that a reconciliation check.

This last condition records a current DB1 legacy issue. D18's deployed weekly
timer is presently a **failure-retry schedule**: its code skips a source-year
that already has a successful observation. It therefore is not recurring
comparison of successful 2011–2025 releases, despite older D18 wording that
described it as weekly reconciliation. D19 must not copy that behaviour. A
separate, small correction decision is needed to make D18's scheduled status
and its documentation accurate; it is outside this D19 capture scope.

## Private researcher access after a successful cohort

D19's front-end presentation should stay within the established DB1 catalogue
shape: a compact expandable Official Reports group, then two fixed source-year
badges. It should make the following visible before a record is opened:

- exact official source URL and source family;
- captured-at time, byte length, digest, manifest/release identifier, and the
  most recent reconciliation state;
- that the object is source-preserved and that source position is technical
  lineage only;
- observed top-level and nested field names as dated structural evidence, not
  a DB2 codebook; and
- the access limit: private beta, fixed 2025 routes, server-side pagination of
  the retained projection, not a browser dump of a 150 MB raw object.

The retained raw objects remain the integrity record. The reader must use
volume-appropriate server-side paging and field/structure summaries. It must
not offer an unbounded raw-object route, generic SQL/query interface, download,
public access, or a transformed canonical dataset. Better researcher-oriented
access choices (named partial extracts, full downloads, code snippets, or a
data dictionary) require their own later release and handling decision.

## Explicit exclusions

- No bill, bill-stage, amendment, voting, committee, person, speech, or
  contribution interpretation.
- No claim that a report is complete, current, exhaustive, or correctly linked
  to another source.
- No extraction of Tier 1/2 variables and no DB2 work.
- No document-based bill, amendment, minutes, or other non-API collection.
- No new proxy route or alteration of proxy behaviour.
- No generic parameter, raw-object, download, public, or research-release
  functionality.
- No historic expansion beyond these two 2025 URLs without another decision.

## Acceptance criteria for a later implementation

1. The two literal 2025 URLs, and no other Official Reports URL, are called.
2. The pre-source synthetic test passes the declared caps and proves no
   retained temporary file after cancellation or failure.
3. Each successful release has immutable source bytes, digest, byte count,
   content type, source URL, retrieval time, manifest, reconciliation state,
   and source-position projection; projection rejects are zero or the cohort is
   explicitly reported as not released.
4. The source requests run serially, with failures separately recorded and no
   silent retry or deletion of prior successful bytes.
5. One later weekly run re-fetches both successful sources and records its
   comparison outcome. That outcome is reported separately from initial capture.
6. The private UI exposes only the two fixed DB1 reader paths, has no year/ID
   input, and states the provenance and limits above.
7. Proxy and DB1 are tested as separate data pipes: the proxy remains
   no-retention live access; D19 reads only DB1 retained material.

## Decision requested

Approve DEC-0098 to implement the two-source D19 cohort on the above basis,
including the pre-source synthetic streaming proof and then the limited live
capture. This approval would not approve a D18 remediation, expansion to other
years, DB2, or any researcher download/query release.

## What next

If approved, prepare the smallest implementation packet: the two closed route
definitions, a streaming-capture proof, migration and reader contract, one
serial scheduled service, and an operator runbook. Run the synthetic proof
first; report its result before any live Official Reports source action.
