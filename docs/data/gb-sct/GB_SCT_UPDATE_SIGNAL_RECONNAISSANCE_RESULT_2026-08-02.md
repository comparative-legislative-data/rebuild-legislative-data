# GB-SCT Update-Signal Reconnaissance Result — 2 August 2026

**Status:** PARTIAL — representative transport metadata only

**Authority:** DEC-0055

## 1. Observation

Response metadata was inspected without retaining any payload for two small
representative routes and one high-volume motion route form.

| Route form | Outcome | Update/cache signals observed | Consequence |
| --- | --- | --- | --- |
| `/api/billtypes` | HTTP `200` JSON; `HEAD` was not usable, so a body-cancelled `GET` supplied headers. | `Cache-Control: no-cache`; `Expires: -1`; no `ETag`, `Last-Modified`, `Age`, documented rate-limit, or retry header observed. | The response `Date` is a transport timestamp, not a source-record update time. This sample supplies no conditional-request or incremental-update token. |
| `/api/sessions` | Same as Bill Types. | Same header pattern. | Same limitation. |
| `/api/motionsquestionsanswersmotions` | Timed out before metadata could be assessed. | None established. | Do not infer that the route lacks metadata or is unusable; it needs a later bounded route-specific check. |

This is a small sample, not an API-wide claim. It establishes neither a source
update schedule nor the absence of an update mechanism elsewhere in the API.

## 2. Required reconnaissance profile: updateability

Every route-family report will now include an **updateability profile**:

- published update/freshness/change-log statement, if found;
- HTTP validators and cache/rate signals (`ETag`, `Last-Modified`, cache,
  retry/rate headers), observed separately from documentation;
- source date/version/watermark fields and whether their meaning is documented;
- whether changes, corrections, deletions, and backdated records can be
  detected from the route;
- safe polling candidate, lookback requirement, and unresolved limitations; and
- the future mirror's proposed detection method.

## 3. Implication for DB1 design

Until route-specific evidence proves otherwise, a future DB1 mirror must not
depend on source-provided conditional requests or a declared update timestamp.
It will need its own immutable capture manifests, response/schema digests,
retrieval timestamps, drift checks, and route-specific reconciliation/overlap
rules. A source date in a response must not be treated as an update watermark
without a documented definition.

No DB1 design or polling is authorised by this result.
