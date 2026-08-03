# GB-SCT fast-track private raw proxy expansion (DEC-0072)

**Status:** Approved — executing

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
