# DB1 Expected Scope and Update-Control Proposal — DEC-0109

**Status:** Proposed — owner approval required before implementation.

**Decision requested:** Authorise one repository-only Backend Assurance
correction package to establish the controlled expected DB1 scope and
reconciliation-control register. It does not authorise source contact,
capture, database/file/service/timer mutation, application work, deployment,
or a Research Portal.

## 1. Why this is needed

DEC-0108 found consistent internal lineage for all 113 registered DB1 routes,
but the registry is evidence of what currently exists, not a controlled
statement of what DB1 is intended to contain. It also found that 86 latest
reconciliation states are `INITIAL`, with no single route/window schedule
register that makes this transparent.

The correction solves those control gaps without pretending that a document can
prove raw-byte integrity or current upstream parity.

## 2. Precise approved scope requested

If approved, the package may create and update repository documentation only:

1. **Expected DB1 scope register** — one row for every approved GB-SCT source
   form in DEC-0045, plus one literal source-year/window row where a form has
   an already approved annual retained implementation. Each row will state:
   source form; DB1 intent; current status (`RETAINED`, `FUTURE_CAPTURE`,
   `OUT_OF_SCOPE`, or `NOT_YET_DECIDED`); applicable source-window rule;
   current route identifier where it exists; evidence/decision; and explicit
   non-coverage limitation.
2. **Route/window update-control register** — one row for every current DB1
   retained route/window. Each will name its control class: `DAILY`, `WEEKLY`,
   `BASELINE_ONLY`, or `UNSCHEDULED_PENDING_DECISION`; timer where one exists;
   most recent reconciliation state/date already recorded by DEC-0108;
   failure/escalation position; exception handling; and wording permitted for
   an “as-of” statement.
3. **Controlled crosswalk** — a short human narrative explaining how the
   64-form approved source inventory, current 113-route operational registry,
   and annual-window expansions relate. It must make clear that an unretained
   selected form is an explicit future-capture state, not a missing data value.
4. **Assurance update** — revise the DB1 assurance report, matrix, gap register
   and capability contract only to point to the new controlled registers and
   record their outcome. The original DEC-0108 audit result remains intact.

## 3. Exclusions

This proposal excludes:

- any Scottish Parliament request, re-fetch, capture, ingest, comparison or
  raw-response access;
- raw-object rehashing or stored-object content inspection;
- PostgreSQL query, schema, row, role or permission change;
- timer/service/configuration inspection or change;
- application/API/frontend code and deployment;
- DB2 variables, transformations, exports, charts, playground or public
  release; and
- a claim that DB1 is complete, current or a live-source match.

## 4. Required decision rules

The register must obey these rules:

| Situation | Required label |
| --- | --- |
| A form is selected in DEC-0045 but has not been authorised/captured for DB1 | `FUTURE_CAPTURE` — not missing data and not silently excluded. |
| A current retained route has only an initial state | `BASELINE_ONLY` or `UNSCHEDULED_PENDING_DECISION` unless an existing named timer demonstrably owns it. |
| A current retained route has a declared timer | `DAILY` or `WEEKLY`, with the named unit and its evidence. |
| 2006 Committee Official Reports | `RETAINED_UPSTREAM_AVAILABILITY_MESSAGE`; never empty, absent or a historical conclusion. |
| A form is not intended for DB1 | `OUT_OF_SCOPE` with the owner decision or explicit constraint. |
| Source bytes, current parity or digest integrity have not been checked | `UNVERIFIED`; no wording may imply otherwise. |

The register must not infer a source window from a route family, collapse a
detail form into a collection, or label an intended future capture as
operationally unavailable.

## 5. Acceptance tests

The package passes only if:

1. every DEC-0045 form has one explicit DB1 disposition;
2. every current DB1 route/window has exactly one scope row and update-control
   row, or a visible discrepancy;
3. annual windows retain their literal years and do not hide the 2006
   availability message;
4. each row distinguishes retained baseline from scheduled reconciliation;
5. no row uses `complete`, `current`, `live`, `exact mirror` or similar
   unbounded wording;
6. the human crosswalk and machine-readable CSV/JSON registers agree on row
   count, identifiers and status; and
7. documentation links and a focused register-consistency checker pass.

## 6. Containment and rollback

The package changes only version-controlled records. No system or source state
changes. Git history is the rollback mechanism; an incorrect classification is
corrected by an additive amendment explaining the prior value and evidence.

## 7. Follow-on gates

If accepted, the correction can close DB1-BA-001 and classify DB1-BA-002–004.
It does not close DB1-BA-006–009. The owner must then separately decide:

1. whether to approve stored-object integrity checking;
2. whether to approve a rate-bounded live-source parity design; and
3. whether the accepted Backend Assurance capability contract is sufficient to
   start an independent Research Portal proposal.

## 8. Owner decision requested

Approve, amend or decline this exact **repository-only expected-scope and
update-control correction package**. Approval authorises the listed records and
local verification only; it does not authorise an operational DB1 action.
