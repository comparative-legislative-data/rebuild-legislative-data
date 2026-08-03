# GB-SCT Remaining Route Handling-Batch Proposal — DEC-0068

**Status:** APPROVED — EXECUTED PASS; no route is enabled

**Result:** [`GB_SCT_REMAINING_ROUTE_HANDLING_BATCH_RESULT_2026-08-03.md`](GB_SCT_REMAINING_ROUTE_HANDLING_BATCH_RESULT_2026-08-03.md)

## Decision requested

Approve a repository-only handling assessment for these 24 non-Bills route
forms with existing evidence of person, relationship, contact, free-text,
`Notes`, or `IntroText` concerns:

| Family | Route forms |
| --- | --- |
| Members and representation | `/api/members`; `/api/members/:id`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id` |
| Party/government context | `/api/parties`; `/api/parties/:id`; `/api/memberparties`; `/api/memberparties/:id`; `/api/partyroles`; `/api/partyroles/:id`; `/api/memberpartyroles`; `/api/memberpartyroles/:id`; `/api/governmentroles`; `/api/governmentroles/:id`; `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` |
| Committees | `/api/committees`; `/api/committees/:id`; `/api/committeeroles`; `/api/committeeroles/:id` |
| MQA event subtypes | `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id` |

The assessment will reuse only the existing structural records, published
licence basis, retention/publication policy, and DEC-0067 triage. It will make
no API/portal/source/VPS/database/application request; retain no source body;
and enable no relay, DB1/DB2, variable, download, chart, or public release.

## Required result

For every listed route form, record: the known concern; which existing evidence
supports it; what cannot be determined without a later authorised source or
policy step; and one next disposition:

- `REQUIRES_ROUTE_SPECIFIC_HANDLING_EVIDENCE`;
- `REQUIRES_SHARED_HANDLING_POLICY_DECISION`; or
- `BLOCKED_PENDING_TERMS_OR_HANDLING`.

The result must not classify a field as personal data, non-personal data, or
legally reusable. It must not infer that a field name proves content, nor that
no-retention access automatically resolves a handling concern.

## Accelerated delivery outcome

Instead of twenty-four serial route packages, the result will identify the
smallest shared policy/evidence workstreams—for example person/relationship,
free-text/`Notes`, committee contact/description, and MQA introductory text.
Only a later exact decision may turn one of those workstreams into source
inspection, route qualification, or private access.

## What next

If approved, publish one route-level handling matrix and the minimum number of
follow-on decisions. The contract and operational batches remain separate.
