# V4A Native-Cluster Recovery Correction Proposal — DEC-0029

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0029

## Exact decision

Approve one narrow recovery action for the new `16/cld_gb_sct` cluster only.
It corrects the three malformed configuration values found by DEC-0028,
validates them while the cluster remains down, and starts only the new cluster
for a bounded health check.

It may not create databases, roles, schemas, extensions, credentials, source
data, application services, or public endpoints. It may not alter `16-main`,
`16-bills`, Nginx, DNS, firewall, existing paths, or any other service.

## Exclusive operation

Before any edit, the action must record the active state and database-name-set
digest of `16-main` and `16-bills`, and confirm that the new cluster remains
down with no listener on port 5434.

The action may make only these new-cluster changes:

```text
listen_addresses        = 127.0.0.1
unix_socket_directories = /run/postgresql-cld-gb-sct
password_encryption     = scram-sha-256
```

Values are passed to the native PostgreSQL configuration tool without embedded
quote characters. The port remains `5434`; its HBA, service drop-in, start
state, paths, accounts, and all other configuration remain unchanged.

Before any start attempt, the action must use the new cluster's PostgreSQL 16
binary as OS user `postgres` to read each effective setting from its down
configuration. Any error, value mismatch, missing path, unexpected listener,
or existing-cluster mismatch is `BLOCKED` and no service action follows.

Only after all checks pass may it reset the failed state of
`postgresql@16-cld_gb_sct.service` and start that exact service once. It must
then verify:

1. the new cluster is active and listens only on `127.0.0.1:5434`;
2. neither `0.0.0.0:5434` nor `[::]:5434` has a listener;
3. its existing HBA contains only local peer plus `127.0.0.1/32` TCP SCRAM;
4. the new service's `35%` CPU / `768M` memory / `128` task limits remain
   effective; and
5. `16-main` and `16-bills` retain their recorded active states and
   database-name-set digests.

## Containment

No automatic deletion, role/database creation, or second retry is allowed. A
failed recovery start leaves the new cluster in its resulting state and stops.
Any next action requires a new exact owner-approved proposal.

## Owner decision

Approve or reject DEC-0029. Approval authorises this correction and one start
attempt for the new cluster only, plus its restricted result record.
