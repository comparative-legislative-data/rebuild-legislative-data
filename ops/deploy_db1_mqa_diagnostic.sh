#!/usr/bin/env bash
set -euo pipefail

# One owner-approved diagnostic run of three named upstream MQA collection URLs.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-mqa-diagnostic.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/deploy_db1_mqa_diagnostic.sh" --from-clone
fi

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
unit=cld-gb-sct-db1-mqa-diagnostic.service
source_root="$(cd "$(dirname "$0")/.." && pwd)"

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/db1-r1-proof.env
test -d "$project_root/raw/db1"
[[ ! -e "/etc/systemd/system/$unit" ]]
prior_conditions="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1_observation where unit_id in ('mqa-events.collection','mqa-questions.collection','mqa-supports.collection') and status='UPSTREAM_AVAILABILITY_MESSAGE'")"
[[ "$prior_conditions" -ge 3 ]]

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
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-mqa-diagnostic.service.template" > "/etc/systemd/system/$unit"
systemctl daemon-reload
systemctl start --no-block "$unit"
printf 'DEC-0114 bounded MQA diagnostic queued: %s\n' "$release_id"
