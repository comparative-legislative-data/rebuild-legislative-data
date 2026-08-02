# GB-SCT Master Endpoint Delivery Matrix — DEC-0045

**Status:** Approved planning control — no source request, proxy, capture,
database, application, or public action authorised

**Version:** 1.8.0

**Prepared:** 2 August 2026

**Decision:** DEC-0045, approved by the project owner on 2 August 2026

## 1. Purpose and binding scope

This matrix operationalises the owner's inclusion-first instruction. Every
route form in the approved DEC-0007 inventory remains in scope for eventual
upstream pass-through and DB1 preservation. A route is not removed because it
is high-volume, lacks an immediate Tier 1/2 use, or has not yet been observed.

`INTENDED` is a planning target, not availability. Each route still requires
route-specific terms, access, data-handling, response-shape, and operational
qualification before it can be requested, relayed, captured, or exposed. A
qualification failure blocks the affected route; it does not silently retire
it. Retirement needs an explicit owner decision with recorded evidence.

This document is the active route-level planning control. It does not modify
DEC-0007's selected inventory, create a new source claim, or authorise any
external interaction.

### 1.1 Controlled additions

The matrix is deliberately extensible. If a relevant Scottish Parliament route
is discovered later, or a new relevant route becomes available, it may be
added without reopening or weakening the existing 64-route scope. The addition
must have its own dated row and route-addition record containing: the exact
route form and documented parameters; discovery source/time; intended
pass-through, DB1, and Tier 1/2 position; likely data/terms considerations;
priority; and a route-specific qualification plan.

The owner must explicitly approve that addition before any source request,
proxy, capture, or exposure. Until then it is `CANDIDATE_ADDITION`, not part
of the approved operational inventory. This prevents both accidental omission
and silent scope expansion.

## 2. Matrix legend

| Field | Meaning |
| --- | --- |
| Pass-through | `INTENDED_AFTER_QUALIFICATION` means the route is intended for the direct, visibly labelled upstream-access layer after its own approval and beta acceptance. |
| DB1 | `INCLUDED` means the route remains in the intended selected scope for immutable raw capture/projection after a future capture-batch approval. |
| Tier 1/2 position | A research-variable roadmap, never a field-level claim. `CANDIDATE` requires observed fields and a later specification; `DEFERRED` means no current Tier 1/2 analytical variable is proposed. |
| Priority | Delivery order only: `P1` bill/session foundation, `P2` contextual structured data, `P3` high-volume/future structured material, `P4` report/vote material whose immediate analytical use is deferred. It never means exclusion. |
| Qualification | `NOT_STARTED`; `TERMS_PARTIAL` means only the DEC-0044 terms result exists; `OBSERVATION_REQUIRED` means an API-response observation package is still needed. |

## 3. Route-level master matrix

| Group | Exact source route form | Pass-through | DB1 | Tier 1/2 position | Priority | Qualification |
| --- | --- | --- | --- | --- | --- |
| Bills | `/api/bills` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` only: observed field names/types include possible identity/title fields; no semantic/field claim yet | `P1` | `TERMS_PARTIAL; OBSERVATION_PASS; HANDLING_DO_NOT_CAPTURE_OR_RELEASE; GAP_RESOLUTION_APPROVED_DEC0050; DOC_INSPECTION_PARTIAL_DEC0052; G4_BLOCKED_DEC0053` |
| Bills | `/api/bills/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` bill detail fields; no field claim yet | `P1` | `TERMS_PARTIAL; OBSERVATION_PASS; HANDLING_DO_NOT_CAPTURE_OR_RELEASE; GAP_RESOLUTION_APPROVED_DEC0050; DOC_INSPECTION_PARTIAL_DEC0052; G4_BLOCKED_DEC0053` |
| Formal stages | `/api/billstages` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; possible `CANDIDATE_T2` ordering only after rules | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Formal stages | `/api/billstages/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; possible `CANDIDATE_T2` ordering only after rules | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Stage types | `/api/billstagetypes` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` source-defined types | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Stage types | `/api/billstagetypes/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` source-defined types | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Bill types | `/api/billtypes` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` source-defined types | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Bill types | `/api/billtypes/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` source-defined types | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Sessions | `/api/sessions` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` identifiers/boundaries; `CANDIDATE_T2` assignment only after rules | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Sessions | `/api/sessions/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` identifiers/boundaries; `CANDIDATE_T2` assignment only after rules | `P1` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Members | `/api/members` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` identity fields | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Members | `/api/members/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` identity fields | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member constituency status | `/api/memberelectionconstituencystatuses` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; date-state `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member constituency status | `/api/memberelectionconstituencystatuses/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; date-state `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member region status | `/api/memberelectionregionstatuses` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; date-state `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member region status | `/api/memberelectionregionstatuses/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; date-state `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Constituencies | `/api/constituencies` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Constituencies | `/api/constituencies/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Regions | `/api/regions` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Regions | `/api/regions/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Parties | `/api/parties` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Parties | `/api/parties/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member parties | `/api/memberparties` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time party `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member parties | `/api/memberparties/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time party `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Party roles | `/api/partyroles` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Party roles | `/api/partyroles/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member party roles | `/api/memberpartyroles` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time role `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member party roles | `/api/memberpartyroles/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time role `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Government roles | `/api/governmentroles` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Government roles | `/api/governmentroles/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member government roles | `/api/membergovernmentroles` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time role `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Member government roles | `/api/membergovernmentroles/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; point-in-time role `CANDIDATE_T2` only after interval rules | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committees | `/api/committees` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; no membership/assignment inference | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committees | `/api/committees/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; no membership/assignment inference | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee roles | `/api/committeeroles` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee roles | `/api/committeeroles/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee types | `/api/committeetypes` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee types | `/api/committeetypes/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1` | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee type links | `/api/committeetypelinks` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `CANDIDATE_T1`; relationship semantics unknown | `P2` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA events | `/api/motionsquestionsanswersevents` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA events | `/api/motionsquestionsanswersevents/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event types | `/api/motionsquestionsanswerseventtypes` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event types | `/api/motionsquestionsanswerseventtypes/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event subtypes | `/api/motionsquestionsanswerseventsubtypes` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event subtypes | `/api/motionsquestionsanswerseventsubtypes/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event links | `/api/motionsquestionsanswerseventlinks` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event links | `/api/motionsquestionsanswerseventlinks?childUniqueId=:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event links | `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA event links | `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA motions | `/api/motionsquestionsanswersmotions` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA motions | `/api/motionsquestionsanswersmotions/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA business motions | `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA business motions | `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA questions | `/api/motionsquestionsanswersquestions` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA questions | `/api/motionsquestionsanswersquestions/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA questions | `/api/motionsquestionsanswersquestions?year=:year` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA supports | `/api/motionsquestionsanswerssupports` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| MQA supports | `/api/motionsquestionsanswerssupports/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_CURRENT_BILL_T1_T2` | `P3` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee official reports | `/api/Orscommitteemeeting/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `DEFERRED_TIER3_PLUS; NO_CURRENT_ANALYTICAL_T1_T2` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Committee official reports | `/api/orscommitteemeeting?year=:year` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `DEFERRED_TIER3_PLUS; NO_CURRENT_ANALYTICAL_T1_T2` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Plenary official reports | `/api/orsplenarymeeting/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `DEFERRED_TIER3_PLUS; NO_CURRENT_ANALYTICAL_T1_T2` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Plenary official reports | `/api/orsplenarymeeting?year=:year` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `DEFERRED_TIER3_PLUS; NO_CURRENT_ANALYTICAL_T1_T2` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Votes on motions | `/api/votesmotion/:id` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_BILL_AMENDMENT_OR_STAGE_VOTE_CLAIM` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |
| Votes on motions | `/api/votesmotion?year=:year` | `INTENDED_AFTER_QUALIFICATION` | `INCLUDED` | `FUTURE_T1_FIELD_ASSESSMENT; NO_BILL_AMENDMENT_OR_STAGE_VOTE_CLAIM` | `P4` | `NOT_STARTED; OBSERVATION_REQUIRED` |

## 4. Qualification and delivery discipline

The matrix must be updated only by adding route-specific evidence or an owner
decision. It is not valid to infer one route's response contract, data class,
or technical limits from another route in the same group.

For each route, the evidence record must eventually establish: terms/licence;
access/rate/parameter constraints; response content type/shape; identifier and
pagination behaviour; route-level handling classification; retention decision;
and the resulting pass-through and DB1 contract. Tier 1/2 variables require
their own later field-level specification and validation.

The current first operational-data candidate remains a separately proposed
limited observation of `/api/bills`. It must not expand to the other 63 forms,
DB1, or a proxy without a new explicit package. It will update this matrix with
evidence, not change its inclusion-first scope.

## 5. Owner decision

DEC-0045 records the owner’s instruction that all DEC-0007 selected route forms
remain in the intended eventual pass-through and DB1 scope unless the owner
later explicitly retires a route. It also retains a controlled path to add
newly discovered or newly available relevant routes through a route-addition
record and explicit owner approval. It authorises this planning matrix only.
