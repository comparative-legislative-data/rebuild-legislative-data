# GB-SCT endpoint-coverage and academic-access audit — Cohort A result

**Status:** completed no-retention source audit; no DB1 implementation or capture authorised
**Date:** 6 August 2026
**Decision:** DEC-0118
**Proposal:** [Cohort A audit proposal](GB_SCT_ENDPOINT_COVERAGE_AUDIT_PROPOSAL_2026-08-06.md)

## Plain-English outcome

This was a small check of whether selected Scottish Parliament API detail and
filter routes appear to expose information already present in their parent
collection. It was not an ingest, a capture, a test of every identifier, or a
decision to omit any route from the long-term 64-form inventory.

For 20 sampled comparisons, the immediate detail or filter response was an
exact match for the corresponding object or row(s) temporarily held from the
parent response. That is useful evidence that these routes may be alternate
ways of accessing the same raw source content. It is not proof of whole-route
equivalence. Two Member-status collections were observed, but their detail
forms were not compared after a contained spelling error consumed two requests
inside the fixed audit cap.

No response body, identifier, raw object, URL containing a resolved identifier,
or source payload was retained. No VPS, PostgreSQL database, application code,
proxy, scheduler, download, or frontend was accessed or changed.

## Boundary and execution record

- **Request ceiling:** 43 public GET requests, serial, with a 5 MiB transfer
  ceiling and 20-second deadline per request.
- **Requests made:** 42. No retry allowance was used.
- **Working data:** request bodies and any sample identifiers existed only in
  process memory for the immediate comparison, then were discarded.
- **Durable evidence:** route names, HTTP outcome, approximate byte count,
  JSON root, field names, result category, and limitations only.

### Contained route-name mistake

Two attempted requests used singular route names for the Member election-status
collections. Both returned HTTP 404 and carried no source data. The correct
plural collection routes were then checked with the two remaining requests in
the approved 42-request execution total. To respect the fixed cap, their
paired detail requests were not made. The mistake is recorded here rather than
represented as a Scottish Parliament data absence.

## Results

SAMPLED_SUBSET means that the immediately sampled detail object, or every row
returned by the immediately sampled filter, was found unchanged in the parent
response held in memory. PARENT_POTENTIALLY_SUFFICIENT is a planning label; it
does not say the parent covers every possible detail response.

| Parent route / filter form | Parent shape observed | Sampled comparison | Result | Access label | Limitation |
| --- | --- | --- | --- | --- | --- |
| /api/bills → /:id | 473-object array; 7 fields | Same 7 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/billstages → /:id | 1,754-object array; 4 fields | Same 4 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/billstagetypes → /:id | 34-object array; 4 fields | Same 4 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/billtypes → /:id | 7-object array; 2 fields | Same 2 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/sessions → /:id | 6-object array; 5 fields | Same 5 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/members → /:id | 416-object array; 9 fields | Same 9 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/memberelectionconstituencystatuses | 523-object array; 8 fields | Correct parent observed; detail not requested | NO_RELIABLE_COMPARISON | UNRESOLVED | Fixed cap preserved after route-name mistake |
| /api/memberelectionregionstatuses | 413-object array; 8 fields | Correct parent observed; detail not requested | NO_RELIABLE_COMPARISON | UNRESOLVED | Fixed cap preserved after route-name mistake |
| /api/constituencies → /:id | 223-object array; 7 fields | Same 7 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/regions → /:id | 29-object array; 5 fields | Same 5 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/parties → /:id | 14-object array; 9 fields | Same 9 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/memberparties → /:id | 976-object array; 6 fields | Same 6 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/partyroles → /:id | 548-object array; 4 fields | Same 4 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/memberpartyroles → /:id | 1,509-object array; 6 fields | Same 6 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/governmentroles → /:id | 251-object array; 3 fields | Same 3 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/membergovernmentroles → /:id | 381-object array; 5 fields | Same 5 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/committees → /:id | 169-object array; 9 fields | Same 9 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/committeeroles → /:id | 8-object array; 3 fields | Same 3 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| /api/committeetypes → /:id | 3-object array; 2 fields | Same 2 fields and exact sampled object | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One sample only |
| event links child filter | Parent: 5,721-row array; 3 fields | One returned row unchanged in parent | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One temporary value only |
| event links main filter | Parent: 5,721-row array; 3 fields | One returned row unchanged in parent | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One temporary value only |
| event links parent filter | Parent: 5,721-row array; 3 fields | One returned row unchanged in parent | SAMPLED_SUBSET | PARENT_POTENTIALLY_SUFFICIENT | One temporary value only |

No ADDITIONAL_FIELDS_OBSERVED, STRUCTURALLY_DIFFERENT, SOURCE_UNAVAILABLE, or
TRANSFER_LIMIT_REACHED result occurred in Cohort A.

## What this does and does not establish

It establishes a sensible fact for the next design decision: many ordinary
detail routes and the three MQA link filters may be served from an exact
retained parent response, if a future broader, route-specific evidence package
confirms the capture and access design.

It does **not** establish:

- that every detail identifier returns an equivalent object;
- that details can be removed from the 64-form inventory;
- the correct capture window for high-volume MQA, official-report, or vote
  routes;
- any researcher-facing database or portal behaviour; or
- that PostgreSQL ingest, reconciliation, scheduling, or public access may
  begin.

## Recommended next decision

Prepare a short, separately bounded **Cohort B / capture-boundary proposal**.
It should first resolve the high-volume MQA, official-report, vote, and MQA
event-subtype routes, then translate the entire 64-form inventory into one
owner-reviewable PostgreSQL response-unit model. It must not infer a capture
queue from collection identifiers. The two untested Member-status detail forms
should be included explicitly in that proposal rather than silently assumed.

Only after owner approval of that final response-unit model should the
source-free PostgreSQL foundation package and then actual DB1 ingest be
considered.
