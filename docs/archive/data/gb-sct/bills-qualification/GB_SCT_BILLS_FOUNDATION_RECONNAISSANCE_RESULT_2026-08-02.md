# GB-SCT Bills-Foundation Reconnaissance Result — 2 August 2026

**Status:** PASS — exploratory inspection only; no capture or release authority

**Authority:** DEC-0055

**Cohort:** Formal stages, stage types, bill types, and sessions

## 1. Scope and method

This cohort inspected the eight selected list/detail route forms in the Bills
foundation group. Requests were public, unauthenticated `GET`s with no query
parameters or request body. Detail requests used a transient collection-derived
identifier only to inspect the corresponding known detail form. No raw payload,
cache, fixture, database row, download, proxy, or public source-data output was
created.

The reported counts and fields are observations from the listed requests, not
claims about complete historical coverage, endpoint definitions, or stable
contracts.

## 2. Route observations

| Family | List route observation | Detail route observation | Immediate limitation |
| --- | --- | --- | --- |
| Formal stages | JSON array; 1,754 returned elements. Fields: `BillID`, `BillStageTypeID`, `ID` (numbers), `StageDate` (string/null). | JSON object with the same four fields; the one observed `StageDate` value was a string. | Field meaning, date semantics, ordering, pagination, identifier stability, and Bill relationship semantics remain unverified. |
| Stage types | JSON array; 34 returned elements. Fields: `BillTypeID`, `ID`, `Name`, `Sequence`; numeric except `Name` string. | JSON object with the same four fields. | Does not establish the source definition or ordering meaning of `Sequence`, or the relationship to Bills/stages. |
| Bill types | JSON array; 7 returned elements. Fields: `ID` (number), `Name` (string). | JSON object with the same two fields. | Does not establish source-defined category semantics or historical completeness. |
| Sessions | JSON array; 6 returned elements. Fields: `ID` (number), `Name`/`ShortName` (strings), `StartDate` (string), `EndDate` (string/null). | JSON object with the same five fields; the one observed `EndDate` value was a string. | Does not establish session-boundary rules, date semantics, historical coverage, or a bill-to-session assignment rule. |

All eight requests returned HTTP `200` and `application/json; charset=utf-8`.
The largest received response was the Formal Stages collection at 137,488
bytes; no response approached the 5 MiB exploratory safety ceiling. List/detail
field-set equality is observed only for the one detail response per family.

## 3. Aggregate date-coverage profile

The following is a one-time aggregate profile of the collection responses. It
describes values present in the indicated date field, not the completeness of
the underlying legislative history or the semantics of those dates.

| Family / field | Observed aggregate profile | Interpretation limit |
| --- | --- | --- |
| Formal stages / `StageDate` | 1,727 non-null values of 1,754 records; 1999-05-11 to 2026-03-24. Every calendar year from 1999 to 2026 had at least one date value (annual counts: 15–97). | This supports a broad observed date-value span only. It does not establish that each bill, stage, date, or historical period is complete. |
| Sessions / `StartDate` | 6 non-null values, 1999-05-11 to 2021-05-12. | The six source records are not evidence of an exhaustive or semantically settled session-history model. |
| Sessions / `EndDate` | 5 non-null values, 2003-03-30 to 2021-05-03; one record has a null end date. | A null may denote an open/current session or another source convention; no inference is made. |

This profile establishes the project's standard distinction between observed
field-date coverage, record counts by year, and any future claim of historical
or semantic completeness. It must be refreshed during a later approved
capture/mirroring design, not treated as an operational completeness test.

## 4. Research and handling consequence

The cohort makes these fields candidates for later Tier 1 source-field
assessment only. It creates no Tier 1 value, Tier 2 rule, codebook entry,
capture/DB1 record, or release claim. Source terms, route-specific operating
conditions, field definitions, personal-data assessment, retention fit, and
public-output conditions remain to be qualified before any operational use.

The historical DEC-0054 Formal Stages stop is retained for auditability but
does not limit this cohort's safe structural finding under DEC-0055.

## 5. Next cohort

Proceed to the structured contextual cohort: members, constituency/region
status, parties and party roles, government roles, committees and committee
roles/types. Under DEC-0055 this is normal reconnaissance, not a new approval
gate. The next report will separate simple reference routes from potentially
time-varying member/role relationships.
