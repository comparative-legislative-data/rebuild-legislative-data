# GB-SCT Bills Collection Observation Proposal — DEC-0046

**Status:** Proposed — no source request has occurred

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0046

## 1. Purpose

This is the first source-response reconnaissance package. Its sole purpose is
to establish the observable transport and value-free response contract for the
Bills collection route before any frontend, pass-through, DB1, DB2, account,
or infrastructure implementation begins.

It is deliberately narrower than a capture. The response is inspected in
memory to produce a small schema/transport observation record, then discarded.
No response bytes or source values become a project artefact.

## 2. Exact authority requested

DEC-0046 would permit exactly one unauthenticated HTTPS `GET` request:

| Field | Authorised value |
| --- | --- |
| Upstream URL | `https://data.parliament.scot/api/bills` |
| Method | `GET` only |
| Query parameters | None |
| Request body | None |
| Authentication/cookies | None; do not use browser login/session state or credentials |
| Retry policy | None — one attempt only, whether it succeeds or fails |
| Response ceiling | Stop before processing a body above 2 MiB, or immediately if the client enforces the ceiling during transfer |
| Time limits | 10-second connection limit; 20-second total limit |
| Redirect policy | Do not follow redirects |
| User agent | A truthful project-maintainer user agent naming this observation and a contact URL only if the client requires one; no impersonation |

The package does not authorise `/api/bills/:id`, any other route, an additional
request to choose an identifier, a parameter, pagination/cursor follow-up,
retry, caching, proxying, raw capture, retention, database write, file write,
application/frontend work, account work, VPS access, email, or public/beta
exposure.

## 3. Transient inspection and retained result

If a body is returned within the limits, it may be decoded in memory only to
produce the following **value-free** observation record:

- request time, final URL, method, status class/code, elapsed time, and
  response content type/declared encoding;
- received byte length and whether a redirect, compression, response-size, or
  time stop occurred;
- top-level JSON kind and keys, where applicable;
- collection/container shape, record count as returned, and names only of any
  pagination, cursor, total-count, link, error, or metadata keys;
- for candidate record objects: union of field names, observed JSON type set
  per field, presence/null count, and nested-key names to a maximum depth of
  two; and
- identifier-like field names and whether their observed values are scalar,
  composite, nullable, or absent — without retaining any values.

The retained record must not contain a title, identifier value, person name,
free text, URL/query value returned by the source, raw JSON, response digest,
header value, screenshot, or payload excerpt. It is a route-observation note,
not a raw capture, source registry release, DB1 manifest, operational
projection, or research dataset.

On a non-JSON, non-2xx, redirect, size-limit, time-limit, or parse outcome,
the result records only the stop category and non-sensitive transport metadata.
It does not retry or retain a body.

## 4. Questions answered

The result is intended to answer only the following:

1. Does the named route respond without authentication or redirect under this
   bounded request?
2. What response/container shape and top-level field-name/type patterns are
   observable?
3. Is there observable collection/pagination/metadata structure that a future
   route contract must handle?
4. Are there identifier-like fields that may justify a separate future detail
   route observation?
5. Does any observed field-name/type pattern require the route to remain under
   restrictive-default personal-data handling pending a later assessment?

It does not answer data accuracy, coverage, completeness, source-field
meaning, historical semantics, bill-stage relationship, licence applicability
to every response field, rate policy beyond this one observation, capture
suitability, or Tier 1/2 eligibility.

## 5. Execution controls and stop conditions

The executor must use a transient tool path that neither writes the body to
disk nor emits it to terminal, logs, browser history, Git, database, or any
external service. The observation report must state the actual client/tool
revision and confirm this disposal rule.

Stop and produce `BLOCKED` or `FAILED` without adaptation if the actual URL
would differ; a credential/cookie, redirect, query parameter, second request,
raw-body retention, response value retention, file/database write, or broader
route scope becomes necessary; the response exceeds the declared ceiling;
transport errors occur; or a body cannot be analysed without retaining content.
Any such condition requires a new proposal, not a workaround.

## 6. Acceptance result and next gate

The result is one of `PASS`, `FAILED`, or `BLOCKED` and updates only the
`/api/bills` row in the master matrix. A `PASS` permits preparation—not
execution—of the next exact proposal. Depending on the evidence, that might be
a `/api/bills/:id` observation, a formal route-handling assessment, or a
limited pass-through design.

No result authorises capture, DB1, DB2, a frontend, a proxy, a dataset, a
variable, a public/beta account, or a claim of source completeness/currentness.

## 7. Owner decision

Approve, revise, or reject DEC-0046. Approval permits only the one bounded
`/api/bills` observation and the value-free result record specified above.
