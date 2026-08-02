# GB-SCT Contextual Reference Reconnaissance Result — 2 August 2026

**Status:** PASS — exploratory inspection only; handling review required before
any capture or release

**Authority:** DEC-0055

**Cohort:** Members, representation, constituencies, regions, parties, and
member-party relationships

## 1. Observation summary

All inspected list/detail route forms returned HTTP `200` JSON. The Member
detail route is reached through the collection's `PersonID` field rather than
an `ID` field; this is an observed route-use relationship, not an identifier
stability claim. No raw payload, download, cache, database row, proxy, or
public source-data example was created.

| Route family | List size and observed fields | Immediate research use / limitation |
| --- | --- | --- |
| Members | 416 elements. `PersonID`, names, `GenderTypeID`, `BirthDate`, `BirthDateIsProtected`, `IsCurrent`, `Notes`, `PhotoURL`. | Candidate source identity/reference data only. The field set includes potentially personal or protected-content indicators; no capture/release assessment has been made. |
| Member constituency status | 523 elements. Person, constituency, election-status/reason, note, and validity-period fields. | Candidate for a future time-varying representation rule, subject to field/interval definitions. |
| Member region status | 413 elements. Person, region, election-status/reason, note, and validity-period fields. | Same: a candidate time-varying relationship, not a current calculation. |
| Constituencies | 223 elements. Identifier, names/codes, region, and validity-period fields. | Candidate reference/temporal geography data; validity-date semantics unverified. |
| Regions | 29 elements. Identifier, name/code, and start/end-date fields. | Candidate reference/temporal geography data; date semantics unverified. |
| Parties | 14 elements. Identifier, names/abbreviation, notes, validity-period fields, and two observed-null relationship placeholders. | Candidate reference data; no party-history or role semantics inferred. |
| Member parties | 976 elements. Identifier, person, party, validity-period, and observed-null role placeholder. | Candidate for point-in-time party affiliation only after interval/conflict rules and handling assessment. |

For every successfully inspected family, the one detail response had the same
field set as its collection response. This is a limited one-record comparison,
not a parity or completeness claim. The largest response was Member Parties at
134,503 bytes; no response approached the 5 MiB exploratory safety ceiling.

## 2. Data-handling consequence

The Members, representation-status, Member Parties, and Notes-related fields
require route-specific handling assessment before capture, DB1, DB2, proxy, or
any output. Public availability and an exploratory response shape do not settle
personal-data, sensitive-content, linking, retention, or publication issues.

No field is assigned a personal-data or legal classification by this result.
The result records only the need for a stricter future assessment.

## 3. Next cohort

Proceed to party roles, government roles, committees, committee roles/types,
and committee-type links. Under DEC-0055 this is normal reconnaissance. The
next cohort report will distinguish reference taxonomies from time-varying
member-role relationships.
