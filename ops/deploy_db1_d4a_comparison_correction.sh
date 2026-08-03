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
staging="$(mktemp -d "$project_root/staging/db1-d4a-correction.XXXXXX")"
release_path=""
service_path=/etc/systemd/system/cld-gb-sct-db1-d4a.service
service_backup="$staging/cld-gb-sct-db1-d4a.service.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  if [[ -f "$service_backup" ]]; then cp "$service_backup" "$service_path"; fi
  systemctl daemon-reload
  if [[ -n "$release_path" && -d "$release_path" ]]; then rm -rf "$release_path"; fi
  cleanup
}
trap rollback ERR

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f "$service_path"
test -f /etc/systemd/system/cld-gb-sct-db1-d4a.timer
test -f /etc/cld-gb-sct/secrets/db1-d4a.env
if systemctl is-active --quiet cld-gb-sct-db1-d4a.timer; then
  echo "D4A timer must be disabled before comparison correction deployment." >&2
  exit 1
fi
cp "$service_path" "$service_backup"

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
test -f "$release_path/scripts/run_db1_d4_reference_reconciliation.mjs"

sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$release_path/ops/systemd/cld-gb-sct-db1-d4a.service.template" > "$service_path"
systemctl daemon-reload
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
nginx -t

cleanup
trap - ERR
printf 'D4A comparison correction deployment passed for %s\n' "$commit"
