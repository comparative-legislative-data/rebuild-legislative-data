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
