# GB-SCT Bills G4 Handling-Assessment Proposal — DEC-0053

**Status:** Proposed — documentation-only; no external or data action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision sought:** DEC-0053

## 1. Purpose and pre-flight

| Gate item | Record |
| --- | --- |
| Active phase and approved programme scope | DEC-0050 Bills-family qualification plan, G4 only. |
| Authority for proposal preparation | Owner instruction to proceed after the DEC-0052 recovery result. This instruction authorises proposal preparation only. |
| Affected records | DEC-0008; DEC-0047; DEC-0049; DEC-0050; DEC-0052 result; RSK-0033; the Bills rows in DEC-0045; and one later G4 result. |
| Known uncertainty and risk | General licence/privacy material does not classify Bills-route fields or authorise project processing. The value-free observations expose identifier-like and potentially linkable field names but no definitions or values. G2–G3 also remain unresolved. |
| Smallest proposed change and containment | Perform a documentation-only assessment of current project-held non-content evidence. It will make no source, browser, API, contact, VPS, database, file-content, account, email, capture, proxy, DB1/DB2, frontend, or public action. |
| Verification artefact | Dated G4 result with an evidence/limitation table, a collection/detail route consequence, any applicable DEC-0008 requirement, and an explicit status. |

The purpose is to establish whether the available evidence supports a defined
personal-data, sensitive-content, and linking handling decision for either
Bills route. It is not a legal determination, data classification, source
inspection, or attempt to create operational authority.

## 2. Exact permitted assessment inputs

If DEC-0053 is approved, the assessor may read and compare only these existing
non-content project records:

1. DEC-0008 policy and its source-handling requirements;
2. DEC-0047 collection handling assessment and DEC-0049 detail handling
   assessment;
3. DEC-0046 and DEC-0048 value-free observation results;
4. DEC-0050 gap-resolution plan and DEC-0052 recovery result; and
5. the two Bills rows in DEC-0045 and RSK-0033.

No source page, API endpoint, raw response, legacy material, credential,
database, VPS, log, browser session, external search, contact channel, or
unlisted project record may be opened for this package. The assessment may
retain only existing non-content field names/types/null-state summaries,
document references, and a rule-based limitation statement. It must not retain
or infer values, identities, personal-data status, special-category status,
legal basis, licence coverage, source semantics, rate condition, or identifier
stability.

## 3. Required questions and allowed conclusions

| Question | Permitted conclusion |
| --- | --- |
| Does present evidence establish the meaning/content of each observed field well enough to classify the collection or detail route for the project's capture, linkage, retention, or output purposes? | `EVIDENCED`, `UNRESOLVED`, or `BLOCKED`, separately for each route; absent direct support, do not assign a legal or factual data classification. |
| Do field names/types and current source terms create a conservative project-handling consequence? | State only the DEC-0008 rule-based consequence: unresolved potential personal-data, sensitive-content, or linking implications preserve `DO_NOT_CAPTURE_OR_RELEASE`. |
| Does either route have the accountable purpose, minimisation boundary, access class, retention compatibility, and correction/removal process necessary to move beyond the current block? | Identify each unestablished requirement. Do not invent controls or relabel the route. |
| What evidence would be needed before a future G5 handling revision could be considered? | List unresolved categories only: route-specific terms coverage, field/identifier semantics, operating conditions, and a proportionate source-informed handling assessment. |

## 4. Stop rules and result effect

Stop and mark the relevant question `BLOCKED` if answering it would require an
external request, new source/data content, a legal conclusion, an unlisted
record, a route/field inference, or a change to the current handling class.
Silence, a generic privacy statement, public availability, a field name, a
single null state, or a general licence must not be treated as a classification
or permission.

The result may update the DEC-0050 G4 status, the two route-handling records'
evidence position, the Bills matrix, and registers only with supported
non-content conclusions. A result of `UNRESOLVED` or `BLOCKED` is successful
containment, not failure. Neither result may authorise a less restrictive
handling class, source request, capture, pass-through, DB1, DB2, frontend,
beta/public output, deployment, or public claim.

## 5. Acceptance and next gate

The package passes only if the result separately records collection and detail
positions, all evidence limits, the resulting `DO_NOT_CAPTURE_OR_RELEASE`
consequence, and the smallest next decision. It must state whether any future
work requires new external evidence rather than relabelling current gaps.

The expected next gate remains a later G5 route-handling revision only after
the outstanding G1–G4 evidence is sufficient. If G4 is unresolved, the
smallest next step is a new documentation-only evidence plan or an explicit
owner decision to leave the routes blocked; neither is authorised here.

## 6. Owner decision

DEC-0053 is **proposed**. If approved, it authorises only the exact internal,
non-content assessment above and one result record. It does not authorise any
external request, source/data capture or retention, system action, or public
output.
