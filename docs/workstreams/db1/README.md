# DB1 source-faithful projection workstream

**Status:** D1 foundation and D2 first restricted source capture passed; D3 projection/explorer proposal awaits owner review

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

D1 created an internal `db1` schema and one synthetic-only proof chain. D2 has
now captured exactly one restricted source object: `/api/billtypes`, with a
manifest and raw-object digest. It is one dated source observation, not a
mirror, projection, data service, capture worker, or researcher-access
surface. The completed proxy remains separate because it retains no source
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

The proposed [D3 package — DEC-0077](../../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_PROPOSAL_DEC0077.md)
would make the next boundary explicit: one loss-aware projection from that
named D2 manifest and one authenticated researcher preview. It excludes new
source activity, generic access, downloads, and DB2. If approved and passed,
its result—not this proposal—will establish what the first private interface
actually demonstrates.

## 6. Detailed records

Use the [master endpoint matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md),
[retention policy](../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md),
and [capture authorisation template](../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
as current controls. Completed reconnaissance and prior planning are preserved
in the [data archive](../../archive/data/gb-sct/).
