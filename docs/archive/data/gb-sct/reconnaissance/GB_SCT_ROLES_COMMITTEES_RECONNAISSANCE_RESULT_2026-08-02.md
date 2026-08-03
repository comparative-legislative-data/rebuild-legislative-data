# GB-SCT Roles and Committees Reconnaissance Result — 2 August 2026

**Status:** PASS — exploratory inspection only; handling review required before
any capture or release

**Authority:** DEC-0055

## 1. Route and coverage profile

All 15 inspected route forms returned HTTP `200` JSON. Every response exposed
`Cache-Control: no-cache` and `Expires: -1`; no `ETag`, `Last-Modified`,
rate-limit, or retry metadata was observed. This is an observed route-family
pattern, not an API-wide update-policy conclusion.

| Family | Observed list size / fields | Observed temporal coverage and limitation |
| --- | --- | --- |
| Party roles | 548 records; identifier, party, name, notes. | No date fields. Role history cannot be inferred from this taxonomy alone. |
| Member party roles | 1,509 records; member-party, role-type, notes, validity dates. | `ValidFromDate` spans 1999-05-06 to 2026-07-23; non-null `ValidUntilDate` spans 2000-01-07 to 2026-07-23. This is observed record-date coverage, not a complete role-history claim. |
| Government roles | 251 records; identifier, name, notes. | No date fields. Historical role occupancy must use the member-government relationship route. |
| Member government roles | 381 records; person, government role, validity dates. | `ValidFromDate` spans 1999-05-13 to 2026-05-21; non-null `ValidUntilDate` spans 1999-06-12 to 2026-05-21. |
| Committees | 169 records; names, description, contact fields, validity dates. | `ValidFromDate` spans 1999-06-17 to 2026-06-04; non-null `ValidUntilDate` spans 2001-01-07 to 2026-04-08. Contact and free-text fields require handling review. |
| Committee roles | 8 records; identifier, name, notes. | No date fields. It is a role taxonomy, not membership history. |
| Committee types | 3 records; identifier and name. | No date fields. It is a taxonomy. |
| Committee type links | 168 records; committee and type identifiers. | No date fields. Relationship timing and semantics remain unestablished. |

For every list/detail pair, the one detail response had the same field set as
its collection response. This is a one-record structural comparison only.

## 2. Research implications

The two member-role relationship routes are candidates for later point-in-time
party and government-role calculations, subject to interval semantics, overlap/
conflict rules, and handling assessment. Committees are candidates for temporal
committee reference data; committee membership is not established by this
cohort. Taxonomy and link routes can support later source-defined classifications
only after their meanings are documented.

No DB1/DB2 asset, codebook, variable, join, or public output is created. Notes,
descriptions, email addresses, telephone numbers, person identifiers, and
relationship data require route-specific handling before operational use.

## 3. Next cohort

Proceed to the motions/questions/answers family. It is expected to include
larger, potentially more varied routes and therefore will be profiled for
response volume, temporal coverage, parameter behaviour, and updateability
before any later mirror design is considered.
