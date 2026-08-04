# GB-SCT DB1 Official Reports 2025 cohort — DEC-0098 result

**Status:** `IMPLEMENTED — PRIVATE READER ACCEPTANCE PENDING`
**Date:** 4 August 2026

## Result

The two approved literal 2025 source URLs were each requested once, serially,
and retained as separate DB1 source-preserving releases:

| Release | Preserved source-position records | Projection rejects | Initial state |
| --- | ---: | ---: | --- |
| Committee Official Reports 2025 | 82,017 | 0 | `INITIAL` |
| Plenary Official Reports 2025 | 31,843 | 0 | `INITIAL` |

The weekly D19 timer is enabled for Sundays at 08:15 UTC. It re-fetches both
fixed URLs serially; unlike D18, it does not skip successful releases.

## Implementation note

The first D19 service run completed raw capture and reconciliation but could
not insert the new release rows because the existing D17 runner role lacked
access to D19's new release table. The missing privilege was supplied narrowly
(`SELECT`, `INSERT` on `db1.official_reports_releases` only). The projection
phase was then run once against the already retained captures, with the
installed release identifier; it made no second source request. Both
projections passed with zero rejects.

## Boundary

These are retained operational projections, not live source responses, an
unqualified mirror, a complete proceedings record, or DB2 data. They make no
bill, stage, amendment, speaker, committee, contribution, text, date, or other
semantic claim. The raw object is not exposed.

## What next

Deploy the two fixed private-beta DB1 catalogue badges under **Official
reports**, test their paginated reader journey, and record the user-facing
acceptance. No new source route, generic query, download, or DB2 work is
proposed.
