#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "This deployment must run as root." >&2
  exit 1
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
staging="$(mktemp -d "$project_root/staging/web-presentation.XXXXXX")"
release_path=""
web_unit=/etc/systemd/system/cld-gb-sct-web.service
web_backup="$staging/cld-gb-sct-web.service.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  if [[ -f "$web_backup" ]]; then cp "$web_backup" "$web_unit"; fi
  systemctl daemon-reload
  systemctl restart cld-gb-sct-web.service || true
  if [[ -n "$release_path" && -d "$release_path" ]]; then rm -rf "$release_path"; fi
}
on_error() { rollback; cleanup; }
trap on_error ERR

systemctl is-active --quiet postgresql@16-main.service
systemctl is-active --quiet postgresql@16-bills.service
systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-db1-d4a.timer
systemctl is-active --quiet cld-gb-sct-db1-d4c.timer
systemctl is-active --quiet cld-gb-sct-db1-d5.timer
test -x "$runtime/node"
test -f "$web_unit"
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

sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-web.service
for attempt in $(seq 1 30); do
  curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null && break
  sleep 1
done
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-db1-d4a.timer
systemctl is-active --quiet cld-gb-sct-db1-d4c.timer
systemctl is-active --quiet cld-gb-sct-db1-d5.timer

cleanup
trap - ERR
printf 'Web presentation deployment passed for %s\n' "$commit"
