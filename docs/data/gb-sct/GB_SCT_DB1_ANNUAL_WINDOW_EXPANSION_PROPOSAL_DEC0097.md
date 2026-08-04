# GB-SCT DB1 annual-window expansion — DEC-0097

**Status:** `APPROVED AND IMPLEMENTED — 2026-08-04`

## Recommendation

Replace one-year-at-a-time implementation with a controlled annual-window
registry and one serial historical expansion batch. The registry would hold
literal approved source URLs, year, route family, byte/time limit, and release
identifier; it would not expose a user year parameter or a generic API.

The first expansion would cover 2011–2025 for both annual source families:

- `/api/motionsquestionsanswersquestions?year=YYYY`
- `/api/votesmotion?year=YYYY`

This is 30 fixed source windows in one delivery package. Votes begin at 2011:
the previously observed 2010 form failed, so this proposal makes no earlier
Votes coverage claim. Questions earlier than 2011 are not included yet; that
remains a separate coverage decision rather than an assumption.

## Delivery and update model

Each literal URL retains separate raw bytes, manifest, digest, source positions,
reconciliation state, projection, release, and limitation. The implementation
is one serial runner with per-route gates sized from the completed source
capture: Questions 32 MiB/90 seconds; Votes 48 MiB/120 seconds.
It stops only the affected route on failure and retains the failure record.
It does not vary the year; an approved route-specific rerun is limited to a
previously failed capture.

Initial backfill makes one request per URL. The retained initial captures are
the historical baseline; an immediate comparison is not claimed for D18.
2026 continues daily; historical windows are rechecked weekly, serially,
so DB1 can detect late correction without pretending that old sessions never
change. No one-year implementation or user approval loop is required.

## Exclusions

No semantic question/answer, motion, vote, bill, bill-stage, financial
resolution, or bill-amendment assertion; generic filter; raw-object route;
download; DB2; public access; or new official-report route is included.

## Decision requested

Approve DEC-0097 as the 2011–2025 two-family annual-window expansion and its
registry-based implementation. Approval is required before source requests,
database writes, code, deployment, scheduling, or interface changes.

## Implementation record

**Post-implementation correction (4 August 2026):** the deployed D18 timer
retries source-years that do not yet have a successful observation; it does not
re-fetch successful historical releases. Accordingly, the earlier proposed
weekly-recheck wording records the intended model, not current recurring
comparison behaviour. See the [D18 result correction](GB_SCT_DB1_ANNUAL_WINDOW_EXPANSION_RESULT_DEC0097_2026-08-04.md#correction-recorded-4-august-2026).

Owner approval was recorded before capture. All 30 fixed source-year releases
were captured and projected on 2026-08-04 with zero projection rejections.
The private DB1 catalogue exposes them only through a closed, fixed-path
registry, grouped as 2011–2025 annual MQA Questions and Votes on motions
releases. The weekly D18 failure-retry timer is enabled for Sundays at 07:30
UTC. See
[the D18 result record](GB_SCT_DB1_ANNUAL_WINDOW_EXPANSION_RESULT_DEC0097_2026-08-04.md)
for the release counts and remaining limitation.
