#!/usr/bin/env bash
set -euo pipefail

# DEC-0112 deployment only.  It creates a release, additive DB1 metadata and
# four inactive project-owned one-shot units.  It neither starts a source run
# nor changes the API, web, proxy, DB2, existing DB1 timers or other services.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/fullscope-source.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/deploy_db1_full_scope.sh" --from-clone
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
source_root="$(cd "$(dirname "$0")/.." && pwd)"
release_path=""
secret_file=/etc/cld-gb-sct/secrets/db1-fullscope.env
units=(
  cld-gb-sct-db1-fullscope-a.service
  cld-gb-sct-db1-fullscope-b.service
  cld-gb-sct-db1-fullscope-c.service
  cld-gb-sct-db1-fullscope-d.service
)

cleanup_on_error() {
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
trap cleanup_on_error ERR

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -d "$project_root/raw/db1"
if [[ -e "$secret_file" ]]; then
  echo "Existing full-scope secret found; refusing to replace a possibly live deployment." >&2
  exit 1
fi
# A failed pre-source deployment can leave unit files but no credential file.
# Remove only those inactive project-owned remnants before retrying.
for unit in "${units[@]}"; do
  if [[ -e "/etc/systemd/system/$unit" ]]; then
    systemctl is-active --quiet "$unit" && { echo "Existing full-scope unit is active: $unit" >&2; exit 1; }
    rm -f "/etc/systemd/system/$unit"
  fi
done
systemctl daemon-reload
[[ ! -e "$secret_file" ]]

commit="$(git -C "$source_root" rev-parse HEAD)"
PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$source_root"
PATH="$runtime:$PATH" npm run verify --prefix "$source_root"
archive="$source_root/artifacts/b1-local-only/b1-local-only.tar.gz"
archive_digest="$(sha256sum "$archive" | awk '{print $1}')"
release_id="${commit}-${archive_digest:0:12}"
release_path="$project_root/releases/$release_id"
[[ ! -e "$release_path" ]]
install -d -o root -g cld-gb-sct -m 0750 "$release_path"
tar -xzf "$archive" -C "$release_path"
chown -R root:cld-gb-sct "$release_path"
chmod -R g+rX,o-rwx "$release_path"

migration_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
ALTER ROLE cld_gb_sct_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${migration_password}';
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
SQL
export CLD_DB1_DATABASE_URL="postgresql://cld_gb_sct_migrate:${migration_password}@127.0.0.1:5434/${database}"
export CLD_DB1_RAW_ROOT="$project_root/raw/db1"
export CLD_DB1_MIGRATION_ROLE=cld_gb_sct_migrate
export CLD_RELEASE_ID="$release_id"
"$runtime/node" "$release_path/scripts/migrate_db1_full_scope.mjs"
unset CLD_DB1_DATABASE_URL CLD_DB1_RAW_ROOT CLD_DB1_MIGRATION_ROLE

runner_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_fullscope_runner') THEN CREATE ROLE cld_gb_sct_fullscope_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT; END IF; END \$\$;
ALTER ROLE cld_gb_sct_fullscope_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${runner_password}';
GRANT CONNECT ON DATABASE cld_gb_sct_db1 TO cld_gb_sct_fullscope_runner;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_fullscope_runner;
GRANT SELECT, INSERT, UPDATE ON db1.source_routes, db1.source_forms, db1.capture_runs, db1.raw_objects, db1.manifest_entries, db1.reconciliation_cycles, db1.reconciliation_observations, db1.projection_builds, db1.projection_records, db1.projection_rejections, db1.projection_structure_profiles, db1.capture_universes, db1.capture_universe_members, db1.source_conditions, db1.form_update_controls TO cld_gb_sct_fullscope_runner;
SQL
proof="$(PGPASSWORD="$runner_password" psql -h 127.0.0.1 -p 5434 -U cld_gb_sct_fullscope_runner -d "$database" -Atqc "select has_table_privilege(current_user, 'db1.capture_universes', 'INSERT') and has_table_privilege(current_user, 'db1.capture_universes', 'UPDATE') and has_table_privilege(current_user, 'db1.projection_records', 'INSERT')")"
[[ "$proof" == "t" ]]
install -d -o root -g cld-gb-sct -m 0750 /etc/cld-gb-sct/secrets
umask 027
printf 'CLD_DB1_DATABASE_URL=postgresql://cld_gb_sct_fullscope_runner:%s@127.0.0.1:5434/%s\nCLD_DB1_RAW_ROOT=%s\n' "$runner_password" "$database" "$project_root/raw/db1" > "$secret_file"
chown root:cld-gb-sct "$secret_file"
chmod 0640 "$secret_file"
for cohort in a b c d; do
  sed -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" -e "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-fullscope-${cohort}.service.template" > "/etc/systemd/system/cld-gb-sct-db1-fullscope-${cohort}.service"
done
systemctl daemon-reload
for unit in "${units[@]}"; do systemctl cat "$unit" >/dev/null; systemctl is-enabled --quiet "$unit" && exit 1 || true; done
registered="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.source_forms")"
[[ "$registered" == "64" ]]

trap - ERR
printf 'DEC-0112 deployment preflight passed for %s; four inactive full-scope units installed.\n' "$commit"
