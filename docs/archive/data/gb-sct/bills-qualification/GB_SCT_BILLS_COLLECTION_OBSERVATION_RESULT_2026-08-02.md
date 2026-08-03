# GB-SCT Bills Collection Observation Result — 2 August 2026

**Status:** `PASS` — preliminary value-free route observation only

**Authority:** DEC-0046, approved by the project owner on 2 August 2026

**Observation time (UTC):** 2026-08-02T10:29:08Z

## 1. Scope and disposal confirmation

Exactly one unauthenticated `GET` request was made to
`https://data.parliament.scot/api/bills`. It used no query parameters,
credentials, cookies, redirects, or retries. The response was decoded in memory
to derive the value-free summary below; raw bytes and source values were not
written to disk, terminal, Git, a database, a browser, or any external service.
The transient observer was removed after completion.

This result is not a raw capture, DB1 manifest, source registry release,
operational projection, pass-through response, dataset, or public claim.

## 2. Transport result

| Property | Observed result |
| --- | --- |
| Outcome | `PASS` |
| HTTP result | `200` (`2xx`) |
| Redirect followed | No |
| Retry count | `0` |
| Content type | `application/json; charset=utf-8` |
| Content encoding | None declared |
| Declared and received length | `99,823` bytes |
| Observation elapsed time | `385 ms` |
| 2 MiB ceiling | Not approached |
| Persistence/value retention | None |

This is one bounded observation, not a latency, availability, freshness,
completeness, or rate-limit claim.

## 3. Value-free response shape

The top-level JSON kind was an array with `473` returned elements. No
top-level pagination, cursor, total-count, link, error, or metadata key can
exist in an array root; this does not establish that the route is unpaginated
in all circumstances or represents a complete collection.

Each returned array element was an object. The union of observed field names,
types, and null counts was:

| Field name | Observed JSON type(s) | Present | Null count | Interpretation status |
| --- | --- | ---: | ---: | --- |
| `BillTypeID` | `number` | 473 | 0 | Field name/type observed; meaning unassessed. |
| `FullName` | `string` | 473 | 0 | Field name/type observed; meaning unassessed. |
| `ID` | `number` | 473 | 0 | Identifier-like field name/type observed; semantics unassessed. |
| `PersonID` | `number`, `null` | 473 | 24 | Identifier-like name/type; restrictive-default handling required. |
| `Reference` | `string` | 473 | 0 | Field name/type observed; meaning unassessed. |
| `ShortName` | `string` | 473 | 0 | Field name/type observed; meaning unassessed. |
| `ThirdPartyOrganisation` | `string`, `null` | 473 | 449 | Field name/type; third-party/personal-data implications unassessed. |

No nested object keys were observed for these seven fields. No value, title,
identifier, person name, organisation name, or payload excerpt is retained.

## 4. Consequences and remaining unknowns

The observation provides a preliminary transport/schema contract only. It does
not establish field semantics, Tier 1 variables, completeness, historical
coverage, stable IDs, or pass-through/capture suitability. `PersonID` and
`ThirdPartyOrganisation` require restrictive-default route handling until a
formal assessment. No detail route, pass-through, capture, DB1, DB2, account,
frontend, proxy, database, or public action is enabled by this result.

The next source package, if approved, should be either a formal Bills
route-handling assessment or one equally bounded `/api/bills/:id` observation
using an explicitly chosen identifier and revised data-handling boundary.
