# GB-SCT DB1 Institutional-Reference Cohort Proposal — DEC-0081

**Status:** Approved — implementation and owner-acceptance package authorised
**Prepared:** 3 August 2026
**Decision:** DEC-0081 approved by project owner, 3 August 2026

## 1. Decision requested

Approve D4C: capture, preserve, reconcile, and privately catalogue exactly
four source-preserving institutional-reference collections:

| Route ID | Exact route | Existing planning basis |
| --- | --- | --- |
| `gb-sct.constituencies.collection` | `/api/constituencies` | DEC-0045 P2; DEC-0063 candidate; DEC-0064 private raw-proxy acceptance |
| `gb-sct.regions.collection` | `/api/regions` | DEC-0045 P2; DEC-0063 candidate; DEC-0064 private raw-proxy acceptance |
| `gb-sct.committee-types.collection` | `/api/committeetypes` | DEC-0045 P2; DEC-0063 candidate; DEC-0064 private raw-proxy acceptance |
| `gb-sct.committee-type-links.collection` | `/api/committeetypelinks` | DEC-0045 P2; DEC-0065 candidate; DEC-0066 private raw-proxy acceptance |

This is a DB1 source-preservation proposal. It creates no DB2 variable,
interpretation of constituencies/regions/committees or their links, download,
generic query, chart, public data access, or shared-host change.

## 2. Why this is the next increment

The completed D4A/D4B package established the capture, reconciliation,
projection, reader, and transparent-catalogue pattern with three small P1
reference collections. These four bounded P2 collections extend the mirror in
a coherent institutional-reference direction while remaining separate from:

- person, party, government-role, committee-role, and membership routes with
  unresolved handling outcomes;
- Bills/formal-stage routes requiring their own handling/terms package; and
- MQA, official-report, and vote routes requiring their own high-volume/window
  programme.

The existing proxy remains the live, no-retention way to inspect the Scottish
Parliament responses. D4C would make dated, retained source observations
queryable without changing their source values or claiming semantic meaning.

## 3. Fixed source-preservation contract

For each named route only, D4C may make one serial `GET` request with no query
parameters, redirects, credentials, or retry. It must use a 20-second timeout,
one-mebibyte response cap, JSON content-type check, and top-level-array check.
It pauses five seconds between routes. A timeout, size/shape/content-type
failure, redirect, source error, or unexpected route stops that route and is
recorded as a failure; it is not retried, substituted, or silently omitted.

Each successful response creates immutable unaltered raw bytes, digest,
manifest, capture run, source route, observed structural signature, and a
loss-aware projection. The projection preserves every object/value and source
position plus operational provenance only. A non-object array element is a
visible rejection, never a filtered result. DB1 must not rename, infer,
reclassify, join, aggregate, sort semantically, fill, or otherwise transform
source data.

## 4. Reconciliation and named release

After all four initial captures and integrity checks pass, a dedicated D4C
daily 03:17 UTC-plus-offset serial timer may be enabled. It checks exactly the
four fixed route forms and records `INITIAL`, `UNCHANGED`, `CHANGED`, `FAILED`,
`PARTIAL`, `BLOCKED_BY_SOURCE_DRIFT`, or `SKIPPED_OVERLAP` as applicable.
It retains every observation; it never overwrites a prior capture.

The initial private catalogue is a fixed named release,
`gb_sct_institutional_reference_d4c_v1`, built only from the accepted initial
four manifests. Later timer observations cannot alter its records. A later
refresh requires a separately named projection/release and decision.

## 5. Private user access

The existing D4A catalogue remains immutable and available. D4C adds one fixed
authenticated response, proposed as:

`GET /db1/gb-sct/institutional-reference/d4c-v1`

Only `BETA_USER` and `SUPERUSER` accounts may read it. The screen should
extend the established compact, grouped, expandable DB1 pattern under
**Institutional reference**. Each badge must disclose retained fixed baseline,
source route, capture/manifest/digest/byte/content-type lineage, projection
build/rejection state, latest separate reconciliation signal, observed
key/type/count guide, limits, citation guidance, and preserved projection
records.

There is no raw-object route, direct SQL, free-text search, arbitrary filter,
download, proxy action, or “current/complete mirror” wording in this package.

## 6. Permissions and containment

Use a dedicated D4C writer account able to write only DB1 capture,
manifest/reconciliation, and D4C projection/release records. It must not read
the canonical database or control the proxy, D4A timer, web server, or other
host services. The existing DB1 reader receives only minimum read-only access
to the named D4C metadata/projections and no raw-object access or write grant.

The API gains no upstream client, filesystem raw-object reader, capture
credential, writer credential, timer control, or generic DB1 route. The proxy
and DB1 remain independent data pipes sharing only application authentication
and gateway infrastructure.

## 7. Acceptance and stop conditions

D4C passes only if retained evidence proves:

1. exactly the four named source routes and no query forms were requested;
2. every successful raw object has matching byte length/digest/manifest and a
   lineage-complete projection, while every failure/rejection is visible;
3. D4C projections preserve source objects/values without semantic
   transformation;
4. the dedicated writer and existing reader have the stated least-privilege
   grants; raw-object and write access are denied to the reader;
5. no D4A/proxy/raw/download/DB2/public/shared-host boundary regressed; and
6. an eligible beta user accepts the fixed D4C catalogue, while anonymous and
   guest requests are denied.

Stop and seek a new decision on source/route mismatch, transport or integrity
failure, body-cap breach, unexpected data/handling concern, broad privilege,
timer coupling, access regression, service/non-interference failure, or any
need to change the source window, cap, route list, retention/exposure class,
or claim.

## 8. Explicit exclusions

Every route outside section 1; detail routes; member/party/government/committee
role or membership material; Bills/formal stages; MQA, reports, and votes;
automatic backfill; generic query/search; download; DB2; semantic variables;
charts; research claims; public data access; and shared-host changes remain
out of scope.

## 9. Owner review questions

1. Is this four-route institutional-reference cohort the right next
   source-preserving mirror increment?
2. Is the fixed one-attempt initial capture followed by daily reconciliation,
   with a separately named fixed release, the right truthful update model?
3. Is the retained/provenance-first private catalogue boundary right before
   DB1 moves into more sensitive or high-volume routes?
4. If approved, may D4C proceed as one contained implementation,
   deployment, and owner-acceptance package under these controls?

## 10. Related records

- [DB1 strategy — DEC-0073](../../../../workstreams/db1/STRATEGY_AND_OPERATING_MODEL.md)
- [D4A reconciliation result — DEC-0078](GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_RESULT_DEC0078_2026-08-03.md)
- [D4B catalogue result — DEC-0079](GB_SCT_DB1_REFERENCE_COHORT_PROJECTION_CATALOGUE_RESULT_DEC0079_2026-08-03.md)
- [Route inventory — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [DB1 narrative](../../../../workstreams/db1/README.md)
