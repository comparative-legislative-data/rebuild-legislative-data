#!/usr/bin/env bash
set -euo pipefail

# D9 has the same contained deployment mechanics as D8. Obtain the checked-in
# template explicitly because this script is intentionally sent over SSH stdin.
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d9-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
sed \
  -e 's/d8/d9/g' \
  -e 's/D8/D9/g' \
  -e 's/committee-roles/party-roles/g' \
  -e 's/committee_roles/party_roles/g' \
  -e 's/Committee roles/Party roles/g' \
  -e 's/COMMITTEE_ROLES/PARTY_ROLES/g' \
  -e 's#committeeroles#partyroles#g' \
  "$template_root/source/ops/deploy_db1_d8_committee_roles.sh" | bash
