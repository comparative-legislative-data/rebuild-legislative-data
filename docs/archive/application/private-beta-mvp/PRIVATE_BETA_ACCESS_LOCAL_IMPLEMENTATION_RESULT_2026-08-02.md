# Private-Beta Access Local Implementation Result — 2 August 2026

**Status:** PASS — local structural foundation only; not an active account or
data-access system

**Authority:** DEC-0058

## 1. Completed local scope

- Added server-only Argon2id password hash/verify and opaque random
  token/session digest primitives.
- Added secure-cookie and route-specific rate-limit registration, with all
  access routes fail-closed until an explicitly injected repository exists.
- Added `GET /auth/status` and generic unavailable responses for login,
  magic-link, application, and password routes. No route connects to a
  database, email provider, source, DB1, DB2, or proxy.
- Added the private-beta UI structure: login, beta application, settings, and
  superuser-review views. Every action currently says access is not configured
  and creates no account, request, email, or data access.
- Added an unapplied `access_control` migration artefact and a separate grant
  specification that requires later proof of access-only permissions and DB1/
  research-schema denial.

## 2. Dependencies

The locked local dependency set includes `@fastify/cookie` 11.1.2,
`@fastify/rate-limit` 10.3.0, `argon2` 0.44.0, `pg` 8.22.0, and `resend`
6.18.1. No credential, configuration value, account, database connection,
email, or external source request was used.

## 3. Verification

`npm run verify` passed:

1. Typecheck and production web build passed.
2. Eight tests passed, including Argon2id behaviour, opaque-token digest
   behaviour, fail-closed access routes, existing health/loopback controls,
   and web boundary disclosure.
3. The capability scan passed with no prohibited data, network, secret, or
   claim token in application/package source.
4. The deterministic local package script completed.

The local machine reported Node 24.14.1/npm 11.11.0 while the repository
declares Node 24.18.1/npm 11.16.0. This is recorded as a target-host runtime
verification requirement, not evidence about deployment compatibility.

## 4. Boundary and next step

No database migration/grant, initial superuser bootstrap, secret read, Resend
delivery, VPS deployment, source relay, DB1, DB2, or public access occurred.

The next proposed step is a controlled access-runtime package: prove the
access-only schema grants and DB1/research denial on the designated project
database; inject server-side secrets; conduct a redacted Resend/bootstrap test;
and deploy/test the authenticated synthetic layer. That step needs a new
explicit owner approval.
