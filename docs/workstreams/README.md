# Programme workstreams

Comparative Legislative Data has three initial mini-projects. They share the
private application and authentication boundary, but have distinct data pipes,
claims, evidence and approval gates.

| Workstream | Research purpose | Current position |
| --- | --- | ---|
| [Live API catalogue](proxy/README.md) | Private, no-retention access to fixed Scottish Parliament API routes and direct source links. | MVP operating; later review required. |
| [Database mirror](db1/README.md) | A future PostgreSQL-based mirror of approved Scottish Parliament API responses. | No DB1 implementation is active. Four independent reviews have been synthesised into a [proposed Postgres-first rebuild plan](../planning/DB1_POSTGRES_MIRROR_REBUILD_PLAN_PROPOSAL_2026-08-06.md), pending owner approval. |
| [DB2](db2/README.md) | Explicit Tier 1/2 canonical variables, codebooks and reproducible research releases. | Not started. |

Read the [project design](../governance/PROJECT_DESIGN.md) and current
[handover](../governance/HANDOVER.md) before proposing material work.
