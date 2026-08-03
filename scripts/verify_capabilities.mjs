import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const directories = ["apps", "packages"];
const sourceRelayFile = "apps/api/src/catalogue/source-pass-through.ts";
const directSourceLinkFile = "apps/web/src/main.tsx";
const prohibited = [
  "node:net",
  "node:tls",
  "node:child_process",
  "axios",
  "/proxy/",
  "/db1/",
  "/db2/",
  "raw capture",
  "research export"
];

const localCatalogueFiles = [
  "apps/api/src/catalogue/gb-sct.ts",
  "apps/api/src/access/routes.ts",
  sourceRelayFile
];
const localCatalogueProhibited = [
  "fetch(",
  "node:http",
  "node:https",
  "undici",
  "http://",
  "https://"
];

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "dist" ? [] : filesBelow(path);
    }
    return /\.(?:ts|tsx|css|html)$/.test(entry.name) ? [path] : [];
  });
}

const findings = [];
for (const directory of directories) {
  for (const path of filesBelow(directory)) {
    const content = readFileSync(path, "utf8").toLowerCase();
    for (const term of prohibited) {
      if (content.includes(term.toLowerCase())) {
        findings.push(`${path}: prohibited capability or claim token ${term}`);
      }
    }
    if (path !== sourceRelayFile && path !== directSourceLinkFile && content.includes("data.parliament.scot")) {
      findings.push(`${path}: prohibited capability or claim token data.parliament.scot`);
    }
  }
}

const sourceRelay = readFileSync(sourceRelayFile, "utf8");
for (const term of [
  "https://data.parliament.scot",
  "redirect: \"manual\"",
  "AbortSignal.timeout(20_000)",
  "bill-stage-types.collection",
  "bill-types.collection",
  "sessions.collection"
]) {
  if (!sourceRelay.includes(term)) throw new Error(`${sourceRelayFile}: required fixed relay control is missing: ${term}`);
}
for (const term of ["process.env", "request.query", "searchparams", "node:fs", "node:http", "node:https", "undici", "axios", "/db1/", "/db2/", "cache", "writefile", ".json()", ".text()"] ) {
  if (sourceRelay.toLowerCase().includes(term.toLowerCase())) throw new Error(`${sourceRelayFile}: prohibited source relay capability ${term}`);
}

const directSourceLinks = readFileSync(directSourceLinkFile, "utf8");
for (const term of [
  "https://data.parliament.scot/api/billstagetypes",
  "https://data.parliament.scot/api/billtypes",
  "https://data.parliament.scot/api/sessions",
  "Open official Scottish Parliament API directly",
  "Open via CLD no-retention relay"
]) {
  if (!directSourceLinks.includes(term)) throw new Error(`${directSourceLinkFile}: required fixed direct-source disclosure is missing: ${term}`);
}

if (findings.length > 0) {
  throw new Error(findings.join("\n"));
}

for (const path of localCatalogueFiles) {
  if (path === sourceRelayFile) continue;
  const content = readFileSync(path, "utf8").toLowerCase();
  for (const term of localCatalogueProhibited) {
    if (content.includes(term)) throw new Error(`${path}: local catalogue contains prohibited outbound capability ${term}`);
  }
}

process.stdout.write("Runtime scope scan passed: only the approved fixed no-retention relay and three user-triggered official-source links are present; DB1, DB2, research-export, and all other outbound catalogue routes are absent.\n");
