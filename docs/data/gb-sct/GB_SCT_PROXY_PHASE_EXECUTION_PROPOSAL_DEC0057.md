# GB-SCT Transparent Upstream Proxy Phase — Execution Proposal (DEC-0057)

**Status:** PROPOSED — documentation only; no proxy, source relay, capture,
database, cache, account, VPS, or public action authorised

**Version:** 0.1.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0057

## 1. Decision requested

Approve preparation and later execution of the private-beta transparent
upstream pass-through phase as the required predecessor to DB1. The phase
relays only allowlisted Scottish Parliament API requests from the selected
DEC-0007 inventory. It makes the upstream response and its limitations visible
without retaining source-response bodies or treating the relay as project data.

Approval would authorise only the exact implementation package subsequently
prepared from this proposal. It would not authorise DB1 capture, database
schema work, DB2 variables, source-response caching, public release, or any
route outside the approved inventory.

## 2. Why this phase comes first

DEC-0056 requires the transparent pass-through phase to be completed and
beta-accepted before any DB1 implementation, capture, database schema, or
mirror operation. It gives users an honest view of the official source before
the project creates any retained copy or analytical variable.

The completed reconnaissance shows why the layer needs explicit route controls:

- reference routes can be small and straightforward;
- the whole motions response is 110 MB;
- a single annual committee-report response can be about 150 MB and a plenary
  report about 124 MB;
- annual question and vote forms are usable but non-trivial in size; and
- some source detail forms yielded an empty object or an error for the
  candidate identifiers tested. These are source behaviours to expose, not to
  hide or repair.

The evidence is in
[`GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md`](GB_SCT_HIGH_VOLUME_ROUTE_AUDIT_RESULT_2026-08-02.md).

## 3. Scope and non-goals

### 3.1 In scope

1. A private-beta, authenticated catalogue of every selected DEC-0007 route
   form, showing its route ID, source template, allowed parameter grammar,
   current qualification state, known response/volume profile, route-specific
   limitations, and relay availability.
2. A Fastify upstream-relay endpoint that maps a stable project route ID to one
   exact upstream template and allowlisted parameters.
3. Source-faithful streaming responses with transparent request-time metadata
   and failure behaviour.
4. Route-by-route beta tests covering allowed requests, rejected parameters,
   source error propagation, large-response streaming, no-persistence checks,
   and disclosure visibility.

### 3.2 Out of scope

- DB1 raw capture, a database write/schema, index, search layer, response
  cache, download archive, or replay store;
- DB2 variables, codebooks, calculations, charts, or research claims;
- enriching, joining, filtering, reformatting, or repairing source data;
- general URL forwarding, arbitrary source hosts, arbitrary query parameters,
  browser-side bypasses, or a public endpoint; and
- document-based sources, bill-amendment extraction, or a claim that a vote on
  a motion is a vote on a bill amendment.

## 4. Mandatory proxy contract

| Contract element | Required behaviour |
| --- | --- |
| Route selection | The client sends a project route ID, never an arbitrary upstream URL. The server maps it to one inventory route form. |
| Parameters | Only documented, per-route allowlisted names and value grammar are accepted. Unsupported values are rejected before an upstream request. |
| Transport | The upstream response is streamed to the authenticated client. The service must not materialise the body as a database row, file, cache, fixture, log field, or analytics event. |
| Fidelity | Preserve source HTTP status, content type, and body where safely relayed. The project may add namespaced transparency headers/metadata, but never rewrite source content. |
| Metadata | Each response/view visibly states `UPSTREAM_PASSTHROUGH`, the Scottish Parliament host and route template, permitted parameters, UTC request time, proxy version, known limitations, and that it is not a project snapshot or dataset. |
| Failure | Timeouts, source 4xx/5xx, empty objects, and connection failures remain visible as source/transport outcomes. No substitute from cache, DB1, or inference is permitted. |
| Logging | Operational logs contain the minimum non-content event metadata needed for security and failure diagnosis; no raw source body, text, or source-derived identifier/value is logged. |
| Access | Only approved beta/guest accounts may use the interface. Existing beta-access controls must be implemented and accepted before a data route is exposed. |

## 5. Route operating classes

The precise values are implementation candidates to be verified in the final
package. They are intentionally based on the observed audit, not assumed API
pagination.

| Class | Examples | Candidate proxy behaviour |
| --- | --- | --- |
| `REFERENCE_SMALL` | Types, sessions, committees, parties, small taxonomies | Stream directly; short source window; catalogue field/limitation summary. |
| `STRUCTURED_MEDIUM` | Formal stages, event links, business-motion filters, annual questions | Stream directly; bounded source window; show response-size warning before request where known. |
| `WHOLE_HISTORY_LARGE` | Whole motions collection | Stream without server-side buffering; long source window; prominent size warning; no built-in preview or transformed table. |
| `ANNUAL_FIREHOSE` | Committee/plenary reports and votes by year | Stream without buffering; long source window; year required where the source supports it; prominent route/year volume warning. |
| `EXTREME_OR_UNRESOLVED` | Whole events, questions, supports; unverified detail-key forms | Catalogue visibly as selected but unavailable for relay until an approved route-specific contract is evidenced. Do not silently omit it or fall back to another layer. |

No class is a source-coverage, source-definition, or suitability claim. A class
may change only through an evidence-backed matrix update.

## 6. Implementation and acceptance sequence

| Step | Required result | Still prohibited |
| --- | --- | --- |
| P0 — Complete route profile | The matrix distinguishes relayed candidate, large-response, unresolved, and empty-detail behaviour for each selected form. | Proxy/service/source relay. |
| P1 — Implement beta access foundation | The approved superuser, guest, approval, password, and magic-link lifecycle passes its own private acceptance tests. | Any data route or source access. |
| P2 — Implement proxy service and catalogue | Allowlist, parameter validation, source-streaming, disclosure, no-persistence controls, and source-failure behaviour are implemented locally. | VPS deployment, public access, DB1/DB2, cache. |
| P3 — Private VPS beta deployment | The contained proxy and authenticated interface are deployed under an exact VPS/secrets package and tested against declared route classes. | DB1/DB2, public access, source capture/cache. |
| P4 — Proxy phase acceptance | All selected forms are visibly classified as `RELAYED`, `UNAVAILABLE_PENDING_EVIDENCE`, or `SOURCE_EMPTY_OR_ERROR_OBSERVED`; beta testers can inspect route provenance and limitations. | DB1 implementation until P4 passes. |

P4 does not require every route to be usable. It requires every selected route
to be honestly represented, with no silent exclusions and no false detail or
coverage claim.

## 7. Verification requirements

The later implementation package must prove, for every relayed route:

1. an unauthorised request is rejected before source access;
2. the route/parameter allowlist accepts the documented grammar and rejects
   unlisted inputs;
3. source status/content type/body are relayed without semantic transformation;
4. transparency metadata is visible in the interface and response contract;
5. source-body persistence, caching, and body logging are absent by deliberate
   tests and configuration inspection;
6. source errors, timeouts, large responses, and observed empty-detail forms
   are accurately disclosed; and
7. no DB connection, DB1/DB2 write, variable creation, or chart/output path is
   reachable from the proxy service.

## 8. Stop conditions

Stop the affected route or deployment package if source terms, handling class,
parameter semantics, body size, source behaviour, authentication boundary,
shared-host isolation, or no-persistence verification differs materially from
the approved package. The outcome must be a visible `UNAVAILABLE` or `BLOCKED`
catalogue state, not a hidden fallback, cache, inferred result, or DB1 build.

## 9. Next decision

The owner may approve DEC-0057 after reviewing this proxy-only design. That
approval would permit preparation of the exact P1/P2 implementation package;
it would not itself permit a VPS change, secret use, email send, source relay,
or application implementation. DB1 remains blocked by DEC-0056 until P4 is
accepted.
