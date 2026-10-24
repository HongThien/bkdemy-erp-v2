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
- ✅ **Bổ trợ theo bản đồ của CA (Thùy 24/10 "đổi nốt bổ trợ", mig 202610241000):** cột `bo_tro_yeu.ban_do` ('cu'|'moi') do trigger điền theo công tắc LÚC MỞ ca, không đổi suốt đời ca.
  Ca 'cu' (mọi ca hiện có) chạy hết theo mastery cũ y như trước. Ca 'moi': điền dạng yếu (`fn_btyeu_dang_yeu_2_cua_so_moi`), đề xuất dạng mới, báo động vào ca (quy mã cũ → dạng bài khi ứng đúng 1),
  gợi ý "+ Thêm dạng" (`fn_btyeu_dang_goi_y_moi`) đều theo bản đồ mới. Bù (`fn_hs_bu_dang`) theo công tắc. Đuổi (`_duoi_lo_trinh`) không dùng mastery ⇒ không đổi.
  Kiểm `scripts/_test_bo_tro_ban_do_ca.mjs` 8/8 (ROLLBACK) + bù 40 buổi: TẮT y hệt, BẬT ra NDB có MCQ. Chấp nhận: "tìm toàn bản đồ" (DangPicker) vẫn là bản đồ cũ.
- Chấp nhận: phiêu lưu sắp chủ đề theo mã; dấu "đã dạy" màn mới chưa có; snapshot qua view không ghi form_tn_id; HGT cũ không mã câu giữ mã cũ.

## Rà 24/10 — còn gì đọc bản đồ cũ
- ✅ Chuyển theo công tắc (client `RollupScope.theoCongTac` ⇒ `fn_mastery_cells_moi`): **Trước buổi** (dạng yếu tháng, `truocbuoi.ts`) · **app GV tab Lớp** thanh đạt/cần/yếu (`LopView.tsx`).
- GIỮ CŨ có chủ đích: bổ trợ ca 'cu' · **BT tài liệu bổ trợ** (`BTScreen` → `getMasteryHS`) · học từ đầu / đuổi (`htd_co_mo`, `_duoi_lo_trinh`) · cấp 1.
- ✅ Thùy 24/10 "chuyển luôn" (mig 202610241130, kiểm `_test_mastery_moi_kqht_mt_ontap.mjs` 9/9 + chạy thật bằng phiên admin):
  **KQHT ERP** (dạng bài 1 HS · rollup · pivot) + **màn HS app GV** — `getMasteryHS({theoCongTac})`: ô `fn_mastery_cells_moi` + lần đo đã quy dạng
  `fn_mastery_lan_do_moi` (nguồn đo tách thành `_mastery_lan_do`, lõi đọc lại từ đó — parity 4 lớp) · **Bảng kết quả MT** theo chuyên đề/chủ đề mới khi bật ·
  **Ôn tập BTVN** chấm ở DB `fn_ontap_diem_dang` (bật ⇒ dạng giáo trình cũ chấm theo các dạng bài mà câu của nó quy về; câu vẫn chọn theo mã giáo trình).
- GIỮ CŨ vì bản đồ mới CHƯA CÓ ĐỘ KHÓ (`dai_bdm_dang_bai` không có cột mức độ): **Report PH** + phần Tổng quan KQHT (`getTongQuanHS` — tách %Cơ bản/%Nâng cao theo
  độ khó dạng). Bật công tắc thì lọc Cơ bản/Nâng cao ở pivot KQHT không còn dạng Đại/HGT (chỉ còn "Tất cả" có nghĩa) — chờ bản đồ mới có độ khó.
- Không phải chỗ dùng mastery: công cụ soạn/khớp bản đồ (`fn_dai_*`, `fn_bdm_*`, `kho/api.ts`) · `fn_mastery_rollup`, `hs_dang_evals` (không còn ai gọi).

## Việc còn lại trước khi bấm (thứ tự — bản gốc)
1. **Tra tên ô theo mã — 1 chỗ dispatch:** DB `_kho_ten_dang` / `_kho_dang_da_xoa_mem` / `_troly_ten_dang` hiểu mã `NDB…` (dai_bdm_dang_bai + nhóm + chủ đề); client `dangInfoCuaMon` (`lib/mastery.ts:33`) hiểu NDB — hiện nó **bỏ âm thầm** ô không tìm thấy.
2. **Danh sách dạng** ở `_tu_luyen_chon_dang`, `fn_thanh_tuu_thang`, `tu_luyen_chu_de_ds_dang`, `_hs_dang_da_hoc`, `hs_dang_evals`, `hs_dang_hoc_tap`: K6–12 lấy từ bản đồ mới khi công tắc bật.
3. **Bổ trợ yếu** (`bo_tro_yeu_dang` 949 dòng mã cũ, `fn_btyeu_*`, `fn_hs_bu_dang`, `_btyeu_dong_bo_dang_ban_do`): ca mới mở theo NDB; ca đang mở — CHỜ Thùy chốt cách xử lý.
4. **Bản đồ phiêu lưu** `fn_ban_do_phieu_luu`: K6–12 dựng từ cây mới (chủ đề → lục địa, nhóm → khu, dạng bài → màn).
5. **Màn bật công tắc** (admin) + bảng so sánh cũ ↔ mới theo lớp.
6. Bảng trạng thái mã cũ khác: `tu_luyen_dang_lan` (72k), `bo_tro_duoi_dang`, `canh_bao_yeu`, `buoi_danh_gia_dang`, `hoc_tu_dau_dang`, `bai_test_dang_phat_hanh` — đọc lịch sử giữ mã cũ; chỉ dòng MỚI theo NDB.

## 24/10 — Chuyển nốt KQHT · màn HS app GV · bảng MT theo chuyên đề · ôn tập BTVN (mig 202610241130)
- Thùy "chuyển luôn". Tách nguồn đo của lõi mastery mới ra `_mastery_lan_do` (một nguồn luật cho cả ô lẫn timeline) — parity 4 lớp y hệt; `fn_mastery_lan_do_moi` cho timeline; `fn_mt_bang_ket_qua` theo công tắc; `fn_ontap_diem_dang` (chấm nhu cầu ôn chuyển từ client xuống DB).
- **Sai rồi sửa:** chèn chú thích `-- …` vào giữa dòng `… limit 1) bd1 on s.hinh_baitoan_id is null` ⇒ chú thích nuốt mất `on …` ⇒ syntax error. Sửa thân hàm bằng thay chuỗi: chú thích đặt CUỐI dòng gốc, không chèn giữa.
- **Test ôn tập lần đầu 0/30:** lấy ứng viên từ khoá ô mastery (đã quy nhóm) thay vì mã dạng THẬT trong giáo trình (`tai_lieu_phan.ref_ma`) ⇒ đổi nguồn ứng viên, 49/56 dạng giáo trình 9A1 có điểm.
- Không chuyển được: Report PH + Tổng quan KQHT (tách CB/NC theo độ khó — bản đồ mới chưa có độ khó).
