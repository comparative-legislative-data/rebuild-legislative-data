# GB-SCT Bills Detail Observation Result — 2 August 2026

**Status:** `PASS` — preliminary value-free detail-route observation only

**Authority:** DEC-0048, approved by the project owner on 2 August 2026

**Observation time (UTC):** 2026-08-02T11:40:01.769Z

**Scope performed:** The exact two-request transient observation authorised by
DEC-0048: one no-query collection request used only to select a non-retained
numeric identifier, followed by one no-query detail request. No redirect,
retry, credential, cookie, browser session, parameter, other route, capture,
storage, database, proxy, frontend, VPS, account, or public action occurred.

## 1. Containment and disposal

Both responses were decoded in memory only. The collection response was used
only to apply the approved first-element numeric-`ID` selection rule. Its
identifier, all source values, and the resolved detail URL were not retained,
printed, logged, written to a file, placed in Git, stored in a database, or
sent to another service. The transient observer was removed after completion.

The retained result below contains only transport metadata and value-free
response-shape information. It is not a raw capture, source registry release,
DB1 manifest, operational projection, dataset, pass-through response, or
public claim.

## 2. Transport result

| Request position and route form | Outcome | HTTP | Content type | Declared / received length | Elapsed time |
| --- | --- | --- | --- | --- | ---: |
| 1 — `/api/bills` collection selection | `SELECTION_PASS` | `200` | `application/json; charset=utf-8` | `99,823` / `99,823` bytes | 452 ms |
| 2 — `/api/bills/:id` detail observation | `DETAIL_PASS` | `200` | `application/json; charset=utf-8` | `229` / `229` bytes | 107 ms |

No redirect was followed, no retry was made, no compression was declared, and
neither response approached the 2 MiB ceiling. This is one bounded
observation, not an availability, latency, rate-limit, freshness, coverage, or
completeness claim.

## 3. Value-free detail response shape

The detail response was a top-level JSON object. It had seven observed fields;
each was present once. No nested object keys were observed.

| Field name | Observed JSON type(s) | Null count | Restrictive risk flag | Interpretation status |
| --- | --- | ---: | --- | --- |
| `BillTypeID` | `number` | 0 | Identifier-like field name | Name/type observed; meaning unassessed. |
| `FullName` | `string` | 0 | Potential free-text or name field | Name/type observed; content and classification unassessed. |
| `ID` | `number` | 0 | Identifier-like field name | Name/type observed; stability and meaning unassessed. |
| `PersonID` | `number` | 0 | Identifier-like; potential person or third-party field | Restrictive-default handling remains required. |
| `Reference` | `string` | 0 | None inferred from field name | Name/type observed; meaning and content unassessed. |
| `ShortName` | `string` | 0 | Potential free-text or name field | Name/type observed; content and classification unassessed. |
| `ThirdPartyOrganisation` | `null` | 1 | Potential person or third-party field | Restrictive-default handling remains required. |

The observed single-record null state is not a claim about any source field's
definition, distribution, or null semantics. A restrictive risk flag is not a
legal, semantic, or personal-data classification.

## 4. Consequences and remaining unknowns

The observation establishes only that one transiently selected detail request
returned a JSON object with the listed field names/types under the declared
conditions. It does not establish route semantics, bill identity, stable ID
behaviour, collection-to-detail parity, historical coverage, source-field
definitions, data accuracy, completeness, permitted rate, retention fit,
licence coverage of each field, or Tier 1/2 eligibility.

`PersonID`, `ThirdPartyOrganisation`, and unassessed string content mean the
detail route cannot move to capture, DB1, pass-through, native access,
canonical output, beta output, or public output. The DEC-0047 collection route
remains `DO_NOT_CAPTURE_OR_RELEASE`; this result does not assign a less
restrictive handling class to either route.

## 5. Next gate

The next proposed step is a documentation-only **Bills detail route-handling
assessment**. It should apply the DEC-0008 template to `/api/bills/:id`, use
this result and DEC-0044 terms evidence, and decide whether the route must
remain `DO_NOT_CAPTURE_OR_RELEASE`. It must not make another source request or
authorise capture, DB1, pass-through, frontend, or public output.
