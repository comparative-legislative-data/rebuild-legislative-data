# GB-SCT DB1 Formal-Stages Cohort Proposal — DEC-0083

**Status:** Proposed — owner approval required
**Prepared:** 3 August 2026
**Decision requested:** DEC-0083

## 1. Decision requested

Approve D5: one source-preserving DB1 increment for exactly the Scottish
Parliament collection route `/api/billstages`, represented as
`gb-sct.bill-stages.collection`.

This is the next P1 route because source-defined formal-stage records are a
necessary part of the eventual bill-history evidence layer, while the route is
distinct from Bills and has existing structural/contract evidence. It must not
be presented as a determination of what any stage means, whether a bill passed,
or how records should be ordered analytically.

No Bills route, detail route, source parameter, ID follow-up, DB2 variable,
document material, motion/vote/report data, generic query, download, public
access, chart, or shared-host action is included.

## 2. Existing evidence and remaining gap

The master matrix records `/api/billstages` as P1, `INCLUDED`, with an observed
collection contract but unresolved route-specific handling and terms. Existing
reconnaissance observed a structured collection and no pagination conclusion;
it does not establish permitted retention, field semantics, completeness,
historical coverage, update behaviour, or a research interpretation.

| Evidence available | What it supports | What it does not support |
| --- | --- | --- |
| Collection observation and contract evidence | A bounded no-query collection request can be specified. | Capture/retention permission, data meaning, source completeness, or a field codebook. |
| P1 programme priority | Formal stages are a justified next DB1 research-infrastructure subject. | A decision that a source stage represents a comparative legislative outcome. |
| DEC-0082 access direction | A volume-appropriate access mode can be declared before UI design. | A generic table, download, query grammar, or release capability. |

The D5 implementation must stop if its required handling/terms basis cannot
be demonstrated from the authorised evidence or if the route does not satisfy
the fixed transport/shape contract below.

## 3. Fixed source-preservation contract

On approval, D5 may make one serial `GET` request to exactly
`https://data.parliament.scot/api/billstages`, with no query string,
redirect, credential, retry, pagination follow-up, ID request, or substitution.

The worker must use a 20-second timeout, a one-mebibyte body cap, JSON
content-type check, and top-level-array check. It must retain unaltered bytes,
digest, manifest, capture run, structural signature, and loss-aware projection
only after the route-level handling gate has passed. A failed transport, cap,
content-type, shape, integrity, handling, or permission check is a visible
stop; it is not retried or worked around.

If initial capture and integrity pass, D5 may add a dedicated, separate daily
serial reconciliation timer. It must not reuse, delay, control, or alter the
D4A or D4C timers. The initial named release is fixed to the accepted initial
manifest; later observations cannot mutate it.

## 4. DB1 projection and access mode

The projection preserves every top-level source object/value and source
position, together with manifest/projection operational provenance. It does
not rename fields, interpret stage codes or labels, assign a bill outcome,
derive a sequence, join Bills, filter records, or create DB2 variables.

**Proposed access mode: access plan first.** D5 will provide a fixed private
release overview, field/structure guide, capture/reconciliation provenance,
and record-level provenance. It will not promise an in-browser table, generic
selection API, download, or code snippet before the initial capture establishes
the actual projection count, shape, and response size. A later named release
may propose a small collection browser or server-side selection only with an
explicit contract under DEC-0082.

## 5. Isolation and private access

Use a dedicated D5 writer account, with rights limited to D5 DB1 capture,
manifest/reconciliation, projection and release records. The existing DB1
reader receives only the minimum read-only metadata/projection permissions
needed by the fixed D5 route. It must remain unable to read raw objects or
write DB1 data. The API remains a database reader only: no upstream client,
raw filesystem access, writer credential, or timer control.

The sole proposed private response is:

`GET /db1/gb-sct/formal-stages/d5-v1`

It is limited to `BETA_USER` and `SUPERUSER` accounts; guest and anonymous
access are denied. It sits under **Bills and formal stages** but must state
that it is a retained source-preserving projection, not a Bills dataset or
source of legislative-stage interpretation.

## 6. Acceptance and stop conditions

D5 passes only if retained evidence shows:

1. exactly one named no-query source route was attempted, with no follow-up;
2. a valid handling/terms gate before source-byte retention;
3. manifest/raw/projection integrity and explicit rejection counts;
4. no semantic transformation, Bills join, or DB2 field;
5. D4A, D4C, proxy, existing application services, and shared host remain
   unaffected;
6. the reader lacks raw-object and write access, while the new writer has no
   broader DB/project privilege; and
7. an eligible user accepts the fixed D5 access-plan presentation while guest
   and anonymous requests are denied.

Stop and seek a new decision for a handling/terms failure, unexpected source
shape/size, source failure, need for a larger cap or different route form,
drift, broad privilege, timer coupling, access regression, generic browsing or
download request, or any semantic interpretation.

## 7. Why alternatives are not proposed now

Bills remain separately blocked by their existing handling/terms gap. Members,
parties, roles, and committees have current `DO_NOT_CAPTURE_OR_RELEASE`
outcomes. MQA, official-report and vote routes require their independent
high-volume/window programme. D5 is therefore the smallest bill-adjacent
increment that advances the source-preserving layer without implying that the
harder legislative or relationship questions are solved.

## 8. Owner review questions

1. Is `/api/billstages` the right next narrowly bounded P1 DB1 cohort?
2. Is an access-plan-first release, rather than an assumed browser, the right
   application of DEC-0082 while actual capture shape remains unverified?
3. Are the one-attempt transport limit, separate D5 worker/timer, fixed named
   release, and strict semantic exclusions sufficient?
4. If approved, may D5 proceed as one contained qualification,
   implementation, deployment, and owner-acceptance package?

## Related records

- [DB1 plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [D4C result — DEC-0081](GB_SCT_DB1_INSTITUTIONAL_REFERENCE_COHORT_RESULT_DEC0081_2026-08-03.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [Endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Route handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md)
- [DB1 narrative](../../workstreams/db1/README.md)
