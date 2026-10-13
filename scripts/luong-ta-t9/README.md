# Lương trợ giảng tháng 9/2026 — script kiểm chuẩn & xuất phiếu (tạm, ngoài luồng ERP)

Nguồn công thức DUY NHẤT sau này là hàm Postgres `fn_ta_luong_thang` (migration `202610122210_ta_cham_cong_va_luong.sql`).
Các script này chỉ để **kiểm chuẩn** hàm đó với dữ liệu sheet tháng 9 và **xuất phiếu PDF** — KHÔNG nạp dữ liệu vào DB thật
(mọi thứ chạy trong `BEGIN … ROLLBACK`).

- `sheet4.json` — công tháng 9 (`cc`) + BTVN (`bt`) đã làm sạch từ 2 file CSV Thùy gửi 12/10.
- `test_chamcong.mjs` — **31 ca test** luồng chấm công theo thiết kế 13/10 (vào/ra ca, khai việc, khai bù 24 giờ, đối chiếu đã khớp/trống, làm hộ, duyệt lô, chốt giờ, nhập hộ, buổi thiếu công, lương chỉ tính ca đã duyệt).
- `test_luong.mjs` — bản test đầu (nạp 3 TA tháng 9 + kiểm quyền).
- `kiemchuan.mjs` — nạp công 15 TA, gọi `fn_ta_luong_thang`, in bảng so với phiếu v5 + danh sách phân công thiếu.
- `gen_v6.mjs` — như trên rồi sinh HTML phiếu vào `_out/phieu6/`; PDF bằng Chrome headless
  (`chrome --headless=new --no-pdf-header-footer --print-to-pdf=… file.html`), nén zip bằng `Compress-Archive`.
- `phieu.css` — khuôn in A4.

Chạy từ GỐC repo: `cat scripts/luong-ta-t9/kiemchuan.mjs | node --input-type=module`
(`pg` chỉ import được khi cwd = repo; cần `.env` có `DATABASE_URL`).
