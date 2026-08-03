# GB-SCT High-Volume Operational Register — 3 August 2026

**Status:** Historical DB1/capture-planning evidence — 17 operational records completed; no DB1/capture route enabled
**Authority:** DEC-0071

## 1. Boundary

This register applies the DEC-0071 operational controls to all 17 remaining
high-volume forms using completed reconnaissance only. At the time of this
record, no source/API/portal request, source body, relay, code, VPS, database,
DB1, DB2, cache, download, or public action occurred.

The later DEC-0072 private raw-proxy MVP is closed and separately archived. It
does not change these DB1/capture operational states: its fixed source-style
actions retain nothing and do not establish a capture method or a DB1-ready
route.

Each state below is an operational availability state, not a statement about
source completeness, content, terms, handling class, or research meaning.

## 2. Route-level operational register

| Route form | Current operational state | Existing evidence | Required gate before any route/action can proceed |
| --- | --- | --- | --- |
| `/api/motionsquestionsanswersevents` | `UNAVAILABLE_EXTREME_UNFILTERED` | No headers within the prior 30-second bounded observation; full audit did not complete. | A source-supported bounded retrieval method, response budget, handling/terms, and exact action package. |
| `/api/motionsquestionsanswersevents/:id` | `UNAVAILABLE_DETAIL_CONTRACT` | Detail-key contract remains unestablished. | Separate contract evidence, then handling/terms and action-specific operational controls. |
| `/api/motionsquestionsanswersmotions` | `UNAVAILABLE_WHOLE_HISTORY_LARGE` | One complete response was about 110 MB. | Exact source window, transfer/cancellation budget, streaming/no-buffering verification, handling/terms, and action package. |
| `/api/motionsquestionsanswersmotions/:id` | `UNAVAILABLE_DETAIL_CONTRACT` | Detail-key contract remains unestablished. | Separate contract evidence, then handling/terms and action-specific operational controls. |
| `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration` | `UNAVAILABLE_FILTERED_MEDIUM` | One prior response was about 1.3 MB. | Treat as its own exact filter; resolve handling/terms, source-window, response budget, and action-specific controls. |
| `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | `UNAVAILABLE_FILTERED_MEDIUM` | One complete response was about 3.6 MB. | Treat as its own exact filter; resolve handling/terms, source-window, response budget, and action-specific controls. |
| `/api/motionsquestionsanswersquestions` | `UNAVAILABLE_EXTREME_UNFILTERED` | No headers within the prior 30-second bounded observation; full audit did not complete. | A source-supported bounded retrieval method, response budget, handling/terms, and exact action package. |
| `/api/motionsquestionsanswersquestions/:id` | `UNAVAILABLE_DETAIL_CONTRACT` | Detail-key contract remains unestablished. | Separate contract evidence, then handling/terms and action-specific operational controls. |
| `/api/motionsquestionsanswersquestions?year=:year` | `UNAVAILABLE_ANNUAL_WINDOW` | The documented 2026 year form completed once at about 6.5 MB. | Define year as the exact source window; resolve handling/terms, transfer budget, cancellation/failure treatment, and action package. |
| `/api/motionsquestionsanswerssupports` | `UNAVAILABLE_EXTREME_UNFILTERED` | No headers within the prior 30-second bounded observation; full audit did not complete. | A source-supported bounded retrieval method, response budget, handling/terms, and exact action package. |
| `/api/motionsquestionsanswerssupports/:id` | `UNAVAILABLE_DETAIL_CONTRACT` | Detail-key contract remains unestablished. | Separate contract evidence, then handling/terms and action-specific operational controls. |
| `/api/Orscommitteemeeting/:id` | `UNAVAILABLE_EMPTY_DETAIL_OBSERVED` | One transient candidate returned an empty JSON object. | Do not infer detail-key meaning. A later action needs its own contract, handling/terms, and operational package. |
| `/api/orscommitteemeeting?year=:year` | `UNAVAILABLE_ANNUAL_FIREHOSE` | One annual response was about 150 MB; earlier annual samples ranged about 42–47 MB. | One declared year unit; streaming/no-buffering, transfer budget, manifest/reconciliation design, handling/terms, and action package. |
| `/api/orsplenarymeeting/:id` | `UNAVAILABLE_EMPTY_DETAIL_OBSERVED` | One transient candidate returned an empty JSON object. | Do not infer detail-key meaning. A later action needs its own contract, handling/terms, and operational package. |
| `/api/orsplenarymeeting?year=:year` | `UNAVAILABLE_ANNUAL_FIREHOSE` | One annual response was about 124 MB; earlier annual samples ranged about 35–65 MB. | One declared year unit; streaming/no-buffering, transfer budget, manifest/reconciliation design, handling/terms, and action package. |
| `/api/votesmotion/:id` | `UNAVAILABLE_DETAIL_CONTRACT` | Transient candidates returned either a source error or an empty JSON object. | Detail-key contract, handling/terms, and an action-specific operational package; do not infer a usable detail route. |
| `/api/votesmotion?year=:year` | `UNAVAILABLE_ANNUAL_WINDOW` | Annual samples were about 13.3 MB (2011) and 19.4 MB (2026); 2010 failed. | One declared year unit; preserve failure states; resolve handling/terms and operational controls. No bill-amendment or stage-vote claim. |

## 3. Shared operational controls now fixed for later packages

For every scoped action, a later exact proposal must declare the source form
and window, response/time/concurrency budget, cancellation treatment,
streaming/no-buffering test, source-error disclosure, updateability and
reconciliation position, and applicable DB1 manifest requirements. It must
also resolve route-specific terms and handling before any source-facing,
retained, or public action.

The register does not establish an update watermark, pagination contract,
completeness, semantic relationship, or valid research variable. In
particular, votes on motions remain distinct from votes on bill amendments.

## 4. Integrity checks

- The register contains exactly 17 route forms from DEC-0071.
- Each row has a separate operational state and action gate.
- No source content, identifier, or response body is retained.
- No route becomes available by an operational classification alone.

## 5. What next

The generic queue is now exhausted: handling, contract, and operational
registers cover all unrelayed selected forms. The next useful proposal should
be a small combined route-qualification package for the most tractable next
candidate(s), bringing together terms, handling, contract, and operational
evidence rather than creating another framework.
