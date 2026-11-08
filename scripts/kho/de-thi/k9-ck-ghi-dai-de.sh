#!/usr/bin/env bash
# k9-ck-ghi-dai-de.sh <MA> [--ghi] — dựng de.json từ kho-rules/dai/lo/k9/ck/<MA>.dai.soan.md rồi chạy ghi.mjs (mặc định chạy thử, ROLLBACK).
# LƯỢT ĐẠI SỐ của đề cương CUỐI KÌ I Toán 9 (kho tham khảo, Thùy 03/11). Chỉ chạy khi có <MA>.dai.soat.md với dòng "KẾT LUẬN: ĐẠT".
# Lượt Hình dùng sha256 `:hinh` (de.boc.json); lượt Đại dùng sha256 `:dai` lấy từ ck/ds.json. Bản de.boc.json của lượt Hình được giữ lại ở de.boc.hinh.json.
# KHÔNG chạy 2 lượt --ghi song song (cấp mã câu va nhau).
set -euo pipefail
MA="$1"; GHI="${2:-}"
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
LV="$HOME/bk-kho-lam-viec/de-cuong/K9/CK/$MA"
SOAN="$REPO/kho-rules/dai/lo/k9/ck/$MA.dai.soan.md"; SOAT="$REPO/kho-rules/dai/lo/k9/ck/$MA.dai.soat.md"
cd "$REPO"
[ -f "$SOAT" ] || { echo "❌ $MA: chưa có biên bản soát"; exit 3; }
grep -q "KẾT LUẬN: ĐẠT" "$SOAT" || { echo "❌ $MA: biên bản soát chưa ĐẠT — $(head -1 "$SOAT")"; exit 3; }
# đổi khung sha sang :dai (giữ bản :hinh)
node -e "
const fs=require('fs'),p=require('path');
const lv=process.argv[1],ma=process.argv[2],repo=process.argv[3];
const ds=JSON.parse(fs.readFileSync(p.join(repo,'kho-rules/dai/lo/k9/ck/ds.json'),'utf8')).find(x=>x.ma===ma);
if(!ds||!ds.sha_dai){console.error('❌ ds.json không có sha_dai cho '+ma);process.exit(2)}
const fBoc=p.join(lv,'de.boc.json'),fHinh=p.join(lv,'de.boc.hinh.json');
const boc=JSON.parse(fs.readFileSync(fBoc,'utf8'));
if(boc.sha256===ds.sha_dai) process.exit(0);
if(!fs.existsSync(fHinh)) fs.copyFileSync(fBoc,fHinh);
boc.sha256=ds.sha_dai; boc.ghi_chu='khung cho dung-de-tu-soan.mjs (lượt Đại); lượt Hình: de.boc.hinh.json';
fs.writeFileSync(fBoc,JSON.stringify(boc,null,1));
" "$LV" "$MA" "$REPO"
node scripts/kho/de-thi/dung-de-tu-soan.mjs "$SOAN" --lam-viec "$LV" --khoi 9
node scripts/kho/de-thi/ghi.mjs "$LV" $GHI 2>&1 | grep -vE "^\s+[0-9]+ \| " | cut -c1-300
