#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This deployment must run as root." >&2
  exit 1
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
commit=main
staging="$(mktemp -d "$project_root/staging/db1-d4b.XXXXXX")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  if [[ -f "$api_backup" ]]; then cp "$api_backup" "$api_unit"; fi
  if [[ -f "$web_backup" ]]; then cp "$web_backup" "$web_unit"; fi
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service || true
  systemctl restart cld-gb-sct-web.service || true
  if [[ -n "$release_path" && -d "$release_path" ]]; then rm -rf "$release_path"; fi
}
on_error() { rollback; cleanup; }
trap on_error ERR

systemctl is-active --quiet postgresql@16-main.service
systemctl is-active --quiet postgresql@16-bills.service
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-db1-d4a.timer
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/access-api.env
test -f "$api_unit"
test -f "$web_unit"
cp "$api_unit" "$api_backup"
cp "$web_unit" "$web_backup"

git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$staging/source"
commit="$(git -C "$staging/source" rev-parse HEAD)"
PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$staging/source"
PATH="$runtime:$PATH" npm run verify --prefix "$staging/source"

archive="$staging/source/artifacts/b1-local-only/b1-local-only.tar.gz"
archive_digest="$(sha256sum "$archive" | awk '{print $1}')"
release_path="$project_root/releases/${commit}-${archive_digest:0:12}"
[[ ! -e "$release_path" ]]
install -d -o root -g cld-gb-sct -m 0750 "$release_path"
tar -xzf "$archive" -C "$release_path"
chown -R root:cld-gb-sct "$release_path"
chmod -R g+rX,o-rwx "$release_path"

migrate_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
ALTER ROLE cld_gb_sct_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${migrate_password}';
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
SQL

export CLD_DB1_DATABASE_URL="postgresql://cld_gb_sct_migrate:${migrate_password}@127.0.0.1:5434/${database}"
export CLD_DB1_RAW_ROOT="$project_root/raw/db1"
export CLD_DB1_MIGRATION_ROLE=cld_gb_sct_migrate
export CLD_RELEASE_ID="${commit}-${archive_digest:0:12}"
"$runtime/node" "$release_path/scripts/migrate_db1_d4b_reference_catalogue.mjs"
"$runtime/node" "$release_path/scripts/run_db1_d4b_reference_catalogue.mjs"
unset CLD_DB1_DATABASE_URL CLD_DB1_RAW_ROOT CLD_DB1_MIGRATION_ROLE CLD_RELEASE_ID

sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
REVOKE ALL ON db1.catalogue_releases, db1.reconciliation_observations FROM PUBLIC;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_db1_reader;
GRANT SELECT ON db1.catalogue_releases, db1.reconciliation_observations TO cld_gb_sct_db1_reader;
SQL

reader_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_table_privilege('cld_gb_sct_db1_reader', 'db1.catalogue_releases', 'SELECT') and has_table_privilege('cld_gb_sct_db1_reader', 'db1.reconciliation_observations', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.raw_objects', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.projection_records', 'INSERT')")"
[[ "$reader_proof" == "t" ]]

sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:3210/db1/gb-sct/reference-cohort/d4a-v1 | grep -qx '403'
systemctl is-active --quiet cld-gb-sct-db1-d4a.timer

cleanup
trap - ERR
printf 'D4B fixed DB1 catalogue deployment passed for %s\n' "$commit"
