# V4A Native-Cluster HBA Inspection Proposal — DEC-0032

**Status:** Approved — inspection `PASS`; no service or configuration action occurred

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision:** DEC-0032

## Approved decision and execution outcome

The project owner approved one read-only inspection of the down `16/cld_gb_sct` cluster's
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

The inspection passed. It confirmed the effective new-cluster HBA file and its
three non-comment rules: local peer access for `postgres`, local peer access
for all local accounts, and the sole TCP rule `127.0.0.1/32` using SCRAM. No
service, configuration, database, account, network, or source-data action
occurred. The restricted result is retained as
`V4A_NATIVE_CLUSTER_HBA_INSPECTION_RESULT.md`.

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

## Decision outcome

DEC-0032 authorised only this new-cluster HBA inspection and its restricted
result record. It does not authorise a service start, database/role creation,
or any configuration change.
