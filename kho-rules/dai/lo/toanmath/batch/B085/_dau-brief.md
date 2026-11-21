# ĐẦU RIÊNG BATCH B085 — K6 đề cương giữa kì II (phần GKII của batch trộn B085) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- **PHẠM VI CHỈ GKII (giữa kì II)**: batch B085 có thể trộn đề GKI + GKII; `ds-de.json` ở đây CHỈ có các đề GKII (mã đánh theo vị trí bài trong batch, vd B081-06). **Tuyệt đối không soạn / sửa đề GKI** (mã khác, phiên khác làm).
- `<MA>` = `B085-NN` (như bảng). Danh sách: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B085/ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` (trang đề **trong file PDF gốc**), `hd` (trang đáp án nếu có), `tach` (nhiều mã: mã nào nhập).
- `<LV>` = `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B085/<MA>` (`goc.pdf` nguyên file · `trang/p-N.png` 150 dpi theo trang file gốc · `img/` · `tam/` · `de.boc.json`). Phóng to: spec §A11 (`pdftoppm -r 400 …`). Đọc ảnh bằng công cụ Read (đọc được PNG).
- Tệp soạn: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B085/<MA>.soan.md` (khúc nếu > ~150 câu: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **giữa kì II lớp 6** (spec Phần B › Khối 6 › mục "Giữa kì II"). Loại: đề cương (đầu tệp có `kieu: de_cuong`). `bo_sach`: KNTT (đề không ghi ⇒ KNTT).
- **Bản đồ dạng K6** (phân dạng TRƯỚC khi giải — §A3): cây gọn mã NDB/NNB ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6-cay.txt`; lý thuyết + ví dụ đầy đủ ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6.txt` (424 KB — chỉ `grep` đúng nhóm / dạng cần, KHÔNG đọc cả tệp). Bản đồ K6 CHỈ phủ Tập 1 + đối xứng; phần Tập 2 (phân số, số thập phân, điểm–đường thẳng–đoạn thẳng–trung điểm, thống kê–xác suất) ⇒ `dang=—` + `THIẾU DẠNG: …` (xem mục Giữa kì II).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B085/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B085/<MA>" --khoi 6 --chi-kiem` (câu Hình Ch VIII: `kho=hinh_hoc`).
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B085`. Trạm KHÔNG tự chạy, KHÔNG ghi DB, KHÔNG git.
- Mỗi trạm chỉ ghi vào file `<MA>.*` của đề mình được giao (nhiều trạm chạy song song).

## Ghi chú riêng từng đề B085

| MA | Đơn vị · năm | Trang đề | Trang đáp án | Ghi chú |
|---|---|---|---|---|
| B085-04 | THCS Đa Tốn, Hà Nội · 2024–2025 | 1-10 | (xem ảnh / không có) | ĐỀ CƯƠNG (Đa Tốn): p1–10 gồm lý thuyết, trắc nghiệm, tự luận, đề tham khảo; p11 quảng cáo (bỏ). Chữ. Nhiều bài ("Bài 25"…). |
| B085-05 | THCS Nghĩa Tân, Hà Nội · 2024–2025 | 1-6 | (xem ảnh / không có) | ĐỀ CƯƠNG (Nghĩa Tân): p1–6 (p7 quảng cáo). Chữ. Có bài nâng cao "Bài 7*" tìm x nguyên để phân số là số nguyên. |
| B085-06 | THCS Thọ Lộc, Hà Nội (scan) · 2025–2026 | 1-5 | (xem ảnh / không có) | ĐỀ CƯƠNG SCAN 5 trang, không lớp chữ — đọc từ ảnh. |
| B085-07 | THCS Thọ Lộc, Hà Nội (scan) · 2024–2025 | 1-10 | (xem ảnh / không có) | ĐỀ CƯƠNG SCAN 10 trang, không lớp chữ — đọc từ ảnh; nhiều câu ⇒ chia KHÚC. |
| B085-08 | THCS Nguyễn Bỉnh Khiêm, quận Long Biên, Hà Nội · 2024–2025 | 1-6 | (xem ảnh / không có) | ĐỀ CƯƠNG (Nguyễn Bỉnh Khiêm, Long Biên): p1–6 (p7 quảng cáo). Chữ. Có "Dạng 3 bài thực tế", biểu đồ tranh / xác suất. |
