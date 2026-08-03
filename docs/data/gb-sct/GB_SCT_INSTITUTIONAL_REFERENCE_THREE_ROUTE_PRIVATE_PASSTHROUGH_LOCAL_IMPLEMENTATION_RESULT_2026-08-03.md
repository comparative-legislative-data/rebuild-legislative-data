# GB-SCT Institutional-Reference Three-Route Private Pass-Through Local
# Implementation Result — 3 August 2026

**Status:** PASS — local implementation only; VPS deployment and owner
acceptance pending

**Authority:** DEC-0064

## 1. Scope completed

The local private-beta relay catalogue now contains exactly six fixed,
no-query pass-through collection routes: the three accepted DEC-0062 routes
and the three DEC-0064 routes below.

| Project route ID | Fixed source path | Local state |
| --- | --- | --- |
| `constituencies.collection` | `/api/constituencies` | `RELAYED_PRIVATE_BETA` in local code only |
| `regions.collection` | `/api/regions` | `RELAYED_PRIVATE_BETA` in local code only |
| `committee-types.collection` | `/api/committeetypes` | `RELAYED_PRIVATE_BETA` in local code only |

The route registry, fixed upstream map, static direct official-source links,
route disclosures, test cohort, and capability scan were changed only for
these three routes. The four DEC-0063 `Notes`-bearing routes, every detail or
parameterised route, and the remaining selected inventory stay unavailable.

## 2. Controls retained

Each new local route uses the existing source-faithful `GET` streaming
contract: fixed Scottish Parliament origin/path, fixed JSON `Accept` header,
manual redirect handling, no caller query/header forwarding, no retry, and a
20-second abort deadline. The code does not parse, buffer, transform, cache,
log, file-write, database-write, or otherwise retain source bodies.

The frontend presents the two distinct options before a request: the
authenticated CLD no-retention relay and a static direct Scottish Parliament
source link. Its dated field/structure guides disclose only existing evidence
and route-specific limits; they do not infer geographic boundaries, validity
semantics, classifications, completeness, or freshness.

No source request was made during local implementation or verification. No
VPS, database, DB1, DB2, cache, email, Nginx, Cloudflare, public access, or
source data changed.

## 3. Verification

`npm run verify` passed on 3 August 2026:

- TypeScript build and production web build passed.
- All 16 automated tests passed, including the exact six-route relay cohort,
  all six fixed synthetic upstream paths, unauthenticated denial,
  no-query rejection, source-status/body/header preservation, and synthetic
  timeout/no-fallback behaviour.
- The capability scan passed: exactly six approved fixed no-retention relay
  routes and six static official-source links are present; DB1, DB2,
  research-export, and other outbound catalogue routes remain absent.
- The deterministic B1 archive/manifest package was generated.

The local environment reported the known engine warning: Node `24.14.1` and
npm `11.11.0` are below the pinned project target Node `24.18.1` and npm
`11.16.0`. This is not treated as target-runtime evidence; the approved VPS
package uses its pinned Node `24.18.1` runtime and must rerun its full checks.

## 4. What next

Commit and push this local result, then run the DEC-0064 project-only VPS
preflight and immutable two-service release. If the target checks pass, the
owner must test each of the three new routes individually before DEC-0064 can
be recorded as complete. Any failure leaves the affected route unavailable and
does not initiate DB1 work.
