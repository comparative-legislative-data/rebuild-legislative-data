-- DB1 A5 production schema.  Runs only under DEC-0125.
-- It replaces the disqualified partial db1 schema in cld_gb_sct_db1.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_db1_owner') THEN
    CREATE ROLE cld_gb_sct_db1_owner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_db1_worker') THEN
    CREATE ROLE cld_gb_sct_db1_worker LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOINHERIT;
  END IF;
END;
$$;

DROP SCHEMA IF EXISTS db1 CASCADE;
CREATE SCHEMA db1 AUTHORIZATION cld_gb_sct_db1_owner;

SET ROLE cld_gb_sct_db1_owner;

CREATE TABLE db1.source_form (
  form_key text PRIMARY KEY,
  source_route_form text NOT NULL UNIQUE,
  access_treatment text NOT NULL CHECK (access_treatment IN ('RETAIN_WHOLE', 'PARENT_BACKED', 'UPSTREAM_LIMITATION')),
  description text NOT NULL,
  parent_form_key text REFERENCES db1.source_form(form_key),
  limitation_note text,
  is_synthetic boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((access_treatment = 'UPSTREAM_LIMITATION') = (limitation_note IS NOT NULL))
);

CREATE TABLE db1.response_unit (
  response_unit_key text PRIMARY KEY,
  form_key text NOT NULL REFERENCES db1.source_form(form_key),
  request_method text NOT NULL DEFAULT 'GET' CHECK (request_method = 'GET'),
  request_locator text NOT NULL UNIQUE,
  unit_class text NOT NULL CHECK (unit_class IN ('FIXED', 'ANNUAL', 'SYNTHETIC')),
  later_cadence text NOT NULL CHECK (later_cadence IN ('DAILY', 'WEEKLY', 'SYNTHETIC_ONLY')),
  is_synthetic boolean NOT NULL DEFAULT false,
  approved_at timestamptz NOT NULL DEFAULT now(),
  retired_at timestamptz,
  CHECK ((is_synthetic AND unit_class = 'SYNTHETIC') OR (NOT is_synthetic AND unit_class IN ('FIXED', 'ANNUAL'))),
  CHECK (retired_at IS NULL OR retired_at >= approved_at)
);

CREATE TABLE db1.capture_run (
  capture_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_kind text NOT NULL CHECK (run_kind IN ('SYNTHETIC_PROOF', 'INITIAL_BASELINE', 'RECONCILIATION')),
  worker_revision text NOT NULL,
  deployed_package_revision text NOT NULL,
  configuration_sha256 text NOT NULL CHECK (configuration_sha256 ~ '^[0-9a-f]{64}$'),
  declared_limits jsonb NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  result_status text NOT NULL DEFAULT 'RUNNING' CHECK (result_status IN ('RUNNING', 'PASS', 'FAIL', 'BLOCKED')),
  attempted_units integer NOT NULL DEFAULT 0 CHECK (attempted_units >= 0),
  transferred_bytes bigint NOT NULL DEFAULT 0 CHECK (transferred_bytes >= 0),
  stop_reason text,
  summary_jsonb jsonb,
  CHECK ((result_status = 'RUNNING') = (finished_at IS NULL))
);

CREATE TABLE db1.source_response (
  source_response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_unit_key text NOT NULL REFERENCES db1.response_unit(response_unit_key),
  capture_run_id uuid NOT NULL REFERENCES db1.capture_run(capture_run_id),
  request_started_at timestamptz NOT NULL,
  request_finished_at timestamptz NOT NULL,
  request_method text NOT NULL CHECK (request_method = 'GET'),
  request_locator text NOT NULL,
  response_status integer NOT NULL CHECK (response_status BETWEEN 100 AND 599),
  response_headers jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_type text NOT NULL,
  raw_body bytea NOT NULL,
  body_byte_length bigint NOT NULL CHECK (body_byte_length = octet_length(raw_body)),
  body_sha256 text GENERATED ALWAYS AS (encode(digest(raw_body, 'sha256'), 'hex')) STORED,
  UNIQUE (response_unit_key, body_sha256)
);

CREATE TABLE db1.projection_run (
  projection_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_response_id uuid NOT NULL UNIQUE REFERENCES db1.source_response(source_response_id) ON DELETE CASCADE,
  parser_revision text NOT NULL,
  observed_shape text NOT NULL CHECK (observed_shape IN ('ARRAY_OF_OBJECTS', 'SINGLE_OBJECT', 'SOURCE_MESSAGE', 'NON_JSON', 'MALFORMED_JSON', 'UNSUPPORTED_ARRAY', 'OBJECT_LIMIT')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  result_status text NOT NULL DEFAULT 'RUNNING' CHECK (result_status IN ('RUNNING', 'PASS', 'LIMITED', 'FAIL')),
  object_count integer NOT NULL DEFAULT 0 CHECK (object_count >= 0),
  detail text,
  CHECK ((result_status = 'RUNNING') = (finished_at IS NULL))
);

CREATE TABLE db1.response_object (
  response_object_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_response_id uuid NOT NULL REFERENCES db1.source_response(source_response_id) ON DELETE CASCADE,
  source_position integer NOT NULL CHECK (source_position >= 0),
  source_object_sha256 text NOT NULL CHECK (source_object_sha256 ~ '^[0-9a-f]{64}$'),
  object_jsonb jsonb NOT NULL CHECK (jsonb_typeof(object_jsonb) = 'object'),
  object_jsonb_sha256 text GENERATED ALWAYS AS (encode(digest(object_jsonb::text, 'sha256'), 'hex')) STORED,
  UNIQUE (source_response_id, source_position)
);

CREATE TABLE db1.field_observation (
  field_observation_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  projection_run_id uuid NOT NULL REFERENCES db1.projection_run(projection_run_id) ON DELETE CASCADE,
  json_path text NOT NULL,
  json_type text NOT NULL,
  occurrence_count integer NOT NULL CHECK (occurrence_count >= 0),
  null_count integer NOT NULL CHECK (null_count >= 0),
  UNIQUE (projection_run_id, json_path, json_type)
);

CREATE TABLE db1.response_verification (
  response_verification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_unit_key text NOT NULL REFERENCES db1.response_unit(response_unit_key),
  capture_run_id uuid NOT NULL REFERENCES db1.capture_run(capture_run_id),
  checked_at timestamptz NOT NULL DEFAULT now(),
  result_kind text NOT NULL CHECK (result_kind IN ('NEW', 'CHANGED', 'UNCHANGED', 'UPSTREAM_CONDITION', 'LOCAL_FAILURE', 'NOT_DUE', 'NOT_ATTEMPTED')),
  source_response_id uuid REFERENCES db1.source_response(source_response_id),
  upstream_status integer,
  condition_code text,
  detail text,
  CHECK ((result_kind IN ('NEW', 'CHANGED', 'UNCHANGED', 'UPSTREAM_CONDITION') AND source_response_id IS NOT NULL)
      OR result_kind IN ('LOCAL_FAILURE', 'NOT_DUE', 'NOT_ATTEMPTED'))
);

CREATE FUNCTION db1.enforce_response_provenance()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE approved_method text; approved_locator text;
BEGIN
  SELECT request_method, request_locator INTO approved_method, approved_locator
    FROM db1.response_unit WHERE response_unit_key = NEW.response_unit_key AND retired_at IS NULL;
  IF NOT FOUND OR NEW.request_method <> approved_method OR NEW.request_locator <> approved_locator THEN
    RAISE EXCEPTION 'response provenance does not match active response unit %', NEW.response_unit_key USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION db1.block_source_response_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'source_response rows are immutable' USING ERRCODE = 'check_violation';
END;
$$;

CREATE TRIGGER source_response_provenance_guard BEFORE INSERT ON db1.source_response
  FOR EACH ROW EXECUTE FUNCTION db1.enforce_response_provenance();
-- Worker roles have no DELETE privilege.  The owner can remove the temporary
-- synthetic proof row during the explicitly approved cleanup step.
CREATE TRIGGER source_response_immutable BEFORE UPDATE ON db1.source_response
  FOR EACH ROW EXECUTE FUNCTION db1.block_source_response_change();

CREATE INDEX source_response_unit_time_idx ON db1.source_response (response_unit_key, request_finished_at DESC);
CREATE INDEX response_object_parent_position_idx ON db1.response_object (source_response_id, source_position);
CREATE INDEX response_verification_unit_time_idx ON db1.response_verification (response_unit_key, checked_at DESC);
CREATE INDEX capture_run_status_idx ON db1.capture_run (result_status, started_at DESC);

CREATE VIEW db1.v_current_response_unit AS
WITH latest_response AS (
  SELECT DISTINCT ON (response_unit_key) response_unit_key, source_response_id, request_finished_at, body_sha256, body_byte_length
    FROM db1.source_response ORDER BY response_unit_key, request_finished_at DESC, source_response_id DESC
), latest_verification AS (
  SELECT DISTINCT ON (response_unit_key) response_unit_key, response_verification_id, checked_at, result_kind, upstream_status, condition_code
    FROM db1.response_verification ORDER BY response_unit_key, checked_at DESC, response_verification_id DESC
)
SELECT unit.response_unit_key, unit.form_key, unit.request_locator, unit.later_cadence,
       response.source_response_id AS latest_source_response_id, response.request_finished_at AS latest_response_at,
       response.body_sha256 AS latest_body_sha256, response.body_byte_length AS latest_body_byte_length,
       verification.response_verification_id AS latest_verification_id, verification.checked_at AS latest_checked_at,
       verification.result_kind AS latest_result_kind, verification.upstream_status AS latest_upstream_status,
       verification.condition_code AS latest_condition_code
  FROM db1.response_unit unit
  LEFT JOIN latest_response response USING (response_unit_key)
  LEFT JOIN latest_verification verification USING (response_unit_key)
 WHERE NOT unit.is_synthetic;

INSERT INTO db1.source_form (form_key, source_route_form, access_treatment, description) VALUES
('bills.collection','/api/bills','RETAIN_WHOLE','Bills'),
('bill-stages.collection','/api/billstages','RETAIN_WHOLE','Bill stages'),
('bill-stage-types.collection','/api/billstagetypes','RETAIN_WHOLE','Bill stage types'),
('bill-types.collection','/api/billtypes','RETAIN_WHOLE','Bill types'),
('sessions.collection','/api/sessions','RETAIN_WHOLE','Sessions'),
('members.collection','/api/members','RETAIN_WHOLE','Members'),
('member-constituency-statuses.collection','/api/memberelectionconstituencystatuses','RETAIN_WHOLE','Member constituency statuses'),
('member-region-statuses.collection','/api/memberelectionregionstatuses','RETAIN_WHOLE','Member region statuses'),
('constituencies.collection','/api/constituencies','RETAIN_WHOLE','Constituencies'),
('regions.collection','/api/regions','RETAIN_WHOLE','Regions'),
('parties.collection','/api/parties','RETAIN_WHOLE','Parties'),
('member-parties.collection','/api/memberparties','RETAIN_WHOLE','Member parties'),
('party-roles.collection','/api/partyroles','RETAIN_WHOLE','Party roles'),
('member-party-roles.collection','/api/memberpartyroles','RETAIN_WHOLE','Member party roles'),
('government-roles.collection','/api/governmentroles','RETAIN_WHOLE','Government roles'),
('member-government-roles.collection','/api/membergovernmentroles','RETAIN_WHOLE','Member government roles'),
('committees.collection','/api/committees','RETAIN_WHOLE','Committees'),
('committee-roles.collection','/api/committeeroles','RETAIN_WHOLE','Committee roles'),
('committee-types.collection','/api/committeetypes','RETAIN_WHOLE','Committee types'),
('committee-type-links.collection','/api/committeetypelinks','RETAIN_WHOLE','Committee type links'),
('mqa-events.collection','/api/motionsquestionsanswersevents','RETAIN_WHOLE','MQA events'),
('mqa-event-types.collection','/api/motionsquestionsanswerseventtypes','RETAIN_WHOLE','MQA event types'),
('mqa-event-subtypes.collection','/api/motionsquestionsanswerseventsubtypes','RETAIN_WHOLE','MQA event subtypes'),
('mqa-event-links.collection','/api/motionsquestionsanswerseventlinks','RETAIN_WHOLE','MQA event links'),
('mqa-motions.collection','/api/motionsquestionsanswersmotions','RETAIN_WHOLE','MQA motions'),
('mqa-motions-consideration.collection','/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration','RETAIN_WHOLE','MQA consideration motions'),
('mqa-motions-programme.collection','/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme','RETAIN_WHOLE','MQA programme motions'),
('mqa-questions.collection','/api/motionsquestionsanswersquestions','RETAIN_WHOLE','MQA questions'),
('mqa-supports.collection','/api/motionsquestionsanswerssupports','RETAIN_WHOLE','MQA supports'),
('mqa-questions.annual','/api/motionsquestionsanswersquestions?year={year}','RETAIN_WHOLE','MQA questions by year'),
('committee-reports.annual','/api/orscommitteemeeting?year={year}','RETAIN_WHOLE','Committee official reports by year'),
('plenary-reports.annual','/api/orsplenarymeeting?year={year}','RETAIN_WHOLE','Plenary official reports by year'),
('votes-on-motions.annual','/api/votesmotion?year={year}','RETAIN_WHOLE','Votes on motions by year');

INSERT INTO db1.source_form (form_key, source_route_form, access_treatment, description, parent_form_key, limitation_note) VALUES
('bills.detail','/api/bills/:id','PARENT_BACKED','Bill detail','bills.collection',NULL),
('bill-stages.detail','/api/billstages/:id','PARENT_BACKED','Bill-stage detail','bill-stages.collection',NULL),
('bill-stage-types.detail','/api/billstagetypes/:id','PARENT_BACKED','Bill-stage-type detail','bill-stage-types.collection',NULL),
('bill-types.detail','/api/billtypes/:id','PARENT_BACKED','Bill-type detail','bill-types.collection',NULL),
('sessions.detail','/api/sessions/:id','PARENT_BACKED','Session detail','sessions.collection',NULL),
('members.detail','/api/members/:id','PARENT_BACKED','Member detail','members.collection',NULL),
('member-constituency-statuses.detail','/api/memberelectionconstituencystatuses/:id','PARENT_BACKED','Member constituency status detail','member-constituency-statuses.collection',NULL),
('member-region-statuses.detail','/api/memberelectionregionstatuses/:id','PARENT_BACKED','Member region status detail','member-region-statuses.collection',NULL),
('constituencies.detail','/api/constituencies/:id','PARENT_BACKED','Constituency detail','constituencies.collection',NULL),
('regions.detail','/api/regions/:id','PARENT_BACKED','Region detail','regions.collection',NULL),
('parties.detail','/api/parties/:id','PARENT_BACKED','Party detail','parties.collection',NULL),
('member-parties.detail','/api/memberparties/:id','PARENT_BACKED','Member party detail','member-parties.collection',NULL),
('party-roles.detail','/api/partyroles/:id','PARENT_BACKED','Party role detail','party-roles.collection',NULL),
('member-party-roles.detail','/api/memberpartyroles/:id','PARENT_BACKED','Member party role detail','member-party-roles.collection',NULL),
('government-roles.detail','/api/governmentroles/:id','PARENT_BACKED','Government role detail','government-roles.collection',NULL),
('member-government-roles.detail','/api/membergovernmentroles/:id','PARENT_BACKED','Member government role detail','member-government-roles.collection',NULL),
('committees.detail','/api/committees/:id','PARENT_BACKED','Committee detail','committees.collection',NULL),
('committee-roles.detail','/api/committeeroles/:id','PARENT_BACKED','Committee role detail','committee-roles.collection',NULL),
('committee-types.detail','/api/committeetypes/:id','PARENT_BACKED','Committee type detail','committee-types.collection',NULL),
('mqa-event-types.detail','/api/motionsquestionsanswerseventtypes/:id','PARENT_BACKED','MQA event type detail','mqa-event-types.collection',NULL),
('mqa-event-subtypes.detail','/api/motionsquestionsanswerseventsubtypes/:id','PARENT_BACKED','MQA event subtype detail','mqa-event-subtypes.collection',NULL),
('mqa-motions.detail','/api/motionsquestionsanswersmotions/:id','PARENT_BACKED','MQA motion detail','mqa-motions.collection',NULL),
('mqa-event-links.child-filter','/api/motionsquestionsanswerseventlinks?childUniqueId=:id','PARENT_BACKED','MQA event-link child filter','mqa-event-links.collection',NULL),
('mqa-event-links.main-filter','/api/motionsquestionsanswerseventlinks?mainUniqueId=:id','PARENT_BACKED','MQA event-link main filter','mqa-event-links.collection',NULL),
('mqa-event-links.parent-filter','/api/motionsquestionsanswerseventlinks?parentUniqueId=:id','PARENT_BACKED','MQA event-link parent filter','mqa-event-links.collection',NULL),
('mqa-events.detail','/api/motionsquestionsanswersevents/:id','UPSTREAM_LIMITATION','MQA event detail','mqa-events.collection','Observed upstream 500 condition.'),
('mqa-questions.detail','/api/motionsquestionsanswersquestions/:id','UPSTREAM_LIMITATION','MQA question detail','mqa-questions.collection','Observed upstream 500 condition.'),
('mqa-supports.detail','/api/motionsquestionsanswerssupports/:id','UPSTREAM_LIMITATION','MQA support detail','mqa-supports.collection','Observed empty-object detail condition.'),
('committee-reports.detail','/api/Orscommitteemeeting/:id','UPSTREAM_LIMITATION','Committee report detail','committee-reports.annual','No usable ordinary-ID contract observed.'),
('plenary-reports.detail','/api/orsplenarymeeting/:id','UPSTREAM_LIMITATION','Plenary report detail','plenary-reports.annual','No usable ordinary-ID contract observed.'),
('votes-on-motions.detail','/api/votesmotion/:id','UPSTREAM_LIMITATION','Votes-on-motions detail','votes-on-motions.annual','No usable ordinary-ID contract observed.');

INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence) VALUES
('bills.collection','bills.collection','https://data.parliament.scot/api/bills','FIXED','DAILY'),
('bill-stages.collection','bill-stages.collection','https://data.parliament.scot/api/billstages','FIXED','DAILY'),
('bill-stage-types.collection','bill-stage-types.collection','https://data.parliament.scot/api/billstagetypes','FIXED','DAILY'),
('bill-types.collection','bill-types.collection','https://data.parliament.scot/api/billtypes','FIXED','DAILY'),
('sessions.collection','sessions.collection','https://data.parliament.scot/api/sessions','FIXED','DAILY'),
('members.collection','members.collection','https://data.parliament.scot/api/members','FIXED','DAILY'),
('member-constituency-statuses.collection','member-constituency-statuses.collection','https://data.parliament.scot/api/memberelectionconstituencystatuses','FIXED','DAILY'),
('member-region-statuses.collection','member-region-statuses.collection','https://data.parliament.scot/api/memberelectionregionstatuses','FIXED','DAILY'),
('constituencies.collection','constituencies.collection','https://data.parliament.scot/api/constituencies','FIXED','DAILY'),
('regions.collection','regions.collection','https://data.parliament.scot/api/regions','FIXED','DAILY'),
('parties.collection','parties.collection','https://data.parliament.scot/api/parties','FIXED','DAILY'),
('member-parties.collection','member-parties.collection','https://data.parliament.scot/api/memberparties','FIXED','DAILY'),
('party-roles.collection','party-roles.collection','https://data.parliament.scot/api/partyroles','FIXED','DAILY'),
('member-party-roles.collection','member-party-roles.collection','https://data.parliament.scot/api/memberpartyroles','FIXED','DAILY'),
('government-roles.collection','government-roles.collection','https://data.parliament.scot/api/governmentroles','FIXED','DAILY'),
('member-government-roles.collection','member-government-roles.collection','https://data.parliament.scot/api/membergovernmentroles','FIXED','DAILY'),
('committees.collection','committees.collection','https://data.parliament.scot/api/committees','FIXED','DAILY'),
('committee-roles.collection','committee-roles.collection','https://data.parliament.scot/api/committeeroles','FIXED','DAILY'),
('committee-types.collection','committee-types.collection','https://data.parliament.scot/api/committeetypes','FIXED','DAILY'),
('committee-type-links.collection','committee-type-links.collection','https://data.parliament.scot/api/committeetypelinks','FIXED','DAILY'),
('mqa-events.collection','mqa-events.collection','https://data.parliament.scot/api/motionsquestionsanswersevents','FIXED','DAILY'),
('mqa-event-types.collection','mqa-event-types.collection','https://data.parliament.scot/api/motionsquestionsanswerseventtypes','FIXED','DAILY'),
('mqa-event-subtypes.collection','mqa-event-subtypes.collection','https://data.parliament.scot/api/motionsquestionsanswerseventsubtypes','FIXED','DAILY'),
('mqa-event-links.collection','mqa-event-links.collection','https://data.parliament.scot/api/motionsquestionsanswerseventlinks','FIXED','DAILY'),
('mqa-motions.collection','mqa-motions.collection','https://data.parliament.scot/api/motionsquestionsanswersmotions','FIXED','DAILY'),
('mqa-motions-consideration.collection','mqa-motions-consideration.collection','https://data.parliament.scot/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration','FIXED','DAILY'),
('mqa-motions-programme.collection','mqa-motions-programme.collection','https://data.parliament.scot/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=programme','FIXED','DAILY'),
('mqa-questions.collection','mqa-questions.collection','https://data.parliament.scot/api/motionsquestionsanswersquestions','FIXED','DAILY'),
('mqa-supports.collection','mqa-supports.collection','https://data.parliament.scot/api/motionsquestionsanswerssupports','FIXED','DAILY');

INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence)
SELECT 'mqa-questions.annual.' || year, 'mqa-questions.annual', 'https://data.parliament.scot/api/motionsquestionsanswersquestions?year=' || year, 'ANNUAL', CASE WHEN year = 2026 THEN 'DAILY' ELSE 'WEEKLY' END FROM generate_series(2011, 2026) year;
INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence)
SELECT 'committee-reports.annual.' || year, 'committee-reports.annual', 'https://data.parliament.scot/api/orscommitteemeeting?year=' || year, 'ANNUAL', CASE WHEN year = 2026 THEN 'DAILY' ELSE 'WEEKLY' END FROM generate_series(1999, 2026) year;
INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence)
SELECT 'plenary-reports.annual.' || year, 'plenary-reports.annual', 'https://data.parliament.scot/api/orsplenarymeeting?year=' || year, 'ANNUAL', CASE WHEN year = 2026 THEN 'DAILY' ELSE 'WEEKLY' END FROM generate_series(1999, 2026) year;
INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence)
SELECT 'votes-on-motions.annual.' || year, 'votes-on-motions.annual', 'https://data.parliament.scot/api/votesmotion?year=' || year, 'ANNUAL', CASE WHEN year = 2026 THEN 'DAILY' ELSE 'WEEKLY' END FROM generate_series(2011, 2026) year;

INSERT INTO db1.source_form (form_key, source_route_form, access_treatment, description, is_synthetic)
VALUES ('__a5_synthetic__','synthetic://db1-a5','RETAIN_WHOLE','Synthetic production-schema proof only',true);
INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence, is_synthetic)
VALUES ('__a5_synthetic__.large','__a5_synthetic__','synthetic://db1-a5/large','SYNTHETIC','SYNTHETIC_ONLY',true);

DO $$
DECLARE form_count integer; unit_count integer;
BEGIN
  SELECT count(*) INTO form_count FROM db1.source_form WHERE NOT is_synthetic;
  SELECT count(*) INTO unit_count FROM db1.response_unit WHERE NOT is_synthetic;
  IF form_count <> 64 OR unit_count <> 117 THEN
    RAISE EXCEPTION 'DB1 registry seed mismatch: % forms, % units', form_count, unit_count;
  END IF;
END;
$$;

REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA db1 FROM PUBLIC;
RESET ROLE;

REVOKE ALL ON DATABASE cld_gb_sct_db1 FROM PUBLIC;
GRANT CONNECT ON DATABASE cld_gb_sct_db1 TO cld_gb_sct_db1_worker;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_db1_worker;
GRANT SELECT ON db1.source_form, db1.response_unit, db1.source_response, db1.v_current_response_unit TO cld_gb_sct_db1_worker;
GRANT INSERT ON db1.capture_run, db1.source_response, db1.projection_run, db1.response_object, db1.field_observation, db1.response_verification TO cld_gb_sct_db1_worker;
GRANT UPDATE (finished_at, result_status, attempted_units, transferred_bytes, stop_reason, summary_jsonb) ON db1.capture_run TO cld_gb_sct_db1_worker;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA db1 TO cld_gb_sct_db1_worker;
