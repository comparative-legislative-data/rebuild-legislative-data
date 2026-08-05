# GB-SCT DB1 Member-Context Collection Batch Result — DEC-0090

**Status:** `PASS — DEC-0090 CLOSED; OWNER ACCEPTED`
**Date:** 4 August 2026  
**Decision:** DEC-0090  
**Scope:** Six fixed, no-query member-context collections only; restrictive
private DB1 handling, source-preserving capture/projection, private fixed
pagination, and a single daily serial reconciliation service.

## Result

D11 passed within its contained boundary. It made exactly 12 authorised source
requests: one serial `INITIAL` request and one immediate serial `UNCHANGED`
comparison for each of the six fixed routes. No retry, detail request, query,
pagination follow-up, substitute route, join, or semantic transformation was
used.

| Route | Initial capture UTC | Initial bytes | Fixed release | Objects | Rejections | Immediate state |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `/api/members` | 11:24:43 | 96,798 | `gb_sct_members_d11_v1` | 416 | 0 | `UNCHANGED` |
| `/api/memberelectionconstituencystatuses` | 11:24:44 | 100,931 | `gb_sct_member_constituency_statuses_d11_v1` | 523 | 0 | `UNCHANGED` |
| `/api/memberelectionregionstatuses` | 11:24:45 | 79,688 | `gb_sct_member_region_statuses_d11_v1` | 413 | 0 | `UNCHANGED` |
| `/api/memberparties` | 11:24:46 | 134,503 | `gb_sct_member_parties_d11_v1` | 976 | 0 | `UNCHANGED` |
| `/api/memberpartyroles` | 11:24:48 | 281,475 | `gb_sct_member_party_roles_d11_v1` | 1,509 | 0 | `UNCHANGED` |
| `/api/membergovernmentroles` | 11:24:49 | 47,700 | `gb_sct_member_government_roles_d11_v1` | 381 | 0 | `UNCHANGED` |

The D11 service is active/enabled for 05:30 UTC daily. Existing D4A, D4C,
D5, D6, D7, D8, D9, and D10 timers remained active. Each D11 release has its
own raw object, manifest, projection build, and reader route. The reader can
select named releases and reconciliation provenance but cannot read raw
objects or write DB1; anonymous requests to every D11 route are denied.

Two loopback API health probes received connection-refused during the expected
API restart window. Bounded readiness subsequently passed; no source retry was
made because of that restart condition.

## Private-beta acceptance

On 4 August 2026, the owner confirmed the defined private-beta journey behaved
as expected: hard-refresh, open **DB1 catalogue**, expand **Members and
representation**, and inspect all six releases. This accepted one subject
group containing six distinct retained DB1 collections, source-route and
capture/build/reconciliation provenance, observed structure, explicit
non-interpretation limits, and working fixed pagination.

No current or historical MSP, representation, party, role, government office,
relationship, validity-period, or identity claim was accepted or introduced.
No detail route, cross-route join, raw-object route, download, generic
search/filter, DB2 claim, or public-access action was accepted or introduced.

## Boundary and review

This result does not establish a person identity, protected-content
classification, party affiliation, representation, government office, role,
relationship direction, interval convention, completeness, freshness,
update/deletion detection, licence, DB2 input, or public/research release.
`UNCHANGED` means only that each named immediate route comparison had the same
raw digest within its completed request scope.

Review is required on D11 failure/change/drift, a proposed access or projection
change, source behaviour change, or before 1 September 2026.

## Related records

- [D11 Member-context proposal — DEC-0090](GB_SCT_DB1_MEMBER_CONTEXT_COLLECTION_BATCH_PROPOSAL_DEC0090.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
