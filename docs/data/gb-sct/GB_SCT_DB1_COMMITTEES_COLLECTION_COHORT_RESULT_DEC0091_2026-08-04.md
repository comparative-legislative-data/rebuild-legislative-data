# GB-SCT DB1 Committees Collection Cohort Result — DEC-0091

**Status:** `PASS — RESTRICTED DEPLOYMENT; OWNER ACCEPTED`
**Date:** 4 August 2026  
**Decision:** DEC-0091  
**Scope:** One fixed `/api/committees` collection only; source-preserving
capture/reconciliation, fixed projection/release, private fixed pagination,
and daily D12 service.

## Result

D12 created the fixed retained release `gb_sct_committees_d12_v1`. It is one
named DB1 operational projection, not a live Scottish Parliament response,
raw-object route, committee detail route, membership/assignment record,
status/history claim, general DB1 query, download, canonical dataset, chart,
or research release.

| Initial route state | Manifest | SHA-256 | Bytes | Preserved objects | Rejections |
| --- | --- | --- | ---: | ---: | ---: |
| `INITIAL` | `4097f808-9dc7-461a-8e2e-e52619b8a6bb` | `2eeb11b4dd928979242bb351ce59ff9f8ab79ba833a23b460f61957aa832d114` | 72,080 | 169 | 0 |

The immediate same-route comparison was `UNCHANGED`. This means only that the
declared second request had the same raw digest and compatible structural
signature within its request scope. It does not establish freshness,
completeness, field meaning, membership, bill assignment, date/status meaning,
or cross-route consistency.

The dedicated `cld-gb-sct-db1-d12.timer` is active and enabled for one request
at 06:00 UTC daily. It is independent of D4A–D11 and uses no queued catch-up
or retry.

## Verification retained

- Local production build, 27 tests, fixed-route capability checks,
  documentation links, release packaging, and D12 deployment-script syntax
  passed before target work.
- The first deployment wrapper invocation stopped at its timer-continuity
  preflight because it incorrectly required the not-yet-created D12 timer to
  be active. No source request, database migration, service creation, or
  application deployment occurred. The preflight-only script correction was
  separately reviewed and pushed before retry.
- The successful deployment at revision `5024e27` repeated the full target
  build, test, capability, and package checks; ran the D12 migration; installed
  one D12 writer/service/timer; and made exactly the approved initial and
  immediate fixed-route requests.
- The D12 writer has only the necessary DB1 capture, manifest,
  reconciliation, projection, and `committees_releases` grants. The DB1 reader
  can read the named release/reconciliation metadata but cannot read raw
  objects or write projection records.
- Anonymous access to `GET /db1/gb-sct/committees/d12-v1` returned `403`.
  The API and web services recovered after deployment; two loopback health
  probes received connection refused during the expected API restart window,
  then bounded readiness passed without any source retry.
- D4A–D11 timers remained active. No proxy route, DB2 target, public listener,
  generic DB1 route, download, or shared-host service was added.

## Private-beta acceptance required

An eligible user should hard-refresh, open **DB1 catalogue**, expand
**Committees and committee roles**, and inspect **committees · collection**.
The user should see the Committees collection alongside the separately retained
Committee roles, Committee types, and Committee type links releases; capture,
manifest/digest/byte, build, reconciliation, observed-structure, limitation,
and citation disclosures; and working fixed pagination.

The interface must not imply a committee membership, committee-to-bill
assignment, status/history, validity-date, contact, description, free-text, or
identity claim. It must not show a detail route, join, raw-object route,
download, generic search/filter, DB2 claim, or public-access action.

## Web-only navigation correction

Before owner acceptance, the owner identified that DB1 had drifted from the
proxy's subject taxonomy: an internal **Institutional reference** ingestion
cohort was shown as a top-level user category, while Committee roles appeared
under a different heading. The owner approved a presentation-only correction.

Revision `d1696e7` deployed successfully on 4 August 2026. The active DB1
view now derives its headings from the proxy taxonomy and places all retained
committee releases under **Committees and committee roles**. The release check
passed 27 tests, including a regression test for the shared taxonomy, and the
deployment preflight confirmed the API and D4A–D12 timers before and after the
web restart. No source request, DB1 write, raw object, projection, schedule,
reader API contract, privilege, or access boundary changed.

## Owner acceptance

On 4 August 2026, the owner confirmed that **committees · collection** behaves
as expected in the corrected shared **Committees and committee roles** category.
This accepts the declared private paginated reader, source-preservation and
provenance disclosures, and access-plan limits only. It does not expand D12 to
membership, assignment, contact/description/free-text, date/status, detail,
DB2, download, generic query, public access, or any other route.

## Boundary and review

D12 does not establish a complete Scottish Parliament mirror, current
coverage, update/deletion detection, licence conclusion, source-field
semantics, DB2 input, or public/research release. A later D12 projection
refresh requires its own named build and decision.

Review is required on owner acceptance, D12 failure/change/drift, a proposed
access or projection change, source behaviour change, or before 1 September
2026.

## Related records

- [D12 proposal — DEC-0091](GB_SCT_DB1_COMMITTEES_COLLECTION_COHORT_PROPOSAL_DEC0091.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
- [Master endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Decision register](../../governance/DECISION_REGISTER.md)
