# Infrastructure overview

This directory records the current-VPS isolation and service-delivery controls
for Comparative Legislative Data. It is deliberately separate from the proxy,
DB1 and DB2 data layers: shared application/authentication infrastructure does
not make their data pipelines shared.

The active architecture uses the current VPS without Docker, a project-owned
loopback-only PostgreSQL cluster, isolated CLD services, and the
`legislativedata.org` frontend. Other VPS workloads are outside scope. Exact
resource names, protected-resource checks, change records and operating limits
remain in the governing infrastructure plans:

- [VPS inventory and rebuild plan (DEC-0020)](VPS_INVENTORY_AND_REBUILD_PLAN_PROPOSAL_DEC0020.md)
- [Environment and secret-management approach (DEC-0009)](ENVIRONMENT_AND_SECRET_MANAGEMENT_PROPOSAL_DEC0009.md)
- [V4 foundation and web cutover plan](CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md)
- [Infrastructure work-package control (DEC-0034)](INFRASTRUCTURE_WORK_PACKAGE_CONTROL_PROPOSAL_DEC0034.md)

Detailed completed V4A work is preserved in [the infrastructure archive](../archive/infrastructure/v4a/).
Any change to VPS resources remains governed by the current handover and an
approved, bounded work package.
