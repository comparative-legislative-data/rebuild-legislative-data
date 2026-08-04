#!/usr/bin/env bash
set -euo pipefail
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d14-template.XXXXXX)"
cleanup_template() { rm -rf "$template_root"; }
trap cleanup_template EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
generated="$template_root/source/ops/.deploy_db1_d14_body.sh"
sed \
  -e '/  gb-sct.members.collection/,/  gb-sct.member-government-roles.collection/c\
  gb-sct.mqa-event-subtypes.collection' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14; do/' \
  -e 's/for path in members member-constituency-statuses member-region-statuses member-parties member-party-roles member-government-roles; do/for path in mqa-event-subtypes; do/' \
  -e 's/\[\[ "\$release_count" == "6" \]\]/[[ "$release_count" == "1" ]]/' \
  -e 's/d11/d14/g' -e 's/D11/D14/g' \
  -e 's/member_context/mqa_event_subtypes/g' -e 's/member-context/mqa-event-subtypes/g' \
  -e 's/Member-context/MQA Event subtypes/g' -e 's/Member context/MQA Event subtypes/g' \
  -e 's/KEEP_ELEVEN/d11/g' \
  "$template_root/source/ops/deploy_db1_d11_member_context.sh" > "$generated"
chmod 0700 "$generated"
"$generated" --from-clone
