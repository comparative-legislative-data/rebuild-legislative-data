# GB-SCT DB1 Committee Roles Collection Cohort Result — DEC-0087

**Status:** `PASS — DEC-0087 CLOSED; OWNER ACCEPTED`
**Date:** 4 August 2026
**Decision:** DEC-0087
**Scope:** The fixed `/api/committeeroles` collection only: its approved
route-specific restrictive handling, initial capture, immediate reconciliation,
fixed source-preserving projection, private paginated reader, and daily timer.

## Result

DEC-0087 passed within its contained boundary. The D8 worker made exactly two
authorised no-query requests to `https://data.parliament.scot/api/committeeroles`:
an initial capture at 09:50:26 UTC and an immediate check at 09:50:30 UTC. The
second result was `UNCHANGED` for that completed same-route comparison.

The initial manifest retained a 350-byte JSON response. Its named fixed
release, `gb_sct_committee_roles_d8_v1`, contains eight source-preserved
objects and zero rejections. This is not a source-completeness, freshness,
taxonomy-semantics, committee-membership, or committee-history claim.

| Control | Result |
| --- | --- |
| Exact source contract | `GET /api/committeeroles`, no query; manual redirect, 30-second, 2 MiB, JSON-array gates. |
| Request count | Exactly two: `INITIAL`, then immediate `UNCHANGED`; no retry or substitute route. |
| Fixed release | `gb_sct_committee_roles_d8_v1` — 8 projected objects, 0 rejected objects, integrity `PASS`. |
| Data handling | Raw bytes/manifest remain restricted; private projection preserves complete source objects and source position plus operational lineage only. |
| Reader boundary | Reader has named-release `SELECT`; raw-object `SELECT` and projection-record writes are denied. Anonymous reader route is denied. |
| Schedule | `cld-gb-sct-db1-d8.timer` is active/enabled for 04:32 UTC daily. |
| Existing cohort continuity | D4A, D4C, D5, D6, and D7 timers remained active. |

## Deployment checks

The VPS-pinned runtime completed the D8 build, 27 tests, fixed-route/capability
scans, deterministic package, migration, isolated reader/writer checks,
anonymous-route denial, service readiness, and timer activation. Two loopback
API health probes received connection-refused during the expected API restart
window; the bounded readiness check then passed. This did not add a source
request, alter the source contract, or interrupt the D8 timer.

## Private-beta acceptance

On 4 August 2026, the owner confirmed that the defined private-beta journey
behaved as expected: **DB1 catalogue** → **Committees and committee roles** →
**Committee roles collection**. This accepted the retained-DB1/proxy
distinction, capture/build/reconciliation provenance, observed structure,
limits denying committee-membership or history meaning, and all eight
preserved records. Disabled paging is expected because the fixed 20-record
page contains the whole accepted release. Source position remains visibly
technical lineage rather than a substantive variable. No detail route,
committee/member relationship route, download, generic search/filter, or DB2
claim was accepted or introduced.

## Boundary and review

This does not establish the meaning of Committee role names, `Notes`, source
identifiers, completeness, historical coverage, committee membership, update/
deletion detection, source licence conditions, personal-data classification,
DB2, or public/research release. The route-specific private handling basis does
not transfer to any other `Notes`-bearing route. Review is required on D8
failure/change/drift, proposed projection refresh/access expansion, source
behaviour change, or before 1 September 2026.

## Related records

- [D8 Committee roles cohort — DEC-0087](GB_SCT_DB1_COMMITTEE_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0087.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
