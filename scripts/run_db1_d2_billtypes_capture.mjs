import { runD2BillTypesCapture } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");
const result = await runD2BillTypesCapture({ databaseUrl, rawRoot, migrationRole: process.env.CLD_DB1_MIGRATION_ROLE || "cld_gb_sct_migrate" });
process.stdout.write(`${JSON.stringify({ route: "/api/billtypes", manifest_id: result.manifestId, run_id: result.runId, status: result.status, content_type: result.contentType, raw_sha256: result.raw.digest, raw_byte_length: result.raw.byteLength })}\n`);
