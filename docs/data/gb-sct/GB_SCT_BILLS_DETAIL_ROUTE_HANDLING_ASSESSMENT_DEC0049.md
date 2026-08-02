# GB-SCT Bills Detail Route-Handling Assessment — DEC-0049

**Status:** `UNRESOLVED` — completed restrictive handling assessment; no
capture, proxy, DB1, DB2, or public output authorised

**Version:** 1.0.0

**Assessment date:** 2 August 2026

**Authority:** DEC-0049, owner instruction to complete the Bills detail
route-handling assessment on 2 August 2026

## 1. Purpose and outcome

This is the completed DEC-0008 route-level handling record for the GB-SCT
Bills **detail** route. It applies the source-terms qualification
([`GB_SCT_BILLS_ROUTE_QUALIFICATION_RESULT_2026-08-02.md`](GB_SCT_BILLS_ROUTE_QUALIFICATION_RESULT_2026-08-02.md))
and the value-free detail observation
([`GB_SCT_BILLS_DETAIL_OBSERVATION_RESULT_2026-08-02.md`](GB_SCT_BILLS_DETAIL_OBSERVATION_RESULT_2026-08-02.md)).

The evidence does not support raw capture, DB1, pass-through, native access,
canonical output, or any data release. `/api/bills/:id` is therefore
`DO_NOT_CAPTURE_OR_RELEASE` unless a later owner-approved package resolves the
stated conditions. This is a handling block, not retirement from DEC-0045's
inclusion-first endpoint inventory. It is not a source request, capture,
retention exception, source registry release, or implementation authority.

## 2. Required handling record

| Required field | Record |
| --- | --- |
| Source and route scope | Source ID: `GB-SCT-OPEN-DATA`. Exact route form: `GET https://data.parliament.scot/api/bills/:id`. This assessment retains no resolved identifier and excludes all query parameters, collection/pagination/follow-up forms, every other route, and every operational request. |
| Purpose and necessity | The route is one of the approved DEC-0007 Bills forms, intended after qualification for transparent native access and DB1 preservation. A route-level handling assessment is required before any capture or data-interface proposal can be considered. |
| Source authority and terms | The Scottish Parliament Corporate Body is evidenced as Open Data website operator. The published copyright licence supplies a conditional reuse framework for covered information, including attribution and no implied endorsement; it excludes personal data. It does not establish that every Bills detail response field is covered, or route-specific access, rate, caching, parameter, retention, or other operating conditions. Assessment: `PARTIAL_OR_CONDITIONAL`. |
| Content and risk screen | One transient detail observation retained seven field names/types only, not values. `PersonID` was identifier-like and numeric in that one response; `ThirdPartyOrganisation` was present and null. Their meanings and data-protection treatment are unassessed. The string fields may contain identifying or other content. Parameter/identifier stability, error shape, response variation, volume, historical coverage, and linking/re-identification risk remain unresolved. |
| Minimisation decision | No source content is collected, retained, or exposed under this record. The only retained evidence is the value-free detail schema/transport result and terms assessment. A future request needs its own exact route, identifier/parameter method, cap, response ceiling, retention boundary, and disposal rule; this record cannot widen scope. |
| Raw-capture handling class | `DO_NOT_CAPTURE_OR_RELEASE`. Do not retain raw bytes, response values, resolved identifier, resolved URL, response digest, cache, fixture, screenshot, or log payload. |
| DB1 handling class | `DO_NOT_CAPTURE_OR_RELEASE`. Do not create projections, indexes, typed fields, unparsed payload, database rows, or record-to-capture lineage. |
| Public provenance class | `PUBLIC_PROVENANCE_ONLY` for non-content materials only: this assessment, the terms qualification, the value-free detail result, methods, limitations, and later non-content decision/verification records. This does not permit public source-content copies or values. |
| Public output class | No public output. Neither `PUBLIC_NATIVE_ACCESS` nor `PUBLIC_CANONICAL` is qualified. No beta interface, download, API response, chart, or source-content example is permitted. |
| Retention and review | No source content exists to retain. Retain the non-content assessment and linked non-content evidence under DEC-0008. Review before any Bills detail capture/proxy/DB1/public-output proposal, on a relevant terms or schema change, on a rights/privacy concern, or by 1 September 2026, whichever occurs first. |
| Access and accountable role | Maintainer owns the non-content assessment record; the project owner controls future scope approval. No raw or DB1 asset exists. Any future content-bearing asset requires named roles, least-privilege controls, audit requirements, and separately approved implementation. |
| Correction/restriction/removal process | A source correction, rights/privacy concern, contradictory terms evidence, or schema-drift indication preserves or restores `DO_NOT_CAPTURE_OR_RELEASE`, records the reason category/date, and updates this assessment or a successor without source values. No captured content exists to delete or withdraw. |
| Stop conditions | Stop any future proposal if it cannot establish applicable terms/allowed use, a proportionate personal-data assessment, exact parameter/request conditions, retention compatibility, accountable access controls, or a truthful public-output boundary. Stop also if it would need a credential, cookie, redirect, unapproved query/identifier/request, raw-value retention, database/file write, or source-content publication not explicitly authorised. |
| Evidence and status | Terms/authority: `PARTIAL_OR_CONDITIONAL` under DEC-0044. Detail response shape: `OBSERVED` only through DEC-0048's one transient detail request. Field semantics, identifier stability, personal-data classification, rate/parameter/retention conditions, and release fit: `UNRESOLVED`. Reviewer: Maintainer. Recommendation under the source-assessment protocol: `BLOCKED_PENDING_OWNER_DECISION`. |

## 3. Evidence-limited detail field screen

This screen records only names/types/null states retained in the DEC-0048
value-free result. It establishes neither a field definition nor a value or
legal classification.

| Observed field name | Observed type(s) | Handling implication |
| --- | --- | --- |
| `BillTypeID` | `number` | Identifier-like name; source-defined type relationship unassessed. |
| `FullName` | `string` | Content and personal-data implications unassessed. Do not retain or expose. |
| `ID` | `number` | Identifier-like name only; stability, meaning, and permitted parameter use unassessed. |
| `PersonID` | `number` | Potentially linkable person identifier. Treat restrictively pending a route-specific assessment. |
| `Reference` | `string` | Content and semantics unassessed. Do not retain or expose. |
| `ShortName` | `string` | Content and personal-data implications unassessed. Do not retain or expose. |
| `ThirdPartyOrganisation` | `null` | Third-party and possible personal-data implications remain unassessed despite the single observed null. |

## 4. Consequences and next gate

Both Bills route forms now have independent `DO_NOT_CAPTURE_OR_RELEASE`
handling outcomes. This preserves the intended scope while visibly blocking
operational use until the evidence gap is resolved.

The smallest useful next step is a documentation-only **Bills family
qualification-gap resolution proposal**. It should consolidate the two
handling records, identify the exact missing route-specific terms,
personal-data, parameter/operating-condition, retention, and accountability
evidence, and distinguish which gaps require a future official-documentation
inspection from those requiring an owner policy decision. It must not request
source data, select an identifier, authorise capture, or imply that either
route can be exposed.

## 5. Decision record

DEC-0049 records the owner's authority for this documentation-only detail
handling assessment. It authorises no source or data action. Its restrictive
outcome remains effective unless a later exact owner-approved package supplies
the missing evidence and constraints.
