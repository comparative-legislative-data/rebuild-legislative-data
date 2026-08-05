# GB-SCT DB1 Synthetic Foundation Implementation Proposal — DEC-0075

**Status:** Approved and executed — see the [D1 result](GB_SCT_DB1_SYNTHETIC_FOUNDATION_RESULT_DEC0075_2026-08-03.md)

**Version:** 1.0.0  
**Prepared:** 3 August 2026  
**Decision requested:** DEC-0075

## 1. Decision requested

Approve a bounded **D1 DB1 foundation implementation**. D1 would establish and
verify the technical seams needed for DB1 using project-created, synthetic
fixtures only. It would prove that a raw object, its manifest, and a
source-faithful operational projection can remain distinct, linked, immutable,
and reproducible on the isolated project foundation.

Approval would authorise only the following work:

- add the reviewed DB1 foundation modules, migrations, tests, and verification
  scripts to this repository;
- use the named project DB1 target only after its read-only preflight proves it
  is the expected isolated target;
- create the named project raw-object subdirectory only after its read-only
  preflight proves it is safe and project-owned;
- apply the new DB1 schema and run an end-to-end synthetic fixture test; and
- deploy the resulting inactive/internal-only project code only if all local
  and VPS verification gates pass.

D1 does **not** authorise a Scottish Parliament request, any other outbound
source request, retention of source material, route polling, cron/systemd
scheduler, source-route enablement, DB1 beta interface, public endpoint,
download, export, DB2 variable, chart, research claim, role/grant change, or
change to another VPS project or service.

The owner approved D1 on 3 August 2026. Its implementation passed within the
synthetic-only boundary; the detailed result is linked above. D2 remains a
separate owner decision.

## 2. Why this is the right next step

DB1 needs to be demonstrably capable of preserving a received object without
mistaking it for a database row or an analytical variable. D1 tests that
capability before the project obtains any source material. It makes later D2
capture planning depend on a proved, auditable foundation rather than on an
unseen schema or a promise about a future ingestion process.

The package is deliberately independent of DB2. It validates source
preservation and access lineage, not the usefulness of a field for a future
canonical variable, chart, or research question.

## 3. Exact implementation boundary

| Area | D1 may do | D1 must not do |
| --- | --- | --- |
| Repository | Add an internal `apps/api/src/db1/` foundation module, DB1 migration files, synthetic fixtures, and bounded tests/checks. | Change the proxy contract, authentication behaviour, public web content, or add a DB1 API/UI route. |
| PostgreSQL | Create a new `db1` schema and its D1 tables in `cld_gb_sct_db1`, after target identity and emptiness checks pass. | Connect to or alter another database, create/change roles, grants, extensions, cluster settings, backups, or shared PostgreSQL configuration. |
| Raw-object storage | Create/use only `/srv/cld-gb-sct/raw/db1/` for D1-generated synthetic bytes, after ownership/path checks pass. | Write source bytes, use a developer machine as an archive, write outside that subtree, or publish an object. |
| Services | Add a dormant internal module to the existing project API release only after all checks pass; retain the current two-service boundary. | Add a listener, Nginx route, scheduler, worker, queue, systemd unit, cron job, Docker service, or service for another project. |
| Data | Generate a declared synthetic test payload locally and label every resulting row/object `SYNTHETIC_TEST_ONLY`. | Request, download, copy, retain, parse, inspect, or transform any Scottish Parliament response or other external source content. |

The stated paths and database are proposed targets, not evidence that they
exist or are currently safe. A D1 preflight must prove them before mutation.
An unexpected target, existing DB1 content, unexpected ownership, or an
insufficient project-only permission is a **stop**, not an invitation to
broaden the action.

## 4. Foundation model to be proved

D1 will build the minimum usable chain below. It does not claim that the
synthetic fixture is a source capture or that its fields represent a Scottish
Parliament schema.

```text
synthetic bytes
  -> content-addressed raw object (SHA-256)
  -> capture-run + manifest entry
  -> declared projection build
  -> projection record(s) + rejection record(s), each linked to the manifest
```

The proposed `db1` schema has five deliberately separate concepts:

| Proposed object | Essential D1 evidence | Purpose |
| --- | --- | --- |
| `source_routes` | A synthetic-only route key, origin class, and explicit prohibition on source access. | Proves route metadata is separate from a received object. |
| `capture_runs` and `manifest_entries` | Run/manifest IDs, UTC times, requested scope label, status, content type, byte count, SHA-256, and non-secret error state. | States what the system attempted and what it received. |
| `raw_objects` | Content digest, immutable relative path, byte count, content type, and manifest link. | Connects an unaltered byte object to its evidence record. |
| `projection_builds` | Input manifest IDs, schema/version/code revision, integrity status, row/rejection counts. | Separates an operational representation from raw bytes. |
| `projection_records` and `projection_rejections` | Build and manifest lineage, source-position key, preserved JSON representation or rejection reason. | Proves every projected/rejected item can be traced back. |

Implementation details may improve names or normalisation, but may not collapse
raw objects, manifests, and projection records into one table or lose the
manifest-to-projection lineage described above without a revised proposal.

### 4.1 Raw-object contract

The D1 writer must:

1. accept bytes only from the local synthetic-fixture provider;
2. calculate SHA-256 before persistence;
3. write atomically below the configured DB1 root using a digest-addressed
   relative path;
4. refuse a path outside that root, an absent/unsafe root, or a mismatch
   between supplied bytes and the digest; and
5. never overwrite different bytes at an existing digest path.

The D1 test fixture is project-created and carries a clear `SYNTHETIC_TEST_ONLY`
origin marker. It will contain no copied source labels, source values, or live
route payload. Logs must contain identifiers, counts, and digests only—not the
fixture body or any credential.

### 4.2 Projection contract

The synthetic projection will preserve the fixture record representation in a
loss-aware JSON field and add only operational fields needed for ordering,
lineage, and rejection reporting. It will not infer meanings, rename fields as
research variables, manufacture a codebook, or implement DB2 logic.

One deliberately malformed synthetic item should produce a documented
rejection record linked to the same build/manifest. This proves that a failed
projection is visible rather than silently omitted.

## 5. Implementation sequence and stop gates

| Step | Permitted action after DEC-0075 approval | Required evidence before continuing |
| --- | --- | --- |
| D1.1 — read-only preflight | Confirm project service identity, `cld_gb_sct_db1` database identity, no unexpected `db1` schema/content, and raw-root parent/path ownership. | Non-secret target report showing only the intended project target; no shared-service or other-project change. |
| D1.2 — local implementation | Add the internal schema/migration, raw-object adapter, manifest/projection adapter, synthetic fixture, and checks. | Typecheck, tests, build, and source-capability scan pass locally. |
| D1.3 — isolated migration | Create the `db1` schema/tables and DB1 raw subtree on the proved target. | Migration report records exact target and created objects; no role, cluster, service, or source action. |
| D1.4 — synthetic end-to-end run | Persist the synthetic bytes, create manifest/build/projection/rejection records, and verify every link/digest. | Deterministic verification report with no external network capability or payload. |
| D1.5 — contained release | Deploy only the existing project services if needed to retain the inactive internal code. | Existing auth/proxy health and private-boundary smoke checks remain unchanged; no new route/listener/job. |
| D1.6 — result and review | Produce a concise D1 result, update the DB1 narrative, register, handover, and review log. | Owner sees what was built, what was not done, test results, remaining gaps, and D2 decision prerequisites. |

Stop immediately and report `BLOCKED` if any named target is not exact, the
database already contains unexpected DB1 material, raw storage cannot be
confined, a test needs outbound network access, an existing application
behaviour changes, or a service check fails. No substitute database, path,
route, fixture, or source is permitted without a new owner decision.

## 6. Verification and acceptance criteria

D1 is successful only if all of these pass:

1. **Capability containment:** a repository check proves the D1 module and
   tests contain no outbound HTTP/source client, no source host, no scheduler,
   and no public DB1 route; its allowed input is the named synthetic provider.
2. **Target containment:** preflight and postflight identify only
   `cld_gb_sct_db1`/`db1` and `/srv/cld-gb-sct/raw/db1/`; no role, grant,
   Nginx, cluster, Docker, systemd, cron, or other-project change occurs.
3. **Raw integrity:** re-reading the stored synthetic bytes yields the manifest
   SHA-256 and byte count; an attempted digest/path mismatch is rejected.
4. **Lineage:** every synthetic projected record and rejection links to its
   projection build, manifest entry, capture run, and raw object as applicable.
5. **Immutability:** the same digest is safe to reuse; different content cannot
   overwrite a stored digest-addressed object.
6. **Reproducibility:** a second build from the named manifest produces the
   declared equivalent result or a clearly recorded controlled difference.
7. **Failure visibility:** malformed synthetic input creates an explicit,
   queryable rejection/failure record rather than disappearing.
8. **Regression safety:** existing API/auth/proxy build and smoke checks pass
   with no observable new public behaviour.
9. **Human record:** the D1 result explains the actual schema, synthetic test,
   evidence, exceptions, rollback result if used, and unresolved D2 gaps.

No researcher-facing DB1 acceptance occurs in D1. The first UI, query API,
download, or schema explorer remains D3 or a separately approved package.

## 7. Deployment, rollback, and non-interference

No shared-host configuration changes are proposed. D1 uses the existing
project release process only; it must not touch the unrelated VPS backends.
The project API may be restarted only as part of the existing project service
release and only after a successful local package. A failed health check stops
the release and restores the immediately prior project release; it does not
alter other services.

If the D1 migration or synthetic verification fails after creating the new
schema, rollback is permitted only when the preflight/result proves that:

- `db1` was created by this D1 run in `cld_gb_sct_db1`;
- it contains only the recorded D1 synthetic objects; and
- the raw subtree contains only the recorded D1 synthetic digests.

In that narrow case, the D1 down-migration may remove the `db1` schema and the
specific recorded synthetic objects. Otherwise, leave the foundation disabled,
preserve the non-secret failure evidence, and request direction. D1 never
deletes an existing database, another schema, a raw parent directory, or a
pre-existing object.

## 8. Explicit exclusions and D2 hand-off

D1 proves software and isolation, not data coverage. It cannot establish that
any selected GB-SCT route is suitable to capture, what its source values mean,
how complete it is, whether it has changed, or whether a 24-hour schedule is
appropriate. Those questions remain for an exact D2 source-batch proposal.

A D2 proposal must separately name the first source route/window, handling and
retention basis, request/retry/volume budget, capture and reconciliation rule,
source limitations, raw-object access class, and its success/failure criteria.
It must not be assumed approved merely because D1 passes.

## 9. Review questions for the owner

1. Is the synthetic-only boundary strict enough to prove the foundation without
   obtaining or retaining source material?
2. Are the exact database/path targets and the stop-on-unexpected-target rule
   sufficiently protective of the shared VPS?
3. Does the raw → manifest → projection/rejection chain provide the right
   minimum evidence for academic-grade DB1 provenance?
4. Is it right to keep all public/researcher DB1 access, downloads, schedules,
   and source capture out of D1?
5. If approved, should D1 proceed as one contained implementation/release
   package under these acceptance criteria?

## 10. Related current records

- [DEC-0073 strategic DB1 plan](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 workstream narrative](../../../../workstreams/db1/README.md)
- [programme design — DEC-0042](../../../../data/gb-sct/GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md)
- [retention and publication policy — DEC-0008](../../../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md)
- [master endpoint delivery matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [capture-batch authorisation template](../../../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)

On approval, the result record must update the DB1 narrative first, then link
to detailed technical evidence. It must distinguish what D1 actually proved
from the later source, schedule, and researcher-access work it deliberately did
not attempt.
