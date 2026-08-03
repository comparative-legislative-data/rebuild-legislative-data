# Private Beta Access Foundation Proposal — DEC-0043

**Status:** Approved foundation specification — exact implementation packages
remain required

**Version:** 1.0.0

**Prepared:** 2 August 2026

**Decision:** DEC-0043, approved by the project owner on 2 August 2026

## 1. Purpose

This proposal turns DEC-0042's approved private-beta requirement into the
first reviewable delivery package. It defines the proposed access-control
foundation that must exist before a tested pass-through, DB1, or DB2 interface
is shown to anyone other than the owner.

It protects the distinction between a research-data layer and the small amount
of personal account data needed to control beta access. It does not create,
inspect, or expose either kind of data.

## 2. Decision and boundary

DEC-0043 approves the following **implementation specification only**:

1. named, private access states and their authorisation rules;
2. an access-control persistence boundary within the already approved
   two-database layout;
3. password, magic-link, invitation, approval, revocation, and audit rules;
4. the minimum secret inventory and Resend dependency boundary; and
5. the acceptance evidence required before any separately approved data-layer
   test is made available to beta users.

It does not authorise dependency installation, code, database roles or schema
migration, account creation, initial-superuser configuration, Resend use,
email delivery, VPS deployment, a data route, source request, capture, DB1,
DB2, download, public routing, or public claim. Each of those actions requires
a subsequent exact implementation package.

## 3. Proposed control architecture

### 3.1 Persistence boundary

The project retains exactly two research databases: `cld_gb_sct_db1` and
`cld_gb_sct_canonical`. No account data may enter DB1 or the raw-capture
archive. The recommended design is an `access_control` schema in
`cld_gb_sct_canonical`, physically and permission-wise separate from all
canonical research schemas and tables.

Two future least-privilege roles would be scoped to that schema only:

| Proposed role | Authority | Explicit exclusion |
| --- | --- | --- |
| `cld_gb_sct_access_migrate` | Version the `access_control` schema in an approved migration. | DB1, raw storage, canonical-research schemas, host administration. |
| `cld_gb_sct_access_runtime` | Read/write only the account-control records required by the application. | DB1, raw storage, canonical-research schemas, schema changes, host administration. |

This keeps personal account records out of the evidence and research-data
layers without introducing a third database. A later schema/package must prove
the grants, `PUBLIC` revocations, and cross-schema denial rather than asserting
them.

### 3.2 Proposed records

The later implementation must use purpose-limited records, with opaque IDs and
UTC timestamps:

| Record | Minimum purpose | Never retain |
| --- | --- | --- |
| `users` | Normalised email, optional username, account state, activation/revocation timestamps. | Password, magic-link, or invitation plaintext. |
| `beta_applications` | Applicant-supplied request and superuser decision trail. | Data-route responses or research data. |
| `memberships` | `SUPERUSER`, `BETA_USER`, or `GUEST`; named layer grants; guest expiry and revocation. | Implied access to unlisted layers. |
| `credentials` | Argon2id password hash and credential lifecycle metadata. | Reversible password or old password. |
| `one_time_tokens` | Purpose, expiry, consumed/revoked timestamp, and a one-way token digest. | Token value or a reusable recovery secret. |
| `access_audit` | Actor, action class, target opaque ID, UTC time, and result. | Credentials, tokens, source payloads, or raw email bodies. |

Application free text must be limited to what is necessary to review beta
access and be governed by the access-retention schedule set in the later
implementation package. It is not research data and must not be included in
research downloads, DB1, DB2, or analytics.

### 3.3 Authentication and authorisation contract

| Concern | Required contract |
| --- | --- |
| Passwords | Passwords are accepted only over the future HTTPS route, hashed using Argon2id with current vetted parameters, and never logged or recoverable. |
| Browser session | A random opaque server-side session, stored only as a digest; cookie is `Secure`, `HttpOnly`, and `SameSite=Lax` (or stricter where compatible). Session rotation and server-side revocation are required. |
| Email links | Activation, sign-in/recovery, and guest-invite links are single-use, purpose-bound, short-lived, and stored only as token digests. Consuming a link invalidates it. |
| Rate limits | Per-account and per-network limits apply to login, magic-link, application, and activation requests. Responses do not disclose whether an email address already exists. |
| Data routes | Both API and browser routes make the same server-side membership and named-layer check. A hidden page or client-side route is never an access control. |
| Roles | Only `SUPERUSER`, approved `BETA_USER`, and expiry-valid `GUEST` memberships can access an explicitly granted beta layer. `BETA_PENDING` and unauthenticated users cannot. |
| Revocation | Superuser revocation invalidates active sessions and unconsumed tokens for the affected user/guest. |

The already approved experience is retained: username/password or magic link
in the login modal; an application modal; in-app superuser approval; an email
activation link leading to password setup and automatic sign-in; password
change without the current password while authenticated; magic-link recovery;
and expiry-bound, revocable guest invitations.

## 4. Secret and email boundary

No secret value belongs in Git, a command line, an operational record, or a
browser bundle. The initial superuser identifier may later be supplied by the
owner in an uncommitted local `.env.local` file for a local implementation
package; it is not requested, read, or recorded by this proposal. A deployed
service must instead receive approved server-side values under DEC-0009's
`/etc/cld-gb-sct/secrets/` policy.

The proposed inventory names only are:

| Name | Purpose |
| --- | --- |
| `ACCESS_SESSION_PEPPER` | Server-only protection for session/token digest derivation. |
| `RESEND_API_KEY` | Server-only sender credential for the existing `legislativedata.org` Resend configuration. |
| `ACCESS_FROM_EMAIL` | Approved sender identity. |
| `INITIAL_SUPERUSER_EMAIL` | One-time bootstrap identifier, removed or disabled after controlled bootstrap. |

Resend is a delivery dependency, not an authority source and not a repository
for account truth. The application records delivery attempt/result metadata
only; it does not retain email bodies or link values. A failed email attempt
cannot silently create an active membership.

## 5. Required staged implementation and acceptance

After DEC-0043, implementation must still be separately proposed in the order
below. Each result is `PASS`, `FAIL`, `BLOCKED`, or `NOT_RUN` and is retained
before the following step.

| Stage | Required evidence | Explicitly not enabled |
| --- | --- | --- |
| A. Schema and grant proof | Versioned schema review; least-privilege grant test; DB1 and research-schema denial test; no secrets in migration/log output. | Accounts, email, or data. |
| B. Local authentication flow | Automated and manual evidence for all state transitions, token single-use/expiry, session revocation, CSRF/rate controls, and no account enumeration. | VPS, Resend delivery, data routes. |
| C. Controlled email and bootstrap | Redacted secret-file/Resend configuration proof; one test application/invitation loop; delivery failure handling. | Any research-data layer. |
| D. Layer gate integration | Server-side denial/allow tests for a named, synthetic layer; superuser approval/revocation and guest expiry proof. | Upstream source, DB1, DB2, download, or public access. |

Only an approved, independently tested future pass-through or data package may
replace the synthetic layer in Stage D. The access foundation itself does not
validate source data.

## 6. Stop conditions

Stop and return a `BLOCKED` result if the two-database/schema separation cannot
be proven; a password or token could be logged or stored reversibly; a data
route can bypass a server-side membership check; a guest lacks explicit expiry;
Resend cannot operate without exposing a secret; account enumeration cannot be
adequately constrained; or a proposed package would expose research content to
an unauthenticated or unapproved user.

## 7. Owner decision

DEC-0043 is approved as the specification for later exact implementation
packages only; it performs none of the described work.
