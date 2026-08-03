# GB-SCT Institutional Reference Cohort Qualification Proposal — DEC-0063

**Status:** APPROVED — EXECUTED PASS (partial candidate outcome; no additional
source route is enabled)

**Version:** 1.0.0

**Prepared:** 3 August 2026

**Authority requested:** DEC-0063, following DEC-0042, DEC-0045,
DEC-0055–DEC-0057, and completed DEC-0061–DEC-0062.

## 1. Decision requested

Approve an evidence-only qualification package for the following fixed,
no-query collection routes:

| Project route ID | Fixed source path | Purpose of a possible later relay |
| --- | --- | --- |
| `constituencies.collection` | `/api/constituencies` | Source-defined constituency reference context. |
| `regions.collection` | `/api/regions` | Source-defined regional reference context. |
| `parties.collection` | `/api/parties` | Source-defined party reference context. |
| `party-roles.collection` | `/api/partyroles` | Source-defined party-role terminology. |
| `government-roles.collection` | `/api/governmentroles` | Source-defined government-role terminology. |
| `committee-roles.collection` | `/api/committeeroles` | Source-defined committee-role terminology. |
| `committee-types.collection` | `/api/committeetypes` | Source-defined committee-type terminology. |

Approval would authorise only the documentation/handling assessment described
below. It would not enable a relay or direct-link action, request an API
endpoint, change code, access the VPS, write a database, create DB1/DB2,
retain source material, or create a variable, chart, export, or public release.

## 2. Why this is the next cohort

The completed first cohort established that the no-retention relay, its two
access options, transparent response guide, compact endpoint catalogue, and
private-beta controls work end to end. The next sensible increment is a small
set of institutional reference/taxonomy collections that will help users
navigate later bill, member, committee, and party material without treating
those future relationships as already established.

Existing DEC-0055 reconnaissance already records fixed no-query JSON
collection observations for these forms. It describes Constituencies and
Regions as geography/reference collections; Parties as source-defined party
reference data; and Party Roles, Government Roles, Committee Roles, and
Committee Types as reference taxonomies. It also records that the role
collections may contain notes and that reference status does not settle field
meaning, completeness, historical validity, licence applicability, or handling.

This proposal excludes deliberately:

- Members, member constituency/region status, member parties, member roles,
  and member government roles because person, relationship, validity-period,
  and potential protected-content questions require their own assessment.
- Committees and committee-type links because their description/contact or
  relationship semantics need a separate handling decision.
- Bills, Formal Stages, detail forms, MQA, official reports, and votes on
  motions because their existing constraints are materially different.

No selected route is retired or given a Tier 1/2 analytical meaning by this
choice.

## 3. Qualification work if approved

### Q1 — evidence review without new source retrieval

Use only existing repository records: the DEC-0061 published-basis result,
the contextual-reference and roles/committees reconnaissance results, the
DEC-0045 matrix, and the approved retention/publication policy. No new API,
portal, licence, documentation, or VPS request is permitted.

For each route, record:

- its existing fixed-path and no-query evidence;
- the relevant published licence/attribution/non-endorsement, personal-data,
  third-party-rights, and no-warranty limitations already recorded under
  DEC-0061;
- any field/content concern that prevents narrow private pass-through; and
- the semantic claims expressly not made.

### Q2 — route-by-route handling outcome

Each route must end as exactly one of:

- `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE`;
- `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING`; or
- `UNAVAILABLE_PENDING_FURTHER_EVIDENCE`.

Candidate status means only that the named fixed collection may be proposed in
a later exact private implementation/deployment package. It is not a live
route, source-data release, currentness/completeness assertion, semantic
validation, or permission to store or analyse the content.

## 4. Candidate threshold and stop conditions

| Question | Candidate threshold | Stop condition |
| --- | --- | --- |
| Path/transport | Existing evidence supports the fixed no-query JSON collection form. | A material contradiction or unresolved request-shape issue. |
| Published basis | The existing Scottish Parliament Open Data/licence record remains traceable, with its limits carried forward. | Route-specific terms or rights contradict a narrow private pass-through, or applicability cannot be stated honestly. |
| Handling | No known route-specific concern prevents live no-retention viewing by an approved user. | Notes or any other field/content concern leaves personal-data, third-party-rights, or handling uncertainty material. |
| Meaning | The route can be described as source-defined reference/taxonomy material only. | Any need to infer geography, party history, office occupancy, committee membership, or temporal semantics. |

An unresolved route remains visibly unavailable; it is never substituted with a
cache, DB1 copy, inferred record, or broader cohort access.

## 5. Later implementation boundary — not authorised here

If one or more routes become candidates and the owner separately approves a
new deployment package, it must reuse the accepted DEC-0062 controls: exact
ID/path allowlist; no parameters; fixed origin and request headers; manual
redirects; no retry; bounded timeout; beta-only access; source-faithful
streaming; no persistence; transparent source/direct actions; dated
non-live response guides; and project-only API/web-service deployment.

The later package must not enable a route that this result marks blocked or
unavailable. It must re-run local and target-runtime tests and receive its own
owner route-by-route acceptance.

## 6. Explicit exclusions

- Any source/API/portal/document request, source-client code, relay change,
  VPS action, secret use, database connection/write, cache, email, Nginx,
  Cloudflare, or public access change.
- All routes not named in Section 1, including all detail and parameterised
  forms.
- DB1, DB2, capture, retention, data release, schema validation, variable,
  join, calculation, chart, export, or research claim.
- Interpretation of source identifiers, labels, notes, dates, validity,
  relationship, membership, occupancy, or historical coverage.

## 7. Result and next step

The result will contain only existing-evidence citations, route handling
outcomes, and disclosed limits. If candidates result, the next step is a
separate exact private implementation/deployment proposal for those routes.
If none qualify, the catalogue states that outcome transparently and the next
step is a route-specific evidence plan. DB1 remains blocked pending broader
proxy-phase acceptance.

**Result:** [`GB_SCT_INSTITUTIONAL_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md`](GB_SCT_INSTITUTIONAL_REFERENCE_COHORT_QUALIFICATION_RESULT_2026-08-03.md).
