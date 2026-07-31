# Source Handling Record Template

**Status:** Planning template — no route is approved by this document

**Version:** 0.1.0

**Last updated:** 31 July 2026

Complete one record for each proposed route or clearly bounded route group
before it appears in a capture/proxy/DB1 proposal. This record implements the
policy proposed in `RETENTION_PUBLICATION_POLICY_PROPOSAL_DEC0008.md`; it does
not authorise a source request, capture, storage, or release.

| Required field | Record |
| --- | --- |
| Source and route scope | Source ID, exact route(s), permitted parameters, period, and explicit exclusions. |
| Purpose and necessity | Why this source content is necessary for the approved endpoint inventory or later research purpose. |
| Source authority and terms | Observed source statement, terms/licence reference, access restrictions, and assessment status. |
| Content and risk screen | Potential personal data, sensitive content, volume, linking/re-identification, and unresolved risks. |
| Minimisation decision | Exact payload/period/route limitation and why broader collection is unnecessary. |
| Raw-capture handling class | One class from the DEC-0008 policy, defaulting to `RESTRICTED_PROJECT`. |
| DB1 handling class | Class, permitted fields/indexes, raw/unparsed payload treatment, and record-to-capture lineage requirement. |
| Public provenance class | What non-content manifest/methodology/verification material may be public. |
| Public output class | `PUBLIC_CANONICAL`, `PUBLIC_NATIVE_ACCESS`, or no public output, with conditions and evidence. |
| Retention and review | Retention schedule, event trigger, next review date, and any source-specific exception. |
| Access and accountable role | Responsible project role, allowed access roles, access-control requirement, and audit requirement. |
| Correction/restriction/removal process | Trigger, decision role, public-status effect, and retained non-content audit record. |
| Stop conditions | Conditions that make the route `DO_NOT_CAPTURE_OR_RELEASE` or block publication. |
| Evidence and status | Links to assessment evidence, decision IDs, `OBSERVED`/`CANDIDATE`/`UNRESOLVED` status, and reviewer. |
