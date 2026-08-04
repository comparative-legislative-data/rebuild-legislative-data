import type { FastifyInstance, FastifyRequest } from "fastify";
import { ACCESS_NOT_CONFIGURED, ACCESS_READY, accessStatusSchema, accessUnavailableSchema, activationRejectedSchema, approvalRejectedSchema, approvalResultSchema, genericAcceptedSchema, logoutResultSchema } from "./contracts.js";
import { type AccessRuntime, sessionDays } from "./runtime.js";
import { findGbSctRoute, gbSctRoutes, validateParameters } from "../catalogue/gb-sct.js";
import { createSourcePassThrough } from "../catalogue/source-pass-through.js";
import { Db1Explorer, loadDb1ExplorerConfig } from "../db1/explorer.js";
import { D11_MEMBER_CONTEXT_ROUTES, D13_MQA_TAXONOMY_LINK_ROUTES, D14_MQA_EVENT_SUBTYPES_RELEASE_ID, D15_MQA_CONSIDERATION_RELEASE_ID } from "../db1/foundation.js";

const unavailable = { status: ACCESS_NOT_CONFIGURED };
const accepted = { accepted: true };
const activationRejected = { accepted: false, message: "This activation link is invalid, expired, or has already been used." };
const approvalRejected = { approved: false, message: "Approval could not be completed. The applicant remains pending." };
const cookieName = "cld_access_session";

function body(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function requiredText(value: unknown, maximum = 2_000): string | undefined {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maximum ? value.trim() : undefined;
}

function pageNumber(value: unknown, fallback: number, maximum: number): number | undefined {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= maximum ? parsed : undefined;
}

function setSession(reply: { setCookie: Function }, token: string): void {
  reply.setCookie(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: sessionDays * 24 * 60 * 60
  });
}

function clearSession(reply: { clearCookie: Function }): void {
  reply.clearCookie(cookieName, { path: "/", httpOnly: true, secure: true, sameSite: "lax" });
}

async function session(runtime: AccessRuntime, request: FastifyRequest) {
  return runtime.identity(request.cookies[cookieName]);
}

function hasCatalogueAccess(identity: Awaited<ReturnType<AccessRuntime["identity"]>>): boolean {
  return Boolean(identity?.roles.some((role) => role === "SUPERUSER" || role === "BETA_USER" || role === "GUEST"));
}

function hasDb1Access(identity: Awaited<ReturnType<AccessRuntime["identity"]>>): boolean {
  return Boolean(identity?.roles.some((role) => role === "SUPERUSER" || role === "BETA_USER"));
}

type SourcePassThrough = ReturnType<typeof createSourcePassThrough>;

export async function registerAccessRoutes(app: FastifyInstance, options: { runtime?: AccessRuntime; sourcePassThrough?: SourcePassThrough; proxyVersion?: string }): Promise<void> {
  const runtime = options.runtime;
  const sourcePassThrough = options.sourcePassThrough ?? createSourcePassThrough();
  const db1Config = loadDb1ExplorerConfig();
  const db1Explorer = db1Config ? new Db1Explorer(db1Config) : undefined;
  const proxyVersion = options.proxyVersion ?? "development";
  app.get("/auth/status", { schema: { response: { 200: accessStatusSchema } } }, async () => ({
    status: runtime ? ACCESS_READY : ACCESS_NOT_CONFIGURED,
    authentication_available: Boolean(runtime),
    data_layers_available: Boolean(db1Explorer)
  }));

  if (!runtime) {
    for (const path of ["/auth/login", "/auth/magic-link", "/auth/applications", "/auth/password"]) {
      app.post(path, { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    }
    app.get("/catalogue/gb-sct", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.post("/catalogue/gb-sct/:id/request", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/catalogue/gb-sct/:id/source", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/bill-types/d2-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/reference-cohort/d4a-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/institutional-reference/d4c-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/formal-stages/d5-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/bills/d6-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/government-roles/d7-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/committee-roles/d8-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/party-roles/d9-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/parties/d10-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/members/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/member-constituency-statuses/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/member-region-statuses/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/member-parties/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/member-party-roles/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/member-government-roles/d11-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/committees/d12-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/mqa-event-types/d13-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/mqa-event-links/d13-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/mqa-event-subtypes/d14-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    app.get("/db1/gb-sct/mqa-business-consideration/d15-v1", { schema: { response: { 503: accessUnavailableSchema } } }, async (_request, reply) => reply.code(503).send(unavailable));
    return;
  }

  app.addHook("onClose", async () => db1Explorer?.close());

  app.post("/auth/login", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema } } }, async (request, reply) => {
    const input = body(request.body);
    const identifier = requiredText(input.identifier, 320);
    const password = requiredText(input.password, 512);
    if (identifier && password) {
      const token = await runtime.login(identifier, password);
      if (token) setSession(reply, token);
    }
    return reply.send(accepted);
  });

  app.post("/auth/magic-link", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema } } }, async (request, reply) => {
    const email = requiredText(body(request.body).email, 320);
    if (email) await runtime.requestMagicLink(email);
    return reply.send(accepted);
  });

  app.post("/auth/magic-link/consume", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema } } }, async (request, reply) => {
    const token = requiredText(body(request.body).token, 512);
    if (token) {
      const sessionToken = await runtime.consumeMagicLink(token);
      if (sessionToken) setSession(reply, sessionToken);
    }
    return reply.send(accepted);
  });

  app.post("/auth/applications", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema } } }, async (request, reply) => {
    const input = body(request.body);
    const email = requiredText(input.email, 320);
    const requestText = requiredText(input.requestText);
    if (email && requestText) await runtime.submitApplication(email, requestText);
    return reply.send(accepted);
  });

  app.post("/auth/password", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema, 400: activationRejectedSchema } } }, async (request, reply) => {
    const input = body(request.body);
    const token = requiredText(input.token, 512);
    const password = requiredText(input.password, 512);
    if (!token || !password) return reply.code(400).send(activationRejected);
    const sessionToken = await runtime.setPassword(token, password);
    if (!sessionToken) return reply.code(400).send(activationRejected);
    setSession(reply, sessionToken);
    return reply.send(accepted);
  });

  app.get("/auth/me", async (request) => {
    const identity = await session(runtime, request);
    return { authenticated: Boolean(identity), email: identity?.email ?? null, roles: identity?.roles ?? [], logout_proof: identity?.logoutProof ?? null, data_layers_available: Boolean(db1Explorer) && hasDb1Access(identity) };
  });

  app.post("/auth/password/change", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { response: { 200: genericAcceptedSchema } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    const password = requiredText(body(request.body).password, 512);
    if (identity && password) await runtime.changePassword(identity.userId, password);
    return reply.send(accepted);
  });

  app.post("/auth/logout", { schema: { response: { 200: logoutResultSchema } } }, async (request, reply) => {
    const logoutProof = requiredText(body(request.body).logout_proof, 256);
    const signedOut = await runtime.revokeSession(request.cookies[cookieName], logoutProof);
    clearSession(reply);
    return reply.send({ accepted: true, signed_out: signedOut });
  });

  app.get("/auth/admin/applications", async (request, reply) => {
    const identity = await session(runtime, request);
    if (!identity?.roles.includes("SUPERUSER")) return reply.code(403).send({ accepted: false });
    return { applications: await runtime.applications() };
  });

  app.post("/auth/admin/applications/:id/approve", { schema: { response: { 200: approvalResultSchema, 403: approvalRejectedSchema, 409: approvalRejectedSchema, 502: approvalRejectedSchema } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!identity?.roles.includes("SUPERUSER")) return reply.code(403).send(approvalRejected);
    const id = requiredText((request.params as Record<string, unknown>).id, 64);
    if (!id) return reply.code(409).send(approvalRejected);
    try {
      if (!await runtime.approveApplication(identity.userId, id)) return reply.code(409).send(approvalRejected);
      return reply.send({ approved: true });
    } catch {
      return reply.code(502).send(approvalRejected);
    }
  });

  app.get("/catalogue/gb-sct", async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasCatalogueAccess(identity)) return reply.code(403).send({ code: "CATALOGUE_ACCESS_DENIED" });
    return reply.send({
      legislature: "GB-SCT",
      layer: "UPSTREAM_PASSTHROUGH_DESIGN",
      source_requests_enabled: true,
      enabled_route_count: gbSctRoutes.filter((route) => route.availability === "RELAYED_PRIVATE_BETA").length,
      route_count: gbSctRoutes.length,
      routes: gbSctRoutes
    });
  });

  app.post("/catalogue/gb-sct/:id/request", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasCatalogueAccess(identity)) return reply.code(403).send({ code: "CATALOGUE_ACCESS_DENIED" });
    const id = requiredText((request.params as Record<string, unknown>).id, 128);
    const route = id ? findGbSctRoute(id) : undefined;
    if (!route) return reply.code(404).send({ code: "ROUTE_NOT_FOUND" });
    const issue = validateParameters(route, body(request.body).parameters ?? {});
    if (issue) return reply.code(400).send({ code: "PARAMETER_REJECTED", message: issue });
    return reply.send({
      route_id: route.id,
      message: "The source route is available through the authenticated raw relay. No upstream request has been made by this confirmation."
    });
  });

  app.get("/catalogue/gb-sct/:id/source", { config: { rateLimit: { max: 6, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasCatalogueAccess(identity)) return reply.code(403).send({ code: "CATALOGUE_ACCESS_DENIED" });
    const id = requiredText((request.params as Record<string, unknown>).id, 128);
    const route = id ? findGbSctRoute(id) : undefined;
    if (!route) return reply.code(404).send({ code: "ROUTE_NOT_FOUND" });
    if (route.availability !== "RELAYED_PRIVATE_BETA") return reply.code(409).send({ code: route.availability, route_id: route.id, message: "This route is not available for pass-through access." });
    const parameters = (request.query ?? {}) as Record<string, unknown>;
    const issue = validateParameters(route, parameters);
    if (issue) return reply.code(400).send({ code: "PARAMETER_REJECTED", route_id: route.id, message: issue });

    const outcome = await sourcePassThrough.relay(route, parameters as Record<string, string>);
    if (outcome.kind === "transport_failure") {
      return reply.code(outcome.code === "SOURCE_TIMEOUT" ? 504 : 502).send({
        code: "SOURCE_TRANSPORT_FAILURE",
        failure_class: outcome.code,
        route_id: route.id,
        requested_at: outcome.requestedAt,
        no_fallback: true
      });
    }
    reply.header("x-cld-layer", "UPSTREAM_PASSTHROUGH");
    reply.header("x-cld-route-id", route.id);
    reply.header("x-cld-source-template", route.template);
    reply.header("x-cld-requested-at", outcome.requestedAt);
    reply.header("x-cld-proxy-version", proxyVersion);
    reply.header("cache-control", "no-store");
    reply.header("x-accel-buffering", "no");
    reply.header("vary", "Cookie");
    if (outcome.contentType) reply.type(outcome.contentType);
    if (outcome.contentDisposition) reply.header("content-disposition", outcome.contentDisposition);
    return reply.code(outcome.status).send(outcome.body);
  });

  app.get("/db1/gb-sct/bill-types/d2-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const response = await db1Explorer.billTypesD2();
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION");
    reply.header("x-cld-db1-source-route", response.source.route_id);
    reply.header("x-cld-db1-manifest", response.source.manifest_id);
    reply.header("x-cld-db1-projection-build", response.projection.build_id);
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/reference-cohort/d4a-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const response = await db1Explorer.referenceCohortD4a();
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_CATALOGUE");
    reply.header("x-cld-db1-catalogue", response.catalogue.id);
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/institutional-reference/d4c-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const response = await db1Explorer.institutionalReferenceD4c();
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_CATALOGUE");
    reply.header("x-cld-db1-catalogue", response.catalogue.id);
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/formal-stages/d5-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const response = await db1Explorer.formalStagesD5();
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_ACCESS_PLAN");
    reply.header("x-cld-db1-release", "gb_sct_formal_stages_d5_v1");
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/bills/d6-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>;
    const offset = pageNumber(query.offset, 0, 100_000);
    const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.billsCollectionD6(offset, limit);
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION");
    reply.header("x-cld-db1-release", "gb_sct_bills_collection_d6_v1");
    reply.header("x-cld-db1-offset", String(offset));
    reply.header("x-cld-db1-limit", String(limit));
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/government-roles/d7-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>;
    const offset = pageNumber(query.offset, 0, 100_000);
    const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.governmentRolesD7(offset, limit);
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION");
    reply.header("x-cld-db1-release", "gb_sct_government_roles_d7_v1");
    reply.header("x-cld-db1-offset", String(offset));
    reply.header("x-cld-db1-limit", String(limit));
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/committee-roles/d8-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request);
    if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" });
    if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>;
    const offset = pageNumber(query.offset, 0, 100_000);
    const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.committeeRolesD8(offset, limit);
    if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION");
    reply.header("x-cld-db1-release", "gb_sct_committee_roles_d8_v1");
    reply.header("x-cld-db1-offset", String(offset));
    reply.header("x-cld-db1-limit", String(limit));
    reply.header("vary", "Cookie");
    return reply.send(response);
  });

  app.get("/db1/gb-sct/party-roles/d9-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.partyRolesD9(offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", "gb_sct_party_roles_d9_v1"); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  });
  app.get("/db1/gb-sct/parties/d10-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.partiesD10(offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", "gb_sct_parties_d10_v1"); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  });
  const d11Paged = async (request: FastifyRequest, reply: { code: Function; header: Function; send: Function }, route: (typeof D11_MEMBER_CONTEXT_ROUTES)[number]) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.memberContextD11(route, offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", route.releaseId); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  };
  app.get("/db1/gb-sct/members/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[0]));
  app.get("/db1/gb-sct/member-constituency-statuses/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[1]));
  app.get("/db1/gb-sct/member-region-statuses/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[2]));
  app.get("/db1/gb-sct/member-parties/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[3]));
  app.get("/db1/gb-sct/member-party-roles/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[4]));
  app.get("/db1/gb-sct/member-government-roles/d11-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d11Paged(request, reply, D11_MEMBER_CONTEXT_ROUTES[5]));
  app.get("/db1/gb-sct/committees/d12-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.committeesD12(offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", "gb_sct_committees_d12_v1"); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  });
  const d13Paged = async (request: FastifyRequest, reply: { code: Function; header: Function; send: Function }, route: (typeof D13_MQA_TAXONOMY_LINK_ROUTES)[number]) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.mqaTaxonomyLinkD13(route, offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", route.releaseId); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  };
  app.get("/db1/gb-sct/mqa-event-types/d13-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d13Paged(request, reply, D13_MQA_TAXONOMY_LINK_ROUTES[0]));
  app.get("/db1/gb-sct/mqa-event-links/d13-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => d13Paged(request, reply, D13_MQA_TAXONOMY_LINK_ROUTES[1]));
  app.get("/db1/gb-sct/mqa-event-subtypes/d14-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" });
    const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50);
    if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED", message: "Only non-negative offset and limit 1–50 are supported." });
    const response = await db1Explorer.mqaEventSubtypesD14(offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" });
    reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", D14_MQA_EVENT_SUBTYPES_RELEASE_ID); reply.header("x-cld-db1-offset", String(offset)); reply.header("x-cld-db1-limit", String(limit)); reply.header("vary", "Cookie"); return reply.send(response);
  });
  app.get("/db1/gb-sct/mqa-business-consideration/d15-v1", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const identity = await session(runtime, request); if (!hasDb1Access(identity)) return reply.code(403).send({ code: "DB1_ACCESS_DENIED" }); if (!db1Explorer) return reply.code(503).send({ code: "DB1_NOT_CONFIGURED" }); const query = request.query as Record<string, unknown>; const offset = pageNumber(query.offset, 0, 100_000); const limit = pageNumber(query.limit, 20, 50); if (offset === undefined || limit === undefined || limit === 0) return reply.code(400).send({ code: "DB1_PAGE_REJECTED" }); const response = await db1Explorer.mqaConsiderationD15(offset, limit); if (!response) return reply.code(503).send({ code: "DB1_PROJECTION_UNAVAILABLE" }); reply.header("x-cld-layer", "DB1_OPERATIONAL_PROJECTION_SERVER_SIDE_SELECTION"); reply.header("x-cld-db1-release", D15_MQA_CONSIDERATION_RELEASE_ID); reply.header("vary", "Cookie"); return reply.send(response);
  });
}
