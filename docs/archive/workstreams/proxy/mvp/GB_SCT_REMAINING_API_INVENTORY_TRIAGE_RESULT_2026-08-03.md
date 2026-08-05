# GB-SCT Remaining API Inventory Triage Result — 3 August 2026

**Status:** PASS — complete evidence-only triage; no additional immediate relay candidates

**Authority:** DEC-0067

## Method and boundary

This record classifies the 55 selected route forms not already accepted for
private no-retention pass-through. It reuses DEC-0045 and completed
reconnaissance/qualification evidence only. No source/API/portal request,
source content, code, VPS, database, DB1/DB2, cache, or public action occurred.

The classifications describe the current evidence gap, not a source fact or a
permanent retirement. They do not interpret identifiers, relationships, dates,
text, votes, events, committees, parties, offices, or legislative procedure.

## Route-by-route disposition

| Route forms | Current disposition | Basis / next workstream |
| --- | --- | --- |
| `/api/bills`; `/api/bills/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Existing Bills handling result is `DO_NOT_CAPTURE_OR_RELEASE`; use the established Bills gap-resolution sequence. |
| `/api/billstages`; `/api/billstages/:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Earlier qualification work stopped; field, detail-key, handling, and procedure meaning remain unresolved. |
| `/api/billstagetypes/:id`; `/api/billtypes/:id`; `/api/sessions/:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Detail forms remain outside their accepted collection-route contracts. |
| `/api/members`; `/api/members/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person, protected-content indicator, names, date, notes, and photo concerns are recorded. |
| `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person, relationship, notes, and validity-period handling is unresolved. |
| `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person, relationship, notes, and validity-period handling is unresolved. |
| `/api/constituencies/:id`; `/api/regions/:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Detail forms are not covered by the accepted collection access contract. |
| `/api/parties`; `/api/parties/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | `Notes` field is recorded; detail field parity was observed only structurally. |
| `/api/memberparties`; `/api/memberparties/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person/party relationship, validity, and handling concerns remain. |
| `/api/partyroles`; `/api/partyroles/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | `Notes` field is recorded. |
| `/api/memberpartyroles`; `/api/memberpartyroles/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person/relationship, notes, and validity handling is unresolved. |
| `/api/governmentroles`; `/api/governmentroles/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | `Notes` field is recorded. |
| `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Person/relationship and validity handling is unresolved. |
| `/api/committees`; `/api/committees/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | Description/contact/free-text and validity fields require handling assessment. |
| `/api/committeeroles`; `/api/committeeroles/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | `Notes` field is recorded. |
| `/api/committeetypes/:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Detail form remains outside accepted collection access. |
| `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswersevents/:id` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Collection is high-latency/extreme; detail-key contract is not established. |
| `/api/motionsquestionsanswerseventtypes/:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Detail form is structurally observed but outside accepted collection access. |
| `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id` | `BLOCKED_BY_KNOWN_HANDLING_CONCERN` | `IntroText` handling and taxonomy semantics remain unassessed. |
| `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `?mainUniqueId=:id`; `?parentUniqueId=:id` | `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` | Parameter/identifier contracts and link direction remain unresolved. |
| `/api/motionsquestionsanswersmotions`; `/api/motionsquestionsanswersmotions/:id` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Whole-history response is large and contains title/text/representational material; detail contract is unestablished. |
| `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`; `?motionfilter=programme` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Parameterised motion forms need content-handling and distinct source-window contract. |
| `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswersquestions/:id`; `?year=:year` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Whole collection is high-latency; annual form is multi-megabyte and parameterised; detail contract is unestablished. |
| `/api/motionsquestionsanswerssupports`; `/api/motionsquestionsanswerssupports/:id` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Whole collection is high-latency and detail contract is unestablished. |
| `/api/Orscommitteemeeting/:id`; `?year=:year` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Report text/person content and annual firehose size; detail returned an empty object in limited observation. |
| `/api/orsplenarymeeting/:id`; `?year=:year` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Report text/person content and annual firehose size; detail returned an empty object in limited observation. |
| `/api/votesmotion/:id`; `?year=:year` | `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` | Annual volume and vote/identifier-contract uncertainty; no bill-amendment or stage-vote claim. |

## Outcome and accelerated queue

No remaining form meets the narrow evidence threshold for immediate inclusion
in another fixed no-query raw-relay batch. This is a useful `PASS`: the simple
no-free-text reference/taxonomy/link collections have now been exhausted rather
than silently treated as a reason to relax handling or operational standards.

The remaining work reduces to three coherent packages:

1. **Handling batch:** person/contact/free-text/`Notes` and relationship
   families, beginning with an owner-approved policy/evidence approach rather
   than route-by-route relay implementation.
2. **Contract batch:** detail and parameterised forms, with exact identifier,
   query, and semantic-boundary evidence before any access proposal.
3. **Operational batch:** high-volume MQA, motions, questions, reports, and
   votes, with explicit source-window, response-size, failure, and later DB1
   implications. It must preserve the distinction between motion-amendment
   votes and bill amendments.

## What next

The recommended next proposal is the **handling batch**: a single evidence-only
decision defining how the project will assess the known person/contact/free-text
and `Notes` concerns across the affected routes. It would not make a legal
determination or enable any route. The contract and operational batches can be
prepared in parallel only if separately approved.
