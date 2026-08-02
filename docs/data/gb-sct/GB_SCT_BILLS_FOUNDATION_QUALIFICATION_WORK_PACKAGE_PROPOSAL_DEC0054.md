# GB-SCT Bills-Foundation Qualification Work Package — DEC-0054

**Status:** Approved — executed STOPPED; no further DEC-0054 request authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision:** DEC-0054, approved by the project owner on 2 August 2026

**Rolling record:** [`GB_SCT_BILLS_FOUNDATION_QUALIFICATION_WORK_PACKAGE_RECORD_2026-08-02.md`](GB_SCT_BILLS_FOUNDATION_QUALIFICATION_WORK_PACKAGE_RECORD_2026-08-02.md)

**Stop result:** [`GB_SCT_BILLS_FOUNDATION_QUALIFICATION_WORK_PACKAGE_STOP_RESULT_2026-08-02.md`](GB_SCT_BILLS_FOUNDATION_QUALIFICATION_WORK_PACKAGE_STOP_RESULT_2026-08-02.md)

## 1. Purpose: faster, bounded qualification

This proposal replaces serial, one-action decision loops for routine
**source qualification only** with one auditable work package. It retains the
project's restrictive data-handling standard while allowing the maintainer to
complete planned normal observations without asking for approval between each
routine request.

It does not reopen the blocked Bills collection/detail handling position.
Those forms remain `DO_NOT_CAPTURE_OR_RELEASE`; their unresolved G1–G4 issues
are recorded and will not delay the separate structured-route reconnaissance
in this package.

## 2. Pre-flight and authority boundary

| Gate item | Record |
| --- | --- |
| Active scope | GB-SCT Phase A source qualification, following DEC-0045 and DEC-0050. |
| Authority sought | One exact work package for the four named Bills-foundation route families below. |
| Affected records | DEC-0008, DEC-0045, DEC-0050–DEC-0053, the master matrix, route-specific observation/handling results, registers, and one rolling work-package record. |
| Known risks | A source response can contain unanticipated fields or values; one family must not be used to infer another's contract; a qualified observation is not capture, reuse, or release authority. |
| Containment | In-memory, value-free observation only; no persistence of response values/identifiers/bytes; no credentials, parameters, retries, redirects, proxies, databases, or public output. |
| Verification | A single rolling evidence record with one concise route result per form, an exact request ledger, stop events, and a final work-package closure. |

## 3. Exact route cohort and permitted requests

The permitted cohort is deliberately limited to the remaining P1 Bills
foundation route forms:

| Route family | Permitted route forms | Maximum requests | Permitted selection rule |
| --- | --- | ---: | --- |
| Formal stages | `/api/billstages`; `/api/billstages/:id` | 2 | The collection response may supply one first-element numeric identifier, held only in memory for the immediately following detail request. |
| Stage types | `/api/billstagetypes`; `/api/billstagetypes/:id` | 2 | Same rule. |
| Bill types | `/api/billtypes`; `/api/billtypes/:id` | 2 | Same rule. |
| Sessions | `/api/sessions`; `/api/sessions/:id` | 2 | Same rule. |

For each family, the collection request precedes the detail request. A detail
request is permitted only if the collection result contains a usable first-
element numeric identifier under the stated rule. If not, do not adapt the
selection method or make the detail request; record a family-level stop.

The package therefore allows no more than eight HTTP `GET` requests in total.
Each request must be unauthenticated, use no query parameters, no request body,
no saved session/cookie, and no redirect following. A 2 MiB received-response
ceiling applies to every request. A response over that ceiling, an unexpected
content type, redirect, authentication/cookie requirement, non-success result,
or unsafe output path stops the affected family without retry or adaptation.

No other API route, route variant, parameter, page, source, search engine,
contact channel, credential, or external service is within scope.

## 4. Data-handling and evidence rules

Responses may be decoded only in volatile memory to determine:

- HTTP outcome, content type, declared/received byte length, elapsed time, and
  top-level JSON kind;
- array/object/root shape; returned element count where applicable; and
- field names, JSON types, presence, null counts, and nested-key names.

Do not write, print, log, commit, transmit, cache, screenshot, hash, store, or
retain source values, response bytes, resolved identifiers, resolved detail
URLs, raw headers, browser history, payload excerpts, or field examples. The
in-memory observer and its input must be disposed of after each family.

Each retained route record must say only what was observed under that one
request. It must label field names/types as unassessed unless an independently
approved source definition exists. No result may make a personal-data,
sensitive-content, licence, completeness, stability, Tier 1/2, or research-
suitability claim.

## 5. Rolling reporting and stop rules

The maintainer will add a concise status entry to the rolling work-package
record after each completed or stopped family, including the next proposed
step. Routine completion of a listed family continues to the next family
without another owner decision. The maintainer must stop the entire work
package and surface the issue promptly if:

- a stop condition in section 3 or 4 occurs and it could affect handling,
  scope, or interpretation;
- a response indicates a potential special-category/sensitive-content concern
  that cannot be contained by the value-free procedure;
- a new route, request form, source, retention need, or system/public action
  would be required; or
- the package reaches its request limit.

At closure, the maintainer will produce a consolidated route-qualification
summary and update the master matrix, risk register, handover, decision
register, and review log. The owner receives the summary and the smallest
proposed next decision; an ordinary successful observation does not expand
operational authority.

## 6. Non-goals and protected boundaries

This package does not authorise Bills collection/detail reclassification;
source capture or retention; proxy, DB1, DB2, codebook, chart, frontend,
account, email, VPS, database, deployment, beta/public output; legal advice or
an external contact; a source licence conclusion; or a claim that a route is
complete, current, stable, safe, or research-ready.

An endpoint family not named in section 3 needs its own proposed cohort or an
explicit extension decision. Any future capture, pass-through, database, or
public-output work needs a distinct decision regardless of this package's
result.

## 7. Operating-control amendment proposed by this decision

If approved, DEC-0054 also adopts the following narrow control pattern for
future source-qualification packages:

> An owner-approved source-qualification work package may authorise a named
> route cohort and a fixed class of transient, value-free observations. The
> package must state every route form, maximum request count, identifier/
> parameter rule, response ceiling, persistence prohibition, permitted retained
> metadata, stop conditions, rolling evidence record, and final closure
> artefact. It cannot authorise capture, retention, release, implementation,
> credentials, external contact, or a new route. Within those limits, normal
> requests and documentation updates may continue without another owner
> approval; any exception stops and returns to the owner.

This amendment will be added to `AGENTS.md` and `GOVERNANCE.md` only if the
owner approves DEC-0054.

## 8. Owner decision

DEC-0054 was approved and stopped after the Formal Stages family. A summary
output exposed the transient selection identifier, so the package cannot
continue or retry under this decision. It does not authorise any action outside
its exact boundaries.
