# GB-SCT DB1 Committees Collection Cohort — DEC-0091

**Status:** Approved and executed — restricted deployment passed; owner private-beta acceptance pending
**Date:** 4 August 2026  
**Decision requested:** DEC-0091

## Decision requested

Approve one contained D12 DB1 package for exactly
`GET https://data.parliament.scot/api/committees`, with no query string. For
this route only, the decision would replace the current
`DO_NOT_CAPTURE_OR_RELEASE` planning default with a restrictive private DB1
source-preserving handling basis. It would authorise an initial capture, one
immediate reconciliation, one daily reconciliation service, one fixed
projection/release, a private fixed-pagination reader, and an owner acceptance
check.

This is not approval to interpret committee membership, committee assignment,
contact information, description text, validity dates, status, history, or
relationships. It does not authorise the committee detail route, member or
role routes, DB2, download, public access, generic query/search, or any other
route.

## Why this is the next increment

The closed D11 batch established the efficient compatible-collection pattern:
one subject group, independent source-preserving releases, one serial daily
worker, and one bounded private reader. Historic reconnaissance—not a current
source check—records `/api/committees` as a 169-record collection with source
identifiers/names plus description, contact/free-text, and validity signals.
It is the remaining committee entity collection needed for eventual source
coverage, while remaining technically small enough for the existing bounded
collection pattern.

| Candidate | Existing evidence | Decision here |
| --- | --- | --- |
| `/api/committees` | Historic 169-record collection; source names/identifiers, description/contact/free-text, and validity signals. | **Selected:** one route-specific private source-preserving release, without field or relationship interpretation. |
| `/api/committeetypes` and `/api/committeetypelinks` | Already retained in the closed D4C institutional-reference cohort. | Not repeated or changed. |
| `/api/committeeroles` | Already retained as the closed D8 collection-only cohort. | Not repeated or changed; it does not establish membership. |
| `/api/committees/:id` | Historic detail shape recorded, but its contract and handling have not been separately approved. | Excluded. |
| Person/relationship routes | D11 already preserves six separate source collections without joins or temporal interpretation. | Excluded; no cross-route combination or new meaning. |
| MQA, official-report, and vote routes | High-volume/window or contract/handling controls remain unresolved. | Excluded. |

DB2 remains independent and later. It neither motivates nor constrains D12.

## Exact D12 contract

| Control | Proposed contract |
| --- | --- |
| Route | Exact host/path above; `GET`, no query, no detail ID, no user-supplied URL. |
| Initial/immediate check | One initial request, then one immediate request only after a successful initial response. No retry or substitute request. |
| Daily schedule | One request every 24 hours at 06:00 UTC, using a D12 non-overlap lock and no queued catch-up. The D12 unit is independent of D4A–D11. |
| Transport gate | Manual redirect handling; 30-second total timeout; 2 MiB body ceiling; JSON content type; top-level array required. A breach stops D12 and is recorded. |
| Retention and comparison | Immutable raw object and manifest; source-preserving operational projection; fixed-route SHA-256 and structural-signature comparison only. Every successful source object/value is preserved with source position and operational lineage; rejection is visible, never filtered. |
| Fixed release | `gb_sct_committees_d12_v1`, bound only to the accepted initial manifest. Later observations do not silently rewrite it. |
| Private access | Active `BETA_USER` and `SUPERUSER` only; fixed server-side pagination (default 20, maximum 50). No filters, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add one **Committees collection** release within the existing **Institutional reference** DB1 group. It must not create a second institutional/committee heading or imply membership, assignment, status, or history. |

## Handling and interpretive limits

If approved, the full response is retained only in the isolated DB1 raw archive
and loss-aware source-preserving projection, and exposed only through the
stated authenticated reader. The source's identifiers, names, descriptions,
contact/free-text, validity fields, nulls, and any other returned values remain
source-supplied material in a named capture. They are not CLD variables,
validated committee facts, membership evidence, committee-to-bill assignment
evidence, a status history, or DB2 inputs.

No conclusion is made about field meaning, historical coverage, completeness,
freshness, contact-data classification, copyright, third-party rights, or the
meaning of any date. This route-specific basis neither changes the handling
register's outcome for any other route nor transfers to detail, text-bearing,
relationship, or date-bearing collections.

## Verification, acceptance, and stop conditions

Before the first source request, verify the fixed D12 client and transport
gates; D12 writer/timer isolation; raw archive/manifest/projection integrity;
reader raw/write denial; anonymous denial; proxy/DB1 data-pipe separation; and
continuity of D4A–D11, application, and shared-host services. After deployment,
the result must record the two request states, non-content transport/lineage
metadata, projection/rejection count, fixed-release binding, timer state,
health, access denials, and continuity checks. One eligible private-beta user
then verifies the single **Institutional reference** group, provenance/limits,
and fixed pagination.

Stop D12 without retry, substitution, scope expansion, or existing-cohort
change if the source redirects, times out, exceeds the ceiling, returns
non-JSON/non-array content, reports an error, materially departs from the
declared route, or creates a handling, integrity, access, or service
regression.

Excluded: committee detail; committee membership or assignment; every person,
role, party, government-role, Bills, formal-stage, MQA, report, vote, or other
new route; all joins and status/interval interpretation; DB2; semantic
variables; public access; download; generic query/search; raw-object access;
charts; research release; and shared VPS/database/Nginx changes.

## Approval scope and pre-flight record

| Item | Record |
| --- | --- |
| Active phase | Documentation-only DB1 cohort planning after closed D11. |
| Current authority | The owner approved DEC-0091 on 4 August 2026. Its contained restricted deployment passed; owner private-beta acceptance remains required. |
| Affected records if approved | One exact source route; isolated D12 DB1 raw/archive/manifest/projection/release records; a D12 writer/service/timer; one private reader; D12 result; DB1 narrative; matrix; decision/risk registers; and governance review. |
| Known uncertainty | Current response size/shape, update behaviour, field meanings, contact/free-text handling implications, validity semantics, and source coverage are not established by this proposal. Historic evidence does not support membership, assignment, status, or historical claims. |
| Smallest change | One fixed collection route and one named fixed release, using the established D11 compatible-collection pattern. |
| Containment/rollback | A failed gate stops D12 without source retry or substitute action. Only D12-created application/database/service records may be rolled back; existing captures, timers, proxy, DB2, and shared services remain untouched. |
| Verification artefact | D12 restricted-deployment/acceptance result with non-content capture/reconciliation, lineage, access, continuity, and owner-acceptance evidence. |

## Owner review questions

1. Is `/api/committees` the right next bounded DB1 cohort after the closed
   member-context batch?
2. Is the route-specific restrictive handling basis—full source preservation,
   private access, and no field/relationship/date interpretation—right for the
   recorded contact/description/free-text and validity signals?
3. Are the two-request initial/immediate sequence, independent 06:00 UTC
   daily schedule, and one **Institutional reference** presentation right?
4. If approved, may D12 proceed as one contained implementation, deployment,
   and owner-acceptance package within these limits?

## Related records

- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [D8 Committee roles cohort — DEC-0087](GB_SCT_DB1_COMMITTEE_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0087.md)
- [D11 Member-context batch — DEC-0090](GB_SCT_DB1_MEMBER_CONTEXT_COLLECTION_BATCH_PROPOSAL_DEC0090.md)
- [Route-level handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Committee reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Master endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
