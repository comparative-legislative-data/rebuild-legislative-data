# GB-SCT Capture, Native-Access, and DB1 Plan Proposal — DEC-0018

**Status:** Proposed execution plan; no source request or implementation authorised

**Version:** 0.1.0

**Prepared:** 31 July 2026

**Decision requested:** DEC-0018

## 1. Decision requested

Approve this as the governing plan for preparing separately authorised GB-SCT
capture, capture-backed native access, and DB1 work. It implements the route
inventory approved in DEC-0007 and the handling policy approved in DEC-0008.

Approval would authorise preparation of the specified non-operational
artefacts only. It would **not** authorise a source request, raw capture,
database, storage, proxy, code, infrastructure, public native access, or
release. A source-documentation/terms inspection requires its own bounded
reconnaissance authorisation; every source-data request or capture requires a
later, batch-specific authorisation using
[`CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md`](../../../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md).

## 2. Scope and non-goals

The final intended coverage is the complete selected route inventory in the
[`master endpoint delivery matrix`](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
and [`endpoint and variable roadmap`](../../../../data/gb-sct/ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md),
not merely a small bill-core subset. Work is deliberately sequenced because
route semantics, response shapes, pagination, volume, licence/reuse terms, and
personal-data treatment have not been established.

This plan does not:

- alter the approved endpoint inventory, query forms, exclusions, or the
  distinction between motion amendments and bill amendments;
- select Tier 1/2 variables or publish a canonical dataset;
- include deferred document-based sources;
- establish a public native-access service or public DB1; or
- claim source coverage, completeness, availability, rate limits, or schema.

## 3. Required sequence and gates

| Gate | Purpose | Required evidence / artefacts | What remains prohibited |
| --- | --- | --- | --- |
| G0 — Route qualification | Establish whether a defined route group may be proposed for capture. | Completed source assessment and route-level handling record; assessed authority, terms, access, personal-data, volume/pagination and schema unknowns. | Source-documentation inspection unless its own bounded reconnaissance authorisation is approved; source-data request/capture until G1. |
| G1 — Batch request authorisation | Authorise one bounded external request/capture batch. | Owner-approved batch authorisation naming exact routes, parameters, purpose, rate/request cap, retention/access class, stop conditions, and success criteria. | Any route, parameter, time range, or action not named in that authorisation. |
| G2 — Restricted raw capture | Receive and preserve raw evidence for the authorised batch. | Immutable bytes, manifest, digest, timestamps, response/failure records, and handling-class controls. | Semantic recoding, public release, silent retry expansion, or an upstream-mirror claim. |
| G3 — Capture-backed native access | Expose declared captured versions for the approved query contract. | Capture/build identifier, route provenance, supported grammar, access controls, and manifest-integrity verification. | Live upstream pass-through, undocumented query support, or public availability by default. |
| G4 — DB1 projection | Build a loss-aware operational projection from a declared capture version. | Projection schema, raw/unparsed payload retention decision, record-to-capture lineage, rejected-value report, and reproducibility result. | Manual data edits, coercion of unknown values, or calling DB1 a 1:1 mirror. |
| G5 — Canonical-data hand-off | Assess a deliberately narrow Tier 1/2 variable proposal. | Field-level source evidence, codebook proposal, deterministic-rule specification where relevant, and validation plan. | Chart, metric, or public claim before its own approval and verification. |

No gate is passed by completing a later document. A failed or unknown condition
blocks the affected route/batch and must remain visible in its records.

## 4. Proposed batch order

All listed batches are part of the final selected inventory; their order is a
risk-control sequence, not a reduction in intended scope.

| Batch | Approved-inventory route groups | Why this order | Minimum additional evidence before G1 |
| --- | --- | --- |
| A — Bill, session, and reference/context | Bills, bill stages/types, sessions, members, electoral status, constituencies/regions, parties/member parties/roles, government roles/member government roles, committees/roles/types/type links. | Establish identifiers, temporal context, relationships, and the smallest likely first Tier 1/2 candidates before high-volume content. | Route shapes, identifier semantics, pagination/volume, source terms, personal-data screen, and a handling record for every route group. |
| B — Motions, questions, answers, and event structure | All approved `Motionsquestionsanswers*` route forms, including documented event-link and business-motion parameters. | Preserve structured procedural context while keeping bill linkage and vote interpretation unresolved. | Exact parameter semantics, cardinality, pagination/volume, event-link meaning, source terms, and per-route handling records. |
| C — Official reports and vote-on-motion records | `Orscommitteemeeting`, `orsplenarymeeting`, and `Votesmotion` identifier/year forms. | Isolate the potentially high-volume, year-partitioned sources and their document/contribution risks. | Year-partition coverage/meaning, volume/pagination, personal-data/content risk, source terms, and a batch design that never equates motion-amendment votes with bill-amendment votes. |

Batch C may itself require several separately authorised sub-batches. The
catalogue's visible year listings are not a licence to request every year in one
operation.

## 5. Capture contract requirements

Every G1 authorisation and resulting G2 run must declare and retain:

1. exact source route and allowed parameters, request method, request cap,
   rate/concurrency limit, target period, and expiry of the authorisation;
2. the specific route-handling class for raw bytes, DB1, provenance metadata,
   and any possible public output;
3. UTC start/end time, HTTP status, relevant non-secret headers, content type,
   byte length, SHA-256 digest, capture-run identifier, tool/configuration
   revision, and page/cursor relationship;
4. unaltered response bytes for every successful request and a manifest record
   for every failure, timeout, retry, rejected page, or stop condition;
5. a no-silent-retry rule: retry behaviour must be bounded and declared before
   the run; and
6. an explicit completion state: `PASS`, `FAIL`, `BLOCKED`, or `NOT_RUN`.

The request cap, rate, concurrency, pagination strategy, and any year/ID
selection are intentionally unspecified here. They are source facts and
operational choices that must be evidenced and approved per batch.

## 6. Native-access contract requirements

Native access is a view over a captured version, not an upstream relay. For
each implemented route, it must expose or link to:

- source route and allowed source parameter form;
- capture/build identifier and retrieval window;
- handling/access class and any public-access limitation;
- supported query grammar, including explicit rejection of unsupported forms;
- source-response or capture-manifest lineage; and
- verification state for manifest integrity and route coverage.

Native access must not expose an unapproved source route, return a mutable
upstream response, imply OData compatibility, or bypass the approved handling
class.

## 7. DB1 requirements

DB1 is a regenerated operational projection, not a source archive and not a
claim of 1:1 upstream parity. Each DB1 build must:

- name its input capture version(s), schema version, build identifier, and
  transformation revision;
- retain record-to-capture lineage and, where practical, raw/unparsed payload
  alongside typed/indexed fields;
- report rejected, ambiguous, duplicate, and unparsed records rather than
  silently dropping or coercing them;
- preserve source representations unless a separately approved deterministic
  transformation defines another representation; and
- produce a reproducibility digest or equivalent retained verification result.

No field is a released Tier 1 variable merely because it appears in DB1. No
join or temporal association is Tier 2 merely because it can be performed.

## 8. Acceptance criteria and public-claim boundary

An authorised batch is complete only when its declared request scope has a
retained manifest, integrity result, failure/exception disclosure, route-level
handling record, and G2 status. It may then be eligible for G3/G4 only after
their separate implementation and verification conditions have passed.

No batch, including all completed batches combined, may be described as a
complete Scottish Parliament API mirror. Public data or native access remains
off by default and requires the route-specific policy conditions and a separate
release decision.

## 9. Stop, containment, and rollback

Immediately stop the affected batch and record `BLOCKED` if:

- a route, parameter, pagination behaviour, data type, source condition,
  volume, personal-data issue, or access condition differs materially from its
  authorisation or handling record;
- a source response could exceed the declared request/retention/access scope;
- credentials, a VPS, a database, or an external service become necessary but
  are not explicitly approved; or
- a claimed bill-stage, bill-amendment, or other legislative interpretation is
  not directly supported by the approved method.

Containment means stopping further requests, restricting access to any already
captured material under its handling class, retaining the manifest/failure
record, and escalating a revised proposal. It does not mean silently deleting
evidence, broadening the batch, or continuing with assumed values.

## 10. Next decision

If DEC-0018 is approved, the next action is still not capture. The maintainer
may prepare a G0 route-qualification package and a separate bounded
source-documentation/terms inspection proposal. Only after that inspection,
the completed source assessment, and owner review may a separate G1
batch-request authorisation be submitted. No external request or implementation
follows directly from this plan.
