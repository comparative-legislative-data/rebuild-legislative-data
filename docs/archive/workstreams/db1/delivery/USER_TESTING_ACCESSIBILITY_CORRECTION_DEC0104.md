# DEC-0104: Database mirror user-testing accessibility correction

**Status:** `APPROVED — PRIVATELY DEPLOYED; OWNER REVIEW PENDING`

**Date:** 5 August 2026  
**Workstream:** DB1: Scottish Parliament source-preserving mirror

## Why this correction is needed

Owner testing of the privately deployed DEC-0103 workspace found that it still
read as an internal data-delivery interface rather than a research tool. The
core confusion was not the retained data or the access controls; it was the
language and the number of unexplained disclosures needed before a researcher
could understand a source and its access choices.

This is a bounded correction to the existing private web interface. It does
not reopen DB1 collection, storage, capture, reconciliation or database design.

## Approved user-facing changes

1. Refer to the product as **Database mirror** in primary interface language.
   “DB1” remains a technical identifier for governance, provenance and source
   code where needed.
2. Explain the difference from the live API in plain language: selected
   Scottish Parliament responses are retrieved on documented schedules,
   retained in PostgreSQL with their original JSON, and may differ from the
   live source between captures.
3. Give every research subject a short description before its endpoints are
   revealed, and every endpoint a one-sentence explanation before its releases
   are revealed.
4. At each retained release, state plainly that:
   - **View original JSON** and **Download original JSON** use the exact dated
     JSON retained in the Database mirror; and
   - **Open live Scottish Parliament source** leaves the mirror and opens the
     upstream API, which may have changed since capture.
5. Replace unexplained “record browser” and “object-record profile” absence
   messages with plain language. Where a structured view or field guide is not
   yet published, explain that original JSON remains available and that this is
   not an absence-of-data notice.
6. Add visible, keyboard-accessible question-mark disclosures that explain
   “structured record view” and “field guide” without putting internal delivery
   terminology into the primary reading path.

## Boundaries preserved

- No API path, backend, database, capture, raw object, manifest,
  reconciliation, schedule, access policy or source request changes.
- No source values are altered. The original retained JSON remains the
  primary research object.
- No new generic query, transformed dataset, combined download, alternative
  format, DB2 variable, chart, playground, public release, dependency or
  external service is introduced.

## Verification and next review

The correction must pass the existing production build, automated tests,
capability scan, documentation-link check and whitespace check before a
web-presentation-only release. The next owner review should follow one short
journey: subject → endpoint → retained release → view/download retained JSON →
open live source → inspect help/provenance. If that still exposes systemic
research-workflow problems, pause broad frontend iteration and commission
targeted external research-data UX/accessibility review before extending the
interface.

## Deployment record

The correction was privately deployed on 5 August 2026 from commit
`23a73e0` through the existing web-presentation path. That path created a new
web release and restarted only `cld-gb-sct-web.service`. Its remote verification
passed the production build, 33 automated tests, capability scans and B1
packaging. The two brief health-check retries occurred while the web service was
restarting; the deployment completed successfully. Read-only post-release
checks confirmed `cld-gb-sct-api.service`, `cld-gb-sct-web.service` and
`cld-gb-sct-db1-d19.timer` active, API and web health responses successful, and
unauthenticated Database mirror catalogue access still denied with `403`.
