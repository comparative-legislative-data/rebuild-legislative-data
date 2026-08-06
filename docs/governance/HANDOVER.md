# Handover: Comparative Legislative Data

**Status:** active programme; Database mirror reset
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

There is currently no Database mirror data, service, schedule, user access or
research portal. The next step is only a concise, owner-reviewed
response-unit capture proposal. No new DB1 database, capture, schedule,
interface or deployment is authorised until that proposal is approved.

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

Review a new Database mirror **response-unit capture matrix**. It must specify
each exact source response to retain, explain why it is a response unit rather
than a derived record crawl, state request volume and cadence, and define how
changed or unavailable source states will be recorded.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents describe present
state and next decisions; Git preserves detailed historical implementation
evidence. Before each material package, perform the daily hygiene assessment
required by `AGENTS.md`.
