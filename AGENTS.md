# Project Discipline Instructions

These instructions apply to every human-assisted or automated change in this
repository. They operationalise the project’s evidence-first methodology; they
do not replace the project owner’s authority.

## Read before material work

Before proposing, editing, reviewing, or executing a material change, read:

1. [`docs/PROJECT_DESIGN.md`](docs/PROJECT_DESIGN.md)
2. [`docs/HANDOVER.md`](docs/HANDOVER.md)
3. [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md)
4. [`docs/DECISION_REGISTER.md`](docs/DECISION_REGISTER.md)
5. [`docs/RISK_AND_DEPENDENCY_REGISTER.md`](docs/RISK_AND_DEPENDENCY_REGISTER.md)
6. the latest entry in [`docs/GOVERNANCE_REVIEW_LOG.md`](docs/GOVERNANCE_REVIEW_LOG.md)

A change is material when it could affect a data definition, provenance,
validation status, source scope, public claim, security boundary, retention
policy, VPS/database target, deployment, or interpretation of a record.

## Pre-flight gate

Before material work, state and record:

- the active phase and the precise approved scope;
- the authorising decision identifier;
- affected documents, contracts, records, or systems;
- known uncertainty and risks;
- the smallest proposed change and containment/rollback implications; and
- the verification method and the artefact that will retain its result.

If no explicit owner-approved decision authorises the exact work, mark it
`BLOCKED` and seek direction. Do not treat related work, a prior phase exit, a
draft, or silence as approval.

### Approved infrastructure work packages

For VPS infrastructure only, an owner-approved work package may authorise a
bounded outcome across named project resources rather than one decision per
ordinary command. Within that package, normal command syntax, repeated
read-only checks, and a correction to an implementation detail may proceed
without another owner decision only when the target, permitted end state,
resource class, exposure, and privilege boundary do not change.

Stop and seek a new owner decision for any protected-resource touch, deletion
outside a declared project-owned target, public/non-loopback exposure,
credential/login/SSH/sudo capability, shared-service or host-wide change,
source or research-data action, package installation, material resource-limit
increase, or ambiguity about impact on another workload. Retain a restricted
work-package result and update the durable registers after each material
package or unexpected stop.

## Absolute boundaries

Do not access a VPS, credentials, database, source data, legacy system, or
external operational service unless the owner has explicitly approved that
specific action. Do not capture, ingest, parse, publish, or infer source data;
implement infrastructure or application code; deploy; or make a public claim
outside the decision-authorised scope.

Do not silently repair missing or unexpected information. Preserve unknown,
failed, and blocked states. Do not use terms such as *complete*, *current*,
*live*, *official*, *mirror*, or *verified* without the scoped evidence
required by `PROJECT_DESIGN.md`.

## Governance maintenance

Apply the review cadence and event triggers in `docs/GOVERNANCE.md`. Before a
phase transition or public claim, the latest governance review must be current
and must not be `CHANGES_REQUIRED` or `BLOCKED`. Record material decisions,
risks, dependencies, and review outcomes in their designated registers; do not
create a competing source of truth.

For a minor editorial change, preserve document status, meaning, links, and
metadata. Escalate the change to the pre-flight gate if its meaning or scope is
uncertain.
