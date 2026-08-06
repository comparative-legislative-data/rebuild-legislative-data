# Independent Review Commission: GB-SCT Database Mirror Rebuild

**Status:** commissioned for independent review; no implementation authority

**Date:** 6 August 2026

## 1. Why we are asking for this review

Comparative Legislative Data is building research-grade infrastructure for
transparent, reproducible legislative research. The first legislature is the
Scottish Parliament (`GB-SCT`). Our ambition is that a serious researcher can
understand exactly what data is available, where it came from, when it was
obtained, how it is structured, what has and has not been transformed, and
how to reuse it.

We need independent advice before a third attempt to build our Database mirror
(`DB1`). The reviewer will not have repository, VPS or source-data access.
This brief is therefore self-contained. We are asking for a concrete,
plain-English implementation recommendation, including meaningful controls
that prevent repeat failure without turning routine development into a slow
sequence of needless micro-approvals.

This is a request for analysis and implementation options, not code, live API
testing or a generic dashboard design.

## 2. The three separate products

The programme has three connected but separate products:

| Product | Purpose | Current position |
| --- | --- | --- |
| **Live API catalogue** | Private, no-retention access to selected Scottish Parliament API routes, either through our relay or directly from the Scottish Parliament. | Built, deployed and owner-tested. |
| **Database mirror (DB1)** | A PostgreSQL-based, source-faithful mirror of the selected Scottish Parliament API data, updated on a routine schedule. | Not implemented. Two failed attempts have been fully removed. |
| **DB2 / research outputs** | Explicit Tier 1/2 variables, codebooks, charts and a data playground. | Not started. It must not shape DB1. |

The review concerns DB1 and the backend contract that a later research portal
will need. It must not treat DB2 as an immediate design target.

## 3. What has already been built and is working

### Private application and access control

The deployed site, `legislativedata.org`, is a private beta. It has an approved
user/guest boundary, application-for-access flow, superuser approval,
activation email, password setup/login/change, magic-link login and logout.
The owner has tested that end-to-end journey. Ordinary users do not see
superuser controls.

### Live API catalogue / proxy

The site exposes a private catalogue of the selected Scottish Parliament API
forms, organised by research subject. Users can inspect a fixed source-style
route and choose either:

1. **CLD no-retention relay** — an authenticated request to the fixed Scottish
   Parliament route; the response is streamed to the browser without CLD
   storing or transforming it; or
2. **Scottish Parliament API directly** — a link that leaves CLD and opens the
   equivalent official source URL.

The catalogue explains route parameters, observed response structure,
variables/elements where known, limitations, source presentation (browser JSON
or source-file download), and the difference between relay and direct access.
It is not a dataset, download service, capture or Database mirror.

The approved long-term route inventory contains **64 Scottish Parliament API
forms**, covering bills/formal stages, sessions, members/constituencies/regions,
parties/government roles, committees/committee roles, motions/questions and
votes on motions, and committee/plenary official reports. Some forms are
concrete collections; others are annual routes or parameterised/detail forms.
The upstream APIs include high-volume "firehose" routes and imperfect update
signals. The mirror must cover the approved scope through defensible,
finite capture rules; it must not manufacture an unbounded crawl by treating
identifiers in a collection response as a list of detail requests.

### Current technical stack and operating environment

- **Backend:** Node.js 24, TypeScript and Fastify.
- **Frontend:** React 19 and Vite 8, served by a small Fastify web service.
- **Database:** isolated PostgreSQL 16 cluster on the project VPS. It currently
  supports private-beta account control; it contains no DB1 source data.
- **Deployment:** native systemd services, loopback-only API/web listeners and
  Nginx; Cloudflare fronts the public domain. No Docker is used.
- **Email:** Resend is used for the private-beta account flow.
- **Operational constraint:** the VPS also runs unrelated services. DB1 must
  be isolated, bounded and non-disruptive.

We are open to changing frontend tooling if an independent reviewer has a
strong, practical reason. The present React/Vite stack is sufficient for the
working catalogue and does not itself dictate the eventual research portal.

## 4. The required DB1 product

DB1 must be a private, research-grade **PostgreSQL Database mirror** of the
approved Scottish Parliament API inventory.

For every approved endpoint/window, the Scottish Parliament API data must be
ingested and retained **in PostgreSQL**. PostgreSQL must be the product store:
it must contain the source data in a form that supports later researcher access
and database-derived downloads. A filesystem collection of raw JSON files with
only manifests/checksums in PostgreSQL is explicitly not acceptable.

DB1 must be source-faithful. It may preserve source objects/fields and
technical/provenance metadata, but it must not introduce analytical variables,
semantic recoding, inferred facts or DB2 transformations. Where the Scottish
Parliament returns an availability message, malformed response or error, DB1
must record a clear queryable source condition rather than silently omit the
route/window or pretend it contains records.

The intended benefits over the live API are:

- reliable researcher access to retained data through a conventional database;
- structured browsing and clear field/response explanation;
- full and partial downloads in useful formats;
- reproducible request examples/snippets;
- provenance, capture/reconciliation and citation information;
- a discoverable account of source gaps and limitations; and
- routine updates and a defensible statement of what the mirror contained at a
  stated date/time.

DB1 is not a substitute for the live source. The user must always be able to
understand the distinction between a current upstream API response and a
retained Database mirror response.

## 5. Honest account of the failures to date

Two DB1 attempts failed. This is not a source-data or hardware problem; it was
an implementation and control failure by the maintainer/LLM.

1. **First attempt — inferred detail crawl.** The maintainer treated collection
   responses as queues from which to infer large numbers of individual detail
   requests. That was neither a finite, agreed mirror scope nor proportionate
   to the task. It risked an unbounded crawl and was withdrawn.
2. **Second attempt — raw-file archive misrepresented as a Database mirror.**
   The maintainer then collected a bounded set of literal upstream responses,
   but stored bodies as raw files on the VPS. PostgreSQL held manifests,
   checksums and operational metadata rather than the source data as a usable
   database mirror. Internal integrity and reconciliation checks passed for
   that wrong design, but it did not meet the owner's explicit instruction to
   ingest API data into PostgreSQL. It was therefore fully removed: database,
   role, files, schedules, units, secret, code, temporary QA interface and
   active delivery documents.
3. **Frontend/control failure.** Backend QA mechanics were allowed to become a
   makeshift user interface. The resulting screens exposed cohorts, manifests,
   provisional states and internal terminology rather than delivering a
   researcher-centred tool. Incremental patches made the experience more
   complicated, not better.
4. **Planning failure.** Detailed plans and repeated checks did not hold the
   functional requirement in view. They added friction while failing to catch
   the fundamental divergence early enough.

The essential lesson is: **acceptance must test the product the owner asked
for, not merely whether a technically coherent implementation passes its own
checks.** We need a clearer, lighter control structure that makes this hard to
repeat.

## 6. Proposed delivery shape for review

We propose two strictly sequential projects. Please assess and improve this
shape rather than assuming it is correct.

### Project A — DB1 backend completeness

The objective is a complete, usable PostgreSQL mirror and its operational
proof. The temporary interface, if any, should be the smallest possible
operator/QA surface. It is not the research portal and should be removed
before portal work begins.

Proposed phases:

1. **Design contract.** Agree the exact PostgreSQL source-data model, source
   unit rules, endpoint/window inventory, fidelity rule, provenance model,
   indexing strategy, update/reconciliation behaviour, exception states,
   backup/restore approach, resource limits and acceptance tests.
2. **Backend foundation.** Create migrations, ingestion code and a limited
   source-free/synthetic proof that demonstrates that a source response is
   stored and retrievable from PostgreSQL as intended. This is a design proof,
   not a substitute for full ingestion.
3. **Full scoped ingestion.** Ingest the approved inventory using compatible
   cohorts and bounded concurrency. Do not require a separate human approval
   for every endpoint or year. Stop only if the approved source-unit model,
   expected scope or data contract changes materially.
4. **Backend assurance.** Run a complete reconciliation, verify database
   coverage and queryability, test scheduled update behaviour, test recovery
   from a representative interruption, and test backup/restore in a safe
   manner. Surface gaps/availability conditions as first-class database states.
5. **Backend acceptance.** Owner accepts or rejects an explicit backend
   capability statement. Only then may a separate research-portal design begin.

At minimum, backend acceptance should prove:

- the approved source data is actually held in PostgreSQL, not just described
  by PostgreSQL metadata;
- every intended endpoint/window is either represented or has a visible,
  queryable upstream condition;
- source structure and provenance are preserved sufficiently to explain and
  reproduce a retained response;
- normal research access patterns can be served from PostgreSQL without
  re-calling the Scottish Parliament API;
- routine reconciliation can detect/update changed or new source data and
  visibly distinguish an upstream issue from a local failure; and
- operational safety does not affect unrelated VPS services.

### Project B — independent researcher portal

Only after Project A is accepted, design and build a new frontend as a
research tool, not an operational monitor. The existing DB1 UI has been
removed and should not be reused as the design starting point.

The portal must first make DB1 simple to understand as a **mirror of raw API
data**, then make that mirror unusually useful to researchers. Likely features
include a source directory, good search/navigation, endpoint/context pages,
response/field guides, plain-language help, raw/structured views, filtered and
bulk downloads in multiple formats, reproducible API/query snippets,
provenance/citation, visible update/coverage information, and honest treatment
of missing or upstream-unavailable data. It should use current, accessible web
design rather than a dry or technical "research lab" aesthetic.

The portal may use a new frontend stack if justified, but must be designed from
the agreed backend capability contract rather than reverse-engineering the
ingestion process.

## 7. Questions for the independent reviewer

Please provide a recommendation on the following.

### A. PostgreSQL mirror architecture

1. How should source responses, source records and provenance be represented
   in PostgreSQL to balance source fidelity with useful researcher access?
   Compare plausible approaches, such as response-level JSONB plus metadata;
   response-level JSONB plus record-level JSONB; and carefully bounded
   relational projections. Explain what may count as a non-semantic,
   source-faithful transformation.
2. How should DB1 preserve/communicate the exact upstream response where JSONB
   normalisation might differ from original response bytes, without creating a
   filesystem raw-JSON archive as the product?
3. What minimal indexes, keys and database access interfaces should be part of
   DB1 from day one to support browsing, filtering and downloads later without
   prematurely designing DB2?

### B. Ingestion, update and reconciliation

4. Recommend a finite capture/update strategy for the mix of collections,
   annual routes and parameterised/detail forms. How should we treat the 64
   approved forms without an unbounded record-by-record crawl?
5. How should idempotency, version history, additions, changed records,
   withdrawals and upstream availability/error conditions work?
6. What is a proportionate, robust mirror-equivalence audit? We need evidence
   that PostgreSQL contains the intended source data at a stated point in time,
   detects later changes and explains schema/shape drift. We do not want a
   paper exercise or expensive duplicated processing that adds little value.
7. Recommend realistic schedule frequency, locking, timeouts, retries,
   CPU/memory/disk limits, health reporting, backup/restore testing and
   superuser metrics for a shared VPS.

### C. Controls and delivery discipline

8. Is the proposed Project A → Project B split right? What are the smallest
   useful gateways? We are aiming for a handful of meaningful gates, not a
   bespoke approval/check for every route, year or ordinary successful run.
9. Propose explicit success, failure and stop criteria for each gateway.
   In particular, specify how to catch early: “source data is not actually in
   PostgreSQL”, incomplete scope, accidental source transformation, unsafe
   crawl expansion, broken scheduled updates and an operator UI becoming the
   product.
10. Recommend a concise project-plan/documentation structure that a human can
    navigate: one DB1 narrative, one current implementation plan, a small set
    of durable decision/risk records, and machine-generated operational
    evidence. We do not want another accumulation of ad hoc files.

### D. Research portal contract

11. What explicit backend capabilities must Project A expose so that Project B
    can deliver a world-class research experience: multiple download formats,
    bulk/all-years access, structured browsing, field guidance, filters,
    snippets, provenance, citations and coverage/update status?
12. Is React/Vite a sound choice for that later portal, given this use case? If
    not, state a practical alternative and the specific benefit that justifies
    change.

## 8. Required review output

Please return:

1. a concise diagnosis of the failures and safeguards against recurrence;
2. at least two implementable PostgreSQL architecture options with trade-offs;
3. a preferred option and why it fits this project;
4. a simple phased plan with meaningful gateways and explicit pass/fail/stop
   criteria;
5. a schema/data-model sketch and ingestion/reconciliation outline;
6. a proportionate operations, monitoring and backup recommendation;
7. a backend capability contract for the later research portal; and
8. the small number of owner decisions that must be made before implementation.

Please distinguish essentials for a correct DB1 MVP from optional later
enhancements. Use plain English and do not assume access to the repository.
