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

DB1 has substantial private retained coverage across approved collections and
annual windows, including Official Reports. The exact position is in the
[coverage snapshot](../workstreams/db1/CURRENT_COVERAGE_AND_OPERATIONS.md).
The architecture has raw response capture, manifests, hashes, source lineage,
operational projections and route-specific reconciliation controls.

The DB1 researcher interface has been reset and privately deployed under
owner-approved DEC-0101 Stages A–C. Owner testing of the DEC-0103 interface
then directed the focused DEC-0104 Database mirror accessibility correction;
it is privately deployed and awaits the next owner review. DEC-0106 adds a
privately deployed, frontend-only directory and dedicated endpoint workspace
replacement. It makes no DB1 data, source, schedule or API change; the next
required step is owner live review of the redesigned research journey.
The earlier interface exposed internal delivery cohorts
and projection/rejection mechanics rather than a coherent research resource.
The approved work is limited to a source-first private research interface,
release/manifest metadata and a database/manifest-only availability audit. The
[DB1 narrative](../workstreams/db1/README.md) records the journey, strengths,
gaps, 2006 Committee Official Reports upstream availability response, and
remaining decisions.

No source request/re-fetch, raw capture, DB1 schedule change, public claim,
DB2 work or semantic transformation is authorised. Stage D is a later owner
decision.

### DB2

DB2 has not started. It is explicitly independent: DB1 must not be shaped to
serve assumed DB2 variables. Any Tier 1/2 variables, codebooks, joins,
downloads, charts or research claims require a later approved DB2 package.

## Current authority and constraints

- DEC-0042 establishes the proxy → DB1 → DB2 programme.
- DEC-0045 retains the selected 64 route forms and their controlled
  addition/retirement process.
- DEC-0073 and DEC-0082 remain the DB1 strategic and access-direction controls;
  their detailed delivery packets are archival evidence.
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

Test and accept or identify defects in the deployed [DB1 researcher-product reset](../workstreams/db1/RESEARCHER_PRODUCT_RESET_PROPOSAL.md)
(DEC-0101). It provides:

- a source-first DB1 catalogue aligned to the proxy subject taxonomy;
- first-class retained raw-response access, including upstream availability
  messages;
- researcher tools, schema/field explanation, downloads, snippets, citation
  and provenance;
- a wider DB1 availability audit and targeted recurring recheck for the 2006
  Committee Official Reports response; and
- route-specific reconciliation/parity evidence and schedules.

The acceptance review must distinguish what is now deployed from later desired
work, preserve the DB1/DB2 boundary, and keep Stage D separately gated.

## Documentation hygiene

`docs/README.md` is the human entry point. Active documents explain present
state and next decisions; completed delivery packets are retained in
`docs/archive/` with an index. Before each material package, perform the daily
hygiene assessment required by `AGENTS.md` and record any governance trigger.
