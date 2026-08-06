# GB-SCT DB1 A6 backend-assurance result

**Status:** `PASS — routine reconciliation enabled; recovery remains separately gated`  
**Date:** 6 August 2026  
**Authorising decision:** DEC-0126, Gates A–E  
**Scope:** the 117 approved literal Scottish Parliament response URLs held by
the isolated `cld_gb_sct_db1` PostgreSQL service. No frontend, DB2, new route,
new year, detail-ID crawl, public exposure or backup destination was added.

## Plain-English result

DB1 now has two distinct pieces of evidence:

1. a dated initial capture of the 117 approved source responses; and
2. a later, complete recheck of those same 117 URLs.

At the recheck time, 114 source responses had exactly the same bytes as the
retained PostgreSQL response. The remaining three were the same explicit
Scottish Parliament source conditions already seen in the initial capture:
the 2006 Committee Official Reports availability message and HTTP 500 responses
for MQA Events and MQA Questions. No response changed, no source body was
silently skipped, and no local failure occurred.

This is a precise parity statement: it applies to the named 117 URLs at the
recorded check time. It is not a claim about unlisted detail routes, future
source changes, semantic completeness or a DB2 dataset.

## Reconciliation evidence

| Check | Result |
| --- | --- |
| Started / finished | 6 August 2026, 20:44:51–21:00:45 UTC |
| Approved response units due / attempted | 117 / 117 |
| Unchanged raw responses | 114 |
| Changed or newly retained raw responses | 0 / 0 |
| Named upstream conditions | 3 |
| Local failures / not attempted | 0 / 0 |
| Production schema-drift events | 0 |
| Source bytes transferred during recheck | 5,914,599,341 |
| Database size immediately after run | 7,578,852,375 bytes |
| Project-volume free space immediately after run | 258,849,361,920 bytes |
| Worker high-water mark | 556,240,896 bytes as reported by Node; systemd measured 482.8 MiB |
| Protected services after run | PostgreSQL main, PostgreSQL bills, isolated DB1 PostgreSQL, API and web all active |

The two memory measures come from different operating-system accounting
methods; both are below the approved 768 MiB worker ceiling. The worker ran
serially and made no retry.

## Controls proved

- the response registry remains 64 selected source forms and 117 non-synthetic
  response units: 33 daily and 84 weekly;
- all 117 retained raw response lengths match their PostgreSQL byte value;
- all 117 response units have retained raw data and a verification state;
- 117 source-object projections retain 4,063,556 linked source objects;
- all production retained responses have a raw field-profile record;
- a PostgreSQL advisory-lock test created a safe recorded `BLOCKED` outcome;
- a synthetic-only structural-drift test created one separate visible test
  event, while production drift remains zero; and
- a synthetic-only local-failure test created one named failure without
  changing any Scottish Parliament response or its current good state.

The detailed source-free control evidence is in the
[Gate A result](GB_SCT_DB1_A6_GATE_A_CONTROL_RESULT_2026-08-06.md).

## Routine schedule

The project-owned timers are enabled but do not run immediately on enablement:

- **Daily:** 03:15 UTC plus up to two minutes' random delay; checks the 29
  fixed collections and four current-year annual responses.
- **Weekly:** Monday 04:15 UTC plus up to two minutes' random delay; checks
  the 84 historic annual responses.

Both use the same locked, serial worker and the same response-unit registry.
The system-level file lock and PostgreSQL advisory lock prevent an overlap.
An unchanged response records a new check without duplicating raw bytes; a
changed response is retained append-only with a field-profile comparison; an
upstream condition or local failure is named rather than hidden.

## Remaining limitation: recovery

There is no approved off-VPS PostgreSQL backup destination or successful
restore test yet. Therefore DB1 has routine parity evidence but is **not yet a
fully recoverable service**. That is a separate owner decision because it
requires a storage location, retention period, encryption/key ownership and
restore target.

No researcher-facing Database mirror portal is authorised until that recovery
gate is passed and a separate portal design is approved.

**What next:** choose the controlled off-VPS backup destination and retention
approach, then authorise one backup-and-isolated-restore package. The frontend
remains out of scope until that backend recovery evidence is complete.
