# Database mirror endpoint description register

**Status:** Current controlled QA-label record
**Last reconciled from retained metadata:** 5 August 2026  
**Scope:** private GB-SCT Database mirror QA surface and Backend Assurance
input; no source request, capture, database mutation or schedule change

## Purpose

This register is the controlled plain-language endpoint-label source for the
Database mirror. It names endpoint families rather than internal capture
cohorts or individual source-year route identifiers. It is QA/assurance input,
not a settled Research Portal information architecture, and it does not define
variables, relationships, historical facts or analytical uses; those belong to
the later DB2 programme.

The 5 August metadata-only audit found **113 latest retained GB-SCT
source-route releases**, normalised into **29 researcher-facing endpoint
labels**. Of those releases, 111 have a passing record projection, one is the
retained 2006 Committee Official Reports upstream availability response, and
one is retained original JSON without a published record projection. These are
dated operational facts, not a completeness or freshness claim.

## Endpoint descriptions

| Research subject | Endpoint | Researcher-facing description |
| --- | --- | --- |
| Bills, formal stages and bill reference data | Bill stage types | Scottish Parliament reference list of bill-stage types. |
|  | Bill stages | Scottish Parliament collection of bill-stage records. |
|  | Bill types | Scottish Parliament reference list of bill types. |
|  | Bills | Scottish Parliament collection of bill records. |
| Sessions, members, constituencies and regions | Constituencies | Scottish Parliament collection of constituency reference records. |
|  | Member constituency statuses | Scottish Parliament collection of member-constituency status records. |
|  | Member region statuses | Scottish Parliament collection of member-region status records. |
|  | Members | Scottish Parliament collection of member records. |
|  | Regions | Scottish Parliament collection of regional reference records. |
|  | Sessions | Scottish Parliament collection of parliamentary sessions. |
| Parties and government roles | Government roles | Scottish Parliament reference list of government roles. |
|  | Member government roles | Scottish Parliament collection of member-government-role records. |
|  | Member parties | Scottish Parliament collection of member-party records. |
|  | Member party roles | Scottish Parliament collection of member-party-role records. |
|  | Parties | Scottish Parliament collection of party records. |
|  | Party roles | Scottish Parliament reference list of party roles. |
| Committees and committee roles | Committee roles | Scottish Parliament reference list of committee roles. |
|  | Committee type links | Scottish Parliament collection linking committee and committee-type identifiers. |
|  | Committee types | Scottish Parliament reference list of committee types. |
|  | Committees | Scottish Parliament collection of committee records. |
| Motions, questions, related records and votes on motions | MQA business consideration | Scottish Parliament collection of consideration business-motion records. |
|  | MQA business programme | Scottish Parliament collection of programme business-motion records. |
|  | MQA event links | Scottish Parliament collection of links between motions, questions and answer events. |
|  | MQA event subtypes | Scottish Parliament reference list of motions, questions and answer event subtypes. |
|  | MQA event types | Scottish Parliament reference list of motions, questions and answer event types. |
|  | MQA questions | Annual motions, questions and answers question responses for the listed source years. |
|  | Votes on motions | Annual votes-on-motions responses for the listed source years; these may include votes on motion amendments, not bill amendments. |
| Official reports | Committee Official Reports | Annual Committee Official Report responses for the listed source years. |
|  | Plenary Official Reports | Annual Plenary Official Report responses for the listed source years. |

## Presentation controls

- A source year/window is a release property, not a separate top-level endpoint.
  The grouping rule covers both 1999 and later annual route forms.
- The private directory excludes non-GB-SCT synthetic test material.
- Current QA views keep the dated original JSON, direct live-source link,
  source condition and capture/provenance distinct. The later Research Portal
  will use the accepted Backend Assurance capability contract instead of
  treating current QA controls as its design.
- The complete selected proxy inventory remains the 64 route forms in
  [DEC-0045](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md).
  DB1 retained coverage is a different, explicitly dated subset.

## Review triggers

Review this register when a new retained GB-SCT route/window is made
researcher-visible, an endpoint is retired or renamed, source terminology
changes, a DB1 access mode changes, or before reusing these descriptions in a
DB2 codebook or public release.
