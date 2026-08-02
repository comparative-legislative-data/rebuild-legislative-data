import type { FastifyInstance } from "fastify";
import { ACCESS_NOT_CONFIGURED, accessStatus, accessStatusSchema, accessUnavailableSchema } from "./contracts.js";

const unavailable = { status: ACCESS_NOT_CONFIGURED };

export async function registerAccessRoutes(app: FastifyInstance): Promise<void> {
  app.get("/auth/status", { schema: { response: { 200: accessStatusSchema } } }, async () => accessStatus);

  for (const path of ["/auth/login", "/auth/magic-link", "/auth/applications", "/auth/password"]) {
    app.post(path, {
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
      schema: { response: { 503: accessUnavailableSchema } }
    }, async (_request, reply) => reply.code(503).send(unavailable));
  }
}
