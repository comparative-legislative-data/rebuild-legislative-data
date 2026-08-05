# DB1 availability audit method

**Decision:** DEC-0101, Stage C
**Status:** `IMPLEMENTED — DATABASE AND MANIFEST EVIDENCE ONLY`
**Date:** 5 August 2026

## Purpose

This audit makes the condition of a retained DB1 source window visible without
confusing a source response with a claim about historical reality. It is not a
live Scottish Parliament check and does not create, change or overwrite a
capture.

The authenticated private endpoint is:

```text
GET /api/db1/gb-sct/research/availability-audit
```

It returns the current DB1 evidence matrix, grouped by the retained source
route/window and accompanied by the manifest/capture and reconciliation
evidence used to describe it.

## Method

The implementation reads only existing DB1 records:

1. the latest successful retained manifest for each declared source route;
2. the linked raw-object metadata (digest, byte length, content type and
   relative retained-object reference);
3. any passing source-object projection and its precomputed field profile; and
4. the latest recorded reconciliation observation.

It does not call `data.parliament.scot`, invoke a capture service, add a timer,
change an existing schedule or mutate raw bytes. The API labels its method
`DATABASE_AND_MANIFEST_ONLY_V1`.

## Conditions reported

| Condition | DB1 evidence meaning | Must not be read as |
| --- | --- | --- |
| `RECORDS_RETURNED` | The named retained response has a passing source-object projection containing records. | Proof that all source records, years or meanings are complete/current. |
| `EMPTY_RESPONSE` | A retained response had a valid zero-record source-object projection. | Proof that the relevant historical phenomenon did not exist. |
| `UPSTREAM_AVAILABILITY_MESSAGE` | The retained source response itself supplied an availability/maintenance message. | An empty DB1 dataset, a projection failure or a settled historical gap. |
| `UPSTREAM_ERROR_RESPONSE` | A retained response evidences a substantive upstream error. | A DB1 claim about source completeness. |
| `NOT_YET_ASSESSED` | Raw retained evidence exists, but DB1 has not established a suitable object-record projection. | No data, no source response, or a semantic diagnosis. |

The known 2006 Committee Official Reports window is reported as
`UPSTREAM_AVAILABILITY_MESSAGE`. Its retained response says “Data is presently
unavailable”. The raw response remains available through DB1, and a later live
recheck requires DEC-0101 Stage D authority.

## QA use and future portal input

The current private QA surface shows the relevant condition on each
source-year/window release. It allows the team to inspect the exact retained
response, bounded record browsing where structurally suitable, field-profile
evidence and capture metadata. It is not a researcher-product acceptance.

The audit endpoint is a machine-readable input to Backend Assurance and the
later Research Portal capability contract. It is not a public release, generic
database interface, source-update service or DB2 availability assessment.

## Review and change control

Review this method whenever a new retained source form is added, an observed
response shape is not representable by the present classifications, a source
availability message changes, or before any Stage D live recheck/schedule
proposal. A Stage D capture must create a new manifest and preserve this
earlier evidence; it must never overwrite it.
