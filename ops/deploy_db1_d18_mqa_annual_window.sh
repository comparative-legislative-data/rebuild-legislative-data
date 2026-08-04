#!/usr/bin/env bash
set -euo pipefail

# D18 deployment is deliberately separate from D18 reconciliation.  It updates
# the isolated CLD application and the existing weekly timer, but never starts
# the historical source-capture service itself.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  outer_stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-d18-source.XXXXXX)"
  trap 'rm -rf "$outer_stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$outer_stage/source"
  exec "$outer_stage/source/ops/deploy_db1_d18_mqa_annual_window.sh" --from-clone
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
d18_unit=/etc/systemd/system/cld-gb-sct-db1-d18.service
d18_timer=/etc/systemd/system/cld-gb-sct-db1-d18.timer
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"
d18_unit_backup="$staging/cld-gb-sct-db1-d18.service.before"
d18_timer_backup="$staging/cld-gb-sct-db1-d18.timer.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  [[ -f "$d18_unit_backup" ]] && cp "$d18_unit_backup" "$d18_unit"
  [[ -f "$d18_timer_backup" ]] && cp "$d18_timer_backup" "$d18_timer"
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service cld-gb-sct-web.service || true
  systemctl enable --now cld-gb-sct-db1-d18.timer || true
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
on_error() { rollback; cleanup; }
trap on_error ERR

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
for unit in postgresql@16-main.service postgresql@16-bills.service postgresql@16-cld_gb_sct.service cld-gb-sct-api.service cld-gb-sct-web.service; do systemctl is-active --quiet "$unit"; done
for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/access-api.env
test -f /etc/cld-gb-sct/secrets/db1-d18.env
for file in "$api_unit" "$web_unit" "$d18_unit" "$d18_timer"; do test -f "$file"; done
cp "$api_unit" "$api_backup"
cp "$web_unit" "$web_backup"
cp "$d18_unit" "$d18_unit_backup"
cp "$d18_timer" "$d18_timer_backup"

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

sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-d18.service.template" > "$d18_unit"
cp "$source_root/ops/systemd/cld-gb-sct-db1-d18.timer.template" "$d18_timer"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service
systemctl enable --now cld-gb-sct-db1-d18.timer

for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
for path in mqa-questions-2011 votes-on-motions-2025; do curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/${path}/d18-v1" | grep -qx '403'; done
release_count="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.mqa_annual_window_releases where integrity_status = 'PASS' and id like 'gb_sct_%_d18_v1'")"
[[ "$release_count" == "30" ]]
systemctl is-active --quiet cld-gb-sct-db1-d18.timer
systemctl is-enabled --quiet cld-gb-sct-db1-d18.timer

cleanup
trap - ERR
printf 'D18 deployment passed for %s without starting a D18 source reconciliation.\n' "$commit"
