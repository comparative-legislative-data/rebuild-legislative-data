# Private-Beta Access Local Implementation Package — DEC-0058

**Status:** APPROVED — local code and test artefacts only

**Version:** 1.0.0

**Recorded:** 2 August 2026

**Authority:** Owner instruction to proceed with the private-beta
authentication structure, following DEC-0043 and DEC-0056.

## 1. Exact scope

This package authorises local repository changes only:

1. install the minimum pinned server dependencies for Argon2id, PostgreSQL
   access, secure cookies/rate limiting, and Resend's server SDK;
2. add an `access_control` SQL migration and least-privilege grant specification
   for later review, without connecting to or changing any database;
3. implement the API's server-side authentication/authorisation contracts,
   repositories, token/session/password primitives, rate-limit routes, and
   test doubles;
4. implement the private-beta interface: login, application, password setup,
   settings, and superuser administration views; and
5. add automated tests that prove local state transitions and denial defaults
   using no source data, external email, database, secret, or VPS resource.

## 2. Explicit exclusions

This package does **not** authorise reading or creating `.env` files; database
connection, migration, role/grant application, account bootstrap, Resend API
use/email delivery, VPS access/deployment, Nginx/DNS/public exposure, an
upstream source relay, DB1, DB2, or a research-data route. Runtime behaviour
without an explicitly injected access-control repository is deny-by-default.

## 3. Implementation contract

| Concern | Local implementation requirement |
| --- | --- |
| Passwords | Server-only Argon2id hash/verify; tests use test passwords only. |
| Sessions/tokens | Random opaque values, stored/compared only through SHA-256 + server pepper digests; no browser token store. |
| Cookies | `HttpOnly`, `Secure` in production configuration, `SameSite=Lax`, scoped path, expiry, rotation/revocation contract. |
| Email | A typed delivery interface and non-delivery test double only. Plain links/tokens are never logged or surfaced. |
| Persistence | Repository interface plus SQL migration file only. There is no memory fallback in the running API. |
| Data/source boundary | API has no upstream relay or database-data route. All beta-layer checks operate on named synthetic layer grants only. |
| UI | UI calls only project API routes, does not store a bearer token, and handles a generic non-enumerating response. |

## 4. Verification artefacts

- Typecheck/build and existing shell tests remain passing.
- New local tests cover password hashing; token/session one-way storage;
  consumed/expired/revoked token denial; membership and layer denial; session
  revocation; generic application/login responses; and absence of a configured
  data/source path.
- A migration review artefact identifies the later required access-only schema
  grants and research/DB1 denial checks. It does not claim those grants have
  been applied.

## 5. Completion and next step

The result of this package is local code that is structurally ready for the
DEC-0043 Stage A/B review. It is not an active account system. The next step
will be a separately approved controlled database/secret/email/VPS package,
including actual grant proof and a redacted delivery/bootstrapping test. No
proxy route may be enabled until that access foundation passes.
