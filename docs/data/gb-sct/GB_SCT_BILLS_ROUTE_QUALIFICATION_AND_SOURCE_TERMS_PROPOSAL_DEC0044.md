# GB-SCT Bills Route Qualification and Source-Terms Proposal — DEC-0044

**Status:** Proposed — no source API route, proxy, capture, storage, database,
or application action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0044

## 1. Purpose

This is the first deliberately narrow source-facing package after DEC-0042.
It would qualify whether one data type — Scottish Parliament Bills — can
responsibly become the first private-beta upstream pass-through slice.

The scope is **not** Bills data. It is a documentation-and-terms assessment of
the two already selected Bills route forms:

| Candidate data type | Route form | What is already known | What remains unknown |
| --- | --- | --- | --- |
| Bills | `/api/bills` | The rendered catalogue lists it as a collection route for Bill Title objects. | Authority, applicable terms/licence, access conditions, permitted reuse/relay, operational limits, response shape, pagination, coverage, and field semantics. |
| Bill detail | `/api/bills/:id` | The rendered catalogue lists it as a unique-identifier route. | Identifier semantics, all other source and operational questions above. |

The route forms are part of the owner-approved DEC-0007 inventory. This does
not turn them into approved live routes.

## 2. Decision and boundary

DEC-0044 would authorise one bounded **official documentation and terms
inspection**, performed only to produce a route-qualification record. It would
permit a browser retrieval of:

1. the official API catalogue start page,
   `https://data.parliament.scot/#/api-list`; and
2. only official Scottish Parliament pages linked from that page, or clearly
   identified as the applicable official terms, copyright, licence, open-data,
   privacy, accessibility, or API-use information needed to answer the
   qualification questions below.

It does **not** permit a request to `/api/bills`, `/api/bills/:id`, or any
other API route; downloading a response; saving a page body; collection,
capture, proxying, parsing, storage, database write, code change, VPS change,
email, account action, or public/beta presentation. It must not follow
third-party material as a substitute for official terms.

## 3. Method and retained evidence

The assessor may record only a concise qualification note with official URL,
page title, access time in UTC, relevant short paraphrase or compliant short
quotation, and the conclusion for each question. It must not retain raw page
bodies, screenshots containing unnecessary personal information, cookies,
headers, credentials, API responses, or source records.

The assessment must distinguish:

- a statement visible in official terms/documentation;
- an unresolved question; and
- a project conclusion that follows from the stated evidence.

An absent statement is `UNKNOWN`, never implied permission.

## 4. Qualification questions

| Question | Required result to proceed to a later Bills route package |
| --- | --- |
| Source identity and authority | Official host/project identity is evidenced, including any identified publisher or responsible body. |
| Terms, licence, and attribution | Applicable terms and licence/reuse statement are identified; relay, caching/capture, redistribution, derivative use, attribution, and change/withdrawal conditions are either explicitly supported or marked unknown. |
| Access conditions | Authentication, technical restrictions, documented rate/volume limits, user-agent/contact requirements, and prohibited uses are identified or marked unknown. |
| Privacy and personal data | Relevant official privacy/personal-data terms are identified, and DEC-0008 handling implications are stated without assuming the route contains or excludes personal data. |
| Route documentation | The two route forms remain visibly documented; any documented parameters, response-format statement, deprecation/versioning information, and support contact are recorded. |
| Retention fit | The findings are reconciled with DEC-0008's restrictive-default, route-level handling classes. No retention/capture conclusion is made without explicit evidence. |
| Pass-through fit | A specific conclusion is made on whether a constrained relay may be proposed at all. A no/unknown result blocks pass-through rather than converting it into capture or a local dataset. |

Response schema, identifiers, field definitions, pagination behaviour,
historical coverage, freshness, and quality remain `UNASSESSED` in this
package because learning them would require an API response. They must be
handled by a later, separately approved limited endpoint-observation package,
if the terms result permits it.

## 5. Result and next gate

The output is one of:

| Result | Meaning | Consequence |
| --- | --- | --- |
| `PASS_FOR_NEXT_PROPOSAL` | Official evidence permits a carefully bounded next proposal, though operational details may remain to be observed. | Prepare an exact Bills endpoint-observation/pass-through implementation proposal; do not execute it under DEC-0044. |
| `PARTIAL_OR_CONDITIONAL` | Some evidence exists but conditions, attribution, or handling requirements constrain the route. | Record the condition and prepare a revised proposal only if the constraint can be satisfied. |
| `BLOCKED` | Licence, terms, official authority, privacy, access conditions, or pass-through permission remains unavailable or incompatible. | Do not request the endpoint or build a proxy; record the block and return to the owner. |

No `PASS_FOR_NEXT_PROPOSAL` result is a licence to retrieve Bills data. The
first actual upstream request needs its own approved package, must use the
private-beta foundation specified in DEC-0043, and must produce a separately
testable pass-through interface outcome under DEC-0042.

## 6. Stop conditions

Stop immediately if the necessary terms cannot be tied to an official source;
the task would require an API route request, a login, a cookie/credential, an
unbounded crawl, raw-page retention, or interpretation beyond the source's
stated terms; or the terms prohibit the intended relay/capture/reuse. Record
the smallest useful redacted finding and seek owner direction.

## 7. Owner decision

Approve, revise, or reject DEC-0044. Approval permits only the bounded
official documentation-and-terms inspection described here and its concise
qualification record. It does not permit any data request or implementation.
