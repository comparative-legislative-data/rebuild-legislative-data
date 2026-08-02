# Private-Beta Runtime and Cutover Stop Result

**Status:** `BLOCKED` — deployment stopped before usable access activation

**Date:** 2 August 2026

**Authorising decision:** DEC-0059

## Outcome

The first execution stopped at the access-control database-schema gate. A
script defect created an empty `access_control` schema in the default
`postgres` database rather than the isolated canonical database. The next
statement detected the mismatch and stopped the script before migration,
release installation, service replacement, bootstrap email, or Nginx cutover.

## Containment evidence

| Check | Result |
| --- | --- |
| Unexpected schema | `postgres.access_control` exists and has zero relations. |
| Intended canonical schema | Absent. No access-control table, account, session, token, or application record was created. |
| Project services | Existing API and web services remain active. |
| Project listeners | API 3210, web 3220, and isolated PostgreSQL 5434 remain loopback-only. |
| Named site | The pre-existing Nginx site file was restored; the public 502 condition remains. |
| Excluded resources | No source/API request, source data, DB1, DB2, email delivery, new release, or public data route occurred. |

The two intended cluster-wide access login roles and canonical-database connect
grants were created before the detection. They cannot reach an access-control
schema because no such schema exists in the canonical database, and no service
secret file was installed.

## Required correction

Owner approval is required to drop the verified-empty accidental schema from
the default database, fix the named database target in the deployment script,
and repeat the unchanged DEC-0059 package.
