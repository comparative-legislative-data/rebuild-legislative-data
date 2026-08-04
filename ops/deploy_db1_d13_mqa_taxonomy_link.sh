#!/usr/bin/env bash
set -euo pipefail

# D13 is the established contained two-route batch pattern.  This deployment
# rewrites the D11 batch mechanics only for the approved D13 source contract.
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d13-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
sed \
  -e '/  gb-sct.members.collection/,/  gb-sct.member-government-roles.collection/c\
  gb-sct.mqa-event-types.collection\
  gb-sct.mqa-event-links.collection' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13; do/' \
  -e 's/for path in members member-constituency-statuses member-region-statuses member-parties member-party-roles member-government-roles; do/for path in mqa-event-types mqa-event-links; do/' \
  -e 's/\[\[ "\$release_count" == "6" \]\]/[[ "$release_count" == "2" ]]/' \
  -e 's/d11/d13/g' \
  -e 's/D11/D13/g' \
  -e 's/member_context/mqa_taxonomy_link/g' \
  -e 's/member-context/mqa-taxonomy-link/g' \
  -e 's/Member-context/MQA taxonomy\/link/g' \
  -e 's/Member context/MQA taxonomy\/link/g' \
  -e 's/KEEP_ELEVEN/d11/g' \
  "$template_root/source/ops/deploy_db1_d11_member_context.sh" | bash -s -- --from-clone
