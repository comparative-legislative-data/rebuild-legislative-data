# GB-SCT DB1 seven-route resolution proposal

**Status:** completed no-retention source action; final model prepared for owner review
**Date:** 6 August 2026  
**Proposed decision:** DEC-0121  
**Reason:** the previous initial model was incomplete and must not be treated as
approval to build DB1.

## The issue in ordinary language

Seven of the approved API forms do not yet have a usable Database mirror access
path. That does **not** mean seven lots of data have vanished. It means we have
not yet established how the Scottish Parliament itself expects those individual
detail URLs to be called, or whether their source data is already fully
available in a companion collection/year response.

The project must not call DB1 a complete mirror until each of the seven has one
of two honest outcomes:

1. **usable source route:** DB1 can retain the exact source response and provide
   the corresponding access form; or
2. **source limitation:** the Scottish Parliament does not presently supply a
   usable detail response under a documented input contract. DB1 preserves the
   data-bearing parent response and makes that source limitation explicit.

The unacceptable third option is to invent a list of IDs and crawl individual
pages until something appears to work.

## The seven route-specific facts

| Route | What we know | What must be decided |
| --- | --- | --- |
| MQA events detail | The whole collection returned HTTP 500 on the latest check. | Is this a temporary upstream failure, or the current source condition DB1 must record? |
| MQA questions detail | The whole collection returned HTTP 500 on the latest check. Annual year routes exist. | Same question; annual parent data is not the same as proving the whole-detail contract. |
| MQA motions detail | The source whole-history parent is about 110 MB. The 50 MiB audit limit was too small to test it. | Can a bounded full response demonstrate the relationship without a crawl? |
| MQA supports detail | Parent exceeded the 50 MiB audit limit. | Same question. |
| Plenary Official Report detail | An annual parent can be about 124 MB. The 50 MiB audit limit was too small. | Can a bounded annual response demonstrate the relationship without a crawl? |
| Committee Official Report detail | A normal parent record ID did not work. Earlier attempts with another nested ID returned an empty object. | Does the source publish a real input contract? If not, record an upstream limitation rather than invent one. |
| Vote on Motion detail | A normal parent record ID did not work. An earlier nested-ID attempt produced an empty response. | Same decision: documented source contract or explicit upstream limitation. |

## Proposed one-time resolution action

This is not another broad investigation. It is one final, deliberately small
action with two parts.

### Part 1: retry only the two source failures

Make one GET request to each whole-parent route:

- MQA events;
- MQA questions.

If either continues to return a source error, stop for that route. DB1 will
later preserve the named upstream condition on its normal scheduled check. No
alternative URL, ID or workaround is invented. If a parent has recovered, use
one reserved immediate detail request against its ordinary source identifier;
otherwise the route would remain unresolved despite recovery.

### Part 2: complete the three large-parent comparisons

For MQA motions, MQA supports and the 2026 Plenary Official Reports response:

- stream only until the first complete top-level source object is received,
  then stop the parent transfer;
- use its ordinary source-provided identifier only long enough to make the
  paired detail request;
- discard the partial parent body, the complete sampled object and the
  identifier when the comparison ends; and
- retain only the route, size, source result, field/shape summary and outcome.

The temporary limit is 20 MiB of parent stream and two minutes per request.
This is sufficient for one complete sampled object while avoiding a needless
110–150 MB whole-response transfer to this Mac. It remains a one-off audit,
not an ingest or a normal operating limit.

### Part 3: do not guess the two undocumented detail contracts

For Committee Official Reports and Votes on Motions, no further trial-and-error
ID requests are proposed. Existing checks already show that apparent IDs do
not establish a working detail contract.

The resolution record will state one of:

- a source-documented contract was found in the official API material, and a
  separate exact request proposal is needed; or
- no usable source-documented contract is available, so the annual response is
  the data-bearing mirror unit and the detail URL is displayed as an upstream
  limitation.

This is the only honest way to avoid inventing a route contract.

## Request bound

At most 12 source requests:

| Purpose | Planned maximum |
| --- | ---: |
| Two source-failure parents plus recovered-route detail follow-up | 4 |
| Three large parent/detail comparisons | 6 |
| Pre-body transport retry allowance | 2 |

No request is made merely to discover values. The two report/vote contracts are
resolved from existing official route metadata and observed source behaviour:
without a published usable contract, they are recorded as upstream limitations
rather than subjected to further trial-and-error requests.

## Completion rule

The final DB1 model is allowed to proceed only when all seven forms are
explicitly classified as either:

- a retained raw response/access form with its exact source contract; or
- a named upstream limitation with the companion data-bearing response retained.

It must state which is which. It must not call unresolved input contracts
“missing data,” and it must not call DB1 a full endpoint-by-endpoint mirror
where the source itself does not provide a usable endpoint contract.

## Execution record

The owner approved this action on 6 August 2026. Eight public no-retention
requests were made. The results classify every previously unresolved form as a
parent-backed access form or an explicit upstream source limitation. See the
[resolution result](GB_SCT_DB1_SEVEN_ROUTE_RESOLUTION_RESULT_2026-08-06.md)
and the [final initial DB1 model](GB_SCT_FINAL_INITIAL_DB1_RESPONSE_UNIT_MODEL_2026-08-06.md).
No PostgreSQL, capture, source retention, ingestion, scheduler, application,
deployment or portal work is authorised.
