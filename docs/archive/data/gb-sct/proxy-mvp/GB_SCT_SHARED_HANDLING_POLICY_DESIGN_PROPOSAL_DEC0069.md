# GB-SCT Shared Handling-Policy Design Proposal — DEC-0069

**Status:** APPROVED — EXECUTED PASS; no route, content, or system action is authorised

**Result:** [`../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md`](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)

## 1. Decision requested

Approve a shared handling-policy framework for the 24 non-Bills GB-SCT route
forms identified by DEC-0068. The framework would make later route-level
handling records comparable, complete, and auditable without treating shared
signals as an automatic classification or approval for any individual route.

Approval would adopt this framework only. It would not authorise a source,
API, portal, documentation, VPS, database, application, relay, capture, DB1,
DB2, retention, download, chart, or public action.

## 2. Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | Proxy-phase qualification planning; all source and data layers remain separately gated. |
| Authority for this proposal | Owner instruction to proceed after the completed DEC-0068 handling-batch result. |
| Affected records | DEC-0008 policy and handling-record template; DEC-0045 matrix; DEC-0067 triage; DEC-0068 result; later route-specific qualification records. |
| Known uncertainty | Existing records describe structural signals and concerns, not content-level classifications, route-specific terms, permitted processing, or relationship semantics. |
| Smallest change | Add one reusable assessment framework. Do not amend route availability, handling class, source scope, or any system state. |
| Containment / rollback | The framework is documentation-only. If superseded, retain this decision and its adopted framework as an audit record; no operational rollback is required. |
| Verification | Review the framework against DEC-0008's required handling-record fields, confirm that all 24 forms remain explicitly unavailable, and retain a result record. |

## 3. Scope and non-transfer rule

The framework covers exactly these workstreams and route forms:

| Workstream | Route forms | Recorded concern that triggers the framework |
| --- | --- | --- |
| Person and time-varying relationships | `/api/members`; `/api/members/:id`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id`; `/api/memberparties`; `/api/memberparties/:id`; `/api/memberpartyroles`; `/api/memberpartyroles/:id`; `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` | Existing reconnaissance records person, protection-indicator, date, relationship, validity-period, and in some cases `Notes` or note signals. |
| `Notes` | The applicable forms above, plus `/api/parties`; `/api/parties/:id`; `/api/partyroles`; `/api/partyroles/:id`; `/api/governmentroles`; `/api/governmentroles/:id`; `/api/committeeroles`; `/api/committeeroles/:id` | Existing reconnaissance records `Notes` or note signals. |
| Committee contact and description | `/api/committees`; `/api/committees/:id` | Existing reconnaissance records description, contact, free-text, and validity signals. |
| MQA `IntroText` | `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id` | Existing MQA reconnaissance records `IntroText` and unresolved taxonomy semantics. |

The four workstreams are shared assessment aids, not route classes. A route
may involve more than one workstream. No evidence, handling outcome, terms
position, or access decision transfers automatically between route forms,
including collection and detail forms.

## 4. Proposed shared framework

Every later route-level handling record for a scoped form would complete the
following six tests before it can be proposed for any source-facing or
data-handling action.

| Test | Required record | Decision discipline |
| --- | --- | --- |
| 1. Scope and purpose | Exact source route form, parameter form, intended action, and why that action is necessary. | A raw private action, capture, DB1 projection, DB2 use, export, and public access are distinct proposed actions. One does not imply another. |
| 2. Evidence boundary | The existing structural evidence, any later authorised source/terms evidence, and the information still unknown. | Do not use a field name, public availability, or prior route outcome as proof of content or handling status. |
| 3. Content and linkage screen | Potential person, protection, contact, free-text, relationship, temporal, or taxonomy signal relevant to the intended action. | Record a signal as a question for assessment, not as a legal or semantic classification. |
| 4. Processing and minimisation | Proposed route/parameter/period limits; whether content must be transiently viewed, retained, indexed, linked, or released. | The least expansive action that can meet the stated purpose must be justified. No-retention does not itself resolve handling. |
| 5. Controls and lifecycle | Accountable role, access boundary, logging exclusions, retention/review, correction/restriction/withdrawal path, and public-provenance treatment. | Reuse DEC-0008 classes only after route-specific evidence supports an outcome. No class is assigned by this framework. |
| 6. Stop and outcome | Explicit unresolved condition, route-level disposition, and evidence needed for the next decision. | Any unresolved terms, content, linkage, retention, accountable-role, or output-fit question keeps the route unavailable. |

## 5. Workstream questions

The framework requires the following questions to be answered where the
relevant recorded signal is present. They are questions, not findings.

| Workstream | Questions that later route-specific work must answer |
| --- | --- |
| Person and time-varying relationships | What is the proposed unit and purpose? Could the intended action retain, link, expose, or infer person-related or historical relationship material? What date/interval and conflict semantics remain unresolved? What controls and minimisation are necessary for the exact action? |
| `Notes` | What is the actual content range under separately authorised evidence? Is the intended action necessary despite free-text uncertainty? What restriction, exclusion, or non-content provenance option is supportable? |
| Committee contact and description | What material could be present in description/contact fields? Does the intended action require it, and if not, can the proposed route/action be narrowed without misrepresenting the raw source? What lifecycle controls would apply? |
| MQA `IntroText` | What material could be present in introductory text, and what source-defined taxonomy limits remain? Does the intended action imply an unvalidated event or category interpretation? What raw-access and publication limits would be needed? |

## 6. Possible route-level dispositions

Later completed records may recommend only a documented, route-specific
outcome. This proposal assigns none of them:

- `DO_NOT_CAPTURE_OR_RELEASE` where an essential condition is unresolved;
- a restricted DEC-0008 handling class for a specifically defined internal or
  reviewer purpose; or
- a later candidate for narrowly described private or public access, subject to
  an exact implementation/acceptance package and the relevant source,
  handling, and verification evidence.

`PUBLIC_PROVENANCE_ONLY` may accompany a restricted outcome only for
non-content methodology, manifest, and verification material. It never makes
source content available by implication.

## 7. Stop conditions

The framework stops route-specific progression where any one of these remains
unresolved for the proposed action:

- source authority, terms, licence, or permitted request form;
- actual content and the implications of collection, linkage, retention, or
  exposure;
- minimisation, accountable role, and access controls;
- retention, correction, restriction, or withdrawal design; or
- whether an intended output would create an unsupported relationship,
  temporal, taxonomy, or research claim.

The stop is local to the affected route/action. It does not retire the route
from DEC-0045's intended inventory or block unrelated workstreams.

## 8. What approval would enable next

If approved, the next proposed step is a bounded, repository-only application
of this framework to the four workstreams. It would produce route-level
handling records and explicit unresolved evidence needs, without inspecting a
source, assigning a legal classification, enabling a route, or changing any
system. Any later source inspection, relay, capture, DB1/DB2, or release would
still require its own exact owner-approved package.
