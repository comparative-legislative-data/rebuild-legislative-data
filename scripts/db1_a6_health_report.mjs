import { createRequire } from "node:module";

const require = createRequire(process.env.DB1_A6_REQUIRE_FROM ?? import.meta.url);
const { Client } = require("pg");

if (!process.env.DB1_A6_DATABASE_URL) throw new Error("DB1_A6_DATABASE_URL is required.");

const client = new Client({ connectionString: process.env.DB1_A6_DATABASE_URL, application_name: "cld-db1-a6-health-report" });
try {
  await client.connect();
  const report = await client.query(`with registry as (
    select count(*)::int as response_units,
           count(*) filter (where later_cadence='DAILY')::int as daily_units,
           count(*) filter (where later_cadence='WEEKLY')::int as weekly_units
      from db1.response_unit where not is_synthetic and retired_at is null
  ), forms as (
    select count(*)::int as source_forms from db1.source_form where not is_synthetic
  ), raw_integrity as (
    select count(*)::int as raw_responses,
           count(*) filter (where body_byte_length <> octet_length(raw_body))::int as byte_length_mismatches,
           count(distinct response_unit_key)::int as represented_units
      from db1.source_response response
      join db1.response_unit unit using(response_unit_key)
     where not unit.is_synthetic
  ), linkage as (
    select count(*) filter (where response.source_response_id is null)::int as projection_orphans,
           count(*)::int as projections,
           coalesce(sum(projection.object_count), 0)::bigint as projected_objects
      from db1.projection_run projection
      left join db1.source_response response using(source_response_id)
      left join db1.response_unit unit using(response_unit_key)
     where not coalesce(unit.is_synthetic, false)
  ), profiles as (
    select count(*)::int as schema_profiles
      from db1.response_schema_profile profile
      join db1.source_response response using(source_response_id)
      join db1.response_unit unit using(response_unit_key)
     where not unit.is_synthetic
  ), assurance as (
    select max(finished_at) filter (where cadence='DAILY' and lock_result='ACQUIRED') as latest_daily_run,
           max(finished_at) filter (where cadence='WEEKLY' and lock_result='ACQUIRED') as latest_weekly_run,
           max(finished_at) filter (where cadence='ALL' and lock_result='ACQUIRED') as latest_all_run,
           max(finished_at) as latest_assurance_event,
           count(*) filter (where lock_result='BLOCKED')::int as blocked_runs
      from db1.assurance_run
  ), unit_state as (
    select count(*) filter (where latest_source_response_id is null)::int as units_without_raw_response,
           count(*) filter (where latest_checked_at is null)::int as units_without_verification,
           count(*) filter (where latest_result_kind='UPSTREAM_CONDITION')::int as current_upstream_conditions,
           count(*) filter (where latest_result_kind='LOCAL_FAILURE')::int as current_local_failures
      from db1.v_assurance_unit_state
  ), drift as (
    select count(*) filter (where not unit.is_synthetic)::int as production_schema_drift_events,
           count(*) filter (where unit.is_synthetic)::int as synthetic_schema_drift_test_events
      from db1.schema_drift_event event
      join db1.response_unit unit using(response_unit_key)
  )
  select row_to_json(registry) as registry, row_to_json(forms) as forms,
         row_to_json(raw_integrity) as raw_integrity, row_to_json(linkage) as linkage,
         row_to_json(profiles) as profiles, row_to_json(assurance) as assurance,
         row_to_json(unit_state) as unit_state, row_to_json(drift) as drift,
         pg_database_size(current_database())::bigint as database_size_bytes
    from registry, forms, raw_integrity, linkage, profiles, assurance, unit_state, drift`);
  const latest = await client.query(`select run.capture_run_id, run.cadence, run.lock_result, run.due_units,
      run.finished_at, run.unchanged_units, run.changed_units, run.new_units,
      run.upstream_condition_units, run.local_failure_units, run.schema_drift_units,
      run.database_size_bytes, run.available_disk_bytes, run.peak_rss_bytes, run.detail
    from db1.assurance_run run order by run.finished_at desc nulls last, run.capture_run_id desc limit 1`);
  console.log(JSON.stringify({ status: "OBSERVED", report: report.rows[0], latest_assurance_run: latest.rows[0] ?? null }, null, 2));
} finally {
  await client.end();
}
