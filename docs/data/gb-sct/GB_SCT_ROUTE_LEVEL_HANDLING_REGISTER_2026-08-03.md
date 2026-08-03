# GB-SCT Route-Level Handling Register — 3 August 2026

**Status:** Historical DB1/capture-planning evidence — 24 route-level records completed; no DB1/capture route enabled
**Authority:** DEC-0069

## 1. Scope and boundary

This register applies the DEC-0069 framework to the 24 non-Bills route forms
identified by DEC-0068. It reuses existing repository evidence only. At the
time of this record, no source, API, portal, documentation, VPS, database,
application, relay, capture, DB1, DB2, retention, download, chart, or public
action occurred.

The later DEC-0072 private raw-proxy MVP is closed and is separately archived.
It was a no-retention, fixed-route access layer; it does not change this
register's DB1/capture outcomes or make a route capture-ready.

Each row is a route-level handling record for the current proposed action set:
source-facing access, raw capture, DB1 projection, DB2 use, and public output.
It is not a classification of source content or a legal conclusion. The same
route may be assessed differently only under a later, explicitly stated action
with new evidence and a new owner-approved package.

## 2. Shared controls applied to every row

Every row is assessed against the six DEC-0069 tests: scope/purpose, evidence
boundary, content/linkage screen, processing/minimisation, controls/lifecycle,
and stop/outcome. The following conditions are unresolved for every row:

- route-specific authority, terms, and permitted request/processing form;
- content-level handling evidence for the recorded signal(s);
- a necessary and minimised action purpose;
- accountable access/lifecycle, correction, restriction, and withdrawal
  controls for any retained or exposed material; and
- output-fit evidence sufficient to avoid an unsupported temporal,
  relationship, taxonomy, or research claim.

Accordingly, each route is `DO_NOT_CAPTURE_OR_RELEASE` for the current action
set. This is a restrictive project handling outcome, not a claim about the
underlying source or a retirement from DEC-0045's intended inventory.

## 3. Route-level register

| Route form | Recorded signals and evidence source | Additional route-specific question | Current outcome |
| --- | --- | --- | --- |
| `/api/members` | Person, protection-indicator, names, date, `Notes`, and photo signals — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether the proposed action needs any identified material, and what handling would apply. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/members/:id` | Same recorded structural signals; one detail response had the same observed field set — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberelectionconstituencystatuses` | Person, constituency relationship, note, and validity-period signals — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | What relationship and interval semantics would be implicated by the proposed action. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberelectionconstituencystatuses/:id` | Same recorded structural signals; one detail response had the same observed field set — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberelectionregionstatuses` | Person, region relationship, note, and validity-period signals — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | What relationship and interval semantics would be implicated by the proposed action. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberelectionregionstatuses/:id` | Same recorded structural signals; one detail response had the same observed field set — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberparties` | Person/party relationship and validity-period signals — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether the proposed action would create an unsupported point-in-time affiliation claim. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberparties/:id` | Same recorded structural signals; one detail response had the same observed field set — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberpartyroles` | Person/role relationship, `Notes`, and validity-period signals — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether the action would require unresolved role, interval, or free-text handling. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/memberpartyroles/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/membergovernmentroles` | Person/government-role relationship and validity-period signals — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether the action would create an unsupported office, interval, or occupancy claim. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/membergovernmentroles/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/parties` | `Notes` and validity-period signals — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | What content range and non-content provenance option would be supportable. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/parties/:id` | Same recorded structural signals; one detail response had the same observed field set — [contextual-reference reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/partyroles` | `Notes` signal — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | What content range and non-content provenance option would be supportable. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/partyroles/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/governmentroles` | `Notes` signal — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | What content range and non-content provenance option would be supportable. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/governmentroles/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/committeeroles` | `Notes` signal — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | What content range and non-content provenance option would be supportable. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/committeeroles/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/committees` | Description, contact, free-text, and validity signals — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether the action requires the recorded contact/description material and how it could be minimised. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/committees/:id` | Same recorded structural signals; one detail response had the same observed field set — [roles/committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md). | Whether detail access changes the necessary purpose, content, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/motionsquestionsanswerseventsubtypes` | `IntroText` and unresolved event-taxonomy-semantic signals — [MQA first-pass reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_MQA_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md); [DEC-0065 result](../../archive/data/gb-sct/proxy-mvp/GB_SCT_STRUCTURED_LINK_AND_EVENT_TAXONOMY_QUALIFICATION_RESULT_2026-08-03.md). | What text-content range and source-defined taxonomy limits must be established without implying an event interpretation. | `DO_NOT_CAPTURE_OR_RELEASE` |
| `/api/motionsquestionsanswerseventsubtypes/:id` | Same recorded structural signals; a detail form was structurally observed but remains unavailable — [DEC-0065 result](../../archive/data/gb-sct/proxy-mvp/GB_SCT_STRUCTURED_LINK_AND_EVENT_TAXONOMY_QUALIFICATION_RESULT_2026-08-03.md). | Whether detail access changes the necessary purpose, content, taxonomy limit, or controls. | `DO_NOT_CAPTURE_OR_RELEASE` |

## 4. Integrity checks

- The register contains exactly 24 route forms: 12 person/relationship forms,
  eight additional `Notes`-bearing taxonomy forms, two committee forms, and
  two MQA event-subtype forms.
- It records the existing evidence source and an explicit unresolved question
  for every route form.
- It assigns no field-level content, personal-data, semantic, temporal, or
  legal classification.
- It creates no handling-class exception and does not transfer a route outcome
  to another route.

## 5. What next

The handling batch is closed at the current evidence boundary. The fastest
independent next work is the **contract batch** for detail and parameterised
forms: prepare one evidence-only design defining the exact identifier,
parameter, and semantic-boundary questions required before any access package.
The high-volume operational batch remains separate.
