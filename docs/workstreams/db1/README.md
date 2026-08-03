# DB1 source-faithful projection workstream

**Status:** D1/D2/D3 passed; one restricted projection and private explorer accepted

## 1. Purpose and user value

DB1 is the future retained data-management layer. It will routinely reconcile
approved source routes, preserve immutable capture history, and generate a
loss-aware reproducible projection for transparent, efficient source access.
Its value is to turn the mutable, sometimes firehose-like upstream API into a
living versioned research resource with explicit capture lineage, freshness,
change, and failure records.

DB1 is not yet a proven full mirror. Until scope and parity are evidenced, it
must be described as an intended source-faithful projection.

DB1 is an independent mini-project. DB2 is a later, separate workstream that
must work within the declared DB1 record if it proceeds; DB2 does not determine
DB1 capture priorities, schema, retention, or success criteria.

## 2. Current boundary

D1 created an internal `db1` schema and one synthetic-only proof chain. D2
captured exactly one restricted source object: `/api/billtypes`, with a
manifest and raw-object digest. D3 then built one loss-aware seven-record,
zero-rejection projection from that exact object and exposed one authenticated
private preview. This remains one dated source observation, not a mirror,
data service, capture worker, generic researcher-access surface, or canonical
dataset. The completed proxy remains separate because it retains no source
response.

The current inventory and route evidence are inputs to DB1 planning, not
authority to collect data. See the [GB-SCT source-controls guide](../../data/gb-sct/README.md).

## 3. Existing evidence and design constraints

The project has an approved endpoint inventory and route-level evidence about
parameters, high volumes, handling, and limited updateability. The critical
constraints are: preserving raw bytes and manifests; explicit request windows;
route-specific handling; visible failures; no silent retry expansion;
record-to-capture lineage; and a reproducible rebuild from named captures.

High-volume annual official reports, MQA routes, and votes require especially
careful source-window, transfer, cancellation, and reconciliation design. The
[operational register](../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
and [update-signal evidence](../../data/gb-sct/GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md)
are starting constraints, not a capture authorisation.

## 4. Decision and implementation path

The [DEC-0073 DB1 plan](../../data/gb-sct/GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
is approved. It sets out the strategic product shape, routine-reconciliation model,
PostgreSQL/raw-object architecture, researcher-access product, staged execution
path, first-batch selection criteria, front-end acceptance, and stop
conditions.

The owner-approved [DEC-0075 D1 synthetic foundation](../../data/gb-sct/GB_SCT_DB1_FOUNDATION_IMPLEMENTATION_PROPOSAL_DEC0075.md)
has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_SYNTHETIC_FOUNDATION_RESULT_DEC0075_2026-08-03.md)
proves the raw-object → manifest → projection/rejection chain using only a
project-created fixture on the isolated project target. It did not request or
retain source content, schedule reconciliation, expose DB1 to a user, or
change the existing application services.

The earlier DEC-0018 plan is retained as an
[unadopted historical reference](../../archive/data/gb-sct/db1-planning/README.md),
not the governing plan.

## 5. Initial gaps and review approach

DB1 still needs a separately approved first capture slice; route-specific
source and handling basis; source-derived manifest/raw objects; a precise first
projection contract; update/reconciliation method; capture-worker access
design; and a front-end acceptance boundary. D1 defines synthetic verification
only. Every later source action must evaluate these gaps openly and specify
review triggers for source drift, failed runs, schema changes, and renewal of
source/update assumptions.

The owner-approved [D2 first-source batch](../../data/gb-sct/GB_SCT_DB1_FIRST_SOURCE_BATCH_PROPOSAL_DEC0076.md)
passed as one fixed `/api/billtypes` request. Its [result](../../data/gb-sct/GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
records the restricted raw object and manifest only: no schedule, user access,
projection, or DB2 use occurred.

The owner-approved [D3 package — DEC-0077](../../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_PROPOSAL_DEC0077.md)
has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
records the seven-record/zero-rejection source-backed projection, DB1-only
reader credential, anonymous denial, separate proxy/DB1 data pipes, and owner
private-beta acceptance. It remains a one-capture, `NOT_SCHEDULED` increment.

For a later separately approved DB1 interface, the owner has set a design
direction: use the proxy catalogue's compact, grouped, expandable layout for
consistent navigation, while keeping retained capture/projection provenance,
version, and reconciliation state visually and semantically distinct from the
proxy's live no-retention access.

The immediate next proposal is [D4A — reference-cohort reconciliation](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_PROPOSAL_DEC0078.md).
It tests daily append-only source preservation for the three small P1 reference
collections while deliberately leaving the D3 interface unchanged. A later
D4B proposal would decide whether the expanded capture/projection history is
suitable for a proxy-aligned DB1 catalogue.

D4A has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_RESULT_DEC0078_2026-08-03.md)
records an initial three-route cycle and a repaired immediate verification
cycle, with all later comparisons `UNCHANGED`; the daily timer is active. The
record also preserves a false structural-drift positive caused by JSON-object
key order, the timer pause, the code correction, and the successful corrected
verification. The next DB1 work is proposal-only D4B, not an automatic source
or interface expansion.

## 6. Detailed records

Use the [master endpoint matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md),
[retention policy](../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md),
and [capture authorisation template](../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
as current controls. Completed reconnaissance and prior planning are preserved
in the [data archive](../../archive/data/gb-sct/).
