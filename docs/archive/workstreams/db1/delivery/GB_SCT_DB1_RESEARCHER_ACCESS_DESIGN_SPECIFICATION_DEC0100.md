# GB-SCT DB1 researcher-access design specification — DEC-0100

**Status:** `APPROVED — STAGE 3 IMPLEMENTATION IN PROGRESS`
**Date:** 4 August 2026

## Product objective

Make each retained DB1 release understandable and reproducible without
pretending it is DB2 or a live proxy response. The interface must make it
easier to discover source windows, inspect provenance and structure, retrieve
a named release, and cite it correctly than the upstream API alone.

## Recommended implementation order

1. **Release catalogue and provenance panel.** Proxy-aligned subject groups;
   fixed release cards; source URL/window; capture/build/reconciliation state;
   object/rejection count; limitations; citation text; explicit exception card.
2. **Bounded structural profile.** Generate per-build key/type/profile
   metadata during projection or a controlled metadata build. Do not scan all
   retained records when a user opens a paginated page.
3. **Fixed release access and snippets.** Retain server-side pagination and
   add reproducible release-identity examples for browser/curl, Python, R and
   JavaScript. No user-entered source path/year or generic query language.
4. **Release packages/downloads.** Decide and test immutable release-bound
   JSON/JSONL first; consider CSV only where flattening limits are prominent;
   consider Parquet for large packages. Every package must expose release ID,
   manifest/digest, format/schema limits, retrieval time, and citation text.

## Non-negotiable controls

- A package/export is a named DB1 release, never a mutable live response or
  DB2 canonical dataset.
- No semantic rename, join, filter, inferred variable, or analytic field.
- The 2006 Committee exception is a visible unavailable/rejected release,
  never an empty download.
- Access stays private beta until separately approved otherwise.
- Each feature is tested one data type at a time: authorised access, anonymous
  denial, release identity, provenance display, performance, and proxy/DB1
  separation.

## Approved first implementation package

The owner approved a narrow Stage 3 package on 4 August 2026:

- Official Reports are the first researcher-access family.
- Structural profiles are stored against named projection builds and backfilled
  under a controlled metadata build; the reader must not rescan every record
  to describe a release.
- The catalogue exposes fixed release identity, capture/projection provenance,
  and reproducible fixed retrieval examples. It does not add a user-entered
  year/path field or a generic query language.
- A single private-beta JSONL download pilot is provided for the named 2026
  Plenary Official Reports release. Each line is an explicit DB1 envelope
  containing `source_position` and `preserved_record`; it is a fixed retained
  projection, not the upstream raw object, an inferred table, or DB2.
- CSV and Parquet remain deliberately deferred until their flattening/schema
  rules can be separately defined and tested. No source re-fetch, schedule
  change, DB2 logic, semantic transformation, public access, or new upstream
  route is included.
