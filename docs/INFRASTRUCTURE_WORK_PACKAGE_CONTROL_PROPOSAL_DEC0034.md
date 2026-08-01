# Infrastructure Work-Package Control Proposal — DEC-0034

**Status:** Proposed — no operational action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0034

## Purpose

Adopt a proportionate control model for routine project infrastructure work on
the shared VPS. It retains owner control over material boundaries while ending
the requirement for a new decision for every normal command, validation, or
tool-syntax correction inside an approved work package.

This proposal does **not** relax the evidence, retention, provenance, batch,
or approval controls for source data, DB1, canonical variables, charts,
research claims, or public releases.

## Approved-work-package model

Before execution, the owner approves one named work package that states its
project namespace, exact resource classes, permitted outcome, protected
resources, limits, verification checks, and rollback/containment position.
Within that approved package, the maintainer may choose ordinary command
syntax, repeat harmless read-only checks, and correct an implementation detail
when all of the following remain true:

- the target and permitted end state do not change;
- no protected resource is touched;
- no public listener, credentials, login privilege, source data, or application
  service is introduced;
- the action remains additive or is a declared, project-owned rollback; and
- the restricted work-package result records commands by intent, outcomes, and
  verification.

An implementation failure does not by itself require a new owner decision if a
correction remains wholly inside the approved package and does not change the
resource class, exposure, privilege, or intended end state. The maintainer
must record the correction and continue to stop on the conditions below.

## Mandatory owner gates

A new explicit owner decision remains required before any of the following:

- deletion or overwrite outside a declared project-owned target;
- change to `16-main`, `16-bills`, another workload, host-wide PostgreSQL, or
  shared Nginx/systemd/firewall/DNS/certificate configuration;
- non-loopback network exposure, domain cutover, or public endpoint;
- issuing a secret, password, login/SSH/sudo capability, or permission outside
  the approved project namespace;
- source request, capture, storage of source content, parsing, DB1/canonical
  data creation, public release, or research claim;
- package installation, host-wide resource-policy change, or a material
  increase in an approved service resource limit; or
- any uncertainty about a deletion target, privilege boundary, or impact on an
  unrelated service.

## Required record and verification

Each package must retain a restricted operational result with its scope,
changes by target, stop conditions encountered, before/after checks, and
non-secret verification evidence. Project documentation receives a concise
outcome and governance review after a material package or an unexpected stop;
it need not receive a decision entry for each internal command.

## Owner decision

Approve or reject DEC-0034. Approval authorises updating the governance
procedure and `AGENTS.md` to use this work-package model for future VPS
infrastructure work only. It does not authorise any particular VPS change;
each package still requires a named owner-approved scope.
