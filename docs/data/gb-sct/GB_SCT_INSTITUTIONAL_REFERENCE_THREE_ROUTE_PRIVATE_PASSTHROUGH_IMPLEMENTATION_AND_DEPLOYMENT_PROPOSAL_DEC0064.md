# GB-SCT Institutional-Reference Three-Route Private Pass-Through
# Implementation and Deployment Proposal — DEC-0064

**Status:** PROPOSED — no route is enabled

**Version:** 1.0.0

**Prepared:** 3 August 2026

**Decision requested:** DEC-0064, following DEC-0042, DEC-0043, DEC-0045,
DEC-0056–DEC-0057, completed DEC-0059–DEC-0063, and the accepted DEC-0062
pass-through controls.

## 1. Decision requested

Approve implementation and private-beta deployment of a source-faithful,
no-retention pass-through for exactly these three DEC-0063-qualified
collection routes:

| Project route ID | Fixed source path | Parameters | Class |
| --- | --- | --- | --- |
| `constituencies.collection` | `/api/constituencies` | None | `REFERENCE_GEOGRAPHY` |
| `regions.collection` | `/api/regions` | None | `REFERENCE_GEOGRAPHY` |
| `committee-types.collection` | `/api/committeetypes` | None | `REFERENCE_SMALL` |

The allowed origin is the fixed `https://data.parliament.scot` host. No client,
environment value, or route parameter may alter the origin, path, method,
headers, or query string. Every other route form remains excluded, including
the three corresponding detail forms and the four DEC-0063 handling-blocked
collection routes.

## 2. Exact implementation scope

1. Change only the three named registry entries from candidate-unavailable to
   `RELAYED_PRIVATE_BETA`; retain the DEC-0063 qualification result and all
   route-specific limitation text.
2. Extend the existing authenticated pass-through allowlist by exactly these
   three stable project route IDs. It must continue to reject every unknown,
   blocked, detail, or parameterised route before network access.
3. Reuse the accepted DEC-0062 server-side request contract: fixed `GET`,
   fixed JSON `Accept` header, `redirect: manual`, no forwarded browser
   headers, no user query, no retry, and a 20-second total abort deadline.
4. Reuse source-faithful streaming: preserve source status, content type, and
   body; do not call `.json()` or `.text()`, buffer, transform, log, cache,
   file-write, database-write, analyse, fixture, archive, or otherwise retain
   source content. No DB1 or DB2 action is permitted.
5. Reuse the declared transport-failure response when no source response
   exists: `SOURCE_TRANSPORT_FAILURE`, route ID, UTC time, and no-fallback
   condition only. It must not fabricate a source status or content.
6. Add the three catalogue actions and three static direct official-source
   links. Before either action, show the fixed source path; request-time and
   no-retention behaviour; source attribution and non-endorsement; the
   personal-data, third-party-rights, no-warranty, semantic, completeness, and
   freshness limitations; and the route-specific statement below.

| Route | Required route-specific disclosure |
| --- | --- |
| Constituencies | Source-defined geographic reference only. No geographic, validity-date, coverage, or temporal-semantic claim. |
| Regions | Source-defined regional reference only. No date-boundary, coverage, or temporal-semantic claim. |
| Committee Types | Source-defined taxonomy only. No classification, completeness, or historical-meaning claim. |

The direct official-source action is ordinary static browser navigation to the
same fixed source URL. The relay action remains an authenticated request-time
no-retention stream through CLD; it is not a project dataset or mirror.

## 3. Required operational controls

All existing DEC-0062 controls remain binding:

- project headers identify the upstream-pass-through layer, stable route ID,
  fixed source template, UTC request time, and deployed proxy revision;
- `cache-control: no-store`, `x-accel-buffering: no`, and `vary: Cookie` are
  present on relay responses;
- no scheduled refresh, polling, retry, prefetch, warming, or background
  source request is introduced;
- the existing maximum of six pass-through attempts per minute per client IP
  remains; this is a project-side abuse control, not a source rate-limit
  assertion; and
- permitted operational event data remains limited to route ID, UTC start/end,
  source-status class or transport-failure class, and elapsed milliseconds;
  never source content/value, identifier, session token, email, IP address, or
  user agent.

## 4. Verification and owner acceptance

### Local verification

- Unauthenticated requests are denied before a synthetic upstream is invoked.
- The allowlist permits exactly the original DEC-0062 three IDs plus these
  three IDs; it permits no query parameter, detail ID, blocked DEC-0063 ID, or
  arbitrary origin/path.
- Synthetic upstream tests prove byte-for-byte source-body streaming, source
  status/content-type preservation, required project headers, and no semantic
  rewriting for each new route ID.
- Synthetic redirect, source 4xx/5xx, and timeout tests produce the declared
  transparent outcome with no retry or fallback.
- Persistence/logging guards fail any source-body buffer, file, database,
  cache, or source-content log attempt.
- Static scope checks reject new upstream origins/paths, DB1/DB2/database/
  export routes, cache packages, and any relay ID beyond the approved six.

### VPS and private-beta acceptance

After local checks pass, deploy only a new immutable release of
`cld-gb-sct-api.service` and `cld-gb-sct-web.service` under `/srv/cld-gb-sct`.
Keep both loopback-only on ports 3210 and 3220 and preserve their established
limits. No database migration, database write, secret change, Nginx,
Cloudflare, DNS, firewall, certificate, port, shared-service, Resend, or
account-policy change is permitted.

Before replacement, run a project-only read-only preflight of the two service
states, their loopback listeners, isolated cluster state, unchanged named
`legislativedata.org` Nginx upstreams, and direct/public HTTPS shell. Stop if
any non-project resource would need changing. Deployment must use the existing
project-owned atomic release/rollback mechanism, restoring only the immediately
prior project release/unit state if build, readiness, or route-contract checks
fail.

The owner then tests each new route one at a time using a normal approved beta
account: disclosure first; relay action opens the raw source response; direct
action navigates to the same fixed official source URL; source status/content
type/body are visible through the relay; no project dataset or transformed
display appears. A normal beta account must not see superuser controls.

`PASS` requires local and target-host checks plus this three-route owner
acceptance. A failed route remains visibly unavailable and does not block the
catalogue or initiate DB1 work.

## 5. Explicit exclusions and stop conditions

This proposal excludes source capture, cache/replay, DB1, DB2, database schema
or writes, search/index, export/download archive, chart, canonical variable,
research release, public data access, all parameterised/detail forms, all
four DEC-0063 blocked collections, and source authentication.

Stop rather than broaden scope for a source-terms or handling contradiction,
unexpected source shape/content type, authentication-boundary failure,
buffering/persistence indication, service-limit impact, route-expansion need,
or any request to make access public. Roll back only the two project service
releases if a package check fails; do not remove data because this package
creates none.

## 6. Completion boundary and next step

This package, if accepted, completes only a second small private-beta
pass-through cohort. It does not establish geography, temporal validity,
committee classification, analytical meaning, currentness, completeness, or a
research release. The four `Notes`-bearing forms remain blocked. DB1 remains
blocked until the broader proxy phase has its own completed acceptance result.
