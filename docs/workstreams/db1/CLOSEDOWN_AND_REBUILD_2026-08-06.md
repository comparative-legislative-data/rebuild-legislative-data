# DB1 close-down and rebuild record

**Status:** closed; no Database mirror is currently operating
**Date:** 6 August 2026
**Scope:** GB-SCT Database mirror only

## Decision

The previous DB1 implementation has been withdrawn in full. The project database,
raw-object store, scheduled jobs, database-reader routes, experimental browser,
deployment scripts, tests and active DB1 delivery documents have been removed.
The private authentication boundary and the Live API catalogue remain in place;
they are separate products.

Git history remains the forensic record. This document is the only active
account of the withdrawn implementation. It deliberately replaces, rather than
archives, the large collection of incremental DB1 delivery packets.

## What was removed

The project-only VPS targets were removed on 6 August:

- the DB1 PostgreSQL database;
- the DB1 raw-response directory;
- all DB1 capture, reconciliation and full-scope systemd services and timers;
- DB1-specific service environment files; and
- the DB1 runner release.

The local repository no longer contains the old DB1 source, QA interface,
capture/reconciliation scripts, deployment scripts, systemd templates, tests,
or DB1 delivery-document tree. The running application will be redeployed
without Database mirror routes as part of this reset.

No other VPS service was targeted.

## Why it was withdrawn

The implementation confused two different ideas:

1. the **approved API-form inventory** — routes that may matter to the
   programme; and
2. the **response units that a mirror needs to retain**.

It then inferred large numbers of individual detail requests from records in
collection responses. That was not justified by the mirror objective, made the
capture process needlessly large, and prevented a clear completeness claim.
The associated interface exposed implementation states rather than a
researcher-first product.

The previous database and its presentation must therefore not be relied upon
as a mirror, a complete source record, or a basis for DB2.

## Non-negotiable rebuild rules

A new DB1 proposal must be simple enough for a human to audit.

1. **Capture response units, not inferred record crawls.** A collection route is
   retained as its source response; an annual route as one response per stated
   year. A parameterised or detail route is captured only when an explicit
   approved response-unit case says why.
2. **Separate scope from capture.** The long-term API inventory records what the
   programme may need. A DB1 capture register records the exact URL/window,
   expected request count, source action, expected response shape, update
   cadence and rationale.
3. **Retain exact bytes and metadata.** Each successful capture needs the source
   URL, retrieval time, HTTP status/content type, byte length, checksum and
   capture method. An upstream availability message is retained as a source
   condition, never silently omitted.
4. **Prove routine currency honestly.** A lightweight scheduled reconciliation
   compares each scheduled response with its latest retained checksum and
   records unchanged, changed, unavailable and failed states. It does not
   claim that a source has never changed outside the checked schedule.
5. **Finish backend assurance before a portal.** Any temporary UI is solely an
   ingest-test scaffold. It must be discarded before a separately designed
   research portal is built.
6. **Do not shape DB1 for DB2.** DB2 remains a later, independent variable
   workstream.

## Required next proposal

No new DB1 database, capture, schedule, interface or deployment is authorised
by this close-down record. The next proposed package must contain a
response-unit matrix for every intended initial capture, with:

| Field | Required statement |
| --- | --- |
| Source form and fixed URL/window | Exact upstream request to retain |
| Unit rationale | Why this response, rather than derived record URLs, is required |
| Expected number of requests | Small, explicit and reviewable |
| Capture and metadata method | Exact-byte retention and provenance |
| Reconciliation method | How future changed/unavailable states are recorded |
| Exclusions | Detail routes, records or transformations not being captured |

Only after owner approval of that matrix may a clean DB1 foundation be
implemented.
