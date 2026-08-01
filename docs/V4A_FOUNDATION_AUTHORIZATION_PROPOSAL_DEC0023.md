# V4A Foundation Authorisation Proposal — DEC-0023

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0023

## 1. Exact decision

Approve one additive V4A foundation action on the current VPS identified in
the restricted V0–V3 operational record. The action may create only the empty
accounts, paths, PostgreSQL roles, and PostgreSQL databases named below.

The action must run once, through the existing approved SSH path, by the
named administrative account already used for V0–V3. The host address,
credential reference, and host-key reference remain in restricted local
operational records; no credential or host identifier is placed in Git.

This proposal does not authorise source access, capture, application code,
package installation, Docker, a systemd unit, service start, firewall change,
Nginx/DNS/certificate change, secret value creation, or any V4B/V4C activity.

## 2. Authorised targets

Every target is new and additive. Creation is permitted only if every named
target is absent at pre-flight.

| Class | Exact target | Required initial state |
| --- | --- | --- |
| Unix group and user | `cld-gb-sct` | System group and non-login, no-sudo account; no supplementary group membership. |
| Unix group and user | `cld-gb-sct-deploy` | System group and disabled, non-login account; no SSH key, password, sudo, or deployment capability is created in V4A. |
| Project paths | `/srv/cld-gb-sct/{raw,db1,canonical,releases,state}` | Empty root-owned directories, group `cld-gb-sct`, mode `0750`. |
| Secret path | `/etc/cld-gb-sct/secrets` | Empty root-owned directory, mode `0700`; no secret file/value is created. |
| PostgreSQL roles | `cld_gb_sct_runtime`, `cld_gb_sct_migrate` | `NOLOGIN`, `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOINHERIT`, `NOREPLICATION`, `NOBYPASSRLS`; no membership and no password. |
| PostgreSQL databases | `cld_gb_sct_db1`, `cld_gb_sct_canonical` | Fresh, empty databases in existing `16-main` only, owned by `cld_gb_sct_migrate`; `PUBLIC` has no database privileges. |
| Port checks | `127.0.0.1:3210`, `127.0.0.1:3220` | Both proven unused; V4A does not bind, reserve at OS level, expose, or firewall either port. |

No other database, role, path, service, port, Nginx site, certificate, domain,
cluster setting, `pg_hba.conf` setting, user, group, or credential is a target.

## 3. Mandatory pre-flight — no mutation

The operator must stop before mutation unless all checks pass:

1. The SSH host key and host identity match the restricted V0–V3 record.
2. `postgresql@16-main` is active and PostgreSQL reports port `5432` with a
   loopback/private listener. The separate `16-bills` cluster is not queried,
   changed, or used.
3. Both proposed Unix account/group identities, two PostgreSQL role names, two
   database names, seven paths, and both candidate ports are absent/unused as
   required.
4. The administrator can use a non-interactive local PostgreSQL administrative
   path. A password, connection string, or credential value must not appear in
   a command, output, or retained result.
5. A digest of the pre-existing database-name set on `16-main` and the active
   state of `postgresql@16-main` have been retained in the restricted result
   record. This is metadata only; it contains neither database rows nor source
   data.

The pre-flight may inspect only account/group existence, named-path metadata,
named-port listeners, PostgreSQL role/database metadata, listener metadata,
and service state. It must not read database rows, filesystem contents,
environment values, service logs, credentials, or any unrelated workload.

## 4. Exact additive operation

After a passing pre-flight, perform these operations in the stated order. Each
command is executed only for the exact target named; no wildcard, recursive
cleanup, restart, reload, package operation, or configuration-file edit is
permitted.

1. Create the two system groups and their disabled accounts with exactly these
   commands. Both accounts use `/usr/sbin/nologin`; `cld-gb-sct` has home
   `/srv/cld-gb-sct`, and `cld-gb-sct-deploy` has home `/nonexistent`.
   Neither receives a password, SSH key, sudo rule, service unit, or
   supplementary group.

   ```sh
   groupadd --system cld-gb-sct
   useradd --system --gid cld-gb-sct --home-dir /srv/cld-gb-sct \
     --shell /usr/sbin/nologin --no-create-home cld-gb-sct
   groupadd --system cld-gb-sct-deploy
   useradd --system --gid cld-gb-sct-deploy --home-dir /nonexistent \
     --shell /usr/sbin/nologin --no-create-home cld-gb-sct-deploy
   ```

2. Create `/srv/cld-gb-sct` and its five named child directories as
   `root:cld-gb-sct`, mode `0750`; create `/etc/cld-gb-sct/secrets` as
   `root:root`, mode `0700`, using exactly these commands. The directories
   remain empty.

   ```sh
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct/raw
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct/db1
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct/canonical
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct/releases
   install -d --owner=root --group=cld-gb-sct --mode=0750 /srv/cld-gb-sct/state
   install -d --owner=root --group=root --mode=0700 /etc/cld-gb-sct/secrets
   ```
3. On PostgreSQL `16-main` only, create the two roles with exactly these
   attributes:

   ```sql
   CREATE ROLE cld_gb_sct_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
     NOINHERIT NOREPLICATION NOBYPASSRLS;
   CREATE ROLE cld_gb_sct_migrate NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
     NOINHERIT NOREPLICATION NOBYPASSRLS;
   ```

4. On the same cluster, create exactly the two empty databases, each using
   `template0`, UTF-8 encoding, and owner `cld_gb_sct_migrate`:

   ```sql
   CREATE DATABASE cld_gb_sct_db1 OWNER cld_gb_sct_migrate
     ENCODING 'UTF8' TEMPLATE template0;
   CREATE DATABASE cld_gb_sct_canonical OWNER cld_gb_sct_migrate
     ENCODING 'UTF8' TEMPLATE template0;
   ```

5. Against each newly created database only, revoke all database privileges
   from `PUBLIC`; grant only `CONNECT` to the two named project roles. No
   schema, table, extension, data, password, login privilege, or default
   privilege is created.

   ```sql
   REVOKE ALL ON DATABASE cld_gb_sct_db1 FROM PUBLIC;
   GRANT CONNECT ON DATABASE cld_gb_sct_db1
     TO cld_gb_sct_runtime, cld_gb_sct_migrate;
   REVOKE ALL ON DATABASE cld_gb_sct_canonical FROM PUBLIC;
   GRANT CONNECT ON DATABASE cld_gb_sct_canonical
     TO cld_gb_sct_runtime, cld_gb_sct_migrate;
   ```

The proposed resource names remain disabled by design. V4B may not convert a
role to `LOGIN`, issue a secret, grant schema/table privileges, or enable the
deployment account without a separate authorisation and an explicit check of
cross-database access in the shared cluster.

## 5. Verification and acceptance record

The restricted V4A result record must retain `PASS`, `FAIL`, or `BLOCKED` for
these checks, without values or content:

| Check | Passing result |
| --- | --- |
| Scope | Only the named PostgreSQL, Unix-account/group, and path targets in section 2 were created; no other target was changed. |
| Cluster continuity | `postgresql@16-main` remains active and the pre-existing database-name digest is unchanged. |
| Database identity | Both new databases exist on `16-main`, have owner `cld_gb_sct_migrate`, no non-system user relations, and no `PUBLIC` database privilege. |
| Role isolation | Both roles have exactly the attributes in section 4, have no password or memberships, and cannot authenticate because they are `NOLOGIN`. |
| Filesystem isolation | The seven named directories have the stated owner/group/mode and contain no files. |
| Account isolation | The two accounts are non-login, lack sudo and supplementary groups, and no SSH key/password was created. |
| Network non-interference | No listener appears on ports 3210 or 3220; no firewall, Nginx, DNS, certificate, systemd unit, or PostgreSQL configuration change occurred. |
| Legacy/unrelated protection | The `16-bills` cluster, `parliament_bills`, existing services, shared `chessadmin` role, existing paths, and other Nginx sites were not targets. |

The record may contain redacted command status, names, ownership/mode metadata,
service status, PostgreSQL role/database metadata, and the database-name-set
digest. It must not contain secrets, source data, database rows, or unrelated
application content.

## 6. Known limitation and containment

The new database roles deliberately remain `NOLOGIN` in V4A. That prevents
them authenticating to this or any other database while the shared-cluster
access model is still unproven. A later V4B proposal must test whether an
enabled project role could inherit a `PUBLIC` connection privilege on an
existing database. If it could, V4B is `BLOCKED` until an isolation method that
does not affect unrelated services is separately approved.

No automatic rollback is permitted. If a pre-flight or verification check
fails, stop immediately. Any partially created, empty target remains disabled
and isolated; its removal or correction requires a new exact owner-approved
action. This avoids an unreviewed deletion or a broad cleanup on the shared
host.

## 7. Owner decision

Approve or reject DEC-0023. Approval authorises this one V4A foundation action
and its restricted non-secret verification record. It does not authorise any
later deployment, service, credentials, source-data work, proxy/DB1 build,
canonical build, chart, Nginx/DNS change, or public claim.
