# GB-SCT DB1 MQA 2026 annual-window cohort result — DEC-0096

**Status:** `PASS — DEPLOYED; OWNER INTERFACE ACCEPTED`
**Scope:** Exactly the two approved 2026 source URLs; no other year is enabled.

Questions retained 4,375 source objects and Votes on Motions retained 19,473,
with zero projection rejections. Each has an initial source capture and an
immediate `UNCHANGED` comparison. The serial D17 timer is active daily at
07:15 UTC. The raw bytes, manifest, digest, source position, reconciliation
record, and fixed private release remain distinct per route.

The first Votes attempt was retained as `FAILED: CONTENT_TYPE`: the source
uses a download-style media type. No body was retained for that failed attempt.
The corrected transport preserves the source-declared media type while still
requiring JSON-array bytes; the next approved capture passed. This is a
transport correction, not a semantic or data transformation.

The fixed releases are **MQA questions · 2026** and **Votes on motions · 2026**.
The year is embedded in each source URL; there is no client year selector,
generic query, raw-object route, download, DB2 variable, or bill-stage claim.
Votes on motions do not establish votes on bill amendments.

## What next

The owner accepted both private DB1 panels. A later year may use the reusable
annual-window mechanism only through a named approval and a literal source URL;
it does not require another pipeline implementation.
