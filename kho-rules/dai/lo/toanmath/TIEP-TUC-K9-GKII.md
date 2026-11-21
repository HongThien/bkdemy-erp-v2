# TIẾP TỤC — K9 GIỮA KÌ II (toanmath) · tạm dừng 21/11 vì hết token

**Phạm vi:** chỉ `Đề thi/GKII` (36) + `Đề cương/GKII` (17) khối 9 trong `batch.json` (B055–B057 đề thi, B061–B063 đề cương). Đề GKI chung batch KHÔNG đụng.

## Đã xong
- **Lô mẫu B055 (6 đề · 44 câu)**: soạn + Opus soát mù ĐẠT + ĐÃ GHI DB (`--lo-mau`, làn 🟡). Thùy gật mẫu 21/11 ("Duyệt, soạn tiếp") — **chưa bấm `fn_kho_lo_mau_duyet`** (cần quản lý môn). Luật rút từ mẫu đã ghi vào `spec-giai-bai.md` mục Khối 9 "Giữa kì II" (commit 11d45961) ⇒ mã luật hiện hành `d6889bbc6d49` (`node scripts/kho/cat-luat.mjs 9 --ma`; đổi nếu spec đổi ⇒ chạy lại `ghep-brief.mjs`).
- Chuẩn bị đủ cho B056, B057, B061, B062, B063: `ds-de.json`, thư mục làm việc `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<B>\<MA>\` (goc.pdf, trang\), brief `batch/<B>/brief-soan.md|brief-soat.md` (luật `d6889bbc6d49`). B056-06/16 và B057-05/16 là hai mã đề (T901/T902) của cùng file Ngọc Lâm, đã tách goc.pdf riêng.
- Bản đồ K9 (ngoài git, dựng lại nếu mất): `node --env-file=.env scripts/kho/bdm-ly-thuyet.mjs 9 > ...\_ban-do-k9\ban-do-k9-chi-tiet.txt` + mục lục (grep dòng `########`, `====`, `--- Nhóm`, `· Dạng`).

## CHƯA làm (đã thử rồi dừng — KHÔNG có tệp soạn dở nào)
1. **Soạn + kiểm + cổng, CHƯA ghi:** B056-01…16, B057-01…16, đề cương B061 (1), B062 (8), B063 (8). 20 trạm Sonnet (B056 đủ 16 + B057-01…04) đã chạy rồi bị dừng giữa chừng — không có `.soan.md` nào được ghi.
2. Cách giao: `_giao-soan-k9-gkii.md` (Sonnet; prompt mỗi trạm chỉ 1 dòng: "đọc tệp này, <B>=…, <MA>=…") và `_giao-kiem-k9-gkii.md` (Opus giải mù + soát). Giao ≤ 20 trạm song song; mỗi đề 1 trạm soạn (model sonnet) → 1 trạm kiểm (model opus) → cổng `dung-de-tu-soan.mjs … --khoi 9 --chi-kiem` tự chạy lại → `tinh-trang.mjs` → commit.
3. Đề cương (B061–B063): dài, chia khúc theo trang nếu > ~120 câu (§A10); đề cương GKII phạm vi theo dòng đầu đề cương; đa số không có đáp án in ⇒ Opus giải mù 100%. Bốn đề cương scan: B062-03, 04, 06, B063-03/08… xem `batch/<B>/ds-de.json` (`co_chu:false`).
4. **Ghi DB các đề sau mẫu: chờ Thùy nói "ghi"** + mẫu được duyệt trên DB. Cách ghi mỗi đề: `bash kho-rules/dai/lo/toanmath/ghi-batch.sh <B> 9` (thử ROLLBACK) rồi `… --ghi` (không dùng `--lo-mau` nữa); câu Hình K9 tạm vào `HH00140` (cổng gán mặc định). Đẩy hình trước: `node kho-rules/dai/lo/toanmath/anh-batch.mjs day <B>`.

## Việc cần Thùy / trưởng khối (đã báo)
- Bản đồ Đại K9: thiếu dạng cho hàm số y=ax² (NNB01075), tần số (NNB01076), xác suất (NNB01077), hình hộp (NNB01078); thiếu cả nhóm cho phương trình bậc hai / Viète / trụ–nón–cầu. Hình K9: chưa có dạng chờ `HH09000000`, chưa có bài cho góc nội tiếp / tứ giác nội tiếp / hình tổng hợp.
- Cổng + `ghi.mjs` chưa đọc `dang=`/`chac=` ⇒ phân dạng của trạm soạn không vào DB (§C10 mục 11).
- Mô tả dạng NDB00732 ("phân tích nhân tử") và NDB01209 ("dùng Cauchy") lệch luật giữa kì II.

## Lưu ý vận hành
- Checkout dùng chung nhiều phiên: commit chỉ file của mình bằng pathspec; `TINH-TRANG.md` chạy lại generator, không sửa tay; `spec-giai-bai.md` từng bị phiên khác dán đè lúc 09:12 (đã lành) — sửa spec bằng Edit, đừng String.replace với `$``.
- Chưa push (commit cục bộ trên main).
