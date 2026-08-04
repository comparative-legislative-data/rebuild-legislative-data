#!/usr/bin/env bash
set -euo pipefail
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d17-template.XXXXXX)"
trap 'rm -rf "$template_root"' EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
generated="$template_root/source/ops/.deploy_db1_d17_body.sh"
sed \
  -e 's/mqa-event-types/mqa-questions-2026/g' \
  -e 's/mqa-event-links/votes-on-motions-2026/g' \
  -e 's/gb-sct.mqa-event-types.collection/gb-sct.mqa-questions-2026.collection/g' \
  -e 's/gb-sct.mqa-event-links.collection/gb-sct.votes-on-motions-2026.collection/g' \
  -e 's/d13/d17/g' -e 's/D13/D17/g' \
  -e 's/mqa_taxonomy_link/mqa_annual_window/g' -e 's/mqa-taxonomy-link/mqa-annual-window/g' \
  -e 's/MQA taxonomy\/link/MQA annual-window/g' -e 's/MQA taxonomy\/link/MQA annual-window/g' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15 d16; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15 d16 d17; do/' \
  -e 's/KEEP_ELEVEN/d11/g' \
  "$template_root/source/ops/deploy_db1_d13_mqa_taxonomy_link.sh" > "$generated"
chmod 0700 "$generated"
"$generated" --from-clone
