# GB-SCT Endpoint Inventory Proposal — DEC-0007

**Status:** Proposed for owner decision; no capture or implementation authorised

**Version:** 0.1.0

**Prepared:** 31 July 2026

**Decision requested:** DEC-0007

**Evidence:** [`GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md`](GB_SCT_API_CATALOGUE_ASSESSMENT_2026-07-31.md) and [`GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md`](GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md)

## 1. Decision requested

Approve the selected route inventory below as the full GB-SCT scope to be
preserved through a later capture-backed native-access surface and represented
in DB1. The decision separates that preservation scope from the much smaller
set of future Tier 1/2 candidates.

This is the complete **selected** inventory, not a claim to select every route
in the Scottish Parliament catalogue. It does not approve any external request,
capture, proxy, database, code, public API, data release, or chart.

## 2. Selected endpoint inventory

For every route form in this table, both the proposed native-access and DB1
status are `PROPOSED`. A later implementation proposal must be capture-backed,
versioned, loss-aware, and lineage-preserving as required by
[`PROJECT_DESIGN.md`](PROJECT_DESIGN.md). It may not call either layer a live
pass-through or a 1:1 upstream mirror.

| Inventory group | Exact selected source route forms | Why retain it | Immediate Tier 1/2 roadmap | Deferred or unresolved work |
| --- | --- | --- | --- | --- |
| Bills and formal stage reference | `/api/bills`; `/api/bills/:id`; `/api/billstages`; `/api/billstages/:id`; `/api/billstagetypes`; `/api/billstagetypes/:id`; `/api/billtypes`; `/api/billtypes/:id` | Core bill identity and source-defined formal progression. | Candidate native fields for source identities, titles, stages, and type references **only if** a later schema assessment establishes them; candidate deterministic bill-stage ordering only after relationship and temporal rules are specified. | Any substantive outcome or comparative-stage interpretation; no field semantics are yet established. |
| Sessions | `/api/sessions`; `/api/sessions/:id` | Session boundaries and temporal context. | Candidate native session identifiers and source-supplied boundaries; candidate deterministic assignment of a record to a session only after boundary semantics and conflict rules are validated. | Meaning of every date/boundary field is unresolved. |
| MSP identity and electoral geography | `/api/members`; `/api/members/:id`; `/api/memberelectionconstituencystatuses`; `/api/memberelectionconstituencystatuses/:id`; `/api/memberelectionregionstatuses`; `/api/memberelectionregionstatuses/:id`; `/api/constituencies`; `/api/constituencies/:id`; `/api/regions`; `/api/regions/:id` | Retain time-sensitive MSP and representation context. | Candidate native identities and source status records; candidate deterministic “MSP/constituency/region at date” variable only after interval semantics, inclusivity, and gaps are validated. | Any resolution of conflicting or missing representation periods. |
| Party and government context | `/api/parties`; `/api/parties/:id`; `/api/memberparties`; `/api/memberparties/:id`; `/api/partyroles`; `/api/partyroles/:id`; `/api/memberpartyroles`; `/api/memberpartyroles/:id`; `/api/governmentroles`; `/api/governmentroles/:id`; `/api/membergovernmentroles`; `/api/membergovernmentroles/:id` | Retain party affiliation, party role, and ministerial/government-role context without treating it as timeless. | Candidate native source records; candidate deterministic party or government role at a stated reference date only after interval and relationship validation. | All claims about political affiliation or ministerial status at a point in time remain unresolved. |
| Committees and committee reference | `/api/committees`; `/api/committees/:id`; `/api/committeeroles`; `/api/committeeroles/:id`; `/api/committeetypes`; `/api/committeetypes/:id`; `/api/committeetypelinks` | Retain committee entities and role/type reference needed for future bill and MSP context. | Candidate native committee/role/type values if fields are confirmed. | MSP–committee membership and bill–committee assignment are explicitly unresolved; the selected routes do not establish those links from catalogue metadata alone. |
| Motions, questions, answers and event structure | `/api/motionsquestionsanswersevents`; `/api/motionsquestionsanswersevents/:id`; `/api/motionsquestionsanswerseventtypes`; `/api/motionsquestionsanswerseventtypes/:id`; `/api/motionsquestionsanswerseventsubtypes`; `/api/motionsquestionsanswerseventsubtypes/:id`; `/api/motionsquestionsanswerseventlinks`; `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id`; `/api/motionsquestionsanswersmotions`; `/api/motionsquestionsanswersmotions/:id`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`; `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme`; `/api/motionsquestionsanswersquestions`; `/api/motionsquestionsanswersquestions/:id`; `/api/motionsquestionsanswersquestions?year=:year`; `/api/motionsquestionsanswerssupports`; `/api/motionsquestionsanswerssupports/:id` | Preserve the full selected structured motion/question/event context for later research, including the two explicitly documented business-motion filters. | Source-native records may become Tier 1 only at confirmed field level. No bill-related Tier 1/2 variable is proposed from this group now. | Bill-stage, financial-resolution, amendment, vote, or answer linkage; query-year semantics; no separately named `...answers` route was observed. |
| Committee official-report contributions | `/api/Orscommitteemeeting/:id`; `/api/orscommitteemeeting?year=:year` | Preserve source contributions for future committee Stage 1/2 and amendment research. | No analytical Tier 1/2 variable is proposed. A later schema assessment may identify native contribution fields, but that does not establish their legislative meaning. | Stage 1/2 classification, bill linkage, amendment extraction, speaker/committee linkage, and document parsing are deferred Tier 3+ or unresolved. |
| Plenary official-report contributions | `/api/orsplenarymeeting/:id`; `/api/orsplenarymeeting?year=:year` | Preserve source contributions for future Stage 1/3 debate and amendment research. | No analytical Tier 1/2 variable is proposed. | Stage 1/3 classification, bill linkage, amendment extraction, and document parsing are deferred Tier 3+ or unresolved. |
| Votes on motions | `/api/votesmotion/:id`; `/api/votesmotion?year=:year` | Preserve source vote-on-motion records, including possible votes on amendments to motions. | No bill-stage, financial-resolution, or bill-amendment Tier 1/2 variable is proposed. Native vote fields can be considered only after field semantics are assessed. | A vote on an amendment to a motion is not a vote on an amendment to a bill. The owner reports that bill amendments do not have an API endpoint; that source-scope statement remains unverified until a later document-source assessment. Linking a vote to a bill, stage, financial resolution, or bill amendment is therefore unresolved and may require a different approved method. |

### 2.1 Documented parameter limits

The proposal selects only the parameter forms visibly documented in the
catalogue. No undocumented filters, pagination grammar, or query options are
authorised by this proposal.

- `:id` means the source's displayed identifier route; the catalogue describes
  most as unique identifiers, while the questions route is described in terms
  of a main unique identifier.
- Motion event-link queries use only `childUniqueId`, `mainUniqueId`, and
  `parentUniqueId` in the forms shown above.
- Business motions use only `motionfilter=consideration` and
  `motionfilter=programme`.
- The only selected year-partition forms are the explicitly listed question,
  committee-report, plenary-report, and vote-on-motion routes. The catalogue
  currently enumerates committee years 1999–2024, plenary years 1999–2025, and
  vote years 2011–2025; those listings are documentation evidence, not a
  historical coverage claim.

## 3. Explicit exclusions

The following are intentionally outside this proposed selected inventory:

- petitions and their supporting route families;
- cross-party-group routes, addresses/contact details, interests, allowances,
  research, websites, and unrelated catalogue groups;
- any route, filter, endpoint family, or field not named in section 2; and
- a hypothetical route named `Motionsquestionsanswersanswers`, which was not
  visibly listed. Its absence here is a non-finding, not a claim about source
  availability.

## 4. Native access and DB1 contract for the later proposal

For a selected route to move from `PROPOSED` to implemented, a later
capture/proxy/DB1 proposal must state:

1. source authority, licence, personal-data, access, pagination, rate, and
   retention evidence;
2. exact request form, observed response schema, failure and drift handling,
   and retrieval coverage strategy;
3. immutable capture and manifest requirements, including request metadata,
   response digest, timestamp, and route/parameter provenance;
4. the native-access query contract, which must expose capture/build identity
   and never silently retrieve a mutable upstream response; and
5. the DB1 projection schema, raw/unparsed payload retention, record-to-capture
   lineage, rejected-value handling, and reproducibility checks.

## 5. Deferred document-based programme

The following material is deliberately **outside the API inventory** and will
be considered only after the API-based capture, DB1, Tier 1/2, and chart work
has been completed and reviewed:

- bills and accompanying published documents;
- marshalled lists of amendments to bills;
- minutes of meetings; and
- other bill-related documentary material identified through a later source
  assessment.

This is not a determination that any document exists for every bill or that a
particular document establishes a particular fact. The programme requires its
own owner-approved source inventory, retention and personal-data assessment,
capture proposal, and Tier 3+ extraction/coding methodology. It must not be
folded into the API work by calling document-derived material native API data.

## 6. Variable-roadmap status

No variable is `SPECIFIED`, `IMPLEMENTED_NOT_VALIDATED`, or released by this
proposal. The “candidate” language above identifies research concepts that may
become:

- `NATIVE_DIRECT` only where the exact source field is later observed and its
  field semantics are documented; or
- `DERIVED_DETERMINISTIC` only where inputs, joins, temporal rule, null and
  conflict treatment, edge cases, and validation have been approved.

The report and vote families are retained deliberately even though their
bill-related analytical use is presently `DEFERRED_TIER_3_PLUS` or
`UNRESOLVED`. Preservation is not a shortcut around the tier requirements.

## 7. Stop conditions and next gate

Stop a subsequent capture/proxy/DB1 proposal for any affected route if source
authority, licence, personal-data handling, access conditions, response shape,
identifier semantics, pagination, historical coverage, or retention policy is
unknown in a way that would affect the proposed work. Record the block rather
than substituting an assumption.

If DEC-0007 is approved, the next documentation gate is DEC-0008 together with
a separate, bounded capture/proxy/DB1 proposal. After the API-based programme
has completed, a distinct document-source proposal may be prepared. No source
request follows from DEC-0007 itself.
