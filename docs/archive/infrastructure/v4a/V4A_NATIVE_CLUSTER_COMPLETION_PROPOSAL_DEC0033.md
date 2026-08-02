# V4A Native-Cluster Completion Proposal — DEC-0033

**Status:** Approved — execution `BLOCKED`; no role/database creation occurred

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0033

**Implementation correction:** Under the owner-approved DEC-0034 work-package
model, after the first start failed because systemd created the new cluster's
runtime socket directory root-owned, this package may add only the following
pre-start line to its existing, named service drop-in:

```ini
ExecStartPre=/usr/bin/install -d -o postgres -g postgres -m 0750 /run/postgresql-cld-gb-sct
```

It may run `systemctl daemon-reload` for that drop-in and make one corrected
start attempt. This preserves the approved target/end state: the same new
loopback-only cluster and its existing resource limits, with a project runtime
directory writable only by the PostgreSQL service account. It does not alter
any protected resource or create a new exposure/privilege. No further start
retry is permitted after that corrected attempt.

The correction was applied and systemd metadata was reloaded, but the corrected
start also failed before any role/database action. PostgreSQL still could not
create its socket lock under the service-managed runtime directory. The
restricted result is retained as `V4A_NATIVE_CLUSTER_COMPLETION_RESULT.md`.

## Approved decision

The project owner approved one bounded completion action for the already-created, down
`16/cld_gb_sct` cluster only. The action makes **no configuration edit**. It
validates the established configuration and HBA profile, starts only the named
new service once, and—only after all service checks pass—creates its two empty
no-login roles and two empty databases.

The allowed HBA non-comment rules are exactly:

```text
local all postgres peer
local all all peer
host all all 127.0.0.1/32 scram-sha-256
```

The three effective configuration values must remain exactly:

```text
listen_addresses = '127.0.0.1'
unix_socket_directories = '/run/postgresql-cld-gb-sct'
password_encryption = 'scram-sha-256'
```

## Ordered operation

1. Record `16-main` and `16-bills` active state and database-name-set digests;
   validate the named new-cluster settings/HBA profile and port-5434 absence.
   Confirm the four project role/database targets are absent from the new
   cluster before creation.
2. Reset failed state and start only `postgresql@16-cld_gb_sct.service` once.
   Stop if it is not active, does not listen only on `127.0.0.1:5434`, or its
   CPU/memory/task/runtime-directory limits differ from the established values.
3. Through port 5434 only, create exactly these absent roles:
   `cld_gb_sct_runtime` and `cld_gb_sct_migrate`, both `NOLOGIN`, no password,
   no role membership, `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, and
   `NOREPLICATION`.
4. Through port 5434 only, create exactly these absent empty databases:
   `cld_gb_sct_db1` and `cld_gb_sct_canonical`, both owned by
   `cld_gb_sct_migrate`. Revoke `PUBLIC` database privileges and grant only
   `CONNECT` to the two named project roles.
5. Verify the role attributes, database ownership/access metadata, absence of
   non-system user relations, unchanged existing-cluster state/digests, and
   no listener on ports 3210 or 3220.

## Exclusions and stop conditions

Except for the single DEC-0034 implementation-correction line above, no
configuration, HBA, existing cluster/service, Nginx, DNS, firewall,
credential, login role, schema, extension, table, source data, application, or
public endpoint action is permitted. Do not retry a corrected failed start or
delete any resource. Any unexpected state, metadata mismatch, or need to touch
another target is `BLOCKED` and stops the action.

## Decision outcome

DEC-0033 authorises only the ordered V4A completion above and its restricted
result record. It does not authorise V4B services, source capture, or any
public cutover. Both authorised start attempts are exhausted; it does not
authorise another configuration change or start.
