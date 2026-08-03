# GB-SCT High-Volume Route Audit Result — 2 August 2026

**Status:** PARTIAL PASS — full transient response audits completed where the
source completed; no capture, mirror, proxy, canonical-variable, or release
authority

**Authority:** DEC-0055 v1.1.0

## 1. Method

The project owner requested that the unpaginated firehose routes be audited
with longer time limits. Each successful audit used an extended (up to
five-minute) public request, streamed the complete response into an in-memory
metadata analyser, emitted only aggregate findings, and discarded the body. No
payload, source-text excerpt, identifier, cache, download, database row, or
proxy output was created.

This is a route-form audit, not a historical harvest. One representative year
does not establish whole-series completeness.

## 2. Completed full-response audits

| Route form | Full response volume and observed structure | Research/operating implication |
| --- | --- | --- |
| `/api/votesmotion?year=2011` | 13,288,642 bytes; 13,440 array elements. Top-level fields are `ID`, `Detail`, `Motion`, `Person`, `Time`, and `UpdatedElasticDate`. The observed vote-time path is `Time.Start`/`Time.End`, each covering 2011-06-01 to 2011-12-22. `UpdatedElasticDate` covers 2023-06-03 to 2026-05-21. | Annual route responses can be substantial but retrievable. The update-index date is not the vote date and must not be treated as one. No vote-to-bill claim follows. |
| `/api/orscommitteemeeting?year=2025` | 150,496,374 bytes; 82,017 array elements. Observed nested groups include meeting, committee, time, item-of-business, person, contribution detail, and `UpdatedElasticDate`. `Time.Start` spans 2025-01-07 to 2025-12-18. | A single annual committee-report response is about 150 MB. It is unsuitable for naïve routine polling, but technically auditable as a transient whole response. Text and person/contribution fields require later handling and extraction design. |
| `/api/orsplenarymeeting?year=2025` | 123,955,194 bytes; 31,843 array elements. It has the same broad nested groups, with plenary-specific item-of-business and contribution-text fields. `Time.Start`/`Time.End` span 2025-01-07 to 2025-12-18. | A single annual plenary-report response is about 124 MB. The future DB1 design must make annual retrieval, run manifests, resumability, checksums, and reconciliation explicit. |
| `/api/motionsquestionsanswersmotions` | 110,378,953 bytes; 84,634 array elements. It includes identity/event/type/representational references; title and text fields; status/interest flags; and date fields. `ApprovedDate`/`SubmissionDateTime` span 1999-05-12 to 2026-07-30; non-null `MeetingDate` values span 1999-05-17 to 2026-06-24. | The complete motions route is technically retrievable but is a 110 MB whole-history response. The observed dates are source field values, not complete motion-history or bill-linkage evidence. |
| `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | 3,566,890 bytes; 1,620 array elements. It has the same broad motion fields as the consideration filter. `ApprovedDate`/`SubmissionDateTime` span 1999-06-07 to 2026-06-24; non-null `MeetingDate` values span 1999-06-08 to 2026-06-23. | This documented filter is substantially smaller than the whole-motion route, but still cannot imply a complete programme-motion or bill-timetable series. |
| `/api/Orscommitteemeeting/:id` | A transient nested contribution identifier yielded HTTP 200 with an empty JSON object. | This shows only that the candidate produced an empty response. It does not establish the intended identifier or data semantics. |
| `/api/orsplenarymeeting/:id` | A transient nested contribution identifier yielded HTTP 200 with an empty JSON object. | Same limitation. |
| `/api/votesmotion/:id` | A top-level annual-response identifier returned HTTP 404 with an error object; a transient nested `Detail.ID` returned HTTP 200 with an empty JSON object. | Neither result establishes the intended detail-route key or a usable detail contract. |

The observed official-report payloads have no pagination field or link in their
reported structures. This is evidence of the observed response shape, not a
published API contract claim.

## 3. Completed annual-response volume samples

The following complete reads were sent to a null sink; only HTTP status,
response size, and elapsed transfer time were retained. They show operational
variation between years, not historical coverage or content completeness.

| Route form / year | HTTP status | Bytes | Transfer time |
| --- | ---: | ---: | ---: |
| Committee official report / 1999 | 200 | 47,487,299 | 5.60 s |
| Committee official report / 2025 | 200 | 150,496,374 | full structural audit; elapsed time not retained |
| Committee official report / 2026 | 200 | 42,451,832 | 4.47 s |
| Plenary official report / 1999 | 200 | 35,293,021 | 4.05 s |
| Plenary official report / 2025 | 200 | 123,955,194 | full structural audit; elapsed time not retained |
| Plenary official report / 2026 | 200 | 64,879,056 | 8.35 s |
| Votes on motions / 2011 | 200 | 13,288,642 | full structural audit; elapsed time not retained |
| Votes on motions / 2026 | 200 | 19,441,521 | 2.50 s |
| Questions / 2026 documented year form | 200 | 6,526,940 | 2.16 s |

## 4. Extreme-volume route finding

The broad `/api/motionsquestionsanswersevents` collection did not complete a
full response audit within the extended execution window. Together with its
earlier failure to return headers within 30 seconds, this is sufficient to mark
it as an extreme-volume/high-latency route pending a lower-cost documented
filter or a later approved operational retrieval design. It has not been
retired from scope.

The whole `/api/motionsquestionsanswersquestions` and
`/api/motionsquestionsanswerssupports` collections also did not complete a
full-body metadata audit in the current execution environment. The documented
2026 questions-year form did complete at 6.5 MB, so the problem is the
unfiltered questions collection rather than that annual form. These are
transparent non-completion findings, not an availability, coverage, or
semantic conclusion.

## 5. Small MQA detail and link-form audit

| Route form | Observed result | Limitation |
| --- | --- | --- |
| `/api/motionsquestionsanswerseventtypes/:id` | HTTP 200 object with the same two fields as the two-record collection: event-type identifier and label. | One transient detail comparison only; no taxonomy semantics inferred. |
| `/api/motionsquestionsanswerseventsubtypes/:id` | HTTP 200 object with the same four fields as the 18-record collection: subtype and type identifiers, label, and introductory text. | One comparison only; text-content handling and semantics remain unassessed. |
| `/api/motionsquestionsanswerseventlinks?childUniqueId=:id` | HTTP 200 array; one observed element; the three link identifier fields. | Link-direction semantics remain unassessed. |
| `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id` | HTTP 200 array; one observed element; the same three link fields. | Same limitation. |
| `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | HTTP 200 array; one observed element; the same three link fields. | Same limitation. |

## 6. Implication for later DB1 work

The project should not design high-volume routes as “poll and overwrite”. A
future approved DB1 package needs, at minimum: route/year work units where the
source supports them; immutable run manifests; byte and content hashes;
explicit incomplete/failed-run states; bounded retries; independent
reconciliation/lookback rules; and retained source/retrieval timestamps. That
is a future design requirement, not implementation authority.

## 7. Next work

Complete the remaining MQA motion/event/question/support detail forms where a
safe transient identifier can be obtained, then audit older/current report and
vote annual samples. Produce one route-by-route operational profile, clearly
separating full audit, transport-only profile, observed empty-detail behaviour,
and still-unobserved forms.
