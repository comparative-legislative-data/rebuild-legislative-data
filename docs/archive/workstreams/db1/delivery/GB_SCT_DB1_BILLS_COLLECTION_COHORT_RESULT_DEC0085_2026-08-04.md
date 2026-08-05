# GB-SCT DB1 Bills Collection Cohort Result — DEC-0085

**Status:** `PASS — RESTRICTED DEPLOYMENT; OWNER ACCEPTED`
**Date:** 4 August 2026
**Decision:** DEC-0085
**Scope:** The fixed `/api/bills` collection only: initial capture, one
immediate reconciliation, fixed source-preserving projection, private
fixed-pagination access, and an independent daily worker.

## Result

DEC-0085 passed within its contained boundary. The D6 worker made exactly two
authorised no-query requests to `https://data.parliament.scot/api/bills`: an
initial capture at 09:07:18 UTC and an immediate check at 09:07:22 UTC. The
second completed comparison was `UNCHANGED`. No retry, redirect, detail
request, source substitution, proxy reuse, or additional source route was
used.

| Route | Initial capture (UTC) | Immediate check (UTC) | Bytes each | States | Fixed release | Preserved | Rejected |
| --- | --- | --- | ---: | --- | --- | ---: | ---: |
| `gb-sct.bills.collection` (`/api/bills`) | 2026-08-04 09:07:18 | 2026-08-04 09:07:22 | 99,823 | `INITIAL`, `UNCHANGED` | `gb_sct_bills_collection_d6_v1` | 473 | 0 |

The captured bytes are held only in the isolated DB1 raw archive. This result
does not reproduce a source response, source values, or raw-object location.
The named release is a source-preserving operational projection with manifest
lineage, not a live proxy response, source endorsement, complete mirror,
canonical dataset, DB2 variable set, download, chart, or research release.

## Controls and verification retained

- The source worker is a separate DB1 pipe: it calls the fixed Scottish
  Parliament URL directly and does not invoke the browser relay, proxy route,
  or user-provided URL.
- The client permits one 30-second request, manual redirect handling, a 2 MiB
  body ceiling, JSON content type, and top-level array only. It does not retry.
- Raw SHA-256 and observed structural signatures were compared for the same
  route/window. `UNCHANGED` means only that the two completed requests did not
  differ under that controlled comparison; it is not a general freshness,
  completeness, or deletion claim.
- Local and VPS release checks passed: TypeScript, production build, 25 unit
  tests, route/capability scans, documentation links, release packaging,
  migration, dedicated writer permissions, raw-object reader denial,
  anonymous endpoint denial, API/web health, and existing D4A/D4C/D5 timer
  continuity.
- The DB1 reader can select the D6 release/reconciliation metadata and cannot
  select raw objects or write projection records. The authenticated route is
  `GET /db1/gb-sct/bills/d6-v1`, with fixed `offset` and `limit` (1–50) only.
  It has no generic query, filter, download, raw-object, or detail interface.
- The independent `cld-gb-sct-db1-d6.timer` is active and enabled for 04:02
  UTC daily. The release stays bound to the `INITIAL` manifest; a later timer
  observation cannot silently change the displayed release.
- Two loopback API probes received connection-refused during the expected
  service-restart window. The scripted readiness loop then passed; this caused
  no source retry, worker change, timer interruption, or rollback.

## Owner private-beta acceptance

The owner completed this journey and confirmed that it behaved as expected:
the single **Bills and formal stages** group, retained DB1 distinction,
provenance, first page, and Next/Previous pagination. DEC-0085 is therefore
closed within its stated boundary. No detail route, download, generic
search/filter, or DB2 claim was introduced.

## Boundary and review

The Bills detail route remains blocked. This result makes no claim about
Bill-field semantics, identifiers, stage/outcome linkage, completeness,
historical coverage, update/deletion detection, source licence conditions,
personal-data treatment beyond the approved restrictive handling basis, DB2,
or public/research release. Review is required on owner acceptance, a D6
failure/change/drift event, proposed projection refresh, any access expansion,
source behaviour change, or before 1 September 2026.

## Related records

- [D6 Bills collection cohort — DEC-0085](GB_SCT_DB1_BILLS_COLLECTION_COHORT_PROPOSAL_DEC0085.md)
- [Bills restricted collection handling — DEC-0084](GB_SCT_BILLS_RESTRICTED_COLLECTION_HANDLING_DEC0084.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
