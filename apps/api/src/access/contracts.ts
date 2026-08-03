export const ACCESS_NOT_CONFIGURED = "ACCESS_CONTROL_NOT_CONFIGURED" as const;
export const ACCESS_READY = "ACCESS_CONTROL_READY" as const;

export const accessStatusSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "authentication_available", "data_layers_available"],
  properties: {
    status: { enum: [ACCESS_NOT_CONFIGURED, ACCESS_READY] },
    authentication_available: { type: "boolean" },
    data_layers_available: { type: "boolean" }
  }
} as const;

export const genericAcceptedSchema = {
  type: "object",
  additionalProperties: false,
  required: ["accepted"],
  properties: { accepted: { const: true } }
} as const;

export const activationRejectedSchema = {
  type: "object",
  additionalProperties: false,
  required: ["accepted", "message"],
  properties: {
    accepted: { const: false },
    message: { const: "This activation link is invalid, expired, or has already been used." }
  }
} as const;

export const logoutResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["accepted", "signed_out"],
  properties: {
    accepted: { const: true },
    signed_out: { type: "boolean" }
  }
} as const;

export const approvalResultSchema = {
  type: "object",
  additionalProperties: false,
  required: ["approved"],
  properties: { approved: { const: true } }
} as const;

export const approvalRejectedSchema = {
  type: "object",
  additionalProperties: false,
  required: ["approved", "message"],
  properties: {
    approved: { const: false },
    message: { const: "Approval could not be completed. The applicant remains pending." }
  }
} as const;

export const accessUnavailableSchema = {
  type: "object",
  additionalProperties: false,
  required: ["status"],
  properties: { status: { const: ACCESS_NOT_CONFIGURED } }
} as const;
