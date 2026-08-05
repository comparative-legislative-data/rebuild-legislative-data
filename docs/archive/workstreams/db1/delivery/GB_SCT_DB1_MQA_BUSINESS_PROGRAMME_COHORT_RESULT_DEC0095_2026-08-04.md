# GB-SCT DB1 MQA Business Motions — Programme Result — DEC-0095

**Status:** `PASS — DEC-0095 CLOSED; OWNER ACCEPTED`
**Date:** 4 August 2026  
**Scope:** Exactly `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme`.

## Result

D16 created one fixed source-preserving DB1 release for the literal
source-defined `motionfilter=programme` response. The initial capture retained
1,620 source objects with zero projection rejections; an immediate same-route
comparison was `UNCHANGED`. This is evidence for those two named requests only,
not a freshness, completeness, business-motion, bill, stage, vote, amendment,
or analytical-classification claim.

`cld-gb-sct-db1-d16.timer` is active for 07:00 UTC daily. D16 has its own
non-overlap control, raw/manifest/observation/projection/release lineage,
manual-redirect/no-retry transport, 30-second timeout, JSON-array gate, and
the DEC-0095 route-specific 4 MiB ceiling. It does not change D1–D15 limits,
timers, or the independent proxy pipe.

The private DB1 catalogue presents **MQA business motions · programme** within
the existing MQA subject, using fixed server-side pagination and the same
provenance/structure/limitation/citation disclosures. Anonymous access is
denied. The owner confirmed the user journey behaved as expected.

## Boundary and review

The release is not a live source relay, raw-object route, generic filter,
download, DB2 input, or research release. It does not establish a complete
programme-motion series or a relationship to any bill, stage, vote, or
amendment. Questions, votes, official reports, unfiltered MQA forms, and detail
forms remain separate decisions.

Review is required on D16 failure, source/schema change, reconciliation drift,
proposed access/scope change, or by 1 September 2026.

## Related records

- [D16 proposal — DEC-0095](GB_SCT_DB1_MQA_BUSINESS_PROGRAMME_COHORT_PROPOSAL_DEC0095.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
- [Decision register](../../../../governance/DECISION_REGISTER.md)
