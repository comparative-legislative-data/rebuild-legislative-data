import { runD11MemberContextReconciliation, runD11MemberContextProjections } from "../apps/api/dist/db1/foundation.js";
const databaseUrl = process.env.CLD_DB1_DATABASE_URL; const rawRoot = process.env.CLD_DB1_RAW_ROOT; const codeRevision = process.env.CLD_RELEASE_ID;
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");
const reconciliation = await runD11MemberContextReconciliation({ databaseUrl, rawRoot, migrate: false });
if (reconciliation.status !== "SUCCEEDED") throw new Error(`D11 Member-context reconciliation did not succeed: ${reconciliation.status}`);
const releases = await runD11MemberContextProjections({ databaseUrl, rawRoot, codeRevision, migrate: false });
process.stdout.write(`${JSON.stringify({ reconciliation, releases })}\n`);
