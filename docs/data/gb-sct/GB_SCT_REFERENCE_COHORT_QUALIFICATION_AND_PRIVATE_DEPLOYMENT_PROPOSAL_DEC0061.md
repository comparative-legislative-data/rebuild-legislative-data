# GB-SCT Reference Cohort Qualification and Private-Deployment Proposal — DEC-0061

**Status:** PROPOSED — no source request, implementation, deployment, or public action authorised

**Version:** 0.1.0

**Prepared:** 3 August 2026

**Decision requested:** DEC-0061, following DEC-0042, DEC-0043, DEC-0045, DEC-0055, DEC-0056, DEC-0057, and DEC-0060.

## 1. Decision requested

Approve a documentation/evidence qualification package for this first named
three-route collection cohort only:

| Project route ID | Exact source route form | Reason for selection |
| --- | --- | --- |
| `bill-stage-types.collection` | `/api/billstagetypes` | Small P1 reference route for later source-defined stage terminology. |
| `bill-types.collection` | `/api/billtypes` | Small P1 reference route for later source-defined bill-type terminology. |
| `sessions.collection` | `/api/sessions` | Small P1 reference route for later session context. |

It would authorise only the qualification work in Section 3. It would not
authorise a source relay, new API observation, source client, VPS action,
deployment, DB1, DB2, cache, public release, or variable. The private
deployment design in Section 5 is deliberately not authorised.

## 2. Why this cohort

Existing reconnaissance already observed these collection forms as JSON arrays
with 34, 7, and 6 returned elements respectively. It recorded their field/type
profiles, no-query collection form, and the absence of useful HTTP update
validators for Bill Types and Sessions. That evidence is sufficient for a
route-contract starting point and must be reused rather than re-requested.

The outstanding issue is route-level published basis and handling—not another
technical exploration. None of the three current observations establishes
source-defined semantics, historical completeness, session-boundary rules, or
the applicability of a general licence to these routes.

Bills and Formal Stages remain outside this cohort because their existing
handling positions are more restrictive. Detail forms are outside it because
they require identifier selection and add no needed capability for a first
collection-only transparency test. No selected route is retired by this choice.

## 3. Qualification work if approved

### Q1 — targeted published-basis inspection

Inspect only the already identified Scottish Parliament API catalogue and
linked published source-use/licence/terms pages that might bear on the three
named forms. Retain page URL, access date, title, identified policy/terms, and
a concise applicability or `UNKNOWN` finding. Do not infer route applicability
from a general licence where the published material does not establish it.

### Q2 — route handling assessment from existing evidence

Use the existing Bills-foundation reconnaissance, update-signal result,
endpoint matrix, retention/publication policy, and Q1 evidence to make one
explicit handling decision per form. **No endpoint request is permitted in
this package.** Do not retain source response values, identifiers, text,
bytes, fixtures, caches, downloads, logs, or database rows.

Each row must conclude one of:

- `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE`;
- `BLOCKED_PENDING_SOURCE_TERMS_OR_HANDLING`; or
- `UNAVAILABLE_PENDING_FURTHER_EVIDENCE`.

Candidate means only that a route may be proposed for a later private
pass-through implementation. It does not mean the route is live, complete,
current, semantically validated, or suitable for a research variable.

## 4. Evidence thresholds and stops

| Question | Threshold for candidate status | Stop condition |
| --- | --- | --- |
| Published basis | Traceable published position, or an explicit unresolved finding. | No route-specific applicability can be established. |
| Existing transport evidence | Existing no-query JSON observation remains adequate and uncontradicted. | A record conflict or unresolved material transport uncertainty. |
| Handling | No unresolved licence, personal-data, retention, or publication concern for narrow beta pass-through. | Any such concern remains open. |
| Meaning | Source-provided reference route is described without interpreting fields. | Any inferred bill stage, bill type, session boundary, or completeness claim. |

An unresolved row is a transparent valid result: it stays visible and
unavailable in the catalogue. There is no fallback to a cached response, DB1,
or inferred result.

## 5. Subsequent private-deployment design (not authorised)

If and only if a named route receives candidate status and the owner approves a
new exact package, the later package may propose to:

1. enable only the approved collection IDs in the registry;
2. map each ID to one fixed source template with no query parameters, arbitrary
   URL/host, or client-selected header;
3. stream source status, content type, and body without transformation or
   server-side persistence, while separately showing project transparency
   metadata;
4. restrict access to approved beta/guest accounts and retain only minimal
   non-content operational event metadata; and
5. deploy solely through the existing isolated services and named Nginx site,
   after a fresh project-only VPS preflight.

That later package must test access denial before source access, exact
allowlisting, streaming/failure disclosure, no-persistence, and private
frontend behaviour. It cannot enable a route merely because another route
passed.

## 6. Explicit exclusions

- Every detail form and every route outside the three named collections.
- API endpoint requests, source relay/client code, VPS/deployment, secret use,
  Nginx/DNS, or email action.
- DB1, DB2, database/caching, source retention, export, chart, variable,
  research claim, or public release.
- Interpretation of `Sequence`, bill-type labels, session names, or session
  dates.

## 7. Result and next step

The result will retain only the Q1 policy/terms evidence and three handling
outcomes. If a route is a candidate, the smallest next step is a separate
private implementation/deployment proposal for that exact route or cohort. If
it is unresolved, the next step is a route-specific evidence plan, not a
relay workaround. DB1 remains blocked until full proxy-phase beta acceptance.
