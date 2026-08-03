# Comparative Legislative Data

Comparative Legislative Data is research infrastructure for transparent,
reproducible legislative data. The first legislature is the Scottish
Parliament (`GB-SCT`). The project is designed so that a researcher can tell
what was obtained, from where, when, how it was transformed, what has been
validated, and what remains uncertain.

The project does not present a convenient interface as proof of data quality.
Each published layer must retain its own provenance, verification, limitations,
and claim boundary. The governing standard is the
[project design](governance/PROJECT_DESIGN.md).

## The programme in three workstreams

The first release programme consists of three deliberately separate
mini-projects. They are sequenced because each creates a different kind of
value and a different kind of research claim.

| Workstream | Purpose | Current status | Start here |
| --- | --- | --- | --- |
| Upstream proxy | Give approved private-beta users transparent, source-faithful access to fixed Scottish Parliament API responses, without retaining them as project data. | MVP closed and deployed; later review required. | [Proxy narrative](workstreams/proxy/README.md) |
| DB1 source-faithful projection | Capture approved source responses with manifests and create a reproducible operational projection with capture lineage. | Planning proposal awaiting owner review; no implementation authorised. | [DB1 narrative](workstreams/db1/README.md) |
| DB2 canonical variables | Create validated Tier 1/2 research variables, codebooks, downloads, and later charts from declared DB1 inputs. | Not started; no variables or research claims exist. | [DB2 narrative](workstreams/db2/README.md) |

The proxy is **not** DB1, and DB1 is **not** DB2. The proxy opens mutable
upstream material at request time; DB1 will be a retained, versioned,
source-faithful projection; DB2 will be a versioned research dataset with
explicit variable definitions and validation. No layer may be described as
another.

## Current programme position

The proxy MVP is the only completed data-access workstream. It is private,
no-retention access to source-style routes and direct source URLs; it is not a
dataset, capture, DB1, DB2, export, chart, or research release. The next
owner-review item is the proposed DB1 plan. It needs approval and later exact
packages before any source-data capture, database change, or implementation.

## How to use these documents

1. Read the relevant [workstream narrative](workstreams/) for the human
   account: purpose, evidence, decisions, implementation, gaps, legacy issues,
   and review approach.
2. Follow its links to current technical controls and detailed evidence only
   where needed.
3. Use [governance](governance/) for the authoritative decision, risk, and
   handover record; use [archive](archive/) for completed or superseded
   implementation evidence.

## Supporting areas

| Area | Purpose | Start with |
| --- | --- | --- |
| [GB-SCT data controls](data/gb-sct/) | Source scope, route controls, handling, volume, and updateability evidence. | [GB-SCT guide](data/gb-sct/README.md) |
| [Application](application/) | Private-beta access-control boundary. | [Application status](application/README.md) |
| [Infrastructure](infrastructure/) | VPS isolation, deployment, and operational controls. | [Current VPS plan](infrastructure/CURRENT_VPS_V4_FOUNDATION_AND_WEB_CUTOVER_PLAN_PROPOSAL.md) |
| [Governance](governance/) | Decisions, risks, reviews, and handover. | [Handover](governance/HANDOVER.md) |
| [Archive](archive/) | Detailed completed records retained for auditability. | [Archive guide](archive/README.md) |
