import { migrateD16MqaProgramme } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL; const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
await migrateD16MqaProgramme({ databaseUrl, rawRoot, migrationRole: process.env.CLD_DB1_MIGRATION_ROLE });
