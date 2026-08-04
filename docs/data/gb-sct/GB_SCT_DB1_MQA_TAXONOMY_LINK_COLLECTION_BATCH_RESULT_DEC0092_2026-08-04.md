# GB-SCT DB1 MQA Taxonomy and Link Collection Batch Result — DEC-0092

**Status:** `PASS — DEC-0092 CLOSED; OWNER ACCEPTED`
**Date:** 4 August 2026  
**Decision:** DEC-0092  
**Scope:** Only `/api/motionsquestionsanswerseventtypes` and
`/api/motionsquestionsanswerseventlinks`; separate source-preserving captures,
fixed projections/releases, private fixed pagination, and one serial D13
service.

## Result

D13 created two independent retained DB1 operational projections. Neither is a
live Scottish Parliament response, raw-object route, semantic event taxonomy or
link table, generic DB1 query, download, canonical dataset, chart, or research
release.

| Fixed release | Initial manifest | SHA-256 | Bytes | Preserved objects | Rejections |
| --- | --- | --- | ---: | ---: | ---: |
| `gb_sct_mqa_event_types_d13_v1` | `ee46ccac-7aba-4484-b4ba-f2e39b4dd1fa` | `61cd0748c996eab069355ba160fc9e6389e99ab8fedc9096d907054d1667bd2f` | 81 | 2 | 0 |
| `gb_sct_mqa_event_links_d13_v1` | `2905ac89-5e4d-4922-9f62-36158fdca2f1` | `b5ad85030dc3523f0f803e5da74eff901d9c3df34c6403cba4dd8f577cb5c7b5` | 406,192 | 5,721 | 0 |

The initial captures were retrieved at 12:45:36–12:45:37 UTC. The immediate
same-route comparison for each release was `UNCHANGED`. This only records the
same raw digest and compatible structural signature within the two approved
requests; it does not establish freshness, completeness, field meaning, event
classification, link direction, relationship semantics, or cross-route
consistency.

`cld-gb-sct-db1-d13.timer` is active and enabled for 06:15 UTC daily. It runs
the two exact no-query routes serially, with a D13-specific non-overlap lock,
no queued catch-up, no retry, and separate raw/manifest/observation/projection/
release lineage.

## Verification retained

- The deployed revision was `90539e8`; its production build, 28 tests,
  fixed-route capability checks, D13 transport test, and B1 package check
  passed on both local and target environments.
- The D13 writer has only the required capture, manifest, reconciliation,
  projection, and `mqa_taxonomy_link_releases` privileges. The DB1 reader can
  read named-release/reconciliation metadata but cannot read raw objects or
  write projection records.
- Anonymous `GET /db1/gb-sct/mqa-event-types/d13-v1` and
  `GET /db1/gb-sct/mqa-event-links/d13-v1` both returned `403`.
- The API health endpoint passed after deployment. Two loopback probes received
  connection-refused responses during the expected API-restart window, then
  bounded readiness passed without a source retry. D4A–D12 timers remained
  active; D13 was then enabled.
- No proxy source contract, DB2 target, public listener, raw-object route,
  generic DB1 route, download, or shared-host service was added.

## Pre-source stops and correction record

Four deployment packaging defects were exposed sequentially: the new wrapper
was initially non-executable; its first invocation recursively entered its
clone wrapper; the next ran its transformed body from standard input and could
not locate its source tree; and the B1 package allow-list omitted the two D13
runtime scripts. Each stop occurred before D13 migration, service creation, or
source request. Read-only checks confirmed zero D13 source-route records before
the final deployment. The targeted corrections were committed and pushed before
the successful run; no route, data, access, or semantic scope changed.

## Owner private-beta acceptance

The owner confirmed the defined private-beta journey: an eligible user opened
**DB1 catalogue**, expanded **Motions, questions, related records and votes on
motions**, and found exactly two retained releases:

- **MQA event types · collection**; and
- **MQA event links · collection**.

Each exposes its own capture/manifest/digest/byte/build/reconciliation,
observed-structure, limitation, citation, and fixed-pagination disclosures.
The page must not imply event semantics, a link direction or relationship,
event detail, a join, raw-object access, download, generic search/filter, DB2,
or public access.

## Boundary and review

D13 does not establish a complete Scottish Parliament mirror, update/deletion
detection, source-field semantics, temporal coverage, a DB2 input, or a
public/research release. Event subtypes (including `IntroText`), all other MQA
collections/windows, official reports, and votes require separate decisions.

Review is required on D13 failure/change/drift, a proposed access/projection
change, source behaviour change, or before 1 September 2026.

## Related records

- [D13 proposal — DEC-0092](GB_SCT_DB1_MQA_TAXONOMY_LINK_COLLECTION_BATCH_PROPOSAL_DEC0092.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
- [Master endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Decision register](../../governance/DECISION_REGISTER.md)
