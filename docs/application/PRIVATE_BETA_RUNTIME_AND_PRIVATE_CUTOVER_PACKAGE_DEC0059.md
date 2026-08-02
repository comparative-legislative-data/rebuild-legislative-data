# Private-Beta Runtime and Private Cutover Package — DEC-0059

**Status:** APPROVED — BLOCKED pending owner secret input

**Version:** 1.0.0

**Recorded:** 2 August 2026

**Authority:** Project-owner instruction to proceed with the controlled
private-beta runtime and deployment following DEC-0058.

## 1. Outcome and boundary

This package turns the tested local access foundation into a usable,
private-beta access service. It permits the account-control database schema,
the server-only authentication runtime, a tightly bounded Resend bootstrap,
and a cutover of the existing `legislativedata.org` Nginx site to the already
isolated project web/API services.

It does not permit an upstream relay, source request, raw capture, DB1,
canonical research variables, a data download, a research-data route, or a
claim about any research data.

## 2. Read-only preflight record

The 2 August 2026 preflight established the following without reading source
or account data and without changing the VPS:

| Item | Result |
| --- | --- |
| Project services | `cld-gb-sct-api.service` and `cld-gb-sct-web.service` are active, loopback-only on ports 3210 and 3220. |
| Project database cluster | `16-cld_gb_sct` is active on loopback port 5434; its configured socket path is `/run/postgresql-cld-gb-sct`. |
| Existing site target | The sole `legislativedata.org` Nginx site points to unused loopback port 3100. Both direct local and public domain checks return HTTP 502. |
| Project secret root | `/etc/cld-gb-sct/secrets/` exists under the approved root-owned secret boundary. |
| Public edge | The domain is served through Cloudflare; its current public HTTP and HTTPS responses are 502. |

The preflight did not inspect source data, account data, secret values,
unrelated service configuration, or database contents.

The owner-controlled local input did not contain the three required variable
names at the time of the preflight. No secret was requested, read, generated,
or installed.

## 3. Exact mutable scope

| Resource class | Permitted target and outcome |
| --- | --- |
| Repository | Access-runtime implementation, tests, release packaging, this package/result, and the governing register updates needed to describe the actual result. |
| Canonical database only | Create `access_control`; create the two access-only login roles; apply the reviewed schema; revoke default access; grant only the required access-control privileges; demonstrate denial of DB1 and non-access-control schemas. No research schema/table or DB1 object may be created or changed. |
| Secret boundary | Create project-owned server-only values for the access database login and session pepper; install the owner-supplied Resend and bootstrap identity values in the existing root-owned secret directory. Values must not enter Git, commands, logs, or results. |
| Project services | Replace only the two existing `cld-gb-sct-*` release/unit definitions with an immutable tested release that remains loopback-only and retains the established resource/hardening controls. |
| Named Nginx site | Back up and change only `/etc/nginx/sites-available/legislativedata.org`, then syntax-test and reload Nginx. `/` may point to the project web service and `/api/` to the project API service. No other Nginx site, DNS, firewall, certificate, listener, or shared service may be changed. |
| Email | One redacted controlled bootstrap delivery through the already configured Resend account, to the initial superuser only. No source-data or bulk email is permitted. |

## 4. Required controls and acceptance

1. The migration/grant proof must show access-only grants, `PUBLIC` revocation,
   and denials for DB1 and non-access-control research schemas before an
   application database login is enabled.
2. Passwords use Argon2id; opaque session and one-time-link values are retained
   only as peppered digests. Generic responses prevent account enumeration.
3. Browser sessions require `Secure`, `HttpOnly`, and `SameSite=Lax` cookies.
   The public edge must present HTTPS before a password or session flow is
   treated as accepted.
4. The service may expose only an authenticated beta shell and named synthetic
   gate. It cannot expose source, DB1, DB2, chart, export, or download routes.
5. Before a service replacement and immediately after it, verify project
   loopback bindings and the active state of the three PostgreSQL clusters.
   Stop on a protected-service change, a port collision, privilege leak,
   unexpected Nginx dependency, or any non-project target.
6. If an acceptance check fails, restore only the prior project release/unit
   and the backed-up named Nginx file as relevant; do not make a corrective
   change outside this package.

## 5. Required owner-supplied values

The package requires an uncommitted, owner-controlled input containing only:

- `INITIAL_SUPERUSER_EMAIL`
- `RESEND_API_KEY`
- `ACCESS_FROM_EMAIL`

The deployer generates the access database password and session pepper on the
VPS. No value is written to this repository or a project record.

## 6. Completion condition

The result is `PASS` only if one intended superuser can receive a single-use
activation link, establish a password, obtain a secure server-side session,
and see the beta shell with no research-data route available. A 502-free site
alone is not a pass.
