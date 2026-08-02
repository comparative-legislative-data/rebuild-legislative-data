# Private-Beta Runtime and Private Cutover Package — DEC-0059

**Status:** APPROVED — EXECUTED PARTIAL (runtime/cutover PASS; owner acceptance pending)

**Version:** 1.1.0

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

The required owner-controlled input names were supplied before execution. Their
values were read only to stream them to the root-owned deployment process and
were not retained in this repository or a project record. The stop occurred
before a service secret file could be installed.

## 2.1 Execution stop — 2 August 2026

The first database command correctly created the two named access-only login
roles and scoped database-connect privileges to the canonical database.
However, an implementation defect addressed the subsequent `CREATE SCHEMA`
command to PostgreSQL's default `postgres` database rather than
`cld_gb_sct_canonical`. The immediate next statement, which expected that
schema in the canonical database, failed. The script's error trap restored the
prior project service-unit files and named Nginx file before any release,
service replacement, bootstrap-email, or public cutover could occur.

A read-only containment check found exactly one unexpected schema:
`postgres.access_control`, with zero relations. The intended canonical database
has no `access_control` schema. The old project API/web services remained
active on their loopback ports, and the named site's pre-existing configuration
was restored.

No source request, source data, DB1, DB2, account, Resend delivery, new
release, or Nginx configuration change remains in effect. The roles and
canonical-database connect grants created before the stop are access-control
infrastructure only; no application login can use them because no matching
schema or secret file was installed.

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

## 7. Database-target corrective action

The proposed minimal correction is:

1. drop only the newly created, verified-empty `access_control` schema from
   the default `postgres` database;
2. correct the deployment script to target `cld_gb_sct_canonical` for schema
   creation; and
3. repeat the existing DEC-0059 package, retaining the same project-only
   database roles, service paths, limits, email scope, and named-site boundary.

The owner approved and this corrective action was executed before the later
public-edge stop. The schema removal and corrected retry are recorded in the
stop result; this subsection is retained to explain the recovery path.

## 8. Public-edge stop — 2 August 2026

The approved correction removed the empty schema and the access-control schema
was then created in the intended canonical database. The target-host build,
local tests, scope scan, access-runtime database connection, API readiness,
web readiness, and local Nginx `/api/` proxy check passed.

The final public request through `https://legislativedata.org/` still returned
Cloudflare HTTP 502. The deployment trap restored the previous named Nginx
file, so the external site was not left pointing at a route that the public
edge could not reach. This is not evidence of a source, DB1, DB2, or research
data route.

No Cloudflare-zone, DNS, firewall, certificate, or shared Nginx action was
taken.

## 9. Final cutover result — 2 August 2026

The public-edge stop was traced to the deployment procedure, not Cloudflare:
the named site had been restored to the legacy `127.0.0.1:3100` upstream after
the old public check failed. A subsequent local proxy check could briefly be
handled by an old Nginx worker immediately after reload. The procedure was
corrected to wait (for at most ten seconds) for the named `/api/` proxy to
return the API-ready marker; the locally verified origin configuration is no
longer rolled back merely because a separate public-edge check fails.

The exact deployed revision is `7210ffb3690b0d3930b7aef6f15ccc7014abf842`.
The target-host build, tests, capability scan, canonical access-control
migration, loopback API/web checks, and named-site proxy check passed. Direct
HTTPS to the VPS using the domain name and normal public HTTPS through
Cloudflare both returned HTTP 200. The API health response confirms that
authentication is available and that all source, DB1, DB2, and research-data
layers remain unavailable.

This is an infrastructure/runtime pass, not a research-data release or the
package's complete user-journey acceptance. The outstanding owner acceptance
check is to use the single-superuser activation flow and confirm the private
beta shell.

## 10. Activation transition and beta-shell correction — 2 August 2026

The owner acceptance attempt established that password creation and session
issuance succeeded, but the client retained the consumed `activate` query
state and therefore continued to render the set-password form. The correction
now clears that state and the URL only after `/auth/me` confirms the new
server-side session. It leaves the form in place with a truthful recovery
message if that confirmation is absent.

The same owner-approved correction refreshed the access-only shell's visual
system using an original dark-navy and restrained-gold treatment. A read-only
pilot review informed the broad visual direction only: no pilot component,
route, data, statistics, external font, or operational dependency was copied.
The deployed revision is `21723a098c52c00c432a072eaae0d66765d0241d`.
The target-host verification, loopback API/Nginx readiness, active service
checks, and public HTTPS check passed. The server-side session pepper was
preserved during this routine release, so already valid sessions are not
invalidated by the deployment.

The final owner acceptance check remains: refresh the public site and verify
that a normal password login reaches the signed-in private-beta shell.
