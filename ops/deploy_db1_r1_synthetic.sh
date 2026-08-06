#!/usr/bin/env bash
set -euo pipefail

# DEC-0114 R1 only: create an isolated Database mirror database and run one
# source-free storage proof. This script never starts a schedule, changes the
# API/web services, or contacts the Scottish Parliament.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-r1.XXXXXX)"
  trap 'rm -rf "$stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$stage/source"
  exec bash "$stage/source/ops/deploy_db1_r1_synthetic.sh" --from-clone
fi

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1
role=cld_gb_sct_db1_runner
secret_file=/etc/cld-gb-sct/secrets/db1-r1-proof.env
unit=cld-gb-sct-db1-r1-proof.service
source_root="$(cd "$(dirname "$0")/.." && pwd)"
release_path=""

cleanup_on_error() {
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
trap cleanup_on_error ERR

systemctl is-active --quiet postgresql@16-cld_gb_sct.service
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service
test -x "$runtime/node"
[[ ! -e "$secret_file" ]]
[[ ! -e "/etc/systemd/system/$unit" ]]
[[ ! -e "$project_root/raw/db1" ]]
existing_database="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -Atqc "select exists(select 1 from pg_database where datname = '$database')")"
[[ "$existing_database" == "f" ]]

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

password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d postgres -v ON_ERROR_STOP=1 -c "create role $role login nosuperuser nocreatedb nocreaterole noinherit password '$password'"
sudo -n -u postgres createdb -h "$socket_directory" -p 5434 -O "$role" "$database"
install -d -o root -g cld-gb-sct -m 0750 "$project_root/raw/db1"
install -d -o root -g cld-gb-sct -m 0750 /etc/cld-gb-sct/secrets
umask 027
printf 'CLD_DB1_DATABASE_URL=postgresql://%s:%s@127.0.0.1:5434/%s\nCLD_DB1_RAW_ROOT=%s\n' "$role" "$password" "$database" "$project_root/raw/db1" > "$secret_file"
chown root:cld-gb-sct "$secret_file"
chmod 0640 "$secret_file"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-db1-r1-proof.service.template" > "/etc/systemd/system/$unit"
systemctl daemon-reload
systemctl start "$unit"
systemctl is-active --quiet "$unit"

proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select passed and byte_length > 0 and sha256 is not null and raw_path is not null from db1_system_test order by finished_at desc limit 1")"
observations="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc 'select count(*) from db1_observation')"
[[ "$proof" == "t" ]]
[[ "$observations" == "0" ]]
systemctl is-active --quiet cld-gb-sct-api.service
systemctl is-active --quiet cld-gb-sct-web.service

trap - ERR
printf 'DEC-0114 R1 source-free proof passed: %s\n' "$release_id"
