# DB1 A1 foundation implementation package

**Status:** proposed for owner review — no implementation authority  
**Date:** 6 August 2026  
**Depends on:** DEC-0115 and the proposed
[GB-SCT DB1 response-unit matrix](../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md)

## 1. Purpose and boundary

This package proposes the **A1 design lock and A2 source-free foundation
proof** for DB1. Its job is to prove, using synthetic data only, that the
project can store and query a source response in PostgreSQL correctly. It does
not contact the Scottish Parliament, create a live Database mirror or begin
the 117-unit baseline.

The package is deliberately backend-only. No DB1 route, download, catalogue,
researcher screen or modification of the working Live API catalogue is within
scope.

## 2. Proposed target and containment

- one new, isolated PostgreSQL database and least-privilege DB1 roles in the
  existing project-only PostgreSQL cluster;
- a dedicated DB1 Node/TypeScript worker, separate from the API proxy and web
  application; and
- native systemd only if/when a later operational package is approved. A1/A2
  uses no schedule and creates no source-data service.

The package must preflight the exact project database name, role grants,
loopback listener, disk headroom and non-interference with account/auth and
unrelated VPS services. It stops on any ambiguity; it may not repurpose a
shared database, role, raw-data directory or service.

## 3. Proposed PostgreSQL contract

The implementation must create only the following core facilities:

| Facility | Required behaviour |
| --- | --- |
| `source_form` | Stable, read-only representation of the 64 approved form definitions. |
| `response_unit` | Approved literal capture units only. In A2 it contains synthetic examples; live rows await a later capture decision. |
| `capture_run` | Records trigger, software/configuration revision, bounded scope, start/end and result. |
| `source_response` | Holds `raw_body bytea`, `body_sha256`, byte length, request/provenance metadata and `body_jsonb` for valid JSON. It is the source-data table, not a manifest pointer to files. |
| `response_verification` | Holds every check result, including unchanged bytes and upstream/local conditions. |
| `schema_observation` | Stores a structural fingerprint only; it does not alter or interpret source JSON. |
| `v_current_response_unit` | Exposes latest successful response and latest condition from the immutable tables. |

Source response bytes are append-only. Identical later bytes create a new
verification event rather than another payload row. A failed/upstream response
creates a condition event and never deletes the last retained good source body.

No generic `source_record` extraction table is part of A1/A2. Any later
record-level convenience projection needs its own proposal after the response
anchor is accepted.

## 4. A2 source-free proof

The synthetic test uses a harmless locally generated JSON response and an
artificial large JSON fixture. It must prove all of the following without
network or Scottish Parliament data:

1. one `source_response` row holds original test bytes, SHA-256 and a JSONB
   representation derived from those bytes;
2. direct SQL retrieves both representations and demonstrates a simple JSON
   query, while the digest and byte count agree;
3. a repeated identical input creates only an `UNCHANGED` verification event;
4. a changed input creates a new immutable response row and moves the current
   view; and
5. an availability/error event remains queryable without overwriting the last
   successful response.

The large-fixture proof must measure peak worker memory, PostgreSQL memory,
disk write volume and elapsed time. It must show that no raw payload has been
written outside PostgreSQL. Those measurements set—not merely suggest—the
later live run's memory, CPU, timeout, byte and transfer ceilings.

## 5. Direct acceptance tests

The A2 result must include executable SQL or an equivalent checked-in test that
answers these questions without a UI:

| Product question | Evidence required |
| --- | --- |
| Is source data in PostgreSQL? | `SELECT` returns the synthetic raw `bytea` and its JSONB copy from `source_response`; no filesystem path is part of the result. |
| Can the bytes be checked? | SQL/test recomputes SHA-256 and compares it to the stored digest and byte length. |
| Is JSON queryable? | A bounded JSONB expression returns the expected synthetic field. |
| Is history preserved? | The changed-body test returns two source-response versions and one current view. |
| Are non-data conditions honest? | The latest condition can be `UPSTREAM_CONDITION` while the previous good response remains retrievable. |
| Is scope enforced? | A test attempt for a non-registry response unit is rejected before any network operation. |

Failure of any one test is an A2 failure. It cannot be repaired by a frontend
display or a manual database edit.

## 6. What this package deliberately does not do

- no Scottish Parliament request, capture or retention;
- no live response-unit rows, baseline ingestion or schedule;
- no raw JSON files, object store or cache as a DB1 source-data store;
- no inferred detail IDs, pagination expansion or dynamic request building;
- no DB2 variables, typed semantic mappings, field normalisation or joins; and
- no researcher-facing frontend or download feature.

## 7. Preconditions for later A3 source ingestion

Before a new A3 source-ingestion package can be approved, all of the following
must exist:

1. A2 passes every direct PostgreSQL test above.
2. The owner approves a final response-unit matrix with a numerical request and
   volume bound. The current 31 detail/filter gaps must have an explicit policy
   decision; they cannot be left implicit.
3. Route-level handling/retention conditions are reconciled with the approved
   DB1 product scope for every unit being captured.
4. The measured source-free result supplies concrete systemd/worker resource
   ceilings, scheduling class, backup target and alert condition.
5. A3 names the exact isolated target, rollback path, run sequence and whole
   matrix acceptance report.

## 8. Owner decision requested

Approve, amend or reject this A1/A2 package. Approval would authorise only the
isolated PostgreSQL foundation and synthetic proof described above. It would
not authorise source access, DB1 baseline ingestion, a cron/systemd schedule,
researcher access or deployment beyond the isolated proof target.
