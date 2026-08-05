# DEC-0105: Retained-response access and Database mirror navigation correction

**Status:** `APPROVED — OWNER-DIRECTED IMPLEMENTATION COMPLETE; PRIVATE RELEASE PENDING`

**Date:** 5 August 2026  
**Workstream:** DB1: Scottish Parliament source-preserving mirror

## Problem established by user testing

The current Database mirror selected the newest retained capture for each
source route, but only treated that capture as browsable if it had its own
operational projection. For Bill Types, the 4–5 August captures were
byte-identical to the 3 August seven-record projection and two-field profile,
but were presented as if no structured view or field guide existed.

This is an access-assembly defect, not a source-data absence or a semantic
uncertainty.

## Owner-directed correction

1. A current retained response may reuse a passing source-preserving projection
   and descriptive profile only where its raw SHA-256 digest is identical.
   The displayed capture date, source URL, manifest and raw response remain
   those of the newest retained capture.
2. A response with a new digest remains raw-accessible but is not represented
   as browsable until a separately validated source-preserving projection and
   descriptive field profile exist. This decision creates no source request,
   schedule change, semantic transformation or automatic projection job.
3. The private interface reduces the normal journey to **subject → Access
   data**. Endpoint descriptions move behind contextual help; the retained
   response’s access actions are revealed only after the user chooses Access
   data. The duplicate release-click is removed from this path.
4. Remove the catalogue's three defensive technical bullets and use Database
   mirror as the primary user-facing term.

## Boundaries and verification

The database is read only for this correction. No source bytes, manifests,
projections, profiles, schedules, permissions, API paths or capture processes
are changed. The release may update the existing application/API services only
and must preserve authenticated access and anonymous denial.

Required evidence: production build; automated tests; capability and document
checks; read-only confirmation that the latest Bill Types capture resolves to
the pre-existing passing seven-record/two-field projection by matching its raw
digest; service health; anonymous catalogue `403`.
