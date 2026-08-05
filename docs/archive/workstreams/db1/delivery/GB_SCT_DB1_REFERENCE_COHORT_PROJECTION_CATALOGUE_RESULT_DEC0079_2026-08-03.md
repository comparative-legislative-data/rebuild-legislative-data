# GB-SCT DB1 Reference-Cohort Projection and Catalogue Result — DEC-0079

**Status:** `PASS — OWNER ACCEPTED`
**Date:** 3 August 2026  
**Decision:** DEC-0079  
**Scope:** Three named retained D4A manifests; three fixed DB1 loss-aware
projections; one private beta/superuser catalogue route and grouped interface.

## Result

D4B created the fixed catalogue release `gb_sct_reference_cohort_d4a_v1` from
only the authorised retained inputs. The catalogue is deployed on the existing
private application. It makes no upstream source request at viewing time and
does not alter the D4A daily reconciliation timer.

| Projection | Manifest | Preserved records | Rejections |
| --- | --- | ---: | ---: |
| `gb_sct_bill_types_d4a_v1` | `6a414dbf-973a-4aa5-9aae-b217fc18c1e3` | 7 | 0 |
| `gb_sct_bill_stage_types_d4a_v1` | `2315af79-5903-4540-904c-0eb3f95e99c4` | 34 | 0 |
| `gb_sct_sessions_d4a_v1` | `e94719fb-f686-48ce-b652-d22f3b532ac3` | 6 | 0 |

The sole new read contract is `GET /db1/gb-sct/reference-cohort/d4a-v1`.
It is restricted to active `BETA_USER` and `SUPERUSER` accounts. It is a
retained fixed baseline, not a live proxy, raw-object route, general DB1 query,
download, canonical dataset, chart, or research release.

## Verification retained

- Revision `ac2c9f4` passed local type-check/build, 22 tests, capability scans,
  documentation-link checks, and reproducible package build.
- The initial deployment built the projections successfully, then rolled the
  application revision back when its immediate health check ran before the API
  had begun listening. No source action occurred. Existing API/web services and
  the D4A timer were confirmed active after rollback.
- Revision `e862670` corrected only that readiness check and rendered the
  release environment value without corrupting its variable name. It repeated
  the local verification on the VPS, reused the already-fixed catalogue release,
  and deployed successfully.
- API, web, and D4A timer services are active. The API unit runs revision
  `e862670fc54c5fc1f08abe95c178181581ad03a4-845fc9beeea8`.
- Anonymous D3 and D4B calls both return `403`.
- The DB1 reader can select `catalogue_releases` and
  `reconciliation_observations`; it cannot select `raw_objects` or insert into
  `projection_records`.

No raw response body, secret, account value, or source content is retained in
this result record.

## Owner front-end acceptance

An eligible beta user confirmed that the deployed **DB1 catalogue** screen:

1. it appears after sign-in and loads the three fixed panels;
2. the two grouped headings and expandable endpoint badges are usable;
3. each panel visibly distinguishes retained fixed baseline from the live
   upstream proxy and presents provenance, observed structure, limits,
   citation, and preserved records; and
4. a guest or anonymous user cannot access it.

The existing D3 route remains present but is not the new catalogue navigation
surface. The D4A timer continues as a separate reconciliation service; later
observations do not mutate these displayed records.

## Boundary and what this does not establish

This result does not establish complete Scottish Parliament coverage, source
freshness, a general DB1 mirror, codebook semantics, DB2 variables, downloads,
charts, public access, or a research claim. A later projection refresh needs a
separate named build and decision.

## Next review

DEC-0079 is closed within this narrow scope. Any DB1 expansion requires a new
proposal.
