#!/usr/bin/env bash
# k5-ghi-het.sh [--ghi] — sách "Đề kiểm tra Toán 5" (Qbooks, 40 đề, Thùy 28/10): dựng de.json từ kho-rules/dai/lo/k5/<MA>.soan.md
# cho MỌI đề có biên bản soát "KẾT LUẬN: ĐẠT" mà chưa ghi, gắn kỳ theo mã (HK1-GK ⇒ gk1 · HK1-CK ⇒ ck1 · HK2-GK ⇒ gk2 · HK2-CK ⇒ ck2)
# + 40 phút (sách không in thời gian), rồi ghi.mjs. Không --ghi = chạy thử (ROLLBACK). Tuần tự từng đề (cấp mã câu không được song song).
# Đề đã ghi có dấu <LV>/da-ghi.txt (tai_lieu id); ghi.mjs cũng tự chặn theo sha256.
set -uo pipefail
GHI="${1:-}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$REPO"
K="$HOME/bk-kho-lam-viec/de-thi/K5-sach-de"
for SOAT in kho-rules/dai/lo/k5/*.soat.md; do
  MA="$(basename "$SOAT" .soat.md)"; LV="$K/$MA"
  [ -f "$LV/da-ghi.txt" ] && continue
  grep -q "KẾT LUẬN: ĐẠT" "$SOAT" || { echo "⏸ $MA: soát chưa ĐẠT — $(head -1 "$SOAT" | cut -c1-120)"; continue; }
  case "$MA" in HK1-GK*) KY=gk1;; HK1-CK*) KY=ck1;; HK2-GK*) KY=gk2;; HK2-CK*) KY=ck2;; *) echo "❌ $MA: mã lạ"; continue;; esac
  node scripts/kho/de-thi/dung-de-tu-soan.mjs "kho-rules/dai/lo/k5/$MA.soan.md" --lam-viec "$LV" --khoi 5 > /dev/null || { echo "❌ $MA: không qua cổng dựng"; continue; }
  node -e 'const fs=require("fs"),f=process.argv[1]+"/de.json",d=JSON.parse(fs.readFileSync(f,"utf8"));d.ky=process.argv[2];d.thoi_gian_phut=40;fs.writeFileSync(f,JSON.stringify(d,null,1))' "$LV" "$KY"
  RA="$(node scripts/kho/de-thi/ghi.mjs "$LV" $GHI 2>&1)"
  if [ "$GHI" = "--ghi" ] && echo "$RA" | grep -q "✔ Đã ghi"; then
    echo "$RA" | grep -oE "tai_lieu [0-9a-f-]{36}" | tail -1 > "$LV/da-ghi.txt"
  fi
  if echo "$RA" | grep -qE "✔ Đã ghi|ROLLBACK"; then
    echo "✔ $MA ($KY): $(echo "$RA" | grep -oE "câu mới [0-9]+ · trùng[^·]*[0-9]+")"
  else
    echo "❌ $MA: $(echo "$RA" | grep -E "❌|lỗi|Error" | head -3)"
  fi
done
