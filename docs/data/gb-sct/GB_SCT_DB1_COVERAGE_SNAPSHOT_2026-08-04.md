# GB-SCT DB1 coverage snapshot — 2026-08-04

**Status:** `CURRENT IMPLEMENTATION SNAPSHOT — NOT A NEW CAPTURE AUTHORISATION`

## Purpose

This is the short, human-readable account of what the private DB1 service
currently retains. It complements, but does not replace, the route-by-route
[master delivery matrix](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md),
the [DB1 workstream narrative](../../workstreams/db1/README.md), and named
decision/result records.

DB1 remains a source-preserving retained-projection service, not an
unqualified complete mirror, live relay, canonical dataset, download service,
or research release. The proxy remains the separate no-retention layer for the
complete selected source-route inventory.

## Current retained coverage

| Subject family | Retained DB1 collection/source windows | Reconciliation position | Explicit boundary |
| --- | --- | --- | --- |
| Bills and formal stages | Bill types, Bill stage types, Bills, Bill stages | Daily for the scheduled collections; Bill stages is access-plan-first | No Bills or stage detail capture; no bill-stage semantics or DB2 variables. |
| Sessions and institutional reference | Sessions, Constituencies, Regions, Committee types, Committee type links | Daily | No detail-route, geographic, classification, or relationship interpretation. |
| Members, parties and roles | Members; member constituency/region status; member parties; member party/government roles; Parties; Party roles; Government roles | Daily | No point-in-time membership, affiliation, role, interval, or occupancy claim. |
| Committees | Committees and Committee roles | Daily | No membership, assignment, status, date, contact, or free-text interpretation. |
| MQA reference and bounded motion material | Event types, Event links, Event subtypes, consideration motions, programme motions | Daily | No event, motion, bill, stage, vote, or amendment semantics. |
| Questions and Votes on motions | Fixed annual windows for 2011–2025 plus 2026 | D17 2026 daily; D18 historical failure-retry timer weekly (Sunday 07:30 UTC), with recurring successful-route comparison pending remediation | Questions and votes are source-preserved only. Votes on motions may include motion-amendment votes; they are not bill-amendment votes. |
| Official reports | Committee and Plenary Official Reports, annual windows 1999–2026: D20 covers 1999–2024 and 2026; D19 remains the separate 2025 pair | D19 re-fetches and compares 2025 weekly (Sunday 08:15 UTC). D20's current/historic comparison cadence is not yet approved. The 2006 Committee source is retained but explicitly unreleased (`NOT_AN_OBJECT`). | No proceedings, bill, stage, amendment, speaker, committee, contribution, text, date, or other semantic claim; the private reader is interim pending the approved access-design work. |

Each retained release has route-specific raw bytes, digest, manifest,
source-position lineage, a projection/rejection record, a declared schedule,
and an access mode appropriate to its observed volume. Private readers have
fixed paths and server-side pagination; they do not accept a user-supplied
source path or year.

## What remains proxy-only or unretained

- Bills, formal-stage, member, committee, MQA, and vote detail routes.
- Unfiltered MQA events, motions, questions, and supports routes.
- No additional Official Reports route beyond the declared annual windows; the
  2006 Committee source is a retained unreleased exception, not a release.
- Any source route not named in a closed DB1 cohort.
- All document-based bill/amendment material.

These remain available, where selected, through the private raw proxy but are
not thereby DB1 captures.

## DB2 and publication position

No DB2 canonical variables, analytic joins, charts, downloads, public data
release, or research finding exists. In particular, the current DB1 record
does not establish bill linkage for MQA material, stage-vote meaning, or any
interpretation of bill amendments.

## Recommended next decision

The [D20 result](GB_SCT_DB1_OFFICIAL_REPORTS_EXPANSION_RESULT_DEC0099_2026-08-04.md)
and [DEC-0100 access plan](GB_SCT_DB1_COMPLETION_AND_RESEARCHER_ACCESS_PROPOSAL_DEC0100.md)
now govern DB1 completion/access work. The unfiltered MQA firehoses and all
detail contracts remain later work.

The unfiltered MQA firehoses and all detail contracts should remain later
work: their current route evidence does not yet provide a bounded, useful
source window comparable to the annual Questions/Votes or Official Report
forms.
