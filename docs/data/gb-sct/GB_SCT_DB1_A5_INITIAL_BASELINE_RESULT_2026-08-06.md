# GB-SCT DB1 A5 production baseline result

**Status:** `PASS — INITIAL BASELINE ONLY`

**Date:** 6 August 2026

**Authority:** DEC-0125

**Scope:** one exact, serial, no-retry request to each approved response unit;
the resulting raw source bytes and source-object rows are held in PostgreSQL.

## Plain-English result

DB1 now holds the first dated PostgreSQL baseline for the approved Scottish
Parliament API mirror boundary. Every one of the 117 approved collection or
year-specific URLs has one explicit recorded outcome. The database retained the
exact response body for all 117: 114 were ordinary data responses and three are
named upstream conditions. Nothing was silently skipped.

This is a dated baseline, not a claim that DB1 is permanently current. No
routine update schedule, reconciliation cycle, researcher-facing query API or
Database mirror portal has been enabled by this result.

## What was stored

| Item | Result |
| --- | --- |
| Approved source forms | 64 (33 whole-response, 25 parent-backed, 6 visible upstream limitations) |
| Approved literal response units | 117 |
| Baseline requests | 117 serial, no retry |
| Retained raw source responses | 117 PostgreSQL `bytea` rows |
| Raw response bytes transferred | 5,914,599,341 (about 5.51 GiB) |
| Queryable unchanged source objects | 4,063,556 PostgreSQL JSONB rows |
| PostgreSQL database size after baseline | about 7.1 GiB |

Each raw response carries its exact approved request URL, request and response
time, HTTP status, selected response headers, byte length and a SHA-256 digest.
Raw bytes are immutable to the restricted worker. The database directly
confirmed that all 117 retained raw bodies match their stored byte length.

## Source conditions retained exactly

| Response unit | What the Scottish Parliament returned | DB1 treatment |
| --- | --- | --- |
| `committee-reports.annual.2006` | HTTP 200 availability message: data presently unavailable | Exact 52-byte response retained; explicitly marked `UPSTREAM_AVAILABILITY_MESSAGE`. |
| `mqa-events.collection` | HTTP 500 | Exact HTML response retained; explicitly marked `HTTP_500`. |
| `mqa-questions.collection` | HTTP 500 | Exact HTML response retained; explicitly marked `HTTP_500`. |

These are source-side conditions, not absent DB1 records. They must remain
visible in any later researcher interface and routine reconciliation report.

## Storage and projection checks

| Check | Result |
| --- | --- |
| Response-unit coverage | PASS — 0 of 117 approved units lacked a recorded baseline outcome. |
| Raw retention | PASS — 117 of 117 source responses held in PostgreSQL; no VPS payload-file store was used. |
| Raw-body length integrity | PASS — 117 of 117 stored byte lengths equal PostgreSQL's actual `bytea` length. |
| Object projection | PASS — 114 responses are arrays of source objects, yielding 4,063,556 rows. |
| Non-JSON sources | PASS — the two HTTP-500 HTML responses are retained and classified, not parsed as data. |
| Availability source message | PASS — the 2006 committee message is retained and classified, not parsed as records. |
| Other services | PASS — PostgreSQL, the public API and the web service remained active after the run. |

The source capture ran from 18:37:36 to 19:05:42 UTC. A subsequent local-only
projection repaired a source-header issue: 72 JSON arrays were supplied as
`application/octet-stream`. The worker therefore now recognises safe JSON from
the retained bytes as well as the content-type header. It read only PostgreSQL
data and made no additional Scottish Parliament request.

## Corrective implementation notes

The first local-only projection attempt read an entire retained report into the
worker and hit its 768 MiB limit. Raw data was unaffected. It was replaced with
a chunked PostgreSQL reader that builds and writes one source object at a time;
the completed run was observed at roughly 225 MiB during processing. This is the production parser
for future work, not an additional data source or transformation.

## What this does not yet prove

- A later source change will be detected and reconciled: that requires a
  separately approved routine-update/reconciliation package.
- The Database mirror is current after the capture time above.
- Researchers yet have a public query route, downloads, front-end interface or
  a DB2 variable layer.
- Detail/filter forms beyond their documented parent-backed or upstream-limit
  treatment have their own separate captured response.

## Next decision

Before any front-end delivery, prepare a short backend-assurance proposal for
the routine source check, change reconciliation, health reporting, overlap
lock, recovery and backup/restore test. It must build on this baseline without
changing its source boundary or quietly creating new captures.
