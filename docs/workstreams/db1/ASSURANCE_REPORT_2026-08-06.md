# Database mirror backend assurance report

**Status:** R1–R3 `PASS` within DEC-0114’s declared scope  
**Date:** 6 August 2026  
**Scope:** GB-SCT Database mirror backend only  
**Authority:** DEC-0114

## What was checked

The Database mirror was rebuilt around 117 literal Scottish Parliament source
responses: 29 fixed collections or fixed filters, and 88 named annual
responses. This represents the 64-form approved inventory: 31 identifier or
filter forms are Database-mirror access methods over the retained source
responses, not an upstream detail crawl.

R1 first proved the isolated PostgreSQL/raw-archive arrangement without source
contact. R2 then made one baseline request for every matrix unit. R3 repeated
the same 117 requests and compared their raw-response digests to the baseline.

## Results

| Check | Result |
| --- | --- |
| R1 source-free PostgreSQL/raw-archive proof | Pass: stored file re-hashed to its recorded digest; zero capture observations existed before baseline. |
| Baseline | 117/117 outcomes recorded between 08:53 and 09:00 UTC: 115 retained responses and 2 upstream availability responses. |
| Immediate reconciliation | 117/117 outcomes recorded between 09:07 and 09:14 UTC: 113 `UNCHANGED`, 4 `UPSTREAM_AVAILABILITY_MESSAGE`, 0 `CHANGED`, 0 `FAILED_TO_RETRIEVE`. |
| Capture coverage | 117 expected units; 117 observations; 0 unrepresented units. |
| Raw integrity | 117 current manifest references checked; 0 missing, size-mismatched or SHA-256-mismatched files. |
| Archive size after reconciliation | 6,249,929,281 bytes. |
| Existing services | The project API and web services remained active throughout. |

The machine-readable assurance record is retained in PostgreSQL table
`db1_assurance_report`; it records the run identifiers, status counts, raw
integrity result and source conditions used for this report.

## Access boundary

The 31 identifier/filter forms in the approved inventory do not introduce
another upstream source response: their source records are contained in the
retained collection or annual responses covered above. DB1 does **not yet**
publish PostgreSQL record-access routes for those forms. That is not a
source-capture omission and it does not trigger an upstream detail crawl; it is
a separate researcher-portal/API access-design task after R4. The current
backend capability is raw-response retention, provenance and reconciliation.

## Current upstream conditions

These are source states observed during the immediate reconciliation, not CLD
errors and not evidence that records never existed.

| Matrix unit | Source state at check |
| --- | --- |
| Committee Official Reports, 2006 | HTTP 200 body matched the Scottish Parliament’s “presently unavailable” message. |
| MQA events collection | HTTP 503. |
| MQA questions collection | HTTP 500. |
| MQA supports collection | HTTP 503. |

The 2006 committee response is scheduled weekly. The three MQA collection
responses are scheduled daily. Each future check retains the returned source
bytes and records whether the condition continues, changes or clears.

## Routine operation

One generic worker, not 117 endpoint implementations, now runs:

- daily at 03:17 UTC for 33 fixed/current response units; and
- weekly on Monday at 04:17 UTC for 84 historic annual response units.

Every run uses the same three-request maximum, two-official-report maximum,
five-minute per-response limit, 512 MiB per-response limit and 16 GiB run
budget. No DB1 browser, download route, API route, user interface or public
research portal was created in this work.

## What this supports—and what it does not

This evidence supports a narrow statement: at the times above, the Database
mirror checked every response unit in DEC-0114’s matrix, retained the returned
bytes or source availability state, and verified the stored raw files against
their manifests. It supports a later portal being designed against the
backend’s actual capabilities.

It does **not** claim that the Scottish Parliament API has no other URLs,
cannot change between checks, has complete historical coverage, or provides
semantic research variables. It does not create DB2, a canonical dataset,
downloads in research formats, PostgreSQL record-access routes, public access
or a research finding.

## R4 decision

The owner should now review whether this backend capability boundary is
accepted as complete for its declared matrix. A separate proposal is then
required to design a researcher-facing portal that treats the Database mirror
as a raw-source product rather than exposing backend QA mechanics.
