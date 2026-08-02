# GB-SCT Proxy P2 Local Implementation Result — 2 August 2026

**Status:** PASS — local fail-closed catalogue only

**Authority:** DEC-0060

## Scope completed

The local application now contains a 64-form GB-SCT route registry matching
the selected DEC-0045 inventory. An authenticated private-beta catalogue shows
each route's project ID, source template, parameter grammar, priority,
operating class, qualification state, and limitation.

Every route has an unavailable state. The authenticated route-test endpoint
validates only the route ID and its allowlisted parameter shape, then returns
the declared unavailable state before constructing a source URL or using any
outbound capability. There is no `RELAYED` state in the registry.

## Verification

`npm run verify` passed locally:

- TypeScript and production web build passed.
- All 13 tests passed.
- New tests verified the 64 unique route definitions, exact template parity
  with the DEC-0045 matrix, no `RELAYED` state,
  unauthenticated catalogue denial, malformed/unlisted parameter rejection,
  and local refusal of a syntactically valid annual-route request while a test
  guard would fail any outbound call.
- The capability scan passed and specifically rejects outbound-client tokens
  in the catalogue/runtime route files.
- The deterministic local release archive/manifest step passed.

The local Node/npm engine warning (`24.14.1` versus the repository target
`24.18.1`) remains the existing local-development warning; it did not prevent
typecheck, tests, build, capability scan, or packaging. No claim is made for a
VPS runtime from this local result.

## Explicit non-results

No VPS, secret, email, database, DB1, DB2, source API, source response,
source-derived identifier/value, cache, download, or public route was used or
created. The authenticated catalogue has not been deployed, so it is not yet
available at `legislativedata.org`.

## What next

The smallest next step is a proposed exact route-qualification and private
deployment package for a named initial cohort. It must establish the handling
basis and source request contract before any source request can be enabled.
DB1 remains blocked until the full proxy phase passes its separate beta
acceptance gate.
