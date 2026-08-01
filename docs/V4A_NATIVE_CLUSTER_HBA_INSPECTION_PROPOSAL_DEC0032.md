# V4A Native-Cluster HBA Inspection Proposal — DEC-0032

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0032

## Exact decision

Approve one read-only inspection of the down `16/cld_gb_sct` cluster's
effective HBA file only. DEC-0031 confirmed that its non-comment rules do not
match the expected two-rule profile, but it deliberately did not retain the
specific rule set.

The action may read, using the existing required privilege:

1. the effective `hba_file` value from the down new-cluster PostgreSQL 16
   configuration; and
2. the non-comment HBA rules from that effective file, normalised only as
   whitespace-separated fields.

It may report the resulting rule lines and a SHA-256 digest of the HBA file in
the restricted result record. It may not read any other configuration, logs,
database records, source data, secrets, application files, or existing-cluster
metadata.

## Absolute exclusions

This is inspection only. It may not edit HBA or PostgreSQL configuration,
reset/start/stop/reload any service, check another listener, create or alter a
role/database/schema/extension, or alter any path, account, Nginx, DNS,
firewall, source-data, or application resource.

## Verification and next gate

The command must emit `PASS` only if it reads the effective HBA path and
normalised non-comment rules from the named down cluster without mutation.
The restricted result must retain its exact scope and output. Any repair or
start requires a new owner-approved proposal based on that result.

## Owner decision

Approve or reject DEC-0032. Approval authorises only this new-cluster HBA
inspection and its restricted result record.
