# DEC-0013: Bounded API-Catalogue Reconnaissance Authorization

**Status:** Approved

**Date:** 31 July 2026
**Authority:** Project owner

## 1. Approved target and purpose

The permitted target is the owner-nominated Scottish Parliament API catalogue:

`https://data.parliament.scot/#/api-list`

The purpose is to identify candidate API groups and their stated scope for a
future bill-related research slice. This is source reconnaissance, not source
capture or a determination that any listed endpoint is suitable for use.

## 2. Permitted activity

The maintainer may, once, inspect the rendered catalogue page and only its
visible, same-host documentation navigation necessary to identify the listed
API groups and their stated descriptions. The assessment may retain a concise
written record of observed catalogue/documentation statements, the page URL,
and the inspection time in UTC.

## 3. Explicit prohibitions

This authorisation does not permit:

- direct requests to a listed API endpoint, including tests, sample queries,
  pagination, enumeration, or downloading;
- saving raw response bytes, source-data capture, parsing, ingestion, or
  publication;
- credentials, authenticated access, VPS/database access, code, infrastructure,
  or deployment; or
- a conclusion that an API, field, endpoint, data value, or future Tier 1/2
  variable is suitable, complete, or verified.

## 4. Working scope hypothesis

The owner has identified bill-related information as the intended research
direction: bills, sessions, MSPs, official reports, motions, and related
material. Petitions are presently outside the intended first slice. The motion,
motion-answer, plenary official-report, and committee official-report API groups
are retained as future-scope candidates because they may be high-volume and may
not expose bill linkage sufficient for initial `NATIVE_DIRECT` or
`DERIVED_DETERMINISTIC` use.

These are owner-provided working hypotheses, not observed catalogue facts. The
reconnaissance record must confirm, revise, or leave each item unresolved.

## 5. Stop conditions and output

Stop and record `BLOCKED` if navigation requires a direct endpoint request,
authentication, a download, an off-host target, or an action not listed above.

The sole output is a completed assessment record that categorises API groups as
candidate first-slice, candidate future-scope, outside initial scope, or
unresolved. No next action is authorised by that record. A completed DEC-0007
source-slice proposal remains required before any capture proposal.
