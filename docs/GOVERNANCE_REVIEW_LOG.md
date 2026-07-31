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
