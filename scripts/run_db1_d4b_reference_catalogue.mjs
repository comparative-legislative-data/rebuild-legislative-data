import { runD4BReferenceCatalogueProjections } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID;
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");

const result = await runD4BReferenceCatalogueProjections({
  databaseUrl,
  rawRoot,
  codeRevision,
  migrationRole: process.env.CLD_DB1_MIGRATION_ROLE || "cld_gb_sct_migrate"
});
process.stdout.write(`${JSON.stringify(result)}\n`);
