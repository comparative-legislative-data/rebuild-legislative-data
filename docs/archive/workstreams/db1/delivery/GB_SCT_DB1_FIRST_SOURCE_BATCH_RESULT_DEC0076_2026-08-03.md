# GB-SCT DB1 First Source Batch Result — DEC-0076

**Status:** Passed — one restricted source capture; no projection or user access

**Version:** 1.0.0  
**Completed:** 3 August 2026  
**Authority:** DEC-0076, owner-approved on 3 August 2026

## Outcome

D2 passed. The authorised command made exactly one request:

```text
GET https://data.parliament.scot/api/billtypes
```

It returned HTTP 200 JSON. The unaltered 189-byte response is retained only as
one `RESTRICTED_PROJECT` DB1 raw object. Its manifest records SHA-256
`fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b`.

This result makes no claim about the response’s values, field meanings,
completeness, freshness, licence applicability beyond the stated handling
record, historical coverage, or analytical suitability. It is one dated
observation, not a mirror or recurring update.

## What happened

| Control | Result |
| --- | --- |
| Route/method | Only fixed `GET /api/billtypes`; no query parameter, redirect, or alternate host. |
| Request budget | One request made; no retry. |
| Transport | HTTP 200; `application/json; charset=utf-8`; 189 bytes, below the 1 MiB cap. |
| Retention | Unaltered bytes addressed by the recorded SHA-256 in project raw storage; manifest/run/route records retained in `cld_gb_sct_db1`. |
| Handling/access | `RESTRICTED_PROJECT`; no public output, relay change, DB1 API, download, projection, or researcher access. |
| Reconciliation | `NOT_SCHEDULED`; no cron, worker, daily check, or currentness/deletion claim. |
| Services/host | API and web services remained active; no restart, new listener, systemd unit, Nginx, DNS, firewall, role, or shared-host change. |

## Verification

- Local build, 19 tests, and the DB1 capability scan passed before source
  access. The scanner permits only the hard-coded D2 URL and rejects a
  scheduler, generic source client, public DB1 route, export, and DB2 path.
- The command created one `SOURCE_CAPTURE` run and one successful source
  manifest. D1’s distinct synthetic fixture remains labelled
  `SYNTHETIC_TEST_ONLY` and is not part of this source capture.
- Postflight confirmed the source route, restricted handling class, successful
  run/manifest status, byte count, and digest without inspecting the raw body.
- `/srv/cld-gb-sct` and `/srv/cld-gb-sct/raw` were restored to mode `750`; the
  project-owned DB1 raw subtree remains mode `770`.

## Remaining boundary and gaps

D2 has created a source object, not a user product. It does not establish a
source-backed DB1 projection, schema explorer, query API, preview, export,
citation interface, or public availability. It does not validate the source’s
field semantics or turn any field into a DB2 variable. No other collection,
detail endpoint, year, identifier, report, motion, vote, or session route has
been requested or captured.

The first source capture also does not establish a persistent capture-worker
credential or a repeatable schedule. Any later route or reconciliation cadence
needs its own decision and route-specific method.

## What next

The next proposed step is **D3: first source-backed DB1 projection and private
explorer proposal**. It should use this named D2 manifest only, preserve its
raw-versus-projection distinction, expose provenance/limits before content,
and require independent private-beta acceptance. D3 is not authorised by this
result.

## Related records

- [D2 proposal — DEC-0076](GB_SCT_DB1_FIRST_SOURCE_BATCH_PROPOSAL_DEC0076.md)
- [D1 foundation result — DEC-0075](GB_SCT_DB1_SYNTHETIC_FOUNDATION_RESULT_DEC0075_2026-08-03.md)
- [DB1 strategic plan — DEC-0073](../../../../workstreams/db1/STRATEGY_AND_OPERATING_MODEL.md)
- [DB1 narrative](../../../../workstreams/db1/README.md)
