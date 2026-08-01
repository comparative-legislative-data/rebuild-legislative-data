# V4A Native-Cluster Recovery Inspection Proposal — DEC-0028

**Status:** Proposed — read-only inspection only; no repair or retry authorised

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0028

## 1. Exact decision

Approve one read-only inspection following the DEC-0027 first-start failure.
It may inspect only the new `16/cld_gb_sct` cluster and the minimum metadata
needed to show whether `16-main` and `16-bills` remain unchanged.

It does not authorise a systemd start/restart/reload, `pg_ctlcluster` action,
configuration edit, role/database operation, removal, package operation,
source-data access, application action, Nginx/DNS/firewall change, or any
activity outside the named targets below.

## 2. Permitted checks

| Target | Permitted metadata | Explicitly excluded |
| --- | --- | --- |
| `postgresql@16-cld_gb_sct.service` | `ActiveState`, `SubState`, `Result`, `ExecMainStatus`, unit drop-in identity, and effective resource-limit properties. | Start/stop/restart/reload, broad systemd inventory, unrelated unit output. |
| New-cluster configuration | The exact `listen_addresses`, `port`, `unix_socket_directories`, `password_encryption`, `start.conf`, and `pg_hba.conf` lines in the new cluster only. | Any existing-cluster/global PostgreSQL file or `pg_hba.conf`; credentials. |
| New cluster log | At most 80 final lines of `/var/log/postgresql/postgresql-16-cld_gb_sct.log`, classified as new-cluster startup diagnostics only. | Logs for any existing service or broad journal search. |
| New cluster listener/state | `pg_ctlcluster ... status`, `pg_lsclusters` filtered to the three named clusters, and TCP bindings filtered to port 5434. | A start command, query of application data, or any other port/process. |
| Existing clusters | Active state and database-name-set digest only for `16-main` and `16-bills`. | Database rows, roles, schemas, logs, settings, or configuration. |
| New foundation paths/identities | Existence, ownership/mode, and whether database roles/databases are absent from the new cluster if a local connection is possible. | Reading file contents beyond the named new configuration; secrets/source data. |

## 3. Output and stop conditions

The restricted result retains only redacted command status, new-unit metadata,
new-cluster configuration values, the bounded new-cluster diagnostic tail,
port-5434 metadata, existing-cluster active states/digests, and target
ownership/mode metadata. It retains no credential, database row, source data,
or unrelated workload content.

Stop at the first unexpected target, inaccessible new-cluster diagnostic,
existing-cluster mismatch, or request for a mutation. A diagnostic finding is
not authority to correct it. Any repair, reconfiguration, service action, or
removal needs a separate exact owner-approved action.

## 4. Owner decision

Approve or reject DEC-0028. Approval authorises this single read-only recovery
inspection and its restricted result only.
