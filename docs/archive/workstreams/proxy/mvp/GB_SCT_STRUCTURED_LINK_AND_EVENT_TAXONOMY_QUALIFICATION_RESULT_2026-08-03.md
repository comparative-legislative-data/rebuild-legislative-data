# GB-SCT Structured-Link and Event-Taxonomy Qualification Result — 3 August
# 2026

**Status:** PASS — three private-pass-through candidates; no relay enabled

**Authority:** DEC-0065

## 1. Method and boundary

This evidence-only assessment reused existing published-basis and non-content
structural/volume records. It made no source API, portal, licence,
documentation, VPS, database, or application request. It retained no source
response, value, identifier, text, byte, cache entry, fixture, download, log
body, or database row.

The published basis remains the Scottish Parliament Open Data and copyright
licence record documented under DEC-0061. Its attribution, non-endorsement,
personal-data, third-party-rights, corporate-identity, accuracy, completeness,
and continued-supply limits apply. This is a source-published position, not
legal advice, and it does not establish a route-by-route licence statement.

This result does not identify the entities represented by any identifier;
interpret link direction, relationship, taxonomy, event, committee, bill,
motion, question, answer, date, coverage, or historical meaning; determine
that a field is or is not personal data; or create a dataset, DB1/DB2 asset,
variable, or research claim.

## 2. Route handling outcomes

| Route | Existing structural/operational evidence used | Outcome | Required limit if later relayed |
| --- | --- | --- | --- |
| `/api/committeetypelinks` | Existing observation: 168 records with committee/type identifiers and no date fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined link material only; no committee-type relation, timing, membership, classification, completeness, or freshness claim. |
| `/api/motionsquestionsanswerseventtypes` | Existing observation: 2 records with `EventTypeID` and `EventType`; no date fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined event-type taxonomy only; no event meaning, classification, coverage, completeness, or freshness claim. |
| `/api/motionsquestionsanswerseventlinks` | Existing observation: 5,721 records, `ChildUniqueID`, `MainUniqueID`, and `ParentUniqueID`; 406,192 bytes; no date fields. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source-defined event-link material only; no identifier identity, link direction, relationship, event meaning, coverage, completeness, or freshness claim. |

The known structural profile has no recorded free-text, contact, or direct
person field. That is a limited observation, not a general personal-data
classification. The existing 406,192-byte event-link observation is a past
route profile, not a response-size guarantee. A later route disclosure must
carry the published licence limits and these route-specific limits visibly.

## 3. Evidence records used

- [`GB_SCT_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md`](GB_SCT_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md)
  — published Open Data/copyright-licence basis and limits under DEC-0061.
- [`../reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md`](../../../data/gb-sct/reconnaissance/GB_SCT_ROLES_COMMITTEES_RECONNAISSANCE_RESULT_2026-08-02.md)
  — existing non-content observation for Committee Type Links.
- [`../reconnaissance/GB_SCT_MQA_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md`](../../../data/gb-sct/reconnaissance/GB_SCT_MQA_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md)
  — existing non-content/volume observations for MQA Event Types and Event
  Links.
- [`GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md`](../../../data/gb-sct/reconnaissance/GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md)
  — existing detail/filter structural observations and explicit link-direction
  limitation.
- [`../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md`](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
  and the DEC-0008 retention/publication controls — route scope and no-capture
  boundary.

## 4. Consequences

Only the three named collection forms may be considered in a later separate
exact private no-retention implementation/deployment proposal. Candidate status
does not enable a route, modify the live allowlist, create a source-data
release, or validate an identifier or relationship.

MQA Event Subtypes remain unavailable because the observed `IntroText` field
needs its own handling assessment. All detail and parameterised forms remain
unavailable. No source relay, direct-link action, code, VPS state, database,
DB1/DB2, cache, email, Nginx, Cloudflare, variable, chart, export, download,
or public data release changed under DEC-0065.

## 5. What next

The next proposed step is a separate exact private implementation/deployment
package limited to `/api/committeetypelinks`,
`/api/motionsquestionsanswerseventtypes`, and
`/api/motionsquestionsanswerseventlinks`. It must preserve the accepted
six-route controls, add an event-link response-size/source-window disclosure,
and receive separate owner approval and route-by-route beta acceptance.
