# Project Design: Comparative Legislative Data

**Status:** Draft for approval  
**Version:** 0.1.0  
**Last updated:** 31 July 2026

## 1. Purpose and commitment

This project will provide transparent, reproducible legislative data for comparative research. Its first case study will be the Scottish Parliament (`GB-SCT`). The platform is research infrastructure, not a source of unqualified conclusions: it must make it possible for a researcher to identify exactly what was obtained, from where, when, by which code, what was transformed, and what remains uncertain.

Accuracy, traceability, and truthful disclosure take precedence over feature delivery, visual polish, coverage, or apparent completeness. A feature that cannot satisfy this standard must remain absent or be presented as incomplete.

This repository begins with **no inherited data, code, database, export, or verification claim** from the previous prototype. Earlier materials may be examined as untrusted references only. They must never be represented as evidence or migrated into the new platform without a new, documented capture and validation process.

## 2. Research objective and initial scope

The long-term objective is a modular platform that supports comparative research across legislatures while retaining each legislature's source-specific records and terminology.

The initial objective is deliberately narrower:

> Demonstrate an auditable end-to-end pipeline for a small, explicitly defined subset of Scottish Parliament legislative data, from official-source capture through raw access, documented deterministic derivation, download, and reproducible display.

The initial release will not claim a complete Scottish Parliament mirror, historical completeness, cross-national comparability, or any substantive research finding. Those claims require separate evidence and approval.

### 2.1 Initial non-goals

Until separately specified and validated, the project will not:

- label a selected projection as a “1:1 mirror” of an upstream API;
- infer missing values, status, party affiliation, government status, or legislative outcome;
- use document parsing, manual coding, machine learning, or external crosswalks in the first release;
- make client-side calculations that alter a published analytical result;
- support a new parliament merely by copying and adapting an existing parliament's implementation;
- make availability, freshness, completeness, or parity claims without a published verification artefact.

## 3. Epistemic status and terminology

The interface, documentation, APIs, exports, and internal logs will use these terms consistently.

| Term | Meaning |
| --- | --- |
| **Observed** | Present in a named source response captured at a recorded time. It is not necessarily true beyond that source and capture. |
| **Verified** | Tested against a stated, reproducible procedure with a retained result artefact. The verification scope is stated. |
| **Derived deterministic** | Produced solely by a documented rule over named, versioned inputs. It is not a source fact. |
| **Candidate** | A proposed variable, mapping, or interpretation that is not available in a released dataset. |
| **Unknown / unavailable** | A fact the platform does not establish. It must never be silently converted to `false`, zero, a default category, or a guessed value. |
| **Raw capture** | The unaltered response bytes and retrieval metadata received from a source. |
| **Operational projection** | A typed/indexed representation generated from raw capture for query performance. It is not raw data. |
| **Canonical dataset** | A versioned research dataset generated from declared source inputs and deterministic transformations. |

Words such as *complete*, *exact*, *live*, *current*, *official*, *mirror*, and *verified* are reserved for scopes that are defined and evidenced. For example, a successful field comparison of ten records is a ten-record sample verification, not proof of full parity.

## 4. Scientific and data-management methodology

### 4.1 Layered data architecture

The platform has four distinct layers. They are separate in storage, permissions, naming, APIs, and documentation.

1. **Source registry** — versioned descriptions of approved source endpoints, access conditions, licences, schemas, retrieval methods, and known limitations.
2. **Raw capture archive** — immutable response bytes and a capture manifest. Raw captures are append-only and never transformed in place.
3. **Operational projection** — loss-aware typed/indexed tables generated from a particular raw-capture version. They contain a pointer to their source capture and are regenerated, not edited manually.
4. **Canonical research outputs** — explicitly defined datasets, summaries, and charts built from declared operational inputs. Every output records the capture, transformation, code, schema, and codebook versions from which it was made.

No layer may be presented as another. In particular, a relational table containing selected fields is an operational projection, not a raw archive or a full mirror.

### 4.2 Immutable capture and manifest requirements

Each successful source request creates, or is represented by, an immutable capture record containing at least:

- source identifier and source URL, including query parameters;
- request method and non-secret request headers;
- retrieval start/end timestamps in UTC;
- HTTP status, response headers where relevant, and pagination/cursor information;
- unaltered response bytes, their content type, byte length, and SHA-256 digest;
- capture-run identifier, capture-tool version, and configuration revision;
- relationship to prior/next pages and any observed retrieval failure.

The project will retain a manifest even when a response cannot be parsed. Capture success does not imply semantic correctness, completeness, or a current snapshot; it records what the source returned under stated conditions.

### 4.3 Source and schema drift

Source schema is evidence, not an assumption. Each capture workflow must record the observed shape and compare it with the source contract expected by that workflow. A new field, removed field, incompatible type, changed identifier, failed page, or unexpected pagination behaviour is a drift event.

A drift event blocks any affected canonical publication until it is assessed. The platform must prefer a visible `BLOCKED_BY_SOURCE_DRIFT` state to silently dropping, coercing, or reinterpreting data.

### 4.4 Seven-tier provenance model

The platform uses a seven-tier provenance model for the *origin and production method* of a released value. A tier does not itself mean that a value is accurate, complete, unbiased, or suitable for a particular inference. Those are separate questions addressed by its validation status, documented limitations, and source-specific quality checks.

Every released canonical variable has a codebook record that includes:

- stable variable identifier, label, data type, units, allowed values, and null semantics;
- primary provenance tier, input lineage, and source fields/captures or external dataset version;
- transformation specification, including exact SQL or versioned executable reference;
- temporal reference point and inclusion/exclusion rules;
- assumptions, known limitations, validation method and validation status;
- codebook version, release history, and deprecation history.

#### Tier 1 — `NATIVE_DIRECT`

A value supplied directly by a named official host-assembly source and copied without semantic recoding. This can include a source identifier, title, date, or source-defined classification. Normal transport decoding and lossless serialization are permitted; changing a representation, filling a blank, reformatting a category, or assigning a new meaning is not.

The codebook must name the exact source field, endpoint/document, capture identifier, source definition where available, and any transport-level normalization. A Tier 1 value means “this is what this source returned in this capture”; it does not claim that the source value is independently verified or historically complete.

#### Tier 2 — `DERIVED_DETERMINISTIC`

A value calculated by a fully specified, repeatable rule over declared inputs. The same versioned inputs and executable specification must always produce the same output. Typical examples are a relational join, date arithmetic, an explicitly documented aggregation, or mapping a source code through a published lookup table.

Tier 2 does not permit unstated judgement. The codebook must provide the inputs, the exact transformation, null and conflict behaviour, temporal rule, edge-case tests, and the rationale for treating the rule as deterministic. Where a rule depends on a substantive interpretation—for example, which event constitutes a legislative stage—the interpretation and its validation evidence must be disclosed. A deterministic calculation may still be unsuitable if its inputs or interpretation are inadequate.

#### Tier 3 — `DERIVED_EXTRACTED`

A value programmatically extracted from source material that is not already available as a structured field, such as a PDF, HTML page, XML document, scanned record, transcript, or embedded document attachment. Extraction may use parsers, regular expressions, layout logic, OCR, or other deterministic text/document processing.

Tier 3 must retain the exact source artefact, its capture/version identifier, extraction-tool and rule version, extracted span or page/coordinate reference where feasible, parse result, and failure/ambiguity status. It must not present a parser result as directly supplied by the assembly. Release requires a documented benchmark or validation sample appropriate to the extraction risk, including recall/precision or an equally explicit error analysis. Unparsed, ambiguous, and failed cases must be countable and available for inspection.

#### Tier 4 — `DERIVED_HUMAN_CODED`

A value created or adjudicated by one or more named human coders using a documented coding protocol. This includes manual classification of documents, human resolution of ambiguous records, construction of a historical institutional coding, and manual ground-truth annotations used to validate other tiers.

Tier 4 requires a published codebook, unit of analysis, source references, coder instructions, coder identity or role disclosure consistent with privacy policy, dates of coding, versioned coding records, and an audit trail for corrections. Where more than one coder is possible, the methodology must state sampling, training, double-coding, disagreement handling, and inter-coder reliability or a reason it is not applicable. Human coding is neither inferior nor automatically authoritative: its transparency and validation evidence determine its research usability.

#### Tier 5 — `DERIVED_SYNTHETIC_AI`

A value probabilistically generated, classified, summarized, matched, or inferred by an AI/ML system, including a large language model. It remains Tier 5 even if its output is deterministic under fixed technical settings, because the semantic inference comes from a trained probabilistic model rather than a fully inspectable domain rule.

Tier 5 records must disclose the model/provider and version, prompt or model specification, system instructions, decoding/settings, input artefact/capture identifier, execution date, output, confidence where available, post-processing, human review status, and known limitations. They must be clearly labelled as AI-derived in APIs, exports, charts, and codebooks. Promotion for research use requires a pre-specified ground-truth benchmark, error metrics appropriate to the task, error strata, and a stated validation status. AI output must never silently overwrite a native, extracted, or human-coded value; disagreements are retained as separate evidence.

#### Tier 6 — `LINKED_EXTERNAL_AUTHORITY`

A value or identifier brought in through a declared external source rather than the host assembly itself. Examples include peer-reviewed datasets, official government registries, authority files, controlled vocabularies, party-system datasets, Wikidata identifiers, or established legislative datasets.

Tier 6 requires a source assessment: publisher/maintainer, licence, version or retrieval date, stable identifier, coverage, update policy, citation, crosswalk method, and known limitations. The platform must distinguish an externally asserted fact from a deterministic key match used to link it. Probabilistic entity matching is not silently Tier 6: it also requires an appropriate Tier 5 or Tier 4 process for the match, with both the linkage method and external source disclosed. External data is never represented as if it came from the host assembly.

#### Tier 7 — `UNAVAILABLE_HARD_GAP`

A documented determination that the platform cannot provide a variable for a defined assembly, period, and unit of analysis under the present approved methodology. It is a positive and useful research finding, not a generic missing-value code.

Tier 7 must include a reason code such as `NOT_RECORDED_BY_ASSEMBLY`, `NOT_APPLICABLE_TO_ASSEMBLY`, `ACCESS_RESTRICTED`, or `SOURCE_NOT_PRESERVED`, the assessment date, sources checked, and the scope of the determination. `UNKNOWN`, `NOT_YET_ASSESSED`, missing source data, failed retrieval, or an unfinished implementation are not Tier 7; they remain explicitly unresolved states. A Tier 7 determination may be revisited when new sources or methods become available.

### 4.5 Tier assignment, validation status, and composite lineage

Tier assignment applies at the finest practical level: ordinarily a variable value, and at minimum a variable within a stated release. A dataset may therefore contain values with different tiers. The release manifest must make that variation queryable rather than hiding it in narrative documentation.

Some outputs depend on multiple inputs. In that case the platform records the full lineage and a primary tier describing the immediate production method. For example, a deterministic aggregation of Tier 1 fields is Tier 2 with Tier 1 dependencies; a deterministic calculation using an external authority field is Tier 2 with Tier 6 dependencies. The API/export must expose enough lineage to prevent a Tier 2 label from disguising an external, human, extracted, or AI contribution.

`CANDIDATE` is a lifecycle state, not an eighth provenance tier. It identifies a proposed variable or method that has not met release requirements. Each variable also has an independent validation status, such as `SPECIFIED`, `IMPLEMENTED_NOT_VALIDATED`, `SAMPLE_VALIDATED`, `BENCHMARKED`, `RELEASED`, `DEPRECATED`, or `BLOCKED`. The permitted statuses, their evidence thresholds, and their public labels will be defined in the release policy before the first dataset release.

No tier may be promoted by changing its label. A value remains associated with its original evidence and method; a later, stronger or different method produces a new version with its own provenance and validation record.

### 4.6 No silent semantics

All of the following require an explicit variable specification and validation evidence before release:

- mapping a source stage or event to “introduction,” “passage,” “failure,” or any other legislative outcome;
- converting source bill types into comparative categories;
- resolving a member's party, office, or status on a date;
- assigning a bill to a legislative session;
- filling missing dates, categories, or identifiers;
- choosing a boundary date for an active session.

Absent information remains null or explicitly unknown. A released binary indicator must distinguish a confirmed negative from an unobserved or unresolved state whenever the source cannot establish that distinction.

## 5. Verification and publication standard

### 5.1 Verification is a recorded process

Every capture, projection, canonical build, download, and chart release has a machine-readable run artefact. It must state its status (`PASS`, `FAIL`, `BLOCKED`, or `NOT_RUN`), scope, inputs, software revisions, checks, exceptions, and timestamps.

At minimum, verification for a source workflow includes:

1. capture-manifest integrity: response byte hashes and manifest consistency;
2. retrieval completeness for the documented source contract: page/cursor coverage, duplicate detection, and failed-request disclosure;
3. projection reproducibility: regeneration from the same capture produces the same result digest;
4. schema and type validation, with rejected rows reported rather than discarded silently;
5. canonical reproducibility: the same versioned inputs and transformation produce the same output digest;
6. relational and temporal integrity checks appropriate to the variables released.

An upstream comparison is only made when its timing and scope are controlled. Any parity claim must identify the source snapshot or retrieval window, records compared, comparison method, tolerated normalisations (normally none for raw bytes), and result. It must never infer full equality from a sample.

### 5.2 Public disclosure

Every public dataset and chart must display or link to:

- the precise dataset/build identifier;
- source capture date/range and freshness statement;
- codebook and transformation versions;
- verification status and the corresponding report;
- limitations and known gaps;
- a download containing the fields necessary to reproduce the displayed result, or an explicit statement that it cannot be reproduced.

Public status badges are generated from verification artefacts, never hard-coded. A failed or missing check must be visible and must suppress incompatible claims.

## 6. Application and analytical design

### 6.1 APIs and exports

APIs are read-only and expose a declared dataset version. They do not query mutable data without returning a release/build identifier. Downloads are generated from the same versioned build as their API and must include a manifest and checksum.

An API must not promise OData compatibility unless the supported grammar and semantics are tested and documented. It is preferable to offer a smaller, explicit query contract than an incomplete implementation presented as OData.

### 6.2 Database-first analysis

Published metrics, groups, filters, rankings, statistical summaries, and chart series are computed in versioned server-side queries or materialized build outputs. The frontend may perform presentational interaction only: choosing among precomputed/parameterized results, formatting values, plotting points, and accessibility behaviour.

The chart page must identify the query/build behind each displayed figure. Client code must not create a new analytical category, calculate an undisclosed metric, or apply a fallback value that affects a research result.

### 6.3 Reproducible downloads

For each dataset release, CSV, Parquet, and SQLite variants must contain equivalent columns, row semantics, dataset version, and manifest reference. Their contents and digests are tested before publication. Format convenience is never allowed to remove fields needed to reproduce public displays.

## 7. Parliament isolation and zero blast radius

Adding a parliament is an integration, not an edit to an existing parliament. The system will be designed so a failure, schema change, data correction, or deployment of one assembly cannot mutate another assembly's raw captures, projections, canonical outputs, public release, configuration, or verification state.

Each legislature has its own:

- source registry and capture configuration;
- database schema/namespace and database role with least privilege;
- raw archive prefix and retention policy;
- transformation package, codebook, fixtures, and verification suite;
- release identifiers, exports, API routes, and public status page;
- deployment job and failure reporting.

Shared platform code must be a small, versioned library with stable interfaces. A shared-library change is treated as a potentially cross-parliament change: it requires compatibility tests against every existing assembly fixture and an explicit release note. No parliament may access another parliament's database schema or raw archive at runtime.

The proposed repository structure is:

```
docs/                       # platform charter, ADRs, release policy
platform/                   # shared capture/provenance/verification libraries
assemblies/
  gb-sct/
    sources/                # source registry and fetch specifications
    projections/            # schemas and projection definitions
    canonical/              # variable codebook and transformations
    tests/                  # fixtures and assembly-local tests
    releases/               # non-data manifests and published run reports
infra/                      # declarative, environment-neutral provisioning
```

Actual credentials, personal data, unreviewed captures, and generated production exports are not committed to source control.

## 8. Initial GB-SCT implementation plan

The Scottish Parliament is a pilot for the process, not evidence that the process works until its gates pass.

### Phase A — source reconnaissance and specification

- Record only official sources that have been reviewed for authority, licence, access method, pagination, identifiers, and observed limitations.
- Create a source registry and test fixture from an approved capture. Do not rely on an informal endpoint list or assumed field semantics.
- Define the first narrow data slice and its acceptance criteria. The first slice should be small enough for full inspection.

### Phase B — raw capture and native access

- Implement immutable capture, manifests, checksums, retry/failure reporting, and source-drift checks for the approved slice.
- Provide a native-access API and download that identify the capture version and transparently disclose that they are source captures or projections.
- Verify byte and manifest integrity before publishing any source-data availability claim.

### Phase C — operational projection

- Build a typed projection only where it aids queryability.
- Retain a record-to-capture lineage key and preserve unparsed source payload alongside any index where practical.
- Reject rather than coerce values whose type or meaning is not specified; report such rejections as a testable data-quality result.

### Phase D — one canonical research dataset

- Start with only variables whose source fields and meaning have been independently checked.
- Release `NATIVE_DIRECT` variables before any derived variables.
- Add one `DERIVED_DETERMINISTIC` variable only after its temporal rule, edge cases, fixtures, and reproducibility check are approved.
- Publish a codebook, build manifest, verification report, and equivalent downloads with the dataset.

### Phase E — transparent display

- Add an interface that renders the approved dataset/build without analytical browser transformations.
- Every displayed quantity links to its dataset release, query definition, and variable entries.
- No dashboard is described as “live,” “complete,” or “verified” beyond the scope of its displayed release artefacts.

Expansion to a larger GB-SCT scope, another canonical variable, or a second parliament requires an approved design update and passed acceptance criteria; it is not implied by completion of an earlier phase.

## 9. Security, operations, and environment reset

Production credentials are supplied only through an approved secret-management mechanism. They are never committed, embedded in source files, defaulted to operational passwords, or shown in logs. Database accounts are separate by service and legislature, and raw capture storage is write-once from the capture service and read-only to downstream services.

The legacy VPS project will not be used as a trusted environment or data source. Before any deletion or recreation work, a separate read-only inventory must identify the exact project-owned paths, services, databases, roles, cron jobs, storage prefixes, domains, and dependencies. The inventory must be reviewed and explicitly approved before destructive actions occur.

The clean rebuild will use new database names, roles, storage prefixes, service names, and deployment configuration. No legacy database record, export, verification state, or secret is migrated. Other VPS applications are out of scope and must not be modified.

## 10. Working agreement and change gates

The following is the working agreement for humans and automated agents on this project.

1. **Evidence before assertion.** We distinguish observed facts, verified results, assumptions, and unknowns in both technical work and user-facing copy.
2. **Analysis before mutation.** For a material change, first document the problem, affected contracts, proposed design, validation plan, and rollback/containment implications. Implementation follows explicit approval.
3. **No silent repair.** A failed source response, uncertainty, unexpected value, or schema drift becomes a recorded failure or blocked state. It is not “fixed” by a default, omission, or inference.
4. **Repository as the durable record.** Design decisions, data contracts, release notes, codebooks, verification reports, and operational procedures are version controlled here. Secrets and raw production data are excluded.
5. **Tests protect claims.** Tests are not a final cosmetic step. A new claim, variable, transformation, or integration must carry tests and a verification artefact before it becomes public.
6. **Small, reversible changes.** Changes are intentionally narrow. We avoid broad refactors, hidden dependencies, and unreviewed automation. Data releases are additive and versioned; corrections supersede rather than overwrite prior published artefacts.
7. **Explicit scope.** A task is complete only within its stated scope. “Done” never means that unverified work may be represented as ready or true.
8. **Stop on material ambiguity.** Where an ambiguity could affect a data definition, public claim, deletion target, security boundary, or historical interpretation, work pauses for a documented decision.

## 11. Initial acceptance criteria

The GB-SCT pilot is ready for a limited public research release only when all of the following are true:

- its source scope is explicitly documented and no broader completeness claim is made;
- every released record and variable is traceable to a captured source and build identifier;
- raw capture integrity, retrieval coverage, projection reproducibility, canonical reproducibility, and relevant quality checks have current passing reports;
- the codebook, manifests, verification reports, and equivalent downloads are published with the release;
- charts render only versioned server-side results reproducible from the download;
- all secrets are outside the repository and service/database permissions are isolated;
- failure and drift states are observable in the operator and public status surfaces;
- the complete implementation has passed review against this document.

## 12. Decisions required before implementation

Before source capture or infrastructure work begins, the project owner will approve:

1. the first GB-SCT source slice and the definition of success for that slice;
2. source-data retention and publication policy, including any personal-data considerations;
3. the deployment and secret-management environment;
4. the exact VPS inventory and deletion/recreation plan, after a future read-only inspection;
5. this document or a revised version of it.

No code, database, VPS, or source-data action is authorised by this design document alone.
