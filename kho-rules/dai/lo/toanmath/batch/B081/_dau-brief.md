# ĐẦU RIÊNG BATCH B081 — K6 đề thi giữa kì II (phần GKII của batch trộn B081) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- **PHẠM VI CHỈ GKII (giữa kì II)**: batch B081 có thể trộn đề GKI + GKII; `ds-de.json` ở đây CHỈ có các đề GKII (mã đánh theo vị trí bài trong batch, vd B081-06). **Tuyệt đối không soạn / sửa đề GKI** (mã khác, phiên khác làm).
- `<MA>` = `B081-NN` (như bảng). Danh sách: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B081/ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` (trang đề **trong file PDF gốc**), `hd` (trang đáp án nếu có), `tach` (nhiều mã: mã nào nhập).
- `<LV>` = `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B081/<MA>` (`goc.pdf` nguyên file · `trang/p-N.png` 150 dpi theo trang file gốc · `img/` · `tam/` · `de.boc.json`). Phóng to: spec §A11 (`pdftoppm -r 400 …`). Đọc ảnh bằng công cụ Read (đọc được PNG).
- Tệp soạn: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B081/<MA>.soan.md` (khúc nếu > ~150 câu: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **giữa kì II lớp 6** (spec Phần B › Khối 6 › mục "Giữa kì II"). Loại: đề thi. `bo_sach`: KNTT (đề không ghi ⇒ KNTT).
- **Bản đồ dạng K6** (phân dạng TRƯỚC khi giải — §A3): cây gọn mã NDB/NNB ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6-cay.txt`; lý thuyết + ví dụ đầy đủ ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6.txt` (424 KB — chỉ `grep` đúng nhóm / dạng cần, KHÔNG đọc cả tệp). Bản đồ K6 CHỈ phủ Tập 1 + đối xứng; phần Tập 2 (phân số, số thập phân, điểm–đường thẳng–đoạn thẳng–trung điểm, thống kê–xác suất) ⇒ `dang=—` + `THIẾU DẠNG: …` (xem mục Giữa kì II).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B081/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B081/<MA>" --khoi 6 --chi-kiem` (câu Hình Ch VIII: `kho=hinh_hoc`).
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B081`. Trạm KHÔNG tự chạy, KHÔNG ghi DB, KHÔNG git.
- Mỗi trạm chỉ ghi vào file `<MA>.*` của đề mình được giao (nhiều trạm chạy song song).
- **ĐÂY LÀ LÔ MẪU** của (K6 × giữa kì II) (§C3): mọi câu vào làn 🟡 tới khi duyệt mẫu. Ghi `**Ghi chú:**` và `**Chưa chắc:**` cẩn thận — người duyệt đọc kỹ.

## Ghi chú riêng từng đề B081

| MA | Đơn vị · năm | Trang đề | Trang đáp án | Ghi chú |
|---|---|---|---|---|
| B081-06 | Ban Mai School, Hà Nội · 2024–2025 | 1-4 | 5-9 | p1–4 đề (TN + tự luận; p4 có "Exercise" tiếng Anh = phần hệ T, BỎ), p5–9 hướng dẫn chấm. Chữ. |
| B081-07 | THCS Chương Dương, phường Hồng Hà, Hà Nội · 2024–2025 | 1-2 | 3-4 | p1–2 đề, p3–4 hướng dẫn chấm, p5 quảng cáo (bỏ). Chữ. |
| B081-08 | THCS Đồng Ngạc, Hà Nội (scan) · 2024–2025 | 1-2 | (xem ảnh / không có) | SCAN 2 trang, không lớp chữ — đọc từ ảnh (phóng to 400 dpi chỗ mũ, phân số, ký hiệu). Tự xác định trang đề / đáp án khi xem. |
| B081-09 | THCS Gia Quất, phường Việt Hưng, Hà Nội · 2024–2025 | 1-2 | (xem ảnh / không có) | p1–2 mã T601 (nhập), p3–4 đề dự phòng (BỎ nếu trùng ≥70% sau chuẩn hoá). Không có hướng dẫn chấm. Chữ. · **Nhập: Mã T601 (bỏ đề dự phòng)** |
| B081-10 | THCS Mai Dịch, quận Cầu Giấy, Hà Nội · 2024–2025 | 1-2 | 3-4 | p1–2 đề (Mai Dịch, quận Cầu Giấy), p3–4 hướng dẫn chấm. Chữ. |
| B081-11 | THCS Phúc Lợi, quận Long Biên, Hà Nội · 2024–2025 | 1-4 | 5-7 | p1–4 đề, p5–7 đáp án + thang điểm. Chữ. |
| B081-12 | Ban Mai School, Hà Nội · 2025–2026 | 1-3 | 4-7 | p1–3 đề (Ban Mai School), p4–7 hướng dẫn chấm. Phần riêng hệ T tiếng Anh nếu có thì BỎ. |
