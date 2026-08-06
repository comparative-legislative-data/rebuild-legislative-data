# Independent Review Commission: GB-SCT Database Mirror Rebuild

**Status:** commissioned for independent review; no implementation authority

**Date:** 6 August 2026

## Purpose

Comparative Legislative Data needs an independent assessment before any third
attempt to build its Scottish Parliament Database mirror (DB1). The reviewer
does not need access to the repository, VPS or source data. This brief states
the intended product, the relevant constraints, the failures to date, and the
questions that a replacement design must answer.

The reviewer is asked for an evidence-led recommendation, not implementation
code and not a generic dashboard design. At least two viable architectural
options should be compared before making a recommendation.

## The product that is required

DB1 is a private, research-grade **PostgreSQL Database mirror** of the
approved Scottish Parliament API inventory. For every approved source
endpoint/window, Scottish Parliament API data must be ingested into PostgreSQL
and remain usable there for research access. It must not be replaced by a
filesystem collection of raw JSON files with a PostgreSQL manifest beside it.

The future researcher-facing portal is separate from DB1 implementation. It
will make the PostgreSQL-held mirror understandable and useful through raw
access, structured browsing, multiple download formats, reproducible request
examples, field guidance, provenance and clear availability reporting. The
portal must not inherit a temporary ingestion/QA interface.

The live API catalogue is already operational and separate: it is a
no-retention proxy to the Scottish Parliament API. It is not DB1 and must
remain unaffected by this review or any future DB1 work.

## Non-negotiable constraints

- PostgreSQL is the DB1 product store. Source data must be ingested into it.
- DB1 must be source-faithful: no semantic recoding, inferred facts or DB2
  variables. DB2 is a later independent workstream.
- The exact approved Scottish Parliament endpoint inventory is the long-term
  scope. The rebuild must not invent unbounded record-by-record crawling from
  collection identifiers.
- Where a source response is unavailable, malformed or otherwise exceptional,
  the database must retain a clear, queryable condition. The portal must be
  able to explain that it is an upstream condition rather than silently omit
  it.
- The system must routinely check for changes/new data and update PostgreSQL,
  with an auditable reconciliation result and bounded host resources.
- The current VPS hosts unrelated services. No Docker, broad host change or
  impact on other services is acceptable.
- The database and portal must be designed as connected but separate concerns:
  backend completeness first; researcher portal second.

## Honest account of the failed attempts

Two DB1 attempts failed to deliver the intended product.

1. **First attempt — inferred detail crawl.** A collection response was
   treated as a queue from which to infer large numbers of individual detail
   requests. This was not an agreed finite mirror scope, risked an unbounded
   crawl, and was withdrawn.
2. **Second attempt — raw-file archive presented as a database mirror.** A
   bounded set of literal upstream requests was collected, but source bodies
   were stored as raw files on the VPS. PostgreSQL held manifests, checksums
   and operational metadata, rather than the source data as a usable database
   mirror. Internal integrity/reconciliation tests passed for that design, but
   it did not meet the owner's requirement. It was therefore fully removed:
   database, role, files, schedules, units, secret, code, temporary QA UI and
   active delivery documents.

The underlying control failure was that implementation convenience and
backend QA mechanics overrode the owner’s functional requirement. The plan
and acceptance tests must prevent this recurrence.

## Questions for the independent reviewer

Please assess and recommend:

1. **PostgreSQL source-data model.** How should each source response and its
   records be represented in PostgreSQL to preserve source fidelity while
   enabling usable research access? Compare, for example, response-level JSONB
   with provenance plus record-level JSONB/relational projections. State what
   counts as transformation and how original structure is preserved.
2. **Capture and update model.** How should regular ingestion, idempotency,
   version history, updates, deletions/withdrawals and known upstream
   availability conditions work? How can the system distinguish a changed API
   response, an expected empty response, an upstream failure and a local
   failure?
3. **Mirror-equivalence evidence.** Propose a proportionate but robust audit
   that demonstrates which approved endpoint/windows are in PostgreSQL,
   whether they match the source response at a stated time, and what limits
   remain. Include schema/shape drift, checksums or canonical serialisation
   where useful, and database-level checks.
4. **Operational safety.** Recommend realistic scheduling, locking, timeout,
   retry, CPU/memory/disk controls, health reporting, backup/restore testing,
   and superuser metrics for a shared VPS. Avoid unnecessary complexity.
5. **Backend acceptance contract.** Define testable acceptance criteria that
   prove before portal work begins that PostgreSQL contains usable source data,
   the intended scope is visible, gaps are represented, updates work and a
   future portal can ask only supported questions of the database.
6. **Researcher portal implications.** Identify the backend capabilities a
   later world-class portal will need: exact source view, structured browsing,
   field profiles, filtered/bulk downloads in multiple formats, query snippets,
   provenance, citation and explanatory help. Do not design the portal itself;
   state the database contract it will require.

## Required review output

The response should contain:

1. a short diagnosis of the two failures and safeguards against repetition;
2. two or more implementable architecture options with trade-offs;
3. a preferred option and why it best fits a research-grade PostgreSQL mirror;
4. a phased delivery plan with clear stop/acceptance gates;
5. a concise data model or schema sketch;
6. a reconciliation and operational-monitoring design;
7. a list of uncertainties or decisions the owner must make before approving
   a new DB1 build.

It should use plain English where possible and distinguish essential controls
from optional future enhancements.
