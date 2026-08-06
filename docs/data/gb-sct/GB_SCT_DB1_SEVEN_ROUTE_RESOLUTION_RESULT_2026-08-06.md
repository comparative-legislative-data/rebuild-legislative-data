# GB-SCT seven-route resolution result

**Status:** completed no-retention source action; no DB1 implementation authorised  
**Date:** 6 August 2026  
**Decision:** DEC-0121  
**Proposal:** [seven-route resolution proposal](GB_SCT_DB1_SEVEN_ROUTE_RESOLUTION_PROPOSAL_2026-08-06.md)

## Outcome

Eight public API requests were made, serially and without retaining source
bodies or identifiers. No retry was used.

| Form | Result | DB1 consequence |
| --- | --- | --- |
| MQA events detail | Parent still returned HTTP 500. | Preserve the named upstream condition; do not invent detail data. |
| MQA questions detail | Parent still returned HTTP 500. | Preserve the named upstream condition; annual source windows remain independently retained. |
| MQA motions detail | Sampled detail object exactly matched the first complete parent object. | Parent-backed raw database access is supported. |
| MQA supports detail | Detail route returned an empty object, not the sampled parent object. | Treat the detail form as an upstream source limitation; retain the data-bearing parent response. |
| Plenary Official Reports detail | Ordinary parent ID returned HTTP 404. | Treat the detail form as an upstream source limitation; retain annual report responses. |
| Committee Official Reports detail | Existing official route metadata plus prior controlled checks establish no usable ordinary-ID contract. | Treat the detail form as an upstream source limitation; retain annual report responses. |
| Votes on Motions detail | Existing official route metadata plus prior controlled checks establish no usable ordinary-ID contract. | Treat the detail form as an upstream source limitation; retain annual vote responses. |

The source limitations are not local failures and not claims of missing
historical data. They describe the current behaviour of the upstream detail
forms. DB1 must show them as such, and routine reconciliation must recheck the
named source route/parent unit rather than silently forgetting it.

## Completion statement

All 64 approved forms now have an explicit initial DB1 treatment:

- retain a named whole response;
- provide a source-faithful object/filter result from that retained response;
  or
- preserve an explicit upstream source limitation while retaining its
  data-bearing parent response where one exists.

No further source-form reconnaissance is proposed before the source-free
PostgreSQL foundation proof.

