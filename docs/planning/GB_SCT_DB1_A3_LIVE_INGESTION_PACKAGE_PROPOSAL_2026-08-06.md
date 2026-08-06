# GB-SCT DB1 A3 live-ingestion package

**Status:** approved — execution in progress; no schedule, portal or DB2 authority
**Date:** 6 August 2026  
**Depends on:** DEC-0122 and the passed [A2 foundation proof](../data/gb-sct/GB_SCT_DB1_A2_FOUNDATION_PROOF_RESULT_2026-08-06.md)

## 1. Decision requested

Approve one bounded baseline ingestion of the 117 exact Scottish Parliament
responses named in the [response-unit matrix](../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md).

This is the first time Scottish Parliament data would enter PostgreSQL. It
does not authorise a schedule, a portal, DB2, an ID crawl, a new endpoint or a
second attempt at a failed unit beyond the rules below.

## 2. Plain-English outcome

At the end of the run, every one of the 117 named source responses will have a
first-class database result:

- its exact returned bytes and matching JSON, held in PostgreSQL, when the
  source returns a usable response; or
- a recorded source/local condition when it does not.

Nothing will be silently skipped. The 25 detail/filter forms use their named
parent response in later access; the six limited detail forms remain visible
as upstream limitations. Neither group creates an extra source request.

## 3. Exact scope and limits

| Item | Approved A3 boundary if accepted |
| --- | --- |
| Source units | Exactly 117 literal URLs: 29 fixed collection routes and 88 literal annual routes. |
| Permitted host/method | `GET` to `https://data.parliament.scot` only. |
| Request construction | Read only from the checked-in 117-row registry. No returned ID, page, cursor, year or link may create another request. |
| Concurrency | Up to four non-report requests and one Official Report request at once. This avoids concurrent large-report JSONB writes in the isolated PostgreSQL service. |
| Retry | None. A source/transport result is recorded once, including 500/503 and the known 2006 Committee availability response if encountered. |
| Time | 90 seconds per ordinary response, three minutes per Official Report response, and a 90-minute hard limit for the whole run. The operational target is 20–45 minutes. A timeout becomes a visible condition and the run continues unless a hard stop applies. |
| Size | 256 MiB maximum raw body per response; 8 GiB total received-body budget. A ceiling breach stops the whole run before storing a partial body. |
| Worker containment | One transient project-only worker, under the `cld-gb-sct` OS identity, with a 1.5 GiB memory and 75% CPU ceiling. The isolated DB1 PostgreSQL service has a separate 2 GiB ceiling. No public listener or persistent service unit is created. |

The A2 large-fixture result supports testing the storage path, not a claim
about real source sizes. These deliberately cautious ceilings make the first
run finite. A source response that exceeds them is a recorded `LOCAL_LIMIT`
condition, not an absence-of-data claim.

## 4. Minimal implementation

Before the run, the worker and a single database migration will do only this:

1. add the 64 approved source-form definitions and the 117 literal response
   units to PostgreSQL from a checked-in registry;
2. preserve the final-model treatment for 25 parent-backed forms and six
   upstream-limited forms as metadata, not as requests;
3. permit the worker to read only approved units and write append-only capture,
   response, verification and shape-observation rows; and
4. create no route, download, UI, scheduler, filesystem payload store,
   generic record table or DB2 field.

For each response, the worker stores the unchanged body bytes, byte length,
SHA-256, content type, exact requested URL, times and JSONB where valid in the
same PostgreSQL row. A 2xx JSON availability message is retained as source
content. A non-2xx, timeout or other failure becomes a condition event and
does not erase an earlier good response.

## 5. Execution sequence

1. **Pre-flight:** prove the A2 database/roles are isolated; the DB1 payload
   path has no raw files; no DB1 schedule is active; the Live API/web services
   are healthy; and the database is free of prior live rows.
2. **Registry check:** direct SQL proves 64 forms, 117 units, 29 fixed and 88
   annual units before any source request.
3. **One baseline run:** execute the registry under the stated limits. The
   worker uses the two concurrency classes above; it does not wait for one
   report year before starting another compatible unit. A source condition is
   recorded and the next named unit continues. A hard stop ends the run and
   records the reason.
4. **Direct database acceptance:** query PostgreSQL—not a frontend—to prove
   that all 117 units have a result, successful bodies remain in PostgreSQL,
   hashes/byte lengths agree, and every condition is visible.
5. **Close:** publish one concise, redacted backend report. Do not schedule a
   repeat, expose a UI or claim a complete/current mirror.

## 6. Hard stops and rollback

Stop the whole run immediately if the worker attempts an unregistered URL,
tries to write a payload file, exceeds a body/total/run-time/memory ceiling,
cannot write the PostgreSQL provenance row, or affects a non-project service.

There is no automatic deletion of a successfully retained source response: it
would destroy the audit trail. The safe rollback is to stop the transient
worker, retain the recorded results/conditions, create no schedule, and return
to the owner with the exact failure. Any removal of captured source data would
need a separate owner decision.

## 7. A3 acceptance criteria

The package passes only if all are true:

1. exactly 117 and no other source URLs were attempted;
2. all 117 units have either a retained response or a visible condition;
3. every retained response can be retrieved directly from PostgreSQL with its
   raw bytes, JSONB where valid, URL, time, byte count and SHA-256;
4. database checks recompute every stored response hash and byte length;
5. no raw response payload exists outside PostgreSQL;
6. the 25 parent-backed and six limited forms remain visible in registry
   metadata without extra upstream calls; and
7. the live API and web services remain healthy.

## 8. What follows, if A3 passes

A3 does not itself create routine updating or a researcher portal. The next
proposal would be A4: bounded reconciliation, drift detection, an
overlap-prevention lock, backup/restore test, alerting and a schedule. Only
after A4 and owner backend acceptance would a separate research-portal design
begin.
