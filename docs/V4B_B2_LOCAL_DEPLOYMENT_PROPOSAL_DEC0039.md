# V4B B2 Local Deployment Proposal — DEC-0039

**Status:** Proposed — owner approval required before any VPS, runtime, release,
unit, or service action

**Version:** 1.0.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0039

## 1. Purpose and limited outcome

DEC-0038 produced a local-only `PASS` for the B1 synthetic application shell.
This proposal is the next V4B package: deploy that shell only inside the
already-created `cld-gb-sct` VPS namespace, as two loopback-only systemd
services.

The outcome is strictly operational. It may show that two named processes can
serve their static, synthetic `process_ready` responses on the project’s
reserved loopback ports. It does **not** create, prove, or imply an API proxy,
DB1 mirror, canonical dataset, source capture, source freshness, research
release, or public service.

| Field | Record |
| --- | --- |
| Active phase | V4B B2 — isolated local deployment |
| Requested authority | DEC-0039, after DEC-0035 (V4A foundation), DEC-0036 (V4B sequence), DEC-0037 (B0 specification), and DEC-0038 (B1 `PASS`) |
| Mutable targets if approved | Only the named project runtime/release paths and `cld-gb-sct-api.service` / `cld-gb-sct-web.service` unit files defined below |
| Protected targets | `16-main`, `16-bills`, all other systemd units, Nginx, DNS, firewall, existing accounts and credentials, all non-project paths, project PostgreSQL contents/roles, and every source endpoint/data asset |
| Known uncertainty | The target host’s CPU architecture, libc compatibility, free capacity, port state, systemd directive support, and absent service-name state have not yet been re-observed. The B1 development pin (`24.14.1`) is not the production runtime selection. |
| Verification artefact | A restricted, non-secret B2 result recording preflight, runtime/release digests, unit checks, loopback health checks, and non-interference results |
| Containment | New private runtime/release directories; two new named loopback-only units; fixed V4A resource limits; no shared configuration or public routing change |

## 2. Decision requested and explicit exclusions

The owner is asked to approve one bounded infrastructure work package that may
perform the ordered operations in this proposal only after every preceding
gate passes. It authorises the necessary SSH and existing sudo use for these
named operations; it does not create or alter SSH keys, login accounts, sudo
policy, passwords, database logins, or secrets.

The package may:

1. perform the read-only preflight in §3;
2. prepare a production-aligned release under the local repository, using the
   exact Node runtime selected in §4 and the existing dependency allowlist;
3. install that private Node runtime and one checksummed release below
   `/srv/cld-gb-sct/`;
4. create, validate, enable, start, and verify exactly the two units in §5;
   and
5. stop and roll back only the newly created project resources as specified in
   §8 if a package check fails.

It does **not** authorise any of the following:

- a source request, capture, proxy, parser, DB1, canonical-variable, chart,
  document, or research-data action;
- PostgreSQL connection, schema/migration, database write, runtime database
  login, password, secret, or environment file;
- use of `16-main` or `16-bills` other than the stated read-only
  non-interference checks;
- a host-wide Node/npm package, Docker resource, service-account/privilege
  change, firewall/DNS/Nginx/certificate change, public/non-loopback listener,
  or change to `legislativedata.org`; or
- any route other than the API and web `/healthz` checks and the web static
  page already produced by B1.

A failure, unknown result, unexpected occupied port, shared-resource change,
or need to widen this list is `BLOCKED`. It is not a reason to substitute a
port, use a host-wide Node installation, relax a unit setting, or touch an
unlisted service.

## 3. Read-only preflight — all checks must pass

The package begins with a restricted read-only inspection. It records metadata
only: no environment values, secret contents, source responses, database rows,
or unrelated application content.

| Check | Required passing condition | Stop condition |
| --- | --- | --- |
| Project identity | Existing `cld-gb-sct` account and `/srv/cld-gb-sct/{releases,state}` ownership/modes match the V4A namespace; no unexpected project-owned release or runtime is selected for replacement. | Any ambiguity about ownership, an existing release/runtime requiring overwrite, or path outside the project root. |
| Protected PostgreSQL state | `16-main`, `16-bills`, and `16-cld_gb_sct` report their recorded active/down state as applicable; `16-main` and `16-bills` database-name-set digests remain unchanged; the project cluster remains loopback-only on `5434`. | Any protected-cluster state/digest/listener change. |
| Service namespace | `cld-gb-sct-api.service` and `cld-gb-sct-web.service` are absent/inactive with no existing unit fragment, drop-in, socket, timer, or listener using their names. | Any existing unit, dependency, or ambiguous service-name state. |
| Port reservation | `127.0.0.1:3210` and `127.0.0.1:3220` are unused; no wildcard or IPv6 listener occupies either port. | Any occupied/colliding port. |
| Host compatibility | CPU architecture is one with an official Node `v24.18.1` Linux binary; libc/kernel and systemd can execute it; `systemd-analyze verify` accepts the final directives in §5. | Unsupported architecture/ABI, unavailable directive, missing required verification tool, or any need for a host-wide runtime. |
| Capacity and limits | The host has the capacity already required by the retained V4A limits: `CPUQuota=35%`, `MemoryMax=768M`, and `TasksMax=128` per new service. | Insufficient capacity, an increased limit, or impact that cannot be bounded to these services. |
| Boundary | No Nginx, firewall, DNS, credential, secret, database-login, database-schema, or project-data action is needed for the B1 shell. | Any dependency on one of those excluded resources. |

The preflight records the exact target OS release, architecture, systemd
version, final unit-verification result, port/listener metadata, project-path
metadata, and protected-cluster state/digests. It must not record passwords,
private keys, environment values, database rows, or unrelated service command
lines.

## 4. Runtime and release procedure

### 4.1 Production runtime selection

On 1 August 2026, the Node.js project listed `v24.18.1` as the current Node
24 LTS release. DEC-0039 pins B2 to that exact patch, rather than assuming the
local B1 development runtime remains suitable for the VPS. The release note
must retain the consulted official Node release page, selected archive name,
SHA-256, Node signing-key fingerprint, and signature/checksum verification
result. If the release is no longer available, fails verification, or is not
compatible with the preflight host, stop; choosing another patch requires a
new proposal.

The only allowed runtime source is the official Node distribution for
`v24.18.1`:

```text
https://nodejs.org/dist/v24.18.1/node-v24.18.1-linux-<x64|arm64>.tar.xz
https://nodejs.org/dist/v24.18.1/SHASUMS256.txt
https://nodejs.org/dist/v24.18.1/SHASUMS256.txt.sig
```

The package must verify the selected archive against `SHASUMS256.txt` and
verify that checksum manifest using the documented Node release signing key
before extraction. A missing verifier/key, failed signature, failed digest,
or unexpected architecture is a stop condition. It must not fall back to an
unverified download, a distribution package, `nvm`, a container, a build from
source, or `/usr/bin/node`.

The verified runtime is extracted once to the new private path:

```text
/srv/cld-gb-sct/runtime/node-v24.18.1/
```

It is owned by `root:cld-gb-sct`, is not writable by `cld-gb-sct`, and must
not alter `/usr/bin`, `PATH` globally, a package-manager database, or another
workload’s runtime. Its exact binary version and directory mode are recorded.

### 4.2 Runtime-aligned B2 release

The current B1 artefact is retained as B1 evidence; it must not be relabelled
as a production release. Before transfer, this package creates one new B2
release from a clean committed repository revision with only the runtime
metadata alignment necessary to replace the B1 local `24.14.1` pin by
`24.18.1` (including the corresponding root lockfile metadata). It must then
run the complete B1 verification contract and reproduce the deterministic
archive/manifest check under Node `24.18.1`.

This alignment must add no dependency, route, database/secret capability,
source/network capability, research logic, or public claim. It must retain a
new local result with the source commit, exact Node/npm versions, lockfile
digest, archive digest, manifest digest, and five-test result. If any
capability scan, test, lockfile, or determinism check fails, no VPS transfer
occurs.

The resulting immutable deployment path is:

```text
/srv/cld-gb-sct/releases/<git-commit>-<archive-sha256-prefix>/
```

The archive is transferred to a new staging directory below that project root,
its recorded SHA-256 is compared before extraction, and the final release is
owned by `root:cld-gb-sct` and not writable by `cld-gb-sct`. No release path
is overwritten. The service account may read the release but cannot change
code or dependencies. The staging directory is removed only after successful
digest comparison and extraction; it is a declared project-owned rollback
target.

## 5. Final systemd unit contract

The two final unit files are the only new files permitted below
`/etc/systemd/system/`. `RELEASE_ID` is the exact immutable directory name
created in §4.2; this is the only permitted substitution. The Node path is the
fixed private runtime selected in §4.1.

`/etc/systemd/system/cld-gb-sct-api.service`:

```ini
[Unit]
Description=Comparative Legislative Data API (synthetic B1 shell)
After=network.target
StartLimitIntervalSec=60
StartLimitBurst=3

[Service]
Type=simple
User=cld-gb-sct
Group=cld-gb-sct
WorkingDirectory=/srv/cld-gb-sct/releases/RELEASE_ID/apps/api
ExecStart=/srv/cld-gb-sct/runtime/node-v24.18.1/bin/node dist/server.js
Environment=HOST=127.0.0.1
Environment=PORT=3210
Restart=on-failure
RestartSec=5s
UMask=0027
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectKernelLogs=true
ProtectControlGroups=true
ProtectHostname=true
RestrictSUIDSGID=true
LockPersonality=true
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
IPAddressDeny=any
IPAddressAllow=127.0.0.0/8
IPAddressAllow=::1/128
ReadWritePaths=/srv/cld-gb-sct/state
CPUQuota=35%
MemoryMax=768M
TasksMax=128

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/cld-gb-sct-web.service` is identical except for:

```ini
Description=Comparative Legislative Data web application (synthetic B1 shell)
WorkingDirectory=/srv/cld-gb-sct/releases/RELEASE_ID/apps/web
ExecStart=/srv/cld-gb-sct/runtime/node-v24.18.1/bin/node dist/server/server.js
Environment=PORT=3220
```

The units must not use `EnvironmentFile`, a secret, a database URL,
`RuntimeDirectory`, an elevated capability, an inherited global `PATH`, or a
write location outside `/srv/cld-gb-sct/state`. `IPAddressDeny` plus the two
loopback allow rules prohibit external network access at the service boundary;
the application itself remains subject to the B1 no-network capability check.

The package may run `daemon-reload`, enable, and start only these two units
after `systemd-analyze verify` accepts their concretised files. It must not
reload/restart Nginx, PostgreSQL, SSH, a package manager, or another service.

## 6. Required acceptance and non-interference checks

After each start, the package performs only local checks with a short fixed
timeout. A start failure triggers §8; it does not trigger a configuration
workaround.

| Area | Required result |
| --- | --- |
| API route | `curl --fail --max-time 5 http://127.0.0.1:3210/healthz` returns the exact B1 JSON schema, `application/json`, `process_ready`, and the three B1 capability labels. |
| Web route | `curl --fail --max-time 5 http://127.0.0.1:3220/healthz` returns exactly `process_ready` as `text/plain`. |
| Listener boundary | Each port has one listener bound only to its assigned IPv4 loopback address; no wildcard, public, or unexpected IPv6 listener is introduced. |
| Unit boundary | `systemctl show` confirms the named user/group, private runtime `ExecStart`, read-only immutable release, declared hardening, no environment file, and the V4A CPU/memory/task limits. |
| No-data boundary | Deployed release listing and process metadata show no source archive, raw document, database configuration/driver, secret, environment file, migration, or added route. |
| Protected PostgreSQL | `16-main` and `16-bills` remain active with their preflight database-name-set digests; the project cluster remains on loopback `5434`. No database connection is attempted by either new service. |
| Shared-host boundary | No Nginx, DNS, firewall, package database, global Node path, existing systemd unit, account, or non-project path changed. |

The B2 result is `PASS` only if every row passes. It must call the services
**locally deployed synthetic shells**, not a data API, research service, or
public website. The retained record includes unit-file SHA-256 values, release
and runtime SHA-256 values, status/port/health summaries, and before/after
protected-cluster evidence. It excludes sensitive values and application logs
that could contain unrelated information.

## 7. Stop conditions and decision boundaries

Stop immediately and seek a new owner decision if the package discovers an
existing unit or port collision, insufficient capacity, unsupported unit
directive, runtime verification/compatibility problem, a different Node patch,
an existing project release requiring overwrite, a service needing a secret or
database, a change outside the named paths/units, a protected-cluster
difference, or a public-routing requirement.

No B2 result authorises B3 local-acceptance closure, Nginx cutover, public
availability, source work, database work, credentials, or a broader
application feature. Those retain their separately approved gates.

## 8. Containment and rollback

Rollback is allowed only for the resources created by this package and only if
the failure occurs before a `PASS` result:

1. stop and disable `cld-gb-sct-api.service` and `cld-gb-sct-web.service`;
2. remove only their two new unit files and run `daemon-reload`;
3. remove only the newly created release staging/final directory and the new
   `runtime/node-v24.18.1` directory, after recording their exact paths and
   digests; and
4. re-run the restricted port, protected-cluster-state/digest, and
   no-Nginx/no-other-unit checks.

Rollback must never remove the V4A database cluster, either project database,
project account, `/srv/cld-gb-sct/state`, a prior release/runtime, a shared
unit, a host package, or a non-project file. If the actual target differs from
these declared resources, leave it in place, record `BLOCKED`, and seek an
exact corrective decision.

## 9. Decision requested

Approve DEC-0039 to execute the bounded B2 package in §§2–8 and retain its
restricted verification result. Approval would permit only the private
Node `v24.18.1` runtime, one runtime-aligned B1 release, and the two specified
loopback synthetic-shell units, conditional on the required preflight and
stop rules. It does not permit any excluded system, data, credential, database,
or public-web action.
