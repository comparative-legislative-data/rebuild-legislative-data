# GB-SCT Bills G4 Handling-Assessment Result — 2 August 2026

**Status:** `BLOCKED_PENDING_OWNER_DECISION` — completed evidence-limited
assessment; route blocks retained

**Authority:** DEC-0053, approved by the project owner on 2 August 2026

**Scope:** DEC-0050 G4 only; existing non-content project evidence only

## 1. Method and containment result

The assessment compared only the records named by DEC-0053: DEC-0008,
DEC-0045–DEC-0052, RSK-0033, the two Bills route-handling assessments, and the
two value-free observation results. No source page, API endpoint, raw
response, external service, legacy material, credential, database, VPS, log,
browser session, contact channel, or unlisted project record was accessed.

No source value, identity, raw payload, new field definition, legal basis,
personal-data classification, special-category classification, licence
coverage claim, or identifier-stability claim is retained or inferred.

## 2. Evidence and limitation screen

| Evidence category | Collection route | Detail route | G4 consequence |
| --- | --- | --- | --- |
| Value-free observed shape | Seven field names/types are retained. `PersonID` is numeric or null; several fields are strings; `ThirdPartyOrganisation` is a string or null. | The same seven field names/types are retained from one response; `PersonID` is numeric and `ThirdPartyOrganisation` was null in that response. | Names, types, and one null state do not establish content, identity, sensitivity, source meaning, or legal classification. Potential linkage/content risk remains unassessed. |
| Source authority and reuse evidence | DEC-0052 establishes general SPCB website-operation and published-information licence evidence, including stated personal-data and third-party-rights exclusions. | Same. | The evidence does not establish that either route/field is covered, or whether any route content falls within an exclusion. |
| Source privacy evidence | The SPCB privacy statement is a general account of its own personal-data handling and retention framework. | Same. | It does not classify Bills-route content or determine this project's proposed collection, linkage, retention, or output position. |
| Project policy | DEC-0008 requires a route-specific screen before capture and prohibits treating public availability as permission. | Same. | Unresolved potential personal-data, sensitive-content, or linking implications require `DO_NOT_CAPTURE_OR_RELEASE`. |

## 3. Route-specific G4 outcome

| Route | G4 status | Supported handling consequence |
| --- | --- | --- |
| `/api/bills` | `BLOCKED_PENDING_OWNER_DECISION` | Current evidence cannot establish whether proposed capture, linkage, retention, or output can be assessed for actual field content and combinations. The existing `DO_NOT_CAPTURE_OR_RELEASE` class remains required by DEC-0008. |
| `/api/bills/:id` | `BLOCKED_PENDING_OWNER_DECISION` | The single value-free response does not establish the meaning, content, stability, or linkage implications of its fields. The existing `DO_NOT_CAPTURE_OR_RELEASE` class remains required by DEC-0008. |

`BLOCKED_PENDING_OWNER_DECISION` does not mean that either route is known to
contain personal data, sensitive content, or a prohibited field. It means the
project lacks the route-specific evidence and approved handling basis required
to decide otherwise.

## 4. Unestablished requirements for a later G5 revision

Neither route currently has all of the following:

- route/field-specific terms and licence coverage, including the scope of
  stated exclusions;
- source definitions for fields, identifiers, collection/detail relationship,
  and relevant content combinations;
- documented request, parameter, rate, caching, change, and retention
  conditions;
- a proportionate source-informed assessment of actual personal-data,
  sensitive-content, and linkage implications;
- an approved accountable purpose, minimisation boundary, access model,
  retention compatibility, correction/restriction/removal process, and truthful
  output boundary.

No G5 revision, capture, pass-through, DB1, DB2, canonical variable, frontend,
beta/public output, deployment, or public claim can proceed from this result.

## 5. Next gate

The smallest proposed next step is a documentation-only **Bills unresolved-
evidence strategy proposal**. It must separately state whether the owner
wishes to seek an official written clarification for the unresolved route-
specific G1–G4 facts or to retain the two routes as blocked pending future
published documentation. Any external contact or source request would require
its own exact owner approval; none is proposed by this result.
