# Governance: Evidence, Change, and Claims

**Status:** Active procedure for documentation and future project work

**Version:** 0.1.0
**Last updated:** 31 July 2026

## 1. Authority and hierarchy

The project design is the governing methodological baseline. The handover note
defines the active operational boundary. This document specifies how changes
and claims are controlled; it does not change the design, approve an activity,
or substitute for owner approval.

When documents conflict, stop the affected work and obtain an owner decision.
Until resolved, apply the more restrictive interpretation. The durable records
for this procedure are:

- [`PROJECT_DESIGN.md`](PROJECT_DESIGN.md) for methodology and requirements;
- [`HANDOVER.md`](HANDOVER.md) for the active operational boundary;
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md) for decisions and approvals;
- [`RISK_AND_DEPENDENCY_REGISTER.md`](RISK_AND_DEPENDENCY_REGISTER.md) for
  unresolved risks, assumptions, issues, and dependencies; and
- future versioned artefacts for source specifications, codebooks, release
  manifests, and verification reports when those are separately authorised.

## 2. Roles

| Role | Responsibility | Authority limit |
| --- | --- | --- |
| Project owner | Approves material scope, methodology, public claims, and operational actions. | Approval must be explicit and recorded. |
| Maintainer | Prepares evidence, proposed changes, and verification records; maintains the registers. | Cannot infer owner approval or widen scope. |
| Reviewer | Tests whether a proposal and its evidence meet the declared standard. | Does not approve on behalf of the owner unless expressly delegated and recorded. |

One person may hold several roles, but the record must state which role acted.

## 3. Change control

A change is material if it could affect a data definition, provenance,
validation status, source scope, public claim, security boundary, retention
policy, database/VPS target, deployment, or interpretation of historical
records. Material changes use this sequence:

1. Record the problem or opportunity, affected contracts, uncertainty, and
   containment/rollback implications.
2. Propose the smallest safe scope, alternatives where material, and a concrete
   verification plan.
3. Obtain explicit owner approval before any mutation or external action.
4. Make only the approved change; record any scope deviation as a new proposal.
5. Retain the verification result, including `PASS`, `FAIL`, `BLOCKED`, or
   `NOT_RUN`, and update affected registers and release notes.

Minor editorial changes may proceed when they do not alter meaning, scope,
status, a requirement, or a claim. They must still preserve links and document
metadata.

## 4. Decision records and approvals

Each material decision receives a stable identifier in the decision register.
Its record states the question, status, authority, evidence, date, scope,
consequences, and any superseded decision. Permitted statuses are:

| Status | Meaning |
| --- | --- |
| `RECORDED_BASELINE` | Existing project position recorded from an authoritative project document; not a new approval. |
| `PROPOSED` | A decision is prepared for owner review. |
| `APPROVED` | The owner explicitly authorised the stated scope. |
| `REJECTED` | The owner decided not to proceed with the stated proposal. |
| `SUPERSEDED` | A later identified decision replaces it; the older record remains readable. |

Silence, a generic request to continue, or completion of related work is not
approval for a material action. Approval is interpreted narrowly: it applies
only to the stated action, target, and constraints.

## 5. Claim control

Any statement in documentation, software, an API, an export, a chart, or a
status surface that describes a source, data asset, result, or system must be
classified before publication as one of:

- **Observed:** tied to a named source response and capture time;
- **Verified:** tied to a reproducible procedure and retained result;
- **Derived deterministic:** tied to named versioned inputs and an exact rule;
- **Candidate:** proposed but unavailable in a released dataset; or
- **Unknown / unavailable:** not established by the platform.

The terms and limits are those defined in `PROJECT_DESIGN.md`. A claim record
must state its wording, scope, evidence artefact, owner of the claim, review
date, and limitations. No claim may use words such as *complete*, *current*,
*live*, *official*, *mirror*, or *verified* without the defined scope and
evidence required by the project design.

Until release artefacts exist, the only permissible system-level statement is
that this repository contains planning and governance documentation for a
proposed clean rebuild.

## 6. Registers, reviews, and traceability

The maintainer updates the decision register when a decision is proposed or
made and updates the risk/dependency register when a risk, assumption, issue,
or dependency changes materially. A review happens before beginning a new
phase, before a public claim, and whenever a trigger stated in the risk register
occurs.

Records are additive. Corrections explain what changed and link to the earlier
record; they do not silently rewrite historical decisions or verification
results. Secrets, credentials, raw production data, and personal data not
authorised for publication do not belong in the registers.

## 7. Stop conditions

Work pauses and is marked `BLOCKED` when an ambiguity could affect data
meaning, source authority, a public claim, a security boundary, personal-data
handling, a deletion target, or a cross-legislature boundary. The block record
must identify the decision needed, evidence already available, and the owner
role needed to resolve it.

## 8. Governance assurance cycle

Governance is an active control, not a one-time documentation task. The
maintainer must keep a dated review record in
[`GOVERNANCE_REVIEW_LOG.md`](GOVERNANCE_REVIEW_LOG.md) and apply its cadence:

- every 30 calendar days while work is active;
- every 90 calendar days while dormant;
- before proposing a phase start or closure or a public claim/release; and
- immediately after a near-miss, material ambiguity, source-drift finding,
  methodology/security change, or proposed scope expansion.

The review checks that project design, handover, governance procedure, decision
register, risk/dependency register, active phase, and public-facing claims are
consistent. It must explicitly confirm that the current work is authorised by a
recorded decision and remains within its approved scope.

`PASS` means alignment within the review scope, not verification of any future
system or dataset. `CHANGES_REQUIRED` blocks affected work until the correction
is reviewed. `BLOCKED` identifies the owner decision or external fact needed to
proceed. A stale or missing review blocks a phase transition and any public
claim.

## 9. Infrastructure work packages

For routine VPS infrastructure only, the owner may approve a named,
outcome-bounded work package instead of individual commands. The package must
state its project namespace, permitted resource classes/end state, protected
resources, resource limits, verification checks, and containment/rollback
position.

Within that approved package, the maintainer may choose normal command syntax,
repeat harmless read-only checks, and correct an implementation detail without
another decision only if the target, resource class, exposure, privilege
boundary, and intended end state do not change. The work must remain additive
or be a declared project-owned rollback, and its restricted record must retain
the actions by intent, outcomes, stop conditions, and non-secret verification.

A new owner decision remains mandatory for a protected-resource touch,
deletion/overwrite outside a declared project-owned target, shared-service or
host-wide change, public/non-loopback exposure, credential/login/SSH/sudo
capability, source/research-data work, package installation, material
resource-limit increase, or any uncertainty about another workload.

This model does not relax any capture, retention, provenance, DB1, canonical,
publication, research-claim, public-release, or public-cutover control.

## 10. Enforcement and traceability

[`../AGENTS.md`](../AGENTS.md) is the repository-wide pre-flight instruction
for people working through agents and for automated agents. It requires the
governing records to be read, a phase and authorising decision to be stated,
and work to stop if approval is absent or scope is ambiguous.

For future implementation phases, the same gate should be made mechanical
before that phase begins: the change/merge process must require a phase and
decision identifier, an evidence/verification reference, and a governance
impact declaration. The design of that technical control needs a separate
owner-approved proposal. Until then, this documented pre-flight and review
process is the active enforcement mechanism.
