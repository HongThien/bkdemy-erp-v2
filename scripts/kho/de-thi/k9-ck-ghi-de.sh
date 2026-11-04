#!/usr/bin/env bash
# k9-ck-ghi-de.sh <MA> [--ghi] — dựng de.json từ kho-rules/dai/lo/k9/ck/<MA>.hinh.soan.md rồi chạy ghi.mjs (mặc định chạy thử, ROLLBACK).
# LƯỢT HÌNH của đề cương CUỐI KÌ I Toán 9 (kho tham khảo, Thùy 03/11). Chỉ chạy khi có <MA>.hinh.soat.md với dòng "KẾT LUẬN: ĐẠT".
# KHÔNG chạy 2 lượt --ghi song song (cấp mã câu va nhau). Mọi câu Hình vào HH00108 tạm; xếp lại theo chủ đề bằng kho-rules/dai/lo/k9/ck/xep-hinh.mjs.
set -euo pipefail
export DANG_HINH_K9="${DANG_HINH_K9:-HH00108}"
MA="$1"; GHI="${2:-}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
LV="$HOME/bk-kho-lam-viec/de-cuong/K9/CK/$MA"
SOAN="$REPO/kho-rules/dai/lo/k9/ck/$MA.hinh.soan.md"; SOAT="$REPO/kho-rules/dai/lo/k9/ck/$MA.hinh.soat.md"
cd "$REPO"
[ -f "$SOAT" ] || { echo "❌ $MA: chưa có biên bản soát"; exit 3; }
grep -q "KẾT LUẬN: ĐẠT" "$SOAT" || { echo "❌ $MA: biên bản soát chưa ĐẠT — $(head -1 "$SOAT")"; exit 3; }
node scripts/kho/de-thi/dung-de-tu-soan.mjs "$SOAN" --lam-viec "$LV" --khoi 9
node scripts/kho/de-thi/ghi.mjs "$LV" $GHI 2>&1 | grep -vE "^\s+[0-9]+ \| " | cut -c1-300
