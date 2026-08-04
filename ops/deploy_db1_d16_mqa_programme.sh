#!/usr/bin/env bash
set -euo pipefail
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d16-template.XXXXXX)"
trap 'rm -rf "$template_root"' EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
generated="$template_root/source/ops/.deploy_db1_d16_body.sh"
sed \
  -e 's/d15/d16/g' -e 's/D15/D16/g' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d16; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15 d16; do/' \
  -e 's/mqa_consideration/mqa_programme/g' -e 's/mqa-consideration/mqa-programme/g' \
  -e 's/MQA consideration/MQA programme/g' -e 's/MQA Consideration/MQA Programme/g' \
  -e 's/consideration/programme/g' \
  "$template_root/source/ops/deploy_db1_d15_mqa_consideration.sh" > "$generated"
chmod 0700 "$generated"
"$generated" --from-clone
