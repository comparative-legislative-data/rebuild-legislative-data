# GB-SCT DB1 MQA 2026 Annual-Window Cohort — DEC-0096

**Status:** `PROPOSED — OWNER APPROVAL REQUIRED`
**Decision requested:** DEC-0096  
**Date:** 4 August 2026

## Recommendation

Make D17 one compatible two-route annual source-window cohort:

`/api/motionsquestionsanswersquestions?year=2026`  
`/api/votesmotion?year=2026`

Historic reconnaissance observed the Questions 2026 response at roughly 6.5
MiB and Votes on Motions 2026 at roughly 19.4 MiB. Both are fixed source
windows, can be run serially, and use the same source-preserving annual-window
presentation. Pairing them removes artificial micro-staging while retaining
distinct route, budget, raw/manifest, reconciliation, projection, release, and
limitation records.

## Exact contained scope

If approved, D17 would make one initial request and one immediate same-route
comparison for each named URL, serially, then reconcile exactly those two 2026
URLs daily from 07:15 UTC. Questions has a 60-second/8 MiB JSON-array gate;
Votes on Motions has a 90-second/24 MiB JSON-array gate. Both use manual
redirect handling, no retry, no query variation, and one non-overlapping D17
runner. A failure affects only its named route: it does not widen a limit, try
another year, or affect D1–D16.

Each release would preserve raw bytes, manifest, digest, source positions,
reconciliation observations, rejection count, and one named fixed operational
projection. They would appear as **MQA questions · 2026** and **Votes on
motions · 2026** under their existing proxy-aligned subjects, with fixed
server-side pagination and a prominent statement that the year is part of the
source URL, not a CLD query control. No user input, generic year selector,
download, raw-object access, join, DB2 variable, public access, or chart is
included.

## Why this is the next step

D15 and D16 proved two source-defined business-motion filters. D17 tests the
next distinct but bounded retrieval shape: declared annual source windows. It
remains smaller and simpler than annual official reports (roughly 124–150 MiB),
and avoids the unresolved whole-history MQA firehoses. The proposal does not
assert question semantics, chronology, question/answer linkage, member
identity, coverage, or a bill-stage/vote series.

Votes on Motions remain explicitly distinct from votes on amendments to bills.
D17 preserves the source response; it does not establish that a vote relates to
a bill, a bill stage, a financial resolution, or a bill amendment.

## Decision requested

Approve or amend DEC-0096 as the two-route fixed 2026 annual-window cohort.
Approval is required before any source request, database write, code,
deployment, schedule, or interface change.

## Related records

- [D16 result — DEC-0095](GB_SCT_DB1_MQA_BUSINESS_PROGRAMME_COHORT_RESULT_DEC0095_2026-08-04.md)
- [High-volume operational register](../../../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
