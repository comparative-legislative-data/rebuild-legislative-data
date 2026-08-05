# DB1 Backend Assurance evidence

This directory contains the controlled outputs of the approved DEC-0108
metadata-only audit, performed on 5 August 2026.

The audit read project DB1 metadata, raw-object references and project
unit/timer state only. It did not contact the Scottish Parliament, open a raw
response body, alter PostgreSQL, change files, or alter a service or schedule.

Read in this order:

1. [Mirror Assurance Report](GB_SCT_DB1_MIRROR_ASSURANCE_REPORT_2026-08-05.md)
2. [Coverage and assurance matrix](GB_SCT_DB1_COVERAGE_AND_ASSURANCE_MATRIX_2026-08-05.md)
3. [Gap register](GB_SCT_DB1_GAP_REGISTER_2026-08-05.md)
4. [Reconciliation and update controls](GB_SCT_DB1_RECONCILIATION_AND_UPDATE_CONTROL_2026-08-05.md)
5. [Backend capability contract](GB_SCT_DB1_BACKEND_CAPABILITY_CONTRACT_2026-08-05.md)

The outcome is `CHANGES_REQUIRED`. That is not an integrity failure: the
internal evidence chain is intact. It means the project must first create a
controlled expected-scope register and resolve the documented reconciliation
and operational-record gaps before it makes a bounded coverage/currentness
claim or begins Research Portal implementation.
