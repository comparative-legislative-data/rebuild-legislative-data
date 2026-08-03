# GB-SCT Three-Route Private Pass-Through Local Implementation Result — 3 August 2026

**Status:** PASS — local implementation only; no source request or VPS action

**Authority:** DEC-0062

## Scope completed

The private-beta application now exposes exactly three fixed, no-query route
definitions as `RELAYED_PRIVATE_BETA`:

| Project route ID | Fixed source path |
| --- | --- |
| `bill-stage-types.collection` | `/api/billstagetypes` |
| `bill-types.collection` | `/api/billtypes` |
| `sessions.collection` | `/api/sessions` |

The authenticated source endpoint accepts only one of those stable route IDs
and rejects an unknown, unavailable, detail, parameterised, or queried route
before calling its transport. It uses a fixed origin/path and fixed JSON
`Accept` header, manual redirects, no retry, and a 20-second abort deadline.
For a source response it streams status, content type, and body without
parsing or buffering it, adding only the DEC-0062 project headers and
`no-store`/no-buffering controls. Where no source response exists it returns a
truthful transport-failure response with no fallback.

The beta route catalogue now visibly distinguishes the three live source
actions from the 61 unavailable forms. Each action discloses, before opening a
new tab, that it is a live raw Scottish Parliament response rather than a
project dataset or snapshot, and states attribution, non-endorsement,
personal-data/third-party-rights, no-warranty, semantic, and freshness limits.
It does not render a project preview, table, chart, export, or download.

## Verification

`npm run verify` passed locally on 3 August 2026:

- TypeScript, production web build, and all 16 tests passed.
- The exact three-ID allowlist and 64-route DEC-0045 template parity passed.
- Synthetic-only tests proved unauthenticated denial, unavailable-route
  refusal, query rejection, fixed request construction, manual redirect
  handling, source 4xx preservation, timeout disclosure, byte-preserving
  streaming, source status/content-type preservation, and required headers.
- The capability scan permits the fixed relay module only and rejects source
  host use elsewhere, DB1/DB2, cache, database, export, source parsing, and
  other outbound catalogue paths.
- The deterministic project release archive/manifest was rebuilt.

The local Node/npm engine warning (Node `24.14.1` against the repository target
`24.18.1`) remains a local-development warning only; it did not prevent any
local verification step. The VPS deploy script will use the target runtime.

## Release-boundary correction

The older private-beta cutover script was not reused because it rotates
access-database credentials and rewrites the named Nginx configuration. That
would exceed DEC-0062. A new project-owned source-pass-through release script
builds an immutable release, preserves the existing environment and session
pepper, restarts only `cld-gb-sct-api.service` and
`cld-gb-sct-web.service`, tests their existing loopback health boundary, and
syntax-checks (but does not write or reload) the named Nginx site. Its rollback
restores only the immediately prior two project unit files/release.

## Explicit non-results

No Scottish Parliament API request, source response, source value, identifier,
file, cache entry, database write/migration, DB1, DB2, email, credential,
Cloudflare, Nginx write/reload, VPS access, deployment, or public data release
occurred in this local result.

## What next

Run DEC-0062's approved project-only VPS preflight. If it passes, deploy the
new two-service-only release and check the private shell without triggering a
source route. The owner then tests the three disclosed source actions one at a
time. DB1 remains blocked until the proxy phase has its separate beta-accepted
result.
