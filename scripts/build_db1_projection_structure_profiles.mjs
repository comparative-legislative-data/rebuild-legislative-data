import { buildProjectionStructureProfiles } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");

const projectionCount = await buildProjectionStructureProfiles({
  databaseUrl,
  rawRoot,
  migrationRole: process.env.CLD_DB1_MIGRATION_ROLE
});
console.log(JSON.stringify({ status: "PASS", profiled_projection_builds: projectionCount }));
