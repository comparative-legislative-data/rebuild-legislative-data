# VPS Read-Only Inventory Authorisation Template

**Status:** Planning template — no VPS access is approved by this document

**Version:** 0.1.0

**Last updated:** 31 July 2026

Complete this record before any VPS connection or command. The owner approval
must identify the exact host and command set; it must never include credential
values. The authorised activity is metadata-only and may not read database rows
or copy file contents.

| Required field | Record |
| --- | --- |
| Authorisation ID and expiry | Stable ID, owner approval date, exact expiry, responsible role, and intended V1 report location. |
| Exact host identity | Provider/account context, hostname/IP or other unique host identifier, and stated relationship to the legacy project. |
| Access method | Named account/credential reference only (never the credential), network path, and read-only constraint. |
| Permitted commands | Exact read-only command list, arguments, target paths/services/databases, expected metadata, and output redaction rule. |
| Explicitly forbidden commands | Any shell/file/database operation that reads content, changes state, copies data, reveals secrets, restarts services, or performs deletion/provisioning. |
| Permitted legacy DB1 metadata | Engine/version, identifiers, ownership, size/table-count/schema-fingerprint limits, and backup/job references only. |
| Unrelated-workload protection | Named classes of unrelated workloads, dependency evidence required, and no-touch boundary. |
| Output handling | Approved report path, handling class, redaction, retention, and who may review it. |
| Stop conditions | Ambiguous ownership, shared dependency, credential exposure, content-read requirement, unexpected host/service, or any unlisted target. |
| Verification | Expected inventory classifications, dependency map, command/output review, and `PASS`/`FAIL`/`BLOCKED` condition. |
| Owner decision | Approval/rejection, permitted scope changes, and required next decision. |
