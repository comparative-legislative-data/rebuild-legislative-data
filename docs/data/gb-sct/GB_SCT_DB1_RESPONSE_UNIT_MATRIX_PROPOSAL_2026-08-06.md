# GB-SCT DB1 response-unit matrix

**Status:** active DEC-0125/DEC-0126 literal baseline and reconciliation
control
**Date:** 6 August 2026  
**Governing direction:** DEC-0115  
**Change rule:** a new owner decision is required before any URL, year,
cadence, source form or response-unit treatment changes.

**Reading note:** this document remains the literal 117-URL/year capture list.
Its treatment of detail/filter access forms is summarised in the
[current DB1 backend state](GB_SCT_DB1_CURRENT_BACKEND_STATE_2026-08-06.md).

## 1. What this matrix controls

This is the missing bridge between the approved 64-form Scottish Parliament
API inventory and a bounded Database mirror. It answers a narrow operational
question: **what exact upstream response may DB1 request and retain?**

It is not a list of data records, an API crawl, a route retirement decision or
a statement that the source returns complete historical data. Its only purpose
is to prevent an implementation from inventing requests as it runs.

Two rules apply throughout:

1. a worker may request only a literal URL/window that appears in the approved
   matrix; and
2. an identifier returned in one response must never create another request.

## 2. Plain-English position

The 64 approved API forms divide into two visible groups:

| Position | Forms | Proposed initial response units | Meaning |
| --- | ---: | ---: | --- |
| **Capture-ready** | 33 forms | **117** | 29 fixed collection URLs plus 88 named annual URLs have a finite request rule. |
| **Parent-backed or upstream-limited access** | 31 forms | **0 extra requests** | 25 forms use their named retained parent response; six are explicit upstream detail-route limitations. None is omitted and none creates an inferred request queue. |

This does not turn a parent-backed form into a separately retained detail URL.
It makes the source-access boundary explicit: the 117 named collection/annual
responses are retained; later DB1 access to 25 forms comes from their named
parent response; six forms remain upstream limitations. No implementation may
turn the 31 forms into a crawl.

## 3. Capture-ready fixed response units: 29 URLs

Each listed URL is one response unit on an initial run and one unit in the
routine reconciliation class below. The base host is
`https://data.parliament.scot` and the request method is `GET`.

| Subject | Fixed route forms — one request each |
| --- | --- |
| Bills and formal stages | `/api/bills`; `/api/billstages`; `/api/billstagetypes`; `/api/billtypes`; `/api/sessions` |
| Members, constituencies and regions | `/api/members`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionregionstatuses`; `/api/constituencies`; `/api/regions` |
| Parties and government roles | `/api/parties`; `/api/memberparties`; `/api/partyroles`; `/api/memberpartyroles`; `/api/governmentroles`; `/api/membergovernmentroles` |
| Committees and committee roles | `/api/committees`; `/api/committeeroles`; `/api/committeetypes`; `/api/committeetypelinks` |
| Motions, questions and related records | `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswerseventtypes`; `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventlinks`; `/api/motionsquestionsanswersmotions`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme`; `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswerssupports` |

Each URL is retained exactly as returned: original bytes in PostgreSQL and,
where the response is a top-level object/array, unchanged source-object rows
linked to those bytes. There is no pagination, ID follow-up, field selection,
envelope stripping or response transformation in this matrix. The rejected
whole-response JSONB model is not part of this boundary.

## 4. Capture-ready annual response units: 88 URLs

The year values below are literal matrix values, not a dynamic range inferred
from returned data. The eventual executable registry must contain one row per
URL, generated from this reviewed list and checked to total 88 annual units.

| Form | Literal years | Unit count | Exact URL form |
| --- | --- | ---: | --- |
| MQA questions | 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 | 16 | `/api/motionsquestionsanswersquestions?year={year}` |
| Committee official reports | 1999–2026, inclusive | 28 | `/api/orscommitteemeeting?year={year}` |
| Plenary official reports | 1999–2026, inclusive | 28 | `/api/orsplenarymeeting?year={year}` |
| Votes on motions | 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026 | 16 | `/api/votesmotion?year={year}` |

For avoidance of doubt, `1999–2026 inclusive` means the literal values 1999,
2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
and 2026. No worker may request 2027 or another value unless the matrix is
amended and approved.

The known 2006 Committee Official Reports availability message is not an
exclusion. If returned again, DB1 records it as an upstream source condition
for the named `year=2006` unit. It does not treat it as zero records or skip
the unit.

## 5. The 31 non-request forms: visible access treatment, not exclusions

These forms all remain part of the approved long-term 64-form inventory. None
has its own source request because it would require an unapproved identifier
universe. The matrix forbids a worker from obtaining those values by reading
any collection response.

The completed controlled evidence is consolidated in the
[final initial DB1 response-unit model](GB_SCT_FINAL_INITIAL_DB1_RESPONSE_UNIT_MODEL_2026-08-06.md):
25 forms are parent-backed and six are upstream limitations. It does not claim
that DB1 independently retained every possible detail URL.

| Class | Forms without a current finite request universe | Count |
| --- | --- | ---: |
| Standard `:id` detail forms | `/api/bills/:id`; `/api/billstages/:id`; `/api/billstagetypes/:id`; `/api/billtypes/:id`; `/api/sessions/:id`; `/api/members/:id`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses/:id`; `/api/constituencies/:id`; `/api/regions/:id`; `/api/parties/:id`; `/api/memberparties/:id`; `/api/partyroles/:id`; `/api/memberpartyroles/:id`; `/api/governmentroles/:id`; `/api/membergovernmentroles/:id`; `/api/committees/:id`; `/api/committeeroles/:id`; `/api/committeetypes/:id`; `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswerseventtypes/:id`; `/api/motionsquestionsanswerseventsubtypes/:id`; `/api/motionsquestionsanswersmotions/:id`; `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswerssupports/:id`; `/api/Orscommitteemeeting/:id`; `/api/orsplenarymeeting/:id`; `/api/votesmotion/:id` | 28 |
| Link filters | `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | 3 |

### Access treatment

The A3 registry will record the parent form and evidence state for every one
of these 31 forms. It makes no detail request. Any later proposal for an
independently retained detail response must supply a finite, owner-approved
identifier universe and must not be created from returned collection IDs.

## 6. Proposed update and reconciliation classes

The following is deliberately simple. It gives every capture-ready unit a
routine check while keeping high-volume annual work bounded on the shared VPS.

| Class | Units | Proposed check | Why |
| --- | ---: | --- | --- |
| Fixed collections | 29 | Daily | No upstream update watermark is relied on; compare received bytes with the latest retained successful response. |
| Current-year annual windows | 4 (`year=2026`) | Daily | These are the most likely active-year routes. |
| Historical annual windows | 84 | Weekly, split across a single bounded scheduled run | Historical coverage remains visible and is rechecked without a daily high-volume transfer burst. |
| Parent-backed or upstream-limited forms | 31 forms, zero extra requests | Not scheduled | Their treatment is metadata over named retained parents or an upstream limitation, not an independent source request. |

The total capture-ready initial baseline is **117 requests**. A scheduled
run verifies the same set; it does not discover new years, IDs or routes.
Every run records `UNCHANGED`, `CHANGED`, `UPSTREAM_CONDITION`, `LOCAL_FAILURE`
or `NOT_DUE`, so a later portal can distinguish a source condition from an
unattempted or failed local check.

## 7. Proposed resource and stop rules

The production-schema package must test these before any live baseline. They
are limits, not claims about the source:

- use bounded concurrency and never transfer more than one high-volume annual
  official-report response at a time;
- stream response processing; do not write a raw payload file or load a large
  response merely to build a browser view;
- set an explicit per-response byte ceiling, run-duration ceiling and total
  scheduled-run transfer budget after a source-free large-payload proof;
- record and stop on a response exceeding an approved ceiling, an unexpected
  content type, a malformed body, a route outside this matrix or a repeated
  local failure threshold; and
- never silently skip a 2006 availability message or another upstream error.

## 8. Approval test and next step

This matrix is ready for review as the 117-response initial-baseline boundary.
It does not authorise capture by itself. The proposed
[production-schema and initial-baseline package](../../planning/GB_SCT_DB1_PRODUCTION_SCHEMA_AND_INITIAL_BASELINE_PACKAGE_PROPOSAL_2026-08-06.md)
set the completed initial-run limits, stops and acceptance tests. The proposed
[backend-assurance package](../../planning/GB_SCT_DB1_BACKEND_ASSURANCE_PACKAGE_PROPOSAL_2026-08-06.md)
would govern future routine checks without changing this 117-unit boundary.
