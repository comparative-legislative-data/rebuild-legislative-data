import Fastify from "fastify";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import {
  healthResponse,
  healthResponseSchema,
  type HealthResponse
} from "@cld-gb-sct/contracts";
import { registerAccessRoutes } from "./access/routes.js";
import { AccessRuntime, loadAccessRuntimeConfig } from "./access/runtime.js";

export const API_HOST = "127.0.0.1";
export const API_PORT = 3210;

function requireConfiguredValue(name: string, expected: string): string {
  const configured = process.env[name] ?? expected;
  if (configured !== expected) {
    throw new Error(`${name} must be ${expected}`);
  }
  return configured;
}

export function createApiServer() {
  const app = Fastify({ logger: false });
  const config = loadAccessRuntimeConfig();
  const runtime = config ? new AccessRuntime(config) : undefined;

  void app.register(cookie);
  void app.register(rateLimit, { global: false });
  app.addHook("onSend", async (_request, reply, payload) => {
    reply.header("cache-control", "no-store");
    return payload;
  });

  app.get<{ Reply: HealthResponse }>("/healthz", {
    schema: { response: { 200: healthResponseSchema } }
  }, async (_request, reply) => reply.type("application/json").code(200).send(healthResponse));

  void app.register(registerAccessRoutes, runtime ? { runtime } : {});
  app.addHook("onClose", async () => runtime?.close());

  if (runtime) app.addHook("onReady", async () => runtime.bootstrapInitialSuperuser());

  return app;
}

export async function startApiServer() {
  const host = requireConfiguredValue("HOST", API_HOST);
  const port = Number(requireConfiguredValue("PORT", String(API_PORT)));
  const app = createApiServer();
  await app.listen({ host, port });
  return app;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  void startApiServer().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "access runtime startup failed";
    process.stderr.write(`access runtime startup failed: ${message}\n`);
    process.exitCode = 1;
  });
}
