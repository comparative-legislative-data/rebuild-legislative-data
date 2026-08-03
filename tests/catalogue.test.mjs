import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { gbSctRoutes, validateParameters } from "../apps/api/dist/catalogue/gb-sct.js";
import { registerAccessRoutes } from "../apps/api/dist/access/routes.js";
import { createSourcePassThrough } from "../apps/api/dist/catalogue/source-pass-through.js";

const relayedRoutes = [
  ["bill-stage-types.collection", "/api/billstagetypes"],
  ["bill-types.collection", "/api/billtypes"],
  ["sessions.collection", "/api/sessions"],
  ["constituencies.collection", "/api/constituencies"],
  ["regions.collection", "/api/regions"],
  ["committee-types.collection", "/api/committeetypes"]
];
const relayedIds = relayedRoutes.map(([id]) => id);

test("GB-SCT catalogue represents all selected route forms with exactly the approved private relay cohort", () => {
  assert.equal(gbSctRoutes.length, 64);
  assert.equal(new Set(gbSctRoutes.map((route) => route.id)).size, 64);
  assert.deepEqual(gbSctRoutes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").map((route) => route.id).sort(), relayedIds.sort());
  assert.equal(gbSctRoutes.some((route) => route.template.includes(":id") && route.parameters.length === 0), false);
});

test("runtime catalogue templates match the approved DEC-0045 route matrix", () => {
  const matrix = readFileSync(new URL("../docs/data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md", import.meta.url), "utf8");
  const matrixTemplates = [...matrix.matchAll(/^\| [^|]+ \| `([^`]+)` \|/gm)].map((match) => match[1]).sort();
  const runtimeTemplates = gbSctRoutes.map((route) => route.template).sort();
  assert.equal(matrixTemplates.length, 64);
  assert.deepEqual(runtimeTemplates, matrixTemplates);
});

test("catalogue parameter rules reject unlisted and malformed input", () => {
  const bill = gbSctRoutes.find((route) => route.id === "bills.detail");
  const annualVotes = gbSctRoutes.find((route) => route.id === "motion-votes.year");
  assert.ok(bill);
  assert.ok(annualVotes);
  assert.match(validateParameters(bill, { id: "not-an-integer" }) ?? "", /positive integer/);
  assert.match(validateParameters(bill, { unexpected: "1" }) ?? "", /not allowed/);
  assert.match(validateParameters(annualVotes, { year: "1988" }) ?? "", /1999 to 2099/);
  assert.equal(validateParameters(annualVotes, { year: "2025" }), undefined);
});

test("fixed relay transport uses only the six approved paths and preserves synthetic redirect and source-error responses", async () => {
  const calls = [];
  const relay = createSourcePassThrough(async (url, init) => {
    calls.push({ url: url.toString(), init });
    return new Response(Buffer.from("redirect-body"), { status: 302, headers: { "content-type": "application/json", location: "/other" } });
  }, () => new Date("2026-08-03T12:02:00.000Z"));
  for (const [id, path] of relayedRoutes) {
    const route = gbSctRoutes.find((entry) => entry.id === id);
    assert.ok(route);
    const redirect = await relay.relay(route);
    assert.equal(redirect.kind, "source_response");
    if (redirect.kind !== "source_response") throw new Error("expected a source response");
    assert.equal(redirect.status, 302);
    assert.equal(redirect.contentType, "application/json");
    const bytes = [];
    for await (const chunk of redirect.body) bytes.push(chunk);
    assert.equal(Buffer.concat(bytes).toString("utf8"), "redirect-body");
    const call = calls.at(-1);
    assert.equal(call.url, `https://data.parliament.scot${path}`);
    assert.equal(call.init.method, "GET");
    assert.equal(call.init.headers.accept, "application/json");
    assert.equal(call.init.redirect, "manual");
  }

  const sourceError = createSourcePassThrough(async () => new Response(Buffer.from("not-found"), { status: 404, headers: { "content-type": "application/json" } }));
  const route = gbSctRoutes.find((entry) => entry.id === "committee-types.collection");
  assert.ok(route);
  const outcome = await sourceError.relay(route);
  assert.equal(outcome.kind, "source_response");
  if (outcome.kind === "source_response") assert.equal(outcome.status, 404);
});

async function catalogueApp(sourcePassThrough) {
  const app = Fastify();
  await app.register(cookie);
  const runtime = {
    identity: async (token) => token === "accepted" ? { userId: "test-user", email: "beta@example.test", roles: ["BETA_USER"], logoutProof: "proof" } : undefined
  };
  await app.register(registerAccessRoutes, { runtime, sourcePassThrough, proxyVersion: "test-revision" });
  return app;
}

test("catalogue denies unauthenticated access and leaves unavailable routes fail-closed", async () => {
  let calls = 0;
  const app = await catalogueApp({ relay: async () => { calls += 1; throw new Error("relay must not run"); } });
  const denied = await app.inject({ method: "GET", url: "/catalogue/gb-sct" });
  assert.equal(denied.statusCode, 403);

  const catalogue = await app.inject({ method: "GET", url: "/catalogue/gb-sct", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(catalogue.statusCode, 200);
  assert.equal(catalogue.json().route_count, 64);
  assert.equal(catalogue.json().source_requests_enabled, true);
  assert.equal(catalogue.json().enabled_route_count, 6);

  const refused = await app.inject({ method: "GET", url: "/catalogue/gb-sct/motion-votes.year/source", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(refused.statusCode, 409);
  assert.equal(refused.json().code, "UNAVAILABLE_EXTREME_VOLUME");
  assert.equal(calls, 0);
  await app.close();
});

test("approved DEC-0064 source route streams the synthetic source response without rewriting it", async () => {
  const calls = [];
  const app = await catalogueApp({
    relay: async (route) => {
      calls.push(route.id);
      return {
        kind: "source_response",
        status: 207,
        contentType: "application/json; charset=utf-8",
        body: (await import("node:stream")).Readable.from([Buffer.from('{"synthetic":true}\n')]),
        requestedAt: "2026-08-03T12:00:00.000Z"
      };
    }
  });
  const response = await app.inject({ method: "GET", url: "/catalogue/gb-sct/constituencies.collection/source", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(response.statusCode, 207);
  assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(response.headers["x-cld-layer"], "UPSTREAM_PASSTHROUGH");
  assert.equal(response.headers["x-cld-route-id"], "constituencies.collection");
  assert.equal(response.headers["x-cld-source-template"], "/api/constituencies");
  assert.equal(response.headers["x-cld-requested-at"], "2026-08-03T12:00:00.000Z");
  assert.equal(response.headers["x-cld-proxy-version"], "test-revision");
  assert.equal(response.headers["cache-control"], "no-store");
  assert.equal(response.headers["x-accel-buffering"], "no");
  assert.equal(response.headers.vary, "Cookie");
  assert.equal(response.body, '{"synthetic":true}\n');
  assert.deepEqual(calls, ["constituencies.collection"]);
  await app.close();
});

test("source endpoint rejects a query and shows a synthetic transport failure without fallback", async () => {
  let calls = 0;
  const app = await catalogueApp({ relay: async () => ({ kind: "transport_failure", code: "SOURCE_TIMEOUT", requestedAt: "2026-08-03T12:01:00.000Z" }) });
  const query = await app.inject({ method: "GET", url: "/catalogue/gb-sct/sessions.collection/source?unexpected=1", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(query.statusCode, 400);
  assert.equal(query.json().code, "SOURCE_PARAMETERS_NOT_ALLOWED");
  assert.equal(calls, 0);
  const timeout = await app.inject({ method: "GET", url: "/catalogue/gb-sct/sessions.collection/source", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(timeout.statusCode, 504);
  assert.deepEqual(timeout.json(), {
    code: "SOURCE_TRANSPORT_FAILURE",
    failure_class: "SOURCE_TIMEOUT",
    route_id: "sessions.collection",
    requested_at: "2026-08-03T12:01:00.000Z",
    no_fallback: true
  });
  await app.close();
});
