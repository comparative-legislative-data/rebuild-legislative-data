# Documentation guide

This directory is organised by the kind of work it governs. Start here rather
than browsing a flat file list.

## Read first

1. [Project design](governance/PROJECT_DESIGN.md) — research standards,
   provenance tiers, validation, and publication claims.
2. [Handover](governance/HANDOVER.md) — current project state and the next
   gated decision.
3. [Decision register](governance/DECISION_REGISTER.md) — what is approved,
   proposed, or completed.
4. [Risk and dependency register](governance/RISK_AND_DEPENDENCY_REGISTER.md)
   — current controls and blockers.

## Areas

| Area | Purpose | Start with |
| --- | --- | --- |
| [Governance](governance/) | Project rules, decisions, risks, reviews, and current handover. | [Governance guide](governance/GOVERNANCE.md) |
| [Planning](planning/) | Phase-level plans and sequencing. | [Phase A plan](planning/PHASE_A_PLAN.md) |
| [Data — GB-SCT](data/gb-sct/) | Source scope, endpoint inventory, transparent pass-through, DB1, DB2, retention, and control templates. | [Master endpoint delivery matrix](data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md), [exploratory-reconnaissance boundary](data/gb-sct/GB_SCT_EXPLORATORY_RECONNAISSANCE_OPERATING_BOUNDARY_DEC0055.md), [proxy-phase execution design](data/gb-sct/GB_SCT_PROXY_PHASE_EXECUTION_PROPOSAL_DEC0057.md), [P2 local package](data/gb-sct/GB_SCT_PROXY_P2_LOCAL_IMPLEMENTATION_PACKAGE_DEC0060.md) and [result](data/gb-sct/GB_SCT_PROXY_P2_LOCAL_IMPLEMENTATION_RESULT_2026-08-02.md), [Bills-foundation reconnaissance result](data/gb-sct/GB_SCT_BILLS_FOUNDATION_RECONNAISSANCE_RESULT_2026-08-02.md), [contextual-reference reconnaissance result](data/gb-sct/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md), [roles/committees result](data/gb-sct/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md), [MQA first-pass result](data/gb-sct/GB_SCT_MQA_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md), [votes-on-motions first-pass result](data/gb-sct/GB_SCT_VOTES_ON_MOTIONS_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md), and [high-volume route audit](data/gb-sct/GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md) |
| [Infrastructure](infrastructure/) | Current VPS boundary, operating controls, secrets/environment design, and VPS inventory records. | [Current VPS V4 plan](infrastructure/CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md) |
| [Application](application/) | V4B application specification, local implementation, deployment, acceptance evidence, and private-beta controls. | [Private beta access foundation](application/PRIVATE_BETA_ACCESS_FOUNDATION_PROPOSAL_DEC0043.md), [local access implementation result](application/PRIVATE_BETA_ACCESS_LOCAL_IMPLEMENTATION_RESULT_2026-08-02.md), [runtime/cutover package](application/PRIVATE_BETA_RUNTIME_AND_PRIVATE_CUTOVER_PACKAGE_DEC0059.md), and [pilot access-flow reconnaissance](application/PILOT_ACCESS_FLOW_RECONNAISSANCE_2026-08-02.md) |
| [Archive](archive/) | Superseded or completed historical implementation records retained for auditability. | [V4A infrastructure archive](archive/infrastructure/v4a/) |

## Operating rule

Keep infrastructure, source/DB1 work, canonical/DB2 work, application work,
and public-release work distinct. A document belongs in the area governing the
resource it changes or evidences. Historical evidence is moved to `archive/`,
not deleted. Every active plan must link to its authority, result, and any
relevant governance control.

## Planned data sequence

The next substantive programme is intentionally three-layered:

1. transparent, labelled pass-through access to selected Scottish Parliament
   API routes;
2. DB1: immutable, manifest-backed API capture/mirror; and
3. DB2: Tier 1 native-direct and Tier 2 deterministic canonical variables,
   built only from versioned DB1 inputs.

Each layer requires its own owner-approved execution package. Public exposure
and data-access features must disclose source, capture/release identity,
provenance, definitions, limitations, and reproducible access methods.
