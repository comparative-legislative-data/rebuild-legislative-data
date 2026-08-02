# GB-SCT API Catalogue Assessment — 31 July 2026

**Status:** Observed catalogue assessment; no listed API endpoint was called

**Assessment ID:** GB-SCT-CATALOGUE-0001

**Authorising decision:** DEC-0013

**Inspection window (UTC):** 2026-07-31T19:07:58Z
**Target:** `https://data.parliament.scot/#/api-list`

## 1. Scope and method

This record is limited to the rendered API catalogue page. No listed API
endpoint was opened or requested, no raw response was saved, and no data was
captured, parsed, ingested, or published. The record paraphrases visible
catalogue descriptions and does not retain the page body as a raw artefact.

The page title observed was **Scottish Parliament Open Data**. The page
describes its APIs as JSON-only functions returning a “contracted return” and
its footer links to “The Scottish Parliament | Pàrlamaid na h-Alba”. This is
evidence of the host’s stated identity, not an independent assessment of
authority, licence, access terms, or data quality.

## 2. Observed relevant API groups

| API group | Observed catalogue statement | Initial classification |
| --- | --- | --- |
| `Bills` | Collection and identifier routes are listed; the collection is described as returning Bill Title objects. | Candidate first-slice core. |
| `BillStages`, `BillStageTypes`, `BillTypes` | Collection and identifier routes are listed and described as bill-stage, stage-type, and bill-type objects. | Candidate first-slice core. |
| `Sessions` | Collection and identifier routes are listed and described as session objects. | Candidate first-slice core. |
| `Members` | Collection and identifier routes are listed and described as member objects. | Candidate first-slice supporting entity. |
| Member roles, parties, and election-status groups | Several member-related groups are listed, including party, government-role, party-role, and election constituency/region status. | Candidate supporting scope; temporal semantics are unassessed. |
| `Committees` and committee type/role groups | Committee, committee type/link, and role groups are listed. | Candidate supporting scope; relationship to a first bill slice is unassessed. |
| `Motionsquestionsanswers*` | Motion, event, event-link, event-type/subtype, support, and question groups are listed. The business route is described as returning Bill Timetable motions for `motionfilter=consideration` and Chamber Agenda motions for `motionfilter=programme`. | Candidate future-scope group; do not include in the first slice yet. |
| `Orscommitteemeeting` | Identifier and year-specific routes are listed; entries are described as Official Report Contributions. | Candidate future-scope group; do not include in the first slice yet. |
| `orsplenarymeeting` | Identifier and year-specific routes are listed; entries are described as Official Report Contributions. | Candidate future-scope group; do not include in the first slice yet. |
| `Votesmotion` | Identifier and year-specific routes are listed; entries are described as votes on motions. | Candidate future-scope group. |
| Petitions | Outside the owner’s intended first-slice direction. | Not assessed for availability or suitability. |

## 3. Interpretation limits

The catalogue establishes endpoint names and brief stated object descriptions
only. It does **not** establish:

- any response schema, field definition, identifier relationship, null
  behaviour, pagination, chronology, licence, or access policy;
- whether a bill is explicitly tagged in motion or official-report records;
- the size, completeness, update behaviour, or practical retrieval cost of the
  motion, motion-answer, plenary-report, or committee-report groups; or
- Tier 1 or Tier 2 usability for any variable.

The owner’s expectation that the four high-volume content groups may lack
explicit bill linkage is therefore retained as a `CANDIDATE` concern, not a
confirmed catalogue finding.

## 4. Assessment outcome

**Recommendation:** `REVISE_SLICE_OR_METHOD`

The catalogue supports a deliberately narrow candidate first slice centred on
`Bills`, `BillStages`, `BillStageTypes`, `BillTypes`, and `Sessions`, with
`Members` considered only as a supporting entity where a defined first variable
requires it. The motion, motion-answer, committee official-report, plenary
official-report, and vote-on-motion groups should remain explicitly in future
scope rather than be silently dropped.

The next owner decision is DEC-0007: approve, reject, or revise the complete
selected endpoint inventory and variable roadmap. Any later direct endpoint
request, including a minimal raw capture needed to establish fields, requires a
separate approved capture/proxy/DB1 proposal and compliance with DEC-0008.
