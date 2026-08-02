import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { gbSctRoutes, validateParameters } from "../apps/api/dist/catalogue/gb-sct.js";
import { registerAccessRoutes } from "../apps/api/dist/access/routes.js";

test("GB-SCT catalogue represents all selected route forms without a relayed state", () => {
  assert.equal(gbSctRoutes.length, 64);
  assert.equal(new Set(gbSctRoutes.map((route) => route.id)).size, 64);
  assert.equal(gbSctRoutes.some((route) => route.availability === "RELAYED"), false);
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

async function catalogueApp() {
  const app = Fastify();
  await app.register(cookie);
  const runtime = {
    identity: async (token) => token === "accepted" ? { userId: "test-user", email: "beta@example.test", roles: ["BETA_USER"], logoutProof: "proof" } : undefined
  };
  await app.register(registerAccessRoutes, { runtime });
  return app;
}

test("catalogue denies unauthenticated access and refuses an allowed request without a network call", async () => {
  const app = await catalogueApp();
  const denied = await app.inject({ method: "GET", url: "/catalogue/gb-sct" });
  assert.equal(denied.statusCode, 403);

  const catalogue = await app.inject({ method: "GET", url: "/catalogue/gb-sct", headers: { cookie: "cld_access_session=accepted" } });
  assert.equal(catalogue.statusCode, 200);
  assert.equal(catalogue.json().route_count, 64);
  assert.equal(catalogue.json().source_requests_enabled, false);

  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("outbound request attempted"); };
  try {
    const refused = await app.inject({
      method: "POST",
      url: "/catalogue/gb-sct/motion-votes.year/request",
      headers: { cookie: "cld_access_session=accepted" },
      payload: { parameters: { year: "2025" } }
    });
    assert.equal(refused.statusCode, 409);
    assert.deepEqual(refused.json(), {
      code: "UNAVAILABLE_EXTREME_VOLUME",
      route_id: "motion-votes.year",
      message: "No upstream request has been made. This route is not available for pass-through access."
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
  await app.close();
});
