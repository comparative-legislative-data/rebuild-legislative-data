# GB-SCT DB1 response-unit matrix

**Status:** proposed A1 control — no capture authority  
**Date:** 6 August 2026  
**Governing direction:** DEC-0115  
**Decision required:** owner approval of this matrix and the separate A1
foundation package before any database or source action.

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
| **Input-universe gap** | 31 forms | **0** | Parameterised/detail forms remain in scope but no literal identifier set has been approved. They must not be silently omitted or converted into a queue extracted from collections. |

This is not a claim that the 31 forms are irrelevant. It is the opposite: the
matrix makes them visible precisely because DB1 cannot honestly claim a
64-form request-level mirror while their request units are unknown.

The A1 package may build and test the PostgreSQL foundation using synthetic
data, but it must not begin source capture until the owner has chosen how the
31-form input-universe gap will be resolved.

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

Each URL is retained exactly as returned: original bytes and, where valid JSON,
a queryable JSON representation in the same PostgreSQL response row. There is
no pagination, ID follow-up, field selection, envelope stripping or response
transformation in this matrix.

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

## 5. The 31 unresolved forms: visible scope gaps, not hidden exclusions

These forms all remain part of the approved long-term 64-form inventory. None
has a proposed source request because `:id`/`UniqueId` values are not known as
a finite, owner-approved universe. The matrix forbids a worker from obtaining
those values by reading any collection response.

| Class | Forms without a current finite request universe | Count |
| --- | --- | ---: |
| Standard `:id` detail forms | `/api/bills/:id`; `/api/billstages/:id`; `/api/billstagetypes/:id`; `/api/billtypes/:id`; `/api/sessions/:id`; `/api/members/:id`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses/:id`; `/api/constituencies/:id`; `/api/regions/:id`; `/api/parties/:id`; `/api/memberparties/:id`; `/api/partyroles/:id`; `/api/memberpartyroles/:id`; `/api/governmentroles/:id`; `/api/membergovernmentroles/:id`; `/api/committees/:id`; `/api/committeeroles/:id`; `/api/committeetypes/:id`; `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswerseventtypes/:id`; `/api/motionsquestionsanswerseventsubtypes/:id`; `/api/motionsquestionsanswersmotions/:id`; `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswerssupports/:id`; `/api/Orscommitteemeeting/:id`; `/api/orsplenarymeeting/:id`; `/api/votesmotion/:id` | 28 |
| Link filters | `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | 3 |

### Required owner choice for these forms

The next matrix revision must choose one of the following, consistently and
explicitly for each affected form:

1. **Independently retained detail responses.** Supply or approve a finite
   literal identifier universe, its provenance, numerical request bound and
   refresh rule. The worker will use only that static list.
2. **Collection/annual response is the DB1 retention unit.** Formally define
   the detail/filter route as a live API access form rather than an independent
   retained-response unit. This is only valid if the owner accepts that DB1 is
   mirroring the stated collection/annual response rather than asserting
   request-level parity for the detail form.
3. **A different, source-documented finite window.** Record the exact
   source-supported finite input set and owner approval before implementation.

Option 2 is the smallest and fastest DB1 scope, but it does not satisfy a
claim that every detail-form response has independently been retained. Option
1 can support that stronger claim, but it must not be supplied by an inferred
crawl. This is a genuine product-scope decision, not an implementation detail
that a worker can decide for itself.

## 6. Proposed update and reconciliation classes

The following is deliberately simple. It gives every capture-ready unit a
routine check while keeping high-volume annual work bounded on the shared VPS.

| Class | Units | Proposed check | Why |
| --- | ---: | --- | --- |
| Fixed collections | 29 | Daily | No upstream update watermark is relied on; compare received bytes with the latest retained successful response. |
| Current-year annual windows | 4 (`year=2026`) | Daily | These are the most likely active-year routes. |
| Historical annual windows | 84 | Weekly, split across a single bounded scheduled run | Historical coverage remains visible and is rechecked without a daily high-volume transfer burst. |
| Unresolved detail/filter forms | 31 forms, zero requests | Not scheduled | A check would be an unauthorised request until a finite input rule is approved. |

The total capture-ready initial baseline is **117 requests**. A scheduled
run verifies the same set; it does not discover new years, IDs or routes.
Every run records `UNCHANGED`, `CHANGED`, `UPSTREAM_CONDITION`, `LOCAL_FAILURE`
or `NOT_DUE`, so a later portal can distinguish a source condition from an
unattempted or failed local check.

## 7. Proposed resource and stop rules

The A1 package must test these before any live baseline. They are limits, not
claims about the source:

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

This matrix is ready for review as a **partial but honest** response-unit
control. It is not ready to authorise full 64-form capture because 31 forms
lack a finite unit rule.

**Proposed next step:** review this matrix alongside the A1 foundation package.
The owner may approve A1 synthetic PostgreSQL work and the 117-unit baseline
direction, but must decide the detail/filter route policy before approving any
full-scope source capture.
