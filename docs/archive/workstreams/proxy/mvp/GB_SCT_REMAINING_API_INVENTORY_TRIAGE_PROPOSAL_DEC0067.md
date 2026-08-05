# GB-SCT Remaining API Inventory Triage Proposal — DEC-0067

**Status:** APPROVED — EXECUTED PASS; no additional route is enabled

**Result:** [`GB_SCT_REMAINING_API_INVENTORY_TRIAGE_RESULT_2026-08-03.md`](GB_SCT_REMAINING_API_INVENTORY_TRIAGE_RESULT_2026-08-03.md)

**Purpose:** accelerate the proxy phase by qualifying the remaining selected
inventory in route families rather than serial three-route planning cycles.

## Decision requested

Approve a repository-only triage of the 55 selected GB-SCT route forms not
already owner-accepted for private no-retention pass-through.

The work will reuse DEC-0045 and all completed reconnaissance/qualification
records. It makes no source, portal, VPS, database, or application request and
creates no route access, capture, DB1/DB2 asset, variable, chart, export, or
public release.

## Required result

Every remaining route form will receive one transparent current disposition:

- `CANDIDATE_FOR_BATCHED_PRIVATE_IMPLEMENTATION` — only where existing
  evidence supports fixed no-query transient access with no known material
  handling or operational blocker;
- `BLOCKED_BY_KNOWN_HANDLING_CONCERN` — for person/contact/free-text/`Notes`,
  relationship, or equivalent recorded concern;
- `BLOCKED_BY_CONTRACT_OR_MEANING_GAP` — for unestablished detail/parameter
  contract or semantics; or
- `REQUIRES_DISTINCT_OPERATIONAL_PACKAGE` — for high-volume, firehose,
  document/report, or materially different source-window behaviour.

The result will group the work into a small number of next packages, rather
than imply that a common classification settles licence, personal-data,
semantics, or a future DB1 design.

## Deliberate safeguards

The triage cannot enable a source route or override existing `Notes`,
`IntroText`, person/contact, detail, parameter, Bills, report, vote, or
high-volume restrictions. It does not interpret bill amendments, votes on
motions, links, party/government status, membership, dates, or identifiers.

Any candidate outcome remains a candidate only. A later implementation package
must name its exact routes, source-window/volume controls, disclosures,
allowlist changes, tests, deployment boundary, and owner acceptance sequence.

## What next

If approved, publish one route-by-route triage result and a concise proposed
sequence of later qualification/implementation packages. This creates a faster
work queue while leaving every material access decision explicit.
