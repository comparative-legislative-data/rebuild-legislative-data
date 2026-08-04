#!/usr/bin/env bash
set -euo pipefail

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
staging="$(mktemp -d "$project_root/staging/db1-d8.XXXXXX")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
d8_unit=/etc/systemd/system/cld-gb-sct-db1-d8.service
d8_timer=/etc/systemd/system/cld-gb-sct-db1-d8.timer
d8_env=/etc/cld-gb-sct/secrets/db1-d8.env
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"

cleanup() { rm -rf "$staging"; }
rollback_before_source() {
  systemctl disable --now cld-gb-sct-db1-d8.timer 2>/dev/null || true
  systemctl stop cld-gb-sct-db1-d8.service 2>/dev/null || true
  rm -f "$d8_unit" "$d8_timer" "$d8_env"
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

for unit in postgresql@16-main.service postgresql@16-bills.service postgresql@16-cld_gb_sct.service cld-gb-sct-api.service cld-gb-sct-web.service; do systemctl is-active --quiet "$unit"; done
for timer in d4a d4c d5 d6 d7; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
test -x "$runtime/node"; test -f /etc/cld-gb-sct/secrets/access-api.env; test -f "$api_unit"; test -f "$web_unit"
[[ ! -e "$d8_unit" && ! -e "$d8_timer" && ! -e "$d8_env" ]]
cp "$api_unit" "$api_backup"; cp "$web_unit" "$web_backup"

git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$staging/source"
commit="$(git -C "$staging/source" rev-parse HEAD)"
PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$staging/source"
PATH="$runtime:$PATH" npm run verify --prefix "$staging/source"
archive="$staging/source/artifacts/b1-local-only/b1-local-only.tar.gz"
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
"$runtime/node" "$release_path/scripts/migrate_db1_d8_committee_roles.mjs"
unset CLD_DB1_DATABASE_URL CLD_DB1_RAW_ROOT CLD_DB1_MIGRATION_ROLE

d8_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_d8_runner') THEN CREATE ROLE cld_gb_sct_d8_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT; END IF; END \$\$;
ALTER ROLE cld_gb_sct_d8_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${d8_password}';
GRANT CONNECT ON DATABASE cld_gb_sct_db1 TO cld_gb_sct_d8_runner;
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_d8_runner;
GRANT SELECT ON db1.source_routes TO cld_gb_sct_d8_runner;
GRANT SELECT, INSERT, UPDATE ON db1.capture_runs, db1.raw_objects, db1.manifest_entries, db1.reconciliation_cycles, db1.reconciliation_observations, db1.projection_builds, db1.projection_records, db1.projection_rejections, db1.committee_roles_releases TO cld_gb_sct_d8_runner;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_db1_reader;
GRANT SELECT ON db1.committee_roles_releases, db1.reconciliation_observations TO cld_gb_sct_db1_reader;
SQL
d8_writer_proof="$(PGPASSWORD="$d8_password" psql -h 127.0.0.1 -p 5434 -U cld_gb_sct_d8_runner -d "$database" -Atqc "select has_table_privilege(current_user, 'db1.committee_roles_releases', 'INSERT') and has_table_privilege(current_user, 'db1.capture_runs', 'INSERT,UPDATE')")"
[[ "$d8_writer_proof" == "t" ]]
install -d -o root -g cld-gb-sct -m 0750 /etc/cld-gb-sct/secrets
umask 027
printf 'CLD_DB1_DATABASE_URL=postgresql://cld_gb_sct_d8_runner:%s@127.0.0.1:5434/%s\nCLD_DB1_RAW_ROOT=%s\n' "$d8_password" "$database" "$project_root/raw/db1" > "$d8_env"
chown root:cld-gb-sct "$d8_env"; chmod 0640 "$d8_env"
sed -e "s#releases/RELEASE_ID#releases/${release_id}#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" "$staging/source/ops/systemd/cld-gb-sct-db1-d8.service.template" > "$d8_unit"
cp "$staging/source/ops/systemd/cld-gb-sct-db1-d8.timer.template" "$d8_timer"
systemctl daemon-reload
source_started=1
systemctl start cld-gb-sct-db1-d8.service
[[ "$(systemctl show -p Result --value cld-gb-sct-db1-d8.service)" == "success" ]]
reader_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_table_privilege('cld_gb_sct_db1_reader', 'db1.committee_roles_releases', 'SELECT') and has_table_privilege('cld_gb_sct_db1_reader', 'db1.reconciliation_observations', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.raw_objects', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.projection_records', 'INSERT')")"
[[ "$reader_proof" == "t" ]]
d8_initial="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select (select count(*) from db1.reconciliation_observations where source_route_id = 'gb-sct.committee-roles.collection' and state = 'INITIAL') = 1 and (select count(*) from db1.committee_roles_releases where id = 'gb_sct_committee_roles_d8_v1' and integrity_status = 'PASS') = 1")"
[[ "$d8_initial" == "t" ]]

sed -e "s#releases/RELEASE_ID/#releases/${release_id}/#g" -e "s#=RELEASE_ID#=${release_id}#g" "$staging/source/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${release_id}#g" "$staging/source/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service; systemctl restart cld-gb-sct-web.service
for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:3210/db1/gb-sct/committee-roles/d8-v1 | grep -qx '403'
systemctl start cld-gb-sct-db1-d8.service
[[ "$(systemctl show -p Result --value cld-gb-sct-db1-d8.service)" == "success" ]]
d8_repeat="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select (select count(*) from db1.reconciliation_observations where source_route_id = 'gb-sct.committee-roles.collection' and state = 'INITIAL') = 1 and (select count(*) from db1.reconciliation_observations where source_route_id = 'gb-sct.committee-roles.collection' and state = 'UNCHANGED') = 1")"
[[ "$d8_repeat" == "t" ]]
systemctl enable --now cld-gb-sct-db1-d8.timer
for timer in d4a d4c d5 d6 d7 d8; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
cleanup
trap - ERR
printf 'D8 Committee roles deployment passed for %s\n' "$commit"
