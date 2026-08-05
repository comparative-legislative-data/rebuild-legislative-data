# Comparative Legislative Data documentation

Comparative Legislative Data is research infrastructure for transparent,
reproducible legislative data. The first legislature is the Scottish Parliament
(`GB-SCT`). The central promise is modest but demanding: a researcher should be
able to establish what was obtained, from where, when, how it was handled, and
what the project does **not** establish.

## Start here

1. [Project design](governance/PROJECT_DESIGN.md) — governing methodology,
   provenance model and research standard.
2. [Current handover](governance/HANDOVER.md) — live programme position,
   authority and the next decision.
3. [Programme workstreams](workstreams/README.md) — the human account of the
   proxy, DB1 and DB2 mini-projects.

## The three data layers

| Layer | Purpose | Read |
| --- | --- | --- |
| Proxy | Help private users find and inspect live Scottish Parliament API routes without CLD retaining the response. | [Proxy narrative](workstreams/proxy/README.md) |
| DB1 | Retain dated, source-preserving responses with manifests and build research access tools over them. | [DB1 narrative](workstreams/db1/README.md) |
| DB2 | Create separately governed Tier 1/2 variables, codebooks and research releases. | [DB2 narrative](workstreams/db2/README.md) |

These layers must never be conflated: a live proxy response is not a DB1
capture, and a DB1 capture is not a DB2 variable or research finding.

## Supporting records

| Area | What it contains | Start with |
| --- | --- | --- |
| [GB-SCT source controls](data/gb-sct/) | Approved endpoint scope, handling, volume and updateability evidence shared by the workstreams. | [GB-SCT guide](data/gb-sct/README.md) |
| [Application](application/) | Private-beta access boundary and current application status. | [Application overview](application/README.md) |
| [Infrastructure](infrastructure/) | Current VPS/isolation and delivery controls. | [Infrastructure overview](infrastructure/README.md) |
| [Governance](governance/) | Decisions, risks, handover and review record. | [Handover](governance/HANDOVER.md) |
| [Archive](archive/) | Completed delivery packets retained for audit, not day-to-day navigation. | [Archive guide](archive/README.md) |

## Documentation rule

Active documents explain the current product, controls and next decision in
plain language. Completed implementation packets are archived with an index.
Every material change must preserve the link between the active narrative and
its detailed evidence rather than forcing a reader to infer the project from
implementation filenames.
