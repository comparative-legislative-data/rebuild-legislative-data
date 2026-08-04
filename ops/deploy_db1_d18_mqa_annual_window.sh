#!/usr/bin/env bash
set -euo pipefail
template_root="$(mktemp -d /srv/cld-gb-sct/staging/db1-d18-template.XXXXXX)"
trap 'rm -rf "$template_root"' EXIT
git clone --depth 1 https://github.com/comparative-legislative-data/rebuild-legislative-data.git "$template_root/source"
generated="$template_root/source/ops/.deploy_db1_d18_body.sh"
sed \
  -e '/routes=(/,/)/c\
routes=()\
for year in $(seq 2011 2025); do\
  routes+=("gb-sct.mqa-questions-${year}.collection" "gb-sct.votes-on-motions-${year}.collection")\
done' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15 d16 d17; do/' \
  -e 's/for timer in d4a d4c d5 d6 d7 d8 d9 d10 d11; do/for timer in d4a d4c d5 d6 d7 d8 d9 d10 KEEP_ELEVEN d12 d13 d14 d15 d16 d17 d18; do/' \
  -e 's/for path in members member-constituency-statuses member-region-statuses member-parties member-party-roles member-government-roles; do curl -sS --max-time 5 -o \/dev\/null -w '\''%{http_code}'\'' "http:\/\/127.0.0.1:3210\/db1\/gb-sct\/${path}\/d11-v1" | grep -qx '\''403'\''; done/true/' \
  -e 's/\[\[ "\$release_count" == "6" \]\]/[[ "$release_count" == "32" ]]/' \
  -e 's/d11/d18/g' -e 's/D11/D18/g' \
  -e 's/member_context/mqa_annual_window/g' -e 's/member-context/mqa-annual-window/g' \
  -e 's/Member-context/MQA annual-window/g' -e 's/Member context/MQA annual-window/g' \
  -e 's/KEEP_ELEVEN/d11/g' \
  "$template_root/source/ops/deploy_db1_d11_member_context.sh" > "$generated"
chmod 0700 "$generated"
"$generated" --from-clone
