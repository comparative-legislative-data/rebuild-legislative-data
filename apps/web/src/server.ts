import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const WEB_HOST = "127.0.0.1";
export const WEB_PORT = 3220;

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const clientDirectory = resolve(currentDirectory, "../client");

function requireConfiguredValue(name: string, expected: string): string {
  const configured = process.env[name] ?? expected;
  if (configured !== expected) {
    throw new Error(`${name} must be ${expected}`);
  }
  return configured;
}

export function createWebServer() {
  const app = Fastify({ logger: false });

  void app.register(fastifyStatic, {
    root: clientDirectory,
    wildcard: false,
    index: false
  });

  app.get("/healthz", async (_request, reply) =>
    reply.type("text/plain; charset=utf-8").code(200).send("process_ready")
  );

  app.get("/", async (_request, reply) => reply.sendFile("index.html"));

  return app;
}

export async function startWebServer() {
  const host = requireConfiguredValue("HOST", WEB_HOST);
  const port = Number(requireConfiguredValue("PORT", String(WEB_PORT)));
  const app = createWebServer();
  await app.listen({ host, port });
  return app;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  void startWebServer();
}
