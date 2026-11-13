# Audit scale 13/11/2026 — bằng chứng (chỉ đọc, chưa sửa gì)

> File này là NGUỒN bằng chứng cho `spec-kien-truc.md` (số đo ngày 13/11, TRƯỚC khi sửa). Phần lớn lỗ quyền ở §4 đã bịt trong ngày (đợt 0a/0b/0c) — trạng thái hiện tại xem HANDOFF.md và `npm run check:kien-truc`.
> Cách đo: `pg_stat_*`, `pg_stat_statements` (qua `public._audit_pss()`), `cron.job_run_details` (qua `public._audit_cron_runs()`),
> `pg_get_functiondef`, `EXPLAIN` thường, đọc `src/`. Không gọi hàm nghiệp vụ, không `EXPLAIN ANALYZE`.
> Số pss là CỘNG DỒN từ 04/11; đợt tối ưu 10–12/11 đã hạ nhiều hàm ⇒ phải đo lại hiệu số vào giờ cao điểm trước khi chốt con số "hiện tại".

## 1. Quy mô

| | |
|---|---|
| Code | 697 file TS/TSX · ~149k dòng · 8 app chung `src/` · 142 file `src/lib` gọi thẳng Supabase |
| DB | 590 bảng · 1.916 hàm (998 security definer) · 446 trigger · 1.196 policy · 39 view · 1.257 migration · 986 MB |
| Người dùng | 515 HS · 51 nhân sự |
| Máy chủ | Micro: RAM 1 GB, shared_buffers 256 MB, 60 kết nối (45 đang dùng lúc vắng, phần lớn dịch vụ nền) · trần 8 s (authenticated), 120 s (cron) |
| Client → DB | ~1.420 `.from(` · ~670 `.rpc(` · 33 file `setInterval` · 7 `.channel(` |
| Bảng lớn (ước planner) | gami_grades 175k · bai_test_cau 115k (202 MB) · bai_lam_cau 108k · dai_cau_hoi 75k (102 MB) |

## 2. Hiệu suất DB

### 2.1 Tổng quan
- 875 nhóm câu lệnh từ app; **81 nhóm từng chạm ~8 s**; 41 hàm trung bình ≥ 1 s (số cộng dồn).
- Bảng bị quét tuần tự nhiều nhất (dòng đã đọc seq): thoi_khoa_bieu 6,9 tỉ (31 triệu lượt) · gami_grades 6,1 tỉ · bai_test 2,9 tỉ · bai_lam_cau 2,4 tỉ · dai_bdm_gan_cau 1,9 tỉ · dai_cau_hoi 1,7 tỉ · buoi_hoc_hs 1,5 tỉ.
- ~410 khoá ngoại chưa có index · 403 index chưa từng dùng (40 MB).

### 2.2 Bằng chứng cứng (EXPLAIN / catalog — đã kiểm)
| # | Phát hiện | Hàm bị ảnh hưởng |
|---|---|---|
| A | 4 index `*_khoa_trung_idx` dựng SAI biểu thức (`'s+'` thay vì `'\s+'`), `idx_scan = 0` ⇒ kiểm trùng quét cả bảng câu | `fn_phien_kho_them` (3,9 s/lượt) |
| B | `bai_test` không có index `nguon_tai_lieu_id` (thường) và `(lop_id, loai)` | `fn_de_thi_dem/_ds`, `fn_ban_do_phieu_luu`, `_hs_dang_da_hoc` (dùng chung ≥6 hàm) |
| C | `hoa_don_dong`, `thanh_toan` chỉ có pkey | `fn_hocphi_no_theo_ph` (bậc hai theo hoá đơn) |
| D | `buoi_hoc_hs(bo_tro_yeu_id)`, `bai_test` retest theo HS: không index | `fn_btyeu_case_xep_lich` |
| E | View `bdm_cau_dang`/`bdm_cau_hoi` (UNION ALL 8 nhánh) không nhận điều kiện đẩy xuống; `hgt_cau_hoi(parent_ma_cau)` không index | mọi hàm bốc câu (tự luyện, phiêu lưu, tăng tốc, Đấu trường, bổ trợ), `_do_o_bdm` (đúng câu làm cron mastery timeout 121 s) |
| F | Thiếu: `gami_grades(buoi_hoc_id, hoc_sinh_id)`, `bai_lam_cau(cham_at)`, `bai_lam(hoc_sinh_id)`, GIN `the_gioi_tin_luu(thanh_vien)`, `ban_be_loi_moi` 2 chiều, `tai_lieu` partial `loai='de_thi'`, `gami_exp_ledger` | cron Thế giới, xu-dong-bo, home Thế giới |

### 2.3 Mẫu lỗi lặp lại (đây là thứ phải sửa bằng KIẾN TRÚC, không phải vá từng hàm)
1. **Tính cả hệ rồi lọc một người**: `fn_viec_buoi_thuong` (lọc người ở cuối, không giới hạn ngày), `_tich_luy_cua`, `fn_mt_hang_thang`, `fn_rank_su_kien`, `fn_bc_ky_tinh` (cả khối cho 1 em), `fn_tl_bdm_goi_y`, `_the_gioi_tin_mo`.
2. **Hàm vô hướng gọi trên từng dòng**: `_hs_hien` (3 hàm lồng), `_do_o`/`_do_o_bdm`, `fn_han_viec`→`buoi_ke_tiep` (nguồn 31 triệu seq scan `thoi_khoa_bieu`), `_kho_ten_dang`, `_de_thi_da_giao`, `_bdm_duyet_duoc`.
3. **Ba bộ đọc lịch sử đo song song**: `_mastery_luot_do_quy` (có cache) · `_dbht_cau` · `fn_mastery_cells_hinh` (quét thẳng). Cache mastery bị bỏ qua khi truyền `p_since`/`p_den`.
4. **Tính lại lịch sử bất biến mỗi lượt**: tháng đã đóng, cả mùa, `-infinity` (thành tựu, ĐHT, chuỗi, album).
5. **View nhiều nhánh làm lớp truy cập** thay cho bảng ánh xạ câu→dạng lưu sẵn.
6. **Temp table trong hàm đọc** (`fn_traogiai_thang` ~12, `fn_the_gioi_kenh`, `fn_xephang_chung`, album).
7. **Tham số mặc định = toàn bộ lịch sử.**
8. **Sửa xong không kiểm index có được dùng.**
9. Bậc hai theo số HS, vượt 8 s từ ~2.000 HS (ước lượng): `fn_traogiai_thang`, `fn_bc_ky_chot_hs`, `fn_hs_album`, `fn_xephang_chung`/`fn_tich_luy` (đang 3,2–3,4 s).

### 2.4 Bảng tính sẵn + cron: 6 kiểu cơ chế, 5 định nghĩa "còn hiệu lực", 3 kiểu fallback
| Bảng | Cơ chế | Vấn đề ở quy mô lớn |
|---|---|---|
| mastery_luu_san(+_mon,_tinh) | sổ bẩn + cron 5', lô 20 em | ngân sách chỉ kiểm giữa các lô; em bẩn bị tính trực tiếp trong hàm đọc |
| hs_so_luu, nt_dht_so_du_luu | đọc-thì-tính + cờ bẩn | ổn (đơn vị 1 HS) |
| dang_yeu_hien_tai | cron 5' + TTL 12 h | mỗi em tính lại 2 lần/ngày dù không đổi |
| phong_so_luu | cron 5' + TTL 10' | không fallback; TA trùng giữa các khoá tính lặp |
| lop_dang_da_hoc_luu, mtt_luu | cron 5' + TTL 20' | mtt: mọi HS mỗi 20' — không theo được |
| bxh_luu | cron 10', 1 khoá = mọi HS, xoá–chèn từng em | ~280 s/khoá ở 10k ⇒ vượt trần, không bao giờ mới |
| the_gioi_tin_luu | cron 5', xoá hết chèn lại 31 ngày, quét cả lịch sử | ~45 s tb ở 10k |
| dash_viec_thang_luu, tl_bdm_dem_luu | TTL + tính trong lượt đọc | lượt đọc của người dùng gánh |
| dai_bdm_cay_nho | phiên bản = 1 sequence TOÀN CỤC | sửa 1 khối hỏng cache mọi khối |
- 16 job cron; đầu mỗi giờ 11 job cùng nổ, mỗi job 1 kết nối. 7 ngày: `mastery_lam_moi` 14 lượt lỗi (13 lượt là không mở/kịp khởi động kết nối, tập trung 20–22 h; 1 lượt statement timeout 121 s), `bxh-luu-san` tb 14,7 s max 109 s.

## 3. Client

- **Không có lớp truy cập dữ liệu chung** (không cache/dedupe/retry/đo). Cache duy nhất: ~82 hằng `NHO` tự viết từng màn.
- Mở app HS ≈ 27–30 request (9 RPC cho cùng 1 dòng học sinh); mỗi lần về màn chính gọi lại 12–13 RPC (`useEffect [direct, khu]`).
- `getMyProfile()` ~20 call site, không cache, 11 query/lượt ⇒ mở Home nhân sự ~30 request, "Việc của tôi" ~60–70 (ước lượng).
- Polling: `fn_hs_ep_cap_nhat` 30 s mọi màn app HS · bổ trợ HS 15/60 s · CaBoTroHS 10 s · phiên Claude 4 s (chồng Realtime) · Hỏi hệ thống 5 s luôn luôn · Live GV 7 s · sự kiện 2–5 s (chồng Realtime) · 7 chỗ không dừng khi tab ẩn. Bảng đầy đủ + file:dòng: trong transcript phiên 13/11 (luồng rà client).
- 418 câu `.from().select()` có limit ≥ 1000 hoặc không limit; 24 file lib `LIMIT = 10000`; 155 `select('*')`. Chưa kiểm "Max rows" của API trên dashboard.
- Nông trại ghi cả cục state JSON mỗi 5–8 s khi chơi.
- Realtime: sảnh `dtv-sanh` là 1 kênh presence chung cho mọi người chơi.

## 4. Bảo mật (đã kiểm lại bằng catalog trừ chỗ ghi "chưa kiểm")

**Hở ngay với người chỉ có anon key:**
- 8 bảng không RLS, anon đủ đọc/ghi/xoá: `bao_cao_ph` (~688 nhận xét HS), `kho_cau_log`, `_migrations`, `bo_tro_duoi`, `hinh_linkgen_jobs`, `phan_cong_ca`, `_tt_mapping`, `bao_cao_ph_preset`.
- Hàm security definer không kiểm quyền, anon gọi được: `fn_dai_chuyen_dang`, `fn_dai_chuyen_chuyen_de`, `fn_dai_gop_cau_dang` (ghi bản đồ), `fn_btyeu_ca_sap_toi`, `fn_lich_truc_cua_hs`, `fn_btyeu_retest_ghi`, `_kho_snapshot_cau`, `fn_ca_test_phan_cong_lai`.
- 12 view không `security_invoker` mà anon đọc + ghi được (`bdm_cau_hoi`, `bdm_cau_form_tn`, `bdm_cau_menh_de`, `bdm_dang_ly_thuyet`, `hinh_hoc_ban_do`, `v_giaibai_*`, `v_hinh_chua_giai`…); 7 view khác mọi authenticated đọc (`qlht_v_so_du_xu`, `tl_bdm_*_v`…).
- anon EXECUTE 634 hàm (223 secdef); ~131 hàm lọt qua PUBLIC mặc định (owner `claude_build`), chỉ 35 hàm là cố ý.
- `la_thanh_vien()` (756 policy dựa vào) có nhánh khớp `nhan_su.email = jwt_email()`, không lọc `trang_thai`; 4 nhân sự có email chưa có `tai_khoan`, 9 đã nghỉ còn email.
- Chưa kiểm: signup đang bật + không xác nhận email (suy từ `src/lib/nhansu.ts:129-196`); mật khẩu mặc định HS = mã HS.

**Hở với mọi tài khoản đăng nhập (461 HS hiện tại; 10.000 HS ở đích — KHÔNG có HS ngoài trung tâm, Thùy đính chính 13/11):**
- 5 policy ALL `USING(true)`: `dai_cau_menh_de`, `hgt_cau_menh_de` (đáp án Đ/S), `toan_de_thi`, `toan_de_thi_cau`, `nhap_kho_log`.
- Storage `kho-anh`, `kho-tailieu`, `avatars`: ghi/xoá chỉ kiểm bucket.
- `api/troly.mjs` gọi LLM chỉ sau `getUser`; không rate limit ở endpoint nào.
- Hàm không cổng: `_qlcl_dong_bang_tuan`, `fn_viec_chup_phu_trach`, `_push_bao_cap_nhat`, `tln_cache_check`…
- App HS giả định "có lớp" ở 19 hàm; BXH/Thế giới/kết bạn không có chiều "nội bộ/ngoài".

## 5. Kiến trúc

- Nhân bản theo nhánh môn: 35 họ hàm `*_bdm_*` × 3 nhánh, 10 họ × 4–5 nhánh; 23 họ bảng lặp ở 4–5 nhánh. 102 hàm dùng SQL động; registry `fn_kho_tbl`.
- 47 chỗ so sánh môn cứng + 31 chỗ so sánh nhánh cứng trong `src/` (21 file).
- 137 tên hàm không ai tham chiếu trong repo này (chưa đối chiếu app PH / repo khác).
- Chỉ 106/590 bảng có cột `mon`.
- Thân hàm lớn nhất 10–19k ký tự (`fn_bc_ky_tinh`, `_troly_bc_canh_bao`, `_mtt_tinh`, `_ta_luong_tinh`, `fn_traogiai_thang`).

## 6. Giá máy chủ (niêm yết Supabase, USD/tháng)
Micro 10 (1 GB, 60/200 kết nối) · Small 15 (2 GB, 90/400) · Medium 60 (4 GB, 120/600) · Large 110 (8 GB, 160/800) · XL 210 (16 GB, 240/1.000).

## 7. File làm việc tạm (scratchpad của phiên, sẽ mất)
Thân 1.920 hàm, cây gọi hàm, plan EXPLAIN, danh sách policy/hàm phân loại — cần thì chạy lại các script `khao-sat.mjs`, `kiem-bm.mjs`, `doi-xung.mjs` (nội dung trong transcript phiên 13/11).
