# GB-SCT Cohort B no-retention audit result

**Status:** completed limited observation; no DB1 implementation or capture authorised  
**Date:** 6 August 2026  
**Decision:** DEC-0119  
**Proposal:** [Cohort B proposal](GB_SCT_DB1_COHORT_B_AND_FINAL_RESPONSE_UNIT_PROPOSAL_2026-08-06.md)

## Outcome

The intended test was simple: does a sampled detail response already appear in
its parent response? It completed where the source delivered a usable parent
body, and stopped where the source failed, exceeded the agreed safety limit, or
did not accept the ordinary parent identifier.

Fifteen public requests were made: ten named parents and five paired details.
No retry was used. The other five detail requests were not made because their
parents had already returned an explicit source/transfer condition. No raw
body, identifier, object, response URL containing an identifier, or payload
was retained.

| Route family | Outcome | Meaning |
| --- | --- | --- |
| Member constituency status | SAMPLED_PARENT_MATCH | The sampled detail object matched an object in the parent response. |
| Member region status | SAMPLED_PARENT_MATCH | The sampled detail object matched an object in the parent response. |
| MQA event subtypes | SAMPLED_PARENT_MATCH | The sampled detail object matched an object in the parent response. |
| MQA events | SOURCE_UNAVAILABLE | Parent returned HTTP 500; no detail request made. |
| MQA motions | TRANSFER_LIMIT_REACHED | Parent exceeded 50 MiB; no detail request made. |
| MQA questions | SOURCE_UNAVAILABLE | Parent returned HTTP 500; no detail request made. |
| MQA supports | TRANSFER_LIMIT_REACHED | Parent exceeded 50 MiB; no detail request made. |
| Committee Official Reports | NO_RELIABLE_COMPARISON | The 2026 annual parent was readable, but its ordinary ID did not work at the detail route (HTTP 404). |
| Plenary Official Reports | TRANSFER_LIMIT_REACHED | The 2026 annual parent exceeded 50 MiB; no detail request made. |
| Votes on Motions | NO_RELIABLE_COMPARISON | The 2026 annual parent was readable, but its ordinary ID did not work at the detail route (HTTP 404). |

The HTTP 500 and HTTP 404 outcomes are source-route conditions observed during
this audit. They do not mean that the underlying historical data is absent.

## Result for DB1 design

Cohort B confirms three more parent-backed access forms. It also establishes
that the remaining seven forms must stay visible as unresolved access forms in
the initial Database mirror model. Their parent collection/annual source
responses remain in the proposed raw PostgreSQL capture boundary.

This is sufficient to prepare the initial response-unit model now. It does not
justify an ID crawl, another exploratory loop, a source capture, or any
PostgreSQL implementation work.

