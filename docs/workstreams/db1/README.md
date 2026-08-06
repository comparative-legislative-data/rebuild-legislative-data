# Database mirror (DB1)

**Status:** dated 117-response PostgreSQL baseline passed; backend assurance proposed; no researcher portal

## Purpose

The GB-SCT Database mirror will retain approved Scottish Parliament API
responses in PostgreSQL so researchers can later access a dated,
source-faithful database rather than relying only on the live API. It will be
separate from the no-retention Live API catalogue and from the later DB2
canonical-variable layer.

## Current position

Two earlier implementations were withdrawn. The first inferred an unbounded
detail crawl from returned API identifiers. The second stored response bodies
as VPS files and only metadata in PostgreSQL. Neither is an acceptable DB1
product. Both implementations have been removed; only the separate Live API
catalogue remains operational.

Four independent reviews have now been synthesised into an approved
[Postgres-first rebuild plan](../../planning/DB1_POSTGRES_MIRROR_REBUILD_PLAN_PROPOSAL_2026-08-06.md).
It recommended a bounded, response-level mirror: original response bytes and
queryable JSON live together in PostgreSQL, controlled by an owner-approved
response-unit matrix. Live A3 execution then showed that whole-response JSONB
is not safe for the 45–110 MiB Official Report responses on the shared VPS.
The approved correction is the [lossless-object schema](../../planning/GB_SCT_DB1_LOSSLESS_OBJECT_SCHEMA_PROPOSAL_2026-08-06.md): exact raw bytes remain in PostgreSQL while unchanged top-level source objects become linked JSONB rows. Its [A4 source-free proof](../../data/gb-sct/GB_SCT_DB1_A4_LOSSLESS_OBJECT_STRESS_PROOF_RESULT_2026-08-06.md) passed with a 150 MiB synthetic response, then removed the test payload rows. This proves the storage pattern is viable on the isolated service; it does not make the partial A3 database a baseline or authorise source recapture.

DEC-0125 then replaced the partial A3 schema, passed the production
source-free proof and made one serial, no-retry request to every approved
response unit. The [A5 result](../../data/gb-sct/GB_SCT_DB1_A5_INITIAL_BASELINE_RESULT_2026-08-06.md)
records 117 exact PostgreSQL raw responses and 4,063,556 linked source-object
rows. It names rather than hides the 2006 Committee Reports availability
message and MQA Events/Questions HTTP-500 responses. This is a dated baseline,
not a routine-currentness or researcher-access claim.

The detail-route evidence phase is complete. The prior incomplete model was
withdrawn, then the seven-route action classified all 64 forms in one final
initial source-form model. The owner approved that model for the source-free
foundation proof only; the proof passed on 6 August 2026:

- the [response-unit matrix](../../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md), which lists the 117 bounded fixed/annual source requests;
- the [final initial DB1 response-unit model](../../data/gb-sct/GB_SCT_FINAL_INITIAL_DB1_RESPONSE_UNIT_MODEL_2026-08-06.md), which accounts for every form as a retained source response, parent-backed access form, or upstream limitation;
- the [A1 foundation package](../../planning/DB1_A1_FOUNDATION_IMPLEMENTATION_PACKAGE_PROPOSAL_2026-08-06.md), which completed the synthetic PostgreSQL proof only;
- the [A2 proof result](../../data/gb-sct/GB_SCT_DB1_A2_FOUNDATION_PROOF_RESULT_2026-08-06.md), which records the direct SQL evidence; and
- the [seven-route resolution result](../../data/gb-sct/GB_SCT_DB1_SEVEN_ROUTE_RESOLUTION_RESULT_2026-08-06.md), which records the final checks without retaining source data.

## Boundaries

- The long-term selected inventory is 64 Scottish Parliament API forms. The
  approved initial mirror boundary is the matrix's 117 literal response units;
  it is not an ID crawl or route-discovery queue.
- Any later check must use the same explicit response-unit matrix, with its
  stated cadence and exception handling.
- DB1 does not infer detail IDs, transform source fields, create variables or
  claim a DB2 analytical meaning.
- Source conditions such as an upstream availability message must be retained
  as visible database states, not silently skipped.
- Backend completeness comes first. Any temporary ingest evidence tool is not
  the researcher portal and will not be incrementally turned into one.

## What the finished backend must prove

At its accepted boundary, DB1 must be able to show directly from PostgreSQL:

1. the retained source response, request and capture provenance for every
   approved response unit;
2. whether a later check found the same bytes, changed bytes or an upstream
   condition;
3. a source-faithful raw-response archive plus lossless source-object rows that
   can support later database-based access and downloads; and
4. a bounded, recoverable and isolated routine update process.

The future researcher portal will be a separately designed product built on
that accepted capability. Its task is to make the mirror understandable and
useful, not to expose ingestion machinery.

## Controls and detailed records

- [Rebuild plan](../../planning/DB1_POSTGRES_MIRROR_REBUILD_PLAN_PROPOSAL_2026-08-06.md)
  — proposed architecture, gates and owner choices.
- [Response-unit matrix](../../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md)
  — proposed, finite DB1 capture control; no source authority.
- [A1 foundation package](../../planning/DB1_A1_FOUNDATION_IMPLEMENTATION_PACKAGE_PROPOSAL_2026-08-06.md)
  — completed PostgreSQL foundation and synthetic proof; no source authority.
- [A2 proof result](../../data/gb-sct/GB_SCT_DB1_A2_FOUNDATION_PROOF_RESULT_2026-08-06.md)
  — direct SQL storage and integrity evidence; synthetic data only.
- [Blocked A3 live-ingestion package](../../planning/GB_SCT_DB1_A3_LIVE_INGESTION_PACKAGE_PROPOSAL_2026-08-06.md)
  — retained only as the factual record of the failed whole-response JSONB approach; do not reuse it for source access.
- [Lossless-object schema proposal](../../planning/GB_SCT_DB1_LOSSLESS_OBJECT_SCHEMA_PROPOSAL_2026-08-06.md)
  — approved backend correction; its source-free proof passed.
- [A4 lossless-object stress-proof result](../../data/gb-sct/GB_SCT_DB1_A4_LOSSLESS_OBJECT_STRESS_PROOF_RESULT_2026-08-06.md)
  — direct PostgreSQL/resource evidence for the revised storage pattern;
  synthetic data only.
- [Production schema and initial-baseline package](../../planning/GB_SCT_DB1_PRODUCTION_SCHEMA_AND_INITIAL_BASELINE_PACKAGE_PROPOSAL_2026-08-06.md)
  — executed DEC-0125 package.
- [A5 production baseline result](../../data/gb-sct/GB_SCT_DB1_A5_INITIAL_BASELINE_RESULT_2026-08-06.md)
  — current dated raw-capture and projection evidence.
- [Backend-assurance package](../../planning/GB_SCT_DB1_BACKEND_ASSURANCE_PACKAGE_PROPOSAL_2026-08-06.md)
  — proposed routine-check, parity, drift, health and recovery controls; no
  frontend authority.
- [Final initial DB1 response-unit model](../../data/gb-sct/GB_SCT_FINAL_INITIAL_DB1_RESPONSE_UNIT_MODEL_2026-08-06.md)
  — approved all-64-form source-unit/access model for A2 only; no live-ingest authority.
- [Seven-route resolution result](../../data/gb-sct/GB_SCT_DB1_SEVEN_ROUTE_RESOLUTION_RESULT_2026-08-06.md)
  — completed final route-resolution evidence; no retained source data.
- [Withdrawn initial response-unit model](../../data/gb-sct/GB_SCT_INITIAL_DB1_RESPONSE_UNIT_MODEL_2026-08-06.md)
  — factual record of 24 parent-backed forms; not eligible for approval.
- [Cohort B result](../../data/gb-sct/GB_SCT_DB1_COHORT_B_RESULT_2026-08-06.md)
  — completed final source-form evidence check; no retained source data.
- [External-review commission](../../planning/DB1_EXTERNAL_REVIEW_COMMISSION_2026-08-06.md)
  — the brief and honest account of prior failures.
- [Approved endpoint inventory](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
  — long-term route scope, not capture authority.
- [Current handover](../../governance/HANDOVER.md) — active boundary and next
  decision.

## Review triggers

Review this narrative when the response-unit matrix is proposed or changed, at
each backend gate, on a source-condition/drift finding, and before any
researcher-portal proposal.
