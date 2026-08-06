# GB-SCT DB1 lossless-object schema and access design

**Status:** approved for source-free proof — executed PASS; no source, capture, schedule or portal authority

**Date:** 6 August 2026

**Supersedes for future implementation:** the whole-response JSONB part of the
blocked A3 approach. It does not alter the approved 117-unit source boundary.

## 1. Decision requested

Approve a revised DB1 storage design before any further Scottish Parliament
request. The design retains every approved source response in PostgreSQL and
makes its unchanged source objects queryable without requiring PostgreSQL to
materialise a 45–110 MiB Official Report as one giant JSONB value.

This is not a DB2 design, a new source scope, a schedule, a frontend build or
an authorisation to resume capture.

## 2. Plain-English product

DB1 has two linked parts:

1. **Raw response archive.** The exact bytes returned by each approved API URL
   live in PostgreSQL with its URL, capture time, HTTP result, content type,
   size and SHA-256. This is the fidelity anchor and supports an exact retained
   JSON download.
2. **Lossless source-object projection.** Where a retained response is a
   top-level array, each unchanged array item is stored as one PostgreSQL JSONB
   row linked to that raw response and its technical source position. It makes
   the same retained content searchable, pageable and exportable without
   creating a research variable or altering a source field.

The first part is like retaining an original PGN file. The second is like
storing each game from that PGN as a separate, unchanged record. DB2 begins
only if a later approved method renames, joins, interprets or derives data.

## 3. Why the previous A3 shape is blocked

The first A3 implementation placed both raw bytes and a whole-response JSONB
value in one `source_response` row. Real Committee Official Reports include
responses of 45–110 MiB. PostgreSQL's conversion of one such body to a giant
JSONB value twice caused the isolated DB1 service to be OOM-killed on the
shared VPS. The proxy, web service and other databases were unaffected.

The issue is not a Scottish Parliament data defect and it is not solved by
raising an arbitrary memory limit. The revised design avoids the unnecessary
whole-response JSONB conversion while preserving the exact source response in
PostgreSQL.

## 4. Proposed relational model

| Table | Content and role |
| --- | --- |
| `source_form` | The 64 approved API forms, their access treatment and later observed projection rule. |
| `response_unit` | The 117 literal permitted collection/year URLs. It is the source-request control. |
| `capture_run` | One bounded run, code/config revision, limits, start/end and result. |
| `source_response` | One immutable raw response: `bytea`, SHA-256, byte length, URL, method, HTTP/content metadata and capture lineage. It deliberately has **no whole-response JSONB column**. |
| `response_object` | One unchanged top-level source object, its parent `source_response`, technical `source_position`, exact object JSONB and object SHA-256. |
| `projection_run` | The declared parser/projection version, source response, result, counts and any rejection/limit state. |
| `field_observation` | Observed key/path, JSON type, occurrence count and null count for a named projected response/form. It is a field guide, not a codebook. |
| `response_verification` | Every new, unchanged, changed, upstream-condition or local-condition result. |

`response_object.source_position` is technical lineage only. It is not an
asserted substantive order, category or DB2 variable.

### Response shapes

The design does not assume every endpoint returns the same shape:

- **Top-level array:** one `response_object` row for each element.
- **Top-level object:** retain the exact raw response; initially project the
  whole object as one row only when its observed shape is suitable.
- **Availability message or invalid/non-JSON response:** retain the raw body
  where received and record a source condition; create no invented objects.
- **Oversized individual object:** retain the response and record an explicit
  projection limit. It is not silently dropped or turned into a local absence
  claim.

Every projection rule is recorded against the form/capture after observation.
There is no separate physical schema for Bills, Members, Official Reports, or
any other API family. The source-form registry and field observations provide
the API-specific description; the storage mechanism remains common and
lossless.

## 5. Research access enabled by DB1

The eventual frontend talks only to a controlled backend API, never directly
to PostgreSQL. It will distinguish three products clearly:

| Access mode | User receives | Truthful label |
| --- | --- | --- |
| Raw retained response | The exact JSON bytes DB1 captured for one named source URL/window. | `Exact retained source response` |
| Source-object browse/query | Unchanged objects from named retained responses, selected by a documented safe query. | `DB1 lossless source-object query` |
| Generated research download | A stated selection or format conversion from named captures/objects, plus a manifest. | `DB1-generated download` |

This supports the Scottish Parliament-style choices—such as a specific year or
source identifier where it is represented in a named parent capture—**plus**
database access unavailable from the firehose API: pagination, source-field
filtering, documented search, selected-record downloads, all-available-years
bundles, field guides and reproducible request snippets.

The 25 parent-backed detail/filter forms remain access methods over their named
retained parent response. The six explicit upstream detail limitations remain
visible. Neither causes a new source request.

CSV, JSONL, Parquet and SQLite downloads may later re-express a named selection
of unchanged source objects, but must state their conversion rule, fields,
selection, capture IDs, count, generation time and checksum. A multi-year
bundle is a DB1 product, not one Scottish Parliament response.

## 6. Memory-safe implementation sequence

1. **Design lock.** Define the DDL, response-shape rules, source-object parser
   contract, resource budget and direct-SQL acceptance queries.
2. **Source-free stress proof.** Use synthetic arrays containing 150 MiB of
   JSON to prove raw bytes can be retained and objects projected inside the
   isolated PostgreSQL/worker limits. The test must show no payload file and
   must preserve per-object SHA-256/position/count lineage.
3. **Owner review.** Review the measured result and set the final capture
   concurrency, body/object limits and database/worker limits. No value is
   guessed from the earlier failed run.
4. **New bounded ingestion package.** Re-authorise the unchanged 117 source
   units under the proven design. A failed prior attempt is not silently
   relabelled as a successful baseline.
5. **Backend assurance.** Verify all units, raw bytes, object counts, hashes,
   source conditions, no-filesystem rule and resource behaviour directly in
   PostgreSQL before any portal work.

The parser may use a streaming JSON mechanism, but it must not write a
temporary source payload file. It retains the raw source body in PostgreSQL,
then emits source objects in bounded batches. A full JSON document must never
be converted into one large PostgreSQL JSONB value.

## 7. Acceptance criteria for the source-free proof

The revised schema may move to a new ingestion proposal only if all are true:

1. a synthetic 150 MiB JSON response is stored as exact PostgreSQL bytes;
2. every top-level synthetic object has one linked JSONB row with unchanged
   content, source position and object digest;
3. object count and source-position coverage match the raw response;
4. direct SQL verifies raw-response and object digests/byte counts;
5. no source payload file exists outside PostgreSQL;
6. PostgreSQL and worker remain within their approved cgroup limits, while
   existing VPS services stay healthy; and
7. the result makes no DB2, semantic, completeness, currentness or portal
   claim.

## 8. Explicit non-goals

- a bespoke physical database schema for each API;
- field renaming, type normalisation, source-ID guessing, joins or variables;
- an unrestricted SQL endpoint;
- generic full-text search before observed field profiles and measured indexes;
- a frontend implementation; or
- a new source request, capture, scheduler or reconciliation job.

## 9. Owner choice

DEC-0124 was approved and the source-free proof passed. See the
[A4 proof result](../data/gb-sct/GB_SCT_DB1_A4_LOSSLESS_OBJECT_STRESS_PROOF_RESULT_2026-08-06.md).
This approval did not authorise a Scottish Parliament request. A separate,
owner-approved package is still required before any 117-unit baseline capture.
