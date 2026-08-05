#!/usr/bin/env bash
set -euo pipefail

# Replaces only the release path used by the already-approved, inactive
# DEC-0112 one-shot units. It preserves their credential file and makes no
# migration, API/web, timer or source-data change.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This installer must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/fullscope-release.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/install_db1_full_scope_runner_release.sh" --from-clone
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
source_root="$(cd "$(dirname "$0")/.." && pwd)"
secret_file=/etc/cld-gb-sct/secrets/db1-fullscope.env
release_path=""
units=(a b c d)

cleanup_on_error() { [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"; }
trap cleanup_on_error ERR

[[ "${EUID}" -eq 0 ]] || { echo "This installer must run as root." >&2; exit 1; }
test -x "$runtime/node"; test -f "$secret_file"
for cohort in "${units[@]}"; do
  systemctl is-active --quiet "cld-gb-sct-db1-fullscope-${cohort}.service" && { echo "Cohort unit is active: ${cohort}" >&2; exit 1; }
done
[[ "$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) from db1.source_forms")" == "64" ]]

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
chown -R root:cld-gb-sct "$release_path"; chmod -R g+rX,o-rwx "$release_path"
for cohort in "${units[@]}"; do
  sed -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" -e "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-fullscope-${cohort}.service.template" > "/etc/systemd/system/cld-gb-sct-db1-fullscope-${cohort}.service"
done
systemctl daemon-reload
for cohort in "${units[@]}"; do systemctl cat "cld-gb-sct-db1-fullscope-${cohort}.service" >/dev/null; done
trap - ERR
printf 'Installed inactive DEC-0112 runner release %s.\n' "$commit"
