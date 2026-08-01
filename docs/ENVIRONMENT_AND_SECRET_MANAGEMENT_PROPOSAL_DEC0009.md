# Environment and Secret-Management Proposal — DEC-0009

**Status:** Approved current-VPS/no-Docker direction; the `16-main` cluster
implementation is `BLOCKED` by V4A listener evidence

**Version:** 1.1.0

**Prepared:** 1 August 2026

**Decision:** DEC-0009

## 1. Decision requested

The project owner approved an isolated, no-Docker `GB-SCT` project namespace
on the current VPS as the first clean-rebuild environment, together with the
minimum secret-management and isolation rules in this proposal.

The subsequent V4A-L1 read-only clarification established that the shared
`16-main` cluster does not meet this proposal's loopback/private-listener
condition. The current-VPS/no-Docker direction remains approved, but this
document no longer authorises or supports using `16-main` for project
databases. A separately approved native-cluster alternative is required.

The environment would reuse only the physical VPS. It would not reuse legacy
databases, names, roles, paths, service
units, credentials, or storage. Approval authorises only future detailed V4
planning; it does not authorise provider account access, VPS changes,
credential creation, deployment, source requests, capture, database creation,
or application implementation.

## Revision history

Version 0.2.0 replaces the version 0.1.0 recommendation of an immediately
dedicated VPS following the owner's scope correction on 1 August 2026. A
dedicated VPS remains a future migration option if the project proves
successful; it is not a prerequisite for the initial rebuild.

Version 1.1.0 records V4A-L1: `16-main` has a wildcard listener and therefore
cannot be the project database cluster under the approved listener condition.
It does not authorise a new cluster or change the current-VPS/no-Docker
decision.

## 2. Recommended environment decision

Use the current VPS, with a new isolated project namespace and no Docker. The
V1 inventory established a shared PostgreSQL cluster and a shared superuser
boundary, so this proposal controls database privileges, operating-system
permissions, service identity, storage paths, secret access, and resource use
explicitly. It does not claim host-level independence from the other workloads.

| Concern | Recommended control |
| --- | --- |
| Host context | Reuse the current VPS only; no host-wide restart, upgrade, generic cleanup, or shared-role action is part of this project. |
| Legislature isolation | A separate `GB-SCT` runtime namespace, database role, data/storage prefix, service names, and release identifiers. |
| Database | Two fresh databases in a separately approved loopback/private native PostgreSQL cluster; no public database listener or shared application role. The shared `16-main` cluster is excluded by V4A-L1. |
| Runtime | One non-login application account (`cld-gb-sct`) with no sudo; separate deployment account with narrowly defined administrative authority. |
| Services | Native systemd services only; Docker, Docker Compose, and container-wide operations are excluded. |
| Ingress | Only the approved public web/API ports, if and when a later deployment proposal selects them; SSH key-only access limited to approved maintainers. |
| Raw capture storage | A new private `/srv/cld-gb-sct/` namespace with separate raw, DB1, canonical, and release paths. Its capture/retention implementation requires a later approved action. |

## 3. New resource identity

The following are proposed naming constraints, not existing resources:

| Class | Proposed identity | Constraint |
| --- | --- | --- |
| Project root | `/srv/cld-gb-sct/` | Never a legacy path; separate subdirectories for raw, DB1, canonical, releases, and runtime state. |
| DB1 database | `cld_gb_sct_db1` | Fresh database; no restore, import, or legacy object copy. |
| Canonical database | `cld_gb_sct_canonical` | Fresh database; no restore, import, or legacy object copy. |
| Database roles | `cld_gb_sct_runtime`, `cld_gb_sct_migrate` | Least privilege; distinct role per purpose; neither is superuser. |
| Runtime account | `cld-gb-sct` | Non-login, no sudo, no access to other legislature namespaces. |
| Services | `cld-gb-sct-*` | Fresh native systemd names; no Docker or legacy unit names. |
| Storage | `/srv/cld-gb-sct/{raw,db1,canonical,releases,state}` | Separate paths with least-privilege ownership. |

## 4. Secret-management policy

Secrets are managed outside Git and outside application source files. The
initial approved mechanism is a root-owned host secret directory with one
restricted environment file per runtime service:

- directory: `/etc/cld-gb-sct/secrets/`, owned by `root`, mode `0700`;
- service secret files: owned by `root`, readable only by the applicable
  runtime group, mode `0640` or stricter;
- systemd service units refer to the required file by path; values are never
  embedded in units, repositories, command lines, logs, or operational
  registers;
- the secret inventory records name, purpose, owning role, creation date,
  rotation/revocation date, and service dependency—never a value; and
- secret access changes, a suspected disclosure, or any new external provider
  requires a new owner-approved change record.

This is a defined initial mechanism, not a claim that secrets already exist or
have been safely provisioned.

## 5. Minimum access and network policy

- SSH is key-only; root login and password authentication are disabled.
- The deployment account can perform only the approved V4 provisioning and
  release tasks. The runtime account cannot administer the host.
- The future project PostgreSQL cluster must be loopback/private-network only.
  The two new databases revoke default public access and grant access only to
  the named project roles. Shared `16-main` is excluded by V4A-L1.
- No service receives a credential allowing access to another legislature,
  unrelated VPS, or legacy resource.
- Firewall rules are deny-by-default. Any later public HTTP/S ingress is named
  in a specific deployment authorisation.

## 6. Database and data-boundary rules

DB1 and the canonical database are separate from the raw capture archive. The
runtime role receives only the schema/database privileges required by its
declared service; no generic owner/superuser role is used by the application.
The V4 proposal must explicitly revoke `PUBLIC` connection access to each new
database and grant it only to the named project roles. The capture role is
write-only to its raw archive and cannot modify canonical outputs. Downstream
transformation roles cannot write raw captures.

No source data is captured, created, copied, or retained under this decision.
DEC-0008 and route-level handling records remain mandatory before any such
action.

## 7. Required V4 proposal and acceptance checks

Before provisioning, a V4 proposal must name the current VPS identity,
operating-system baseline, SSH keys by reference, firewall rules, service
account/group IDs, database version, fresh resource names, secret inventory,
storage paths, systemd resource limits/sandboxing, and rollback/containment
steps. It must include checks that:

1. no existing service, database, role, path, Nginx site, or unrelated workload
   is changed or made a project dependency;
2. no legacy name, role, credential, data, path, service, or storage prefix is
   reused;
3. the runtime role cannot access administrative, raw-archive, or other
   legislature resources beyond its approved scope;
4. the database has no public listener;
5. secret files have the declared ownership and modes without exposing values;
6. each native systemd service runs as the non-login runtime account with
   declared CPU, memory, filesystem, and privilege boundaries;
7. the service cannot read another legislature's data namespace; and
8. every check has a retained `PASS`, `FAIL`, or `BLOCKED` result.

## 8. Alternatives rejected for this decision

| Alternative | Reason not selected |
| --- | --- |
| Provision a dedicated VPS immediately | Deferred for efficiency. It remains a future migration option if project scale, resilience, or isolation needs justify it. |
| Restore or adapt the deleted legacy databases | Contradicts the clean-rebuild decision and does not provide reproducible provenance. |
| Keep secrets in repository files or service unit text | Fails the project secret-management and audit requirements. |

## 9. Stop conditions

Stop V4 planning or execution if the current-host scope is ambiguous, a
resource name collides, a deployment would reuse a legacy or unrelated
resource, a required secret-management control is unavailable, a systemd
resource boundary is omitted, or any proposed configuration allows
cross-legislature or unrelated-workload access.

## 10. Owner decision

DEC-0009 adopts this current-VPS, no-Docker, isolated-namespace and
secret-management direction. It authorises preparation of a separate exact V4
provisioning proposal only. It does not authorise a database, secret, service,
firewall, DNS record, deployment, capture, or application code.
