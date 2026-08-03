import { Readable } from "node:stream";
import type { RouteDefinition } from "./gb-sct.js";

const upstreamOrigin = "https://data.parliament.scot";

export type SourceTransportFailure = {
  kind: "transport_failure";
  code: "SOURCE_TIMEOUT" | "SOURCE_CONNECTION_FAILURE";
  requestedAt: string;
};

export type SourceResponse = {
  kind: "source_response";
  status: number;
  contentType: string | null;
  body: Readable;
  requestedAt: string;
};

export type SourceOutcome = SourceTransportFailure | SourceResponse;
export type SourceFetcher = (input: URL, init: RequestInit) => Promise<Response>;

function routePath(route: RouteDefinition, parameters: Record<string, string>): string {
  if (route.availability !== "RELAYED_PRIVATE_BETA") {
    throw new Error("Source relay route is not available for private pass-through.");
  }
  let path = route.template;
  for (const rule of route.parameters) {
    const value = parameters[rule.name];
    if (value === undefined) throw new Error("Source relay parameters were not validated.");
    path = path.replace(`:${rule.name}`, encodeURIComponent(value));
    // Existing SP templates use :id for several differently named query parameters.
    if (route.parameters.length === 1) path = path.replace(":id", encodeURIComponent(value));
  }
  if (/:\w+/.test(path)) throw new Error("Source relay template has an unresolved parameter.");
  return path;
}

function timeoutMs(route: RouteDefinition): number {
  return ["WHOLE_HISTORY_LARGE", "ANNUAL_FIREHOSE", "EXTREME_OR_UNRESOLVED"].includes(route.operatingClass) ? 300_000 : 60_000;
}

export function createSourcePassThrough(fetcher: SourceFetcher = fetch, now: () => Date = () => new Date()) {
  return {
    async relay(route: RouteDefinition, parameters: Record<string, string> = {}): Promise<SourceOutcome> {
      const requestedAt = now().toISOString();
      try {
        const response = await fetcher(new URL(routePath(route, parameters), upstreamOrigin), {
          method: "GET",
          headers: { accept: "application/json" },
          redirect: "manual",
          signal: AbortSignal.timeout(timeoutMs(route))
        });
        return {
          kind: "source_response",
          status: response.status,
          contentType: response.headers.get("content-type"),
          body: response.body ? Readable.fromWeb(response.body as never) : Readable.from([]),
          requestedAt
        };
      } catch (error) {
        return {
          kind: "transport_failure",
          code: error instanceof Error && error.name === "TimeoutError" ? "SOURCE_TIMEOUT" : "SOURCE_CONNECTION_FAILURE",
          requestedAt
        };
      }
    }
  };
}
