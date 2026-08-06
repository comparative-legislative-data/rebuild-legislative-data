# GB-SCT DB1 A6 Gate A source-free control result

**Status:** `PASS — source-free backend controls; timers remain disabled`  
**Date:** 6 August 2026  
**Authorising decision:** DEC-0126, Gate A  
**Scope:** the isolated `cld_gb_sct_db1` PostgreSQL service and project-owned
DB1 worker paths only. No Scottish Parliament request was made.

## What was tested

1. An additive assurance schema was applied. It records reconciliation runs,
   raw structural profiles and schema-drift events without changing any
   retained Scottish Parliament bytes or the 117-unit registry.
2. The worker completed a source-free run under both system-level `flock` and
   a PostgreSQL advisory lock.
3. A separately held PostgreSQL lock produced a recorded `BLOCKED` outcome;
   it did not start a competing run.
4. A test-only synthetic response unit created one visible synthetic
   field-profile drift event. It is explicitly excluded from production-source
   totals and made no network request.
5. The direct PostgreSQL health report checked the retained baseline and the
   public project services remained active.

## Direct PostgreSQL observations

| Check | Observed result |
| --- | --- |
| Approved source forms / response units | 64 / 117 |
| Daily / weekly due units | 33 / 84 |
| Non-synthetic retained raw responses | 117 |
| Units represented in raw storage | 117 |
| Raw byte-length mismatches | 0 |
| Linked projections / source objects | 117 / 4,063,556 |
| Missing raw response or verification state | 0 / 0 |
| Current named upstream conditions | 3 |
| Current local failures | 0 |
| Production schema-drift events | 0 |
| Synthetic drift-test events | 1 |
| Database size at report | 7,578,803,223 bytes |
| Free space on the project volume | 258,811,195,392 bytes |
| Observed worker peak memory | 63,000,576 bytes |

The two `BLOCKED` assurance records are expected lock-test evidence, not
source failures. No daily, weekly or all-unit reconciliation has yet run, so
there is deliberately no currentness claim.

## Contained implementation corrections

The first source-free deployment exposed three worker-packaging faults:
PostgreSQL could not read a migration under the root-owned release directory;
the direct lock test lost its database URL through `sudo`; and the internal
test label did not match the persisted cadence vocabulary. A fourth check
showed the old production schema had no synthetic test unit. Each was corrected
inside the project-owned worker package before any source request. No Scottish
Parliament raw body, proxy, public service, timer or non-project VPS resource
was changed by these corrections.

## Boundary and remaining work

The source-free controls prove that the worker can account for a run, block an
overlap, retain an explicit drift record and report baseline integrity. They do
not prove that the upstream source remains unchanged after the dated A5
baseline.

**What next:** Gate B is already authorised by DEC-0126: one serial,
no-retry reconciliation of the same 117 literal URLs under the existing
three-hour, 150 MiB-per-body, 20 GiB-total, 768 MiB and 35% CPU limits. The
daily and weekly timers remain disabled until its result and direct parity
report pass.
