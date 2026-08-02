import assert from "node:assert/strict";
import test from "node:test";
import {
  createOpaqueToken,
  createLogoutProof,
  digestOpaqueValue,
  hashPassword,
  verifyLogoutProof,
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

test("logout proof is bound to one session and its pepper", () => {
  const proof = createLogoutProof("9dff983b-445a-4925-a68f-c087267460d2", "test-pepper");
  assert.equal(verifyLogoutProof(proof, "test-pepper"), "9dff983b-445a-4925-a68f-c087267460d2");
  assert.equal(verifyLogoutProof(proof, "other-pepper"), undefined);
  assert.equal(verifyLogoutProof("not-a-proof", "test-pepper"), undefined);
});

test("passwords use Argon2id and reject short values", async () => {
  await assert.rejects(hashPassword("too-short"), /at least 12/);
  const hash = await hashPassword("a-local-test-password");
  assert.match(hash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(hash, "a-local-test-password"), true);
  assert.equal(await verifyPassword(hash, "different-password"), false);
});
