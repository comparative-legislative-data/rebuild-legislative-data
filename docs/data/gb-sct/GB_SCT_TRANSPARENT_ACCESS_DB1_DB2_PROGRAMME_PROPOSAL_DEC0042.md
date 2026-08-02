# GB-SCT Transparent Access, DB1, and DB2 Programme Proposal — DEC-0042

**Status:** Proposed programme design — no source request, implementation, or public-exposure authority

**Version:** 1.1.0
**Prepared:** 2 August 2026
**Decision requested:** DEC-0042

## 1. Purpose

This proposal establishes the research-access architecture for the Scottish Parliament (`GB-SCT`) pilot. It separates three products that serve different research needs and must never be represented as one another.

1. **Upstream pass-through access** — selected Scottish Parliament API responses relayed from the source, without ingesting them into project databases.
2. **DB1** — immutable raw capture plus a source-faithful, loss-aware operational projection.
3. **DB2** — versioned canonical research datasets containing only approved Tier 1 (`NATIVE_DIRECT`) and Tier 2 (`DERIVED_DETERMINISTIC`) variables.

The intended standard is that a researcher can identify the exact data object used, its origin, retrieval or release time, limitations, definitions, transformations, and a reproducible way to obtain it. The platform does not substitute for the Scottish Parliament and makes no completeness, currency, parity, or research-validity claim beyond retained evidence.

## 2. Decision requested and boundary

DEC-0042 would adopt this three-layer programme and its shared transparency contract as the governing design for later exact work packages. It supersedes the **unapproved** live-access position in the proposed DEC-0018 plan: the programme includes a separately labelled upstream pass-through layer as well as capture-backed DB1 access.

It would not authorise a source-documentation inspection, source request, proxy request, capture, retention, database write, DB1/DB2 build, application or frontend implementation, download/API publication, VPS/secret change, public routing, dataset release, chart, or public claim. Tier 3–7 work, including document extraction and bill-amendment work, remains out of scope.

Every implementation needs a separately approved, exact package. The selected endpoint inventory and exclusions remain governed by [the roadmap](ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md), [the inventory decision](GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md), and the retention policy.

## 3. Non-negotiable distinctions

| Layer | What it is | What it is not | Evidence-backed wording |
| --- | --- | --- | --- |
| Upstream pass-through | A constrained relay of one named current upstream request. | A capture, DB1 record, project dataset, stable snapshot, or mirror. | “Relayed from the named Scottish Parliament API route at the recorded request time.” |
| DB1 | Immutable raw capture plus loss-aware operational projection with record-to-capture lineage. | A complete upstream mirror, canonical dataset, or semantic recoding. | “Observed source response(s) captured under this manifest and represented by this declared projection.” |
| DB2 | A versioned canonical dataset built solely from named DB1 inputs and documented Tier 1/2 rules. | Raw source material, a live view, or exhaustive legislative reality. | “Observed or deterministically derived under the stated rule and inputs.” |

The UI, API, download, filename, citation, and navigation must show the layer before a user receives data. No response or file may silently cross layers.

## 4. Shared transparency and access contract

Every accessible route, response, capture, projection, variable, dataset, download, chart, or code example must link to human- and machine-readable metadata recording, where applicable:

- stable identifier, layer, legislature, title, and status;
- upstream route and permitted parameters, or declared DB1/DB2 input IDs;
- request time for pass-through, capture window for DB1, and release time for DB2;
- content/release digest, byte size, format, licence/reuse statement, and retention/access class;
- provenance tier, validation status, coverage, limitations, null semantics, and explicit unknowns; and
- schema/version, code revision, transformation/codebook revision, citation, and durable access URL.

When separately authorised, the research-access interface must provide:

| User need | Required capability |
| --- | --- |
| Inspect | Catalogue pages; visible field/variable names, labels, types, allowed values, null meanings, source strings, and limitations. |
| Query | Documented browser/API grammar; visible pagination/limits; explicit rejection of unsupported filters. |
| Reproduce | Copyable `curl`, Python, R, JavaScript, and SQL examples where the relevant layer supports them, each naming its exact route/capture/release. |
| Download | Partial and full downloads with selection criteria, count, schema, format, checksum, generation time, and release/capture identity. |
| Reuse | JSON for source-faithful objects, NDJSON for bulk streamed records, CSV only with a loss/encoding statement, and approved columnar analytical formats such as Parquet for DB2. Bundles include metadata, schema/codebook, licence information, and checksums. |
| Cite | Human-readable citation text and machine-readable citation/release metadata identifying the route, capture, or DB2 release—not only the website. |

These are product requirements, not current implementation claims.

### 4.1 Layer-by-layer front-end acceptance

Each data layer must be testable in the interface on its own before the next
layer is built or exposed to beta users. A front-end acceptance result is a
separate requirement from the underlying route, capture, or variable result.

| Layer | Beta interface under test | Required visible evidence |
| --- | --- | --- |
| Upstream pass-through | A route viewer and route catalogue. | `UPSTREAM_PASSTHROUGH` status, exact upstream route/parameter form, request time, source limitations, and source-faithful response. |
| DB1 | A capture/projection explorer. | Capture and projection identifiers, manifest and integrity state, raw-versus-projection distinction, lineage, pagination/completeness limits, and source-faithful fields. |
| DB2 | A dataset/variable explorer and download surface. | Release ID, codebook, Tier 1/2 provenance, validation state, deterministic-rule/input lineage, null semantics, downloads, citations, and reproducibility material. |

No DB1 or DB2 interface is populated with a later data layer before the
previous layer has its own approved implementation and beta acceptance result.
The test outcome may be `PASS`, `FAIL`, `BLOCKED`, or `NOT_RUN`; a polished
interface never substitutes for the missing data/provenance evidence.

### 4.2 Private beta access model

Until a separately approved public-release decision, the data interface and
data routes are available only to authenticated, approved users. The only
unauthenticated surface is the minimal sign-in, beta-application, and
email-link completion flow; it exposes no route response, capture, DB1, DB2,
download, variable, or catalogue content.

| Role/state | Access |
| --- | --- |
| `SUPERUSER` | The owner-controlled account; can view beta requests, approve/revoke memberships, issue guest invitations, and access all approved beta layers. |
| `BETA_PENDING` | May submit an application but has no data access. |
| `BETA_USER` | Approved, named research beta user; read-only access to the named tested layers. |
| `GUEST` | Superuser-issued, revocable, read-only preview access to named beta layers; an expiry is required. It is not a shareable anonymous account. |

The required user journey is:

1. A prospective user opens the login modal and chooses username/password or a magic-link request; they may instead open the beta-access application modal.
2. A beta application creates a `BETA_PENDING` request. Only the superuser sees the request list and can approve it in the application.
3. Approval creates a `BETA_USER` invitation and sends a single-use, time-limited activation email through the project Resend domain configuration.
4. The activation link opens the application password-setting modal. On successful password creation, the user is automatically signed in.
5. In settings, an authenticated user can set a new password without re-entering the existing password. A magic link provides account recovery/sign-in and then permits the same reset flow, avoiding dependence on manual password support.
6. A superuser can issue the equivalent expiry-bound invitation for a `GUEST` user before a person makes a formal beta application.

Account state changes, invitation/magic-link consumption, approval/revocation,
and email delivery outcome require restricted audit records without storing
token or password values. Passwords use an approved one-way password mechanism;
activation and magic-link tokens are single-use and time-limited. The owner may
later supply an initial superuser identifier through uncommitted local
server-side configuration such as `.env.local`; this proposal does not read,
record, or expose any credential value. Production secret handling and the
Resend configuration remain subject to their own exact implementation package.

This model is a design requirement only. It does not authorise an account
schema, email send, Resend request, secret access, authentication library,
frontend, or public login implementation.

## 5. Workstream A — transparent upstream pass-through

The pass-through layer makes selected Scottish Parliament API material easier to discover and retrieve through the project while preserving that it remains an upstream response. It does not persist response data in DB1 or DB2. Any operational buffering/caching must be explicitly approved, bounded, and marked as non-authoritative transport behaviour; it cannot be relabelled as capture.

Each supported route requires a stable project route ID, exact upstream route/parameter allowlist, source/terms assessment, request/rate policy, handling class, response-size limit, error policy, and stop condition. The first package must nominate a narrow route slice; it cannot imply availability of the complete inventory.

For every response, source-faithful content is accompanied by headers and/or a linked metadata record showing `UPSTREAM_PASSTHROUGH`, upstream host/route, allowed parameter form, request timestamp, proxy version, and links to terms, assessment, handling record, and limitations. A failure remains a transparent failure; it must not be substituted with cached, inferred, or DB1 material.

## 6. Workstream B — DB1 capture and source-faithful mirror

DB1 preserves what was obtained from approved source requests so later users can inspect a declared snapshot rather than rely on a changing upstream response. It consists of an append-only raw-capture archive containing unaltered bytes and a manifest for every successful and failed authorised request, plus a regenerated loss-aware operational projection for query/download with record-to-capture lineage and visible rejected/unparsed material.

“Mirror” is shorthand for this bounded, manifest-backed project copy. It must always state selected routes, parameters, retrieval window, and exceptions; it is never an unqualified upstream-parity claim.

Each authorised capture run and DB1 build retains the route handling record, batch authorisation, capture manifest, raw-byte digest/content type/size, UTC timing, status, page/cursor relation, failure/retry record, tool/config revision, projection schema/build ID, raw-to-record lineage, rejected or ambiguous-value report, and integrity/reproducibility/schema-drift result.

The approved inventory remains complete in research scope but execution is bounded in batches. The first data package should qualify a small bill/session/reference-context slice before high-volume motions, questions/answers, official reports, and vote-on-motion material. Those later families remain in DB1 scope but are not presumed Tier 1/2-ready. Document-based amendment/meeting work is a later Tier 3+ programme.

## 7. Workstream C — DB2 Tier 1/2 canonical variables

DB2 reads only declared, versioned DB1 inputs. It cannot call the Scottish Parliament API directly, silently join an external source, or use browser-side analytical transformations. A new DB1 capture yields a new candidate DB2 build; it never overwrites a released canonical result.

Every variable requires an approved specification naming the unit of analysis, stable ID, label, type, units, allowed values, null semantics, temporal reference point, input fields/captures, inclusion/exclusion rules, limitations, and validation plan.

| Tier | Additional requirement |
| --- | --- |
| Tier 1 | Exact route/field and lossless transport treatment. The release says the value was observed in the named DB1 capture, not independently established as historical truth. |
| Tier 2 | Complete executable/SQL rule; input versions; join/temporal logic; conflict/null behaviour; edge-case tests; rationale; and reproducibility result. |

No value becomes a released variable merely because a DB1 field exists. Motions and vote-on-motion material must not be presented as bill-amendment evidence. Every DB2 release includes a manifest, schema, codebook, provenance/validation table, transformation revision, input IDs, checksum, changelog, citation, and downloadable bundles. Charts consume a named DB2 release and link back to the variable/codebook and manifest.

## 8. Programme sequence and gates

| Order | Deliverable | Required authority | Completion evidence | Not authorised |
| --- | --- | --- | --- | --- |
| 0 | Adopt this programme and prepare non-operational artefacts. | DEC-0042 | Approved design and registers. | Source or implementation action. |
| 1 | Private-beta authentication and layer-test shell. | Exact authentication/account/email/secret package. | Role lifecycle, invitation/magic-link/password flows, restricted audit, and beta-access result. | Any data layer, capture, public account, or public route. |
| 2 | First pass-through route slice and its beta interface. | Exact source/terms and proxy package. | Route/disclosure and layer-interface acceptance result. | Capture, DB1, DB2, or coverage claim. |
| 3 | First DB1 capture/projection slice and its beta interface. | Source assessment, handling, and batch-specific capture/DB1 package. | Manifest, raw archive, lineage, drift/integrity, and interface acceptance result. | DB2 variables or research claim. |
| 4 | First DB2 Tier 1/2 release and its beta interface. | Variable-specification and DB2-build package. | Codebook, deterministic build/validation, release/access, and interface acceptance result. | Tier 3+, charts, or unqualified claim. |
| 5 | Public research access/cutover. | Separate public-release/V4C package. | Claim review and public verification. | Further data/method expansion. |

The products are sequential in release dependency—pass-through, DB1, then DB2—but route qualification and non-operational documentation can be prepared in parallel. A failure blocks the affected route/layer, not the whole programme.

## 9. Stop rules

Stop and record `BLOCKED` if source terms, route semantics, parameters, pagination, volume, personal-data handling, schema, ID meaning, date logic, linkage, or access conditions differ from the approved record; if a transformation cannot be reproduced; if a download loses or hides material information; or if a surface risks implying unsupported source authority, completeness, freshness, or research validity.

A stop never permits silent retry expansion, coercion, backfill, inference, substitution between layers, or unapproved public exposure. It requires a new or corrected owner-approved package.

## 10. Decision requested

Approve DEC-0042 to adopt this transparent three-layer programme and allow preparation of non-operational supporting artefacts. The next operational step would still be a separately proposed, narrow route-qualification and source/terms package; no proxy request, capture, DB1 build, DB2 build, or public release follows automatically.
