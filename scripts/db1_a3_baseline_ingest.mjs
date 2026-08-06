import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A3_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");

const base = "https://data.parliament.scot";
const ordinaryTimeoutMs = 90_000;
const reportTimeoutMs = 180_000;
const totalTimeoutMs = 90 * 60_000;
const maxBodyBytes = 256 * 1024 * 1024;
const maxTotalBytes = 8 * 1024 * 1024 * 1024;

const fixed = [
  ["bills.collection", "/api/bills", "Bills"],
  ["bill-stages.collection", "/api/billstages", "Bill stages"],
  ["bill-stage-types.collection", "/api/billstagetypes", "Bill stage types"],
  ["bill-types.collection", "/api/billtypes", "Bill types"],
  ["sessions.collection", "/api/sessions", "Sessions"],
  ["members.collection", "/api/members", "Members"],
  ["member-constituency-statuses.collection", "/api/memberelectionconstituencystatuses", "Member constituency statuses"],
  ["member-region-statuses.collection", "/api/memberelectionregionstatuses", "Member region statuses"],
  ["constituencies.collection", "/api/constituencies", "Constituencies"],
  ["regions.collection", "/api/regions", "Regions"],
  ["parties.collection", "/api/parties", "Parties"],
  ["member-parties.collection", "/api/memberparties", "Member parties"],
  ["party-roles.collection", "/api/partyroles", "Party roles"],
  ["member-party-roles.collection", "/api/memberpartyroles", "Member party roles"],
  ["government-roles.collection", "/api/governmentroles", "Government roles"],
  ["member-government-roles.collection", "/api/membergovernmentroles", "Member government roles"],
  ["committees.collection", "/api/committees", "Committees"],
  ["committee-roles.collection", "/api/committeeroles", "Committee roles"],
  ["committee-types.collection", "/api/committeetypes", "Committee types"],
  ["committee-type-links.collection", "/api/committeetypelinks", "Committee type links"],
  ["mqa-events.collection", "/api/motionsquestionsanswersevents", "Motions, questions and answers events"],
  ["mqa-event-types.collection", "/api/motionsquestionsanswerseventtypes", "MQA event types"],
  ["mqa-event-subtypes.collection", "/api/motionsquestionsanswerseventsubtypes", "MQA event subtypes"],
  ["mqa-event-links.collection", "/api/motionsquestionsanswerseventlinks", "MQA event links"],
  ["mqa-motions.collection", "/api/motionsquestionsanswersmotions", "MQA motions"],
  ["mqa-motions-consideration.collection", "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration", "MQA consideration motions"],
  ["mqa-motions-programme.collection", "/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme", "MQA programme motions"],
  ["mqa-questions.collection", "/api/motionsquestionsanswersquestions", "MQA questions"],
  ["mqa-supports.collection", "/api/motionsquestionsanswerssupports", "MQA supports"]
];
const years2011 = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const years1999 = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const annual = [
  ["mqa-questions.annual", "/api/motionsquestionsanswersquestions?year=", years2011, "MQA questions by year", false],
  ["committee-reports.annual", "/api/orscommitteemeeting?year=", years1999, "Committee Official Reports by year", true],
  ["plenary-reports.annual", "/api/orsplenarymeeting?year=", years1999, "Plenary Official Reports by year", true],
  ["votes-on-motions.annual", "/api/votesmotion?year=", years2011, "Votes on motions by year", false]
];
const limitationKeys = new Set([
  "mqa-events.detail", "mqa-questions.detail", "mqa-supports.detail",
  "committee-reports.detail", "plenary-reports.detail", "votes-on-motions.detail"
]);
const detailForms = [
  ["bills.detail", "/api/bills/:id", "bills.collection"], ["bill-stages.detail", "/api/billstages/:id", "bill-stages.collection"],
  ["bill-stage-types.detail", "/api/billstagetypes/:id", "bill-stage-types.collection"], ["bill-types.detail", "/api/billtypes/:id", "bill-types.collection"],
  ["sessions.detail", "/api/sessions/:id", "sessions.collection"], ["members.detail", "/api/members/:id", "members.collection"],
  ["member-constituency-statuses.detail", "/api/memberelectionconstituencystatuses/:id", "member-constituency-statuses.collection"], ["member-region-statuses.detail", "/api/memberelectionregionstatuses/:id", "member-region-statuses.collection"],
  ["constituencies.detail", "/api/constituencies/:id", "constituencies.collection"], ["regions.detail", "/api/regions/:id", "regions.collection"],
  ["parties.detail", "/api/parties/:id", "parties.collection"], ["member-parties.detail", "/api/memberparties/:id", "member-parties.collection"], ["party-roles.detail", "/api/partyroles/:id", "party-roles.collection"],
  ["member-party-roles.detail", "/api/memberpartyroles/:id", "member-party-roles.collection"], ["government-roles.detail", "/api/governmentroles/:id", "government-roles.collection"], ["member-government-roles.detail", "/api/membergovernmentroles/:id", "member-government-roles.collection"],
  ["committees.detail", "/api/committees/:id", "committees.collection"], ["committee-roles.detail", "/api/committeeroles/:id", "committee-roles.collection"], ["committee-types.detail", "/api/committeetypes/:id", "committee-types.collection"],
  ["mqa-events.detail", "/api/motionsquestionsanswersevents/:id", "mqa-events.collection"], ["mqa-event-types.detail", "/api/motionsquestionsanswerseventtypes/:id", "mqa-event-types.collection"], ["mqa-event-subtypes.detail", "/api/motionsquestionsanswerseventsubtypes/:id", "mqa-event-subtypes.collection"],
  ["mqa-motions.detail", "/api/motionsquestionsanswersmotions/:id", "mqa-motions.collection"], ["mqa-questions.detail", "/api/motionsquestionsanswersquestions/:id", "mqa-questions.collection"], ["mqa-supports.detail", "/api/motionsquestionsanswerssupports/:id", "mqa-supports.collection"],
  ["committee-reports.detail", "/api/Orscommitteemeeting/:id", "committee-reports.annual"], ["plenary-reports.detail", "/api/orsplenarymeeting/:id", "plenary-reports.annual"], ["votes-on-motions.detail", "/api/votesmotion/:id", "votes-on-motions.annual"],
  ["mqa-event-links.child-filter", "/api/motionsquestionsanswerseventlinks?childUniqueId=:id", "mqa-event-links.collection"], ["mqa-event-links.main-filter", "/api/motionsquestionsanswerseventlinks?mainUniqueId=:id", "mqa-event-links.collection"], ["mqa-event-links.parent-filter", "/api/motionsquestionsanswerseventlinks?parentUniqueId=:id", "mqa-event-links.collection"]
];

const forms = [
  ...fixed.map(([key, route, description]) => ({ key, route, description, treatment: "RETAIN_WHOLE", parent: null })),
  ...annual.map(([key, route, , description]) => ({ key, route: `${route}{year}`, description, treatment: "RETAIN_WHOLE", parent: null })),
  ...detailForms.map(([key, route, parent]) => ({ key, route, description: `Source form ${route}`, treatment: limitationKeys.has(key) ? "UPSTREAM_LIMITATION" : "PARENT_BACKED", parent }))
];
const units = [
  ...fixed.map(([formKey, route]) => ({ key: formKey, formKey, locator: `${base}${route}`, report: false, cadence: "DAILY" })),
  ...annual.flatMap(([formKey, prefix, years, , report]) => years.map((year) => ({ key: `${formKey}.${year}`, formKey, locator: `${base}${prefix}${year}`, report, cadence: year === 2026 ? "DAILY" : "WEEKLY" })))
];

if (forms.length !== 64 || units.length !== 117 || new Set(units.map((unit) => unit.locator)).size !== 117) {
  throw new Error(`Reviewed A3 registry is malformed: ${forms.length} forms; ${units.length} units.`);
}

const configRevision = crypto.createHash("sha256").update(JSON.stringify({ forms, units })).digest("hex");
const client = new Client({ connectionString: process.env.DB1_A3_DATABASE_URL, application_name: "cld-db1-a3-baseline" });
let runId;
let totalBodyBytes = 0;
let deadline;
let totalTimer;
const runAbort = new AbortController();

function captureClient(unit) {
  return new Client({
    connectionString: process.env.DB1_A3_DATABASE_URL,
    application_name: `cld-db1-a3-${unit.key}`
  });
}

function sourceCondition(error, response) {
  if (error?.name === "AbortError") return ["LOCAL_FAILURE", null, "TIMEOUT", "response exceeded its approved time limit"];
  if (error) return ["LOCAL_FAILURE", null, "TRANSPORT_ERROR", String(error.message ?? error).slice(0, 500)];
  return ["UPSTREAM_CONDITION", response.status, `HTTP_${response.status}`, `upstream returned HTTP ${response.status}`];
}

async function seedAndCheckRegistry() {
  for (const form of forms) {
    await client.query(
      `insert into db1.source_form (form_key, source_route_form, access_treatment, description, parent_form_key, limitation_note)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (form_key) do update set source_route_form = excluded.source_route_form, access_treatment = excluded.access_treatment, description = excluded.description, parent_form_key = excluded.parent_form_key, limitation_note = excluded.limitation_note`,
      [form.key, form.route, form.treatment, form.description, form.parent, form.treatment === "UPSTREAM_LIMITATION" ? "No usable ordinary-detail request contract; retain the named parent response and visible source limitation." : null]
    );
  }
  for (const unit of units) {
    await client.query(
      `insert into db1.response_unit (response_unit_key, form_key, request_method, request_locator, cadence_class)
       values ($1, $2, 'GET', $3, $4)
       on conflict (response_unit_key) do update set form_key = excluded.form_key, request_method = excluded.request_method, request_locator = excluded.request_locator, cadence_class = excluded.cadence_class`,
      [unit.key, unit.formKey, unit.locator, unit.cadence]
    );
  }
  const check = await client.query(
    `select count(distinct form.form_key) filter (where access_treatment <> 'SYNTHETIC_TEST')::int as forms,
            count(unit.response_unit_key) filter (where unit.response_unit_key not like 'a2.%')::int as units
       from db1.source_form form left join db1.response_unit unit using (form_key)`
  );
  if (check.rows[0].forms !== 64 || check.rows[0].units !== 117) throw new Error("database registry does not match reviewed A3 scope");
}

async function recordCondition(database, unit, kind, status, code, detail) {
  await database.query(
    `insert into db1.response_verification (response_unit_key, capture_run_id, result_kind, upstream_status, condition_code, detail)
     values ($1, $2, $3, $4, $5, $6)`, [unit.key, runId, kind, status, code, detail]
  );
}

async function retain(database, unit, response, body) {
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const declaredJson = /(?:^|\s|;)application\/(?:[a-z0-9.+-]*\+)?json(?:\s|;|$)/i.test(contentType);
  const existing = await database.query("select source_response_id from db1.source_response where response_unit_key = $1 and body_sha256 = $2", [unit.key, crypto.createHash("sha256").update(body).digest("hex")]);
  if (existing.rowCount) {
    await database.query(
      `insert into db1.response_verification (response_unit_key, capture_run_id, result_kind, source_response_id, upstream_status, detail)
       values ($1, $2, 'UNCHANGED', $3, $4, 'same bytes as previously retained response')`, [unit.key, runId, existing.rows[0].source_response_id, response.status]
    );
    return "UNCHANGED";
  }
  let saved;
  let hasJson = declaredJson;
  try {
    saved = await database.query(
      `insert into db1.source_response (response_unit_key, capture_run_id, request_method, request_locator, response_status, content_type, raw_body, body_byte_length, body_jsonb)
       values ($1, $2, 'GET', $3, $4, $5, $6::bytea, octet_length($6::bytea), case when $7 then convert_from($6::bytea, 'UTF8')::jsonb else null end)
       returning source_response_id`, [unit.key, runId, unit.locator, response.status, contentType, body, hasJson]
    );
  } catch (error) {
    if (error?.code !== "22P02" || !hasJson) throw error;
    hasJson = false;
    saved = await database.query(
      `insert into db1.source_response (response_unit_key, capture_run_id, request_method, request_locator, response_status, content_type, raw_body, body_byte_length, body_jsonb)
       values ($1, $2, 'GET', $3, $4, $5, $6::bytea, octet_length($6::bytea), null)
       returning source_response_id`, [unit.key, runId, unit.locator, response.status, contentType, body]
    );
  }
  if (hasJson) {
    await database.query(
      `insert into db1.schema_observation (source_response_id, shape_json, shape_sha256)
       select source_response_id, db1.json_shape(body_jsonb), encode(digest(db1.json_shape(body_jsonb)::text, 'sha256'), 'hex') from db1.source_response where source_response_id = $1`, [saved.rows[0].source_response_id]
    );
  }
  const availabilityMessage = /"Message"\s*:\s*"[^"\\]*(?:\\.[^"\\]*)*presently unavailable/i.test(body.toString("utf8", 0, Math.min(body.byteLength, 16_384)));
  await database.query(
    `insert into db1.response_verification (response_unit_key, capture_run_id, result_kind, source_response_id, upstream_status, condition_code, detail)
     values ($1, $2, $3, $4, $5, $6, $7)`, [
      unit.key,
      runId,
      availabilityMessage ? "UPSTREAM_CONDITION" : "NEW",
      saved.rows[0].source_response_id,
      response.status,
      availabilityMessage ? "UPSTREAM_AVAILABILITY_MESSAGE" : null,
      availabilityMessage ? "upstream returned a 2xx availability message; original JSON retained in PostgreSQL" : "retained in PostgreSQL"
    ]
  );
  return availabilityMessage ? "UPSTREAM_AVAILABILITY_MESSAGE" : "NEW";
}

async function readBody(response) {
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > maxBodyBytes || totalBodyBytes + size > maxTotalBytes) {
      runAbort.abort("A3 approved body-size budget reached");
      throw new Error("A3 approved body-size budget reached");
    }
    chunks.push(chunk);
  }
  totalBodyBytes += size;
  return Buffer.concat(chunks, size);
}

async function capture(unit) {
  if (Date.now() >= deadline) throw new Error("A3 total runtime limit reached");
  const database = captureClient(unit);
  await database.connect();
  const controller = new AbortController();
  const unitLimit = unit.report ? reportTimeoutMs : ordinaryTimeoutMs;
  const remaining = deadline - Date.now();
  const totalDeadlineWins = remaining < unitLimit;
  const timeout = setTimeout(() => controller.abort(), Math.min(unitLimit, remaining));
  try {
    const response = await fetch(unit.locator, { method: "GET", signal: AbortSignal.any([controller.signal, runAbort.signal]), headers: { accept: "application/json" } });
    if (!response.ok) {
      const [kind, status, code, detail] = sourceCondition(null, response);
      await recordCondition(database, unit, kind, status, code, detail);
      return { key: unit.key, result: code };
    }
    const body = await readBody(response);
    return { key: unit.key, result: await retain(database, unit, response, body), bytes: body.byteLength };
  } catch (error) {
    if (runAbort.signal.aborted) throw new Error(String(runAbort.signal.reason ?? "A3 hard stop"));
    if (totalDeadlineWins && error?.name === "AbortError") throw new Error("A3 total runtime limit reached");
    if (String(error.message).includes("A3 approved body-size") || String(error.message).includes("A3 total runtime")) throw error;
    const [kind, status, code, detail] = sourceCondition(error, null);
    await recordCondition(database, unit, kind, status, code, detail);
    return { key: unit.key, result: code };
  } finally {
    clearTimeout(timeout);
    await database.end();
  }
}

async function runPool(queue, concurrency) {
  let cursor = 0;
  const results = [];
  let hardStop;
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (cursor < queue.length && !hardStop) {
      const index = cursor++;
      try {
        results.push(await capture(queue[index]));
      } catch (error) {
        hardStop = error;
        runAbort.abort(error.message);
      }
    }
  }));
  if (hardStop) throw hardStop;
  return results;
}

try {
  if (!process.env.DB1_A3_DATABASE_URL) throw new Error("DB1_A3_DATABASE_URL is required");
  await client.connect();
  await seedAndCheckRegistry();
  const run = await client.query(
    `insert into db1.capture_run (run_kind, worker_revision, configuration_revision, scope_description)
     values ('A3_BASELINE', 'db1-a3-baseline-v1', $1, '117 reviewed Scottish Parliament fixed/annual response units; no identifier crawl') returning capture_run_id`, [configRevision]
  );
  runId = run.rows[0].capture_run_id;
  deadline = Date.now() + totalTimeoutMs;
  totalTimer = setTimeout(() => runAbort.abort("A3 total runtime limit reached"), totalTimeoutMs);
  const [ordinary, reports] = await Promise.all([runPool(units.filter((unit) => !unit.report), 6), runPool(units.filter((unit) => unit.report), 2)]);
  clearTimeout(totalTimer);
  const complete = await client.query("select count(*)::int as count from db1.response_verification where capture_run_id = $1", [runId]);
  if (complete.rows[0].count !== 117) throw new Error(`baseline closed with ${complete.rows[0].count} of 117 results`);
  await client.query("update db1.capture_run set finished_at = now(), result_status = 'PASS' where capture_run_id = $1", [runId]);
  console.log(JSON.stringify({ status: "PASS", runId, configurationRevision: configRevision, totalBodyBytes, results: [...ordinary, ...reports] }, null, 2));
} catch (error) {
  if (runId) await client.query("update db1.capture_run set finished_at = now(), result_status = 'FAIL' where capture_run_id = $1 and result_status = 'RUNNING'", [runId]);
  console.error(error);
  process.exitCode = 1;
} finally {
  if (totalTimer) clearTimeout(totalTimer);
  await client.end();
}
