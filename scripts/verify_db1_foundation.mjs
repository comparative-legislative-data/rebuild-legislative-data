import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = join(repositoryRoot, "apps/api/src/db1");
const forbidden = ["node:http", "node:https", "node:net", "node:tls", "undici", "axios", "cron", "setinterval", "/db1/"];
const required = ["SYNTHETIC_TEST_ONLY", "persistSyntheticRawObject", "manifest_entries", "projection_rejections", "set role", "D2_BILL_TYPES_URL", "redirect: \"manual\"", "D2_MAX_BYTES", "D3_BILL_TYPES_MANIFEST_ID", "runD3BillTypesProjection", "D3 raw-object integrity check failed", "D4_REFERENCE_ROUTES", "runD4ReferenceReconciliation", "D4C_INSTITUTIONAL_ROUTES", "runD4CInstitutionalReconciliation", "D5_FORMAL_STAGES_ROUTE", "runD5FormalStagesReconciliation", "runD5FormalStagesProjection", "D6_BILLS_COLLECTION_ROUTE", "runD6BillsCollectionReconciliation", "runD6BillsCollectionProjection", "D6_MAX_BYTES", "D7_GOVERNMENT_ROLES_ROUTE", "runD7GovernmentRolesReconciliation", "runD7GovernmentRolesProjection", "D7_MAX_BYTES", "D8_COMMITTEE_ROLES_ROUTE", "runD8CommitteeRolesReconciliation", "runD8CommitteeRolesProjection", "D8_MAX_BYTES", "pg_try_advisory_xact_lock", "BLOCKED_BY_SOURCE_DRIFT", "SKIPPED_OVERLAP", "D4B_REFERENCE_CATALOGUE_ID", "D4B_REFERENCE_PROJECTIONS", "catalogue_releases", "runD4BReferenceCatalogueProjections", "D4C_INSTITUTIONAL_CATALOGUE_ID", "institutional_catalogue_releases", "runD4CInstitutionalCatalogueProjections", "D5_FORMAL_STAGES_RELEASE_ID", "formal_stages_releases", "D6_BILLS_COLLECTION_RELEASE_ID", "bills_collection_releases", "D7_GOVERNMENT_ROLES_RELEASE_ID", "government_roles_releases", "D8_COMMITTEE_ROLES_RELEASE_ID", "committee_roles_releases", "D4B raw-object integrity check failed"];
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
for (const route of ["/db1/gb-sct/bill-types/d2-v1", "/db1/gb-sct/reference-cohort/d4a-v1", "/db1/gb-sct/institutional-reference/d4c-v1", "/db1/gb-sct/formal-stages/d5-v1", "/db1/gb-sct/bills/d6-v1", "/db1/gb-sct/government-roles/d7-v1", "/db1/gb-sct/committee-roles/d8-v1"]) {
  if ((routes.match(new RegExp(route, "g")) ?? []).length !== 2) throw new Error(`access routes: fixed private route missing or duplicated: ${route}`);
}
const declaredDb1Routes = [...routes.matchAll(/app\.get\("(\/db1\/[^\"]+)/g)].map((match) => match[1]);
if (declaredDb1Routes.length !== 14 || declaredDb1Routes.some((route) => !["/db1/gb-sct/bill-types/d2-v1", "/db1/gb-sct/reference-cohort/d4a-v1", "/db1/gb-sct/institutional-reference/d4c-v1", "/db1/gb-sct/formal-stages/d5-v1", "/db1/gb-sct/bills/d6-v1", "/db1/gb-sct/government-roles/d7-v1", "/db1/gb-sct/committee-roles/d8-v1"].includes(route))) throw new Error("access routes: generic DB1 route is prohibited");
for (const route of ["https://data.parliament.scot/api/billtypes", "https://data.parliament.scot/api/billstagetypes", "https://data.parliament.scot/api/sessions", "https://data.parliament.scot/api/constituencies", "https://data.parliament.scot/api/regions", "https://data.parliament.scot/api/committeetypes", "https://data.parliament.scot/api/committeetypelinks", "https://data.parliament.scot/api/billstages", "https://data.parliament.scot/api/bills", "https://data.parliament.scot/api/governmentroles", "https://data.parliament.scot/api/committeeroles"]) {
  if (!foundation.includes(route)) throw new Error(`foundation.ts: fixed source route missing: ${route}`);
}
if ((foundation.match(/await fetchD4ReferenceCollection\(route, request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D4 must have one fixed route fetch call site");
if ((foundation.match(/await fetchD4CInstitutionalCollection\(route, request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D4C must have one fixed route fetch call site");
if ((foundation.match(/await fetchD5FormalStagesCollection\(request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D5 must have one fixed route fetch call site");
if ((foundation.match(/await fetchD6BillsCollection\(request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D6 must have one fixed route fetch call site");
if ((foundation.match(/await fetchD7GovernmentRoles\(request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D7 must have one fixed route fetch call site");
if ((foundation.match(/await fetchD8CommitteeRoles\(request\)/g) ?? []).length !== 1) throw new Error("foundation.ts: D8 must have one fixed route fetch call site");
process.stdout.write("DB1 capability scan passed: D1 foundation, fixed D2/D4/D4C/D5/D6/D7/D8 capture routes, fixed reader routes; no generic DB1 route.\n");
