# GB-SCT formal-stages handling record — DEC-0083

**Status:** Approved for the contained D5 restricted DB1 package only  
**Route:** `GET /api/billstages` with no query parameters  
**Date:** 3 August 2026

## Scope and necessity

This record applies only to the collection route `/api/billstages` in the
owner-approved D5 package. It does not cover the detail route, Bills,
bill-stage types, any parameterised form, document material, DB2, download,
public access, or any semantic interpretation of a stage.

The route is necessary to add one source-preserving, bill-adjacent collection
to DB1. It is not authority to determine bill progression, passage, failure,
chronology, coverage, identifier semantics, or a research outcome.

## Evidence and risk screen

Earlier bounded observations established a no-query JSON-array collection
contract, with 1,754 elements and 137,488 bytes observed on 3 August 2026.
That is structural evidence only, not a current size, content, completeness,
or field-meaning claim. Previously observed top-level keys were `BillID`,
`BillStageTypeID`, `ID`, and `StageDate`; identifiers, relationships, and date
semantics remain unassessed. No nested object keys were observed in that
bounded inspection.

The general Scottish Parliament licensing/terms evidence remains partial for
this specific route. D5 therefore uses the most restrictive operational class:
there is no public output, source relay, raw-object access, download, generic
query, or DB2 use. A later change in source conditions, content, or risk
assessment blocks the affected access/reconciliation work pending review.

## Handling, retention, and access

| Control | D5 rule |
| --- | --- |
| Raw-capture and DB1 class | `RESTRICTED_PROJECT` |
| Capture minimisation | Exactly one serial no-query `GET`; 20 seconds; one-mebibyte cap; no retry, redirect, follow-up ID, pagination, or substitution. |
| Retained material | Immutable bytes, digest, manifest, capture/reconciliation state, structural signature, and loss-aware projection. |
| Permitted DB1 addition | Operational provenance and source position only; no rename, interpretation, join, filter, aggregate, or DB2 variable. |
| Access | Dedicated D5 writer; existing DB1 reader may access the named release/projection metadata only. Beta user and superuser access only. |
| User presentation | Fixed access-plan release: provenance, observed keys/types/counts, limits, and citation guidance. Individual records, raw objects, download, and query are absent. |
| Retention/review | Approved DB1 retention policy applies. Review on any reconciliation failure/drift, source-condition change, correction/restriction request, or proposed access expansion. |
| Public output | None. Non-content methodology/verification documentation only. |

## Stop conditions

Stop rather than retain or expand on a transport, content-type, body-cap,
JSON-array, integrity, permission, source-condition, unexpected-content,
service-isolation, or access-control failure. Stop and seek a new decision for
any different route, larger cap, retry, generic browser/query, download,
public release, semantic interpretation, or DB2 use.

## Authority

This restricted handling outcome is authorised only by the owner approval of
DEC-0083 and the approved DEC-0008 retention/publication policy. It is not a
route-specific legal conclusion or broader reuse permission.

## Related evidence

- [D5 implementation proposal — DEC-0083](GB_SCT_DB1_FORMAL_STAGES_COHORT_PROPOSAL_DEC0083.md)
- [Route-level handling register](../../../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [Formal-stage contract observation](../../proxy/mvp/GB_SCT_DETAIL_AND_PARAMETER_CONTRACT_BATCH_RESULT_2026-08-03.md)
- [Retention/publication policy — DEC-0008](../../../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md)
