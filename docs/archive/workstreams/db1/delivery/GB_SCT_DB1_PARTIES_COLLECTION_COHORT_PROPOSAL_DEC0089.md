# GB-SCT DB1 Parties Collection Cohort — DEC-0089

**Status:** Closed — restricted deployment passed; owner private-beta accepted
**Date:** 4 August 2026  
**Decision requested:** DEC-0089

## Decision requested

Approve one contained D10 DB1 package for exactly
`GET https://data.parliament.scot/api/parties`, with no query string. For this
route only, the decision would replace its present
`DO_NOT_CAPTURE_OR_RELEASE` default with a restrictive private DB1
source-preserving handling basis and authorise an initial capture, one immediate
reconciliation, daily reconciliation, fixed projection, private fixed-pagination
reader, and owner-acceptance loop.

This is not an approval for party affiliation, Party roles changes,
member-party relationships, party-history interpretation, `Notes` fields
generally, or any other route. It does not extend D9 or authorise Party detail,
Member parties, Member party roles, Members, or any relationship route.

## Why this is the next candidate

Historic reconnaissance—not a current source check—recorded a small
14-element collection with source identifiers, names/abbreviations, `Notes`,
validity-period fields, and two observed-null relationship placeholders. The
same reconnaissance observed 14 non-null `ValidFromDate` values spanning
1999-05-05 to 2026-04-30. This supports a bounded source-defined party
taxonomy and observed source dates; it does not establish a complete party
system, party status at a date, party continuity, or anyone's affiliation.

| Candidate | Existing evidence | Decision in this proposal |
| --- | --- | --- |
| `/api/parties` | 14 elements; identifier, names/abbreviation, `Notes`, validity-period fields, and two observed-null relationship placeholders. | **Selected:** small party-reference collection, with route-specific private handling and no temporal or relationship interpretation. |
| `/api/partyroles` | 548 source-defined party-role terms without dates; D9 is closed. | Not selected: already covered by its own route-specific release; its handling basis does not transfer. |
| `/api/parties/:id` | One historic detail response had the collection field set. | Not selected: a limited historical comparison is not authority for detail access. |
| `/api/memberparties` | Person/party relationship and validity-period signals. | Not selected: it would require separate relationship, interval, and affiliation handling. |
| `/api/memberpartyroles` | Person/role relationship, `Notes`, and validity-period signals. | Not selected: it would require separately resolved role, interval, and free-text handling. |
| `/api/committees` | Description, contact/free-text, and validity signals. | Not selected: broader content and temporal handling questions remain. |

DB2 remains a distinct later workstream, not a rationale, dependency, or
success criterion for D10.

## Exact D10 boundary

| Control | Proposed contract |
| --- | --- |
| Route | Exact host/path above; `GET`, no query, no detail ID, and no user-supplied URL. |
| Initial/immediate check | One initial request, then one immediate request only after a successful initial result. No retry. |
| Daily schedule | One serial request every 24 hours at 05:02 UTC, with a non-overlap lock and no queued catch-up. |
| Transport gate | Manual redirects; 30-second total timeout; 2 MiB body ceiling; JSON content type; top-level array. A breach stops D10. |
| Retention/reconciliation | Immutable raw object and manifest; source-preserving projection; fixed-route SHA-256/structure comparison only. |
| Fixed release | `gb_sct_parties_d10_v1`, bound to the initial manifest; later observations do not silently rewrite it. |
| Private access | Beta/superuser only; fixed server-side pagination (default 20, maximum 50); no filters, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add one Parties release to the existing **Parties and government roles** DB1 group. It must not create a duplicate group or imply party membership, party continuity, or party-role history. |

## Handling and interpretive limits

If approved, complete-collection retention is permitted only in the isolated
DB1 raw archive and source-preserving projection, plus the stated private
reader. Identifiers, names, abbreviations, `Notes`, validity-period fields, and
observed-null placeholders remain source-supplied fields in a named capture—not
CLD variables, validated party definitions, affiliation evidence, party-history
evidence, or DB2 inputs.

No claim is made about completeness, freshness, field meaning, personal-data
classification, copyright, third-party rights, whether a validity period means
party existence or activity, party affiliation, or temporal coverage. This
route-specific basis cannot transfer to another `Notes`, date, party, or
relationship route.

## Verification, acceptance, and stop conditions

Before the first request, verify the exact client and transport gates, D10
role and timer, archive/manifest integrity, source-field preservation, reader
raw/write denial, anonymous denial, and continuity of D4A, D4C, D5, D6, D7,
D8, and D9. After deployment, record the two request states, non-content
metadata, projection count/rejections, fixed-release binding, timer state,
health, and route denial. One eligible user then verifies the existing subject
group, provenance/limits, and fixed pagination.

Stop without a substitute route or retry if the route redirects, times out,
exceeds the cap, returns non-JSON/non-array content, reports an error, differs
materially from the declared route, or causes a handling, access, integrity, or
existing-cohort regression.

Excluded: Party detail; all Member, Member party, and Member party-role
routes; Party roles changes; every other new route; semantic party,
affiliation, validity, continuity, or history interpretation; DB2; public
access; download; generic query/search; direct SQL; charts; research release;
and shared VPS/database/Nginx changes.

## Approval scope

If approved, DEC-0089 would authorise only the contained D10 loop above,
including ordinary implementation and deployment corrections that do not alter
the route, request contract, retention/access class, schedule, project target,
public boundary, or claim. It would not establish a transferable `Notes`, date,
party, or relationship policy, or authorise a future scope expansion.

## Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | DB1 contained-cohort planning after DEC-0088 closure. |
| Current authority | The owner approved DEC-0089 on 4 August 2026. Its contained D10 implementation/deployment passed and the owner accepted the stated private-beta journey. |
| Affected records if approved | D10 source-route registry, isolated DB1 raw archive/projection, named private reader, timer, D10 result, DB1 narrative, matrix, decision register, and governance review. |
| Known uncertainty | Current source shape/size and all field semantics remain unobserved by D10; historic evidence does not establish party-system coverage, validity meaning, completeness, update behaviour, or party affiliation. |
| Smallest change | One exact collection route and one named fixed release only. |
| Containment/rollback | A failed gate stops D10; no substitute route, retry, exposure expansion, or change to an existing release/timer contract. |
| Verification artefact | A D10 restricted-deployment result would record non-content request/reconciliation, lineage, access, continuity, and owner-acceptance evidence. |

## Owner review questions

1. Is `/api/parties` the right next bounded DB1 cohort after the closed Party
   roles release?
2. Are the exact no-query contract, two-request initial/immediate sequence,
   05:02 UTC non-overlapping daily schedule, and source-preserving limits
   sufficient?
3. Is the existing **Parties and government roles** group the right single
   private-beta location for this release?
4. If approved, may D10 proceed as one contained qualification,
   implementation, deployment, and owner-acceptance package?

## Related records

- [DB1 strategic plan — DEC-0073](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [Party roles cohort — DEC-0088](GB_SCT_DB1_PARTY_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0088.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Contextual-reference reconnaissance](../../../data/gb-sct/reconnaissance/GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
