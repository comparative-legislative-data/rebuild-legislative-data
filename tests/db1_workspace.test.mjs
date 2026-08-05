import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const webSource = readFileSync(new URL("../apps/web/src/main.tsx", import.meta.url), "utf8");
const webStyles = readFileSync(new URL("../apps/web/src/styles.css", import.meta.url), "utf8");

test("Database mirror renders the DEC-0106 directory before legacy catalogue fallbacks", () => {
  const workspace = webSource.indexOf("<DatabaseMirrorWorkspace");
  const firstLegacyCatalogue = webSource.indexOf("Find a Scottish Parliament source, then view, download or browse");
  assert.ok(workspace > -1, "DatabaseMirrorWorkspace is rendered for authenticated Database mirror access");
  assert.ok(firstLegacyCatalogue > workspace, "workspace is selected before legacy catalogue fallbacks");
});

test("Database mirror workspace preserves source-first release actions and truthful labels", () => {
  for (const label of ["View original JSON", "Download original JSON", "Open live Scottish Parliament source", "View all-years access index"]) {
    assert.match(webSource, new RegExp(label));
  }
  assert.match(webSource, /This index lists compatible retained releases and any availability exceptions/);
  assert.match(webSource, /It is not one Scottish Parliament response or a combined download/);
  assert.match(webSource, /Upstream availability notice captured/);
});

test("Database mirror action controls state their result and endpoint pages do not repeat the directory explanation", () => {
  const workspace = webSource.slice(webSource.indexOf("function DatabaseMirrorWorkspace"), webSource.indexOf("async function request"));
  assert.match(webSource, /function MirrorActionHelp/);
  for (const label of ["View original JSON", "Download original JSON", "Browse retained records", "Open live Scottish Parliament source", "Details and citation"]) {
    assert.match(workspace, new RegExp(`MirrorActionHelp label="${label}"`));
  }
  assert.equal((workspace.match(/How the Database mirror differs from the live API/g) ?? []).length, 1);
  assert.match(workspace, /Refresh available sources/);
  assert.doesNotMatch(workspace, /Refresh mirror list/);
  assert.match(webStyles, /\.mirror-action-help > summary/);
});

test("Database mirror no longer hides a summary while forcing a closed release body visible", () => {
  assert.doesNotMatch(webStyles, /\.access-data \.research-release > summary \{ display: none;/);
  assert.doesNotMatch(webStyles, /\.access-data \.research-release > \.route-details \{ display: grid;/);
  assert.match(webSource, /aria-expanded=\{expanded\}/);
  assert.match(webSource, /scope="col">Source year\/window/);
});
