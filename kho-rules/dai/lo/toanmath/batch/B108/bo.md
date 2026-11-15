# B108 — bài BỎ khỏi batch (15/11/2026)

B108 = 16 bài Toán 12 (PDF): 9 bài **GKI** + 7 bài **GKII**. Lượt này CHỈ làm GKII (đầu đè `_brief-chuan-bi-k12-gkii.md`).
→ **7 bài GKII: làm 3 đề của trường, bỏ 4.** 9 bài GKI: chưa làm (lượt sau). (595 đề K12 trong kho; so máy `do-trung.json` + tra tên trường.)
`chuan-bi-batch.mjs` chỉ dựng thư mục cho đề có trong `ds-de.json` ⇒ KHÔNG có thư mục làm việc nào cho bài GKI / bài bỏ.

## Bỏ — lượt sau (GKI)

| Bài | Máy (tham khảo) | Lý do |
|---|---|---|
| `de-giua-hoc-ky-1-toan-12-nam-2026-2027-truong-thpt-ho-thi-bi-tp-hcm` | `khac` | lượt sau — GKI |
| `de-giua-ki-1-toan-12-nam-2025-2026-truong-thpt-duy-tan-quang-ngai` | `khac` | lượt sau — GKI (kho đã có "Đề giữa kì 1 Toán 12 năm 2025–2026 trường THPT Duy Tân – Quảng Ngãi" — lượt sau kiểm trùng) |
| `de-minh-hoa-giua-ky-1-toan-12-nam-2024-2025-truong-thpt-ngo-quyen-da-nang` | `khac` 0,18 | lượt sau — GKI |
| `de-minh-hoa-gk1-toan-12-nam-2026-2027-truong-thpt-huong-hoa-quang-tri` | `khac` | lượt sau — GKI |
| `de-on-tap-giua-hoc-ki-1-toan-12-nam-2024-2025-truong-thpt-viet-duc-ha-noi` | `khac` | lượt sau — GKI |
| `de-on-tap-giua-hoc-ky-1-toan-12-nam-2024-2025-truong-thpt-thu-duc-tp-hcm` | `mo_ho` 0,33 | lượt sau — GKI |
| `de-on-tap-giua-ky-1-toan-12-nam-2025-2026-truong-thpt-gia-binh-1-bac-ninh` | `mo_ho` 0,42 | lượt sau — GKI |
| `de-on-thi-giua-ky-1-toan-12-nam-2024-2025-truong-thpt-nguyen-huu-cau-tp-hcm` | `khac` | lượt sau — GKI |
| `de-tham-khao-giua-ky-1-toan-12-nam-2024-2025-truong-thpt-luong-ngoc-quyen-thai-nguyen` | `khac` | lượt sau — GKI |

## Bỏ — bộ ôn tập / không phải đề kiểm tra của MỘT trường (Thùy 13/11: "Chỉ đề trường")

| Bài | Máy | Lý do |
|---|---|---|
| `10-de-on-tap-giua-hoc-ki-2-toan-12-nam-2024-2025-co-loi-giai-chi-tiet` | `mo_ho` 0,33 | bỏ — bộ ôn tập (Thùy 13/11): 165 trang "Đề ôn kiểm tra giữa kì 2 … Dùng cho 3 bộ sách", 10 đề + lời giải, không đứng tên trường |
| `bo-10-de-kiem-tra-giua-hoc-ky-2-toan-12-gdpt-2018-nam-hoc-2024-2025` | `mo_ho` 0,50 | bỏ — bộ ôn tập (Thùy 13/11): 50 trang "Bộ đề ôn tập giữa học kỳ II môn Toán theo chương trình mới – Đề số 01…", không đứng tên trường |
| `bo-de-tham-khao-giua-hoc-ki-2-toan-12-nam-2024-2025-so-gddt-thanh-hoa` | `trung` 0,75 (với "Đề giữa kì 2 Toán 12 năm 2024–2025 trường THPT Cẩm Thủy 2 – Thanh Hóa") | bỏ — bộ ôn tập (Thùy 13/11): 104 trang gộp đề tham khảo của ~10 trường Sở Thanh Hóa (Đông Bắc Ga, Cẩm Thủy 2, Đặng Thai Mai, Hà Trung…); ít nhất đề Cẩm Thủy 2 đã có trong kho |
| `de-on-thi-giua-ky-2-toan-12-nam-2024-2025-truong-thpt-nguyen-huu-cau-tp-hcm` | `khac` 0,17 | bỏ — bộ ôn tập: 32 trang "ÔN KTGK2 – Toán 12 (NH 2024–2025)" gồm **3 đề ôn KHÁC NHAU** (ĐỀ 1, 2, 3 ở p1–12, lời giải p13–32) do tổ Toán soạn để ôn — không phải đề kiểm tra thật của trường. Cùng tiền lệ B052 (bỏ "Đề ôn tập … Thủ Đức" 6 đề, "Đề ôn thi HK1 … Quốc tế Á Châu" 6 đề). **Thùy xem lại** nếu muốn tách lấy ĐỀ 1 (kho chỉ có Nguyễn Hữu Cầu cuối kì 2 2024–25, mã 485) |

## Giữ (3 đề; đo trùng 15/11)

| Bài | Máy | Đề cùng trường trong kho | Kết luận |
|---|---|---|---|
| …duy-tan-quang-ngai 2025-26 (mã 121) | `khac` 0,13 | Kho có Duy Tân – Quảng Ngãi chỉ giữa kì **1** 2025–26 và cuối kì **1** 2025–26 (mã 121); Duy Tân – Kon Tum là trường khác. Ảnh p1 GIỮA kì 2: câu 1 "$\int_a^b f(x)\,dx=F(b)-F(a)$", câu 2 khoảng cách $M(3;1;2)$ đến $(P):2x-y+2z+3=0$ ⇒ khác | GIỮ (file chỉ có mã 121) |
| …nguyen-hue-hue 2024-25 (mã 218) | `khac` 0,06 | Kho chỉ có "Nguyễn Huệ – **TP HCM**" giữa kì 2 2025–26 — khác trường | GIỮ (file chỉ có mã 218) |
| …thi-xa-quang-tri 2024-25 (mã 101) | `khac` 0,07 | Kho có Thị xã Quảng Trị: giữa kì 1 2024–25, cuối kì 1 2024–25 (mã 101), cuối kì 2 2024–25 (mã 1111) — KHÔNG có giữa kì 2 | GIỮ (file chỉ có mã 101; p5 = bảng đáp án 4 mã, lấy cột 101) |
