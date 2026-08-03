import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(repositoryRoot, "apps/api/src/db1");
const forbidden = ["node:http", "node:https", "node:net", "node:tls", "undici", "axios", "cron", "schedule", "setinterval", "settimeout", "/db1/"];
const required = ["SYNTHETIC_TEST_ONLY", "persistSyntheticRawObject", "manifest_entries", "projection_rejections", "set role", "D2_BILL_TYPES_URL", "redirect: \"manual\"", "D2_MAX_BYTES"];
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
for (const path of [join(repositoryRoot, "apps/api/src/server.ts"), join(repositoryRoot, "apps/api/src/access/routes.ts")]) {
  if (readFileSync(path, "utf8").includes("/db1/")) throw new Error(`${path}: D1 must not expose a route`);
}
process.stdout.write("DB1 capability scan passed: D1 foundation plus one fixed D2 source request; no scheduler or public DB1 route.\n");
