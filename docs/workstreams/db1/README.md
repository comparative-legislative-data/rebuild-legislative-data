# DB1 source-faithful projection workstream

**Status:** DB1 planning proposal awaiting owner review; no implementation authorised

## 1. Purpose and user value

DB1 is the future retained data-management layer. It will preserve approved
source responses with immutable manifests and generate a loss-aware,
reproducible operational projection for efficient access and later DB2 work.
Its value is to turn the mutable, sometimes firehose-like upstream API into a
versioned research resource with explicit capture lineage and failure records.

DB1 is not yet a proven full mirror. Until scope and parity are evidenced, it
must be described as an intended source-faithful projection.

## 2. Current boundary

No source response has been captured. No DB1 schema, database table, service,
or projection exists. The completed proxy does not create a DB1 precursor,
because it retains no source response.

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

The proposed [DEC-0073 DB1 plan](../../data/gb-sct/GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
now sets out the strategic product shape, staged execution path, first-batch
selection criteria, provenance/reconciliation model, front-end acceptance, and
stop conditions. It is awaiting owner review. It does not authorise source-data
requests, capture, database changes, or implementation.

The earlier DEC-0018 plan is retained as an
[unadopted historical reference](../../archive/data/gb-sct/db1-planning/README.md),
not the governing plan.

## 5. Initial gaps and review approach

DB1 still needs a defined first capture slice; route-specific source and
handling basis; manifest and raw-byte storage design; a precise projection
contract; update/reconciliation method; failure policy; verification suite;
and a front-end acceptance boundary. The future planning package must evaluate
these gaps openly and specify review triggers for source drift, failed runs,
schema changes, and renewal of source/update assumptions.

## 6. Detailed records

Use the [master endpoint matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md),
[retention policy](../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md),
and [capture authorisation template](../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
as current controls. Completed reconnaissance and prior planning are preserved
in the [data archive](../../archive/data/gb-sct/).
