import crypto from "node:crypto";

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

export function sourceAvailabilityMessage(raw) {
  return /presently\s+unavailable/i.test(raw.toString("utf8", 0, Math.min(raw.length, 65_536)));
}

export function classifySourceResponse({ status, raw, inserted }) {
  if (sourceAvailabilityMessage(raw)) {
    return { resultKind: "UPSTREAM_CONDITION", conditionCode: "UPSTREAM_AVAILABILITY_MESSAGE" };
  }
  if (status < 200 || status >= 300) {
    return { resultKind: "UPSTREAM_CONDITION", conditionCode: `HTTP_${status}` };
  }
  return { resultKind: inserted ? "CHANGED" : "UNCHANGED", conditionCode: null };
}

function fields(profile) {
  return Object.fromEntries(Object.entries(profile?.fields ?? {}).map(([name, types]) => [name, [...new Set(types)].sort()]));
}

export function diffProfiles(previousProfile, currentProfile) {
  const previousFields = fields(previousProfile);
  const currentFields = fields(currentProfile);
  const addedFields = Object.keys(currentFields).filter((name) => !(name in previousFields)).sort();
  const removedFields = Object.keys(previousFields).filter((name) => !(name in currentFields)).sort();
  const typeChanges = Object.keys(currentFields)
    .filter((name) => name in previousFields && JSON.stringify(currentFields[name]) !== JSON.stringify(previousFields[name]))
    .sort()
    .map((field) => ({ field, previous_types: previousFields[field], current_types: currentFields[field] }));
  const shapeChanged = previousProfile?.shape !== currentProfile?.shape;
  return {
    shape_changed: shapeChanged,
    previous_shape: previousProfile?.shape ?? null,
    current_shape: currentProfile?.shape ?? null,
    added_fields: addedFields,
    removed_fields: removedFields,
    type_changes: typeChanges,
    changed: shapeChanged || addedFields.length > 0 || removedFields.length > 0 || typeChanges.length > 0
  };
}
