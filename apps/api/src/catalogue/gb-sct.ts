export type Availability =
  | "UNAVAILABLE_PENDING_QUALIFICATION"
  | "UNAVAILABLE_PENDING_DETAIL_CONTRACT"
  | "UNAVAILABLE_EXTREME_VOLUME";

export type ParameterRule = {
  name: string;
  grammar: "positive_integer" | "source_identifier" | "year" | "fixed_value";
  required: boolean;
  allowedValues?: readonly string[];
};

export type RouteDefinition = {
  id: string;
  group: string;
  template: string;
  priority: "P1" | "P2" | "P3" | "P4";
  operatingClass: "REFERENCE_SMALL" | "STRUCTURED_MEDIUM" | "WHOLE_HISTORY_LARGE" | "ANNUAL_FIREHOSE" | "EXTREME_OR_UNRESOLVED";
  availability: Availability;
  parameters: readonly ParameterRule[];
  qualification: string;
  limitation: string;
};

const id = { name: "id", grammar: "positive_integer", required: true } as const;
const sourceIdentifier = { name: "id", grammar: "source_identifier", required: true } as const;
const year = { name: "year", grammar: "year", required: true } as const;

function entry(
  id: string,
  group: string,
  template: string,
  priority: RouteDefinition["priority"],
  operatingClass: RouteDefinition["operatingClass"],
  availability: Availability,
  parameters: readonly ParameterRule[] = [],
  qualification = "HANDLING_REQUIRED",
  limitation = "Route-level qualification is required before a source request can be made."
): RouteDefinition {
  return { id, group, template, priority, operatingClass, availability, parameters, qualification, limitation };
}

const pending = "UNAVAILABLE_PENDING_QUALIFICATION" as const;
const detail = "UNAVAILABLE_PENDING_DETAIL_CONTRACT" as const;
const extreme = "UNAVAILABLE_EXTREME_VOLUME" as const;

export const gbSctRoutes: readonly RouteDefinition[] = [
  entry("bills.collection", "Bills", "/api/bills", "P1", "STRUCTURED_MEDIUM", pending, [], "HANDLING_DO_NOT_CAPTURE_OR_RELEASE", "Terms, handling, and output fit remain unresolved."),
  entry("bills.detail", "Bills", "/api/bills/:id", "P1", "EXTREME_OR_UNRESOLVED", pending, [id], "HANDLING_DO_NOT_CAPTURE_OR_RELEASE", "Terms, handling, detail-key semantics, and output fit remain unresolved."),
  entry("bill-stages.collection", "Formal stages", "/api/billstages", "P1", "STRUCTURED_MEDIUM", pending),
  entry("bill-stages.detail", "Formal stages", "/api/billstages/:id", "P1", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("bill-stage-types.collection", "Stage types", "/api/billstagetypes", "P1", "REFERENCE_SMALL", pending),
  entry("bill-stage-types.detail", "Stage types", "/api/billstagetypes/:id", "P1", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("bill-types.collection", "Bill types", "/api/billtypes", "P1", "REFERENCE_SMALL", pending),
  entry("bill-types.detail", "Bill types", "/api/billtypes/:id", "P1", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("sessions.collection", "Sessions", "/api/sessions", "P1", "REFERENCE_SMALL", pending),
  entry("sessions.detail", "Sessions", "/api/sessions/:id", "P1", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("members.collection", "Members", "/api/members", "P2", "STRUCTURED_MEDIUM", pending),
  entry("members.detail", "Members", "/api/members/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("member-constituency-status.collection", "Member constituency status", "/api/memberelectionconstituencystatuses", "P2", "STRUCTURED_MEDIUM", pending),
  entry("member-constituency-status.detail", "Member constituency status", "/api/memberelectionconstituencystatuses/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("member-region-status.collection", "Member region status", "/api/memberelectionregionstatuses", "P2", "STRUCTURED_MEDIUM", pending),
  entry("member-region-status.detail", "Member region status", "/api/memberelectionregionstatuses/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("constituencies.collection", "Constituencies", "/api/constituencies", "P2", "REFERENCE_SMALL", pending),
  entry("constituencies.detail", "Constituencies", "/api/constituencies/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("regions.collection", "Regions", "/api/regions", "P2", "REFERENCE_SMALL", pending),
  entry("regions.detail", "Regions", "/api/regions/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("parties.collection", "Parties", "/api/parties", "P2", "REFERENCE_SMALL", pending),
  entry("parties.detail", "Parties", "/api/parties/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("member-parties.collection", "Member parties", "/api/memberparties", "P2", "STRUCTURED_MEDIUM", pending),
  entry("member-parties.detail", "Member parties", "/api/memberparties/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("party-roles.collection", "Party roles", "/api/partyroles", "P2", "REFERENCE_SMALL", pending),
  entry("party-roles.detail", "Party roles", "/api/partyroles/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("member-party-roles.collection", "Member party roles", "/api/memberpartyroles", "P2", "STRUCTURED_MEDIUM", pending),
  entry("member-party-roles.detail", "Member party roles", "/api/memberpartyroles/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("government-roles.collection", "Government roles", "/api/governmentroles", "P2", "REFERENCE_SMALL", pending),
  entry("government-roles.detail", "Government roles", "/api/governmentroles/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("member-government-roles.collection", "Member government roles", "/api/membergovernmentroles", "P2", "STRUCTURED_MEDIUM", pending),
  entry("member-government-roles.detail", "Member government roles", "/api/membergovernmentroles/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("committees.collection", "Committees", "/api/committees", "P2", "REFERENCE_SMALL", pending),
  entry("committees.detail", "Committees", "/api/committees/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("committee-roles.collection", "Committee roles", "/api/committeeroles", "P2", "REFERENCE_SMALL", pending),
  entry("committee-roles.detail", "Committee roles", "/api/committeeroles/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("committee-types.collection", "Committee types", "/api/committeetypes", "P2", "REFERENCE_SMALL", pending),
  entry("committee-types.detail", "Committee types", "/api/committeetypes/:id", "P2", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("committee-type-links.collection", "Committee type links", "/api/committeetypelinks", "P2", "STRUCTURED_MEDIUM", pending),
  entry("mqa-events.collection", "MQA events", "/api/motionsquestionsanswersevents", "P3", "EXTREME_OR_UNRESOLVED", extreme, [], "COLLECTION_LATENCY_PROFILE_PASS_DEC0055", "Observed as a high-latency whole collection; no lower-cost relay contract is approved."),
  entry("mqa-events.detail", "MQA events", "/api/motionsquestionsanswersevents/:id", "P3", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "OBSERVATION_REQUIRED", "The detail identifier contract is not established."),
  entry("mqa-event-types.collection", "MQA event types", "/api/motionsquestionsanswerseventtypes", "P3", "REFERENCE_SMALL", pending),
  entry("mqa-event-types.detail", "MQA event types", "/api/motionsquestionsanswerseventtypes/:id", "P3", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("mqa-event-subtypes.collection", "MQA event subtypes", "/api/motionsquestionsanswerseventsubtypes", "P3", "REFERENCE_SMALL", pending),
  entry("mqa-event-subtypes.detail", "MQA event subtypes", "/api/motionsquestionsanswerseventsubtypes/:id", "P3", "EXTREME_OR_UNRESOLVED", pending, [id]),
  entry("mqa-event-links.collection", "MQA event links", "/api/motionsquestionsanswerseventlinks", "P3", "STRUCTURED_MEDIUM", pending),
  entry("mqa-event-links.child", "MQA event links", "/api/motionsquestionsanswerseventlinks?childUniqueId=:id", "P3", "STRUCTURED_MEDIUM", pending, [{ name: "childUniqueId", grammar: "source_identifier", required: true }]),
  entry("mqa-event-links.main", "MQA event links", "/api/motionsquestionsanswerseventlinks?mainUniqueId=:id", "P3", "STRUCTURED_MEDIUM", pending, [{ name: "mainUniqueId", grammar: "source_identifier", required: true }]),
  entry("mqa-event-links.parent", "MQA event links", "/api/motionsquestionsanswerseventlinks?parentUniqueId=:id", "P3", "STRUCTURED_MEDIUM", pending, [{ name: "parentUniqueId", grammar: "source_identifier", required: true }]),
  entry("mqa-motions.collection", "MQA motions", "/api/motionsquestionsanswersmotions", "P3", "WHOLE_HISTORY_LARGE", extreme, [], "FULL_RESPONSE_AUDIT_PASS_DEC0055", "Observed as a large whole-history collection; no relay contract is approved."),
  entry("mqa-motions.detail", "MQA motions", "/api/motionsquestionsanswersmotions/:id", "P3", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "OBSERVATION_REQUIRED", "The detail identifier contract is not established."),
  entry("mqa-business-motions.consideration", "MQA business motions", "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration", "P3", "STRUCTURED_MEDIUM", pending, [{ name: "motionfilter", grammar: "fixed_value", required: true, allowedValues: ["consideration"] }]),
  entry("mqa-business-motions.programme", "MQA business motions", "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme", "P3", "STRUCTURED_MEDIUM", pending, [{ name: "motionfilter", grammar: "fixed_value", required: true, allowedValues: ["programme"] }]),
  entry("mqa-questions.collection", "MQA questions", "/api/motionsquestionsanswersquestions", "P3", "EXTREME_OR_UNRESOLVED", extreme, [], "COLLECTION_LATENCY_PROFILE_PASS_DEC0055", "Observed as a high-latency whole collection; no relay contract is approved."),
  entry("mqa-questions.detail", "MQA questions", "/api/motionsquestionsanswersquestions/:id", "P3", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "OBSERVATION_REQUIRED", "The detail identifier contract is not established."),
  entry("mqa-questions.year", "MQA questions", "/api/motionsquestionsanswersquestions?year=:year", "P3", "STRUCTURED_MEDIUM", pending, [year], "YEAR_FORM_FULL_RESPONSE_AUDIT_PASS_DEC0055", "A documented annual form was observed, but its route-level handling and relay contract remain pending."),
  entry("mqa-supports.collection", "MQA supports", "/api/motionsquestionsanswerssupports", "P3", "EXTREME_OR_UNRESOLVED", extreme, [], "COLLECTION_LATENCY_PROFILE_PASS_DEC0055", "Observed as a high-latency whole collection; no relay contract is approved."),
  entry("mqa-supports.detail", "MQA supports", "/api/motionsquestionsanswerssupports/:id", "P3", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "OBSERVATION_REQUIRED", "The detail identifier contract is not established."),
  entry("committee-reports.detail", "Committee official reports", "/api/Orscommitteemeeting/:id", "P4", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "DETAIL_EMPTY_OBJECT_200_OBSERVED_DEC0055", "An observed candidate detail identifier returned an empty object; the intended detail contract is unresolved."),
  entry("committee-reports.year", "Committee official reports", "/api/orscommitteemeeting?year=:year", "P4", "ANNUAL_FIREHOSE", extreme, [year], "FULL_RESPONSE_AUDIT_PASS_DEC0055", "Annual responses can be very large; no relay contract is approved."),
  entry("plenary-reports.detail", "Plenary official reports", "/api/orsplenarymeeting/:id", "P4", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "DETAIL_EMPTY_OBJECT_200_OBSERVED_DEC0055", "An observed candidate detail identifier returned an empty object; the intended detail contract is unresolved."),
  entry("plenary-reports.year", "Plenary official reports", "/api/orsplenarymeeting?year=:year", "P4", "ANNUAL_FIREHOSE", extreme, [year], "FULL_RESPONSE_AUDIT_PASS_DEC0055", "Annual responses can be very large; no relay contract is approved."),
  entry("motion-votes.detail", "Votes on motions", "/api/votesmotion/:id", "P4", "EXTREME_OR_UNRESOLVED", detail, [sourceIdentifier], "DETAIL_EMPTY_OBJECT_200_OBSERVED_DEC0055", "Observed candidate identifiers returned an error or empty object; the intended detail contract is unresolved."),
  entry("motion-votes.year", "Votes on motions", "/api/votesmotion?year=:year", "P4", "ANNUAL_FIREHOSE", extreme, [year], "FULL_RESPONSE_AUDIT_PASS_DEC0055", "Annual votes are not bill-amendment votes and no relay contract is approved.")
];

if (gbSctRoutes.length !== 64 || new Set(gbSctRoutes.map((route) => route.id)).size !== gbSctRoutes.length) {
  throw new Error("GB-SCT catalogue registry must contain 64 unique route definitions");
}

export function findGbSctRoute(id: string): RouteDefinition | undefined {
  return gbSctRoutes.find((route) => route.id === id);
}

export function validateParameters(route: RouteDefinition, value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Parameters must be an object.";
  const parameters = value as Record<string, unknown>;
  const allowed = new Map(route.parameters.map((rule) => [rule.name, rule]));
  for (const name of Object.keys(parameters)) if (!allowed.has(name)) return `Parameter ${name} is not allowed for this route.`;
  for (const rule of route.parameters) {
    const parameter = parameters[rule.name];
    if (parameter === undefined && rule.required) return `Parameter ${rule.name} is required for this route.`;
    if (parameter === undefined) continue;
    if (typeof parameter !== "string") return `Parameter ${rule.name} must be a string.`;
    if (rule.grammar === "positive_integer" && !/^[1-9][0-9]{0,9}$/.test(parameter)) return `Parameter ${rule.name} must be a positive integer.`;
    if (rule.grammar === "source_identifier" && !/^[A-Za-z0-9._-]{1,128}$/.test(parameter)) return `Parameter ${rule.name} has an invalid source-identifier shape.`;
    if (rule.grammar === "year" && !/^(199[9]|20[0-9]{2})$/.test(parameter)) return `Parameter ${rule.name} must be a year from 1999 to 2099.`;
    if (rule.grammar === "fixed_value" && !rule.allowedValues?.includes(parameter)) return `Parameter ${rule.name} is not an allowed value.`;
  }
  return undefined;
}
