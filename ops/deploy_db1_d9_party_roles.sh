#!/usr/bin/env bash
set -euo pipefail

# D9 has the same contained deployment mechanics as D8. The substitutions are
# limited to the independently approved route, role, release, timer, and labels.
sed \
  -e 's/d8/d9/g' \
  -e 's/D8/D9/g' \
  -e 's/committee-roles/party-roles/g' \
  -e 's/committee_roles/party_roles/g' \
  -e 's/Committee roles/Party roles/g' \
  -e 's/COMMITTEE_ROLES/PARTY_ROLES/g' \
  -e 's#committeeroles#partyroles#g' \
  "$(dirname "$0")/deploy_db1_d8_committee_roles.sh" | bash
