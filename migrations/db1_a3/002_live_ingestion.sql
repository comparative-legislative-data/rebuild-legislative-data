-- DB1 A3: one bounded live-ingestion run. Source bodies remain in PostgreSQL.
-- The registry itself is seeded by the reviewed, checked-in worker registry
-- before it is allowed to make a source request.

SET ROLE cld_gb_sct_db1_a2_owner;

ALTER TABLE db1.source_form
  ADD COLUMN IF NOT EXISTS parent_form_key text REFERENCES db1.source_form(form_key),
  ADD COLUMN IF NOT EXISTS limitation_note text;

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'db1.capture_run'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%run_kind%';
  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE db1.capture_run DROP CONSTRAINT %I', constraint_name);
  END IF;
END;
$$;

ALTER TABLE db1.capture_run
  ADD CONSTRAINT capture_run_kind_check CHECK (
    run_kind IN ('A2_SYNTHETIC_PROOF', 'A3_BASELINE', 'MANUAL', 'SCHEDULED')
  );

-- The transient A3 worker seeds the reviewed registry, then writes only run
-- results. These grants are deliberately database-scoped and loopback-only.
GRANT INSERT, UPDATE ON db1.source_form, db1.response_unit TO cld_gb_sct_db1_a2_worker;

RESET ROLE;
