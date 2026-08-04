# GB-SCT DB1 Committee Roles Collection Cohort — DEC-0087

**Status:** Proposed — owner approval required before any source, database,
code, deployment, or interface action
**Date:** 4 August 2026
**Decision requested:** DEC-0087

## Decision requested

Approve one contained D8 DB1 package for the collection-only route
`GET https://data.parliament.scot/api/committeeroles`, with no query string.
This single decision would, for this exact route only:

1. replace its present `DO_NOT_CAPTURE_OR_RELEASE` default with a restrictive
   **private DB1 source-preserving handling basis**; and
2. authorise its initial capture, one immediate reconciliation, daily
   reconciliation, fixed projection, private fixed-pagination reader, and
   owner acceptance loop.

This is not a general approval for `Notes` fields. It neither extends the
Government roles handling decision nor authorises the Committee roles detail
route, committees, member/committee relationships, or another source route.

## Why this is the next candidate

Historic reconnaissance, not a current source check, recorded a small
eight-record collection with source identifier, name, and `Notes` fields and
no date fields. It is therefore a bounded source-defined role taxonomy that
can support later institutional context, but cannot establish committee
membership, role occupancy, start/end dates, or committee history.

| Candidate | Existing evidence | Decision in this proposal |
| --- | --- | --- |
| `/api/committeeroles` | Eight records; identifier, name, `Notes`; no dates. | **Selected:** smallest bounded remaining committee-context taxonomy, subject to an exact private handling basis. |
| `/api/committees` | 169 records; names, description, contact/free-text, validity dates. | Not selected: wider free-text/contact and temporal handling questions. |
| `/api/committeeroles/:id` | One historic detail response shared the collection field set. | Not selected: a historic single-record comparison is not authority for detail access. |
| `/api/partyroles` | 548 records; identifier, party, name, `Notes`; no dates. | Not selected: larger party-context taxonomy; should be assessed separately. |
| Person/role or committee relationship routes | Relationship and/or validity-period signals. | Not selected: would invite unsupported membership, party, office, or interval claims. |

The route is selected for its bounded, source-preserving DB1 value, not as a
shortcut to DB2. DB2 remains wholly separate and is not an input to this
decision.

## Exact D8 boundary

| Control | Proposed contract |
| --- | --- |
| Route | Exact host/path above; `GET`, no query, no detail ID, and no user-supplied URL. |
| Initial and immediate check | One initial request, then one immediate request only after a successful initial result. No retry. |
| Daily schedule | One serial request every 24 hours at 04:32 UTC, with a non-overlap lock. No queued catch-up request. |
| Transport gate | Manual redirect handling; 30-second total timeout; 2 MiB body ceiling; JSON content type; top-level array required. A breach stops D8 and preserves its operational evidence. These are controls, not a current response-size or schema claim. |
| Retention | Successful bytes become immutable DB1 raw objects with manifest/digest; D8 projection preserves complete source objects and source position plus operational lineage only. No content logging. |
| Reconciliation | Compare the same fixed route/window only by raw SHA-256 and observed structure. `UNCHANGED` is limited to that completed comparison. |
| Fixed release | The named `gb_sct_committee_roles_d8_v1` release binds to the initial manifest. Later observations do not silently rewrite it. |
| Private access | Beta/superuser only; authenticated reader role; fixed server-side pagination (default 20, maximum 50); no filters, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add one clearly labelled Committee roles retained release in a single committee-context subject group. It must not duplicate an existing group or imply committee membership. It leads with route/capture/build/reconciliation provenance, observed structure, limits, and citation guidance. |

## Handling and interpretive limits

If approved, the successor handling basis permits complete-collection
retention only in the isolated project DB1 raw archive and source-preserving
projection, plus only the described private-beta reader. It does not settle
the content-level meaning, personal-data classification, copyright,
third-party rights, completeness, freshness, or semantic meaning of `Notes`.

The reader must describe identifiers, names, and `Notes` as source-supplied
fields observed in a named capture. They are not CLD variables, validated
definitions, committee assignments, historical evidence, or DB2 inputs.

## Verification and owner acceptance

Before any source request, verify the exact route constant; no-query client;
redirect/time/body/JSON gates; dedicated D8 role and timer; archive/manifest
integrity; raw-content log absence; projection source-field preservation;
reader raw/write denial; anonymous denial; and continuity of existing D4A,
D4C, D5, D6, and D7 services/timers.

After deployment, record exact request count and states, non-content capture
metadata, preservation/rejection count, fixed-release binding, timer state,
API/web health, and direct route denial. One eligible user then verifies a
single committee-context group, the retained-DB1/proxy distinction,
provenance, limits, and fixed paging.

## Exclusions and stop conditions

Excluded: `/api/committeeroles/:id`; committees; every member or relationship
route; every other new route; semantic role/committee/history interpretation;
DB2; public access; download; generic query/search; direct SQL; charts;
research release; and any shared VPS, database, or Nginx change.

Stop D8 without substituting a route or request if the source redirects, times
out, exceeds the cap, returns non-JSON/non-array content, reports an error,
differs materially from the declared route, or any handling, service, access,
integrity, or existing-cohort regression occurs.

## Approval scope

Approval would authorise only the contained D8 loop above, including ordinary
implementation and deployment corrections that do not alter the route,
request contract, retention/access class, schedule, project target, public
boundary, or claim. It does not establish a transferable `Notes` policy or
authorise future Committee roles expansion.

## Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | DB1 contained-cohort planning after DEC-0086 closure. |
| Current authority | The owner asked to proceed with preparation of the next proposal. No implementation authority exists until DEC-0087 is approved. |
| Affected records if approved | D8 source-route registry, isolated DB1 raw archive/projection, named private reader, timer, D8 result, DB1 narrative, matrix, decision register, and governance review. |
| Known uncertainty | Current source shape/size and `Notes` content remain unobserved in this package; historical evidence does not establish semantics, coverage, update behaviour, or membership history. |
| Smallest change | One exact collection route and one named fixed release only. |
| Containment/rollback | A failed gate stops D8; there is no substitute route, retry, exposure expansion, or change to existing release/timer contracts. |
| Verification artefact | A D8 restricted-deployment result will record non-content request/reconciliation, lineage, access, continuity, and owner-acceptance evidence. |

## Related records

- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [Government roles cohort — DEC-0086](GB_SCT_DB1_GOVERNMENT_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0086.md)
- [Route-level handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Roles and committees reconnaissance](../../archive/data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Master endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
