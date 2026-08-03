# GB-SCT Three-Route Private Pass-Through Implementation and Deployment Proposal — DEC-0062

**Status:** APPROVED — local and VPS deployment `PASS`; owner beta acceptance pending

**Version:** 0.1.0

**Prepared:** 3 August 2026

**Decision requested:** DEC-0062, following DEC-0042, DEC-0043, DEC-0056, DEC-0057, DEC-0059, DEC-0060, and DEC-0061.

## 1. Decision requested

Approve implementation and private-beta deployment of a source-faithful,
no-retention pass-through for exactly three qualified collection routes:

| Project route ID | Fixed source path | Parameters | Class |
| --- | --- | --- | --- |
| `bill-stage-types.collection` | `/api/billstagetypes` | None | `REFERENCE_SMALL` |
| `bill-types.collection` | `/api/billtypes` | None | `REFERENCE_SMALL` |
| `sessions.collection` | `/api/sessions` | None | `REFERENCE_SMALL` |

The allowed origin is the fixed `https://data.parliament.scot` host. No client,
environment value, or route parameter may alter the origin, path, method,
headers, or query string. The decision excludes every other route form,
including each detail route.

## 2. Exact local implementation scope

1. Change only the three named registry entries from candidate-unavailable to
   `RELAYED_PRIVATE_BETA`, retaining all qualification and limitation text.
2. Add one authenticated `GET` pass-through endpoint. It accepts only a stable
   project route ID from the three-entry allowlist. Any unknown, unqualified,
   detail, or parameterised route is rejected before network access.
3. Make a server-side `GET` to the fixed source path with a fixed JSON `Accept`
   header, `redirect: manual`, no forwarded browser headers, no user query,
   no retry, and a 20-second total abort deadline.
4. Stream source status, content type, and body directly to the authenticated
   client. The service must not call `.json()`, `.text()`, buffer the stream,
   transform it, add it to a log, cache it, write it to a file, or send it to a
   database, analytic event, fixture, download archive, DB1, or DB2.
5. Return a project JSON transport failure only where no source response
   exists, for example timeout or connection failure. It must state
   `SOURCE_TRANSPORT_FAILURE`, route ID, UTC time, and no-fallback condition;
   it must not claim a source status or fabricate content.
6. Add a private frontend route view. Before the user triggers a request it
   shows the fixed source template, `UPSTREAM_PASSTHROUGH` status, request-time
   behaviour, source licence attribution, non-endorsement, personal-data,
   no-warranty, semantic, and freshness limitations. The one action opens the
   raw source response in a new authenticated browser tab; it does not create
   a project table, preview, chart, export, or download feature.

## 3. Required response and operational controls

For a source response, preserve source status, content type, and body. Add
only project namespaced headers:

- `x-cld-layer: UPSTREAM_PASSTHROUGH`
- `x-cld-route-id` — stable project route ID
- `x-cld-source-template` — fixed source path
- `x-cld-requested-at` — UTC request start time
- `x-cld-proxy-version` — deployed project revision
- `cache-control: no-store`, `x-accel-buffering: no`, and `vary: Cookie`

The API’s existing no-store response policy remains mandatory. The source host
is not made visible as a configurable input. The only permitted operational
event data is route ID, UTC start/end, source-status class or transport-failure
class, and elapsed milliseconds; it must not contain source body/text/value,
source identifier, session token, email, IP address, or user agent.

Apply a maximum of six pass-through attempts per minute per client IP at this
endpoint. There is no scheduled refresh, polling, retry, prefetch, warming, or
background request. This is a project-side abuse limit, not a claim about a
published source rate limit.

## 4. Explicit exclusions

- DB1/DB2/database schema or write, source capture, cache, replay store,
  search/index, export, download archive, chart, canonical variable, or
  research release.
- Any source path/origin/parameter other than the three fixed collection forms.
- Detail identifiers, arbitrary URL forwarding, source authentication, third-
  party data, document sources, bill amendments, and motion-vote interpretation.
- Cloudflare, DNS, firewall, certificate, port, shared-service, resource-limit,
  database, Resend, or account-policy change.
- Public access: the website remains reachable only as the existing private
  beta shell and every source endpoint requires an approved beta/guest session.

## 5. VPS deployment scope

The package permits a new immutable release of only
`cld-gb-sct-api.service` and `cld-gb-sct-web.service` in `/srv/cld-gb-sct`.
Both remain loopback-only on ports 3210 and 3220 with their established systemd
limits. No database migration or secret value is added or changed.

Before replacement, conduct a project-only read-only check of the two service
states, their loopback listeners, the isolated cluster state, the named
`legislativedata.org` Nginx site’s unchanged `/api/` and `/` upstreams, and
the direct/public HTTPS shell. Stop if any non-project resource would need
changing. The existing named Nginx file is syntax-checked but not modified.

Deploy through a new project-owned staging script with an atomic release swap
and a trap that restores only the immediately prior project release/unit state
on build, readiness, or route-contract failure. It must preserve the existing
access session pepper and use no new credential or email action.

## 6. Verification and acceptance

### Local verification

- Unauthenticated request is denied before a synthetic upstream is invoked.
- The route allowlist permits exactly the three IDs and no query parameters.
- A synthetic upstream confirms byte-for-byte body streaming, source status,
  source content type, required project headers, and no semantic rewriting.
- A synthetic redirect, source 4xx/5xx, and timeout each produce the declared
  transparent outcome; no retry or fallback occurs.
- An injected persistence/logging guard fails any body buffer, file, database,
  cache, or source-content log attempt.
- Static scope checks reject non-fixed upstream origin/path construction,
  DB1/DB2/database/export routes, cache packages, and additional relay IDs.

### VPS and private-beta acceptance

After local tests pass, the deployment must pass target-host build/tests,
project listener/service checks, unchanged Nginx syntax/proxy checks, and
direct/public HTTPS shell checks. Then the owner tests the three frontend
routes one at a time: disclosure visible first; one action opens the source
response; raw source status/content type/body are visible; no project dataset
or transformed display appears. A normal beta account must be able to test the
three routes but not see superuser controls.

`PASS` requires all local and VPS checks plus this owner beta acceptance. Any
failed route remains visibly unavailable; it does not block the catalogue or
cause a DB1 implementation.

## 7. Rollback and stop conditions

Rollback only the two project service releases if an approved package check
fails. Do not remove data because this package creates none; do not alter the
database, Nginx, Cloudflare, or shared host services. Stop for a source terms
or handling contradiction, unexpected source shape/content type, authentication
boundary failure, buffering/persistence indication, service-limit impact,
route expansion need, or any request to make access public.

## 8. Completion boundary and next step

This package would complete only the first private-beta source pass-through
test. It does not complete P4: the other selected routes remain visible as
unavailable/candidate according to their evidence state. A later owner decision
would be required for another named cohort; DB1 remains blocked until the full
proxy phase has its separate acceptance result.
