# Private-Beta Public-Edge Stop Result

**Status:** `BLOCKED` — VPS-private services pass; public edge remains 502

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

## Required next decision

A public-edge diagnosis/correction package must name whether it may inspect or
change Cloudflare-zone settings, DNS, origin TLS/certificate configuration, or
the named site. It must establish why the Cloudflare edge cannot reach the VPS
before another external cutover attempt.
