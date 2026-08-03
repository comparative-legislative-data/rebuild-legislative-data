# V4B B3 Local Acceptance Result

**Status:** `PASS` — local synthetic-shell acceptance only

**Decision:** DEC-0041

**Check time (UTC):** 2 August 2026, 09:35:07

## Scope and conclusion

The DEC-0041 read-only B3 acceptance checks passed. This closes the V4B
B0–B3 sequence for the two named, local-only synthetic B1 services. It does
not establish a source-backed API, database-backed application, research
release, public website, or `legislativedata.org` service.

No VPS resource was changed during this acceptance check.

## Acceptance evidence

| Area | Result |
| --- | --- |
| Active immutable release | `/srv/cld-gb-sct/releases/5b31d9072f2d89bf960180365508a8e11444dc56-3715cc7d0622/`, owned `root:cld-gb-sct`, mode `0750`; its identity matches the B2a record. |
| Private runtime | `/srv/cld-gb-sct/runtime/node-v24.18.1/`, owned `root:cld-gb-sct`, mode `0755`; `node --version` is `v24.18.1`. |
| API service | Enabled and active as `cld-gb-sct:cld-gb-sct`; unit SHA-256 `71e7188efe41d6338432ce14da66277f0df37c77d035b22196f9c6522aba52e1`. |
| Web service | Enabled and active as `cld-gb-sct:cld-gb-sct`; unit SHA-256 `0c46550c2c390f39ab7db6f5f3550b8ad1586a3a9116e4cecfe2854f2393dbc1`. |
| Health routes | API `127.0.0.1:3210/healthz` returned the exact synthetic `process_ready` contract; web `127.0.0.1:3220/healthz` returned exact `process_ready` text. No other route was requested. |
| Listener boundary | Only the expected IPv4 loopback listeners on `127.0.0.1:3210` and `127.0.0.1:3220` were accepted. |
| Least privilege | Both units retained the approved private executable paths, no environment file, fixed resource limits, strict systemd hardening, and loopback-only network policy. |
| Release exclusions | No environment file, SQL/migration artefact, database configuration, source capture, raw document, or secret path was present in the immutable release. |
| Protected services | `16-main`, `16-bills`, and `16-cld_gb_sct` remained active. The protected database-name-set digests were unchanged: `41d1c7ede03e0b68c69611d6c544172635c0c59a3c5ff434ea8b9dd87d02609c` and `6775a92704adb6b22a832522ee7c35c13edcc0fe0d2ac7f5f855aff159873438`. |
| Project database boundary | The project PostgreSQL listener remained loopback-only on `127.0.0.1:5434`; no application database login was attempted. |
| Scope boundary | The B2a diagnostic hold remained absent. There was one release, one private runtime, and no new project unit. No source, data, secret, account, package, Nginx, DNS, firewall, certificate, public-listener, or shared-service action occurred. |

## Remaining gates

This result authorises no further work. Any V4C public routing/cutover,
database or secret use, source capture/proxy/DB1 work, canonical variables,
charts, or public claim requires its own explicit proposal and owner approval.
