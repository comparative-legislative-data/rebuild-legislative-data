# DB1 researcher-product reset proposal

**Decision:** DEC-0101
**Status:** `APPROVED — STAGES A–C IMPLEMENTED; OWNER ACCEPTANCE PENDING`
**Date:** 5 August 2026

## 1. Approved decision and boundary

The owner approved a bounded reset of the private DB1 researcher interface and its
supporting access contract. The aim is to turn the already retained,
source-preserving material into a coherent research resource rather than a
display of ingestion cohorts, technical projections or development exceptions.

The proposal has three linked outcomes:

1. a subject-first DB1 catalogue matching the proxy taxonomy;
2. two first-class access paths for each retained source response—exact raw
   response and appropriately structured research access; and
3. an availability and reconciliation evidence model that says what the source
   returned, when it was checked, and what DB1 does or does not establish.

Stages A–C are now deployed for owner acceptance. This is a DB1 access/provenance implementation
only. It creates no DB2 variable,
semantic interpretation, chart, public release, new source-route scope or
cross-route join.

Stage D remains a separately gated source-data and scheduling decision. This
approval does **not** authorise any live Scottish Parliament request or
re-fetch, raw capture, reconciliation-schedule change, new route, public
access, generic SQL/OData, DB2 work, semantic transformation, chart or
research release.

## 2. Problem and opportunity

The current capture architecture has strong foundations: immutable raw bytes,
manifests, hashes, route-specific source windows, operational projections and
separate proxy/DB1 data pipes. Its private interface, however, developed as a
delivery monitor. It exposes internal D-numbered cohorts, projection states and
access-plan labels as the primary experience.

That is useful operational evidence but an inadequate researcher product. It
also caused a material presentation failure for 2006 Committee Official
Reports: the retained upstream availability response was presented as a
projection problem rather than as the source's dated message.

The reset preserves the technical evidence but reverses the hierarchy:
researcher questions and source provenance come first; operational mechanics
remain available as secondary evidence.

## 3. Product contract

### 3.1 Researcher navigation

DB1 shall use the same top-level research subjects and ordering as the proxy.
Within a subject, a user selects an endpoint and, where relevant, a fixed
source year/window. Internal cohort, deployment, timer and migration names are
not primary navigation labels.

The standard page model is:

```text
Research subject → endpoint → source year/window
  ├─ Browse mirrored records              (when structurally suitable)
  ├─ Retrieve retained raw source response (always, if retained)
  ├─ Download a named DB1 release
  ├─ Inspect response structure and fields
  └─ Cite the source and DB1 capture/provenance record
```

The page must state the source URL/request form, capture or release identity,
capture time, content type, byte length, checksum, current reconciliation
position and applicable limitations. It must visibly distinguish:

- the live Scottish Parliament source;
- CLD's live no-retention proxy; and
- a dated DB1 retained response.

### 3.2 Two access layers, never substitutes

Every retained DB1 source response has two conceptually separate layers.

| Layer | Promise | Examples | Must not do |
| --- | --- | --- | --- |
| Retained source response | Deliver the received bytes with its capture manifest and checksum. | Raw browser view/stream, exact raw download, request/response provenance. | Rename fields, convert an upstream availability message into absence, or claim current source equivalence. |
| Research access layer | Make retained material easier to inspect, select and reproduce without changing its source meaning. | Paginated record browser, field/type profile, documented filters, selected-record view, release bundle, snippets. | Hide raw access, infer meaning, create DB2 variables, silently discard values, or claim all responses have a tabular form. |

If a response has no object-record projection—or an operational projection
cannot represent it safely—the first layer remains available. The interface
shall describe that response accurately instead of using generic phrases such
as “unavailable pending qualification” or “no browsable records published.”

### 3.3 Research tools

For a suitable retained release, the researcher interface should provide:

- server-side pagination and a declared, bounded selection/filter contract;
- a response-structure view: observed top-level shape, fields, supplied data
  types, null/absence behaviour where observed, array/object nesting, and
  profile/build time;
- a field guide that distinguishes observed technical facts from unvalidated
  semantic interpretation;
- named downloads: exact raw response, source-preserving record package where
  applicable, manifest/provenance bundle, and a checksum;
- small reproducible request/download examples for `curl`, Python, R and
  JavaScript, plus an explicit statement when SQL is not a supported remote
  interface;
- machine-readable and human-readable citation guidance naming the Scottish
  Parliament source, source URL, access/capture date, DB1 release/capture ID,
  and CLD's limited provenance role; and
- discoverable limitations, including retention date, source availability,
  schema/profile scope and no-semantic-transformation boundary.

Download formats must be truthful. An exact raw response is the source bytes;
a JSONL/CSV/Parquet convenience package is a separately labelled DB1 access
artefact with a manifest, row semantics and checksum. It must not be presented
as the upstream raw response.

### 3.4 Individual years and all-years access

Where a source is retained as fixed year/windows, the interface must offer both
individual source-year access and an **All available years** option. A
researcher must not have to download years one by one merely to obtain the
covered historical period.

The two options have different claims:

| Option | What it provides | Required disclosure |
| --- | --- | --- |
| Individual source year/window | The exact retained Scottish Parliament response for that named request. | Source URL, capture/release ID, capture time, content type, byte length and checksum. |
| All available years | A DB1-generated, named release bundle across the compatible retained source-year windows. | Included and excluded years, per-year capture/release IDs and checksums, generation time, row/package semantics, source-condition exceptions and coverage limitation. |

An all-years package is not a single Scottish Parliament raw response. For
structurally compatible record releases it may be supplied as JSONL, CSV and
Parquet, with equivalent documented row semantics. For heterogeneous or very
large material it should be streamed or packaged rather than concatenated in a
browser, and may supply a manifest plus per-year raw objects where a single
tabular package would misrepresent the source.

Availability exceptions must be visible in the all-years manifest. For example,
an Official Reports bundle covering 1999–2026 would state the retained 2006
Committee upstream availability message rather than quietly treating that year
as an absent or empty dataset.

## 4. Availability, source condition and reconciliation

### 4.1 Availability status is evidence, not a projection failure

Each retained source request must have an explicit current known status:

| Status | Meaning |
| --- | --- |
| `RECORDS_RETURNED` | The named capture contained a usable record collection/object shape. It does not imply completeness. |
| `EMPTY_RESPONSE` | The named capture was structurally valid but contained no records. It does not establish historical nonexistence. |
| `UPSTREAM_AVAILABILITY_MESSAGE` | The source supplied an availability or maintenance message. Preserve and present it as received. |
| `UPSTREAM_ERROR_RESPONSE` | The source returned a substantive error response; retain its transport/provenance evidence. |
| `TRANSPORT_OR_POLICY_STOP` | CLD could not complete the declared request because of a bounded technical or policy control. |
| `NOT_YET_ASSESSED` | No approved/captured evidence establishes the condition. |

`UPSTREAM_AVAILABILITY_MESSAGE` is the appropriate currently observed status
for the retained 2006 Committee Official Reports response. It is a dated
source condition, not a finding that the records are missing and not a DB2
hard-gap determination.

### 4.2 Availability audit

Following approval, run one bounded availability audit over the DB1 retained
scope. For every declared source URL/window it shall record, without semantic
interpretation:

- whether an existing capture/release already evidences a valid record shape,
  empty response, upstream availability message, error response or unresolved
  condition;
- whether the user-facing DB1 surface exposes the raw retained response;
- the current reconciliation schedule/status and the next declared check; and
- any discrepancy between raw capture, operational projection and presented
  condition.

The audit's first pass is database/manifest evidence only. Any live source
request or new retained capture requires the separately approved capture stage
below; no old result is silently overwritten.

### 4.3 2006 Committee recurring check

Create a dedicated declared check for the fixed 2006 Committee Official
Reports source window. A later successful record response creates a new raw
capture and named release; it does not alter the earlier availability-response
capture. Each run records the request, result class, bytes/checksum and
comparison to the preceding capture.

### 4.4 Schedule policy

DB1 update policy must be explicit by route/window, not inferred from the
interface. The proposed design is:

- daily reconciliation where a route/window is current or operationally
  mutable and the declared request budget permits it;
- a separately stated lower-frequency or rotating schedule for high-volume
  historical windows, with a visible last/next-check position; and
- an immediate documented review when a digest, response class, schema profile
  or source behaviour changes.

The present D19 2025 schedule remains unchanged until a later implementation
decision. The D20 and 2006 schedules are not changed by this proposal.

## 5. Contained implementation stages

Owner approval would authorise detailed planning and the following stages only
when their stated gates are met. A failed gate stops its stage without changing
the others.

| Stage | Scope | Explicit exclusion | Acceptance evidence |
| --- | --- | --- | --- |
| A. Contract and metadata | Define the DB1 catalogue/release metadata and researcher-facing labels using existing DB1 records only. | No source request, raw-data mutation, schedule or public exposure. | Contract tests, existing manifest integrity checks, reviewed information architecture. |
| B. Research access surface | Build the authenticated user interface and DB1 read endpoints for raw retrieval, releases, structure, citation and bounded browsing. | No DB2, no semantic transformation, no generic SQL/OData, no public access. | Anonymous/role denial; raw digest equality; pagination/filter contract tests; owner end-to-end acceptance. |
| C. Availability audit | Produce the database/manifest-only audit and present source condition correctly. | No live re-fetch, no source capture, no schedule change. | Auditable route/window matrix and regression cases including 2006 Committee. |
| D. Capture/reconciliation extension | Implement approved live rechecks, including the 2006 target, and any declared schedule revision. | New routes, broad retry, public release, DB2. | New decision or explicit stage authorisation; per-run manifest/digest/change evidence; no overwrite proof. |

Stages A–C can be implemented only after DEC-0101 approval. Stage D is
deliberately a further source-data/scheduling decision: its request budget,
cadence and storage effects must be approved separately.

## 6. Data and architectural constraints

- PostgreSQL remains the appropriate DB1 operational store: it supports
  transactional manifests, relational lineage, constrained researcher queries,
  role isolation and reproducible release metadata. Raw source bytes remain
  separately retained and are not replaced by a relational serialisation.
- DB1 reader roles may access declared DB1 release/metadata views only; they do
  not write captures, query DB2, or access another legislature.
- Queries are read-only, fixed to a declared release and documented. A generic
  SQL endpoint, untested OData claim or user-supplied source URL is excluded.
- The proxy/DB1 separation remains: no proxy request populates DB1 and no DB1
  raw-retrieval action is represented as a live Scottish Parliament response.
- No field profile, snippet, display label or download establishes a variable's
  semantic meaning. DB2 remains separately governed.

## 7. Risks, containment and decisions not being made

| Risk | Containment |
| --- | --- |
| A polished access layer misrepresents an old capture as live/current. | Require capture/release IDs, dated language, source URL, last/next reconciliation position and explicit layer labels. |
| Large records reintroduce slow browser-wide scans. | Precompute/capture structural profiles; paginate/stream; do not derive profiles by loading every record in the browser. |
| An availability response is mistaken for data absence. | Show the retained source message and capture date; classify it separately from empty data and DB2 hard gaps. |
| Convenience downloads alter or hide source structure. | Separate exact raw bytes from named DB1 access artefacts; include manifest, row semantics and checksum. |
| Interface additions blur DB1 into DB2. | No variables, joins, charts, classifications or analytical claims in scope. |
| Live rechecks expand beyond approved source windows. | Keep Stage D separate, literal-URL based, bounded and approval-gated. |

This proposal does not decide public access, pricing, a new parliament, a
general data API, generic SQL, OData compatibility, DB2 variables, document
corpus extraction, bill-amendment research, or a claim of a complete mirror.

## 8. Verification and review

Before private-beta acceptance, retain a verification record showing:

1. every displayed retained-response digest matches the named stored object;
2. raw downloads match the stored byte length/digest;
3. record-package counts and selection behaviour are reproducible from the
   named release and visibly labelled as DB1 access artefacts;
4. every all-years bundle has a complete coverage/exception manifest and does
   not claim to be one upstream raw response;
5. the catalogue uses one proxy-aligned subject taxonomy and does not expose
   cohort identifiers as primary navigation;
6. 2006 Committee renders the retained Scottish Parliament availability
   response with provenance, not a generic DB1 rejection;
7. anonymous users and users without the required role are denied; and
8. no live source request, schedule change or DB2 feature has occurred within
   Stages A–C.

The owner should test, at minimum, a small collection, a high-volume Official
Reports release, an individual raw download, an all-years access package, a
structured access package, an availability response, a citation record and a
non-superuser account.

## 9. Approval effect

Approval of DEC-0101 would authorise Stages A–C only. It would not authorise
Stage D, source capture/re-fetch, timer changes, new source scope, public
exposure, DB2, semantic transformation, generic query access or research
release.
