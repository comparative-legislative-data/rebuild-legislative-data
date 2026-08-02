#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This deployment must run as root." >&2
  exit 1
fi

read -r -d '' initial_superuser_email
read -r -d '' resend_api_key
read -r -d '' access_from_email

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_canonical
commit=main
staging="$(mktemp -d "$project_root/staging/private-beta.XXXXXX")"
release_path=""
nginx_backup="$staging/legislativedata.org.before"
unit_backup="$staging/cld-gb-sct-api.service.before"
web_unit_backup="$staging/cld-gb-sct-web.service.before"

cleanup() {
  rm -rf "$staging"
}

rollback_services() {
  if [[ -f "$unit_backup" ]]; then
    cp "$unit_backup" /etc/systemd/system/cld-gb-sct-api.service
    systemctl daemon-reload
    systemctl restart cld-gb-sct-api.service || true
  fi
  if [[ -f "$web_unit_backup" ]]; then
    cp "$web_unit_backup" /etc/systemd/system/cld-gb-sct-web.service
    systemctl daemon-reload
    systemctl restart cld-gb-sct-web.service || true
  fi
  if [[ -n "$release_path" && -d "$release_path" ]]; then
    rm -rf "$release_path"
  fi
}

rollback_site() {
  if [[ -f "$nginx_backup" ]]; then
    cp "$nginx_backup" /etc/nginx/sites-available/legislativedata.org
    nginx -t && systemctl reload nginx || true
  fi
}

on_error() {
  rollback_site
  rollback_services
  cleanup
}
trap on_error ERR

systemctl is-active --quiet postgresql@16-main.service
systemctl is-active --quiet postgresql@16-bills.service
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
test -x "$runtime/node"
test -f /etc/nginx/sites-available/legislativedata.org
cp /etc/nginx/sites-available/legislativedata.org "$nginx_backup"
cp /etc/systemd/system/cld-gb-sct-api.service "$unit_backup"
cp /etc/systemd/system/cld-gb-sct-web.service "$web_unit_backup"

access_migrate_password="$(openssl rand -hex 32)"
access_runtime_password="$(openssl rand -hex 32)"
access_pepper="$(openssl rand -hex 48)"

systemd_environment_value() {
  printf '%s' "$1" | sed -e 's/[\\$`\"]/\\&/g'
}

sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_access_migrate') THEN
    CREATE ROLE cld_gb_sct_access_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${access_migrate_password}';
  ELSE
    ALTER ROLE cld_gb_sct_access_migrate LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${access_migrate_password}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cld_gb_sct_access_runtime') THEN
    CREATE ROLE cld_gb_sct_access_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${access_runtime_password}';
  ELSE
    ALTER ROLE cld_gb_sct_access_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${access_runtime_password}';
  END IF;
END
\$\$;
REVOKE ALL ON DATABASE ${database} FROM PUBLIC;
GRANT CONNECT ON DATABASE ${database} TO cld_gb_sct_access_migrate, cld_gb_sct_access_runtime;
CREATE SCHEMA IF NOT EXISTS access_control AUTHORIZATION cld_gb_sct_access_migrate;
ALTER SCHEMA access_control OWNER TO cld_gb_sct_access_migrate;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
SQL

sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -v ON_ERROR_STOP=1 <<SQL
REVOKE ALL ON SCHEMA access_control FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA access_control FROM PUBLIC;
GRANT USAGE ON SCHEMA access_control TO cld_gb_sct_access_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA access_control TO cld_gb_sct_access_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE cld_gb_sct_access_migrate IN SCHEMA access_control REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE cld_gb_sct_access_migrate IN SCHEMA access_control GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cld_gb_sct_access_runtime;
SQL

grant_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_schema_privilege('cld_gb_sct_access_runtime', 'access_control', 'USAGE') and not has_schema_privilege('cld_gb_sct_access_runtime', 'public', 'USAGE')")"
[[ "$grant_proof" == "t" ]]

git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$staging/source"
commit="$(git -C "$staging/source" rev-parse HEAD)"
cp "$staging/source/migrations/access_control/001_access_control.sql" "$staging/migration.sql"
PGPASSWORD="$access_migrate_password" psql -h 127.0.0.1 -p 5434 -U cld_gb_sct_access_migrate -d "$database" -v ON_ERROR_STOP=1 -f "$staging/migration.sql"

PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$staging/source"
PATH="$runtime:$PATH" npm run verify --prefix "$staging/source"

archive="$staging/source/artifacts/b1-local-only/b1-local-only.tar.gz"
archive_digest="$(sha256sum "$archive" | awk '{print $1}')"
release_path="$project_root/releases/${commit}-${archive_digest:0:12}"
install -d -o root -g cld-gb-sct -m 0750 "$release_path"
tar -xzf "$archive" -C "$release_path"
chown -R root:cld-gb-sct "$release_path"
chmod -R g+rX,o-rwx "$release_path"

install -d -o root -g root -m 0700 /etc/cld-gb-sct/secrets
database_url="postgresql://cld_gb_sct_access_runtime:${access_runtime_password}@127.0.0.1:5434/${database}"
umask 0077
printf 'CLD_ACCESS_DB="%s"\nCLD_ACCESS_PEPPER="%s"\nCLD_RESEND_KEY="%s"\nCLD_ACCESS_FROM="%s"\nCLD_INITIAL_SUPERUSER="%s"\nCLD_PUBLIC_ORIGIN="https://legislativedata.org"\n' \
  "$(systemd_environment_value "$database_url")" \
  "$(systemd_environment_value "$access_pepper")" \
  "$(systemd_environment_value "$resend_api_key")" \
  "$(systemd_environment_value "$access_from_email")" \
  "$(systemd_environment_value "$initial_superuser_email")" > /etc/cld-gb-sct/secrets/access-api.env
chown root:cld-gb-sct /etc/cld-gb-sct/secrets/access-api.env
chmod 0640 /etc/cld-gb-sct/secrets/access-api.env

sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-api.service.template" > /etc/systemd/system/cld-gb-sct-api.service
sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-web.service.template" > /etc/systemd/system/cld-gb-sct-web.service
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service

for attempt in $(seq 1 30); do
  status="$(curl -sS --max-time 5 http://127.0.0.1:3210/auth/status || true)"
  [[ "$status" == *'ACCESS_CONTROL_READY'* ]] && break
  sleep 1
done
[[ "$status" == *'ACCESS_CONTROL_READY'* ]]
for attempt in $(seq 1 30); do
  if curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null; then
    break
  fi
  sleep 1
done
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null

cp "$staging/source/ops/nginx/legislativedata.org.private-beta.conf" /etc/nginx/sites-available/legislativedata.org
nginx -t
systemctl reload nginx
for attempt in $(seq 1 10); do
  nginx_status="$(curl -sS --max-time 5 -H 'Host: legislativedata.org' http://127.0.0.1/api/auth/status || true)"
  [[ "$nginx_status" == *'ACCESS_CONTROL_READY'* ]] && break
  sleep 1
done
[[ "$nginx_status" == *'ACCESS_CONTROL_READY'* ]]

# The local named-site check above is the deployment gate.  The public-domain
# result is recorded separately because it traverses Cloudflare and must not
# undo a known-good, locally verified origin configuration.
public_edge_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 https://legislativedata.org/ || true)"
printf 'public-edge HTTP status after origin cutover: %s\n' "$public_edge_status"

cleanup
trap - ERR
printf 'private-beta origin cutover passed for %s\n' "$commit"
