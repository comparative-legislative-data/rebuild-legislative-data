# V4B B3 Local Acceptance Proposal — DEC-0041

**Status:** Approved — execution pending

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision:** DEC-0041, owner approved 2 August 2026

## 1. Purpose and bounded outcome

DEC-0039/DEC-0040 installed two strictly loopback-only synthetic B1 services.
This proposal is a final, read-only local acceptance record for that named
state. It does not alter or extend the deployment.

The outcome, if every check passes, is a restricted B3 record establishing
only that the named services were healthy and isolated at the recorded time.
It must not call them a source-backed API, database-backed application,
research release, public website, or `legislativedata.org` service.

| Field | Record |
| --- | --- |
| Active phase | V4B B3 — local acceptance record |
| Decision requested | DEC-0041, after the B2/B2a `PASS` result |
| Permitted effect | Read-only VPS inspection and a restricted result document only |
| Mutable targets | None on the VPS. The only repository changes are the retained B3 result and governance/register updates. |
| Evidence baseline | [`V4B_B2A_CORRECTIVE_PACKAGING_AND_CONTINUATION_RESULT_2026-08-02.md`](V4B_B2A_CORRECTIVE_PACKAGING_AND_CONTINUATION_RESULT_2026-08-02.md) |

## 2. Exact checks

All checks use local host commands only, with fixed short timeouts. They may
emit only non-secret configuration metadata, SHA-256 digests, service state,
and health responses. They must not print database names, environment values
other than the fixed `HOST`/`PORT` contract, source responses, service logs,
or unrelated process command lines.

| Area | Required passing condition |
| --- | --- |
| Release identity | The active API and web units reference the private Node `v24.18.1` runtime and exactly the recorded immutable release path; the release and unit SHA-256 values match the B2a result. |
| Service state | Only `cld-gb-sct-api.service` and `cld-gb-sct-web.service` are checked; both are enabled, active, and running as `cld-gb-sct:cld-gb-sct`. |
| Health contract | Local `127.0.0.1` requests to `/healthz` return the exact API synthetic contract and web `process_ready` text. No other route is requested. |
| Listener/exposure boundary | Each service has exactly its assigned IPv4 loopback listener (`3210`, `3220`); no wildcard, IPv6, public, Nginx, DNS, firewall, or public routing check/change is made. |
| Least-privilege boundary | `systemctl show` confirms the two approved unit paths, no environment file, fixed resource limits, systemd hardening, and loopback-only network policy. The release contains no environment file, SQL/migration artefact, database configuration, source capture, raw document, or secret path. |
| Database and shared-host non-interference | `16-main`, `16-bills`, and `16-cld_gb_sct` remain active; the protected-cluster database-name-set digests match the B2a record without retaining names; the project PostgreSQL listener remains `127.0.0.1:5434`. No database login is attempted by either application service. |
| Staging and scope boundary | The B2a staging hold remains absent; no new project runtime/release/unit is present; no host-wide package, account, credential, Nginx, DNS, firewall, source, or data action is taken. |

## 3. Stop conditions

Stop and record `BLOCKED` without changing the VPS if any required service is
inactive; a digest/path/owner/health/listener/hardening value differs; an
unexpected project resource is found; the protected-cluster digest/state or
project database listener differs; output would include an unknown secret or
unrelated service detail; or any check would require a write, restart,
reload, route request beyond `/healthz`, source request, database access by an
application, credential action, or public exposure.

A B3 failure does not authorise a repair. A corrective action requires a new,
separately approved decision with an exact target and rollback scope.

## 4. Explicit exclusions retained

DEC-0041 would not authorise application, dependency, release, runtime,
systemd, database, account, secret, source, capture, proxy, DB1, canonical
variable, chart, document, Nginx, DNS, firewall, certificate, public listener,
or `legislativedata.org` change. It also does not authorise a public claim or
the next V4C cutover stage.

## 5. Acceptance and record

The result is `PASS` only when every §2 condition passes and the restricted
result is committed with the decision/risk/dependency/governance updates. The
result records check time, source revision/release identity, unit and release
digests, health/listener/hardening summaries, protected-cluster digest/state
comparison, exclusions, and any exception. It contains no secret, key,
database name, source content, or unrelated-service record.

## 6. Decision requested

Approve DEC-0041 to run only the read-only B3 checks above and commit the
restricted acceptance result. A `PASS` would close V4B's local synthetic-shell
sequence; it would not authorise V4C or any data/public work.
