# GB-SCT MQA First-Pass Reconnaissance Result — 2 August 2026

**Status:** PARTIAL PASS — public route profiling only; no capture, mirror,
proxy, canonical-variable, or release authority

**Authority:** DEC-0055

**Cohort:** Motions, questions, answers, events, supports, and their selected
documented collection/filter forms (MQA)

## 1. Method and boundary

This was a deliberately light first pass to separate usable small collections
from the source's high-volume collections. Public unauthenticated `GET`
requests used no body or undocumented parameters. A response body was cancelled
after 2 MiB; non-responsive requests had a 30-second cap. No raw payload,
identifier, source-text example, cache, download, database row, or proxy output
was created.

`PARTIAL PASS` means that the indicated route form was reached and profiled to
the stated limit. It does not mean that its fields, coverage, semantics,
pagination, relationships, or operational suitability are established.

## 2. Collection and bounded-form observations

| Route family / form | Observed result | Immediate consequence |
| --- | --- | --- |
| Event types collection | 2 records; fields `EventTypeID`, `EventType`; 81 bytes; no date field. | Small reference taxonomy; detail form and meaning remain unassessed. |
| Event subtypes collection | 18 records; fields `EventSubTypeID`, `EventTypeID`, `EventSubType`, `IntroText`; 1,603 bytes; no date field. | Small reference taxonomy; the text field needs later handling/semantic assessment. |
| Event links collection | 5,721 records; fields `ChildUniqueID`, `MainUniqueID`, `ParentUniqueID`; 406,192 bytes; no date field. | Collection is technically modest, but the direction and meaning of its relationships are unassessed. |
| Events collection | No headers returned before the 30-second cap. | Treat as a high-latency/volume route until a bounded source-supported method is identified. |
| Motions collection | HTTP 200 JSON, no declared content length, body cancelled after 2 MiB. | Responsive but above the first-pass body ceiling; schema and coverage need a bounded approach. |
| Business motions — `motionfilter=consideration` | 1,461 records, 1,280,832 bytes; 22 fields. Date values: `ApprovedDate` and `SubmissionDateTime` span 1999-10-04 to 2026-06-23; `MeetingDate` spans 1999-10-06 to 2026-06-23 (1,447 non-null). | This documented filter is small enough for later aggregate profiling. Dates are observed field values, not a completeness or bill-linkage claim. |
| Business motions — `motionfilter=programme` | HTTP 200; body cancelled after 2 MiB. | Above the first-pass body ceiling; needs a bounded profile. |
| Questions collection | No headers returned before the 30-second cap. | Treat as a high-latency/volume route until a bounded source-supported method is identified. |
| Questions — documented `year` forms (1999, 2011, 2025 samples) | Each returned HTTP 200 but exceeded 2 MiB before shape/schema inspection. | The documented filter works at transport level but is not, by itself, a small inspection unit. It cannot yet demonstrate annual coverage. |
| Supports collection | No headers returned before the 30-second cap. | Treat as a high-latency/volume route until a bounded source-supported method is identified. |

For the four responsive routes where headers were recorded, the response
pattern remained `Cache-Control: no-cache`, with no `ETag` or `Last-Modified`.
That is consistent with the prior update-signal sample, but not a claim about
every MQA form.

## 3. Research and operating implications

1. The MQA family is operationally heterogeneous: its taxonomies and link
   collection are tractable; core event/question/support collections are not
   suitable for naïve whole-collection polling; the documented consideration
   filter is tractable while the programme filter is not at this ceiling.
2. The initial observed date span for consideration motions is from late 1999
   to mid-2026. It does **not** establish the full history of motions,
   questions, answers, events, supports, votes, or any bill-related activity.
3. No assessment has established a motion-to-bill link, a stage vote, a
   financial-resolution vote, or a bill-amendment vote. In particular, future
   votes on amendments to motions must remain distinct from amendments to
   bills.
4. Before DB1 design, this cohort needs a source-supported bounded retrieval
   strategy for large forms, plus an update/reconciliation design that does not
   rely on source validators.

## 4. Next work

Complete the small taxonomy/detail forms and identify safe bounded strategies
for the high-volume MQA routes. Separately profile the documented votes-on-
motions year forms to test the reported 2011 start, always recording observed
source coverage rather than treating it as a completeness claim.
