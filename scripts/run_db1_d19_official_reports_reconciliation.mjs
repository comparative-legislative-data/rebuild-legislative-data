import { runD19OfficialReportsReconciliation, runD19OfficialReportsProjections } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID;
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");
const reconciliation = await runD19OfficialReportsReconciliation({ databaseUrl, rawRoot, migrate: false });
if (reconciliation.status !== "SUCCEEDED") throw new Error(`D19 Official Reports reconciliation did not succeed: ${reconciliation.status}`);
const releases = await runD19OfficialReportsProjections({ databaseUrl, rawRoot, codeRevision, migrate: false });
process.stdout.write(`${JSON.stringify({ reconciliation, releases })}\n`);
