# GB-SCT DB1 Mirror Assurance Report — 5 August 2026

**Decision:** DEC-0108  
**Method:** metadata-only, no-source-body, no-mutation audit  
**Outcome:** `CHANGES_REQUIRED`

## What was audited

The audit confirmed the project target as PostgreSQL database
`cld_gb_sct_db1`, schema `db1`, with its raw-object root at
`/srv/cld-gb-sct/raw/db1`. Every database query ran inside a read-only
transaction. Raw files were checked only for contained-path and file-existence
metadata; no response was opened or rehashed. The project API, web and
PostgreSQL services, plus 17 DB1 timers, were inspected for status only.

## Findings

| Test | Result | Evidence |
| --- | --- | --- |
| Registered route coverage | Pass for the current operational registry | 113 GB-SCT source routes; none lacked a successful source capture. |
| Manifest/object lineage | Pass | 175 successful manifests refer to 114 distinct retained source objects; 0 missing object references, 0 content-type/byte-length mismatches, 0 unsafe paths, and 0 missing files. Reuse of a source object across repeated captures is expected deduplication. |
| Projection boundary | Pass, with correct raw-primary boundary | 114 passing source-capture projection builds/profiles for 114 distinct source objects. The 61 manifests without their own new build reuse an identical raw-object projection rather than losing a projection state. |
| Reconciliation linkage | Pass | Every captured route has a reconciliation observation; no route/manifest reference orphan was found. Latest states: 86 `INITIAL`, 26 `UNCHANGED`, 1 `CHANGED`. |
| Exception preservation | Pass | The 2006 Committee Official Reports response remains retained and classified as an upstream availability condition, rather than silently omitted or treated as empty. |
| Update controls | Partial | 17 enabled timers are waiting. Most daily timers ran successfully on 5 August; D18 is weekly and D19 is enabled but had not yet run. The metadata does not itself supply a complete route/window schedule matrix or prove that all initial states will be rechecked. |
| Scope assurance | Gap | The operational registry contains 113 routes, but the repository lacks one controlled expected-DB1 inventory that maps the approved 64 source forms, inclusion/exclusion decisions and annual windows to those routes. The current registry therefore cannot by itself prove no intended DB1 item is missing. |
| Operational documentation | Gap | Some generic deployment scripts still refer to nonexistent database `cld_gb_sct`; the live DB1 target is `cld_gb_sct_db1`. This did not affect the audited live target, but must be corrected under a separate scoped change. |

## What the audit establishes

As at the audit time, the existing DB1 metadata consistently links each
registered and successfully captured GB-SCT route to its capture/manifest and
to a contained retained raw object. The raw-object reference layer, manifest
metadata and current projection metadata are internally coherent. The project
also retains reconciliation history rather than rewriting it.

## What it does not establish

- that the 113 routes are the complete intended DB1 scope;
- that retained bytes still match their recorded digests (fresh rehashing was
  outside this audit);
- that DB1 matches the live Scottish Parliament API at any date;
- that every initial capture has a recurring reconciliation control;
- that every timer will succeed on its next execution; or
- that CSV, JSONL, Parquet, bulk archive, generic query or public access exist.

## Required next decision

Before a content-integrity or live-parity audit, approve a small Backend
Assurance correction package to: create the expected DB1 scope register;
classify every route/window's reconciliation cadence and review trigger;
and repair stale operational documentation. It must not alter captures,
objects, database rows, timers or services unless separately authorised.
