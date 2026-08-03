# GB-SCT Three-Route Private Pass-Through Deployment Result — 3 August 2026

**Status:** PASS — private project release deployed; owner source-action acceptance pending

**Authority:** DEC-0062 and the local implementation result of 3 August 2026

## Project-only preflight

The approved read-only VPS preflight passed before replacement:

- `postgresql@16-cld_gb_sct.service`, `cld-gb-sct-api.service`, and `cld-gb-sct-web.service` were active.
- Only the established project loopback listeners were observed: PostgreSQL on `127.0.0.1:5434`, API on `127.0.0.1:3210`, and web on `127.0.0.1:3220`.
- The named `legislativedata.org` Nginx site still maps `/api/` only to 3210 and `/` only to 3220. Nginx syntax passed.
- The local web shell and the public HTTPS shell each returned HTTP 200.

No non-project listener, site, database, service, credential, or firewall change was required.

## Release result

Release `45e9ceab652da9df61f8d9e94d0d8e9bde3a78ac` built and verified on the VPS target runtime. The production build, 16 tests, capability scan, and deterministic release package passed there. The new immutable release replaced only `cld-gb-sct-api.service` and `cld-gb-sct-web.service`; it reused the existing project environment/session pepper. It did not write a database, migrate a schema, rotate a credential, write/reload Nginx, change Cloudflare, or change any shared service.

The authorised transparency refinement was subsequently released as `5e76611c0571b6c73c79975b7475b1f89dd6d9fe`. It adds a visibly bordered **Open via CLD no-retention relay** action, a separate **Open official Scottish Parliament API directly** action for the same fixed path, and a dated non-live response guide. The guide presents only prior structural observations, variable names, semantic cautions, and citation guidance; it does not parse, count, or summarise the live response.

The release readiness and post-release checks passed:

- API access status: `ACCESS_CONTROL_READY`.
- Both project services and the isolated cluster: active.
- Unauthenticated fixed-source endpoint: HTTP 403, proving denial before an upstream request.
- Local web shell and public HTTPS shell: HTTP 200.

The deployment script's first API probes occurred immediately after service restart and were connection-refused while the process was still starting. Its bounded readiness loop then reached `ACCESS_CONTROL_READY`; the script exited successfully. This is recorded as startup timing, not a hidden deployment success claim.

## Explicit non-results

This deployment made no Scottish Parliament source request. It created no source response retention, cache, DB1/DB2 content, canonical variable, chart, export, research release, email, public data access, or shared-host change.

## Owner acceptance now required

Sign in at [legislativedata.org](https://legislativedata.org), choose **Route catalogue**, and test the three `RELAYED PRIVATE BETA` cards one at a time:

1. confirm the disclosure appears before the action;
2. distinguish **Open via CLD no-retention relay** from **Open official Scottish Parliament API directly**, then test the relevant one;
3. confirm the new tab shows the raw response rather than a project table or transformed display; and
4. report the result before opening the next route.

`PASS` for DEC-0062 still requires those three owner observations. DB1 remains blocked until the full proxy phase receives its separate beta acceptance.
