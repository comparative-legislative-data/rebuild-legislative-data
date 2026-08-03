import { Readable } from "node:stream";
import type { RouteDefinition } from "./gb-sct.js";

const upstreamOrigin = "https://data.parliament.scot";
const routePaths = new Map<string, string>([
  ["bill-stage-types.collection", "/api/billstagetypes"],
  ["bill-types.collection", "/api/billtypes"],
  ["sessions.collection", "/api/sessions"],
  ["constituencies.collection", "/api/constituencies"],
  ["regions.collection", "/api/regions"],
  ["committee-types.collection", "/api/committeetypes"],
  ["committee-type-links.collection", "/api/committeetypelinks"],
  ["mqa-event-types.collection", "/api/motionsquestionsanswerseventtypes"],
  ["mqa-event-links.collection", "/api/motionsquestionsanswerseventlinks"]
]);

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

function routePath(route: RouteDefinition): string {
  const path = routePaths.get(route.id);
  if (!path || route.availability !== "RELAYED_PRIVATE_BETA" || route.template !== path || route.parameters.length !== 0) {
    throw new Error("Source relay route must be one of the approved fixed collection paths.");
  }
  return path;
}

export function createSourcePassThrough(fetcher: SourceFetcher = fetch, now: () => Date = () => new Date()) {
  return {
    async relay(route: RouteDefinition): Promise<SourceOutcome> {
      const requestedAt = now().toISOString();
      try {
        const response = await fetcher(new URL(routePath(route), upstreamOrigin), {
          method: "GET",
          headers: { accept: "application/json" },
          redirect: "manual",
          signal: AbortSignal.timeout(20_000)
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
