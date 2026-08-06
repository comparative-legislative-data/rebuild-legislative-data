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
| Immediate full reconciliation | 117/117 outcomes recorded between 09:07 and 09:14 UTC: 113 `UNCHANGED`, 4 `UPSTREAM_AVAILABILITY_MESSAGE`, 0 `CHANGED`, 0 `FAILED_TO_RETRIEVE`. This remains the fixed full-matrix comparison. |
| Follow-up MQA diagnostic | Three isolated, already-approved MQA requests recorded between 12:19 and 12:21 UTC: events remained HTTP 503; questions and supports returned HTTP 200 source responses. All three retained raw files passed the size and SHA-256 check. |
| Current 117-unit state | 113 `UNCHANGED`, 2 `CHANGED`, 2 `UPSTREAM_AVAILABILITY_MESSAGE`, 0 failed. The two `CHANGED` labels mean that a previous upstream error response was replaced by a normal source response; they are not a claim that the underlying parliamentary records changed. |
| Capture coverage | 117 expected units; 117 observations; 0 unrepresented units. |
| Raw integrity | 117 current manifest references checked; 0 missing, size-mismatched or SHA-256-mismatched files. |
| Archive size after the full reconciliation (before the later diagnostic) | 6,249,929,281 bytes. |
| Existing services | The project API and web services remained active throughout. |

The machine-readable assurance record is retained in PostgreSQL table
`db1_assurance_report`; version 2 records the fixed full reconciliation, any
later targeted diagnostic, the latest state for every matrix unit, raw
integrity and the remaining source conditions. This prevents a bounded
diagnostic from being mistaken for the full 117-unit audit.

## Access boundary

The 31 identifier/filter forms in the approved inventory do not introduce
another upstream source response: their source records are contained in the
retained collection or annual responses covered above. DB1 does **not yet**
publish PostgreSQL record-access routes for those forms. That is not a
source-capture omission and it does not trigger an upstream detail crawl; it is
a separate researcher-portal/API access-design task after R4. The current
backend capability is raw-response retention, provenance and reconciliation.

## Current upstream conditions

These are the current source states after the full reconciliation and the
follow-up three-request MQA diagnostic. They are not CLD errors and do not
mean that records never existed.

| Matrix unit | Source state at check |
| --- | --- |
| Committee Official Reports, 2006 | HTTP 200 body matched the Scottish Parliament’s “presently unavailable” message. |
| MQA events collection | HTTP 503. |

The later diagnostic also confirmed that the MQA questions and supports
collections were again returning normal HTTP 200 source responses. They are
therefore not current availability conditions.

The 2006 committee response is scheduled weekly. The MQA collections are
scheduled daily. Each future check retains the returned source bytes and
records whether a condition continues, changes or clears.

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
