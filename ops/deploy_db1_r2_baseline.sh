#!/usr/bin/env bash
set -euo pipefail

# DEC-0114 R2 only: install and start one generic 117-unit baseline worker.
# It does not alter the API/web services, create a listener, or install a timer.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-r2.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/deploy_db1_r2_baseline.sh" --from-clone
fi

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
secret_file=/etc/cld-gb-sct/secrets/db1-r1-proof.env
unit=cld-gb-sct-db1-baseline.service
source_root="$(cd "$(dirname "$0")/.." && pwd)"

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f "$secret_file"
test -d "$project_root/raw/db1"
[[ ! -e "/etc/systemd/system/$unit" ]]
observations_before="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc 'select count(*) from db1_observation')"
[[ "$observations_before" == "0" ]]
available_bytes="$(df -B1 --output=avail "$project_root/raw/db1" | tail -n 1 | tr -d ' ')"
[[ "$available_bytes" -ge 17179869184 ]]

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
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-baseline.service.template" > "/etc/systemd/system/$unit"
systemctl daemon-reload
systemctl start --no-block "$unit"
printf 'DEC-0114 R2 baseline queued: %s (available raw storage: %s bytes)\n' "$release_id" "$available_bytes"
