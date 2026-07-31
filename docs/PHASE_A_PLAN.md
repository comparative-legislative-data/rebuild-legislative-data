# Phase A Planning Pack: Endpoint Inventory, Reconnaissance, and Specification

**Status:** Approved for planning documentation only (DEC-0012)

**Version:** 0.1.0
**Last updated:** 31 July 2026

## 1. Purpose

This pack prepares an owner decision about a complete, research-relevant
endpoint inventory for the Scottish Parliament (`GB-SCT`) and a separate,
narrow first canonical dataset. It defines the evidence that a future,
separately approved source-reconnaissance action must produce. It does not make
that action, select an endpoint, or establish any fact about a source.

The pack implements Phase A in `PROJECT_DESIGN.md` only at the planning level.
Actual Phase A reconnaissance begins only after the owner approves a separate,
bounded reconnaissance decision (proposed as DEC-0013), with named target(s)
and success criteria.

## 2. Approved scope and exclusions

This approval permits only the creation and review of:

- this plan;
- [`SOURCE_ASSESSMENT_PROTOCOL.md`](SOURCE_ASSESSMENT_PROTOCOL.md); and
- [`SOURCE_SLICE_DECISION_MEMO_TEMPLATE.md`](SOURCE_SLICE_DECISION_MEMO_TEMPLATE.md);
- [`ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md`](ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md); and
- [`ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md`](ENDPOINT_INVENTORY_DECISION_MEMO_TEMPLATE.md).

The owner later authorised a narrowly bounded, metadata-only catalogue-route
inspection under DEC-0015 to prepare the DEC-0007 proposal. Its retained
outputs are
[`GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md`](GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md)
and [`GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`](GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md).

It does not permit browsing or querying a source, receiving a source response,
accessing a VPS or database, using credentials, capturing or storing data,
creating code or infrastructure, or selecting a source endpoint by assumption.
The documents may define future evidence requirements, but contain no asserted
source findings.

## 3. Required future decision sequence

### 3.1 Bounded reconnaissance proposal

A proposed DEC-0013 must be submitted before any source inspection. It must
state:

- the candidate source host(s), URL(s), and why each is believed to be an
  appropriate official authority, labelled as a candidate until assessed;
- the narrow unit of analysis, date/session boundary, and exact fields sought;
- permitted actions, request volume/rate, retrieval window, and any prohibited
  actions;
- expected licence, terms, access, retention, and personal-data questions;
- expected identifiers, pagination, schema, and availability risks;
- evidence to retain and how it will be separated from raw capture;
- clear stop conditions, including source drift or authority uncertainty; and
- acceptance criteria for the reconnaissance evidence; and
- a requirement to stop after reconnaissance and submit a completed source-slice
  decision memo before proposing capture.

The owner’s approval must name the allowed target(s) and action. General
approval of this planning pack is not sufficient, and the approval must not
permit raw capture, ingestion, database work, or publication.

### 3.2 Source-slice decision

After the approved reconnaissance activity ends, DEC-0007 can be submitted
with a completed endpoint-inventory decision memo. It must select or reject the
complete research-relevant endpoint inventory, its native-access/DB1 status,
and its Tier 1/2 versus deferred-variable roadmap. The first canonical dataset
must still be narrow. DEC-0007 does not authorise raw capture: a later capture
proposal must also satisfy the approved retention and publication policy in
DEC-0008.

## 4. Assessment standard

The future assessment uses the protocol linked above. It must distinguish:

- **observed evidence** from a recorded reconnaissance action;
- **source statements** such as a licence or field definition;
- **candidate interpretations** not yet supported by evidence; and
- **unresolved or unavailable information**.

No assessment result may call a source complete, authoritative for a research
purpose, stable, current, or suitable for capture without an explicit scope and
retained evidence.

## 5. Phase A planning exit criteria

This planning pack is ready for owner review when:

- its scope and prohibitions agree with the design, handover, and governance
  records;
- the protocol covers authority, access, licence, identifiers, pagination,
  schema, retention, and personal-data questions;
- the decision-memo template requires a bounded source-slice definition,
  evidence, stop conditions, and acceptance criteria; and
- DEC-0012 and a governance-review entry record the planning-only approval.

Meeting these criteria completes the planning pack, not Phase A. DEC-0007 has
approved the endpoint inventory and variable roadmap in
`GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md`. The proposed DEC-0008
policy is in `RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`; owner approval
of it is required before a separate capture/proxy/DB1 proposal.
