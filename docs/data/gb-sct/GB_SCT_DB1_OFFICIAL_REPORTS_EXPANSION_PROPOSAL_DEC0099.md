# GB-SCT DB1 Official Reports expansion — DEC-0099

**Status:** `PROPOSED — OWNER APPROVAL REQUIRED`
**Date:** 4 August 2026

## Decision in brief

Approve one registry-based expansion of the existing D19 Official Reports
pipeline to every remaining annual window from **1999 through 2026**:

- `/api/orscommitteemeeting?year=YYYY`
- `/api/orsplenarymeeting?year=YYYY`

The already retained 2025 pair remains D19 and is not re-captured as part of
the initial expansion. The proposed expansion therefore contains 54 fixed
URLs: both source families for 1999–2024 and 2026. Each is a separately named
source-preserving DB1 release. There is no user-entered year, generic route,
download, DB2 transformation, bill/stage/amendment/speaker interpretation, or
change to the proxy.

## Why this is the next cohort

D19 has proved that the two annual Official Reports source families can be
captured without holding their large response bodies in application memory:
2025 retained 82,017 Committee and 31,843 Plenary source objects with zero
projection rejects. The remaining years are the same two source families and
the same fixed annual contract. They should be expanded through one closed
registry rather than a separate approval and bespoke implementation for each
year.

This advances retained source coverage while deliberately deferring the final
researcher-access product. The existing fixed-pagination reader is sufficient
for functional acceptance only; its structural-profile performance issue,
data dictionaries, snippets, extracts/downloads, and release design will be
addressed once after planned ingestion is complete.

## Proposed operating contract

1. The registry contains only the 54 literal URLs above; the code rejects all
   other years, source paths, query keys, redirects, and retries.
2. The runner processes sources serially, preserving a distinct run, raw
   object, manifest, observation, projection/rejection result, and release
   record per URL. It never retains a partial response as a successful release.
3. The D19 streaming transport, finite per-route byte/time limits, controlled
   temporary storage, digesting, and cleanup proof are reused. Any body that
   exceeds its declared limit records a failure and stops only that route; it
   does not silently enlarge the limit or substitute another request.
4. Initial capture may progress through the registry in bounded serial batches
   and is resumable by fixed route state. It does not repeat a successful
   historical route merely because an operator reruns the job.
5. Current 2026 windows receive an explicit routine comparison schedule.
   The cadence for the large historic range is recorded after the initial run
   has measured actual total duration and source sizes; it must be a real
   re-fetch comparison, not D18-style failure retry presented as reconciliation.
6. D19's existing weekly 2025 timer remains unchanged. No existing raw object,
   release, reader, timer, or proxy route is deleted or rewritten.

## Required implementation and evidence

Approval would authorise the smallest additions needed for the closed registry:
source definitions, release storage/reader registration, serial runner and
systemd schedule, a deployment procedure, and private badges under the
existing **Official reports** subject. It also requires:

- a source-free proof that the expanded registry rejects an outside year and
  cleans temporary files on an oversized body;
- verification that the API reader role has only the required D20 table/read
  access before the first private reader is exposed;
- per-route capture/projection/reconciliation evidence and a result record;
- a schedule result that separates initial baselines from any later successful
  comparison; and
- private UI checks for fixed route selection, pagination, anonymous denial,
  and proxy/DB1 separation.

## Explicit exclusions

- No change to D19's accepted 2025 releases or weekly timer.
- No final performance/access redesign during this cohort.
- No raw-object browser route, generic query, search, join, source filter,
  user-entered year, export, download, public access, or research release.
- No semantic treatment of proceedings as speeches, stages, bills, amendments,
  votes, committees, people, dates, or contributions.
- No document-based source collection, DB2, canonical variable, chart, or
  shared-host change.

## Acceptance criteria

The expansion passes only if every successful named URL has immutable raw-byte
and manifest lineage, a zero-rejection or explicitly unreleased projection,
and a distinct fixed private reader; failures and limits are visible per route.
The result must report temporal coverage as observed source windows, not a
claim of complete parliamentary proceedings. It must also record the future
post-ingestion access-design sweep as an open, separate decision.

## Decision requested

Approve DEC-0099 to implement the 54-route fixed annual Official Reports
expansion on the stated basis. This approval would not authorise any other API
family, final front-end/data-access design, or DB2 work.

## What next

If approved, implement and test the closed registry and streaming safeguards,
then run the contained serial initial capture. If not approved, retain D19 as
the only Official Reports DB1 coverage and move to a different explicitly
approved remaining source family.
