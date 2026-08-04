# GB-SCT DB1 Bills Collection Cohort — DEC-0085

**Status:** Approved and executed — restricted deployment passed; owner private-beta acceptance pending
**Date:** 4 August 2026  
**Decision requested:** DEC-0085

## Decision requested

The owner approved one integrated `/api/bills` DB1 package: contained implementation,
initial capture, one immediate reconciliation check, daily reconciliation,
loss-aware projection, private researcher-facing DB1 release, and acceptance.
It used the DEC-0084 collection-only handling basis and included ordinary
implementation/deployment corrections within the stated boundary. The deployment
result is recorded in the linked result record below.

## Pre-flight and scope

| Item | Record |
| --- | --- |
| Active phase | DB1 source-preserving mirror increment; no DB2 work. |
| Authority for proposal preparation | DEC-0084, owner-approved 4 August 2026. It does not authorise execution. |
| Exact source scope | `GET https://data.parliament.scot/api/bills`, no query string, fixed host/path only. |
| Prior evidence | A previous transient, value-free observation received a JSON collection of 99,823 bytes in 452 ms. This informs a bounded proposal but is not a current source-size or availability claim. |
| Known risks | Route-specific terms/field meanings remain incomplete; source response may have changed; no source update watermark or deletion feed is established; the detail route remains blocked. |
| Containment | Existing isolated project DB1 target and application/auth gateway only; no proxy data client or route reuse; no public exposure, shared-host change, detail request, or follow-up source request. |
| Verification artefact | Capture manifests/raw digest, reconciliation/projection records, code/test results, service checks, a private user journey result, and a concise final package result. |

## One coherent delivery loop

### 1. DB1 data pipe

The worker calls the Scottish Parliament route directly. It does not call the
proxy, browser relay, or a client-provided URL. A successful response is
stored unaltered as a digest-addressed raw object with its manifest; a
loss-aware projection is built from that named manifest. DB1 then serves the
projection and provenance from PostgreSQL/project storage.

### 2. Controlled source/reconciliation contract

| Control | Contract |
| --- | --- |
| Initial run | One no-query request; no retry or redirect; 30-second total timeout; 2 MiB body ceiling; accepted JSON collection only. |
| Immediate check | One additional request after a successful initial implementation/capture result, using the same contract, to prove the comparison path without waiting for the next day. |
| Daily run | One serial request every 24 hours at a fixed project-owned UTC time. A non-overlap lock records `SKIPPED_OVERLAP`; it does not queue a catch-up request. |
| Comparison | Raw SHA-256 equality plus observed structural signature comparison, all for the same fixed route. `UNCHANGED` means only no difference in that completed request comparison. |
| States | `INITIAL`, `CHANGED`, `UNCHANGED`, `FAILED`, `PARTIAL`, `BLOCKED_BY_SOURCE_DRIFT`, `SKIPPED_OVERLAP`, or `NOT_SCHEDULED`. Failed/partial runs never imply deletion or no source change. |
| Stop conditions | Redirect, timeout, cap breach, non-JSON/non-array response, source error, unexpected shape, widened request, content logging, access/target boundary failure, or regression to an existing service. Stop the Bills worker only and preserve already valid evidence. |

### 3. Source-preserving projection and release

The projection preserves each source object/value and source position with
manifest lineage. Operational metadata may be added; source fields are not
renamed or interpreted. It is a named DB1 release—not a live proxy response,
unqualified API mirror, canonical dataset, or DB2 input claim.

### 4. Researcher-facing private access

The release appears under the existing **Bills and formal stages** subject
group, using the same compact expandable catalogue pattern as the proxy. Its
content is visibly different:

- DB1 route/capture/build/reconciliation information and limits come first;
- an observed-fields guide distinguishes structure from definitions or DB2
  variables;
- a compact, paginated retained-record view provides source-preserving
  inspection without treating source position as a substantive order; and
- the release declares its access mode as **server-side selection**. The first
  supported contract is fixed pagination and named-release inspection only;
  filter, download, snippets, and broader researcher-query capability are
  explicitly subsequent packages rather than fake API compatibility.

Access stays beta/superuser-only. The package adds no generic database API,
raw-object endpoint, public page, download, or detail-route interface.

## Acceptance

Before the first source request, verify the fixed-route client, body/timeout
limits, no-payload logs, manifest/projection handling, projection source-field
preservation, role denials, non-overlap behaviour, and no change to the proxy
contract. Before handoff, verify the exact request count, raw-object and
manifest integrity, comparison state, timer containment, API/web health, and
anonymous denial.

One eligible user then completes the DB1 journey: find Bills in the shared
subject catalogue, distinguish DB1 from the live proxy, identify source route,
capture, build, reconciliation state and limits, and inspect paginated retained
records without encountering a detail route, unqualified query, or download.

## Exclusions

`/api/bills/:id`; every other source route; source-document retrieval;
pagination discovery; DB2 variables; semantic stage/outcome logic; public
access; downloads; generic query/search; researcher SQL access; charts;
research release; and shared VPS/database/Nginx changes.

## What approval would authorise

Approval authorises the whole contained loop described above, including normal
code/deployment/test corrections that do not change the named route, source
request contract, retention/access class, service boundary, or public claim.
It does not authorise any exception to a stop condition.

## What next

Implemented and deployed on 4 August 2026. The contained source cycle passed;
the remaining step is owner private-beta acceptance of the stated DB1 journey.

## Related records

- [Bills restricted collection handling — DEC-0084](GB_SCT_BILLS_RESTRICTED_COLLECTION_HANDLING_DEC0084.md)
- [Bills collection cohort result — DEC-0085](GB_SCT_DB1_BILLS_COLLECTION_COHORT_RESULT_DEC0085_2026-08-04.md)
- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [DB1 access direction — DEC-0082](GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
- [Master route matrix — DEC-0045](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
