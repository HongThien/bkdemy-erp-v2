# ĐẦU RIÊNG BATCH B045 — K10 đề cương cuối kì (2/6) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B045-NN`. Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B045\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (dấu "?" = suy đoán), `bo_sach_can_cu`,
  `de` (trang có bài **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B045\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to: spec §A11.
- Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B045\<MA>.soan.md` (khúc: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **cuối kì I** lớp 10 (spec Phần B › Khối 10). Loại: đề cương (đầu tệp có `kieu: de_cuong`).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B045/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B045`. Trạm không tự chạy.

## Ghi chú riêng từng đề cương B045

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B045-01 | THPT Thanh Khê, Đà Nẵng · 2024–2025 | KNTT? | 3-10 | **KHÔNG có** | chữ | ~62 | p1–2 ma trận (bỏ); không đáp án |
| B045-02 | THPT Trưng Vương, Bình Định · 2024–2025 | KNTT? | 1-18 | **KHÔNG có** | chữ | ~180 | Bài tập theo chủ đề (TN dày), p18 phiếu họ tên; không đáp án |
| B045-03 | THPT Đức Trọng, Lâm Đồng · 2025–2026 | KNTT | 10-23 | **KHÔNG có** | chữ | ~135 | p1–9 lý thuyết (bỏ), bài tập từ p10; p24 quảng cáo; CHỈ Chương III–V; không đáp án |
| B045-04 | THPT Hoàng Văn Thụ, Hà Nội · 2025–2026 | KNTT? | 2-9 | **KHÔNG có** | chữ | ~64 | Bản nhẹ hơn bản 2024-2025 ("Hàm số", bỏ hàm số bậc hai); không đáp án; 62% cụm chữ trùng với B044-01 — vẫn khác năm học |
| B045-05 | THPT Thanh Khê, Đà Nẵng · 2025–2026 | KNTT? | 3-7 | **KHÔNG có** | chữ | ~42 | p1–2 ma trận (bỏ), p8 quảng cáo; ít câu; không đáp án |
| B045-06 | THPT Bắc Thăng Long, Hà Nội · 2024–2025 | KNTT? | 1-12 | **KHÔNG có** | chữ | ~112 | Nhiều "ĐỀ SỐ" PHẦN 1 TN + Đ/S; không đáp án |
| B045-07 | THPT Phan Đình Phùng, Hà Nội · 2025–2026 | KNTT | 1-16 | **KHÔNG có** | chữ | ~149 | Phần tự luận theo bài (Bài 1…); không đáp án |
| B045-08 | THPT Việt Đức, Hà Nội · 2025–2026 | KNTT | 1-11 | **KHÔNG có** | chữ | ~73 | Đề minh họa số 1.. theo dạng thức 1/2/3; kho có VĐ giữa kì 2026-2027 nhưng khác năm học + nội dung (≤5/62 câu) ⇒ giữ |
| B045-09 | THPT Vân Nội, Hà Nội · 2026–2027 | KNTT? | 1-29 | **KHÔNG có** | chữ | ~308 | Đề cương dài: nội dung + bài tập theo chương; ghi năm học 2026–2027; không đáp án |
