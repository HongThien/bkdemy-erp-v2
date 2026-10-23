# PLAN — Mastery K6–12 sang BẢN ĐỒ MỚI (Thùy chốt 23/10)

## Quyết định (Thùy 23/10)
- **Cấp 1 (K3–5T) giữ bản đồ cũ** — chưa động.
- **Dựng bản song song có sẵn, có NÚT chuyển; thứ Hai 27/10 bấm.**
- **Bản đồ phiêu lưu app HS được đổi** theo cây mới.
- Thứ tự: **mastery trước → các hàm dùng mastery**. Giáo trình cũ KHÔNG chuyển (đã học rồi). Tài liệu đã giao lớp không chuyển (gắn đánh giá).
- **Sai sót giai đoạn này chấp nhận được** (dùng cả gán AI / đề xuất chưa duyệt).

## Kiến trúc (đã làm — mig 202610231446)
- Mastery KHÔNG lưu — suy từ lượt đo (mỗi lượt có `ma_cau`). Đổi bản đồ = đổi hàm quy **câu → ô**.
- `_do_o_bdm(ma_cau, ma_dang_chep)`: Đại K6–12 → dạng bài mới theo thứ tự gán câu → gán câu gốc → gán cụm cũ → dạng cũ gắn đúng 1 dạng bài → AI đề xuất; HGT → `hgt_bdm_gan_cau` → đề xuất; không quy được ⇒ NULL (ô trống, tự lấp khi câu được gán). Cấp 1, Hình, KHTN ⇒ giữ `_do_nhom_cua_o` (cũ).
- `_mastery_cells_core(p_bdm, …)` = công thức DUY NHẤT; `fn_mastery_cells` (chữ ký giữ nguyên) đọc công tắc; `fn_mastery_cells_bdm` luôn bản đồ mới (xem trước).
- Công tắc: bảng `he_thong_cong_tac` dòng `mastery_ban_do_moi` + log trigger; bật/tắt qua `fn_he_thong_cong_tac_dat(ma, bat)` (admin).
- Kiểm: `scripts/_test_mastery_bdm.mjs` (ROLLBACK) — tắt ⇒ trùng khít bản cũ; bật ⇒ K6–12 ra NDB, cấp 1 giữ.

## ⭐ NGUYÊN TẮC (Thùy 23/10, chỉnh sau khi tôi sửa thân hàm cũ)
- Mastery mới là hệ **SONG SONG** — **không thay thế cái cũ**, viết cái mới bên cạnh. Hoạt động mới dựa trên mastery mới.
- **Bổ trợ giữ mastery CŨ** (quan trọng nhất). Ngoài bổ trợ đổi hết sang mới được. Kết quả học tập + report PH chưa cần quan tâm;
  dashboard mới làm ở phiên khác. Khi mastery mới chuẩn ⇒ bỏ hẳn bản cũ.
- Thực thi (mig 202610231553): `fn_mastery_cells` = NGUYÊN BẢN (luôn cũ, không đọc công tắc) · `fn_mastery_cells_moi` = theo công tắc ·
  3 hàm bổ trợ nguyên bản · tự luyện / phiêu lưu / thành tựu / thông tin học tập / trợ lý gọi `fn_mastery_cells_moi`.
  Kiểm `scripts/_test_mastery_bdm_tach.mjs` 9/9.

## Trạng thái 23/10 tối — SẴN SÀNG BẤM
- ✅ Lõi + công tắc (mig 202610231446) · ✅ tra tên NDB (…1522, client `dangInfoCuaMon`) · ✅ kho câu nhánh 'bdm' (…1525) · ✅ 10 hàm dùng mastery theo công tắc (…1532) · ✅ tốc độ (…1538: 11A1 3,8 s) · ✅ màn công tắc + so sánh từng lớp (…1543, nút **🔀 Mastery** ở Bản đồ mới (soạn 4 tầng), chỉ admin).
- Kiểm (đều ROLLBACK): `_test_mastery_bdm.mjs` 5/5 · `_test_mastery_bdm_b2.mjs` 10/10 · `_test_mastery_bdm_b3.mjs` 4/4.
- Bổ trợ: GIỮ mastery cũ toàn bộ (ca mới cũng theo dạng cũ) — Thùy 23/10.
- Chấp nhận: phiêu lưu sắp chủ đề theo mã; dấu "đã dạy" màn mới chưa có; snapshot qua view không ghi form_tn_id; HGT cũ không mã câu giữ mã cũ.

## Việc còn lại trước khi bấm (thứ tự — bản gốc)
1. **Tra tên ô theo mã — 1 chỗ dispatch:** DB `_kho_ten_dang` / `_kho_dang_da_xoa_mem` / `_troly_ten_dang` hiểu mã `NDB…` (dai_bdm_dang_bai + nhóm + chủ đề); client `dangInfoCuaMon` (`lib/mastery.ts:33`) hiểu NDB — hiện nó **bỏ âm thầm** ô không tìm thấy.
2. **Danh sách dạng** ở `_tu_luyen_chon_dang`, `fn_thanh_tuu_thang`, `tu_luyen_chu_de_ds_dang`, `_hs_dang_da_hoc`, `hs_dang_evals`, `hs_dang_hoc_tap`: K6–12 lấy từ bản đồ mới khi công tắc bật.
3. **Bổ trợ yếu** (`bo_tro_yeu_dang` 949 dòng mã cũ, `fn_btyeu_*`, `fn_hs_bu_dang`, `_btyeu_dong_bo_dang_ban_do`): ca mới mở theo NDB; ca đang mở — CHỜ Thùy chốt cách xử lý.
4. **Bản đồ phiêu lưu** `fn_ban_do_phieu_luu`: K6–12 dựng từ cây mới (chủ đề → lục địa, nhóm → khu, dạng bài → màn).
5. **Màn bật công tắc** (admin) + bảng so sánh cũ ↔ mới theo lớp.
6. Bảng trạng thái mã cũ khác: `tu_luyen_dang_lan` (72k), `bo_tro_duoi_dang`, `canh_bao_yeu`, `buoi_danh_gia_dang`, `hoc_tu_dau_dang`, `bai_test_dang_phat_hanh` — đọc lịch sử giữ mã cũ; chỉ dòng MỚI theo NDB.
