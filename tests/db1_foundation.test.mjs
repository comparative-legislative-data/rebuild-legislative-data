import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createSyntheticFixture, DB1_SYNTHETIC_ORIGIN, persistSyntheticRawObject } from "../apps/api/dist/db1/foundation.js";

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
