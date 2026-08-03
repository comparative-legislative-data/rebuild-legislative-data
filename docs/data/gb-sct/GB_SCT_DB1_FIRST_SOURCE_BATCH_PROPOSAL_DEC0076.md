# GB-SCT DB1 First Source Batch Proposal — DEC-0076

**Status:** Proposed for owner review — one fixed source request only

**Version:** 1.0.0  
**Prepared:** 3 August 2026  
**Decision requested:** DEC-0076

## 1. Decision requested

Approve D2: one controlled DB1 capture of the fixed Scottish Parliament
collection route:

| Batch | Exact request | Maximum source requests | Purpose |
| --- | --- | --- | --- |
| `GB-SCT-D2-001` | `GET https://data.parliament.scot/api/billtypes` | One | Prove the first real DB1 raw-capture and manifest record for a small P1 source-defined reference collection. |

Approval would also permit the minimum internal code/migration needed to make
this **one** capture possible: a fixed-host, fixed-path, one-use capture
command; an origin-class migration from D1’s synthetic-only model; and a
source-capture manifest record. It would not create a scheduler, general
ingestion client, user-facing DB1 route, download, public release, DB2
variable, chart, or any capture beyond this one named request.

The D2 execution must stop before source access if its capability, target,
handling, or verification preflight does not pass. This is a proposal, not
approval to make the request.

## 2. Why this is the first slice

`/api/billtypes` is the smallest available P1 reference candidate in existing
evidence: it is a no-query collection previously observed as seven JSON
elements with `ID` and `Name` fields. The published-basis assessment records
the Scottish Parliament Open Data portal and Copyright Licence; it requires
attribution, non-endorsement, and respect for personal-data/third-party-rights
exceptions. The prior structural observation recorded no person/contact field.

This is enough for a **restricted, one-object source-preservation test**, not a
claim that the route is complete, fresh, semantically validated, permanently
licensed for every use, or ready for public output. Bills and Formal Stages are
excluded because their handling evidence is more restrictive; Sessions is a
valid later candidate but has date-boundary uncertainty not needed for D2.

## 3. Completed action-specific handling record

| Required item | D2 record |
| --- | --- |
| Source/scope | Scottish Parliament Open Data; exactly `/api/billtypes`; one HTTPS GET; no parameters, IDs, pages, alternate host, redirect target, retry, or second request. |
| Purpose/necessity | Establish the first real raw-source object/manifests in DB1 and verify its source-preservation controls with the smallest P1 collection. No analytical claim. |
| Authority/terms | Existing published-basis result: Scottish Parliament Copyright Licence permits reuse subject to attribution, non-endorsement, personal-data, third-party-rights, and no-warranty limits. Route-by-route licence wording remains unobserved. |
| Content/risk screen | Prior structural evidence has only `ID` and `Name`; no person/contact signal observed. This is limited structural evidence, not a categorical personal-data determination. |
| Minimisation | One fixed collection, one response, one run, no query form, no history, no inferred related route. |
| Raw-capture/DB1 class | `RESTRICTED_PROJECT`: immutable bytes, manifest and later projection accessible only to authorised project operational/validation roles. |
| Public provenance/output | `PUBLIC_PROVENANCE_ONLY` may be considered only later; no source bytes, DB1 API, download, or public native access is authorised here. |
| Retention/review | Retain raw bytes while active then at least seven years after last research use, subject to any rights/terms conflict; review on source-terms, rights, privacy, correction, withdrawal, or drift trigger. |
| Correction/restriction/removal | Restrict source bytes immediately on a credible rights/privacy/correction concern; preserve a non-content audit record. No public output exists to withdraw in D2. |
| Stop condition | Any redirect, non-2xx, non-JSON, empty or over-budget response, source/rights concern, target mismatch, logging leak, unexpected field-shape break, or failed manifest/raw integrity check. |

## 4. Exact capture contract

| Control | D2 rule |
| --- | --- |
| Host/path/method | Hard-coded `https://data.parliament.scot/api/billtypes`; `GET`; no user input and no redirect following. |
| Request budget | One source request total. `Retry = 0`; failure records a failed manifest and stops. |
| Transfer | 20-second total timeout; `Accept: application/json`; response body cap 1 MiB. A cap breach stops and does not retain a partial raw object. |
| Accepted response | HTTP 2xx with JSON content type and non-empty body. This is a transport acceptance rule, not a semantic/completeness assertion. |
| Capture | Store unaltered bytes once in `/srv/cld-gb-sct/raw/db1/`, addressed by SHA-256; store request path, UTC timing, status, content type, byte count, digest, route ID, origin class, and handling class in the manifest. |
| Projection | No D2 source projection or user view. D2 may make only a structural integrity check needed to prove the raw/manifest record; D3 owns the first declared source projection/explorer. |
| Reconciliation | `NOT_SCHEDULED` after this run. D2 makes no daily/currentness/deletion claim and installs no job. |
| Logging | Never log response body, `ID`, `Name`, or credentials. Log only run ID, route ID, timing, status, byte count, digest, and stop reason. |

## 5. Minimal implementation and containment

D1 deliberately permits only `SYNTHETIC_TEST_ONLY`. D2 would make the smallest
change required for one real capture:

1. add a one-use `GB_SCT_D2_001` command with a hard-coded allowlist of the
   exact host/path above; no generic URL, route ID, query, or scheduling input;
2. migrate the DB1 origin/handling representation so a `SOURCE_CAPTURE` run is
   distinct from D1’s fixture and carries the source route/handling fields;
3. execute the command once from a temporary project-controlled release
   checkout, without registering it in the API service or systemd; and
4. return the raw directory to `root:cld-gb-sct` ownership/mode and leave both
   existing services unchanged.

The run may use the same isolated PostgreSQL cluster and project raw path
proved by D1. It must not use the access-control database, another VPS project,
developer-machine storage, a new database role, a persistent credential, or a
new service. If that one-use least-privilege execution method cannot be proved
without broadening the target, stop and request a new decision rather than
falling back to an unrestricted importer.

## 6. Verification and completion

D2 passes only if all conditions hold:

1. local tests prove the command rejects every host/path/query except the
   fixed D2 route, cannot follow redirects, caps bytes, and never exposes a
   source body in diagnostics;
2. a capability scan proves there is no scheduler, general source client, DB1
   public endpoint, export, or DB2 path;
3. VPS preflight confirms the D1 schema/raw target, expected ownership, and
   existing API/web health before mutation;
4. exactly one source request is made and exactly one successful **or failed**
   D2 manifest exists for it—never both after a retry;
5. on success, raw byte count and SHA-256 match the manifest and the stored
   object can be re-read unchanged; on failure, no partial raw bytes remain;
6. all resulting objects are restricted, and the user-facing application shows
   no DB1 data; and
7. postflight confirms no scheduler/service/port/Nginx/shared-host change and
   updates the DB1 narrative, batch result, decision register, and review log.

## 7. Explicit exclusions

- `/api/billstagetypes`, `/api/sessions`, Bills, every detail route, every
  high-volume route, and every route/query not written above.
- More than one request, retries, pagination, backfill, daily reconciliation,
  new source assessment, or changed route selection during execution.
- Source projection/explorer, raw viewing, public/native access, downloads,
  API compatibility, DB2 variables, charts, or research claims.
- A persistent capture worker, database role/credential, new systemd unit,
  Docker, Nginx/DNS/firewall change, or impact on another VPS service.

## 8. Owner review questions

1. Is `/api/billtypes` the right deliberately small first real DB1 source
   object, given the existing evidence and restrictive access class?
2. Are the one-request/no-retry/1 MiB/20-second limits appropriately strict?
3. Is the D2 decision correctly limited to raw capture/manifest verification,
   leaving source projection and all user access to D3?
4. Is the one-use, fixed-path command preferable to creating a generic or
   scheduled ingestion service at this stage?
5. If approved, should D2 proceed as this one bounded implementation/capture
   package?

## 9. Evidence

- [D1 synthetic foundation result — DEC-0075](GB_SCT_DB1_SYNTHETIC_FOUNDATION_RESULT_DEC0075_2026-08-03.md)
- [reference cohort qualification result — DEC-0061](../../archive/data/gb-sct/proxy-mvp/GB_SCT_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md)
- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [retention policy — DEC-0008](RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md)
- [endpoint matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [capture-batch authorisation template](CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
