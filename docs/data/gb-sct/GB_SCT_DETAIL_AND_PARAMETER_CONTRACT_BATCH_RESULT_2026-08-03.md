# GB-SCT Detail and Parameter Contract-Batch Result — 3 August 2026

**Status:** PASS — 12 exact-form contract observations completed; no route enabled  
**Authority:** DEC-0070

## 1. Method and retained boundary

One controlled pass made 12 exact-form contract observations and eight
transient helper collection reads needed solely to select ordinary public
identifiers in working memory. The helper reads were the existing collection
forms for Bill Stage Types, Bill Types, Sessions, Constituencies, Regions,
Committee Types, MQA Event Types, and MQA Event Links. They did not expand the
contract scope or create a contract outcome for those collections.

All 20 source requests used the fixed `https://data.parliament.scot` origin,
without credentials, cookies, redirects, request bodies, retries, persistence,
or a changed route/parameter form. Source bodies, values, identifiers,
resolved URLs, hashes, fixtures, caches, logs, downloads, and database rows
were discarded. The durable result retains only the value-free metadata below.

## 2. Contract observations

| Route form | Parameter form observed | Transport and shape evidence | Contract outcome and remaining limit |
| --- | --- | --- | --- |
| `/api/billstages` | None | HTTP `200`; `application/json`; `ARRAY`; 137,488 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. The collection shape does not resolve procedure, field, handling, or source-terms meaning. |
| `/api/billstages/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 73 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. The detail-key identity, stability, content, procedure meaning, handling, and terms remain unresolved. |
| `/api/billstagetypes/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 56 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; the accepted collection contract does not automatically transfer. |
| `/api/billtypes/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 27 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; the accepted collection contract does not automatically transfer. |
| `/api/sessions/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 110 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; no session-boundary or temporal meaning is inferred. |
| `/api/constituencies/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 176 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; no geographic or validity-period meaning is inferred. |
| `/api/regions/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 125 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; no geographic or date meaning is inferred. |
| `/api/committeetypes/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 27 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; no committee classification meaning is inferred. |
| `/api/motionsquestionsanswerseventtypes/:id` | One transient `id` | HTTP `200`; `application/json`; `OBJECT`; 40 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. Detail behaviour is observed once; no event-taxonomy meaning is inferred. |
| `/api/motionsquestionsanswerseventlinks?childUniqueId=:id` | One transient `childUniqueId` | HTTP `200`; `application/json`; `ARRAY`; 72 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. One response establishes no complete parameter grammar, identifier identity, or link direction. |
| `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id` | One transient `mainUniqueId` | HTTP `200`; `application/json`; `ARRAY`; 72 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. One response establishes no complete parameter grammar, identifier identity, or link direction. |
| `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | One transient `parentUniqueId` | HTTP `200`; `application/json`; `ARRAY`; 72 bytes; no redirect or observed pagination signal. | `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`. One response establishes no complete parameter grammar, identifier identity, or link direction. |

## 3. Result limits

The observations establish only that each exact template returned the stated
transport/shape result once. They do not establish an identifier contract,
parameter grammar beyond the one observed request, response completeness,
freshness, content meaning, terms, reuse permission, handling class, relay
eligibility, capture contract, DB1/DB2 suitability, or research use.

No route is enabled by this result. All 12 forms remain unavailable pending
their separate handling, terms, operational, and implementation decisions.

## 4. Integrity checks

- Exactly 12 contract records are present, matching DEC-0070 section 3.
- Every contract request returned HTTP `200` JSON with no redirect; the
  response-shape classes are one `ARRAY`, eight `OBJECT`, and three `ARRAY`
  parameter responses.
- Eight helper reads were transient selection support only; no source values or
  identifiers are retained in this record.
- No source body was stored, transformed, relayed, cached, logged, downloaded,
  or written to a database.

## 5. What next

The contract batch is complete at its intended boundary. The independent next
proposal is the high-volume operational batch for MQA, motions, questions,
official reports, and votes: it should define source-window, response-size,
timeout, and later DB1 implications without treating those routes as Tier 1/2
variables or confusing motion-amendment votes with bill amendments.
