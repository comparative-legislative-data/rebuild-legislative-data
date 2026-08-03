# GB-SCT Structured-Link and Event-Taxonomy Private Pass-Through Deployment Result — 3 August 2026

**Status:** PASS — target release and owner acceptance complete

**Authority:** DEC-0066

**Deployed revision:** `d8cd934021fbbf453f1169cf2b6b835c3a1210a5`

The approved release changed only `cld-gb-sct-api.service` and
`cld-gb-sct-web.service` under `/srv/cld-gb-sct`. Target verification passed:
pinned-runtime build, all 16 tests, nine-route capability scan, package
creation, bounded readiness, unauthenticated source-route denial, unchanged
Nginx syntax, and public HTTPS shell HTTP 200. Two initial readiness polls were
connection-refused while the API started; the subsequent bounded readiness
check passed. No source body was requested by deployment.

The owner then confirmed that Committee Type Links, MQA Event Types, and MQA
Event Links each behave as expected using both disclosed actions. The Event
Links historical response-size warning was visible before access. This proves
private no-retention source-access behaviour only; it does not interpret an
identifier, link, committee, or event, or create a dataset, DB1/DB2 asset,
database write, variable, chart, export, public release, or shared-host change.

## What next

DEC-0066 is complete. A future proxy cohort requires its own qualification and
implementation decision; MQA Event Subtypes and the four `Notes`-bearing
collections remain blocked pending handling assessment.
