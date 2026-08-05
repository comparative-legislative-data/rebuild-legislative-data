# DB1: Scottish Parliament Database mirror

**Status:** Backend Assurance audited — controlled correction required before
any mirror-completeness claim or Research Portal delivery.

DB1 is the retained-source layer for selected Scottish Parliament API material.
It is not DB2, an analytical dataset, or a claim of historical completeness.
Its purpose is to retain specified source responses with enough evidence to
establish what was obtained, when, from where, and with what integrity result.

## The reset

Earlier delivery mixed data ingestion, backend evidence and a provisional
interface. That made the interface reflect DB1's internal delivery mechanics
rather than researcher needs. The owner has reset the work into two strictly
sequenced tracks:

1. **[Backend Assurance](BACKEND_ASSURANCE.md)** — establish whether the raw
   object store, PostgreSQL metadata, route coverage, reconciliation and update
   controls meet the defined Database-mirror standard.
2. **[Research Portal](RESEARCH_PORTAL.md)** — only after the backend
   capability contract is accepted, build an independent, modern research
   experience around what the mirror can actually provide.

The current authenticated Database-mirror screen is a
[QA surface](QA_SURFACE.md). It helps check retained responses and backend
evidence, but is not an accepted researcher product and must not set the
information architecture of the later portal.

## What DB1 must preserve

For each approved source request/window, DB1 must be able to retain or report:

- the fixed source route and request method;
- capture time, HTTP response condition and relevant transport metadata;
- original response bytes, content type, byte length and SHA-256 digest;
- capture-run and configuration/code identity;
- reconciliation history and latest state;
- any raw-to-projection relationship, while keeping the raw response primary;
- explicit source availability messages, retrieval failures and unresolved
  states; and
- a declared update/reconciliation schedule or a visible statement that none
  exists.

PostgreSQL metadata and the immutable raw-object store are one DB1 backend.
Neither alone is a sufficient mirror.

## Current evidence, not a completeness claim

The latest metadata-only snapshot identified 113 latest retained GB-SCT
releases represented by 29 researcher-facing endpoint labels. It found 111
responses with passing record projections, one retained 2006 Committee
Official Reports upstream availability response, and one retained raw response
without a published record projection. This is operational evidence only. It
does not prove that every approved route/window is captured, reconciled or
current.

DEC-0108 now provides a bounded [assurance report](assurance/GB_SCT_DB1_MIRROR_ASSURANCE_REPORT_2026-08-05.md), [coverage matrix](assurance/GB_SCT_DB1_COVERAGE_AND_ASSURANCE_MATRIX_2026-08-05.md), [gap register](assurance/GB_SCT_DB1_GAP_REGISTER_2026-08-05.md), [update-control record](assurance/GB_SCT_DB1_RECONCILIATION_AND_UPDATE_CONTROL_2026-08-05.md) and [capability contract](assurance/GB_SCT_DB1_BACKEND_CAPABILITY_CONTRACT_2026-08-05.md). Their outcome is `CHANGES_REQUIRED`: internal lineage is sound, but controlled expected scope and complete reconciliation declarations are not yet in place.

## Boundaries

- The [live API catalogue / proxy](../proxy/README.md) is no-retention and
  uses an independent data pipe.
- DB1 preserves dated source responses and their evidence. It performs no
  semantic interpretation or DB2 variable creation.
- DB2 remains a later, independent canonical-variable programme.
- An unavailable upstream response is evidence to retain and surface; it must
  never be silently omitted or translated into a historical conclusion.

## Reading order

1. This overview.
2. [Backend Assurance](BACKEND_ASSURANCE.md) and the
   [DEC-0108 assurance evidence](assurance/README.md).
3. [Research Portal](RESEARCH_PORTAL.md).
4. [Current QA surface](QA_SURFACE.md).
5. Supporting evidence: [coverage](CURRENT_COVERAGE_AND_OPERATIONS.md),
   [availability audit](AVAILABILITY_AUDIT_METHOD.md), and
   [endpoint descriptions](DB1_ENDPOINT_DESCRIPTION_REGISTER.md).
6. Historical delivery records in the
   [DB1 archive](../../archive/workstreams/db1/).

## Next decision

Approve a narrow correction proposal to create the expected DB1 scope and
schedule register, resolve stale target references, and define the first
bounded “as-of” claim. No source request, capture, database mutation, schedule
change or Research Portal implementation is authorised by the audit result.
