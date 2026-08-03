# Documentation guide

This is the entry point for current project documentation. Completed work is
preserved under [`archive/`](archive/); it is evidence, not the current
instruction set.

## Read first

1. [Project design](governance/PROJECT_DESIGN.md) — research standards,
   provenance, validation, and claim discipline.
2. [Handover](governance/HANDOVER.md) — current state, boundaries, and next
   owner decision.
3. [Decision register](governance/DECISION_REGISTER.md) — approved, open, and
   closed decisions.
4. [Risk and dependency register](governance/RISK_AND_DEPENDENCY_REGISTER.md)
   — current blockers and controls.

## Current work areas

| Area | Current purpose | Start with |
| --- | --- | --- |
| [Governance](governance/) | Governing baseline, decisions, risks, review, and handover. | [Handover](governance/HANDOVER.md) |
| [Planning](planning/) | Active phase-level sequencing. | [Phase A plan](planning/PHASE_A_PLAN.md) |
| [Data — GB-SCT](data/gb-sct/) | Approved scope, current route controls, and the next DB1 planning gate. | [GB-SCT guide](data/gb-sct/README.md) |
| [Infrastructure](infrastructure/) | Current VPS isolation and deployment controls. | [Current VPS plan](infrastructure/CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md) |
| [Application](application/) | Current private-beta application boundary. | [Application status](application/README.md) |
| [Archive](archive/) | Completed implementation, reconnaissance, and superseded planning records. | [Archive guide](archive/README.md) |

## Current programme position

The private, no-retention upstream proxy MVP is closed and retained as an
accepted application capability. It is not a dataset, capture, DB1, DB2, or
research release. The next proposed programme step is DB1 planning under the
existing approved three-layer design; it requires a new owner decision before
any capture, database, or source-data action.

## Operating rule

Keep upstream relay, DB1 capture/projection, DB2 canonical variables,
infrastructure, application access control, and public release distinct. New
active documents belong in the area governing the live decision or resource.
Move completed work to `archive/` with its audit trail intact; never delete it
merely to shorten the reading path.
