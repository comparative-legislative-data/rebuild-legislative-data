# GB-SCT Proxy P2 Local Implementation Package — DEC-0060

**Status:** PROPOSED — local code and test artefacts only

**Version:** 0.1.0

**Prepared:** 2 August 2026

**Authority requested:** DEC-0060, following DEC-0042, DEC-0043, DEC-0056,
and DEC-0057.

## 1. Decision requested

Approve a local, fail-closed implementation of the private-beta proxy
catalogue and relay boundary. It will make the complete selected route inventory
inspectable to signed-in users while denying every attempted source request as
`UNAVAILABLE_PENDING_QUALIFICATION` before any network operation.

This is deliberately not a partial source relay. No route has yet completed
the route-level handling/qualification work required for relaying. The package
therefore tests the transparency and access contract without requesting,
receiving, retaining, or displaying Scottish Parliament response data.

## 2. Exact local scope

1. Add a versioned GB-SCT route registry generated from the 64 route forms in
   the DEC-0045 matrix. Each entry will contain a stable project route ID,
   source template, parameter grammar, priority, observed operating class,
   qualification state, and concise non-content limitations.
2. Add authenticated catalogue API and interface views. They will state that
   the layer is `UPSTREAM_PASSTHROUGH_DESIGN`, not a dataset, snapshot, DB1,
   or canonical release.
3. Add one authenticated relay-request endpoint which resolves only a route ID
   and an allowlisted parameter object, then rejects the request before
   constructing an upstream URL or calling a network client while the route is
   unqualified.
4. Add tests proving: unauthenticated denial; ordinary beta access to the
   catalogue; absence of superuser-only disclosure in ordinary views; unknown
   route and parameter rejection; unqualified-route network denial; absence of
   upstream client configuration; no response-body storage/logging/cache path;
   and visible route/limitation metadata.
5. Add a concise local implementation result with test outputs, registry count,
   and a statement that zero upstream requests were made.

## 3. Route representation and fail-closed rules

Every inventory form will appear in the catalogue. Its availability is one of:

| Catalogue state | Meaning in this package |
| --- | --- |
| `UNAVAILABLE_PENDING_QUALIFICATION` | Default for every form. The interface shows why no upstream request can be made and the relay endpoint rejects it locally. |
| `UNAVAILABLE_PENDING_DETAIL_CONTRACT` | Used where reconnaissance shows empty/error detail behaviour or an unresolved identifier contract. It also rejects locally. |
| `UNAVAILABLE_EXTREME_VOLUME` | Used for observed whole-history or high-latency forms where no later route-specific relay contract has been approved. It also rejects locally. |

`RELAYED` is not a valid state in this package. Only a later route-specific
qualification and implementation/deployment decision may introduce it. The
registry must retain the observed high-volume and empty-detail limitations from
the reconnaissance records; it must not infer coverage, semantics, pagination,
or currentness.

## 4. Non-negotiable exclusions

This package does not authorise:

- any Scottish Parliament or other external request, network client, upstream
  host configuration, or source-response fixture;
- source-response capture, cache, log body, analytic event, browser storage,
  download, database connection, schema change, DB1, DB2, or variable;
- VPS access, deployment, Nginx/DNS change, secret read/use, Resend action, or
  public exposure; or
- source-data examples, source-derived charts, claims, or a claim that a
  motion-amendment vote is a bill-amendment vote.

The existing access-control database/runtime is not changed. Local tests may
use the existing synthetic access test doubles only.

## 5. Interface and API contract

The authenticated catalogue must expose, for each form: project route ID;
exact upstream template; parameter names/grammar; availability state; route
priority; observed volume/transport profile where recorded; qualification
status; provenance wording; and relevant limitations. It must visibly say:

> No upstream request has been made from this application. This route is not
> yet available for pass-through access.

The relay-request response for every route must use a stable machine-readable
problem code, include the route ID and availability state, and contain no
source content. Inputs may be validated, but their values must not be written
to a log or durable artefact.

## 6. Containment and verification

The implementation contains no configured outbound fetch capability. Its test
double throws if any code attempts a network request; an attempted call fails
the test. Static capability scans must reject upstream hosts, `fetch`/HTTP
client use in runtime relay code, DB1/DB2 routes, database repositories, body
caches, and export/download routes. Existing private-beta regression tests
remain required.

The local result is `PASS` only if the full 64-form registry is present;
unauthenticated and invalid requests are denied; every legitimate relay attempt
is denied locally without a network call; all required catalogue disclosures
are visible; and all existing/local tests pass. A failed test retains no source
value and does not trigger a retry against an upstream.

## 7. Completion boundary and next step

DEC-0060 would complete P2 only as a local, fail-closed catalogue and access
contract. It does not make the proxy available on the VPS or to beta users.

The smallest next decision after a `PASS` local result is a route-qualification
and deployment package for a specifically named, evidence-qualified route
cohort. That package must define the source terms/handling basis, exact
parameter grammar, streaming and body-size controls, no-persistence checks,
beta acceptance, VPS scope, and stop conditions. DB1 remains blocked until the
full proxy phase has passed its separate P4 acceptance gate.
