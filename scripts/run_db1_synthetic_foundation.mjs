import { runSyntheticFoundation } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
if (!databaseUrl || !rawRoot) throw new Error("CLD_DB1_DATABASE_URL and CLD_DB1_RAW_ROOT are required");

const result = await runSyntheticFoundation({
  databaseUrl,
  rawRoot,
  migrationRole: process.env.CLD_DB1_MIGRATION_ROLE || "cld_gb_sct_migrate"
});
process.stdout.write(`${JSON.stringify({
  origin: result.origin,
  raw_sha256: result.raw.digest,
  raw_byte_length: result.raw.byteLength,
  raw_relative_path: result.raw.relativePath,
  projected_records: result.projectedRecords,
  rejected_records: result.rejectedRecords
})}\n`);
