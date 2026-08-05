# GB-SCT DB1 Member-Context Collection Batch — DEC-0090

**Status:** Closed — restricted deployment passed; owner private-beta accepted
**Date:** 4 August 2026  
**Decision requested:** DEC-0090

## Decision requested

Approve one contained **D11 Member-context collection batch**. It would set a
restrictive, collection-only private DB1 handling basis for each named route,
then test and ingest six already observed, no-query Scottish Parliament
collections as six independent, source-preserving DB1 releases in one serial
package:

| Route ID | Exact source route | Historic reconnaissance scale only | Proposed release ID |
| --- | --- | ---: | --- |
| `members` | `GET https://data.parliament.scot/api/members` | 416 objects | `gb_sct_members_d11_v1` |
| `member-constituency-statuses` | `GET https://data.parliament.scot/api/memberelectionconstituencystatuses` | 523 objects | `gb_sct_member_constituency_statuses_d11_v1` |
| `member-region-statuses` | `GET https://data.parliament.scot/api/memberelectionregionstatuses` | 413 objects | `gb_sct_member_region_statuses_d11_v1` |
| `member-parties` | `GET https://data.parliament.scot/api/memberparties` | 976 objects | `gb_sct_member_parties_d11_v1` |
| `member-party-roles` | `GET https://data.parliament.scot/api/memberpartyroles` | 1,509 objects | `gb_sct_member_party_roles_d11_v1` |
| `member-government-roles` | `GET https://data.parliament.scot/api/membergovernmentroles` | 381 objects | `gb_sct_member_government_roles_d11_v1` |

The figures are historic response observations from 2 August 2026, not current
source-size, completeness, coverage, freshness, or suitability claims. The
six routes share a collection-only, relationship-bearing risk profile and the
same raw-preservation objective. They do **not** share semantic meaning:
each has its own raw object, manifest, projection, release, reconciliation
state, and field guide.

Approval authorised the complete contained D11 loop: route-specific
handling gate, implementation, one initial and one immediate reconciliation
request per route, daily serial reconciliation, fixed source-preserving
projection, private fixed-pagination reader, deployment, and one owner
acceptance journey. It does not authorise a wider member, relationship, or
time-series programme.

## Why batch these routes now

The single-route D6–D10 releases proved the project’s baseline DB1 loop. Their
one-at-a-time shape was appropriate while the pipeline and reader were being
established; retaining it for every compatible collection would add delay with
little additional control. D11 instead keeps the controls at the right level:
one coherent source family and one contained deployment, but six separately
named data products and no cross-route interpretation.

This batch supplies a source-preserving record of material that later research
may need for MSP, representation, party, and government context. It does not
create those variables or assert that the sources support them. The existing
Members, Parties, Party roles, and Government roles releases are useful
reference collections, but they do not make any linked relationship or
validity claim safe by implication.

## Exact source and request contract

| Control | D11 contract |
| --- | --- |
| Routes | Exactly the six fixed host/path pairs above; `GET`, no query string, no detail ID, no user-supplied URL, and no pagination or follow-up request. |
| Initial test ingest | One serial initial request per route in listed order. Only after a route's successful initial result, make one immediate request for that same route. Maximum 12 source requests total. |
| Daily reconciliation | One D11 service runs the six routes serially once every 24 hours at 05:30 UTC. Each run is one request per route; no queued catch-up, retry, or cross-route substitution. |
| Transport gates | Manual redirects; 30-second total timeout; 2 MiB response-body ceiling per route; JSON content type; top-level array. |
| Per-route failure | A route transport/shape/source failure records that route as stopped with no retry. The service may continue to the next fixed route only when the DB1 target, privilege, logging, and service health controls still pass. A shared-target, privilege, integrity, or application regression stops the whole D11 batch. |
| Reconciliation | Compare raw SHA-256 digest and observed structural signature only for the same route. `UNCHANGED` has no wider freshness, deletion, or coverage meaning. |
| Retention | One immutable raw object and manifest per successful authorised response; a source-preserving operational projection bound to its named manifest. Later observations do not silently rewrite the D11 fixed release. |

This is deliberately a controlled test ingest, not an attempt to create a
complete member history. The 2 MiB ceiling, route-by-route stop record, and
serial schedule keep the batch bounded. A cap breach, unexpected non-array
shape, or any need for a query/window/full-history method is a visible
unresolved state, not a reason to widen the package.

## Handling and scientific boundary

The proposed action is restricted private retention and source-preserving
presentation only. Raw source fields—including names, person identifiers,
protected-content indicators, dates, `Notes`, relationship identifiers,
validity-period fields, role identifiers, and observed-null placeholders—would
remain source-supplied values in named captures. They are not CLD variables,
validated person records, protected-data classifications, membership or office
evidence, or DB2 inputs.

In particular, D11 must not infer, calculate, label, or expose as a project
fact:

- an MSP's party, role, constituency, region, government office, or committee
  status at any point in time;
- whether any `ValidFromDate` or `ValidUntilDate` denotes appointment,
  membership, activity, existence, or an exclusive interval;
- relationship direction, completeness, continuity, overlap resolution, or
  absence;
- identity, biographical, personal-data, or protected-content semantics;
- a join between any D11 release or to an existing DB1 release; or
- a DB2 variable, download, generic query, chart, research release, or public
  result.

The route-specific basis does not extend to any detail route, committee/member
relationship route, source document, MQA/motion/vote/report route, or other
parameterised collection.

## DB1 projection and private access

Each release preserves every top-level source object/value and source position,
plus manifest/projection/reconciliation provenance. Operational metadata may be
added solely to retain lineage; source fields are neither renamed nor
interpreted. D11 adds no database relation joining the six releases.

The private beta interface would place the six releases under one new
**Members and representation** subject group, using the existing compact
expandable DB1 catalogue pattern:

- each release shows exact source route, retained-DB1 status, named capture and
  build, reconciliation state, observed structure, and interpretive limits;
- fixed server-side pagination (default 20, maximum 50) is the only record
  access method; and
- raw objects, direct SQL, generic filtering/search, joins, download, snippets,
  charts, and public access remain unavailable.

The reader remains beta/superuser-only and cannot read raw objects, write DB1,
trigger the worker, or reach the source. The D11 worker receives only the
minimum DB1 rights for its six named releases. The worker calls the Scottish
Parliament source directly; it neither calls nor depends on the proxy/relay.

## Verification and acceptance

Before any source request, verify the six fixed route contracts; per-route
body/timeout/redirect gates; source-body non-logging; isolated writer and
reader grants; raw-object denial to the reader; D11 service non-overlap; and
continuity of D4A, D4C, D5, D6, D7, D8, D9, and D10.

The deployment result must record, independently for every route: initial and
immediate request state, non-content metadata, raw-object/manifest integrity,
projection count/rejections, fixed-release binding, reader/anonymous denial,
and reconciliation schedule. It must separately record any stopped route and
whether later routes were permitted to continue.

One eligible user then hard-refreshes, opens **DB1 catalogue**, expands
**Members and representation**, and checks all six releases. Acceptance is
limited to: one subject group, six clearly distinguished retained DB1
releases, provenance/limits, fixed pagination, and no UI claim of current or
historical member status. It does not accept record meanings, joins, or
analytical variables.

## Exclusions and stop conditions

Excluded: all detail routes; every route outside the six named collections;
all source parameters, identifiers, and pagination discovery; Committee and
member-committee routes; Bills detail; document material; MQA, motion, vote,
and official-report routes; cross-route joins; temporal or relationship logic;
DB2; public access; download; generic query/search; raw-object access; charts;
research release; and shared VPS/database/Nginx changes.

Stop and seek a new decision for a handling, access, source-contract,
body-limit, shape, drift, logging, privilege, timer, service-health, or
cross-route-containment failure; a need to continue a failed route; any new
source route/parameter; any semantic or temporal claim; or any access/export
expansion.

## Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | DB1 source-preserving mirror increment after closed D10 Parties collection. |
| Authority for proposal preparation | Owner instruction to proceed on 4 August 2026; owner then approved DEC-0090. |
| Authorising decision | DEC-0090, approved 4 August 2026. |
| Affected systems/records if approved | Six new isolated DB1 releases, D11 service/timer, raw archive/manifests/projections, private DB1 catalogue, D11 result, DB1 narrative, endpoint matrix, decision/risk registers, and governance review. |
| Known uncertainty | Current source size/shape, update behaviour, complete temporal coverage, field meaning, personal-data classification, validity semantics, relationship direction, and cross-route consistency remain unestablished. |
| Smallest change | One six-route, collection-only, serial batch; no detail/parameter route, no joins, and no new access class. |
| Containment/rollback | A route-level failure stops that route without retry; a shared integrity/access/service failure stops D11. Existing DB1 releases/timers, proxy routes, DB2, and shared VPS services are unaffected. |
| Verification artefact | D11 deployment/acceptance result with six route-specific non-content capture/reconciliation records, access proofs, and UI acceptance evidence. |

## Owner review questions

1. Is the six-route member-context batch the right faster cadence after the
   closed D10 collection, rather than another single collection?
2. Are the 12-request initial/immediate cap, serial 05:30 UTC daily service,
   30-second/2 MiB per-route gates, and route-level stop rule sufficient?
3. Is the proposed **Members and representation** private-beta group the right
   transparent presentation, with fixed pagination only?
4. Do the explicit non-interpretation and no-join limits adequately preserve
   the DB1/DB2 separation for person and relationship material?
5. If approved, may D11 proceed as one contained handling, implementation,
   deployment, and owner-acceptance package?

## Related records

- [DB1 strategic plan — DEC-0073](../../../../workstreams/db1/STRATEGY_AND_OPERATING_MODEL.md)
- [DB1 access direction — DEC-0082](../../../../workstreams/db1/RESEARCH_ACCESS_DIRECTION.md)
- [D10 Parties cohort — DEC-0089](GB_SCT_DB1_PARTIES_COLLECTION_COHORT_PROPOSAL_DEC0089.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Contextual-reference reconnaissance](../../../data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Roles/committees reconnaissance](../../../data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
