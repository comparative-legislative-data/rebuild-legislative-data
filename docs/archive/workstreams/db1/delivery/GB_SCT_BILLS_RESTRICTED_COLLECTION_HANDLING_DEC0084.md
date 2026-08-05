# GB-SCT Bills Restricted Collection Handling — DEC-0084

**Status:** Approved — collection-only private DB1 handling basis  
**Date:** 4 August 2026  
**Successor to:** the restrictive collection assessment in DEC-0047

## Decision

The project owner has approved a restricted handling basis for exactly
`GET https://data.parliament.scot/api/bills` with no query string. This replaces
DEC-0047's `DO_NOT_CAPTURE_OR_RELEASE` outcome **for that collection route
only**. It does not revise the `/api/bills/:id` block in DEC-0049.

The decision recognises the collection as public institutional source material
that may be retained privately for the specific DB1 source-preservation purpose
below. It does not conclude that all field meanings, licensing conditions,
personal-data status, identifiers, source updates, completeness, or research
interpretations are established.

## Handling contract

| Area | Approved position |
| --- | --- |
| Route scope | Collection form only; no detail route, user-supplied ID, parameter, page, period, alternate host, redirect, source substitution, or source-derived follow-up request. |
| Purpose | Preserve and reconcile the source response as DB1 evidence; expose a named private DB1 release with provenance. |
| Retention | Immutable raw bytes and manifests may be retained in the isolated project DB1 target under `RESTRICTED_PROJECT`. A content-bearing retention action still needs the exact capture-batch/package approval. |
| Projection | A loss-aware projection may retain every source object/value plus operational lineage. No renaming, reclassification, semantic filter, inference, DB2 variable, or analytical output. |
| Access | Private authenticated DB1 access only. No public route, raw-byte access, public example, chart, canonical dataset, generic query, or download follows from this decision. |
| Disclosure | Every later interface states the exact source route, capture/build ID, as-of/reconciliation state, source/licence limitations, and that observed fields are not a DB2 codebook. |
| Reconciliation | A later package must declare cadence, request/body/time budgets, comparison method, failure/drift states, and the exact meaning of any parity statement. No global freshness or completeness claim. |
| Review and containment | Restrict the route immediately on a rights/privacy concern, source-condition change, field/shape drift, failed/partial reconciliation, or a proposed action outside this contract. Preserve the non-content audit trail and follow the approved retention/removal process. |

## Explicit exclusions

This record authorises no source request, capture, scheduler, database change,
code, deployment, account change, release, export, researcher SQL access,
DB2 work, or public claim. Those require the later exact package.

## Evidence and limitation

The decision relies on the existing public-source/reuse context and one
value-free collection observation. Those records remain limitations, not proof
of route-wide source conditions. The handling basis is an accountable owner
decision to retain the collection privately and source-preservingly within the
stated limits; it is not a legal classification of any field.

## Related records

- [Bills readiness decision — DEC-0084](GB_SCT_BILLS_DB1_READINESS_DECISION_DEC0084.md)
- [Prior collection assessment — DEC-0047](../../../data/gb-sct/bills-qualification/GB_SCT_BILLS_COLLECTION_ROUTE_HANDLING_ASSESSMENT_DEC0047.md)
- [Bills detail assessment — DEC-0049](../../../data/gb-sct/bills-qualification/GB_SCT_BILLS_DETAIL_ROUTE_HANDLING_ASSESSMENT_DEC0049.md)
- [Retention policy — DEC-0008](../../../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md)
