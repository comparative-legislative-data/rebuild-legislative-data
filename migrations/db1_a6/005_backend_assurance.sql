-- DB1 A6 backend-assurance controls. Runs only under DEC-0126.
-- Additive: it neither alters retained source bytes nor changes the 117-unit registry.

SET ROLE cld_gb_sct_db1_owner;

CREATE TABLE db1.assurance_run (
  capture_run_id uuid PRIMARY KEY REFERENCES db1.capture_run(capture_run_id),
  cadence text NOT NULL CHECK (cadence IN ('DAILY', 'WEEKLY', 'ALL', 'SOURCE_FREE')),
  lock_result text NOT NULL CHECK (lock_result IN ('ACQUIRED', 'BLOCKED')),
  registry_sha256 text NOT NULL CHECK (registry_sha256 ~ '^[0-9a-f]{64}$'),
  due_set_sha256 text NOT NULL CHECK (due_set_sha256 ~ '^[0-9a-f]{64}$'),
  due_units integer NOT NULL CHECK (due_units >= 0),
  finished_at timestamptz,
  unchanged_units integer NOT NULL DEFAULT 0 CHECK (unchanged_units >= 0),
  changed_units integer NOT NULL DEFAULT 0 CHECK (changed_units >= 0),
  new_units integer NOT NULL DEFAULT 0 CHECK (new_units >= 0),
  upstream_condition_units integer NOT NULL DEFAULT 0 CHECK (upstream_condition_units >= 0),
  local_failure_units integer NOT NULL DEFAULT 0 CHECK (local_failure_units >= 0),
  schema_drift_units integer NOT NULL DEFAULT 0 CHECK (schema_drift_units >= 0),
  database_size_bytes bigint,
  available_disk_bytes bigint,
  peak_rss_bytes bigint,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE db1.response_schema_profile (
  source_response_id uuid PRIMARY KEY REFERENCES db1.source_response(source_response_id) ON DELETE CASCADE,
  observed_shape text NOT NULL,
  profile_jsonb jsonb NOT NULL,
  profile_sha256 text GENERATED ALWAYS AS (encode(digest(profile_jsonb::text, 'sha256'), 'hex')) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE db1.schema_drift_event (
  schema_drift_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_run_id uuid NOT NULL REFERENCES db1.capture_run(capture_run_id),
  response_unit_key text NOT NULL REFERENCES db1.response_unit(response_unit_key),
  prior_source_response_id uuid NOT NULL REFERENCES db1.source_response(source_response_id),
  current_source_response_id uuid NOT NULL UNIQUE REFERENCES db1.source_response(source_response_id),
  prior_profile_sha256 text NOT NULL CHECK (prior_profile_sha256 ~ '^[0-9a-f]{64}$'),
  current_profile_sha256 text NOT NULL CHECK (current_profile_sha256 ~ '^[0-9a-f]{64}$'),
  drift_jsonb jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX assurance_run_finished_idx ON db1.assurance_run (finished_at DESC);
CREATE INDEX schema_drift_event_unit_time_idx ON db1.schema_drift_event (response_unit_key, created_at DESC);

-- Profiles are a raw-structure aid, never a DB2 codebook.  This initial
-- backfill describes retained A5 responses without re-reading the source.
INSERT INTO db1.response_schema_profile (source_response_id, observed_shape, profile_jsonb)
SELECT projection.source_response_id,
       projection.observed_shape,
       jsonb_build_object(
         'shape', projection.observed_shape,
         'fields', COALESCE(fields.field_types, '{}'::jsonb)
       )
  FROM db1.projection_run projection
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(json_path, json_types ORDER BY json_path) AS field_types
      FROM (
        SELECT json_path, jsonb_agg(json_type ORDER BY json_type) AS json_types
          FROM db1.field_observation
         WHERE projection_run_id = projection.projection_run_id
         GROUP BY json_path
      ) grouped
  ) fields ON true
ON CONFLICT (source_response_id) DO NOTHING;

CREATE OR REPLACE VIEW db1.v_assurance_unit_state AS
SELECT unit.response_unit_key,
       unit.later_cadence,
       current_state.latest_source_response_id,
       current_state.latest_response_at,
       current_state.latest_body_sha256,
       current_state.latest_body_byte_length,
       current_state.latest_checked_at,
       current_state.latest_result_kind,
       current_state.latest_upstream_status,
       current_state.latest_condition_code
  FROM db1.response_unit unit
  JOIN db1.v_current_response_unit current_state USING (response_unit_key)
 WHERE NOT unit.is_synthetic;

REVOKE ALL ON db1.assurance_run, db1.response_schema_profile, db1.schema_drift_event FROM PUBLIC;
GRANT SELECT ON db1.field_observation, db1.assurance_run, db1.response_schema_profile, db1.schema_drift_event,
  db1.v_assurance_unit_state TO cld_gb_sct_db1_worker;
GRANT INSERT ON db1.assurance_run, db1.response_schema_profile, db1.schema_drift_event TO cld_gb_sct_db1_worker;
GRANT UPDATE (finished_at, unchanged_units, changed_units, new_units, upstream_condition_units,
  local_failure_units, schema_drift_units, database_size_bytes, available_disk_bytes,
  peak_rss_bytes, detail) ON db1.assurance_run TO cld_gb_sct_db1_worker;

RESET ROLE;
