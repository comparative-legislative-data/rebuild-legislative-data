#!/usr/bin/env bash
# Creates only the approved A2 synthetic-proof database and least-privilege roles.
# It never calls an external service and never writes a raw response payload to disk.
set -Eeuo pipefail

socket_dir="/run/postgresql-cld-gb-sct"
port="5434"
database="cld_gb_sct_db1"
owner_role="cld_gb_sct_db1_a2_owner"
worker_role="cld_gb_sct_db1_a2_worker"
secret_file="/etc/cld-gb-sct/secrets/db1-a2.env"

psql_admin=(sudo -n -u postgres psql -X -v ON_ERROR_STOP=1 -h "$socket_dir" -p "$port" -d postgres)

for name in "$database" "$owner_role" "$worker_role"; do
  if "${psql_admin[@]}" -Atqc "select 1 from pg_database where datname = '$name' union all select 1 from pg_roles where rolname = '$name'" | grep -qx 1; then
    echo "A2 target already exists: $name" >&2
    exit 1
  fi
done

"${psql_admin[@]}" -c "create role $owner_role nologin nosuperuser nocreatedb nocreaterole noreplication;"
"${psql_admin[@]}" -c "create role $worker_role login nosuperuser nocreatedb nocreaterole noreplication noinherit;"
sudo -n -u postgres createdb -h "$socket_dir" -p "$port" -O "$owner_role" "$database"

worker_password="$(openssl rand -hex 32)"
printf "alter role %s password '%s';\n" "$worker_role" "$worker_password" | "${psql_admin[@]}"
"${psql_admin[@]}" -c "revoke all on database $database from public;"

printf 'DB1_A2_DATABASE_URL=postgresql://%s:%s@127.0.0.1:%s/%s\nDB1_A2_REQUIRE_FROM=%s\n' \
  "$worker_role" "$worker_password" "$port" "$database" \
  "/srv/cld-gb-sct/releases/9fba2c0e71c6c413e2f9fbdeaad74c6f1898be53-d75f5b5e09f9/package.json" \
  | sudo -n install -o root -g cld-gb-sct -m 0640 /dev/stdin "$secret_file"

sudo -n install -d -o root -g cld-gb-sct -m 0750 /srv/cld-gb-sct/db1/a2
sudo -n install -o root -g cld-gb-sct -m 0640 /tmp/001_foundation.sql /srv/cld-gb-sct/db1/a2/001_foundation.sql
sudo -n install -o root -g cld-gb-sct -m 0750 /tmp/db1_a2_synthetic_proof.mjs /srv/cld-gb-sct/db1/a2/db1_a2_synthetic_proof.mjs

sudo -n -u postgres psql -X -v ON_ERROR_STOP=1 -h "$socket_dir" -p "$port" -d "$database" -f /srv/cld-gb-sct/db1/a2/001_foundation.sql

echo "A2 isolated database and roles created."
