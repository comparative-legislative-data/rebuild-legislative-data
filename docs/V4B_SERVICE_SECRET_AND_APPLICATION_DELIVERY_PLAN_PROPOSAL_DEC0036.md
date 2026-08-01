# V4B Service, Secret, and Application Delivery Plan Proposal — DEC-0036

**Status:** Approved — B0 application-delivery specification preparation only;
no service, secret, application, source, database-schema, dependency, or
public-web action is authorised

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0036, approved 1 August 2026

## 1. Purpose and observed starting point

DEC-0035 completed V4A. The project now has an isolated, loopback-only
PostgreSQL cluster, two empty project databases, two empty no-login roles, and
the reserved V4 service namespace. It does **not** yet have application source,
a selected runtime, a dependency lockfile, a database schema or migration, a
runtime database login, a secret, a build artefact, a systemd service unit, or
a health endpoint.

It would therefore be misleading and operationally unsafe to start a generic
or placeholder backend/frontend service. V4B should create a reviewable chain
from an application specification to a reproducible local-only deployment.
The approved decision does not select an implementation technology or claim
that a service is ready. It authorises B0 specification preparation only.

## 2. Active scope, authority, and containment

| Item | Record |
| --- | --- |
| Active phase | V4B delivery planning after the completed V4A foundation |
| Current authority | Owner approval of DEC-0036 (1 August 2026); DEC-0035 completed V4A |
| Systems affected now | Repository documentation only |
| Explicitly excluded | VPS access or change; package installation; credential or secret issuance; database-schema/migration work; application code; source request/capture; DNS, firewall, Nginx, or public exposure |
| Verification artefact | This proposal, the decision/risk/dependency registers, and the governance-review entry updated with it |
| Rollback | Documentation-only commit may be superseded through the normal decision/change process; no operational state is created |

Known uncertainty is material: the project has no chosen application runtime or
implementation. This proposal preserves that uncertainty rather than filling
it with an assumed stack.

## 3. Proposed delivery sequence

V4B is divided into independently authorised packages. Passing one package
does not authorise the next.

| Package | Outcome | Minimum evidence | Not authorised by this proposal |
| --- | --- | --- | --- |
| B0 — application delivery specification | A reviewed technical contract for the first backend/frontend increment. | Runtime and version policy; dependency/lockfile policy; source layout; build/test commands; release-artifact identity; local health contracts; database-migration boundary; secret inventory names; proposed unit hardening; acceptance checks. | Code, VPS work, package install, secrets, schema, services, source access. |
| B1 — versioned implementation evidence | A tested, versioned implementation and reproducible release artefact that satisfy B0. | Source revision; pinned runtime/dependency evidence; test results; build digest; health-check behaviour; migration scripts and validation where applicable. | VPS deployment, secret creation, public exposure, source capture unless separately approved. |
| B2 — isolated local deployment | Named release files and two least-privilege systemd services, bound only to their reserved loopback ports. | Exact units, release path, runtime account/paths, secret-file references, database-privilege plan, resource limits, local health and non-interference results. | Nginx/DNS/firewall change, public endpoint, source capture, unapproved migration or limits change. |
| B3 — local acceptance record | Retained evidence that the named services are healthy and isolated on the VPS. | Unit status; loopback bindings; health results; service hardening/ownership checks; project-database access checks; non-interference evidence. | Public availability, public claims, `legislativedata.org` cutover. |

V4C remains the only stage that may change the named Nginx site or make the
services reachable through `legislativedata.org`.

## 4. B0 application delivery specification requirements

The B0 proposal must be small enough to review as an engineering contract and
must name all of the following before B1 is considered:

1. the language, runtime and exact supported version; package manager; lockfile
   requirement; and how dependencies are obtained and verified;
2. the repository layout, backend/frontend responsibility boundary, build and
   test commands, and deterministic release-artifact format with revision and
   digest;
3. the public-free local health contracts for `127.0.0.1:3210` (API) and
   `127.0.0.1:3220` (web), including response, timeout and failure behaviour;
4. the database migration policy: explicit schema versioning, migration role,
   rollback/forward policy, and a separate approval point before any database
   schema change or runtime login/secret is created;
5. a secret inventory containing names, purpose, owner, consumer, rotation/
   revocation procedure, and dependency only—never secret values;
6. the proposed service unit contracts: account, group, `EnvironmentFile`
   reference, working/release directory, read/write paths, CPU/memory/task
   limits, restart policy, and hardening; and
7. tests and verification that do not make external source calls, expose a
   public listener, calculate unpublished research outputs in the browser, or
   imply data provenance that has not been captured and validated.

The specification must retain the project distinction between raw capture,
operational DB1 projection and canonical outputs. A healthy empty service is
not evidence of a source proxy, DB1 mirror, canonical dataset, or public
research release.

## 5. B2 deployment boundary

If B0 and B1 are later approved and passed, an exact B2 work package may use
only the following proposed project-owned namespace:

| Resource | Proposed boundary |
| --- | --- |
| Release files | `/srv/cld-gb-sct/releases/<release-id>/` only, with an immutable revision/digest record |
| Backend service | `cld-gb-sct-api.service`, run as `cld-gb-sct`, bound only to `127.0.0.1:3210` |
| Frontend service | `cld-gb-sct-web.service`, run as `cld-gb-sct`, bound only to `127.0.0.1:3220` |
| Secrets | Root-owned files below `/etc/cld-gb-sct/secrets/`, referenced by path only and issued only after an exact approval |
| Database | The V4A project cluster/databases only, through separately approved least-privilege login roles and schema/migration records |

Each final unit must retain `NoNewPrivileges`, `ProtectSystem`,
`ProtectHome`, narrow `ReadWritePaths`, and the established explicit CPU,
memory, and task limits unless a later approval changes them. It must not run
as `chessadmin`, read another workload's directory/secret, connect to a
pre-existing database, or bind a non-loopback listener.

Before and after any B2 action, the package must check the V4A database
cluster, `16-main`, and `16-bills` within the stated non-interference boundary;
it must stop on a port collision, privilege leak, failed hardening check,
unexpected database target, or resource-limit issue.

## 6. Explicit gates retained

DEC-0036 authorises B0 planning only. It does not authorise B1, B2, or B3
execution. Each of the following requires a subsequent owner-approved, exact
package:

- application implementation, dependency installation, or release build;
- a database schema, migration, login-capable role, password, or any secret;
- deployment files, systemd unit creation/change, service start, or VPS check;
- source registry access, source request/capture, parser/proxy/DB1 work, or
  canonical variable/chart work; and
- Nginx, DNS, firewall, certificate, public listener, or public claim.

## 7. Acceptance and decision requested

The owner approved DEC-0036 to adopt the B0–B3 sequence and permit preparation
of the B0 application delivery specification. All operational and data actions
remain blocked until their later, exact authorising packages are approved.
