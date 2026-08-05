# GB-SCT DB1 Official Reports 2025 cohort — DEC-0098 result

**Status:** `IMPLEMENTED — FUNCTIONAL READER ACCEPTED; ACCESS DESIGN DEFERRED`
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

The first private-reader check then exposed a separate omission: the API's
dedicated DB1 reader role had not been granted `SELECT` on D19's new release
table. That role now has that one table permission, verified by reading the
two release rows. The interface reports an in-page failure if a D19 reader
request cannot be loaded rather than failing silently.

## Boundary

These are retained operational projections, not live source responses, an
unqualified mirror, a complete proceedings record, or DB2 data. They make no
bill, stage, amendment, speaker, committee, contribution, text, date, or other
semantic claim. The raw object is not exposed.

## Private-reader acceptance and deferred access design

The owner confirmed that both fixed retained-projection readers open and page
as expected. The first reveal takes about nine seconds because the interim
reader derives its observed-structure summary by loading every record in the
named release before returning the selected page. That is functional but not
the intended final researcher-access design.

The owner directed that this performance/access issue be addressed once, after
the planned DB1 ingests are complete, in a single access-design sweep covering
precomputed structural profiles, transparency surfaces, snippets, and
download/release options. No standalone optimisation, new query, download,
DB2 variable, or access expansion is authorised by this acceptance.

## What next

Prepare the next contained DB1 ingestion proposal. Treat the current D19
reader as a functional interim interface; defer its performance and fuller
researcher-access design to the single post-ingestion access-design sweep.
