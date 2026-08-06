#!/usr/bin/env bash
set -euo pipefail

# DEC-0114 R3 only: write one manifest/raw-integrity assurance record.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  refresh="${1:-}"
  [[ -z "$refresh" || "$refresh" == "--refresh" ]] || { echo "Usage: $0 [--refresh]" >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-assurance.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/deploy_db1_assurance.sh" --from-clone "$refresh"
fi

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
secret_file=/etc/cld-gb-sct/secrets/db1-r1-proof.env
unit=cld-gb-sct-db1-assurance.service
source_root="$(cd "$(dirname "$0")/.." && pwd)"
refresh="${2:-}"
[[ -z "$refresh" || "$refresh" == "--refresh" ]] || { echo "Usage: $0 [--refresh]" >&2; exit 1; }

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f "$secret_file"
test -d "$project_root/raw/db1"
if [[ "$refresh" == "--refresh" ]]; then
  test -e "/etc/systemd/system/$unit"
  systemctl stop "$unit"
else
  [[ ! -e "/etc/systemd/system/$unit" ]]
fi
reconciliation_rows="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1_observation o join db1_capture_run r on r.id=o.run_id where r.mode='reconcile' and r.expected_units=117 and r.finished_at is not null")"
[[ "$reconciliation_rows" == "117" ]]

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
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-assurance.service.template" > "/etc/systemd/system/$unit"
systemctl daemon-reload
systemctl reset-failed "$unit"
systemctl start "$unit"
systemctl is-active --quiet "$unit"
printf 'DEC-0114 assurance report passed: %s\n' "$release_id"
