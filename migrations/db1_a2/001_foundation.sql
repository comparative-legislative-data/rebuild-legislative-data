-- DB1 A2 source-free foundation proof.
-- This file deliberately contains no Scottish Parliament URL, request, or data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET ROLE cld_gb_sct_db1_a2_owner;

CREATE SCHEMA IF NOT EXISTS db1;

CREATE OR REPLACE FUNCTION db1.json_shape(value jsonb)
RETURNS jsonb
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT CASE jsonb_typeof(value)
    WHEN 'object' THEN COALESCE(
      (SELECT jsonb_object_agg(key, db1.json_shape(item))
       FROM jsonb_each(value) AS entry(key, item)),
      '{}'::jsonb
    )
    WHEN 'array' THEN jsonb_build_object(
      'array',
      COALESCE(
        (SELECT jsonb_agg(shape ORDER BY shape::text)
         FROM (
           SELECT DISTINCT db1.json_shape(item) AS shape
           FROM jsonb_array_elements(value) AS entry(item)
         ) AS shapes),
        '[]'::jsonb
      )
    )
    ELSE to_jsonb(jsonb_typeof(value))
  END;
$$;

CREATE TABLE db1.source_form (
  form_key text PRIMARY KEY,
  source_route_form text NOT NULL UNIQUE,
  access_treatment text NOT NULL CHECK (
    access_treatment IN ('RETAIN_WHOLE', 'PARENT_BACKED', 'UPSTREAM_LIMITATION', 'SYNTHETIC_TEST')
  ),
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE db1.response_unit (
  response_unit_key text PRIMARY KEY,
  form_key text NOT NULL REFERENCES db1.source_form(form_key),
  request_method text NOT NULL DEFAULT 'GET' CHECK (request_method = 'GET'),
  request_locator text NOT NULL UNIQUE,
  cadence_class text NOT NULL CHECK (cadence_class IN ('SYNTHETIC_ONLY', 'DAILY', 'WEEKLY')),
  approved_at timestamptz NOT NULL DEFAULT now(),
  retired_at timestamptz,
  CHECK (retired_at IS NULL OR retired_at >= approved_at)
);

INSERT INTO db1.source_form (form_key, source_route_form, access_treatment, description)
VALUES
  ('a2.synthetic', 'synthetic://db1-a2', 'SYNTHETIC_TEST', 'Synthetic-only A2 foundation proof; not a source form.')
ON CONFLICT (form_key) DO NOTHING;

INSERT INTO db1.response_unit (response_unit_key, form_key, request_method, request_locator, cadence_class)
VALUES
  ('a2.synthetic.small', 'a2.synthetic', 'GET', 'synthetic://db1-a2/small', 'SYNTHETIC_ONLY'),
  ('a2.synthetic.large', 'a2.synthetic', 'GET', 'synthetic://db1-a2/large', 'SYNTHETIC_ONLY')
ON CONFLICT (response_unit_key) DO NOTHING;

CREATE TABLE db1.capture_run (
  capture_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_kind text NOT NULL CHECK (run_kind IN ('A2_SYNTHETIC_PROOF', 'MANUAL', 'SCHEDULED')),
  worker_revision text NOT NULL,
  configuration_revision text NOT NULL,
  scope_description text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  result_status text NOT NULL DEFAULT 'RUNNING' CHECK (result_status IN ('RUNNING', 'PASS', 'FAIL', 'BLOCKED')),
  CHECK ((result_status = 'RUNNING') = (finished_at IS NULL))
);

CREATE TABLE db1.source_response (
  source_response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_unit_key text NOT NULL REFERENCES db1.response_unit(response_unit_key),
  capture_run_id uuid NOT NULL REFERENCES db1.capture_run(capture_run_id),
  retrieved_at timestamptz NOT NULL DEFAULT now(),
  request_method text NOT NULL CHECK (request_method = 'GET'),
  request_locator text NOT NULL,
  response_status integer NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  content_type text NOT NULL,
  raw_body bytea NOT NULL,
  body_byte_length bigint NOT NULL CHECK (body_byte_length = octet_length(raw_body)),
  body_sha256 text GENERATED ALWAYS AS (encode(digest(raw_body, 'sha256'), 'hex')) STORED,
  body_jsonb jsonb,
  CHECK (body_jsonb IS NULL OR body_jsonb = convert_from(raw_body, 'UTF8')::jsonb),
  UNIQUE (response_unit_key, body_sha256)
);

CREATE TABLE db1.response_verification (
  response_verification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_unit_key text NOT NULL REFERENCES db1.response_unit(response_unit_key),
  capture_run_id uuid NOT NULL REFERENCES db1.capture_run(capture_run_id),
  checked_at timestamptz NOT NULL DEFAULT now(),
  result_kind text NOT NULL CHECK (result_kind IN ('NEW', 'CHANGED', 'UNCHANGED', 'UPSTREAM_CONDITION', 'LOCAL_FAILURE', 'NOT_DUE')),
  source_response_id uuid REFERENCES db1.source_response(source_response_id),
  upstream_status integer,
  condition_code text,
  detail text,
  CHECK (
    (result_kind IN ('NEW', 'CHANGED', 'UNCHANGED') AND source_response_id IS NOT NULL)
    OR (result_kind IN ('UPSTREAM_CONDITION', 'LOCAL_FAILURE', 'NOT_DUE'))
  )
);

CREATE TABLE db1.schema_observation (
  schema_observation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_response_id uuid NOT NULL UNIQUE REFERENCES db1.source_response(source_response_id),
  observed_at timestamptz NOT NULL DEFAULT now(),
  shape_json jsonb NOT NULL,
  shape_sha256 text NOT NULL
);

CREATE INDEX source_response_unit_retrieved_idx
  ON db1.source_response (response_unit_key, retrieved_at DESC);
CREATE INDEX response_verification_unit_checked_idx
  ON db1.response_verification (response_unit_key, checked_at DESC);

CREATE OR REPLACE FUNCTION db1.enforce_response_unit_provenance()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  approved_method text;
  approved_locator text;
BEGIN
  SELECT request_method, request_locator
    INTO approved_method, approved_locator
    FROM db1.response_unit
   WHERE response_unit_key = NEW.response_unit_key
     AND retired_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'response unit % is not an active registry unit', NEW.response_unit_key
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NEW.request_method <> approved_method OR NEW.request_locator <> approved_locator THEN
    RAISE EXCEPTION 'source response request provenance does not match response unit %', NEW.response_unit_key
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER source_response_provenance_guard
  BEFORE INSERT OR UPDATE ON db1.source_response
  FOR EACH ROW EXECUTE FUNCTION db1.enforce_response_unit_provenance();

CREATE VIEW db1.v_current_response_unit AS
WITH latest_success AS (
  SELECT DISTINCT ON (response_unit_key)
    response_unit_key,
    source_response_id,
    retrieved_at,
    body_sha256,
    body_byte_length
  FROM db1.source_response
  ORDER BY response_unit_key, retrieved_at DESC, source_response_id DESC
), latest_verification AS (
  SELECT DISTINCT ON (response_unit_key)
    response_unit_key,
    response_verification_id,
    checked_at,
    result_kind,
    upstream_status,
    condition_code
  FROM db1.response_verification
  ORDER BY response_unit_key, checked_at DESC, response_verification_id DESC
)
SELECT
  unit.response_unit_key,
  unit.form_key,
  unit.request_locator,
  success.source_response_id AS latest_successful_response_id,
  success.retrieved_at AS latest_successful_retrieved_at,
  success.body_sha256 AS latest_successful_sha256,
  success.body_byte_length AS latest_successful_byte_length,
  verification.response_verification_id AS latest_verification_id,
  verification.checked_at AS latest_checked_at,
  verification.result_kind AS latest_condition_kind,
  verification.upstream_status AS latest_upstream_status,
  verification.condition_code AS latest_condition_code
FROM db1.response_unit AS unit
LEFT JOIN latest_success AS success USING (response_unit_key)
LEFT JOIN latest_verification AS verification USING (response_unit_key);

REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA db1 FROM PUBLIC;

RESET ROLE;
GRANT CONNECT ON DATABASE cld_gb_sct_db1 TO cld_gb_sct_db1_a2_worker;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_db1_a2_worker;
GRANT SELECT ON ALL TABLES IN SCHEMA db1 TO cld_gb_sct_db1_a2_worker;
GRANT INSERT ON db1.capture_run, db1.source_response, db1.response_verification, db1.schema_observation TO cld_gb_sct_db1_a2_worker;
GRANT UPDATE (finished_at, result_status) ON db1.capture_run TO cld_gb_sct_db1_a2_worker;
GRANT EXECUTE ON FUNCTION db1.json_shape(jsonb), db1.enforce_response_unit_provenance() TO cld_gb_sct_db1_a2_worker;
