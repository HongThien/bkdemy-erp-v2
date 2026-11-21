# ĐẦU RIÊNG BATCH B082 — K6 đề thi giữa kì II (B082) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- **PHẠM VI CHỈ GKII (giữa kì II)**: batch B082 có thể trộn đề GKI + GKII; `ds-de.json` ở đây CHỈ có các đề GKII (mã đánh theo vị trí bài trong batch, vd B081-06). **Tuyệt đối không soạn / sửa đề GKI** (mã khác, phiên khác làm).
- `<MA>` = `B082-NN` (như bảng). Danh sách: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B082/ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `de` (trang đề **trong file PDF gốc**), `hd` (trang đáp án nếu có), `tach` (nhiều mã: mã nào nhập).
- `<LV>` = `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B082/<MA>` (`goc.pdf` nguyên file · `trang/p-N.png` 150 dpi theo trang file gốc · `img/` · `tam/` · `de.boc.json`). Phóng to: spec §A11 (`pdftoppm -r 400 …`). Đọc ảnh bằng công cụ Read (đọc được PNG).
- Tệp soạn: `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/toanmath/batch/B082/<MA>.soan.md` (khúc nếu > ~150 câu: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **giữa kì II lớp 6** (spec Phần B › Khối 6 › mục "Giữa kì II"). Loại: đề thi. `bo_sach`: KNTT (đề không ghi ⇒ KNTT).
- **Bản đồ dạng K6** (phân dạng TRƯỚC khi giải — §A3): cây gọn mã NDB/NNB ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6-cay.txt`; lý thuyết + ví dụ đầy đủ ở `C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/ban-do-k6.txt` (424 KB — chỉ `grep` đúng nhóm / dạng cần, KHÔNG đọc cả tệp). Bản đồ K6 CHỈ phủ Tập 1 + đối xứng; phần Tập 2 (phân số, số thập phân, điểm–đường thẳng–đoạn thẳng–trung điểm, thống kê–xác suất) ⇒ `dang=—` + `THIẾU DẠNG: …` (xem mục Giữa kì II).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B082/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/B082/<MA>" --khoi 6 --chi-kiem` (câu Hình Ch VIII: `kho=hinh_hoc`).
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B082`. Trạm KHÔNG tự chạy, KHÔNG ghi DB, KHÔNG git.
- Mỗi trạm chỉ ghi vào file `<MA>.*` của đề mình được giao (nhiều trạm chạy song song).

## Ghi chú riêng từng đề B082

| MA | Đơn vị · năm | Trang đề | Trang đáp án | Ghi chú |
|---|---|---|---|---|
| B082-01 | THCS và THPT M.V. Lô-mô-nô-xốp, Hà Nội (scan) · 2025–2026 | 1-2 | (xem ảnh / không có) | SCAN 2 trang, không lớp chữ — đọc từ ảnh. |
| B082-02 | THCS Chương Dương, phường Hồng Hà, Hà Nội · 2025–2026 | 2-3 | 4-6 | p1 ma trận (bỏ), p2–3 đề, p4–6 hướng dẫn chấm. Chữ (phân số hay lỗi lớp chữ — đối chiếu ảnh). |
| B082-03 | THCS Mai Dịch, phường Từ Liêm, Hà Nội · 2025–2026 | 1-2 | 5-7 | ĐỀ 1 = p1–2 (nhập), ĐỀ 2 = p3–4 (bỏ nếu chỉ đổi thứ tự / số), p5–7 hướng dẫn chấm CHUNG hai đề. Chữ. · **Nhập: Đề 1 (bỏ Đề 2)** |
| B082-04 | THCS Nghĩa Tân, Hà Nội (scan) · 2025–2026 | 1-6 | (xem ảnh / không có) | SCAN 6 trang, không lớp chữ — đọc từ ảnh; tự xác định trang đề / đáp án. |
| B082-05 | THCS Ngọc Lâm, Hà Nội (scan) · 2025–2026 | 1-12 | (xem ảnh / không có) | SCAN 12 trang, không lớp chữ — đọc từ ảnh; tự xác định trang đề / đáp án / có nhiều mã không (nhiều mã ⇒ chỉ mã đầu). |
| B082-06 | Xã Đông Anh, Hà Nội · 2025–2026 | 1 | 2-4 | p1 đề, p2–4 hướng dẫn chấm, p5 quảng cáo. Chữ (xã Đông Anh). |
| B082-07 | THCS Cầu Giấy, Hà Nội (scan) · 2024–2025 | 1-2 | (xem ảnh / không có) | SCAN 2 trang, không lớp chữ — đọc từ ảnh. |
| B082-08 | THCS Nguyễn Bỉnh Khiêm, phường Phúc Lợi, Hà Nội (scan) · 2024–2025 | 1-3 | (xem ảnh / không có) | SCAN 3 trang, không lớp chữ — đọc từ ảnh. |
| B082-09 | THCS Thanh Mỹ, thị xã Sơn Tây, Hà Nội · 2024–2025 | 6-8 | 9-10 | p1–5 MA TRẬN + BẢN ĐẶC TẢ (bỏ), p6–8 đề, p9–10 hướng dẫn chấm, p11 quảng cáo. Chữ. |
| B082-10 | THCS Ngọc Lâm, Hà Nội (scan) · 2024–2025 | 1-6 | (xem ảnh / không có) | SCAN 6 trang, không lớp chữ — đọc từ ảnh; tự xác định trang đề / đáp án. |
| B082-11 | THCS Phúc Đồng, quận Long Biên, Hà Nội · 2024–2025 | 1-3 | (xem ảnh / không có) | p1–3 mã đề 601 (nhập), p4–6 mã 602 (bỏ nếu chỉ đổi số / thứ tự). Có thể không có đáp án trong file. Chữ. · **Nhập: Mã đề 601 (bỏ mã 602)** |
| B082-12 | THCS Việt Hưng, quận Long Biên, Hà Nội · 2024–2025 | 5-7 | 8-9 | p1–4 ma trận + đặc tả (bỏ), p5–7 ĐỀ CHÍNH THỨC (nhập), p8–9 hướng dẫn chấm đề này, p10–14 Đề 02, p15–19 đề dự bị (bỏ nếu cùng khuôn chỉ đổi số). Chữ. · **Nhập: Đề chính thức (bỏ Đề 02 + Đề dự bị)** |
| B082-13 | THCS Việt Hưng, phường Việt Hưng, Hà Nội · 2025–2026 | 4-5 | 6-7 | p1–3 ma trận + đặc tả (bỏ), p4–5 Đề 01 (nhập), p6–7 hướng dẫn chấm Đề 01, p8–11 Đề 02, p12–15 Đề 03 (bỏ nếu cùng khuôn chỉ đổi số). Chữ. · **Nhập: Đề 01 (bỏ Đề 02, 03)** |
