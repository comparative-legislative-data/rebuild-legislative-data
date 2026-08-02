# Native PostgreSQL Cluster Proposal — DEC-0025

**Status:** Approved — native-cluster direction only; an exact action remains
required

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision:** DEC-0025

## 1. Approved decision

The project owner approved a revised V4A direction: create one new native PostgreSQL 16 cluster
on the current VPS, dedicated to `GB-SCT`, instead of using the shared
`16-main` cluster.

This responds to DEC-0024, which established that `16-main` has wildcard
listeners. It retains the approved current-VPS/no-Docker direction while
removing the project databases from that shared cluster. It authorises only
preparation of a subsequent exact V4A cluster-foundation action.

It does not authorise a VPS mutation, package installation, source-data work,
application code, account/secret issuance, service deployment, Nginx/DNS
change, or use of `16-main`.

## 2. Proposed isolated cluster

| Concern | Proposed control |
| --- | --- |
| Native cluster identity | PostgreSQL 16 cluster `cld_gb_sct`, created only if that exact cluster name, service unit, data path, configuration path, log path, and port are absent. |
| Listener | PostgreSQL TCP listener bound only to `127.0.0.1:5434`. IPv6 is not enabled for the cluster unless a later exact proposal names and verifies it. No public listener and no firewall change. |
| Database engine separation | The cluster has its own PostgreSQL data directory, configuration directory, service unit, socket directory, log path, roles, and databases. It is not a database/schema in `16-main` or `16-bills`. |
| Data identities | Fresh `cld_gb_sct_db1` and `cld_gb_sct_canonical` databases; no restore, copy, legacy role, extension, table, source data, or schema is permitted. |
| Access model | V4A creates no-login roles and no secrets. A future V4B may enable only approved project roles through local TCP/SCRAM access after separate verification. |
| Host containment | The new cluster receives a service-specific systemd resource-limit drop-in before first start. It has no privilege over `16-main`, `16-bills`, Nginx, firewall, existing paths, or other services. |

The proposed port is deliberately `5434`: `5432` is `16-main`, `5433` is the
separate bills cluster, and 5434 must be proved unused at the exact-action
pre-flight. It is a selection, not an existing reservation or listener.

The exact action must create the new cluster with its start state disabled,
configure only the new cluster's listener/authentication files and its own
systemd drop-in, verify those files and limits, then start only the new cluster
for the bounded listener check. It must not restart, reload, or reconfigure an
existing PostgreSQL cluster.

## 3. Exact V4A cluster-foundation boundary

If DEC-0025 is approved, the next proposal may create only these new targets:

| Class | Exact future target | Exclusion |
| --- | --- | --- |
| Cluster | `16/cld_gb_sct` | Never `16/main` or `16/bills`; no cluster restart/upgrade/reload. |
| Data directory | Debian-managed new-cluster path for `16/cld_gb_sct` | Never a legacy or existing cluster path. |
| Configuration and log paths | Debian-managed new-cluster configuration and log paths for `16/cld_gb_sct` | No edit to `16-main`, `16-bills`, global PostgreSQL configuration, or shared `pg_hba.conf`. |
| Service | `postgresql@16-cld_gb_sct.service` | No change to existing services or global `postgresql.service`. |
| Local TCP port | `127.0.0.1:5434` | No public binding, Unix-socket dependency, firewall change, or use of another port. |
| Project roles/databases | The four fresh `cld_gb_sct_*` names approved in DEC-0009 | No legacy or shared role/database. |
| Project filesystem | The V4A paths already specified in DEC-0023, only after their own pre-flight succeeds | No existing project/legacy path. |

The later exact action must use existing native PostgreSQL 16 tools only. It
must stop, without package installation or configuration change, if the host
does not provide the required `pg_createcluster`, `pg_ctlcluster`, systemd, or
PostgreSQL 16 components.

## 4. Required pre-flight and controls

Before any mutation, the exact V4A record must verify and retain only
non-secret metadata showing that:

1. the current VPS identity matches the restricted V0–V3 record;
2. `16-main` and `16-bills` retain their observed cluster identities and are
   not target clusters;
3. `cld_gb_sct`, its proposed Debian-managed paths/service name, all project
   role/database names, the project paths, and TCP port 5434 are absent;
4. available host storage and memory support the stated new-cluster resource
   limits without a host-wide setting change;
5. the new cluster can be configured to accept TCP only at `127.0.0.1:5434`,
   with local peer administration and future local TCP SCRAM access; and
6. no step calls a package manager, edits existing PostgreSQL files, changes a
   firewall, reloads/restarts an existing cluster, or reads source data,
   credentials, database rows, logs, or unrelated application files.

The exact record must declare its final CPU/memory/task limits based on the
pre-flight capacity metadata. It must set those limits on the new cluster
service before first start, never on a shared or existing service.

## 5. Required verification

The resulting V4A record must show `PASS`, `FAIL`, or `BLOCKED` for:

- an active `cld_gb_sct` cluster bound only to `127.0.0.1:5434`;
- no listener on `0.0.0.0:5434` or `[::]:5434`;
- unchanged service state and database-name digests for `16-main` and
  `16-bills` (excluding no existing item, because neither is changed);
- fresh empty project databases, project-only roles with no login/password at
  foundation stage, and no `PUBLIC` database privilege;
- project-only configuration/data/log paths with expected owners and modes;
- no new Nginx site, firewall rule, systemd unit other than the new cluster,
  package, source capture, application process, or public endpoint; and
- resource limits present on the new service before its first start, and still
  present when the bounded listener check is complete.

An unexpected path/service/port collision, an inability to establish a
loopback-only listener, missing native PostgreSQL tooling, insufficient
capacity for the declared limit, or any required shared-cluster change is a
`BLOCKED` result—not a reason to use `16-main` or weaken the controls.

## 6. Later service and domain boundaries

The new database cluster is a foundation component only. It does not authorise
the frontend, backend, proxy, capture process, application database schema,
secret value, or use of `legislativedata.org`.

V4B remains separately gated: it must establish the runtime role's database
access and systemd resource boundaries without enabling access to `16-main`,
`16-bills`, or another workload. V4C remains the only stage allowed to alter
the named `legislativedata.org` Nginx site, after its own exact authorisation.

## 7. Consequence of approval

DEC-0025 authorises preparation of an exact V4A cluster-foundation
authorisation. It does not authorise creation of the cluster, any database,
service, account, secret, source-data activity, code, or public/domain change.
