import { runD8CommitteeRolesReconciliation, runD8CommitteeRolesProjection } from "../apps/api/dist/db1/foundation.js";

const databaseUrl = process.env.CLD_DB1_DATABASE_URL;
const rawRoot = process.env.CLD_DB1_RAW_ROOT;
const codeRevision = process.env.CLD_RELEASE_ID;
if (!databaseUrl || !rawRoot || !codeRevision) throw new Error("CLD_DB1_DATABASE_URL, CLD_DB1_RAW_ROOT, and CLD_RELEASE_ID are required");
const reconciliation = await runD8CommitteeRolesReconciliation({ databaseUrl, rawRoot, migrate: false });
if (reconciliation.status !== "SUCCEEDED") throw new Error(`D8 Committee roles reconciliation did not succeed: ${reconciliation.status}`);
const release = await runD8CommitteeRolesProjection({ databaseUrl, rawRoot, codeRevision, migrate: false });
process.stdout.write(`${JSON.stringify({ reconciliation, release })}\n`);
