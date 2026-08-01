import assert from "node:assert/strict";
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
  assert.match(page.body, /Internal deployment check/);
  assert.match(page.body, /No data release is available/);
  await app.close();
});

test("web rejects non-loopback configuration", async () => {
  const previousPort = process.env.PORT;
  process.env.PORT = "443";
  await assert.rejects(startWebServer(), /PORT must be 3220/);
  if (previousPort === undefined) delete process.env.PORT;
  else process.env.PORT = previousPort;
});
