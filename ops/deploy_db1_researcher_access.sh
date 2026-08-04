#!/usr/bin/env bash
set -euo pipefail

# Deploys the approved private DB1 access package only. It does not request a
# Scottish Parliament source, run a reconciliation job, or change any timer.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  outer_stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-access-source.XXXXXX)"
  trap 'rm -rf "$outer_stage"' EXIT
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$outer_stage/source"
  exec bash "$outer_stage/source/ops/deploy_db1_researcher_access.sh" --from-clone
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
source_root="$(cd "$(dirname "$0")/.." && pwd)"
staging="$(dirname "$source_root")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1

cleanup() { rm -rf "$staging"; }
rollback() {
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  systemctl daemon-reload
  systemctl restart cld-gb-sct-api.service cld-gb-sct-web.service || true
  [[ -n "$release_path" && -d "$release_path" ]] && rm -rf "$release_path"
}
trap 'rollback; cleanup' ERR

[[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
for unit in postgresql@16-main.service postgresql@16-bills.service postgresql@16-cld_gb_sct.service cld-gb-sct-api.service cld-gb-sct-web.service; do systemctl is-active --quiet "$unit"; done
for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18 d19; do systemctl is-active --quiet "cld-gb-sct-db1-${timer}.timer"; done
test -x "$runtime/node"
test -f /etc/cld-gb-sct/secrets/access-api.env
test -f /etc/cld-gb-sct/secrets/db1-d19.env
cp "$api_unit" "$api_backup"
cp "$web_unit" "$web_backup"

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

# The profile table holds only derived structural metadata. The DB1 reader may
# read it; the D19 runner may build it. Neither role gains raw-object access.
sudo -n -u postgres psql -v ON_ERROR_STOP=1 -h "$socket_directory" -p 5434 -d "$database" <<'SQL'
begin;
create table if not exists db1.projection_structure_profiles (
  projection_build_id uuid primary key references db1.projection_builds(id),
  observed_structure jsonb not null,
  profiled_at timestamptz not null default now(),
  profile_method text not null check (profile_method = 'DB1_JSON_OBJECT_FIELD_SCAN_V1')
);
insert into db1.schema_migrations (id) values ('023_projection_structure_profiles') on conflict do nothing;
grant select on db1.projection_structure_profiles to cld_gb_sct_db1_reader;
grant select, insert, update on db1.projection_structure_profiles to cld_gb_sct_d17_runner, cld_gb_sct_d18_runner;
commit;
SQL

set -a
source /etc/cld-gb-sct/secrets/db1-d19.env
set +a
PATH="$runtime:$PATH" node "$release_path/scripts/build_db1_projection_structure_profiles.mjs"
profile_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) = (select count(*) from db1.projection_builds where origin_class = 'SOURCE_CAPTURE' and integrity_status = 'PASS') from db1.projection_structure_profiles")"
[[ "$profile_proof" == "t" ]]
reader_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_table_privilege('cld_gb_sct_db1_reader', 'db1.projection_structure_profiles', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_reader', 'db1.raw_objects', 'SELECT')")"
[[ "$reader_proof" == "t" ]]

sed -e "s#releases/RELEASE_ID/#releases/${release_id}/#g" -e "s#CLD_RELEASE_ID=RELEASE_ID#CLD_RELEASE_ID=${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-api.service.template" > "$api_unit"
sed "s#RELEASE_ID#${release_id}#g" "$source_root/ops/systemd/cld-gb-sct-web.service.template" > "$web_unit"
systemctl daemon-reload
systemctl restart cld-gb-sct-api.service
systemctl restart cld-gb-sct-web.service

for attempt in $(seq 1 30); do curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null && break; sleep 1; done
curl -fsS --max-time 5 http://127.0.0.1:3210/healthz >/dev/null
curl -fsS --max-time 5 http://127.0.0.1:3220/ >/dev/null
for path in committee-official-reports-2025 plenary-official-reports-2025; do curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/${path}/d19-v1" | grep -qx '403'; done
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/plenary-official-reports-2026/d20-v1" | grep -qx '403'
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/plenary-official-reports-2026/d20-v1/download.jsonl" | grep -qx '403'
systemctl is-active --quiet cld-gb-sct-db1-d19.timer

cleanup
trap - ERR
printf 'DB1 researcher-access deployment passed for %s without a source request or timer change.\n' "$commit"
