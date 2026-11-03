#!/usr/bin/env bash
# k9-ck-ghi-dai-het.sh <MA…> — ghi LƯỢT ĐẠI SỐ lần lượt (tuần tự) các đề cương cuối kì I K9 đã qua soát; bỏ đề đã có dấu <LV>/da-ghi-dai.txt.
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$REPO"
for MA in "$@"; do
  LV="$HOME/bk-kho-lam-viec/de-cuong/K9/CK/$MA"
  [ -f "$LV/da-ghi-dai.txt" ] && { echo "⏭ $MA: đã ghi lượt Đại"; continue; }
  RA="$(bash scripts/kho/de-thi/k9-ck-ghi-dai-de.sh "$MA" --ghi 2>&1)"
  if echo "$RA" | grep -q "✔ Đã ghi"; then
    echo "$RA" | grep -oE "tai_lieu [0-9a-f-]{36}" | tail -1 > "$LV/da-ghi-dai.txt"
    echo "✔ $MA: $(echo "$RA" | grep -E "dai.soan.md —" | sed 's/^.*soan.md — //') · $(echo "$RA" | grep -oE "câu mới [0-9]+ · trùng[^·]*[0-9]+")"
  else
    echo "❌ $MA: $(echo "$RA" | grep -E "❌|✘|LỖI|lỗi" | head -5)"
  fi
done
