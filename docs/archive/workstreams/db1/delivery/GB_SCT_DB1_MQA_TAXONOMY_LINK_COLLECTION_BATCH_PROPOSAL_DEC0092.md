# GB-SCT DB1 MQA Taxonomy and Link Collection Batch — DEC-0092

**Status:** Proposed — owner approval required  
**Date:** 4 August 2026  
**Decision requested:** DEC-0092

## Decision requested

Approve one contained D13 DB1 package for exactly these fixed Scottish
Parliament collection routes, with no query string:

1. `GET https://data.parliament.scot/api/motionsquestionsanswerseventtypes`
2. `GET https://data.parliament.scot/api/motionsquestionsanswerseventlinks`

The package would authorise, for those two routes only: one initial capture,
one immediate same-route comparison after a successful initial capture, one
serial daily reconciliation service, two fixed source-preserving
projections/releases, private fixed-pagination readers, and owner acceptance.

It would not authorise the unfiltered MQA events, motions, questions, or
supports collections; either business-motion filter; any detail or parameter
route; event subtypes; official reports; votes; DB2; semantic variables;
download; generic query/search; public access; or any interpretation of event
or link meaning.

## Why this is the next batch

This is the next useful expansion of the DB1 mirror without treating all MQA
forms as if they shared one safe operating model.

| Candidate | Existing evidence | Decision in this proposal |
| --- | --- | --- |
| Event types collection | Prior bounded observation: 2 source objects, two observed fields, 81 bytes, no observed date field. | Selected as a small source-defined taxonomy collection. |
| Event links collection | Prior bounded observation: 5,721 source objects, three identifier fields, 406,192 bytes, no observed date/free-text/direct-person field. | Selected as a modest structured link collection; identifiers and link direction remain uninterpreted. |
| Event subtypes collection | Prior observation: 18 objects, including `IntroText`. | Excluded: text handling requires its own route-specific basis. |
| Events, motions, questions, supports, business filters, reports, votes | High-volume register records a distinct unavailable or windowed operating state. | Excluded: a later package must use a route/window-specific high-volume method. |

The selected routes are already in the proxy's **Motions, questions, related
records and votes on motions** category. D13 will place both retained releases
only in that existing DB1 category; it creates no MQA-specific top-level group.

## Exact D13 contract

| Control | Proposed contract |
| --- | --- |
| Source forms | The two exact `GET` routes above; no query, detail ID, user-supplied URL, substitute route, or source-style parameter generation. |
| Request sequence | Serial execution: one initial request per route; an immediate comparison only after that route's successful initial request. No retry, pagination, or cross-route fallback. |
| Daily reconciliation | One D13 service at 06:15 UTC, after D12. It executes the two routes serially, uses a non-overlap lock, and has no queued catch-up. Each route retains independent raw, manifest, comparison, projection, and release lineage. |
| Transport gates | Manual redirect handling; 30-second total timeout; 2 MiB body ceiling per route; JSON content type; top-level array. A failure records the route failure and stops that route without substitute or retry. The historical 406,192-byte Event links observation is not a current size guarantee. |
| Preservation and comparison | Immutable raw bytes and manifest; loss-aware source-preserving projection; SHA-256 and structural-signature comparison only. Every returned source object/value is preserved with source position and lineage; rejection is visible, never filtered. |
| Fixed releases | One named release per route, each bound only to its accepted initial manifest. Later daily observations do not silently rewrite either displayed release. |
| Private access | `BETA_USER` and `SUPERUSER` only; fixed server-side pagination (default 20, maximum 50). No filter, generic query, raw-object route, download, snippets, or direct SQL. |
| Presentation | Add **MQA event types · collection** and **MQA event links · collection** under the existing shared proxy/DB1 MQA category. Each panel must lead with retained-capture provenance, structure, reconciliation state, limits, and source position as technical lineage only. |

## Interpretation and handling limits

The source values, including every identifier, event-type label, and link
record, remain source-supplied material in named captures. D13 must not infer:

- an identifier's stable identity or any relation between identifiers;
- link direction, parent/child meaning, event meaning, chronology, coverage,
  completeness, or freshness;
- any motion, question, answer, bill, committee, person, vote, or amendment
  relationship; or
- a Tier 1/2 variable, event taxonomy, relationship table, or DB2 input.

The limited historic observation of no free-text/direct-person field is not a
personal-data classification. This proposal relies on the published Open Data
and copyright-licence basis recorded in DEC-0065; it makes no legal conclusion
and does not transfer a handling basis to Event subtypes or any other MQA form.

## Verification and acceptance

Before any source request, verify the two fixed clients; serial/non-overlap
behaviour; per-route transport gates; dedicated D13 writer/timer isolation;
raw/archive/manifest/projection/release lineage; reader raw/write denial;
anonymous denial; proxy/DB1 separation; and continuity of D4A–D12, application,
and shared-host services.

The result must record both routes' initial/immediate states, non-content
transport/lineage metadata, object/rejection counts, fixed-release bindings,
timer state, health, access denials, and continuity checks. An eligible private
beta user then verifies the single MQA category, both releases' provenance and
limits, and fixed pagination. A failure in one route must never be described as
a result about the other.

Stop D13 without retry, substitution, scope expansion, or change to an
existing cohort if either route redirects, times out, exceeds the ceiling,
returns non-JSON/non-array content, reports an error, materially departs from
its declared form, or creates a handling, integrity, access, or service
regression.

## Approval boundary

| Item | Record |
| --- | --- |
| Active phase | Documentation-only D13 proposal preparation after closed D12. |
| Authority now | Owner authorised preparation of this compatible structured-MQA proposal; this is not approval to request source data or implement D13. |
| Affected records if approved | Only the two named route families; isolated D13 DB1 raw/archive/manifest/projection/release records; one D13 writer/service/timer; two private readers; D13 result; DB1 narrative/matrix/handling records; and governance records. |
| Known uncertainty | Current response size/shape, update behaviour, source terms at route level, identifier stability, link direction, event meaning, coverage, and deletion/correction detection remain unestablished. |
| Containment | A failed gate stops the affected D13 route with no source retry. Only D13-created project records may be rolled back; D4A–D12, proxy, DB2, and shared services remain untouched. |
| Verification artefact | D13 restricted-deployment/acceptance result with per-route non-content capture/reconciliation, lineage, access, continuity, and owner-acceptance evidence. |

## Owner review questions

1. Is the two-route Event types/Event links batch the right next DB1 increment?
2. Are the 2 MiB/30-second/serial/no-retry gates and 06:15 UTC daily schedule
   proportionate for the stated historic evidence?
3. Is the MQA category placement and fixed-pagination-only access boundary
   right, while Event subtypes and all firehose/windowed routes remain out of
   scope?
4. If approved, may D13 proceed as one contained implementation, deployment,
   and owner-acceptance package within these limits?

## Related records

- [DB1 strategic plan — DEC-0073](../planning/STRATEGY_AND_OPERATING_MODEL_DEC0073.md)
- [DB1 retained-data access direction — DEC-0082](../planning/RESEARCH_ACCESS_DIRECTION_DEC0082.md)
- [D12 Committees cohort — DEC-0091](GB_SCT_DB1_COMMITTEES_COLLECTION_COHORT_RESULT_DEC0091_2026-08-04.md)
- [Master endpoint matrix — DEC-0045](../../../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md)
- [MQA reconnaissance](../../../data/gb-sct/reconnaissance/GB_SCT_MQA_FIRST_PASS_RECONNAISSANCE_RESULT_2026-08-02.md)
- [Structured link/event taxonomy qualification — DEC-0065](../../proxy/mvp/GB_SCT_STRUCTURED_LINK_AND_EVENT_TAXONOMY_QUALIFICATION_RESULT_2026-08-03.md)
- [High-volume operational register — DEC-0071](../../../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md)
