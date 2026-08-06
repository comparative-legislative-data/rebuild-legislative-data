# Handover: Comparative Legislative Data

**Status:** active programme; live API catalogue operating; DB1 backend assurance passed; recovery decision required
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

Two earlier Database mirror attempts were withdrawn: one inferred an
unbounded ID crawl; another stored raw VPS files rather than PostgreSQL data.
A third whole-response JSONB design was blocked when high-volume Official
Reports exhausted the isolated database's memory. No other project service was
affected.

The replacement lossless raw-response/source-object design passed a 150 MiB
source-free test and then DEC-0125's production implementation. The
[A5 result](../data/gb-sct/GB_SCT_DB1_A5_INITIAL_BASELINE_RESULT_2026-08-06.md)
records one exact response for each of 117 approved URLs: raw bytes and
provenance in PostgreSQL, plus 4,063,556 linked source-object rows. Three
source conditions are named rather than omitted. DB1 is a dated baseline only;
the source-free run-lock, health and drift controls and its first all-unit
reconciliation have passed. Routine daily/weekly checks are enabled;
backup/restore and any researcher portal remain separate work.

The independent-review commission, response-unit matrix and earlier source-free
proofs remain part of the audit trail. The current operational record is the
A5 result above, followed by the proposed
[backend-assurance package](../planning/GB_SCT_DB1_BACKEND_ASSURANCE_PACKAGE_PROPOSAL_2026-08-06.md).

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

Read the [DB1 A5 production baseline result](../data/gb-sct/GB_SCT_DB1_A5_INITIAL_BASELINE_RESULT_2026-08-06.md).
The 117-response boundary and all-64-form model remain intact. The initial
baseline alone authorised no schedule, portal or DB2 work; DEC-0126 has now
passed Gates A–E, including a complete recheck, and enabled the timer schedule.
Off-VPS backup-and-restore is deliberately parked until the owner decides the
application warrants that investment; it remains an open recovery requirement.
No DB2 work is enabled. Any Database mirror portal requires its own approved
researcher-experience design package and must not be inferred from the current
backend QA scaffold.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents describe present
state and next decisions; Git preserves detailed historical implementation
evidence. Before each material package, perform the daily hygiene assessment
required by `AGENTS.md`.
