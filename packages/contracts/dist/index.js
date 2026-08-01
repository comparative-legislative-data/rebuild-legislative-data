export const API_SERVICE_NAME = "cld-gb-sct-api";
export const PROCESS_READY = "process_ready";
export const capabilityLabels = [
    "NO_SOURCE_DATA",
    "NO_DATABASE_CONNECTIVITY",
    "NOT_A_RESEARCH_RELEASE"
];
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
};
export const healthResponse = {
    service: API_SERVICE_NAME,
    status: PROCESS_READY,
    build_id: "b1-local-only",
    capabilities: capabilityLabels
};
