import { migrateD4CInstitutionalReference } from "../apps/api/dist/db1/foundation.js";
const databaseUrl = process.env.CLD_DB1_DATABASE_URL; const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
await migrateD4CInstitutionalReference({ databaseUrl, rawRoot, migrationRole: process.env.CLD_DB1_MIGRATION_ROLE || "cld_gb_sct_migrate" });
