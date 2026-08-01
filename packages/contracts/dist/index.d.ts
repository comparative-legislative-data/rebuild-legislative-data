export declare const API_SERVICE_NAME: "cld-gb-sct-api";
export declare const PROCESS_READY: "process_ready";
export declare const capabilityLabels: readonly ["NO_SOURCE_DATA", "NO_DATABASE_CONNECTIVITY", "NOT_A_RESEARCH_RELEASE"];
export type CapabilityLabel = (typeof capabilityLabels)[number];
export interface HealthResponse {
    service: typeof API_SERVICE_NAME;
    status: typeof PROCESS_READY;
    build_id: "b1-local-only";
    capabilities: readonly CapabilityLabel[];
}
export declare const healthResponseSchema: {
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["service", "status", "build_id", "capabilities"];
    readonly properties: {
        readonly service: {
            readonly const: "cld-gb-sct-api";
        };
        readonly status: {
            readonly const: "process_ready";
        };
        readonly build_id: {
            readonly const: "b1-local-only";
        };
        readonly capabilities: {
            readonly type: "array";
            readonly items: {
                readonly enum: readonly ["NO_SOURCE_DATA", "NO_DATABASE_CONNECTIVITY", "NOT_A_RESEARCH_RELEASE"];
            };
            readonly minItems: 3;
            readonly maxItems: 3;
        };
    };
};
export declare const healthResponse: HealthResponse;
