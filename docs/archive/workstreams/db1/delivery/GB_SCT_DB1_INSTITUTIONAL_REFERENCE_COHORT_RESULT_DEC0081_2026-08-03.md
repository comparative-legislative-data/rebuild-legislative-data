# GB-SCT DB1 Institutional-Reference Cohort Result — DEC-0081

**Status:** `PASS — OWNER ACCEPTED`
**Date:** 3 August 2026
**Decision:** DEC-0081  
**Scope:** Four named no-query source captures, loss-aware fixed projections,
one private catalogue route, and a separate D4C reconciliation timer.

## Result

D4C created the fixed institutional-reference release
`gb_sct_institutional_reference_d4c_v1` from exactly the four authorised
initial source observations. The deployed catalogue is retained DB1 material,
not a live proxy, raw-object route, general DB1 query, download, canonical
dataset, chart, or research release.

| Route | Manifest | SHA-256 | Bytes | Projection | Preserved | Rejections |
| --- | --- | --- | ---: | --- | ---: | ---: |
| `gb-sct.constituencies.collection` | `1ed9cb48-543d-4734-9bd1-0e9047b2aa4d` | `d4a1b1e43a487394ec6c633bd2560016a4dee62cc240e1f3a015bba133297757` | 38,827 | `gb_sct_constituencies_d4c_v1` | 223 | 0 |
| `gb-sct.regions.collection` | `7737e3e6-e074-4ac0-b203-3f95902ebb11` | `c31f6e2320821da413d2519b2c0c3ed4ef82f381972fb5714ee35d42ee1a2d02` | 3,543 | `gb_sct_regions_d4c_v1` | 29 | 0 |
| `gb-sct.committee-types.collection` | `211ac2d8-5821-4e88-8182-f83875d38ab1` | `a4b4227079e0c87be71259637c70745b28ddd040238ce827c1de395900f0b2f8` | 78 | `gb_sct_committee_types_d4c_v1` | 3 | 0 |
| `gb-sct.committee-type-links.collection` | `447a01f7-299e-411e-a04a-a8e8c51b423a` | `60b0d483a0689798bd81bad90b5b2aab312290f2efc15c50ff1b3a224c605a95` | 6,721 | `gb_sct_committee_type_links_d4c_v1` | 168 | 0 |

All four observations belong to one D4C cycle
`c91dd784-ddb4-4329-b79a-f59c5cf4f85a` with state `INITIAL`. Their projection
integrity states are `PASS`. The source response bodies and values are not
reproduced in this result record.

## Verification retained

- The initial implementation revision `17d5c00` passed local type-check/build,
  23 tests, capability scans, and reproducible package build. Each deployment
  attempt, including final deployed revision `ceb4dd7`, independently ran the
  same verification on the VPS before deployment.
- Three early deployment attempts stopped before any D4C source request:
  first, the new worker directory was not rendered; second, its environment
  variable name was rendered incorrectly; third, the new writer lacked
  database `CONNECT`. Each rollback restored the API/web units, left D4A
  active, and left no D4C reconciliation observation. The final contained
  correction granted only the D4C writer's access to its own DB1 database.
- The final worker made exactly the four authorised initial route requests.
  No query form, retry, extra route, or data-pipe coupling is recorded.
- API, web, D4A timer, and D4C timer are active. D4C runs at 03:32 UTC; D4A
  remains independently active at its existing schedule.
- `GET /db1/gb-sct/institutional-reference/d4c-v1` returns `403` anonymously.
  The DB1 reader can select only the new release/reconciliation metadata it
  needs; it cannot select `raw_objects` or insert projection records.
- The displayed named release is fixed to the four `INITIAL` manifests above.
  Later D4C observations may show reconciliation state but cannot modify it.

## Owner front-end acceptance

The project owner confirmed that the four-panel **Institutional reference**
catalogue works as expected and accepted the revised record presentation. Each
panel leads with retained baseline, route, manifest/digest/byte/content-type,
projection counts, observed structure, limits and citation guidance. Preserved
records are available through one secondary **Browse retained records**
disclosure; individual source positions are retained inside record provenance,
not presented as the primary interface or a substantive ordering.

This is the accepted small-collection implementation under the DB1
[retained-data access direction — DEC-0082](../../../../workstreams/db1/RESEARCH_ACCESS_DIRECTION.md).

## Boundary and next review

This does not establish complete Scottish Parliament coverage, source
freshness, a general DB1 mirror, semantic codebook meaning, DB2 variables,
downloads, charts, public access, or a research claim. Source drift, failed
future reconciliation, a proposed projection refresh, or any access change
trigger review. A new capture cohort requires a new decision.
