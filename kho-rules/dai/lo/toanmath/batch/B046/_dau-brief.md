# ĐẦU RIÊNG BATCH B046 — K10 đề cương cuối kì (3/6) (chỉ đường dẫn + bảng đề; LUẬT ở spec-giai-bai.md, cắt kèm bên dưới)

- `<MA>` = `B046-NN`. Danh sách: `Repo\kho-rules\dai\lo\toanmath\batch\B046\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (dấu "?" = suy đoán), `bo_sach_can_cu`,
  `de` (trang có bài **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B046\<MA>` (`goc.pdf` nguyên file · `trang\p-N.png` 150 dpi theo trang file gốc · `img\` · `tam\` · `de.boc.json`). Phóng to: spec §A11.
- Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\B046\<MA>.soan.md` (khúc: `<MA>.k<N>.soan.md` — spec §A10). Mốc kiến thức: **cuối kì I** lớp 10 (spec Phần B › Khối 10). Loại: đề cương (đầu tệp có `kieu: de_cuong`).
- Cổng (chạy ở Repo, sửa tới khi "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B046/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- Hình vẽ / cắt xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B046`. Trạm không tự chạy.

## Ghi chú riêng từng đề cương B046

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B046-01 | THPT Yên Hòa, Hà Nội · 2024–2025 | KNTT? | 2-25 | **KHÔNG có** | chữ | ~181 | p1 cấu trúc (bỏ), p26 quảng cáo; kho có YH 2026-2027: 0 câu trùng ⇒ giữ |
| B046-02 | THPT Đại Mỗ, Hà Nội · 2025–2026 | KNTT? | 1-8 | **KHÔNG có** | chữ | ~79 | CHỈ Vectơ + Số đặc trưng; TN + tự luận; không đáp án |
| B046-03 | THPT Yên Hòa, Hà Nội · 2025–2026 | KNTT? | 2-33 | **KHÔNG có** | chữ | ~261 | Đề cương dài; kho có YH 2026-2027 (274 câu): 78/262 câu của bản này (≈30%) trùng ⇒ giữ nhưng nhiều khả năng là bản gốc của đề cương kho (xem điểm cần Thùy quyết) |
| B046-04 | THPT Linh Trung, TP Hồ Chí Minh · 2025–2026 | KNTT? | 1-30 | **KHÔNG có** | chữ | ~206 | Nhiều "ĐỀ ÔN TẬP SỐ"; p30 phiếu trống; không đáp án |
| B046-05 | THPT Nguyễn Công Trứ, TP Hồ Chí Minh · 2026–2027 | KNTT | 3-136 | rải rác "Đáp án:/Đáp số:" sau một số câu | chữ | ~984 | SÁCH 136 TRANG theo bài (TN + Đ/S + TLN), rất dài ⇒ điều phối chia khúc; có "Đáp án:/Đáp số:" in ngay sau một số câu (nhân chứng, tự giải trước); p1 mục lục, p2 bìa (bỏ) |
| B046-06 | THPT Cầu Giấy, Hà Nội · 2025–2026 | Cánh Diều? | 1-15 | **KHÔNG có** | **SCAN** | ~170 | SCAN (không lớp chữ) — 15 trang gõ từ ảnh; cùng khung Trần Phú 2025-26 nhưng câu khác; không đáp án |
| B046-07 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2025–2026 | Cánh Diều? | 1-25 | **KHÔNG có** | chữ | ~190 | CHỈ phần sau giữa kì (hàm số, hệ thức lượng, vectơ); không đáp án; kho có TP giữa kì 2026-2027 khác nội dung (≤4/21 câu) ⇒ giữ |
| B046-08 | THPT Nguyễn Trãi, Đà Nẵng · 2024–2025 | KNTT | 3-11 | trang 5,8,11 | chữ | ~75 | 3 đề (p3-4, p6-7, p9-10) + CÓ đáp án (p5, p8, p11); p1–2 nội dung kiến thức |
| B046-09 | THPT Trần Phú (Hoàn Kiếm), Hà Nội · 2024–2025 | Cánh Diều? | 1-16 | **KHÔNG có** | chữ | ~131 | Hàm số… ; TN + tự luận; không đáp án |
