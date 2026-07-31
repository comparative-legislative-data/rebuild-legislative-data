# Phase 0 Delivery Plan: Planning and Governance

**Status:** Approved for documentation delivery only

**Version:** 0.1.0
**Last updated:** 31 July 2026

## 1. Purpose

Phase 0 establishes the written controls needed to make later technical work
reviewable, bounded, and evidence-led. It does not establish a data pipeline,
select a source slice, or prove that any future system will meet the project
standards.

This plan implements the working agreement in
[`PROJECT_DESIGN.md`](PROJECT_DESIGN.md) and must be read with the active
handover note in [`HANDOVER.md`](HANDOVER.md).

## 2. Authorised scope

The approved Phase 0 scope is limited to planning and governance documentation:

- this delivery plan;
- a governance procedure for decisions, changes, claims, and documentation;
- a decision register recording the current baseline without upgrading any
  draft decision to approved status; and
- a risk and dependency register for the next owner decisions.

The Phase 0 documents may record proposed work and approval gates, but they do
not authorise that work.

The approved Phase 0.1 amendment adds durable repository instructions and a
governance-review control, so that these documents are actively used and
periodically checked for alignment.

## 3. Explicit exclusions

Phase 0 must not involve:

- connecting to, inventorying, modifying, or deleting any VPS resource;
- using credentials, connecting to a database, or changing database schemas;
- retrieving, capturing, storing, parsing, or publishing source data;
- implementation code, infrastructure configuration, deployment, or automated
  operational jobs; or
- an assertion that a source, variable, dataset, release, or application is
  ready, complete, current, or verified.

## 4. Deliverables and evidence

| Deliverable | Purpose | Completion evidence |
| --- | --- | --- |
| `PHASE_0_DELIVERY_PLAN.md` | Bound the phase and identify its exit decision. | This document is reviewed against the design and handover. |
| `GOVERNANCE.md` | Define the required controls for material changes and public claims. | Procedures link to their durable registers and preserve owner approval gates. |
| `DECISION_REGISTER.md` | Make baseline decisions, open decisions, and their authority visible. | Entries distinguish recorded baseline from owner approval and link to evidence. |
| `RISK_AND_DEPENDENCY_REGISTER.md` | Make unresolved risks, assumptions, and dependencies visible before implementation. | Every open item has an owner role, trigger, and next review/decision. |

| `AGENTS.md` | Give all agents and contributors an unambiguous pre-flight and stop rule. | Instructions require the governing records to be read and prohibit unapproved operational work. |
| `GOVERNANCE_REVIEW_LOG.md` | Record periodic and triggered alignment reviews. | A current review entry has an outcome, evidence, blockers, and next review due date. |

Completion evidence for this phase is documentary only. It is not verification
of an operational system or data asset.

## 5. Delivery sequence

1. Confirm that every document is consistent with the design and handover.
2. Publish the documentation pack in the repository as a single reviewable
   change.
3. The owner reviews the pack and records any requested revisions.
4. The owner decides whether to approve the project design and which specific
   pre-implementation decision to take next.

No activity after step 4 is implied. A later phase needs its own written scope,
acceptance criteria, and explicit owner approval.

## 6. Phase exit criteria

Phase 0 is complete only when:

- all four deliverables in section 4 are present and internally consistent;
- their links and stated document statuses have been checked;
- no document weakens the prohibitions or approval gates in the design and
  handover; and
- the governance-review control has a current initial entry and a next review
  deadline; and
- the owner has approved the Phase 0 pack and the project-design baseline, with
  those approvals recorded in the decision register.

Phase 0 completion does not approve source reconnaissance, VPS inventory,
infrastructure work, source capture, databases, or application implementation.

## 7. Next owner decisions

The next decision should be selected from the open items in
[`DECISION_REGISTER.md`](DECISION_REGISTER.md). Before any implementation,
the owner must still approve the decisions listed in section 12 of
[`PROJECT_DESIGN.md`](PROJECT_DESIGN.md), at the point they become relevant.
