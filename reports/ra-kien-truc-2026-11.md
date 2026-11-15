# Rà kiến trúc 2026-11 — số lấy lúc 2026-11-15 23:25 (giờ VN)

> Sinh bởi `npm run ra:kien-truc`. Số cộng dồn chỉ để chọn chỗ đo tiếp. Phần "Phát hiện" và "Việc phải làm" ở cuối do người rà viết (spec-kien-truc.md §13).

## 1. Máy và kết nối
- Trần kết nối 90 · shared_buffers 512 MB · effective_cache_size 1536 MB · work_mem 5 MB · DB khởi động lần gần nhất 2026-11-15 23:09
- Kết nối client đang mở: **21 / 90** · đang chạy 1 (số tại thời điểm chạy lệnh — đỉnh tháng xem dashboard Supabase)
- Ai giữ: Realtime 8 · PostgREST 14.5 6 · Supavisor 3 · Supavisor (auth_query) 2 · postgres_exporter 1 · (trống) 1

## 2. Việc nền 30 ngày (tinh_san_chay)
| Sổ | Lượt | TB ms | Max ms | Lỗi | Bị cắt |
|---|---|---|---|---|---|
| tu_luyen_so_cau | 1 | 15290 | 15290 | 0 | 0 |
| bxh | 200 | 2728 | 24444 | 0 | 0 |
| mastery | 470 | 1532 | 21620 | 0 | 0 |
| lop_dang_da_hoc | 470 | 1048 | 11752 | 0 | 0 |
| the_gioi_tin | 468 | 896 | 10925 | 0 | 0 |
| phong_so | 468 | 701 | 14377 | 0 | 0 |
| viec_lh | 457 | 616 | 2461 | 0 | 0 |
| dash_viec_thang | 235 | 453 | 649 | 0 | 0 |
| dang_yeu | 468 | 264 | 6202 | 0 | 0 |
| mastery_luoi_dem | 1 | 20 | 20 | 0 | 0 |
| muc_tieu_tuan | 468 | 10 | 80 | 0 | 0 |

_Bảng nhật ký chỉ giữ 7 ngày nếu chưa đổi hạn giữ — số "30 ngày" khi đó là 7 ngày._

- Cron đang bật: 7 (btvn-app-cap3-tu-dong, buoi-tu-dong-et-btvn-trong, task-nhac-han, tinh-san-dieu-phoi, tu-dong-sang-t2, viec_chup_phu_trach, xu-dong-bo)
- Lượt cron không thành công 7 ngày: mastery_lam_moi 15 · viec_chup_phu_trach 9 · buoi-tu-dong-et-btvn-trong 8 · btvn-app-cap3-tu-dong 8 · lop-dang-da-hoc-luu 5 · the-gioi-tin-luu 5 · phong-so-luu-san 5 · qlcl-dang-yeu-nen 4 · xu-dong-bo 3 · muc-tieu-tuan 2 · bxh-luu-san 2 · dash-viec-thang 1

## 3. Hàm người dùng gọi (pg_stat_statements — CỘNG DỒN từ lần reset gần nhất)

**12 hàm tốn tổng thời gian nhiều nhất:**

| Hàm | Lượt | TB ms | Max ms | Tổng s | Trang đọc đĩa |
|---|---|---|---|---|---|
| fn_bao_sai_cho_duyet_cua_toi | 11 | 119 | 1164 | 1 | 1772 |
| fn_viec_buoi_thuong_loc | 11 | 29 | 128 | 0 | 194 |
| fn_bu_btvn_viec_cua_toi | 10 | 32 | 138 | 0 | 330 |
| fn_btyeu_ca_ta | 6 | 41 | 149 | 0 | 166 |
| gami_grades | 51 | 5 | 19 | 0 | 135 |
| fn_qlcl_tong_quan | 6 | 31 | 42 | 0 | 69 |
| fn_ta_dashboard | 13 | 14 | 55 | 0 | 84 |
| fn_xephang_chung | 5 | 35 | 139 | 0 | 152 |
| fn_btyeu_viec_cua_toi | 10 | 15 | 77 | 0 | 135 |
| fn_ta_cong_cua_toi | 11 | 13 | 31 | 0 | 39 |
| fn_dong_phase | 3 | 47 | 113 | 0 | 512 |
| fn_ta_hom_nay | 11 | 13 | 65 | 0 | 95 |

**Hàm trung bình ≥ 0,5 s (≥ 20 lượt): 0**


**10 hàm đọc đĩa nhiều nhất:** fn_bao_sai_cho_duyet_cua_toi 1772 · fn_dong_phase 512 · fn_bu_btvn_viec_cua_toi 330 · fn_viec_buoi_thuong_loc 194 · fn_btyeu_ca_ta 166 · fn_xephang_chung 152 · fn_btyeu_viec_cua_toi 135 · gami_grades 135 · fn_bdm_dang_chon 105 · fn_ta_cau_cua_em 104

## 4. Dung lượng
- DB: 1087 MB

| Bảng | Tổng (kèm index) | Heap | Dòng (ước) |
|---|---|---|---|
| bai_test_cau | 213 MB | 173 MB | 119733 |
| dai_cau_hoi | 125 MB | 90 MB | 78709 |
| gami_grades | 65 MB | 35 MB | 203012 |
| dai_bdm_log | 47 MB | 30 MB | 72908 |
| bai_lam_cau | 39 MB | 21 MB | 112010 |
| tu_luyen_dang_lan | 33 MB | 15 MB | 104998 |
| tai_lieu_cau | 27 MB | 13 MB | 146197 |
| dtv_cau_log | 25 MB | 17 MB | 40426 |
| kho_cau_dang | 19 MB | 8600 kB | 64475 |
| bao_cao_ph_ky_log | 17 MB | 15 MB | 8297 |
| anh_cau_hoi | 15 MB | 14 MB | 4774 |
| dai_cau_form_tn | 15 MB | 13 MB | 18988 |

## 5. Lô của máy trong khung 17–22 h (30 ngày) — K22
- Khoảng 10 phút có ≥ 50 file do script đẩy lên kho trong giờ HS dùng app: 15/11 21:00 (461 file) · 03/11 18:10 (394 file) · 02/11 21:20 (345 file) · 02/11 20:40 (318 file) · 13/11 19:40 (289 file) · 02/11 21:30 (265 file) · 02/11 20:30 (257 file) · 02/11 20:50 (239 file) · 18/10 20:10 (219 file) · 13/11 18:10 (201 file)

## 6. Số trần của cổng (scripts/kien-truc/tran.json) — chạy `npm run check:kien-truc` để so
- code_from_bang 1179 · code_set_interval 22 · code_limit_lon 521 · code_select_sao 213 · code_mon_cung 101 · db_secdef_khong_cong 135 · db_fk_thieu_index 398 · db_ham_dung_email 2 · db_ham_noi_bo_mo 319 · db_cron_job 7 · db_ham_bang_tam_thieu_analyze 15 · db_policy_goi_ham_tran 1

## 7. Phát hiện — TỔNG KẾT ĐỢT SỬA 11 → 15/11/2026 (bản gốc để các tháng sau so)

> Số ở mục 3 của file này gần như trống vì DB vừa khởi động lại lúc 23:09 (nâng gói máy) ⇒ thống kê cộng dồn bắt đầu lại từ đầu. Số đo của đợt sửa nằm trong DEVLOG 11 → 15/11 và HANDOFF mục kiến trúc.

**Bệnh gốc (một câu):** nhiều màn gọi hàm tính lại số của cả hệ / quét cả lịch sử để hiện vài con số, cộng với luật phân quyền chạy theo từng dòng và các lô của máy chen giờ học ⇒ tối 11/11 cả DB nghẽn (truy vấn 5 ms có lần 7–8 s, kết nối 58 / 60).

**Đã sửa (số trước → sau):**
- Thẻ Thế giới ở màn chính HS 4,0 s → 0,1–0,3 s · màn chính app HS 13–30 lượt gọi → 2 lượt gộp, mọi hàm < 30 ms.
- Bảng xếp hạng 21,5 s → 0,35 s mỗi lượt làm mới · sổ phòng 13 s → 0,4 s · xếp hạng chung + tích luỹ 1.466 → 56 ms · dashboard TA / GV / OPS đọc bảng tính sẵn (OPS: lượt đọc sẵn ~45 ms).
- Một khuôn tính sẵn: 11 sổ, một bộ điều phối 5 phút / lượt, 16 job cron chồng nhau → 7 job; 7 ngày gần nhất 0 lỗi, 0 lượt bị cắt.
- Danh sách dạng tự luyện 143–228 → 7–18 ms · danh sách đề thi 657 → 298 ms · trao giải tháng 1,4–3,0 s → 0,5 s · ô lịch sử Dashboard học tập (Toán) 1,13 → 0,4 s · đóng ET / BTVN 97 → 44 ms (hết quét cả bảng điểm chấm mỗi lượt).
- Index chứa sẵn cột cho bảng dòng rộng: lấy câu khối 12 từ 17.410 trang → 3; sinh bài tự luyện đọc đĩa 934 → 52–237 trang.
- Luật phân quyền chạy theo từng dòng: 373 bảng (02/11) + 31 policy còn sót (15/11) → còn 1.
- Quyền: mọi bảng có RLS; hàm / bảng mới mặc định đóng với người chưa đăng nhập; chuỗi bảng phân quyền chỉ người có quyền mới ghi; miễn gậy chỉ từ trưởng khối trở lên.
- Client: một cửa polling (tab ẩn thì dừng), `setInterval` 38 → 22; hỏi ép cập nhật 30 s → 5 phút.
- Gói máy: Micro → Small ngày 15/11 (trần kết nối 60 → 90, bộ nhớ đệm 256 → 512 MB). Đỉnh kết nối trước đó: 58 / 60 tối 11/11, 45 / 60 sau các đợt sửa.
- Tải chung sau khi sửa: cả DB 9–16 % một nhân kể cả tối cao điểm; người dùng thật < 2 %.

**Sai của chính đợt sửa (đã thành luật):** hai lượt chạy thử làm treo người dùng (K26) · gộp bảng thành partition làm app mất bảng 1,5 giờ · trigger mới làm chậm đường ghi (K28) · ba lần kết luận sai vì không đo (soát bảng tạm bằng đọc code; số kết nối; giả thuyết Realtime) (K19, K23) · hai commit gom nhầm phần sửa dở của phiên khác.

**Còn lại — biết mà chưa làm:** lõi mastery môn KHTN / Lý / Hoá 0,58 s mỗi em · đề xuất dạng mới ở bổ trợ yếu 0,5–0,8 s · màn chính app HS còn ~8 lượt gọi lẻ · album huy hiệu (tạm chưa dùng) · 1.179 chỗ client đọc thẳng bảng · 398 khoá ngoại chưa index · 135 hàm chạy quyền chủ chưa thấy cổng · gộp bảng theo khuôn chưa bắt đầu · Realtime chạy nền 5–11 % một nhân.
**Chưa biết:** hệ chưa từng được thử ở 1.000–10.000 HS (đợt 6) · các sửa 15/11 chưa có số giờ đông · mọi số ms là của máy 1 GB, chưa đo lại trên máy 2 GB.

## 8. Việc phải làm · việc chờ Thùy quyết · ngày rà kế tiếp

- **Làm ngay được:** tối có lớp gần nhất — chụp hiệu số `_audit_pss()` 10 phút trên máy mới (xác nhận các sửa 15/11 + lấy số nền cho tháng 12).
- **Chờ Thùy quyết:** thử tải cho mốc 1.000 HS (đợt 6) · mật khẩu mặc định = mã HS · bật lại Huy hiệu thì chốt tháng 7–10 trước.
- **Luật mới của tháng:** K24–K29 + danh mục 18 thiết kế sai (`spec-kien-truc.md` §12) + hai mục cổng mới (bảng tạm thiếu `analyze`, policy gọi hàm theo từng dòng).
- **Rà kế tiếp:** tuần đầu tháng 12/2026 (`spec-kien-truc.md` §13). So với file này: số trần của cổng (mục 6), dung lượng (mục 4), việc nền (mục 2), đợt đẩy file trong khung 17–22 h (mục 5).
