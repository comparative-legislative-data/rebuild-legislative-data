# GB-SCT DB1 Formal-Stages Cohort Result — DEC-0083

**Status:** `PASS — RESTRICTED DEPLOYMENT; OWNER ACCEPTED`
**Date:** 3–4 August 2026
**Decision:** DEC-0083  
**Scope:** One named no-query source capture, loss-aware fixed projection, one
private access-plan endpoint, and a separate D5 reconciliation timer.

## Result

D5 created the fixed formal-stages release `gb_sct_formal_stages_d5_v1` from
exactly one authorised initial observation of `/api/billstages`. This is
retained DB1 material, not the live proxy, a Bills dataset, raw-object access,
a general DB1 mirror, generic query, download, canonical dataset, chart, or
research release.

| Route | Retrieved (UTC) | Manifest | SHA-256 | Bytes | Projection | Preserved | Rejections | State |
| --- | --- | --- | --- | ---: | --- | ---: | ---: | --- |
| `gb-sct.bill-stages.collection` | 2026-08-03 21:51:22 | `a9bd87c2-975a-4f50-b6f6-faad16de42cc` | `732c38a145ae161a79b26102ceb148b1f82ef4daa465b6682af3dedebe41b03f` | 137,488 | `gb_sct_formal_stages_d5_v1` (`61ef2ab9-4227-4bd4-9d0b-12b122c4329d`) | 1,754 | 0 | `INITIAL` |

The fixed release is bound to capture run
`db5801d4-56bb-4f92-a9ba-b4b8be943509`; the projection was built at
2026-08-03 21:51:22 UTC. Source response bodies and values are not reproduced
in this record.

## Verification retained

- Local and VPS checks passed: type-check, production build, 23 tests,
  capability checks, documentation-link checks, and reproducible release
  packaging.
- The deployed D5 worker made exactly one no-query request to the authorised
  collection route. No retry, redirect, ID/detail request, pagination,
  substitution, or additional route is recorded.
- The body passed the 20-second, one-mebibyte, JSON content-type, and
  top-level-array gates before immutable raw-byte retention. The projection
  retained 1,754 source objects and recorded zero non-object rejections.
- The dedicated D5 writer has only the stated D5 DB1 permissions. The DB1
  reader may read the named D5 release/reconciliation metadata but cannot read
  raw objects or write projection records. Anonymous access to
  `GET /db1/gb-sct/formal-stages/d5-v1` returns `403`.
- API, web, D4A timer, D4C timer, and D5 timer are all active. D5 is scheduled
  separately for 03:47 UTC. The D5 release is fixed to the `INITIAL` manifest;
  later observations cannot modify it.
- Two initial loopback API-health attempts received connection-refused during
  the expected service restart window. The deployment readiness loop then
  passed, and all service/timer status checks were active. No source retry,
  D4A/D4C interruption, or rollback occurred.

## Private access-plan boundary

Eligible beta users and superusers may access the fixed endpoint
`/db1/gb-sct/formal-stages/d5-v1`. It provides capture/projection provenance,
observed key/type/count structure, limits, and citation guidance. The retained
individual source objects, raw object, download, and generic query are not
exposed. This is the declared DEC-0082 **access-plan-first** treatment for a
medium collection, not a claim that individual records cannot ever be made
available under a later decision.

## Owner front-end acceptance

The owner completed the private-beta acceptance journey and confirmed that the
access-plan presentation behaved as intended. On 4 August the owner also
accepted the corrected unified subject navigation described below. DEC-0083 is
therefore closed within its stated restricted boundary.

On 4 August 2026, owner feedback identified that the D5 access-plan release
had been rendered as a second top-level **Bills and formal stages** group,
alongside the existing Bill Types/Bill Stage Types group. This was a navigation
defect, not a data or access-control defect. The web-only correction merged
them into one group that states `2 fixed projections · 1 access-plan release`.
It changed no capture, raw object, database role, timer, API contract, or
source request. A regression test now checks that the heading is rendered once.

## Boundary and next review

This does not establish stage meaning, Bills linkage, bill outcomes, ordering,
coverage, completeness, freshness, a full Scottish Parliament mirror, DB2
variables, downloads, charts, public access, or a research claim. A D5 drift
or failure, source-condition change, proposed record-access change, projection
refresh, or owner acceptance triggers review. A new capture cohort needs a new
decision.

## Related records

- [D5 cohort — DEC-0083](GB_SCT_DB1_FORMAL_STAGES_COHORT_PROPOSAL_DEC0083.md)
- [D5 handling record](GB_SCT_FORMAL_STAGES_HANDLING_RECORD_DEC0083.md)
- [DB1 access direction — DEC-0082](../../../../workstreams/db1/RESEARCH_ACCESS_DIRECTION.md)
