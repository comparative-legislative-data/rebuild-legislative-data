# GB-SCT Cohort B result and initial DB1 response-unit model

**Status:** proposed initial DB1 model; owner review required before any DB1 work  
**Date:** 6 August 2026  
**Evidence:** DEC-0117, DEC-0118 and Cohort B under DEC-0119

## The plain-English position

DB1 can be designed now without any individual-record crawl.

It will store the approved whole Scottish Parliament collection and annual API
responses in PostgreSQL. For a detail route that has been checked and found to
return one of the same objects already present in its parent response, DB1 can
later give the researcher that stored object directly from PostgreSQL. It does
not need to call the Scottish Parliament again or separately store every
individual detail page.

This is not a claim that every possible detail URL has been independently
captured. It is a clear statement that the raw source content for a detail
form is already held inside the named parent response, where the source checks
support that conclusion.

## What the completed checks show

Twenty-four of the 31 detail/filter API forms now have a sampled match with
their parent response:

- 19 ordinary collection/detail forms;
- two Member election-status detail forms;
- MQA event types and event subtypes; and
- the three MQA event-link filter forms.

For those 24 forms, the sampled source detail/filter result was already present
unchanged in the parent response. DB1 can therefore propose to store the parent
response and later provide a clearly labelled, source-faithful object/filter
view from it.

Seven detail forms remain **unresolved**, not excluded:

| Detail form | Why no parent-access claim is made yet | What DB1 still retains |
| --- | --- | --- |
| MQA events | Parent returned HTTP 500 during Cohort B. | The named MQA events collection response/unit, or a visible upstream condition. |
| MQA motions | Parent exceeded the 50 MiB no-retention audit safety limit. | The named MQA motions collection response/unit. |
| MQA questions | Parent returned HTTP 500 during Cohort B. | The named MQA questions collection and annual responses/units, or a visible upstream condition. |
| MQA supports | Parent exceeded the 50 MiB audit limit. | The named MQA supports collection response/unit. |
| Committee Official Report detail | An ordinary parent ID produced HTTP 404 at the detail route. The route uses a different input contract. | Every named annual Committee Official Reports response/unit, including a visible 2006 upstream condition if returned. |
| Plenary Official Report detail | Parent exceeded the 50 MiB audit limit. | Every named annual Plenary Official Reports response/unit. |
| Vote on Motion detail | An ordinary parent ID produced HTTP 404 at the detail route. The route uses a different input contract. | Every named annual Votes on Motions response/unit. |

These are source-route limitations, not missing or zero data. They must remain
visible in DB1 and later in the researcher portal.

## Initial source-response capture boundary

The raw PostgreSQL capture boundary is unchanged from the earlier matrix:

- 29 fixed collection URLs; and
- 88 literal annual URLs;

for **117 exact source response units**. Every successful response is stored
in PostgreSQL as its original bytes and queryable JSON representation in the
same response row, with its request and capture provenance. No source body is
stored as a VPS file.

The authoritative literal URL/year list remains in the
[response-unit matrix](GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md).
This model changes its interpretation of the 31 parameterised forms: it does
not hide them, and it does not turn them into an ID crawl.

## How the 64 approved API forms will be represented

| Form group | Number of forms | Initial DB1 representation |
| --- | ---: | --- |
| Fixed and annual collection forms | 33 | Retain the exact named source response in PostgreSQL. |
| Detail/filter forms with sampled parent match | 24 | Keep the parent response as the raw source record; later expose the corresponding stored raw object/filter result with direct lineage to that parent capture. |
| Detail forms with unresolved source contract | 7 | Retain their named parent collection/annual response, but show the detail form as an unresolved DB1 access gap rather than pretending it is available. |

The seven unresolved forms do not block storage of their parent data. They only
block a claim that DB1 can reproduce that particular detail-style access route.

## The single design rule

DB1 is allowed to retrieve a raw object from PostgreSQL only when all of the
following are true:

1. the parent source response was retained as an approved response unit;
2. the object is selected only from that stored response, never by making a new
   upstream request;
3. the selection uses the documented source identifier/filter field;
4. the result remains source-faithful and carries the parent capture lineage;
   and
5. no fields are renamed, joined, cleaned, recoded, or treated as DB2
   variables.

This is database access to retained source content, not a second capture
process and not a semantic transformation.

## What is deliberately not being proposed

- No individual-page crawl.
- No more source exploration before DB1 implementation.
- No raw files on the VPS.
- No frontend rebuild or temporary research portal.
- No DB2 variables, codebooks, or analytical claims.
- No claim that all 64 API forms have identical upstream URL-by-URL behaviour.

## Next decision

Approve or amend this initial response-unit model and the already-proposed
source-free A1 PostgreSQL foundation package.

If approved, the next work is very limited: build the isolated PostgreSQL
schema with synthetic data only, then prove directly in SQL that a response
body and its JSON representation are both in PostgreSQL. There will still be
no Scottish Parliament data ingest until the owner approves the later bounded
ingest package.

