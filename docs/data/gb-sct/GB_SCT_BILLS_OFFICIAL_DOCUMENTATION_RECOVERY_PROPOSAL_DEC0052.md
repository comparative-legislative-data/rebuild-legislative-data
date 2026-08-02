# GB-SCT Bills Official-Documentation Recovery Proposal — DEC-0052

**Status:** Proposed — no external action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision sought:** DEC-0052

## 1. Purpose and pre-flight

| Gate item | Record |
| --- | --- |
| Active phase and approved programme scope | DEC-0050 Bills-family qualification plan; this is a recovery package for G1–G3 only. |
| Authority for proposal preparation | Owner instruction to proceed following the DEC-0051 stop record. This authority is documentation-only. |
| Affected records | DEC-0044, DEC-0045 Bills rows, DEC-0047, DEC-0049–DEC-0051, RSK-0033–0034, and one later concise recovery result. |
| Known uncertainty and risk | DEC-0051 exhausted its one-attempt limit before a page-specific result could be safely recorded. G1–G3 remain unresolved; a repeat under DEC-0051 is prohibited. |
| Smallest proposed change and containment | Validate the non-content evidence-output procedure without a network request, then make at most one **fresh** direct request to each named page, sequentially. Stop before the first page if the procedure cannot safely handle the tool result. |
| Verification artefact | Dated recovery result recording the local procedure-preflight outcome, each permitted URL's access outcome, limited supported evidence/limitation status, G1–G3 conclusion, and route-block consequence. |

This is a new proposed package, not an adaptation or retry under DEC-0051.
It does not change the fact that DEC-0051 is exhausted. It does not relax the
two Bills-route handling blocks.

## 2. Recovery method and exact boundary

### 2.1 Non-network output-procedure preflight

Before any external request, the assessor may perform one local, inert
procedure check using a static non-source test string. It must confirm that the
inspection process will:

1. accept a direct-text tool result as well as a structured content result;
2. extract only the permitted, concise evidence listed in section 3;
3. stop on an unrecognised or unsafe result shape before issuing any page
   request; and
4. create no persistent file, log, screenshot, or other artefact containing
   the test string or source content.

The result need record only `PASS` or `BLOCKED` and the procedure version. A
`BLOCKED` preflight terminates the package: no page request is permitted.

### 2.2 Fresh, bounded official-page inspection

If and only if the preflight passes, the assessor may request the following
exact HTTPS pages, in this order, once each and one at a time:

1. `https://data.parliament.scot/#/api-list`
2. `https://data.parliament.scot/Accessibility.html`
3. `https://www.parliament.scot/about/copyright`
4. `https://www.parliament.scot/privacy`

Each is a fresh, separately authorised recovery attempt under DEC-0052. No
attempt may be repeated under DEC-0052. A page stop does not authorise another
page, a second request, or any adaptation. The assessor must not follow a
redirect or link, alter a URL, query an API route, use a saved session,
credential, cookie, search engine, form, contact channel, third-party source,
or direct contact with the Scottish Parliament.

The package excludes `/api/bills`, `/api/bills/:id`, all other API routes,
source-record retrieval, crawling, raw-page storage, screenshots, browser
history, source-data parsing, source-data capture, proxy/DB1/DB2 work,
frontend work, VPS/database work, account/email work, and public action.

## 3. Permitted questions and retained evidence

| Gap | Question | Permitted retained evidence and conclusion |
| --- | --- | --- |
| G1 — source authority and licence coverage | Does the page explicitly identify a relevant data operator, applicable reuse condition, attribution, non-endorsement, withdrawal, or other restriction pertinent to Bills use? | Exact page URL, access time, access outcome, and concise paraphrase of an explicit condition; `EVIDENCED`, `PARTIAL_OR_CONDITIONAL`, `UNKNOWN`, or `BLOCKED`. |
| G2 — request and technical conditions | Does the page explicitly state authentication, rate/volume, parameters, user-agent/contact, caching/redistribution, versioning, deprecation, availability, or prohibited-use conditions? | Exact page URL, access time, access outcome, and concise paraphrase of an explicit condition; otherwise `UNKNOWN`. Silence never establishes absence. |
| G3 — field definitions and identifier semantics | Does the catalogue explicitly document either Bills route form, parameters, response format, fields, identifier stability, collection/detail relationship, errors, or pagination? | Exact page URL, access time, access outcome, and concise paraphrase of an explicit documentation fact; otherwise `UNKNOWN`. No semantic conclusion may be drawn from a field name or prior sample. |

No project record may retain a page body, raw HTML, screenshot, page-wide
extract, cookie, header, credential, source value, identifier, response digest,
browser history, or tool transcript. A short quotation is allowed only where
needed to preserve an exact material condition and must be minimal; paraphrase
is preferred. The recovery result must distinguish an access failure, an
output-procedure failure, generic wording, and page silence.

## 4. Stop rules and operational consequences

Stop the entire package immediately, without issuing a page request, if the
non-network preflight is `BLOCKED`. Stop the affected page without adaptation
if an exact URL changes, the page redirects, authentication/cookies are
required, the tool output is unsafe or unrecognised, or page-wide/raw content
would have to be retained to answer a question. Record the stop concisely and
continue only where doing so stays within the unconsumed, independently listed
page attempt and does not require a changed method.

No result under DEC-0052 may itself authorise retention, capture, pass-through,
DB1, DB2, a canonical variable, frontend output, beta/public access, or a less
restrictive route-handling class. Any unresolved material condition preserves
`DO_NOT_CAPTURE_OR_RELEASE` for the affected Bills route. A later handling
revision needs its own owner-approved decision after the G1–G5 sequence.

## 5. Acceptance and next gate

The result is `PASS`, `PARTIAL_OR_CONDITIONAL`, `FAILED`, or `BLOCKED` for the
recovery package only. `PASS` means the procedure and any attempted pages
stayed within this boundary; it does not establish that G1–G3 are resolved or
that either Bills route may be used.

The result must update the G1–G3 position in DEC-0050, the Bills matrix rows,
and relevant registers only with direct, retained support. If G1–G3 are not
all resolved, the smallest next step is a documentation-only G4 handling
assessment or a new exact evidence proposal, depending on the stated gap. Any
external, data, system, or release action requires separate explicit owner
approval.

## 6. Owner decision

DEC-0052 is **proposed**. If approved, it authorises only the local inert
procedure preflight and the exact, fresh, one-attempt-per-page inspection
described above. It does not authorise any API request, data capture,
retention, database/proxy/frontend/VPS work, account/email action, or public
claim.
