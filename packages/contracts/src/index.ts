export const API_SERVICE_NAME = "cld-gb-sct-api" as const;
export const PROCESS_READY = "process_ready" as const;

export const capabilityLabels = [
  "NO_SOURCE_DATA",
  "NO_DATABASE_CONNECTIVITY",
  "NOT_A_RESEARCH_RELEASE"
] as const;

export type CapabilityLabel = (typeof capabilityLabels)[number];

export interface HealthResponse {
  service: typeof API_SERVICE_NAME;
  status: typeof PROCESS_READY;
  build_id: "b1-local-only";
  capabilities: readonly CapabilityLabel[];
}

export const healthResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["service", "status", "build_id", "capabilities"],
  properties: {
    service: { const: API_SERVICE_NAME },
    status: { const: PROCESS_READY },
    build_id: { const: "b1-local-only" },
    capabilities: {
      type: "array",
      items: { enum: capabilityLabels },
      minItems: capabilityLabels.length,
      maxItems: capabilityLabels.length
    }
  }
} as const;

export const healthResponse: HealthResponse = {
  service: API_SERVICE_NAME,
  status: PROCESS_READY,
  build_id: "b1-local-only",
  capabilities: capabilityLabels
};
