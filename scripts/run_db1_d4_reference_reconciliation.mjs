import { runD4ReferenceReconciliation } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");

const result = await runD4ReferenceReconciliation({
  databaseUrl,
  rawRoot,
  migrate: false
});
process.stdout.write(`${JSON.stringify({
  cycle_id: result.cycleId,
  status: result.status,
  routes: result.routes.map((route) => ({
    route_id: route.routeId,
    state: route.state,
    manifest_id: route.manifestId,
    raw_sha256: route.raw?.digest,
    raw_byte_length: route.raw?.byteLength,
    failure_code: route.failureCode
  }))
})}\n`);
