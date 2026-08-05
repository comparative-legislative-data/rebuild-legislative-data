# GB-SCT DB1 Reference-Cohort Projection and Catalogue Proposal — DEC-0079

**Status:** Approved — implementation authorised
**Version:** 1.0.0
**Prepared:** 3 August 2026
**Decision:** DEC-0079 — owner approved implementation on 3 August 2026

## 1. Decision requested

The owner approved D4B: create three loss-aware operational projections from
only the named, already-retained D4A manifests below, then expose them through
one fixed private-beta catalogue response and screen.

| Projection | Input manifest | Route |
| --- | --- | --- |
| `gb_sct_bill_types_d4a_v1` | `6a414dbf-973a-4aa5-9aae-b217fc18c1e3` | `gb-sct.bill-types.collection` |
| `gb_sct_bill_stage_types_d4a_v1` | `2315af79-5903-4540-904c-0eb3f95e99c4` | `gb-sct.bill-stage-types.collection` |
| `gb_sct_sessions_d4a_v1` | `e94719fb-f686-48ce-b652-d22f3b532ac3` | `gb-sct.sessions.collection` |

The sole read endpoint would be `GET /db1/gb-sct/reference-cohort/d4a-v1`.

No source request/capture, timer change, raw-object view, generic query,
download, DB2 variable, chart, public data access, or shared-host change is
authorised by this proposal.

## 2. Product shape

The current D3 preview proves one retained object. D4B would make the three
small D4A reference captures understandable as a coherent, reproducible
baseline without representing them as live data or a complete mirror.

The page would use the proxy catalogue’s compact, grouped, expandable layout:

- **Bills and formal stages:** Bill Types; Bill Stage Types.
- **Parliamentary sessions:** Sessions.

Opening a badge would reveal provenance, a D4A reconciliation-state indicator,
observed structure, limitations, citation guidance, and preserved projection
records. The shared layout is navigation only: DB1 must visibly say *retained
fixed baseline* where the proxy says *live no-retention source access*.

## 3. Data and projection contract

Before building, verify each exact manifest's route, handling class, successful
status, digest, byte count, and raw-object integrity. Each input must be a
top-level JSON array. Preserve every object with source position and manifest
lineage; record a linked rejection for every non-object element. Do not create
typed analytical fields, inferred meaning, session-boundary interpretation,
ordering claim, or DB2 variable.

The field guide may report only observed keys/types/counts in the named
projection. It is not a source codebook or semantic schema declaration.

The D3 Bill Types projection remains immutable and available until D4B passes
its own acceptance. D4B must not overwrite, delete, or relabel it.

## 4. Freshness and reconciliation disclosure

D4A's timer may collect later observations, but D4B will not automatically
rebuild. These panels are a **fixed D4A baseline**, with named capture times.
The latest D4A comparison state may appear as a separate operational signal;
it cannot silently alter displayed projection records.

`UNCHANGED` applies only to the declared D4A raw-digest comparison. A later
`CHANGED`, `FAILED`, `PARTIAL`, `BLOCKED_BY_SOURCE_DRIFT`, or
`SKIPPED_OVERLAP` state must suppress any incompatible “current” wording. A
refreshed projection requires its own named build and decision.

## 5. Minimal implementation

1. Add one migration/projection command hard-coded to the three manifests and
   projection names above.
2. Add three fixed projection-build records with loss-aware records/rejections.
3. Extend the separate DB1 reader role only with read-only access to the
   minimum D4A reconciliation metadata it needs; prove it cannot write, read
   raw bytes, or access another project/database.
4. Add only the fixed route in section 1 for active beta users and superusers.
5. Add the private `DB1 catalogue` screen using the proxy visual system.

The API reads PostgreSQL only through its DB1 reader. It has no upstream
client, raw filesystem access, timer control, or D4A writer credential. The
proxy and DB1 remain independent data pipes sharing only the app/auth gateway.

## 6. Fixed interface contract

The response contains exactly three route panels. Each may expose only source
route/path/group, baseline capture/manifest/digest/byte/content-type lineage,
projection build/count/integrity metadata, D4A reconciliation metadata,
observed structure, limitations, citation text, and preserved projection
records. No live-source action belongs in this DB1 panel; the proxy catalogue
remains the transparent live-access surface.

## 7. Verification and acceptance

D4B passes only if retained evidence proves:

1. only the three named manifests supplied the projections;
2. raw integrity, record/rejection lineage, and reproducibility pass;
3. no source request, timer/writer coupling, raw-byte route, generic DB1
   query, export, DB2, public route/listener, or shared-host change exists;
4. the reader role remains read-only and narrower than the D4A writer;
5. proxy, D3, authentication, password, magic-link, sign-out, and role checks
   still pass; and
6. eligible beta/superuser users understand fixed baseline versus live proxy,
   provenance, reconciliation state, structure limit, records, and citation;
   guests and anonymous requests are denied.

## 8. Stop conditions and exclusions

Stop on a missing/different manifest, integrity failure, non-array input,
schema/build issue, broader privilege, upstream request, timer/writer coupling,
raw/secret log risk, access regression, or impact beyond named project DB1
records and the two existing app services. Roll back only newly created D4B
release/grants; preserve D2/D3/D4A evidence and non-content failure records.

Excluded: every new source action, automatic projection refresh, Bills/formal
detail routes, person/committee/MQA/motion/vote/report content, generic search,
raw view, download, direct SQL, DB2, chart, public release, and shared-host
change.

## 9. Owner review questions

1. Is this fixed D4A baseline the right truthful first DB1 catalogue scope?
2. Is proxy-aligned grouped/expandable navigation, with unavoidable retained
   versus live distinction, the right implementation direction?
3. Are the single fixed response, absence of search/download, and separate
   reader role the right containment boundary?
4. If approved, may D4B proceed as one contained build/deployment/acceptance
   package subject to these controls?

## 10. Related records

- [D4A result — DEC-0078](GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_RESULT_DEC0078_2026-08-03.md)
- [D3 result — DEC-0077](GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
- [DB1 strategic plan — DEC-0073](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 narrative](../../../../workstreams/db1/README.md)
