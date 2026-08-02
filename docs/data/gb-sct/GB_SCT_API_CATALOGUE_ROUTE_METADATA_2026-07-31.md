# GB-SCT API Catalogue Route Metadata — 31 July 2026

**Status:** Observed rendered-catalogue metadata; no listed API endpoint was called

**Assessment ID:** GB-SCT-CATALOGUE-0002

**Authority record:** DEC-0015

**Target:** `https://data.parliament.scot/#/api-list`

## 1. Scope and limits

This is a route-metadata supplement to
[`GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`](GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md).
It records only route shapes, documented query forms, and short object
descriptions visible on the rendered catalogue. No example link or API route
was opened; no response bytes, source records, schema, or field values were
received, retained, parsed, or assessed.

The catalogue's display of a route does not establish that it is complete,
stable, paginated, suitable for capture, or semantically adequate for any
research variable. It is route-discovery evidence only.

## 2. Observed route forms relevant to the proposed inventory

| Group | Route forms visibly listed in the catalogue | Catalogue-level description / limit |
| --- | --- | --- |
| Bills | `/api/bills`; `/api/bills/:id` | Collection and unique-identifier route for Bill Title objects. |
| Bill stages | `/api/billstages`; `/api/billstages/:id` | Collection and unique-identifier route for Bill Stage objects. |
| Bill-stage types | `/api/billstagetypes`; `/api/billstagetypes/:id` | Collection and unique-identifier route for Bill Stage Type objects. |
| Bill types | `/api/billtypes`; `/api/billtypes/:id` | Collection and unique-identifier route for Bill Type objects. |
| Sessions | `/api/sessions`; `/api/sessions/:id` | Collection and unique-identifier route for SESSION objects. |
| Members | `/api/members`; `/api/members/:id` | Collection and unique-identifier route for MEMBER objects. |
| Member constituency status | `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id` | Collection and unique-identifier route. |
| Member region status | `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id` | Collection and unique-identifier route. |
| Constituencies and regions | `/api/constituencies`; `/api/constituencies/:id`; `/api/regions`; `/api/regions/:id` | Collection and unique-identifier routes. |
| Parties and member-party records | `/api/parties`; `/api/parties/:id`; `/api/memberparties`; `/api/memberparties/:id` | Collection and unique-identifier routes. |
| Party-role context | `/api/partyroles`; `/api/partyroles/:id`; `/api/memberpartyroles`; `/api/memberpartyroles/:id` | Collection and unique-identifier routes. |
| Government-role context | `/api/governmentroles`; `/api/governmentroles/:id`; `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` | Collection and unique-identifier routes. |
| Committees | `/api/committees`; `/api/committees/:id`; `/api/committeeroles`; `/api/committeeroles/:id`; `/api/committeetypes`; `/api/committeetypes/:id`; `/api/committeetypelinks` | Collection routes; identifier routes where listed. Catalogue text alone does not establish an MSP–committee or bill–committee relationship. |
| Motions/questions/answers events | `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswerseventtypes`; `/api/motionsquestionsanswerseventtypes/:id`; `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id` | Collection and unique-identifier routes. |
| Motion/event links | `/api/motionsquestionsanswerseventlinks`; `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | Catalogue describes link-object results for these documented query forms. Field/link semantics are unassessed. |
| Motions and business-motion selection | `/api/motionsquestionsanswersmotions`; `/api/motionsquestionsanswersmotions/:id`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | The latter two forms are described respectively as Bill Timetable and Chamber Agenda motions. No bill-linkage field is established. |
| Questions and supports | `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswersquestions?year=:year`; `/api/motionsquestionsanswerssupports`; `/api/motionsquestionsanswerssupports/:id` | Catalogue describes a numerical year input for questions and identifier routes. |
| Committee official reports | `/api/Orscommitteemeeting/:id`; `/api/orscommitteemeeting?year=:year` | Identifier route and year-specific Official Report Contribution route. The catalogue visibly enumerated years 1999–2024. |
| Plenary official reports | `/api/orsplenarymeeting/:id`; `/api/orsplenarymeeting?year=:year` | Identifier route and year-specific Official Report Contribution route. The catalogue visibly enumerated years 1999–2025. |
| Votes on motions | `/api/votesmotion/:id`; `/api/votesmotion?year=:year` | Identifier route and year-specific vote-on-motion route. The catalogue visibly enumerated years 2011–2025. |

## 3. Important non-findings

- No route called `Motionsquestionsanswersanswers` was visibly listed. This is
  not evidence that answer records do not exist; it is only a catalogue
  non-finding.
- No visibly named member-to-committee-association route was identified in the
  selected route forms. It must not be assumed that `Committees` or
  `Committeeroles` alone can establish membership.
- The catalogue did not establish field names, source identifiers shared across
  groups, pagination, historical coverage, licenses, personal-data treatment,
  or the meaning of a `year` partition.

## 4. Consequence

The accompanying endpoint-inventory proposal may identify a complete *selected
route set* and a capture/proxy/DB1 roadmap. A subsequent authorised capture and
schema assessment is still required before any field-level source registry,
Tier 1 variable, deterministic linkage, volume claim, or retrieval plan.
