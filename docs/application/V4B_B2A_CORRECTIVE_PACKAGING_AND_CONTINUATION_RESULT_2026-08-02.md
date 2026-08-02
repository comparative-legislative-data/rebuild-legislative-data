# V4B B2a Corrective Packaging and Continuation Result

**Status:** `PASS` — bounded DEC-0040 recovery and the previously approved
DEC-0039 local deployment are complete

**Date:** 2 August 2026

## Scope and outcome

DEC-0040 was used only to diagnose and correct the target-host B1 package
reproducibility failure.  After the repaired package passed two independent
VPS builds, it completed the existing DEC-0039 final-installation gates.

The deployed outcome remains two locally deployed, synthetic B1 shells. It is
not a source-backed API, DB1 mirror, canonical dataset, research release, or
public website.

## Reproducibility diagnosis and repair

| Check | Result |
| --- | --- |
| B2a hold | One root-owned project staging hold was created below `/srv/cld-gb-sct/staging/` and removed after the final result. |
| Pinned runtime | Official `node-v24.18.1-linux-x64.tar.xz` was checksum-verified and its clear-signed checksum manifest verified with Node release key `DD792F5973C6DE52C432CBDAC77ABFA00DDBF2B7`. No Mac runtime or release build was created. |
| Initial target-host comparison | The two package archives differed (`270330…2024f89a` and `2e5ab2…dd0402d`), and their manifests differed only in the archive digest. Archive path listings, displayed metadata, and extracted-file content digests were identical. |
| Cause and repair | GNU tar retained volatile extended timestamp metadata. Commit `3d05b69` replaced the environment-dependent tar command with a deterministic portable USTAR writer; commit `5b31d90` made the repeat-package helper independent of the caller working directory. No dependency, lockfile, application route, data, database, secret, or capability change occurred. |
| Repaired target-host verification | Two independent package passes under Node `v24.18.1` / npm `11.16.0` produced the same archive SHA-256: `3715cc7d06224f6987184de7ebb607efccdb30affce0871540c0386f0f5e8a1e`. The resulting manifest SHA-256 was `98ad4e45cf5f88823afb61f248147a3c6fdce4fd30c69833bb6c31ece5dcd7b6`. |
| Verification contract | Locked install with lifecycle scripts disabled, capability scan, strict type check, production web build, and the direct repeat-package verifier all passed on the VPS. |

## Local service installation

| Item | Record |
| --- | --- |
| Source commit | `5b31d9072f2d89bf960180365508a8e11444dc56` |
| Immutable release | `/srv/cld-gb-sct/releases/5b31d9072f2d89bf960180365508a8e11444dc56-3715cc7d0622/` (`root:cld-gb-sct`, mode `0750`) |
| Private runtime | `/srv/cld-gb-sct/runtime/node-v24.18.1/` (`root:cld-gb-sct`, mode `0755`); `node --version` is `v24.18.1` |
| API unit | `cld-gb-sct-api.service`; active, `cld-gb-sct:cld-gb-sct`; unit SHA-256 `71e7188efe41d6338432ce14da66277f0df37c77d035b22196f9c6522aba52e1` |
| Web unit | `cld-gb-sct-web.service`; active, `cld-gb-sct:cld-gb-sct`; unit SHA-256 `0c46550c2c390f39ab7db6f5f3550b8ad1586a3a9116e4cecfe2854f2393dbc1` |
| Listener boundary | API is bound only to `127.0.0.1:3210`; web is bound only to `127.0.0.1:3220`. |
| Health contract | API `/healthz` returned the exact synthetic `process_ready` JSON contract and its three no-data/no-database/no-research labels; web `/healthz` returned exact `process_ready` text. |
| Unit boundary | Both units use the private runtime, no environment file, fixed V4A limits (`CPUQuota=35%`, `MemoryMax=768M`, `TasksMax=128`), strict filesystem/privilege hardening, and `IPAddressDeny=any` with loopback-only allow rules. |

Two early start attempts were rolled back automatically: the first checked the
health route before Node was ready, and the second had a privilege boundary in
an evidence-only runtime-tree hash pipeline. Neither was a service failure.
Each rollback removed only the newly created project resources. The final
attempt used a fixed five-second readiness window and a privileged hash
pipeline, and passed all gates.

## Non-interference and exclusions

The post-installation checks passed:

- Protected PostgreSQL clusters `16-main`, `16-bills`, and `16-cld_gb_sct`
  remained active. The protected database-name-set digests were unchanged:
  `41d1c7ede03e0b68c69611d6c544172635c0c59a3c5ff434ea8b9dd87d02609c`
  (`16-main`) and
  `6775a92704adb6b22a832522ee7c35c13edcc0fe0d2ac7f5f855aff159873438`
  (`16-bills`).
- The project cluster remained loopback-only on `127.0.0.1:5434`.
- The immutable release contains no environment file, SQL/migration artefact,
  source capture, raw document, database configuration, or secret path.
- No Nginx, DNS, firewall, public listener, host-wide Node/npm installation,
  shared systemd unit, source endpoint, source data, database schema/login,
  or credential action occurred.
- The B2a diagnostic hold was removed after evidence capture.

## Decision state and next boundary

DEC-0040 is complete. DEC-0039's B2 local deployment is now `PASS` for the
strictly local synthetic shell only. B3 acceptance closure, any database or
secret use, source capture/proxy/DB1/canonical work, charts, Nginx/public
routing, DNS/firewall changes, and any public claim remain separately gated.
