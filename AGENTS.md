# Project Discipline Instructions

These instructions apply to every human-assisted or automated change in this
repository. They operationalise the project’s evidence-first methodology; they
do not replace the project owner’s authority.

## Read before material work

Before proposing, editing, reviewing, or executing a material change, read:

1. [`docs/governance/PROJECT_DESIGN.md`](docs/governance/PROJECT_DESIGN.md)
2. [`docs/governance/HANDOVER.md`](docs/governance/HANDOVER.md)
3. [`docs/governance/GOVERNANCE.md`](docs/governance/GOVERNANCE.md)
4. [`docs/governance/DECISION_REGISTER.md`](docs/governance/DECISION_REGISTER.md)
5. [`docs/governance/RISK_AND_DEPENDENCY_REGISTER.md`](docs/governance/RISK_AND_DEPENDENCY_REGISTER.md)
6. the latest entry in [`docs/governance/GOVERNANCE_REVIEW_LOG.md`](docs/governance/GOVERNANCE_REVIEW_LOG.md)

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

### Approved source-qualification work packages

An owner-approved source-qualification work package may authorise a named
route cohort and a fixed class of transient, value-free observations. It must
state every route form, maximum request count, identifier/parameter rule,
response ceiling, persistence prohibition, permitted retained metadata, stop
conditions, rolling evidence record, and final closure artefact.

Within those limits, routine listed requests and their documentation updates
may continue without another owner approval. Stop and seek a new owner decision
for an unlisted route or request form, redirect, retry, authentication/cookie
requirement, response above the stated ceiling, unexpected content type or
unsafe output path, data-handling concern that cannot be contained by the
value-free method, external contact, credential, capture/retention/release,
system action, or any ambiguity about the approved boundary.

Any observer output must be formed from an explicit allowlist of permitted
summary fields. Dynamic identifiers, resolved URLs, source values, raw response
content, headers, digests, and tool transcripts must be excluded before the
output is emitted, not merely omitted from the later project record.

This mechanism cannot authorise capture, retention, proxying, DB1/DB2,
implementation, public output, legal advice, a source-terms conclusion, or a
claim beyond the documented observation scope.

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

Apply the review cadence and event triggers in `docs/governance/GOVERNANCE.md`. Before a
phase transition or public claim, the latest governance review must be current
and must not be `CHANGES_REQUIRED` or `BLOCKED`. Record material decisions,
risks, dependencies, and review outcomes in their designated registers; do not
create a competing source of truth.

For a minor editorial change, preserve document status, meaning, links, and
metadata. Escalate the change to the pre-flight gate if its meaning or scope is
uncertain.

## Reporting discipline

Every material activity update or completion report must state the smallest
proposed **what next** step. Make clear whether that step is merely a proposed
documentation task or requires a new explicit owner approval; never present a
proposed next step as already authorised.

## Documentation structure

[`docs/README.md`](docs/README.md) is the human entry point. Place new records
by the resource or decision they govern:

- `docs/governance/` — governing baseline, decisions, risks, reviews, and
  handover;
- `docs/planning/` — cross-cutting phase plans;
- `docs/data/` — source, proxy, DB1, DB2, variable, release, and data-access
  documentation, partitioned by legislature where applicable;
- `docs/infrastructure/` — current VPS, deployment-boundary, and operational
  controls;
- `docs/application/` — application contracts, implementation, and service
  acceptance evidence; and
- `docs/archive/` — completed or superseded historical records retained for
  auditability, never silently deleted.

Update `docs/README.md` when adding a new active area or changing the reading
path. Keep links valid; do not place a new active document directly in the
`docs/` root.

## Daily repository hygiene

On each UTC calendar day in which substantive work is active, conduct one
read-only hygiene assessment covering documentation structure and links,
repository status, stale/generated artefacts, and obvious code or text
organisation that would make the project harder to inspect or reproduce.

When that assessment indicates a tidy-up would be useful, tell the project
owner what is proposed and ask for agreement before moving, archiving,
deleting, reformatting, or otherwise changing repository content. Do not treat
this standing rule as pre-approval for a tidy-up. Once approved, keep the work
bounded, preserve audit-relevant history, verify links and relevant checks,
and record any material documentation/governance effect.
