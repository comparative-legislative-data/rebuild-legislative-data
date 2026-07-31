# Risk and Dependency Register

**Status:** Active pre-implementation register

**Version:** 0.1.0
**Last updated:** 31 July 2026

Ratings are intentionally qualitative. They direct review effort; they do not
claim quantified probability or impact. No register entry authorises mitigation
work outside the approved phase.

| ID | Type | Statement | Rating | Owner role | Trigger / review point | Required response |
| --- | --- | --- | --- | --- | --- | --- |
| RSK-0001 | Risk | The approved methodology could be treated as implementation approval. | High | Project owner | Before any work outside documentation. | Confirm a specific scope and record explicit approval. |
| RSK-0002 | Risk | Legacy material could contaminate the clean rebuild or its claims. | High | Maintainer | Any request to inspect or reuse previous project material. | Treat it as untrusted reference only; seek approval before relying on it. |
| RSK-0003 | Risk | Source semantics, identifiers, licences, pagination, or personal-data constraints may invalidate a proposed first slice. | High | Project owner | Before source reconnaissance or capture is proposed. | Review a bounded source specification and retention/publication proposal. |
| RSK-0004 | Risk | A future VPS reset could affect unrelated services or destroy evidence. | High | Project owner | Any VPS-related request. | Require an approved read-only inventory followed by an exact approved deletion/recreation plan. |
| RSK-0005 | Risk | “Verified”, “complete”, or similar language may overstate evidence. | High | Maintainer | Before any outward-facing claim or status label. | Apply the claim-control procedure and retain its evidence artefact. |
| RSK-0006 | Risk | Shared future platform work could create cross-legislature impact. | Medium | Maintainer | Any proposal for a second legislature or shared library. | Demonstrate isolation, fixture coverage, and compatibility checks before approval. |
| RSK-0007 | Risk | Governance documents may become stale, inconsistent, or unused while work proceeds. | High | Maintainer | Routine deadline, phase gate, public claim, or any governance-review trigger. | Apply the governance assurance cycle; block affected work on a stale, `CHANGES_REQUIRED`, or `BLOCKED` review. |
| ASM-0001 | Assumption | The project owner remains the authority for material approval. | High | Project owner | If delegation is proposed or ownership changes. | Record the delegated authority and limits in the decision register. |
| DEP-0001 | Dependency | Approval of a bounded first source slice and its success criteria. | High | Project owner | Before any source/infrastructure/application proposal. | Resolve DEC-0007. |
| DEP-0002 | Dependency | Retention/publication and personal-data policy. | High | Project owner | Before any capture or data-storage proposal. | Resolve DEC-0008. |
| DEP-0003 | Dependency | Approved deployment and secret-management approach. | Medium | Project owner | Before infrastructure or deployment proposal. | Resolve DEC-0009. |
| DEP-0004 | Dependency | Owner-approved VPS inventory and exact plan, if a reset becomes necessary. | High | Project owner | Before any VPS access. | Resolve DEC-0010; no access before then. |
| DEP-0005 | Dependency | Current governance review with no blocking outcome. | High | Maintainer | Before a phase transition or public claim. | Maintain `GOVERNANCE_REVIEW_LOG.md` under DEC-0011. |

## Maintenance rule

Add a new entry when a risk, issue, assumption, or dependency is discovered.
Update the status through an additive note or linked decision; do not delete an
entry merely because it is inconvenient. An unresolved high-rated entry blocks
the affected activity, not unrelated documentation work.
