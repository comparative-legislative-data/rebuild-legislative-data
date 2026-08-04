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

test("DB1 navigation derives its retained groups from the proxy subject taxonomy", () => {
  const source = readFileSync("apps/web/src/main.tsx", "utf8");
  assert.match(source, /function Db1SubjectGroup/);
  assert.match(source, /section=\{catalogueSections\[0\]\}/);
  assert.match(source, /section=\{catalogueSections\[1\]\}/);
  assert.match(source, /section=\{catalogueSections\[2\]\}/);
  assert.match(source, /section=\{catalogueSections\[3\]\}/);
  assert.match(source, /gb-sct\.sessions\.collection/);
  assert.match(source, /gb-sct\.constituencies\.collection/);
  assert.match(source, /gb-sct\.committee-types\.collection/);
  assert.match(source, /memberContextDb1Routes\.slice\(3\)/);
  assert.match(source, /parties\/d10-v1/);
  assert.doesNotMatch(source.slice(source.indexOf("function Db1SubjectGroup"), source.indexOf("if (activationToken)")), /Members and representation|Institutional reference|Parliamentary sessions/);
  assert.match(source, /Db1PagedPanel/);
  assert.match(source, /fixed retained DB1 releases with route-specific access modes/);
});
