# GB-SCT Structured-Link and Event-Taxonomy Qualification Proposal — DEC-0065

**Status:** PROPOSED — no additional source route is enabled

**Version:** 1.0.0

**Prepared:** 3 August 2026

**Decision requested:** DEC-0065, following DEC-0042, DEC-0045,
DEC-0055–DEC-0057, and completed DEC-0061–DEC-0064.

## 1. Decision requested

Approve an evidence-only qualification package for these fixed, no-query
collection routes:

| Project route ID | Fixed source path | Existing non-content observation | Possible later relay purpose |
| --- | --- | --- | --- |
| `committee-type-links.collection` | `/api/committeetypelinks` | 168 records; committee/type identifiers; no date fields recorded. | Raw source-defined committee/type link material. |
| `mqa-event-types.collection` | `/api/motionsquestionsanswerseventtypes` | 2 records; `EventTypeID` and `EventType`; no date fields recorded. | Raw source-defined event-type taxonomy. |
| `mqa-event-links.collection` | `/api/motionsquestionsanswerseventlinks` | 5,721 records; `ChildUniqueID`, `MainUniqueID`, and `ParentUniqueID`; 406,192 bytes; no date fields recorded. | Raw source-defined event-link material. |

Approval authorises only the existing-evidence assessment below. It does not
enable a route, request an API endpoint, access the VPS, change code, write a
database, create DB1/DB2, retain source material, or create a variable, chart,
export, download, or public release.

## 2. Why this is the smallest next assessment

These three forms are the remaining observed fixed no-query taxonomy/link
collections with no recorded free-text, contact, or direct person fields. They
are useful navigation/context sources for later work, but no relationship,
direction, classification, committee, bill, motion, question, answer, event,
or temporal meaning is established by that fact.

The proposal deliberately excludes:

- MQA Event Subtypes because the existing structural record includes an
  `IntroText` field whose handling and semantic implications are unassessed.
- Every detail form and every parameterised event-link/filter form because its
  identifier/query contract needs separate qualification.
- Members, representation/party/government relationships, Committees,
  Parties, Party Roles, Government Roles, and Committee Roles because of
  person, contact, validity, relationship, or `Notes`-field concerns.
- Events, motions, questions, supports, business motions, reports, and votes
  because their volume, content, or route contract differs materially.

No route is retired or assigned Tier 1/2 analytical meaning by this selection.

## 3. Qualification work if approved

### Q1 — existing-evidence review only

Use only repository records: the DEC-0061 published-basis result; the MQA
first-pass and high-volume-route reconnaissance results; the roles/committees
reconnaissance result; DEC-0045; and the retention/publication policy. No new
API, portal, licence, documentation, source, or VPS request is permitted.

For each named route, record its fixed path/no-query evidence; relevant source
licence attribution, non-endorsement, personal-data, third-party-rights, and
no-warranty limits; any content/handling concern; and every semantic claim not
made.

### Q2 — route-by-route handling outcome

Each route must end as exactly one of:

- `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE`;
- `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING`; or
- `UNAVAILABLE_PENDING_FURTHER_EVIDENCE`.

Candidate status means only that a later exact private no-retention
implementation/deployment package may be proposed. It is not live access,
source retention, a dataset, a resolved link direction, an event taxonomy
definition, or a research finding.

## 4. Candidate threshold and stop conditions

| Question | Candidate threshold | Stop condition |
| --- | --- | --- |
| Path/transport | Existing evidence supports the fixed no-query JSON collection form. | Material contradiction or unresolved request-shape issue. |
| Published basis | The existing Scottish Parliament Open Data/licence record is traceable and its limits can be carried forward. | Route-specific rights/terms contradict narrow private pass-through, or applicability cannot be stated honestly. |
| Handling | No known free-text, contact, person, or other route-specific concern prevents transient approved-user viewing. | Identifier/link handling uncertainty is material, or any unassessed content concern emerges from the existing record. |
| Meaning | The route can be described only as source-defined taxonomy/link material. | Any need to infer identity, relationship direction, membership, bill linkage, event meaning, coverage, or temporal semantics. |
| Operations | Existing evidence supports a no-buffering request-time relay without parameter handling. | Response class/volume or source behaviour needs a distinct operational contract. |

An unresolved route remains visibly unavailable and is not substituted with a
cache, DB1 copy, inferred record, or broader cohort access.

## 5. Later implementation boundary — not authorised here

If candidates result and the owner separately approves a new package, it must
reuse the accepted six-route controls: exact allowlist; fixed origin/path;
no parameters; fixed request headers; manual redirects; no retry; bounded
timeout; beta-only access; source-faithful streaming; no persistence;
transparent relay/direct actions; dated non-live field guides; project-only
API/web-service deployment; and route-by-route owner acceptance.

For the event-link collection, that later package must state its response-size
and source-window control and must not infer link direction or meaning.

## 6. Explicit exclusions

- Any source/API/portal/document request, source-client code, relay change,
  VPS action, secret use, database connection/write, cache, email, Nginx,
  Cloudflare, or public access change.
- Every route not named in Section 1, including all detail and parameterised
  forms.
- DB1, DB2, capture, retention, data release, schema validation, variable,
  join, calculation, chart, export, download, or research claim.
- Interpretation of identifiers, event links, relationships, membership,
  classification, dates, coverage, or historical meaning.

## 7. Result and next step

The result will contain only existing-evidence citations, route handling
outcomes, and disclosed limits. If candidates result, the next step is a
separate exact private implementation/deployment proposal for those routes. If
none qualify, the catalogue will state that outcome transparently and the next
step is a route-specific evidence plan. DB1 remains blocked pending broader
proxy-phase acceptance.
