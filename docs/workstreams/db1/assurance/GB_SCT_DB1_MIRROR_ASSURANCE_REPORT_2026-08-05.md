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
| Scope assurance | Controlled register established | The [expected scope register](GB_SCT_DB1_EXPECTED_SCOPE_REGISTER_2026-08-05.md) maps all 64 approved source forms to `RETAINED` or `FUTURE_CAPTURE`, and the [update-control register](GB_SCT_DB1_ROUTE_WINDOW_UPDATE_CONTROL_REGISTER_2026-08-05.md) declares the 113 current route/window rules. This establishes intended scope control, not source parity. |
| Target identification | Pass after correction | `cld_gb_sct` is the valid isolated PostgreSQL cluster/service name; `cld_gb_sct_db1` is the DB1 database. The initial audit probe used the former as a database name and stopped safely. A repository scan found no stale deployment database selector requiring remediation. |

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

Before a content-integrity or live-parity audit, owner acceptance is required
for the new expected-scope and update-control registers. They do not alter
captures, objects, database rows, timers or services.
