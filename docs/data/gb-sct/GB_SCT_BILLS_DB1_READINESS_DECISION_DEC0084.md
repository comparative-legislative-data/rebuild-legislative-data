# GB-SCT Bills DB1 Readiness Decision — DEC-0084

**Status:** Proposed — existing-evidence decision only; owner decision required  
**Date:** 4 August 2026  
**Decision requested:** DEC-0084

## Decision in one sentence

Existing evidence does **not** permit a Bills capture package under the current
`DO_NOT_CAPTURE_OR_RELEASE` handling records. The owner must decide whether to
retain that block or replace it with a narrowly defined, private,
source-preserving collection-capture basis before any `/api/bills` DB1 package
can be proposed.

## Pre-flight

| Item | Record |
| --- | --- |
| Active phase and scope | DB1 planning only. No source request, source-data inspection, VPS/database access, code, scheduling, or release action is included. |
| Authority | Owner instruction on 4 August 2026 to sanity-check DB1 plans against the agreed mirror vision and then prepare the planned lean Bills readiness decision. |
| Records reviewed | DEC-0008, DEC-0042, DEC-0045, DEC-0073, DEC-0080–DEC-0083; the Bills collection/detail handling assessments; Bills G4 result; the DB1 workstream narrative; and the master matrix. |
| Known uncertainty | The existing Bills records establish only a bounded, value-free structural observation and general published source/licence context. They do not establish route-specific terms, field definitions, content classes, identifier semantics, rate/caching conditions, or retention/release fit. |
| Smallest proposed change | One owner decision on the collection route's handling approach. It changes no data, system, or access state. |
| Result artefact | This decision, the updated DB1 narrative/plan, decision register, and governance review entry. |

## What the DB1 vision requires

For any included route, DB1 must preserve received bytes and manifests,
reconcile on a declared schedule, compare each completed request with the
Scottish Parliament response under the same route/window contract, and expose
the result through a proxy-like catalogue but from a named DB1 release. It
must also state limits rather than imply full historical or source-wide parity.

`/api/bills` is central to that eventual mirror, but centrality is not a
handling basis. The route can join DB1 only through a collection-specific
capture package with a fixed request contract, retention/access class,
reconciliation rule, raw-object/projection lineage, and truthful
researcher-facing access mode.

## Current evidence decision

| Route | Current status | Result |
| --- | --- | --- |
| `/api/bills` | `DO_NOT_CAPTURE_OR_RELEASE` under DEC-0047 and the G4 result. | **Not ready for capture.** A current package cannot override this handling class by implication. |
| `/api/bills/:id` | `DO_NOT_CAPTURE_OR_RELEASE` under DEC-0049 and the G4 result. | **Out of scope for the next Bills increment.** It requires its own later route/identifier decision. |

This is not a finding that the collection contains prohibited material. It is a
finding that the existing project record deliberately adopted a stricter
route-specific evidence threshold and has not yet changed it.

## The single owner choice

### Option A — retain the current block

Keep both Bills routes `DO_NOT_CAPTURE_OR_RELEASE` until stronger published or
official route-specific evidence is obtained. This preserves the present
handling rule but leaves the principal Bills collection outside DB1 for now.

### Option B — authorise a revised *private collection-only* handling basis

Replace the collection route's present block with a restrictive DB1 basis,
subject to a later exact execution package. It would be limited to:

- `/api/bills` collection only; no detail route, user-supplied identifier,
  parameter, pagination, or source substitution;
- source-preserving raw capture, manifest, and loss-aware projection only—no
  DB2 variables, semantic recoding, public release, generic query, or download;
- private project retention/access, with no raw-body logging and a visible
  source/rights/field-meaning limitation at every DB1 access point;
- a declared cadence and reconciliation contract, likely a bounded daily full
  collection check only after capacity and current response size are verified;
  and
- immediate review/containment on an observed field/shape change, rights or
  privacy concern, failed/partial run, or any request beyond the fixed contract.

Option B is an owner policy and risk-boundary decision, **not** a conclusion
that every field is licensed, non-personal, or semantically understood. It
would make a carefully limited DB1 capture proposal possible; it would not
authorise that proposal's source request or implementation.

## Recommended next action

Choose **Option B** if the owner is content to treat the public institutional
collection as restricted project-held source material while retaining the
explicit limitations above. If approved, the next single package will be a
bounded Bills-collection capture/reconciliation proposal. It will reuse the
proven D4/D5 pattern and contain ordinary implementation, deployment, and
repair work inside one package, stopping only on a changed data/access boundary
or unexpected source behaviour.

No action follows from this record until the owner chooses an option.

## Evidence links

- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [Master route matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Bills G4 handling result](../../archive/data/gb-sct/bills-qualification/GB_SCT_BILLS_G4_HANDLING_ASSESSMENT_RESULT_2026-08-02.md)
- [Bills collection handling assessment — DEC-0047](../../archive/data/gb-sct/bills-qualification/GB_SCT_BILLS_COLLECTION_ROUTE_HANDLING_ASSESSMENT_DEC0047.md)
- [Bills detail handling assessment — DEC-0049](../../archive/data/gb-sct/bills-qualification/GB_SCT_BILLS_DETAIL_ROUTE_HANDLING_ASSESSMENT_DEC0049.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
