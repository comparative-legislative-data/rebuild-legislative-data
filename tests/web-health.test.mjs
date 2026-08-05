import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createWebServer, startWebServer } from "../apps/web/dist/server/server.js";

test("web health response and page disclose the shell boundary", async () => {
  const app = createWebServer();
  const health = await app.inject({ method: "GET", url: "/healthz" });
  assert.equal(health.statusCode, 200);
  assert.match(health.headers["content-type"], /^text\/plain/);
  assert.equal(health.body, "process_ready");

  const page = await app.inject({ method: "GET", url: "/" });
  assert.equal(page.statusCode, 200);
  assert.equal(page.headers["cache-control"], "no-store");
  assert.match(page.body, /Private beta access is being configured/);
  assert.match(page.body, /No account, source proxy, dataset, or data release is available/);
  await app.close();
});

test("web rejects non-loopback configuration", async () => {
  const previousPort = process.env.PORT;
  process.env.PORT = "443";
  await assert.rejects(startWebServer(), /PORT must be 3220/);
  if (previousPort === undefined) delete process.env.PORT;
  else process.env.PORT = previousPort;
});

test("Database mirror navigation uses the retained research catalogue's source taxonomy", () => {
  const source = readFileSync("apps/web/src/main.tsx", "utf8");
  assert.match(source, /catalogue\?\.subjects\.flatMap/);
  assert.match(source, /catalogue\?\.subjects\.map/);
  assert.match(source, /databaseMirrorSubjectGuides/);
  assert.match(source, /databaseMirrorEndpointGuide/);
  assert.match(source, /How the Database mirror differs from the live API/);
  assert.match(source, /Database mirror directory/);
  assert.doesNotMatch(source, /function Db1SubjectGroup/);
  assert.doesNotMatch(source, /Db1PagedPanel/);
  assert.doesNotMatch(source, /fixed retained DB1 releases with route-specific access modes/);
});
