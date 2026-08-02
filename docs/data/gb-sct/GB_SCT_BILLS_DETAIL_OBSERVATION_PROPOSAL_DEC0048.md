# GB-SCT Bills Detail Observation Proposal — DEC-0048

**Status:** Proposed — no source request, source-content retention, proxy,
capture, DB1, DB2, frontend, or public action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0048

## 1. Pre-flight and purpose

| Gate item | Record |
| --- | --- |
| Active phase and approved programme scope | GB-SCT three-layer programme design under DEC-0042; this is source reconnaissance only, not a layer implementation. |
| Authority for proposal preparation | Owner instruction to proceed after DEC-0047. No authority to execute the proposed request exists yet. |
| Affected records | DEC-0008, DEC-0044–DEC-0047; the Bills detail row in DEC-0045; the route-handling assessment; and a future value-free observation result only. |
| Known uncertainty and risk | `/api/bills/:id` response shape, field semantics, personal-data treatment, terms application, pagination, rate/operating conditions, retention fit, and public-output fit are unassessed. The route must remain `DO_NOT_CAPTURE_OR_RELEASE`. |
| Smallest proposed change and containment | At most two unauthenticated, no-query, in-memory HTTPS requests to obtain a non-retained identifier and observe one detail response. No source value, raw byte, identifier, URL containing an identifier, response digest, file, cache, database row, log payload, or external output is retained. A failed precondition stops the second request. |
| Verification artefact | A dated, value-free result record with the outcome, non-sensitive transport metadata, response-shape/type summary, stop state if any, and disposal confirmation. |

The purpose is limited to observing the transport and value-free shape of one
Bills **detail** response. That can reduce uncertainty about the detail route's
data-handling risk and future qualification; it cannot establish a Bill's
meaning, field semantics, coverage, completeness, rate policy, capture fit,
or Tier 1/2 eligibility.

## 2. Decision requested

Approve one bounded, transient observation run with a maximum of **two**
requests. The first obtains a non-retained route identifier using the
deterministic selection rule below. The second is made only when that rule
succeeds and observes one detail response. This package is more restrictive
than a capture: it creates no raw archive, manifest, cache, DB1 projection,
or source-content artefact.

Approval would not authorise any other source route or request; use of an
identifier outside the stated selection rule; a retry; a query parameter;
capture, retention, storage, proxying, DB1/DB2 work; account/frontend work;
VPS access; or beta/public exposure.

## 3. Exact request and identifier-selection contract

| Item | Authorised contract if DEC-0048 is approved |
| --- | --- |
| Request cap | Two requests maximum: one collection request and, conditionally, one detail request. A failed or stopped collection request consumes its one attempt; do not retry. |
| Request 1 | `GET https://data.parliament.scot/api/bills`, with no query string, request body, authentication, cookies, or browser-session state. |
| Selection rule | Decode Request 1 in memory only. It qualifies only if the top-level value is a non-empty array, element `0` is an object, and its `ID` property is a finite non-negative safe integer. Use that numeric value only to construct Request 2. Do not retain, print, hash, log, display, or otherwise expose it. This rule is a transport-sample selection, not a claim about ordering, representativeness, or Bill identity. |
| Request 2 | Conditional `GET https://data.parliament.scot/api/bills/:id`, replacing `:id` only with the transient value selected under the preceding rule. No query string, request body, authentication, cookies, browser-session state, redirect, or additional parameter is permitted. The retained result names the route template only, never the resolved URL or identifier. |
| Retry and redirect policy | No retry, follow-up, pagination, cursor, or redirect. Stop if a redirect is offered. |
| Limits | For each request: 10-second connection limit, 20-second total limit, and a 2 MiB response ceiling. Stop before processing a body above the ceiling, or immediately if client enforcement occurs during transfer. |
| Request identity | A truthful project-maintainer user agent naming this observation and a contact URL only if the client requires one; no impersonation. |

## 4. Transient inspection and retained result

Both response bodies may be decoded only in memory. The collection body is
used only to apply the selection rule and is then discarded before the detail
result is written. No collection field summary, record count, title, or other
source-derived result beyond the non-sensitive selection success/failure state
may be retained.

If Request 2 returns a processable response within the limits, the result may
retain only:

- the UTC observation time; route templates (never resolved identifier URLs);
  method; request sequence position; status class/code; elapsed time; content
  type/declared encoding; received byte length; and whether a redirect,
  compression, response-size, or time stop occurred;
- whether the collection selection rule passed, failed, or was stopped —
  without retaining the source-derived reason value or identifier;
- the detail response's top-level JSON kind and names only of top-level keys,
  where applicable;
- for a detail object or array element: field names, observed JSON type set,
  null/presence state, identifier-like field-name classification, and nested
  key names to a maximum depth of two; and
- a restrictive, non-legal risk flag where a field name/type pattern may be
  personal, sensitive, third-party, free-text, or linkable.

The result must not contain source values; title, bill reference, person or
organisation name; identifier value; resolved detail URL; raw JSON; payload
excerpt; response digest; header value; screenshot; cookie; request log; error
body; or a derived semantic or personal-data conclusion. It is a route-
observation note only, not a raw capture, source registry release, DB1
manifest, operational projection, research dataset, or public API response.

For a non-JSON, non-2xx, redirect, size-limit, time-limit, failed selection,
or parse outcome, retain only the stop category and permitted transport
metadata. Do not analyse, quote, or persist the body.

## 5. Execution controls and stop conditions

The executor must use a transient path that does not write any response body,
identifier, or source value to disk, terminal, browser history, Git, database,
logs, cache, or external service. The transient observer is removed after the
run. The result records the actual client/runtime revision and confirms the
disposal rule.

Stop and report `BLOCKED` or `FAILED` without adaptation when any of these
applies:

1. Request 1 cannot meet the exact collection URL, no-query, no-authentication,
   no-redirect, time, or size conditions.
2. The collection selection rule fails. Do not make Request 2 and do not choose
   another array element, query another route, or ask the source for an ID.
3. The constructed Request 2 would not be exactly the permitted Bills detail
   template with the one transient selected integer.
4. A credential, cookie, query parameter, redirect, retry, raw/body-value
   retention, source-value output, file/database write, or broader route scope
   becomes necessary.
5. An error or response cannot be assessed without retaining its content.

No workaround is authorised. A stop preserves only the allowed non-content
result record and requires a new proposal before any further source action.

## 6. Acceptance and aftermath

The result is `PASS` only if both requests meet every contract condition and a
value-free detail-route result is retained with disposal confirmation. It is
`FAILED` for an allowed transport/processing failure and `BLOCKED` for a
scope, selection, or control stop. Any result updates only the `/api/bills/:id`
qualification cell in the DEC-0045 matrix and the relevant governance records.

A `PASS` permits preparation, not execution, of a subsequent handling-review
or source-qualification proposal. It does not change the collection route's
DEC-0047 `DO_NOT_CAPTURE_OR_RELEASE` state, assign a handling/public-output
class to detail content, or authorise capture, pass-through, DB1, DB2,
authentication, frontend, VPS, database, or public work.

## 7. Owner decision

DEC-0048 is `PROPOSED`. Owner approval is required before either request may
be made. The approval applies only to the exact two-request transient
observation contract in this document.
