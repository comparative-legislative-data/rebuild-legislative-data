import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createSyntheticFixture, D2_BILL_TYPES_URL, D4_REFERENCE_ROUTES, D4C_INSTITUTIONAL_ROUTES, D4B_REFERENCE_CATALOGUE_ID, D4B_REFERENCE_PROJECTIONS, D6_BILLS_COLLECTION_ROUTE, D6_MAX_BYTES, D7_GOVERNMENT_ROLES_ROUTE, D7_MAX_BYTES, D8_COMMITTEE_ROLES_ROUTE, D8_MAX_BYTES, D13_MQA_TAXONOMY_LINK_ROUTES, D13_MAX_BYTES, D16_MQA_PROGRAMME_ROUTE, D16_MAX_BYTES, D19_OFFICIAL_REPORTS_ROUTES, D20_OFFICIAL_REPORTS_ROUTES, DB1_SYNTHETIC_ORIGIN, fetchD2BillTypes, fetchD4ReferenceCollection, fetchD4CInstitutionalCollection, fetchD6BillsCollection, fetchD7GovernmentRoles, fetchD8CommitteeRoles, fetchD13MqaTaxonomyLinkCollection, fetchD16MqaProgramme, fetchD19OfficialReportsToRawObject, fetchD20OfficialReportsToRawObject, persistSyntheticRawObject, runD19SyntheticStreamingProof, signaturesEqual } from "../apps/api/dist/db1/foundation.js";
import { FULL_DB1_SOURCE_FORM_COUNT, FULL_SCOPE_FORMS } from "../apps/api/dist/db1/full-scope.js";

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

test("D4 transport accepts only the three fixed no-query reference routes", async () => {
  const calls = [];
  for (const route of D4_REFERENCE_ROUTES) {
    await fetchD4ReferenceCollection(route, async (url, init) => {
      calls.push({ url, init });
      return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
    });
  }
  assert.deepEqual(calls.map(({ url }) => url), D4_REFERENCE_ROUTES.map(({ url }) => url));
  assert.ok(calls.every(({ init }) => init.method === "GET" && init.redirect === "manual"));
  await assert.rejects(fetchD4ReferenceCollection({ id: "other", path: "/api/other", url: "https://example.invalid/other" }, async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })), /fixed reference cohort/);
});

test("D4C transport accepts only the four fixed no-query institutional-reference routes", async () => {
  const calls = [];
  for (const route of D4C_INSTITUTIONAL_ROUTES) {
    await fetchD4CInstitutionalCollection(route, async (url, init) => {
      calls.push({ url, init });
      return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
    });
  }
  assert.deepEqual(calls.map(({ url }) => url), D4C_INSTITUTIONAL_ROUTES.map(({ url }) => url));
  assert.ok(calls.every(({ init }) => init.method === "GET" && init.redirect === "manual"));
  await assert.rejects(fetchD4CInstitutionalCollection({ id: "other", path: "/api/other", url: "https://example.invalid/other" }, async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })), /fixed institutional cohort/);
});

test("D6 transport is fixed to the Bills collection and enforces its 2 MiB boundary", async () => {
  const calls = [];
  await fetchD6BillsCollection(async (url, init) => {
    calls.push({ url, init });
    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  });
  assert.deepEqual(calls.map(({ url }) => url), [D6_BILLS_COLLECTION_ROUTE.url]);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.redirect, "manual");
  await assert.rejects(fetchD6BillsCollection(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-length": String(D6_MAX_BYTES + 1) } })), /BODY_TOO_LARGE/);
});

test("D7 transport is fixed to Government roles and enforces its 2 MiB boundary", async () => {
  const calls = [];
  await fetchD7GovernmentRoles(async (url, init) => {
    calls.push({ url, init });
    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  });
  assert.deepEqual(calls.map(({ url }) => url), [D7_GOVERNMENT_ROLES_ROUTE.url]);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.redirect, "manual");
  await assert.rejects(fetchD7GovernmentRoles(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-length": String(D7_MAX_BYTES + 1) } })), /BODY_TOO_LARGE/);
});

test("D8 transport is fixed to Committee roles and enforces its 2 MiB boundary", async () => {
  const calls = [];
  await fetchD8CommitteeRoles(async (url, init) => {
    calls.push({ url, init });
    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  });
  assert.deepEqual(calls.map(({ url }) => url), [D8_COMMITTEE_ROLES_ROUTE.url]);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.redirect, "manual");
  await assert.rejects(fetchD8CommitteeRoles(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-length": String(D8_MAX_BYTES + 1) } })), /BODY_TOO_LARGE/);
});

test("D13 transport is fixed to the approved MQA taxonomy/link batch and enforces its 2 MiB boundary", async () => {
  const calls = [];
  for (const route of D13_MQA_TAXONOMY_LINK_ROUTES) {
    await fetchD13MqaTaxonomyLinkCollection(route, async (url, init) => {
      calls.push({ url, init });
      return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
    });
  }
  assert.deepEqual(calls.map(({ url }) => url), D13_MQA_TAXONOMY_LINK_ROUTES.map(({ url }) => url));
  assert.ok(calls.every(({ init }) => init.method === "GET" && init.redirect === "manual"));
  await assert.rejects(fetchD13MqaTaxonomyLinkCollection(D13_MQA_TAXONOMY_LINK_ROUTES[0], async () => new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-length": String(D13_MAX_BYTES + 1) } })), /BODY_TOO_LARGE/);
});

test("D16 transport is fixed to programme business motions and enforces its route-specific 4 MiB boundary", async () => {
  const calls = [];
  await fetchD16MqaProgramme(async (url, init) => {
    calls.push({ url, init });
    return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
  });
  assert.deepEqual(calls.map(({ url }) => url), [D16_MQA_PROGRAMME_ROUTE.url]);
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.redirect, "manual");
  await assert.rejects(fetchD16MqaProgramme(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json", "content-length": String(D16_MAX_BYTES + 1) } })), /BODY_TOO_LARGE/);
});

test("D4 structural comparison ignores JSON-object key order", () => {
  assert.equal(signaturesEqual({ Name: ["string"], ID: ["number"] }, { ID: ["number"], Name: ["string"] }), true);
  assert.equal(signaturesEqual({ ID: ["number"] }, { ID: ["string"] }), false);
});

test("D19 proves observed-scale stream handling and cleanup without a source request", async () => {
  const root = await mkdtemp(join(tmpdir(), "cld-d19-streaming-proof-"));
  try {
    const results = await runD19SyntheticStreamingProof(root);
    assert.deepEqual(results.map(({ routeId, streamedBytes, observedBytes, maxBytes, temporaryFilesRemoved }) => ({ routeId, streamedBytes, observedBytes, maxBytes, temporaryFilesRemoved })), D19_OFFICIAL_REPORTS_ROUTES.map((route) => ({ routeId: route.id, streamedBytes: route.observedBytes, observedBytes: route.observedBytes, maxBytes: route.maxBytes, temporaryFilesRemoved: true })));
    await assert.rejects(readdir(join(root, ".d19-streaming-proof")), { code: "ENOENT" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("D19 collector accepts only a fixed route and streams synthetic bytes into an immutable raw object", async () => {
  const root = await mkdtemp(join(tmpdir(), "cld-d19-collector-"));
  try {
    const bytes = Buffer.from('[{"ID":"synthetic-d19"}]');
    const calls = [];
    const result = await fetchD19OfficialReportsToRawObject(D19_OFFICIAL_REPORTS_ROUTES[0], root, async (url, init) => {
      calls.push({ url, init });
      return new Response(bytes, { status: 200, headers: { "content-type": "application/json", "content-length": String(bytes.byteLength) } });
    });
    assert.deepEqual(calls.map(({ url }) => url), [D19_OFFICIAL_REPORTS_ROUTES[0].url]);
    assert.equal(result.raw.byteLength, bytes.byteLength);
    assert.deepEqual(await readFile(join(root, result.raw.relativePath)), bytes);
    await assert.rejects(fetchD19OfficialReportsToRawObject({ ...D19_OFFICIAL_REPORTS_ROUTES[0], id: "other" }, root, async () => new Response("[]", { status: 200 })), /fixed cohort/);
    await assert.rejects(fetchD19OfficialReportsToRawObject(D19_OFFICIAL_REPORTS_ROUTES[0], root, async () => new Response("[]", { status: 200, headers: { "content-length": String(D19_OFFICIAL_REPORTS_ROUTES[0].maxBytes + 1) } })), /BODY_TOO_LARGE/);
    assert.deepEqual(await readdir(join(root, ".staging")), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("full-scope runner registers the approved 64 forms and isolates the 35 new forms", () => {
  assert.equal(FULL_DB1_SOURCE_FORM_COUNT, 64);
  assert.equal(FULL_SCOPE_FORMS.length, 35);
  assert.deepEqual(new Set(FULL_SCOPE_FORMS.map((form) => form.id)).size, 35);
});

test("full-scope dependent handling preserves an unavailable parent as a source condition", async () => {
  const source = await readFile(new URL("../apps/api/src/db1/full-scope.ts", import.meta.url), "utf8");
  const dependentRunner = source.slice(source.indexOf("export async function runFullScopeMqaDependents"), source.indexOf("async function annualParents"));
  assert.match(source, /PARENT_COLLECTION_UNAVAILABLE_V1/);
  assert.match(source, /PARENT_COLLECTION_UNAVAILABLE/);
  assert.match(dependentRunner, /PARENT_PROJECTION_MISSING:[\s\S]*?createUnavailableParentUniverse[\s\S]*?continue;[\s\S]*?const universe = await createUniverse/);
});

test("D20 has exactly the approved 54 fixed annual URLs and rejects outside-year input without source traffic", async () => {
  const root = await mkdtemp(join(tmpdir(), "cld-d20-collector-"));
  try {
    assert.equal(D20_OFFICIAL_REPORTS_ROUTES.length, 54);
    assert.equal(D20_OFFICIAL_REPORTS_ROUTES.some((route) => route.path.includes("year=2025")), false);
    assert.equal(D20_OFFICIAL_REPORTS_ROUTES[0].path, "/api/orscommitteemeeting?year=1999");
    assert.equal(D20_OFFICIAL_REPORTS_ROUTES.at(-1)?.path, "/api/orsplenarymeeting?year=2026");
    let calls = 0;
    await assert.rejects(fetchD20OfficialReportsToRawObject({ ...D20_OFFICIAL_REPORTS_ROUTES[0], id: "gb-sct.committee-official-reports-2099.collection", path: "/api/orscommitteemeeting?year=2099", url: "https://data.parliament.scot/api/orscommitteemeeting?year=2099" }, root, async () => { calls += 1; return new Response("[]", { status: 200 }); }), /closed DEC-0099 registry/);
    assert.equal(calls, 0);
    await fetchD20OfficialReportsToRawObject(D20_OFFICIAL_REPORTS_ROUTES[0], root, async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } }));
    await assert.rejects(fetchD20OfficialReportsToRawObject(D20_OFFICIAL_REPORTS_ROUTES[0], root, async () => new Response("[]", { status: 200, headers: { "content-length": String(D20_OFFICIAL_REPORTS_ROUTES[0].maxBytes + 1) } })), /BODY_TOO_LARGE/);
    assert.deepEqual(await readdir(join(root, ".staging")), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("D20 source-preserving releases are not permitted to treat a rejected projection as publishable", async () => {
  const foundationSource = await readFile(new URL("../apps/api/src/db1/foundation.ts", import.meta.url), "utf8");
  assert.match(foundationSource, /if \(projection\.rejectedRecords > 0\) continue;[\s\S]*?insert into db1\.official_reports_releases/);
});

test("D4B catalogue is bound to exactly three named D4A manifests", () => {
  assert.equal(D4B_REFERENCE_CATALOGUE_ID, "gb_sct_reference_cohort_d4a_v1");
  assert.deepEqual(D4B_REFERENCE_PROJECTIONS.map((item) => item.manifestId), [
    "6a414dbf-973a-4aa5-9aae-b217fc18c1e3",
    "2315af79-5903-4540-904c-0eb3f95e99c4",
    "e94719fb-f686-48ce-b652-d22f3b532ac3"
  ]);
  assert.deepEqual(D4B_REFERENCE_PROJECTIONS.map((item) => item.projectionName), [
    "gb_sct_bill_types_d4a_v1",
    "gb_sct_bill_stage_types_d4a_v1",
    "gb_sct_sessions_d4a_v1"
  ]);
});
