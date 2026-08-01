import assert from "node:assert/strict";
import test from "node:test";
import {
  capabilityLabels,
  healthResponse,
  healthResponseSchema
} from "../packages/contracts/dist/index.js";

test("health contract is explicit and capability-limited", () => {
  assert.equal(healthResponse.service, "cld-gb-sct-api");
  assert.equal(healthResponse.status, "process_ready");
  assert.equal(healthResponse.build_id, "b1-local-only");
  assert.deepEqual(healthResponse.capabilities, capabilityLabels);
  assert.equal(healthResponseSchema.additionalProperties, false);
});
