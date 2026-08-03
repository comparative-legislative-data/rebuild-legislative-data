#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This deployment must run as root." >&2
  exit 1
fi
if [[ "$#" -ne 0 ]]; then
  echo "usage: $0" >&2
  exit 1
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
raw_root="$project_root/raw/db1"
staging="$(mktemp -d "$project_root/staging/db1-d4a.XXXXXX")"
release_path=""
service_path=/etc/systemd/system/cld-gb-sct-db1-d4a.service
timer_path=/etc/systemd/system/cld-gb-sct-db1-d4a.timer
service_backup="$staging/cld-gb-sct-db1-d4a.service.before"
timer_backup="$staging/cld-gb-sct-db1-d4a.timer.before"
secret_backup="$staging/db1-d4a.env.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  systemctl disable --now cld-gb-sct-db1-d4a.timer 2>/dev/null || true
  if [[ -f "$service_backup" ]]; then cp "$service_backup" "$service_path"; else rm -f "$service_path"; fi
  if [[ -f "$timer_backup" ]]; then cp "$timer_backup" "$timer_path"; else rm -f "$timer_path"; fi
  if [[ -f "$secret_backup" ]]; then cp "$secret_backup" /etc/cld-gb-sct/secrets/db1-d4a.env; else rm -f /etc/cld-gb-sct/secrets/db1-d4a.env; fi
  systemctl daemon-reload
  if [[ -n "$release_path" && -d "$release_path" ]]; then rm -rf "$release_path"; fi
  cleanup
}
trap rollback ERR

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -d "$raw_root"
test -f /etc/cld-gb-sct/secrets/access-api.env
if [[ -e "$service_path" || -e "$timer_path" || -e /etc/cld-gb-sct/secrets/db1-d4a.env ]]; then
  echo "D4A target already exists; stop for an explicit recovery decision." >&2
  exit 1
fi
cp /etc/cld-gb-sct/secrets/db1-d4a.env "$secret_backup" 2>/dev/null || true

git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$staging/source"
commit="$(git -C "$staging/source" rev-parse HEAD)"
PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$staging/source"
PATH="$runtime:$PATH" npm run verify --prefix "$staging/source"

archive="$staging/source/artifacts/b1-local-only/b1-local-only.tar.gz"
archive_digest="$(sha256sum "$archive" | awk '{print $1}')"
release_path="$project_root/releases/${commit}-${archive_digest:0:12}"
install -d -o root -g cld-gb-sct -m 0750 "$release_path"
tar -xzf "$archive" -C "$release_path"
chown -R root:cld-gb-sct "$release_path"
chmod -R g+rX,o-rwx "$release_path"
test -f "$release_path/scripts/migrate_db1_d4_reference_reconciliation.mjs"
test -f "$release_path/scripts/run_db1_d4_reference_reconciliation.mjs"

migrate_password="$(openssl rand -hex 32)"
runner_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_migrate') THEN
    CREATE ROLE cld_gb_sct_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${migrate_password}';
  ELSE
    ALTER ROLE cld_gb_sct_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${migrate_password}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_d4a_runner') THEN
    CREATE ROLE cld_gb_sct_d4a_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${runner_password}';
  ELSE
    ALTER ROLE cld_gb_sct_d4a_runner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${runner_password}';
  END IF;
END
\$\$;
REVOKE ALL ON DATABASE ${database} FROM PUBLIC;
GRANT CONNECT ON DATABASE ${database} TO cld_gb_sct_migrate, cld_gb_sct_d4a_runner;
SQL

umask 0077
migration_env="$staging/migration.env"
printf 'CLD_DB1_DATABASE_URL="postgresql://cld_gb_sct_migrate:%s@127.0.0.1:5434/%s"\nCLD_DB1_RAW_ROOT="%s"\nCLD_DB1_MIGRATION_ROLE="cld_gb_sct_migrate"\n' "$migrate_password" "$database" "$raw_root" > "$migration_env"
set -a
source "$migration_env"
set +a
"$runtime/node" "$release_path/scripts/migrate_db1_d4_reference_reconciliation.mjs"
unset CLD_DB1_DATABASE_URL CLD_DB1_RAW_ROOT CLD_DB1_MIGRATION_ROLE
rm -f "$migration_env"

sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
REVOKE ALL ON SCHEMA db1 FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA db1 FROM PUBLIC;
GRANT USAGE ON SCHEMA db1 TO cld_gb_sct_d4a_runner;
GRANT SELECT, INSERT, UPDATE ON db1.capture_runs, db1.raw_objects, db1.manifest_entries, db1.reconciliation_cycles, db1.reconciliation_observations TO cld_gb_sct_d4a_runner;
GRANT SELECT ON db1.source_routes TO cld_gb_sct_d4a_runner;
SQL

install -d -o root -g root -m 0700 /etc/cld-gb-sct/secrets
umask 0077
printf 'CLD_DB1_DATABASE_URL="postgresql://cld_gb_sct_d4a_runner:%s@127.0.0.1:5434/%s"\nCLD_DB1_RAW_ROOT="%s"\n' "$runner_password" "$database" "$raw_root" > /etc/cld-gb-sct/secrets/db1-d4a.env
chown root:cld-gb-sct /etc/cld-gb-sct/secrets/db1-d4a.env
chmod 0640 /etc/cld-gb-sct/secrets/db1-d4a.env

sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$release_path/ops/systemd/cld-gb-sct-db1-d4a.service.template" > "$service_path"
cp "$release_path/ops/systemd/cld-gb-sct-db1-d4a.timer.template" "$timer_path"
systemctl daemon-reload
systemctl start cld-gb-sct-db1-d4a.service
systemctl show --property=Result --value cld-gb-sct-db1-d4a.service | grep -qx success
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select status from db1.reconciliation_cycles order by started_at desc limit 1" | grep -qx 'SUCCEEDED'
systemctl enable --now cld-gb-sct-db1-d4a.timer
systemctl is-enabled --quiet cld-gb-sct-db1-d4a.timer
systemctl is-active --quiet cld-gb-sct-db1-d4a.timer
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
nginx -t

cleanup
trap - ERR
printf 'D4A reference reconciliation deployment passed for %s\n' "$commit"
