import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(repositoryRoot, "apps/api/src/db1");
const forbidden = ["node:http", "node:https", "node:net", "node:tls", "undici", "axios", "cron", "setinterval", "settimeout", "/db1/"];
const required = ["SYNTHETIC_TEST_ONLY", "persistSyntheticRawObject", "manifest_entries", "projection_rejections", "set role", "D2_BILL_TYPES_URL", "redirect: \"manual\"", "D2_MAX_BYTES", "D3_BILL_TYPES_MANIFEST_ID", "runD3BillTypesProjection", "D3 raw-object integrity check failed"];
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
if ((foundation.match(/https:\/\/data\.parliament\.scot\/api\/billtypes/g) ?? []).length !== 1) throw new Error("foundation.ts: D2 must contain exactly one fixed source URL");
if ((foundation.match(/request\(D2_BILL_TYPES_URL/g) ?? []).length !== 1) throw new Error("foundation.ts: D2 must contain exactly one source request capability");
const routes = readFileSync(join(repositoryRoot, "apps/api/src/access/routes.ts"), "utf8");
if (!routes.includes('"/db1/gb-sct/bill-types/d2-v1"')) throw new Error("access routes: D3 fixed private route missing");
if (/app\.get\("\/db1\/(?!gb-sct\/bill-types\/d2-v1)/.test(routes)) throw new Error("access routes: generic DB1 route is prohibited");
process.stdout.write("DB1 capability scan passed: D1 foundation, one fixed D2 source request, and one fixed D3 private projection route; no scheduler or generic DB1 route.\n");
