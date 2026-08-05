# GB-SCT DB1 Reference-Cohort Reconciliation Pilot — DEC-0078

**Status:** Approved — executed pass; daily timer active
**Version:** 1.0.0
**Prepared:** 3 August 2026
**Decision requested:** DEC-0078

**Decision:** Approved by the project owner on 3 August 2026. The owner also
authorised one immediate fixed-route verification cycle on 3 August rather
than waiting for the first 03:17 UTC timer event. After that cycle exposed a
false project-side structural-drift positive, a contained correction
verification used the same three-request envelope; it changed no route,
source, retention, access, or interface scope.

## 1. Decision requested

Approve D4A, a bounded DB1 reconciliation pilot for three small GB-SCT
reference collections:

| Route ID | Exact source request | Initial request budget | Scheduled request budget |
| --- | --- | --- | --- |
| `gb-sct.bill-types.collection` | `GET https://data.parliament.scot/api/billtypes` | One | One per completed daily cycle |
| `gb-sct.bill-stage-types.collection` | `GET https://data.parliament.scot/api/billstagetypes` | One | One per completed daily cycle |
| `gb-sct.sessions.collection` | `GET https://data.parliament.scot/api/sessions` | One | One per completed daily cycle |

The package makes one controlled initial run, one owner-authorised immediate
verification run, and then enables one project-owned, serial daily
reconciliation run at a fixed UTC time. Each run
would make at most these three no-query requests: no other path, parameter,
identifier, page, host, redirect target, retry, or discovery action is
permitted. The existing D3 private preview remains pinned to its named D2
capture and is not changed by this package.

This is the first test of DB1's routine source-preservation function. It does
not authorise a general importer, other route, query builder, new beta view,
download, raw-byte access, DB2 variable, chart, public release, or a claim that
the resulting cohort is a complete/current Scottish Parliament mirror.

## 2. Why this is the next DB1 slice

D1 proved the source-free foundation; D2 proved one restricted raw capture;
and D3 proved one manifest-bound projection and private provenance-first
preview. The missing DB1 capability is controlled recurrence: a later source
observation must be appended, compared with a declared prior observation, and
reported honestly as changed, unchanged, failed, partial, or blocked.

The selected cohort is deliberately small and independently useful for DB1
source preservation. Existing evidence classifies the three no-query
collections as P1 reference candidates. They do not require a user-supplied
year or identifier; their no-query collection forms were already the first
private proxy cohort. `billtypes` supplies a second observation against D2;
`billstagetypes` and `sessions` test the same controlled collection machinery
without moving into bills, person/relationship material, detail forms, or
high-volume firehoses.

The cohort is not selected to serve DB2. It makes no claim about the semantic
meaning of its fields, session boundaries, ordering, identifiers, or eventual
analytical use.

## 3. Capture-batch authorisation record

| Required field | DEC-0078 record |
| --- | --- |
| Batch ID and proposed expiry | `GB-SCT-D4A-REFERENCE-001`; expires at the first material source/handling/target deviation, or when superseded by a later owner decision. The daily schedule must be disabled if the package stops. |
| Source and exact request scope | Only the three HTTPS `GET` requests in section 1, fixed host/path, no parameters, serially. |
| Purpose and expected evidence | Prove append-only daily reconciliation for a small declared cohort: manifest/run history, raw digest comparison, capture integrity, and visible changed/unchanged/failed/partial/block state. No analytical claim. |
| Preconditions | DEC-0008 retention policy; DEC-0045 inventory; DEC-0061 reference-cohort evidence; DEC-0073 DB1 plan; DEC-0075–DEC-0077 passed results; and the existing route-level published-basis/handling evidence. |
| Request controls | Initial and immediate verification runs: maximum three requests each. Each later scheduled cycle: maximum three requests, one per named route, serial, no retry, no redirect, 20-second total timeout per request, 1 MiB body cap per response, and at least five seconds between requests. A non-2xx response, invalid/non-JSON content type, empty body, cap breach, redirect, timeout, or transport failure records that route as failed and makes no second request. |
| Capture and manifest | Store successful unaltered bytes by SHA-256 in the project DB1 raw-object path; append a manifest entry for every attempted route. An unchanged digest may reference the existing raw object but must still create a new manifest/run observation. Failed attempts retain non-content manifest/audit metadata only. |
| Handling and retention | `RESTRICTED_PROJECT` raw content and DB1 records; no new raw-byte audience. Retain according to DEC-0008 and revisit on rights, correction, withdrawal, privacy, or source-drift trigger. |
| Schema and drift checks | Require a non-empty top-level JSON array. Record observed top-level key/type signatures and compare them with the prior completed capture of the same route. A difference is `BLOCKED_BY_SOURCE_DRIFT` for any affected future projection/interface work; it is not coerced, mapped, or silently ignored. |
| Completion criteria | Passing initial and immediate verification cycles, an enabled contained schedule, and complete manifest/digest/comparison evidence. The result must show whether every route was initial, changed, unchanged, failed, partial, or blocked within its declared retrieval scope. |
| Containment and rollback | Use only the project DB1 database/raw path and the existing project application host. On a stop condition, disable only the D4A scheduler, preserve successful raw objects and non-content audit records, restrict access if required, and leave D2/D3 and other services untouched. |
| Explicit prohibitions | No additional route, query, detail endpoint, pagination, identifier/year discovery, retry, source substitution, proxy use, user-facing DB1 expansion, raw download, generic database access, DB2, chart, public release, Nginx/DNS/firewall/shared-service change, or new listener. |
| Owner decision | Pending. Approval must explicitly cover the recurring daily source requests and the isolated scheduler/resource boundary. |

## 4. Reconciliation contract

Each completed daily cycle is an observation of the three fixed route paths at
its own UTC timestamps. It is not an assertion that the source has no other
new, corrected, deleted, or historical material.

| State | Meaning in D4A | Required disclosure |
| --- | --- | --- |
| `CHANGED` | A completed route response differs in raw SHA-256 digest from the preceding completed observation of the same fixed path. | Comparison manifest IDs/times and exact route scope. |
| `UNCHANGED` | The completed route response has the same raw SHA-256 digest as the preceding completed observation of the same fixed path. | It means no difference in this completed comparison only, not “the source has not changed”. |
| `FAILED` | The route's single allowed attempt did not yield an accepted complete response. | Failure stage/reason and no claim of unchanged/deleted content. |
| `PARTIAL` | At least one cohort route completed and at least one failed or was blocked. | Per-route state; no cohort-complete assertion. |
| `BLOCKED_BY_SOURCE_DRIFT` | The route completed but its observed structural signature differs from the prior completed observation, or another package stop condition applies. | The observed difference and the blocked affected projection/interface work. |
| `SKIPPED_OVERLAP` | A D4A process already holds the project DB1 reconciliation lock, so the later attempt made no source request. | The skipped cycle record and absence of a catch-up request. |

The D4A scheduler must use a non-overlap lock. If an earlier D4A cycle is
still running, it records `SKIPPED_OVERLAP` without making source requests and
does not queue a catch-up run. That is a failure/coverage signal, not a silent
retry. The schedule begins only after a passing initial cycle and runs once per
24-hour period at **03:17 UTC** after the immediate verification cycle. Its exact timer/unit implementation
must be project-owned, constrained to this command/configuration, and leave
the current API/web services and all unrelated VPS services unchanged.

## 5. Minimal implementation boundary

The smallest proposed change is a fixed D4A capture command plus a
project-owned timer that can invoke no route other than the three named above.
It may add the minimal DB1 metadata/migration needed to represent repeated
run/manifest observations, raw-digest comparisons, per-route/cycle states,
and a non-overlap lock. It must not add a generic upstream client or accept a
route, URL, parameter, cron expression, or schedule from user input.

The command may reuse D1–D3's isolated PostgreSQL/raw-object foundation and
must run with a least-privilege project service identity. It must not use the
proxy path or its data client: the source-to-DB1 pipe remains independent of
the browser-to-proxy pipe. It must never log source response bodies, source
values, or credentials.

The existing D3 reader role and frontend are unchanged. D4A creates retained
source/capture evidence only; a later D4B proposal would decide whether and
how the cohort's multiple capture/projection states should be exposed in a
proxy-aligned DB1 catalogue.

## 6. Verification and acceptance

Before the initial source run, local verification must show that the D4A
command and timer configuration:

1. accept only the three fixed host/path pairs and reject every query, other
   path, alternate host, redirect, retry, concurrent invocation, scheduler
   frequency, or generic input;
2. enforce serial execution, timeout, body cap, no-follow redirect, and no
   payload logging;
3. append manifests without overwriting D2 or prior D4A evidence, and reuse a
   digest-addressed raw object only through a new linked manifest;
4. report the state table in section 4 without treating a failure or skipped
   cycle as unchanged; and
5. cannot expose raw bytes, broaden the DB1 reader, create a public route,
   invoke DB2 logic, or change proxy behaviour.

The project-target preflight must confirm the expected isolated DB1 target,
raw-path ownership/modes, existing API/web health, no pre-existing D4A timer,
and no impact on another service. Postflight must confirm the exact three-route
scope, manifest/raw integrity, state comparison, schedule containment,
unchanged listener/Nginx/shared-host state, and absence of a frontend/public
expansion. The final result will be `PASS`, `FAIL`, or `BLOCKED`; it will not
infer success from a timer merely being installed.

Owner acceptance is not a new browser-feature test in D4A because this package
does not alter the user-facing interface. The owner must instead review the
human-readable result, including the first two cycle outcomes and all
limitations, before any D4B explorer/catalogue proposal.

## 7. Stop conditions

Stop D4A and seek direction if a source route redirects; the response exceeds
the cap; content cannot be accepted as the expected bounded JSON collection;
route handling/terms evidence becomes inadequate; a schema drift appears;
the isolated target/permissions differ; the command needs a broader privilege;
the timer could affect another service; source content would enter logs; an
unexpected source request is needed; or the existing proxy/authentication/API
services regress. Do not substitute another route or initiate a catch-up,
backfill, generic retry, or manual data edit.

## 8. Explicit exclusions and follow-on sequence

D4A excludes `/api/bills`, formal stages, all detail routes, members,
relationships, committees, motions/questions/answers, votes, official reports,
and every route not listed in section 1. It also excludes public data access,
generic DB1 access, downloads, direct PostgreSQL researcher access, and DB2.

If D4A passes, the proposed next decision is **D4B: reference-cohort
projection/catalogue expansion**. It would decide the exact projections and a
private DB1 interface built in the same compact grouped/expandable layout as
the proxy catalogue, while foregrounding retained capture/projection lineage,
version, reconciliation state, and limitations rather than live relay access.
D4B is not authorised by this proposal.

## 9. Owner review questions

1. Is this three-route no-query reference cohort the right bounded first test
   of DB1's daily reconciliation, before bills or high-volume routes?
2. Are the no-retry, serial, 20-second, 1 MiB, five-second-spacing, and one
   request-per-route-per-day limits appropriate?
3. Is it right to retain each completed manifest observation, including an
   unchanged digest, while storing raw bytes only once per digest?
4. Is the deliberate separation of D4A data-pipe/reconciliation work from a
   later D4B interface/catalogue expansion sufficiently clear?
5. If approved, may D4A implement, run the initial cycle, enable the contained
   daily schedule, and report after its first later scheduled cycle?

## 10. Related records

- [DB1 strategic plan — DEC-0073](../../../../workstreams/db1/STRATEGY_AND_OPERATING_MODEL.md)
- [D2 first source result — DEC-0076](GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
- [D3 projection/private-preview result — DEC-0077](GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
- [Master endpoint delivery matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [Capture-batch authorisation template](../../../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
