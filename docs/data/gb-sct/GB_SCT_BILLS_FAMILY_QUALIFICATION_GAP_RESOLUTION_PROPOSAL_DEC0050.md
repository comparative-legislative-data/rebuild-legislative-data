# GB-SCT Bills Family Qualification-Gap Resolution Proposal — DEC-0050

**Status:** Proposed planning control — no source request, capture, proxy,
DB1, DB2, frontend, or public action authorised

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0050

## 1. Purpose and pre-flight

| Gate item | Record |
| --- | --- |
| Active phase and approved programme scope | GB-SCT three-layer programme design under DEC-0042; this is a documentation-only qualification plan. |
| Authority for proposal preparation | Owner instruction to proceed after DEC-0049. No authority to execute any later evidence-gathering package exists yet. |
| Affected records | DEC-0008, DEC-0044–DEC-0049; the two Bills rows in DEC-0045; the two route-handling assessments; and any later separately approved qualification package/result. |
| Known uncertainty and risk | Both `/api/bills` and `/api/bills/:id` are `DO_NOT_CAPTURE_OR_RELEASE`. Generic source licence evidence does not settle route/field coverage, personal-data treatment, retention, permitted use, parameter/technical conditions, or public-output fit. |
| Smallest proposed change and containment | Adopt a single evidence-gap register and ordered decision sequence. No external interaction, source-data selection, source-content retention, system change, or public claim occurs. |
| Verification artefact | A completed Bills-family qualification result that marks each gap `EVIDENCED`, `UNRESOLVED`, `BLOCKED`, or `NOT_APPLICABLE`, links its evidence, and states the resulting route-handling consequence. |

The objective is not to force the Bills routes into implementation. It is to
make explicit what would be required before either route could be reconsidered
for a less restrictive class, and to leave the routes visibly blocked if that
evidence cannot be obtained.

## 2. Current consolidated position

| Route form | Current route evidence | Current handling outcome | Operational consequence |
| --- | --- | --- | --- |
| `/api/bills` | DEC-0044 terms result; DEC-0046 value-free collection observation; DEC-0047 handling assessment | `DO_NOT_CAPTURE_OR_RELEASE` | No capture, DB1, proxy, native access, canonical output, beta output, or public output. |
| `/api/bills/:id` | DEC-0044 terms result; DEC-0048 value-free detail observation; DEC-0049 handling assessment | `DO_NOT_CAPTURE_OR_RELEASE` | No capture, DB1, proxy, native access, canonical output, beta output, or public output. |

Both forms remain part of the DEC-0045 intended inventory. Inclusion in that
inventory is not operational authority and does not reduce the stated block.

## 3. Evidence-gap register and resolution sequence

Each row must be resolved separately for the collection and detail route where
the evidence or consequence differs. A route can move no further than the
least-resolved applicable row.

| Gap | What must be established | Permitted resolution path | Stop condition / current position |
| --- | --- | --- | --- |
| G1 — source authority and licence coverage | Whether the stated reuse licence applies to the exact route responses and all intended uses, and the required attribution/non-endorsement presentation. | A separately approved, documentation-only inspection of identified official source/terms material, or an official written clarification retained as non-content evidence. | Current evidence is `PARTIAL_OR_CONDITIONAL`; do not infer coverage from generic publication or API availability. |
| G2 — request and technical conditions | Authentication, permitted parameters, rate/concurrency, user-agent, redirect, pagination, error, change/deprecation, caching, and availability conditions relevant to the proposed use. | A separately approved official-documentation inspection; if documentation cannot resolve a material condition, a later exact transient technical-observation proposal may be considered. | One successful observation is not an operating-condition or rate-policy claim. No unbounded probing, retries, or parameter exploration. |
| G3 — field definitions and identifier semantics | Source definitions for fields; route/parameter semantics; collection/detail relationship; identifier stability and error behaviour. | A separately approved official-documentation inspection, then—only for an unresolved essential technical question—a separately approved value-free observation. | Field names/types and a single selected identifier do not establish definitions, stability, parity, or suitability for Tier 1. |
| G4 — personal-data, sensitive-content, and linking screen | Whether proposed capture, linkage, retention, and output can be assessed for the actual content and field combinations; whether any field demands a stricter purpose/access/retention boundary. | A documented project handling assessment based on applicable source evidence and, where needed, owner direction or appropriate specialist advice. | Public availability or a generic privacy statement does not settle the project's processing risk. Until assessed, preserve `DO_NOT_CAPTURE_OR_RELEASE`. |
| G5 — retention, access, correction, and removal fit | A compatible purpose, retention term, accountable role, least-privilege access model, audit boundary, and correction/restriction/removal process. | A later route-handling revision and implementation design, only after G1–G4 support it. | DEC-0008's seven-year default is not authority to retain this source content. No raw/DB1 store may be designed or created before conflict resolution. |
| G6 — truthful output and research fit | Whether a capture-backed native-access or canonical output can state its source, route/parameter contract, limitations, lineage, verification and Tier 1/2 meaning truthfully. | A later separate proxy/DB1/canonical proposal with codebook and verification contracts. | Neither Bills observation creates a dataset, a Tier 1 variable, a mirror claim, or public-access authority. |

## 4. Required sequencing and decision gates

1. **G1–G3 source evidence first.** Prepare a later exact documentation-
   inspection proposal naming the official materials to be inspected, the
   questions, retained non-content output, and stop rules. It must not call an
   API route or retain a page body/source record.
2. **G4 project handling decision second.** Reassess personal-data and linking
   implications against source evidence. If information is absent or needs a
   policy judgement, record `BLOCKED_PENDING_OWNER_DECISION` rather than treat
   the absence as low risk.
3. **G5 route-handling revision third.** Revise a handling record only when
   prior evidence supports a stated class, retention/access boundary, and
   correction/removal process. A less restrictive class requires explicit
   owner approval.
4. **G6 operational proposal last.** Only then may a separate capture,
   capture-backed native-access, DB1, or canonical proposal be prepared. Each
   has its own approval and verification gate.

An `UNRESOLVED`, `BLOCKED`, or conflicting result at any point stops the
affected route at `DO_NOT_CAPTURE_OR_RELEASE`. It does not alter the other
route or the wider inventory.

## 5. Non-goals and containment

This proposal does not authorise:

- a Scottish Parliament API request, parameter selection, content retrieval,
  browsing of unapproved official material, contact with the source, or
  specialist advice engagement;
- capture, retention, caching, DB1/DB2 work, source registry creation,
  proxying, frontend/account work, VPS/database work, or a public/beta output;
- a legal conclusion, a statement that an observed field is or is not personal
  data, or a claim that a route is complete, stable, current, reusable, or
  suitable for research; or
- retirement of either Bills route from the inclusion-first inventory.

If a later evidence package needs a new route, parameter, source, credential,
content retention, external contact, legal advice, system access, or a less
restrictive class, it stops for a new explicit owner decision. No workaround
is permitted.

## 6. Acceptance result and next action

The DEC-0050 result is `PASS` only when the Bills-family qualification result
records every G1–G6 status, its evidence/limitation, both route consequences,
and a clear next decision. `BLOCKED` or `UNRESOLVED` is an acceptable and
preferable outcome where evidence is unavailable.

If DEC-0050 is approved, the smallest next document is a proposed **Bills
official-documentation qualification inspection** limited to G1–G3. It would
require its own owner approval before any external page is opened.

## 7. Owner decision

DEC-0050 is `PROPOSED`. Approval would adopt this gap-resolution sequence as
the planning control for the two Bills routes. It would not authorise any
external inspection, source request, retention, capture, implementation, or
public action.
