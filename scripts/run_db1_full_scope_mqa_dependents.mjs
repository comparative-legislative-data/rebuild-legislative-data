import { runFullScopeMqaDependents } from "../apps/api/dist/db1/full-scope.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID;
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");
process.stdout.write(`${JSON.stringify(await runFullScopeMqaDependents({ databaseUrl, rawRoot, codeRevision }))}\n`);
