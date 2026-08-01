# V4A Native-Cluster HBA Validation and Start Proposal — DEC-0031

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0031

## Exact decision

Approve one completion action for the down `16/cld_gb_sct` cluster only.
DEC-0030 already made and offline-validated the three direct configuration
replacements. This action makes **no configuration edit**. It reads only the
new cluster's protected HBA file using the existing required privilege,
performs the remaining port check, and makes one new-service-only start attempt
only if every validation condition passes.

The HBA validation must confirm that its only effective non-comment rules are:

```text
local  all  all                 peer
host   all  all  127.0.0.1/32   scram-sha-256
```

It must reconfirm the three effective PostgreSQL settings exactly as:

```text
listen_addresses = '127.0.0.1'
unix_socket_directories = '/run/postgresql-cld-gb-sct'
password_encryption = 'scram-sha-256'
```

It may not edit any configuration, path, account, service definition, or other
resource. The port remains 5434; existing clusters, databases, roles, Nginx,
DNS, firewall, source data, and application components are out of scope.

## Validation and one start

Before any start, the action must record existing-cluster active state and
database-name-set digests, validate the three effective values using the
PostgreSQL 16 binary while the new cluster remains down, validate the HBA rules
using `sudo` read access only, and confirm port 5434 has no listener.

Only then may it reset the failed state and start
`postgresql@16-cld_gb_sct.service` once. It must verify the resulting listener
is only `127.0.0.1:5434`, the service limits remain effective, and `16-main`
plus `16-bills` retain their pre/post active states and database-name-set
digests.

No role/database creation, second start attempt, automatic deletion, or repair
of another resource is permitted.

## Owner decision

Approve or reject DEC-0031. Approval authorises only the privileged HBA read,
the stated revalidation, one new-service start attempt if validation passes,
and its restricted result record.
