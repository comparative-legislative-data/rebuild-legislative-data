# Capture Batch Authorisation Template

**Status:** Planning template — no external request is approved by this document

**Version:** 0.1.0

**Last updated:** 31 July 2026

Use one completed, owner-approved record for each proposed source-request or
capture batch under a newly approved DB1 implementation package. The earlier
DEC-0018 plan is an archived reference, not current authority. A general
implementation approval, an approved inventory, or a completed source
assessment does not substitute for this record.

| Required field | Record |
| --- | --- |
| Batch identifier and expiry | Stable ID, owner approval date, exact expiry, and responsible role. |
| Source and exact request scope | Source ID/host, routes, methods, permitted parameters/values, period, and explicit exclusions. |
| Purpose and expected evidence | Which approved inventory/implementation question the batch addresses; no intended analytical claim unless separately approved. |
| Preconditions | Linked source assessments, route-level handling records, licence/terms evidence, and unresolved questions. |
| Request controls | Maximum requests, rate/concurrency, pagination/cursor plan, retry limit, timeout, and stop threshold. |
| Capture and manifest | Raw-byte destination class, required metadata/digest, failure-record format, capture-run/configuration identifiers. |
| Handling and retention | Raw/DB1/provenance/public-output classes, retention term, authorised access roles, and review date. |
| Schema and drift checks | Expected observed shape (or stated unknown), identifier/null/type checks, and block conditions. |
| Completion criteria | Required artefacts and `PASS`/`FAIL`/`BLOCKED` condition. |
| Containment and rollback | How to stop, restrict access, retain non-content audit evidence, and escalate. |
| Explicit prohibitions | Any route/query/public access/implementation/deployment action outside the batch. |
| Owner decision | Approval/rejection, date, scope changes, and follow-up decision required. |
