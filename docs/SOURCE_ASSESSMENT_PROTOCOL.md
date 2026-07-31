# Source Assessment Protocol

**Status:** Planning template — not evidence of any source assessment

**Version:** 0.1.0
**Last updated:** 31 July 2026

## 1. Use and boundary

Use this protocol only after an owner-approved reconnaissance action names the
candidate source target and permitted activity. Complete one assessment record
per candidate source/version. A completed record documents what was observed;
it does not create a raw capture, approve publication, or make a completeness
claim.

## 2. Required assessment record

| Area | Required record | Minimum decision question |
| --- | --- | --- |
| Identity | Candidate source ID, host, URL, operator/publisher stated by the source, assessment date, and assessor role. | Is the claimed host-assembly relationship evidenced or still candidate? |
| Authority and scope | Source’s own description, asserted coverage, unit of analysis, jurisdiction, time/session scope, and known exclusions. | Is it suitable for the precisely proposed slice, without broader claims? |
| Access and licence | Access method, authentication, rate/usage terms, licence/reuse statement, and terms URL or retained reference. | Can the intended use and retention be lawful and proportionate? |
| Data shape | Observed/advertised format, fields, identifiers, null behaviour, pagination/cursor behaviour, ordering, and response limits. | Can a future capture contract be stated without guessing? |
| Temporal behaviour | Update statement, date semantics, time zone where stated, and snapshot/currentness limitations. | Can retrieval time and source time be kept distinct? |
| Privacy and sensitivity | Potential personal data, special-category/sensitive data, publication risk, minimisation needs, and unresolved questions. | Is a retention/publication policy required before capture? |
| Reliability and drift | Availability, error modes, schema-change signals, versioning, and observed limitations. | What must block a later capture or publication? |
| Candidate slice fit | Proposed records, fields, temporal boundary, inclusion/exclusion rules, and expected volume if evidenced. | Is the slice small enough for full inspection and defensible? |

## 3. Evidence and outcome

For every entry, record the evidence location, retrieval/observation time in
UTC, and whether the conclusion is `OBSERVED`, `CANDIDATE`, `UNRESOLVED`, or
`NOT_APPLICABLE`. Do not replace an unresolved item with an assumption.

The completed record must recommend exactly one outcome:

- `PROCEED_TO_CAPTURE_PLAN` — only when all preconditions for a separate raw
  capture proposal are evidenced;
- `REVISE_SLICE_OR_METHOD` — a bounded change could address an identified gap;
- `DO_NOT_PROCEED` — authority, access, ethics, semantics, or feasibility is
  inadequate; or
- `BLOCKED_PENDING_OWNER_DECISION` — a policy or interpretation decision is
  required.

The recommendation is not approval. The owner decides whether to approve any
subsequent action.
