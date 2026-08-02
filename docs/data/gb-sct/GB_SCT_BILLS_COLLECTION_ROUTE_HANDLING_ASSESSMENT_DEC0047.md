# GB-SCT Bills Collection Route-Handling Assessment — DEC-0047

**Status:** `UNRESOLVED` — completed restrictive handling assessment; no
capture, proxy, DB1, DB2, or public output authorised

**Version:** 1.0.0

**Assessment date:** 2 August 2026

**Authority:** DEC-0047, owner instruction to complete the formal Bills
route-handling assessment on 2 August 2026

## 1. Purpose and outcome

This is the completed DEC-0008 route-level handling record for the GB-SCT
Bills **collection** route. It applies the source-terms qualification
([`GB_SCT_BILLS_ROUTE_QUALIFICATION_RESULT_2026-08-02.md`](GB_SCT_BILLS_ROUTE_QUALIFICATION_RESULT_2026-08-02.md))
and the value-free observation
([`GB_SCT_BILLS_COLLECTION_OBSERVATION_RESULT_2026-08-02.md`](GB_SCT_BILLS_COLLECTION_OBSERVATION_RESULT_2026-08-02.md)).

Its outcome is deliberately restrictive: the evidence supports neither raw
capture nor DB1, pass-through, native access, canonical output, or any data
release. The route is therefore `DO_NOT_CAPTURE_OR_RELEASE` unless and until
a later owner-approved package resolves the stated conditions. This record is
not a source request, capture, retention exception, source registry release,
or implementation authority.

## 2. Required handling record

| Required field | Record |
| --- | --- |
| Source and route scope | Source ID: `GB-SCT-OPEN-DATA`. Exact route: `GET https://data.parliament.scot/api/bills`, collection form only, with no query parameters. This assessment explicitly excludes `/api/bills/:id`, every other route, all pagination/follow-up forms, any period filter, and every operational request. |
| Purpose and necessity | The route is one of the approved DEC-0007 Bills forms and is intended, after qualification, to support a transparent native-access layer and DB1 preservation. A handling assessment is necessary before any capture or data-interface proposal can be considered. |
| Source authority and terms | The Scottish Parliament Corporate Body is evidenced as Open Data website operator. The published copyright licence supplies a conditional reuse framework for covered information, including attribution and no implied endorsement; it excludes personal data. It does not establish that every Bills response field is covered, or route-specific access, rate, caching, pagination, or retention conditions. Assessment: `PARTIAL_OR_CONDITIONAL`. |
| Content and risk screen | One prior transient observation recorded seven field names/types only, not values. `PersonID` is identifier-like and nullable; `ThirdPartyOrganisation` is a nullable string. Their meaning and data-protection treatment are unassessed. The four other string fields could also contain identifying or other content; their semantics are unassessed. Response volume, historical coverage, identifier stability, ordering, and all detail-route fields remain unknown. Potential linking and re-identification risk is therefore unresolved. |
| Minimisation decision | No source content is collected, retained, or exposed under this record. The only retained evidence is the prior value-free schema/transport result and terms assessment. A later observation must name its exact route, request cap, response ceiling, selection method, retained metadata, and disposal rule; it may not use this record to widen scope. |
| Raw-capture handling class | `DO_NOT_CAPTURE_OR_RELEASE`. No raw bytes, response values, response digest, request-derived identifier, cache, fixture, screenshot, or log payload may be retained under this assessment. |
| DB1 handling class | `DO_NOT_CAPTURE_OR_RELEASE`. No operational projection, indexes, typed fields, unparsed payload, database rows, or record-to-capture lineage may be created because no capture is authorised. |
| Public provenance class | `PUBLIC_PROVENANCE_ONLY` for non-content materials only: this assessment, the terms qualification, the value-free observation result, method, limitations, and future non-content decision/verification records. None makes source-content copies or values public. |
| Public output class | No public output. Neither `PUBLIC_NATIVE_ACCESS` nor `PUBLIC_CANONICAL` is qualified. No beta interface, download, API response, chart, or source-content example is permitted. |
| Retention and review | No source content exists to retain. Retain this non-content assessment and its linked non-content evidence in the durable project record under DEC-0008. Review before any Bills collection capture/proxy/DB1/public-output proposal, on a relevant terms or schema change, on a rights/privacy concern, or by 1 September 2026, whichever occurs first. |
| Access and accountable role | Maintainer owns the non-content assessment record; the project owner controls any future scope approval. There is no raw or DB1 access class to operate. Any future content-bearing asset must have named roles, least-privilege controls, audit requirements, and a separately approved implementation boundary. |
| Correction/restriction/removal process | A source correction, rights/privacy concern, contradictory terms evidence, or schema-drift indication restricts the route immediately to `DO_NOT_CAPTURE_OR_RELEASE`, records the reason category and date, and updates this assessment or a successor without source values. There is no captured content to delete or withdraw. |
| Stop conditions | Stop any future proposal if it cannot establish applicable terms/allowed use, a proportionate personal-data assessment, exact operating/request conditions, retention compatibility, accountable access controls, or a truthful public-output boundary. Stop also if it would need a redirect, credential, unapproved parameter, extra route, repeat request, raw-value retention, database/file write, or any source-content publication not explicitly authorised. |
| Evidence and status | Terms/authority: `PARTIAL_OR_CONDITIONAL` under DEC-0044. Response shape: `OBSERVED` only through DEC-0046's single transient collection observation. Field semantics, personal-data classification, detailed response shape, rate/pagination/retention conditions, and release fit: `UNRESOLVED`. Reviewer: Maintainer. Recommendation under the source-assessment protocol: `BLOCKED_PENDING_OWNER_DECISION`. |

## 3. Evidence-limited field screen

This screen records only field names and types already retained in the
value-free DEC-0046 result. It does not establish their definitions, values,
or legal classification.

| Observed field name | Observed type(s) | Handling implication |
| --- | --- | --- |
| `BillTypeID` | `number` | Meaning and relationship to any source-defined type are unassessed. No Tier 1 claim. |
| `FullName` | `string` | Content and personal-data implications are unassessed. Do not retain or expose. |
| `ID` | `number` | Identifier-like name only; stability, meaning, and permitted use are unassessed. |
| `PersonID` | `number`, `null` | Identifier-like field. Treat as potentially linkable personal data until a route-specific assessment establishes otherwise. |
| `Reference` | `string` | Content and semantics are unassessed. Do not retain or expose. |
| `ShortName` | `string` | Content and personal-data implications are unassessed. Do not retain or expose. |
| `ThirdPartyOrganisation` | `string`, `null` | Third-party and possible personal-data implications are unassessed. Treat restrictively. |

## 4. Consequences and next gate

The Bills collection route remains in the DEC-0045 inclusion-first inventory,
but its current operational state is `DO_NOT_CAPTURE_OR_RELEASE`. That is a
handling block, not a retirement from eventual intended scope.

The smallest useful next action, if the owner wishes to continue source
reconnaissance, is a separately proposed **transient Bills detail-observation
package**. It must describe an exact, non-retained identifier-selection method
and bounded detail request(s), retain only value-free response-shape/classification
evidence, and include no capture, cache, proxy, DB1, DB2, frontend, or public
action. A later capture/proxy proposal remains blocked until the unresolved
terms, personal-data, operating-condition, retention, and access-control
conditions are resolved.

## 5. Decision record

DEC-0047 records the owner's authority for this documentation-only handling
assessment. It authorises no source request or data action. The assessment's
restrictive outcome prevents such action unless a later exact owner-approved
package supplies the missing evidence and constraints.
