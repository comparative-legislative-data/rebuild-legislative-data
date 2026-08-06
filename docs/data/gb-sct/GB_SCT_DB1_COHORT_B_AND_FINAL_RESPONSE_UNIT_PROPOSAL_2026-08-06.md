# GB-SCT DB1 Cohort B and final response-unit proposal

**Status:** proposed documentation and no-retention audit only  
**Date:** 6 August 2026  
**Proposed decision:** DEC-0119  
**Depends on:** DEC-0115, DEC-0117 and DEC-0118

## The decision this package is designed to make

The Database mirror must be a PostgreSQL-held, source-faithful mirror of the
Scottish Parliament API content approved for this project. It must not become a
per-record crawler simply because an API also offers a detail URL.

A source response unit and a database access form are different things:

- A response unit is one exact upstream response that DB1 retains unchanged in
  PostgreSQL, with raw bytes, JSONB where valid, request details and provenance.
- An access form is a way a researcher later obtains raw source content from
  DB1. It may be a whole retained response, or a clearly labelled raw object
  selected from a retained response where evidence shows the upstream detail or
  filter form returns that same object.

This does not hide or retire a detail form. It gives it an honest status:
either it is supported by the retained parent source response, or it remains a
visible gap requiring a different owner-approved source unit. No DB1 source
body, database, code, schedule or interface is authorised by this proposal.

## What is already known

- The approved long-term scope remains 64 API forms.
- The provisional matrix names 117 fixed or annual source response units for
  33 collection/annual forms.
- A limited first sample plus Cohort A produced 21 sampled detail/filter
  comparisons with no observed additional fields or different sampled object.
- Cohort A did not compare two Member election-status detail forms.
- Ten standard detail forms still need a comparison decision: the two
  Member-status forms; MQA events, event subtypes, motions, questions and
  supports; Committee Official Reports, Plenary Official Reports, and Votes on
  Motions.
- MQA event types already have a limited comparison result. Committee-type links
  and the two MQA motion-business routes have no paired detail form, so they do
  not need this comparison.

The word sampled remains important: the existing evidence is not a claim that
every identifier behaves identically.

## Cohort B: exact, no-retention source audit

### Purpose

Cohort B fills the ten remaining standard-detail evidence gaps so the owner can
choose a final response-unit model using evidence rather than guesswork. It
does not fetch a list of IDs, persist identifiers, or create a capture queue.

### Scope and request ceiling

At most **22** serial public GET requests:

| Comparison family | Parent request | Detail request | Planned requests |
| --- | --- | --- | ---: |
| Member constituency status | /api/memberelectionconstituencystatuses | matching ID detail form | 2 |
| Member region status | /api/memberelectionregionstatuses | matching ID detail form | 2 |
| MQA events | /api/motionsquestionsanswersevents | matching ID detail form | 2 |
| MQA event subtypes | /api/motionsquestionsanswerseventsubtypes | matching ID detail form | 2 |
| MQA motions | /api/motionsquestionsanswersmotions | matching ID detail form | 2 |
| MQA questions | /api/motionsquestionsanswersquestions | matching ID detail form | 2 |
| MQA supports | /api/motionsquestionsanswerssupports | matching ID detail form | 2 |
| Committee Official Reports | /api/orscommitteemeeting?year=2026 | matching ID detail form | 2 |
| Plenary Official Reports | /api/orsplenarymeeting?year=2026 | matching ID detail form | 2 |
| Votes on Motions | /api/votesmotion?year=2026 | matching ID detail form | 2 |
| Transport-retry allowance | only before a response body begins | same named route only | 2 maximum |

The 20 planned requests are the whole audit. The two allowance requests may be
used only for a pre-body network/transport failure. There is no retry after a
response body begins, no alternative parameter, and no new route.

For each pair, one ordinary source-provided value is held only in process
memory long enough to form the immediate paired detail request. The durable
result must not contain that value, any raw body, a raw object, a downloadable
file, or a hidden capture.

### Safety and proportionality

- One request at a time; no VPS, project API, proxy, database, code, or
  frontend access.
- 90-second request deadline and a 50 MiB maximum body read, chosen to permit
  a proper inspection of the known firehose families without turning the audit
  into bulk collection.
- The run stops reading an over-limit body and reports
  TRANSFER_LIMIT_REACHED. It does not work around the limit.
- A detail comparison uses the parent record only in memory. It neither stores
  nor repeats its value.
- Results retain only the named route, HTTP outcome, body-size class, JSON
  root, field names, comparison category and limitation.

## Results and decision rule

Each pair receives exactly one of:

| Result | Consequence for final response-unit design |
| --- | --- |
| SAMPLED_PARENT_MATCH | The relevant collection or annual response may be proposed as the source response unit; the detail form remains visible as a DB1 access form backed by the retained parent response, subject to the stated sample limit. |
| ADDITIONAL_CONTENT_OBSERVED | The parent cannot be proposed as sufficient for that detail form. The form remains a visible DB1 gap until a separate finite source-unit rule is approved. |
| STRUCTURALLY_DIFFERENT | Same as above: no parent-based access claim. |
| NO_RELIABLE_COMPARISON | No assumption. The affected form remains a visible gap. |
| SOURCE_UNAVAILABLE or TRANSFER_LIMIT_REACHED | Record the upstream/technical condition. Do not call it empty, completed or excluded. |

Cohort B cannot turn a sample into a universal parity claim. Its job is more
limited: decide whether the 117 named parent responses are a defensible initial
raw-content boundary, and identify any route that demonstrably needs a separate
finite source-unit design.

## Final response-unit model after Cohort B

If the evidence supports parent-based raw-content access, the next document
will replace the provisional matrix with one final, human-readable model:

1. **Raw PostgreSQL capture units:** every fixed or annual URL actually
   retained, with literal windows, cadence, request count, volume budget,
   exception handling and provenance fields. These are the rows containing the
   original bytes and JSONB in PostgreSQL.
2. **DB1 access-form mapping:** each of the 64 approved API forms mapped to:
   - a whole retained source response;
   - a source-faithful object/filter view over a named retained response, with
     direct capture lineage; or
   - a visible gap/source condition that cannot yet be represented.
3. **No hidden inference rule:** a DB1 request may select from a named
   PostgreSQL JSON response only by the documented source field and only after
   the source-form comparison above. It may not discover a new URL, request an
   unlisted identifier upstream, rename a source field, join records, or
   create a DB2 value.
4. **Transparency rule:** a future portal must say whether an item is the
   complete retained upstream response or a raw object selected from it, and
   identify the upstream source route and capture.

If one or more forms require independent raw responses, they are not forced
into the 117-unit baseline. The final matrix must name a separate,
owner-approved finite source input rule before they can be captured.

## What happens after the model is approved

Only then should the already-proposed A1 package be considered:

1. build the isolated PostgreSQL schema with synthetic responses only;
2. prove directly in SQL that raw bytes and queryable JSON live in the same
   database row, with no raw filesystem payload;
3. submit the exact source-ingest package, including total URLs, resource
   budget, schedule, response condition handling and acceptance evidence; and
4. keep the temporary backend test instrument separate from the future research
   portal.

This sequence is deliberately short. It replaces endpoint-by-endpoint
implementation with one response-unit model, one synthetic database proof, one
bounded full ingest, and one assurance package.

## Authority requested

Approve or amend **Cohort B only**: the maximum 22 public no-retention GET
requests described above. This does not authorise any DB1 capture, PostgreSQL
or VPS work, schedule, source-body storage, application change, deployment,
download or researcher portal.

