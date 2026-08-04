#!/usr/bin/env bash
set -euo pipefail

# D10 is sent over SSH stdin, so obtain the checked-in D9 deployment template
# explicitly rather than resolving this script's local path on the VPS.
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d10-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
sed \
  -e 's/d9/d10/g' \
  -e 's/D9/D10/g' \
  -e 's/party-roles/parties/g' \
  -e 's/party_roles/parties/g' \
  -e 's/Party roles/Parties/g' \
  -e 's/PARTY_ROLES/PARTIES/g' \
  -e 's#partyroles#parties#g' \
  "$template_root/source/ops/deploy_db1_d9_party_roles.sh" | bash
