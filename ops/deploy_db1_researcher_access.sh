#!/usr/bin/env bash
set -euo pipefail

# Deploys the approved private DB1 access package only. It does not request a
# Scottish Parliament source, run a reconciliation job, or change any timer.
if [[ "${1:-}" != "--from-clone" ]]; then
  [[ "${EUID}" -eq 0 ]] || { echo "This deployment must run as root." >&2; exit 1; }
  outer_stage="$(mktemp -d /srv/cld-gb-sct/staging/db1-access-source.XXXXXX)"
  git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$outer_stage/source"
  # Do not exec into the staged script.  The caller owns this temporary
  # directory and must remove it only after the child has completed; an exec
  # combined with an EXIT trap can make that lifecycle ambiguous.
  set +e
  bash "$outer_stage/source/ops/deploy_db1_researcher_access.sh" --from-clone
  deploy_status=$?
  rm -rf "$outer_stage"
  exit "$deploy_status"
fi

project_root=/srv/cld-gb-sct
runtime="$project_root/runtime/node-v24.18.1/bin"
source_root="$(cd "$(dirname "$0")/.." && pwd)"
staging="$(dirname "$source_root")"
release_path=""
api_unit=/etc/systemd/system/cld-gb-sct-api.service
web_unit=/etc/systemd/system/cld-gb-sct-web.service
access_env=/etc/cld-gb-sct/secrets/access-api.env
api_backup="$staging/cld-gb-sct-api.service.before"
web_backup="$staging/cld-gb-sct-web.service.before"
access_env_backup="$staging/access-api.env.before"
socket_directory=/run/postgresql-cld-gb-sct
database=cld_gb_sct_db1

cleanup() { rm -rf "$staging"; }
rollback() {
  [[ -f "$api_backup" ]] && cp "$api_backup" "$api_unit"
  [[ -f "$web_backup" ]] && cp "$web_backup" "$web_unit"
  [[ -f "$access_env_backup" ]] && cp "$access_env_backup" "$access_env"
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
cp "$access_env" "$access_env_backup"

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
test -d "$release_path/apps/api"
test -d "$release_path/apps/web"
test -f "$release_path/apps/api/dist/server.js"
test -f "$release_path/apps/web/dist/server/server.js"

# The profile table holds only derived structural metadata. The DB1 reader is
# granted read-only access to the manifest lineage needed by the approved
# researcher interface. Raw response bytes remain filesystem objects and are
# never readable through PostgreSQL.
sudo -n -u postgres psql -v ON_ERROR_STOP=1 -h "$socket_directory" -p 5434 -d "$database" <<'SQL'
begin;
create table if not exists db1.projection_structure_profiles (
  projection_build_id uuid primary key references db1.projection_builds(id),
  observed_structure jsonb not null,
  profiled_at timestamptz not null default now(),
  profile_method text not null check (profile_method = 'DB1_JSON_OBJECT_FIELD_SCAN_V1')
);
insert into db1.schema_migrations (id) values ('023_projection_structure_profiles') on conflict do nothing;
do $$ begin if not exists (select 1 from pg_roles where rolname = 'cld_gb_sct_db1_access_reader') then create role cld_gb_sct_db1_access_reader login nosuperuser nocreatedb nocreaterole noinherit; end if; end $$;
grant usage on schema db1 to cld_gb_sct_db1_access_reader;
grant select on db1.projection_structure_profiles to cld_gb_sct_db1_access_reader;
grant select, insert, update on db1.projection_structure_profiles to cld_gb_sct_d17_runner, cld_gb_sct_d18_runner;
grant select on db1.source_routes, db1.capture_runs, db1.manifest_entries, db1.raw_objects, db1.projection_builds, db1.projection_records, db1.reconciliation_observations, db1.catalogue_releases, db1.institutional_catalogue_releases, db1.formal_stages_releases, db1.bills_collection_releases, db1.government_roles_releases, db1.committee_roles_releases, db1.party_roles_releases, db1.parties_releases, db1.member_context_releases, db1.committees_releases, db1.mqa_taxonomy_link_releases, db1.mqa_event_subtypes_releases, db1.mqa_consideration_releases, db1.mqa_programme_releases, db1.mqa_annual_window_releases, db1.official_reports_releases to cld_gb_sct_db1_access_reader;
commit;
SQL

set -a
source /etc/cld-gb-sct/secrets/db1-d19.env
set +a
PATH="$runtime:$PATH" node "$release_path/scripts/build_db1_projection_structure_profiles.mjs"
profile_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select count(*) = (select count(*) from db1.projection_builds where origin_class = 'SOURCE_CAPTURE' and integrity_status = 'PASS') from db1.projection_structure_profiles")"
[[ "$profile_proof" == "t" ]]
reader_proof="$(sudo -n -u postgres psql -h "$socket_directory" -p 5434 -d "$database" -Atqc "select has_table_privilege('cld_gb_sct_db1_access_reader', 'db1.projection_structure_profiles', 'SELECT') and has_table_privilege('cld_gb_sct_db1_access_reader', 'db1.raw_objects', 'SELECT') and not has_table_privilege('cld_gb_sct_db1_access_reader', 'db1.raw_objects', 'INSERT,UPDATE,DELETE') and not has_table_privilege('cld_gb_sct_db1_access_reader', 'db1.projection_records', 'INSERT,UPDATE,DELETE')")"
[[ "$reader_proof" == "t" ]]

# Give the API a dedicated read-only database identity and the existing raw
# object root. This changes neither source data nor a capture schedule.
reader_password="$(openssl rand -hex 32)"
sudo -n -u postgres psql -v ON_ERROR_STOP=1 -h "$socket_directory" -p 5434 -d "$database" -v reader_password="$reader_password" <<'SQL'
alter role cld_gb_sct_db1_access_reader login password :'reader_password';
SQL
access_env_next="$staging/access-api.env.next"
grep -vE '^CLD_DB1_(READER_DB|RAW_ROOT)=' "$access_env" > "$access_env_next"
printf 'CLD_DB1_READER_DB=postgresql://cld_gb_sct_db1_access_reader:%s@127.0.0.1:5434/%s\nCLD_DB1_RAW_ROOT=%s\n' "$reader_password" "$database" "$project_root/raw/db1" >> "$access_env_next"
chown root:cld-gb-sct "$access_env_next"
chmod 0640 "$access_env_next"
mv "$access_env_next" "$access_env"
sudo -n -u cld-gb-sct test -x "$project_root/raw/db1"

sed -e "s#releases/RELEASE_ID/#releases/${release_id}/#g" -e '/^Environment=CLD_RELEASE_ID=/d' "$source_root/ops/systemd/cld-gb-sct-api.service.template" | awk -v release_id="$release_id" '
  { print }
  $0 == "Environment=PORT=3210" { print "Environment=CLD_RELEASE_ID=" release_id }
' > "$api_unit"
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
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/research/catalogue" | grep -qx '403'
curl -sS --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:3210/db1/gb-sct/research/releases/gb-sct.committee-official-reports-2006.collection/raw" | grep -qx '403'
systemctl is-active --quiet cld-gb-sct-db1-d19.timer

cleanup
trap - ERR
printf 'DB1 researcher-access deployment passed for %s without a source request or timer change.\n' "$commit"
