# V4A Native-Cluster Runtime-Directory Recovery Proposal — DEC-0035

**Status:** Approved — execution `PASS`; V4A foundation completed

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0035

## Approved decision and execution outcome

The project owner approved one recovery completion package for the down
`16/cld_gb_sct` cluster
only. DEC-0033 established that the new service's `RuntimeDirectory` lifecycle
continues to leave the PostgreSQL socket directory unusable, despite the
postgres-owned `ExecStartPre` line.

The action changes only the existing new service drop-in. It removes exactly:

```ini
RuntimeDirectory=postgresql-cld-gb-sct
RuntimeDirectoryMode=0750
```

It retains exactly:

```ini
CPUQuota=35%
MemoryMax=768M
TasksMax=128
ExecStartPre=/usr/bin/install -d -o postgres -g postgres -m 0750 /run/postgresql-cld-gb-sct
```

It then reloads systemd metadata and makes one replacement start attempt. This
keeps the same loopback listener, PostgreSQL configuration, HBA, port, account,
resource limits, and service identity. The pre-start command recreates the
postgres-owned runtime directory on each service start without a systemd
runtime-directory lifecycle conflict.

The action passed. The new service is active and listens only at
`127.0.0.1:5434`; its runtime directory is `postgres:postgres` mode `0750`.
The two empty project roles and two empty project databases were created only
after the service checks passed. The restricted result is retained as
`V4A_NATIVE_CLUSTER_RUNTIME_DIRECTORY_RECOVERY_RESULT.md`.

## Conditional V4A completion

Only after the corrected new service is active, listens solely on
`127.0.0.1:5434`, has the retained limits, and has a postgres-owned `0750`
runtime directory, create the two absent no-login roles and two absent empty
databases exactly as specified in DEC-0033. Verify the same role attributes,
database ownership/access, no `PUBLIC` database privilege, no user relations,
and existing-cluster non-interference.

## Exclusions and stop conditions

No other configuration, HBA, service, database, role, account, path, Nginx,
DNS, firewall, package, credential, source-data, application, or public action
is permitted. No second start attempt or automatic deletion is permitted. Any
unexpected state or need to touch another target is `BLOCKED`.

## Decision outcome

DEC-0035 authorised only this three-line drop-in correction, manager reload,
one replacement start attempt, and conditional empty V4A foundation completion
with a restricted result record. It does not authorise V4B services,
credential issuance, schema/data work, source capture, or public cutover.
