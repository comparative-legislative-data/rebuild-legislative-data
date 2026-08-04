#!/usr/bin/env bash
set -euo pipefail

# D12 follows the proven contained D8 deployment pattern, rewritten only for
# its one fixed Committees collection and independent D12 service boundary.
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d12-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
sed \
  -e 's/for timer in d4a d4c d5 d6 d7; do/for timer in d4a d4c d5 d6 d7 KEEP_EIGHT d9 d10 d11; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8; do/for timer in d4a d4c d5 d6 d7 KEEP_EIGHT d9 d10 d11 d12; do/' \
  -e 's/d8/d12/g' \
  -e 's/D8/D12/g' \
  -e 's/committee-roles/committees/g' \
  -e 's/committee_roles/committees/g' \
  -e 's/Committee roles/Committees/g' \
  -e 's/COMMITTEE_ROLES/COMMITTEES/g' \
  -e 's#committeeroles#committees#g' \
  -e 's/KEEP_EIGHT/d8/g' \
  "$template_root/source/ops/deploy_db1_d8_committee_roles.sh" | bash
