# GB-SCT DB1 Continuous Source-Faithful Projection Plan — DEC-0073

**Status:** Approved strategic plan — D1 foundation proposal is next; no source/capture action authorised

**Version:** 1.1.0
**Prepared:** 3 August 2026
**Decision requested:** DEC-0073

**Decision:** Approved by the project owner on 3 August 2026

## 1. Decision requested

This approved strategic plan adopts the intended DB1 product shape, evidence
standard, delivery sequence, and decision gates. It authorises preparation of
the bounded packages described in section 10. It does **not** authorise a
source request, raw capture, retention of source material, database connection
or schema change, VPS work, application code, scheduled job, interface change,
download, DB2 variable, chart, public release, or research claim.

Every execution package remains separately owner-approved. A capture batch
also requires a completed
[capture-batch authorisation](CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md).

## 2. Why DB1 exists

The upstream proxy gives a private user a transparent view of a mutable
Scottish Parliament response at request time. It deliberately retains nothing.
That is useful for source access, but it cannot provide a stable research
object, a reproducible input, a documented failure history, or an efficient
way to analyse high-volume source material.

DB1 is a living, versioned source-preservation and research-access product. It
will routinely reconcile approved source routes, preserve authorised requests
as immutable raw captures with manifests, and create loss-aware operational
projections that point back to those captures. It is not a single snapshot in
time: each capture is an immutable observation, while a declared projection can
represent the most recently reconciled state *as of* a stated time.

It is intended to make the following possible without overstating what it has
proved:

- inspect a named project capture rather than rely on a changing upstream URL;
- identify its exact source route, window, time, byte digest, schema/drift
  state, and known retrieval failures;
- query a declared, reproducible projection without claiming it is raw data;
- inspect its capture/run history, freshness, coverage, change, failure, and
  schema-drift state rather than infer that a quiet source has not changed;
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

### 4.4 Continuous mirror and refresh model

DB1 is intended to check approved source routes routinely, with a **24-hour
default reconciliation target** for routes where that is operationally and
source-appropriately supportable. A completed run is an observation of a named
route/window at a named time; it does not overwrite the prior observation.

The exact cadence is a route-level control, not a global promise. Before a
route is scheduled, its package must assign one of these declared patterns:

| Route pattern | Proposed reconciliation approach | Required disclosure |
| --- | --- | --- |
| Small, bounded collection/reference route | Full declared retrieval at the scheduled interval, normally daily; compare manifest and raw digest with the prior successful run. | Last successful check, current-as-of time, changed/unchanged/failed state, and prior comparison scope. |
| Bounded current-period or annual route | Scheduled retrieval of the exact declared window, with a documented overlap/lookback and later recheck policy. | Window, lookback, interval, coverage, and whether older material has been revalidated. |
| Large or high-volume route | A separately approved rolling-window and periodic full-revalidation method, with explicit transfer, streaming, cancellation, and storage budgets. | Current window, next full revalidation, incomplete/failed windows, and no completeness claim outside the declared method. |
| Unbounded or unresolved route | Not scheduled until a source-supported bounded method is established. | `NOT_SCHEDULED` state and the exact missing condition. |

A run may record `CHANGED`, `UNCHANGED`, `FAILED`, `PARTIAL`,
`BLOCKED_BY_DRIFT`, or `NOT_SCHEDULED`. `UNCHANGED` means only that the
declared comparison found no difference within the completed retrieval scope;
it never means the source has made no change. `FAILED` and `PARTIAL` never
become an absence, deletion, or unchanged assertion.

Where source identifiers are available and their role is documented, DB1 may
produce a record-level change report alongside the raw-digest comparison. An
absence from one completed run is a reconciliation signal, not an automatic
deletion: the declared route/window, source behaviour, and confirmation rule
must support any stronger conclusion. No source date, response date, or HTTP
header becomes an update watermark without documented evidence.

### 4.5 PostgreSQL and raw-object storage

PostgreSQL is the proposed **primary DB1 operational database**. It is the
right fit for manifest/provenance records and source-faithful projections
because it provides transactional integrity, indexed relational and JSON
querying, robust constraints, controlled roles, reproducible server-side
queries, and mature backup/recovery tooling on the project’s existing isolated
PostgreSQL foundation.

PostgreSQL is not itself the raw-source format. The intended division is:

| Layer | Primary representation | Reason |
| --- | --- | --- |
| Immutable raw capture | Unaltered source bytes in project-owned raw-object storage, addressed by digest and manifest. | Preserves the received source object without forcing it into a database representation. |
| Manifest, reconciliation, and provenance | PostgreSQL metadata tables. | Provides durable run history, constraints, links, and queryable audit information. |
| Operational projection | PostgreSQL typed/indexed tables with a raw-object/manifest reference and, where useful, loss-aware JSON representation. | Gives researchers fast, stable, documented interrogation without relabelling the projection as raw source. |
| Researcher exports | Declared build-specific JSON/NDJSON, CSV with loss/encoding statement, Parquet, and SQLite where appropriate. | Meets different research workflows without changing the authoritative DB1 capture/projection record. |

Direct PostgreSQL access is not presumed for every user. The initial access
surface should be an authenticated DB1 explorer, documented read-only API, and
versioned download bundles. A later read-only SQL service or database-access
offering would require its own access, capacity, and security decision.

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

## 8. Researcher access product and front-end acceptance

DB1 should be materially more useful to researchers than the Scottish
Parliament API or the no-retention proxy. The proxy provides transparent access
to a current source response; DB1 provides a stable, documented, queryable
research object with a visible acquisition and change history.

The intended researcher journey is to **discover, understand, interrogate,
reproduce, obtain, and cite** a declared DB1 object without needing to infer
its provenance from an opaque API response.

| Researcher need | DB1 capability | Transparency requirement |
| --- | --- | --- |
| Discover | Route catalogue, coverage calendar, freshness indicator, capture/run history, and current-as-of projection list. | Show whether an object is current-as-of, changed, failed, partial, blocked, or not scheduled. |
| Understand | Field/schema explorer showing source names, projection names/types, structural/null signals, nested-object treatment, and semantic unknowns. | Distinguish observed structure from a validated field definition; link every projection field to its source/capture lineage. |
| Interrogate | Stable documented server-side filters, sorting, pagination, and explicitly supported relationship navigation over the declared projection. | Publish the exact supported grammar and limits; reject unsupported queries rather than imitate unproven upstream API behaviour. |
| Reproduce | Capture/projection IDs, manifest/digest, as-of time, query recipe, and copyable examples for curl, Python, R, JavaScript, and supported SQL/DuckDB workflows. | Every example names the exact route/window/build and carries its limitations. |
| Obtain | Preview plus filtered extracts and whole declared-route/build downloads in appropriate formats. | State selection, row count, schema, source window, build ID, checksum, format loss/encoding limits, and access class. |
| Audit change | Route/window comparison, schema-drift notices, changed/unchanged/failed run history, and visible coverage gaps. | Never conceal a failed reconciliation or infer a deletion from an unobserved run. |
| Cite | Human-readable citation and machine-readable manifest/citation metadata. | Identify the Scottish Parliament source, DB1 capture/projection ID, retrieval window, and access date. |

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

### 8.1 World-class DB1 acceptance criteria

The first DB1 interface can be deliberately narrow, but it is not acceptable
merely to display rows from PostgreSQL. Before a DB1 increment is called
researcher-ready, its acceptance record must demonstrate, within the approved
scope:

1. a user can identify the exact source route/window, capture run, raw-object
   digest, projection build, and current-as-of time for an object;
2. changed, unchanged, failed, partial, drifted, and unscheduled states are
   distinct and visible;
3. a user can inspect a documented field/schema view without mistaking it for
   a semantic codebook or DB2 variable definition;
4. supported query and pagination behaviour is reproducible through the UI,
   API, and at least one copyable programmatic recipe;
5. each offered export is generated from a declared build, includes the
   required manifest/schema/citation material, and has a verified checksum;
6. limits, gaps, retention/access boundary, and source/update uncertainty are
   visible at the point of access; and
7. an independent front-end acceptance test confirms the interface supports a
   researcher’s stated task without hiding the provenance record.

## 9. Gap analysis and stop conditions

| Gap or risk | Current position | Required response before affected action |
| --- | --- | --- |
| Route handling and retention | Many records are restrictive, historical, or action-specific. | Complete/refresh route-specific handling basis for the exact capture action. |
| Terms and source conditions | General/published evidence is not a route-specific capture licence or rate commitment. | State the applicable evidence and unresolved limitation; stop if it cannot support the proposed action. |
| IDs, parameters, pagination | Source examples and limited observations do not establish general semantics or full retrieval grammar. | Declare only observed/authorised grammar; reject/stop on anything else. |
| Updates, corrections, deletions | No general reliable upstream watermark demonstrated. | Use manifests, digests, windows, overlap/reconciliation design, and visible uncertainty. |
| Routine refresh | A 24-hour target cannot be universal for high-volume/unbounded routes. | Assign each route a declared cadence pattern, capacity budget, and coverage/freshness disclosure before scheduling. |
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
manifest format, reconciliation cadence, success/failure criteria, and its own
front-end hand-off.

The owner approved DEC-0073 after review against these questions:

1. Does the proposed DB1 product boundary remain distinct from the proxy and
   any later analytical work?
2. Is the staged route approach transparent without quietly shrinking the
   approved inventory?
3. Are the proposed raw-capture, manifest, projection, access, and
   continuous-reconciliation controls sufficient for academic-grade provenance?
4. Is D1 appropriately source-free, and are D2/D3 properly gated?
5. Does the PostgreSQL/raw-object/export division provide the right durable,
   secure, and researcher-friendly DB1 foundation?
6. Are the researcher-access and acceptance criteria ambitious enough for a
   world-class mirrored-data product, while keeping every claim scoped?
7. Are the listed gaps and stop conditions adequate, especially for high-volume
   routes, routine refresh, and source drift?

## 11. Narrative and detailed evidence

This proposal is the planning record for the DB1 workstream. The human-readable
programme account is the [DB1 narrative](../../workstreams/db1/README.md).
On approval, both documents must be updated with the decision, any changed
approach, implementation results, gaps, and review outcome; detailed evidence
must remain linked rather than becoming the only account of the work.
