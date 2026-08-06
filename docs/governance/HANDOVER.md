# Handover: Comparative Legislative Data

**Status:** active programme; live API catalogue only; Database mirror reset
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

There is currently no DB1 database, database role, retained source data,
schedule, service, temporary QA interface, implementation code, or active DB1
delivery record. The Live API catalogue remains separate and operational.

Four substantive independent reviews of the
[independent review commission](../planning/DB1_EXTERNAL_REVIEW_COMMISSION_2026-08-06.md)
have been assessed. Their shared safeguards and any rejected recommendations
are recorded in the approved
[Postgres-first rebuild plan](../planning/DB1_POSTGRES_MIRROR_REBUILD_PLAN_PROPOSAL_2026-08-06.md).
The owner approved that design direction as DEC-0115 on 6 August 2026. The
subsequent no-retention [Cohort A coverage audit](../data/gb-sct/GB_SCT_ENDPOINT_COVERAGE_AUDIT_RESULT_2026-08-06.md)
found 20 sampled parent/detail or parent/filter subset observations, while
leaving high-volume routes and two Member-status detail forms unresolved. It
remains planning only: a final response-unit model and implementation package
need separate owner approval before any DB1 action.

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

Review the completed [Cohort A endpoint-coverage audit](../data/gb-sct/GB_SCT_ENDPOINT_COVERAGE_AUDIT_RESULT_2026-08-06.md).
It provides limited evidence that many ordinary detail/filter routes may be
alternative source presentations rather than wholly additional data. The next
decision is whether to approve a separately bounded Cohort B/final
response-unit proposal for the remaining high-volume and uncertain routes. No
DB1 rebuild, source capture, database mutation, schedule, ingest-test scaffold
or portal work is authorised.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents describe present
state and next decisions; Git preserves detailed historical implementation
evidence. Before each material package, perform the daily hygiene assessment
required by `AGENTS.md`.
