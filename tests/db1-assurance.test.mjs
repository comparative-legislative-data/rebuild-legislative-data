import assert from "node:assert/strict";
import test from "node:test";
import { classifySourceResponse, diffProfiles, sourceAvailabilityMessage } from "../scripts/db1_a6_assurance_lib.mjs";

test("DB1 assurance retains an upstream availability message as a named source condition", () => {
  const raw = Buffer.from("Data is presently unavailable", "utf8");
  assert.equal(sourceAvailabilityMessage(raw), true);
  assert.deepEqual(classifySourceResponse({ status: 200, raw, inserted: false }), {
    resultKind: "UPSTREAM_CONDITION",
    conditionCode: "UPSTREAM_AVAILABILITY_MESSAGE"
  });
});

test("DB1 assurance distinguishes unchanged raw bytes from changed source bytes", () => {
  const raw = Buffer.from("[]", "utf8");
  assert.deepEqual(classifySourceResponse({ status: 200, raw, inserted: false }), { resultKind: "UNCHANGED", conditionCode: null });
  assert.deepEqual(classifySourceResponse({ status: 200, raw, inserted: true }), { resultKind: "CHANGED", conditionCode: null });
  assert.deepEqual(classifySourceResponse({ status: 500, raw, inserted: true }), { resultKind: "UPSTREAM_CONDITION", conditionCode: "HTTP_500" });
});

test("DB1 assurance exposes raw structural drift without assigning data meaning", () => {
  const drift = diffProfiles(
    { shape: "ARRAY_OF_OBJECTS", fields: { Id: ["number"], Name: ["string"] } },
    { shape: "ARRAY_OF_OBJECTS", fields: { Id: ["number", "string"], Label: ["string"] } }
  );
  assert.deepEqual(drift, {
    shape_changed: false,
    previous_shape: "ARRAY_OF_OBJECTS",
    current_shape: "ARRAY_OF_OBJECTS",
    added_fields: ["Label"],
    removed_fields: ["Name"],
    type_changes: [{ field: "Id", previous_types: ["number"], current_types: ["number", "string"] }],
    changed: true
  });
});

test("DB1 assurance test fixtures are explicitly non-source data", () => {
  assert.equal(sourceAvailabilityMessage(Buffer.from('{"synthetic":true}', "utf8")), false);
});
