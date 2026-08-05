# DB1 Full-Scope Ingestion Implementation Package — DEC-0112

**Status:** Proposed — owner approval required before execution.

**Decision requested:** Authorise one bounded implementation package that
extends the existing isolated GB-SCT DB1 service, captures the 35 remaining
approved source forms, and records their recurring reconciliation controls.
It delivers the data layer only. It does not implement or deploy a Research
Portal, alter the live API catalogue/proxy, create DB2 variables, or publish
data.

## 1. Why one package

DEC-0111 is approved: DB1 must reach the approved 64-form scope before further
Backend Assurance or Research Portal work. The outstanding work belongs to one
data-pipe programme, not to 35 separate product features. This package groups
it into four capture runs and one closure record, with a common raw-retention,
manifest and update-control model.

The existing 29 forms/113 route-windows remain untouched. New records are
additive. DB1 reads the Scottish Parliament API directly; it neither reads
from nor writes to the no-retention proxy.

```text
Scottish Parliament API  ──direct capture──>  DB1 raw archive + PostgreSQL evidence
Scottish Parliament API  ──separate path───>  Live API catalogue / no-retention relay
```

## 2. Exact authorised boundary if approved

### Project-owned targets only

- Application repository and the existing GB-SCT DB1 application service.
- Isolated PostgreSQL cluster/service `cld_gb_sct`, database `cld_gb_sct_db1`,
  schema `db1`.
- Project raw-object root `/srv/cld-gb-sct/raw/db1`.
- New project-owned DB1 service/timer units only.
- Direct public `https://data.parliament.scot` requests for the forms listed
  in section 4, from the VPS into DB1 only.

No shared PostgreSQL cluster, unrelated database, unrelated service, host-wide
configuration, Nginx configuration, Cloudflare setting, proxy route,
authentication setting or public endpoint may be changed.

### Permitted write classes

1. Application code and tests implementing the generic full-scope capture
   runner, bounded streaming and reconciliation controls.
2. Additive DB1 migrations for source-form, input-universe and source-condition
   evidence; existing raw objects, manifests and projections are never edited
   in place or deleted.
3. New DB1 raw objects, capture manifests, run/route records, operational
   preserved-record projections and reconciliation observations.
4. New project-owned service/timer unit files and their enablement after the
   named initial capture succeeds.
5. Restricted operational reports containing counts, route/form identifiers,
   timing, hashes, byte lengths, status and exception codes—but never source
   payload values, identifiers, free text or raw response excerpts.

## 3. Required backend additions before capture

The existing DB1 schema is strong for fixed source routes but has no durable
way to state which literal inputs make a detail/filter form complete. The
implementation adds the following operational metadata. These are DB1 lineage
records, not DB2 variables or a semantic codebook.

| Record | Purpose |
| --- | --- |
| `db1.source_forms` | One row for every 64 approved route form: stable form ID, exact route template, request method, handling class and source-form status. |
| `db1.capture_universes` | A versioned, named set of literal inputs for a detail/filter form, including the parent manifest(s), mechanical extraction-rule revision, candidate count and status. |
| `db1.capture_universe_members` | One durable member per literal source request, tied to its universe and source-route record. It stores the required literal request binding as source lineage, not a DB2 field. |
| `db1.source_conditions` | First-class source conditions such as availability message, HTTP error, unresolved contract, timeout or incomplete transfer. A condition is never converted to zero records. |
| `db1.form_update_controls` | Per-form reconciliation cadence, last successful cycle, next due condition, and failure/retry state. |

`db1.source_routes`, `capture_runs`, `raw_objects`, `manifest_entries`,
`projection_builds` and `reconciliation_observations` remain the authoritative
capture chain. The additions join to them; they do not replace them.

The code must use one generic capture primitive for all new forms:

- streamed raw-object storage with a SHA-256 digest;
- source method/path/query and non-secret transport metadata in the manifest;
- explicit status for success, source availability, HTTP error, malformed
  response, timeout, size cap, retry exhaustion and schema/contract drift;
- append-only evidence; and
- an operational projection only when needed for mechanical universe
  derivation or retained-record access, with every row linked to its manifest.

If a source returns a body with an availability/error condition inside the
declared retention boundary, DB1 retains that body and labels its condition. If
no source body was received, DB1 records the failed attempt without inventing
one.

## 4. Source forms and capture order

All source routes are fixed by DEC-0045. `:id` and `:value` below mean literal
inputs from a versioned DB1 capture universe; they never mean an open user
query or guessed numeric range.

### Run A — parent-derived reference and institutional details

Use the current retained parent collections to construct a finite literal-ID
universe, then capture each requested detail response.

| Forms |
| --- |
| `/api/bills/:id`; `/api/billstages/:id`; `/api/billstagetypes/:id`; `/api/billtypes/:id`; `/api/sessions/:id` |
| `/api/members/:id`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses/:id`; `/api/constituencies/:id`; `/api/regions/:id` |
| `/api/parties/:id`; `/api/memberparties/:id`; `/api/partyroles/:id`; `/api/memberpartyroles/:id`; `/api/governmentroles/:id`; `/api/membergovernmentroles/:id` |
| `/api/committees/:id`; `/api/committeeroles/:id`; `/api/committeetypes/:id`; `/api/motionsquestionsanswerseventtypes/:id`; `/api/motionsquestionsanswerseventsubtypes/:id` |

The runner first writes the universe and its candidate count, then makes the
detail requests. Bills detail is a normal member of this run. The historic
early handling record is retained in the archive, but is not an operational
precondition; only an actual source/technical condition may stop it.

### Run B — whole-history MQA source collections

Capture these fixed, unfiltered collection forms once, through a streaming
writer into the DB1 raw store:

| Forms |
| --- |
| `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswersmotions`; `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswerssupports` |

These are known potential firehoses. The runner must not load an entire
response body into process memory, assume pagination, truncate a response or
turn a transfer failure into an empty collection. It first confirms project
raw-store/database headroom and records the limit used. It stops only the
affected form if the declared size or elapsed-time cap is reached.

### Run C — MQA dependent detail and event-link forms

After Run B, derive literal inputs only from the named Run-B collection
manifest(s) and the existing retained MQA event-links collection. Capture:

| Forms |
| --- |
| `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswersmotions/:id`; `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswerssupports/:id` |
| `/api/motionsquestionsanswerseventlinks?childUniqueId=:value`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:value`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:value` |

The three event-link filters remain three distinct source forms. A request
record identifies which literal parameter name was used; it makes no claim
that the parameter expresses a substantive relationship direction.

### Run D — Official Reports and votes detail forms

Use literal identifiers from the named retained annual Report/Votes manifests,
with a bounded contract confirmation before broad capture:

| Forms |
| --- |
| `/api/Orscommitteemeeting/:id`; `/api/orsplenarymeeting/:id`; `/api/votesmotion/:id` |

The contract confirmation uses a small deterministic sample selected by a
documented positional rule from each parent universe. It records response
condition and shape only in operational evidence; no source body or identifier
is placed in repository documentation or terminal output. If the known HTTP
200 empty-object response persists, it is retained and reported as that source
condition—not “no historical records”. If the form accepts the parent-derived
binding, the full literal universe proceeds in the same run. If it does not,
the form stops as `CONTRACT_UNRESOLVED` with preserved evidence and becomes a
named exception for owner direction.

## 5. Execution sequence

### Step 0 — contained preflight and deployment

1. Confirm the named DB1 cluster, database, schema, raw root and current
   project service/unit identity; inspect no unrelated workload data.
2. Check free space and project process limits sufficient for the declared
   worst-case Run-B stream plus the existing DB1 holdings. Do not change
   resource limits.
3. Build and run the full local test suite; deploy only the project API/DB1
   capture code through the existing isolated release path.
4. Apply additive migrations with the project migration role; verify schema
   migration identity and DB1 grants.
5. Create the 64-form source-form register and record the compact
   legacy-control reconciliation. This is one table of historical-context
   status, not a new approval loop.

No Scottish Parliament request is made until all five preflight checks pass.

### Step 1 — build and freeze input universes

For Run A, read only the named current DB1 raw/projection evidence and create
the associated capture-universe records. For Runs C/D, create an unbound
universe template which binds only to the immediately preceding Run-B or annual
parent manifests after that capture is complete.

The runner reports only counts and form status. A universe may be used only if
it is finite, deduplicated, linked to its parents and internally consistent.

### Step 2 — initial source retention

Run A, then B, then C, then D. Collection/firehose requests run serially;
parent-derived detail/filter requests may use at most four concurrent workers.
On a source `429`, network failure or server error, the affected worker follows
the source `Retry-After` value where supplied, otherwise bounded back-off; it
records retry exhaustion rather than retrying indefinitely.

Each run produces an additive form-level result report: candidate count,
attempted count, successful capture count, availability/error/contract count,
bytes, duration, raw/manifest linkage result and stopped forms. It does not
print source payloads or identifiers.

### Step 3 — activate the maintenance control

After a successful initial run, install one project-owned
`cld-gb-sct-db1-fullscope-reconcile` service/timer. It runs daily and:

1. compares the fixed collection/annual parent forms with their prior retained
   captures;
2. re-derives each dependent input universe when its parent changed;
3. captures new universe members immediately;
4. performs a rolling full refresh of existing detail/filter members at least
   weekly; and
5. records an explicit next-due state for every form.

This provides daily detection of new source material while retaining a declared
full-family recheck. It does not claim instantaneous or continuous parity.
The existing DB1 timers remain in place until this new control has produced a
recorded successful run for their applicable forms; no existing timer is
silently removed or repurposed.

`2006` Committee Official Reports remains a named upstream availability
condition. The full-scope control schedules its weekly recheck separately and
preserves both the earlier and later conditions.

### Step 4 — source-coverage closure

Generate one restricted DB1 full-scope coverage record. It must show all 64
forms, their latest capture/condition, input-universe version where relevant,
latest reconciliation state and next-due control. It may say that DB1 has
retained a named result/condition for the controlled scope as of its stated
time. It must not claim byte-integrity verification, live parity, analytical
semantics, DB2 completeness or public readiness.

## 6. Stop conditions and recovery

Stop the affected form/run, preserve its evidence and report it for direction
if any of these occurs:

- project capacity is below the declared Run-B requirement;
- a source form contract or required literal binding cannot be established;
- a source response exceeds its declared cap, times out or signals rate
  restriction beyond the bounded retry policy;
- a raw object, manifest, universe member or reconciliation record cannot be
  written atomically;
- a response has an incompatible structural condition that the runner cannot
  retain without silent coercion; or
- any target is not the named isolated project DB1 resource.

Stopping one form does not roll back successful capture evidence, alter the
proxy, touch another VPS workload or prevent later independent forms from
continuing when their dependency is intact. It also does not erase the form
from the final coverage record.

Database migrations are additive. Rollback is the removal/disablement of the
new project release and timer; retained raw objects, manifests and source
conditions remain evidence and are not deleted to simulate a clean state.

## 7. Verification and acceptance

The package passes only if all of the following are retained in restricted
records:

1. local build, test and migration verification pass before source contact;
2. all 64 source forms are registered exactly once, and each detail/filter
   form has a reproducible input-universe record;
3. every successful source response resolves through a manifest and raw-object
   record; every unsuccessful source attempt has an explicit condition;
4. no source form has been silently represented by another form, and no
   availability/error condition is represented as empty data;
5. the full-scope coverage record reconciles its 64-form inventory,
   candidate/attempt/result totals and named exceptions; and
6. the new daily update control is enabled only after successful initial
   capture and produces a recorded first outcome.

The immediate next decision after this package is **not** Research Portal work.
It is a read-only Backend Assurance closure/audit against the completed
64-form backend, followed by an independent Research Portal proposal if that
audit is accepted.

## 8. Exclusions

- No proxy/live API catalogue feature, cache or source-request sharing.
- No frontend work, deployment of a new user interface, download format or
  public data release.
- No DB2 variables, joins, analytic transformations, charts or playground.
- No document-source ingestion, OCR or bill-amendment extraction.
- No generic user-supplied route/ID querying or SQL/OData interface.
- No deletion or replacement of existing DB1 evidence.

## 9. Owner approval requested

Approve, amend or decline this single **DEC-0112 full-scope DB1 ingestion
implementation package**. Approval authorises only the stated project targets,
source forms, additive DB1 code/schema/raw-evidence writes, project-owned
schedule and restricted result records. Any new source family, different data
target, capacity/resource-limit change, shared-service touch, public access or
DB2/frontend scope requires a new decision.
