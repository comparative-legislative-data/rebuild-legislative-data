# GB-SCT DB1 First Projection and Private Explorer Proposal — DEC-0077

**Status:** Proposed — owner approval required  
**Version:** 1.0.0  
**Prepared:** 3 August 2026  
**Decision requested:** DEC-0077

## 1. Decision requested

Approve one contained **D3 DB1 projection and private-explorer package**. It
would build a loss-aware operational projection from exactly one existing DB1
raw object: the D2 `/api/billtypes` capture named below. It would then expose
that one projection to signed-in private-beta users through a fixed, read-only
application view and API contract.

Approval would authorise only the following:

- read the already retained D2 raw object identified by its manifest and digest;
- add a manifest-bound DB1 projection build, records, structural observation,
  tests, and verification artefacts;
- create one least-privilege, project-database **read-only** role and provide
  its non-secret configuration reference to the existing project API service;
- add one authenticated, fixed DB1 API response and one private-beta
  `DB1 preview` application view; and
- release only the existing project API and web services after the stated
  checks pass, then retain an independent private-beta acceptance result.

It does **not** authorise another source request, an alternative route,
re-capture, retry, scheduled reconciliation, raw-object download, generic DB1
browser or SQL access, export, DB2 variable, chart, public data access, new
listener, new service, shared-host setting, or change to another project.

## 2. Named input and controlled output

The sole permitted data input is the D2 capture:

| Control | Fixed D3 value |
| --- | --- |
| Source route | `gb-sct.bill-types.collection` — `GET https://data.parliament.scot/api/billtypes` |
| Input manifest | `1b13985f-1efb-48c4-ae56-caafc4d113df` |
| Capture run | `76a2428f-0c7c-4839-bc5a-2904df805132` |
| Raw object digest | `fad9e9fd1a754504e63e18d2057d6b43db5125f79d710e5847b496bdce99014b` |
| Handling/access class | `RESTRICTED_PROJECT` |
| Reconciliation state | `NOT_SCHEDULED` |
| Projection name | `gb_sct_bill_types_d2_v1` |

D3 must first confirm that the manifest, run, route, digest, byte count, raw
path, handling class, and `SOURCE_CAPTURE` origin exactly match this table. A
missing, mismatched, unsafe, or unreadable object is a stop. D3 must not
substitute a different manifest or fetch the source again.

## 3. Why this is the right, small next step

D2 proved a single retained source observation. D3 tests the next distinct
layer: whether a researcher can inspect a useful database representation while
continuing to see exactly what it is, where it came from, and what has *not*
been established. It is intentionally one route, one capture, one projection,
and one private screen—not a claim that DB1 is now a Scottish Parliament mirror.

This package supplies a meaningful user test for the project’s research-grade
ambition without confusing DB1 with the no-retention proxy or DB2. The proxy
opens a mutable upstream response. D3 displays a retained, dated DB1
projection with explicit capture lineage. Neither makes fields into canonical
variables or asserts source completeness, freshness, or semantic meaning.

## 4. Projection contract

### 4.1 Loss-aware representation

D3 will read and validate only the named raw bytes. It will require a JSON
top-level array. Each top-level JSON object becomes one projection record with:

- the stable projection-build and input-manifest identifiers;
- `source_position`, preserving the zero-based array position;
- an unchanged JSON representation of the complete top-level object; and
- no added analytical field, category, value mapping, or source-field rename.

A non-object array item, malformed JSON, digest mismatch, or other parse
failure becomes a linked projection rejection with a reason code. It must not
be silently omitted or repaired. The build must retain actual record and
rejection counts and a reproducibility/integrity status.

The earlier non-retentive reconnaissance observation suggested source fields
named `ID` and `Name`. D3 may show those keys only if they are actually derived
from this named projection. It must label them **observed structure**, not a
semantic codebook, source definition, DB2 variable, identifier interpretation,
or completeness claim. D3 must not create typed `id` or `name` analytical
columns.

### 4.2 Build provenance

The build record will state, at minimum:

- a generated projection-build identifier and exact projection name/version;
- input manifest, source route, run, retrieval timestamp, handling class,
  raw-object digest, content type, and byte count;
- projection schema version and repository code revision;
- build timestamp, actual record/rejection counts, and integrity result;
- the source reconciliation state `NOT_SCHEDULED`; and
- the raw-versus-projection distinction and source limitations.

No projection row may be edited manually. Re-running the same D3 builder from
the same named raw object must yield a controlled, comparable build result.

## 5. Private explorer and API contract

### 5.1 Access boundary

Only an active `BETA_USER` or `SUPERUSER` may use D3. Guest accounts and
unauthenticated users receive no DB1 response or application entry point. The
existing private-beta controls remain the only identity system; D3 adds no
account, invitation, magic-link, email, or role-management behaviour.

The API service will use a new project-local PostgreSQL role,
`cld_gb_sct_db1_reader`, with only `CONNECT`, schema usage, and `SELECT` on
the minimal DB1 views/tables required by this fixed response. It will have no
write, DDL, role, raw-filesystem, or other-database privilege. Its connection
configuration will be held in the existing root-owned project service-secret
location; neither the secret nor source content may enter the repository,
browser, logs, or result record.

If the least-privilege grant cannot be proved without touching another
database, role, cluster setting, or project, D3 stops rather than broadening
the credential.

### 5.2 Fixed service contract

D3 may add exactly one authenticated response:

```text
GET /db1/gb-sct/bill-types/d2-v1
```

It has no user-controlled source URL, SQL, route, manifest, filter, sort,
year, ID, or pagination parameter. It returns only the named projection’s
provenance, observed-structure summary, build status/counts, limitations, and
preserved projection records. It does not return the DB1 raw file path, raw
bytes as a downloadable object, secrets, or another manifest.

The application may provide a `DB1 preview` navigation item for eligible
users. Its first view must show provenance and limits before or alongside
records, not hide them in a secondary page. It will include:

1. a `Restricted DB1 projection` badge and clear distinction from the live
   no-retention proxy;
2. source route, D2 capture time, manifest/run, digest, byte count, handling
   class, and `NOT_SCHEDULED` state;
3. projection-build identity, code/schema revision, record/rejection count,
   and integrity/reproducibility status;
4. an observed key/type summary explicitly labelled as structural evidence,
   not a codebook or DB2 variable definition;
5. inspectable preserved JSON records with source position and manifest
   lineage; and
6. concise, copyable citation guidance that identifies the Scottish Parliament
   route, D2 retrieval time, manifest, projection build, and viewer access
   date/time while describing CLD only as the preservation/projection layer.

There is no download, raw-object viewer, generic database search, data
comparison, freshness badge, query builder, or chart in D3. A user can inspect
the one declared projection but cannot mistake it for unrestricted DB access.

## 6. Implementation sequence and stop gates

| Step | Permitted D3 action | Required evidence before continuing |
| --- | --- | --- |
| D3.1 preflight | Confirm the exact D2 manifest/raw-object identity and project-only target; inspect only the named object after identity checks. | Non-secret target report; no source request and no substitution. |
| D3.2 local implementation | Add source-projection builder, migration/view, fixed read contract, private view, tests, and capability guard. | Build/tests demonstrate no outbound source client, scheduler, generic query, raw download, or DB2 path. |
| D3.3 isolated data build | Apply only the needed `db1` migration and generate the named projection from the one named manifest. | Manifest/digest lineage, counts, rejection handling, and reproducibility check pass. |
| D3.4 read boundary | Create/grant only the named DB1 reader role and attach it to the existing API’s root-owned service configuration. | Role/grant inspection proves minimum privileges and no other target/service change. |
| D3.5 contained release | Release the two existing project services and run health/auth/proxy regression checks. | No new listener/unit/host-wide change; existing service checks pass. |
| D3.6 independent acceptance | Test the beta screen as an eligible user and an ineligible guest/anonymous user. | Retained result proves provenance visibility, correct access denial, and no overclaim. |
| D3.7 closeout | Update DB1 narrative, governance records, decision register, handover, and D3 result. | Scope, limitations, issue/change record, and next decision are human-readable. |

Stop and report `BLOCKED` on an unexpected target; a different/missing D2
object; changed handling class; need for an outbound request; source-body or
secret logging; an unsafe/over-broad privilege; DB migration ambiguity; failed
integrity/reproducibility check; access outside the declared roles; or any
regression of the current authentication/proxy services.

## 7. Verification and private acceptance

D3 passes only when all of the following are retained in its result:

1. **Input identity:** the sole input matches the exact manifest, run, route,
   digest, class, and `NOT_SCHEDULED` state in section 2.
2. **Raw integrity:** re-read bytes match the manifest digest and byte count
   before projection; raw content is not emitted in logs or evidence.
3. **Projection integrity:** every retained record/rejection links to the
   projection build and named input manifest; no item is silently dropped.
4. **Reproducibility:** a controlled rebuild from the same manifest yields the
   declared equivalent data result or a visible documented difference.
5. **Containment:** repository and deployment checks show no source request,
   scheduler, generic DB/query route, export, DB2 logic, raw download, listener,
   or unrelated-host change.
6. **Least privilege:** the API credential can read only the necessary project
   DB1 surface and cannot write DB1 or access another project database.
7. **Regression:** existing auth, sign-out, password, magic-link, superuser,
   and proxy checks still pass.
8. **Researcher acceptance:** an active beta user can identify source/capture/
   raw/projection distinctions, inspect the structural profile and one record,
   understand `NOT_SCHEDULED`, and copy citation guidance. A guest and
   unauthenticated request cannot obtain the response.

The resulting acceptance proves this one interface and one named projection
only. It does not prove source semantics, DB1 coverage, refresh behaviour,
route parity, historical completeness, or DB2 readiness.

## 8. Rollback and non-interference

The package changes only project-owned DB1 schema records, its raw-object
reference, the existing two project releases, and the new project-local
reader role/configuration. It must not touch shared PostgreSQL configuration,
other databases, another application, Nginx, DNS, firewall, or a system-wide
service.

If D3 fails before acceptance, restore the immediately preceding project API/
web releases and revoke only the D3-created reader role/grants if identity
checks prove they are new and unused. Preserve the D2 raw object, D2 manifest,
and a non-secret D3 failure record. Do not delete D2 evidence, infer a
successful build, or substitute an alternative route/capture.

## 9. Review questions for the owner

1. Is the single-manifest, loss-aware projection sufficiently narrow and clear
   for the first DB1 researcher test?
2. Is the separate project-local read-only role the right access boundary for
   the existing API service?
3. Does the proposed screen make the raw/projection distinction, lineage,
   structural limits, and `NOT_SCHEDULED` state visible enough?
4. Is it right to exclude guests, downloads, raw-object access, generic query,
   and all further source capture from this package?
5. If approved, may D3 proceed as one contained build/release/acceptance
   package subject to the listed stop gates?

## 10. Related records

- [D2 first-source result — DEC-0076](GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
- [DB1 strategic plan — DEC-0073](GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
- [DB1 workstream narrative](../../workstreams/db1/README.md)
- [GB-SCT source controls](README.md)
- [application status and private-beta boundary](../../application/README.md)
