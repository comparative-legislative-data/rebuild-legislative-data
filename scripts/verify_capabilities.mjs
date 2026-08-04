import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const directories = ["apps", "packages"];
const sourceRelayFile = "apps/api/src/catalogue/source-pass-through.ts";
const directSourceLinkFile = "apps/web/src/main.tsx";
const d2CaptureFile = "apps/api/src/db1/foundation.ts";
const db1RouteFiles = ["apps/api/src/access/routes.ts", "apps/api/src/server.ts", "apps/web/src/main.tsx"];
const prohibited = [
  "node:net",
  "node:tls",
  "node:child_process",
  "axios",
  "/proxy/",
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
    if (content.includes("/db1/") && !db1RouteFiles.includes(path)) {
      findings.push(`${path}: DB1 route capability is not permitted here`);
    }
    if (path !== sourceRelayFile && path !== directSourceLinkFile && path !== d2CaptureFile && content.includes("data.parliament.scot")) {
      findings.push(`${path}: prohibited capability or claim token data.parliament.scot`);
    }
  }
}

const db1RouteSource = readFileSync("apps/api/src/access/routes.ts", "utf8");
const fixedDb1Routes = ["/db1/gb-sct/bill-types/d2-v1", "/db1/gb-sct/reference-cohort/d4a-v1", "/db1/gb-sct/institutional-reference/d4c-v1", "/db1/gb-sct/formal-stages/d5-v1", "/db1/gb-sct/bills/d6-v1", "/db1/gb-sct/government-roles/d7-v1", "/db1/gb-sct/committee-roles/d8-v1"];
const declaredDb1Routes = [...db1RouteSource.matchAll(/app\.get\("(\/db1\/[^\"]+)/g)].map((match) => match[1]);
for (const route of fixedDb1Routes) {
  if (declaredDb1Routes.filter((item) => item === route).length !== 2) throw new Error(`DB1 fixed route must appear in configured and unavailable states: ${route}`);
}
if (declaredDb1Routes.length !== fixedDb1Routes.length * 2 || declaredDb1Routes.some((route) => !fixedDb1Routes.includes(route))) {
  throw new Error("DB1 reader must not expose a generic or alternate DB1 route");
}
const db1Explorer = readFileSync("apps/api/src/db1/explorer.ts", "utf8");
for (const term of ["D3_BILL_TYPES_MANIFEST_ID", "D3_BILL_TYPES_PROJECTION", "D4B_REFERENCE_CATALOGUE_ID", "D4B_REFERENCE_PROJECTIONS", "D4C_INSTITUTIONAL_CATALOGUE_ID", "D4C_INSTITUTIONAL_ROUTES", "D5_FORMAL_STAGES_RELEASE_ID", "D5_FORMAL_STAGES_ROUTE", "D6_BILLS_COLLECTION_RELEASE_ID", "D6_BILLS_COLLECTION_ROUTE", "D7_GOVERNMENT_ROLES_RELEASE_ID", "D7_GOVERNMENT_ROLES_ROUTE", "D8_COMMITTEE_ROLES_RELEASE_ID", "D8_COMMITTEE_ROLES_ROUTE", "catalogue_releases", "institutional_catalogue_releases", "formal_stages_releases", "bills_collection_releases", "government_roles_releases", "committee_roles_releases", "begin read only", "fetch(", "node:fs", "raw_object"]) {
  if (term === "fetch(" || term === "node:fs" || term === "raw_object") {
    if (db1Explorer.toLowerCase().includes(term.toLowerCase())) throw new Error(`DB1 explorer contains prohibited capability ${term}`);
  } else if (!db1Explorer.includes(term)) {
    throw new Error(`DB1 explorer control missing: ${term}`);
  }
}

const sourceRelay = readFileSync(sourceRelayFile, "utf8");
for (const term of [
  "https://data.parliament.scot",
  "redirect: \"manual\"",
  "AbortSignal.timeout(timeoutMs(route))",
  "route.template",
  "encodeURIComponent"
]) {
  if (!sourceRelay.includes(term)) throw new Error(`${sourceRelayFile}: required relay control is missing: ${term}`);
}
for (const term of ["process.env", "request.query", "searchparams", "node:fs", "node:http", "node:https", "undici", "axios", "/db1/", "/db2/", "cache", "writefile", ".json()", ".text()"] ) {
  if (sourceRelay.toLowerCase().includes(term.toLowerCase())) throw new Error(`${sourceRelayFile}: prohibited source relay capability ${term}`);
}

const directSourceLinks = readFileSync(directSourceLinkFile, "utf8");
for (const term of [
  "https://data.parliament.scot/api/billstagetypes",
  "https://data.parliament.scot/api/billtypes",
  "https://data.parliament.scot/api/sessions",
  "https://data.parliament.scot/api/constituencies",
  "https://data.parliament.scot/api/regions",
  "https://data.parliament.scot/api/committeetypes",
  "https://data.parliament.scot/api/committeetypelinks",
  "https://data.parliament.scot/api/motionsquestionsanswerseventtypes",
  "https://data.parliament.scot/api/motionsquestionsanswerseventlinks",
  "Source action",
  "Downloads raw JSON from the Scottish Parliament source",
  "via CLD no-retention relay",
  "from Scottish Parliament API directly"
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

process.stdout.write("Runtime scope scan passed: selected GB-SCT routes use an authenticated no-retention relay contract; DB2 and research export are absent. DB1 is limited to fixed D3, D4A, D4C, D5, D6, D7, and D8 routes.\n");
