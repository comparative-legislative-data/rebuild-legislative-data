# GB-SCT Structured-Link and Event-Taxonomy Private Pass-Through
# Implementation and Deployment Proposal — DEC-0066

**Status:** APPROVED — EXECUTED PASS

**Result:** [`GB_SCT_STRUCTURED_LINK_AND_EVENT_TAXONOMY_PRIVATE_PASSTHROUGH_DEPLOYMENT_RESULT_2026-08-03.md`](GB_SCT_STRUCTURED_LINK_AND_EVENT_TAXONOMY_PRIVATE_PASSTHROUGH_DEPLOYMENT_RESULT_2026-08-03.md)

**Version:** 1.0.0

**Prepared:** 3 August 2026

**Decision requested:** DEC-0066, following DEC-0042, DEC-0043, DEC-0045,
DEC-0056–DEC-0057, and completed DEC-0059–DEC-0065.

## 1. Decision requested

Approve implementation and private-beta deployment of source-faithful,
no-retention pass-through access for exactly these three DEC-0065-qualified
collection routes:

| Project route ID | Fixed source path | Parameters | Operating class |
| --- | --- | --- | --- |
| `committee-type-links.collection` | `/api/committeetypelinks` | None | `STRUCTURED_MEDIUM` |
| `mqa-event-types.collection` | `/api/motionsquestionsanswerseventtypes` | None | `REFERENCE_SMALL` |
| `mqa-event-links.collection` | `/api/motionsquestionsanswerseventlinks` | None | `STRUCTURED_MEDIUM` |

The allowed origin remains the fixed `https://data.parliament.scot` host. No
client, environment value, route parameter, or UI input may alter the origin,
path, method, headers, or query string. Every other route form remains
excluded, including all details, all parameterised MQA Event Links forms, and
MQA Event Subtypes.

## 2. Exact implementation scope

1. Change only the three named registry entries to `RELAYED_PRIVATE_BETA` and
   retain their DEC-0065 candidate/limitation text.
2. Extend the existing authenticated pass-through allowlist by exactly those
   three stable route IDs. It must continue to deny unknown, unavailable,
   detail, or parameterised forms before network access.
3. Reuse the accepted request contract: fixed `GET`; fixed JSON `Accept`
   header; `redirect: manual`; no forwarded browser headers; no user query; no
   retry; and a 20-second total abort deadline.
4. Reuse source-faithful streaming: preserve source status, content type, and
   body; do not parse, buffer, transform, log, cache, file-write,
   database-write, analyse, fixture, archive, or otherwise retain source
   content. No DB1 or DB2 action is permitted.
5. Reuse the declared no-fallback transport-failure response where no source
   response exists. It must identify only `SOURCE_TRANSPORT_FAILURE`, route
   ID, UTC time, and failure class; it must not fabricate a source status or
   content.
6. Add the three catalogue actions and static direct official-source links.
   Before either action, show the fixed source path, source attribution and
   non-endorsement, no-retention request-time behaviour, personal-data and
   third-party-rights limits, no-warranty, and the route-specific limits below.

| Route | Required route-specific disclosure |
| --- | --- |
| Committee Type Links | Source-defined link material only. No committee/type relation, timing, membership, classification, completeness, or freshness claim. |
| MQA Event Types | Source-defined event-type taxonomy only. No event meaning, classification, coverage, completeness, or freshness claim. |
| MQA Event Links | Source-defined event-link material only. No identifier identity, link direction, relationship, event meaning, coverage, completeness, or freshness claim. A previous observation was 406,192 bytes/5,721 records; that is historical route evidence, not a response-size guarantee. The raw source response may be larger or slower. |

The direct official-source action is static browser navigation to the same
fixed source URL. The relay action remains an authenticated request-time
no-retention stream through CLD; neither action is a project dataset or mirror.

## 3. Required controls and verification

The accepted controls remain binding: no-store response headers; six attempts
per minute per client IP; no scheduled refresh, polling, retry, prefetch, or
warming; and event metadata limited to route ID, UTC start/end, source-status
class or transport-failure class, and elapsed milliseconds. No source body,
value, identifier, email, IP address, user agent, or session token may be
recorded.

Local verification must prove a nine-route allowlist only: the six already
accepted routes plus these three, no more. It must use synthetic upstreams to
prove every new fixed path, source-status/content-type/body preservation,
redirect/4xx/5xx/timeout outcomes, no retry/fallback, authentication denial,
query denial, and no-persistence guards. Static checks must reject further
origins/paths, DB1/DB2/database/export/cache capabilities, and any relay ID or
direct source link outside the nine-route cohort.

## 4. VPS deployment and owner acceptance

After local checks pass, deploy only a new immutable release of
`cld-gb-sct-api.service` and `cld-gb-sct-web.service` in `/srv/cld-gb-sct`.
Both remain loopback-only on ports 3210 and 3220 with their established limits.
No database migration/write, secret change, Nginx, Cloudflare, DNS, firewall,
certificate, port, shared-service, Resend, or account-policy change is allowed.

Run the project-only preflight and existing atomic release/rollback mechanism.
It must check only the isolated cluster, the two project services/listeners,
named Nginx upstream syntax without changing it, and the HTTPS shell. Stop if
a non-project resource would need changing.

The owner then tests each new route as a normal beta user, one at a time:
disclosure first; CLD relay opens the raw response in a new tab; the direct
action navigates to the same fixed official source path; no transformed preview
or project dataset appears; and no superuser control is visible. `PASS`
requires local/target checks and all three owner acceptance checks.

## 5. Explicit exclusions and completion boundary

This package excludes all source capture, cache/replay, DB1/DB2, database
schema or writes, search/index, export/download archive, chart, canonical
variable, research release, public data access, all detail/parameterised forms,
MQA Event Subtypes, and any interpretation of a link, identifier, committee,
or event.

Stop rather than broaden scope for a source-terms or handling contradiction,
unexpected source shape/content type, authentication-boundary failure,
buffering/persistence indication, service-limit impact, response-size/source-
window concern that invalidates the declared warning, route-expansion need, or
any request to make access public. A failed deployment rolls back only the two
project service releases and removes no data because none is created.

If accepted, this package completes only a third small private-beta source-
access cohort. It does not establish link direction, source semantics,
completeness, currentness, or a research release. The four `Notes`-bearing
collections and MQA Event Subtypes remain blocked; DB1 remains blocked until
the broader proxy phase has its own completed acceptance result.
