# Source-Slice Decision Memo Template — Superseded

**Status:** Superseded by `ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md`

**Version:** 0.1.0
**Last updated:** 31 July 2026

This retained historical template used the earlier narrow-slice framing. Use
[`ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md`](ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md)
for DEC-0007 under the approved endpoint-inventory model.

## Decision record

| Field | Required content |
| --- | --- |
| Decision ID | `DEC-0007` and any superseding decision. |
| Requested owner action | Approve, reject, or revise a bounded future source/capture proposal. |
| Candidate source and authority basis | Named target(s), official-host evidence, and scope limitation. |
| Proposed slice | Legislature, unit of analysis, inclusion/exclusion rules, temporal boundary, and maximum expected scope. |
| Proposed variables | Exact source fields, source definitions where available, null semantics, and stated provenance tier. |
| Evidence summary | Links or retained references to assessment records; observed facts distinguished from candidates. |
| Access, licence, and privacy | Reuse/retention basis, restrictions, personal-data assessment, and unresolved matters. |
| Capture proposal | Exact permitted endpoints/actions, rate/volume/window, capture manifest requirements, and prohibited actions. |
| Acceptance criteria | Conditions for capture integrity, retrieval coverage, schema stability, lineage, and any manual inspection. |
| Stop conditions | Authority uncertainty, licence/privacy issue, unexpected schema/identifier/pagination behaviour, retrieval failure, or scope expansion. |
| Risks and dependencies | Linked risk/dependency IDs and required owner decisions. |
| Recommendation | `PROCEED_TO_CAPTURE_PLAN`, `REVISE_SLICE_OR_METHOD`, `DO_NOT_PROCEED`, or `BLOCKED_PENDING_OWNER_DECISION`. |

## Owner decision block

| Field | Record |
| --- | --- |
| Owner decision | `APPROVED`, `REJECTED`, or `REVISE_AND_RESUBMIT` |
| Approved scope | Exact targets, actions, limits, and duration; leave blank until approved. |
| Conditions | Required safeguards, artefacts, or follow-up review. |
| Date | UTC date of explicit owner decision. |
| Consequence | Next authorised action, or explicit block. |
