-- DB1 A4 source-free lossless-object stress proof.
-- This disposable proof schema contains no Scottish Parliament URL or data.
-- It leaves a compact proof result only; synthetic payload rows are removed.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET ROLE cld_gb_sct_db1_a2_owner;

CREATE SCHEMA IF NOT EXISTS db1_a4_proof AUTHORIZATION cld_gb_sct_db1_a2_owner;

CREATE TABLE IF NOT EXISTS db1_a4_proof.proof_run (
  proof_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_revision text NOT NULL,
  configuration_revision text NOT NULL,
  target_byte_length bigint NOT NULL CHECK (target_byte_length >= 0),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  result_status text NOT NULL DEFAULT 'RUNNING' CHECK (result_status IN ('RUNNING', 'PASS', 'FAIL')),
  summary_jsonb jsonb,
  CHECK ((result_status = 'RUNNING') = (finished_at IS NULL))
);

CREATE TABLE IF NOT EXISTS db1_a4_proof.source_response (
  source_response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_run_id uuid NOT NULL REFERENCES db1_a4_proof.proof_run(proof_run_id),
  content_type text NOT NULL CHECK (content_type = 'application/json'),
  raw_body bytea NOT NULL,
  body_byte_length bigint NOT NULL CHECK (body_byte_length = octet_length(raw_body)),
  body_sha256 text GENERATED ALWAYS AS (encode(digest(raw_body, 'sha256'), 'hex')) STORED
);

CREATE TABLE IF NOT EXISTS db1_a4_proof.response_object (
  response_object_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_response_id uuid NOT NULL REFERENCES db1_a4_proof.source_response(source_response_id) ON DELETE CASCADE,
  source_position integer NOT NULL CHECK (source_position >= 0),
  source_object_sha256 text NOT NULL CHECK (source_object_sha256 ~ '^[0-9a-f]{64}$'),
  object_jsonb jsonb NOT NULL CHECK (jsonb_typeof(object_jsonb) = 'object'),
  object_jsonb_sha256 text GENERATED ALWAYS AS (encode(digest(object_jsonb::text, 'sha256'), 'hex')) STORED,
  UNIQUE (source_response_id, source_position)
);

CREATE INDEX IF NOT EXISTS response_object_response_position_idx
  ON db1_a4_proof.response_object (source_response_id, source_position);

REVOKE ALL ON SCHEMA db1_a4_proof FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1_a4_proof FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA db1_a4_proof FROM PUBLIC;

RESET ROLE;

GRANT USAGE ON SCHEMA db1_a4_proof TO cld_gb_sct_db1_a2_worker;
GRANT SELECT, INSERT, UPDATE ON db1_a4_proof.proof_run TO cld_gb_sct_db1_a2_worker;
GRANT SELECT, INSERT, DELETE ON db1_a4_proof.source_response TO cld_gb_sct_db1_a2_worker;
GRANT SELECT, INSERT ON db1_a4_proof.response_object TO cld_gb_sct_db1_a2_worker;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA db1_a4_proof TO cld_gb_sct_db1_a2_worker;
