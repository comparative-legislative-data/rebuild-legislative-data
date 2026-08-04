import { migrateD14MqaEventSubtypes } from "../apps/api/dist/db1/foundation.js";
const databaseUrl = process.env.CLD_DB1_DATABASE_URL; const rawRoot = process.env.CLD_DB1_RAW_ROOT; const migrationRole = process.env.CLD_DB1_MIGRATION_ROLE;
if (!databaseUrl || !rawRoot || !migrationRole) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_DB1_MIGRATION_ROLE are required");
await migrateD14MqaEventSubtypes({ databaseUrl, rawRoot, migrationRole });
