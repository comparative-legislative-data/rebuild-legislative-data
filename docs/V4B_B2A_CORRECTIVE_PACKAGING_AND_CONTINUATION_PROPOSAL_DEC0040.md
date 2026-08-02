# V4B B2a Corrective Packaging and Continuation Proposal — DEC-0040

**Status:** Proposed — owner approval required

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision requested:** DEC-0040

## 1. Purpose

DEC-0039 correctly stopped before final deployment when two target-host package builds differed. Its automatic staging cleanup preserved containment but discarded the most useful diagnostic evidence and forced a full rebuild for any repair.

This proposal preserves the same safety boundary while making contained infrastructure recovery faster. It permits one corrective package to diagnose and repair the release-packaging code, retain a short-lived VPS diagnostic hold, and continue directly to the already-specified loopback deployment only after the reproducibility gate passes.

It does not change the data, database, secret, public-routing, account, privilege, host-wide-runtime, resource-limit, or service-exposure boundary.

## 2. Approved-work-package model requested

If approved, DEC-0040 authorises a single bounded B2a work package with this sequence:

1. recreate only a root-owned project staging directory and re-run the DEC-0039 preflight;
2. re-establish the signature/checksum-verified private Node v24.18.1 runtime in that staging area;
3. reproduce the package mismatch while retaining both generated package variants and their non-secret structural comparison;
4. immediately notify the owner of the observed difference and begin the permitted contained repair below without waiting for another approval;
5. commit the minimal repair, rebuild and re-verify entirely on the VPS; and
6. only if all acceptance checks pass, complete the existing DEC-0039 final runtime/release/unit steps and their local acceptance checks.

The staging directory is a diagnostic hold, not a deployed release. It is root-owned, group-readable only by cld-gb-sct, not served, not executed by systemd, and has no database, secret, source-data, or public-network capability.

## 3. Exact mutable scope

| Area | Permitted target |
| --- | --- |
| Local repository | scripts/package_b1_release.mjs; package-reproducibility tests or verification helpers directly supporting it; DEC-0040 records/results. No application route, contract, dependency, lockfile, source-model, or research-logic change. |
| VPS diagnostic hold | One new /srv/cld-gb-sct/staging/b2a-<commit>/ path, including a signed/checksummed Node runtime, clean Git source archive, node_modules used only for the build, two package variants, manifests, and comparison metadata. |
| Final VPS targets, conditional | The exact DEC-0039 private runtime path, one immutable release path, and cld-gb-sct-api.service / cld-gb-sct-web.service only after §6 passes. |

The package must not alter existing PostgreSQL clusters, project database contents/roles, system accounts, sudo/SSH, Nginx/DNS/firewall/certificates, host package databases, any other service, or any non-project path. It must not access source data or add a dependency.

## 4. Diagnostic hold and notification rule

On a package, unit, or local-acceptance failure inside the declared project staging area:

- stop before moving any final runtime/release or installing/enabling/starting a unit;
- record the failed command class, exit status, inputs, digests, and a restricted structural comparison;
- send the owner a concise status update identifying the failed gate and the project-only paths held;
- retain the diagnostic staging directory for up to 24 hours while the permitted repair is attempted; and
- continue with a repair only when it stays inside §3 and preserves every isolation, exposure, privilege, and resource-limit control.

The hold ends immediately, and the staging directory is removed, if it contains an unexpected secret/data artefact, if an unlisted path/privilege/service would be needed, if the owner directs removal, or when the 24-hour window ends. The package then records BLOCKED and seeks direction.

This is a B2a-specific pilot. It does not alter the wider rule that a shared, public, data, credential, destructive, or scope-expanding problem requires a new owner decision.

## 5. Permitted diagnosis and repair

The package may compare the two generated archives and manifests only within the held staging directory. Allowed evidence includes archive entry order, path, mode, uid/gid, timestamp, symlink target, file digest, manifest field, and byte-level differing offsets. It must not inspect database data, unrelated logs, credentials, or any path outside the listed project staging directory.

The maintainer may change only the deterministic-packaging implementation and its directly supporting verification tests. Examples include normalising archive metadata, explicitly setting tar ownership/mode/time/order fields, or excluding an undeclared generated file. The repair must not:

- add, update, or remove a dependency;
- change the API/web source, health contract, capability labels, or service ports;
- relax a check or select one mismatched package as acceptable;
- create a local Mac runtime or local production release; or
- move a final runtime/release or install a unit until the renewed check passes.

Each attempted repair requires a new committed source revision and a new clean Git archive. All dependency installation, build, package generation, and runtime use remain within VPS staging.

## 6. Acceptance gates for continuation

Continuation to the final DEC-0039 deployment steps is allowed only if every condition below passes:

| Gate | Required result |
| --- | --- |
| Preflight/non-interference | The DEC-0039 project path, port, service-name, capacity, listener, protected-cluster state, and database-name-set digest checks pass again. |
| Runtime provenance | Node v24.18.1 archive signature, checksum, binary version, npm version, ownership, and mode pass again in VPS staging. |
| Scope control | Git diff shows only the §3 packaging/test/record targets and no dependency or application-contract change. |
| Build quality | npm ci with scripts disabled, five tests, capability scan, and build all pass under the staged private runtime. |
| Deterministic package | Two independently rebuilt manifests and archives are byte-identical; their contents conform to the existing allowlist. |
| Unit validation | The existing DEC-0039 concrete final units pass systemd-analyze verify before installation. |
| Final deployment | The existing DEC-0039 runtime/release ownership, loopback health, hardening, resource-limit, port, and protected-cluster checks all pass. |

A failed gate retains only the diagnostic hold under §4. It never authorises final deployment by exception.

## 7. Containment and rollback

Before §6 passes, no final runtime/release/unit exists. A failure therefore requires no full infrastructure rollback: the held staging directory is the only mutable VPS target and remains isolated for diagnosis.

After §6 passes, the existing DEC-0039 rollback applies only to the new final project runtime/release and two units. Successful deployment removes the staging directory after the retained result is written. A blocked diagnostic hold records its path and expiration, then removes only that path.

## 8. Evidence and decision requested

The result must retain the two initial DEC-0039 digest pairs; current and repaired source commits; runtime provenance; structural comparison; each repair diff; re-verification results; diagnostic-hold lifecycle; and final non-interference evidence. It must not retain secrets, source data, database names/rows, or unrelated service content.

Approve DEC-0040 to execute the B2a contained-repair-and-continuation package in §§2–7. It allows a notification plus immediate project-staging repair cycle for this narrow build problem, without a redundant full rollback. It does not authorise any broader technical, data, database, public, or shared-host action.
