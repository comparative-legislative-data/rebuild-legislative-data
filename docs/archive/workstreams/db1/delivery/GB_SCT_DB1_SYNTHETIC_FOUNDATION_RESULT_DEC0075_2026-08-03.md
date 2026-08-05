# GB-SCT DB1 Synthetic Foundation Result — DEC-0075

**Status:** Passed — synthetic-only foundation established; no source data held

**Version:** 1.0.0  
**Completed:** 3 August 2026  
**Authority:** DEC-0075, owner-approved on 3 August 2026

## Outcome

D1 passed. The isolated DB1 foundation now proves the following chain using a
project-created synthetic fixture only:

```text
synthetic bytes -> SHA-256 raw object -> capture manifest -> projection build
                -> one projected record + one visible rejection
```

The raw object is explicitly marked `SYNTHETIC_TEST_ONLY`. It is not Scottish
Parliament material, a source capture, a DB1 release, a research dataset, or a
claim about any API route, field, identifier, coverage, or update behaviour.

## What was implemented

- an internal-only `apps/api/src/db1/foundation.ts` module;
- a content-addressed raw-object writer, with SHA-256/byte-count verification
  and no overwrite of different bytes at a digest path;
- the isolated `cld_gb_sct_db1` `db1` schema, owned by
  `cld_gb_sct_migrate`, with separate source-route, run, raw-object, manifest,
  projection-build, projected-record, and rejection records;
- a synthetic runner and a capability scan that prohibit an HTTP client,
  source host, scheduler, or public DB1 route; and
- one synthetic raw-object subtree at `/srv/cld-gb-sct/raw/db1/`, returned to
  `root:cld-gb-sct` ownership after verification.

No application route was registered and no project service was restarted or
deployed. The private proxy and authentication behaviour remain unchanged.

## Verification evidence

| Check | Result |
| --- | --- |
| Local typecheck, production build, and tests | Passed: 18 tests. |
| DB1 capability scan | Passed: synthetic-only internal foundation; no source client, scheduler, or public DB1 route. |
| Isolated target preflight | Passed: `cld_gb_sct_db1` existed in the private `16-cld_gb_sct` cluster, had no `db1` schema, and the project raw parent was isolated. |
| Synthetic end-to-end run | Passed: SHA-256 `2c096bd366894df0db8fd855c71c74f9ba22f2dc850c23b6b92951ebb8dca00d`; 130 bytes; one projected record; one visible rejection. |
| Database lineage postflight | Passed: one `db1` projection build, one projected record, one rejection, and one synthetic manifest; `db1` owner is `cld_gb_sct_migrate`. |
| Isolation postflight | Passed: `cld-gb-sct-api.service` and `cld-gb-sct-web.service` remained active; `/srv/cld-gb-sct` and `/srv/cld-gb-sct/raw` were restored to mode `750`; `raw/db1` is project-owned mode `770`. |

The digest and count are evidence for the synthetic test object only. They must
never be presented as an upstream-source digest, route coverage, or freshness
statement.

## Issue and correction record

The initial implementation attempts exposed three local execution details
before the synthetic writer reached the database: the cluster uses a dedicated
Unix socket rather than the default socket; a temporary checkout must be
traversable by the PostgreSQL process; and the deliberately private project
path needs temporary execute-only traversal for that one process to reach the
named raw subtree. These were resolved without source access, service restart,
or change to another project. Both project parent modes were restored after the
run.

The outcome reinforces the intended operating model: a future capture worker
must be given a deliberately designed project-service database/raw-storage
access path. D1 does not silently turn the PostgreSQL administrative account
into that worker and does not establish an ongoing capture service.

## Gap analysis and continuing boundary

D1 proves the local evidence architecture, not DB1 as a source mirror. It does
not establish any of the following:

- suitability, terms, handling class, or retention authority for a source
  route;
- source retrieval, pagination, identifiers, fields, semantics, coverage,
  update signal, or reconciliation schedule;
- a production capture-worker credential/service arrangement;
- a DB1 API, explorer, query interface, download, schema explorer, citation
  UI, or researcher access; or
- DB2 variables, charts, exports, or research claims.

The synthetic object remains a technical test fixture. It must not be mixed
with a later authorised source batch; the first source object requires its own
new manifest/run and a separately approved capture decision.

## What next

The next proposed step is **D2: a first-source-batch proposal**. It must name
one small route and exact source window; its handling/retention basis;
request/retry/volume budget; capture/reconciliation rule; raw-object access
class; and success/failure criteria. D2 is not authorised by this result.

## Related records

- [D1 proposal — DEC-0075](GB_SCT_DB1_FOUNDATION_IMPLEMENTATION_PROPOSAL_DEC0075.md)
- [DB1 strategic plan — DEC-0073](../../../../workstreams/db1/STRATEGY_AND_OPERATING_MODEL.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
- [capture-batch authorisation template](../../../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
