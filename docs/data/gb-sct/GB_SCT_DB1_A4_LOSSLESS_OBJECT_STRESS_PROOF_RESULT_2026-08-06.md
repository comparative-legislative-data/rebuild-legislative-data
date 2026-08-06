# GB-SCT DB1 A4 lossless-object source-free stress-proof result

**Status:** `PASS` — synthetic proof only; no Scottish Parliament request or
Database mirror completeness claim

**Date:** 6 August 2026

**Authority:** DEC-0124

**Design tested:** [lossless raw-response/source-object schema](../../planning/GB_SCT_DB1_LOSSLESS_OBJECT_SCHEMA_PROPOSAL_2026-08-06.md)

## Scope

This was one isolated, source-free test of the proposed PostgreSQL storage
pattern. It used one locally generated JSON array of exactly 157,286,400 bytes
(150 MiB). It did not contact the Scottish Parliament, read source data, use a
proxy route, start a schedule, or alter DB2 or the researcher-facing portal.

The test used a separate disposable `db1_a4_proof` schema in the existing
isolated DB1 PostgreSQL service. It did not alter the old partial A3 tables.

## Test method

1. Generate the synthetic array in process, without writing a payload file.
2. Store the exact full byte sequence in PostgreSQL `bytea`.
3. Use a bounded top-level-array parser to identify each source object.
4. Store every unchanged object as one linked JSONB row with its technical
   source position and SHA-256 digest.
5. Directly query PostgreSQL for raw-body and object integrity.
6. Remove the synthetic response/object rows after the checks, retaining only
   compact proof metadata.

The proof schema's `source_response` table deliberately has `raw_body bytea`,
byte length and SHA-256; it has no whole-response JSONB column.

## Resource boundary

| Resource | Bound / observation |
| --- | --- |
| Worker | Temporary systemd scope: 768 MiB memory, 35% CPU quota. |
| PostgreSQL | Existing isolated DB1 service: 2 GiB memory ceiling. |
| Synthetic body | 157,286,400 exact bytes (150 MiB). |
| Maximum generated object payload | 65,536 bytes before JSON framing. |
| Object insertion | 24 objects per PostgreSQL insert batch. |

## Passing result

| Check | Result |
| --- | --- |
| Exact raw body retained | PASS — PostgreSQL byte length was 157,286,400 and SHA-256 was `38f774a0a7f07abcfef48d97f8d7bf99f7b7ec4792465e333ccdd28835b704e2`. |
| Lossless source-object projection | PASS — 2,399 linked JSONB object rows were created from the raw array. |
| Technical lineage | PASS — positions ran continuously from 0 to 2,398. |
| Object integrity | PASS — every stored raw-object digest matched the parser's source slice; PostgreSQL also recomputed every JSONB canonical digest. |
| Worker limit | PASS — the temporary 768 MiB scope exited successfully; the worker recorded a peak RSS of 547,127,296 bytes. |
| No payload outside PostgreSQL | PASS — the proof path held only the migration and worker code, never a raw payload file. |
| Synthetic payload cleanup | PASS — after verification the disposable response and object tables were truncated; direct SQL confirmed zero payload/object rows. |
| Other project services | PASS — isolated PostgreSQL, API and web services were all active after the test. |

The successful run identifier was `4933b8a7-b65f-4ce4-8cdb-e35997ea3ef1`.
Its configuration digest was
`626bdf521fb0efe08d166ef5591af773455300574bd5fee7b99d635cf195be8f`.

## Corrected first attempt

The first attempt reached the same content checks but used `TRUNCATE` for
cleanup. The restricted worker correctly lacked table-owner permission for
that command, so the service reported failure after the checks. It was marked
`FAIL` in the proof metadata, its synthetic response was deleted, and the
worker was corrected to delete only its own rows. The second, clean run above
is the passing result. This is a local permission correction, not a source or
PostgreSQL resource failure.

## What this proves—and does not prove

This result proves the key storage design point: the isolated service can keep
a large exact raw response in PostgreSQL and project it into individually
queryable, unchanged JSONB objects without turning the entire response into
one huge JSONB document.

It does **not** prove that DB1 has captured any Scottish Parliament data, that
all real response shapes fit this parser, that all 117 response units are
present, that reconciliation or routine updates work, or that a researcher
portal is ready. The old partial A3 database is not a baseline.

## Next decision

Prepare a separate final-schema and bounded live-ingestion package. It must
define the production DDL, real-response object/parser limits, run locking,
reconciliation evidence, source-condition handling and the unchanged
117-response request boundary before any Scottish Parliament request is made.
