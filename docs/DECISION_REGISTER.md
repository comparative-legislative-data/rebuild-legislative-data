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
| DEC-0007 | Approve the complete GB-SCT endpoint inventory and variable roadmap. | `APPROVED` | Owner sign-off (31 July 2026); endpoint-inventory model (DEC-0014); owner clarification on motion-amendment versus bill-amendment votes and deferred document scope; [`GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`](GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md) v1.0.0. | The exact selected route set, native-access/DB1 roadmap, Tier 1/2 candidates, deferred variables, and exclusions are approved. Bill-amendment evidence is not treated as provided by the vote-on-motion API; the document corpus is a later, separately approved programme. No capture, proxy/DB1 implementation, or public release is authorised. |
| DEC-0008 | Set source-data retention and publication policy, including personal-data treatment. | `APPROVED` | Owner approval (31 July 2026); [`RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`](RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md) v1.0.0. | The restrictive-default handling classes, route-level assessment, correction/withdrawal controls, and seven-year minimum retention floor are approved. No source request, capture, storage system, proxy/DB1 implementation, or public release is authorised. |
| DEC-0009 | Choose deployment and secret-management environment. | `PROPOSED` | Project design §§9, 12. | Requires an environment-neutral proposal; no credentials or provisioning action is implied. |
| DEC-0010 | Approve a VPS inventory and any deletion/recreation plan after a future read-only inspection. | `PROPOSED` | Project design §§9, 12; handover “How to work with the owner”. | No VPS inspection, deletion, or recreation is authorised by this entry. |
| DEC-0011 | Adopt active governance enforcement: repository pre-flight instructions and periodic/triggered alignment reviews. | `APPROVED` | Owner approval of the Phase 0.1 governance-enforcement amendment (31 July 2026). | Create and maintain `AGENTS.md` and `GOVERNANCE_REVIEW_LOG.md`; all later work remains subject to its own explicit approval. |
| DEC-0012 | Prepare a Phase A planning pack for future source-slice reconnaissance and specification. | `APPROVED` | Owner instruction to proceed with the planning-only scope (31 July 2026). | Create planning documents only; DEC-0007 remains proposed and no source, VPS, database, credential, capture, or implementation action is authorised. |
| DEC-0013 | Approve a bounded GB-SCT API-catalogue reconnaissance action. | `APPROVED` | Owner approval (31 July 2026); `RECONNAISSANCE_AUTHORIZATION_DEC0013.md`; `GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`. | Catalogue inspection completed within scope. No direct API calls, capture, credentials, database/VPS activity, code, or publication occurred. DEC-0007 remains required for endpoint-inventory selection. |
| DEC-0014 | Adopt the endpoint-inventory, native-access/DB1, and variable-roadmap delivery model. | `APPROVED` | Owner agreement (31 July 2026); `ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md`. | Supersedes the narrow-slice-first framing for future planning; no source-data capture or implementation is authorised. |
| DEC-0015 | Complete route-level documentation inspection required to prepare the DEC-0007 proposal. | `APPROVED` | Owner instruction to proceed with the stated metadata-only DEC-0007 preparation scope (31 July 2026); [`GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md`](GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md). | Limited to the rendered API catalogue and route/parameter metadata. No listed API route was called and no payload, capture, credentials, database/VPS activity, or implementation was authorised. |
| DEC-0016 | Prepare the DEC-0008 retention, publication, and personal-data policy proposal. | `APPROVED` | Owner instruction to proceed with DEC-0008 proposal preparation (31 July 2026). | Documentation-only scope: prepare the policy and route-level handling template. It does not authorise source access, capture, storage, database/proxy implementation, or public release. |
| DEC-0017 | Prepare the bounded capture, native-access, and DB1 execution-plan proposal. | `APPROVED` | Owner instruction to proceed with developing the plan (31 July 2026). | Documentation-only scope: prepare the staged plan and batch-authorisation template. It does not authorise source requests, capture, storage, database/proxy implementation, code, infrastructure, or public release. |
| DEC-0018 | Approve the GB-SCT capture, native-access, and DB1 execution plan. | `PROPOSED` | DEC-0007 approved endpoint inventory; DEC-0008 approved handling policy; [`GB_SCT_CAPTURE_PROXY_DB1_PLAN_PROPOSAL.md`](GB_SCT_CAPTURE_PROXY_DB1_PLAN_PROPOSAL.md). | Requires owner review of the staged gates, batch order, capture/native-access/DB1 contracts, acceptance criteria, and stop conditions. It does not authorise a source request or implementation. |
| DEC-0019 | Prepare the VPS inventory, isolation, and clean-rebuild control plan. | `APPROVED` | Owner instruction to proceed with VPS planning (31 July 2026). | Documentation-only scope: prepare the V0–V4 control plan and read-only inventory authorisation template. It does not authorise VPS access, credential use, database connection, deletion, provisioning, or deployment. |
| DEC-0020 | Approve the VPS inventory, isolation, and clean-rebuild control plan. | `PROPOSED` | Project design §§7, 9, 12; [`VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md`](VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md). | Requires owner review of metadata-only legacy DB1 inventory, unrelated-workload isolation, exact deletion/recreation gates, and clean-rebuild constraints. It does not authorise a VPS connection or change. |

## Record updates

Add new decisions rather than editing the substance of a closed record. Mark a
replaced record `SUPERSEDED`, retain its original evidence link, and add the
identifier of the successor decision. Record a decision as `APPROVED` only with
the owner’s explicit approval, scope, and date.
