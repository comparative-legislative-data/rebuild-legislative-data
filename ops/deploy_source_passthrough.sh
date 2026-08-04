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
staging="$(mktemp -d "$project_root/staging/source-passthrough.XXXXXX")"
release_path=""
unit_backup="$staging/cld-gb-sct-api.service.before"
web_unit_backup="$staging/cld-gb-sct-web.service.before"

cleanup() {
  rm -rf "$staging"
}

rollback_services() {
  if [[ -f "$unit_backup" ]]; then
    cp "$unit_backup" /etc/systemd/system/cld-gb-sct-api.service
  fi
  if [[ -f "$web_unit_backup" ]]; then
    cp "$web_unit_backup" /etc/systemd/system/cld-gb-sct-web.service
  fi
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service cld-gb-sct-web.service || true
  if [[ -n "$release_path" && -d "$release_path" ]]; then
    rm -rf "$release_path"
  fi
}

on_error() {
  rollback_services
  cleanup
}
trap on_error ERR

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/access-api.env
test -f /etc/systemd/system/cld-gb-sct-api.service
test -f /etc/systemd/system/cld-gb-sct-web.service
cp /etc/systemd/system/cld-gb-sct-api.service "$unit_backup"
cp /etc/systemd/system/cld-gb-sct-web.service "$web_unit_backup"

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

sed -e "s#releases/RELEASE_ID/#releases/${commit}-${archive_digest:0:12}/#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${commit}-${archive_digest:0:12}#g" "$staging/source/ops/systemd/cld-gb-sct-api.service.template" > /etc/systemd/system/cld-gb-sct-api.service
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
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
source_route_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3210/catalogue/gb-sct/bill-types.collection/source || true)"
[[ "$source_route_status" == "403" ]]
nginx -t

public_edge_status="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 https://legislativedata.org/ || true)"
printf 'public-edge HTTP status after project service release: %s\n' "$public_edge_status"

cleanup
trap - ERR
printf 'source pass-through project service release passed for %s\n' "$commit"
