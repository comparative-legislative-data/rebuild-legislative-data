# GB-SCT DB1 Parties Collection Cohort Result — DEC-0089

**Status:** `PASS — RESTRICTED DEPLOYMENT; OWNER ACCEPTANCE PENDING`
**Date:** 4 August 2026
**Decision:** DEC-0089  
**Scope:** Fixed `/api/parties` collection only: approved restrictive handling,
initial capture, immediate reconciliation, fixed source-preserving projection,
private paginated reader, and daily timer.

## Result

D10 passed within its contained boundary. It made exactly two authorised
no-query requests to `https://data.parliament.scot/api/parties`: an `INITIAL`
capture at 10:49:38 UTC and an immediate `UNCHANGED` check at 10:49:42 UTC.
The initial manifest retained a 3,171-byte JSON response. The fixed
`gb_sct_parties_d10_v1` release contains 14 source-preserved objects and zero
rejections.

| Control | Result |
| --- | --- |
| Source contract | `GET /api/parties`, no query; manual redirect, 30-second, 2 MiB, JSON-array gates. |
| Request count | Exactly two: `INITIAL`, then immediate `UNCHANGED`; no retry or substitute route. |
| Release | `gb_sct_parties_d10_v1` — 14 projected objects, 0 rejections, integrity `PASS`. |
| Access | Raw bytes remain restricted; reader has named-release `SELECT`, raw-object `SELECT` and projection writes are denied; anonymous route is denied. |
| Schedule | D10 timer is active/enabled for 05:02 UTC daily; D4A, D4C, D5, D6, D7, D8, and D9 remained active. |

The first invocation stopped before any change or source activity because the
SSH command did not enter the configured passwordless root context. The second
stopped before source activity because the release archive omitted D10's named
migration script; the pre-source rollback ran. The package allow-list was
corrected and its contents verified locally before the successful deployment.

Two loopback API health probes received connection-refused during the expected
API restart window; bounded readiness then passed without a source retry.

## Private-beta acceptance still required

An eligible private-beta user should hard-refresh, open **DB1 catalogue**,
expand **Parties and government roles**, then open **Parties collection**. The
user should see three retained releases in that single group, the retained-DB1/
proxy distinction, capture/build/reconciliation provenance, observed structure,
limits denying party affiliation, validity, continuity, and history meaning,
and working fixed pagination. No Party detail, Member party, Member party-role,
download, generic search/filter, or DB2 claim should appear.

## Boundary and review

This does not establish party affiliation, party validity meaning, party
continuity, party history, field semantics, completeness, freshness,
update/deletion detection, licence, personal-data classification, DB2, or
public/research release. It does not transfer the route-specific handling basis
to any other `Notes`, date, party, or relationship route. Review is required on
owner acceptance, D10 failure/change/drift, a proposed access or projection
change, source behaviour change, or before 1 September 2026.

## Related records

- [D10 Parties cohort — DEC-0089](GB_SCT_DB1_PARTIES_COLLECTION_COHORT_PROPOSAL_DEC0089.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [Route-level handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
