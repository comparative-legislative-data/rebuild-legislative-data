# Database mirror rebuild proposal

**Decision:** DEC-0114 — owner approved 6 August 2026  
**Status:** R1–R3 implementation authorised within the stated 117-unit, capacity and isolation boundaries  
**Scope:** GB-SCT Database mirror backend only

## Decision requested

Approve this response-unit design as the basis for one later, bounded Database mirror implementation package. Approval would not make a general claim that every possible Scottish Parliament API URL has been captured. It would approve an auditable starting baseline: exact source responses that can be named now, with explicit treatment of every form that cannot.

The later implementation package would require a fresh pre-flight against the same 117-unit matrix below. It may create only the isolated project Database mirror database, raw archive, worker and schedule. It may not change the Live API catalogue, DB2, the research portal, shared VPS services or another legislature.

## Plain-English product definition

The Database mirror is a dated copy of named Scottish Parliament API responses. For each copy, it retains the original response body with the URL, time, response status, size and checksum that identify it. It does not turn those fields into research variables, try to fill gaps, or make an immediate claim that the Scottish Parliament has not changed since the copy was made.

PostgreSQL is the correct database for this product: it will hold the capture registry, manifests, checksums, reconciliation history and future access indexes. The exact raw response bodies will be held unchanged in a separate, project-owned raw archive and referenced by checksum from PostgreSQL. This is one Database mirror product, not a hidden transformation layer or a DB2 precursor.

The initial researcher-facing work is deliberately **not** in this package. A temporary private ingest-test screen may later show only the evidence needed to check captures. It will be removed before a separately designed research portal is built.

## What is in scope

The approved programme inventory contains 64 Scottish Parliament API forms. Those 64 forms are the Database mirror scope. They are not 64 independent datasets to fetch:

- **33 forms have a fixed collection response or a bounded annual response.** They produce 117 named initial requests and are the proposed baseline.
- **31 forms require an identifier or filter value.** They are Database-mirror access methods over the retained collection/annual data. PostgreSQL can locate the requested source record or link without making another Scottish Parliament request.

This distinction is intentional. It is the correction to the withdrawn build, not a reduction of the approved source inventory. The mirror stores the source data once, then makes it accessible in more useful ways from PostgreSQL.

### Structure check completed before this proposal

On 6 August 2026, a read-only, non-retaining comparison tested the first
collection record and its matching detail response for 21 ordinary API pairs.
All 21 were exactly equal as JSON objects: Bills; bill stages; bill-stage types;
bill types; sessions; members; member constituency status; member region status;
constituencies; regions; parties; member parties; party roles; member party
roles; government roles; member government roles; committees; committee roles;
committee types; MQA event types; and MQA event subtypes.

This establishes the relevant technical point: for these routes, the `/:id`
endpoint is a way of retrieving one record from the collection, not a separate
source dataset. DB1 should retain the collection once and use PostgreSQL to
retrieve its stored records. The audit did not retain source responses and did
not query the large annual/whole-history families.

## Response-unit matrix

Every row below means one `GET` of the literal source URL shown. A fixed collection is retained as the response the source provides. An annual family is retained once for each named year; it is not expanded into record requests.

### Fixed collection responses — 29 requests

| Research subject | Source form | Exact retained URL | Why this is the unit | Initial requests | Reconciliation |
| --- | --- | --- | --- | ---: | --- |
| Bills and formal stages | Bills | `/api/bills` | Source collection response | 1 | Daily |
| Bills and formal stages | Bill stages | `/api/billstages` | Source collection response | 1 | Daily |
| Bills and formal stages | Bill-stage types | `/api/billstagetypes` | Source reference response | 1 | Daily |
| Bills and formal stages | Bill types | `/api/billtypes` | Source reference response | 1 | Daily |
| Sessions, members, constituencies and regions | Sessions | `/api/sessions` | Source reference response | 1 | Daily |
| Sessions, members, constituencies and regions | Members | `/api/members` | Source collection response | 1 | Daily |
| Sessions, members, constituencies and regions | Member constituency status | `/api/memberelectionconstituencystatuses` | Source collection response | 1 | Daily |
| Sessions, members, constituencies and regions | Member region status | `/api/memberelectionregionstatuses` | Source collection response | 1 | Daily |
| Sessions, members, constituencies and regions | Constituencies | `/api/constituencies` | Source reference response | 1 | Daily |
| Sessions, members, constituencies and regions | Regions | `/api/regions` | Source reference response | 1 | Daily |
| Parties and government roles | Parties | `/api/parties` | Source reference response | 1 | Daily |
| Parties and government roles | Member parties | `/api/memberparties` | Source collection response | 1 | Daily |
| Parties and government roles | Party roles | `/api/partyroles` | Source reference response | 1 | Daily |
| Parties and government roles | Member party roles | `/api/memberpartyroles` | Source collection response | 1 | Daily |
| Parties and government roles | Government roles | `/api/governmentroles` | Source reference response | 1 | Daily |
| Parties and government roles | Member government roles | `/api/membergovernmentroles` | Source collection response | 1 | Daily |
| Committees and committee roles | Committees | `/api/committees` | Source collection response | 1 | Daily |
| Committees and committee roles | Committee roles | `/api/committeeroles` | Source reference response | 1 | Daily |
| Committees and committee roles | Committee types | `/api/committeetypes` | Source reference response | 1 | Daily |
| Committees and committee roles | Committee-type links | `/api/committeetypelinks` | Source collection response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA events | `/api/motionsquestionsanswersevents` | Source whole-collection response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA event types | `/api/motionsquestionsanswerseventtypes` | Source reference response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA event subtypes | `/api/motionsquestionsanswerseventsubtypes` | Source reference response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA event links | `/api/motionsquestionsanswerseventlinks` | Source collection response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA motions | `/api/motionsquestionsanswersmotions` | Source whole-history response | 1 | Daily |
| Motions, questions, related records and votes on motions | Business motions — consideration | `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration` | Source fixed-filter response | 1 | Daily |
| Motions, questions, related records and votes on motions | Business motions — programme | `/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme` | Source fixed-filter response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA questions | `/api/motionsquestionsanswersquestions` | Source whole-collection response | 1 | Daily |
| Motions, questions, related records and votes on motions | MQA supports | `/api/motionsquestionsanswerssupports` | Source whole-collection response | 1 | Daily |

### Annual responses — 88 requests

| Research subject | Source form | Exact retained URL pattern and years | Why this is the unit | Initial requests | Reconciliation |
| --- | --- | --- | --- | ---: | --- |
| Motions, questions, related records and votes on motions | MQA questions by year | `/api/motionsquestionsanswersquestions?year=YYYY`, `YYYY = 2011…2026` | One source-supplied annual response per named year | 16 | Daily for 2026; weekly for 2011–2025 |
| Official reports | Committee official reports by year | `/api/orscommitteemeeting?year=YYYY`, `YYYY = 1999…2026` | One source-supplied annual response per named year | 28 | Daily for 2026; weekly for 1999–2025 |
| Official reports | Plenary official reports by year | `/api/orsplenarymeeting?year=YYYY`, `YYYY = 1999…2026` | One source-supplied annual response per named year | 28 | Daily for 2026; weekly for 1999–2025 |
| Motions, questions, related records and votes on motions | Votes on motions by year | `/api/votesmotion?year=YYYY`, `YYYY = 2011…2026` | One source-supplied annual response per named year | 16 | Daily for 2026; weekly for 2011–2025 |

**Initial request bound: 117 requests.** One source response per matrix unit; no pagination invention, ID enumeration or inferred follow-up calls.

## Proportionate implementation rule

This is one ingestion system and one baseline run, **not 117 endpoint
implementations**. The matrix above is configuration for a generic worker; it
is not a development checklist.

| Build once | Use for every matrix row |
| --- | --- |
| One raw-response writer | Streams any response to the raw archive and calculates its digest. |
| One PostgreSQL manifest model | Records every request, response, source condition and check in the same structure. |
| One capture worker | Reads the matrix and processes listed URLs with bounded concurrency (maximum three, including no more than two high-volume official-report responses). No route-specific code path or per-record loop is permitted. |
| One reconciliation worker and schedule | Repeats the same matrix according to the row’s daily/weekly cadence. It is one scheduled service, not a timer per endpoint or per year. |
| One assurance report | Reports expected, completed, unchanged, changed, unavailable and failed units across the whole baseline. |

The 117 requests are reported in three operational cohorts only:

1. **Reference and collection responses** — 29 requests.
2. **Annual motions/questions/votes** — 32 requests.
3. **Annual official reports** — 56 requests.

Those cohorts are for progress and capacity reporting, not separate design,
approval or UI stages. A source-level unavailable or failed response is written
to the manifest and the worker continues to the next matrix row. The run stops
only for a system-wide integrity, storage, configuration or declared capacity
failure—not because one endpoint has an ordinary upstream issue.

No frontend work begins during this phase. Progress is a compact cohort report,
not an incremental interface: expected units, completed units, retained
responses, upstream availability messages, failures and storage used.

### Delivery target

After approval, the target is one focused working day to complete R1, the
117-unit baseline, one immediate full reconciliation batch and the backend
assurance report. The source-response ceiling remains five minutes per unit;
if a widespread upstream slowdown makes that target impossible, the worker
records the completed cohort outcomes and stops only at the declared capacity
or integrity boundary rather than creating an open-ended run.

## Database-mirror access routes — no additional upstream requests

The following 31 forms are represented by Database-mirror reads over the captured source responses. They do not cause an additional Scottish Parliament fetch on the initial run or a later schedule:

| Access-route class | Forms | Database-mirror behaviour |
| --- | ---: | --- |
| `/:id` detail forms | 28 | Look up the named source record in the retained collection or annual source data. Return the stored source record with its capture/route provenance, clearly labelled as a Database-mirror record view rather than a new live Scottish Parliament response. |
| MQA event-link filter forms | 3 | Select retained event-link records by the named `childUniqueId`, `mainUniqueId` or `parentUniqueId`, retaining the same source-response provenance. |

They are not silently dropped and are not a delayed data-capture task. The backend registry will identify the source response from which the Database-mirror record view is drawn. The raw upstream response remains available unchanged; the record view is an access aid, never presented as an independently captured `/:id` response.

## Capture, retention and capacity rules

The later implementation package must use one generic capture worker:

1. Fetch one matrix URL with `GET`; stream the response straight to a temporary project-owned file, never into a browser or a whole in-memory JSON object.
2. Compute a SHA-256 digest and byte count while writing. Promote the file to the immutable raw archive only after the write and digest complete.
3. Write a PostgreSQL manifest containing the literal URL, request method, non-secret headers, UTC start/end, status, response headers, content type, byte length, digest, worker version, configuration revision and capture-run ID.
4. Do not parse, flatten, project, join, rename or otherwise transform a raw response in the capture run.

The initial run uses one generic worker with at most three source requests in flight and at most two high-volume official-report responses in flight. It makes at most one attempt per matrix unit, has a five-minute response limit and a 512 MiB limit for one response. It stops and records `CAPTURE_LIMIT_EXCEEDED` if a response or the run exceeds its bound; it does not silently truncate or retry in a loop. The total raw-data budget is 16 GiB. The plan’s observed high-volume evidence indicates that this is a practical ceiling rather than an expected result; the implementation pre-flight must verify the project-owned storage can hold it before source contact.

## Change checking and unavailable-source handling

There is no established upstream update watermark or `ETag`/`Last-Modified` contract. The mirror therefore proves only what it checked and when.

On each scheduled check, the worker fetches the same literal response unit, calculates its digest, and records one of four states against the latest manifest:

- `UNCHANGED` — same digest;
- `CHANGED` — a new raw object and manifest are retained;
- `UPSTREAM_AVAILABILITY_MESSAGE` — the source supplied an availability response;
- `FAILED_TO_RETRIEVE` — no source response was retained, with the transport failure and time recorded.

The documented 2006 Committee Official Reports response is a named initial exception. It is still requested as `/api/orscommitteemeeting?year=2006`; its Scottish Parliament “presently unavailable” result is preserved as an upstream condition and checked weekly. If the source later returns data, the new raw response is added without deleting the earlier condition.

Daily checks cover the 29 fixed responses and each 2026 annual response, where new material is most plausible. Weekly checks cover historic annual responses. A future portal can show this per-unit schedule and the last checked time; it must not claim real-time parity.

## Backend completeness and assurance

Before any researcher portal proposal, the backend must produce one machine-readable and human-readable assurance report that answers:

1. Which of the 117 planned response units have a successful retained response, an upstream availability condition, a retrieval failure or have not run?
2. Does every successful manifest point to a raw file with the recorded digest and byte length?
3. Is every scheduled unit represented in the reconciliation history, with the last check and result?
4. Do all 64 approved API forms have a visible Database-mirror route: either the exact retained source response or a transparently labelled PostgreSQL record/link view over that response?
5. What can truthfully be said as of a specified UTC date—for example, “all 117 planned units were checked between X and Y; 116 raw responses were retained and one upstream availability message was retained”?

This is the required evidence for a scoped completeness statement. It is not a claim that no unlisted source URL, late correction or intervening source change exists.

## Implementation sequence after approval

| Step | Outcome | Source contact? | Owner authority needed |
| --- | --- | --- | --- |
| R1 — foundation | Minimal PostgreSQL manifest schema, raw archive layout, capture matrix loader and offline integrity tests. No browser UI. | No | A later implementation work package |
| R2 — baseline | One serial run of the 117 matrix units and an explicit outcome for every unit. | Yes | Same work package, only if it explicitly adopts this matrix and bounds |
| R3 — reconciliation | Named daily/weekly scheduled checks, source-condition handling and a backend assurance report. | Yes | Same work package |
| R4 — closure | Owner review of the assurance report and a decision on whether the backend is ready for an independent portal design. | No new source work | Separate owner review |

### R1 source-free proof

R1 begins with a deliberately source-free proof on the isolated VPS. It creates
only the project Database mirror database, an append-only raw-archive layout
and a one-shot, loopback-only worker. The worker writes a locally generated
test byte sequence, records its checksum and path in a separate system-test
table, and re-reads the file to prove that PostgreSQL and the immutable archive
agree. It creates no capture unit, observation, schedule, proxy route or
research-facing interface, and makes no request to the Scottish Parliament.

The R1 proof is accepted only when the project database contains a passing
system-test result, the raw file re-hashes to the recorded SHA-256 value, and
the capture-observation table remains empty. This is infrastructure evidence,
not a data or mirror-completeness claim.

**Result (6 August 2026): PASS.** The isolated VPS proof wrote a 133-byte
locally generated test object to the project raw archive. PostgreSQL recorded
the same SHA-256 digest as a direct re-read of that file
(`f5c16e6df5fc7781057a77faa43786fbd62051915616c54fd8f7235171aadcb1`), and
the capture-observation table contained zero rows. The existing API and web
services remained active throughout. The first attempt exposed a raw-directory
ownership error; the installer now gives the one-shot project worker ownership
of its own raw directory and preserves a failed proof release for a bounded
zero-capture resume. No Scottish Parliament request was made.

## Out of scope

- DB2 variables, joins, transformations, codebooks, charts or research claims;
- a PostgreSQL record browser, generic query API, public database, downloads in alternative formats, code snippets or the research portal;
- additional upstream parameterised/detail capture beyond the 117 units above; the corresponding Database-mirror access routes are in scope;
- changes to the authenticated Live API catalogue or its direct/no-retention source relay;
- other VPS services, databases, ports, users or files.

## Acceptance criteria for this plan

The plan is accepted only if the owner agrees that it:

1. treats the 64-form inventory as scope, not a crawl instruction;
2. defines a 117-request starting baseline with literal URLs and years;
3. makes every parameterised/detail form available through a transparent Database-mirror access route without an upstream crawl;
4. captures exact raw responses and source conditions without transformation;
5. makes daily/weekly checks and their limits explicit; and
6. defers both the test scaffold and the independent research portal until the backend assurance report is complete.

## What next

**Next step:** owner R4 review of the [backend assurance report](ASSURANCE_REPORT_2026-08-06.md). Any researcher portal, public/data access, DB2 work, matrix change, capacity change or target-isolation change requires a new owner decision.
