import { migrateFullScope } from "../apps/api/dist/db1/full-scope.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID ?? "full-scope-migration";
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
await migrateFullScope({ databaseUrl, rawRoot, codeRevision, migrationRole: process.env.CLD_DB1_MIGRATION_ROLE });
