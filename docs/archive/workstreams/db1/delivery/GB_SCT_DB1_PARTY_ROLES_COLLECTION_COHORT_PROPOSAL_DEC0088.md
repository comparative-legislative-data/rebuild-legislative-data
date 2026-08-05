# GB-SCT DB1 Party Roles Collection Cohort — DEC-0088

**Status:** Closed — restricted deployment passed; owner private-beta accepted
**Date:** 4 August 2026
**Decision requested:** DEC-0088

## Decision requested

The owner approved one contained D9 DB1 package for
`GET https://data.parliament.scot/api/partyroles`, with no query string. For
this route only, it would establish a restrictive private DB1
source-preserving handling basis and authorise an initial capture, one
immediate reconciliation, daily reconciliation, a fixed projection, private
fixed-pagination reader, and owner acceptance loop.

This is not a general approval for `Notes`, party fields, or role data. It
does not extend D7/D8, and does not authorise Party roles detail, parties,
member-party relationships, member-party-role relationships, or any other
route.

## Why this is the next candidate

Historic reconnaissance—not a current source check—recorded 548 records with
source identifier, party, name, and `Notes` fields, and no date fields. This
is a bounded source-defined taxonomy useful as later party-context evidence.
It does not establish who belonged to a party, held a role, or did so at any
particular time.

| Candidate | Existing evidence | Decision in this proposal |
| --- | --- | --- |
| `/api/partyroles` | 548 records; identifier, party, name, `Notes`; no dates. | **Selected:** bounded remaining role taxonomy, without relationship or temporal semantics. |
| `/api/parties` | `Notes` and validity-period signals. | Not selected: party life-cycle/validity handling needs its own decision. |
| `/api/partyroles/:id` | One historic detail response shared the collection field set. | Not selected: this does not authorise detail access. |
| Member party routes | Person/party or person/role relationships with validity dates. | Not selected: relationship, interval, affiliation, and occupancy claims remain unresolved. |
| `/api/committees` | Description/contact/free-text and validity signals. | Not selected: broader handling questions remain. |

DB2 remains a separate future workstream and is not a rationale, dependency,
or success criterion for D9.

## Exact D9 boundary

| Control | Proposed contract |
| --- | --- |
| Route | Exact host/path above; `GET`, no query, no detail ID, and no user-supplied URL. |
| Initial/immediate check | One initial request, then one immediate request only after success. No retry. |
| Daily schedule | One serial request every 24 hours at 04:47 UTC, with a non-overlap lock and no queued catch-up. |
| Transport gate | Manual redirects; 30-second total timeout; 2 MiB body ceiling; JSON content type; top-level array. A breach stops D9. |
| Retention/reconciliation | Immutable raw object and manifest; source-preserving projection; fixed-route SHA-256/structure comparison only. |
| Fixed release | `gb_sct_party_roles_d9_v1`, bound to the initial manifest; later observations do not silently rewrite it. |
| Private access | Beta/superuser only; fixed server-side pagination (default 20, maximum 50); no filters, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add one Party roles release to the existing **Parties and government roles** DB1 group. It must not create a duplicate group or imply party membership/role history. |

## Handling and interpretive limits

If approved, complete-collection retention is permitted only in the isolated
DB1 raw archive and source-preserving projection, plus the stated private
reader. Identifiers, party fields, names, and `Notes` remain source-supplied
fields observed in a named capture—not CLD variables, validated party
definitions, membership evidence, role-history evidence, or DB2 inputs.

No claim is made about completeness, freshness, field meaning, personal-data
classification, copyright, third-party rights, party affiliation, or temporal
coverage. The route-specific basis cannot transfer to another `Notes` route.

## Verification, acceptance, and stop conditions

Before the first request, verify the exact client and transport gates, D9 role
and timer, archive/manifest integrity, source-field preservation, reader raw/
write denial, anonymous denial, and continuity of D4A, D4C, D5, D6, D7, and D8.
After deployment, record the two request states, non-content metadata,
projection count/rejections, fixed-release binding, timer state, health, and
route denial. One eligible user then verifies the existing subject group,
provenance/limits, and fixed pagination.

Stop without a substitute route or retry if the route redirects, times out,
exceeds the cap, returns non-JSON/non-array content, reports an error, differs
materially from the declared route, or causes a handling, access, integrity, or
existing-cohort regression.

Excluded: Party roles detail; parties; all person/relationship routes; every
other new route; semantic party/role/history interpretation; DB2; public
access; download; generic query/search; direct SQL; charts; research release;
and shared VPS/database/Nginx changes.

## Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | DB1 contained-cohort planning after DEC-0087 closure. |
| Current authority | The owner approved DEC-0088 on 4 August 2026. Its contained D9 implementation/deployment passed and the owner accepted the stated private-beta journey. |
| Affected records if approved | D9 source route, isolated DB1 raw archive/projection, named private reader, timer, D9 result, DB1 narrative, matrix, decision register, and governance review. |
| Known uncertainty | Current source shape/size and all field semantics remain unobserved by D9; historic evidence does not establish membership, role history, coverage, or update behaviour. |
| Smallest change | One exact collection route and one named fixed release only. |
| Containment/rollback | A failed gate stops D9; no substitute route, retry, exposure expansion, or change to an existing release/timer contract. |
| Verification artefact | D9 restricted-deployment result, including non-content lineage, access, continuity, and owner-acceptance evidence. |

## Related records

- [DB1 strategic plan — DEC-0073](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [Committee roles cohort — DEC-0087](GB_SCT_DB1_COMMITTEE_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0087.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Roles and committees reconnaissance](../../../data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
