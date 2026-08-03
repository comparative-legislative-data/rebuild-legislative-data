# GB-SCT Institutional-Reference Three-Route Private Pass-Through Deployment
# Result — 3 August 2026

**Status:** PASS — target release complete; owner route-by-route acceptance
pending

**Authority:** DEC-0064

**Deployed revision:** `5af063618171af4883318aa7e82629bd97f3dc62`

## 1. Target release scope

The approved project-only release added the local DEC-0064 cohort to the two
existing CLD services only:

| Project route ID | Fixed source path | Target state |
| --- | --- | --- |
| `constituencies.collection` | `/api/constituencies` | `RELAYED_PRIVATE_BETA` |
| `regions.collection` | `/api/regions` | `RELAYED_PRIVATE_BETA` |
| `committee-types.collection` | `/api/committeetypes` | `RELAYED_PRIVATE_BETA` |

The release uses the existing `/srv/cld-gb-sct` deployment path and only
`cld-gb-sct-api.service` and `cld-gb-sct-web.service`. No database migration,
database write, DB1/DB2 action, source capture, cache, secret change, Nginx
change, Cloudflare change, port/exposure change, or shared-service action
occurred.

## 2. Preflight, build, and readiness result

The project-only deployment script passed its preflight for the isolated
cluster, both existing CLD services, pinned private Node runtime, access
configuration file, and the two existing service units. It cloned the deployed
revision, installed dependencies with the pinned runtime, and passed the full
target-host `npm run verify` sequence:

- TypeScript and production web build passed.
- All 16 automated tests passed.
- The six-route no-retention capability scan passed.
- The deterministic B1 archive/manifest was generated.

The immutable release swap and restart of only the two project services passed.
During normal bounded startup polling, two initial loopback API attempts
received connection-refused responses before the process was ready. The
subsequent bounded readiness condition passed, as did the loopback web shell,
the unauthenticated source-route denial check (`403` before any source
request), unchanged Nginx syntax validation, and public HTTPS shell check
(`200`).

No source response was requested, viewed, retained, or transformed by the
deployment process.

## 3. Remaining acceptance boundary

This is target-runtime/deployment evidence, not owner acceptance of the new
source actions. A normal approved beta user must now test the following one at
a time:

1. Open the route badge and confirm the route-specific limitation disclosure
   appears before either action.
2. Select **Open via CLD no-retention relay** and confirm it opens the raw
   Scottish Parliament response in a new tab.
3. Select **Open official Scottish Parliament API directly** and confirm it
   opens the same fixed source path directly.
4. Confirm that no project dataset, transformed preview, DB1/DB2 content,
   chart, export, or superuser control is presented to the normal beta user.

The three actions should be tested separately for Constituencies, Regions, and
Committee Types. The owner’s result is the only basis for marking DEC-0064
complete. A failed route remains unavailable; it does not initiate DB1 work.

## 4. What next

Obtain owner route-by-route beta acceptance, then record a final DEC-0064
acceptance result and update the decision/governance records. The four
`Notes`-bearing institutional-reference routes remain blocked pending their
own handling evidence plan.
