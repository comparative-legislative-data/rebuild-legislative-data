# Handover: Comparative Legislative Data

**Status:** active programme; live API catalogue operating; Database mirror schema correction proposed
**Last updated:** 6 August 2026

## Project in one page

Comparative Legislative Data is building research-grade, transparent
legislative data infrastructure. GB-SCT (the Scottish Parliament) is the first
case. The programme has three distinct products:

1. a private, no-retention Live API catalogue;
2. a future source-preserving Database mirror; and
3. a later DB2 canonical-variable and research-release layer.

The [project design](PROJECT_DESIGN.md) is the governing methodology. The
[workstreams index](../workstreams/README.md) is the human reading path.

## Current position

### Live API catalogue

The private proxy MVP is operating and owner-tested. It provides fixed Scottish
Parliament API routes through a CLD no-retention relay or a direct source link.
It is not a CLD dataset, capture, Database mirror, DB2, download, chart or
research release.

### Database mirror

The second Database mirror implementation was withdrawn and fully removed on
6 August 2026 because it did not deliver the agreed product: Scottish
Parliament API data stored in PostgreSQL as a usable database mirror. It stored
raw files on the VPS and only manifests in PostgreSQL. That is not a Database
mirror for this project.

DEC-0122 then approved a strictly source-free A2 proof. The project has an
isolated `cld_gb_sct_db1` PostgreSQL database, two A2 roles, a small
synthetic-only worker and direct SQL acceptance evidence. The first live A3
approach retained partial Scottish Parliament data in PostgreSQL only, but was
blocked after real high-volume Official Report bodies made whole-response JSONB
conversion OOM-kill the isolated DB1 service. No proxy, web, DB2 or other VPS
service was affected. The partial database must not be treated as a baseline.

The approved correction is the
[lossless raw-response/source-object schema](../planning/GB_SCT_DB1_LOSSLESS_OBJECT_SCHEMA_PROPOSAL_2026-08-06.md).
Its [A4 source-free stress proof](../data/gb-sct/GB_SCT_DB1_A4_LOSSLESS_OBJECT_STRESS_PROOF_RESULT_2026-08-06.md)
passed: a 150 MiB synthetic JSON response was held as PostgreSQL bytes and
projected into unchanged top-level objects without whole-response JSONB. The
proof payload was removed afterwards. A new final-schema and source-ingestion
package is still required; no partial A3 data is a baseline.

Four substantive independent reviews of the
[independent review commission](../planning/DB1_EXTERNAL_REVIEW_COMMISSION_2026-08-06.md)
have been assessed. Their shared safeguards and any rejected recommendations
are recorded in the approved
[Postgres-first rebuild plan](../planning/DB1_POSTGRES_MIRROR_REBUILD_PLAN_PROPOSAL_2026-08-06.md).
The owner approved that design direction as DEC-0115 on 6 August 2026. The
subsequent no-retention [Cohort A coverage audit](../data/gb-sct/GB_SCT_ENDPOINT_COVERAGE_AUDIT_RESULT_2026-08-06.md)
found 20 sampled parent/detail or parent/filter subset observations, while
leaving high-volume routes and two Member-status detail forms unresolved. The
later seven-route resolution produced an all-64-form model, and the
[A2 result](../data/gb-sct/GB_SCT_DB1_A2_FOUNDATION_PROOF_RESULT_2026-08-06.md)
now proves the storage contract without retaining source data. A live baseline
needs its own bounded A3 owner decision.

### DB2

DB2 has not started. It remains independent: a future Database mirror must not
be shaped to serve assumed DB2 variables.

## Current constraints

- The selected GB-SCT source inventory remains the programme’s long-term
  source scope; it is not, by itself, a capture instruction.
- Proxy and any future Database mirror must use independent data pipes. They
  share only application and authentication infrastructure.
- Source responses, availability messages and missing data must not be silently
  transformed into semantic or historical claims.
- Other VPS services remain out of scope.

## Read in this order before material work

1. [Project design](PROJECT_DESIGN.md)
2. this handover
3. [Governance procedure](GOVERNANCE.md)
4. [Decision register](DECISION_REGISTER.md) and
   [risk/dependency register](RISK_AND_DEPENDENCY_REGISTER.md)
5. latest entry in [governance review log](GOVERNANCE_REVIEW_LOG.md)
6. the relevant workstream narrative.

## Next decision

Review proposed [DEC-0125's production schema and initial-baseline
package](../planning/GB_SCT_DB1_PRODUCTION_SCHEMA_AND_INITIAL_BASELINE_PACKAGE_PROPOSAL_2026-08-06.md).
The 117-response boundary and all-64-form model remain intact. No live source
capture, schedule, portal or DB2 work is authorised until the package is
approved.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents describe present
state and next decisions; Git preserves detailed historical implementation
evidence. Before each material package, perform the daily hygiene assessment
required by `AGENTS.md`.
