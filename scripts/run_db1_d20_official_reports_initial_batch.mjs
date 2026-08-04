import { runD20OfficialReportsInitialBatch, runD20OfficialReportsProjections } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID;
const routeLimit = Number(process.env.CLD_D20_ROUTE_LIMIT ?? "2");
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");
const reconciliation = await runD20OfficialReportsInitialBatch({ databaseUrl, rawRoot, migrate: false, routeLimit });
if (reconciliation.status !== "SUCCEEDED") throw new Error(`D20 Official Reports initial batch did not succeed: ${reconciliation.status}`);
const releases = await runD20OfficialReportsProjections({ databaseUrl, rawRoot, codeRevision, migrate: false });
process.stdout.write(`${JSON.stringify({ reconciliation, releases })}\n`);
