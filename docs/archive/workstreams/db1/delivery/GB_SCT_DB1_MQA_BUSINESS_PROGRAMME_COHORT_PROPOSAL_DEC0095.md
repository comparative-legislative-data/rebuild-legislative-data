# GB-SCT DB1 MQA Business Motions — Programme Cohort — DEC-0095

**Status:** Historical proposal — implemented and accepted as DEC-0095.
**Decision requested:** DEC-0095  
**Date:** 4 August 2026

## Recommendation

Make D16 one fixed source-defined collection:

`/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme`

This is the next practical DB1 cohort. It keeps the existing MQA subject and
the same source-preserving, fixed-pagination access pattern while extending it
to the only other known fixed business-motion filter. Historic reconnaissance
observed a complete response of roughly 3.6 MiB, so D16 deliberately requests
a **route-specific 4 MiB body ceiling**. It does not change the existing 2 MiB
limit for any other cohort.

## Exact contained scope

If approved, D16 would make one initial request and one immediate same-route
comparison only, then reconcile the same literal URL daily at 07:00 UTC. Its
transport would be manual redirect, no retry, 30 seconds, JSON content type,
top-level array, route-specific 4 MiB maximum, one serial non-overlapping
runner, and no query variation. A larger response, timeout, redirect,
non-array response, source error, or drift gate failure would be recorded as a
D16 stop; it would not increase the ceiling, fall back to another route, or
affect D1–D15.

The release would retain raw bytes, manifest, digest, source positions,
reconciliation observations, rejection count, and one named fixed operational
projection. It would appear only as **MQA business motions · programme** under
the existing MQA subject, with provenance-first fixed server-side pagination.
It would add no generic filtering, query, raw-object access, download, DB2,
public access, semantic codebook, join, or chart.

## Why this is proportionate

The accepted D15 release has already demonstrated the medium-volume
source-preserving reader and its user-facing pagination/provenance pattern.
D16 therefore tests one deliberately bounded response-budget change without
combining it with a new source family, year catalogue, streaming architecture,
or analytical interpretation. It remains materially smaller and simpler than
annual questions, votes, or official reports.

## Explicit exclusions

This proposal does not interpret a programme motion, connect it to a bill,
stage, vote, amendment, member, committee, or time period, or imply that it is
complete. Unfiltered MQA collections, questions by year, votes on motions,
official reports, detail forms, document material, DB2 variables, generic
access/download, public release, and all shared-host changes remain excluded.

## Decision requested

The owner approved and accepted DEC-0095 on 4 August 2026. Its
[result](GB_SCT_DB1_MQA_BUSINESS_PROGRAMME_COHORT_RESULT_DEC0095_2026-08-04.md)
records the 1,620-object/zero-rejection release, immediate `UNCHANGED`
comparison, active 07:00 UTC timer, and successful private-beta acceptance.
The next proposed decision is [DEC-0096](GB_SCT_DB1_MQA_QUESTIONS_2026_COHORT_PROPOSAL_DEC0096.md).

## Related records

- [D15 result — DEC-0094](GB_SCT_DB1_MQA_BUSINESS_CONSIDERATION_COHORT_RESULT_DEC0094_2026-08-04.md)
- [High-volume operational register](../../../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
