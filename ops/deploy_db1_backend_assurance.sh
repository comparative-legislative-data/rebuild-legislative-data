#!/usr/bin/env bash
# Deploys only DEC-0126 Gate A controls. It does not enable timers or make a
# Scottish Parliament source request; Gate B remains a separate deliberate run.
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This deployment must run as root." >&2
  exit 1
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
staging="$(mktemp -d "$project_root/staging/db1-assurance.XXXXXX")"
migration_copy="$(mktemp /tmp/cld-db1-a6.XXXXXX.sql)"
release_path=""
previous_target=""
current_link="$project_root/db1-worker-current"
worker_secret=/etc/cld-gb-sct/secrets/db1-worker.env
source_secret=/etc/cld-gb-sct/secrets/db1-a5.env

cleanup() {
  rm -f -- "$migration_copy"
  rm -rf -- "$staging"
}
rollback_link() {
  if [[ -n "$previous_target" ]]; then
    ln -sfn "$previous_target" "$current_link"
  elif [[ -L "$current_link" ]]; then
    rm -- "$current_link"
  fi
}
on_error() {
  rollback_link
  cleanup
}
trap on_error ERR

systemctl is-active --quiet postgresql@16-main.service
systemctl is-active --quiet postgresql@16-bills.service
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f "$source_secret"

git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$staging/source"
commit="$(git -C "$staging/source" rev-parse HEAD)"
PATH="$runtime:$PATH" npm ci --ignore-scripts --prefix "$staging/source"
PATH="$runtime:$PATH" node --test "$staging/source/tests/db1-assurance.test.mjs"
node --check "$staging/source/scripts/db1_a6_reconcile.mjs"
node --check "$staging/source/scripts/db1_a6_health_report.mjs"

release_path="$project_root/db1-worker-releases/$commit"
if [[ ! -d "$release_path" ]]; then
  install -d -o root -g cld-gb-sct -m 0750 "$release_path"
  cp -a "$staging/source/." "$release_path/"
  chown -R root:cld-gb-sct "$release_path"
  chmod -R g+rX,o-rwx "$release_path"
fi

# shellcheck disable=SC1090
source "$source_secret"
: "${DB1_A5_DATABASE_URL:?DB1 A5 worker URL is required}"
escape_systemd_value() { printf '%s' "$1" | sed -e 's/[\\$`\"]/\\&/g'; }
umask 0077
printf 'DB1_A6_DATABASE_URL="%s"\n' "$(escape_systemd_value "$DB1_A5_DATABASE_URL")" > "$worker_secret"
chown root:cld-gb-sct "$worker_secret"
chmod 0640 "$worker_secret"
unset DB1_A5_DATABASE_URL DB1_A5_REQUIRE_FROM

migration_ready="$(sudo -n -u postgres psql -X -Atqc "select to_regclass('db1.assurance_run') is not null and to_regclass('db1.response_schema_profile') is not null and to_regclass('db1.schema_drift_event') is not null" -h "$socket_directory" -p 5434 -d "$database")"
if [[ "$migration_ready" != "t" ]]; then
  install -o postgres -g postgres -m 0640 "$release_path/migrations/db1_a6/005_backend_assurance.sql" "$migration_copy"
  sudo -n -u postgres psql -X -v ON_ERROR_STOP=1 -h "$socket_directory" -p 5434 -d "$database" -f "$migration_copy"
fi

if [[ -L "$current_link" ]]; then previous_target="$(readlink -f "$current_link")"; fi
next_link="$staging/db1-worker-current"
ln -s "$release_path" "$next_link"
mv -f "$next_link" "$current_link"

sed "s#RELEASE_ID#$commit#g" "$release_path/ops/systemd/cld-gb-sct-db1-reconcile@.service.template" > /etc/systemd/system/cld-gb-sct-db1-reconcile@.service
install -o root -g root -m 0644 "$release_path/ops/systemd/cld-gb-sct-db1-daily.timer" /etc/systemd/system/cld-gb-sct-db1-daily.timer
install -o root -g root -m 0644 "$release_path/ops/systemd/cld-gb-sct-db1-weekly.timer" /etc/systemd/system/cld-gb-sct-db1-weekly.timer
systemctl daemon-reload

# Gate A: these make no HTTP request. The first proves the worker's safe path;
# the second holds its PostgreSQL lock so the service records a blocked outcome.
systemctl start cld-gb-sct-db1-reconcile@source-free.service
set -a
source "$worker_secret"
set +a
sudo -n -u cld-gb-sct env DB1_A6_REQUIRE_FROM="$current_link/package.json" DB1_A6_DEPLOYED_PACKAGE_REVISION="$commit" DB1_A6_DISK_PATH="$project_root" "$runtime/node" "$current_link/scripts/db1_a6_reconcile.mjs" --cadence hold --hold-lock-ms 5000 > "$staging/hold-lock.json" &
holder_pid=$!
sleep 1
systemctl start cld-gb-sct-db1-reconcile@source-free.service
wait "$holder_pid"
unset DB1_A6_DATABASE_URL DB1_A6_REQUIRE_FROM DB1_A6_DEPLOYED_PACKAGE_REVISION DB1_A6_DISK_PATH

blocked_count="$(sudo -n -u postgres psql -X -Atqc "select count(*) from db1.assurance_run where lock_result='BLOCKED'" -h "$socket_directory" -p 5434 -d "$database")"
[[ "$blocked_count" -ge 1 ]]
systemctl is-active --quiet postgresql@16-main.service
systemctl is-active --quiet postgresql@16-bills.service
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service

cleanup
trap - ERR
printf 'DB1 backend-assurance Gate A passed for %s; timers deliberately remain disabled.\n' "$commit"
