#!/usr/bin/env bash
set -euo pipefail

# DEC-0114 R3 only: activate two instances of the existing generic worker.
# Daily checks cover fixed/current units; weekly checks cover historic years.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This activation must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-r3-schedule.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/activate_db1_r3_schedule.sh" --from-clone
fi

[[ "${EUID}" -eq 0 ]] || { echo "This activation must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
database=cld_gb_sct_db1
socket_directory=/run/postgresql-cld-gb-sct
daily_timer=cld-gb-sct-db1-reconcile-daily.timer
weekly_timer=cld-gb-sct-db1-reconcile-weekly.timer
source_root="$(cd "$(dirname "$0")/.." && pwd)"

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -f /etc/systemd/system/cld-gb-sct-db1-reconcile@.service
[[ ! -e "/etc/systemd/system/$daily_timer" ]]
[[ ! -e "/etc/systemd/system/$weekly_timer" ]]
daily_units="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1_capture_unit where cadence='daily'")"
weekly_units="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1_capture_unit where cadence='weekly'")"
[[ "$daily_units" == "33" ]]
[[ "$weekly_units" == "84" ]]
latest_full="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1_observation o join db1_capture_run r on r.id=o.run_id where r.mode='reconcile' and r.expected_units=117 and r.finished_at is not null")"
[[ "$latest_full" == "117" ]]

cp "$source_root/ops/systemd/cld-gb-sct-db1-reconcile-daily.timer.template" "/etc/systemd/system/$daily_timer"
cp "$source_root/ops/systemd/cld-gb-sct-db1-reconcile-weekly.timer.template" "/etc/systemd/system/$weekly_timer"
systemctl daemon-reload
systemctl enable --now "$daily_timer" "$weekly_timer"
systemctl is-enabled --quiet "$daily_timer"
systemctl is-enabled --quiet "$weekly_timer"
systemctl is-active --quiet "$daily_timer"
systemctl is-active --quiet "$weekly_timer"
printf 'DEC-0114 R3 schedule active: daily=%s weekly=%s\n' "$daily_units" "$weekly_units"
