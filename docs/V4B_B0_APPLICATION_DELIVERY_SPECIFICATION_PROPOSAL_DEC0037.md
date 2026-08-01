# V4B B0 Application Delivery Specification Proposal — DEC-0037

**Status:** Approved — B1 implementation-package preparation only; no
application, dependency, VPS, database, secret, source-data, or public-web
action is authorised

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0037, approved 1 August 2026

## 1. Purpose and scope

DEC-0036 authorises preparation of B0, the application delivery specification.
This document proposes the smallest independently testable application
increment: a local-only backend health service and a local-only web health
page. It uses synthetic operational metadata only. It does not represent a
source proxy, DB1 projection, canonical dataset, research output, or public
website.

The repository currently contains documentation only. No legacy code, package
manifest, dependency lockfile, schema, migration, secret, database login,
service unit, source response, or frontend implementation has been inherited
or inspected for reuse.

## 2. Proposed technology contract

| Concern | B0 specification |
| --- | --- |
| Language | TypeScript, with strict compiler settings and no implicit `any` in project code. |
| Runtime | Node.js `24.17.0` LTS. B1 must record that exact version in `.nvmrc`, `package.json` `engines`, the CI test record, and the release manifest. A B1 build fails if these disagree. |
| Package manager | npm only. `package-lock.json` is mandatory; installation uses `npm ci`, never an unrecorded dependency resolution. |
| Workspace | npm workspaces: `apps/api`, `apps/web`, `packages/contracts`, and `packages/verification`. The first implementation may leave a workspace absent only when the B1 record explicitly explains why. |
| Backend | Fastify, with exact package versions locked in `package-lock.json`. It owns API routing and API health only. |
| Frontend | React plus Vite, with exact package versions locked in `package-lock.json`. It is a display client only; it must not calculate, classify, aggregate, or infer research results. |
| Database driver | None in the first B1 application shell. Adding PostgreSQL connectivity, a migration tool, a login role, or a database secret is a later separately approved package. |
| Test tools | Node's built-in test runner for service/contract tests and a browser-independent build check for the web application. Additional test tooling requires its pinned dependency and B1 rationale. |

Node.js `24.17.0` is the selected supported LTS baseline at this decision
point. This is a technology choice, not a claim about the host's installed
packages; B1 must not assume the runtime exists on the VPS. Any version update
requires a documented dependency/runtime review and a matching lockfile,
test, and release-manifest record.

## 3. Repository and release layout

The B1 implementation must use the following project-owned layout. It may add
only directly supporting files needed for the stated build, tests, contracts,
or deployment templates.

```text
apps/
  api/src/
  web/src/
packages/
  contracts/src/
  verification/src/
ops/
  systemd/
tests/
```

`packages/contracts` contains versioned TypeScript types and explicit JSON
response schemas shared by the two applications. It must not contain source
records, endpoint payloads, variable definitions, or analytical rules.
`packages/verification` contains test helpers and build-manifest validation;
it must not make network requests.

A release is an immutable tar archive containing only compiled application
files, production dependency files, the lockfile, a build manifest, and the
approved systemd templates by reference. Its manifest must include:

- source commit identifier and a clean-worktree assertion;
- Node version, npm version, lockfile SHA-256, and archive SHA-256;
- UTC build timestamp, build command, test commands/results, and build output
  paths; and
- declared capability status: `NO_SOURCE_DATA`, `NO_DATABASE_CONNECTIVITY`,
  `NO_PUBLIC_LISTENER`, and `NOT_A_RESEARCH_RELEASE`.

The archive must not include secrets, `.env` files, database connection
strings, captured data, raw source documents, or untracked build inputs.

## 4. Initial service contracts

### 4.1 API — proposed `cld-gb-sct-api.service`

The API process is configured only with `HOST=127.0.0.1` and `PORT=3210`.
Its first route is:

```text
GET /healthz
200 application/json
{
  "service": "cld-gb-sct-api",
  "status": "process_ready",
  "build_id": "<release-manifest identifier>",
  "capabilities": [
    "NO_SOURCE_DATA",
    "NO_DATABASE_CONNECTIVITY",
    "NOT_A_RESEARCH_RELEASE"
  ]
}
```

`process_ready` means only that the named process has started and can return
this static operational response. It must not be called `healthy` in a sense
that implies source availability, database validity, capture status, or data
quality. No other API route, CORS policy, proxy behaviour, persistence, or
external request is part of this first shell.

### 4.2 Web — proposed `cld-gb-sct-web.service`

The web process is configured only with `HOST=127.0.0.1` and `PORT=3220`.
It serves a static React/Vite build with a route `/healthz` returning:

```text
200 text/plain
process_ready
```

The displayed page must identify itself as an internal deployment check,
contain no charts/tables/counts or source-derived text, and state that no data
release is available. It may request only its own static assets. It must not
call the API, a source endpoint, a database, analytics, a CDN, or any other
network service.

## 5. Database and secret boundary

The initial B1 service shell has no database dependency and no secret
dependency. Consequently it must not read `/etc/cld-gb-sct/secrets/`, accept a
database URL, create a login role, connect to port 5434, create a schema, or
run a migration.

Before any database-connected increment, a separate proposal must define:

1. the new least-privilege login roles and their database-specific grants;
2. migration naming, checksum, transaction, forward-only/rollback, and failed
   migration behaviour;
3. the environment-file inventory (name, purpose, owner, consuming service,
   creation/rotation/revocation evidence; never a value);
4. which service reads which secret file and why; and
5. a verification record showing no access to existing clusters or another
   workload's paths.

## 6. Proposed future systemd contract

B1 may prepare unit *templates* in the repository but may not install, enable,
start, or otherwise use them on the VPS. A later B2 authorisation must provide
the final units. Each must, at minimum:

- run as `cld-gb-sct` with a fixed `WorkingDirectory` below the immutable
  release directory;
- bind only its named loopback port, have no public listener, and use no
  elevated capability;
- use `NoNewPrivileges=true`, `ProtectSystem=strict`, `ProtectHome=true`,
  `PrivateTmp=true`, `ProtectKernelTunables=true`, `ProtectControlGroups=true`,
  `RestrictSUIDSGID=true`, `LockPersonality=true`, and a narrow
  `ReadWritePaths` list; and
- preserve the V4A CPU (`35%`), memory (`768M`) and task (`128`) limits unless
  a later owner approval changes one of them with non-interference evidence.

The B2 proposal must test the final directives against the target operating
system and package them with a stop/rollback plan. A template is not evidence
that its directives are available or effective on the VPS.

## 7. B1 implementation and verification contract

The next implementation package must be limited to creating the versioned
application shell and proving it locally, with no source or VPS access. It
must provide all of the following before a B2 proposal can be prepared:

| Check | Required result |
| --- | --- |
| Dependency integrity | `npm ci` succeeds from the committed lockfile; the runtime and npm versions are recorded. |
| Static quality | Typecheck, lint (if introduced), and production build succeed without ignored errors. |
| API contract | Tests assert the exact `/healthz` status, content type, JSON schema, loopback host configuration, and capability labels. |
| Web contract | Build check asserts `/healthz`; page tests/assertions establish no data, API, or external network call is embedded. |
| Network prohibition | Tests fail if the applications attempt an outbound source, database, analytics, CDN, or other external request. |
| Release integrity | Archive contents conform to §3; manifest and archive checksums reproduce from the same committed source and lockfile. |
| Truthful labels | Automated check rejects prohibited labels such as `live`, `official`, `mirror`, `complete`, or `verified` unless tied to a defined verification scope. |

The B1 result is a development/build artefact only. It cannot describe either
service as deployed, available, source-backed, or ready for V4C.

## 8. Explicit exclusions and decision requested

The owner approved DEC-0037 to adopt this B0 specification—Fastify for the
separate API and React/Vite for the separate web application—and to permit
preparation of a separate B1 implementation package. It does not authorise
application code, dependency installation, source access/capture, database
work, credentials, secrets, VPS access/change, service deployment,
Nginx/DNS/firewall change, or public release.
