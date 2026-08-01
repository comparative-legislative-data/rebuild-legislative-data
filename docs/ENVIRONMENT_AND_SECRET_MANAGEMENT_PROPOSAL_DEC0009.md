# Environment and Secret-Management Proposal — DEC-0009

**Status:** Proposed — no provisioning, credential issuance, deployment, or
source-data activity authorised

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0009

## 1. Decision requested

Approve a dedicated, newly provisioned VPS as the first clean-rebuild
environment for `GB-SCT`, together with the minimum secret-management and
isolation rules in this proposal.

The approved environment would be separate from the existing shared VPS. It
would not reuse legacy databases, names, roles, paths, service units,
credentials, or storage. Approval authorises only future detailed V4 planning;
it does not authorise provider account access, VPS provisioning, DNS changes,
credential creation, deployment, source requests, capture, database creation,
or application implementation.

## 2. Recommended environment decision

Use one new, dedicated VPS for the rebuild's first operational environment.
The future VPS must have no unrelated application workload or shared PostgreSQL
cluster. This is the recommended option because the V1 inventory confirmed
that the existing VPS has a shared PostgreSQL cluster and a shared superuser
boundary. A same-host rebuild would add avoidable operational coupling.

| Concern | Recommended control |
| --- | --- |
| Host isolation | A newly provisioned VPS dedicated to this project; no unrelated service or database on the host. |
| Legislature isolation | A separate `GB-SCT` runtime namespace, database role, data/storage prefix, service names, and release identifiers. |
| Database | A new PostgreSQL instance on the dedicated VPS, bound only to loopback/private network; no public database listener. |
| Runtime | One non-login application account (`cld-gb-sct`) with no sudo; separate deployment account with narrowly defined administrative authority. |
| Ingress | Only the approved public web/API ports, if and when a later deployment proposal selects them; SSH key-only access limited to approved maintainers. |
| Raw capture storage | A new private, legislature-specific archive prefix, separate from DB1 and canonical outputs. Its provider and retention implementation require a later approved capture/storage action. |

## 3. New resource identity

The following are proposed naming constraints, not existing resources:

| Class | Proposed identity | Constraint |
| --- | --- | --- |
| VPS/runtime namespace | `cld-gb-sct` | Never `comparativelegislativedata`, `ScottishParliamentBills`, or a legacy path. |
| DB1 database | `cld_gb_sct_db1` | Fresh database; no restore, import, or legacy object copy. |
| Canonical database | `cld_gb_sct_canonical` | Fresh database; no restore, import, or legacy object copy. |
| Database roles | `cld_gb_sct_runtime`, `cld_gb_sct_migrate` | Least privilege; distinct role per purpose; neither is superuser. |
| Runtime account | `cld-gb-sct` | Non-login, no sudo, no access to other legislature namespaces. |
| Services | `cld-gb-sct-*` | Fresh names; no reuse of legacy unit names. |
| Storage | `cld/gb-sct/...` | Separate raw, DB1, canonical, and release prefixes. |

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
- PostgreSQL listens only on loopback/private network and accepts only the two
  named project database roles.
- No service receives a credential allowing access to another legislature,
  unrelated VPS, or legacy resource.
- Firewall rules are deny-by-default. Any later public HTTP/S ingress is named
  in a specific deployment authorisation.

## 6. Database and data-boundary rules

DB1 and the canonical database are separate from the raw capture archive. The
runtime role receives only the schema/database privileges required by its
declared service; no generic owner/superuser role is used by the application.
The capture role is write-only to its raw archive and cannot modify canonical
outputs. Downstream transformation roles cannot write raw captures.

No source data is captured, created, copied, or retained under this decision.
DEC-0008 and route-level handling records remain mandatory before any such
action.

## 7. Required V4 proposal and acceptance checks

Before provisioning, a V4 proposal must name the provider/account context,
exact VPS identity, operating-system baseline, SSH keys by reference, firewall
rules, service account/group IDs, database version, fresh resource names,
secret inventory, storage provider/prefixes, and rollback/containment steps.
It must include checks that:

1. the new host contains no unrelated workload;
2. no legacy name, role, credential, data, path, service, or storage prefix is
   reused;
3. the runtime role cannot access administrative, raw-archive, or other
   legislature resources beyond its approved scope;
4. the database has no public listener;
5. secret files have the declared ownership and modes without exposing values;
6. the service cannot read another legislature's data namespace; and
7. every check has a retained `PASS`, `FAIL`, or `BLOCKED` result.

## 8. Alternatives rejected for this decision

| Alternative | Reason not selected |
| --- | --- |
| Reuse the shared VPS and its PostgreSQL `16-main` cluster | V1 established shared databases and a shared superuser boundary; it weakens the desired isolation. |
| Restore or adapt the deleted legacy databases | Contradicts the clean-rebuild decision and does not provide reproducible provenance. |
| Keep secrets in repository files or service unit text | Fails the project secret-management and audit requirements. |

## 9. Stop conditions

Stop V4 planning or execution if a provider/account scope is ambiguous, a
resource name collides, a deployment would reuse a legacy or unrelated
resource, a required secret-management control is unavailable, or any proposed
configuration allows cross-legislature or unrelated-workload access.

## 10. Owner decision

Approve or reject DEC-0009. Approval adopts this dedicated-environment and
secret-management direction and authorises preparation of a separate exact V4
provisioning proposal only. It does not authorise a new VPS, database, secret,
service, firewall, DNS record, deployment, capture, or application code.
