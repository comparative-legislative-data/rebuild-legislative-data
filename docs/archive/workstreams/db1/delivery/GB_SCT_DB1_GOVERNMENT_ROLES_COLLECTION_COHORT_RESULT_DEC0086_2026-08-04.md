# GB-SCT DB1 Government Roles Collection Cohort Result — DEC-0086

**Status:** `PASS — DEC-0086 CLOSED; OWNER ACCEPTED`
**Date:** 4 August 2026
**Decision:** DEC-0086
**Scope:** The fixed `/api/governmentroles` collection only: its approved
route-specific restrictive handling, initial capture, immediate reconciliation,
fixed source-preserving projection, private fixed-pagination reader, and daily
worker.

## Result

DEC-0086 passed within its contained boundary. The D7 worker made exactly two
authorised no-query requests to `https://data.parliament.scot/api/governmentroles`:
an initial capture at 09:30:44 UTC and an immediate check at 09:30:48 UTC. The
second completed comparison was `UNCHANGED`. No retry, redirect, detail
request, relationship-route request, proxy reuse, or additional source route
was used.

| Route | Initial capture (UTC) | Immediate check (UTC) | Bytes each | States | Fixed release | Preserved | Rejected |
| --- | --- | --- | ---: | --- | --- | ---: | ---: |
| `gb-sct.government-roles.collection` (`/api/governmentroles`) | 2026-08-04 09:30:44 | 2026-08-04 09:30:48 | 19,993 | `INITIAL`, `UNCHANGED` | `gb_sct_government_roles_d7_v1` | 251 | 0 |

The captured bytes are held only in the isolated DB1 raw archive. This result
does not reproduce source response content, `Notes` values, or raw-object
locations. The release is a source-preserving operational projection with
manifest lineage—not a live proxy response, source endorsement, complete
mirror, canonical dataset, role-history dataset, ministerial-occupancy record,
DB2 variable set, download, chart, or research release.

## Controls and verification retained

- The D7 worker is a separate DB1 pipe: it calls only the fixed Scottish
  Parliament collection URL, never the proxy, browser relay, or user URL.
- One 30-second no-retry request, manual redirects, a 2 MiB ceiling, JSON
  content type, and a top-level array were enforced for each source request.
- Raw SHA-256 and observed structural signatures were compared within the
  fixed route/window. `UNCHANGED` has only that scoped meaning.
- Local and VPS checks passed: type-check, production build, 26 tests,
  documentation links, capability scans, release packaging, migration,
  dedicated writer permissions, raw-object reader denial, anonymous endpoint
  denial, API/web health, and existing D4A/D4C/D5/D6 timer continuity.
- The reader can select D7 release/reconciliation metadata and cannot select
  raw objects or write projection records. The authenticated route is
  `GET /db1/gb-sct/government-roles/d7-v1`, with fixed `offset` and `limit`
  (1–50) only. It has no generic query, filter, download, raw-object, or
  detail interface.
- The independent `cld-gb-sct-db1-d7.timer` is active and enabled for 04:17
  UTC daily. The displayed release remains bound to the initial manifest.
- Two loopback API probes received connection-refused during the expected
  service restart window. The readiness loop then passed; no source retry,
  timer interruption, or rollback occurred.

## Private-beta acceptance

On 4 August 2026, the owner confirmed that the defined private-beta journey
behaved as expected: **DB1 catalogue** → **Parties and government roles** →
**Government roles collection**. This accepted the retained-DB1/proxy
distinction, capture/build/reconciliation provenance, observed structure,
limits that deny role-history or ministerial-occupancy meaning, and the first
20 preserved records with working **Next page** and **Previous page** controls.
Source position remains visibly technical lineage rather than a substantive
variable. No detail route, person/relationship route, download, generic
search/filter, or DB2 claim was accepted or introduced.

## Boundary and review

This does not establish the meaning of Government role names, `Notes`, source
identifiers, completeness, historical coverage, ministerial occupancy, update/
deletion detection, source licence conditions, personal-data classification,
DB2, or public/research release. The route-specific private handling basis does
not transfer to any other `Notes`-bearing route. Review is required on D7
failure/change/drift, proposed projection refresh/access expansion, source
behaviour change, or before 1 September 2026.

## Related records

- [D7 Government roles cohort — DEC-0086](GB_SCT_DB1_GOVERNMENT_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0086.md)
- [DB1 access direction — DEC-0082](../../../../workstreams/db1/RESEARCH_ACCESS_DIRECTION.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
