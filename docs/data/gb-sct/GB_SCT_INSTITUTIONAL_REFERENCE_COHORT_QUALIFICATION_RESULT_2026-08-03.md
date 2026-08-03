# GB-SCT Institutional Reference Cohort Qualification Result — 3 August 2026

**Status:** PASS — three private-pass-through candidates; four routes blocked
pending handling assessment; no relay enabled

**Authority:** DEC-0063

## 1. Method and boundary

This evidence-only assessment reused the existing published-basis record and
the two existing non-content structural reconnaissance records. It made no
source API, portal, licence, documentation, VPS, database, or application
request. It retained no source response, value, identifier, text, byte, cache
entry, fixture, download, log body, or database row.

The published basis remains the Scottish Parliament Open Data and copyright
licence record already documented under DEC-0061. That record carries forward
the requirements to attribute the source and not imply endorsement, alongside
the exclusions or limits for personal data, third-party rights, corporate
identity, accuracy, completeness, and continued supply. It is a source-
published position, not legal advice, and it does not establish a route-by-
route licence statement.

This result does not interpret identifiers, labels, dates, validity fields,
relationships, or free text; determine that any field is or is not personal
data; establish source completeness, history, currentness, or freshness; or
create a dataset, DB1/DB2 asset, variable, or research claim.

## 2. Route handling outcomes

| Route | Existing structural evidence used | Outcome | Limit if later relayed |
| --- | --- | --- | --- |
| `/api/constituencies` | Existing observation: 223-element fixed collection with identifier, names/codes, region, and validity-period fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined geographic reference only; no geographic, validity-date, coverage, or temporal-semantic claim. |
| `/api/regions` | Existing observation: 29-element fixed collection with identifier, name/code, and start/end-date fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined regional reference only; no date-boundary, coverage, or temporal-semantic claim. |
| `/api/committeetypes` | Existing observation: 3-element fixed collection with identifier and name fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined taxonomy only; no classification, completeness, or historical-meaning claim. |
| `/api/parties` | Existing observation: 14-element fixed collection with identifier, names/abbreviation, `Notes`, validity-period fields, and observed-null relationship placeholders. | `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING` | The existing evidence does not safely resolve handling of the `Notes` field. No narrow relay is proposed. |
| `/api/partyroles` | Existing observation: 548-record fixed collection with identifier, party, name, and `Notes` fields. | `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING` | The existing evidence does not safely resolve handling of the `Notes` field. No narrow relay is proposed. |
| `/api/governmentroles` | Existing observation: 251-record fixed collection with identifier, name, and `Notes` fields. | `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING` | The existing evidence does not safely resolve handling of the `Notes` field. No narrow relay is proposed. |
| `/api/committeeroles` | Existing observation: 8-record fixed collection with identifier, name, and `Notes` fields. | `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING` | The existing evidence does not safely resolve handling of the `Notes` field. No narrow relay is proposed. |

For the three candidates, the observed absence of person/contact fields is a
limited structural fact only. It is not a personal-data classification. Any
later route disclosure must visibly carry the source attribution,
non-endorsement, personal-data, third-party-rights, no-warranty, source-
semantic, completeness, and freshness limitations.

## 3. Evidence records used

- [`GB_SCT_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md`](GB_SCT_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md)
  — published Open Data/copyright-licence basis and its limits, recorded under
  DEC-0061.
- [`GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md`](GB_SCT_CONTEXTUAL_REFERENCE_RECONNAISSANCE_RESULT_2026-08-02.md)
  — existing non-content observations for Constituencies, Regions, and
  Parties.
- [`GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md`](GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
  — existing non-content observations for Party Roles, Government Roles,
  Committee Roles, and Committee Types.
- [`GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md`](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
  and the retention/publication policy proposed under DEC-0008 — route-scope
  and no-capture/publication controls.

## 4. Consequences

Only the three named candidate collection forms may be considered in a later,
separate exact private no-retention implementation/deployment proposal. They
are not live source actions, source-data releases, retained records, or
validated research inputs.

The four `Notes`-bearing forms remain unavailable. They are not retired from
the approved inventory and are not replaced by a cache, DB1 copy, inferred
record, or broader cohort access. Detail forms and every route outside this
cohort remain unchanged and unavailable pending their own qualification.

No source relay, direct-link action, code, VPS state, database, DB1/DB2,
cache, email, Nginx, Cloudflare, variable, chart, export, or public data
release changed under DEC-0063.

## 5. What next

The next proposed step is a separate, exact private implementation/deployment
package limited to `/api/constituencies`, `/api/regions`, and
`/api/committeetypes`. It must reuse the accepted no-retention controls and
receive separate owner approval and route-by-route beta acceptance. The four
blocked forms require a later route-specific terms/handling evidence plan;
they must not be included in that implementation package.
