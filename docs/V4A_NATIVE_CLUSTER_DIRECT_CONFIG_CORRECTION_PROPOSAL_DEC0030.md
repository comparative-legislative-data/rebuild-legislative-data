# V4A Native-Cluster Direct-Configuration Correction Proposal — DEC-0030

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0030

## Exact decision

Approve one replacement correction for the down `16/cld_gb_sct` cluster only.
It replaces only the three malformed setting lines directly in that new
cluster's `postgresql.conf`, validates while down, and makes one new-service-
only start attempt.

The three resulting lines must be exactly:

```text
listen_addresses = '127.0.0.1'
unix_socket_directories = '/run/postgresql-cld-gb-sct'
password_encryption = 'scram-sha-256'
```

No configuration helper is used for these string values. No other line or
file may be edited. The port remains 5434; the HBA, resource limits, start
state, accounts, paths, existing clusters, databases, roles, services, Nginx,
DNS, firewall, source data, and application components are out of scope.

## Validation and one start

Before any start, the PostgreSQL 16 binary must read each effective value from
the down configuration and return exactly the values above. It must also verify
the existing new-cluster HBA contains only local peer plus the
`127.0.0.1/32` TCP SCRAM rule, and that port 5434 has no listener.

Only then may the action reset the failed state and start
`postgresql@16-cld_gb_sct.service` once. It must verify the new listener is
only `127.0.0.1:5434`, the service limits remain effective, and `16-main` plus
`16-bills` retain their pre/post active states and database-name-set digests.

No role/database creation, second start attempt, automatic deletion, or repair
of another resource is permitted.

## Owner decision

Approve or reject DEC-0030. Approval authorises only this direct three-line
correction, offline validation, one new-service start attempt, and its
restricted result record.
