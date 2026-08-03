# GB-SCT High-Volume Operational-Control Proposal — DEC-0071

**Status:** PROPOSED — design only; no additional source request or route enabled

## 1. Decision requested

Approve one shared operational-control framework for the 17 remaining GB-SCT
high-volume MQA, motion, question, official-report, and votes-on-motions route
forms. It would convert existing reconnaissance into explicit future source-
window, response-size, timeout, failure, and DB1-control requirements.

Approval would adopt these controls only. It would not authorise another source
request, a relay, raw capture, DB1, DB2, application code, VPS/database change,
retention, download, chart, or public action.

## 2. Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | Proxy-phase operational qualification planning; all high-volume forms remain unavailable. |
| Authority proposed | DEC-0071, based on DEC-0045, DEC-0055, DEC-0057, DEC-0067, and completed high-volume/MQA/vote/updateability reconnaissance. |
| Exact scope | The 17 route forms in section 3 only. Bills and the handling/contract batches remain outside this proposal. |
| Known uncertainty | Source terms, content handling, detail-key/parameter semantics, complete request grammar, update policy, deletion/correction detection, source coverage, and research meaning remain unresolved. |
| Smallest change | Adopt a route-form operational-control framework based solely on existing value-free audit evidence. |
| Containment / rollback | Documentation-only. A later route/action can be stopped independently; no source/system state changes under this decision. |
| Verification | Confirm the result covers all 17 forms, records the observed operational basis and explicit controls, preserves all unknowns, and adds no operational capability. |

## 3. Exact route scope and current operational profile

| Operating group | Route forms | Existing value-free basis | Required future control |
| --- | --- | --- |
| Extreme unfiltered MQA and unestablished details | `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswerssupports`; `/api/motionsquestionsanswerssupports/:id` | Events, questions, and supports did not return headers or complete a full audit within the existing bounded observations; the event/support detail-key contracts are unestablished. | No whole-collection relay, polling, or capture proposal until a separately evidenced source-supported bounded method exists. Detail forms need their own contract evidence. |
| Whole-history motions | `/api/motionsquestionsanswersmotions`; `/api/motionsquestionsanswersmotions/:id` | The collection completed once at about 110 MB; the detail-key contract remains unestablished. | Treat collection and detail independently. Any later collection action needs a source-window, body-size, cancellation, and no-buffering plan; the detail form needs its own contract evidence. |
| Filtered motions | `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | Consideration was about 1.3 MB in first pass; programme completed once at about 3.6 MB. | Treat filters as separate exact forms. Do not infer a complete motion series, bill linkage, or shared behaviour from either filter. |
| Questions detail/year | `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswersquestions?year=:year` | One annual 2026 form completed at about 6.5 MB; detail contract is unestablished. | Year is a distinct source window, not proof of annual completeness. Detail needs its own contract evidence. |
| Committee official reports | `/api/Orscommitteemeeting/:id`; `/api/orscommitteemeeting?year=:year` | One annual response was about 150 MB; a transient detail candidate returned an empty object. | Annual work must be a single declared year unit with no server-side buffering, explicit transfer budget, manifest/reconciliation design for later DB1, and an empty-detail state preserved. |
| Plenary official reports | `/api/orsplenarymeeting/:id`; `/api/orsplenarymeeting?year=:year` | One annual response was about 124 MB; a transient detail candidate returned an empty object. | Same annual-unit/no-buffering/manifest controls; no detail-key or report-content meaning is inferred. |
| Votes on motions | `/api/votesmotion/:id`; `/api/votesmotion?year=:year` | Annual sample: about 13.3 MB in 2011 and 19.4 MB in 2026; 2010 annual form failed; detail candidates were 404 or empty. | Annual form is a declared year unit. Preserve observed failure/empty states; do not infer vote, stage, financial-resolution, or bill-amendment meaning. |

## 4. Proposed shared operational controls

Every later source-facing, relay, capture, or DB1 proposal for a scoped form
would state and verify all applicable controls below.

| Control | Requirement |
| --- | --- |
| Source window | Use only the exact approved collection, detail, filter, or year form. A year is a source retrieval window, not an assertion of coverage or completeness. |
| Response budget | Declare expected historical size range where observed, a timeout, maximum concurrent requests, cancellation behaviour, and a response-size warning. Never silently substitute another form. |
| Streaming and memory | Stream response bytes end-to-end for any later relay/capture. Do not buffer whole large responses in the API process, frontend, logs, cache, or analytics tooling. |
| Failure disclosure | Preserve timeout, source error, empty object, incomplete transfer, and cancellation as visible route/run states. No retry, fallback, inferred record, or stale copy may disguise them. |
| DB1 prerequisites | Before capture, define immutable run manifest, byte/content digest, retrieval timestamps, failed/incomplete run state, bounded retry policy, resumability, reconciliation/lookback rule, source-drift comparison, and deletion/correction approach. |
| Updateability | Do not rely on source validators or a source date field as a change watermark unless a route-specific future assessment establishes that meaning. |
| Semantic boundary | Do not translate route material into a bill, stage, vote, member, report, relationship, or legislative-outcome claim without a later Tier 1/2 or Tier 3+ specification. |

## 5. Non-negotiable vote and document boundary

This framework does not treat votes on motions as votes on bill amendments.
Motion-amendment votes, Stage 1 votes, financial-resolution votes, Stage 3
votes, and bill-amendment votes remain separate claims requiring their own
source/variable evidence. Official-report routes remain source/report material
for later extraction and validation design; this proposal creates no Tier 3
extraction pathway.

## 6. Stop conditions

Stop an affected route/action if:

- the source form requires an unapproved parameter, identifier, volume, request
  cadence, alternate host, or collection strategy;
- observed size, latency, failure mode, or source behaviour exceeds the agreed
  response budget;
- handling, terms, access, retention, or public-output conditions are not
  completed for that exact action; or
- the action would imply a semantic or coverage claim outside its evidence.

The stop is local to that route/action. It does not retire a form from the
DEC-0045 inventory or block a separately approved route.

## 7. What approval would enable next

If approved, the next permitted work is a repository-only operational register
for all 17 forms, applying these controls and recording their present
unavailable states. It would not make a new source request. Any later relay,
capture, or DB1 package would remain exact, route/action-specific, and require
its own owner approval.
