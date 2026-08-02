# GB-SCT Bills Official-Documentation Recovery Result — 2 August 2026

**Status:** PARTIAL_OR_CONDITIONAL — route blocks retained

**Authority:** DEC-0052, approved by the project owner on 2 August 2026

**Scope:** G1–G3 official-documentation recovery only

## 1. Execution and containment result

The DEC-0052 inert output-procedure preflight passed using procedure version
`DEC0052-output-v1`. It accepted both direct-text and structured-text result
shapes using a static non-source test string. No test content was retained.

After that pass, each of the four exact approved pages was requested once,
sequentially, on 2 August 2026. Each yielded a rendered page representation
without a redirect, login, credential, cookie, link-following instruction, API
route call, query, source-data request, capture, screenshot, database/proxy,
frontend, VPS, account, email, or public action. No page body, raw HTML,
header, cookie, source value, identifier, response digest, browser history, or
tool transcript is retained in this project record.

## 2. Limited documentation evidence

| Page | Access outcome | Limited relevant evidence retained | Qualification consequence |
| --- | --- | --- | --- |
| `https://data.parliament.scot/#/api-list` | Rendered shell reached | The page identified the service as Scottish Parliament Open Data but exposed no Bills-route documentation in its rendered result. | Does not establish G2 or G3. |
| `https://data.parliament.scot/Accessibility.html` | Rendered page reached | The Open Data website's accessibility statement identifies the Scottish Parliament Corporate Body (SPCB) as the body running that website. It also records accessibility limitations affecting parts of the site. | Supports a limited statement of site operation, not Bills-route licence coverage, API operating conditions, or route semantics. |
| `https://www.parliament.scot/about/copyright` | Rendered page reached | The Scottish Parliament copyright page states a reuse licence for information it publishes, requires source attribution and non-endorsement, and lists exclusions including personal data and third-party rights. It identifies the SPCB as licensor. The page also links its open-data offering as machine-readable parliamentary information. | Supports general reuse conditions, but does not expressly attach them to either Bills route or settle field-level exclusions. |
| `https://www.parliament.scot/privacy` | Rendered page reached | The SPCB privacy statement describes its general handling, retention, and rights framework for personal data. | Does not classify either Bills-route response, authorise this project's processing, or resolve G4–G5. |

The retained statements are concise paraphrases of page-specific information.
They do not preserve a page body or assert a fact beyond the listed page.

## 3. G1–G3 conclusion

| Gap | Status | Supported conclusion |
| --- | --- | --- |
| G1 — source authority and licence coverage | `PARTIAL_OR_CONDITIONAL` | The SPCB is identified as operating the Open Data website and as licensor for information it publishes. The stated licence has attribution, non-endorsement, personal-data, and third-party-rights limits. The evidence does **not** establish that the licence applies to `/api/bills` or `/api/bills/:id`, or to every field/value those routes may return. |
| G2 — request and technical conditions | `UNRESOLVED` | None of the four pages established authentication, rate/volume, parameters, caching, redistribution, versioning, deprecation, availability, or prohibited-use conditions for either Bills route. This is not evidence that such conditions are absent. |
| G3 — field definitions and identifier semantics | `UNRESOLVED` | The rendered catalogue shell did not document a Bills route or its parameters, fields, identifiers, collection/detail relationship, errors, or pagination. No conclusion is drawn from the prior value-free observations. |

## 4. Route and programme consequence

Both `/api/bills` and `/api/bills/:id` remain
`DO_NOT_CAPTURE_OR_RELEASE`. This result does not revise the retention,
personal-data, proxy, DB1, DB2, Tier 1/2, frontend, beta/public, or source
handling position. It records no conclusion about source completeness,
stability, continuing availability, or research suitability.

## 5. Next gate

The smallest proposed next step is a documentation-only **G4 Bills handling
assessment** that considers the limited G1 evidence, the unresolved G2–G3
position, the two value-free observations, and the approved DEC-0008 policy.
It must preserve both route blocks and requires a new explicit owner approval.
No further external documentation request is proposed by this result.
