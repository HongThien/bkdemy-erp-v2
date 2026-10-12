#!/usr/bin/env bash
# k6-ghi-de.sh <MA> [--ghi] — dựng de.json từ kho-rules/dai/lo/k6/<MA>.soan.md rồi chạy ghi.mjs (mặc định chạy thử, ROLLBACK).
# Chỉ chạy khi đã có biên bản soát <MA>.soat.md với dòng "KẾT LUẬN: ĐẠT". KHÔNG chạy 2 lượt --ghi song song (cấp mã câu va nhau).
set -euo pipefail
MA="$1"; GHI="${2:-}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
LV="$HOME/bk-kho-lam-viec/de-thi/K6/$MA"
SOAN="$REPO/kho-rules/dai/lo/k6/$MA.soan.md"; SOAT="$REPO/kho-rules/dai/lo/k6/$MA.soat.md"
cd "$REPO"
[ -f "$SOAT" ] || { echo "❌ $MA: chưa có biên bản soát"; exit 3; }
grep -q "KẾT LUẬN: ĐẠT" "$SOAT" || { echo "❌ $MA: biên bản soát chưa ĐẠT — $(head -1 "$SOAT")"; exit 3; }
node scripts/kho/de-thi/dung-de-tu-soan.mjs "$SOAN" --lam-viec "$LV"
node scripts/kho/de-thi/ghi.mjs "$LV" $GHI 2>&1 | grep -vE "^\s+[0-9]+ \| " | cut -c1-300
