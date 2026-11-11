# Audit "statement timeout" toàn hệ — 11/11/2026

Nguồn: `pg_stat_statements` qua `fn_do_truy_van_cham` (mig 202611112109, chạy SQL Editor). Số cộng dồn từ lần reset thống kê gần nhất (không đọc được mốc reset).
Trần: `authenticated` 8 s, `anon` 3 s. Lọc: truy vấn từ app/PostgREST có lần chạy ≥ 2 s — 300 dòng, tổng **94.698 giây DB**.

## Kết luận chính

1. **Timeout ở ERP phần lớn KHÔNG do màn ERP chậm — mà do DB bị nghẽn chung.**
   65 truy vấn vốn nhẹ (trung bình < 50 ms) có lần chạy 6–8 s: `hom_thu` (5 ms → 7,1 s), `lop` (3 ms → 7,7 s), `tai_lieu` (19 ms → 7,7 s),
   `set_config` (0 ms → 5,9 s), ghi `claude_phien_bot` (7 ms → 7,8 s). Truy vấn 5 ms mà phải chờ 7 s = DB đang bị vài hàm nặng chiếm hết.
   ERP và app HS dùng CHUNG một DB ⇒ giờ HS đông (17–22 h) thì màn ERP nào cũng có thể timeout.
2. **Một hàm chiếm 1/4 toàn bộ thời gian chậm: `fn_the_gioi_home`** (Home app HS, Thế giới BK) — 5.943 lần × 4,0 s = **24.053 s (6,7 giờ DB)**.
   Mỗi lần em mở Home: dựng lại toàn bộ tin 30 ngày của CẢ HỆ (`_the_gioi_tin(now()-30 days)`), rồi gọi `fn_the_gioi_kenh` tới 3 lần + `fn_the_gioi_cho_khoe`.
   Đúng bệnh "gọi hết" — số không cần realtime mà tính lại mỗi lượt mở.

## Bảng xếp hạng (theo tổng thời gian DB)

| # | Hàm | Màn | Lần gọi | TB (ms) | Max (ms) | Tổng (s) |
|---|---|---|---|---|---|---|
| 1 | fn_the_gioi_home | App HS – Home (Thế giới) | 5.943 | 4.047 | 7.998 | 24.053 |
| 2 | fn_phien_kho_them | Bot phiên Claude (service) | 1.580 | 3.652 | 7.985 | 5.769 |
| 3 | fn_ban_do_phieu_luu | App HS – Bản đồ phiêu lưu | 1.476 | 2.821 | 7.945 | 4.164 ¹ |
| 4 | fn_tu_luyen_sinh_tu_dong | App HS – Tự luyện | 778 | 4.376 | 7.984 | 3.404 |
| 5 | fn_thanh_tuu_cho_nhan | App HS – Thành tựu | 6.993 | 479 | 7.613 | 3.348 |
| 6 | tu_luyen_chu_de_ds_dang | App HS – Học theo chủ đề | 957 | 2.780 | 7.998 | 2.660 ¹ |
| 7 | fn_the_gioi_kenh | App HS – Thế giới | 1.173 | 1.807 | 7.968 | 2.119 |
| 8 | fn_hs_nhiem_vu_cua_toi | App HS – Nhiệm vụ | 8.325 | 248 | 7.357 | 2.067 |
| 9 | fn_qlcl_lam_moi | ERP – Dạng yếu (QLCL) | 1.059 | 1.826 | 7.650 | 1.934 |
| 10 | linkgen_jobs (select) | ERP – Kho tài liệu (poll 8 s) | 54.204 | 30 | 7.872 | 1.643 |
| 11 | fn_may_man_hs_cua_toi | App HS | 6.632 | 193 | 7.343 | 1.282 |
| 12 | fn_hs_lich_bo_tro | App HS | 24.468 | 51 | 7.813 | 1.238 |
| 13 | fn_btyeu_ca_cua_toi | App HS | 24.614 | 46 | 7.878 | 1.143 |
| 14 | fn_chuoi_cua_toi | App HS – Chuỗi | 6.884 | 160 | 7.882 | 1.101 |
| 15 | bai_test_report (select) | ERP | 2.639 | 410 | 7.848 | 1.083 |
| 16 | fn_viec_buoi_thuong | ERP – Việc buổi | 3.305 | 304 | 6.308 | 1.006 |
| 17 | fn_ta_dashboard | ERP – Dashboard TA | 1.927 | 518 | 7.837 | 998 |
| 18 | tu_luyen_chu_de_sinh | App HS – mở lượt luyện | 264 | 3.715 | 7.953 | 981 ¹ |
| 19 | fn_the_gioi_cho_khoe | App HS – Thế giới | 471 | 1.949 | 7.903 | 918 |
| 20 | fn_qlcl_tong_quan | ERP – QLCL | 3.987 | 228 | 7.279 | 908 |
| 21 | fn_bdm_khop_dem | ERP – Bản đồ | 969 | 851 | 7.990 | 825 |
| 22 | fn_traogiai_thang | ERP – Trao giải | 306 | 2.019 | 7.673 | 618 |
| 23 | fn_phong_cap_duoi | ERP – Phòng làm việc | 252 | 2.449 | 7.960 | 617 ² |
| 24 | fn_bdm_cay | ERP – Bản đồ | 550 | 1.058 | 7.886 | 582 |
| 25 | fn_the_gioi_chi_tiet | App HS – Thế giới | 329 | 1.546 | 7.057 | 509 |

¹ đã sửa 10/11 (mig 202611101421 / 202611101517) — số cộng dồn còn gồm thời gian trước khi sửa. ² đã sửa 10/11 (mig 202611101537, số lưu sẵn).

## Thứ tự sửa đề xuất

1. **Thế giới BK** (`fn_the_gioi_home` + `_kenh` + `_cho_khoe` + `_chi_tiet`): bảng tin tính sẵn (làm mới khi có tin/khen/bình luận mới hoặc theo lịch),
   Home chỉ đọc 2 tin + số đếm của em. Dự kiến bỏ ~27.600 s / 94.700 s (~29 %).
2. `fn_tu_luyen_sinh_tu_dong` (4,4 s/lần) — đo, cùng hướng sửa 10/11 của `tu_luyen_chu_de_sinh`.
3. Nhóm app HS gọi mỗi lần mở app, nhiều lượt: `fn_thanh_tuu_cho_nhan`, `fn_hs_nhiem_vu_cua_toi`, `fn_may_man_hs_cua_toi`, `fn_chuoi_cua_toi` — số không realtime ⇒ lưu sẵn/cờ bẩn.
4. Bot phiên `fn_phien_kho_them` (3,7 s/lần, chạy service role) — đo, giảm phạm vi quét.
5. ERP: `fn_qlcl_lam_moi`, `fn_ta_dashboard`, `fn_bdm_khop_dem`, `fn_bdm_cay`, `fn_traogiai_thang`, `fn_viec_buoi_thuong`; `linkgen_jobs` poll 8 s ⇒ giãn ra / chỉ khi có job.
6. Sau mỗi đợt: reset `pg_stat_statements` (SQL Editor: `select extensions.pg_stat_statements_reset();`) để đo lại sạch.

Luật áp: CLAUDE.md §2.0 "GỌI ĐÚNG CÁI ĐANG HIỆN · SỐ KHÔNG REALTIME THÌ TÍNH SẴN". Mọi lần đổi cách đọc: so cũ–mới khớp từng dòng trước khi áp. Đo/sửa ngoài 17–22 h.
