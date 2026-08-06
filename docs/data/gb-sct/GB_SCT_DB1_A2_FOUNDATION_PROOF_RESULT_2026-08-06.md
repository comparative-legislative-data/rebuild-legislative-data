# GB-SCT DB1 A2 source-free foundation proof

**Status:** PASS — synthetic proof only; no Scottish Parliament data retained  
**Date:** 6 August 2026  
**Authority:** DEC-0122, approved by the project owner for A1/A2 only

## What was proved

This is a small backend proof, not the Database mirror baseline. It used only
locally generated test JSON. It made no Scottish Parliament request, created
no schedule, changed no public/frontend feature and retained no Scottish
Parliament response.

The isolated `cld_gb_sct_db1` PostgreSQL database now holds the A2 schema and
synthetic test history. A new limited worker role can insert source-response
rows but cannot change the schema or delete/update a stored response.

## Direct acceptance evidence

| Required check | Result |
| --- | --- |
| Raw source bytes live in PostgreSQL | PASS — `source_response.raw_body` returned the original synthetic JSON bytes. |
| Queryable JSON is in the same row | PASS — `source_response.body_jsonb` returned `records[0].key = alpha`. |
| Digest and byte count agree | PASS — direct SQL recomputed SHA-256 and byte length, both equal to stored values. |
| Repeated bytes do not duplicate a body | PASS — the worker recorded an `UNCHANGED` event rather than a duplicate response row. |
| Changed bytes preserve history | PASS — two changed versions were retained for each synthetic response unit. |
| An error does not erase the last good body | PASS — the current view shows a synthetic `UPSTREAM_CONDITION` (503) while the last successful response remains retrievable. |
| Non-registry request is refused before any network step | PASS — the worker's attempt for `a2.not-registered` was rejected by the database foreign-key guard; the worker has no HTTP code. |
| No payload file outside PostgreSQL | PASS — `/srv/cld-gb-sct/db1` contains only the checked-in SQL/worker code; a scoped file check returned no non-code payload file. |

The stale staging material from the withdrawn DB1 build was also found during
pre-flight and removed before the proof: 83 project-owned `db1-*` or
`fullscope-*` folders/logs. Their contents were not opened. The live API and
web services remained active throughout.

## Measured synthetic large-response result

The worker generated a 2,509,817-byte JSON fixture in memory and stored it in
PostgreSQL. The successful proof run took 22,229 ms, reported a worker peak RSS
of 94,162,944 bytes, increased the database size by 188,416 bytes and produced
212,376 bytes of PostgreSQL write-ahead log. The isolated PostgreSQL cluster's
observed RSS was 337,052 KiB before and 337,056 KiB after the run.

These are planning measurements only. They are not a source-data volume budget
and do not authorise a live capture or schedule.

## Honest execution notes

Two earlier synthetic-only attempts are retained in `capture_run` as `FAIL`:
one stopped before any source-response row because of a test credential URL,
and one stopped after synthetic inserts because the limited worker correctly
lacked permission to inspect PostgreSQL internal memory. Neither contacted a
source. The final run is `PASS`; PostgreSQL therefore retains two failed test
run records and one passing record rather than hiding the corrections.

## Boundary after this proof

DB1 is **not** yet a live Database mirror. It contains no Scottish Parliament
data, no 117-unit baseline, no scheduler, no backup/restore proof and no
research portal. The next step needs a separate owner-approved A3 package for
the named live response-unit matrix, operational ceilings, source conditions,
reconciliation and rollback.
