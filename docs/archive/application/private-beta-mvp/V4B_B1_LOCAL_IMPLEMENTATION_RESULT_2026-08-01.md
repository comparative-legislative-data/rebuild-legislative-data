# V4B B1 Local Implementation Result

**Status:** `PASS` — scoped local implementation only

**Date:** 1 August 2026

**Authorising decision:** DEC-0038

## Scope and boundary

This result covers only the local-repository B1 application shell. It created
the Node/TypeScript workspace, a Fastify API health endpoint, a React/Vite web
deployment-check page, tests, capability checks, deterministic packaging, and
uninstalled systemd templates.

No VPS, SSH credential, database, schema, migration, database login, secret,
source registry, source request/capture, external data, public listener,
service deployment, Nginx, DNS, firewall, or public claim was used or changed.

## Inputs and versions

| Item | Evidence |
| --- | --- |
| Starting repository commit | `5b87ad4b3f4fb9f15c87bda5c7cc8dd9c8efab69` |
| Node runtime | `v24.14.1` |
| npm runtime | `11.11.0` |
| Lockfile SHA-256 | `47f99d40ab155adea354f85bdd908213f8e0eb7ea6808efbd1b07f61a51e992a` |
| Direct production dependencies | `fastify` `5.11.0`; `@fastify/static` `10.1.2`; `react` and `react-dom` `19.2.8` |
| Direct development dependencies | TypeScript `7.0.2`; Vite `8.2.0`; React Vite plugin `6.0.5`; approved Node/React type packages |

All direct dependencies are exact-versioned in `package.json` and the committed
lockfile. Initial installation and staging installation used lifecycle scripts
disabled (`--ignore-scripts`).

## Verification results

| Check | Result |
| --- | --- |
| Runtime alignment | `PASS` — `.nvmrc`, manifest engine policy, and observed local Node runtime are `24.14.1`. |
| Dependency integrity | `PASS` — committed lockfile installed with `npm ci --ignore-scripts`; direct dependency allowlist passed; npm reported no vulnerabilities in the installed tree. |
| Static quality | `PASS` — strict TypeScript checks and Vite production build completed. |
| API contract | `PASS` — exact JSON health response, content type, capability labels, and non-loopback configuration rejection tested. |
| Web contract | `PASS` — health response and no-data deployment-check page tested; non-loopback configuration rejection tested. |
| Prohibited capability scan | `PASS` — no database, outbound network, secret, source, or prohibited-status capability token found in application/package source. |
| Release contents | `PASS` — archive contains compiled API, compiled web server/static assets, shared contract, pinned production dependencies, lockfile, runtime pin, and unit templates. No environment file or project raw/DB1/canonical path was found in the archive listing. |
| Reproducibility | `PASS` — two equivalent package builds produced identical manifest and archive digests after fixed timestamps and sorted archive entries. |
| Template boundary | `PASS` — unit templates remain repository files only; none was installed, enabled, started, or validated on the VPS. |

The test run reported five passing tests and zero failures. The health response
uses `process_ready`, `NO_SOURCE_DATA`, `NO_DATABASE_CONNECTIVITY`, and
`NOT_A_RESEARCH_RELEASE`; it does not claim source, database, deployment, or
research-release readiness.

## Retained generated evidence

The following local generated artefacts are intentionally ignored by Git but
were produced and checked during this run:

| Artefact | SHA-256 |
| --- | --- |
| `artifacts/b1-local-only/manifest.json` | `2e0407e8145314d219043321d543d1e3150e7e11a316f84d22c6d5fb97f04824` |
| `artifacts/b1-local-only/b1-local-only.tar.gz` | `4d55e3fb44615a01820405f9359b693a3dcbe5e5ceda074b43b3e3b386502b07` |

## Remaining boundary

B1 is a local implementation/build result, not a deployment result. Before
any B2 action, a separate approved package must select and verify a
then-supported Node 24 patch for the VPS, inspect only the necessary existing
project targets, and specify the release/install, service, port,
non-interference, and rollback procedure. Database connectivity, secrets,
schema/migrations, source data, Nginx/DNS/firewall changes, and public
exposure remain separately gated.
