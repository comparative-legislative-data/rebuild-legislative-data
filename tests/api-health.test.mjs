import assert from "node:assert/strict";
import test from "node:test";
import { createApiServer, startApiServer } from "../apps/api/dist/server.js";

test("API health response is static and truthful", async () => {
  const app = createApiServer();
  const response = await app.inject({ method: "GET", url: "/healthz" });
  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"], /^application\/json/);
  assert.deepEqual(response.json(), {
    service: "cld-gb-sct-api",
    status: "process_ready",
    build_id: "b1-local-only",
    capabilities: [
      "NO_SOURCE_DATA",
      "NO_DATABASE_CONNECTIVITY",
      "NOT_A_RESEARCH_RELEASE"
    ]
  });
  await app.close();
});

test("API rejects non-loopback configuration", async () => {
  const previousHost = process.env.HOST;
  process.env.HOST = "0.0.0.0";
  await assert.rejects(startApiServer(), /HOST must be 127\.0\.0\.1/);
  if (previousHost === undefined) delete process.env.HOST;
  else process.env.HOST = previousHost;
});

test("access routes fail closed before a repository is configured", async () => {
  const app = createApiServer();
  const status = await app.inject({ method: "GET", url: "/auth/status" });
  assert.deepEqual(status.json(), {
    status: "ACCESS_CONTROL_NOT_CONFIGURED",
    authentication_available: false,
    data_layers_available: false
  });
  const login = await app.inject({ method: "POST", url: "/auth/login", payload: {} });
  assert.equal(login.statusCode, 503);
  assert.deepEqual(login.json(), { status: "ACCESS_CONTROL_NOT_CONFIGURED" });
  await app.close();
});
