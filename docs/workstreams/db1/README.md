# DB1 source-faithful projection workstream

**Status:** Bounded DB1 cohorts operating privately; source-preserving mirror
architecture still being built route by route

## 1. Purpose and user value

DB1 is the future retained data-management layer. It will routinely reconcile
approved source routes, preserve immutable capture history, and generate a
loss-aware reproducible projection for transparent, efficient source access.
Its value is to turn the mutable, sometimes firehose-like upstream API into a
living versioned research resource with explicit capture lineage, freshness,
change, and failure records.

DB1 is not yet a proven full mirror. Until route coverage and reconciliation
evidence are published for a defined scope, it must be described as a
source-faithful projection of declared captures. Its end-state ambition is a
regularly reconciled, source-preserving mirror: each included route is checked
on its declared schedule and the resulting comparison evidence says precisely
what did, did not, or could not match the Scottish Parliament response within
that declared request window.

DB1 is an independent mini-project. DB2 is a later, separate workstream that
must work within the declared DB1 record if it proceeds; DB2 does not determine
DB1 capture priorities, schema, retention, or success criteria.

### Relationship to the proxy

DB1 should use the proxy's compact, subject-first, expandable catalogue as its
researcher-facing navigation pattern. A researcher should be able to discover
the same route families without learning two unrelated interfaces. The data
contract is deliberately different: the proxy opens a transient upstream
response, while DB1 serves a named retained capture or projection from the
project database. DB1 must therefore lead with build, capture, coverage, and
reconciliation state—not present itself as a live relay or silently substitute
for the Scottish Parliament endpoint.

### Source-preservation rule

DB1 is being built as the source-preserving mirror layer: its raw archive keeps
the received bytes, while its operational projection retains every source
object/value with source position and manifest lineage. DB1 may add only
operational provenance, integrity, and access metadata; it must not rename,
reclassify, infer, aggregate, filter, fill, or otherwise semantically transform
source data. Any decoding/re-serialisation limit, non-object rejection, or
projection loss must be explicit and testable. Defined variables and every
semantic transformation belong to the later, independently governed DB2 layer.

## 2. Current boundary

D1 created an internal `db1` schema and one synthetic-only proof chain. D2
captured exactly one restricted source object: `/api/billtypes`, with a
manifest and raw-object digest. D3 then built one loss-aware seven-record,
zero-rejection projection from that exact object and exposed one authenticated
private preview. This remains one dated source observation, not a mirror,
data service, capture worker, generic researcher-access surface, or canonical
dataset. The completed proxy remains separate because it retains no source
response.

The current inventory and route evidence are inputs to DB1 planning, not
authority to collect data. See the [GB-SCT source-controls guide](../../data/gb-sct/README.md).

## 3. Existing evidence and design constraints

The project has an approved endpoint inventory and route-level evidence about
parameters, high volumes, handling, and limited updateability. The critical
constraints are: preserving raw bytes and manifests; explicit request windows;
route-specific handling; visible failures; no silent retry expansion;
record-to-capture lineage; and a reproducible rebuild from named captures.

High-volume annual official reports, MQA routes, and votes require especially
careful source-window, transfer, cancellation, and reconciliation design. The
[operational register](../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
and [update-signal evidence](../../data/gb-sct/GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md)
are starting constraints, not a capture authorisation.

## 4. Decision and implementation path

The [DEC-0073 DB1 plan](../../data/gb-sct/GB_SCT_DB1_PLANNING_PROPOSAL_DEC0073.md)
is approved. It sets out the strategic product shape, route-specific
routine-reconciliation model, PostgreSQL/raw-object architecture,
researcher-access product, staged execution path, first-batch selection
criteria, front-end acceptance, and stop conditions. The plan's researcher
features are a staged target, not a claim that the current restricted catalogue
already offers generic query, download, or programme examples.

The owner-approved [DEC-0075 D1 synthetic foundation](../../data/gb-sct/GB_SCT_DB1_FOUNDATION_IMPLEMENTATION_PROPOSAL_DEC0075.md)
has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_SYNTHETIC_FOUNDATION_RESULT_DEC0075_2026-08-03.md)
proves the raw-object → manifest → projection/rejection chain using only a
project-created fixture on the isolated project target. It did not request or
retain source content, schedule reconciliation, expose DB1 to a user, or
change the existing application services.

The earlier DEC-0018 plan is retained as an
[unadopted historical reference](../../archive/data/gb-sct/db1-planning/README.md),
not the governing plan.

## 5. Initial gaps and review approach

DB1 still needs a separately approved first capture slice; route-specific
source and handling basis; source-derived manifest/raw objects; a precise first
projection contract; update/reconciliation method; capture-worker access
design; and a front-end acceptance boundary. D1 defines synthetic verification
only. Every later source action must evaluate these gaps openly and specify
review triggers for source drift, failed runs, schema changes, and renewal of
source/update assumptions.

The owner-approved [D2 first-source batch](../../data/gb-sct/GB_SCT_DB1_FIRST_SOURCE_BATCH_PROPOSAL_DEC0076.md)
passed as one fixed `/api/billtypes` request. Its [result](../../data/gb-sct/GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
records the restricted raw object and manifest only: no schedule, user access,
projection, or DB2 use occurred.

The owner-approved [D3 package — DEC-0077](../../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_PROPOSAL_DEC0077.md)
has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
records the seven-record/zero-rejection source-backed projection, DB1-only
reader credential, anonymous denial, separate proxy/DB1 data pipes, and owner
private-beta acceptance. It remains a one-capture, `NOT_SCHEDULED` increment.

For a later separately approved DB1 interface, the owner has set a design
direction: use the proxy catalogue's compact, grouped, expandable layout for
consistent navigation, while keeping retained capture/projection provenance,
version, and reconciliation state visually and semantically distinct from the
proxy's live no-retention access.

The completed [D4A reference-cohort reconciliation](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_PROPOSAL_DEC0078.md)
tested daily append-only source preservation for three small P1 reference
collections while deliberately leaving the D3 interface unchanged. D4B then
used its named retained manifests for the first proxy-aligned DB1 catalogue.

D4A has passed. Its [result](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_RESULT_DEC0078_2026-08-03.md)
records an initial three-route cycle and a repaired immediate verification
cycle, with all later comparisons `UNCHANGED`; the daily timer is active. The
record also preserves a false structural-drift positive caused by JSON-object
key order, the timer pause, the code correction, and the successful corrected
verification. It did not itself authorise an automatic source or interface
expansion.

The [D4B proposal — DEC-0079](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_PROJECTION_CATALOGUE_PROPOSAL_DEC0079.md)
has deployed three fixed baseline projections from named D4A manifests and a
private DB1 catalogue in the proxy’s compact grouped/expandable layout. Its
[result](../../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_PROJECTION_CATALOGUE_RESULT_DEC0079_2026-08-03.md)
records the one readiness-check rollback and corrected deployment. The owner
has accepted the front-end catalogue. It keeps later timer observations
separate from displayed records; DB1 remains a deliberately narrow baseline,
not a general mirror claim.

The [D4C institutional-reference cohort](../../data/gb-sct/GB_SCT_DB1_INSTITUTIONAL_REFERENCE_COHORT_PROPOSAL_DEC0081.md)
is closed after capturing only four bounded source-preserving collections—
Constituencies, Regions, Committee Types, and Committee Type Links—before any
more sensitive or high-volume route. Its
[result](../../data/gb-sct/GB_SCT_DB1_INSTITUTIONAL_REFERENCE_COHORT_RESULT_DEC0081_2026-08-03.md)
records source/timer/projection/access proof and owner acceptance. The
[DB1 retained-data access direction](../../data/gb-sct/GB_SCT_DB1_RETAINED_DATA_ACCESS_DIRECTION_DEC0082.md)
now requires an explicit volume-appropriate access mode for every later DB1
cohort; the small-collection browser is not a universal template.

The owner-approved [D5 formal-stages cohort — DEC-0083](../../data/gb-sct/GB_SCT_DB1_FORMAL_STAGES_COHORT_PROPOSAL_DEC0083.md)
is limited to `/api/billstages` and uses access-plan-first rather than assuming
a collection browser. Its [restricted handling record](../../data/gb-sct/GB_SCT_FORMAL_STAGES_HANDLING_RECORD_DEC0083.md)
keeps raw content and individual records private while the fixed baseline is
first established. Its [deployment result](../../data/gb-sct/GB_SCT_DB1_FORMAL_STAGES_COHORT_RESULT_DEC0083_2026-08-03.md)
records the one `INITIAL` capture and private access-plan release. The owner
accepted the corrected subject-first navigation on 4 August: one Bills and
formal-stages group now contains both existing fixed projections and the D5
access-plan release. The correction changed neither data nor access boundary;
a regression test protects the one-group navigation rule.

The owner approved the collection-only Bills handling basis in
[DEC-0084](../../data/gb-sct/GB_SCT_BILLS_DB1_READINESS_DECISION_DEC0084.md).
The resulting [Bills collection package — DEC-0085](../../data/gb-sct/GB_SCT_DB1_BILLS_COLLECTION_COHORT_PROPOSAL_DEC0085.md)
has passed restricted deployment: the exact `/api/bills` collection route has
one `INITIAL` capture, one immediate `UNCHANGED` reconciliation, a fixed
473-record/zero-rejection source-preserving release, and an independent daily
04:02 UTC timer. Its [result](../../data/gb-sct/GB_SCT_DB1_BILLS_COLLECTION_COHORT_RESULT_DEC0085_2026-08-04.md)
records the restricted private paginated reader and owner acceptance. The
owner confirmed the front-end journey behaved as expected, so DEC-0085 is
closed. The Bills detail route remains blocked.

The collection-only [Government roles cohort — DEC-0086](../../data/gb-sct/GB_SCT_DB1_GOVERNMENT_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0086.md)
has passed restricted deployment: the exact `/api/governmentroles` collection
has one `INITIAL` capture, one immediate `UNCHANGED` reconciliation, a fixed
251-record/zero-rejection source-preserving release, and an independent daily
04:17 UTC timer. Its [result](../../data/gb-sct/GB_SCT_DB1_GOVERNMENT_ROLES_COLLECTION_COHORT_RESULT_DEC0086_2026-08-04.md)
records the private paginated reader and completed owner acceptance; DEC-0086
is closed. It is not evidence of ministerial occupancy or a transfer of the
handling decision to person/relationship or other `Notes`-bearing routes.

The collection-only [D8 Committee roles cohort — DEC-0087](../../data/gb-sct/GB_SCT_DB1_COMMITTEE_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0087.md)
has one `INITIAL` capture, one immediate `UNCHANGED` reconciliation, a fixed
eight-record/zero-rejection source-preserving release, and an independent daily
04:32 UTC timer. Its [result](../../data/gb-sct/GB_SCT_DB1_COMMITTEE_ROLES_COLLECTION_COHORT_RESULT_DEC0087_2026-08-04.md)
records the private paginated reader and completed owner acceptance; DEC-0087
is closed. It is not evidence of committee membership/history or a transfer of
the handling decision to detail, relationship, or other `Notes`-bearing routes.

The collection-only [D9 Party roles cohort — DEC-0088](../../data/gb-sct/GB_SCT_DB1_PARTY_ROLES_COLLECTION_COHORT_PROPOSAL_DEC0088.md)
has one `INITIAL` capture, one immediate `UNCHANGED` reconciliation, a fixed
548-record/zero-rejection source-preserving release, and an independent daily
04:47 UTC timer. Its
[result](../../data/gb-sct/GB_SCT_DB1_PARTY_ROLES_COLLECTION_COHORT_RESULT_DEC0088_2026-08-04.md)
records the private paginated reader and completed owner acceptance; DEC-0088
is closed. It is not evidence of party membership, role history, or a
transferable handling basis for detail, relationship, or other `Notes`-bearing
routes.

The collection-only [D10 Parties cohort — DEC-0089](../../data/gb-sct/GB_SCT_DB1_PARTIES_COLLECTION_COHORT_PROPOSAL_DEC0089.md)
has one `INITIAL` capture, one immediate `UNCHANGED` reconciliation, a fixed
14-record/zero-rejection source-preserving release, and an independent daily
05:02 UTC timer. Its
[result](../../data/gb-sct/GB_SCT_DB1_PARTIES_COLLECTION_COHORT_RESULT_DEC0089_2026-08-04.md)
records the private paginated reader and completed owner acceptance; DEC-0089
is closed. It is not evidence of party affiliation, validity, continuity,
history, or a transferable handling basis for detail, relationship, or other
`Notes`-bearing routes.

The [D11 Member-context collection batch — DEC-0090](../../data/gb-sct/GB_SCT_DB1_MEMBER_CONTEXT_COLLECTION_BATCH_PROPOSAL_DEC0090.md)
is the first completed shift from one-route cadence to a compatible,
collection-only batch. Its
[result](../../data/gb-sct/GB_SCT_DB1_MEMBER_CONTEXT_COLLECTION_BATCH_RESULT_DEC0090_2026-08-04.md)
records six separate raw/manifests/projections/releases in one serial delivery
package: Members, Member constituency statuses, Member region statuses, Member
parties, Member party roles, and Member government roles. It deliberately
creates no member, representation, party, office, role, relationship, or
interval claim; owner private-beta acceptance remains pending.

## 6. Detailed records

Use the [master endpoint matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md),
[retention policy](../../data/gb-sct/RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md),
and [capture authorisation template](../../data/gb-sct/CAPTURE_BATCH_AUTHORIZATION_TEMPLATE.md)
as current controls. Completed reconnaissance and prior planning are preserved
in the [data archive](../../archive/data/gb-sct/).
