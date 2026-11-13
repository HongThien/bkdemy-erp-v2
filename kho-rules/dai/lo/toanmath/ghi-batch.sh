#!/usr/bin/env bash
# ghi-batch.sh <BATCH> <khối> [--ghi] — dựng de.json từ batch/<BATCH>/<MA>.soan.md rồi chạy ghi.mjs cho MỌI đề của batch (khuôn k9-cki-ghi-het.sh).
#   mặc định CHẠY THỬ (transaction ROLLBACK) · --ghi = ghi thật, tuần tự (KHÔNG chạy 2 lượt --ghi song song — cấp mã câu va nhau).
#   Chỉ đề có <MA>.soat.md "KẾT LUẬN: ĐẠT". Đề đã ghi có dấu <LV>/da-ghi.txt (tai_lieu id) ⇒ bỏ qua; ghi.mjs cũng tự chặn theo sha256.
#   Khối 9: câu Hình vào dạng $DANG_HINH_K9 (mặc định của cổng HH00140; B001/B005 cuối kì I dùng HH00108).
set -uo pipefail
B="$1"; KHOI="$2"; GHI="${3:-}"
REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"; cd "$REPO"
LVG="${BK_LV:-C:/Users/WBPC/bk-kho-lam-viec}/de-thi/toanmath/$B"
# hình sống trên kho (anh-batch.mjs, Thùy 13/11) ⇒ kéo về những tệp máy này chưa có; thiếu goc.pdf/trang thì dựng lại từ PDF gốc
node kho-rules/dai/lo/toanmath/anh-batch.mjs keo "$B" || { echo "❌ kéo hình $B từ kho lỗi — dừng"; exit 1; }
node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs "$B" >/dev/null
for SOAN in kho-rules/dai/lo/toanmath/batch/$B/$B-*.soan.md; do
  case "$SOAN" in *.goc.md|*.k[0-9].soan.md|*.k[0-9][0-9].soan.md) continue;; esac  # khúc đã ghép vào <MA>.soan.md (ghep-khuc.mjs)
  MA="$(basename "$SOAN" .soan.md)"; LV="$LVG/$MA"; SOAT="${SOAN%.soan.md}.soat.md"
  [ -f "$LV/da-ghi.txt" ] && { echo "· $MA đã ghi trước ($(cat "$LV/da-ghi.txt"))"; continue; }
  grep -q "KẾT LUẬN:\**\s*ĐẠT" "$SOAT" 2>/dev/null || { echo "⏸ $MA: soát chưa ĐẠT / thiếu biên bản"; continue; }
  # 13/11: `\text`, `\frac`, `\b…` bị ghi qua chuỗi JS thành TAB / form feed / backspace thật — cổng không bắt ⇒ chặn ở đây
  node -e "const s=require('fs').readFileSync(process.argv[1],'utf8');process.exit(/[\x00-\x08\x0b\x0c\x0e-\x1f]|\t|\n(otin|abla|ewline|eq\b|eg\b)/.test(s)?1:0)" "$SOAN" || { echo "❌ $MA: tệp soạn có ký tự điều khiển hoặc lệnh \\n… bị tách dòng (\\text, \\frac, \\notin, \\neq bị hỏng)"; continue; }
  node scripts/kho/de-thi/dung-de-tu-soan.mjs "$SOAN" --lam-viec "$LV" --khoi "$KHOI" >/dev/null 2>"$LV/tam/cong.err" || { echo "❌ $MA cổng: $(head -3 "$LV/tam/cong.err")"; continue; }
  R="$(node --env-file=.env scripts/kho/de-thi/ghi.mjs "$LV" $GHI 2>&1)"
  TK="$(echo "$R" | grep -oE "câu mới [0-9]+ · trùng[^·]*[0-9]+" | tail -1)"
  if [ "$GHI" = "--ghi" ]; then
    if echo "$R" | grep -q "✔ Đã ghi"; then echo "$R" | grep -oE "tai_lieu [0-9a-f-]{36}" | tail -1 > "$LV/da-ghi.txt"; echo "✔ $MA $(cat "$LV/da-ghi.txt") · $TK"
    else echo "❌ $MA: $(echo "$R" | grep -E "❌|✘|LỖI|lỗi|Error|thiếu" | head -3)"; fi
  else echo "$MA | ${TK:-?} $(echo "$R" | grep -E "❌|✘|LỖI|Error|thiếu" | head -2)"; fi
done
