# GB-SCT Remaining Route Handling-Batch Result — 3 August 2026

**Status:** PASS — shared handling workstreams identified; no route enabled  
**Authority:** DEC-0068

## Method and boundary

This result reuses only existing repository evidence: the structural
reconnaissance records, the published-basis records, DEC-0061, DEC-0067, and
the retention/publication policy. It makes no source, API, portal, document,
VPS, database, or application request and retains no source body.

It does not classify any field or route as personal data, non-personal data,
or legally reusable. A field name is not treated as proof of its contents, and
no-retention access is not treated as resolving a handling concern.

## Route handling matrix

| Route forms | Existing concern and evidence | Not determined by this evidence-only step | Disposition |
| --- | --- | --- | --- |
| `/api/members`; `/api/members/:id`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id` | Member and representation records have existing evidence of person, protection-indicator, date, `Notes`, and time-varying relationship fields. | Content-level handling, route-specific conditions, and whether a raw private action is appropriate. | `REQUIRES_SHARED_HANDLING_POLICY_DECISION` — person/time-varying relationship workstream. |
| `/api/parties`; `/api/parties/:id`; `/api/partyroles`; `/api/partyroles/:id`; `/api/governmentroles`; `/api/governmentroles/:id`; `/api/committeeroles`; `/api/committeeroles/:id` | Existing party, government, and committee-role reconnaissance records `Notes` concerns. | The actual content and handling status of `Notes`, and any route-specific access conditions. | `REQUIRES_SHARED_HANDLING_POLICY_DECISION` — `Notes` workstream. |
| `/api/memberparties`; `/api/memberparties/:id`; `/api/memberpartyroles`; `/api/memberpartyroles/:id`; `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` | Existing reconnaissance identifies person-linked affiliation/role and validity relationships; some forms also carry `Notes` concerns. | Content-level handling, relationship semantics, and route-specific conditions. | `REQUIRES_SHARED_HANDLING_POLICY_DECISION` — person/time-varying relationship and `Notes` workstreams. |
| `/api/committees`; `/api/committees/:id` | Existing committees reconnaissance identifies description, contact, free-text, and validity concerns. | Content-level handling and whether any raw private action would be appropriate. | `REQUIRES_SHARED_HANDLING_POLICY_DECISION` — committee contact/description workstream. |
| `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id` | Existing MQA reconnaissance identifies `IntroText` and unresolved event-taxonomy semantics. | Content-level handling, semantic meaning, and route-specific conditions. | `REQUIRES_SHARED_HANDLING_POLICY_DECISION` — MQA `IntroText` workstream. |

## Outcome

All 24 route forms remain unavailable. Their handling backlog reduces to four
shared policy workstreams:

1. person and time-varying relationships;
2. `Notes`;
3. committee contact and description; and
4. MQA `IntroText`.

This is a planning reduction, not a route qualification. The result does not
enable a relay, DB1/DB2, capture, retention, variable, export, chart, or
public release.

## What next

Prepare one shared handling-policy design proposal. It should define the
evidence questions, possible route classes, and stop conditions for the four
workstreams without making a legal determination or authorising source access.
The contract and operational backlogs remain separate.
