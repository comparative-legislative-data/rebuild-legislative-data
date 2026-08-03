# GB-SCT fast-track private raw proxy expansion (DEC-0072)

**Status:** Deployed — owner acceptance pending

**Date:** 3 August 2026

## Owner direction and exact scope

The owner directed that the project should stop serially qualifying public,
institutional Scottish Parliament API routes for private proxy access. The
selected 64 route forms in DEC-0045 are approved for authenticated private-beta
raw access through the existing CLD relay.

This is an access decision only. It does not approve source capture, a DB1
mirror, DB2/canonical variables, downloads, charts, public data access, a
research release, source-data interpretation, or a conclusion about terms,
personal data, completeness, freshness, or research fitness.

## Contained implementation

- The route registry remains the sole allowlist: no user-supplied host, path,
  redirect target, or outbound URL is accepted.
- Parameterised forms accept only their documented names and grammar; fixed
  route query values remain fixed.
- The relay uses `GET`, `Accept: application/json`, manual redirects, streamed
  bodies, `Cache-Control: no-store`, and no body parsing, storage, caching,
  fixture creation, database write, or source-body logging.
- Reference and structured routes use a 60-second source window. The existing
  whole-history, annual-firehose, and unresolved/high-volume classes use a
  five-minute source window, still streamed and user-triggered.
- The browser gives private beta users two clearly labelled choices: the CLD
  no-retention relay or the corresponding direct Scottish Parliament route.
- The deployment remains limited to the existing two CLD services. No database,
  migration, Nginx, Cloudflare, secret, package, or shared-host change is part
  of this decision.

## Verification and acceptance

The implementation must pass the repository build, route-contract tests, and
capability scan before deployment. Deployment must use the existing project-only
release procedure. Owner testing should cover one no-query collection, one
detail route, one parameterised route, one high-volume route, and both access
choices. A successful response proves transient access only, not a capture or
an analytical data claim.

## What next

Run the local verification suite, deploy the bounded release if it passes, and
ask the owner to test the representative route set. DB1 and DB2 remain a later,
separately approved data-management stage.

## Deployment result

Commit `4f11adf705be44c921a9051ff8443efc15c799d9` was pushed and deployed on 3
August 2026 using the existing project-only two-service release procedure. The
VPS-pinned runtime passed the full verification suite (16 tests, build,
capability scan, and deterministic package). The release readiness check passed
after two expected connection-refused polls during API startup; an unauthenticated
source-route request was denied, Nginx syntax was unchanged and valid, and the
public shell returned HTTP `200`.

No source body was requested by this deployment check, and no database,
capture/DB1, DB2, Nginx configuration, Cloudflare, secret, package, or
shared-host change occurred. Owner acceptance of representative private-beta
route tests remains pending.

## Catalogue profile presentation

The route catalogue now presents an **observed source profile** for every route
family, drawing only on retained non-content reconnaissance metadata: response
shape, observed field/group names, previously observed types or null behaviour
where available, volume/temporal observations, and limitations. A family whose
field profile has not been retained is explicitly marked as a profile gap.

These cards are route-access guidance, not a DB1 schema, canonical codebook,
field definition, data-quality finding, or research-variable release. They are
intended to make raw upstream material navigable while preserving the distinction
between source-observed structure and interpreted data.

The parameter-substitution correction (`7876ebf`) and the route-profile
presentation (`56dc1cd`) both passed local and VPS verification and were
deployed through the unchanged two-service procedure. In particular, templates
now substitute named parameters such as `:year`, not only `:id`.

## Source presentation labels

The catalogue now labels each route’s expected source action before the user
opens it. The annual committee-report, plenary-report, and vote forms are
labelled as downloads because a body-cancelled header observation found
`application/octet-stream` plus a Scottish Parliament attachment disposition;
the CLD relay forwards that disposition unchanged. Routes previously observed
as normal JSON responses are labelled as browser views. The two Bills forms and
the three unresponsive whole-history MQA collections remain explicitly
`SOURCE_PRESENTATION_UNESTABLISHED` pending a successful header observation.
