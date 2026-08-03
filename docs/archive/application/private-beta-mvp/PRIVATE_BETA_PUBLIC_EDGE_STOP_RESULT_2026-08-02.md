# Private-Beta Public-Edge Stop Result

**Status:** `SUPERSEDED / RESOLVED` — retained as the earlier stopped attempt

**Date:** 2 August 2026

**Authorising decision:** DEC-0059

## Evidence

| Boundary | Result |
| --- | --- |
| Access-control migration | Pass: schema and records were created only in `cld_gb_sct_canonical`. |
| Access-only runtime role | Pass: the intended runtime role connected to the canonical database. |
| Project services | Pass: the API reported its ready state and the web service responded through their loopback-only ports. |
| Named Nginx site | Pass locally: the temporary `legislativedata.org` configuration relayed `/api/` to the project API. |
| Public Cloudflare request | Blocked: `https://legislativedata.org/` returned HTTP 502. |
| Containment | The prior named Nginx file and prior project units were restored after the failed public check. |

No source request, source relay, DB1, DB2, canonical research output, chart,
download, or public data route was enabled.

## Resolution

This stop was resolved under the existing DEC-0059 package. The cause was the
deployment procedure: it restored the named site to its legacy `127.0.0.1:3100`
upstream and checked the Nginx proxy before the reload had settled. The retry
waited for the named proxy's ready response and retained the configuration once
the origin check passed. Direct-origin and normal public HTTPS then both
returned HTTP 200. No Cloudflare, DNS, firewall, certificate, shared-Nginx,
source, DB1, DB2, or research-data action was required.

See the final result in
[`PRIVATE_BETA_RUNTIME_AND_PRIVATE_CUTOVER_PACKAGE_DEC0059.md`](PRIVATE_BETA_RUNTIME_AND_PRIVATE_CUTOVER_PACKAGE_DEC0059.md).
