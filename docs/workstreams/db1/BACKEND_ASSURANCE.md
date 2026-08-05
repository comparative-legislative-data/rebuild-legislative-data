# DB1 Backend Assurance

**Status:** Planned active workstream — this repository reset authorises no
backend audit, remediation, source request, database mutation or schedule
change.

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

## Existing evidence to assess

- [Coverage snapshot](CURRENT_COVERAGE_AND_OPERATIONS.md).
- [Availability-audit method](AVAILABILITY_AUDIT_METHOD.md).
- [Endpoint description register](DB1_ENDPOINT_DESCRIPTION_REGISTER.md).
- [Master endpoint delivery matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md).
- [Update-signal reconnaissance](../../data/gb-sct/GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md).

## Known assurance gaps at reset

- The 113-release/29-endpoint observation is not proof of complete approved
  DB1 coverage.
- Reconciliation is uneven: Official Reports has a broader-cadence decision
  outstanding; other route families need one auditable schedule matrix.
- Current all-years output is an access manifest, not an original-source
  archive or researcher download format.
- Generic original-archive, JSONL, CSV and Parquet capabilities are not yet
  established and must not be implied by the QA surface.
- A plural-party taxonomy defect shows endpoint classification needs an
  auditable backend contract and regression evidence.

## Exit gate

Backend Assurance is complete only when the owner accepts the assurance report,
coverage matrix, gap register and capability contract. Only then may a
Research Portal implementation proposal be considered.
