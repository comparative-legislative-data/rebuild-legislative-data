# GB-SCT DB1 annual-window expansion — DEC-0097

**Status:** `PROPOSED — OWNER APPROVAL REQUIRED`

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
is one serial runner with per-route gates inherited only where they match the
existing D17 annual shape: Questions 8 MiB/60 seconds; Votes 24 MiB/90 seconds.
It stops only the affected route on failure, retains the failure record, and
does not vary the year or retry a source request.

Initial backfill would make one request per URL. A same-run immediate comparison
would then establish a bounded baseline for each successful route. After that,
2026 continues daily; historical windows would be rechecked weekly, serially,
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
