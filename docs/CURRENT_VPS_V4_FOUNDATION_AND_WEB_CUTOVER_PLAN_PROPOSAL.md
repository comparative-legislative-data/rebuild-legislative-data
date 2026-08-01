# Current-VPS V4 Foundation and Web-Cutover Plan Proposal — DEC-0022

**Status:** Approved V4 boundary; its original V4A `16-main` database target
is `BLOCKED` by V4A-L1 listener evidence

**Version:** 1.1.0

**Prepared:** 1 August 2026

**Decision:** DEC-0022

## 1. Approved decision

The project owner approved the staged V4 plan for a no-Docker `GB-SCT`
foundation on the current VPS and a later, explicitly gated
`legislativedata.org` frontend/backend cutover.

V4A-L1 established that the shared `16-main` cluster has a wildcard listener.
The original V4A database target is therefore not usable under DEC-0009. The
staged boundary remains in force, but a new, separately approved V4A proposal
is required before any foundation action.

The plan has three independently authorised stages. Later stages are not
implied by an earlier one:

| Stage | Purpose | Requires before execution |
| --- | --- | --- |
| V4A | Create isolated accounts, paths, PostgreSQL roles/databases, and secret-file structure. | An exact V4A authorisation. |
| V4B | Install and start the new backend and frontend services under their isolated accounts. | Approved application/deployment plan, exact service definitions, and V4B authorisation. |
| V4C | Point `legislativedata.org` at the verified new frontend/backend. | V4B acceptance evidence and exact Nginx cutover authorisation. |

## 2. V4A foundation boundary

V4A may create only these new resources:

| Class | Proposed resource | Isolation rule |
| --- | --- | --- |
| Runtime account/group | `cld-gb-sct` | Non-login, no sudo, no membership in a shared application group. |
| Deployment account/group | `cld-gb-sct-deploy` | Key-only access and only the later approved deployment permissions. |
| Project root | `/srv/cld-gb-sct/{raw,db1,canonical,releases,state}` | New project-owned paths only; no legacy path is renamed, reused, or removed. |
| Secret root | `/etc/cld-gb-sct/secrets/` | Root-owned; secret values never enter Git, command lines, or logs. |
| Database roles | `cld_gb_sct_runtime`, `cld_gb_sct_migrate` | No superuser, no createdb/createrole, no grants on any existing database. |
| Databases | `cld_gb_sct_db1`, `cld_gb_sct_canonical` | Fresh databases in a separately approved loopback/private native cluster, with `PUBLIC` connection revoked and project-role-only access. `16-main` is excluded. |
| Reserved loopback ports | `127.0.0.1:3210` (backend), `127.0.0.1:3220` (frontend) | Must be proven unused before use; no public listener or firewall change. |

V4A must not create a Docker resource, modify PostgreSQL cluster settings,
`pg_hba.conf`, the `chessadmin` role, existing services, existing databases,
Nginx, DNS, firewall policy, or application code.

## 3. Frontend and backend service boundary

The project will host both a backend and frontend on this VPS, but neither
service starts until its code, dependencies, exact systemd unit, health check,
and resource limits are separately reviewed.

The service namespace is reserved as follows:

- `cld-gb-sct-api.service` — backend, bound only to `127.0.0.1:3210`;
- `cld-gb-sct-web.service` — frontend, bound only to `127.0.0.1:3220`; and
- optional future capture/worker units named `cld-gb-sct-*`, each requiring its
  own approved scope.

Every V4B unit must run as `cld-gb-sct` and include explicit `CPUQuota`,
`MemoryMax`, `NoNewPrivileges`, `ProtectSystem`, `ProtectHome`, and narrow
`ReadWritePaths`. It may read only its own declared secret file and project
paths. No service may use `chessadmin`, a superuser database role, a shared
project directory, or another workload's secret/configuration file.

## 4. `legislativedata.org` cutover boundary

The existing `legislativedata.org` Nginx site is the only existing web
configuration that a future V4C may alter. No other virtual host, domain,
certificate, upstream, Nginx global setting, or firewall rule is in scope.

V4C cannot begin until V4B has retained evidence that both local services are
healthy on their reserved loopback ports. The exact cutover record must:

1. identify the current site file and a root-owned rollback copy by reference;
2. change only the `legislativedata.org` upstream/static directives needed for
   the new frontend and backend;
3. run `nginx -t` before any reload;
4. reload Nginx only after a passing syntax check;
5. verify the named domain, both loopback services, and the intended backend
   route; and
6. restore only the named site file and reload Nginx if the defined checks fail.

An Nginx reload is a shared-host control-plane action. It is therefore deferred
until the exact V4C authorisation and its pre-checks are approved; it is not
part of V4A or V4B.

## 5. Non-interference requirements

Each V4 stage must verify, before and after its scoped change, that:

1. PostgreSQL `16-main` remains active and all pre-existing databases remain
   present;
2. no existing service unit, port, Nginx site, role, database, or path is
   changed outside the listed target;
3. the new PostgreSQL roles cannot connect to any pre-existing database;
4. the new runtime account cannot read another workload's path or secret; and
5. no Docker, cluster-wide PostgreSQL, host-wide cleanup, or broad Nginx action
   is introduced.

Any failed check is `BLOCKED`; it is not bypassed through a fallback port,
shared role, broad permission, or unreviewed restart.

## 6. Evidence and stop conditions

V4 execution records must retain only non-secret command results, ownership/
mode metadata, database-role/database-grant metadata, service status, port
bindings, and scoped health checks. They must not retain secret values, raw
source data, database rows, environment values, or unrelated application
content.

Stop on a port collision, database-role privilege leak, unexpected Nginx
validation result, failed resource limit, path ownership ambiguity, existing
service dependency, or any required broad configuration change.

## 7. Consequence of approval

DEC-0022 authorises preparation of an exact V4A foundation authorisation only.
It does not authorise a VPS mutation, service start, frontend/backend
deployment, Nginx/DNS change, source capture, or application code.
