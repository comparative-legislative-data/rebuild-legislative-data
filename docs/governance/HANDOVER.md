# Handover: Comparative Legislative Data

**Status:** Active operational boundary
**Last updated:** 5 August 2026

## The project in one page

Comparative Legislative Data is building research-grade, transparent
legislative data infrastructure. GB-SCT (the Scottish Parliament) is the first
case. The programme is deliberately divided into three different products:

1. a private, no-retention live-source proxy;
2. DB1, a source-preserving retained-data mirror and research access layer;
3. DB2, a later canonical Tier 1/2 variable and research-release layer.

The [project design](PROJECT_DESIGN.md) is the governing methodology. The
[programme workstreams](../workstreams/README.md) are the human reading path.
The decision and risk registers remain authoritative for approvals and open
controls.

## Current position

### Proxy

The private proxy MVP is complete and owner-tested. It provides fixed
Scottish Parliament API routes through a CLD no-retention relay or a direct
source link. It is not a CLD dataset, capture, DB1, DB2, download, chart or
research release. Its full account is the [proxy narrative](../workstreams/proxy/README.md);
detailed evidence is archived at [proxy MVP records](../archive/workstreams/proxy/mvp).

### DB1

DB1 has private retained coverage across approved collections and annual
windows, including Official Reports. The exact dated observation is in the
[coverage snapshot](../workstreams/db1/CURRENT_COVERAGE_AND_OPERATIONS.md).
The backend records raw response capture, manifests, hashes, source lineage,
operational projections and route-specific reconciliation controls.

The private interface previously evolved alongside ingestion. The result is a
useful backend QA tool, but not the world-class researcher portal the project
requires. Under DEC-0107 it is now expressly classified as a QA surface:
it is retained to test backend completeness and capability, not incrementally
polished into the final product. The deployed `22d23dc` release remains the
current private baseline; no part of this repository reset is deployed.

The active DB1 work is therefore strictly sequenced: [Backend Assurance](../workstreams/db1/BACKEND_ASSURANCE.md) has completed its first metadata-only audit and requires a controlled correction; only then can an independent [Research Portal](../workstreams/db1/RESEARCH_PORTAL.md) be built against an accepted backend capability contract. The 2006 Committee
Official Reports upstream availability response remains an explicit source
condition, not a silent gap or a historical conclusion.

No source request/re-fetch, raw capture, database mutation, DB1 schedule
change, public claim, DB2 work, semantic transformation, portal implementation
or deployment is authorised by the reset.

### DB2

DB2 has not started. It is explicitly independent: DB1 must not be shaped to
serve assumed DB2 variables. Any Tier 1/2 variables, codebooks, joins,
downloads, charts or research claims require a later approved DB2 package.

## Current authority and constraints

- DEC-0042 establishes the proxy → DB1 → DB2 programme.
- DEC-0045 retains the selected 64 route forms and their controlled
  addition/retirement process.
- DEC-0073 and DEC-0082 remain historical DB1 planning/access evidence;
  DEC-0107 now controls the active assurance-first/reset sequence.
- The proxy and DB1 use independent data pipes. They share only application
  and authentication infrastructure.
- Source responses, availability messages and missing data must not be silently
  transformed into semantic or historical claims.
- The existing VPS foundation is isolated and operational. Other VPS services
  remain out of scope.

## Read in this order before material work

1. [Project design](PROJECT_DESIGN.md)
2. this handover
3. [Governance procedure](GOVERNANCE.md)
4. [Decision register](DECISION_REGISTER.md) and [risk/dependency register](RISK_AND_DEPENDENCY_REGISTER.md)
5. latest entry in [governance review log](GOVERNANCE_REVIEW_LOG.md)
6. relevant [workstream narrative](../workstreams/README.md)
7. relevant current source or infrastructure control.

## Next owner decision

DEC-0108's [metadata-only Backend Assurance evidence](../workstreams/db1/assurance/README.md) found sound internal lineage and DEC-0109's controlled expected-scope and route/window-control registers are owner accepted. The owner has directed that no further DB1 assurance, integrity, parity or Research Portal work proceed until the full approved 64-form scope is ingested, or a named owner-approved exception exists. The next task is a full-scope DB1 ingestion proposal.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents explain present
state and next decisions; completed delivery packets are retained in
`docs/archive/` with an index. Before each material package, perform the daily
hygiene assessment required by `AGENTS.md` and record any governance trigger.
