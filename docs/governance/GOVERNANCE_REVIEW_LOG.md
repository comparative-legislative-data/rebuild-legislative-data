# Governance Review Log

**Status:** Active control record

**Version:** 0.1.0
**Last updated:** 31 July 2026

## 1. Purpose and cadence

This log provides evidence that the project’s governing documents remain
current, mutually aligned, and followed. It does not replace the project design,
handover, governance procedure, decision register, or risk/dependency register.

A governance review is required:

- at least every 30 calendar days while work is active;
- at least every 90 calendar days while the project is dormant;
- before proposing the start or closure of a phase;
- before a public claim or release; and
- after a near-miss, material ambiguity, source-drift finding, methodology or
  security change, or any proposed scope expansion.

The owner may require a review at any other time. The next review date is a
maximum deadline, not a reason to defer a triggered review.

## 2. Review procedure

The maintainer prepares a dated review entry using the template below. The
reviewer checks the evidence; the project owner resolves any material issue or
approval requirement. An entry has one of these outcomes:

| Outcome | Meaning | Required action |
| --- | --- | --- |
| `PASS` | The reviewed documents are aligned within the stated scope. | Record the next due date and any watch items. |
| `CHANGES_REQUIRED` | A correctable inconsistency, omission, or stale item exists. | Block the affected work until the correction is reviewed. |
| `BLOCKED` | An owner decision or external fact is required to establish alignment. | Identify the decision/fact required; do not advance the affected work. |

Each review checks:

1. document status, version, dates, links, and stated active phase;
2. consistency between the project design, handover, governance procedure,
   decision register, and risk/dependency register;
3. that the active work has an explicit authorising decision and remains within
   its scope;
4. that no claim, status, or plan exceeds recorded evidence or approval;
5. that unresolved high risks and dependencies have an appropriate blocking
   response; and
6. whether any decision, risk, assumption, dependency, or durable instruction
   requires an update.

## 3. Entry template

```text
Review ID:
Date (UTC):
Review type: routine | phase gate | pre-claim | triggered
Trigger (if applicable):
Reviewer role:
Documents and records reviewed:
Active phase and authorising decision:
Checks performed and evidence:
Findings / required register updates:
Outcome: PASS | CHANGES_REQUIRED | BLOCKED
Affected work blocked (if any):
Owner decision required (if any):
Next review due:
```

## 4. Review entries

### GOV-REV-0001

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — Phase 0.1 governance-enforcement amendment |
| Reviewer role | Maintainer; owner approval of the amendment is recorded in DEC-0011 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `PHASE_0_DELIVERY_PLAN.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `AGENTS.md`, and this log |
| Active phase and authorising decision | Phase 0; DEC-0005 (Phase 0 documentation) and DEC-0011 (governance enforcement) |
| Checks performed | Scope remains documentation-only; no operational activity is stated or authorised; Phase A–E remain prospective; local document links and references were checked; all enforcement controls link to the designated registers; review triggers and outcomes are defined. |
| Findings | Add the Phase 0.1 controls to the plan, governance procedure, decision register, and risk/dependency register. No conflict with the design or handover identified. |
| Outcome | `PASS` for the documented Phase 0.1 scope. |
| Affected work blocked | Any work outside Phase 0 documentation remains blocked. |
| Owner decision required | None to publish this approved documentation amendment; separate owner approval remains required for all later phases. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0002

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of the project-design baseline |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0006 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `PHASE_0_DELIVERY_PLAN.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `AGENTS.md`, and this log |
| Active phase and authorising decision | Phase 0; DEC-0005 (Phase 0 documentation), DEC-0011 (governance enforcement), and DEC-0006 (approved design baseline) |
| Checks performed | Design status, decision status, handover wording, Phase 0 exit criteria, dependency wording, and the review record were aligned. The approved design does not authorise Phase A, source work, infrastructure, or implementation. |
| Findings | DEC-0007 remains the next owner decision. No conflict with the Phase 0 operational boundary identified. |
| Outcome | `PASS` for the documented approval-recording scope. |
| Affected work blocked | Phase A and all operational work remain blocked pending their specific owner approvals. |
| Owner decision required | DEC-0007 before a first source-slice proposal can proceed. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0003

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of Phase A planning-only documentation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0012 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `PHASE_A_PLAN.md`, `SOURCE_ASSESSMENT_PROTOCOL.md`, `SOURCE_SLICE_DECISION_MEMO_TEMPLATE.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `AGENTS.md`, and this log |
| Active phase and authorising decision | Phase 0 governance baseline with a Phase A planning pack; DEC-0012 |
| Checks performed | The new documents define evidence and approval requirements without naming a source or reporting source findings. Their scope excludes source access, capture, credentials, VPS/database activity, and implementation. DEC-0013 is proposed for a future bounded reconnaissance action; DEC-0007 remains proposed for a later source-slice decision. |
| Findings | Phase A planning is authorised; operational Phase A reconnaissance is not. The decision sequence avoids requiring source-slice evidence before reconnaissance is approved. |
| Outcome | `PASS` for the planning-only scope. |
| Affected work blocked | All external/source and technical actions remain blocked pending separate owner approval. |
| Owner decision required | DEC-0013 before source reconnaissance; a completed DEC-0007 proposal before any capture proposal. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0004

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of bounded DEC-0013 reconnaissance |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0013 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `PHASE_A_PLAN.md`, `RECONNAISSANCE_AUTHORIZATION_DEC0013.md`, `SOURCE_ASSESSMENT_PROTOCOL.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `AGENTS.md`, and this log |
| Active phase and authorising decision | Phase A catalogue reconnaissance; DEC-0013 |
| Checks performed | Target, permitted actions, working hypotheses, evidence output, and stop conditions are explicit. The authorisation excludes direct API calls, capture, credentials, database/VPS activity, code, and publication. |
| Findings | The owner-provided endpoint priorities are recorded as candidates, not observed source facts. |
| Outcome | `PASS` for the bounded reconnaissance scope. |
| Affected work blocked | Any direct endpoint request, raw capture, ingestion, technical implementation, or work outside the named target remains blocked. |
| Owner decision required | DEC-0007 after the assessment record, and a later capture proposal before any source-data capture. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0005

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — completion of bounded DEC-0013 catalogue reconnaissance |
| Reviewer role | Maintainer |
| Documents and records reviewed | `RECONNAISSANCE_AUTHORIZATION_DEC0013.md`, `GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`, `PHASE_A_PLAN.md`, `SOURCE_ASSESSMENT_PROTOCOL.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `HANDOVER.md`, and this log |
| Active phase and authorising decision | Phase A catalogue reconnaissance; DEC-0013 |
| Checks performed | The inspection was confined to the named catalogue and visible page content. No listed endpoint was opened. The assessment distinguishes observed catalogue statements, owner-provided candidates, and unresolved field/linkage/volume questions. |
| Findings | A narrow bill-core candidate is supported for DEC-0007 review. The motion and official-report groups remain future scope; their Tier 1/2 suitability is unresolved. |
| Outcome | `PASS` for the DEC-0013 scope. |
| Affected work blocked | Direct endpoint requests, raw capture, ingestion, implementation, and public claims remain blocked. |
| Owner decision required | DEC-0007 on the candidate source slice and its success criteria; DEC-0008 and a separate capture proposal before source-data capture. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0006

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of endpoint-inventory delivery model |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0014 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `PHASE_A_PLAN.md`, `ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md`, `ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `HANDOVER.md`, and this log |
| Active phase and authorising decision | Phase A endpoint-inventory specification; DEC-0014 |
| Checks performed | The model separates selected endpoint preservation, capture-backed native access, DB1 operational projection, Tier 1/2 canonical variables, and charts. The active documents preserve the prohibition on source-data capture and implementation. |
| Findings | DEC-0007 now selects the complete endpoint inventory and variable roadmap; the first canonical dataset remains deliberately narrow. |
| Outcome | `PASS` for the documented model revision. |
| Affected work blocked | Direct endpoint requests, capture, proxy/DB1 implementation, canonical builds, and charts remain blocked pending their specific later approvals. |
| Owner decision required | DEC-0007 and DEC-0008 before any capture/proxy/DB1 proposal. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0007

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — preparation of the DEC-0007 endpoint-inventory proposal |
| Reviewer role | Maintainer; metadata-only route inspection authority is recorded in DEC-0015 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `PHASE_A_PLAN.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`, `GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md`, `GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`, and this log |
| Active phase and authorising decision | Phase A endpoint-inventory specification; DEC-0012, DEC-0014, and DEC-0015 |
| Checks performed | The proposal names a selected route set, parameter forms, direct-native/DB1 status, exclusions, and variable-roadmap limits. Catalogue observations are separated from owner requirements and unresolved field/linkage questions. No listed API endpoint was opened or called; no source payload, capture, proxy/DB1 implementation, code, database/VPS activity, or public claim occurred. |
| Findings | The route inventory is ready for owner review as DEC-0007. Route listing is not treated as field or relationship evidence; a later source/capture assessment is still required before implementation or variable specification. |
| Outcome | `PASS` for the documentation-only DEC-0007 proposal-preparation scope. |
| Affected work blocked | Any source endpoint request, capture, proxy/DB1 work, canonical variable build, chart, or public data claim remains blocked. |
| Owner decision required | DEC-0007, then DEC-0008 and a separate capture/proxy/DB1 proposal before any source request or implementation. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0008

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner clarification of vote and document-source scope |
| Reviewer role | Maintainer |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md`, `GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`, and this log |
| Active phase and authorising decision | Phase A endpoint-inventory specification; DEC-0012, DEC-0014, and proposed DEC-0007 |
| Checks performed | The proposal now distinguishes votes on amendments to motions from any evidence concerning amendments to bills. The owner-provided statement that bill amendments lack an API endpoint is retained as an unverified scope constraint. A separate, later document-based programme is recorded without authorising document access, capture, extraction, coding, or implementation. |
| Findings | API and document-based work remain distinct. No amendment-related variable can claim bill-amendment evidence from `Votesmotion` alone. |
| Outcome | `PASS` for the documentation clarification. |
| Affected work blocked | All source requests, capture, document collection/parsing, proxy/DB1 work, canonical variable build, chart, and public data claim activity remains blocked. |
| Owner decision required | DEC-0007, then DEC-0008 and a separate capture/proxy/DB1 proposal before API work; a later separate owner decision before document-source work. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0009

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of DEC-0007 |
| Reviewer role | Maintainer; owner sign-off is recorded in DEC-0007 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `PHASE_A_PLAN.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md`, `GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`, and this log |
| Active phase and authorising decision | Phase A endpoint-inventory specification; DEC-0007 |
| Checks performed | The approved decision selects the exact API route inventory and its native-access/DB1 and variable-roadmap boundaries. The decision preserves the distinction between votes on motion amendments and bill amendments, defers document-based sources, and does not broaden operational authority. |
| Findings | DEP-0001 is satisfied. DEC-0008 and a separate capture/proxy/DB1 proposal remain mandatory before any API source request, capture, or implementation. |
| Outcome | `PASS` for recording the DEC-0007 approval. |
| Affected work blocked | API source requests, capture, proxy/DB1 implementation, document work, canonical builds, charts, and public claims remain blocked pending their specific later approvals. |
| Owner decision required | DEC-0008, then a separate bounded capture/proxy/DB1 proposal. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0010

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — preparation of the DEC-0008 policy proposal |
| Reviewer role | Maintainer; documentation-preparation authority is recorded in DEC-0016 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`, `SOURCE_HANDLING_RECORD_TEMPLATE.md`, and this log |
| Active phase and authorising decision | Phase A policy specification; DEC-0016 |
| Checks performed | The proposal separates raw capture, DB1, provenance metadata, canonical outputs, and public native access; it applies minimisation, route-level assessment, handling classes, retention/review, and correction/restriction controls. It is explicit that the proposed seven-year retention floor is a policy choice for owner review, not a legal conclusion. No source, VPS, database, credential, storage, code, or public-release action occurred. |
| Findings | The DEC-0008 proposal and route-level handling template are ready for owner review. Source-specific authority, terms, personal-data, and access evidence remains unresolved and is a stop condition for later work. |
| Outcome | `PASS` for the DEC-0008 proposal-preparation scope. |
| Affected work blocked | All source requests, capture, storage, proxy/DB1 implementation, document work, canonical builds, charts, and public release remain blocked. |
| Owner decision required | DEC-0008, then a separate bounded capture/proxy/DB1 proposal. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0011

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of DEC-0008 |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0008 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`, `SOURCE_HANDLING_RECORD_TEMPLATE.md`, and this log |
| Active phase and authorising decision | Phase A retention/publication policy; DEC-0008 |
| Checks performed | The approved policy establishes restrictive-by-default handling, the owner-approved seven-year minimum source-content retention floor, route-level handling records, and correction/restriction controls. It expressly preserves the separate approval requirement for any source request, storage implementation, public native access, or release. |
| Findings | DEP-0002 is satisfied. The next required artefact is a separate bounded capture/proxy/DB1 proposal, including completed source assessments and route-level handling records. |
| Outcome | `PASS` for recording the DEC-0008 approval. |
| Affected work blocked | All source requests, capture, storage, proxy/DB1 implementation, document work, canonical builds, charts, and public release remain blocked pending their specific later approvals. |
| Owner decision required | A separate bounded capture/proxy/DB1 proposal before any source request or implementation. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0012

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — preparation of the capture/proxy/DB1 plan proposal |
| Reviewer role | Maintainer; documentation-preparation authority is recorded in DEC-0017 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`, `RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`, `GB_SCT_CAPTURE_PROXY_DB1_PLAN_PROPOSAL.md`, `CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md`, and this log |
| Active phase and authorising decision | Phase A capture/proxy/DB1 planning; DEC-0017 |
| Checks performed | The plan retains the full approved API inventory while sequencing it into evidence-gated batches. It distinguishes separately authorised source-documentation/terms inspection from source-data request authorisation, then separates restricted raw capture, native access, DB1, and later canonical variables. Per-batch request caps/rates/parameters are deliberately unresolved until source evidence and owner approval exist. No external request, capture, storage, code, infrastructure, or public claim occurred. |
| Findings | DEC-0018 and its batch authorisation template are ready for owner review. The plan does not grant external or implementation authority. |
| Outcome | `PASS` for the capture/proxy/DB1 plan-preparation scope. |
| Affected work blocked | All source requests, capture, storage, proxy/DB1 implementation, document work, canonical builds, charts, and public release remain blocked. |
| Owner decision required | DEC-0018, then a G0 route-qualification package, a separately approved source-documentation/terms inspection, and a separately approved G1 batch authorisation before any source-data request. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0013

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — preparation of the VPS inventory/isolation plan |
| Reviewer role | Maintainer; documentation-preparation authority is recorded in DEC-0019 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md`, `VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md`, and this log |
| Active phase and authorising decision | Infrastructure/VPS planning only; DEC-0019 |
| Checks performed | The plan treats legacy DB1 as untrusted operational metadata, not reusable source data. It requires a host-specific read-only authorisation, excludes data/secrets/content reads, classifies project-owned versus unrelated components, and makes deletion/rebuild separate owner-approved gates. It does not select a deployment environment or authorise VPS access. |
| Findings | DEC-0020 and its V0 template are ready for owner review. DEC-0009 remains required before a new environment can be selected; an exact V0 authorisation remains required before any VPS connection. |
| Outcome | `PASS` for the VPS-plan preparation scope. |
| Affected work blocked | All VPS connections, credential use, database access, data extraction, deletion, provisioning, deployment, source capture, and application implementation remain blocked. |
| Owner decision required | DEC-0020, then an exact host-specific V0 authorisation before any VPS connection. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0014

| Field | Record |
| --- | --- |
| Date (UTC) | 31 July 2026 |
| Review type | Triggered — owner approval of DEC-0020 |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0020 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md`, `VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md`, and this log |
| Active phase and authorising decision | Infrastructure/VPS control planning only; DEC-0020 |
| Checks performed | The approved plan limits legacy DB1 treatment to redacted operational metadata, excludes content and secret reads, requires project-owned/unrelated/unresolved classification, and separates V0 authorisation, V1 inventory, V2 proposal, V3 change approval, and V4 clean rebuild. The decision does not select an environment or permit a VPS connection. |
| Findings | The VPS-control plan is approved. RSK-0012 and DEP-0004 continue to block actual VPS access until an exact host-specific V0 record is approved; DEC-0009 remains required before any new environment is selected. |
| Outcome | `PASS` for recording the DEC-0020 approval. |
| Affected work blocked | All VPS connections, credential use, database access, data extraction, deletion, provisioning, deployment, source capture, and application implementation remain blocked. |
| Owner decision required | An exact host-specific V0 authorisation before any VPS connection; later V3 authorisation before any deletion or recreation action. |
| Next review due | 30 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0015

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — completed owner-approved V0–V3 legacy-VPS control sequence and preparation of DEC-0009 |
| Reviewer role | Maintainer; operational owner approvals are recorded in restricted V0–V3 records and DEC-0021 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md`, restricted V0–V3 records, `ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`, and this log |
| Active phase and authorising decision | Legacy VPS control complete for its limited scope; environment/secret-management planning only under owner instruction; DEC-0009 remains proposed |
| Checks performed | The operational sequence used explicitly approved, scoped metadata checks and a V3 command targeting only the two named databases and the old frontend service. The shared cluster, role, paths, Nginx sites, other databases, and unrelated workloads were not targets. The DEC-0009 proposal recommends a dedicated new VPS, fresh resource names/roles, isolated data namespaces, and a defined secret-file mechanism. |
| Findings | The limited V3 result is `PASS`; it does not authorise a rebuild. RSK-0012 remains active for future V4 work. DEP-0003 remains blocking pending DEC-0009. |
| Outcome | `PASS` for recording the limited legacy-control result and DEC-0009 proposal preparation. |
| Affected work blocked | VPS provisioning, database/service/secret creation, deployment, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked. |
| Owner decision required | DEC-0009; then a separately approved exact V4 provisioning proposal. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |
### GOV-REV-0016

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner correction of the DEC-0009 environment scope |
| Reviewer role | Maintainer |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`, and this log |
| Active phase and authorising decision | Environment/secret-management planning only; owner-directed revision of proposed DEC-0009 |
| Checks performed | The proposal now uses the current VPS with an isolated no-Docker project namespace. It retains fresh database/role/path/service identities, loopback-only PostgreSQL access, restricted secret files, native systemd service hardening, and explicit shared-host residual-risk disclosure. It does not claim a dedicated host or host-level zero blast radius. |
| Findings | The revised proposal fits the owner-approved efficiency scope while preserving runtime/data isolation requirements. The shared-host availability and administrator boundary remain a recorded residual risk; V4 provisioning remains blocked pending DEC-0009. |
| Outcome | `PASS` for the DEC-0009 scope correction. |
| Affected work blocked | VPS changes, database/service/secret creation, deployment, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked. |
| Owner decision required | DEC-0009; then a separately approved exact V4 provisioning proposal. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0017

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0009 and V4 frontend/backend scope clarification |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0009 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`, `CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md`, and this log |
| Active phase and authorising decision | Current-VPS environment direction approved under DEC-0009; V4 boundary planning only under owner instruction; DEC-0022 remains proposed |
| Checks performed | The approved environment uses the current shared VPS without Docker, with new accounts, roles, paths, secret files, native-systemd limits, and loopback-only services. The V4 proposal explicitly distinguishes foundation provisioning, backend/frontend deployment, and the single-site `legislativedata.org` Nginx cutover. No existing unrelated service is included in the target list. |
| Findings | DEP-0003 is satisfied. RSK-0013 records the front-end/backend and Nginx cutover risk. No V4 mutation, application deployment, domain change, source capture, or code work is authorised. |
| Outcome | `PASS` for recording DEC-0009 approval and DEC-0022 proposal preparation. |
| Affected work blocked | VPS changes, database/service/secret creation, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked. |
| Owner decision required | DEC-0022; then a separately approved exact V4A foundation authorisation. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0018

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0022 and preparation of exact V4A authorisation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0022 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`, `CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md`, `V4A_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0023.md`, and this log |
| Active phase and authorising decision | Current-VPS V4 boundary approved under DEC-0022; exact V4A authorisation preparation only; DEC-0023 remains proposed |
| Checks performed | The V4A proposal names only fresh disabled accounts, empty paths, no-login PostgreSQL roles, and empty databases. It preserves the shared cluster, existing users, services, paths, Nginx configuration, ports, the separate bills cluster, and all source-data boundaries. It records the shared-cluster `PUBLIC CONNECT` uncertainty as a later V4B gate rather than implying that a no-login foundation proves deployment isolation. |
| Findings | DEC-0022 is recorded as approved. DEP-0003 is satisfied through the staging boundary. RSK-0013 remains active; DEC-0023 is required before the additive foundation action. No VPS action, source-data action, implementation, service deployment, or domain cutover occurred. |
| Outcome | `PASS` for recording DEC-0022 approval and preparing the DEC-0023 proposal. |
| Affected work blocked | V4A provision, credentials, PostgreSQL login/schema grants, services, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending their exact approvals. |
| Owner decision required | DEC-0023; then a restricted V4A verification result and separately approved V4B prerequisites. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0019

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner-approved DEC-0023 V4A action stopped in mandatory pre-flight |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0023 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0023.md`, restricted V4A result, and this log |
| Active phase and authorising decision | Exact V4A foundation action under DEC-0023; execution stopped before mutation |
| Checks performed | The one-shot action reached the PostgreSQL listener-boundary pre-flight check and returned `BLOCKED`. It did not enter its mutation stage, perform a target-absence check, create any account/path/role/database, or access source data. No follow-up query was run. |
| Findings | The listener condition is unresolved, not a basis for inferring that the service is public or unsafe. RSK-0014 records the gap. The shared host, PostgreSQL configuration, existing services/databases, Nginx, DNS, and other workloads remain unchanged. |
| Outcome | `BLOCKED` for V4A execution; `PASS` for stopping before mutation and retaining the bounded result. |
| Affected work blocked | Any V4A retry, PostgreSQL configuration change, role/database creation, credentials, services, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims. |
| Owner decision required | An exact read-only listener-boundary clarification authorisation; then, only if it establishes a non-interfering path, a new V4A authorisation. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0020

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner-approved read-only V4A listener-boundary clarification |
| Reviewer role | Maintainer; owner instruction is recorded as DEC-0024 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0009, DEC-0022, DEC-0023, restricted V4A-L1 result, and this log |
| Active phase and authorising decision | Read-only listener-boundary clarification under DEC-0024; no foundation action authorised |
| Checks performed | The check queried only PostgreSQL's configured listener/port and the port-5432 TCP bindings. It established a wildcard listener on the shared `16-main` cluster. No configuration, service, database, role, path, credential, source-data, Nginx, DNS, or firewall action occurred. |
| Findings | `16-main` cannot satisfy the approved project private-listener control without changing shared infrastructure. The current-VPS/no-Docker direction remains viable only through a separately assessed native loopback/private cluster. RSK-0014 records this constraint. |
| Outcome | `PASS` for the bounded read-only clarification; `BLOCKED` for V4A against `16-main`. |
| Affected work blocked | V4A on `16-main`, any shared PostgreSQL change, credentials, services, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims. |
| Owner decision required | A separate native loopback/private PostgreSQL-cluster proposal, then an exact V4A authorisation if approved. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0021

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — preparation of the native PostgreSQL-cluster alternative |
| Reviewer role | Maintainer; documentation-preparation authority follows the owner instruction to proceed after DEC-0024 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0009, DEC-0022, DEC-0024, `NATIVE_POSTGRESQL_CLUSTER_PROPOSAL_DEC0025.md`, and this log |
| Active phase and authorising decision | Current-VPS foundation planning only; DEC-0025 remains proposed |
| Checks performed | The proposal replaces only the blocked shared-cluster implementation with a proposed new native PostgreSQL 16 cluster. It keeps the current VPS, no-Docker rule, fresh resource identities, loopback-only network boundary, and V4B/V4C separation. It adds resource/capacity, port, and existing-cluster non-interference pre-flight controls. |
| Findings | The alternative does not claim that native tools, capacity, port 5434, or the new resource names are presently available; those are explicit future pre-flight checks. RSK-0014 remains the exclusion of `16-main`; RSK-0015 covers the proposed cluster's shared-host resource risk. |
| Outcome | `PASS` for preparing DEC-0025; no VPS mutation, source-data action, implementation, service deployment, or domain change occurred. |
| Affected work blocked | Cluster/database/role/path creation, credentials, services, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending their exact approvals. |
| Owner decision required | DEC-0025; then an exact V4A native-cluster foundation authorisation. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0022

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0025 and preparation of exact native-cluster V4A authorisation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0025 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0009, DEC-0022, DEC-0024, `NATIVE_POSTGRESQL_CLUSTER_PROPOSAL_DEC0025.md`, `V4A_NATIVE_CLUSTER_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0026.md`, and this log |
| Active phase and authorising decision | Native-cluster direction approved under DEC-0025; exact V4A authorisation preparation only; DEC-0026 remains proposed |
| Checks performed | The proposed V4A action targets a newly named PostgreSQL 16 cluster only, creates it disabled, applies its own loopback listener and fixed cgroup limits before first start, and compares the existing clusters' narrowly scoped metadata before/after. It preserves the no-Docker rule, source-data boundary, V4B/V4C separation, and no-touch boundary around existing services, Nginx, DNS, and firewall. |
| Findings | The exact action remains conditional on native tool availability, absent-target/port checks, and capacity floors. It makes no assertion that any pre-flight will pass. RSK-0015 covers resource contention and requires the declared cap. |
| Outcome | `PASS` for recording DEC-0025 approval and preparing DEC-0026; no VPS mutation, source-data action, implementation, service deployment, or domain change occurred. |
| Affected work blocked | New-cluster/database/role/path creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending exact approval. |
| Owner decision required | DEC-0026; then its restricted V4A result and a separately approved V4B prerequisite plan. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0023

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0026 V4A action failed in pre-flight and exact correction preparation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0026 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0026.md`, `V4A_NATIVE_CLUSTER_PREFLIGHT_CORRECTION_PROPOSAL_DEC0027.md`, restricted V4A-native result, and this log |
| Active phase and authorising decision | Native-cluster V4A action under DEC-0026 failed pre-mutation; DEC-0027 correction proposal only |
| Checks performed | The action reached the storage-capacity command before target completion or mutation. The host rejected a mutually incompatible `df` option combination. The result is a script compatibility failure, not evidence of a host-capacity or resource conflict. No follow-up VPS command ran. |
| Findings | No target was created or changed. DEC-0027 changes only `df -PB1 --output=avail` to `df -B1 --output=avail`; it retains all capacity floors, exclusive targets, limits, and stop conditions. |
| Outcome | `FAIL` for DEC-0026 before mutation; `PASS` for recording the bounded failure and preparing the correction proposal. |
| Affected work blocked | Any cluster/database/role/path creation, credentials, services, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0027. |
| Owner decision required | DEC-0027. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0024

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0027 corrected V4A action failed at new-cluster first start and recovery-inspection preparation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0027 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_PREFLIGHT_CORRECTION_PROPOSAL_DEC0027.md`, `V4A_NATIVE_CLUSTER_RECOVERY_INSPECTION_PROPOSAL_DEC0028.md`, restricted V4A-native corrected result, and this log |
| Active phase and authorising decision | Corrected native-cluster V4A action under DEC-0027 failed after partial new-target creation; DEC-0028 recovery-inspection proposal only |
| Checks performed | The corrected capacity check passed. The action created only its new foundation targets, then stopped at the first start of the new cluster service. It did not reach the database-role/database stage or perform after-change checks. The result does not infer a cause or claim post-failure health of existing clusters. |
| Findings | RSK-0016 records the need to preserve the partial isolated state and inspect it narrowly. DEC-0028 permits no mutation and limits output to the new service/configuration/log/listener plus existing-cluster active-state/digest evidence. |
| Outcome | `FAIL` for DEC-0027 V4A startup; `PASS` for stopping and preparing the bounded inspection proposal. |
| Affected work blocked | Any retry, repair, removal, database/role creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0028 and subsequent exact direction. |
| Owner decision required | DEC-0028. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0025

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner-approved DEC-0028 read-only inspection and recovery-correction preparation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0028 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_RECOVERY_INSPECTION_PROPOSAL_DEC0028.md`, `V4A_NATIVE_CLUSTER_RECOVERY_CORRECTION_PROPOSAL_DEC0029.md`, restricted inspection result, and this log |
| Active phase and authorising decision | Read-only recovery inspection under DEC-0028 completed; DEC-0029 correction/start proposal only |
| Checks performed | The inspection read only the new unit/configuration/listener state and minimum existing-cluster active/digest metadata. It found extra quote characters in the three new-cluster string settings, the new cluster down with no port-5434 listener, and the existing clusters reporting active. It did not mutate any resource. |
| Findings | The malformed values explain why a start retry cannot proceed as-is. RSK-0017 records the correction boundary. DEC-0029 changes only those three new-cluster values, requires offline validation before a single new-unit start, and excludes database/role creation. |
| Outcome | `PASS` for DEC-0028 inspection and preparation of DEC-0029; all recovery changes remain blocked pending approval. |
| Affected work blocked | New-cluster configuration/start, database/role creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0029 or later exact approvals. |
| Owner decision required | DEC-0029. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0026

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0029 offline validation blocked helper-based correction and direct-correction preparation |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0029 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_RECOVERY_CORRECTION_PROPOSAL_DEC0029.md`, `V4A_NATIVE_CLUSTER_DIRECT_CONFIG_CORRECTION_PROPOSAL_DEC0030.md`, restricted correction result, and this log |
| Active phase and authorising decision | New-cluster recovery correction under DEC-0029 stopped in offline validation; DEC-0030 direct-correction proposal only |
| Checks performed | DEC-0029 changed only the three new-cluster settings and validated before a service action. The host helper emitted the raw IPv4 literal without PostgreSQL quoting; the PostgreSQL binary rejected the down configuration. The new service was not started, and no database/role action or existing-service action occurred. |
| Findings | RSK-0018 records that the helper must not be used for these values. DEC-0030 limits recovery to exact direct replacements of the three lines, followed by offline validation and one new-service start attempt. |
| Outcome | `BLOCKED` for the DEC-0029 start condition; `PASS` for stopping before start and preparing DEC-0030. |
| Affected work blocked | New-cluster start, database/role creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0030 or later exact approval. |
| Owner decision required | DEC-0030. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0027

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0030 stopped before start because its HBA validation reader lacked required privilege |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0030 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_DIRECT_CONFIG_CORRECTION_PROPOSAL_DEC0030.md`, `V4A_NATIVE_CLUSTER_HBA_VALIDATION_AND_START_PROPOSAL_DEC0031.md`, restricted correction result, and this log |
| Active phase and authorising decision | DEC-0030 direct correction completed through offline validation; DEC-0031 HBA-validation/start proposal only |
| Checks performed | DEC-0030 directly replaced only the three approved new-cluster settings. The PostgreSQL binary accepted their effective values while down. The action stopped before a start command because the HBA reader lacked permission for the protected file. Existing clusters reported active before the attempted validation; no database/role or existing-service action occurred. |
| Findings | The direct configuration correction does not need repeating. RSK-0019 records the missing read privilege. DEC-0031 permits only a privileged read of the already-existing HBA, repeated effective-value/port checks, and one new-service start if they all pass. |
| Outcome | `BLOCKED` for DEC-0030's start condition; `PASS` for stopping without a service start and preparing the narrower DEC-0031 proposal. |
| Affected work blocked | New-cluster start, database/role creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0031 or later exact approval. |
| Owner decision required | DEC-0031. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0028

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0031 HBA validation found an unexpected rule profile before service start |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0031 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_HBA_VALIDATION_AND_START_PROPOSAL_DEC0031.md`, `V4A_NATIVE_CLUSTER_HBA_INSPECTION_PROPOSAL_DEC0032.md`, restricted validation result, and this log |
| Active phase and authorising decision | DEC-0031 HBA validation stopped before service action; DEC-0032 inspection proposal only |
| Checks performed | DEC-0031 revalidated the three effective new-cluster configuration values while down and read the HBA with the required privilege. The observed non-comment HBA rule profile did not match the approval's exact two-rule expectation, so the action stopped before port check, failed-state reset, or service start. No configuration, database/role, or existing-service action occurred. |
| Findings | The HBA content itself must be inspected before it can be described, corrected, or used as a basis for another start proposal. RSK-0020 records this boundary. DEC-0032 permits only an effective-HBA path/rule inspection of the new down cluster. |
| Outcome | `BLOCKED` for DEC-0031's start condition; `PASS` for preserving the stop condition and preparing the read-only DEC-0032 proposal. |
| Affected work blocked | New-cluster repair/start, database/role creation, credentials, frontend/backend deployment, Nginx/DNS change, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0032 or later exact approval. |
| Owner decision required | DEC-0032. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0029

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0032 HBA inspection passed; V4A-completion and proportionate-control proposals prepared |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0032 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_HBA_INSPECTION_PROPOSAL_DEC0032.md`, `V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md`, `INFRASTRUCTURE_WORK_PACKAGE_CONTROL_PROPOSAL_DEC0034.md`, restricted inspection result, and this log |
| Active phase and authorising decision | DEC-0032 effective-HBA inspection completed; DEC-0033 and DEC-0034 proposals only |
| Checks performed | The inspection read only the effective HBA path and non-comment rules of the down new cluster. It found the standard local peer rule for `postgres`, local peer for all local accounts, and the sole TCP rule at `127.0.0.1/32` using SCRAM. No service, configuration, database/role, source, network, or existing-service action occurred. |
| Findings | The HBA profile supports the proposed no-edit V4A completion checks. The owner requested less granular control for routine setup. DEC-0034 preserves explicit gates for material/shared/public/data actions while allowing bounded owner-approved VPS work packages to handle ordinary implementation details without serial micro-decisions. |
| Outcome | `PASS` for DEC-0032 inspection and proposal preparation. |
| Affected work blocked | New-cluster start, database/role creation, infrastructure work-package delegation, services, credentials, Nginx/DNS, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending their respective approvals. |
| Owner decision required | DEC-0033 and DEC-0034. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0030

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0033 V4A completion and DEC-0034 proportionate infrastructure control |
| Reviewer role | Maintainer; owner approvals are recorded in DEC-0033 and DEC-0034 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md`, `INFRASTRUCTURE_WORK_PACKAGE_CONTROL_PROPOSAL_DEC0034.md`, and this log |
| Active phase and authorising decision | V4A completion under DEC-0033; DEC-0034 applies to future VPS infrastructure work packages only |
| Checks performed | DEC-0033 remains a named, bounded V4A package: no configuration edit, one new-cluster start, then conditional empty-role/database creation with existing-cluster non-interference checks. DEC-0034 permits ordinary implementation details within an approved VPS package but retains explicit gates for shared/public/destructive/credential/data actions. |
| Findings | The control model is proportionate to routine infrastructure without weakening the project's academic evidence and source-data controls. The V4A result must still record its actual outcome before any next stage is proposed. |
| Outcome | `PASS` for the approval record and updated work-package control; DEC-0033 execution pending. |
| Affected work blocked | V4B services, credentials, Nginx/DNS, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending their own approvals. |
| Owner decision required | None for DEC-0033 execution; later work retains its own gates. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0031

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — contained DEC-0033 startup failure and DEC-0034 work-package correction |
| Reviewer role | Maintainer; DEC-0033 and DEC-0034 owner approvals are recorded in the decision register |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md`, restricted DEC-0033 result/diagnostic, and this log |
| Active phase and authorising decision | V4A completion under DEC-0033, using DEC-0034 contained implementation-correction authority |
| Checks performed | DEC-0033 passed offline configuration/HBA/port checks and made its first new-unit start attempt. The service reached its loopback listener but stopped because the new service runtime directory was root-owned and PostgreSQL could not create its socket lock. Existing clusters retained their active states and database-name-set digests in the read-only post-failure check. |
| Findings | The correction is limited to one `ExecStartPre` ownership-creation line in the existing new service drop-in, a manager reload, and one corrected start attempt. It does not alter the target cluster, resource limits, listener, authentication rule, protected resources, or end-state. DEC-0034 permits this contained correction without a serial new decision. |
| Outcome | `PASS` for applying the work-package control to the bounded correction; corrected start and conditional foundation database/role creation pending. |
| Affected work blocked | Any action outside DEC-0033's named new-cluster/drop-in targets; V4B services, credentials, Nginx/DNS, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked. |
| Owner decision required | None for this DEC-0034-contained correction; later work retains its own gates. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0032

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0033 contained correction exhausted without new-cluster startup |
| Reviewer role | Maintainer; DEC-0033 and DEC-0034 owner approvals are recorded in the decision register |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md`, `V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_PROPOSAL_DEC0035.md`, restricted completion result, and this log |
| Active phase and authorising decision | DEC-0033 V4A completion stopped; DEC-0035 recovery completion proposal only |
| Checks performed | DEC-0033 passed configuration/HBA/port checks and made its first start. Under DEC-0034, it added one new-drop-in pre-start ownership line and made one corrected start. Both starts failed at the new-cluster socket lock before role/database creation. The final bounded diagnostic confirmed that `16-main` and `16-bills` remained active with unchanged database-name-set digests. |
| Findings | The systemd `RuntimeDirectory` lifecycle conflicts with the service-managed PostgreSQL socket path. DEC-0035 changes only the two conflicting new-drop-in settings, retains explicit postgres-owned pre-start directory creation and resource limits, and permits one replacement start. |
| Outcome | `BLOCKED` for DEC-0033 completion; `PASS` for contained diagnostics and preservation of the new control boundary. |
| Affected work blocked | New-cluster start/recovery, database/role creation, V4B services, credentials, Nginx/DNS, source capture, proxy/DB1 implementation, canonical builds, charts, and public claims remain blocked pending DEC-0035 or their respective approvals. |
| Owner decision required | DEC-0035. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0033

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0035 runtime-directory recovery and V4A foundation completion |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0035 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_PROPOSAL_DEC0035.md`, restricted recovery result, and this log |
| Active phase and authorising decision | V4A isolated native-cluster foundation under DEC-0035 |
| Checks performed | DEC-0035 removed only the two conflicting new-drop-in `RuntimeDirectory` settings, retained the explicit postgres-owned pre-start directory creation and resource limits, and made one replacement start. The new cluster reported active, had exactly one loopback port-5434 listener, and had a postgres-owned `0750` runtime directory. The two named no-login/password-null roles and empty project databases were then created and validated for ownership/access/no-public-privilege/no-user-relations. |
| Findings | `16-main` and `16-bills` retained their active states and database-name-set digests. No shared service/configuration, network/public, credential, source, application, or V4B/V4C action occurred. |
| Outcome | `PASS` for V4A foundation within DEC-0035's scope. |
| Affected work blocked | V4B services, credential issuance, schema/data work, source capture, proxy/DB1 implementation, canonical builds, charts, Nginx/DNS cutover, and public claims remain blocked pending their own approvals. |
| Owner decision required | A separate V4B service/secret/application package, when the owner wishes to proceed. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0034

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — V4B service, secret, and application delivery planning proposal |
| Reviewer role | Maintainer; DEC-0036 is proposed and has no owner approval yet |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md`, `ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`, `V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_PROPOSAL_DEC0035.md`, `V4B_SERVICE_SECRET_AND_APPLICATION_DELIVERY_PLAN_PROPOSAL_DEC0036.md`, and this log |
| Active phase and authorising decision | V4B planning only following V4A completion under DEC-0035; DEC-0036 is a proposal only |
| Checks performed | Confirmed the V4A foundation is limited to the loopback-only empty project databases/roles and that the repository contains no approved runtime, application, lockfile, release artefact, migration, login-capable database role, secret, unit, or health implementation. Confirmed the V4B proposal separates specification, implementation, local deployment, and local acceptance. |
| Findings | An application/service deployment cannot be evidenced yet. DEC-0036 prevents a generic placeholder deployment and retains separate gates for dependencies, secrets, schema/login roles, VPS/service work, source-data work, and V4C public cutover. |
| Outcome | `PASS` for proposal preparation only; no V4B operational action is authorised. |
| Affected work blocked | B1 implementation; B2/B3 VPS deployment and verification; package installation; secret or credential issuance; schema/migration work; source capture/proxy/DB1/canonical/chart work; Nginx/DNS/firewall/public exposure and claims remain blocked pending their own approvals. |
| Owner decision required | DEC-0036 to adopt the B0–B3 sequence and permit B0 specification preparation. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0035

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0036 and B0 application-delivery specification proposal |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0036; DEC-0037 is proposed |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4B_SERVICE_SECRET_AND_APPLICATION_DELIVERY_PLAN_PROPOSAL_DEC0036.md`, `V4B_B0_APPLICATION_DELIVERY_SPECIFICATION_PROPOSAL_DEC0037.md`, and this log |
| Active phase and authorising decision | V4B B0 application-delivery specification preparation under DEC-0036 |
| Checks performed | Confirmed the repository has documentation only and no non-document tracked application artefact. Checked the B0 proposal gives an explicit runtime/dependency policy, two loopback service contracts, reproducible release evidence, no-data/no-database/no-secret first increment, and separate B1/B2/B3 gates. |
| Findings | The B0 proposal chooses a Node.js 22 LTS/TypeScript workspace but does not claim the runtime is installed, available, or suitable on the VPS. Its first shell has no source route, database driver, database login, secret, external request, chart, or public claim. RSK-0023 records the risk of mistaking process readiness for research/data readiness. |
| Outcome | `PASS` for B0 specification preparation only. |
| Affected work blocked | B1 application/dependency implementation; all VPS checks/changes and service deployment; database schema/login/migration work; secret or credential issuance; source capture/proxy/DB1/canonical/chart work; Nginx/DNS/firewall/public exposure and claims remain blocked pending their own approvals. |
| Owner decision required | DEC-0037 to adopt the B0 specification and permit preparation of a B1 implementation package. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0036

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner selection of Fastify API and React/Vite web stack; B1 implementation proposal |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0037; DEC-0038 is proposed |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4B_B0_APPLICATION_DELIVERY_SPECIFICATION_PROPOSAL_DEC0037.md`, `V4B_B1_LOCAL_APPLICATION_SHELL_IMPLEMENTATION_PROPOSAL_DEC0038.md`, and this log |
| Active phase and authorising decision | V4B B1 local implementation-package preparation under DEC-0037 |
| Checks performed | Confirmed the owner selected the B0 Fastify/React/Vite option. Checked current Node release documentation before setting the supported LTS baseline to `24.17.0`; no runtime was installed or inspected on the VPS. Confirmed DEC-0038 limits direct dependencies, disables lifecycle scripts, fixes repository-only targets, requires synthetic-only capability labels, and excludes all database/source/VPS/public work. |
| Findings | The B1 package has a narrow, reproducible local implementation purpose. It cannot demonstrate database, source, service, or deployment behaviour. RSK-0024 records the dependency/supply-chain boundary. |
| Outcome | `PASS` for DEC-0037 approval recording and DEC-0038 proposal preparation only. |
| Affected work blocked | Local code/dependency installation, VPS/service deployment, database schema/login/migration work, secret or credential issuance, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall/public exposure and claims remain blocked pending their own approvals. |
| Owner decision required | DEC-0038 to permit the bounded local B1 implementation package. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0037

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0038 local B1 application-shell implementation result |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0038 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `V4B_B0_APPLICATION_DELIVERY_SPECIFICATION_PROPOSAL_DEC0037.md`, `V4B_B1_LOCAL_APPLICATION_SHELL_IMPLEMENTATION_PROPOSAL_DEC0038.md`, `V4B_B1_LOCAL_IMPLEMENTATION_RESULT_2026-08-01.md`, and this log |
| Active phase and authorising decision | V4B B1 local application shell under DEC-0038 |
| Checks performed | Verified exact local Node/npm alignment, lockfile installation with lifecycle scripts disabled, direct dependency allowlist, strict TypeScript checks, production builds, five health/loopback contract tests, application capability scan, archive content boundary, and deterministic two-build archive/manifest digests. |
| Findings | The B1 implementation is synthetic-only and retains no database, secret, source, or public capability. An initial archive timestamp/order issue was corrected within the local packaging code; the final two-build check passed identical archive and manifest digests. No VPS command or external source request occurred. |
| Outcome | `PASS` for the local B1 implementation and retained result only. |
| Affected work blocked | VPS/service deployment, target-host runtime installation/selection, database schema/login/migration work, secret or credential issuance, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall/public exposure and claims remain blocked pending their own approvals. |
| Owner decision required | A separate B2 local-deployment proposal, if the owner wishes to continue. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0038

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — B2 local-deployment proposal prepared after the B1 `PASS` result |
| Reviewer role | Maintainer; DEC-0039 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0035–DEC-0038 records/results, `V4B_B2_LOCAL_DEPLOYMENT_PROPOSAL_DEC0039.md`, and this log |
| Active phase and authorising decision | V4B B2 proposal preparation only, following DEC-0038’s local-only result |
| Checks performed | Confirmed the proposal keeps the first VPS increment synthetic-only and database/secret-free; selects a private, checksummed/signed Node 24 LTS runtime rather than a host-wide package; requires preflight for host compatibility, service names, ports, path ownership, capacity, protected-cluster state, and systemd directives; fixes both unit contracts and V4A resource limits; and defers all Nginx/public/source/database actions. |
| Findings | B1’s local `24.14.1` metadata cannot be treated as a production runtime selection. DEC-0039 therefore requires a runtime-aligned, fully reverified release before transfer and stops if the target host cannot run the exact selected private Node patch. RSK-0025 and DEP-0007 record the remaining deployment dependency. |
| Outcome | `PASS` for proposal preparation and register alignment only; all B2 operational activity remains `BLOCKED` pending owner approval of DEC-0039. |
| Affected work blocked | VPS preflight/change, private runtime installation, release transfer, unit creation/start, B3 acceptance, database/secret work, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall/public exposure, and public claims remain blocked pending their own explicit approvals. |
| Owner decision required | DEC-0039. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0039

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — owner approval of DEC-0039 B2 local-deployment work package |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0039 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0035–DEC-0038 records/results, `V4B_B2_LOCAL_DEPLOYMENT_PROPOSAL_DEC0039.md`, and this log |
| Active phase and authorising decision | V4B B2 isolated local deployment under DEC-0039 |
| Checks performed | Confirmed that the approval remains bounded to the named project staging/runtime/release paths and two named systemd units, with no data, database/secret, public-routing, host-wide runtime, or shared-service authority. Clarified the only protected-cluster metadata check as a `postgres` service-account query that emits database-name-set digests only, moved final executable/unit validation to the project staging step before unit installation, and moved runtime download, signature verification, dependency installation, build, and release packaging to VPS staging. Confirmed that all mutation remains conditional on the recorded compatibility, namespace, port, capacity, protected-cluster, and unit-directive gates. |
| Findings | The clarification does not alter the target, resource class, privilege boundary, exposure, or end state: it makes the stated before/after protected-cluster digest check possible without retaining names, makes final-systemd validation possible only once the private executable exists, and keeps the maintainer Mac free of a parallel Node/runtime/release setup. Approval permits the ordered B2 package, not a successful deployment claim. DEP-0007 remains unsatisfied until the preflight result is recorded. RSK-0025's stop and project-only rollback conditions apply unchanged. |
| Outcome | `PASS` for recording the authority and aligned execution boundary; B2 preflight is pending. |
| Affected work blocked | Any B2 mutation before a passing preflight; B3 acceptance closure; database/secret work; source capture/proxy/DB1/canonical/chart work; Nginx/DNS/firewall/public exposure; and public claims remain blocked pending their respective conditions or approvals. |
| Owner decision required | None for DEC-0039’s bounded execution; a new decision is required for any stop condition or excluded action. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0040

| Field | Record |
| --- | --- |
| Date (UTC) | 1 August 2026 |
| Review type | Triggered — DEC-0039 B2 package stopped at target-host deterministic-packaging gate |
| Reviewer role | Maintainer; DEC-0039 owner approval is recorded |
| Documents and records reviewed | PROJECT_DESIGN.md, HANDOVER.md, GOVERNANCE.md, AGENTS.md, DECISION_REGISTER.md, RISK_AND_DEPENDENCY_REGISTER.md, V4B_B2_LOCAL_DEPLOYMENT_PROPOSAL_DEC0039.md, V4B_B2_LOCAL_DEPLOYMENT_RESULT_2026-08-01.md, and this log |
| Active phase and authorising decision | V4B B2 under DEC-0039; deployment outcome BLOCKED |
| Checks performed | Confirmed that host/path/port/capacity preflight passed; Node v24.18.1 was signature/checksum-verified in VPS staging; source/dependencies/tests/capability scan passed under that runtime; and the second package build produced a different manifest and archive digest. Confirmed post-failure removal of the project staging path, absence of B2 release/runtime/unit/listener, and unchanged protected PostgreSQL state/digests. |
| Findings | The mismatch defeats the required release-identity evidence. It is not safe to select one archive, relabel the result, or inspect/change package code under DEC-0039’s metadata-only alignment scope. RSK-0026 records the failure mode. |
| Outcome | BLOCKED for B2 deployment; PASS for the stop rule, evidence retention, and project-target-only cleanup. |
| Affected work blocked | B2 package-code investigation/fix, final runtime/release installation, unit installation/start, B3 acceptance, database/secret work, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall/public exposure, and public claims. |
| Owner decision required | A new narrowly scoped corrective packaging proposal. |
| Next review due | 31 August 2026, or earlier if a review trigger occurs. |

### GOV-REV-0041

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner requested a more efficient contained-infrastructure recovery model |
| Reviewer role | Maintainer; DEC-0040 is proposed and has no owner approval |
| Documents and records reviewed | PROJECT_DESIGN.md, HANDOVER.md, GOVERNANCE.md, AGENTS.md, DECISION_REGISTER.md, RISK_AND_DEPENDENCY_REGISTER.md, DEC-0039 result, V4B_B2A_CORRECTIVE_PACKAGING_AND_CONTINUATION_PROPOSAL_DEC0040.md, and this log |
| Active phase and authorising decision | V4B B2a corrective-package proposal preparation only |
| Checks performed | Confirmed that the B2a proposal retains the no-data/no-database/no-public/shared-host boundary. It limits the new recovery mechanism to one root-owned project staging hold, packaging code/tests only, owner notification, a 24-hour expiry, renewed full gates, and project-only cleanup. |
| Findings | The prior immediate cleanup was safe but inefficient for a tooling-only failure. The proposed diagnostic hold preserves containment while allowing one bounded repair cycle without serial approval, but does not apply to credential, data, public, shared-service, privilege, or scope-expanding incidents. |
| Outcome | PASS for DEC-0040 proposal preparation only. B2 deployment remains BLOCKED pending DEC-0040 and its result. |
| Affected work blocked | VPS staging recreation, packaging diagnosis/fix, final runtime/release/unit deployment, B3 acceptance, database/secret work, source/data work, Nginx/DNS/firewall/public exposure, and public claims. |
| Owner decision required | DEC-0040. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0042

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner approval of DEC-0040 contained B2a recovery package |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0040 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0039 result, `V4B_B2A_CORRECTIVE_PACKAGING_AND_CONTINUATION_PROPOSAL_DEC0040.md`, and this log |
| Active phase and authorising decision | V4B B2a corrective packaging and continuation under DEC-0040 |
| Checks performed | Confirmed that the approved package permits only the root-owned project staging hold, packaging code/tests, notification, renewed reproducibility evidence, and the pre-existing final-deployment path. It retains all stops for unexpected staging content, scope/privilege expansion, shared/public/data/credential action, and failed final gates. |
| Findings | The approval improves recovery efficiency for this contained build defect without treating the failed B2 package as deployed or weakening source/data/public governance. |
| Outcome | `PASS` for recording approval and aligned execution boundary; B2a preflight and diagnosis are pending. |
| Affected work blocked | Any action outside the approved B2a staging/package scope; B3 acceptance, database/secret work, source work, Nginx/DNS/firewall/public exposure, and public claims remain blocked. |
| Owner decision required | None for DEC-0040’s bounded execution; a new decision is required for an excluded action or stop condition. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0043

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0040 B2a recovery and DEC-0039 B2 final result |
| Reviewer role | Maintainer; owner approvals are recorded in DEC-0039 and DEC-0040 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0039/DEC-0040 records and results, and this log |
| Active phase and authorising decision | V4B B2 corrective packaging and isolated local deployment under DEC-0039 and DEC-0040 |
| Checks performed | Repeated project/protected-resource preflight; verified the exact private Node archive and signing key; preserved and compared two target-host package variants; limited the repair to package code and a repeat-package helper; ran two repaired VPS package passes; verified capability/build contracts; verified concrete systemd units; verified exact local health responses, loopback listeners, hardening/resource boundaries, immutable path metadata, protected-cluster states/digests, release exclusions, and staging removal. |
| Findings | The mismatch was volatile GNU tar extended metadata, not an application-content difference. The repaired portable USTAR writer produced identical target-host archives. Two temporary start attempts rolled back only the newly created project resources because an immediate health check raced process readiness and then an evidence pipeline lacked its final privilege boundary; the final bounded readiness/evidence sequence passed. No shared, database, secret, source, or public resource changed. |
| Outcome | `PASS` for the limited B2 local synthetic-shell deployment and DEC-0040 recovery. It does not establish a data API, database-backed service, research release, or public website. |
| Affected work blocked | B3 acceptance closure; database/secret work; source capture/proxy/DB1/canonical/chart work; Nginx/DNS/firewall/public exposure; and public claims remain blocked pending their own approvals. |
| Owner decision required | A separately scoped B3 or later package, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0044

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — B3 local-acceptance proposal preparation |
| Reviewer role | Maintainer; DEC-0041 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, B2/B2a records/results, `V4B_SERVICE_SECRET_AND_APPLICATION_DELIVERY_PLAN_PROPOSAL_DEC0036.md`, `V4B_B3_LOCAL_ACCEPTANCE_PROPOSAL_DEC0041.md`, and this log |
| Active phase and authorising decision | V4B B3 proposal preparation only |
| Checks performed | Confirmed that B3 is the separately required local-acceptance record in DEC-0036, and constrained DEC-0041 to read-only evidence over the installed B2 state. The proposal fixes the only two health routes, preserves the B2 digest/path/hardening/protected-cluster evidence model, forbids disclosure of database names or unknown environment values, and introduces no mutable VPS target. |
| Findings | B2 `PASS` does not itself close B3 or authorise public exposure. A short independent acceptance record provides durable evidence of the local-only state without broadening the product, data, or shared-host scope. |
| Outcome | `PASS` for proposal preparation only. B3 checks remain blocked pending owner approval of DEC-0041. |
| Affected work blocked | All B3 VPS inspection, V4C/public exposure, database/secret work, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall changes, and public claims remain blocked pending their respective approvals. |
| Owner decision required | DEC-0041. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0045

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner approval of DEC-0041 B3 local acceptance |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0041 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, B2/B2a records/results, `V4B_B3_LOCAL_ACCEPTANCE_PROPOSAL_DEC0041.md`, and this log |
| Active phase and authorising decision | V4B B3 read-only local acceptance under DEC-0041 |
| Checks performed | Confirmed the approved scope has no mutable VPS target and permits only the fixed local checks and restricted durable record stated in DEC-0041. |
| Findings | The approval closes no public or data gate. It permits evidence gathering only; every mismatched condition remains a stop-and-record result. |
| Outcome | `PASS` for approval recording and execution boundary; B3 verification is pending. |
| Affected work blocked | All VPS modification, V4C/public exposure, database/secret work, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall changes, and public claims remain blocked. |
| Owner decision required | None for DEC-0041's fixed read-only checks; a new decision is required for a mismatch repair or any excluded action. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0046

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0041 B3 local-acceptance result |
| Reviewer role | Maintainer; owner approval is recorded in DEC-0041 |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, B2/B2a records/results, `V4B_B3_LOCAL_ACCEPTANCE_PROPOSAL_DEC0041.md`, `V4B_B3_LOCAL_ACCEPTANCE_RESULT_2026-08-02.md`, and this log |
| Active phase and authorising decision | V4B B3 local acceptance under DEC-0041 |
| Checks performed | Verified active/enabled service state and owner, private runtime/release identity, unit digests and hardening/resource/network policy, exact two-route health contract, assigned IPv4 loopback listeners, release exclusions, protected-cluster state and non-name digest equality, project-database listener, staging absence, and singleton project runtime/release paths. |
| Findings | Every fixed B3 condition passed without a VPS change. The record remains operational evidence for two local synthetic shells only; it contains no data, source content, secret, database name, or unrelated-service detail. |
| Outcome | `PASS` for V4B B3 local acceptance. The V4B B0–B3 local synthetic-shell sequence is closed. |
| Affected work blocked | V4C/public exposure, database/secret work, source capture/proxy/DB1/canonical/chart work, Nginx/DNS/firewall changes, and public claims remain blocked pending separate approvals. |
| Owner decision required | A separately scoped next package, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0047

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-directed repository documentation reorganisation |
| Reviewer role | Maintainer; owner directed the documentation-only tidy-up |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, and the complete Markdown link graph |
| Active phase and authorising decision | Repository documentation hygiene only; no operational/data phase action |
| Checks performed | Moved active documents into governance, planning, data, infrastructure, and application domains; retained completed V4A implementation records in an explicit archive; added the `docs/README.md` human entry point; updated repository rules; and resolved every Markdown link after relocation. |
| Findings | The prior flat directory mixed active controls, data plans, operational records, and historical implementation evidence. The revised layout preserves all records and makes the current data, infrastructure, and application boundaries visible without implying any new approval. |
| Outcome | `PASS` for documentation organisation and link integrity only. |
| Affected work blocked | No data, source, database, application, VPS, secret, public-routing, or public-claim scope changed. All existing gates remain in force. |
| Owner decision required | A separate approved data programme package before proxy, DB1, or DB2 execution. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0048

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-directed daily repository-hygiene control |
| Reviewer role | Maintainer; owner directed the standing control |
| Documents and records reviewed | `AGENTS.md`, `GOVERNANCE.md`, `docs/README.md`, and the current documentation structure |
| Active phase and authorising decision | Repository discipline control only; no operational/data phase action |
| Checks performed | Added a once-per-active-UTC-day read-only hygiene assessment for documentation/link integrity, stale artefacts, and code/text organisation. Required the maintainer to seek owner agreement before making any resulting tidy-up change, and distinguished the checkpoint from the formal governance-review cadence. |
| Findings | The project needs a sustainable cleanliness control as it begins source, DB1, DB2, and data-access work. The approved rule preserves owner control and audit history while preventing document and repository drift. |
| Outcome | `PASS` for governance-control alignment only. |
| Affected work blocked | The rule authorises no code, documentation, data, VPS, database, secret, public-routing, or public-claim change without the appropriate existing authority and, for a tidy-up, owner agreement. |
| Owner decision required | None for the standing assessment; owner agreement is required before each identified tidy-up. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0049

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0042 three-layer GB-SCT data-programme proposal preparation |
| Reviewer role | Maintainer; DEC-0042 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007/DEC-0008/DEC-0018 materials, the V4B result, `GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md`, and this log |
| Active phase and authorising decision | GB-SCT data-programme proposal preparation only |
| Checks performed | Distinguished upstream pass-through from captured DB1 and canonical DB2; required layer-visible metadata, codebooks, reproducible downloads, citations, and multi-tool access patterns; retained source/terms, capture-batch, variable, public-release, and Tier 3+ gates. |
| Findings | A direct upstream relay can improve accessibility but must never masquerade as a capture or dataset. DB1 provides the frozen evidence layer; DB2 provides the reproducible research layer. The planned interface makes those distinctions inspectable rather than burying them in implementation. |
| Outcome | `PASS` for DEC-0042 proposal preparation only. All source, proxy, capture, DB1, DB2, frontend, and public actions remain blocked pending their exact approvals. |
| Affected work blocked | Source-documentation inspection/request, pass-through implementation, DB1 capture/build, DB2 variable/release work, application/frontend changes, database action, secret work, V4C/public exposure, and public claims. |
| Owner decision required | DEC-0042. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0050

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-directed DEC-0042 private-beta and layer-interface amendment |
| Reviewer role | Maintainer; DEC-0042 remains proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `GOVERNANCE.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md`, and the DEC-0042 register entry |
| Active phase and authorising decision | GB-SCT data-programme proposal preparation only |
| Checks performed | Added a private-beta audience model, superuser approval/revocation, expiry-bound guest invitations, Resend-backed activation, password and magic-link recovery flows, and independent beta-interface acceptance gates for upstream pass-through, DB1, and DB2. Confirmed that no account, email, secret, or data implementation authority is inferred. |
| Findings | Research transparency must be visible in the interface, not only in back-end records. Layer-by-layer beta testing prevents a usable-looking front end from obscuring an untested data layer; private access preserves controlled review before a future public release decision. |
| Outcome | `PASS` for the DEC-0042 design amendment only. Source, proxy, authentication, email, database, frontend, and public work remain blocked pending exact approval. |
| Affected work blocked | Account/database schema, superuser configuration, Resend request, invitation/magic-link/password implementation, any data layer, download/API access, V4C/public exposure, and public claims. |
| Owner decision required | Review and approval of amended DEC-0042; then separate exact implementation packages. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0051

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner approval of DEC-0042 |
| Reviewer role | Maintainer; recording an explicit owner decision |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, and `GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md` |
| Active phase and authorising decision | Approved programme design only — DEC-0042 |
| Checks performed | Recorded the decision without broadening its boundary. Confirmed the decision governs the three-layer model and the private-beta requirement, but leaves authentication, email, source/terms, proxy, capture, DB1, DB2, database, VPS, frontend, and public-release actions for later exact packages. |
| Findings | The design now supplies a coherent sequence, but not operational authority. The first source-facing activity must remain bounded to its route and terms question; the first user-facing data test must remain private beta. |
| Outcome | `PASS` — DEC-0042 approval correctly recorded; no operational action taken. |
| Affected work blocked | All implementation and external/source actions pending their own approval. |
| Owner decision required | Review DEC-0043 and DEC-0044 when prepared. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0052

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0043 private-beta access-foundation proposal preparation |
| Reviewer role | Maintainer; DEC-0043 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0009, DEC-0042, and `PRIVATE_BETA_ACCESS_FOUNDATION_PROPOSAL_DEC0043.md` |
| Active phase and authorising decision | DEC-0042 programme design; proposal preparation only |
| Checks performed | Kept account-control records outside DB1/raw storage and within a separately permissioned schema in the approved two-database layout. Specified one-way credentials/tokens, server-side layer checks, superuser approval/revocation, bounded guest access, server-only Resend values, and staged synthetic-layer acceptance. |
| Findings | A private beta needs its own auditable access boundary before it can safely gate research layers. The design avoids creating a third research database while requiring proof that account controls cannot read research data. |
| Outcome | `PASS` for proposal preparation only. No account, secret, email, database, application, VPS, or data action occurred. |
| Affected work blocked | All DEC-0043 implementation stages and every data-layer route remain blocked pending owner approval and later exact packages. |
| Owner decision required | DEC-0043. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0053

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0044 Bills route-qualification/source-terms proposal preparation |
| Reviewer role | Maintainer; DEC-0044 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0008, DEC-0042, catalogue assessment/route metadata, and `GB_SCT_BILLS_ROUTE_QUALIFICATION_AND_SOURCE_TERMS_PROPOSAL_DEC0044.md` |
| Active phase and authorising decision | DEC-0042 programme design; proposal preparation only |
| Checks performed | Confined the proposed inspection to official documentation and terms for `/api/bills` and `/api/bills/:id`; prohibited every API request and raw-page/data retention; separated legal/operational qualification from response-schema observation and later pass-through implementation. |
| Findings | Bills is the smallest coherent first data type, but the catalogue alone cannot establish source authority, allowed relay, handling implications, or research fitness. The terms result must be able to block the route. |
| Outcome | `PASS` for proposal preparation only. No external inspection or source/API action occurred. |
| Affected work blocked | Official documentation inspection, any Bills API request, proxy, capture, DB1/DB2 action, beta interface, and public release remain blocked pending their exact approvals. |
| Owner decision required | DEC-0044. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0054

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner approval of DEC-0043 and DEC-0044; DEC-0044 execution |
| Reviewer role | Maintainer; recording owner decisions and a bounded result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0008, DEC-0009, DEC-0042, DEC-0043, DEC-0044, and the official Open Data, accessibility, copyright, and privacy pages named in the DEC-0044 result |
| Active phase and authorising decision | DEC-0043 approved foundation specification; DEC-0044 bounded documentation/terms qualification |
| Checks performed | Recorded DEC-0043 without treating it as implementation authority. Under DEC-0044, inspected only the named official documentation/terms pages, made no API-route request, and retained no page body or source record. Separated licence evidence from route-response evidence and personal-data classification. |
| Findings | The official licence supplies a conditional reuse framework requiring attribution and avoiding endorsement, but excludes personal data and does not settle exact Bills-response coverage or technical operating conditions. The appropriate result is `PARTIAL_OR_CONDITIONAL`, not a pass-through implementation approval. |
| Outcome | `PASS` for DEC-0043 approval recording and DEC-0044 bounded execution. No account, email, secret, API request, capture, database, application, VPS, or public action occurred. |
| Affected work blocked | DEC-0043 implementation; Bills endpoint observation; pass-through; DB1/DB2; data interface; and public release remain separately gated. |
| Owner decision required | A later exact access-foundation implementation package and/or a separately bounded Bills endpoint-observation proposal, if the owner wishes to proceed. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0055

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-sanctioned read-only pilot access-flow reconnaissance |
| Reviewer role | Maintainer; pilot treated as an untrusted reference |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `GOVERNANCE.md`, DEC-0043, `PILOT_ACCESS_FLOW_RECONNAISSANCE_2026-08-02.md`, and named non-secret pilot source/manifests only |
| Active phase and authorising decision | Reference reconnaissance only; no new-project implementation action |
| Checks performed | Excluded pilot environment/secret files, credentials, database contents, source data, binaries, deployment state, and external services. Compared observed flow concepts against DEC-0043 and explicitly documented non-adopted session, token, storage, and schema patterns. |
| Findings | The pilot is useful evidence of user-flow intent, but not a technical baseline. Its insecure or incompatible patterns must not be copied into the rebuild. |
| Outcome | `PASS` for bounded reference reconnaissance only. |
| Affected work blocked | Copying/migrating pilot code, configuration, data, credentials, infrastructure, or operational claims; all access/data implementation remains gated. |
| Owner decision required | None for this completed reconnaissance. Later implementation requires its own exact proposal. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0056

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-directed inclusion-first master endpoint matrix |
| Reviewer role | Maintainer; recording an explicit owner scope-control decision |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0042, DEC-0044, and `GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md` |
| Active phase and authorising decision | DEC-0045 planning control only |
| Checks performed | Listed every 64 DEC-0007 route form individually; preserved its intended pass-through and DB1 status; retained all existing Tier 1/2 limitations; and separated inclusion, priority, qualification, and operational authority. |
| Findings | Comprehensive research scope and controlled implementation are compatible only when a route block does not silently become a scope deletion. The matrix makes that distinction inspectable and prevents high-volume/future-use routes from disappearing from the plan. |
| Outcome | `PASS` for planning-control documentation only. No source/API request, proxy, capture, database, application, VPS, email, secret, or public action occurred. |
| Affected work blocked | Every route remains blocked from operational use until its own bounded package passes. |
| Owner decision required | A separately approved limited Bills endpoint-observation package, if the owner wishes to begin source-response qualification. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0057

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-approved controlled endpoint-addition path |
| Reviewer role | Maintainer; recording a scope-control clarification |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0045, and `GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md` |
| Active phase and authorising decision | DEC-0045 planning control only |
| Checks performed | Added an explicit `CANDIDATE_ADDITION` path requiring exact route form, discovery evidence, intended layer/tier position, qualification plan, and owner approval. Confirmed that it supplements—not silently changes—the approved DEC-0007 inventory. |
| Findings | Future completeness needs a controlled way to add relevant routes, while research discipline requires that discovery alone never creates operational authority. |
| Outcome | `PASS` for documentation/governance clarification only. No external, source/API, proxy, capture, database, application, VPS, email, secret, or public action occurred. |
| Affected work blocked | Every candidate addition remains blocked until its own owner-approved route-addition decision and later bounded operational package. |
| Owner decision required | A future specific route-addition decision only if an unselected relevant endpoint is identified. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0058

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0046 Bills collection observation proposal preparation |
| Reviewer role | Maintainer; DEC-0046 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0008, DEC-0044, DEC-0045, and `GB_SCT_BILLS_COLLECTION_OBSERVATION_PROPOSAL_DEC0046.md` |
| Active phase and authorising decision | Proposal preparation only; no source-response action authorised |
| Checks performed | Bounded the scope to one specified collection URL with no query, credential, redirect, retry, detail request, or persistence; set size/time limits; required in-memory value-free observation and explicit disposal; and separated the output from raw capture, DB1, DB2, pass-through, and frontend work. |
| Findings | A single collection response can establish only a preliminary transport/schema contract. It must not become a substitute for route-level handling, capture evidence, or field semantics. |
| Outcome | `PASS` for proposal preparation only. No API route was requested and no source data was received, retained, parsed, or exposed. |
| Affected work blocked | The proposed observation and every later source/API, proxy, DB1/DB2, authentication, frontend, VPS, and public activity pending the relevant approval. |
| Owner decision required | DEC-0046. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0059

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0046 owner approval and one-request execution |
| Reviewer role | Maintainer; recording a bounded source-observation result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0046, the master endpoint matrix, and `GB_SCT_BILLS_COLLECTION_OBSERVATION_RESULT_2026-08-02.md` |
| Active phase and authorising decision | DEC-0046 one-request Bills collection observation |
| Checks performed | Made one unauthenticated no-query/no-redirect `GET` to the specified collection URL. The 99,823-byte response was below the 2 MiB ceiling and was decoded in memory only. Retained field names/types/counts and transport metadata, not raw bytes, values, headers, digests, screenshots, or payload excerpts. Removed the transient observer after completion. |
| Findings | The route returned a JSON array with 473 elements and seven observed top-level fields. `PersonID` and `ThirdPartyOrganisation` names require restrictive-default handling pending a field/route assessment. The result does not establish completeness, semantics, stable IDs, or pass-through/capture suitability. |
| Outcome | `PASS` within DEC-0046 scope. No detail route, retry, capture, DB1/DB2, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills detail observation, route handling, pass-through, DB1/DB2, authentication/frontend, and public release require separate packages. |
| Owner decision required | A separately approved next Bills route-handling or detail-route observation package, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0060

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0047 Bills collection route-handling assessment |
| Reviewer role | Maintainer; completing an owner-authorised documentation-only assessment |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0046, the master endpoint matrix, and `GB_SCT_BILLS_COLLECTION_ROUTE_HANDLING_ASSESSMENT_DEC0047.md` |
| Active phase and authorising decision | DEC-0047 formal handling assessment for `/api/bills` only |
| Checks performed | Applied every field in the DEC-0008 source-handling template to the collection route; retained the distinction between the evidence-limited collection observation and unobserved detail route; classified raw and DB1 handling separately from non-content provenance; and prohibited content retention or release where terms, personal-data, retention, and operating conditions remain unresolved. |
| Findings | The field names `PersonID` and `ThirdPartyOrganisation`, together with unassessed string content and partial route-specific terms evidence, prevent any capture or public-output classification. `DO_NOT_CAPTURE_OR_RELEASE` is a visible control, not a route retirement: DEC-0045's inclusion-first scope remains unchanged. |
| Outcome | `PASS` for a documentation-only restrictive assessment. No source request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills collection/detail capture, pass-through, DB1/DB2, beta/public output, and all source-content handling remain blocked pending a separately approved exact package and resolution of its applicable handling conditions. |
| Owner decision required | A separately approved transient, value-free Bills detail-observation package, if the owner wishes to continue source reconnaissance. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |
