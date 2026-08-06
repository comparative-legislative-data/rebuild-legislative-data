# GB-SCT Database mirror: current backend state

**Status:** `VERIFIED AT THE STATED RESPONSE-UNIT SCOPE — RESEARCH PORTAL NOT YET DESIGNED`  
**Date:** 6 August 2026  
**Authority:** DEC-0125 and DEC-0126; owner-requested source-to-PostgreSQL demonstration and documentation close-out  
**Read with:** the [active response-unit matrix](GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md) and [backend-assurance result](GB_SCT_DB1_A6_BACKEND_ASSURANCE_RESULT_2026-08-06.md)

## Executive summary

The Database mirror (DB1) is now an isolated PostgreSQL database holding the
approved Scottish Parliament source material for this project. It is distinct
from the live API catalogue and from later DB2 research variables.

DB1 holds the original bytes of each approved response **inside PostgreSQL**,
not as a filesystem JSON archive. It also holds unchanged top-level source
objects linked back to those raw responses. This permits later database access
without changing source fields or going back to the live Scottish Parliament
API for every request.

The approved initial scope is 64 Scottish Parliament API forms represented by
117 literal source-response units: 29 fixed collections and 88 named annual
responses. The distinction matters: a form is an API pattern; a response unit
is one specific source URL that DB1 is allowed to collect and recheck.

## What is in PostgreSQL

At the completed 6 August 2026 baseline and assurance check, DB1 contained:

| Item | Verified position |
| --- | --- |
| Approved source forms | 64 |
| Literal retained source-response units | 117 |
| PostgreSQL raw source responses | 117 |
| Linked unchanged source-object rows | 4,063,556 |
| DB1 database size after the complete recheck | 7,578,852,375 bytes |
| Retained payload location | PostgreSQL `bytea` rows; no project raw-payload archive outside PostgreSQL |

Each retained response records the exact source URL, retrieval times, HTTP
status and relevant headers, content type, byte length and SHA-256 checksum.
The raw response cannot be altered in place. Each source-object row points to
its parent raw response and retains its source position and checksum.

## Rebuild history and lessons retained

DB1 reached this position only after three earlier approaches were stopped:

1. An inferred crawl of identifiers found in collection responses was
   withdrawn. It had no finite, defensible request boundary.
2. A raw-file store with PostgreSQL metadata was withdrawn. It did not meet
   the requirement that source data itself be held in PostgreSQL.
3. A whole-response JSONB design was stopped after large Official Report
   responses exhausted the isolated database memory limit.

The current design is the direct correction: immutable raw response bytes are
kept in PostgreSQL, while top-level JSON objects are stored as linked,
unchanged PostgreSQL JSONB rows. This keeps an exact raw response and enables
database retrieval without loading a 45–110 MiB report as one JSONB document.
The production baseline and later full recheck passed using this design.

The lasting project rule is simple: decide the finite source-response boundary
before ingestion, prove the backend independently, then design the researcher
portal as a separate product. Do not let an ingestion/QA screen become the
user interface.

## How the 64 API forms are treated

| Treatment | Forms | Meaning |
| --- | ---: | --- |
| **Direct retained response** | 33 | DB1 stores the complete collection or named annual Scottish Parliament response. |
| **Parent-backed detail/filter access** | 25 | Controlled source comparison showed that the detail/filter result is already present unchanged in a named retained parent response. DB1 can later select that raw object/result from PostgreSQL. |
| **Upstream limitation** | 6 | The Scottish Parliament detail route itself has no usable ordinary-ID contract, returns an empty object, or returns an upstream error. DB1 records that source behaviour and retains the relevant parent data where available. |

This is a complete accounting of the 64 approved forms. It is not an
unbounded crawl of identifiers discovered in a collection.

## Concrete source-to-database example

This owner-requested, read-only demonstration made one public source request
and one read-only PostgreSQL query. It made no database, VPS service or source
capture change.

### Live Scottish Parliament detail route

At **2026-08-06 21:26:44 UTC**, the public route
[`/api/billtypes/1`](https://data.parliament.scot/api/billtypes/1) returned
HTTP `200` and this JSON object:

```json
{"ID":1,"Name":"Executive"}
```

### Same object from DB1 PostgreSQL

DB1 selected the object from the retained parent response
`https://data.parliament.scot/api/billtypes`:

```sql
SELECT
  ro.object_jsonb AS db1_result,
  sr.request_locator AS parent_source_url,
  sr.request_finished_at AT TIME ZONE 'UTC' AS captured_utc,
  sr.body_sha256 AS parent_response_sha256,
  ro.source_position
FROM db1.source_response AS sr
JOIN db1.response_object AS ro
  ON ro.source_response_id = sr.source_response_id
WHERE sr.response_unit_key = 'bill-types.collection'
  AND ro.object_jsonb ->> 'ID' = '1'
ORDER BY sr.request_finished_at DESC
LIMIT 1;
```

It returned:

```text
db1_result:              {"ID": 1, "Name": "Executive"}
parent_source_url:       https://data.parliament.scot/api/billtypes
captured_utc:            2026-08-06 18:37:37.927239
parent_response_sha256:  fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b
source_position:         0
```

This illustrates the intended parent-backed pattern. The later portal can
offer a DB1 route equivalent to the usable Scottish Parliament detail route,
but it will answer from the dated retained parent object and must disclose its
parent URL, capture time and checksum. It will not pretend to be a live source
response.

## Parity and operational assurance

After the initial baseline, DB1 made one controlled recheck of every one of
the same 117 literal URLs.

| Result | Count |
| --- | ---: |
| Byte-for-byte unchanged source responses | 114 |
| Same named Scottish Parliament source conditions | 3 |
| Unexpected source changes | 0 |
| Local DB1 failures | 0 |
| Units not attempted | 0 |
| Production structural-drift events | 0 |

The three named conditions are part of the mirror record, not silent gaps:

1. 2006 Committee Official Reports returned the Scottish Parliament’s own
   “Data is presently unavailable” message.
2. MQA Events returned Scottish Parliament HTTP `500`.
3. MQA Questions returned Scottish Parliament HTTP `500`.

The recheck transferred 5,914,599,341 source bytes. Direct PostgreSQL checks
also confirmed that all 117 retained raw response lengths matched their stored
bytes, all 117 had a verification state, all expected source-object links
existed, and no production schema-drift event was recorded.

## Routine maintenance

DB1 uses one serial, locked worker. It cannot overlap with another run because
both a system lock and a PostgreSQL advisory lock are required.

- **Daily, 03:15 UTC plus up to two minutes:** 29 fixed collections plus four
  current-year annual responses (33 units).
- **Weekly, Monday 04:15 UTC plus up to two minutes:** 84 historic annual
  responses.

For each scheduled check, DB1 records one of: unchanged, changed, named
upstream condition, or local failure. A changed source response is retained
append-only; it is not overwritten. The worker has explicit limits for memory,
CPU, response body size, total transfer and run duration.

## What this permits now

- A truthful statement that DB1 is a PostgreSQL-held, source-faithful mirror
  of the 117 approved response units **as checked at the recorded time**.
- Later database-backed retrieval of the 25 parent-backed forms, using the
  retained source object and parent-capture provenance.
- Later download, query and browsing design built on a known backend
  capability rather than on a temporary ingest screen.

## What this does not yet permit

- A claim that DB1 is continuously current between checks.
- A claim that a Scottish Parliament detail form works where the source itself
  returns an error, empty object or has no usable ordinary-ID contract.
- DB2 variables, analytical interpretations, research findings or charts.
- A claim that the service is recoverable after a VPS loss: off-VPS backup and
  an isolated restore test are deliberately deferred by the owner.
- Treating the previous QA frontend as the research portal.

## Next design boundary

The next product work is a separate researcher-portal design. It must treat
DB1 first as a source-faithful database mirror, then provide research-grade
ways to understand and use it: clear route/data descriptions, dated raw access,
parent-backed retrieval, formats, bulk releases, query snippets, field guides,
citations and transparent source-limit notices. It must not expose ingest
machinery as the product.

**What next:** obtain independent input on the researcher-portal design, then
prepare a single owner-reviewable frontend proposal. That is a new design task;
it is not authorised by the present backend record.
