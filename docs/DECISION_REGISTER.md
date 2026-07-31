# Decision Register

**Status:** Active register

**Version:** 0.1.0
**Last updated:** 31 July 2026

This register makes the current project baseline and open owner decisions
visible. `RECORDED_BASELINE` documents an existing position from the design or
handover; it does not convert a draft design or a future activity into an
approved action.

| ID | Decision | Status | Authority and evidence | Consequence / next action |
| --- | --- | --- | --- | --- |
| DEC-0001 | Treat the repository as a clean rebuild, not a continuation of the prior prototype. | `RECORDED_BASELINE` | Project design §1; handover “What has been decided”. | Do not migrate or represent legacy material as new-project evidence. |
| DEC-0002 | Use a layered architecture and seven-tier provenance model. | `RECORDED_BASELINE` | Project design §§3–4. | Future technical proposals must preserve layer separation, lineage, and tier-specific disclosure. |
| DEC-0003 | Use Scottish Parliament (`GB-SCT`) as the first prospective legislature. | `RECORDED_BASELINE` | Project design §2; handover “What has been decided”. | This does not select a source or authorise source work. |
| DEC-0004 | Require parliament isolation and zero blast radius. | `RECORDED_BASELINE` | Project design §7. | Any future integration proposal must show isolation across data, code, releases, and services. |
| DEC-0005 | Restrict the presently approved work to Phase 0 planning and governance documentation. | `APPROVED` | Owner instruction authorising the “Phase 0 delivery pack only” (31 July 2026). | Do not access VPS/source data/databases or implement application code under this approval. |
| DEC-0006 | Approve the project-design baseline. | `APPROVED` | Owner approval (31 July 2026); `PROJECT_DESIGN.md` v1.0.0. | The approved design governs future methodology. It does not authorise Phase A, source work, infrastructure, or implementation. |
| DEC-0007 | Define the first GB-SCT source slice and its success criteria. | `PROPOSED` | Project design §§8, 12. | Requires a source-specification proposal and explicit owner approval before source reconnaissance/capture. |
| DEC-0008 | Set source-data retention and publication policy, including personal-data treatment. | `PROPOSED` | Project design §12. | Must be approved before source capture, storage, or publication design is implemented. |
| DEC-0009 | Choose deployment and secret-management environment. | `PROPOSED` | Project design §§9, 12. | Requires an environment-neutral proposal; no credentials or provisioning action is implied. |
| DEC-0010 | Approve a VPS inventory and any deletion/recreation plan after a future read-only inspection. | `PROPOSED` | Project design §§9, 12; handover “How to work with the owner”. | No VPS inspection, deletion, or recreation is authorised by this entry. |
| DEC-0011 | Adopt active governance enforcement: repository pre-flight instructions and periodic/triggered alignment reviews. | `APPROVED` | Owner approval of the Phase 0.1 governance-enforcement amendment (31 July 2026). | Create and maintain `AGENTS.md` and `GOVERNANCE_REVIEW_LOG.md`; all later work remains subject to its own explicit approval. |

## Record updates

Add new decisions rather than editing the substance of a closed record. Mark a
replaced record `SUPERSEDED`, retain its original evidence link, and add the
identifier of the successor decision. Record a decision as `APPROVED` only with
the owner’s explicit approval, scope, and date.
