# DB1 Backend Assurance Audit Proposal — DEC-0108

**Status:** Approved and executed on 5 August 2026 — see the [assurance evidence](assurance/README.md).

**Decision requested:** Approve one bounded, read-only audit of existing DB1
operational evidence, followed by a decision on any content-integrity or live
source-reconciliation work.

## 1. Purpose

The current Database mirror is a retained-source backend with useful coverage
evidence, but not an accepted bounded mirror claim. This proposal separates
three questions which cannot truthfully be answered by the current QA screen:

1. **Internal evidence:** does the project’s existing metadata identify every
   expected route/window and its retained object, capture, projection,
   reconciliation and exception state?
2. **Stored-object integrity:** do the stored raw-object bytes still match the
   digest recorded in each manifest?
3. **Upstream parity as of a stated time:** do controlled new Scottish
   Parliament responses match the retained/reconciled DB1 state under a
   declared comparison rule?

DEC-0108 approved question 1 only. Questions 2 and 3 remain named
future gates because they require, respectively, reading stored raw response
bytes and contacting the Scottish Parliament API. Neither is implied by a
metadata audit.

## 2. Authorisation boundary

If approved, the audit may read only existing project-owned operational
metadata and service configuration. It may not create, alter or delete any
record, file, raw object, manifest, projection, account, role, schedule,
service, configuration, release or deployment.

| Allowed read-only evidence | Explicitly excluded |
| --- | --- |
| Approved DB1 route/window inventory and route registry in this repository. | Any Scottish Parliament request, including a freshness or reconciliation check. |
| Existing PostgreSQL metadata in one read-only transaction: route, capture, raw-object reference, manifest, projection, release, reconciliation and failure/exception rows. | Raw response bytes, record values, JSON payloads, exports or screenshots. |
| Filesystem metadata for declared raw-object references: existence, path containment and recorded size only. | Rehashing or opening raw objects; copying source bodies; creating a cache, fixture, export or backup. |
| Existing systemd unit/timer definitions and status for project DB1 services. | Starting, stopping, enabling, disabling, editing or reloading a service/timer. |
| Existing non-secret application/repository configuration needed to identify declared reader capabilities. | Reading secrets, environment values, credentials or unrelated VPS services. |

All results must be aggregate counts, identifiers, timestamps, route/window
labels, status values and cryptographic digests already recorded in manifests.
No source payload or personal/free-text value may enter a local file, terminal
output, documentation or chat report.

## 3. Audit questions and tests

| Area | Test | Passing evidence | Failure/gap state |
| --- | --- | --- | --- |
| Expected scope | Derive the controlled expected DB1 route/window inventory from DEC-0045, closed DB1 decisions and the active route registry. | One declared expected row per in-scope route/window; exclusions stated. | `SCOPE_GAP`, `DUPLICATE_SCOPE`, `UNDECLARED_SCOPE`. |
| Retention lineage | For each retained row, follow metadata from route/window to capture, manifest and contained raw-object reference. | Every retained release has one resolvable lineage chain and a contained object reference. | `LINEAGE_GAP`, `REFERENCE_ESCAPE`, `MULTIPLE_CURRENT_CHAINS`. |
| Manifest coherence | Compare stored manifest metadata with related capture/release metadata: source URL, method, content type, byte length, recorded digest, timestamps and run/config identity. | Declared fields agree or an explained versioned difference is recorded. | `MANIFEST_MISMATCH`, `METADATA_MISSING`, `UNEXPLAINED_VERSION_CHANGE`. |
| Projection boundary | Identify each raw response’s projection status without treating a projection as the source object. | Projection is explicitly linked, absent, rejected or deferred. | `PROJECTION_STATE_UNKNOWN`. |
| Coverage state | Compare expected rows with latest retained/reconciliation state. | Every expected row is `RETAINED`, `UPSTREAM_AVAILABILITY_MESSAGE`, `FAILED`, `UNSCHEDULED`, `PENDING`, `OUT_OF_SCOPE` or another declared state. | `UNCLASSIFIED_COVERAGE`. |
| Exception treatment | Check that known exceptions, including 2006 Committee Official Reports, are first-class retained conditions. | Exception route/window, capture date, source condition and review trigger are recorded. | `EXCEPTION_HIDDEN` or `EXCEPTION_UNTRACEABLE`. |
| Update and reconciliation control | Read declared timer/unit configuration and latest recorded reconciliation only. | Each scheduled route/window has a stated cadence, last outcome, failure treatment and next-due rule, or is visibly unscheduled. | `CADENCE_UNKNOWN`, `RECONCILIATION_UNKNOWN`, `SCHEDULE_DRIFT`. |
| Capability contract | Derive what the current backend actually serves: exact original JSON, record browsing, all-years manifest, citation/provenance, existing format downloads and unavailable states. | One machine-readable capability record per endpoint/release family; unsupported facilities marked absent. | `CAPABILITY_UNDECLARED`. |
| Taxonomy consistency | Compare retained endpoint labels with the controlled proxy subject taxonomy and endpoint description register. | Every endpoint has one declared subject and description, or a recorded gap. | `TAXONOMY_DRIFT`. |

## 4. Method and containment

1. **Repository baseline:** record the exact commit, inventory inputs and
   expected route/window rules before touching operational evidence.
2. **Read-only target preflight:** verify the selected database and service
   identifiers are the project-owned DB1 target, then stop on any ambiguity.
3. **Metadata audit:** perform a single read-only transaction and bounded
   configuration/status reads. Retain no raw object body or source response.
4. **Matrix production:** produce the coverage and lineage matrix from those
   aggregate records, preserving every gap and exception as a row.
5. **Cross-check:** compare the matrix with the current coverage snapshot and
   endpoint register; differences are findings, never silently corrected.
6. **Report and stop:** publish the resulting assurance report, capability
   contract and gap register. Do not remediate, re-run, schedule, deploy or
   contact a source in this package.

The target is stopped immediately if the named database/schema, service/unit,
raw-object root, account privilege or result boundary cannot be confirmed.
The safe rollback is simply to end the read-only session; no operational state
will have changed.

## 5. Required outputs

The package must leave a human-readable and machine-readable record, with no
source payload:

1. **GB-SCT DB1 coverage and assurance matrix** — expected versus retained
   route/window status, lineage state, reconciliation state, update state,
   exception and review trigger.
2. **GB-SCT DB1 Mirror Assurance Report** — a dated statement of exactly what
   the metadata audit establishes and does not establish.
3. **DB1 reconciliation and update-control specification** — observed
   schedules/units, comparison states, failure handling and declared next-due
   logic; it must label any control not evidenced as unknown.
4. **DB1 backend capability contract** — original JSON, browsing, all-years
   aggregation, generated formats, provenance, citation and error/availability
   features each marked `AVAILABLE`, `ABSENT`, `PARTIAL` or `UNVERIFIED`.
5. **DB1 gap register** — all discrepancies, unresolved rows, visible source
   exceptions, taxonomy drift and proposed follow-up decision.

The Research Portal may use only the accepted capability contract. It must not
derive features from temporary QA behaviour or presumed PostgreSQL capacity.

## 6. Acceptance and decision gates

The audit can receive one of three outcomes:

| Outcome | Meaning | Consequence |
| --- | --- | --- |
| `PASS_WITH_BOUNDED_GAPS` | All expected scope rows have an explicit evidence state; no unclassified lineage/coverage/control gaps remain. Known source exceptions may remain. | Owner may accept the bounded internal-assurance report and decide whether to approve a content-integrity audit. |
| `CHANGES_REQUIRED` | Evidence exists but a controlled correction is required to classify or expose it. | Stop; propose a separate correction. No hidden repair or portal feature. |
| `BLOCKED` | Target identity, read-only boundary, required evidence or report integrity cannot be established. | Stop; report the blocker without attempting an alternative target or broader access. |

Even `PASS_WITH_BOUNDED_GAPS` does **not** establish that DB1 matches the
current Scottish Parliament API. That claim requires both:

1. a separately approved stored-object integrity audit that calculates fresh
   digests over raw objects without exposing their content; and
2. a separately approved, rate-bounded live-source reconciliation design that
   specifies route/window comparisons, timing, retries, source error treatment
   and retained evidence.

## 7. Exclusions

This proposal does not authorise source contact, capture, ingestion, raw-body
inspection, database mutation, projection rebuild, schema change, timer or
service change, application code, frontend work, download generation, DB2,
chart, data playground, public access, deployment or a research release.

## 8. Dependencies and review triggers

This audit relies on DEC-0006, DEC-0008, DEC-0042, DEC-0045 and DEC-0107, and
must observe RSK-0038, RSK-0042, RSK-0045–RSK-0049. Review or replace the
proposal if the approved endpoint scope changes, a new DB1 cohort is added, a
source exception changes, route/window naming changes, or the target’s
read-only privilege cannot be demonstrated.

## 9. Owner decision requested

Approve, amend or decline the exact **metadata-only, no-source-body,
no-mutation Backend Assurance audit** described above. Approval would authorise
only the six-step method in section 4 and the outputs in section 5.
