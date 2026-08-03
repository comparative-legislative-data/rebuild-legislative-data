# Pilot Access-Flow Reconnaissance — 2 August 2026

**Status:** Read-only untrusted reference — not source evidence, implementation
authority, or a migration plan

**Authority:** Project-owner sanction on 2 August 2026

**Scope performed:** Read only named non-secret source/manifests in the local
pilot repository, `/Users/stevenmacgregor/Documents/GitHub/ScottishParliamentBills`.
Environment files, secret-named files, credentials, database contents, source
data, binaries, deployment state, and external services were not read or used.

## 1. Why this reference was useful

The pilot contains the user-flow concepts that informed the owner’s requested
private-beta experience: application, superuser review, password setup,
password sign-in, magic-link sign-in, and a settings screen. It also confirms
that the pilot used Resend as an email-delivery integration. None of these are
evidence that the pilot is secure, complete, running, or suitable for reuse.

## 2. Findings relevant to DEC-0043

| Pilot concept observed | Rebuild disposition |
| --- | --- |
| Beta application followed by administrator approval and a setup invitation. | Retain as a product requirement, using DEC-0043 `BETA_PENDING` and `BETA_USER` states. |
| Magic-link sign-in/recovery. | Retain as a product requirement, using single-use, short-lived, purpose-bound digest-only tokens. |
| Automatic sign-in after password setup. | Retain as a product requirement, using an opaque server-side session. |
| Superuser administration surface. | Retain as a product requirement, limited to applicant decisions, memberships, guest invitations, and revocation. |
| Resend delivery integration. | Retain as a future server-only delivery dependency under DEC-0009/DEC-0043; no pilot configuration or value is reused. |

## 3. Patterns expressly not adopted

| Pilot pattern observed in source | Reason it is not carried forward |
| --- | --- |
| Browser-side bearer session token held in local storage. | A script-accessible browser store is not the DEC-0043 opaque, `HttpOnly`, server-side session model. |
| Magic/setup token supplied in a URL query string and sent to a GET authentication route. | Query tokens risk exposure through browser history, logs, and referrers; the rebuild will use purpose-bound, single-use token handling without retaining token values. |
| Plain token values stored in database records and setup URLs exposed through the administrative interface when mail is unavailable. | DEC-0043 requires digest-only token storage and forbids exposing usable links/credentials through administrative UI or records. |
| Bcrypt password implementation and a password-change form requiring the old password. | DEC-0043 specifies Argon2id and allows an authenticated user to set a replacement password without re-entering the prior one. |
| Client-side route checks that show an alert before redirecting. | The rebuild requires server-side membership and named-layer enforcement on every data route. |
| Pilot database combines access-control and legislative tables. | The rebuild keeps access-control outside DB1 and isolated from canonical research schemas/permissions. |

## 4. Consequence

The pilot validates the usability of the intended flow, not the technical
implementation. DEC-0043 remains the authoritative foundation. A later exact
implementation package must specify the Fastify/React implementation, schema
and grants, dependency selection, token/session interfaces, Resend secret
handling, tests, migration, and controlled deployment; it may not copy pilot
code or configuration by default.
