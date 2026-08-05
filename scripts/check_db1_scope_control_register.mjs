import { readFile } from "node:fs/promises";

const registerPath = new URL("../docs/workstreams/db1/assurance/GB_SCT_DB1_SCOPE_AND_UPDATE_CONTROL_REGISTER_2026-08-05.json", import.meta.url);
const cataloguePath = new URL("../apps/api/src/catalogue/gb-sct.ts", import.meta.url);
const register = JSON.parse(await readFile(registerPath, "utf8"));
const catalogue = await readFile(cataloguePath, "utf8");

const catalogueForms = [...catalogue.matchAll(/entry\("([^"]+)"/g)].map((match) => match[1]);
const registeredForms = [...register.current_retained_form_ids, ...register.future_capture_form_ids];
const routeWindowCount = register.route_window_rules
  .filter((rule) => typeof rule.count === "number")
  .reduce((count, rule) => count + rule.count, 0);

if (catalogueForms.length !== 64 || new Set(catalogueForms).size !== 64) throw new Error("catalogue no longer has 64 unique GB-SCT forms");
if (registeredForms.length !== register.selected_source_form_count) throw new Error("scope register count mismatch");
if (new Set(registeredForms).size !== registeredForms.length) throw new Error("scope register duplicates a source form");
if (registeredForms.some((form) => !catalogueForms.includes(form)) || catalogueForms.some((form) => !registeredForms.includes(form))) throw new Error("scope register does not match the controlled GB-SCT catalogue");
if (routeWindowCount !== register.current_route_window_count) throw new Error("route/window control count mismatch");

process.stdout.write(`DB1 scope/control register passes: ${registeredForms.length} forms; ${routeWindowCount} route/windows.\n`);
