# Retention, Publication, and Personal-Data Policy Proposal — DEC-0008

**Status:** Proposed for owner decision; no source capture, storage, or publication authorised

**Version:** 0.1.0

**Prepared:** 31 July 2026

**Decision requested:** DEC-0008

## 1. Decision requested

Approve this policy as the minimum data-governance condition for any future
GB-SCT capture/proxy/DB1 proposal. It establishes default handling rules and a
per-route handling record; it does not approve any route, source request,
retention system, data store, public endpoint, or release.

The policy aims to preserve reproducibility without treating source data as
automatically publishable merely because it may be publicly accessible at the
source.

## 2. Proposed policy

### 2.1 Default posture

1. **No capture by default.** A route may be captured only after a named
   capture proposal, source assessment, and completed handling record establish
   the permitted scope.
2. **Restricted by default.** Raw response bytes, request metadata, and DB1
   projections are non-public unless the handling record explicitly permits a
   more open class.
3. **No publication by implication.** Visibility on an upstream site, an API
   response, or an open-data catalogue does not by itself permit republication,
   bulk download, public native access, or a derivative public claim.
4. **Minimise before collecting.** Capture only the approved routes, parameter
   forms, periods, and fields/payloads necessary for the stated purpose. Do not
   add an endpoint or query form merely because it is technically available.
5. **Preserve evidence separately from access.** A public canonical release may
   disclose provenance metadata and verification results without exposing raw
   source content that is restricted, sensitive, or not approved for release.

### 2.2 Retention schedule

The proposed schedule distinguishes provenance evidence from source-content
copies.

| Asset | Proposed default | Review / exception |
| --- | --- | --- |
| Decision records, source registry metadata, manifests, checksums, codebooks, transformation specifications, and verification reports | Retain indefinitely in the durable project record, subject to secret and personal-data exclusions. | Correct by superseding rather than silently overwriting. |
| Raw capture bytes and associated non-secret retrieval metadata | Retain while an associated dataset or native-access version is active, then for **at least seven years** after its last public release or last research use, whichever is later. | A route-specific handling record may require a longer term. If source terms, a data-protection assessment, or a valid removal obligation require a shorter term, do not capture until the conflict is resolved or an approved exception specifies a lawful, reproducible alternative. |
| DB1 operational projections and derived staging artefacts | Retain no longer than their source capture and regeneration need; regenerate rather than manually amend. | Delete/restrict when the associated capture is deleted or restricted, unless an approved retention exception says otherwise. |
| Public canonical releases and charts | Retain as versioned releases while publicly represented, with their manifests and verification reports. | Withdrawal or correction creates a dated withdrawal/supersession record; it must not silently rewrite prior claims. |
| Logs and access records | Retain only for the documented security, audit, and incident purpose; do not include raw payloads or secrets. | Exact duration and access controls must be defined in the later implementation proposal. |

Seven years is a proposed minimum for owner review, not a claim that it is a
universal legal requirement or appropriate for every source. The project must
not retain material simply because a preferred period has been written down.

### 2.3 Access classes

Every capture, route, and release must receive one of these handling classes in
its completed record:

| Class | Meaning |
| --- | --- |
| `RESTRICTED_PROJECT` | Raw capture/DB1 accessible only to authorised project roles for the documented research, validation, and operational purpose. |
| `RESTRICTED_REVIEW` | A bounded review copy accessible only to named reviewer roles under documented conditions. |
| `PUBLIC_PROVENANCE_ONLY` | Manifests, checksums, methodology, and verification status may be public; source-content copies are not. |
| `PUBLIC_CANONICAL` | A reviewed canonical output may be released under its own codebook, provenance, and verification conditions. This does not make raw input public. |
| `PUBLIC_NATIVE_ACCESS` | A capture-backed native-access view may be public only where source terms, personal-data assessment, route-level limits, and verification support it. |
| `DO_NOT_CAPTURE_OR_RELEASE` | The route is excluded because the required conditions have not been met. |

The handling class may become more restrictive when evidence changes. Any
change from a restricted to a public class requires a new review and explicit
approval; it is not an implementation default.

### 2.4 Personal-data and sensitive-content safeguards

Before capture, each route must be screened for potential personal data,
sensitive content, and re-identification or aggregation risk. The assessment
must distinguish a source's public availability from this project's proposed
collection, retention, linking, and publication.

The project will not:

- assume that parliamentary, professional, contact, biographical, or
  contribution records are outside personal-data considerations;
- collect special-category or otherwise sensitive material without a
  route-specific documented purpose and handling decision;
- use raw captures for unrelated profiling, contact, or behavioural analysis;
- expose restricted data through logs, error messages, fixtures, screenshots,
  documentation examples, or source control; or
- make automated substantive decisions about individuals from captured data.

Before a route can move beyond `RESTRICTED_PROJECT`, its handling record must
state the accountable project role, purpose, source terms/licence evidence,
anticipated personal-data risks, minimisation decision, access controls,
publication class, correction/removal process, and review date. If this cannot
be stated, the route remains `DO_NOT_CAPTURE_OR_RELEASE`.

### 2.5 Publication, correction, and removal

1. A public output must be a declared version with a codebook, build/capture
   lineage, verification report, limitations, and stated handling class.
2. Public native access is never a live upstream pass-through. It is limited to
   approved captured versions and documented query forms.
3. A source correction, rights concern, privacy concern, or credible request
   for review triggers a recorded assessment. Affected public access is
   restricted or withdrawn pending the assessment where appropriate; the record
   must state the scope and reason without exposing restricted content.
4. Deletion, restriction, or withdrawal must preserve a non-content audit
   record: decision, scope, date, reason category, affected release/capture
   identifiers, and resulting verification/public-status effect.
5. A request does not itself establish that a source record is wrong or that a
   project record must be erased. The project records the outcome and never
   silently alters a released research claim.

## 3. Required route-level handling record

Before any capture proposal names a route, it must complete
[`SOURCE_HANDLING_RECORD_TEMPLATE.md`](SOURCE_HANDLING_RECORD_TEMPLATE.md).
The record is the operational companion to the source assessment: it gives the
approved use, retention, access, and publication treatment for that route or a
clearly defined route group.

## 4. Stop conditions

The later capture/proxy/DB1 proposal must stop for an affected route when any
of the following is unresolved:

- source authority, terms, licence/reuse conditions, or permitted request form;
- personal-data or sensitive-content implications of capture, linkage, or
  publication;
- the accountable role and access-control boundary;
- a retention conflict between reproducibility, source conditions, and a
  documented removal/restriction requirement;
- whether public native access or a public canonical output is allowed; or
- how a withdrawal, correction, or source-drift event would be recorded.

## 5. Acceptance criteria for a later implementation proposal

A future proposal may claim to comply with this policy only if it supplies:

1. a source assessment and completed route-level handling record for every
   route in scope;
2. an explicit handling class and retention outcome for raw capture, DB1,
   provenance metadata, and any intended public output;
3. least-privilege access design and a testable no-secrets/no-raw-payloads-in-
   logs rule;
4. a documented correction, restriction, deletion, and withdrawal workflow;
5. a manifest/release design that preserves lineage after any restriction or
   deletion; and
6. verification checks and retained results for the above controls.

## 6. Consequence of approval

DEC-0008 approval would resolve the project-level retention/publication policy
dependency. It would not authorise source requests, raw capture, DB1/proxy
implementation, deployment, public release, or document-source work. Those
remain subject to a separate bounded proposal and the approved endpoint
inventory.
