import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(repositoryRoot, "apps/api/src/db1");
const forbidden = ["node:http", "node:https", "node:net", "node:tls", "undici", "axios", "cron", "setinterval", "/db1/"];
const required = ["SYNTHETIC_TEST_ONLY", "persistSyntheticRawObject", "manifest_entries", "projection_rejections", "set role", "D2_BILL_TYPES_URL", "redirect: \"manual\"", "D2_MAX_BYTES", "D3_BILL_TYPES_MANIFEST_ID", "runD3BillTypesProjection", "D3 raw-object integrity check failed", "D4_REFERENCE_ROUTES", "runD4ReferenceReconciliation", "pg_try_advisory_xact_lock", "BLOCKED_BY_SOURCE_DRIFT", "SKIPPED_OVERLAP"];
const files = readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.isFile() && entry.name.endsWith(".ts") ? [join(root, entry.name)] : []);
for (const path of files) {
  const content = readFileSync(path, "utf8").toLowerCase();
  for (const token of forbidden) {
    if (content.includes(token)) throw new Error(`${path}: forbidden D1 capability ${token}`);
  }
}
const foundation = readFileSync(join(root, "foundation.ts"), "utf8");
for (const token of required) {
  if (!foundation.toLowerCase().includes(token.toLowerCase())) throw new Error(`foundation.ts: required D1 control missing: ${token}`);
}
if ((foundation.match(/https:\/\/data\.parliament\.scot\/api\/billtypes/g) ?? []).length !== 2) throw new Error("foundation.ts: D2/D4 must contain only the fixed Bill Types source URL declarations");
if ((foundation.match(/request\(D2_BILL_TYPES_URL/g) ?? []).length !== 1) throw new Error("foundation.ts: D2 must contain exactly one source request capability");
const routes = readFileSync(join(repositoryRoot, "apps/api/src/access/routes.ts"), "utf8");
if (!routes.includes('"/db1/gb-sct/bill-types/d2-v1"')) throw new Error("access routes: D3 fixed private route missing");
if (/app\.get\("\/db1\/(?!gb-sct\/bill-types\/d2-v1)/.test(routes)) throw new Error("access routes: generic DB1 route is prohibited");
for (const route of ["https://data.parliament.scot/api/billtypes", "https://data.parliament.scot/api/billstagetypes", "https://data.parliament.scot/api/sessions"]) {
  if (!foundation.includes(route)) throw new Error(`foundation.ts: D4 fixed reference route missing: ${route}`);
}
if ((foundation.match(/await fetchD4ReferenceCollection\(route, request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D4 must have one fixed route fetch call site");
process.stdout.write("DB1 capability scan passed: D1 foundation, fixed D2/D4 reference capture routes, and one fixed D3 private projection route; no generic DB1 route.\n");
