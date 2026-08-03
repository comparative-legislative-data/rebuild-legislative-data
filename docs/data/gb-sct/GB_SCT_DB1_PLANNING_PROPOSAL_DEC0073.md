# GB-SCT DB1 Source-Faithful Projection Plan — DEC-0073

**Status:** Proposed for owner review — planning only; no source, database, VPS, or implementation action authorised

**Version:** 1.0.0
**Prepared:** 3 August 2026
**Decision requested:** DEC-0073

## 1. Decision requested

Approve the strategic plan for the GB-SCT DB1 workstream and authorise the
preparation of the bounded packages described in section 10. Approval would
adopt the intended DB1 product shape, evidence standard, delivery sequence,
and decision gates. It would **not** authorise a source request, raw capture,
retention of source material, database connection or schema change, VPS work,
application code, scheduled job, interface change, download, DB2 variable,
chart, public release, or research claim.

Every execution package remains separately owner-approved. A capture batch
also requires a completed
[capture-batch authorisation](CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md).

## 2. Why DB1 exists

The upstream proxy gives a private user a transparent view of a mutable
Scottish Parliament response at request time. It deliberately retains nothing.
That is useful for source access, but it cannot provide a stable research
object, a reproducible input, a documented failure history, or an efficient
way to analyse high-volume source material.

DB1 is the intervening data-management product. It will preserve only
approved source requests as immutable raw captures with manifests, then create
a loss-aware operational projection that points back to those captures. It is
intended to make the following possible without overstating what it has proved:

- inspect a named project capture rather than rely on a changing upstream URL;
- identify its exact source route, window, time, byte digest, schema/drift
  state, and known retrieval failures;
- query a declared, reproducible projection without claiming it is raw data;
- provide a declared, inspectable source-preservation layer in its own right;
  any later DB2 work must adapt to its stated scope and limitations; and
- make a constrained capture or projection gap visible rather than silently
  presenting a partial result as a full Scottish Parliament mirror.

“DB1 mirror” is convenient shorthand only. Until route coverage and parity are
evidenced, the public wording must be **source-faithful projection of declared
captures**, never an unqualified 1:1 mirror.

## 3. Product boundary and non-goals

| DB1 is | DB1 is not |
| --- | --- |
| An append-only raw-capture archive plus a regenerated operational projection. | A live upstream relay, an unqualified Scottish Parliament API mirror, or a canonical research dataset. |
| A collection of named capture and projection versions with manifest and record lineage. | A source of automatic Tier 1/2 variables, charts, substantive conclusions, or public downloads. |
| A means to preserve successful and failed authorised requests. | Permission to request all selected routes, years, identifiers, or pages at once. |
| A private-beta layer with its own front-end acceptance requirement. | A replacement for the Scottish Parliament source, its documentation, or its update process. |

The complete research-relevant route inventory remains in scope under
[DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md). Execution is
deliberately staged. A route’s inclusion in that inventory does not create a
capture permission, a retention decision, or a DB1 availability claim.

DB2, document-based material, Tier 3+ extraction, bill-amendment evidence,
charts, and public release remain outside this proposal.

### 3.1 DB2 is not a DB1 design input

DB1 must be planned, prioritised, implemented, and assessed against its own
source-preservation purpose: the approved inventory, source behaviour,
provenance, retention, access, operational feasibility, and transparent DB1
user value. A hoped-for DB2 variable, chart, or research question must not
change the DB1 route scope, capture order, raw-object representation,
projection schema, retention, or definition of success.

If a future DB2 workstream is approved, it will use whatever declared DB1
captures and projections are then available as a constraint. It may propose a
new DB1 expansion only as a separate DB1 decision on DB1 grounds; it cannot
quietly retrofit DB1 around a DB2 analytical preference.

## 4. Proposed DB1 operating model

### 4.1 The four retained object types

Every successful or failed authorised request belongs to one capture run and
has a durable non-secret metadata record. The final technical schema may vary,
but it must represent these concepts separately:

| Object | Minimum content | Purpose |
| --- | --- | --- |
| Source-route record | Stable route ID; exact source route/allowed parameters; source/terms and handling references; known limitations. | States what was authorised and avoids treating a database endpoint as an unqualified upstream API. |
| Capture manifest entry | Run ID; request scope; UTC start/end; status; non-secret response metadata; byte length; content type; SHA-256; retry/stop/failure state; route/page/window relationship. | Establishes what was requested, received, or not received. |
| Immutable raw object | The unaltered successful response bytes, content type, digest, and a manifest reference. | Preserves the declared source evidence without semantic recoding. |
| Projection-build record | Build ID; named input manifests; projection-schema and code revision; row/rejection counts; record-to-capture lineage; drift/integrity/reproducibility result. | Distinguishes a useful operational representation from raw capture. |

No raw object is modified in place. A correction, later request, failed retry,
or changed source response produces a new manifest entry and, where relevant, a
new projection build. DB1 must retain a non-content audit record even when a
later restriction, withdrawal, or deletion policy applies.

### 4.2 Storage, isolation, and access

The intended DB1 target is the project’s isolated DB1 environment, including
the reserved `cld_gb_sct_db1` database and project-owned raw-capture path,
only when a later execution package proves the target and permissions. It must
not use the shared PostgreSQL cluster, another project database, a developer
machine as a parallel source archive, or unreviewed external storage.

Raw bytes, manifests, projection metadata, and projected records must use
separate access classes. The normal research beta user should see only a
separately approved DB1 explorer/route contract; raw-byte access is not
presumed. Service accounts must be least-privilege, unable to alter unrelated
VPS resources, and unable to log source bodies or credentials.

The [retention and publication policy](RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md)
and route-level handling records decide the permissible retention and exposure
for each route. A project-wide policy does not replace a route-specific record.

### 4.3 Reconciliation and source drift

The present evidence does not establish a reliable upstream update watermark,
conditional request mechanism, deletion feed, or API-wide pagination contract.
DB1 therefore begins with an **independent reconciliation position**:

1. each route/batch declares its exact source window, observed retrieval unit,
   and expected completion state before execution;
2. DB1 records its own retrieval times, manifests, digests, response shapes,
   failures, and declared retries;
3. a later run compares the declared route/window and schema/response digest
   evidence; it does not silently treat a source date or HTTP `Date` header as
   a record-update timestamp; and
4. any changed schema, failed window, unexpected pagination, missing prior
   object, duplicate, source error, or unresolved update question is visible
   as a drift/reconciliation state and blocks incompatible downstream use.

This is a bounded, defensible basis for a future mirror/projection; it is not a
claim that all upstream additions, corrections, or deletions will be detected.

## 5. Evidence available now and its limits

The plan relies on existing non-retentive evidence only:

- the approved inventory and staged route roadmap in the
  [master matrix](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md);
- route handling constraints in the
  [route-level handling register](GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md);
- high-volume states and later gates in the
  [operational register](GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md);
- the absence of a demonstrated general source update signal in the
  [updateability result](GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md);
- the [source assessment protocol](SOURCE_ASSESSMENT_PROTOCOL.md),
  [retention policy](RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md), and
  [handling template](SOURCE_HANDLING_RECORD_TEMPLATE.md); and
- completed reconnaissance, qualification, and proxy records in the
  [GB-SCT archive](../../archive/data/gb-sct/).

These records do **not** prove current source availability, a complete source
schema, ID meaning, source-update behaviour, source terms for every proposed
retention action, or that any route is ready to capture. The proposed packages
must retain those unknowns until they are resolved for their exact action.

## 6. Proposed delivery sequence

The sequence separates reusable technical foundations from source-data work,
then separates low-complexity evidence from high-volume/source-risk work. It
does not exclude a family from the final inventory.

| Package | Purpose | Permitted scope after separate approval | Completion evidence | Still excluded |
| --- | --- | --- | --- | --- |
| D1 — DB1 foundation | Build and test project-local DB1 capture/projection machinery with synthetic, non-source fixtures only. | Isolated project paths/database/schema/code, synthetic tests, role/grant and non-interference checks. | Reproducible synthetic capture → manifest → projection result; no-source capability check; isolated-target result. | Source request, raw source capture, scheduled polling, beta data interface. |
| D2 — First source batch | Capture one small, specifically authorised low-volume reference slice. | Only named route(s), source window(s), request cap, retention class, and parameters in the batch authorisation. | Immutable manifest/raw objects; failure record; route-specific drift/integrity result. | Unnamed routes/years/IDs, high-volume routes, DB2 work, public access. |
| D3 — First DB1 projection and beta explorer | Generate a projection from D2 and let approved users test that layer alone. | Named D2 inputs, declared projection contract, private-beta DB1 explorer. | Lineage/reproducibility/rejection result and independent front-end acceptance. | DB2 variables, charts, public DB1/download claims. |
| D4 — Bill/session/context expansion | Add further tractable approved route groups through separately authorised batches. | Exact batch route groups after their handling/terms/contract gates. | Per-batch manifests and projection results; updated DB1 coverage register. | Automatic inclusion of the remainder of inventory. |
| D5 — High-volume programme | Address MQA, official-report, and vote-on-motion forms. | One separately designed retrieval/reconciliation method per named route/window. | Volume, transfer, cancellation, manifest, and reconciliation evidence per batch. | Firehose retrieval by assumption; bill-amendment claims. |

The implementation pace within an approved D1–D5 package may be efficient and
iterative where its target, scope, data class, and acceptance criteria remain
unchanged. A changed source route, retrieval window, retention/exposure class,
database target, or claim boundary requires a new decision.

## 7. First source-batch selection criteria

This proposal does not select or authorise the first source route. The D2
proposal must nominate it using the following criteria, visibly scored rather
than chosen for convenience:

1. clear source-preservation value within the approved inventory;
2. small, bounded source response and documented concrete request form;
3. route-specific handling/retention basis sufficient for the proposed action;
4. an achievable source window and request/retry budget;
5. an explicit schema and identifier uncertainty statement;
6. a useful manifest/projection test without hidden semantic reinterpretation;
   and
7. no dependence on an unproven update watermark or unbounded pagination.

The likely initial candidate family is a small source-defined reference route
or session route, not an unbounded whole-history, official-report, MQA, or
vote-on-motion route. Bills may be a later first **substantive** slice only
after their unresolved capture/handling basis is addressed. This is a planning
preference, not an approval to request any listed route.

## 8. Transparency and front-end acceptance

Before any DB1 beta surface is accepted, it must let a user distinguish source
route, capture, raw object, and projection without reading implementation code.
DB2 is outside this workstream, not a status within the DB1 interface. For
every exposed DB1 object it must display or link to:

- source route and declared source window/parameters;
- capture-run and manifest identifier, retrieval time/range, status, content
  type, byte size, digest, and failure/exception state;
- projection build/schema/code revision, input manifest IDs, record/rejection
  counts, and integrity/drift/reproducibility state;
- a clear raw-versus-projection label, retention/access class, source and
  project limitations, citation guidance, and unavailable/unknown fields;
- the supported query/download grammar and explicit limits; and
- an interface test result that is independent of technical DB1 success.

The first DB1 interface may be intentionally narrow. It must not simulate
coverage, expose unapproved raw content, or offer generic upstream API
compatibility. Any download proposal needs its own declared format, selection,
lineage, and access decision.

## 9. Gap analysis and stop conditions

| Gap or risk | Current position | Required response before affected action |
| --- | --- | --- |
| Route handling and retention | Many records are restrictive, historical, or action-specific. | Complete/refresh route-specific handling basis for the exact capture action. |
| Terms and source conditions | General/published evidence is not a route-specific capture licence or rate commitment. | State the applicable evidence and unresolved limitation; stop if it cannot support the proposed action. |
| IDs, parameters, pagination | Source examples and limited observations do not establish general semantics or full retrieval grammar. | Declare only observed/authorised grammar; reject/stop on anything else. |
| Updates, corrections, deletions | No general reliable upstream watermark demonstrated. | Use manifests, digests, windows, overlap/reconciliation design, and visible uncertainty. |
| High volume | Some routes are whole-history or annual firehoses. | Separate operational package with explicit transfer, streaming, cancellation, and storage budgets. |
| Data quality/meaning | Fields and relationships are not automatically research variables. | Preserve source representation; make no semantic or Tier 1/2 claim in DB1. |
| Security/isolation | DB1 will be retained project data on a shared VPS. | Use only the isolated project target, least privilege, non-interference checks, and no-payload log controls. |

Stop the affected route/package and record `BLOCKED` if the source behaviour,
scope, data class, handling basis, target, capacity, schema, or required
verification differs materially from the approved package. A stop does not
permit a broad retry, another route substitution, manual data edit, fallback
to the proxy, silent coercion, or a DB2/public claim.

## 10. Approval and review path

If DEC-0073 is approved, the immediate next deliverable is **D1: a DB1
foundation implementation proposal**. It must be small, source-free, and
synthetic-only. It will define the exact isolated target, schema/migration
boundary, raw-object and manifest interfaces, service/process needs, test
fixtures, verification, and rollback.

Only after D1 is accepted should the owner review D2, an exact first
source-capture batch proposal. D2 must name the route(s), window(s), request
cap, source/handling basis, retention/access class, transfer and retry budget,
manifest format, success/failure criteria, and its own front-end hand-off.

Review DEC-0073 before approval against these questions:

1. Does the proposed DB1 product boundary remain distinct from the proxy and
   any later analytical work?
2. Is the staged route approach transparent without quietly shrinking the
   approved inventory?
3. Are the proposed raw-capture, manifest, projection, access, and
   reconciliation controls sufficient for academic-grade provenance?
4. Is D1 appropriately source-free, and are D2/D3 properly gated?
5. Are the listed gaps and stop conditions adequate, especially for high-volume
   routes and source drift?

## 11. Narrative and detailed evidence

This proposal is the planning record for the DB1 workstream. The human-readable
programme account is the [DB1 narrative](../../workstreams/db1/README.md).
On approval, both documents must be updated with the decision, any changed
approach, implementation results, gaps, and review outcome; detailed evidence
must remain linked rather than becoming the only account of the work.
