import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const directories = ["apps", "packages"];
const sourceRelayFile = "apps/api/src/catalogue/source-pass-through.ts";
const directSourceLinkFile = "apps/web/src/main.tsx";
const prohibited = ["node:net", "node:tls", "node:child_process", "axios", "/db1/", "/db2/", "raw capture", "research export"];

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "dist" ? [] : filesBelow(path);
    return /\.(?:ts|tsx|css|html)$/.test(entry.name) ? [path] : [];
  });
}

const findings = [];
for (const directory of directories) {
  for (const path of filesBelow(directory)) {
    const content = readFileSync(path, "utf8").toLowerCase();
    for (const term of prohibited) if (content.includes(term.toLowerCase())) findings.push(`${path}: prohibited capability or claim token ${term}`);
    if (path !== sourceRelayFile && path !== directSourceLinkFile && content.includes("data.parliament.scot")) findings.push(`${path}: outbound Scottish Parliament source capability is not permitted here`);
  }
}

const sourceRelay = readFileSync(sourceRelayFile, "utf8");
for (const term of ["https://data.parliament.scot", "redirect: \"manual\"", "AbortSignal.timeout(timeoutMs(route))", "route.template", "encodeURIComponent"]) {
  if (!sourceRelay.includes(term)) throw new Error(`${sourceRelayFile}: required relay control is missing: ${term}`);
}
for (const term of ["process.env", "request.query", "searchparams", "node:fs", "node:http", "node:https", "undici", "axios", "/db1/", "/db2/", "cache", "writefile", ".json()", ".text()"]) {
  if (sourceRelay.toLowerCase().includes(term.toLowerCase())) throw new Error(`${sourceRelayFile}: prohibited source relay capability ${term}`);
}

const directSourceLinks = readFileSync(directSourceLinkFile, "utf8");
for (const term of ["https://data.parliament.scot/api/billstagetypes", "https://data.parliament.scot/api/billtypes", "https://data.parliament.scot/api/sessions", "Source action", "via CLD no-retention relay", "from Scottish Parliament API directly"]) {
  if (!directSourceLinks.includes(term)) throw new Error(`${directSourceLinkFile}: required fixed direct-source disclosure is missing: ${term}`);
}

if (findings.length > 0) throw new Error(findings.join("\n"));
process.stdout.write("Runtime scope scan passed: the authenticated GB-SCT Live API catalogue uses a no-retention relay; Database mirror and DB2 capabilities are absent.\n");
