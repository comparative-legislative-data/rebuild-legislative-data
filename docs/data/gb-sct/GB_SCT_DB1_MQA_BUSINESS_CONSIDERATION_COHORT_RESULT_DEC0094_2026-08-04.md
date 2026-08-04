# GB-SCT DB1 MQA Business Motions — Consideration Result — DEC-0094

**Status:** `PASS — DEC-0094 CLOSED; OWNER ACCEPTED`  
**Date:** 4 August 2026  
**Scope:** Exactly `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`.

## Result

D15 created one fixed, source-preserving DB1 release for the literal
source-defined `motionfilter=consideration` response. The initial capture
preserved 1,461 source objects with zero projection rejections; one immediate
same-route comparison was `UNCHANGED`. This proves only that the two named
requests had compatible raw digest and structural evidence. It does not claim
freshness, completeness, business-motion semantics, bill linkage, stage-vote
status, or analytical classification.

`cld-gb-sct-db1-d15.timer` is active for 06:45 UTC daily, after D14. The
route has its own runner, non-overlap control, raw/manifest/observation/
projection/release lineage, manual redirect handling, no retry, 30-second
timeout, 2 MiB body limit, and JSON-array gate. A later route failure blocks
that route rather than altering any other DB1 cohort or the independent proxy
pipe.

The eligible-user DB1 catalogue shows **MQA business motions · consideration**
in the existing **Motions, questions, related records and votes on motions**
group. It uses fixed server-side pagination and discloses the exact source
filter, release provenance, observed structure, reconciliation state, limits,
and citation guidance. Anonymous access is denied. The owner confirmed that
this interface behaved as expected.

## Boundary and review

This retained response is not a live source relay, raw-object access, a generic
MQA search/filter, a download, a DB2 input, or a research release. It does not
establish a bill or vote series, including any inference about amendments to
bills. Other MQA collections, the `programme` filter, questions, votes, and
official reports remain separate decisions.

Review is required on D15 failure, source/schema change, reconciliation drift,
proposed access/scope change, or by 1 September 2026.

## Related records

- [D15 recommendation](GB_SCT_DB1_NEXT_COHORT_RECOMMENDATION_2026-08-04.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
- [Decision register](../../governance/DECISION_REGISTER.md)
