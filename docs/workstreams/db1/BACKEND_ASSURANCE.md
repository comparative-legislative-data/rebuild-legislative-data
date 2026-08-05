# DB1 Backend Assurance

**Status:** DEC-0108 metadata audit completed — `CHANGES_REQUIRED`.

The [assurance evidence](assurance/README.md) confirms a sound current
registry-to-object lineage, but it does not establish controlled expected scope
or complete route/window reconciliation. No remediation, source request,
database mutation, schedule change, portal implementation or deployment is
authorised by this result.

## Purpose

Backend Assurance determines whether DB1 is a defensible, source-preserving
mirror of its stated Scottish Parliament API scope. It is independent of the
current QA interface and must be completed before Research Portal delivery.

The assurance claim is deliberately bounded:

> For each named approved source route and window, DB1 records the retained
> source response and its capture/reconciliation evidence as of a stated time,
> including every known exception, failure and unresolved gap.

It is not a claim that the Scottish Parliament API is globally complete,
unchanging, or semantically correct.

## Completion questions

| Assurance area | Required evidence | Completion test |
| --- | --- | --- |
| Scope | Controlled inventory of every approved DB1 route and expected source window. | No route/window is omitted, duplicated, or silently added. |
| Retention | Raw bytes, manifest, hash, content metadata and source-request lineage. | Each retained release resolves to its immutable source object and manifest. |
| PostgreSQL metadata | Route, capture, raw-object, projection and reconciliation links. | Metadata reconstructs retained-object lineage without relying on a UI. |
| Coverage | Expected versus retained route/window matrix. | Every expected item has an explicit condition: retained, upstream unavailable, failed, pending, unscheduled or out of scope. |
| Reconciliation | Declared comparison method, last result and next due run. | A bounded “as-of” statement can be generated without extrapolation. |
| Update control | Route-specific schedule and failure/retry treatment. | New/changed source material cannot be silently missed within the stated schedule. |
| Exceptions | Preserved availability/error responses and unresolved projections. | Gaps, including 2006 Committee Official Reports, are visible first-class states. |
| Capability contract | Machine-readable record of reader/download/format capabilities. | The future portal cannot offer an action the backend does not provide. |

## Required outputs

1. **Coverage and assurance matrix** — one controlled row per approved route
   and, where applicable, source year/window.
2. **Mirror Assurance Report** — versioned, dated report distinguishing
   evidence from claims and listing limitations.
3. **Reconciliation specification** — source-specific schedule, comparison,
   retry, change-handling and retained evidence.
4. **Backend capability contract** — declared facilities such as original JSON,
   retained-year archive, access formats, record preview, field guide, citation
   and source exception.
5. **Gap register** — every unavailable, failed, pending or excluded item,
   with route/window, reason, observed date and review trigger.

## Assurance evidence

- [DEC-0108 assurance report](assurance/GB_SCT_DB1_MIRROR_ASSURANCE_REPORT_2026-08-05.md).
- [Coverage and assurance matrix](assurance/GB_SCT_DB1_COVERAGE_AND_ASSURANCE_MATRIX_2026-08-05.md).
- [Gap register](assurance/GB_SCT_DB1_GAP_REGISTER_2026-08-05.md).
- [Reconciliation/update-control record](assurance/GB_SCT_DB1_RECONCILIATION_AND_UPDATE_CONTROL_2026-08-05.md).
- [Backend capability contract](assurance/GB_SCT_DB1_BACKEND_CAPABILITY_CONTRACT_2026-08-05.md).

## Current assurance gaps

- The [expected scope](assurance/GB_SCT_DB1_EXPECTED_SCOPE_REGISTER_2026-08-05.md)
  and [route/window update-control](assurance/GB_SCT_DB1_ROUTE_WINDOW_UPDATE_CONTROL_REGISTER_2026-08-05.md)
  registers now classify all selected forms and retained windows. Their
  baseline-only labels do not establish currentness.
- Official Reports needs a declared wider cadence beyond the separately
  scheduled 2025 pair before any currentness claim.
- Generic original-archive, JSONL, CSV and Parquet capabilities remain absent.
- Fresh raw-byte integrity and live parity require distinct approvals.
- Future operational commands must identify both the isolated cluster and the
  DB1 database explicitly; the DEC-0108 target ambiguity was resolved without
  finding a stale deployment database selector.

## Exit gate

Backend Assurance can move to acceptance only after the gap register is
resolved or consciously bounded by owner decision. Only then may a Research
Portal implementation proposal be considered.
