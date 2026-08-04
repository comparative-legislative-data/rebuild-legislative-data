#!/usr/bin/env bash
set -euo pipefail

# This deployment never runs, enables, disables, or otherwise changes D19
# reconciliation scheduling. It preserves the already-approved timer state
# while replacing only the release-linked service and web/API units.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  outer_stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-d19-source.XXXXXX)"
  trap 'rm -rf "$outer_stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$outer_stage/source"
  exec bash "$outer_stage/source/ops/deploy_db1_d19_official_reports.sh" --from-clone
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
source_root="$(cd "$(dirname "$0")/.." && pwd)"
staging="$(dirname "$source_root")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
d19_unit=/etc/systemd/system/cld-gb-sct-db1-d19.service
d19_timer=/etc/systemd/system/cld-gb-sct-db1-d19.timer
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"
d19_unit_backup="$staging/cld-gb-sct-db1-d19.service.before"
d19_timer_backup="$staging/cld-gb-sct-db1-d19.timer.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  [[ -f "$d19_unit_backup" ]] && cp "$d19_unit_backup" "$d19_unit" || rm -f "$d19_unit"
  [[ -f "$d19_timer_backup" ]] && cp "$d19_timer_backup" "$d19_timer" || rm -f "$d19_timer"
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service cld-gb-sct-web.service || true
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
trap 'rollback; cleanup' ERR

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
for unit in postgresql@16-main.service postgresql@16-bills.service postgresql@16-cld_gb_sct.service cld-gb-sct-api.service cld-gb-sct-web.service; do systemctl is-active --quiet "$unit"; done
for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/access-api.env
test -f /etc/cld-gb-sct/secrets/db1-d18.env
cp "$api_unit" "$api_backup"
cp "$web_unit" "$web_backup"
[[ -f "$d19_unit" ]] && cp "$d19_unit" "$d19_unit_backup"
[[ -f "$d19_timer" ]] && cp "$d19_timer" "$d19_timer_backup"

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

install -o root -g cld-gb-sct -m 0640 /etc/cld-gb-sct/secrets/db1-d18.env /etc/cld-gb-sct/secrets/db1-d19.env
sed -e "s#releases/RELEASE_ID/#releases/${release_id}/#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
sed -e "s#releases/RELEASE_ID#releases/${release_id}#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-d19.service.template" > "$d19_unit"
cp "$source_root/ops/systemd/cld-gb-sct-db1-d19.timer.template" "$d19_timer"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service

for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
for path in committee-official-reports-2025 plenary-official-reports-2025; do curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/${path}/d19-v1" | grep -qx '403'; done
systemctl is-enabled --quiet cld-gb-sct-db1-d19.timer
systemctl is-active --quiet cld-gb-sct-db1-d19.timer

cleanup
trap - ERR
printf 'D19 deployment passed for %s without changing D19 reconciliation scheduling.\n' "$commit"
