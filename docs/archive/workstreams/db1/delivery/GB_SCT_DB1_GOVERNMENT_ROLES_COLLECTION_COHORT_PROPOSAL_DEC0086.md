# GB-SCT DB1 Government Roles Collection Cohort — DEC-0086

**Status:** Closed — restricted deployment passed; owner private-beta accepted
**Date:** 4 August 2026
**Decision requested:** DEC-0086

## Decision requested

The owner approved one contained D7 DB1 package for the collection-only route
`GET https://data.parliament.scot/api/governmentroles`, with no query string.
The single decision would do two things for this exact route only:

1. replace its current `DO_NOT_CAPTURE_OR_RELEASE` default with a restrictive
   **private DB1 source-preserving handling basis**; and
2. authorise the corresponding initial capture, one immediate reconciliation,
   daily reconciliation, fixed projection, private fixed-pagination reader,
   and owner acceptance loop.

This combined form is deliberate: it is one clear, narrow owner decision,
not a general resolution of `Notes` fields or an automatic precedent for any
other route. It avoids an extra administrative loop while retaining a
route-specific handling boundary.

## Why this is the next candidate

Government roles is a bounded P2 source-defined role taxonomy that is useful
as later institutional context. It is not, by itself, evidence of who held a
ministerial office or when: that would require the separately blocked
`/api/membergovernmentroles` relationship route and later temporal rules.

Existing reconnaissance—not a current source check—observed a 251-element JSON
collection with identifier, name, and `Notes` fields, and no date fields. The
absence of date fields is why this package makes no role-history or occupancy
claim. The existing route-handling register marks `Notes` as unresolved, so
the proposed private-only handling basis is necessary before byte retention.

| Candidate | Historic structural evidence | Why it is not selected now |
| --- | --- | --- |
| `/api/governmentroles` | 251 records; identifier, name, `Notes`; no date fields. | **Selected:** bounded source-defined taxonomy, with strict private handling. |
| `/api/membergovernmentroles` | Person/role relationship and validity dates. | Remains blocked: person-linked relationship and interval/occupancy semantics. |
| `/api/memberparties` | Person/party relationship and validity dates. | Remains blocked: relationship handling and point-in-time affiliation semantics. |
| `/api/committees` | Description, contact, free text, validity fields. | Remains blocked: contact/description handling. |
| `/api/committeeroles` | Eight records; identifier, name, `Notes`. | A later small taxonomy candidate; not bundled merely because it shares a `Notes` signal. |

## Exact D7 boundary

| Control | Proposed contract |
| --- | --- |
| Route | Exact host/path above; `GET`, no query, no detail ID, no user-supplied URL. |
| Initial and immediate check | One initial request, then one immediate request only after a successful initial result. No retry. |
| Daily schedule | One serial request every 24 hours at 04:17 UTC, with a non-overlap lock. No queued catch-up request. |
| Transport gate | Manual redirect handling; 30-second total timeout; 2 MiB body ceiling; JSON content type; top-level array required. A breach stops D7 and preserves the evidence. These are operating controls, not a current size/shape claim. |
| Retention | Successful bytes become immutable DB1 raw objects with manifest/digest; D7 projection retains source objects and source position plus operational lineage only. No content logging. |
| Reconciliation | Same fixed route/window only; compare raw SHA-256 and observed structure. `UNCHANGED` is limited to that completed comparison. |
| Fixed release | The displayed release binds to the initial manifest. Later scheduled observations do not silently rewrite the release. |
| Private access | Beta/superuser only; authenticated reader role; server-side fixed pagination, default 20 and maximum 50, no filters, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add one Government roles retained release under the existing **Parties and government roles** subject group. It leads with route/capture/build/reconciliation provenance, observed structure, limits, and citation guidance. |

## Proposed handling and interpretive limits

If approved, the successor handling basis permits retention of the complete
collection only in the isolated project DB1 raw archive and source-preserving
projection, and only the described private-beta projection reader. It does not
settle the content-level meaning, personal-data classification, copyright,
third-party rights, completeness, freshness, or semantic meaning of `Notes`.
Those limitations remain visible in the interface and records.

The reader must state that `Notes`, identifiers, and names are source-supplied
fields observed in a named capture—not CLD variables, validated role
definitions, office-holder data, historical role evidence, or DB2 inputs.

## Acceptance and verification

Before the first request, verify the exact route constant; no-query client;
redirect/time/body/JSON gates; dedicated D7 role and timer; archive/manifest
integrity; raw-content log absence; projection source-field preservation;
reader raw/write denial; anonymous denial; existing D4A/D4C/D5/D6 timer and
service continuity; and the absence of the detail and relationship routes.

After deployment, record the exact request count, states, non-content capture
metadata, preservation/rejection count, fixed-release binding, timer state,
API/web health, and direct route denial. One eligible user then verifies the
single subject grouping, DB1/proxy distinction, provenance, and pagination.

## Exclusions and stop conditions

Excluded: `/api/governmentroles/:id`; every relationship route; every other
new route; semantic role/office/history interpretation; DB2; public access;
download; generic query/search; direct SQL; charts; research release; and any
shared VPS/database/Nginx change.

Stop D7 without substituting a route or request if the source redirects,
times out, exceeds the cap, returns non-JSON/non-array content, reports an
error, differs materially from the declared route, or any handling, service,
access, integrity, or existing-cohort regression occurs.

## What approval authorised

Only the D7 loop above, including ordinary contained implementation and
deployment corrections that do not alter route, request contract, retention/
access class, schedule, project target, public boundary, or claim. It does not
authorise a future Government roles expansion or establish a transferable
`Notes` policy. The deployment result is linked below; the owner completed the
defined private-beta acceptance check on 4 August 2026.

## Related records

- [DB1 strategic plan — DEC-0073](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [Bills collection result — DEC-0085](GB_SCT_DB1_BILLS_COLLECTION_COHORT_RESULT_DEC0085_2026-08-04.md)
- [Government roles cohort result — DEC-0086](GB_SCT_DB1_GOVERNMENT_ROLES_COLLECTION_COHORT_RESULT_DEC0086_2026-08-04.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
