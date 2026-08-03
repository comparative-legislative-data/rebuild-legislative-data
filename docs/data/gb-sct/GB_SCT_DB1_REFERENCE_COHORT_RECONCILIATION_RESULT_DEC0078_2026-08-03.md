# GB-SCT DB1 Reference-Cohort Reconciliation Result — DEC-0078

**Status:** Initial cycle passed — first scheduled-cycle verification pending
**Completed to date:** 3 August 2026
**Authority:** DEC-0078, owner-approved 3 August 2026

## Outcome to date

D4A is deployed on the isolated project DB1 target. It made exactly the three
approved initial no-query requests, each once and serially, and retained their
unaltered responses as `RESTRICTED_PROJECT` DB1 raw objects with append-only
manifest observations. No response body or source value is reproduced here.

| Fixed route | Initial reconciliation state | Manifest ID | Raw SHA-256 | Bytes | Observed (UTC) |
| --- | --- | --- | --- | ---: | --- |
| `gb-sct.bill-types.collection` | `UNCHANGED` against the D2 raw digest | `01e15d40-55a2-4487-be8f-feba977fa129` | `fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b` | 189 | 2026-08-03 18:32:42 |
| `gb-sct.bill-stage-types.collection` | `INITIAL` | `efe4ec6f-5bd7-49ae-9260-0a01b619f921` | `2f72d044faa8668ebb3bcd759e144fe93d8fe926029906a2e79041ff03e78e9d` | 1,993 | 2026-08-03 18:32:47 |
| `gb-sct.sessions.collection` | `INITIAL` | `ada2b71d-d5b7-4c1f-b9e6-2d2432781123` | `8dc47832f3331e4b0f3d4e44241e746c007ff0cc25c69365724152368c422249` | 650 | 2026-08-03 18:32:52 |

The cycle state is `SUCCEEDED`, with three observations. `INITIAL` means no
prior D4A observation existed for that fixed route; it is deliberately not
described as changed. `UNCHANGED` means only that the declared Bill Types
comparison returned the same raw digest as D2. It does not assert upstream
freshness, completeness, or absence of other changes.

## Implementation and containment

The runner accepts only the three fixed HTTPS paths in DEC-0078, without a
query, redirect, retry, generic URL, or input-selected schedule. It uses an
append-only cycle/observation record, digest-addressed raw storage, a
non-overlap PostgreSQL advisory lock, and structural-signature comparison. A
later structural difference is recorded as `BLOCKED_BY_SOURCE_DRIFT`; it is
not transformed or silently accepted for projection/interface use.

A dedicated project DB1 writer role can read/write only the route/capture/raw
metadata and reconciliation tables it needs. It cannot select
`db1.projection_records`; it has no application/API route and no DB2
capability. The existing D3 reader role, beta preview, proxy pipe, API/web
services, listeners, and Nginx configuration were not changed.

The project-owned `cld-gb-sct-db1-d4a.timer` is enabled and active. Its first
scheduled run is due at **2026-08-04 03:17 UTC**. The timer is enabled only
because the initial cycle succeeded. A non-successful initial cycle would have
left retained evidence but no timer.

## Verification completed

- Local build, 20 tests, fixed-capability scan, deterministic package, and
  documentation links passed before target work.
- Target preflight confirmed the isolated DB1 cluster, project raw path,
  existing API/web services, and absence of a pre-existing D4A unit/timer.
- Target deployment repeated the build/tests/capability/package checks on the
  project runtime, ran the D4 migration, installed only the project D4A
  service/timer and its DB1-writer secret, and made the initial cycle.
- Metadata-only postflight confirmed the `SUCCEEDED` cycle, exactly three
  observations and fixed route IDs, inactive access to `projection_records`
  for the D4A role, active timer/API/web services, and unchanged valid Nginx
  syntax.

## Remaining boundary and next gate

D4A has not yet proved recurrence. It remains open until the first independent
03:17 UTC scheduled cycle is recorded and compared. No user-facing DB1
catalogue, additional projection, raw-object view/download, generic query,
DB2 variable, chart, public data access, or wider route is created or
authorised.

## What next

**No new approval required within DEC-0078:** inspect and record the first
scheduled-cycle result after 03:17 UTC on 4 August 2026. If it passes, close
D4A and prepare (but do not implement) a separately approved D4B
reference-cohort projection/catalogue proposal.

## Related records

- [D4A proposal — DEC-0078](GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_PROPOSAL_DEC0078.md)
- [D3 result — DEC-0077](GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
