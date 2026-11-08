#!/usr/bin/env bash
cd /c/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2
for MA in "$@"; do
  LV="$HOME/bk-kho-lam-viec/de-cuong/K9/CK/$MA"
  [ -f "$LV/da-ghi.txt" ] && { echo "⏭ $MA đã ghi"; continue; }
  RA="$(bash scripts/kho/de-thi/k9-ck-ghi-de.sh "$MA" --ghi 2>&1)"
  if echo "$RA" | grep -q "✔ Đã ghi"; then
    echo "$RA" | grep -oE "tai_lieu [0-9a-f-]{36}" | tail -1 > "$LV/da-ghi.txt"
    echo "✔ $MA: $(echo "$RA" | grep -oE 'câu mới [0-9]+ · trùng[^·]*[0-9]+') · $(cat $LV/da-ghi.txt)"
  else
    echo "❌ $MA"; echo "$RA" | tail -8 | cut -c1-250
  fi
done
