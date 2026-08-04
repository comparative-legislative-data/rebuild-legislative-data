#!/usr/bin/env bash
set -euo pipefail

# D10 is sent over SSH stdin, so obtain the checked-in D8 deployment template
# explicitly rather than resolving this script's local path on the VPS.
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d10-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
sed \
  -e 's/for timer in d4a d4c d5 d6 d7; do/for timer in d4a d4c d5 d6 d7 d8 d9; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/' \
  -e 's/d8/d10/g' \
  -e 's/D8/D10/g' \
  -e 's/committee-roles/parties/g' \
  -e 's/committee_roles/parties/g' \
  -e 's/Committee roles/Parties/g' \
  -e 's/COMMITTEE_ROLES/PARTIES/g' \
  -e 's#committeeroles#parties#g' \
  -e 's/for timer in d4a d4c d5 d6 d7 d10 d9; do/for timer in d4a d4c d5 d6 d7 d8 d9; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d10 d9 d10; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/' \
  "$template_root/source/ops/deploy_db1_d8_committee_roles.sh" | bash
