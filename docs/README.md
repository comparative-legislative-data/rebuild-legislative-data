# Comparative Legislative Data documentation

Comparative Legislative Data is research infrastructure for transparent,
reproducible legislative data. The first legislature is the Scottish Parliament
(`GB-SCT`). The project’s standard is that a researcher can establish what was
obtained, from where, when, how it was handled, and what has not been shown.

## Start here

1. [Project design](governance/PROJECT_DESIGN.md) — governing methodology and
   research standard.
2. [Current handover](governance/HANDOVER.md) — the live project position,
   authority and next decision.
3. [Programme workstreams](workstreams/README.md) — the human account of the
   proxy, Database mirror and DB2 mini-projects.

## The three data layers

| Layer | Purpose | Current state |
| --- | --- | --- |
| Proxy | Help private users find and inspect live Scottish Parliament API routes without CLD retaining the response. | Private MVP operating. |
| Database mirror | A PostgreSQL-based mirror of approved Scottish Parliament API responses. | A dated 117-response PostgreSQL baseline has passed: raw responses and source-object projections are retained, with three named upstream conditions. Routine reconciliation, health/recovery evidence and any researcher portal remain separate work. Read the [DB1 narrative](workstreams/db1/README.md). |
| DB2 | Create separately governed Tier 1/2 variables, codebooks and research releases. | Not started. |

The layers must never be conflated: a live proxy response is not a retained
mirror response, and a retained mirror response is not a DB2 variable or
research finding.

## Supporting records

- [GB-SCT source controls](data/gb-sct/) — endpoint inventory and source
  handling evidence.
- [Application](application/) — private-beta access boundary.
- [Infrastructure](infrastructure/) — VPS isolation and delivery controls.
- [Governance](governance/) — decisions, risks, handover and review record.
- [Archive](archive/) — selected non-current records; Git remains the full
  historical record.

## Documentation rule

Active documents explain the current product, controls and next decision in
plain language. Historic implementation detail belongs in Git, not in a
second, unintelligible active archive.
