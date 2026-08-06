# GB-SCT DB1 backend-assurance package

**Status:** approved — execution opened (owner instruction, 6 August 2026)

**Authorising decision:** DEC-0126

**Builds on:** the [A5 production baseline result](../data/gb-sct/GB_SCT_DB1_A5_INITIAL_BASELINE_RESULT_2026-08-06.md), the approved
[117-unit matrix](../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md), and DEC-0125.

## 1. Purpose

DB1 now has a dated PostgreSQL baseline. This package would make it a robust
backend service before any researcher portal is designed. It does **not** add a
frontend, DB2 variables, public downloads, or new source forms.

The aim is narrow and testable: for each approved source unit, prove what DB1
last checked, what the source returned, whether the bytes were unchanged or
changed, and whether an exception was upstream or local.

## 2. Fixed scope

The source boundary remains exactly the existing 117 literal URLs:

- 29 fixed collection responses;
- four current-year annual responses, checked daily; and
- 84 historic annual responses, checked weekly.

The 25 parent-backed and six upstream-limited forms remain visible metadata;
they generate no new request. No ID crawl, route discovery, new year or
pagination logic is permitted.

## 3. The simple operating model

1. A scheduled worker takes an exclusive DB1 lock.
2. It reads the approved PostgreSQL registry, not a list discovered from source
   data.
3. It checks each due literal URL once, serially.
4. It writes the exact received bytes and retrieval metadata to PostgreSQL.
5. If the bytes match an existing retained response for that URL, it records an
   `UNCHANGED` verification without duplicating the body. If they differ, it
   appends a new raw response and creates its source-object projection.
6. It records `UPSTREAM_CONDITION` for an upstream availability/error response
   and `LOCAL_FAILURE` for a timeout, body limit, transport or local error.
7. It produces one small PostgreSQL health summary. It never makes a current,
   complete or parity claim by implication.

This is a database mirror of the approved source responses, not a database
translation of their meanings. The raw body is the authoritative retained
source record; object rows are a regenerable operational projection.

## 4. Required implementation controls

### 4.1 No-overlap and resource limits

- use both a system-level `flock` and a PostgreSQL advisory lock;
- retain the current single-worker, 768 MiB memory and 35% CPU ceiling;
- retain the existing 150 MiB per-body, 20 GiB per-run transfer and three-hour
  run limits unless a separate owner decision changes them;
- use the proven chunked PostgreSQL projection path for all large responses;
- record a controlled `BLOCKED` outcome if a limit is reached; do not retry in
  the same run; and
- ensure a delayed weekly run prevents, rather than overlaps with, a daily run.

### 4.2 Parity and change evidence

For every due unit, the worker must record:

- the source URL, start/end time, HTTP status, selected headers, raw byte
  length and SHA-256;
- the exact approved-registry digest and deployed code revision;
- whether the check was unchanged, changed, an upstream condition or local
  failure;
- a continuous per-unit `last successful check` state; and
- a run-level completeness total: due, attempted, retained, unchanged,
  changed, conditions, local failures and not-attempted.

An unchanged hash proves equivalence only for that URL at that stated check.
A changed hash proves that the source differed; DB1 retains both observed byte
sequences and does not guess why it changed.

### 4.3 Schema-drift evidence

For each changed parseable response, compare the new source-object field
profile with the prior retained profile: top-level shape, field names and JSON
types. Record `SCHEMA_DRIFT` with a human-readable added/removed/type-changed
summary. Drift blocks affected future DB2 work and must be visible in health
reports; it does not delete or rewrite raw DB1 data.

### 4.4 Health and recovery evidence

Each run must leave a compact health record containing:

- run status, duration, lock result and code/configuration revision;
- due/attempted/outcome totals and named exceptional units;
- DB1 database size, free VPS space, worker peak memory and latest successful
  daily/weekly check;
- raw-response and projection linkage/integrity totals; and
- backup age and the latest successful restore-test date.

The first implementation may publish this only through a restricted direct SQL
report. A superuser screen and email notification are intentionally deferred;
they are presentation/delivery work, not a prerequisite for truthful backend
evidence.

## 5. Backup and restore gate

DB1 is not robust enough for a future researcher portal until it has an
off-VPS PostgreSQL backup and one successful isolated restore test. The actual
destination, retention period, encryption/key ownership and storage budget are
owner choices not currently defined in the repository.

This package therefore proposes two gates:

1. implement and test the update/reconciliation worker and health record; and
2. **do not declare backend assurance complete or enable a researcher portal**
   until the owner approves a backup destination and a restore test passes.

No raw source response is to be exported as an ad hoc VPS file. A PostgreSQL
backup is a controlled recovery artefact, with its own manifest and retention
record.

## 6. Acceptance sequence

| Gate | Test | Pass criterion |
| --- | --- | --- |
| A | Local/source-free worker test | Locking, limits, run records and health summary behave without source activity. |
| B | First controlled assurance run | The same 117 literal units are checked once; every unit has a named outcome; no new form or URL is requested. |
| C | Direct PostgreSQL parity report | Each retained response has provenance and byte/hash integrity; every changed/unchanged/condition state is linked to its run. |
| D | Drift test | A synthetic prior/current field-profile difference becomes a visible drift event without changing raw data. |
| E | Failure/overlap test | A held lock produces a safe blocked result; a forced local failure is named and does not corrupt a prior good response. |
| F | Backup/restore test | A chosen off-VPS backup restores to an isolated database and passes row/hash/provenance totals. |

Only Gates A–E are proposed for implementation under DEC-0126. Gate F needs
the owner’s separate backup-destination decision.

## 7. Explicit exclusions

- no Database mirror portal, downloads, researcher query API or account work;
- no DB2 variables, charts, datasets or semantic field mapping;
- no new API endpoint, query parameter, year or detail ID;
- no deletion of historical retained DB1 responses;
- no shared-VPS service, firewall, public-exposure or package change; and
- no claim that DB1 is current outside a successful named check.

## 8. Approval requested

Approve DEC-0126 only if you approve the bounded backend work in Gates A–E:
the isolated DB1 schema additions needed for run/health/drift evidence, one
scheduled daily and weekly worker, one controlled 117-unit assurance run, and
the direct PostgreSQL acceptance report. Backup destination and restore remain
an explicit later decision.
