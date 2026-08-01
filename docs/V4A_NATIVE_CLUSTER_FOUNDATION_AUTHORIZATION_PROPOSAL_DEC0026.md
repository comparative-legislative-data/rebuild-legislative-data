# V4A Native-Cluster Foundation Authorisation Proposal — DEC-0026

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0026

## 1. Exact decision

Approve one additive V4A action on the current VPS that creates a new native
PostgreSQL 16 cluster, its disabled project identities, two empty databases,
and empty project paths.

The action targets only PostgreSQL cluster `16/cld_gb_sct`, bound to
`127.0.0.1:5434`. It uses the existing local PostgreSQL 16 tooling and no
package manager. It never targets `16/main`, `16/bills`, Nginx, the firewall,
DNS, application code, source data, existing paths, or an existing service.

The one execution creates the new cluster in a disabled state, configures and
limits that new cluster only, then starts only that cluster for bounded
verification. The restricted result record retains non-secret operational
metadata only.

## 2. Exclusive target list

Every listed target must be absent at pre-flight. A collision is `BLOCKED`.

| Class | Exact target | Required initial state |
| --- | --- | --- |
| Native cluster | `16/cld_gb_sct` | Absent and disabled until its own listener/resource configuration is written. |
| Cluster service | `postgresql@16-cld_gb_sct.service` | Absent; the only new service unit that may exist after the action. |
| Cluster paths | `/var/lib/postgresql/16/cld_gb_sct`, `/etc/postgresql/16/cld_gb_sct`, `/var/log/postgresql/postgresql-16-cld_gb_sct.log`, `/run/postgresql-cld-gb-sct` | Absent; owned/managed only by the new PostgreSQL cluster. |
| Service drop-in | `/etc/systemd/system/postgresql@16-cld_gb_sct.service.d/limits.conf` | Absent; contains only the new cluster's fixed resource limits and runtime-directory setting. |
| Unix identity | `cld-gb-sct` group and system account | Absent; created non-login, no-sudo, no supplementary group. |
| Unix identity | `cld-gb-sct-deploy` group and disabled system account | Absent; no SSH key, password, sudo, or deployment capability. |
| Project paths | `/srv/cld-gb-sct/{raw,db1,canonical,releases,state}` and `/etc/cld-gb-sct/secrets` | Absent and created empty with the declared modes; no secret file/value. |
| PostgreSQL roles | `cld_gb_sct_runtime`, `cld_gb_sct_migrate` | Absent; created `NOLOGIN`, no password, no membership, no elevated attributes. |
| PostgreSQL databases | `cld_gb_sct_db1`, `cld_gb_sct_canonical` | Absent; created empty only in `16/cld_gb_sct`, owned by `cld_gb_sct_migrate`, with `PUBLIC` access revoked. |
| TCP listener | `127.0.0.1:5434` | Unused; new cluster may bind this IPv4 loopback address only. |

## 3. Mandatory pre-flight — no mutation

The single action stops before mutation unless all of these checks pass:

1. The SSH host key and host identity match the restricted V0–V3 records.
2. Native commands `pg_createcluster`, `pg_ctlcluster`, `pg_conftool`,
   `pg_isready`, `psql`, `systemctl`, and `install` are present; their use
   requires no package installation.
3. Existing clusters are exactly identifiable as `16/main` (port 5432) and
   `16/bills` (port 5433), and their pre-action active states plus
   database-name-set digests can be recorded without reading database rows.
4. Every target in section 2 is absent, and port 5434 has no IPv4 or IPv6
   listener.
5. The filesystems containing `/var/lib/postgresql` and `/srv` each have at
   least 10 GiB available; `MemAvailable` is at least 2 GiB. This is the
   capacity floor for the fixed `MemoryMax=768M` cap below, not a claim about
   future application capacity.
6. The administrative account has non-interactive `sudo` and local PostgreSQL
   administration as OS user `postgres`, without exposing a password,
   connection string, credential, environment value, log, or source content.

The pre-flight may inspect only host/command presence, target existence,
named-cluster and service metadata, named port bindings, storage/memory
capacity metadata, and PostgreSQL role/database metadata/digests. It must not
read database rows, filesystem contents, service logs, secrets, source data,
or unrelated application configuration.

## 4. Exact additive operation

After a passing pre-flight, perform only the following, in order.

1. Create the two disabled system groups/accounts and seven empty project/
   secret paths exactly as named in section 2. `cld-gb-sct` and
   `cld-gb-sct-deploy` use `/usr/sbin/nologin`; neither receives a password,
   SSH key, sudo rule, service unit, or supplementary group. Project paths are
   `root:cld-gb-sct` mode `0750`; `/etc/cld-gb-sct/secrets` is `root:root`
   mode `0700`.
2. Create PostgreSQL 16 cluster `cld_gb_sct` with port 5434 and its start
   state disabled. Do not start it at creation and do not install any package.
3. Edit only the new cluster's configuration to set:

   ```text
   listen_addresses = '127.0.0.1'
   port = 5434
   unix_socket_directories = '/run/postgresql-cld-gb-sct'
   password_encryption = 'scram-sha-256'
   ```

   Its new `pg_hba.conf` permits local peer administration and, for a later
   separately authorised service, local IPv4 TCP SCRAM only. It must contain no
   network range wider than `127.0.0.1/32` and no IPv6 host rule.
4. Create the new service's drop-in only, with exactly:

   ```ini
   [Service]
   CPUQuota=35%
   MemoryMax=768M
   TasksMax=128
   RuntimeDirectory=postgresql-cld-gb-sct
   RuntimeDirectoryMode=0750
   ```

   A systemd manager reload is permitted only to recognise this new drop-in;
   it must not restart or reload any existing unit. Confirm the limits are
   effective before starting the new cluster.
5. Change only the new cluster's start state from disabled to manual, then
   start `postgresql@16-cld_gb_sct.service` once. No existing PostgreSQL
   cluster or unrelated service may be started, stopped, restarted, reloaded,
   or reconfigured.
6. Through this new cluster only, create exactly the two no-login roles and
   two empty databases from section 2. Revoke all database privileges from
   `PUBLIC` and grant only `CONNECT` to the two project roles. Do not create a
   schema, extension, table, data, login privilege, password, default
   privilege, application process, or secret value.

## 5. Acceptance checks

The restricted result record must retain `PASS`, `FAIL`, or `BLOCKED` for the
following without source data, credentials, database rows, logs, or unrelated
application content:

| Check | Passing result |
| --- | --- |
| Existing-cluster protection | `16/main` and `16/bills` retain their pre-action active states and database-name-set digests. |
| Listener | `cld_gb_sct` is active; `5434` listens only at `127.0.0.1`, never `0.0.0.0` or `[::]`. |
| Service containment | Only `postgresql@16-cld_gb_sct.service` is new; its exact CPU/memory/task/runtime-directory limits are effective before and after start. |
| Cluster identity | The data/configuration/log/socket paths belong only to `16/cld_gb_sct`; no existing cluster path/configuration was edited. |
| Database identity | The two empty databases and two roles exist only in `cld_gb_sct`, have the named owner/attributes, no login/password/membership, no non-system user relations, and no `PUBLIC` database privilege. |
| Filesystem/account isolation | All seven project/secret paths are empty with stated modes; the two accounts are non-login, no-sudo, and have no supplementary groups. |
| Network and web non-interference | No listener exists on 3210/3220; no firewall, Nginx, DNS, certificate, application service, source capture, or public endpoint was created/changed. |

## 6. Stop and containment

Stop immediately on any failed pre-flight, target collision, unavailable tool,
capacity shortfall, unexpected existing-cluster state, failed service-limit
check, listener other than `127.0.0.1:5434`, failed role/database privilege
check, or need to touch an unlisted target.

No automatic deletion or rollback is allowed. If an error occurs after a new
target exists, leave only the partial new target disabled/contained and record
the state. Its correction or removal requires a new exact owner-approved
action; no broad cleanup is permitted.

## 7. Owner decision

Approve or reject DEC-0026. Approval authorises this one V4A native-cluster
foundation action and its restricted result record. It does not authorise a
credential, service deployment, frontend/backend, Nginx/DNS change, source
capture, proxy/DB1 build, canonical dataset, chart, or public claim.
