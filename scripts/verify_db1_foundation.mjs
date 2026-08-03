import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = "apps/api/src/db1";
const forbidden = ["fetch(", "node:http", "node:https", "node:net", "node:tls", "undici", "axios", "data.parliament.scot", "cron", "schedule", "setinterval", "settimeout", "/db1/"];
const required = ["SYNTHETIC_TEST_ONLY", "persistSyntheticRawObject", "manifest_entries", "projection_rejections", "set role"];
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
for (const path of ["apps/api/src/server.ts", "apps/api/src/access/routes.ts"]) {
  if (readFileSync(path, "utf8").includes("/db1/")) throw new Error(`${path}: D1 must not expose a route`);
}
process.stdout.write("DB1 D1 capability scan passed: synthetic-only internal foundation; no source, scheduler, or public DB1 route.\n");
