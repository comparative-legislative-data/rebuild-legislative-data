# GB-SCT DB1 MQA Event Subtypes Collection Cohort Result — DEC-0093

**Status:** `PASS — DEC-0093 CLOSED; OWNER ACCEPTED`  
**Date:** 4 August 2026  
**Scope:** Exactly `/api/motionsquestionsanswerseventsubtypes`.

## Result

D14 created one fixed, source-preserving DB1 release from the named no-query
route. It retained 18 source objects with zero projection rejections. The
initial capture was followed by one immediate same-route `UNCHANGED`
comparison. This is comparison evidence for those two bounded requests, not a
freshness, completeness, taxonomy, or text-semantics claim.

`cld-gb-sct-db1-d14.timer` is active for 06:30 UTC daily, after D13. Its
runner is route-specific, non-overlapping, manual-redirect, no-retry,
30-second, 2 MiB, JSON-array-only, and fails closed. It has independent
raw/manifest/observation/projection/release lineage and does not use the proxy
pipe.

The private DB1 catalogue presents **MQA event subtypes · collection** under
**Motions, questions, related records and votes on motions**, with fixed
server-side pagination and provenance/structure/limitation/citation
disclosures. Anonymous access is denied. The owner confirmed that this journey
behaved as expected.

## Boundary and review

The source-supplied `IntroText` remains retained material only. This cohort
does not interpret an event subtype, classify or search text, establish event
meaning, add a detail route, join, download, generic DB1 query, DB2 variable,
public access, chart, or research release.

Review is required on a D14 failure, source/schema change, reconciliation
drift, proposed access/scope change, or by 1 September 2026.

## Related records

- [D14 record — DEC-0093](GB_SCT_DB1_MQA_EVENT_SUBTYPES_COLLECTION_COHORT_DEC0093.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
- [Decision register](../../../../governance/DECISION_REGISTER.md)
