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
