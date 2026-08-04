# GB-SCT DB1 historical annual-window expansion — DEC-0097 result

**Status:** `IMPLEMENTED — 2026-08-04`

## Delivered scope

DB1 retains 30 source-preserving historical annual releases: the two fixed
Scottish Parliament source paths for every year 2011–2025.

- Questions: `/api/motionsquestionsanswersquestions?year=YYYY`
- Votes on motions: `/api/votesmotion?year=YYYY`

Each release has separate retained raw bytes, SHA-256 digest, manifest,
source-position lineage, projection build, and fixed private DB1 reader path.
The reader permits only server-side pagination. It does not expose a year
parameter, generic query, raw object, download, DB2 variable, or public route.

## Outcome

All 30 captures and projections completed on 2026-08-04 with zero projection
rejections. Record counts range from 5,383 to 11,664 for Questions and from
13,440 to 33,618 for Votes on motions. Each fixed DB1 reader is private-beta
only and returns `403` without an eligible session.

The catalogue presents the releases under the existing “Motions, questions,
related records and votes on motions” subject group. Users select a retained
source year and family before the corresponding page is read.

## Update and verification model

The D18 job is independent of both the direct source relay and the daily 2026
D17 annual-window job. It is enabled as a serial weekly systemd timer for
Sundays at 07:30 UTC. A run compares the closed D18 registry only; it cannot
accept a user-supplied year or source path.

## Limits and review trigger

These are fixed retained initial historical baselines, not live Scottish
Parliament responses and not an assertion that all source history is complete,
fresh, semantically interpreted, or free of later correction. Unlike D17,
there is no D18 immediate comparison claim. The first scheduled weekly run
will provide the first later route-level comparison evidence.

Review DEC-0097 after that run, or sooner if a source route fails, exceeds its
route-specific resource limit, changes its representation, or a new required
historical window is approved.

## Deployment maintenance resolution

The original D18 deployment wrapper did not provision the D18 systemd timer
unit. The active service and timer were installed and enabled directly on
2026-08-04; the next scheduled run is Sunday 2026-08-09 at 07:30 UTC. The
wrapper has been replaced with a direct, reviewable procedure that deploys the
isolated CLD application and D18 units but does not start a D18 source
reconciliation. The local D18 runner environment was provisioned from the
existing DB1 D17 annual-window runner configuration without reading or
recording secret values. This does not affect the retained releases or reader
routes.
