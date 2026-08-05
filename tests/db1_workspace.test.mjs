import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const webSource = readFileSync(new URL("../apps/web/src/main.tsx", import.meta.url), "utf8");
const webStyles = readFileSync(new URL("../apps/web/src/styles.css", import.meta.url), "utf8");
const readerPresentationDeploy = readFileSync(new URL("../ops/deploy_private_reader_presentation.sh", import.meta.url), "utf8");

test("Database mirror has one active workspace renderer and no legacy catalogue fallback", () => {
  assert.equal((webSource.match(/if \(view === "db1" && identity\.authenticated && identity\.data_layers_available\)/g) ?? []).length, 1);
  assert.match(webSource, /<DatabaseMirrorWorkspace/);
  assert.doesNotMatch(webSource, /Fixed retained baselines/);
  assert.doesNotMatch(webSource, /Retained DB1 historical annual windows/);
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

test("Database mirror uses the same endpoint label for 1999 and later annual source windows", () => {
  const accessSource = readFileSync(new URL("../apps/api/src/db1/research-access.ts", import.meta.url), "utf8");
  assert.match(accessSource, /replace\(\/-\(\?:19\|20\)\\d\{2\}\$\//);
  assert.match(accessSource, /sourceYearFor[\s\S]*\(\?:19\|20\)/);
});

test("Database mirror directory provides controlled descriptions for every retained endpoint family", () => {
  for (const endpoint of ["bill stages", "committee official reports", "member parties", "mqa questions", "plenary official reports", "votes on motions"]) {
    assert.match(webSource, new RegExp(`"${endpoint}":`));
  }
  assert.match(webSource, />Database mirror<\/button>/);
  assert.match(webSource, />Live API catalogue<\/button>/);
  assert.doesNotMatch(webSource, />Route catalogue<\/button>/);
});

test("private reader-presentation deployment never mutates DB1 or schedules", () => {
  assert.match(readerPresentationDeploy, /cld-gb-sct-api\.service/);
  assert.match(readerPresentationDeploy, /cld-gb-sct-web\.service/);
  assert.match(readerPresentationDeploy, /research\/catalogue/);
  assert.doesNotMatch(readerPresentationDeploy, /\bpsql\b/);
  assert.doesNotMatch(readerPresentationDeploy, /db1-[a-z0-9]+\.timer/);
  assert.doesNotMatch(readerPresentationDeploy, /nginx/);
});
