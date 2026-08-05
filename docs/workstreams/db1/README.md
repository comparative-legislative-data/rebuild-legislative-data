# DB1: Scottish Parliament source-preserving mirror

**Status:** substantial private capture coverage exists. The first
researcher-facing interface is privately deployed, but its owner acceptance
identified a usability and accessibility overhaul that must be agreed before
further interface implementation.

## What DB1 is for

DB1 is CLD's retained source layer for Scottish Parliament API material. Its
purpose is not to create variables, reach conclusions, or replace the Scottish
Parliament as publisher. It is to make a mutable and sometimes difficult-to-use
API materially more useful to researchers while preserving exactly what was
obtained, from where, and when.

For each included source request, DB1 is intended to provide two complementary
forms of access:

1. the **retained source response**, accessible exactly as captured, with its
   request, time, headers, content type, byte length and checksum; and
2. **research access tools** over that retained material: navigable records
   where a projection is suitable, filtering and structured inspection,
   transparent schema views, reproducible downloads, code snippets, and a
   citation/provenance record.

The second layer must improve access; it must never become a condition for
seeing the first. If a source response cannot safely be rendered as rows or
objects, the raw retained response remains a first-class research object.

DB1 is independent of both other programme layers:

- the [proxy](../proxy/README.md) is a live, no-retention route to the
  Scottish Parliament API;
- DB1 is retained, dated source material and access tooling; and
- [DB2](../db2/README.md) is a later canonical-variable programme. DB2 does
  not set DB1's collection, storage, or interface priorities.

## The journey so far

The project first established the full selected endpoint inventory and a
source-preservation policy. It then built the isolated PostgreSQL/raw-capture
foundation, proved the raw-response → manifest → operational-projection chain
with a synthetic fixture, and introduced route-specific capture and
reconciliation processes. A sequence of private cohorts expanded coverage from
small reference collections to Bills, institutional context, committees,
motions/questions/related records, annual Questions and Votes-on-Motions, and
Official Reports.

The completed cohort-level packets are intentionally no longer the reading
path. They are retained in the [DB1 delivery archive](../../archive/workstreams/db1/delivery/)
as audit evidence, indexed by the archive guide. The strategic authorities that
remain active are the [DB1 plan (DEC-0073)](STRATEGY_AND_OPERATING_MODEL.md),
[access direction (DEC-0082)](RESEARCH_ACCESS_DIRECTION.md),
the [coverage snapshot](CURRENT_COVERAGE_AND_OPERATIONS.md),
and the current source controls linked below.

This implementation journey demonstrated real strengths: independent DB1 and
proxy data pipes, immutable raw response storage, per-request manifests and
hashes, separate reader/writer boundaries, named retained releases, and
scheduled reconciliation for many included routes. It also exposed a central
product-design defect: the private interface came to display the internal
delivery process (cohorts, projections, rejections and access plans) rather
than a coherent research resource. That is not an adequate end state.

## Current data position

The actual retained scope is stated in the dated [coverage snapshot](CURRENT_COVERAGE_AND_OPERATIONS.md).
In brief, the 2025 Official Reports pair is retained and reconciled separately;
the later Official Reports capture covers 1999–2024 and 2026, with 53 passing
source-year releases and one availability exception. Existing collections and
annual windows retain their own manifests and schedules.

These are private, source-preserving captures—not a claim of a complete
Scottish Parliament mirror, a canonical dataset, a public release, or an
interpretation of the records. Every coverage or freshness statement must name
its route, source window and capture/reconciliation evidence.

### The 2006 Committee Official Reports exception

The retained 2006 Committee Official Reports source response is a real source
availability response, not evidence that DB1 lost records. Its captured body
contains the Scottish Parliament message that data are presently unavailable.
The owner independently checked the corresponding Scottish Parliament API and
its JSON/CSV download paths on 4 August 2026 and observed the same result.

The first DB1 projection treated the response as non-object input and the
private interface consequently presented it as an internal shape/release
problem. That was technically truthful about the projection, but wrong as
research-facing design: it obscured the more important fact, namely what the
source said. The replacement product contract must expose the retained raw
response and clearly label it as a dated upstream availability response. It
must not imply that the historical records do not exist.

## Architecture and data rules worth preserving

- **Raw first.** Store unaltered response bytes and manifest metadata before
  producing any query-optimised representation.
- **Projection is an aid, not the source.** Operational projections add
  lineage and technical access. They cannot rename, infer, fill, categorise or
  discard source meaning; failures must be recorded without hiding the raw
  response.
- **No cross-layer leakage.** The proxy never populates DB1; DB1 is fed by its
  own capture/reconciliation pipe. The shared application and authentication
  gateway do not make the data pipes shared.
- **Research navigation follows subject, not implementation.** The proxy's
  subject taxonomy is the common researcher map. Internal cohort numbers,
  timer names, migration states and projection mechanics belong in provenance
  and operator records, not primary navigation.
- **Update evidence is route-specific.** The API provides limited reliable
  upstream update signals. DB1 therefore needs its own declared schedule,
  request contract, comparison result and change record for each route/window.
- **No semantic work in DB1.** Variables, joins, historical status claims and
  analytical transformations are DB2 work, separately designed and governed.

## Known issues and lessons

1. Early route-by-route governance made the execution record very granular.
   It produced useful evidence but obscured the strategic product shape. The
   archive keeps that evidence; this narrative and the coverage snapshot now
   carry the human account.
2. The first Official Reports reader scanned retained data to build its own
   structural display, which caused a roughly nine-second first-open delay.
   Structural profiles and other access aids should be built as deliberate
   metadata/access services, not derived in the browser at click time.
3. A rejected operational projection was allowed to become a user-facing
   availability state. The correction is architectural: a retained response is
   still accessible even when no row browser is appropriate.
4. The interface split logically related source years into D19/D20 cards and
   exposed exception mechanics. The final interface must present one source
   subject and year structure, with capture/reconciliation status as secondary
   provenance.
5. The direct source-preserving download pilot emits a projection envelope.
   The reset must specify distinct raw-response and researcher-convenience
   download choices, their formats, manifests and checksums.

## Product reset before implementation

The owner and maintainer agree that the next DB1 implementation must begin
from a researcher product contract rather than add another diagnostic panel.
The proposed interaction model is:

```text
Research subject → endpoint → source year/window
  → browse mirrored records (where suitable)
  → retrieve retained raw response
  → download a named release
  → inspect structure and fields
  → use citation/provenance and code examples
```

The following product changes are now in the approved DEC-0101 Stages A–C
implementation boundary:

- a unified DB1 catalogue matching the proxy's subject headings;
- raw-response access and availability-response presentation;
- what a record browser, search/filter interface, schema view, citation card,
  download bundle and framework snippets promise—and what they do not;
- a full availability audit across the selected retained scope, distinguishing
  successful data, empty collections, upstream availability messages and
  retrieval failures;
- a targeted recurring check of the 2006 Committee response, recording a
  change without silently overwriting its earlier captured state; and
- the reconciliation schedules and parity checks necessary to make bounded
  freshness claims.

The [researcher-product reset record](RESEARCHER_PRODUCT_RESET_PROPOSAL.md)
defines these items as DEC-0101. The owner has authorised the private
access-contract, interface and database/manifest-only availability-audit work
(Stages A–C). Any live recheck, raw capture and schedule change remain
separately approval-gated in Stage D.

No source-data mutation, schedule change or public claim is authorised by this
narrative. It remains a consolidation of the current evidence and the agreed
direction for implementation.

## Usability and accessibility overhaul

Owner testing confirmed that the DB1 access functions work, but that the
presentation still reads as an internal delivery monitor: it foregrounds
manifests, projections and implementation states ahead of the researcher’s
task. The next design decision is therefore not another incremental interface
patch. It is a task-first, accessible researcher workspace that places source,
coverage and clear actions first and keeps the evidence available through
progressive disclosure.

[DEC-0102: DB1 usability and accessibility direction](USABILITY_AND_ACCESSIBILITY_DIRECTION_PROPOSAL_DEC0102.md)
records the adopted information architecture, CSS/design direction,
accessibility contract, research-repository references, future shared-shell
principles, and acceptance tasks. Its exact follow-on
[DEC-0103 implementation proposal](DB1_RESEARCH_WORKSPACE_IMPLEMENTATION_PROPOSAL_DEC0103.md)
is now awaiting owner approval. No application, source, database, schedule or
deployment change follows until that package is approved.

## Current controls and detailed evidence

- [GB-SCT source-control guide](../../data/gb-sct/README.md)
- [Master endpoint delivery matrix (DEC-0045)](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Route-level handling register](../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [High-volume operational register](../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
- [Update-signal reconnaissance](../../data/gb-sct/GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md)
- [DB1 coverage snapshot](CURRENT_COVERAGE_AND_OPERATIONS.md)
- [Availability audit method](AVAILABILITY_AUDIT_METHOD.md)
- [DB1 usability and accessibility direction (DEC-0102)](USABILITY_AND_ACCESSIBILITY_DIRECTION_PROPOSAL_DEC0102.md)
- [DB1 research workspace implementation proposal (DEC-0103)](DB1_RESEARCH_WORKSPACE_IMPLEMENTATION_PROPOSAL_DEC0103.md)
- [DB1 delivery archive](../../archive/workstreams/db1/delivery/)

## Review triggers

Review this record before implementing the reset, changing a source request or
schedule, adding/retiring an endpoint, making a DB1 availability/freshness
claim, enabling download/query access, discovering source drift, or starting
DB2. Reconcile it with the [handover](../../governance/HANDOVER.md), decision
and risk registers, and the governance review log.
