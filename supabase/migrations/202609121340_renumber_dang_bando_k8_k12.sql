-- ============================================================================
-- 202609121340 — renumber_dang_bando_k8_k12
-- ----------------------------------------------------------------------------
-- VÌ SAO: sau khi gộp/chuyển chuyên đề (mig 202609101516 K8, mig 202609101721
-- K12), một số dạng nằm ở chuyên đề mới nhưng vẫn giữ mã cũ. Quy tắc:
-- ma_dang phải bắt đầu bằng ma_chuyen_de. CEO (Thùy) chốt 12/09 sửa cả 6 chỗ
-- trong 1 mig (mig cũ 202609111143 đã tách 2 file, chạy fail vì thứ tự tên
-- làm T108030102 chưa được giải phóng khi K8 T1080301 muốn INSERT lại nó —
-- gộp về 1 file với thứ tự đúng).
--
-- Thứ tự trong file:
--   Part A · K8 T1080306: rename T108030102 → 602, T108030302 → 603
--             (bắt buộc chạy TRƯỚC Part B để giải phóng mã T108030102)
--   Part B · K8 T1080301: gộp T108030201 → T108030103, rename T108030301 →
--             T108030102, T108030401 → 104, T108030501 → 105
--   Part C · K12: gộp T312010105 → T312010503 có sẵn (T3120105 đã có 5 dạng
--             con placeholder 501..505, T312010503 "điểm-MP" trùng nội dung);
--             gộp T312010106 → T312010701 có sẵn (fix typo "Ví→Vị")
--
-- MẤT GÌ (Luật xoá — CEO gật 12/09 qua chat):
--   - XÓA 5 dòng dai_ban_do: T108030102, T108030302 (Part A rename); T108030201
--     (gộp vào 103); T108030301, T108030401, T108030501 (Part B rename).
--     Mọi lần xóa đều SAU khi INSERT dòng mới (rename) hoặc re-point sang
--     đích (gộp) → không mất dữ liệu.
--   - XÓA 2 dòng hgt_ban_do: T312010105, T312010106 (đều gộp vào dạng có sẵn).
--   - Bài lý thuyết + câu hỏi + lượt đo + đề test đều re-point sang mã mới,
--     KHÔNG có bảng nào mất dòng.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================


-- ============================================================================
-- Part A · K8 T1080306: rename T108030102 → T108030602, T108030302 → T108030603
-- ============================================================================
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at)
  select 'T108030602', khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at
  from dai_ban_do where ma_dang = 'T108030102';

insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at)
  select 'T108030603', khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at
  from dai_ban_do where ma_dang = 'T108030302';

-- Re-point T108030102 → T108030602
update dai_cau_hoi           set dang_chinh      = 'T108030602' where dang_chinh      = 'T108030102';
update dai_cum_bai           set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update dai_dang_ly_thuyet    set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update dai_dang_tien_de      set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030602' where tien_de_ma_dang = 'T108030102';
update bai_test_cau          set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update ca_test_cau           set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update gami_session_problems set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update canh_bao_yeu          set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update bo_tro_duoi_dang      set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update bo_tro_yeu_dang       set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update buoi_danh_gia_dang    set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update bt_grades             set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';
update tu_luyen_dang_lan     set ma_dang         = 'T108030602' where ma_dang         = 'T108030102';

-- Re-point T108030302 → T108030603
update dai_cau_hoi           set dang_chinh      = 'T108030603' where dang_chinh      = 'T108030302';
update dai_cum_bai           set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update dai_dang_ly_thuyet    set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update dai_dang_tien_de      set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030603' where tien_de_ma_dang = 'T108030302';
update bai_test_cau          set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update ca_test_cau           set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update gami_session_problems set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update canh_bao_yeu          set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update bo_tro_duoi_dang      set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update bo_tro_yeu_dang       set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update buoi_danh_gia_dang    set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update bt_grades             set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';
update tu_luyen_dang_lan     set ma_dang         = 'T108030603' where ma_dang         = 'T108030302';

delete from dai_ban_do where ma_dang in ('T108030102', 'T108030302');


-- ============================================================================
-- Part B · K8 T1080301: gộp T108030201 → T108030103, rename 301→102, 401→104, 501→105
-- (Part A ĐÃ giải phóng mã T108030102 — không còn conflict khi INSERT lại)
-- ============================================================================

-- B1) GỘP T108030201 → T108030103
update dai_dang_ly_thuyet    set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update dai_cau_hoi           set dang_chinh      = 'T108030103' where dang_chinh      = 'T108030201';
update dai_cum_bai           set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update dai_dang_tien_de      set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030103' where tien_de_ma_dang = 'T108030201';
update bai_test_cau          set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update ca_test_cau           set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update gami_session_problems set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update canh_bao_yeu          set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update bo_tro_duoi_dang      set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update bo_tro_yeu_dang       set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update buoi_danh_gia_dang    set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update bt_grades             set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
update tu_luyen_dang_lan     set ma_dang         = 'T108030103' where ma_dang         = 'T108030201';
delete from dai_ban_do where ma_dang = 'T108030201';

-- B2) INSERT dòng mới cho 3 rename
insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at)
  select 'T108030102', khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at
  from dai_ban_do where ma_dang = 'T108030301';

insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at)
  select 'T108030104', khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at
  from dai_ban_do where ma_dang = 'T108030401';

insert into dai_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at)
  select 'T108030105', khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, created_at
  from dai_ban_do where ma_dang = 'T108030501';

-- B3) Re-point T108030301 → T108030102
update dai_cau_hoi           set dang_chinh      = 'T108030102' where dang_chinh      = 'T108030301';
update dai_cum_bai           set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update dai_dang_ly_thuyet    set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update dai_dang_tien_de      set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030102' where tien_de_ma_dang = 'T108030301';
update bai_test_cau          set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update ca_test_cau           set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update gami_session_problems set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update canh_bao_yeu          set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update bo_tro_duoi_dang      set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update bo_tro_yeu_dang       set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update buoi_danh_gia_dang    set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update bt_grades             set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';
update tu_luyen_dang_lan     set ma_dang         = 'T108030102' where ma_dang         = 'T108030301';

-- B4) Re-point T108030401 → T108030104
update dai_cau_hoi           set dang_chinh      = 'T108030104' where dang_chinh      = 'T108030401';
update dai_cum_bai           set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update dai_dang_ly_thuyet    set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update dai_dang_tien_de      set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030104' where tien_de_ma_dang = 'T108030401';
update bai_test_cau          set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update ca_test_cau           set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update gami_session_problems set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update canh_bao_yeu          set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update bo_tro_duoi_dang      set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update bo_tro_yeu_dang       set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update buoi_danh_gia_dang    set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update bt_grades             set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';
update tu_luyen_dang_lan     set ma_dang         = 'T108030104' where ma_dang         = 'T108030401';

-- B5) Re-point T108030501 → T108030105
update dai_cau_hoi           set dang_chinh      = 'T108030105' where dang_chinh      = 'T108030501';
update dai_cum_bai           set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update dai_dang_ly_thuyet    set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update dai_dang_thuoc_tinh   set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update dai_dang_tien_de      set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update dai_dang_tien_de      set tien_de_ma_dang = 'T108030105' where tien_de_ma_dang = 'T108030501';
update bai_test_cau          set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update ca_test_cau           set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update gami_session_problems set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update canh_bao_yeu          set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update bo_tro_duoi_dang      set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update bo_tro_yeu_dang       set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update buoi_danh_gia_dang    set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update bt_grades             set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';
update tu_luyen_dang_lan     set ma_dang         = 'T108030105' where ma_dang         = 'T108030501';

delete from dai_ban_do where ma_dang in ('T108030301', 'T108030401', 'T108030501');


-- ============================================================================
-- Part C · K12: rename T312010105 → T312010503, GỘP T312010106 → T312010701
-- ============================================================================

-- C1) GỘP T312010105 → T312010503 (có sẵn, 0 câu, trùng nội dung "điểm-MP").
--     Chuyển tên "Tính khoảng cách từ một điểm đến mặt phẳng" từ 105 sang 503 (bản đang dùng),
--     giữ muc_do/bac_toi_thieu của 105.
update hgt_ban_do dst
   set ten_dang       = src.ten_dang,
       muc_do         = src.muc_do,
       bac_toi_thieu  = coalesce(src.bac_toi_thieu, dst.bac_toi_thieu),
       mo_ta_ngan     = coalesce(src.mo_ta_ngan, dst.mo_ta_ngan)
  from (select ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan from hgt_ban_do where ma_dang = 'T312010105') src
 where dst.ma_dang = 'T312010503';

-- Lý thuyết: T312010503 chưa có → UPDATE ma_dang bài 105 sang 503.
update hgt_dang_ly_thuyet    set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';

update hgt_cau_hoi           set dang_chinh      = 'T312010503' where dang_chinh      = 'T312010105';
update hgt_cum_bai           set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update hgt_dang_tien_de      set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update hgt_dang_tien_de      set tien_de_ma_dang = 'T312010503' where tien_de_ma_dang = 'T312010105';
update bai_test_cau          set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update ca_test_cau           set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update gami_session_problems set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update canh_bao_yeu          set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update bo_tro_duoi_dang      set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update bo_tro_yeu_dang       set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update buoi_danh_gia_dang    set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update bt_grades             set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';
update tu_luyen_dang_lan     set ma_dang         = 'T312010503' where ma_dang         = 'T312010105';

delete from hgt_ban_do where ma_dang = 'T312010105';

-- C2) GỘP T312010106 → T312010701 (có sẵn, 0 câu, typo "Ví"). Chuyển tên/muc_do đúng sang 701.
update hgt_ban_do dst
   set ten_dang       = src.ten_dang,
       muc_do         = src.muc_do,
       bac_toi_thieu  = coalesce(src.bac_toi_thieu, dst.bac_toi_thieu),
       mo_ta_ngan     = coalesce(src.mo_ta_ngan, dst.mo_ta_ngan)
  from (select ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan from hgt_ban_do where ma_dang = 'T312010106') src
 where dst.ma_dang = 'T312010701';

-- Lý thuyết: T312010701 chưa có → UPDATE ma_dang bài 106 sang 701 (không PK conflict).
update hgt_dang_ly_thuyet    set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';

-- Re-point các bảng còn lại
update hgt_cau_hoi           set dang_chinh      = 'T312010701' where dang_chinh      = 'T312010106';
update hgt_cum_bai           set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update hgt_dang_tien_de      set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update hgt_dang_tien_de      set tien_de_ma_dang = 'T312010701' where tien_de_ma_dang = 'T312010106';
update bai_test_cau          set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update ca_test_cau           set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update gami_session_problems set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update canh_bao_yeu          set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update bo_tro_duoi_dang      set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update bo_tro_yeu_dang       set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update buoi_danh_gia_dang    set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update bt_grades             set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';
update tu_luyen_dang_lan     set ma_dang         = 'T312010701' where ma_dang         = 'T312010106';

delete from hgt_ban_do where ma_dang = 'T312010106';
