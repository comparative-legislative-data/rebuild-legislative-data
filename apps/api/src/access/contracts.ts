export const ACCESS_NOT_CONFIGURED = "ACCESS_CONTROL_NOT_CONFIGURED" as const;

export interface AccessStatus {
  status: typeof ACCESS_NOT_CONFIGURED;
  authentication_available: false;
  data_layers_available: false;
}

export const accessStatus: AccessStatus = {
  status: ACCESS_NOT_CONFIGURED,
  authentication_available: false,
  data_layers_available: false
};

export const accessStatusSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "authentication_available", "data_layers_available"],
  properties: {
    status: { const: ACCESS_NOT_CONFIGURED },
    authentication_available: { const: false },
    data_layers_available: { const: false }
  }
} as const;

export const accessUnavailableSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status"],
  properties: { status: { const: ACCESS_NOT_CONFIGURED } }
} as const;
