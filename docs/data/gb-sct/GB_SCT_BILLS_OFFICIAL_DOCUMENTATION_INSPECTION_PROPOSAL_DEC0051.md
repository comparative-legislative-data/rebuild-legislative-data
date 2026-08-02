# GB-SCT Bills Official-Documentation Inspection Proposal — DEC-0051

**Status:** Proposed — no API route, source-data request, capture, proxy, DB1,
DB2, frontend, or public action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0051

## 1. Purpose and pre-flight

| Gate item | Record |
| --- | --- |
| Active phase and approved programme scope | DEC-0050 Bills-family qualification plan, G1–G3 only. |
| Authority for proposal preparation | DEC-0050 is approved planning control; no external inspection is authorised yet. |
| Affected records | DEC-0044 result; DEC-0045 Bills rows; DEC-0047/DEC-0049 assessments; DEC-0050; and one later concise inspection result. |
| Known uncertainty and risk | Generic licence evidence and transient samples do not establish route-specific licence coverage, technical conditions, field definitions, or identifier semantics. |
| Smallest proposed change and containment | Inspect four already identified official pages once each, without following links or calling an API route. Retain a concise non-content note only. |
| Verification artefact | Dated G1–G3 result listing the four attempted URLs, access outcome, concise evidence/limitation status, and route-block consequence. |

The purpose is to test only whether these four pages contain explicit evidence
relevant to G1–G3. It is not an attempt to reclassify data, discover API
content, or work around the Bills route blocks.

## 2. Exact external-inspection scope

If DEC-0051 is approved, the assessor may retrieve only these HTTPS pages, at
most once each, with no redirect or link-following:

1. `https://data.parliament.scot/#/api-list`
2. `https://data.parliament.scot/Accessibility.html`
3. `https://www.parliament.scot/about/copyright`
4. `https://www.parliament.scot/privacy`

No login, credential, cookie, saved browser session, query, request body, API
endpoint, form submission, contact, email, external search, third-party page,
or direct contact with the Scottish Parliament is permitted. A redirect,
authentication requirement, unexpected host, or need to follow a link stops
that page without adaptation.

The package excludes `/api/bills`, `/api/bills/:id`, every other API route,
source-record retrieval, page crawling, source-data parsing, screenshots,
raw-page storage, and all system/application work.

## 3. Questions and retained result

| Gap | Inspection question | Permitted conclusion |
| --- | --- | --- |
| G1 | Is there an explicit official statement identifying the Open Data operator, applying a licence/reuse condition to the named data service, or stating attribution/non-endorsement/withdrawal constraints relevant to Bills use? | `EVIDENCED`, `PARTIAL_OR_CONDITIONAL`, `UNKNOWN`, or `BLOCKED`, with official URL and concise paraphrase. |
| G2 | Is there an explicit official statement about authentication, rate/volume, parameters, user-agent/contact, caching/redistribution, redirects, versioning, deprecation, availability, or prohibited use? | The stated condition, or `UNKNOWN`; never a claim that an undocumented condition does not exist. |
| G3 | Does the catalogue explicitly document either Bills route form, parameter meaning, response format, field definition, identifier stability, collection/detail relationship, error behaviour, or pagination? | The stated documentation fact, or `UNKNOWN`; never a semantic conclusion from field names or samples. |

The result may retain page URL, access time in UTC, page title, access outcome,
concise paraphrase or compliant short quotation, relevant existing link text,
and per-gap conclusion. It must not retain page bodies, screenshots, cookies,
headers, credentials, source-data values, API responses, identifiers, response
digests, or browser history. Page silence or generic wording is `UNKNOWN`, not
permission.

## 4. Execution controls and stop conditions

Each page has one attempt only. Use a truthful project-maintainer browser or
HTTP identity only if the client requires one. Do not retry, broaden the URL
list, change host, use a search engine, or pursue a result through an API
route.

Stop the affected page and record `BLOCKED` or `FAILED` if its exact URL would
change; a redirect/link follow, query, cookie/credential, source response,
page-body retention, screenshot, external contact, or content outside the
listed questions becomes necessary. Stop the whole package if a concise
non-content note cannot safely be produced. No failure justifies another
attempt or alternative source.

## 5. Result and next gate

The result is `PASS`, `PARTIAL_OR_CONDITIONAL`, `FAILED`, or `BLOCKED` for this
inspection only. `PASS` means the four-page inspection occurred within scope;
it does not mean G1–G3 are resolved or that either Bills route may be used.

The result updates DEC-0050 G1–G3 and the two handling records only with
supported conclusions. If an essential gap remains unresolved, both routes
remain `DO_NOT_CAPTURE_OR_RELEASE`. Any later handling revision, official
clarification request, technical observation, capture, proxy, DB1, DB2,
frontend, or public action needs its own exact owner approval.

## 6. Owner decision

DEC-0051 is `PROPOSED`. Owner approval is required before any page is opened.
Approval applies only to the page list, questions, retention boundary, and
stop conditions stated here.

