# Handover: Clean Rebuild of Comparative Legislative Data

**Status:** Active handover note  
**Date:** 31 July 2026

## Start here

This is a clean rebuild. Read these files before proposing or making any change:

1. [`PROJECT_DESIGN.md`](PROJECT_DESIGN.md) — the approved governing design and non-negotiable standards.
2. This handover note.

The project owner prioritises academic integrity, accuracy, traceability, and truthful disclosure above speed, feature delivery, appearance, or task completion. “Unknown”, “incomplete”, and “blocked” are acceptable outcomes. Unsupported claims are not.

## What has been decided

- The prior project is not trusted as a data source, code base, database, verification record, or production foundation.
- This repository is the sole active project repository.
- The old project may be consulted only as a read-only reference when necessary; do not copy its data, database contents, exports, credentials, claims, or implementation into this project.
- Restricted V0–V3 VPS control activity was completed under owner-approved
  operational records on 1 August 2026: the old frontend was stopped/disabled,
  and the two named legacy legislative databases were removed. No legacy data
  was migrated or retained. The shared cluster, roles, paths, Nginx sites,
  other databases, and unrelated workloads remain out of scope.
- No source-data capture, new infrastructure, deployment, database creation,
  or application implementation work has been authorised yet.
- The first substantive artefact is the approved project-design baseline. Future revisions require the documented change-control process.
- The first legislature will be the Scottish Parliament (`GB-SCT`), but the project must be designed so an additional parliament cannot affect another parliament’s data, code, releases, or services.

## Methodological position

The project will eventually use all seven provenance tiers. It will initially implement only the narrowest defensible subset, expected to begin with native source values and deterministic derivations.

| Tier | Identifier | Meaning |
| --- | --- | --- |
| 1 | `NATIVE_DIRECT` | A value directly supplied by a named official host-assembly source. |
| 2 | `DERIVED_DETERMINISTIC` | A fully specified, repeatable rule over declared inputs. |
| 3 | `DERIVED_EXTRACTED` | Programmatic extraction from documents or other unstructured source material. |
| 4 | `DERIVED_HUMAN_CODED` | A value created or adjudicated under a documented human coding protocol. |
| 5 | `DERIVED_SYNTHETIC_AI` | A probabilistic AI/ML-derived value, with model and benchmark disclosure. |
| 6 | `LINKED_EXTERNAL_AUTHORITY` | A declared value or identifier from an external source. |
| 7 | `UNAVAILABLE_HARD_GAP` | A documented determination that a defined variable cannot be provided. |

Tier is not a quality claim. Validation status and complete lineage are separate requirements. The detailed definitions, evidence requirements, and rules for composite lineage are in `PROJECT_DESIGN.md`.

## What the prior review found

The previous prototype described a strong academic design but did not reliably implement it. The following are reasons for the clean reset, not material to inherit:

- selected and transformed fields were described as a full raw mirror;
- public parity claims were not supported by full count/key/hash audit evidence;
- dashboard figures were calculated in browser code despite a database-first promise;
- pipeline automation and exports were internally inconsistent;
- no usable tracked test suite or reproducible data-release artefacts were present.

Do not repeat these patterns. Do not repeat them by using different terminology.

## How to work with the owner

Use plain language. Avoid unnecessary tooling detail, temporary paths, or speculative status claims. State the outcome first.

For any material change:

1. inspect and explain the relevant evidence;
2. identify uncertainty, affected data contracts, and risks;
3. propose the smallest safe change and how it will be verified;
4. wait for the owner’s approval before implementing;
5. implement only the approved scope;
6. verify it, commit the relevant documentation/code/tests together, and report what is actually evidenced.

Do not create a second source of truth. The working local checkout must be a clone of this repository and its remote must be `https://github.com/comparative-legislative-data/rebuild-legislative-data.git`.

Do not access the VPS, delete old resources, connect to a database, use credentials, ingest source data, or deploy anything unless the owner has explicitly asked for that specific next action. Any future VPS reset begins with a read-only inventory and an owner-approved, exact deletion plan; no old data is to be migrated.

## Recommended immediate next action

The owner has authorised a Phase 0 planning and governance documentation pack
only, including a governance-enforcement amendment. The pack is defined in
[`PHASE_0_DELIVERY_PLAN.md`](PHASE_0_DELIVERY_PLAN.md), governed by
[`GOVERNANCE.md`](GOVERNANCE.md), and reviewed through
[`GOVERNANCE_REVIEW_LOG.md`](GOVERNANCE_REVIEW_LOG.md). It does not authorise
implementation or operational work.

The owner has authorised a documentation-only Phase A planning pack under
`DEC-0012`, defined in [`PHASE_A_PLAN.md`](PHASE_A_PLAN.md), and a bounded
catalogue inspection under `DEC-0013`, defined in
[`RECONNAISSANCE_AUTHORIZATION_DEC0013.md`](RECONNAISSANCE_AUTHORIZATION_DEC0013.md).
The DEC-0013 catalogue assessment is recorded in
[`GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`](GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md).
DEC-0007 approved the complete selected endpoint inventory and roadmap in
[`GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`](GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md),
supported by the catalogue assessment and its route-metadata supplement.
DEC-0008 approved the retention, publication, and personal-data policy in
[`RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`](RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md),
with its route-level companion
[`SOURCE_HANDLING_RECORD_TEMPLATE.md`](SOURCE_HANDLING_RECORD_TEMPLATE.md).
The draft for the next gate is
[`GB_SCT_CAPTURE_PROXY_DB1_PLAN_PROPOSAL.md`](GB_SCT_CAPTURE_PROXY_DB1_PLAN_PROPOSAL.md),
with its required per-batch control record
[`CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md`](CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md).
Owner approval of DEC-0018 remains required. No capture or implementation is
authorised.

VPS control is separate from the source-data plan. The approved VPS-control
plan is
[`VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md`](VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md),
with a required per-host control record in
[`VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md`](VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md).
The V0–V3 legacy-control sequence is complete for its limited two-database
scope. DEC-0009 approved an isolated no-Docker namespace on the current VPS.
DEC-0022 approved the staged V4 foundation/service/cutover boundary in
[`CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md`](CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md).
DEC-0023 was approved but its one-shot V4A action was `BLOCKED` during
pre-flight before any mutation, as recorded in
[`V4A_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0023.md`](V4A_FOUNDATION_AUTHORIZATION_PROPOSAL_DEC0023.md).
DEC-0024 then established by a minimal read-only check that the shared
`16-main` PostgreSQL cluster has wildcard listeners, so it is excluded from
the project database design. A new native loopback/private-cluster proposal is
now approved as DEC-0025 in
[`NATIVE_POSTGRESQL_CLUSTER_PROPOSAL_DEC0025.md`](NATIVE_POSTGRESQL_CLUSTER_PROPOSAL_DEC0025.md).
DEC-0026 failed before mutation on a `df` option compatibility check.
DEC-0027 corrected that check, created the new foundation targets, and then
stopped when the new cluster's first systemd start failed before database roles
or databases were created. DEC-0028 then performed a new-cluster-only
read-only inspection and identified malformed quoting in three new-cluster
settings. DEC-0029 then established that the native helper writes the raw IPv4
literal without required PostgreSQL quoting, so offline validation stopped the
start. DEC-0030 directly corrected and offline-validated the three lines, but
stopped before its start attempt because its HBA reader lacked permission.
DEC-0031 completed the privileged HBA read but found an unexpected rule profile
and stopped before any start. The next decision is the new-cluster-only,
read-only HBA inspection proposal in
[`V4A_NATIVE_CLUSTER_HBA_INSPECTION_PROPOSAL_DEC0032.md`](V4A_NATIVE_CLUSTER_HBA_INSPECTION_PROPOSAL_DEC0032.md).
DEC-0032 then confirmed the expected local-only HBA profile, including the
standard local peer rule for the PostgreSQL service account. The next V4A
decision is the bounded cluster/start/database completion proposal in
[`V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md`](V4A_NATIVE_CLUSTER_COMPLETION_PROPOSAL_DEC0033.md).
DEC-0033 then exhausted its permitted starts after a contained runtime-directory
correction; no roles or databases were created and existing clusters remained
unchanged. The next decision is the replacement runtime-directory recovery and
V4A completion proposal in
[`V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_PROPOSAL_DEC0035.md`](V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_PROPOSAL_DEC0035.md).
The owner has also requested a more proportionate control model for basic VPS
setup; its documentation proposal is
[`INFRASTRUCTURE_WORK_PACKAGE_CONTROL_PROPOSAL_DEC0034.md`](INFRASTRUCTURE_WORK_PACKAGE_CONTROL_PROPOSAL_DEC0034.md).
Later frontend/backend service
deployment and the `legislativedata.org` cutover remain separately gated. DEC-0009 is recorded in
[`ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md`](ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md).
No V4 provisioning, credential issuance, database/service creation,
deployment, Nginx/DNS change, source capture, or implementation is authorised.

## Repository state at handover

- Default branch: `main`
- Design baseline commit: `fc4dc32` (`docs: establish project design and provenance model`)
- The document was pushed to GitHub.
- This handover note should be committed with its own documentation-only commit.
