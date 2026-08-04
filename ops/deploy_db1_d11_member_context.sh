#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  outer_stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-d11-source.XXXXXX)"
  trap 'rm -rf "$outer_stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$outer_stage/source"
  exec "$outer_stage/source/ops/deploy_db1_d11_member_context.sh" --from-clone
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
source_root="$(cd "$(dirname "$0")/.." && pwd)"
staging="$(dirname "$source_root")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
d11_unit=/etc/systemd/system/cld-gb-sct-db1-d11.service
d11_timer=/etc/systemd/system/cld-gb-sct-db1-d11.timer
d11_env=/etc/cld-gb-sct/secrets/db1-d11.env
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"
routes=(
  gb-sct.members.collection
  gb-sct.member-constituency-statuses.collection
  gb-sct.member-region-statuses.collection
  gb-sct.member-parties.collection
  gb-sct.member-party-roles.collection
  gb-sct.member-government-roles.collection
)

cleanup() { rm -rf "$staging"; }
rollback_before_source() {
  systemctl disable --now cld-gb-sct-db1-d11.timer 2>/dev/null || true
  systemctl stop cld-gb-sct-db1-d11.service 2>/dev/null || true
  rm -f "$d11_unit" "$d11_timer" "$d11_env"
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service || true
  systemctl restart cld-gb-sct-web.service || true
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
source_started=0
on_error() { [[ "$source_started" -eq 0 ]] && rollback_before_source; cleanup; }
trap on_error ERR

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
for unit in postgresql@16-main.service postgresql@16-bills.service postgresql@16-cld_gb_sct.service cld-gb-sct-api.service cld-gb-sct-web.service; do systemctl is-active --quiet "$unit"; done
for timer in d4a d4c d5 d6 d7 d8 d9 d10; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
test -x "$runtime/node"; test -f /etc/cld-gb-sct/secrets/access-api.env; test -f "$api_unit"; test -f "$web_unit"
[[ ! -e "$d11_unit" && ! -e "$d11_timer" && ! -e "$d11_env" ]]
cp "$api_unit" "$api_backup"; cp "$web_unit" "$web_backup"

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
chown -R root:cld-gb-sct "$release_path"; chmod -R g+rX,o-rwx "$release_path"

migrate_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
ALTER ROLE cld_gb_sct_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${migrate_password}';
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
SQL
export CLD_DB1_DATABASE_URL="postgresql://cld_gb_sct_migrate:${migrate_password}@127.0.0.1:5434/${database}"
export CLD_DB1_RAW_ROOT="$project_root/raw/db1"
export CLD_DB1_MIGRATION_ROLE=cld_gb_sct_migrate
"$runtime/node" "$release_path/scripts/migrate_db1_d11_member_context.mjs"
unset CLD_DB1_DATABASE_URL CLD_DB1_RAW_ROOT CLD_DB1_MIGRATION_ROLE

d11_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_d11_runner') THEN CREATE ROLE cld_gb_sct_d11_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT; END IF; END \$\$;
ALTER ROLE cld_gb_sct_d11_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${d11_password}';
GRANT CONNECT ON DATABASE cld_gb_sct_db1 TO cld_gb_sct_d11_runner;
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_d11_runner;
GRANT SELECT ON db1.source_routes TO cld_gb_sct_d11_runner;
GRANT SELECT, INSERT, UPDATE ON db1.capture_runs, db1.raw_objects, db1.manifest_entries, db1.reconciliation_cycles, db1.reconciliation_observations, db1.projection_builds, db1.projection_records, db1.projection_rejections, db1.member_context_releases TO cld_gb_sct_d11_runner;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_db1_reader;
GRANT SELECT ON db1.member_context_releases, db1.reconciliation_observations TO cld_gb_sct_db1_reader;
SQL
writer_proof="$(PGPASSWORD="$d11_password" psql -h 127.0.0.1 -p 5434 -U cld_gb_sct_d11_runner -d "$database" -Atqc "select has_table_privilege(current_user, 'db1.member_context_releases', 'INSERT') and has_table_privilege(current_user, 'db1.capture_runs', 'INSERT,UPDATE')")"
[[ "$writer_proof" == "t" ]]
install -d -o root -g cld-gb-sct -m 0750 /etc/cld-gb-sct/secrets
umask 027
printf 'CLD_DB1_DATABASE_URL=postgresql://cld_gb_sct_d11_runner:%s@127.0.0.1:5434/%s\nCLD_DB1_RAW_ROOT=%s\n' "$d11_password" "$database" "$project_root/raw/db1" > "$d11_env"
chown root:cld-gb-sct "$d11_env"; chmod 0640 "$d11_env"
sed -e "s#releases/RELEASE_ID#releases/${release_id}#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-d11.service.template" > "$d11_unit"
cp "$source_root/ops/systemd/cld-gb-sct-db1-d11.timer.template" "$d11_timer"
systemctl daemon-reload

source_started=1
systemctl start cld-gb-sct-db1-d11.service
[[ "$(systemctl show -p Result --value cld-gb-sct-db1-d11.service)" == "success" ]]
for route in "${routes[@]}"; do
  initial="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.reconciliation_observations where source_route_id = '${route}' and state = 'INITIAL'")"
  [[ "$initial" == "1" ]]
done
release_count="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.member_context_releases where integrity_status = 'PASS'")"
[[ "$release_count" == "6" ]]
reader_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_table_privilege('cld_gb_sct_db1_reader', 'db1.member_context_releases', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.raw_objects', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.projection_records', 'INSERT')")"
[[ "$reader_proof" == "t" ]]

sed -e "s#releases/RELEASE_ID/#releases/${release_id}/#g" -e "s#=RELEASE_ID#=${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service; systemctl restart cld-gb-sct-web.service
for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
for path in members member-constituency-statuses member-region-statuses member-parties member-party-roles member-government-roles; do curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/${path}/d11-v1" | grep -qx '403'; done
systemctl start cld-gb-sct-db1-d11.service
[[ "$(systemctl show -p Result --value cld-gb-sct-db1-d11.service)" == "success" ]]
for route in "${routes[@]}"; do
  unchanged="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.reconciliation_observations where source_route_id = '${route}' and state = 'UNCHANGED'")"
  [[ "$unchanged" == "1" ]]
done
systemctl enable --now cld-gb-sct-db1-d11.timer
for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
cleanup
trap - ERR
printf 'D11 Member-context deployment passed for %s\n' "$commit"
