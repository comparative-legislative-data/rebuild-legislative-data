# Handover: Comparative Legislative Data

**Status:** active programme; Database mirror backend awaiting R4 owner review
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

The previous Database mirror implementation was withdrawn on 6 August 2026.
Its project-only database, raw store, schedules, API routes, temporary QA UI,
code and active delivery documents have been removed. The reason and rebuild
rules are recorded in the [close-down and rebuild record](../workstreams/db1/CLOSEDOWN_AND_REBUILD_2026-08-06.md).

The approved rebuild has now completed R1–R3. It made one 117-unit baseline
and one immediate 117-unit reconciliation through the isolated Database mirror
data pipe; the resulting [assurance report](../workstreams/db1/ASSURANCE_REPORT_2026-08-06.md)
records the fixed full-reconciliation result (113 unchanged responses and four
then-current upstream availability conditions) and the current 117-unit state
(113 unchanged, two normal responses restored after temporary upstream errors,
and two remaining upstream availability conditions), with zero raw-file
integrity failures. PostgreSQL retains manifest,
checksum, source-condition and reconciliation evidence; raw bodies are stored
unchanged in the project raw archive. A daily 33-unit and weekly 84-unit
schedule is active. The backend has no DB1 API, user access, temporary QA UI or
research portal.

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

Conduct the DEC-0114 **R4 backend review** using the
[assurance report](../workstreams/db1/ASSURANCE_REPORT_2026-08-06.md). The
decision is whether the bounded backend is accepted as the capability boundary
for a separately designed researcher portal; it is not a decision to expose
data or begin DB2.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents describe present
state and next decisions; Git preserves detailed historical implementation
evidence. Before each material package, perform the daily hygiene assessment
required by `AGENTS.md`.
