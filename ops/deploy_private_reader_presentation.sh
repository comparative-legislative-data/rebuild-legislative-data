#!/usr/bin/env bash
set -euo pipefail

# Deploys a private reader/API plus web presentation release. It does not
# request a source, run capture/reconciliation, alter a database, rotate a
# secret, modify a timer, or touch Nginx or unrelated services.
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
staging="$(mktemp -d "$project_root/staging/private-reader-presentation.XXXXXX")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"

cleanup() { rm -rf "$staging"; }
rollback() {
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service cld-gb-sct-web.service || true
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
on_error() { rollback; cleanup; }
trap on_error ERR

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
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
test -f "$release_path/apps/api/dist/server.js"
test -f "$release_path/apps/web/dist/server/server.js"

sed -e "s#releases/RELEASE_ID/#releases/${commit}-${archive_digest:0:12}/#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service

for attempt in $(seq 1 30); do
  curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break
  sleep 1
done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
catalogue_status="$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:3210/db1/gb-sct/research/catalogue)"
[[ "$catalogue_status" == "403" ]]

cleanup
trap - ERR
printf 'Private reader/API and web presentation deployment passed for %s\n' "$commit"
