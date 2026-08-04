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

### GOV-REV-0061

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0048 Bills detail-observation proposal preparation |
| Reviewer role | Maintainer; DEC-0048 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0047, the master endpoint matrix, and `GB_SCT_BILLS_DETAIL_OBSERVATION_PROPOSAL_DEC0048.md` |
| Active phase and authorising decision | Proposal preparation only, following the owner instruction to prepare the next bounded Bills reconnaissance package |
| Checks performed | Constrained the proposal to a maximum of two unauthenticated no-query/no-redirect requests. The collection response may select only the first element's usable numeric `ID` in memory; its value, the resolved detail URL, and all source values are prohibited from retention. The detail response is limited to a value-free field/type/shape result with 2 MiB and time ceilings, explicit stop conditions, and no implementation authority. |
| Findings | A dynamic identifier can be used without preserving source content only when the selection rule is fully deterministic and the detail request cannot fall back to another ID or route. This proposed control reduces detail-route uncertainty without treating it as capture or a handling/public-output decision. |
| Outcome | `PASS` for proposal preparation only. No source request, source value, capture, proxy, database, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | The two proposed requests and every capture, pass-through, DB1/DB2, beta/public output, or implementation action remain blocked pending DEC-0048 owner approval and their separate later gates. |
| Owner decision required | DEC-0048. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0062

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0048 owner approval and transient detail-observation execution |
| Reviewer role | Maintainer; recording a bounded source-observation result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0048, the master endpoint matrix, and `GB_SCT_BILLS_DETAIL_OBSERVATION_RESULT_2026-08-02.md` |
| Active phase and authorising decision | DEC-0048 two-request transient Bills detail observation |
| Checks performed | Made one no-query/no-authentication/no-redirect collection request, applied the exact first-element numeric-ID selection rule only in memory, then made one no-query/no-authentication/no-redirect detail request. Both responses were below 2 MiB and received without a retry. Retained transport metadata and detail field names/types/null state only; no selected identifier, resolved URL, source value, raw body, digest, header value, screenshot, database/file record, or log payload was retained. Removed the transient observer. |
| Findings | The detail response was a JSON object with the same seven observed top-level field names as the collection response; its detail-specific type pattern is recorded separately. `PersonID`, `ThirdPartyOrganisation`, and unassessed strings leave terms application, personal-data treatment, retention fit, and public-output suitability unresolved. |
| Outcome | `PASS` within DEC-0048's exact source-observation scope. No capture, proxy, DB1/DB2, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills capture, pass-through, DB1/DB2, beta/public output, and source-content handling remain blocked pending a completed detail handling assessment and later separate packages. |
| Owner decision required | A documentation-only Bills detail route-handling assessment, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0063

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0049 Bills detail route-handling assessment |
| Reviewer role | Maintainer; completing an owner-authorised documentation-only assessment |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0048, the master endpoint matrix, and `GB_SCT_BILLS_DETAIL_ROUTE_HANDLING_ASSESSMENT_DEC0049.md` |
| Active phase and authorising decision | DEC-0049 formal handling assessment for `/api/bills/:id` only |
| Checks performed | Applied every DEC-0008 source-handling template field to the detail route; kept the transient one-record observation distinct from unobserved parameter, error, and response variation; retained the raw/DB1/public-output distinction; and prohibited source-content retention or release while terms, personal-data, retention, and operating conditions remain unresolved. |
| Findings | The detail route has the same fundamental qualification gap as the collection route. The single observed `PersonID` and `ThirdPartyOrganisation` field patterns cannot establish their legal or semantic treatment. `DO_NOT_CAPTURE_OR_RELEASE` is therefore required for `/api/bills/:id` and does not retire it from DEC-0045 scope. |
| Outcome | `PASS` for a documentation-only restrictive assessment. No source request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills capture, pass-through, DB1/DB2, beta/public output, and all Bills source-content handling remain blocked pending a Bills-family qualification-gap resolution and later separate packages. |
| Owner decision required | A documentation-only Bills-family qualification-gap resolution proposal, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0064

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0050 Bills-family qualification-gap resolution proposal preparation |
| Reviewer role | Maintainer; DEC-0050 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0049, the master endpoint matrix, both Bills handling assessments, and `GB_SCT_BILLS_FAMILY_QUALIFICATION_GAP_RESOLUTION_PROPOSAL_DEC0050.md` |
| Active phase and authorising decision | Proposal preparation only, following the owner instruction to prepare the Bills-family gap-resolution plan |
| Checks performed | Consolidated the two route-specific blocks without treating them as retirement; separated source authority/terms, technical conditions, field semantics, personal-data handling, retention/access, and output fitness into ordered G1–G6 gates; and prohibited external inspection, source request, retention, implementation, and public action. |
| Findings | The observations narrowed response-shape uncertainty but did not replace source documentation, handling evidence, or implementation/release controls. The proposed sequence makes unresolved evidence visible and prevents a generic licence, a transient sample, or a future frontend from being used as a substitute for route-level qualification. |
| Outcome | `PASS` for proposal preparation only. No source request, external inspection, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | All Bills capture, pass-through, DB1/DB2, beta/public output, and later evidence packages remain blocked pending DEC-0050 owner approval and their respective exact approvals. |
| Owner decision required | DEC-0050. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0065

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0050 owner approval and DEC-0051 official-documentation inspection proposal preparation |
| Reviewer role | Maintainer; recording an approved planning control and a new proposed external-inspection package |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044–DEC-0050, the master endpoint matrix, and `GB_SCT_BILLS_OFFICIAL_DOCUMENTATION_INSPECTION_PROPOSAL_DEC0051.md` |
| Active phase and authorising decision | DEC-0050 approved planning control; DEC-0051 proposal preparation only |
| Checks performed | Recorded DEC-0050 without treating it as inspection authority. Bounded DEC-0051 to four previously identified official HTTPS pages, one attempt each, no redirect/link-following, and a concise non-content G1–G3 result. Prohibited every API route, source-data retrieval, raw-page retention, external search/contact, and implementation action. |
| Findings | Re-checking named official material may confirm an explicit condition or an enduring evidence gap, but page silence cannot create a permission. Route-specific source/data and handling conditions remain blocked unless the result supplies direct support. |
| Outcome | `PASS` for DEC-0050 approval recording and DEC-0051 proposal preparation only. No external page, source/API request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | The four proposed page inspections and all Bills capture, pass-through, DB1/DB2, beta/public output, and implementation work remain blocked pending DEC-0051 owner approval and later exact packages. |
| Owner decision required | DEC-0051. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0066

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0051 owner approval and bounded documentation-inspection stop |
| Reviewer role | Maintainer; recording an external-inspection result that stopped under its own controls |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0044, DEC-0047, DEC-0049–DEC-0051, the master endpoint matrix, and `GB_SCT_BILLS_OFFICIAL_DOCUMENTATION_INSPECTION_RESULT_2026-08-02.md` |
| Active phase and authorising decision | DEC-0051 four-page official-documentation inspection |
| Checks performed | Submitted the exact four named page URLs in one bounded inspection call, without an API-route request or link-following instruction. The available tool returned an unexpected output shape before page-specific metadata/evidence could be safely recorded. Applied the one-attempt/no-adaptation stop condition: no retry, alternate retrieval, page expansion, API request, or content retention followed. |
| Findings | The stop creates no evidence about page availability or content. G1–G3 remain unresolved, and the project cannot infer a source permission, technical condition, or field definition from the failed evidence path. RSK-0034 records the recovery boundary. |
| Outcome | `BLOCKED` for DEC-0051 evidence collection; `PASS` for preserving containment and a non-content stop record. No API request, source-data retrieval, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | All Bills capture, pass-through, DB1/DB2, beta/public output, and further official-documentation inspection remain blocked pending a separately approved recovery proposal. |
| Owner decision required | A documentation-only official-documentation inspection recovery proposal, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0067

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0052 Bills official-documentation recovery proposal preparation |
| Reviewer role | Maintainer; DEC-0052 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0044, DEC-0047, DEC-0049–DEC-0051, the Bills matrix, and `GB_SCT_BILLS_OFFICIAL_DOCUMENTATION_RECOVERY_PROPOSAL_DEC0052.md` |
| Active phase and authorising decision | DEC-0050 approved G1–G6 planning control; owner instruction to prepare DEC-0052 only |
| Checks performed | Preserved DEC-0051 as exhausted rather than treating a new package as an implicit retry. Required an inert non-network evidence-output preflight before any fresh page request; bounded the recovery to four exact URLs, sequential single attempts, no redirects/link-following, and a concise non-content result. Prohibited all API, source-data, retention, system, and public work. |
| Findings | The proposal gives the RSK-0034 tool-output failure a clear recovery route while retaining the evidence boundary: a failed preflight prevents any external call, and a page-specific stop cannot be converted into an API request, broader browsing, or permission inference. G1–G3 and both route blocks remain unresolved. |
| Outcome | `PASS` for proposal preparation only. No external page/API request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | The DEC-0052 procedure preflight, every fresh page request, and all Bills capture, pass-through, DB1/DB2, beta/public output, and implementation work remain blocked pending owner approval and later exact packages. |
| Owner decision required | DEC-0052. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0068

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0052 approval and official-documentation recovery result |
| Reviewer role | Maintainer; recording an approved bounded external-inspection result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0044, DEC-0047, DEC-0049–DEC-0052, the Bills matrix, and `GB_SCT_BILLS_OFFICIAL_DOCUMENTATION_RECOVERY_RESULT_2026-08-02.md` |
| Active phase and authorising decision | DEC-0050 G1–G6 planning control; DEC-0052 G1–G3 recovery package |
| Checks performed | Passed the inert non-network output-procedure check. Requested each exact approved page once, sequentially, with no redirect/link following, API call, query, credential, source-data retention, or scope expansion. Retained only concise paraphrases, page URLs, access outcomes, and gap conclusions. |
| Findings | The official pages provide limited general evidence that the SPCB operates the Open Data website and licenses published information subject to conditions/exclusions. They do not establish Bills-route licence coverage, technical conditions, or source field/identifier semantics. G1 is `PARTIAL_OR_CONDITIONAL`; G2–G3 are `UNRESOLVED`. |
| Outcome | `PARTIAL_OR_CONDITIONAL` for DEC-0052. Both Bills routes remain `DO_NOT_CAPTURE_OR_RELEASE`. No API request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills capture, pass-through, DB1/DB2, beta/public output, and implementation remain blocked. No further documentation inspection is authorised. |
| Owner decision required | A documentation-only G4 Bills handling assessment, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0069

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0053 G4 handling-assessment proposal preparation |
| Reviewer role | Maintainer; DEC-0053 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0045–DEC-0052, both Bills route-handling records, both value-free observation results, and `GB_SCT_BILLS_G4_HANDLING_ASSESSMENT_PROPOSAL_DEC0053.md` |
| Active phase and authorising decision | DEC-0050 approved G1–G6 planning control; owner instruction to prepare DEC-0053 only |
| Checks performed | Limited the proposal to named, existing non-content records and separate collection/detail conclusions. Prohibited external inspection, source/API/data access, legal classification, and all system/public action. Required unresolved potential personal-data, sensitive-content, or linking implications to preserve the existing restrictive class. |
| Findings | The DEC-0052 privacy/terms material is general and the prior observations intentionally omit values and definitions. A G4 assessment can clarify the project-handling consequence of that uncertainty, but cannot turn it into a data classification or operational permission. |
| Outcome | `PASS` for proposal preparation only. No external request, source/data action, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | The DEC-0053 assessment and all Bills capture, pass-through, DB1/DB2, beta/public output, and implementation work remain blocked pending owner approval and later exact packages. |
| Owner decision required | DEC-0053. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0070

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0053 approval and G4 handling-assessment result |
| Reviewer role | Maintainer; recording an approved internal non-content assessment result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0045–DEC-0053, both Bills route-handling records, both value-free observation results, and `GB_SCT_BILLS_G4_HANDLING_ASSESSMENT_RESULT_2026-08-02.md` |
| Active phase and authorising decision | DEC-0050 G1–G6 planning control; DEC-0053 G4 internal assessment |
| Checks performed | Compared only DEC-0053's named non-content inputs. Separated observed names/types/null states from source semantics or legal classification; applied DEC-0008's restrictive-default rule without inferring actual content, personal-data status, or operating permission. |
| Findings | General source terms/privacy material and value-free shape evidence cannot establish the personal-data, sensitive-content, or linkage implications of either route's actual content. G4 therefore remains `BLOCKED_PENDING_OWNER_DECISION`; G1 is partial and G2–G3 unresolved. |
| Outcome | `BLOCKED_PENDING_OWNER_DECISION` for G4; `PASS` for contained assessment execution. Both Bills routes remain `DO_NOT_CAPTURE_OR_RELEASE`. No external request, source/data action, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Bills capture, pass-through, DB1/DB2, beta/public output, G5/G6 revision, and implementation remain blocked. |
| Owner decision required | A documentation-only unresolved-evidence strategy, if the owner wishes to continue. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0071

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-requested source-qualification control improvement and DEC-0054 work-package proposal preparation |
| Reviewer role | Maintainer; DEC-0054 is proposed and has no owner approval |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0045, DEC-0050–DEC-0053, prior Bills observations/handling records, and `GB_SCT_BILLS_FOUNDATION_QUALIFICATION_WORK_PACKAGE_PROPOSAL_DEC0054.md` |
| Active phase and authorising decision | Owner instruction to prepare a faster but bounded control model; DEC-0054 proposal preparation only |
| Checks performed | Replaced sequential one-action approvals with one proposed named-route/fixed-request package. Preserved route-specific limits, transient value-free handling, independent family results, rolling reporting, and mandatory stops for any exception. Excluded capture, retention, release, implementation, credentials, contact, and scope expansion. |
| Findings | The prior approach gave strong traceability but imposed unnecessary delay on routine observations. A work package can preserve academic transparency where its cohort, request cap, evidence fields, disposal rule, and escalation boundary are explicit. |
| Outcome | `PASS` for proposal preparation only. No external request, source/data action, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | The DEC-0054 work package and all Bills capture, pass-through, DB1/DB2, beta/public output, and implementation work remain blocked pending owner approval. |
| Owner decision required | DEC-0054. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0072

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0054 owner approval and work-package start |
| Reviewer role | Maintainer; recording the approved qualification boundary before external execution |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0045, DEC-0050–DEC-0054, and the DEC-0054 rolling record |
| Active phase and authorising decision | DEC-0054 Bills-foundation transient source qualification |
| Checks performed | Added the approved source-qualification work-package controls to `AGENTS.md` and `GOVERNANCE.md`. Confirmed the route cohort, eight-request limit, one in-memory selection rule per family, 2 MiB ceiling, persistence prohibition, rolling record, and exception-only stop conditions. |
| Findings | The approved package accelerates ordinary planned observations while leaving capture, retention, release, implementation, credentials, external contact, and scope expansion separately gated. |
| Outcome | `PASS` for work-package start. No external request, source/data action, capture, database, proxy, frontend, account, VPS, email, secret, or public action had occurred at this review point. |
| Affected work blocked | Any action outside the four named route families and all capture, pass-through, DB1/DB2, beta/public output, and implementation work remain blocked. |
| Owner decision required | None for normal DEC-0054 execution; a new decision is required for a stop condition or excluded action. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0073

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0054 source-qualification output-hygiene stop |
| Reviewer role | Maintainer; recording an unexpected containment exception |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0008, DEC-0045, DEC-0054 proposal/rolling record/stop result, and the master matrix |
| Active phase and authorising decision | DEC-0054 Bills-foundation transient source qualification |
| Checks performed | Formal Stages used its two permitted requests with no retry or route expansion. The tool summary exposed the transient selection identifier, contrary to the persistence/output prohibition. Stopped the entire package, retained no identifier in a project record, and added an explicit output-allowlist rule to the approved control model. |
| Findings | The safe field/type summary is usable as limited observation evidence, but the execution exception prevents treating the work package as normal completion. Stage Types, Bill Types, and Sessions were not requested. |
| Outcome | `STOPPED` for DEC-0054; `PASS` for containment after detection. No capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred. |
| Affected work blocked | Remaining DEC-0054 source requests, all Bills capture/pass-through/DB1/DB2/beta/public output, and implementation work remain blocked. |
| Owner decision required | A recovery package with a validated output allowlist before any further source request. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0074

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-directed correction to exploratory-reconnaissance controls |
| Reviewer role | Maintainer; recording the owner-approved DEC-0055 operating boundary |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0007, DEC-0008, DEC-0045, DEC-0054, and DEC-0055 |
| Active phase and authorising decision | DEC-0055 public API exploratory reconnaissance |
| Checks performed | Separated normal public-API inspection from capture/retention/release. Replaced per-request gates with cohort reporting, allowed transient ordinary identifiers/values for list/detail inspection, and retained strict stops for credentials, external contact, unapproved scope, bulk/persistence, legal interpretation, system work, and public output. |
| Findings | The prior model applied production-ingestion controls too early. DEC-0055 better matches the actual task—understanding a public API inventory and its practical limits—without weakening the academic data-management gates that follow reconnaissance. |
| Outcome | `PASS` for DEC-0055 control reset. No new external request, capture, database, proxy, frontend, account, VPS, email, secret, or public action occurred in this review. |
| Affected work blocked | Capture, retention, pass-through, DB1/DB2, beta/public output, implementation, external contact, and new endpoint families remain blocked. |
| Owner decision required | None for ordinary DEC-0055 reconnaissance; owner approval remains required at the stated later gates or if a stop condition occurs. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0075

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0059 private-beta runtime/cutover preflight |
| Reviewer role | Maintainer; recording owner-authorised preflight and a dependency block before mutation |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0009, DEC-0041–DEC-0043, DEC-0056, DEC-0058, and DEC-0059 |
| Active phase and authorising decision | DEC-0059 controlled private-beta runtime and named-site cutover package |
| Checks performed | Read only the named project service/listener/cluster/secret-root metadata, the configured private cluster socket setting, and the existing `legislativedata.org` Nginx site. Checked the public domain response without retaining account or source data. Checked only the required variable names in the owner-controlled local input, not values. |
| Findings | The two project services and isolated cluster are active. The named site points at unused port 3100 and returns 502 publicly; the project web service is healthy only on loopback 3220. The required owner-provided value names were absent, so a usable authentication/bootstrap flow cannot be deployed or tested. |
| Outcome | `BLOCKED` pending `INITIAL_SUPERUSER_EMAIL`, `RESEND_API_KEY`, and `ACCESS_FROM_EMAIL`. No secret, database, email, service, Nginx, source, DB1, DB2, or public-route mutation occurred. |
| Affected work blocked | DEC-0059 database/grant activation, runtime deployment, bootstrap email, and named-site cutover. Source relay, DB1, and DB2 remain excluded independently. |
| Owner decision required | No new decision; provide the three named values in the owner-controlled input, then execution may resume within DEC-0059. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0076

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0059 runtime/cutover completion after origin-proxy correction |
| Reviewer role | Maintainer; recording the approved package result and the contained correction |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0043, DEC-0058, DEC-0059, and both DEC-0059 stop records |
| Active phase and authorising decision | DEC-0059 controlled private-beta runtime and named-site cutover |
| Checks performed | Verified target-host build/tests/capability scan, canonical access-control migration, API/web loopback readiness, named-site proxy readiness after Nginx reload, direct-origin HTTPS, and normal public HTTPS. The two HTTPS checks returned HTTP 200. No Cloudflare configuration, source action, DB1, DB2, or research-data route was changed. |
| Findings | The prior 502 arose from the project deployment procedure retaining the legacy port-3100 configuration and checking too soon after Nginx reload. The bounded retry corrects only that procedure. Authentication is available; all research-data layers remain unavailable. |
| Outcome | `PASS` for the completed DEC-0059 runtime/cutover scope. DEC-0059 remains `EXECUTED PARTIAL` pending owner acceptance of the superuser activation journey; no data release is claimed. |
| Affected work blocked | Source relay, DB1, DB2, research output, and public data access remain blocked. DEC-0057 remains proposed. |
| Owner decision required | No decision for owner acceptance of the deployed activation flow; DEC-0057 approval is required before proxy implementation. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0077

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-observed DEC-0059 activation UX correction |
| Reviewer role | Maintainer; recording a bounded client/runtime correction within the existing private-beta package |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, DEC-0043, DEC-0058, and DEC-0059 |
| Active phase and authorising decision | DEC-0059 private-beta access runtime/cutover; owner instruction to proceed with the described activation and style correction |
| Checks performed | Confirmed the observed account state: password creation had issued a session but the client retained its activation-token view. Verified the corrected session-confirmed transition, original access-shell styling, deployment-script session-pepper preservation, target-host checks, API/Nginx readiness, active services, and public HTTPS. |
| Findings | The correction affects no source, DB1, DB2, research-data route, external font, pilot component, pilot data, or account-policy semantics. Existing valid sessions are retained across this routine release. |
| Outcome | `PASS` for the bounded correction. DEC-0059 remains `EXECUTED PARTIAL` until the owner confirms normal login and the signed-in shell. |
| Affected work blocked | Source relay, DB1, DB2, research output, and public data access remain blocked. DEC-0057 remains proposed. |
| Owner decision required | No new decision for final owner login/shell acceptance; DEC-0057 approval remains required before proxy implementation. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0078

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — owner-observed failed activation and contained DEC-0059 recovery |
| Reviewer role | Maintainer; recording an activation-flow defect, failed recovery attempt, and successful retry |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, DEC-0043, DEC-0058, and DEC-0059 |
| Active phase and authorising decision | DEC-0059 private-beta access runtime/cutover; owner instruction to repair the reported activation/login failure |
| Checks performed | Confirmed the supplied superuser account was pending with no usable credential or active session, without reading a password or token. Identified prior pepper rotation as the cause of invalidating the original activation link. Verified the truthful activation response, one-use pending-superuser recovery conditions, no-store HTML response, target-host checks, API/Nginx readiness, public HTTPS, and successful redacted email-send result. The first sender attempt stopped and restored the prior release before any email/account mutation; the corrected retry sent exactly one replacement link. |
| Findings | The original generic-success activation response was incompatible with truthful user feedback. The correction exposes no public recovery route, preserves the no-data application boundary, and records the failed sender attempt rather than concealing it. |
| Outcome | `PASS` for the contained recovery. DEC-0059 remains `EXECUTED PARTIAL` pending the owner using the new link and confirming the signed-in shell. |
| Affected work blocked | Source relay, DB1, DB2, research output, and public data access remain blocked. DEC-0057 remains proposed. |
| Owner decision required | No new decision for the final owner activation acceptance; DEC-0057 approval remains required before proxy implementation. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0079

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0059 owner acceptance completion |
| Reviewer role | Maintainer; recording the owner's completed private-beta acceptance test |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, DEC-0043, DEC-0058, and DEC-0059 |
| Active phase and authorising decision | DEC-0059 controlled private-beta access runtime/cutover |
| Checks performed | The owner confirmed the complete tested lifecycle: beta application; superuser review and approval; delivered activation email; password setup; password login; magic-link request and login; password change; sign-out; and absence of superuser controls for an ordinary approved account. The final no-body request-header correction was deployed and the approval/email test then passed. |
| Findings | The private-beta access boundary functions as intended for the exercised lifecycle. The guest-invitation path was not exercised and is not claimed as accepted. No source relay, DB1, DB2, research output, or public data route was enabled. |
| Outcome | `PASS` — DEC-0059 is `APPROVED — EXECUTED PASS` for its tested private-beta runtime/cutover scope. |
| Affected work blocked | Source relay, DB1, DB2, research output, and public data access remain blocked. DEC-0057 remains proposed. |
| Owner decision required | DEC-0057 approval is required before proxy implementation; a later bounded test is required if guest invitations are to be released. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0080

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0057 approval and proxy-phase implementation-package preparation |
| Reviewer role | Maintainer; recording the owner-approved design decision and the fail-closed pre-flight position |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0045, DEC-0055, DEC-0056, DEC-0057, the endpoint matrix, and high-volume audit |
| Active phase and authorising decision | DEC-0057 proxy P0/P2 package preparation only |
| Checks performed | Confirmed that the accepted beta access foundation is available, that all selected route forms remain subject to route-level qualification, and that no form is currently cleared for an upstream relay. Confirmed the design requires route IDs, allowlisted parameters, no response-body persistence, transparent route limitations, and beta-only access. |
| Findings | A local catalogue may be constructed safely only if it rejects every source request before network access until a later route qualification decision enables that individual form. This preserves the no-source, no-DB1/DB2 boundary while allowing the transparency/access contract to be tested. |
| Outcome | `PASS` for DEC-0057 design approval and DEC-0060 proposal preparation. No local implementation, source request, VPS/deployment, cache, database, DB1, DB2, or public action occurred. |
| Affected work blocked | All upstream relay, source requests, capture, DB1, DB2, research output, deployment, and public access remain blocked pending DEC-0060 approval and later route/package gates. |
| Owner decision required | DEC-0060 approval is required before local fail-closed catalogue implementation. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0081

| Field | Record |
| --- | --- |
| Date (UTC) | 2 August 2026 |
| Review type | Triggered — DEC-0060 local catalogue completion |
| Reviewer role | Maintainer; recording the owner-approved local implementation and verification result |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0045, DEC-0056, DEC-0057, and DEC-0060 |
| Active phase and authorising decision | DEC-0060 local fail-closed P2 catalogue implementation |
| Checks performed | Verified the 64-form route registry, exact template parity with the DEC-0045 matrix, authenticated catalogue route, route-ID and parameter validation, no-relayed-state invariant, unauthenticated denial, local unavailable response for a syntactically valid route request, capability scan, production build, 13 passing tests, and local release packaging. |
| Findings | The catalogue implements metadata/access transparency only. Its outbound guard and static scan show that an attempted route test cannot make a source request. The result does not evidence a deployed user interface or a source relay. |
| Outcome | `PASS` — DEC-0060 local scope completed. No VPS, secret, email, database, DB1, DB2, source request/response, cache, download, or public action occurred. |
| Affected work blocked | Upstream relay, source requests, capture, DB1, DB2, research output, deployment, and public access remain blocked pending a later exact route-qualification/deployment package. |
| Owner decision required | A new named-cohort route-qualification and private deployment proposal is required before any source route can be exposed. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0082

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Daily hygiene assessment and triggered DEC-0061 source-facing proposal preparation |
| Reviewer role | Maintainer; recording a documentation-only proposed next phase |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0045, DEC-0055–DEC-0057, DEC-0060, the endpoint matrix, Bills-foundation reconnaissance, and update-signal result |
| Active phase and authorising decision | Documentation-only proposal preparation after DEC-0060; DEC-0061 is not approved |
| Checks performed | Confirmed the repository working state and documentation reading path, retained the active data/application/governance separation, and added no stale/generated artefact. Compared candidate P1 routes against existing observation and update-signal records. Confirmed that Bills remains blocked and that the three named collection forms are small reference candidates but remain handling-unqualified. |
| Findings | The next work must establish route-level published basis and handling before a relay can be implemented or deployed. A combined automatic qualification-to-relay transition would be too broad because an unresolved result must remain visible and unavailable. |
| Outcome | `PASS` for preparation of DEC-0061 only. No source request, source retention, implementation, VPS action, deployment, DB1, DB2, cache, or public action occurred. |
| Affected work blocked | All source requests, source relay, deployment, DB1, DB2, research output, and public access remain blocked pending explicit DEC-0061 approval and its bounded result. |
| Owner decision required | Approve, amend, or reject DEC-0061. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0083

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0061 qualification completion |
| Reviewer role | Maintainer; recording the owner-approved published-basis and handling assessment |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0045, DEC-0055–DEC-0057, DEC-0060, DEC-0061, the existing Bills-foundation and update-signal results, and the named published Scottish Parliament pages |
| Active phase and authorising decision | DEC-0061 three-route qualification only |
| Checks performed | Reused existing structural/transport evidence for Bill Stage Types, Bill Types, and Sessions. Inspected the Open Data portal root and published copyright licence; recorded attribution, non-endorsement, personal-data exclusion, third-party-rights, and no-warranty limitations. No API endpoint was requested. |
| Findings | Each collection is a candidate for a later private no-retention pass-through, not a current relay or data release. The licence position is a source-published statement rather than legal advice; route-specific licence wording and a comprehensive personal-data determination remain unavailable. |
| Outcome | `PASS` — three `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` results. No API endpoint response, source-data retention, source relay, implementation, VPS action, deployment, DB1, DB2, cache, or public action occurred. |
| Affected work blocked | Every relay, deployment, DB1, DB2, research output, and public-access action remains blocked pending a new exact private implementation/deployment decision. |
| Owner decision required | Approve a later exact implementation/deployment package if the three candidates should be made available for private beta testing. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0084

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0062 private pass-through implementation/deployment proposal preparation |
| Reviewer role | Maintainer; recording a proposed exact project-only package |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0056, DEC-0057, DEC-0059–DEC-0061, the three-route qualification result, and existing project deployment controls |
| Active phase and authorising decision | Documentation-only package preparation; DEC-0062 is not approved |
| Checks performed | Restricted the proposal to the three qualified collections and fixed no-query paths; retained beta-only access, source-faithful streaming, no-store/no-buffering/no-retention, explicit source limits, existing loopback services, unchanged named Nginx site, project-only rollback, and owner route-by-route frontend acceptance. |
| Findings | The first deployed source path can remain contained without a database, new secret, account-policy, Cloudflare, or shared-service change. A source transport failure must be visible rather than replaced from a cache or converted into a success response. |
| Outcome | `PASS` for DEC-0062 proposal preparation only. No implementation, source request, VPS action, deployment, database, DB1, DB2, cache, or public action occurred. |
| Affected work blocked | All local source-client code, source relay, VPS deployment, and user-facing source response remain blocked pending DEC-0062 approval. DB1, DB2, research output, and public access remain independently blocked. |
| Owner decision required | Approve, amend, or reject DEC-0062. |
| Next review due | 1 September 2026, or earlier if a review trigger occurs. |

### GOV-REV-0085

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0062 approved local implementation completion |
| Reviewer role | Maintainer; recording the completed local package and narrower release control |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, DEC-0042, DEC-0043, DEC-0056, DEC-0057, DEC-0059–DEC-0062, the three-route qualification result, and the existing deployment script/unit templates |
| Active phase and authorising decision | DEC-0062 exact local pass-through implementation |
| Checks performed | Verified the exact three-ID fixed-path allowlist, beta-only denial, no query route, synthetic redirect/source-error/timeout handling, byte-preserving response stream, required headers, static scope gate, production build, 16 passing tests, and deterministic release package. Rejected reuse of the older cutover script because it writes database credentials and Nginx; added a two-project-service release path that reuses existing configuration instead. |
| Findings | Local code can expose only the approved request-time source boundary without DB1/DB2, cache, source persistence, or a project dataset display. The result does not evidence a real source response, deployment, or frontend acceptance. |
| Outcome | `PASS` — local DEC-0062 scope complete. No source endpoint, VPS, database write/migration, DB1, DB2, cache, email, Nginx write/reload, Cloudflare, or public data action occurred. |
| Affected work blocked | Deployment and owner source-action acceptance remain pending their approved next steps. DB1, DB2, capture, canonical variables, research output, and public data access remain independently blocked. |
| Owner decision required | None for the already approved DEC-0062 preflight/deployment sequence; stop if that project-only check finds a required non-project change. |
| Next review due | On VPS preflight/deployment outcome, or 1 September 2026, whichever is earlier. |

### GOV-REV-0086

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0062 project-only VPS preflight and release |
| Reviewer role | Maintainer; recording an approved deployment result without source retrieval |
| Documents and records reviewed | DEC-0062 local result, two project service templates/release script, project-only preflight output, named site upstreams, target-runtime verification output, and post-release health/boundary checks |
| Active phase and authorising decision | DEC-0062 private two-service deployment |
| Checks performed | Confirmed active isolated cluster/two project services and loopback listeners; inspected only the named `legislativedata.org` upstreams; passed Nginx syntax and local/public shell checks. Built/tested/package-verified release `45e9cea` on the target runtime, replaced only the two project services, confirmed access readiness, then confirmed the unauthenticated source endpoint returns 403 before any upstream request. |
| Findings | The release is contained in the approved project namespace. The initial readiness probes while API startup was in progress failed closed, then the bounded readiness loop reached `ACCESS_CONTROL_READY`. No source endpoint was requested with credentials. |
| Outcome | `PASS` — project-only VPS deployment complete. No source response, database write/migration, DB1, DB2, cache, email, Nginx write/reload, Cloudflare, public data access, or shared-host change occurred. |
| Affected work blocked | Owner source-action acceptance remains pending. DB1, DB2, capture, canonical variables, research output, and public data access remain separately blocked. |
| Owner decision required | No new decision for DEC-0062 acceptance; owner observation of the three already-approved actions is required. |
| Next review due | On owner acceptance outcome, or 1 September 2026, whichever is earlier. |

### GOV-REV-0087

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner-approved DEC-0062 transparency/interface refinement |
| Reviewer role | Maintainer; recording a limited presentation change to the already approved three-route boundary |
| Documents and records reviewed | DEC-0062 package/results, the three-route qualification result, existing relay implementation, capability gate, response-guide text, and two-service release control |
| Active phase and authorising decision | DEC-0062 private-beta acceptance interface refinement |
| Checks performed | Added only three fixed, user-triggered official-source links matching the approved relay paths; made the relay action visibly bordered and labelled; added dated non-live schema/variable/citation disclosures; corrected the health capability labels to distinguish no retained source data from private source pass-through. Verified local and target-runtime production builds, 16 tests, capability scan, two-service release, health response, unauthenticated 403 boundary, and public shell HTTP 200. |
| Findings | The interface makes the difference between source-faithful CLD relay access and direct official API access explicit. No live response is parsed, counted, stored, or transformed by the guide. |
| Outcome | `PASS` — limited transparency refinement deployed as release `5e76611`. No source retrieval by the maintainer, database write/migration, DB1, DB2, cache, Nginx write/reload, Cloudflare, public data release, or shared-host change occurred. |
| Affected work blocked | Owner route-by-route acceptance remains pending. DB1, DB2, capture, canonical variables, research output, and public data access remain separately blocked. |
| Owner decision required | No new decision; continue the existing DEC-0062 owner acceptance with the revised interface. |
| Next review due | On owner acceptance outcome, or 1 September 2026, whichever is earlier. |

### GOV-REV-0088

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0062 owner route acceptance completion |
| Reviewer role | Maintainer; recording the owner-confirmed result without recasting a live source response as project data |
| Documents and records reviewed | DEC-0062 package, local/deployment results, approved three-route registry, route disclosures, and owner confirmation |
| Active phase and authorising decision | DEC-0062 three-route private pass-through acceptance |
| Checks performed | Owner confirmed the three approved route forms behave as expected in the final compact grouped interface. The accepted boundary presents pre-action provenance/limitation disclosure and raw source-response access through the no-retention relay; the separate official API links remain explicit navigation alternatives. |
| Findings | The accepted result proves controlled private source access behaviour, not an immutable project snapshot, schema validation, semantic interpretation, source completeness, freshness, or a research release. The source bodies were viewed transiently and are not retained by CLD. |
| Outcome | `PASS` — DEC-0062 complete for Bill Stage Types, Bill Types, and Sessions. No DB1/DB2 content, database write/migration, cache, canonical variable, chart, export, public data release, or shared-host change is created. |
| Affected work blocked | The other selected route forms remain unavailable pending their own cohort qualification, implementation, and owner acceptance. DB1 and DB2 remain separately blocked. |
| Owner decision required | Approve a proposed next proxy cohort before another route is enabled. |
| Next review due | On next-cohort proposal preparation, or 1 September 2026, whichever is earlier. |

### GOV-REV-0089

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0063 institutional-reference cohort proposal preparation |
| Reviewer role | Maintainer; recording a proposed next proxy qualification gate |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `AGENTS.md`, decision/risk registers, DEC-0042, DEC-0045, DEC-0055–DEC-0057, DEC-0061–DEC-0062, contextual-reference reconnaissance, and roles/committees reconnaissance |
| Active phase and authorising decision | Documentation-only next-cohort proposal; DEC-0063 is not approved |
| Checks performed | Selected only fixed no-query institutional reference/taxonomy collections with existing observation records. Excluded person and time-varying relationship routes, Committees/contact fields, Bills/Formal Stages, detail forms, parameterised routes, firehoses, and reports/votes. Required existing-evidence-only handling assessment before any later relay proposal. |
| Findings | A seven-route qualification proposal can progress the proxy phase while preserving honest limits and avoiding an unsupported inference that reference data is automatically low-risk or analytically settled. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, relay, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | Every DEC-0063 route remains unavailable. Implementation/deployment, DB1, DB2, capture, variables, research output, and public data access remain blocked pending owner decision and later exact packages. |
| Owner decision required | Approve, amend, or reject DEC-0063. |
| Next review due | On DEC-0063 decision/result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0090

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0063 evidence-only qualification execution |
| Reviewer role | Maintainer; recording route-by-route candidate and handling-blocked outcomes without new source access |
| Documents and records reviewed | DEC-0063 proposal; DEC-0061 published-basis result; contextual-reference and roles/committees reconnaissance results; DEC-0045 matrix; retention/publication controls. |
| Active phase and authorising decision | DEC-0063 evidence-only institutional-reference cohort qualification |
| Checks performed | Reused only the recorded fixed collection forms and structural field profiles. Applied the published licence limits and did not infer that a reference/taxonomy label resolves handling. Treated every observed `Notes` field as a material unresolved handling concern. |
| Findings | Constituencies, Regions, and Committee Types meet the narrow candidate threshold. Parties, Party Roles, Government Roles, and Committee Roles do not: existing evidence cannot safely resolve `Notes`-field handling. |
| Outcome | `PASS` — partial candidate result. No source/API/portal/document request, source data, relay, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | No DEC-0063 route is enabled. The four `Notes`-bearing collections remain unavailable pending route-specific terms/handling evidence. DB1 and DB2 remain blocked. |
| Owner decision required | Approve, amend, or reject a later exact implementation/deployment proposal limited to the three candidates. |
| Next review due | On a candidate implementation proposal/result, a blocked-route handling plan, or 1 September 2026, whichever is earlier. |

### GOV-REV-0091

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0064 three-route implementation/deployment proposal preparation |
| Reviewer role | Maintainer; defining the smallest exact execution scope from the DEC-0063 candidates |
| Documents and records reviewed | DEC-0062 implementation/deployment and acceptance records; DEC-0063 proposal/result; DEC-0045 matrix; DEC-0056–DEC-0057; existing private-beta controls. |
| Active phase and authorising decision | Documentation-only proposed next proxy cohort; DEC-0064 is not approved. |
| Checks performed | Limited the proposal to the three qualified fixed no-query collections. Reused the accepted relay, disclosure, no-retention, project-only deployment, rollback, and owner-acceptance controls. Excluded every blocked, detail, parameterised, DB1/DB2, and public-access change. |
| Findings | A six-route private catalogue (the accepted first cohort plus three candidates) can be proposed without weakening the per-route qualification boundary. The candidate status does not itself enable any route. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, code, relay, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All three DEC-0064 candidates remain unavailable. The four `Notes`-bearing routes remain blocked. DB1 and DB2 remain blocked. |
| Owner decision required | Approve, amend, or reject DEC-0064. |
| Next review due | On DEC-0064 decision/result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0092

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0064 local implementation result |
| Reviewer role | Maintainer; recording the approved local six-route implementation boundary and verification outcome |
| Documents and records reviewed | DEC-0064 package; DEC-0062 accepted controls; DEC-0063 result; route registry; fixed source relay; frontend disclosures; synthetic tests; capability scan; package result. |
| Active phase and authorising decision | DEC-0064 local implementation, approved by the owner on 3 August 2026. |
| Checks performed | Limited changes to the three named candidate collections. Confirmed exact six-route allowlist/path tests, source-faithful synthetic streaming, authentication/query denial, no-persistence static scan, and B1 package generation. |
| Findings | The local catalogue is consistent with the approved three-route extension and carries route-specific no-interpretation disclosures. The local runtime version is below the pinned target runtime, so it is not used as VPS evidence. |
| Outcome | `PASS` — local implementation only. No source/API request, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | Target deployment and owner acceptance remain pending. The four `Notes`-bearing collections, all other unavailable routes, DB1, and DB2 remain blocked. |
| Owner decision required | None for the already approved DEC-0064 project-only target release; owner route-by-route beta acceptance is required after a passing release. |
| Next review due | On target deployment result, owner acceptance, a deployment stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0093

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0064 project-only target release result |
| Reviewer role | Maintainer; recording a target deployment result without treating it as source or owner-acceptance evidence |
| Documents and records reviewed | DEC-0064 package/local result; target build/test/capability-scan output; project-only deployment script outcome; existing two-service deployment boundary. |
| Active phase and authorising decision | DEC-0064 project-only target release, approved by the owner on 3 August 2026. |
| Checks performed | Verified pinned-runtime target build, all 16 tests, six-route capability scan, archive creation, two-service immutable release, bounded readiness, unauthenticated source-route denial, unchanged Nginx syntax, and public shell HTTP 200. |
| Findings | The two initial readiness polls were connection-refused while the API started; the subsequent bounded readiness check passed. No source body was requested. The release remained within the two-project-service scope. |
| Outcome | `PASS` — target deployment complete; owner route-by-route beta acceptance pending. No source data, database/DB1/DB2, cache, email, Nginx, Cloudflare, public data access, or shared-service change occurred. |
| Affected work blocked | DEC-0064 is not complete until owner acceptance of all three new actions. The four `Notes`-bearing collections, all other unavailable routes, DB1, and DB2 remain blocked. |
| Owner decision required | No further deployment decision. Owner acceptance is required after testing Constituencies, Regions, and Committee Types one at a time. |
| Next review due | On owner acceptance, a route failure, or 1 September 2026, whichever is earlier. |

### GOV-REV-0094

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0064 owner route acceptance completion |
| Reviewer role | Maintainer; recording the owner-confirmed beta result without recasting transient source material as project data |
| Documents and records reviewed | DEC-0064 package, local/deployment result, approved six-route registry, route disclosures, and owner confirmation. |
| Active phase and authorising decision | DEC-0064 three-route institutional-reference private pass-through acceptance |
| Checks performed | The owner confirmed that all three approved route forms behave as expected after testing their disclosed CLD no-retention relay and direct official-source actions. |
| Findings | The result proves controlled private source-access behaviour for the three fixed routes, not a capture, immutable snapshot, schema validation, semantic interpretation, source completeness, freshness, or research release. Source material was viewed transiently and is not retained by CLD. |
| Outcome | `PASS` — DEC-0064 complete for Constituencies, Regions, and Committee Types. No DB1/DB2 content, database write/migration, cache, canonical variable, chart, export, public data release, or shared-host change is created. |
| Affected work blocked | The four `Notes`-bearing collections remain unavailable pending their own handling plan. All other selected route forms remain unavailable pending separate qualification; DB1 and DB2 remain blocked. |
| Owner decision required | Approve a separately proposed next proxy cohort before another route is enabled. |
| Next review due | On next-cohort proposal preparation, a handling plan, or 1 September 2026, whichever is earlier. |

### GOV-REV-0095

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0065 structured-link and event-taxonomy qualification proposal preparation |
| Reviewer role | Maintainer; defining the next evidence-only proxy gate from existing reconnaissance |
| Documents and records reviewed | DEC-0061 published-basis result; MQA first-pass and high-volume-route reconnaissance; roles/committees reconnaissance; DEC-0045; DEC-0056–DEC-0057; DEC-0064 acceptance record. |
| Active phase and authorising decision | Documentation-only next-cohort proposal; DEC-0065 is not approved. |
| Checks performed | Selected only fixed no-query collections with existing structural/volume evidence. Excluded free-text Event Subtypes, all parameters/details, person/contact/`Notes` routes, and high-volume forms. Retained explicit uncertainty for all identifiers, link direction, event meaning, and taxonomy semantics. |
| Findings | A three-route evidence-only assessment can test whether small taxonomy/link material is suitable for later transient access without treating its structural fields as resolved relationships or research data. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | Every DEC-0065 route remains unavailable. Event Subtypes, the four `Notes`-bearing routes, all other selected forms, DB1, and DB2 remain blocked. |
| Owner decision required | Approve, amend, or reject DEC-0065. |
| Next review due | On DEC-0065 decision/result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0096

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0065 evidence-only qualification execution |
| Reviewer role | Maintainer; recording route-by-route candidate outcomes without new source access |
| Documents and records reviewed | DEC-0065 proposal; DEC-0061 published-basis result; MQA first-pass/high-volume-route and roles/committees reconnaissance results; DEC-0045 matrix; retention/publication controls. |
| Active phase and authorising decision | DEC-0065 evidence-only structured-link and event-taxonomy qualification |
| Checks performed | Reused only the fixed collection forms, structural/volume observations, and published licence limits. Did not infer entity identity, link direction, taxonomy/event meaning, or data classification from identifier fields. |
| Findings | Committee Type Links, MQA Event Types, and unfiltered MQA Event Links meet the narrow raw no-retention candidate threshold. The event-link response profile requires visible size/source-window disclosure later. |
| Outcome | `PASS` — three candidate result. No source/API/portal/document request, source data, relay, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | No DEC-0065 route is enabled. MQA Event Subtypes, all detail/parameterised forms, the four `Notes`-bearing collections, DB1, and DB2 remain blocked. |
| Owner decision required | Approve, amend, or reject a later exact implementation/deployment proposal limited to the three candidates. |
| Next review due | On a candidate implementation proposal/result, a blocked-route handling plan, or 1 September 2026, whichever is earlier. |

### GOV-REV-0097

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0066 three-route implementation/deployment proposal preparation |
| Reviewer role | Maintainer; defining the smallest exact execution scope from DEC-0065 candidates |
| Documents and records reviewed | DEC-0064 implementation/deployment and acceptance records; DEC-0065 proposal/result; DEC-0045 matrix; DEC-0056–DEC-0057; existing private-beta controls. |
| Active phase and authorising decision | Documentation-only proposed next proxy cohort; DEC-0066 is not approved. |
| Checks performed | Limited the proposal to the three qualified fixed no-query collections. Reused the accepted relay/disclosure/no-retention/deployment/rollback/owner-acceptance controls, and added a historical size/source-window disclosure requirement for Event Links. Excluded all parameter/detail, free-text, DB1/DB2, and public-access changes. |
| Findings | A nine-route private catalogue can be proposed without treating any new route’s identifiers or link structure as a resolved relationship or analytical input. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, code, relay, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All three DEC-0066 candidates remain unavailable. MQA Event Subtypes, the four `Notes`-bearing collections, all other selected forms, DB1, and DB2 remain blocked. |
| Owner decision required | Approve, amend, or reject DEC-0066. |
| Next review due | On DEC-0066 decision/result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0098

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0068 evidence-only handling-batch execution |
| Reviewer role | Maintainer; consolidating recorded handling concerns without asserting source-content classifications |
| Documents and records reviewed | DEC-0068 proposal; existing member/representation, roles/committees, MQA, and contextual-reference reconnaissance; DEC-0061; DEC-0067; and DEC-0008. |
| Active phase and authorising decision | DEC-0068 repository-only route-handling assessment |
| Checks performed | Mapped exactly the 24 named non-Bills forms to recorded person/relationship, `Notes`, committee contact/description, or MQA `IntroText` concerns. Kept unknown content, terms, route conditions, and classification explicit. |
| Findings | The 24 forms reduce to four cross-route workstreams. This improves planning visibility but supplies no evidence that any route may be exposed, retained, or interpreted. |
| Outcome | `PASS` — evidence-only handling consolidation. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All 24 forms remain unavailable. The contract and operational backlogs, DB1, and DB2 remain separately blocked. |
| Owner decision required | Approve a later shared handling-policy design proposal before any source-inspection or route-qualification package. |
| Next review due | On that shared policy decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0099

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0069 shared handling-policy design proposal preparation |
| Reviewer role | Maintainer; defining a reusable assessment gate without converting it into a route decision |
| Documents and records reviewed | DEC-0008 policy and handling template; DEC-0045 matrix; DEC-0067 triage; DEC-0068 result; member/representation, roles/committees, and MQA reconnaissance records. |
| Active phase and authorising decision | Documentation-only proposal preparation after the completed DEC-0068 assessment; DEC-0069 is not approved. |
| Checks performed | Limited the framework to six route-level tests: scope/purpose, evidence boundary, content/linkage screen, processing/minimisation, controls/lifecycle, and stop/outcome. Confirmed the four workstreams do not transfer an outcome between route forms. |
| Findings | A shared framework can reduce serial repetition while retaining the DEC-0008 requirement for completed, route-specific handling records and explicit operational decisions. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | Every scoped route remains unavailable. Contract and operational batches, DB1, and DB2 remain separately blocked. |
| Owner decision required | Approve, amend, or reject DEC-0069. |
| Next review due | On DEC-0069 decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0100

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0069 shared handling-policy application |
| Reviewer role | Maintainer; applying the adopted framework without asserting a source-content classification |
| Documents and records reviewed | DEC-0069 framework; DEC-0008 policy and handling template; DEC-0045 matrix; DEC-0068 result; member/representation, roles/committees, and MQA reconnaissance records. |
| Active phase and authorising decision | DEC-0069 repository-only handling-register application, approved by the owner on 3 August 2026. |
| Checks performed | Created one route-level record for each of the 24 scoped forms, checked the recorded evidence source and unresolved question, and confirmed the four workstreams do not transfer an outcome between collection/detail forms. |
| Findings | Existing evidence does not resolve essential terms, content, minimisation, control, lifecycle, or output-fit questions for any scoped form. Each therefore remains `DO_NOT_CAPTURE_OR_RELEASE` for the current action set. |
| Outcome | `PASS` — a complete current handling register with no route enabled. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | Every scoped route remains unavailable; no route is retired. The contract and operational batches, DB1, and DB2 remain separately blocked. |
| Owner decision required | Approve a later contract-batch design proposal before detail or parameterised forms are assessed for any source-facing action. |
| Next review due | On contract-batch decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0101

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0070 detail/parameter contract-batch proposal preparation |
| Reviewer role | Maintainer; defining the next exact evidence gate without broadening route or system scope |
| Documents and records reviewed | DEC-0045 matrix; DEC-0055 reconnaissance boundary; DEC-0057 proxy contract; DEC-0067 triage; DEC-0069 handling register; existing structural route observations. |
| Active phase and authorising decision | Documentation-only contract-batch proposal preparation; DEC-0070 is not approved. |
| Checks performed | Restricted scope to the 12 DEC-0067 contract-gap forms; separated transport/shape evidence from terms, handling, semantics, operational capacity, and route availability; specified non-content retention and per-form stops. |
| Findings | One bounded evidence batch can clarify request grammar and source response behaviour without treating a successful request as a handling, relay, capture, or research-data approval. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All 12 scoped forms remain unavailable. The handling-restricted forms, high-volume operational batch, DB1, and DB2 remain separately blocked. |
| Owner decision required | Approve, amend, or reject DEC-0070. |
| Next review due | On DEC-0070 decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0102

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0070 contract-batch execution |
| Reviewer role | Maintainer; recording transport/shape evidence without retaining source content or inferring route meaning |
| Documents and records reviewed | DEC-0070 package; DEC-0045 matrix; DEC-0055 reconnaissance boundary; DEC-0057 proxy contract; DEC-0067 triage; non-content batch metadata. |
| Active phase and authorising decision | DEC-0070 approved detail/parameter contract-evidence batch. |
| Checks performed | Made one contract observation per scoped form and eight transient helper selection reads. Checked fixed host, no credentials/cookies/body/redirect/retry/persistence, value-free result contents, 12-form completeness, and no application or database capability change. |
| Findings | Every exact contract form returned HTTP `200` JSON without a redirect. The result establishes only single-observation request/transport/shape behaviour; all semantic, terms, handling, operational, and availability questions remain unresolved. |
| Outcome | `PASS` — bounded contract evidence complete. No source body, identifier, resolved URL, cache, fixture, log body, or download was retained; no relay, code, VPS, database, DB1, DB2, variable, or public action occurred. |
| Affected work blocked | All 12 forms remain unavailable pending further route decisions. The high-volume operational batch, DB1, and DB2 remain separately blocked. |
| Owner decision required | Approve a separate high-volume operational-batch design proposal before further planning or source work for those routes. |
| Next review due | On operational-batch decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0103

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0071 high-volume operational-control proposal preparation |
| Reviewer role | Maintainer; converting existing audit evidence into an operational-control gate without treating it as data availability |
| Documents and records reviewed | DEC-0045 matrix; DEC-0055 reconnaissance boundary; DEC-0057 proxy contract; DEC-0067 triage; high-volume route audit; MQA first pass; votes-on-motions first pass; update-signal reconnaissance. |
| Active phase and authorising decision | Documentation-only operational-control proposal preparation; DEC-0071 is not approved. |
| Checks performed | Covered all 17 DEC-0067 operational forms; separated whole-history, filtered, annual-window, empty-detail, and extreme-unfiltered behaviours; retained explicit response-budget, no-buffering, failure, updateability, and DB1 prerequisites. |
| Findings | Existing audits support a shared operational-control framework, but do not establish handling, terms, route availability, mirror completeness, updateability, or research semantics. |
| Outcome | `PASS` for proposal preparation only. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All 17 scoped forms remain unavailable. DB1, DB2, public output, and all other unqualified routes remain separately blocked. |
| Owner decision required | Approve, amend, or reject DEC-0071. |
| Next review due | On DEC-0071 decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0104

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0071 operational-register application |
| Reviewer role | Maintainer; applying the operational controls without converting route profiles into data availability |
| Documents and records reviewed | DEC-0071 framework; DEC-0045 matrix; DEC-0067 triage; high-volume route audit; MQA first pass; votes-on-motions first pass; update-signal reconnaissance. |
| Active phase and authorising decision | DEC-0071 repository-only operational-register application, approved by the owner on 3 August 2026. |
| Checks performed | Recorded one operational state and one future action gate for all 17 scoped forms. Preserved separate whole-history, filter, annual-window, annual-firehose, empty-detail, and unestablished-detail boundaries. |
| Findings | Existing evidence supports a complete operational planning register but no route availability. Terms, handling, contract, updateability, and semantic questions remain route/action-specific. |
| Outcome | `PASS` — operational register complete. No source/API/portal/document request, source data, relay, code, VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, or public action occurred. |
| Affected work blocked | All 17 routes remain unavailable. DB1, DB2, public output, and every other unqualified route remain separately blocked. |
| Owner decision required | Approve a later small combined route-qualification package before any new source-facing action or route implementation. |
| Next review due | On that combined package decision/result, a material evidence change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0105

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner-approved DEC-0072 proportionate private raw proxy expansion |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0045 inventory; DEC-0057 proxy boundary; DEC-0067–DEC-0071 backlog records; access-control and existing source-relay implementation. |
| Active phase and authorising decision | DEC-0072 authenticated private raw no-retention proxy access. |
| Checks performed | Kept the existing two-service and private-beta boundary; retained fixed upstream host, route allowlist, parameter grammar, manual redirects, streamed bodies, no-store headers, and no source-body persistence. Kept DB1, DB2, public release, and research claims excluded. |
| Findings | The owner has explicitly chosen proportionate delivery for the public institutional source inventory. Existing route assessment records remain useful as historical limitations and future DB1/DB2 evidence, but no longer block this limited transient access action. |
| Outcome | `PASS — IMPLEMENTATION IN PROGRESS` — code and local verification are the next contained work; deployment follows only if those checks pass. |
| Affected work blocked | Source capture, DB1, DB2, canonical variables, downloads, charts, public source/data access, research release, and shared-host changes remain blocked. |
| Owner decision required | No new decision is required for the bounded implementation and existing project-only deployment. Owner acceptance is required after representative private-beta testing. |
| Next review due | On local verification result, deployment result, owner acceptance, a material failure, or 1 September 2026, whichever is earlier. |

### GOV-REV-0106

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0072 project-only deployment result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0072 scope, commit `4f11adf`, deployment script output, VPS verification output, and project service boundary. |
| Active phase and authorising decision | DEC-0072 authenticated private raw no-retention proxy access. |
| Checks performed | VPS-pinned-runtime build; 16 tests; capability scan; deterministic package; two-service release; bounded readiness; unauthenticated source-route denial; Nginx syntax; and public-shell HTTP check. |
| Findings | The first two API readiness polls were connection refused while the restarted service initialized. A later bounded poll passed. The deployment did not request a source response body. |
| Outcome | `PASS — DEPLOYED, OWNER ACCEPTANCE PENDING`. |
| Affected work blocked | DB1, DB2, capture, canonical variables, downloads, charts, public source/data access, research release, and shared-host changes remain blocked. |
| Owner decision required | No new decision. Owner acceptance is required after representative private-beta testing. |
| Next review due | On owner acceptance, a route failure, or 1 September 2026, whichever is earlier. |

### GOV-REV-0107

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner closure of DEC-0072 proxy MVP and documentation hygiene review |
| Reviewer role | Maintainer |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `GOVERNANCE.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `docs/README.md`, active GB-SCT data records, and the completed proxy MVP record. |
| Active phase and authorising decision | Proxy MVP closed under DEC-0072; documentation cleanse expressly approved by the owner. |
| Checks performed | Confirmed the owner’s representative private-beta acceptance, the deployed source-style catalogue boundary, and that the MVP creates no capture, DB1, DB2, export, chart, research release, or public data access. Separated active decision-facing records from completed implementation, qualification, and reconnaissance material; moved the latter to a labelled archive and refreshed the current reading path. |
| Findings | The proxy has a valid MVP closure, but it requires a later review before expansion or public-release change. DB1 remains unstarted and requires a new owner-approved package. The prior flat document layout materially obscured current state; RSK-0039 now records the strategic-shape/documentation-drift control. |
| Outcome | `PASS` — governance records and current documentation are aligned with the closed proxy MVP and proposed DB1-planning next step. |
| Affected work blocked | Source-data capture, DB1 schema/build, DB2 variables, downloads, charts, research claims, public data access, and shared-host changes remain blocked pending their own package. |
| Owner decision required | Approve, amend, or reject a new DB1 planning/implementation proposal before any DB1 action. |
| Next review due | Before DB1 package approval, on a proxy-MVP review trigger, a material source/API change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0108

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner-approved human-readable programme narrative structure |
| Reviewer role | Maintainer |
| Documents and records reviewed | `PROJECT_DESIGN.md`, `HANDOVER.md`, `DECISION_REGISTER.md`, `RISK_AND_DEPENDENCY_REGISTER.md`, `docs/README.md`, active GB-SCT controls, and the proxy-MVP archive. |
| Active phase and authorising decision | Documentation structure and narrative work, approved by owner; no data, database, infrastructure, or application action. |
| Checks performed | Created a master programme account and distinct proxy, DB1, and DB2 narratives. Confirmed that the proxy account covers evidence, decisions, implementation, issues/changes, gap analysis, legacy considerations, and review triggers, with links to retained evidence. Added a durable narrative requirement to `AGENTS.md`. |
| Findings | The prior structure retained evidence but did not make a human-readable workstream story the primary entry point. The revised structure keeps authority in governance and detail in the archive while making the strategic shape navigable without reconstructing it from records. |
| Outcome | `PASS` — current narratives align with the closed proxy MVP, unstarted DB1/DB2, and existing research-claim boundaries. |
| Affected work blocked | Source-data capture, DB1 schema/build, DB2 variables, downloads, charts, research claims, public data access, and shared-host changes remain blocked pending their own packages. |
| Owner decision required | A new DB1 planning/implementation proposal before any DB1 action. |
| Next review due | Before DB1 package approval, on a proxy-MVP review trigger, a material narrative change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0109

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner clarification of the DB1/DB2 relationship |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0042 programme design, DEC-0073 DB1 proposal, DB1/DB2 narratives, master project narrative, and decision register. |
| Active phase and authorising decision | DEC-0073 remains proposed. DEC-0074 records the owner’s DB1/DB2 clarification. No operational action is authorised. |
| Checks performed | Removed DB2/Tier 1/2 usefulness from DB1 first-batch selection; stated DB1’s independent source-preservation/access purpose; required future DB2 work to adapt to declared DB1 records; and prohibited DB2 from silently reprioritising or redesigning DB1. |
| Findings | The previous wording could have caused DB1 to be optimised around a future analytical layer, narrowing or distorting the mirror/projection. The corrected one-way relationship preserves DB1 as an independently valuable product and makes DB2 a later constrained consumer. |
| Outcome | `PASS` — programme narratives, DEC-0042, and proposed DEC-0073 now align with the owner’s clarification. |
| Affected work blocked | Source-data capture, DB1 implementation, DB2 variables, downloads, charts, research claims, public data access, and shared-host changes remain blocked pending their own packages. |
| Owner decision required | Owner review of revised DEC-0073 before any DB1 foundation package. |
| Next review due | Before DEC-0073 approval, on a material DB1/DB2 scope change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0110

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner clarification of continuous DB1 mirror and researcher-access standard |
| Reviewer role | Maintainer |
| Documents and records reviewed | Proposed DEC-0073, DB1 narrative, DEC-0042 programme design, update-signal evidence, high-volume operational register, retention policy, and decision register. |
| Active phase and authorising decision | DEC-0073 remains proposed for owner review. The clarification revises the proposal only; no data, database, VPS, application, or source action is authorised. |
| Checks performed | Replaced a static-snapshot implication with immutable capture history plus declared current-as-of projection; specified a 24-hour default reconciliation target subject to route-level cadence/volume controls; defined change/failure/drift states; selected PostgreSQL for DB1 manifests/projections with raw objects retained separately; and added researcher-access/acceptance requirements for query, exports, recipes, change audit, and citation. |
| Findings | DB1 must offer more than retained bytes or a database table. The declared model can support a world-class research-access mirror only if each route’s cadence, coverage, limitations, and reconciliation outcome remain visible and if researcher-facing outputs retain build/manifest provenance. No current evidence establishes a universal daily source-update guarantee. |
| Outcome | `PASS` — revised DEC-0073 preserves the no-overclaim boundary while defining a continuous mirror and researcher-access product for owner review. |
| Affected work blocked | Source-data capture, scheduled polling, DB1 implementation, DB2 variables, downloads, charts, research claims, public data access, and shared-host changes remain blocked pending their own packages. |
| Owner decision required | Owner review of revised DEC-0073, including the PostgreSQL/raw-object architecture and continuous reconciliation/access model. |
| Next review due | Before DEC-0073 approval, on a route-cadence or storage/access design change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0111

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner approval of DEC-0073 |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0073 v1.1, DEC-0042/DEC-0074 relationship, DB1 narrative, handover, decision register, and the latest risk/review records. |
| Active phase and authorising decision | DEC-0073 strategic DB1 plan, approved by owner. |
| Checks performed | Confirmed the approval applies only to the DB1 strategic plan and D1 proposal preparation; confirmed source/capture, database/VPS, code, scheduled reconciliation, front-end, DB2, download, release, and research-claim actions remain separately gated. |
| Findings | The approved plan provides a clear continuous-mirror and researcher-access target while retaining route-level cadence, source, handling, raw-storage, database, implementation, and capture decisions for later exact packages. |
| Outcome | `PASS` — D1 proposal preparation is the next permitted documentation activity. |
| Affected work blocked | Source-data capture, scheduled polling, DB1 implementation, database/VPS action, DB2 variables, downloads, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | Approve D1 before any synthetic-only DB1 foundation implementation; approve D2 before any source capture. |
| Next review due | Before D1 approval, on a material DB1 design change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0112

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — D1 synthetic-only foundation proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0073, DEC-0074, retention policy, master endpoint matrix, DB1 narrative, handover, decision register, active application/infrastructure boundary, and existing repository layout. |
| Active phase and authorising decision | DEC-0073, which authorises D1 proposal preparation only. |
| Checks performed | Defined an exact D1 boundary: a synthetic fixture only; raw-object, manifest, projection, and rejection lineage; named isolated database/path targets subject to read-only preflight; no source capability; no schedule, public route, user interface, role/grant, or shared-host action; explicit verification and narrow rollback conditions. |
| Findings | The strategic DB1 plan can now be reviewed as a contained implementation package rather than an abstract next step. The target names remain proposed until a later authorised preflight; the proposal does not infer their present state. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. The D1 package is ready as DEC-0075, but no implementation is authorised. |
| Affected work blocked | Source-data capture, source access, scheduled reconciliation, DB1 schema/raw-storage/service action, DB1 user interface/downloads, DB2 variables, charts, research claims, public data access, and shared-host changes remain blocked pending explicit owner approval. |
| Owner decision required | Approve, amend, or reject DEC-0075 before any D1 implementation. Approve D2 separately before any source capture. |
| Next review due | On DEC-0075 decision, any material target/boundary change, a D1 result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0113

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0075 D1 synthetic foundation result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0075, local build/test/capability results, isolated-target preflight/postflight, D1 result, DB1 narrative, handover, and decision register. |
| Active phase and authorising decision | DEC-0075, owner-approved D1 synthetic-only implementation. |
| Checks performed | Verified one project-created fixture through the raw-object, SHA-256, manifest, projection-build, projected-record, and rejection chain; confirmed the `db1` schema owner, counts, raw-path ownership/modes, restored parent modes, and unchanged existing API/web service activity. |
| Findings | D1 proves the source-preservation architecture without receiving source material. Temporary execution-path traversal was restored after the one run. A production capture worker/access design remains unproved and is intentionally deferred. |
| Outcome | `PASS` — D1 is complete. The DB1 foundation contains one labelled synthetic test chain only; it must not be represented as source data or a DB1 release. |
| Affected work blocked | All source requests/capture, scheduled reconciliation, DB1 explorer/query/download access, DB2 variables, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | Approve an exact D2 first-source-batch proposal before any source capture. |
| Next review due | Before D2 approval, on a DB1 target/access change, a source/capture proposal, or 1 September 2026, whichever is earlier. |

### GOV-REV-0114

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0076 D2 first-source-batch proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0008, DEC-0045, DEC-0061, DEC-0073–DEC-0075, the capture template, DB1 narrative, handover, and decision register. |
| Active phase and authorising decision | Documentation preparation after D1; no source action authorised. |
| Checks performed | Selected the smallest P1 reference candidate from existing evidence: one no-query `/api/billtypes` request. Completed a proposed action-specific handling record; fixed the request, byte/time/retry limits, restricted class, no-projection/no-user boundary, and stop conditions. |
| Findings | Existing evidence supports a narrowly proposed restricted capture test, but not a broad or recurring mirror claim. D1 did not create a production capture worker, so the proposal limits D2 to one fixed-use command and rejects any generic/scheduled importer. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. DEC-0076 is ready; no source request, capture, DB1 source data, schedule, interface, or DB2 work has occurred. |
| Affected work blocked | All source requests/capture, scheduled reconciliation, DB1 explorer/query/download access, DB2 variables, charts, research claims, public data access, and shared-host changes remain blocked pending DEC-0076 approval. |
| Owner decision required | Approve, amend, or reject DEC-0076 before the one named source request or its capture implementation. |
| Next review due | On DEC-0076 decision, any scope/handling/target change, a D2 result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0115

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0076 D2 first-source-batch result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0076, local tests/capability scan, preflight/postflight, batch result, DB1 narrative, handover, decision register, and D1 result. |
| Active phase and authorising decision | DEC-0076, owner-approved one-request restricted DB1 source capture. |
| Checks performed | Confirmed no prior D2 route run; verified the hard-coded no-query request controls, one successful source run/manifest, restricted handling class, byte count/digest, restored raw/project modes, and unchanged API/web service activity. |
| Findings | D2 establishes one retained source observation only. It does not establish a current mirror, recurring ingestion, source projection, user access, or any DB2/research claim. |
| Outcome | `PASS` — `/api/billtypes` is retained as one restricted raw object with its manifest. |
| Affected work blocked | Further source requests/capture, scheduling, DB1 explorer/query/download access, DB2 variables, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | Approve D3 before any source-backed DB1 projection or private explorer. |
| Next review due | Before D3 approval, on any source/handling/target change, a D3 result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0116

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0077 D3 projection/private-explorer proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; DEC-0008, DEC-0042, DEC-0073–DEC-0076; D2 result; DB1 narrative; application status; handover; decision register; and risk register. |
| Active phase and authorising decision | Documentation-only D3 proposal preparation after D2; no source-backed projection, database, role, service, or interface action is authorised. |
| Checks performed | Bound the proposed output to one named D2 manifest/digest; separated retained raw object, loss-aware projection, observed structure, and later DB2 variables; specified a fixed authenticated response and beta/superuser-only interface; required a new project-local read-only role rather than broader application access; excluded all source activity, schedules, downloads, generic query, and public access. |
| Findings | The D2 capture can support a small, honest DB1 usability test, but it cannot support a current-mirror, schema-semantic, coverage, freshness, or canonical-data claim. The access role and provenance-first interface are material D3 controls and require owner approval. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. DEC-0077 is ready for review; no new source request, raw-object inspection, database/schema/role action, code, deployment, service restart, or user-data access occurred during preparation. |
| Affected work blocked | Further source requests/capture, scheduling, DB1 projection/explorer implementation, reader-role creation, download/generic access, DB2, charts, research claims, public data access, and shared-host changes remain blocked pending DEC-0077. |
| Owner decision required | Approve, amend, or reject DEC-0077 before any source-backed DB1 projection, project DB1 reader role, service release, or private explorer action. |
| Next review due | On DEC-0077 decision, a material input/handling/access change, a D3 result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0117

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner approval of DEC-0077 and data-pipe clarification |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0077, D2 result, project design, handover, DB1 narrative, application/proxy code boundary, decision register, risk register, and GOV-REV-0116. |
| Active phase and authorising decision | DEC-0077, owner-approved D3 implementation. |
| Checks performed | Recorded the owner’s clarification: frontend/authentication and the application API gateway may be shared, while upstream proxy and DB1 must remain independent data pipes. Confirmed the implementation path names one fixed DB1 reader response and excludes proxy-mediated capture/reading, source requests, scheduling, exports, generic access, DB2, and public data access. |
| Findings | Sharing a session check and application process does not merge data flows. The isolation control is enforced by the distinct route, DB-only reader credential, absence of upstream capability in the DB1 reader, and absence of DB1 capability in the proxy relay. |
| Outcome | `PASS — IMPLEMENTATION AUTHORISED`. D3 may build/deploy/test only its stated manifest-bound projection and private preview; all exclusions remain active. |
| Affected work blocked | Further source requests/capture, schedule, generic DB1 access/download, DB2, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | No additional decision for the contained DEC-0077 implementation. Any route/input/privilege/exposure expansion requires a new decision. |
| Next review due | On D3 result, a data-pipe/privilege/target deviation, a deployment failure, or 1 September 2026, whichever is earlier. |

### GOV-REV-0118

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0077 technical deployment result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0077, D2 result, local build/tests/capability/doc checks, project-target preflight/postflight, reader-role proof, deployment checks, DB1 narrative, application status, handover, and decision/risk registers. |
| Active phase and authorising decision | DEC-0077 owner-approved D3 implementation. |
| Checks performed | Confirmed the exact D2 manifest/digest/route/handling input; one source projection build with seven records and zero rejections; no outbound source request; reader `SELECT` privilege and denial of raw/rejection tables; enabled application state; anonymous DB1 denial; active project services; and restored project raw/runtime modes. Recorded two stopped permission/configuration attempts and their contained corrections. |
| Findings | D3 technically proves the named private projection/access increment only. The proxy and DB1 pipes remain separate. The temporary execution-path changes were restored. The old status schema was corrected because it falsely serialised DB1 availability as false; the final service state is truthful. |
| Outcome | `PASS — OWNER ACCEPTANCE PENDING`. Technical deployment and containment pass; independent beta/superuser interface acceptance remains necessary before D3 closure. |
| Affected work blocked | New source requests/capture, scheduling, generic DB1 access/download, DB2, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | Owner acceptance or rejection of the D3 private-beta interface test. Any next source/capture or DB1 scope requires a separate decision. |
| Next review due | On owner acceptance, a D3 interface issue, a privilege/data-pipe deviation, or 1 September 2026, whichever is earlier. |

### GOV-REV-0119

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0077 owner private-beta acceptance and closure |
| Reviewer role | Maintainer, recording the owner's completed browser acceptance |
| Documents and records reviewed | DEC-0077 proposal/result; DB1 narrative; project/handover/decision/risk records; GOV-REV-0118. |
| Active phase and authorising decision | DEC-0077 D3 first source-backed DB1 projection/private explorer. |
| Checks performed | Recorded the owner's confirmation that the DB1 preview is visible and that its provenance panel, `NOT SCHEDULED` limitation, observed-structure explanation, and record display are clear and behave as expected. Confirmed that the closure changes documentation only and preserves the prior verified fixed-route/reader-role/anonymous-denial evidence. |
| Findings | D3 is accepted as one manifest-bound private usability increment. It remains neither a scheduled mirror, generic DB1 service/query interface, download service, DB2 dataset, nor research release. The owner set a future design direction to align later DB1 navigation with the proxy's compact grouped expandable layout, while visibly preserving different data-layer semantics. |
| Outcome | `PASS — DEC-0077 CLOSED`. |
| Affected work blocked | New source requests/capture, scheduling, generic DB1 access/download, DB2, charts, research claims, public data access, and shared-host changes remain blocked. |
| Owner decision required | A separate explicit decision is required before any next DB1 source/capture, reconciliation, projection, access, download, or interface increment. |
| Next review due | Before a next DB1 proposal, on a privilege/data-pipe/target deviation, or 1 September 2026, whichever is earlier. |

### GOV-REV-0120

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0078 D4A reconciliation-pilot proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0008, DEC-0045, DEC-0061, DEC-0073–DEC-0077; DB1 narrative; capture-batch template; and GOV-REV-0119. |
| Active phase and authorising decision | Documentation-only D4A proposal preparation after closed DEC-0077; no source, scheduler, database, code, service, or interface work is authorised. |
| Checks performed | Bound the proposal to three fixed no-query P1 collections and a declared one-attempt-per-route daily cycle; separated raw digest comparison from source-update claims; required append-only manifests, drift/partial/failure disclosure, no-overlap handling, an isolated project-only scheduler, and no D3 interface change. |
| Findings | A small reference cohort can test DB1's routine reconciliation model without entering bills, detail routes, relationship/content-sensitive routes, or high-volume sources. A recurring source action and scheduler are material changes and remain blocked pending explicit owner approval. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. DEC-0078 is ready for review; proposal preparation made no external request or operational change. |
| Affected work blocked | All new source requests/capture, schedule, DB1 interface/download expansion, DB2, charts, research claims, public data access, and shared-host changes remain blocked pending a decision. |
| Owner decision required | Approve, amend, or reject DEC-0078 before any D4A implementation, initial capture, or daily reconciliation run. |
| Next review due | On DEC-0078 decision, an input/handling/target change, D4A result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0121

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner approval of DEC-0078 D4A reconciliation pilot |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0078; project design; handover; decision/risk registers; DB1 strategic plan/narrative; and GOV-REV-0120. |
| Active phase and authorising decision | DEC-0078 owner-approved D4A implementation. |
| Checks performed | Recorded the owner's approval. The approved scope remains three fixed no-query reference collections, a bounded initial cycle, and one serial daily 03:17 UTC cycle. It requires append-only manifests, raw digest/structure comparison, visible initial/changed/unchanged/failed/drift/overlap states, and leaves the D3 interface unchanged. |
| Findings | The daily source action and timer are now authorised only within the declared project DB1 boundary. Any changed host/path, route, parameter, retention/exposure class, target, privilege, schedule, interface, or claim requires a new decision. |
| Outcome | `PASS — IMPLEMENTATION AUTHORISED`. |
| Affected work blocked | All routes outside the fixed cohort; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked. |
| Owner decision required | No additional decision for contained DEC-0078 implementation. A separate decision is required before D4B or any scope expansion. |
| Next review due | On D4A local/deployment/initial-cycle result, a stop condition, or 1 September 2026, whichever is earlier. |

### GOV-REV-0122

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0078 local/deployment/initial-cycle result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0078 proposal; local build/tests/capability/package/doc checks; project-target preflight/deployment/postflight; DB1 narrative; handover; decision register; and GOV-REV-0121. |
| Active phase and authorising decision | DEC-0078 owner-approved D4A reference-cohort reconciliation. |
| Checks performed | Confirmed fixed three-route transport code and capability boundary; target-local verification; isolated DB1 migration; dedicated DB1 writer role; unchanged API/web/Nginx state; one successful serial initial cycle; exactly three fixed observations; D2 digest comparison for Bill Types; `INITIAL` state for the two new routes; and an enabled 03:17 UTC project timer. No source body was retained in this result record. |
| Findings | The initial cycle demonstrates a bounded append-only reconciliation action, not recurrence or source freshness. The timer is enabled only because the cycle succeeded. D4A's existing D3 interface remains unchanged. |
| Outcome | `PASS — SCHEDULED-CYCLE VERIFICATION PENDING`. |
| Affected work blocked | Any route outside the fixed cohort; DB1 interface/download expansion; generic access; DB2; charts; research claims; public data access; and shared-host change remain blocked. |
| Owner decision required | None to inspect/record the first scheduled D4A cycle under DEC-0078. A separate decision remains required for D4B or any scope change. |
| Next review due | On the first scheduled-cycle outcome, a D4A stop condition, or 1 September 2026, whichever is earlier. |

### GOV-REV-0123

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — owner-approved immediate D4A verification amendment |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0078 proposal/result; decision register; GOV-REV-0122. |
| Active phase and authorising decision | DEC-0078 D4A, amended by the owner's instruction to verify immediately rather than wait for the first timer event. |
| Checks performed | Retained the fixed three-route/no-query/serial/no-retry/timeout/body-cap boundary. The amendment adds exactly one three-request verification cycle; it changes no source host/path, data class, retention/access class, target, role, service, timer cadence, interface, or public claim. |
| Findings | The timer remains useful for ongoing reconciliation, but it need not delay proof that a second observation is recorded and compared. Parliamentary recess is not treated as proof of unchanged source data. |
| Outcome | `PASS — IMMEDIATE VERIFICATION AUTHORISED`. |
| Affected work blocked | All routes outside the fixed cohort; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked. |
| Owner decision required | None for this one amended verification cycle. Any further non-scheduled cycle or scope change requires an explicit decision. |
| Next review due | On immediate-verification outcome, a D4A stop condition, or 1 September 2026, whichever is earlier. |

### GOV-REV-0124

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0078 immediate verification, correction, and closure |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0078 proposal/result; local regression test/build/capability/package evidence; correction deployment; metadata-only target results; decision register; handover; and GOV-REV-0122–0123. |
| Active phase and authorising decision | DEC-0078 D4A reference-cohort reconciliation pilot. |
| Checks performed | The immediate repeat found identical raw digests/byte counts but false structural drift for two routes. The timer was disabled; the stored false-positive evidence was retained; comparison canonicalisation and an order-independence regression test passed; the worker-only correction deployed; and one final fixed three-route repeat returned `UNCHANGED` for all routes before timer re-enable. API/web services remained active and unchanged. |
| Findings | The false drift was a project comparison bug, not a source change. D4A now proves fixed-route repeat capture/comparison and an active daily timer, but not general API freshness, completeness, broad route coverage, or a generic mirror. |
| Outcome | `PASS — DEC-0078 CLOSED`. |
| Affected work blocked | All routes outside the fixed cohort; DB1 interface/download expansion; generic access; DB2; charts; research claims; public data access; and shared-host changes remain blocked. |
| Owner decision required | A separate decision is required before D4B or any scope expansion. |
| Next review due | Before D4B proposal, on a D4A operational/drift event, or 1 September 2026, whichever is earlier. |

### GOV-REV-0125

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0079 D4B projection/catalogue proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; decision/risk registers; DEC-0042, DEC-0073, DEC-0077–DEC-0078; DB1 narrative; current D3 reader/interface boundary; and GOV-REV-0124. |
| Active phase and authorising decision | Documentation-only D4B proposal preparation after closed D4A. |
| Checks performed | Bound the proposed inputs to three exact D4A manifests and outputs to three fixed loss-aware projections plus one authenticated fixed response. Preserved the distinct proxy/DB1 data pipes, excluded source/timer/raw/download/DB2/public work, and specified proxy-aligned navigation with retained-baseline rather than live-relay semantics. |
| Findings | D4A can support a narrow provenance-first catalogue test, but it cannot justify automatic projection refresh, generic access, download, source completeness/freshness claims, or DB2. The current D3 view must remain intact until D4B passes its own acceptance. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. DEC-0079 is ready for review; no source, database, code, service, role, or interface action occurred during preparation. |
| Affected work blocked | D4B implementation; all new source/capture/timer action; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked pending a decision. |
| Owner decision required | Approve, amend, or reject DEC-0079 before any D4B projection, reader-role/API/frontend, or deployment work. |
| Next review due | On DEC-0079 decision, a D4A operational event, D4B result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0126

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0079 approval and D4B implementation pre-flight |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; decision/risk registers; DEC-0042, DEC-0073, DEC-0077–DEC-0079; D4A result; DB1 narrative; D3 reader/API boundary; and GOV-REV-0125. |
| Active phase and authorising decision | DEC-0079 owner-approved D4B contained build/deployment/acceptance package. |
| Checks performed | Confirmed the scope remains three named retained D4A manifests, three fixed projections, one beta/superuser catalogue response and grouped interface, one narrowly extended read-only role, and the two existing project services. Confirmed no source request/capture, timer change, raw-object route, generic query/download, DB2, public access, Nginx, or shared-host scope. Local build/test/capability checks are retained before target action. |
| Findings | The proposed catalogue can use the existing separate DB1 reader and application/auth gateway while preserving the distinct proxy and DB1 data pipes. D4B must stop on manifest/integrity/role/access/service boundary failure. |
| Outcome | `PASS — IMPLEMENTATION AUTHORISED`. |
| Affected work blocked | Any route/input beyond the three named manifests; source/timer work; raw access; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked. |
| Owner decision required | None for the contained DEC-0079 package. A new decision is required for any stop condition or scope expansion. |
| Next review due | On D4B result, a D4A operational event, or 1 September 2026, whichever is earlier. |

### GOV-REV-0127

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0079 implementation/deployment result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0079 proposal; local and VPS verification output; deployment/rollback evidence; DB1 narrative; handover; decision register; and GOV-REV-0126. |
| Active phase and authorising decision | DEC-0079 D4B contained implementation package. |
| Checks performed | Verified exact-manifest binding, 47 total preserved records/zero rejections, fixed reader route, separate reader grants, anonymous denial, active API/web/D4A services, and unchanged D4A timer. The first deployment's immediate health-check failure triggered rollback; the correction waited for readiness, preserved the scope, and passed. |
| Findings | D4B now provides a narrow retained-baseline catalogue, not a generic mirror. The user-facing grouped/expandable acceptance has not yet been completed by an eligible user. |
| Outcome | `PASS — OWNER FRONT-END ACCEPTANCE PENDING`. |
| Affected work blocked | Any expansion beyond the three manifests; source/timer work; raw access; generic query/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked. |
| Owner decision required | No new decision for the remaining owner acceptance test. A new decision is required for any expansion after closure. |
| Next review due | On owner front-end acceptance, a D4A operational event, or 1 September 2026, whichever is earlier. |

### GOV-REV-0128

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0079 owner front-end acceptance and DB1/DB2 boundary clarification |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0073–DEC-0080; D4B result; DB1 narrative; handover; decision register; and GOV-REV-0127. |
| Active phase and authorising decision | Closed DEC-0079 D4B; DEC-0080 recorded clarification. |
| Checks performed | Recorded the owner's successful front-end test and checked its DB1 source-preservation direction against the raw/archive/projection distinction and DB2 one-way constraint. |
| Findings | DB1 may add provenance, integrity, and access metadata but may not make semantic transformations. Raw bytes remain the source record; loss-aware DB1 projections make source objects queryable without becoming DB2 variables. “Mirror” must remain scoped to retained/reconciled evidence, never an unsupported completeness claim. |
| Outcome | `PASS — DEC-0079 CLOSED; DEC-0080 RECORDED`. |
| Affected work blocked | New source/capture/timer work; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked pending a new decision. |
| Owner decision required | A new DB1 proposal is required before further expansion. |
| Next review due | Before the next DB1 proposal, a D4A operational event, or 1 September 2026, whichever is earlier. |

### GOV-REV-0129

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0081 D4C institutional-reference proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; decision/risk registers; DB1 strategy/narrative; DEC-0045, DEC-0063–DEC-0066, DEC-0073–DEC-0080; and GOV-REV-0128. |
| Active phase and authorising decision | Documentation-only D4C proposal preparation after closed D4B. |
| Checks performed | Selected only four bounded no-query collections with existing institutional-reference route evidence, separated them from handling-blocked/sensitive and high-volume cohorts, fixed one-attempt/cap/timeout/reconciliation controls, and preserved the raw archive → loss-aware projection → DB2 separation. |
| Findings | A small institutional-reference increment can expand DB1 source coverage without creating a semantic data model. It does not establish source values, response sizes, completeness, updateability, or capture authority. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. No source, database, code, service, timer, or interface action occurred. |
| Affected work blocked | D4C implementation; all D4C source/capture/timer action; generic DB1 access/download; DB2; charts; research claims; public data access; and shared-host changes remain blocked pending a decision. |
| Owner decision required | Approve, amend, or reject DEC-0081 before any D4C action. |
| Next review due | On DEC-0081 decision, a D4A operational event, D4C result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0130

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0081 approval and D4C implementation start |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0081; DB1 narrative; and GOV-REV-0129. |
| Active phase and authorising decision | D4C institutional-reference implementation and owner-acceptance package under DEC-0081. |
| Checks performed | Confirmed fixed four-route, no-query, source-preserving scope; separate D4C writer/timer; fixed named release; reader-only private catalogue; and the continuing DB1/DB2, proxy/DB1, public-access, and shared-host boundaries. |
| Findings | Scope is authorised only for the four named institutional-reference collections and the stated contained implementation/deployment/acceptance activities. No result or source-completeness claim exists yet. |
| Outcome | `PASS — D4C IMPLEMENTATION AUTHORISED WITHIN DEC-0081`. |
| Affected work blocked | DB2; semantic variables; generic query/search/download; public data access; routes outside D4C; charts/research release; and shared-host changes. |
| Owner decision required | Owner acceptance is required after restricted verification and beta-user interface test; any scope change needs a new decision. |
| Next review due | On D4C deployment/result, owner front-end acceptance, an unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0131

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — D4C deployment result and pre-source worker stops |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0081; D4C result; project design; handover; decision/risk registers; GOV-REV-0130; and D4C metadata-only service/database checks. |
| Active phase and authorising decision | D4C deployment complete within DEC-0081; owner front-end acceptance pending. |
| Checks performed | Confirmed three initial worker faults occurred before any D4C observation, each rollback preserved existing services, and the final cycle retained exactly four `INITIAL` observations, one fixed release, zero rejections, active D4A/D4C timers, anonymous denial, and reader raw/write denial. |
| Findings | The four-route capture/projection/reconciliation boundary passed within its fixed scope. The pre-source faults are an implementation lesson, not source retries; RSK-0041 records the added worker-preflight control. No completeness, freshness, semantic, DB2, download, public-access, or research claim is justified. |
| Outcome | `PASS — D4C RESTRICTED DEPLOYMENT; OWNER ACCEPTANCE PENDING`. |
| Affected work blocked | DB2; semantic variables; generic query/search/download; public data access; routes outside D4C; charts/research release; and shared-host changes. |
| Owner decision required | Owner front-end acceptance is required to close DEC-0081. A new decision is required for a new cohort, later named refresh, or any scope change. |
| Next review due | On owner front-end acceptance, D4C drift/failure, a proposed refresh/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0132

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — D4C owner acceptance and DB1 access-model direction |
| Reviewer role | Maintainer |
| Documents and records reviewed | D4C result; DEC-0081; DEC-0082; DB1 narrative; handover; decision/risk registers; and GOV-REV-0131. |
| Active phase and authorising decision | DEC-0081 closed; DEC-0082 recorded design direction only. |
| Checks performed | Recorded owner acceptance of the revised secondary record browser; confirmed source position remains visible as technical lineage only; and tested the access-mode direction against the DB1/DB2 boundary and high-volume limits. |
| Findings | A small-collection record browser is suitable for D4B/D4C, but must not become an implied universal data-access promise. Future packages must declare an access mode before their interface design; RSK-0042 records the risk. |
| Outcome | `PASS — DEC-0081 CLOSED; DEC-0082 RECORDED`. |
| Affected work blocked | New capture cohorts; DB2; semantic variables; generic query/search/download; public data access; routes outside accepted cohorts; charts/research release; and shared-host changes. |
| Owner decision required | A new proposal is required for any further DB1 cohort or access capability. |
| Next review due | Before a new DB1 cohort proposal, on D4A/D4C drift or failure, or 1 September 2026, whichever is earlier. |

### GOV-REV-0133

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — D5 formal-stages proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0045, DEC-0073, DEC-0080–DEC-0082; the route-handling register; DB1 narrative; and GOV-REV-0132. |
| Active phase and authorising decision | Documentation-only preparation of proposed DEC-0083 after closed D4C. |
| Checks performed | Limited the proposal to `/api/billstages`; checked that its existing collection/contract evidence does not establish a handling or terms basis; applied DEC-0082 by declaring access-plan-first; and retained the raw archive/projection/DB2 and proxy/DB1 separations. |
| Findings | Formal stages are a bounded P1 next-cohort candidate, but neither capture authority nor a claim about stage semantics, completeness, freshness, or access capability exists. The proposal fixes a no-query one-attempt contract and requires a handling gate before byte retention. |
| Outcome | `PASS — OWNER REVIEW REQUIRED`. No source, database, code, service, timer, or interface action occurred. |
| Affected work blocked | D5 source/capture/timer/deployment work; all generic DB1 access/download; DB2; semantic variables; public data access; and shared-host changes remain blocked. |
| Owner decision required | Approve, amend, or reject DEC-0083 before any D5 action. |
| Next review due | On DEC-0083 decision, D4A/D4C drift or failure, D5 result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0134

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — DEC-0083 approval and D5 implementation start |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0083; D5 handling record; DB1 narrative; and GOV-REV-0133. |
| Active phase and authorising decision | D5 formal-stages contained implementation and owner-acceptance package under DEC-0083. |
| Checks performed | Confirmed the exact one-route no-query boundary, restrictive handling class, one-attempt/cap/timeout controls, separate D5 writer/timer, fixed release, reader-only access-plan response, and continuing proxy/DB1, DB1/DB2, public-access, and shared-host separations. |
| Findings | The package is authorised only for `/api/billstages` and its stated contained implementation/deployment/acceptance activities. The handling record is restrictive and does not assert route-specific legal permission, source semantics, completeness, or freshness. |
| Outcome | `PASS — D5 IMPLEMENTATION AUTHORISED WITHIN DEC-0083`. |
| Affected work blocked | DB2; semantic variables; generic query/search/download; public data access; Bills/detail routes and all other routes; charts/research release; and shared-host changes. |
| Owner decision required | Owner acceptance is required after restricted verification and private-beta interface test; any scope change needs a new decision. |
| Next review due | On D5 deployment/result, owner front-end acceptance, an unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0135

| Field | Record |
| --- | --- |
| Date (UTC) | 3 August 2026 |
| Review type | Triggered — D5 deployment result |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0083; D5 handling/result records; project design; handover; decision/risk registers; DB1 narrative; and GOV-REV-0134. |
| Active phase and authorising decision | D5 contained package deployed under DEC-0083; owner acceptance pending. |
| Checks performed | Verified one `INITIAL` manifest, digest/byte/content-type metadata, 1,754 projected/zero rejected records, fixed release binding, reader raw/write denial, anonymous endpoint denial, active API/web/D4A/D4C/D5 units, and separate D5 scheduling. |
| Findings | The deployment passed its one-route source-preservation and access-plan boundary. Two loopback health probes failed during the API restart window, then readiness passed; this created no source retry, service interruption, or scope expansion. No semantic, completeness, freshness, DB2, download, or public claim is justified. |
| Outcome | `PASS — D5 RESTRICTED DEPLOYMENT; OWNER ACCEPTANCE PENDING`. |
| Affected work blocked | DB2; semantic variables; generic query/search/download; public data access; Bills/detail routes and all other routes; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for owner interface acceptance. A new decision is required for any route, access, projection-refresh, or scope expansion. |
| Next review due | On owner front-end acceptance, D5 drift/failure, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0136

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — D5 navigation sanity-check correction |
| Reviewer role | Maintainer |
| Documents and records reviewed | Owner screenshot/feedback; D5 result; DB1 narrative; risk register; web implementation; deployment script; and GOV-REV-0135. |
| Active phase and authorising decision | Contained D5 owner-acceptance correction under DEC-0083. |
| Checks performed | Confirmed the fault was duplicated top-level presentation only: two existing D4A fixed projections and the D5 access-plan release had the same research-subject heading. Corrected the UI to one subject group, added a source-level rendered-navigation regression test, and expanded the web-only deployment verification to include the active D5 timer. |
| Findings | The prior checks verified data, capability, and service boundaries but missed a basic user-navigation sanity check. RSK-0043 now requires a subject-first grouping and direct rendered-navigation check for later DB1 presentation changes. No source, database, API, role, timer, or data boundary changed. |
| Outcome | `PASS — WEB-ONLY CORRECTION DEPLOYED; OWNER RECHECK PENDING`. |
| Affected work blocked | DB2; semantic variables; generic query/search/download; public data access; Bills/detail routes and all other routes; charts/research release; and shared-host changes. |
| Owner decision required | No new decision is required for this contained D5 presentation correction. Owner recheck is required before DEC-0083 can close. |
| Next review due | On owner recheck, D5 drift/failure, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0137

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DB1 architecture sanity sweep, D5 owner acceptance, and DEC-0084 Bills readiness preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DB1 narrative and strategic plan; DEC-0080–DEC-0083; Bills handling assessments and G4 result; and GOV-REV-0136. |
| Active phase and authorising decision | Documentation-only sweep and DEC-0084 preparation after owner instruction. No source, VPS, database, code, or deployment action. |
| Checks performed | Compared the intended DB1 model against its current plans: separate proxy/DB1 data pipes, source-preserving raw/archive/projection boundary, PostgreSQL operational role, route-specific regular reconciliation, scoped upstream comparison, proxy-like subject navigation, researcher-oriented future access, and DB1/DB2 separation. Recorded D5 owner acceptance and corrected stale current-state references. |
| Findings | The core DB1 plan already conforms to the agreed architecture. Two wording gaps were corrected: proxy-like navigation is now explicit, and reconciliation is stated as exact only for its named route/window rather than an unsupported general-parity claim. Existing Bills evidence remains blocked under the prior handling rule; DEC-0084 presents the one owner policy choice needed before a collection package can be proposed. |
| Outcome | `PASS — DOCUMENTATION ALIGNMENT COMPLETE; DEC-0084 OWNER DECISION REQUIRED`. |
| Affected work blocked | Any `/api/bills` source request, capture, schedule, database/code/deployment action, release, DB2 work, generic access/download, public output, and every other new route remain blocked pending an owner decision and later exact package. |
| Owner decision required | Approve either DEC-0084 Option A (retain block) or Option B (revised private collection-only handling basis). |
| Next review due | On DEC-0084 decision, a D4A/D4C/D5 drift/failure, Bills package result, or 1 September 2026, whichever is earlier. |

### GOV-REV-0138

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0084 owner decision and DEC-0085 Bills package preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0008, DEC-0042, DEC-0045, DEC-0073, DEC-0080–DEC-0084; the Bills collection/detail handling records; DB1 access direction and narrative; and GOV-REV-0137. |
| Active phase and authorising decision | DEC-0084 documentation/handling decision; DEC-0085 proposal preparation only. No source request, VPS/database action, code, deployment, or data retention occurred. |
| Checks performed | Recorded the owner’s Option B decision as a collection-only successor handling record; retained the detail-route block; bounded DEC-0085 to a fixed no-query collection request, two-request initial comparison, daily schedule, source-preserving projection, beta-only access, and one user-journey acceptance. Checked that proxy and DB1 remain separate data pipes and that no DB2/public/generic-access claim is introduced. |
| Findings | The approved handling basis supplies the accountable private-retention boundary required to propose, but not execute, the Bills collection package. The package is proportionate to the established D4/D5 pattern while including the mirror’s key behaviours in one delivery loop. |
| Outcome | `PASS — DEC-0084 RECORDED; DEC-0085 OWNER APPROVAL REQUIRED`. |
| Affected work blocked | The DEC-0085 source request, capture, schedule, database/code/deployment action, release, DB2 work, public output, generic query/download, Bills detail route, and all other new routes remain blocked pending approval. |
| Owner decision required | Approve, amend, or reject DEC-0085 before implementation or any source/data action. |
| Next review due | On DEC-0085 decision, a Bills package result/stop, an operational event in an existing cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0139

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0085 owner approval and D6 contained implementation/deployment |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0080–DEC-0085; DB1 narrative; D6 implementation/release checks; and GOV-REV-0138. |
| Active phase and authorising decision | D6 Bills collection package under owner-approved DEC-0085. |
| Checks performed | Confirmed the fixed no-query collection-only client, no-retry/manual-redirect/30-second/2 MiB/JSON-array gates, dedicated writer and timer, raw/manifest/projection lineage, private fixed-pagination reader, raw/write reader denial, anonymous denial, proxy/DB1 separation, and exclusion of the Bills detail route, DB2, public access, generic query/download, and shared-host changes. Ran one initial request and one immediate same-route comparison only. |
| Findings | The first request produced a 99,823-byte collection capture and fixed 473-record/zero-rejection release. The second request was `UNCHANGED`. The D6 timer is active/enabled for 04:02 UTC and the named release remains bound to its initial manifest. Two early local health probes failed during the expected API restart window; readiness subsequently passed without any source retry or service-boundary change. |
| Outcome | `PASS — D6 RESTRICTED DEPLOYMENT; OWNER PRIVATE-BETA ACCEPTANCE PENDING`. |
| Affected work blocked | Bills detail route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for the stated private-beta acceptance journey. Any route, access, source-contract, projection-refresh, or scope expansion requires a new decision. |
| Next review due | On owner acceptance, D6 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0140

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0085 owner private-beta acceptance and closure |
| Reviewer role | Maintainer, recording the owner's completed acceptance journey |
| Documents and records reviewed | DEC-0085 proposal/result; DEC-0084 handling basis; DB1 narrative; handover; decision register; and GOV-REV-0139. |
| Active phase and authorising decision | Closed D6 Bills collection package under DEC-0085. |
| Checks performed | Recorded the owner's confirmation that the deployed private DB1 Bills collection journey behaved as expected. This confirmed the visible Bills/formal-stages grouping, retained-versus-proxy distinction, provenance display, and fixed Next/Previous pagination within the already deployed contract. |
| Findings | The stated user-facing acceptance criteria passed. No source request, capture, database mutation, service change, access expansion, data transformation, or scope change occurred during acceptance. |
| Outcome | `PASS — DEC-0085 CLOSED; OWNER ACCEPTED`. |
| Affected work blocked | Bills detail route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | A new decision is required for any subsequent DB1 cohort or D6 route/access/projection change. |
| Next review due | On a D6 failure/change/drift event, a proposed new cohort or access change, or 1 September 2026, whichever is earlier. |

### GOV-REV-0141

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — next DB1 cohort selection and DEC-0086 proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DB1 plan/narrative; DEC-0082, DEC-0085; route matrix; route-level handling register; and the existing contextual/roles-committees reconnaissance records. |
| Active phase and authorising decision | Documentation-only DEC-0086 preparation after the owner asked for the next bounded DB1 cohort proposal. No source, VPS, database, code, or deployment action is authorised by this review. |
| Checks performed | Compared the remaining P2 candidates against existing handling evidence, expected research value, source shape, access-mode direction, and the requirement not to let hoped-for DB2 use drive DB1 scope. Rejected person/relationship and committee routes as currently blocked. Chose the collection-only Government roles taxonomy as the smallest useful candidate and explicitly retained the `Notes` handling gap. |
| Findings | `/api/governmentroles` has historic structural evidence of a bounded 251-record taxonomy but remains `DO_NOT_CAPTURE_OR_RELEASE` because of `Notes`. DEC-0086 therefore makes one explicit owner choice: adopt a route-specific restrictive private handling basis and, only if approved, execute its contained D7 loop. It does not transfer to the detail, member-government-role, party, committee, or other `Notes` routes. |
| Outcome | `PASS — DEC-0086 PROPOSED; OWNER APPROVAL REQUIRED`. |
| Affected work blocked | Any Government roles source request, capture, schedule, database/code/deployment action, private release, public output, detail/relationship action, DB2, generic query/download, and all other new routes remain blocked pending DEC-0086 approval. |
| Owner decision required | Approve, amend, or reject DEC-0086. |
| Next review due | On the DEC-0086 decision, D6 operational event, any unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0142

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0086 approval and D7 contained implementation/deployment |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0082, DEC-0085, DEC-0086; D7 implementation/release checks; and GOV-REV-0141. |
| Active phase and authorising decision | D7 Government roles collection package under owner-approved DEC-0086. |
| Checks performed | Confirmed the exact no-query collection-only client, manual redirect/no-retry/30-second/2 MiB/JSON-array gates, dedicated writer/timer, route-specific restrictive handling, raw/manifest/projection lineage, private fixed-pagination reader, raw/write reader denial, anonymous denial, proxy/DB1 separation, and exclusion of Government roles detail, relationship routes, DB2, public access, generic query/download, and shared-host changes. Ran one initial request and one immediate same-route comparison only. |
| Findings | The first request produced a 19,993-byte collection capture and fixed 251-record/zero-rejection release. The second request was `UNCHANGED`. The D7 timer is active/enabled for 04:17 UTC and the named release remains bound to its initial manifest. Two early loopback health probes failed during the expected API restart window; readiness subsequently passed without a source retry or service-boundary change. |
| Outcome | `PASS — D7 RESTRICTED DEPLOYMENT; OWNER PRIVATE-BETA ACCEPTANCE PENDING`. |
| Affected work blocked | Government roles detail; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for the stated private-beta acceptance journey. Any route, access, source-contract, projection-refresh, or scope expansion requires a new decision. |
| Next review due | On owner acceptance, D7 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0143

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0086 private-beta acceptance and closure |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0086 proposal and result; DB1 workstream narrative; master endpoint matrix; decision register; and the owner’s private-beta confirmation. |
| Active phase and authorising decision | Closure of the already deployed D7 Government roles collection package under DEC-0086. |
| Checks performed | Recorded the owner’s confirmation that the stated Government roles journey behaved as expected: one subject group, retained-versus-proxy distinction, provenance and limits, and fixed Next/Previous paging. |
| Findings | The interface acceptance criteria passed. No source request, capture, database mutation, service change, access expansion, data transformation, or scope change occurred during acceptance. |
| Outcome | `PASS — DEC-0086 CLOSED; OWNER ACCEPTED`. |
| Affected work blocked | Government roles detail; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | A new decision is required for any subsequent DB1 cohort or D7 route/access/projection change. |
| Next review due | On D7 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0144

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — next DB1 cohort selection and DEC-0087 proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DB1 plan/narrative; DEC-0082, DEC-0085, DEC-0086; master endpoint matrix; route-level handling register; and roles/committees reconnaissance. |
| Active phase and authorising scope | Documentation-only D8 proposal preparation after owner acceptance of DEC-0086. The owner asked to proceed with the next proposal; no source, VPS, database, code, deployment, or interface action is authorised. |
| Checks performed | Compared remaining candidates against bounded source-preserving DB1 value, historic response shape, route-specific handling gaps, relationship/temporal risks, and the requirement not to let prospective DB2 use determine DB1 scope. |
| Findings | `/api/committeeroles` has historic evidence of eight identifier/name/`Notes` records and no dates. It is the smallest remaining committee-context taxonomy, but remains `DO_NOT_CAPTURE_OR_RELEASE` absent a new route-specific basis. Committee, detail, party, person, and relationship routes retain broader handling or semantic gaps. |
| Outcome | `PASS — DEC-0087 PROPOSED; OWNER APPROVAL REQUIRED`. |
| Affected work blocked | Any Committee roles source request, capture, schedule, database/code/deployment action, private release, detail/relationship action, DB2, generic query/download, public output, and all other new routes remain blocked pending DEC-0087 approval. |
| Owner decision required | Approve, amend, or reject DEC-0087. |
| Next review due | On the DEC-0087 decision, D8 operational event, any unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0145

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0087 approval and D8 contained implementation/deployment |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0082, DEC-0086, DEC-0087; D8 implementation/release checks; and GOV-REV-0144. |
| Active phase and authorising decision | D8 Committee roles collection package under owner-approved DEC-0087. |
| Checks performed | Confirmed the exact no-query collection-only client, manual redirect/no-retry/30-second/2 MiB/JSON-array gates, dedicated writer/timer, route-specific restrictive handling, raw/manifest/projection lineage, private fixed-pagination reader, raw/write reader denial, anonymous denial, proxy/DB1 separation, and exclusion of Committee roles detail, committees, relationship routes, DB2, public access, generic query/download, and shared-host changes. Ran one initial request and one immediate same-route comparison only. |
| Findings | The first request produced a 350-byte collection capture and fixed 8-record/zero-rejection release. The second request was `UNCHANGED`. The D8 timer is active/enabled for 04:32 UTC and the named release remains bound to its initial manifest. Two early loopback health probes failed during the expected API restart window; readiness subsequently passed without a source retry or service-boundary change. |
| Outcome | `PASS — D8 RESTRICTED DEPLOYMENT; OWNER PRIVATE-BETA ACCEPTANCE PENDING`. |
| Affected work blocked | Committee roles detail; committees; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for the stated private-beta acceptance journey. Any route, access, source-contract, projection-refresh, or scope expansion requires a new decision. |
| Next review due | On owner acceptance, D8 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0146

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0087 private-beta acceptance and closure |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0087 proposal and result; DB1 workstream narrative; master endpoint matrix; decision register; and the owner’s private-beta confirmation. |
| Active phase and authorising decision | Closure of the already deployed D8 Committee roles collection package under DEC-0087. |
| Checks performed | Recorded the owner’s confirmation that the stated Committee roles journey behaved as expected: one subject group, retained-versus-proxy distinction, provenance and limits, and the complete eight-record page. |
| Findings | The interface acceptance criteria passed. No source request, capture, database mutation, service change, access expansion, data transformation, or scope change occurred during acceptance. |
| Outcome | `PASS — DEC-0087 CLOSED; OWNER ACCEPTED`. |
| Affected work blocked | Committee roles detail; committees; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | A new decision is required for any subsequent DB1 cohort or D8 route/access/projection change. |
| Next review due | On D8 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0147

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — next DB1 cohort selection and DEC-0088 proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DB1 plan/narrative; DEC-0082, DEC-0086–DEC-0087; master endpoint matrix; route-level handling register; and roles/committees reconnaissance. |
| Active phase and authorising scope | Documentation-only D9 proposal preparation after owner acceptance of DEC-0087. The owner asked to proceed with the next proposal; no source, VPS, database, code, deployment, or interface action is authorised. |
| Checks performed | Compared remaining candidates against bounded source-preserving DB1 value, historic response shape, route-specific handling gaps, relationship/temporal risks, and the requirement not to let prospective DB2 use determine DB1 scope. |
| Findings | `/api/partyroles` has historic evidence of 548 identifier/party/name/`Notes` records and no dates. It is a bounded source-defined taxonomy but remains `DO_NOT_CAPTURE_OR_RELEASE` absent a new route-specific basis. Party, detail, person, relationship, and committee routes retain broader handling or semantic gaps. |
| Outcome | `PASS — DEC-0088 PROPOSED; OWNER APPROVAL REQUIRED`. |
| Affected work blocked | Any Party roles source request, capture, schedule, database/code/deployment action, private release, detail/relationship action, DB2, generic query/download, public output, and all other new routes remain blocked pending DEC-0088 approval. |
| Owner decision required | Approve, amend, or reject DEC-0088. |
| Next review due | On the DEC-0088 decision, D9 operational event, any unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0148

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0088 approval and D9 contained implementation/deployment |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0082, DEC-0087, DEC-0088; D9 implementation/release checks; and GOV-REV-0147. |
| Active phase and authorising decision | D9 Party roles collection package under owner-approved DEC-0088. |
| Checks performed | Confirmed fixed no-query client, manual redirect/no-retry/30-second/2 MiB/JSON-array gates, dedicated writer/timer, restrictive handling, raw/manifest/projection lineage, private fixed pagination, raw/write reader denial, anonymous denial, proxy/DB1 separation, and exclusion of detail, parties, relationship routes, DB2, public access, generic query/download, and shared-host changes. Ran one initial request and one immediate same-route comparison only. |
| Findings | The first request produced a 44,636-byte collection capture and fixed 548-record/zero-rejection release. The second request was `UNCHANGED`; the D9 timer is active/enabled for 04:47 UTC. An initial wrapper path error stopped before any source activity; its correction was committed/pushed before deployment. Two early loopback health probes failed during API restart, then readiness passed without a source retry. |
| Outcome | `PASS — D9 RESTRICTED DEPLOYMENT; OWNER PRIVATE-BETA ACCEPTANCE PENDING`. |
| Affected work blocked | Party roles detail; parties; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for stated private-beta acceptance. Any route, access, source-contract, projection-refresh, or scope expansion requires a new decision. |
| Next review due | On owner acceptance, D9 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0149

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0088 private-beta acceptance and closure |
| Reviewer role | Maintainer |
| Documents and records reviewed | DEC-0088 proposal and result; DB1 workstream narrative; GB-SCT data index; master endpoint matrix; decision register; handover; GOV-REV-0148; and the owner's stated private-beta acceptance. |
| Active phase and authorising decision | D9 Party roles collection package under owner-approved DEC-0088, restricted deployment complete. |
| Checks performed | Recorded the owner's confirmation that the defined journey behaved as expected: hard-refresh, **DB1 catalogue**, **Parties and government roles**, then **Party roles collection**. Confirmed that this accepts the two releases in the existing group, private retained-data presentation, provenance/structure/limits, and fixed pagination only. |
| Findings | The stated acceptance adds no source request, database write, service change, access expansion, or semantic claim. It does not qualify Party roles detail, parties, member/relationship routes, party membership, role history, DB2, public access, download, generic query/search, raw-object access, charts, or research release. |
| Outcome | `PASS — DEC-0088 CLOSED; OWNER ACCEPTED`. |
| Affected work blocked | Party roles detail; parties; every person/relationship route; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | A new decision is required for any D9 route, source-contract, projection-refresh, access, semantic, or scope change, or for the next cohort. |
| Next review due | On D9 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |

### GOV-REV-0150

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — next DB1 cohort selection and DEC-0089 proposal preparation |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DB1 plan/narrative; DEC-0082 and DEC-0085–DEC-0088; master endpoint matrix; route-level handling register; contextual-reference reconnaissance; and the daily read-only repository hygiene assessment. |
| Active phase and authorising scope | Documentation-only D10 proposal preparation after owner acceptance of DEC-0088. The owner asked to proceed with the next proposal; no source, VPS, database, code, deployment, or interface action is authorised. |
| Checks performed | Compared remaining candidates against bounded source-preserving DB1 value, historic response shape, route-specific handling gaps, person/relationship and temporal risks, existing frontend grouping, and the requirement not to let prospective DB2 use determine DB1 scope. Confirmed the apparent D5 result-link concern was a filename-search error: the dated result exists. The hygiene assessment found no proposed repository change beyond this documented proposal. |
| Findings | `/api/parties` has historic evidence of a 14-element collection with identifiers, names/abbreviation, `Notes`, validity-period fields, and two observed-null relationship placeholders. It is the smallest remaining party-reference collection, but its validity meaning, completeness, party continuity, affiliation implications, and content handling remain unresolved. Party detail and all member/relationship routes have a different risk profile. |
| Outcome | `PASS — DEC-0089 PROPOSED; OWNER APPROVAL REQUIRED`. |
| Affected work blocked | Any Parties source request, capture, schedule, database/code/deployment action, private release, detail/relationship action, DB2, generic query/download, public output, and all other new routes remain blocked pending DEC-0089 approval. |
| Owner decision required | Approve, amend, or reject DEC-0089. |
| Next review due | On the DEC-0089 decision, D10 operational event, any unexpected stop, or 1 September 2026, whichever is earlier. |

### GOV-REV-0151

| Field | Record |
| --- | --- |
| Date (UTC) | 4 August 2026 |
| Review type | Triggered — DEC-0089 approval and D10 contained implementation/deployment |
| Reviewer role | Maintainer |
| Documents and records reviewed | Project design; handover; governance procedure; decision/risk registers; DEC-0082, DEC-0088, DEC-0089; D10 implementation/release checks; and GOV-REV-0150. |
| Active phase and authorising decision | D10 Parties collection package under owner-approved DEC-0089. |
| Checks performed | Confirmed fixed no-query client, manual redirect/no-retry/30-second/2 MiB/JSON-array gates, dedicated writer/timer, restrictive handling, raw/manifest/projection lineage, private fixed pagination, raw/write reader denial, anonymous denial, proxy/DB1 separation, continuity of D4A–D9, and exclusion of detail, member/relationship routes, DB2, public access, generic query/download, and shared-host changes. Ran one initial request and one immediate same-route comparison only. |
| Findings | The first request produced a 3,171-byte collection capture and fixed 14-record/zero-rejection release. The second request was `UNCHANGED`; the D10 timer is active/enabled for 05:02 UTC. An initial non-root wrapper invocation stopped before change or source activity. A second invocation stopped before source activity because the package omitted the D10 migration script; its pre-source rollback ran. The package was corrected and verified before the successful deployment. Two early loopback health probes failed during API restart, then readiness passed without a source retry. |
| Outcome | `PASS — D10 RESTRICTED DEPLOYMENT; OWNER PRIVATE-BETA ACCEPTANCE PENDING`. |
| Affected work blocked | Party detail; every member/relationship route; Party roles changes; every other new route; DB2; semantic variables; public data access; download; generic query/search; raw-object access; charts/research release; and shared-host changes. |
| Owner decision required | No new decision for stated private-beta acceptance. Any route, access, source-contract, projection-refresh, or scope expansion requires a new decision. |
| Next review due | On owner acceptance, D10 failure/change/drift, a proposed access change/new cohort, or 1 September 2026, whichever is earlier. |
