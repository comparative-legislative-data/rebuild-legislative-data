# GB-SCT DB1 completion and researcher-access plan — DEC-0100

**Status:** `APPROVED — STAGE 1/2 COMPLETE; STAGE 3 IMPLEMENTATION IN PROGRESS`
**Date:** 4 August 2026

## Decision in brief

Close the current DB1 mirror build in two ordered stages:

1. **Evidence closure and update-model decision.** Produce an auditable
   account of the DB1 coverage actually retained, each release's lineage and
   exception state, and a route-class-specific reconciliation proposal.
2. **Researcher-access design and implementation.** After the evidence is
   accepted, replace the interim high-volume reader with a release-led,
   proxy-aligned research interface. This is a DB1 access product, not DB2.

This proposal does not approve a new source route, a re-fetch, an altered
timer, public access, generic database query, source-object browser,
download, semantic transformation, or any DB2 work. It authorises planning
and, if accepted, the named evidence-closure work only. A subsequent approval
would be required before any researcher-facing access implementation.

## Current factual baseline

The approved D20 Official Reports registry has completed its initial capture:

- 54 fixed D20 annual URLs: Committee and Plenary Official Reports for
  1999–2024 and 2026.
- D19's two 2025 URLs remain distinct and unchanged.
- All 56 route observations across D19/D20 have an `INITIAL` capture; none is
  recorded as a source failure or source-structure drift.
- D20 has 53 passing fixed releases containing **2,110,836** preserved source
  objects with zero projection rejects among those releases.
- The 2006 Committee response is retained with raw/manifest/projection
  lineage but has one `NOT_AN_OBJECT` rejection and **no release pointer**. It
  is an explicit DB1 exception, not a missing or silently corrected record.

DB1 therefore has a substantial, source-preserving retained record for the
declared included routes. It is not an unqualified complete mirror of the
Scottish Parliament, a live relay, a canonical data set, a download service,
or a research release.

## Why an ordered plan is needed

The completed initial captures make two jobs timely but materially different:

- The mirror must be able to state precisely what it retains, when it was
  observed, what is unreleased, and which routes are genuinely compared on a
  schedule.
- Researchers need a performant and comprehensible way to inspect those
  retained releases. The current D19 reader derives structural evidence by
  inspecting every retained record before serving a page, causing the known
  first-open delay. It is functional acceptance evidence, not the intended
  research product.

Combining these into an unbounded rewrite would recreate the previous drift.
The stages below make the data claims correct before expanding access.

## Stage 1 — DB1 evidence closure and update-model decision

### Deliverables

1. A final D20 result record and an updated coverage snapshot, including:
   fixed source URL, source family, annual window, capture status, manifest
   lineage, release status, projected/rejected count, and limitations for
   every D19/D20 route.
2. A clearly linked DB1 workstream narrative that tells a human what the
   mirror is, how the proxy differs, what is retained, and where the detailed
   evidence lives.
3. An exception record for 2006 Committee Official Reports: retained raw
   response, `NOT_AN_OBJECT` projection outcome, no release, no semantic
   inference, and a future review trigger. It must never be hidden by an
   aggregate success percentage.
4. A reconciliation schedule decision that separates:
   - D19 2025's existing weekly real re-fetch comparison;
   - D20 2026's proposed current-window real comparison schedule;
   - historic D20 windows, whose repeat cadence must be expressly chosen from
     measured operational cost rather than inferred from an initial capture;
   - D18's existing failure-retry timer, whose lack of successful-route
     comparison remains a separate remediation item.
5. A read-only audit of route-to-raw-to-manifest-to-projection-to-release
   lineage, reader authorisation, anonymous denial, proxy/DB1 separation, and
   active timer inventory.

### Acceptance criteria

- Every retained/released route has a named source window and verifiable
  lineage; every exception is named and visible.
- The coverage statement says **observed source windows**, never complete
  parliamentary proceedings or semantic completeness.
- No schedule is described as a comparison unless it actually re-fetches a
  successful source route and records the comparison result.
- Documentation links pass and the governance/decision/risk records agree.

### Explicit exclusions

No source request, re-capture, schedule alteration, new database route,
interface change, download, public release, semantic coding, DB2 variable, or
document collection is part of Stage 1.

## Stage 2 — researcher-access design

Stage 2 produces a concrete implementation specification, using Stage 1's
accepted evidence. It does not itself alter the production interface.

### Design requirements

- **Subject-first discovery:** retain the proxy's grouped, expandable subject
  structure; distinguish DB1 releases visibly from live proxy routes.
- **Release-first access:** each fixed source/year release states its source
  path, annual window, capture/build/reconciliation status, object/rejection
  counts, provenance, limitations, and citation guidance before records.
- **Fast structural transparency:** compute and retain structural profiles at
  projection-build time or through a bounded metadata process. Opening one
  page must not require scanning every source object merely to describe its
  keys/types.
- **Fixed, transparent selection:** pagination and declared release views are
  permitted. No user-supplied source path/year, generic SQL/query language,
  hidden filtering, join, or semantic field is permitted.
- **Research usability:** design, but do not yet promise, release-bound
  retrieval instructions/snippets for common tools (browser/curl, Python,
  R, and JavaScript), field/profile views, reproducible citation text, and
  appropriate download or release-package options. Each must preserve release
  identity, manifest/digest lineage, format limits, and the DB1/DB2 boundary.
- **Exception visibility:** unreleased/rejected inputs, including the 2006
  Committee source, appear as explicit unavailable/exceptions—not empty
  releases or misleading data products.
- **Private-beta testing:** test one DB1 data type at a time, including
  authorised access, anonymous denial, fixed-route selection, provenance
  display, pagination/performance, and the unchanged proxy boundary.

### Decisions required before implementation

The owner must approve a bounded implementation specification that selects:

1. which access modes come first (release metadata, field profiles, snippets,
   extracts/downloads, and/or package releases);
2. release formats and maximum package sizes;
3. whether extracts are generated build artefacts or on-demand bounded files;
4. caching/indexing rules that improve access without changing source objects;
5. current/historic reconciliation cadence and operational limits; and
6. the private-beta acceptance journey and review trigger.

## Stage 3 — separately approved implementation

Only after Stage 2 approval: implement the chosen DB1 access features,
validate each feature against named releases, and update documentation/results.
The implementation must remain source-preserving. It may not create DB2
variables, infer proceedings/speakers/bills/stages/amendments/votes, or turn
DB1 into a generic query/public data service.

## Governance and review

- A completion review is due after Stage 1 evidence closure.
- A design review is due before Stage 3 implementation.
- The 2006 exception, any source failure/drift, timer failure, source-schema
  change, performance regression, or proposed public/download/DB2 expansion
  triggers an immediate review.
- Repository documentation hygiene is part of each stage; the master DB1
  narrative must link to detailed evidence rather than leaving the story in a
  handover or chat record.

## Decision requested

Approve DEC-0100 to perform **Stage 1 evidence closure and Stage 2 access
design only**, on the stated boundaries. Do not approve Stage 3 interface
implementation, any re-fetch/schedule change, new source, public access,
download, DB2, or semantic interpretation until the resulting specification
is reviewed.

## What next

If approved, complete the DB1 evidence closure and return a bounded
researcher-access implementation specification for owner approval. If not,
retain the present private DB1 state and revise this proposal as directed.
