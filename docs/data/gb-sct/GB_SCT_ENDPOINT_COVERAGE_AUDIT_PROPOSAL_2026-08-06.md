# GB-SCT endpoint-coverage and academic-access audit

**Status:** proposed no-retention source audit — no source action authorised  
**Date:** 6 August 2026  
**Depends on:** DEC-0115 and the limited [detail/filter sample comparison](GB_SCT_DETAIL_FILTER_SAMPLE_COMPARISON_RESULT_2026-08-06.md)

## 1. Purpose

Before deciding the final DB1 capture model, establish whether the 31
parameterised/detail forms contain source content that is absent from their
parent collection or annual response. The audit will also record whether the
parent response appears capable of supporting the kinds of raw source access
future academic users will need—without creating variables, codebooks or
research conclusions.

This corrects the earlier wrong ordering: evidence comes before deciding that
a detail route is either redundant or independently retained.

## 2. Questions answered for every audited form

For every form in scope, the durable result will answer:

1. What response structure and source field names were observed in the parent
   and in the sampled detail/filter response?
2. Was the sampled detail/filter result a field/structure subset, did it expose
   additional fields, was it structurally different, or was comparison not
   reliable?
3. Does the parent response expose the raw source identifiers and temporal or
   reference fields needed to locate/describe its own records? This is a
   source-access observation, not an analytical-variable claim.
4. Does a researcher need the exact retained detail response to access observed
   source content, or could a future portal provide a clearly labelled
   DB1-derived view from the retained parent response?
5. What remains unknown: whole-route equivalence, temporal coverage, source
   completeness, identifier meaning, pagination, or a detail-key contract?

No individual sample will prove every possible identifier produces the same
response. The result categories deliberately say `SAMPLED_*`, never “fully
equivalent”.

## 3. Non-retention boundary

- Use only public Scottish Parliament API GET requests.
- Hold any identifier only in memory long enough to request one immediate
  comparison response; never write it to the repository, database, logs or
  audit result.
- Retain only route name, HTTP/transport outcome, approximate byte class,
  JSON root/field names, comparison category and limitation.
- Do not download files, capture bodies, create fixtures, call the Live API
  relay, access the VPS/database, alter code or publish output.
- A response body above the stated audit limit is cancelled and recorded as
  `TRANSFER_LIMIT_REACHED`, not retried or worked around.

## 4. Cohort A — ordinary collection/detail and filter comparison

### Scope and request bound

This is one bounded audit of the non-firehose families. It permits at most
**43 GET requests**: 19 parent/detail pairs (38 requests), one unfiltered MQA
links request plus three distinct filter forms (4 requests), and one allowance
for a single route-level transient retry after a transport failure.

It supersedes neither the earlier eight-request sample nor its evidence. The
sample is reused where it already answers a pair; the cap allows the audit to
be rerun coherently if needed, without expanding scope.

| Family | Parent route | Sampled route form | Pair count |
| --- | --- | --- | ---: |
| Bills and formal stages | `/api/bills`; `/api/billstages`; `/api/billstagetypes`; `/api/billtypes`; `/api/sessions` | Corresponding `/:id` form | 5 |
| Members, constituencies and regions | `/api/members`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionregionstatuses`; `/api/constituencies`; `/api/regions` | Corresponding `/:id` form | 5 |
| Parties and government roles | `/api/parties`; `/api/memberparties`; `/api/partyroles`; `/api/memberpartyroles`; `/api/governmentroles`; `/api/membergovernmentroles` | Corresponding `/:id` form | 6 |
| Committees | `/api/committees`; `/api/committeeroles`; `/api/committeetypes` | Corresponding `/:id` form | 3 |
| MQA links | `/api/motionsquestionsanswerseventlinks` | one sample for each `childUniqueId`, `mainUniqueId` and `parentUniqueId` filter form | 3 filter comparisons |

For each collection/detail pair, the transient audit selects one ordinary
identifier from that immediately received collection solely to make the named
detail request. It does not make a list, request a second identifier or derive
a later capture queue.

### Cohort A response limits

- maximum 5 MiB body read for a parent or detail response;
- 20-second request deadline;
- one request at a time;
- no retry after a body starts streaming; and
- at most one retry for a pre-body transport failure, within the total cap.

The limits intentionally make this an evidence audit, not a covert ingest.

## 5. Cohort B — high-volume and uncertain-detail contract audit

The following nine forms cannot safely be treated as ordinary pair comparison:

- `/api/motionsquestionsanswersevents` and `/:id`;
- `/api/motionsquestionsanswersmotions` and `/:id`;
- `/api/motionsquestionsanswersquestions` and `/:id`;
- `/api/motionsquestionsanswerssupports` and `/:id`;
- `/api/Orscommitteemeeting/:id`;
- `/api/orsplenarymeeting/:id`; and
- `/api/votesmotion/:id`.

The parent MQA collections have previously behaved as firehose routes. The
official-report and vote detail-key contracts are not established: an earlier
transient detail attempt returned an empty object or an error, which does not
identify the correct key. Treating such values as a reusable input universe
would repeat the earlier mistake.

Therefore Cohort B is a separate proposal after Cohort A review. It must
declare, for each family, the permitted source-supported route observation,
maximum transferred bytes, cancellation method and exact question. Its purpose
is to establish whether a reliable comparison is possible—not to force a
detail request merely to fill a table cell.

The annual parent routes remain separately visible in the proposed 117-unit
baseline. Their content and researcher usefulness will be audited as annual
source responses, not assumed from the unresolved `/:id` forms.

## 6. Result categories

Every Cohort A comparison receives exactly one result:

| Result | Meaning |
| --- | --- |
| `SAMPLED_SUBSET` | The sampled detail/filter response has no observed additional fields and its object/rows are present in the parent response held transiently for comparison. |
| `ADDITIONAL_FIELDS_OBSERVED` | The sampled detail/filter response exposes at least one field or source structure not observed in the parent. |
| `STRUCTURALLY_DIFFERENT` | The route is not a like-for-like object/row comparison even if it has overlapping content. |
| `NO_RELIABLE_COMPARISON` | The identifier/key contract, parent relation or response class does not allow an honest comparison. |
| `SOURCE_UNAVAILABLE` | The source returned an availability/error condition. |
| `TRANSFER_LIMIT_REACHED` | The bounded audit stopped before a safe comparison. |

The corresponding research-access assessment is limited to one of:
`PARENT_POTENTIALLY_SUFFICIENT`, `DIRECT_ROUTE_MAY_BE_NEEDED`, or
`UNRESOLVED`. These are planning labels, not public claims or DB2 variables.

## 7. Completion and decision rule

Cohort A passes only when every listed pair/filter form has a result category
and a recorded limitation. It does **not** pass merely because a request
completed.

After Cohort A, the owner receives one short route-coverage table showing:

- forms sampled as potential parent subsets;
- forms with observed additional or different content;
- forms that could not be compared; and
- the recommended DB1 treatment: direct retention, provisional parent-based
  representation, or a dedicated Cohort B contract audit.

Only that evidence may change the response-unit matrix. No route is removed
from the approved 64-form inventory by this audit.

## 8. Authority requested

Approve or amend **Cohort A only**: up to 43 public no-retention GET requests
under the boundaries above. Cohort B, DB1 implementation, source capture,
database work, scheduler work, frontend work and any route-coverage decision
remain out of scope.
