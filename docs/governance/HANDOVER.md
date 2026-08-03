# Handover: Comparative Legislative Data

**Status:** Active handover note  
**Last updated:** 3 August 2026

## Current state

The project’s approved baseline is the research/data-governance model in
[`PROJECT_DESIGN.md`](PROJECT_DESIGN.md). GB-SCT is the first legislature; the
64 selected Scottish Parliament API route forms remain the approved long-term
scope under DEC-0007 and DEC-0045.

The private-beta application and the upstream-proxy MVP are complete for their
stated boundaries. Private users can access the raw, transient source relay or
the matching direct Scottish Parliament URL. The proxy is source-style: a user
opens a subject family, an endpoint, then a fixed source example or listed
source-year URL. It retains no source response and is not a project dataset,
capture, DB1, DB2, export, chart, or research release.

The owner has closed that proxy as an MVP. It remains subject to a later review
before any expansion, public release, or change in source/API behaviour. The
completed record is archived at
[`proxy-mvp/GB_SCT_FAST_TRACK_PRIVATE_RAW_PROXY_EXPANSION_DEC0072.md`](../archive/data/gb-sct/proxy-mvp/GB_SCT_FAST_TRACK_PRIVATE_RAW_PROXY_EXPANSION_DEC0072.md).

## Current authority and boundaries

- DEC-0042 governs the three-layer programme: upstream proxy, then DB1, then
  DB2.
- DEC-0008 and the current route-handling register govern restrictive default
  handling for capture or release.
- DEC-0045 keeps the complete selected inventory and its controlled
  addition/retirement path.
- DB1 contains D1's synthetic fixture, exactly one restricted D2
  `/api/billtypes` source object and manifest, the accepted D3 Bill Types
  operational projection/private preview, and D4A's three-route reconciliation
  evidence. It is not a general DB1 mirror, canonical variable dataset,
  download, or research release.
- The existing VPS application/cluster foundation is isolated and operational,
  but no DB1 action is authorised merely because that foundation exists.

## Read next

For any proposed DB1 work, read in this order:

1. [`docs/data/gb-sct/README.md`](../data/gb-sct/README.md)
2. [`GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md`](../data/gb-sct/GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md)
3. [`GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md`](../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
4. the handling, high-volume, and updateability registers linked from the
   GB-SCT guide.

The earlier DEC-0018 plan is retained as a historical planning reference in
the archive. It is not the next DB1 package.

## Next owner decision

DEC-0075 D1 and DEC-0076 D2 have passed. The [D2 result](../data/gb-sct/GB_SCT_DB1_FIRST_SOURCE_BATCH_RESULT_DEC0076_2026-08-03.md)
records the single restricted source capture. The current owner decision is
[DEC-0077](../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_PROPOSAL_DEC0077.md)
has passed: one first source-backed DB1 projection and private explorer. The
proxy and DB1 are independent data pipes sharing only the
application/authentication gateway. Read its [result](../data/gb-sct/GB_SCT_DB1_FIRST_PROJECTION_AND_PRIVATE_EXPLORER_RESULT_DEC0077_2026-08-03.md)
before any proposed next DB1 work.

[DEC-0078](../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_PROPOSAL_DEC0078.md)
has passed as the bounded three-route reference-cohort reconciliation pilot.
Its [result](../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_RECONCILIATION_RESULT_DEC0078_2026-08-03.md)
records the initial/repeat observations, false-positive correction, and active
03:17 UTC timer. [D4B](../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_PROJECTION_CATALOGUE_PROPOSAL_DEC0079.md)
has deployed its three fixed baseline projections and private catalogue. Its
[result](../data/gb-sct/GB_SCT_DB1_REFERENCE_COHORT_PROJECTION_CATALOGUE_RESULT_DEC0079_2026-08-03.md)
is owner accepted. DEC-0080 clarifies that DB1 is source-preserving and has no
semantic transformation role; download expansion, DB2, and a research release
remain excluded.

The current owner-review document is [D4C](../data/gb-sct/GB_SCT_DB1_INSTITUTIONAL_REFERENCE_COHORT_PROPOSAL_DEC0081.md): a four-route institutional-reference, source-preserving mirror increment. No D4C source, database, code, service, or interface action is authorised until the owner decides.

## Documentation hygiene

`docs/README.md` is the human entry point. Current records are kept in their
governing area; completed work is preserved in `docs/archive/`. Before a new
material package, perform the daily hygiene check required by `AGENTS.md` and
record any governance trigger in the review log.
