import assert from "node:assert/strict";
import test from "node:test";
import {
  createOpaqueToken,
  digestOpaqueValue,
  hashPassword,
  verifyPassword
} from "../apps/api/dist/access/crypto.js";

test("opaque tokens are random and only their peppered digest is stable", () => {
  const first = createOpaqueToken();
  const second = createOpaqueToken();
  assert.notEqual(first, second);
  assert.match(first, /^[A-Za-z0-9_-]+$/);
  assert.equal(digestOpaqueValue(first, "test-pepper"), digestOpaqueValue(first, "test-pepper"));
  assert.notEqual(digestOpaqueValue(first, "test-pepper"), digestOpaqueValue(first, "other-pepper"));
});

test("passwords use Argon2id and reject short values", async () => {
  await assert.rejects(hashPassword("too-short"), /at least 12/);
  const hash = await hashPassword("a-local-test-password");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, "a-local-test-password"), true);
  assert.equal(await verifyPassword(hash, "different-password"), false);
});
