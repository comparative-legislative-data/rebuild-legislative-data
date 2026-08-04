# GB-SCT DB1 Party Roles Collection Cohort Result — DEC-0088

**Status:** `PASS — RESTRICTED DEPLOYMENT; OWNER ACCEPTANCE PENDING`
**Date:** 4 August 2026
**Decision:** DEC-0088
**Scope:** Fixed `/api/partyroles` collection only: approved restrictive
handling, initial capture, immediate reconciliation, fixed source-preserving
projection, private paginated reader, and daily timer.

## Result

D9 passed within its contained boundary. It made exactly two authorised
no-query requests to `https://data.parliament.scot/api/partyroles`: an
`INITIAL` capture at 10:09:42 UTC and an immediate `UNCHANGED` check at
10:09:47 UTC. The initial manifest retained a 44,636-byte JSON response. The
fixed `gb_sct_party_roles_d9_v1` release contains 548 source-preserved objects
and zero rejections.

| Control | Result |
| --- | --- |
| Source contract | `GET /api/partyroles`, no query; manual redirect, 30-second, 2 MiB, JSON-array gates. |
| Request count | Exactly two: `INITIAL`, then immediate `UNCHANGED`; no retry or substitute route. |
| Release | `gb_sct_party_roles_d9_v1` — 548 projected objects, 0 rejections, integrity `PASS`. |
| Access | Raw bytes remain restricted; reader has named-release `SELECT`, raw-object `SELECT` and projection writes are denied; anonymous route is denied. |
| Schedule | D9 timer is active/enabled for 04:47 UTC daily; D4A, D4C, D5, D6, D7, and D8 remained active. |

The first deployment invocation stopped before source activity because its
stdin-delivered wrapper could not locate the D8 deployment template. The
wrapper was corrected, committed, and pushed before the successful run. This
was a contained pre-source path error: no database capture, timer, service, or
source request occurred in the stopped invocation.

Two loopback API health probes received connection-refused during the expected
API restart window; bounded readiness then passed without a source retry.

## Private-beta acceptance still required

An eligible private-beta user should hard-refresh, open **DB1 catalogue**,
expand **Parties and government roles**, then open **Party roles collection**.
The user should see two retained releases in that single group, the
retained-DB1/proxy distinction, capture/build/reconciliation provenance,
observed structure, limits denying party membership or role history meaning,
and working fixed pagination. No detail route, parties/member relationship
route, download, generic search/filter, or DB2 claim should appear.

## Boundary and review

This does not establish party membership, role occupancy, party-role history,
field semantics, completeness, freshness, update/deletion detection, licence,
personal-data classification, DB2, or public/research release. It does not
transfer the route-specific handling basis to any other `Notes` route. Review
is required on owner acceptance, D9 failure/change/drift, a proposed access or
projection change, source behaviour change, or before 1 September 2026.

## Related records

- [D9 Party roles cohort — DEC-0088](GB_SCT_DB1_PARTY_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0088.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [Route-level handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
