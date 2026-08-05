# GB-SCT DB1 First Projection and Private Explorer Result — DEC-0077

**Status:** Passed — owner private-beta acceptance complete

**Completed:** 3 August 2026  
**Authority:** DEC-0077, owner-approved on 3 August 2026

## Outcome

D3 has built and deployed one restricted DB1 operational projection from the
sole permitted D2 input. The project application now exposes one fixed DB1
reader response to active beta users and superusers. It shares only the
application’s authentication/gateway infrastructure with the upstream proxy;
the two retain independent data pipes.

| Control | Result |
| --- | --- |
| Input | Only manifest `1b13985f-1efb-48c4-ae56-caafc4d113df`, route `gb-sct.bill-types.collection`, and raw digest `fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b`. No source request, retry, or alternate input occurred. |
| Projection | `gb_sct_bill_types_d2_v1`; integrity `PASS`; 7 projected records and 0 rejections. The result records no source values. |
| Private route | Only `GET /db1/gb-sct/bill-types/d2-v1`; enabled service status is visible, while an anonymous request returns `403`. |
| Data-pipe separation | The DB1 reader has no upstream client. The existing proxy retains no DB1 reader, raw-store, or projection capability. |
| Reader privilege | New project-local `cld_gb_sct_db1_reader` role has `CONNECT`, DB1 schema usage, and `SELECT` only on the five projection/provenance tables it needs. It cannot select `raw_objects` or `projection_rejections`. |
| Reconciliation | `NOT_SCHEDULED`; no cron, worker, refresh, currentness, completeness, or mirror claim exists. |
| Services and host | The existing project database/API/web services are active. No new listener, service, Nginx, DNS, firewall, shared-cluster, other-database, or other-project change occurred. |

## Implementation and verification

The D3 builder checked the exact manifest/route/handling class/digest/byte
count before reading the retained object. It then checked the raw digest and
byte count, required a top-level JSON array, preserved each top-level object in
the projection with its source position, and recorded the build, record count,
and rejection count. It created no typed analytical fields and no DB2 variable.

The API response provides capture/run/manifest/digest/byte-size/projection
lineage, an observed key/type summary, explicit limitations, and inspectable
projection records. It withholds raw-file access. The frontend labels the page
as a restricted DB1 projection and distinguishes it from the live no-retention
proxy.

Local build, 19 tests, DB1 capability containment, runtime scope containment,
and documentation-link verification passed before release. VPS postflight
confirmed the fixed route, enabled DB1 service state, anonymous `403`, exact
projection lineage/counts, reader-role denial of raw-object access, active
project services, and restored project modes:

```text
/srv/cld-gb-sct       750 root:cld-gb-sct
/srv/cld-gb-sct/raw   750 root:cld-gb-sct
/srv/cld-gb-sct/raw/db1 770 root:cld-gb-sct
```

## Issues and contained corrections

The first projection run stopped before a build, role, secret, or service
change because the local PostgreSQL process could not traverse the private
project Node runtime. The second stopped at the code-only temporary staging
directory for the same reason. Both stops restored all raw/project modes and
left zero source projection builds and zero reader roles. The successful run
temporarily enabled traversal only on the project root/raw/runtime/staging
paths and temporary ownership only on the project DB1 raw subtree; it restored
the listed modes and ownership before reader-role creation/deployment.

After the first release, the DB1 reader was present but the old Fastify status
schema hard-coded `data_layers_available` to `false`. A second contained code
correction changed that declaration to a boolean. The final release reports
the truthful enabled state. No data or privilege scope changed in that
correction.

## Owner acceptance and remaining boundary

The technical result proves one named input, one projection build, one
least-privilege private reader, and an anonymous denial. It does not prove
source field semantics, historical coverage, freshness, route parity, a
scheduled mirror, generic DB1 query access, downloads, DB2 variables, charts,
or a research release.

The owner completed the independent private-beta browser test on 3 August 2026
and confirmed that the DB1 preview is visible and its provenance panel,
`NOT SCHEDULED` limitation, observed-structure explanation, and record display
are clear and behave as expected. This closes the narrowly scoped D3
acceptance gate.

The accepted view makes the following understandable without reading code:

1. it is a retained DB1 projection, not the live proxy or raw-object download;
2. the source route, capture/run/manifest/digest/build, record/rejection
   counts, and `NOT SCHEDULED` state are visible;
3. observed structure is not presented as a semantic codebook or DB2 variable;
4. preserved records can be inspected; and
5. the citation guidance and limitations are clear.

Guest and unauthenticated access remain unavailable under the verified fixed
route boundary. D3 is therefore closed as a narrowly passed increment; it does
not widen any of the remaining exclusions above.

## Future interface design direction

For a later, separately approved DB1 researcher interface, use the proxy
catalogue's compact, grouped, expandable information architecture so users can
navigate data sources consistently. The state and wording must remain distinct:
DB1 panels must foreground retained capture/projection lineage, version and
reconciliation status, while proxy panels foreground live no-retention source
access. Shared layout must never collapse those different data claims.

## What next

**Proposed documentation-only next step:** prepare the next DB1-slice proposal,
including its exact source/capture, reconciliation, projection, and
researcher-access boundaries. It does not authorise another source request,
capture, schedule, download, or interface implementation.

## Related records

- [D3 proposal — DEC-0077](GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_PROPOSAL_DEC0077.md)
- [D2 source-capture result — DEC-0076](GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
