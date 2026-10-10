#!/usr/bin/env bash
# k6-ghi-het.sh — ghi lên ERP MỌI đề K6 đã qua soát (kho-rules/dai/lo/k6/<MA>.soat.md có "KẾT LUẬN: ĐẠT") mà chưa ghi.
# Tuần tự từng đề (không bao giờ 2 lượt --ghi song song). Đề đã ghi có dấu <LV>/da-ghi.txt (chứa tai_lieu id); ghi.mjs cũng tự chặn theo sha256.
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$REPO"
for SOAT in kho-rules/dai/lo/k6/*.soat.md; do
  MA="$(basename "$SOAT" .soat.md)"; LV="$HOME/bk-kho-lam-viec/de-thi/K6/$MA"
  [ -f "$LV/da-ghi.txt" ] && continue
  grep -q "KẾT LUẬN: ĐẠT" "$SOAT" || { echo "⏸ $MA: soát chưa ĐẠT — $(head -1 "$SOAT" | cut -c1-120)"; continue; }
  RA="$(bash scripts/kho/de-thi/k6-ghi-de.sh "$MA" --ghi 2>&1)"
  if echo "$RA" | grep -q "✔ Đã ghi"; then
    echo "$RA" | grep -oE "tai_lieu [0-9a-f-]{36}" | tail -1 > "$LV/da-ghi.txt"
    echo "✔ $MA: $(echo "$RA" | grep -E "soan.md —" | sed 's/^.*soan.md — //') · $(echo "$RA" | grep -oE "câu mới [0-9]+ · trùng[^·]*[0-9]+")"
  else
    echo "❌ $MA: $(echo "$RA" | grep -E "❌|✘|LỖI|lỗi" | head -5)"
  fi
done
