# VPS Inventory, Isolation, and Rebuild Plan Proposal — DEC-0020

**Status:** Proposed VPS-control plan; no VPS access, deletion, or provisioning authorised

**Version:** 0.1.0

**Prepared:** 31 July 2026

**Decision requested:** DEC-0020

## 1. Decision requested

Approve this as the governing plan for a future read-only inventory of the
legacy VPS and, only after a separately approved exact deletion/recreation
plan, an isolated rebuild environment for this project.

Approval would authorise planning and preparation of an inventory-authorisation
record only. It would not authorise access to any VPS, use of credentials,
database connection, data extraction, service change, deletion, provisioning,
deployment, or reuse of legacy material.

## 2. Core boundary

The legacy database and its contents are untrusted and will not be migrated,
copied, exported, or represented as evidence for this rebuild. “Capture
information about DB1” means a redacted operational inventory sufficient to
identify ownership, dependencies, and deletion boundaries—not a row, document,
backup, table export, query result, credential, or schema dump.

The wider VPS hosts unrelated applications. Their files, databases, services,
ports, domains, credentials, backups, logs, and deployments are out of scope.
When the ownership or dependency of any item is uncertain, the inventory and
all deletion/rebuild work must stop.

## 3. Required sequence

| Gate | Objective | Permitted output | Still prohibited |
| --- | --- | --- | --- |
| V0 — Inventory authorisation | Name the exact host, access method, permitted read-only commands, intended metadata, redaction, and stop conditions. | Owner-approved inventory authorisation using [`VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md`](VPS_READ_ONLY_INVENTORY_AUTHORIZATION_TEMPLATE.md). | Connection, credential use, database access, file copy, or command execution. |
| V1 — Read-only inventory | Identify project-owned legacy components and their relationships to the wider host. | Redacted inventory report with exact candidate targets and evidence of unrelated workload separation. | Data-content reads, exports, backups, service restart, configuration change, deletion, provisioning, or deployment. |
| V2 — Deletion/recreation proposal | Convert V1 findings into an exact target list and zero-blast-radius plan. | Owner-reviewable plan naming each path, database, role, service, volume, job, domain, and dependency; validation and rollback/containment steps. | Deletion, change, or rebuild. |
| V3 — Exact deletion/recreation authorisation | Approve only the verified project-owned targets and method. | Owner-approved change authorisation with target list, order, validation, and stop conditions. | Any target omitted from the authorisation; all unrelated workloads. |
| V4 — Isolated rebuild | Create new, clean project resources only after deployment/secret-management decisions are also approved. | New names/namespaces/roles/storage prefixes and verification report. | Legacy data migration, shared database access, reuse of legacy credentials, or modification of unrelated services. |

No later gate is implied by an earlier one. A V1 inventory result is not
authority to delete; V3 authority is not authority to deploy an application.

## 4. V1 read-only inventory scope

The future V1 inventory may collect only the following metadata, subject to the
owner-approved authorisation. It must redact secrets and avoid content reads.

| Area | Permitted metadata | Explicitly excluded |
| --- | --- | --- |
| Host identity | Host identifier, operating-system/release summary, current UTC time, storage capacity summary. | Credentials, private keys, environment-variable values, user home contents, or unrelated application data. |
| Legacy project service boundary | Process/service/container identifiers, image or unit names, state, restart policy, listener/port references, declared working directory and dependency names. | Service logs containing payloads/tokens, interactive shells, restarts, or configuration mutation. |
| Legacy DB1 metadata | Database engine/version, database and role identifiers, ownership, size summary, table names/counts and non-content schema fingerprints where safely available, connection/service references, and scheduled backup/job references. | Table rows, column values, query results containing source data, SQL dumps, backup contents, credentials, connection strings, or a full schema export. |
| Filesystem and storage | Exact project-owned path/volume/mount identifiers, size summaries, ownership/mode metadata, and references from project services/jobs. | File contents, raw captures, exports, source documents, environment-file values, or broad recursive copies. |
| Scheduled/edge dependencies | Project-specific scheduled job identifiers, domain/reverse-proxy/service references, and declared dependency direction. | Unrelated jobs/sites/configuration; secrets or certificates. |
| Unrelated-workload separation | Names/identifiers and dependency boundaries sufficient to show that a proposed target is not shared. | Operational data, secrets, or broad host inventory beyond what is needed to establish separation. |

The inventory report will mark every item `PROJECT_OWNED`, `UNRELATED`, or
`UNRESOLVED`. Only `PROJECT_OWNED` items with retained supporting evidence may
enter a V2 deletion/recreation proposal. `UNRESOLVED` means no action.

## 5. Zero-blast-radius deletion/recreation requirements

A V2 proposal cannot name a deletion/recreation action until it includes:

1. the exact host identity and the verified project-owned target list;
2. a dependency map showing each target's relationship to legacy project
   services and the absence of a dependency from unrelated workloads;
3. explicit confirmation that no target is a shared path, shared database,
   shared database role, shared volume, shared port, shared domain, shared job,
   or shared secret mechanism;
4. the approved retention/restriction treatment for the inventory report and
   any non-content audit record;
5. a step-by-step change sequence with a verification checkpoint before each
   irreversible action;
6. a containment plan that stops on unexpected ownership/dependency evidence;
   and
7. a post-change verification report covering both intended removal and the
   continued health/non-interference of declared unrelated workloads.

No deletion plan may use broad path roots, wildcard/glob targets, account-wide
cleanup, unscoped container pruning, generic database-role removal, or a
destructive command whose target cannot be resolved from the retained V1
inventory.

## 6. Clean rebuild requirements

The rebuild is independent of deletion. It cannot begin until DEC-0009 has
selected the deployment and secret-management environment, and V3 has approved
the relevant infrastructure action. The rebuild must use:

- new database names, roles, credentials, storage prefixes, service names,
  deployment configuration, and project directories;
- a legislature-specific namespace and least-privilege roles that cannot access
  unrelated databases or raw archives;
- a new, documented raw-capture archive and DB1 projection, never the legacy
  database or legacy exports; and
- verification that project services cannot access unrelated workloads and vice
  versa.

The result may be hosted on the same physical VPS only if V1/V2 evidence and
the approved environment design demonstrate genuine isolation. Co-location is
not itself evidence of safe isolation.

## 7. Stop conditions

Stop immediately and record `BLOCKED` if:

- the exact host, project ownership, access method, or permitted metadata is
  not explicitly authorised;
- an inventory command would reveal data content, credential material, or an
  unrelated workload beyond the approved scope;
- any target appears shared, ambiguous, missing from the inventory, or
  dependent on by an unrelated workload;
- access would require an unapproved credential, database query, service
  change, file copy, or network action; or
- the proposed new environment would reuse legacy data, credentials, names, or
  permissions in a way that weakens isolation.

## 8. Verification artefacts

The sequence retains only the minimum redacted artefacts needed for audit:

- V1 inventory report with item classification and evidence reference;
- V2 dependency map, exact target list, and no-blast-radius review;
- V3 approved change authorisation and execution log; and
- V4 isolation and non-interference verification report.

These are operational records, not a source-data archive. They must contain no
credentials, source-data content, raw capture, or unrelated-workload content.

## 9. Next decision

If DEC-0020 is approved, the next action is to prepare a V0 authorisation for
the exact VPS host and permitted read-only metadata commands. No VPS connection
or command execution follows directly from this plan.
