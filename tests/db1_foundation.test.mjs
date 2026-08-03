import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createSyntheticFixture, D2_BILL_TYPES_URL, DB1_SYNTHETIC_ORIGIN, fetchD2BillTypes, persistSyntheticRawObject } from "../apps/api/dist/db1/foundation.js";

test("D1 raw-object writer is content-addressed, immutable, and synthetic-only", async () => {
  const root = await mkdtemp(join(tmpdir(), "cld-db1-foundation-"));
  try {
    const bytes = createSyntheticFixture();
    assert.match(bytes.toString("utf8"), new RegExp(DB1_SYNTHETIC_ORIGIN));
    const first = await persistSyntheticRawObject(root, bytes);
    const second = await persistSyntheticRawObject(root, bytes);
    assert.deepEqual(second, first);
    assert.match(first.digest, /^[a-f0-9]{64}$/);
    assert.match(first.relativePath, /^sha256\/[a-f0-9]{64}\.json$/);
    assert.deepEqual(await readFile(join(root, first.relativePath)), bytes);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("D2 transport is fixed to one no-redirect JSON request and rejects unsafe responses", async () => {
  const calls = [];
  const accepted = await fetchD2BillTypes(async (url, init) => {
    calls.push({ url, init });
    return new Response('[{"ID":1,"Name":"synthetic transport only"}]', { status: 200, headers: { "content-type": "application/json" } });
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, D2_BILL_TYPES_URL);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.redirect, "manual");
  assert.equal(accepted.status, 200);
  await assert.rejects(fetchD2BillTypes(async () => new Response("redirect", { status: 302, headers: { location: "/other", "content-type": "application/json" } })), /HTTP_STATUS/);
  await assert.rejects(fetchD2BillTypes(async () => new Response("not-json", { status: 200, headers: { "content-type": "text/plain" } })), /CONTENT_TYPE/);
});
