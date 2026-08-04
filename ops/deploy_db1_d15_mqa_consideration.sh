#!/usr/bin/env bash
set -euo pipefail
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d15-template.XXXXXX)"
trap 'rm -rf "$template_root"' EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
generated="$template_root/source/ops/.deploy_db1_d15_body.sh"
sed \
  -e '/  gb-sct.members.collection/,/  gb-sct.member-government-roles.collection/c\
  gb-sct.mqa-business-consideration.collection' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15; do/' \
  -e 's/for path in members member-constituency-statuses member-region-statuses member-parties member-party-roles member-government-roles; do/for path in mqa-business-consideration; do/' \
  -e 's/\[\[ "\$release_count" == "6" \]\]/[[ "$release_count" == "1" ]]/' \
  -e 's/d11/d15/g' -e 's/D11/D15/g' \
  -e 's/member_context/mqa_consideration/g' -e 's/member-context/mqa-consideration/g' \
  -e 's/Member-context/MQA consideration/g' -e 's/Member context/MQA consideration/g' \
  -e 's/KEEP_ELEVEN/d11/g' \
  "$template_root/source/ops/deploy_db1_d11_member_context.sh" > "$generated"
chmod 0700 "$generated"
"$generated" --from-clone
