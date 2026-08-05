# GB-SCT DB1 Expected Scope Register — 5 August 2026

**Authority:** DEC-0045 selected 64 source forms; DEC-0109 control register.  
**Purpose:** distinguish the intended future Database-mirror scope from the
113 route/windows currently retained. `FUTURE_CAPTURE` is an explicit
unimplemented source form—not a missing value, failed capture or exclusion.

## Current retained forms (29 of 64)

| Source form | Current DB1 disposition | Current route/window rule |
| --- | --- | --- |
| `bills.collection`, `bill-stages.collection`, `bill-stage-types.collection`, `bill-types.collection`, `sessions.collection` | `RETAINED` | One fixed collection route each. |
| `members.collection`, `member-constituency-status.collection`, `member-region-status.collection`, `constituencies.collection`, `regions.collection` | `RETAINED` | One fixed collection route each. |
| `parties.collection`, `member-parties.collection`, `party-roles.collection`, `member-party-roles.collection`, `government-roles.collection`, `member-government-roles.collection` | `RETAINED` | One fixed collection route each. |
| `committees.collection`, `committee-roles.collection`, `committee-types.collection`, `committee-type-links.collection` | `RETAINED` | One fixed collection route each. |
| `mqa-event-types.collection`, `mqa-event-subtypes.collection`, `mqa-event-links.collection`, `mqa-business-motions.consideration`, `mqa-business-motions.programme` | `RETAINED` | One fixed collection route each. |
| `mqa-questions.year`, `motion-votes.year` | `RETAINED` | Literal annual windows 2011–2026. |
| `committee-reports.year`, `plenary-reports.year` | `RETAINED` | Literal annual windows 1999–2026. |

## Explicit future-capture forms (35 of 64)

| Source form | DB1 disposition | Reason for not representing it as a retained route |
| --- | --- | --- |
| `bills.detail`, `bill-stages.detail`, `bill-stage-types.detail`, `bill-types.detail`, `sessions.detail` | `FUTURE_CAPTURE` | Detail identifier/window contract is not DB1-retained. |
| `members.detail`, `member-constituency-status.detail`, `member-region-status.detail`, `constituencies.detail`, `regions.detail` | `FUTURE_CAPTURE` | Detail identifier/window contract is not DB1-retained. |
| `parties.detail`, `member-parties.detail`, `party-roles.detail`, `member-party-roles.detail`, `government-roles.detail`, `member-government-roles.detail` | `FUTURE_CAPTURE` | Detail identifier/window contract is not DB1-retained. |
| `committees.detail`, `committee-roles.detail`, `committee-types.detail` | `FUTURE_CAPTURE` | Detail identifier/window contract is not DB1-retained. |
| `mqa-events.collection`, `mqa-events.detail`, `mqa-event-types.detail`, `mqa-event-subtypes.detail` | `FUTURE_CAPTURE` | Whole-history or detail contract needs its own bounded capture decision. |
| `mqa-event-links.child`, `mqa-event-links.main`, `mqa-event-links.parent`, `mqa-motions.collection`, `mqa-motions.detail` | `FUTURE_CAPTURE` | Parameterised/whole-history forms are not represented by the collection captures. |
| `mqa-questions.collection`, `mqa-questions.detail`, `mqa-supports.collection`, `mqa-supports.detail` | `FUTURE_CAPTURE` | Annual Questions retention does not capture unfiltered or detail forms. |
| `committee-reports.detail`, `plenary-reports.detail`, `motion-votes.detail` | `FUTURE_CAPTURE` | Annual retention does not establish a detail identifier contract. |

## Crosswalk rules

- There are no `OUT_OF_SCOPE` forms in the DEC-0045 selected inventory. All
  64 forms remain in the intended eventual proxy/DB1 scope unless separately
  retired by the owner.
- The 29 retained forms become 113 actual DB1 route/windows because Questions,
  Votes on Motions, Committee Official Reports and Plenary Official Reports
  have literal annual source routes.
- A `RETAINED` form does not claim semantic completeness, byte integrity or
  live-source parity. Those claims remain `UNVERIFIED`.

The matching route/window control register is
[here](GB_SCT_DB1_ROUTE_WINDOW_UPDATE_CONTROL_REGISTER_2026-08-05.md).
