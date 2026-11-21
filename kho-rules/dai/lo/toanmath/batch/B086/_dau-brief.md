# ĐẦU RIÊNG BATCH B086 — K6 đề cương giữa kì II (B086) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- **PHẠM VI CHỈ GKII (giữa kì II)**: batch B086 có thể trộn đề GKI + GKII; `ds-de.json` ở đây CHỈ có các đề GKII (mã đánh theo vị trí bài trong batch, vd B081-06). **Tuyệt đối không soạn / sửa đề GKI** (mã khác, phiên khác làm).
- `<MA>` = `B086-NN` (như bảng). Danh sách: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B086/ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` (trang đề **trong file PDF gốc**), `hd` (trang đáp án nếu có), `tach` (nhiều mã: mã nào nhập).
- `<LV>` = `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B086/<MA>` (`goc.pdf` nguyên file · `trang/p-N.png` 150 dpi theo trang file gốc · `img/` · `tam/` · `de.boc.json`). Phóng to: spec §A11 (`pdftoppm -r 400 …`). Đọc ảnh bằng công cụ Read (đọc được PNG).
- Tệp soạn: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B086/<MA>.soan.md` (khúc nếu > ~150 câu: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **giữa kì II lớp 6** (spec Phần B › Khối 6 › mục "Giữa kì II"). Loại: đề cương (đầu tệp có `kieu: de_cuong`). `bo_sach`: KNTT (đề không ghi ⇒ KNTT).
- **Bản đồ dạng K6** (phân dạng TRƯỚC khi giải — §A3): cây gọn mã NDB/NNB ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6-cay.txt`; lý thuyết + ví dụ đầy đủ ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6.txt` (424 KB — chỉ `grep` đúng nhóm / dạng cần, KHÔNG đọc cả tệp). Bản đồ K6 CHỈ phủ Tập 1 + đối xứng; phần Tập 2 (phân số, số thập phân, điểm–đường thẳng–đoạn thẳng–trung điểm, thống kê–xác suất) ⇒ `dang=—` + `THIẾU DẠNG: …` (xem mục Giữa kì II).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B086/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B086/<MA>" --khoi 6 --chi-kiem` (câu Hình Ch VIII: `kho=hinh_hoc`).
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B086`. Trạm KHÔNG tự chạy, KHÔNG ghi DB, KHÔNG git.
- Mỗi trạm chỉ ghi vào file `<MA>.*` của đề mình được giao (nhiều trạm chạy song song).

## Ghi chú riêng từng đề B086

| MA | Đơn vị · năm | Trang đề | Trang đáp án | Ghi chú |
|---|---|---|---|---|
| B086-01 | THCS Thăng Long, Hà Nội · 2024–2025 | 1-10 | (xem ảnh / không có) | ĐỀ CƯƠNG (Thăng Long) p1–10: TN, tự luận, bài nâng cao ("Bài 18: điều kiện n để B là phân số…"). Chữ. Nhiều câu ⇒ chia KHÚC. |
| B086-02 | THCS Thành Công, Hà Nội · 2025–2026 | 1-8 | (xem ảnh / không có) | ĐỀ CƯƠNG (Thành Công 2025) p1–8: bài tập + ĐỀ THAM KHẢO 1, 2 (p7–8). Chữ. |
| B086-03 | THCS Chu Văn An, quận Tây Hồ, Hà Nội · 2025–2026 | 1-3 | (xem ảnh / không có) | ĐỀ CƯƠNG (Chu Văn An 2025) p1–3: Dạng 1–5 (có bài nâng cao). Chữ. |
| B086-04 | THCS Ngọc Thụy, Hà Nội (scan) · 2025–2026 | 1-7 | (xem ảnh / không có) | ĐỀ CƯƠNG SCAN 7 trang (Ngọc Thụy 2025), không lớp chữ — đọc từ ảnh. |
| B086-05 | THCS Thành Công, Hà Nội · 2024–2025 | 1-6 | (xem ảnh / không có) | ĐỀ CƯƠNG (Thành Công 2024) p1–6: số thập phân, hình học… Chữ. |
| B086-06 | THCS Chu Văn An, quận Tây Hồ, Hà Nội · 2024–2025 | 1-4 | (xem ảnh / không có) | ĐỀ CƯƠNG (Chu Văn An 2024) p1–4: Trắc nghiệm + bài tập + nâng cao. Chữ. |
| B086-07 | THCS Ngọc Thụy, quận Long Biên, Hà Nội · 2024–2025 | 1-13 | (xem ảnh / không có) | ĐỀ CƯƠNG (Ngọc Thụy 2024) p1–13: nhiều đề ôn / trắc nghiệm / tự luận, biểu đồ. Chữ (một số trang hình). Nhiều câu ⇒ chia KHÚC. |
| B086-08 | THCS Nguyễn Bỉnh Khiêm, phường Phúc Lợi, Hà Nội · 2025–2026 | 1-7 | (xem ảnh / không có) | ĐỀ CƯƠNG (Nguyễn Bỉnh Khiêm 2025) p1–7: nội dung ôn tập + ĐỀ SỐ 1, 2. Chữ. |
