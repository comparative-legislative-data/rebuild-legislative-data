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
const fixedDb1Routes = ["/db1/gb-sct/bill-types/d2-v1", "/db1/gb-sct/reference-cohort/d4a-v1", "/db1/gb-sct/institutional-reference/d4c-v1", "/db1/gb-sct/formal-stages/d5-v1", "/db1/gb-sct/bills/d6-v1", "/db1/gb-sct/government-roles/d7-v1", "/db1/gb-sct/committee-roles/d8-v1", "/db1/gb-sct/party-roles/d9-v1", "/db1/gb-sct/parties/d10-v1", "/db1/gb-sct/members/d11-v1", "/db1/gb-sct/member-constituency-statuses/d11-v1", "/db1/gb-sct/member-region-statuses/d11-v1", "/db1/gb-sct/member-parties/d11-v1", "/db1/gb-sct/member-party-roles/d11-v1", "/db1/gb-sct/member-government-roles/d11-v1", "/db1/gb-sct/committees/d12-v1", "/db1/gb-sct/mqa-event-types/d13-v1", "/db1/gb-sct/mqa-event-links/d13-v1", "/db1/gb-sct/mqa-event-subtypes/d14-v1", "/db1/gb-sct/mqa-business-consideration/d15-v1", "/db1/gb-sct/mqa-business-programme/d16-v1", "/db1/gb-sct/mqa-questions-2026/d17-v1", "/db1/gb-sct/votes-on-motions-2026/d17-v1"];
const declaredDb1Routes = [...db1RouteSource.matchAll(/app\.get\("(\/db1\/[^\"]+)/g)].map((match) => match[1]);
for (const route of fixedDb1Routes) {
  if (declaredDb1Routes.filter((item) => item === route).length !== 2) throw new Error(`DB1 fixed route must appear in configured and unavailable states: ${route}`);
}
if (declaredDb1Routes.length !== fixedDb1Routes.length * 2 || declaredDb1Routes.some((route) => !fixedDb1Routes.includes(route))) {
  throw new Error("DB1 reader must not expose a generic or alternate DB1 route");
}
if ((db1RouteSource.match(/for \(const route of D18_MQA_ANNUAL_WINDOW_ROUTES\)/g) ?? []).length !== 2 || !db1RouteSource.includes("annualWindowPath(route, \"d18\")")) {
  throw new Error("DB1 historical reader must be limited to the closed D18 annual-window registry");
}
if ((db1RouteSource.match(/for \(const route of D20_OFFICIAL_REPORTS_ROUTES\)/g) ?? []).length !== 2 || !db1RouteSource.includes("annualWindowPath(route, \"d20\")")) {
  throw new Error("DB1 Official Reports reader must be limited to the closed D20 annual-window registry");
}
const db1Explorer = readFileSync("apps/api/src/db1/explorer.ts", "utf8");
for (const term of ["D3_BILL_TYPES_MANIFEST_ID", "D3_BILL_TYPES_PROJECTION", "D4B_REFERENCE_CATALOGUE_ID", "D4B_REFERENCE_PROJECTIONS", "D4C_INSTITUTIONAL_CATALOGUE_ID", "D4C_INSTITUTIONAL_ROUTES", "D5_FORMAL_STAGES_RELEASE_ID", "D5_FORMAL_STAGES_ROUTE", "D6_BILLS_COLLECTION_RELEASE_ID", "D6_BILLS_COLLECTION_ROUTE", "D7_GOVERNMENT_ROLES_RELEASE_ID", "D7_GOVERNMENT_ROLES_ROUTE", "D8_COMMITTEE_ROLES_RELEASE_ID", "D8_COMMITTEE_ROLES_ROUTE", "D9_PARTY_ROLES_RELEASE_ID", "D9_PARTY_ROLES_ROUTE", "D10_PARTIES_RELEASE_ID", "D10_PARTIES_ROUTE", "D11_MEMBER_CONTEXT_ROUTES", "D12_COMMITTEES_RELEASE_ID", "D12_COMMITTEES_ROUTE", "D13_MQA_TAXONOMY_LINK_ROUTES", "D14_MQA_EVENT_SUBTYPES_RELEASE_ID", "D14_MQA_EVENT_SUBTYPES_ROUTE", "D15_MQA_CONSIDERATION_RELEASE_ID", "D16_MQA_PROGRAMME_RELEASE_ID", "D17_MQA_ANNUAL_WINDOW_ROUTES", "AnnualWindowRoute", "mqaAnnualWindow", "member_context_releases", "committees_releases", "mqa_taxonomy_link_releases", "mqa_event_subtypes_releases", "mqa_consideration_releases", "mqa_programme_releases", "mqa_annual_window_releases", "catalogue_releases", "institutional_catalogue_releases", "formal_stages_releases", "bills_collection_releases", "government_roles_releases", "committee_roles_releases", "party_roles_releases", "parties_releases", "begin read only", "fetch(", "node:fs", "raw_object"]) {
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

process.stdout.write("Runtime scope scan passed: selected GB-SCT routes use an authenticated no-retention relay contract; DB2 and research export are absent. DB1 is limited to fixed D3–D20 releases and closed registries.\n");
