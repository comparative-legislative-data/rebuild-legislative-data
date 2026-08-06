# GB-SCT DB1 seven-route resolution proposal

**Status:** proposed; no source, database, VPS, code or frontend action authorised  
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
alternative URL, ID or workaround is invented.

### Part 2: complete the three large-parent comparisons

For MQA motions, MQA supports and the 2026 Plenary Official Reports response:

- retrieve one complete parent response in memory, one at a time;
- use one ordinary source-provided identifier only long enough to make the
  paired detail request;
- discard both bodies and the identifier when the comparison ends; and
- retain only the route, size, source result, field/shape summary and outcome.

The temporary limit is 200 MiB per response and five minutes per request. This
is evidence-based: previous observed source responses are about 110 MB for
motions and about 124 MB for plenary reports. It remains a one-off audit, not
an ingest or a normal operating limit.

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
| Two source-failure rechecks | 2 |
| Three large parent/detail comparisons | 6 |
| Source-documented-contract checks, only if an official contract names one exact non-ID input | 2 |
| Pre-body transport retry allowance | 2 |

No request is made merely to discover values. If no official contract supplies
a permitted value for the two report/vote detail forms, the relevant two
requests are not used.

## Completion rule

The final DB1 model is allowed to proceed only when all seven forms are
explicitly classified as either:

- a retained raw response/access form with its exact source contract; or
- a named upstream limitation with the companion data-bearing response retained.

It must state which is which. It must not call unresolved input contracts
“missing data,” and it must not call DB1 a full endpoint-by-endpoint mirror
where the source itself does not provide a usable endpoint contract.

## Authority requested

Approve or amend this 12-request maximum resolution action. It does not
authorise PostgreSQL, capture, source retention, ingestion, scheduler,
application, deployment or portal work.

