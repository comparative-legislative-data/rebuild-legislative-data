# V4B B1 Local Application-Shell Implementation Proposal — DEC-0038

**Status:** Approved — execution `PASS`; local implementation only

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0038, approved 1 August 2026

## 1. Purpose and exact scope

DEC-0037 selected the first application stack: Node.js 24 LTS (with local B1
baseline `24.14.1`), TypeScript,
Fastify for a separate API, and React/Vite for a separate web application. The
owner approved one local-repository B1 package to implement only the synthetic
operational shell specified in DEC-0037. Its execution result is recorded in
`V4B_B1_LOCAL_IMPLEMENTATION_RESULT_2026-08-01.md`.

The package would create a reproducibly built and tested source artefact. It
would not access the VPS, install anything on it, connect to PostgreSQL,
request or retain source data, issue a secret, create a schema or database
login, bind a public port, or deploy a service.

## 2. Authorised B1 target, if approved

| Area | Permitted outcome |
| --- | --- |
| Runtime contract | `.nvmrc` and `package.json` both require exactly Node.js `24.14.1`; build metadata records the observed local Node/npm versions. This local build pin does not select the later VPS runtime. |
| Dependency control | One root `package.json` and committed `package-lock.json`, using npm workspaces and exact direct dependency versions. Installation is `npm ci --ignore-scripts`; no lifecycle script may run. |
| API source | `apps/api` implements only `GET /healthz` at configured loopback host/port, with the exact `process_ready` and capability contract in DEC-0037. |
| Web source | `apps/web` implements a React/Vite static page and `GET /healthz` through its local static-asset server. It has no API/data request, chart, analytical calculation, or external asset. |
| Shared contract | `packages/contracts` provides the versioned health-response schema/types. It contains no source or research-data model. |
| Verification | `packages/verification`, `tests/`, and scripts prove contracts, static configuration, prohibited-network behaviour, truthful labels, lockfile/build integrity, and release-manifest shape. |
| Deployment templates | `ops/systemd/` contains uninstalled templates only. They must express the DEC-0037 account, loopback, hardening, and limit requirements but cannot be copied to or tested on the VPS. |
| Local release artefact | A generated, ignored archive below `artifacts/` with its JSON manifest and SHA-256 digest. No generated archive, dependency directory, or environment file is committed. |

The web static server may use a pinned Fastify static-file module solely to
serve its compiled assets and the specified `/healthz` check. It must expose no
other web API route.

## 3. Allowed dependency set and installation boundary

The B1 implementation may add only the following direct dependencies, all
pinned by exact version in both the root manifest and lockfile:

| Purpose | Allowed packages |
| --- | --- |
| API/static serving | `fastify`, `@fastify/static` |
| Web UI/build | `react`, `react-dom`, `vite`, `@vitejs/plugin-react` |
| Type checking | `typescript`, `@types/node`, `@types/react`, `@types/react-dom` |

No database driver, ORM, migration tool, HTTP client, analytics, charting
library, UI component suite, authentication package, testing framework, or
source-specific package is permitted. Node's built-in test runner is required.
Any addition or substitution requires a new owner-approved package.

Before installation, the implementation record must capture the exact selected
versions, Node/npm version, package manifest digest, and lockfile digest. It
must run `npm ci --ignore-scripts`, then demonstrate that the dependency tree
does not introduce an enabled lifecycle script. If installation fails, yields a
lockfile mismatch, attempts a lifecycle script, or requires a package outside
the table, stop without workaround.

## 4. Required source and behaviour

The implementation must make all defaults explicit:

- both processes reject any host other than `127.0.0.1` and their assigned
  port (`3210` API; `3220` web) when started through the supported commands;
- the API returns only the DEC-0037 JSON health response and an explicit
  `application/json` content type;
- the web server returns `process_ready` for `/healthz` and serves only the
  compiled local static files;
- the React page visibly identifies itself as an internal deployment check and
  as not a data release; and
- no code imports a database client, makes an outbound HTTP request, embeds an
  endpoint URL, reads a secret/environment file, or performs analytical logic.

The source must not use placeholder source content, fictitious bill/member
records, mock official data, or claimed metrics. Only the static operational
capability labels defined in DEC-0037 are allowed.

## 5. Required local verification and retained result

The implementation must retain a non-secret local B1 result containing command
versions, input commit, lockfile and build digests, timestamps, and `PASS`,
`FAIL`, or `BLOCKED` for each check below:

| Check | Passing condition |
| --- | --- |
| Runtime alignment | `.nvmrc`, `package.json`, and recorded Node version are exactly `24.14.1`. |
| Dependency integrity | `npm ci --ignore-scripts` succeeds from the committed lockfile; direct dependency set matches §3. |
| Static checks | Strict TypeScript check, production web/API build, and source scan complete with no ignored errors. |
| API contract | Local test asserts only the exact JSON schema, content type, capability values, and loopback configuration for `/healthz`. |
| Web contract | Local test/build assertion proves `/healthz`, the deployment-check page, and locally bundled assets without API/external requests. |
| Prohibited capability | Source/build checks fail on database-client imports, network-client imports, source URLs, secret-file references, non-loopback host binding, chart/analytics packages, or prohibited status words. |
| Release integrity | Rebuilding from the same clean commit and lockfile yields the same manifest content except for an explicitly isolated build timestamp; archive contents are allowlisted and checksummed. |
| Template boundary | Unit templates are present only in the repository and are not installed, enabled, started, or validated against the VPS. |

No B1 check may claim a service is deployed, source-backed, database-backed,
publicly reachable, production-ready, or a research release.

## 6. Containment, rollback, and stop conditions

The only mutable target is this Git repository and its local ignored build
directory. A failed implementation is contained by stopping, retaining the
failed local result, and reverting only the named B1 commit through normal Git
review if the owner directs it. It must not be compensated for by accessing the
VPS, adding a database, loosening a test, changing a service boundary, or
fetching source data.

Stop and seek a new decision if the package needs a new dependency category,
package-install privilege beyond the approved local command, a database/
secret/source/VPS action, a non-loopback listener, an unlisted route, a public
claim, or any change to the B0 stack contract.

## 7. Decision requested

DEC-0038 authorised and completed the one local-repository B1 package in §§2–6,
including its bounded npm dependency installation. It did not authorise or
perform any VPS, service, database, schema, secret, source-data,
network-listener, Nginx/DNS/firewall, or public-release action. A separate B2
proposal and owner approval remain required before any local deployment.
