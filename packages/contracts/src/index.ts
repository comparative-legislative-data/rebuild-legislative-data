export const API_SERVICE_NAME = "cld-gb-sct-api" as const;
export const PROCESS_READY = "process_ready" as const;

export const capabilityLabels = [
  "NO_SOURCE_DATA",
  "NO_RESEARCH_DATA_ROUTE",
  "NOT_A_RESEARCH_RELEASE"
] as const;

export type CapabilityLabel = (typeof capabilityLabels)[number];

export interface HealthResponse {
  service: typeof API_SERVICE_NAME;
  status: typeof PROCESS_READY;
  build_id: "private-beta-access";
  capabilities: readonly CapabilityLabel[];
}

export const healthResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["service", "status", "build_id", "capabilities"],
  properties: {
    service: { const: API_SERVICE_NAME },
    status: { const: PROCESS_READY },
    build_id: { const: "private-beta-access" },
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
  build_id: "private-beta-access",
  capabilities: capabilityLabels
};
