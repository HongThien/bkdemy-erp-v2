-- ============================================================================
-- 202611021935_rls_initplan_ham_khong_doi_so
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 02/11 sau lỗi timeout bản đồ: "check lại 1 lượt xem còn lỗi hiệu suất nào tương tự không". Đo bằng phiên app thật
--   (role authenticated, trần 8s), chỉ ĐẾM dòng: gami_grades & bai_test_cau QUÁ TRẦN (lỗi) · tai_lieu_cau 8,1s · tu_luyen_dang_lan 5,7s ·
--   dtv_cau_log 5,1s · dai_bdm_log 3,1s · bai_lam_cau 2,7s · dai_cau_hoi 1,9s · khtn_cau_hoi 1,7s …
--   Gốc lỗi: policy gọi hàm TRẦN — la_thanh_vien(), my_hoc_sinh_id(), co_quyen_ghi('x')… — là hàm security definer (không inline được)
--   nên Postgres gọi lại cho TỪNG DÒNG. Bọc (SELECT hàm()) ⇒ Postgres tính MỘT lần mỗi câu lệnh (InitPlan) — cách chuẩn Supabase khuyến cáo
--   (docs "RLS performance: wrap functions in select"). Chỉ bọc hàm KHÔNG phụ thuộc dòng (không đối số hoặc đối số là hằng) ⇒ ngữ nghĩa
--   giữ nguyên tuyệt đối; hàm nhận cột của dòng (hs_o_lop(lop_id), bai_test_con_han(…)…) để nguyên.
--   File SINH TỰ ĐỘNG từ pg_policies (thân policy lấy nguyên từ DB, chỉ đổi phần bọc) bằng scratchpad gen_initplan.mjs.
--   Phần này: 373 bảng do claude_build sở hữu. ĐÃ ÁP TỪNG BẢNG (mỗi bảng 1 transaction ngắn, lock_timeout 3s) — áp cả file trong
--   1 transaction khoá 373 bảng cùng lúc ⇒ deadlock với app đang chạy (đã dính lúc thử). Sổ ghi bằng --ghi-so.
--   Bảng do postgres sở hữu: file kèm *_postgres.sql (chạy SQL Editor).
--
-- MẤT GÌ (Luật xoá): Không mất gì — ALTER POLICY giữ tên, lệnh, role; chỉ đổi cách viết biểu thức sang dạng tương đương.
-- ============================================================================

-- anh_ban_do (~0 dòng)
alter policy anh_ban_do_member_all on public.anh_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- anh_cau_hoi (~0 dòng)
alter policy anh_cau_hoi_member_all on public.anh_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- anh_dang_ly_thuyet (~0 dòng)
alter policy anh_dang_ly_thuyet_member_all on public.anh_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- anh_ngu_lieu (~0 dòng)
alter policy anh_ngu_lieu_member_all on public.anh_ngu_lieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_lam (~13237 dòng)
alter policy bai_lam_hs_insert on public.bai_lam
  with check (((hoc_sinh_id = (SELECT my_hoc_sinh_id())) AND COALESCE(bai_test_con_han(bai_test_id), false)));
alter policy bai_lam_hs_read on public.bai_lam
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy bai_lam_hs_update on public.bai_lam
  using (((hoc_sinh_id = (SELECT my_hoc_sinh_id())) AND COALESCE(bai_test_con_han(bai_test_id), false)))
  with check (((hoc_sinh_id = (SELECT my_hoc_sinh_id())) AND COALESCE(bai_test_con_han(bai_test_id), false)));
alter policy bai_lam_staff on public.bai_lam
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_lam_cau (~95887 dòng)
alter policy bai_lam_cau_hs_read on public.bai_lam_cau
  using ((EXISTS ( SELECT 1
   FROM bai_lam bl
  WHERE ((bl.id = bai_lam_cau.bai_lam_id) AND (bl.hoc_sinh_id = (SELECT my_hoc_sinh_id()))))));
alter policy bai_lam_cau_staff on public.bai_lam_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_lam_cau_sua_log (~19 dòng)
alter policy bai_lam_cau_sua_log_member_read on public.bai_lam_cau_sua_log
  using ((SELECT la_thanh_vien()));

-- bai_lam_goi_y (~0 dòng)
alter policy bai_lam_goi_y_hs_insert on public.bai_lam_goi_y
  with check ((EXISTS ( SELECT 1
   FROM bai_lam bl
  WHERE ((bl.id = bai_lam_goi_y.bai_lam_id) AND (bl.hoc_sinh_id = (SELECT my_hoc_sinh_id()))))));
alter policy bai_lam_goi_y_staff on public.bai_lam_goi_y
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_test (~12583 dòng)
alter policy bai_test_hs_read on public.bai_test
  using ((hs_o_lop(lop_id) OR (hoc_sinh_id = (SELECT my_hoc_sinh_id()))));
alter policy bai_test_staff on public.bai_test
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_test_cau (~101005 dòng)
alter policy bai_test_cau_hs_read on public.bai_test_cau
  using ((EXISTS ( SELECT 1
   FROM bai_test bt
  WHERE ((bt.id = bai_test_cau.bai_test_id) AND (bt.loai <> ALL (ARRAY['et'::text, 'de_thi'::text, 'bo_tro_test'::text, 'retest'::text, 'thi_thu'::text])) AND (hs_o_lop(bt.lop_id) OR (bt.hoc_sinh_id = (SELECT my_hoc_sinh_id()))) AND ((bt.loai <> 'giao_trinh'::text) OR (_btc_trang_thai(bai_test_cau.id, bai_test_cau.bai_test_id, bai_test_cau.ma_dang) <> 'chua'::text))))));
alter policy bai_test_cau_staff on public.bai_test_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_test_cau_phat_hanh_log (~497 dòng)
alter policy bai_test_cau_phat_hanh_log_staff_read on public.bai_test_cau_phat_hanh_log
  using ((SELECT la_thanh_vien()));

-- bai_test_cham_lai_log (~0 dòng)
alter policy bai_test_cham_lai_log_staff on public.bai_test_cham_lai_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_test_dang_phat_hanh (~189 dòng)
alter policy bai_test_dang_phat_hanh_staff_all on public.bai_test_dang_phat_hanh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bai_test_report (~84 dòng)
alter policy report_hs on public.bai_test_report
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())))
  with check ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy report_staff on public.bai_test_report
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ban_qua_quay (~0 dòng)
alter policy ban_qua_quay_member_all on public.ban_qua_quay
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bang_khong_bu (~11 dòng)
alter policy bang_khong_bu_member_all on public.bang_khong_bu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bao_loi (~30 dòng)
alter policy bao_loi_member_all on public.bao_loi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bao_loi_log (~0 dòng)
alter policy bao_loi_log_member_all on public.bao_loi_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bdm_ma_cum_luu_20261029 (~6279 dòng)
alter policy bdm_ma_cum_luu_member_read on public.bdm_ma_cum_luu_20261029
  using ((SELECT la_thanh_vien()));

-- bo_tro_chot_tuan (~2 dòng)
alter policy bo_tro_chot_tuan_member_all on public.bo_tro_chot_tuan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_chot_tuan_hs (~1031 dòng)
alter policy bo_tro_chot_tuan_hs_member_all on public.bo_tro_chot_tuan_hs
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_duoi_dang (~619 dòng)
alter policy bo_tro_duoi_dang_member_all on public.bo_tro_duoi_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_hinh (~0 dòng)
alter policy bo_tro_hinh_member_all on public.bo_tro_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_hinh_log (~0 dòng)
alter policy bo_tro_hinh_log_member_sel on public.bo_tro_hinh_log
  using ((SELECT la_thanh_vien()));

-- bo_tro_hinh_tai_lieu (~0 dòng)
alter policy bo_tro_hinh_tai_lieu_member_all on public.bo_tro_hinh_tai_lieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_on_thi_bao_dong (~1 dòng)
alter policy bo_tro_on_thi_bao_dong_member_sel on public.bo_tro_on_thi_bao_dong
  using ((SELECT la_thanh_vien()));

-- bo_tro_on_thi_dot (~1 dòng)
alter policy bo_tro_on_thi_dot_member_sel on public.bo_tro_on_thi_dot
  using ((SELECT la_thanh_vien()));

-- bo_tro_theo_doi (~198 dòng)
alter policy bo_tro_theo_doi_member_all on public.bo_tro_theo_doi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_yeu (~267 dòng)
alter policy bo_tro_yeu_member_all on public.bo_tro_yeu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bo_tro_yeu_dang (~1556 dòng)
alter policy bo_tro_yeu_dang_member_all on public.bo_tro_yeu_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- bt_grades (~0 dòng)
alter policy bt_grades_member_all on public.bt_grades
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- btvn_ket_qua (~7270 dòng)
alter policy btvn_ket_qua_member_all on public.btvn_ket_qua
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- btvn_nhan_xet_mau (~0 dòng)
alter policy btvn_nhan_xet_mau_member_read on public.btvn_nhan_xet_mau
  using ((SELECT la_thanh_vien()));

-- btvn_nop (~56 dòng)
alter policy btvn_nop_member_all on public.btvn_nop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- btvn_nop_anh (~292 dòng)
alter policy btvn_nop_anh_member_all on public.btvn_nop_anh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- btvn_ontap_config (~23 dòng)
alter policy btvn_ontap_config_member_all on public.btvn_ontap_config
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_ban_qua (~1 dòng)
alter policy buoi_ban_qua_member_all on public.buoi_ban_qua
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_ban_qua_doi (~0 dòng)
alter policy buoi_ban_qua_doi_member_all on public.buoi_ban_qua_doi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_ban_qua_hs (~11 dòng)
alter policy buoi_ban_qua_hs_member_all on public.buoi_ban_qua_hs
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_danh_gia (~7067 dòng)
alter policy buoi_danh_gia_member_all on public.buoi_danh_gia
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_danh_gia_dang (~3434 dòng)
alter policy buoi_danh_gia_dang_member_all on public.buoi_danh_gia_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_game_luot (~724 dòng)
alter policy buoi_game_luot_member_all on public.buoi_game_luot
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_game_qua (~0 dòng)
alter policy buoi_game_qua_member_all on public.buoi_game_qua
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_giai (~203 dòng)
alter policy buoi_giai_member_all on public.buoi_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_giai_log (~34 dòng)
alter policy buoi_giai_log_member_all on public.buoi_giai_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_hoc (~2395 dòng)
alter policy buoi_hoc_member_all on public.buoi_hoc
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_hoc_hs (~12675 dòng)
alter policy buoi_hoc_hs_member_all on public.buoi_hoc_hs
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- buoi_hoc_online_log (~0 dòng)
alter policy buoi_hoc_online_log_staff_read on public.buoi_hoc_online_log
  using ((SELECT la_thanh_vien()));

-- buoi_hoc_online_vao (~0 dòng)
alter policy buoi_hoc_online_vao_hs_read on public.buoi_hoc_online_vao
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy buoi_hoc_online_vao_staff_read on public.buoi_hoc_online_vao
  using ((SELECT la_thanh_vien()));

-- buoi_hoc_phase_log (~3588 dòng)
alter policy buoi_hoc_phase_log_staff_read on public.buoi_hoc_phase_log
  using ((SELECT la_thanh_vien()));

-- ca_bo_tro (~408 dòng)
alter policy ca_bo_tro_member_all on public.ca_bo_tro
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ca_bo_tro_nhe (~0 dòng)
alter policy ca_bo_tro_nhe_doc on public.ca_bo_tro_nhe
  using ((SELECT la_thanh_vien()));

-- ca_test (~70 dòng)
alter policy ca_test_member_all on public.ca_test
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ca_test_cau (~1862 dòng)
alter policy ca_test_cau_member_all on public.ca_test_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ca_test_cau_kq (~1635 dòng)
alter policy ca_test_cau_kq_member_all on public.ca_test_cau_kq
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ca_test_log (~173 dòng)
alter policy ca_test_log_member_all on public.ca_test_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- canh_bao_yeu (~190 dòng)
alter policy canh_bao_yeu_member_all on public.canh_bao_yeu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- chi_cau_hinh (~0 dòng)
alter policy chi_cau_hinh_all on public.chi_cau_hinh
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_cau_hinh_sel on public.chi_cau_hinh
  using ((SELECT co_chuc_nang('thuchi'::text)));

-- chi_danh_muc (~1 dòng)
alter policy chi_danh_muc_all on public.chi_danh_muc
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_danh_muc_sel on public.chi_danh_muc
  using ((SELECT la_thanh_vien()));

-- chi_khoan (~153 dòng)
alter policy chi_khoan_ins on public.chi_khoan
  with check ((nhan_su_id = (SELECT chi_me_id())));
alter policy chi_khoan_sel on public.chi_khoan
  using (((nhan_su_id = (SELECT chi_me_id())) OR (SELECT co_chuc_nang('thuchi'::text))));
alter policy chi_khoan_upd on public.chi_khoan
  using ((((nhan_su_id = (SELECT chi_me_id())) AND (trang_thai = 'cho_duyet'::text)) OR (SELECT co_quyen_ghi('thuchi'::text))))
  with check (((nhan_su_id = (SELECT chi_me_id())) OR (SELECT co_quyen_ghi('thuchi'::text))));

-- chi_khoan_log (~64 dòng)
alter policy chi_khoan_log_sel on public.chi_khoan_log
  using (((SELECT co_chuc_nang('thuchi'::text)) OR (EXISTS ( SELECT 1
   FROM chi_khoan k
  WHERE ((k.id = chi_khoan_log.chi_khoan_id) AND (k.nhan_su_id = (SELECT chi_me_id())))))));

-- chi_ky (~0 dòng)
alter policy chi_ky_all on public.chi_ky
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_ky_sel on public.chi_ky
  using ((SELECT co_chuc_nang('thuchi'::text)));

-- chi_ky_danh_muc (~0 dòng)
alter policy chi_ky_danh_muc_all on public.chi_ky_danh_muc
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_ky_danh_muc_sel on public.chi_ky_danh_muc
  using ((SELECT co_chuc_nang('thuchi'::text)));

-- chi_nhan_tien (~0 dòng)
alter policy chi_nhan_tien_all on public.chi_nhan_tien
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_nhan_tien_sel on public.chi_nhan_tien
  using ((SELECT co_chuc_nang('thuchi'::text)));

-- chi_nhan_tien_log (~0 dòng)
alter policy chi_nhan_tien_log_sel on public.chi_nhan_tien_log
  using ((SELECT co_chuc_nang('thuchi'::text)));

-- chi_so (~30 dòng)
alter policy chi_so_all on public.chi_so
  using ((SELECT co_quyen_ghi('thuchi'::text)))
  with check ((SELECT co_quyen_ghi('thuchi'::text)));
alter policy chi_so_sel on public.chi_so
  using (((SELECT co_chuc_nang('thuchi'::text)) OR (EXISTS ( SELECT 1
   FROM chi_khoan k
  WHERE ((k.id = chi_so.chi_khoan_id) AND (k.nhan_su_id = (SELECT chi_me_id())))))));

-- dai_ban_do (~10 dòng)
alter policy dai_ban_do_member_all on public.dai_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_cau_chua_khop (~0 dòng)
alter policy dai_bdm_cau_chua_khop_member_all on public.dai_bdm_cau_chua_khop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_cau_thieu_dang (~615 dòng)
alter policy dai_bdm_cau_thieu_dang_member_all on public.dai_bdm_cau_thieu_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_chu_de (~69 dòng)
alter policy dai_bdm_chu_de_member_all on public.dai_bdm_chu_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_chuyen_de (~180 dòng)
alter policy dai_bdm_chuyen_de_member_all on public.dai_bdm_chuyen_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_dang_bai (~1034 dòng)
alter policy dai_bdm_dang_bai_member_all on public.dai_bdm_dang_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_de_xuat (~2252 dòng)
alter policy dai_bdm_de_xuat_member_all on public.dai_bdm_de_xuat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_doi_ung (~628 dòng)
alter policy dai_bdm_doi_ung_member_all on public.dai_bdm_doi_ung
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_doi_ung_cum (~0 dòng)
alter policy dai_bdm_doi_ung_cum_member_all on public.dai_bdm_doi_ung_cum
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_duyet_pham_vi (~0 dòng)
alter policy dai_bdm_duyet_pham_vi_member_sel on public.dai_bdm_duyet_pham_vi
  using ((SELECT la_thanh_vien()));

-- dai_bdm_gan_cau (~21625 dòng)
alter policy dai_bdm_gan_cau_member_all on public.dai_bdm_gan_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_kho_ds (~863 dòng)
alter policy dai_bdm_kho_ds_member_all on public.dai_bdm_kho_ds
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_kiem_mau (~0 dòng)
alter policy dai_bdm_kiem_mau_member_all on public.dai_bdm_kiem_mau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_log (~47237 dòng)
alter policy dai_bdm_log_member_select on public.dai_bdm_log
  using ((SELECT la_thanh_vien()));

-- dai_bdm_nhom (~572 dòng)
alter policy dai_bdm_nhom_member_all on public.dai_bdm_nhom
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_nhom_tien_de (~0 dòng)
alter policy dai_bdm_nhom_tien_de_member_all on public.dai_bdm_nhom_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_o (~182 dòng)
alter policy dai_bdm_o_member_all on public.dai_bdm_o
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_bdm_tu_choi (~108 dòng)
alter policy dai_bdm_tu_choi_doc on public.dai_bdm_tu_choi
  using ((SELECT la_thanh_vien()));
alter policy dai_bdm_tu_choi_ghi on public.dai_bdm_tu_choi
  with check ((SELECT la_thanh_vien()));

-- dai_cau_bo_de (~0 dòng)
alter policy dai_cau_bo_de_member_all on public.dai_cau_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_form_dien (~0 dòng)
alter policy dai_cau_form_dien_member_all on public.dai_cau_form_dien
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_form_tn (~87 dòng)
alter policy dai_cau_form_tn_member_all on public.dai_cau_form_tn
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_hoi (~54869 dòng)
alter policy dai_cau_hoi_member_all on public.dai_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_hoi_clone_cho_duyet (~0 dòng)
alter policy dai_cau_hoi_clone_cho_duyet_member_all on public.dai_cau_hoi_clone_cho_duyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_hoi_yeu_cau_clone (~0 dòng)
alter policy dai_cau_hoi_yeu_cau_clone_member_all on public.dai_cau_hoi_yeu_cau_clone
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_hoi_yeu_cau_giai (~0 dòng)
alter policy dai_cau_hoi_yeu_cau_giai_member_all on public.dai_cau_hoi_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_khuon (~31600 dòng)
alter policy dai_cau_khuon_member_all on public.dai_cau_khuon
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cau_lop (~1714 dòng)
alter policy dai_cau_lop_member_all on public.dai_cau_lop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_chuyen_de_ly_thuyet (~0 dòng)
alter policy dai_chuyen_de_ly_thuyet_member_all on public.dai_chuyen_de_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cum_bai (~0 dòng)
alter policy dai_cum_bai_member_all on public.dai_cum_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_cum_tien_de (~0 dòng)
alter policy dai_cum_tien_de_member_all on public.dai_cum_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_dang_ly_thuyet (~2 dòng)
alter policy dai_dang_ly_thuyet_member_all on public.dai_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_dang_thuoc_tinh (~0 dòng)
alter policy dai_dang_thuoc_tinh_member_all on public.dai_dang_thuoc_tinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_dang_tien_de (~0 dòng)
alter policy dai_dang_tien_de_member_all on public.dai_dang_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_danh_muc_bo_de (~0 dòng)
alter policy dai_danh_muc_bo_de_member_all on public.dai_danh_muc_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_danh_muc_thuoc_tinh (~0 dòng)
alter policy dai_danh_muc_thuoc_tinh_member_all on public.dai_danh_muc_thuoc_tinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dai_mcq_rule (~4 dòng)
alter policy dai_mcq_rule_member_all on public.dai_mcq_rule
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dang_ky_test (~0 dòng)
alter policy dang_ky_test_member_select on public.dang_ky_test
  using ((SELECT la_thanh_vien()));

-- dang_yeu_dau_tuan (~0 dòng)
alter policy dydt_doc on public.dang_yeu_dau_tuan
  using ((SELECT la_thanh_vien()));

-- dang_yeu_hien_tai (~416 dòng)
alter policy dyht_doc on public.dang_yeu_hien_tai
  using ((SELECT la_thanh_vien()));

-- danhgia_ai_job (~0 dòng)
alter policy danhgia_ai_job_member_all on public.danhgia_ai_job
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- de_test_ghim (~0 dòng)
alter policy de_test_ghim_member_all on public.de_test_ghim
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dht_tieu (~2385 dòng)
alter policy dht_tieu_member_all on public.dht_tieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- diem_thi (~1013 dòng)
alter policy diem_thi_member_all on public.diem_thi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- dtv_cau_log (~37583 dòng)
alter policy dtv_cau_log_nhan_vien on public.dtv_cau_log
  using ((SELECT la_thanh_vien()));

-- dtv_de (~2506 dòng)
alter policy dtv_de_nhan_vien on public.dtv_de
  using ((SELECT la_thanh_vien()));

-- game_lop_qua_dac_biet (~0 dòng)
alter policy game_lop_qua_dac_biet_member_all on public.game_lop_qua_dac_biet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- game_lop_thuong (~0 dòng)
alter policy game_lop_thuong_member_all on public.game_lop_thuong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_elo (~429 dòng)
alter policy gami_elo_member_all on public.gami_elo
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_elo_history (~5138 dòng)
alter policy gami_elo_history_member_all on public.gami_elo_history
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_exp_ledger (~12600 dòng)
alter policy gami_exp_ledger_member_all on public.gami_exp_ledger
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_grades (~182930 dòng)
alter policy gami_grades_member_all on public.gami_grades
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_mua (~0 dòng)
alter policy gami_mua_member_all on public.gami_mua
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gami_session_problems (~37123 dòng)
alter policy gami_session_problems_member_all on public.gami_session_problems
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_chot_thang (~0 dòng)
alter policy gay_chot_thang_member_all on public.gay_chot_thang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_de_xuat (~591 dòng)
alter policy gay_de_xuat_member_all on public.gay_de_xuat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_hoat_dong (~0 dòng)
alter policy gay_hoat_dong_member_all on public.gay_hoat_dong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_ledger (~13 dòng)
alter policy gay_ledger_member_all on public.gay_ledger
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_log (~3376 dòng)
alter policy gay_log_member_all on public.gay_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- gay_loi (~0 dòng)
alter policy gay_loi_member_all on public.gay_loi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- giai_thuong_lop_giai (~11 dòng)
alter policy giai_thuong_lop_giai_member_all on public.giai_thuong_lop_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- giai_thuong_slot (~0 dòng)
alter policy giai_thuong_slot_member_all on public.giai_thuong_slot
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- han_nop_ngoai_le (~0 dòng)
alter policy han_nop_ngoai_le_all on public.han_nop_ngoai_le
  using ((SELECT co_quyen_ghi('han_nop'::text)))
  with check ((SELECT co_quyen_ghi('han_nop'::text)));
alter policy han_nop_ngoai_le_sel on public.han_nop_ngoai_le
  using ((SELECT la_thanh_vien()));

-- han_nop_ngoai_le_log (~0 dòng)
alter policy han_nop_ngoai_le_log_sel on public.han_nop_ngoai_le_log
  using ((SELECT la_thanh_vien()));

-- hau_kiem (~0 dòng)
alter policy hau_kiem_doc on public.hau_kiem
  using ((SELECT la_thanh_vien()));

-- he_thong_cong_tac (~1 dòng)
alter policy he_thong_cong_tac_doc on public.he_thong_cong_tac
  using ((SELECT la_thanh_vien()));

-- he_thong_cong_tac_log (~2 dòng)
alter policy he_thong_cong_tac_log_doc on public.he_thong_cong_tac_log
  using ((SELECT la_thanh_vien()));

-- hgt_ban_do (~0 dòng)
alter policy hgt_ban_do_member_all on public.hgt_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_cau_thieu_dang (~440 dòng)
alter policy hgt_bdm_cau_thieu_dang_member_all on public.hgt_bdm_cau_thieu_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_de_xuat (~93 dòng)
alter policy hgt_bdm_de_xuat_member_all on public.hgt_bdm_de_xuat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_gan_cau (~3034 dòng)
alter policy hgt_bdm_gan_cau_member_all on public.hgt_bdm_gan_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_kho_ds (~478 dòng)
alter policy hgt_bdm_kho_ds_member_all on public.hgt_bdm_kho_ds
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_kiem_mau (~0 dòng)
alter policy hgt_bdm_kiem_mau_member_all on public.hgt_bdm_kiem_mau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_bdm_tu_choi (~7 dòng)
alter policy hgt_bdm_tu_choi_doc on public.hgt_bdm_tu_choi
  using ((SELECT la_thanh_vien()));
alter policy hgt_bdm_tu_choi_ghi on public.hgt_bdm_tu_choi
  with check ((SELECT la_thanh_vien()));

-- hgt_cau_form_tn (~543 dòng)
alter policy hgt_cau_form_tn_member_all on public.hgt_cau_form_tn
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_cau_hoi (~3934 dòng)
alter policy hgt_cau_hoi_member_all on public.hgt_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_cau_hoi_yeu_cau_giai (~0 dòng)
alter policy hgt_cau_hoi_yeu_cau_giai_member_all on public.hgt_cau_hoi_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_cau_khuon (~2343 dòng)
alter policy hgt_cau_khuon_member_all on public.hgt_cau_khuon
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_chuyen_de_ly_thuyet (~0 dòng)
alter policy hgt_chuyen_de_ly_thuyet_member_all on public.hgt_chuyen_de_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_cum_bai (~0 dòng)
alter policy hgt_cum_bai_member_all on public.hgt_cum_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_cum_tien_de (~0 dòng)
alter policy hgt_cum_tien_de_member_all on public.hgt_cum_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_dang_ly_thuyet (~0 dòng)
alter policy hgt_dang_ly_thuyet_member_all on public.hgt_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_dang_tien_de (~0 dòng)
alter policy hgt_dang_tien_de_member_all on public.hgt_dang_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hgt_mcq_rule (~0 dòng)
alter policy hgt_mcq_rule_member_all on public.hgt_mcq_rule
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bai (~295 dòng)
alter policy hinh_bai_member_all on public.hinh_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bai_trang_thai_log (~5 dòng)
alter policy hinh_bai_trang_thai_log_member on public.hinh_bai_trang_thai_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan (~414 dòng)
alter policy hinh_baitoan_member_all on public.hinh_baitoan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan_bien_the (~0 dòng)
alter policy hinh_baitoan_bien_the_member_all on public.hinh_baitoan_bien_the
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan_bo_de (~0 dòng)
alter policy hinh_baitoan_bo_de_member_all on public.hinh_baitoan_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan_dang (~0 dòng)
alter policy hinh_baitoan_dang_member_all on public.hinh_baitoan_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan_do_kho (~0 dòng)
alter policy hinh_baitoan_do_kho_member_all on public.hinh_baitoan_do_kho
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_baitoan_yeu_cau_giai (~0 dòng)
alter policy hinh_baitoan_yeu_cau_giai_member_all on public.hinh_baitoan_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_ban_do (~0 dòng)
alter policy hinh_ban_do_member_all on public.hinh_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bien_the_yeu_cau_giai (~0 dòng)
alter policy hinh_bien_the_yeu_cau_giai_member_all on public.hinh_bien_the_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bo_de (~0 dòng)
alter policy hinh_bo_de_member_all on public.hinh_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bo_de_ly_thuyet (~0 dòng)
alter policy hinh_bo_de_ly_thuyet_member_all on public.hinh_bo_de_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_bo_de_vi_du (~0 dòng)
alter policy hinh_bo_de_vi_du_member_all on public.hinh_bo_de_vi_du
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_cach_bo_de (~0 dòng)
alter policy hinh_cach_bo_de_member_all on public.hinh_cach_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_cach_giai (~419 dòng)
alter policy hinh_cach_giai_member_all on public.hinh_cach_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_cach_tien_de (~47 dòng)
alter policy hinh_cach_tien_de_member_all on public.hinh_cach_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_dang (~0 dòng)
alter policy hinh_dang_member_all on public.hinh_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_dang_ly_thuyet (~0 dòng)
alter policy hinh_dang_ly_thuyet_member_all on public.hinh_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_dang_vi_du (~0 dòng)
alter policy hinh_dang_vi_du_member_all on public.hinh_dang_vi_du
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_form_dien (~0 dòng)
alter policy hinh_form_dien_member_all on public.hinh_form_dien
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_bai (~3 dòng)
alter policy hinh_hoc_bai_member_all on public.hinh_hoc_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_bai_ly_thuyet (~3 dòng)
alter policy hinh_hoc_bai_ly_thuyet_member_all on public.hinh_hoc_bai_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_cau_form_tn (~0 dòng)
alter policy hinh_hoc_cau_form_tn_member_all on public.hinh_hoc_cau_form_tn
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_cau_hoi (~3532 dòng)
alter policy hinh_hoc_cau_hoi_member_all on public.hinh_hoc_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_cau_hoi_yeu_cau_giai (~0 dòng)
alter policy hinh_hoc_cau_hoi_yeu_cau_giai_member_all on public.hinh_hoc_cau_hoi_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_cum_bai (~0 dòng)
alter policy hinh_hoc_cum_bai_member_all on public.hinh_hoc_cum_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_cum_tien_de (~0 dòng)
alter policy hinh_hoc_cum_tien_de_member_all on public.hinh_hoc_cum_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_hoc_mcq_rule (~0 dòng)
alter policy hinh_hoc_mcq_rule_member_all on public.hinh_hoc_mcq_rule
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_loi_cm (~0 dòng)
alter policy hinh_loi_cm_member_all on public.hinh_loi_cm
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_ly_do (~0 dòng)
alter policy hinh_ly_do_member_all on public.hinh_ly_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_mo_hinh (~77 dòng)
alter policy hinh_mo_hinh_member_all on public.hinh_mo_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_mo_hinh_cha (~15 dòng)
alter policy hinh_mo_hinh_cha_member_all on public.hinh_mo_hinh_cha
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_mo_hinh_ly_thuyet (~0 dòng)
alter policy hinh_mo_hinh_ly_thuyet_member_all on public.hinh_mo_hinh_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_nhom_mo_hinh (~2 dòng)
alter policy hinh_nhom_mo_hinh_member_all on public.hinh_nhom_mo_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_y (~627 dòng)
alter policy hinh_y_member_all on public.hinh_y
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_y_bo_de (~0 dòng)
alter policy hinh_y_bo_de_member_all on public.hinh_y_bo_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_y_dang (~0 dòng)
alter policy hinh_y_dang_member_all on public.hinh_y_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_y_nhan_de_xuat (~0 dòng)
alter policy hinh_y_nhan_de_xuat_member_all on public.hinh_y_nhan_de_xuat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hinh_y_nhan_tu_choi (~0 dòng)
alter policy hinh_y_nhan_tu_choi_doc on public.hinh_y_nhan_tu_choi
  using ((SELECT la_thanh_vien()));
alter policy hinh_y_nhan_tu_choi_ghi on public.hinh_y_nhan_tu_choi
  with check ((SELECT la_thanh_vien()));

-- hinh_yeu_da_day (~0 dòng)
alter policy hinh_yeu_da_day_member_read on public.hinh_yeu_da_day
  using ((SELECT la_thanh_vien()));

-- hoa_don (~0 dòng)
alter policy hoa_don_tien_read on public.hoa_don
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoa_don_tien_write on public.hoa_don
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoa_don_dong (~0 dòng)
alter policy hoa_don_dong_tien_read on public.hoa_don_dong
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoa_don_dong_tien_write on public.hoa_don_dong
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoa_don_log (~25 dòng)
alter policy hoa_don_log_tien_read on public.hoa_don_log
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoa_don_log_tien_write on public.hoa_don_log
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoat_dong_phong (~0 dòng)
alter policy hoat_dong_phong_member_all on public.hoat_dong_phong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoat_dong_phong_log (~0 dòng)
alter policy hoat_dong_phong_log_member_all on public.hoat_dong_phong_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_phi_cong_thuc (~0 dòng)
alter policy hoc_phi_cong_thuc_tien_read on public.hoc_phi_cong_thuc
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoc_phi_cong_thuc_tien_write on public.hoc_phi_cong_thuc
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoc_phi_phat_sinh (~0 dòng)
alter policy hoc_phi_phat_sinh_tien_read on public.hoc_phi_phat_sinh
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoc_phi_phat_sinh_tien_write on public.hoc_phi_phat_sinh
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoc_phi_tin_dung (~0 dòng)
alter policy hoc_phi_tin_dung_tien_read on public.hoc_phi_tin_dung
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoc_phi_tin_dung_tien_write on public.hoc_phi_tin_dung
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoc_phi_xet_duyet (~0 dòng)
alter policy hoc_phi_xet_duyet_tien_read on public.hoc_phi_xet_duyet
  using ((SELECT co_chuc_nang('hocphi'::text)));
alter policy hoc_phi_xet_duyet_tien_write on public.hoc_phi_xet_duyet
  using ((SELECT co_quyen_ghi('hocphi'::text)))
  with check ((SELECT co_quyen_ghi('hocphi'::text)));

-- hoc_sinh (~506 dòng)
alter policy hoc_sinh_member_all on public.hoc_sinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_sinh_he_so (~0 dòng)
alter policy hoc_sinh_he_so_member_all on public.hoc_sinh_he_so
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_sinh_lop (~7 dòng)
alter policy hoc_sinh_lop_member_all on public.hoc_sinh_lop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_sinh_lop_log (~8 dòng)
alter policy hoc_sinh_lop_log_member_all on public.hoc_sinh_lop_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_sinh_thanh_tich_ghim (~0 dòng)
alter policy hoc_sinh_thanh_tich_ghim_member_all on public.hoc_sinh_thanh_tich_ghim
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoc_tu_dau_dang (~275 dòng)
alter policy hoc_tu_dau_dang_staff on public.hoc_tu_dau_dang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hoi_dap_bot (~0 dòng)
alter policy hoi_dap_bot_member_doc on public.hoi_dap_bot
  using ((SELECT hoi_dap_duoc_dung()));

-- hoi_dap_nhan_su (~0 dòng)
alter policy hoi_dap_nhan_su_member_doc on public.hoi_dap_nhan_su
  using ((SELECT hoi_dap_duoc_dung()));
alter policy hoi_dap_nhan_su_member_hoi on public.hoi_dap_nhan_su
  with check (((SELECT hoi_dap_duoc_dung()) AND (nguoi = (SELECT jwt_uid()))));

-- hom_thu (~289 dòng)
alter policy hom_thu_sel on public.hom_thu
  using ((nhan_su_id = (SELECT current_nhan_su_id())));
alter policy hom_thu_upd on public.hom_thu
  using ((nhan_su_id = (SELECT current_nhan_su_id())))
  with check ((nhan_su_id = (SELECT current_nhan_su_id())));

-- hs_giai_thuong (~0 dòng)
alter policy hs_giai_thuong_self on public.hs_giai_thuong
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy hs_giai_thuong_staff on public.hs_giai_thuong
  using ((SELECT la_thanh_vien()));

-- hs_giao_dien (~323 dòng)
alter policy hs_giao_dien_doc_cua_minh on public.hs_giao_dien
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));

-- hs_huy_hieu_dat (~0 dòng)
alter policy hs_huy_hieu_dat_member_all on public.hs_huy_hieu_dat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_huy_hieu_khoe (~0 dòng)
alter policy hs_huy_hieu_khoe_member_all on public.hs_huy_hieu_khoe
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_huy_hieu_trao (~0 dòng)
alter policy hs_huy_hieu_trao_member_all on public.hs_huy_hieu_trao
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_level (~112 dòng)
alter policy hs_level_member_all on public.hs_level
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_level_log (~58 dòng)
alter policy hs_level_log_member_all on public.hs_level_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_mo_app (~2365 dòng)
alter policy hs_mo_app_doc on public.hs_mo_app
  using (((hoc_sinh_id = (SELECT my_hoc_sinh_id())) OR (SELECT la_thanh_vien())));

-- hs_moi_buoc (~5 dòng)
alter policy hs_moi_buoc_doc on public.hs_moi_buoc
  using ((SELECT co_chuc_nang('hs_moi'::text)));
alter policy hs_moi_buoc_sua on public.hs_moi_buoc
  using ((SELECT co_quyen_ghi('hs_moi'::text)))
  with check ((SELECT co_quyen_ghi('hs_moi'::text)));
alter policy hs_moi_buoc_them on public.hs_moi_buoc
  with check ((SELECT co_quyen_ghi('hs_moi'::text)));

-- hs_moi_tick (~71 dòng)
alter policy hs_moi_tick_doc on public.hs_moi_tick
  using ((SELECT co_chuc_nang('hs_moi'::text)));
alter policy hs_moi_tick_them on public.hs_moi_tick
  with check ((SELECT co_quyen_ghi('hs_moi'::text)));
alter policy hs_moi_tick_xoa on public.hs_moi_tick
  using ((SELECT co_quyen_ghi('hs_moi'::text)));

-- hs_moi_tick_log (~113 dòng)
alter policy hs_moi_tick_log_doc on public.hs_moi_tick_log
  using ((SELECT co_chuc_nang('hs_moi'::text)));

-- hs_thanh_tuu_thang (~0 dòng)
alter policy hs_thanh_tuu_thang_member_all on public.hs_thanh_tuu_thang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- hs_tin_moi (~0 dòng)
alter policy hs_tin_moi_sel on public.hs_tin_moi
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy hs_tin_moi_staff on public.hs_tin_moi
  using ((SELECT la_thanh_vien()));
alter policy hs_tin_moi_upd on public.hs_tin_moi
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())))
  with check ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));

-- hsta_chot (~0 dòng)
alter policy hsta_chot_ghi on public.hsta_chot
  using ((SELECT co_quyen_ghi('db_chatluong'::text)))
  with check ((SELECT co_quyen_ghi('db_chatluong'::text)));
alter policy hsta_chot_select on public.hsta_chot
  using ((SELECT la_thanh_vien()));

-- hsta_chot_log (~0 dòng)
alter policy hsta_chot_log_select on public.hsta_chot_log
  using ((SELECT la_thanh_vien()));

-- hsta_ghi_them (~0 dòng)
alter policy hsta_ghi_them_ghi on public.hsta_ghi_them
  using ((SELECT co_quyen_ghi('db_chatluong'::text)))
  with check ((SELECT co_quyen_ghi('db_chatluong'::text)));
alter policy hsta_ghi_them_select on public.hsta_ghi_them
  using ((SELECT la_thanh_vien()));

-- huy_hieu (~0 dòng)
alter policy huy_hieu_member_all on public.huy_hieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- huy_hieu_dieu_kien (~0 dòng)
alter policy huy_hieu_dieu_kien_member_all on public.huy_hieu_dieu_kien
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- huy_hieu_thang_sao (~0 dòng)
alter policy huy_hieu_thang_sao_member_all on public.huy_hieu_thang_sao
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khao_sat_hs (~0 dòng)
alter policy khao_sat_hs_member_all on public.khao_sat_hs
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khao_sat_hs_quan_he (~0 dòng)
alter policy khao_sat_hs_quan_he_member_all on public.khao_sat_hs_quan_he
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- kho_cau_khuon_log (~33943 dòng)
alter policy kho_cau_khuon_log_member_read on public.kho_cau_khuon_log
  using ((SELECT la_thanh_vien()));

-- kho_de_sau (~243 dòng)
alter policy kho_de_sau_doc on public.kho_de_sau
  using ((SELECT la_thanh_vien()));
alter policy kho_de_sau_ghi on public.kho_de_sau
  with check ((SELECT la_thanh_vien()));

-- kho_kiem_lo (~0 dòng)
alter policy kho_kiem_lo_member_all on public.kho_kiem_lo
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- kho_nhan_xet (~20 dòng)
alter policy kho_nhan_xet_doc on public.kho_nhan_xet
  using ((SELECT la_thanh_vien()));
alter policy kho_nhan_xet_ghi on public.kho_nhan_xet
  with check ((SELECT la_thanh_vien()));

-- kho_nhan_xet_xu_ly (~0 dòng)
alter policy kho_nhan_xet_xu_ly_doc on public.kho_nhan_xet_xu_ly
  using ((SELECT la_thanh_vien()));
alter policy kho_nhan_xet_xu_ly_ghi on public.kho_nhan_xet_xu_ly
  with check ((SELECT la_thanh_vien()));

-- kho_tag_log (~0 dòng)
alter policy kho_tag_log_member_all on public.kho_tag_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_ban_do (~8 dòng)
alter policy khtn_ban_do_member_all on public.khtn_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_chu_de (~24 dòng)
alter policy khtn_bdm_chu_de_member_all on public.khtn_bdm_chu_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_chuyen_de (~71 dòng)
alter policy khtn_bdm_chuyen_de_member_all on public.khtn_bdm_chuyen_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_dang_bai (~657 dòng)
alter policy khtn_bdm_dang_bai_member_all on public.khtn_bdm_dang_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_gan_cau (~5759 dòng)
alter policy khtn_bdm_gan_cau_member_all on public.khtn_bdm_gan_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_log (~6887 dòng)
alter policy khtn_bdm_log_member_read on public.khtn_bdm_log
  using ((SELECT la_thanh_vien()));

-- khtn_bdm_nhom (~285 dòng)
alter policy khtn_bdm_nhom_member_all on public.khtn_bdm_nhom
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_nhom_tien_de (~0 dòng)
alter policy khtn_bdm_nhom_tien_de_member_all on public.khtn_bdm_nhom_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_bdm_o (~71 dòng)
alter policy khtn_bdm_o_member_all on public.khtn_bdm_o
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_cau_form_tn (~0 dòng)
alter policy khtn_cau_form_tn_member_all on public.khtn_cau_form_tn
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_cau_hoi (~11825 dòng)
alter policy khtn_cau_hoi_member_all on public.khtn_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_cau_hoi_yeu_cau_giai (~0 dòng)
alter policy khtn_cau_hoi_yeu_cau_giai_member_all on public.khtn_cau_hoi_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_chuyen_de_ly_thuyet (~0 dòng)
alter policy khtn_chuyen_de_ly_thuyet_member_all on public.khtn_chuyen_de_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_cum_bai (~657 dòng)
alter policy khtn_cum_bai_member_all on public.khtn_cum_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_cum_tien_de (~0 dòng)
alter policy khtn_cum_tien_de_member_all on public.khtn_cum_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_dang_ly_thuyet (~17 dòng)
alter policy khtn_dang_ly_thuyet_member_all on public.khtn_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_dang_tien_de (~0 dòng)
alter policy khtn_dang_tien_de_member_all on public.khtn_dang_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- khtn_mcq_rule (~0 dòng)
alter policy khtn_mcq_rule_member_all on public.khtn_mcq_rule
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ky_thi (~21 dòng)
alter policy ky_thi_member_all on public.ky_thi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- lich_test_dong (~0 dòng)
alter policy lich_test_dong_member_all on public.lich_test_dong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- lich_test_khung (~13 dòng)
alter policy lich_test_khung_member_all on public.lich_test_khung
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- lich_test_log (~14 dòng)
alter policy lich_test_log_member_select on public.lich_test_log
  using ((SELECT la_thanh_vien()));

-- lich_truc_bo_tro (~4 dòng)
alter policy lich_truc_bo_tro_member_all on public.lich_truc_bo_tro
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- linkgen_jobs (~2671 dòng)
alter policy linkgen_jobs_member_all on public.linkgen_jobs
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- lop (~0 dòng)
alter policy lop_member_all on public.lop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- lop_bac (~0 dòng)
alter policy lop_bac_member_all on public.lop_bac
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- may_man_cau_hinh (~0 dòng)
alter policy may_man_cau_hinh_member_all on public.may_man_cau_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- may_man_hs_luot (~1213 dòng)
alter policy may_man_hs_luot_self on public.may_man_hs_luot
  using ((hoc_sinh_id = (SELECT my_hoc_sinh_id())));
alter policy may_man_hs_luot_staff_read on public.may_man_hs_luot
  using ((SELECT la_thanh_vien()));

-- may_man_luot (~667 dòng)
alter policy may_man_luot_member_all on public.may_man_luot
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- muc_hoc_duoi (~0 dòng)
alter policy muc_hoc_duoi_member_all on public.muc_hoc_duoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- muc_hoc_lieu (~0 dòng)
alter policy muc_hoc_lieu_member_all on public.muc_hoc_lieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- muc_hoc_phi (~0 dòng)
alter policy muc_hoc_phi_member_all on public.muc_hoc_phi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- muc_nang_luc (~0 dòng)
alter policy muc_nang_luc_member_all on public.muc_nang_luc
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- nhan_su (~49 dòng)
alter policy nhan_su_member_all on public.nhan_su
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- nhan_su_mon (~4 dòng)
alter policy nhan_su_mon_member_all on public.nhan_su_mon
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- nhan_su_nhac_viec (~1 dòng)
alter policy nhan_su_nhac_viec_chu on public.nhan_su_nhac_viec
  using ((nhan_su_id = (SELECT current_nhan_su_id())))
  with check ((nhan_su_id = (SELECT current_nhan_su_id())));

-- nhan_su_nhac_viec_xong (~7 dòng)
alter policy nhan_su_nhac_viec_xong_chu on public.nhan_su_nhac_viec_xong
  using ((EXISTS ( SELECT 1
   FROM nhan_su_nhac_viec v
  WHERE ((v.id = nhan_su_nhac_viec_xong.nhac_viec_id) AND (v.nhan_su_id = (SELECT current_nhan_su_id()))))))
  with check ((EXISTS ( SELECT 1
   FROM nhan_su_nhac_viec v
  WHERE ((v.id = nhan_su_nhac_viec_xong.nhac_viec_id) AND (v.nhan_su_id = (SELECT current_nhan_su_id()))))));

-- nhan_su_order (~6 dòng)
alter policy nhan_su_order_sel on public.nhan_su_order
  using (((nguoi_dat_id = (SELECT current_nhan_su_id())) OR (nguoi_nhan_id = (SELECT current_nhan_su_id()))));

-- nhan_su_order_log (~16 dòng)
alter policy nhan_su_order_log_sel on public.nhan_su_order_log
  using ((EXISTS ( SELECT 1
   FROM nhan_su_order o
  WHERE ((o.id = nhan_su_order_log.order_id) AND ((o.nguoi_dat_id = (SELECT current_nhan_su_id())) OR (o.nguoi_nhan_id = (SELECT current_nhan_su_id())))))));

-- nhan_su_plan (~0 dòng)
alter policy nhan_su_plan_chu_doc on public.nhan_su_plan
  using ((nhan_su_id = (SELECT current_nhan_su_id())));
alter policy nhan_su_plan_chu_sua on public.nhan_su_plan
  using ((nhan_su_id = (SELECT current_nhan_su_id())))
  with check ((nhan_su_id = (SELECT current_nhan_su_id())));
alter policy nhan_su_plan_chu_them on public.nhan_su_plan
  with check ((nhan_su_id = (SELECT current_nhan_su_id())));

-- nhan_su_plan_log (~0 dòng)
alter policy nhan_su_plan_log_chu_doc on public.nhan_su_plan_log
  using ((EXISTS ( SELECT 1
   FROM nhan_su_plan p
  WHERE ((p.id = nhan_su_plan_log.plan_id) AND (p.nhan_su_id = (SELECT current_nhan_su_id()))))));

-- nhan_su_team (~1 dòng)
alter policy nhan_su_team_member_all on public.nhan_su_team
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- nhan_xet_mau (~0 dòng)
alter policy nhan_xet_mau_member_all on public.nhan_xet_mau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- nhiem_vu_cau_hinh (~0 dòng)
alter policy nhiem_vu_cau_hinh_member_all on public.nhiem_vu_cau_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- phan_cong_lop (~4 dòng)
alter policy phan_cong_lop_member_all on public.phan_cong_lop
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- phan_cong_lop_log (~20 dòng)
alter policy phan_cong_lop_log_doc on public.phan_cong_lop_log
  using (((SELECT co_chuc_nang('ta_cong_duyet'::text)) OR (SELECT co_chuc_nang('ta_luong'::text))));

-- phan_cong_ops (~0 dòng)
alter policy phan_cong_ops_member_all on public.phan_cong_ops
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- phan_cong_quan_ly_khoi (~18 dòng)
alter policy pcqlk_doc on public.phan_cong_quan_ly_khoi
  using ((SELECT la_thanh_vien()));

-- phan_cong_quan_ly_khoi_log (~18 dòng)
alter policy pcqlk_log_doc on public.phan_cong_quan_ly_khoi_log
  using ((SELECT la_thanh_vien()));

-- phong (~1 dòng)
alter policy phong_member_all on public.phong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- phu_huynh (~5 dòng)
alter policy phu_huynh_member_all on public.phu_huynh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- prep_phong (~770 dòng)
alter policy prep_phong_member_all on public.prep_phong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- push_dang_ky (~24 dòng)
alter policy push_dang_ky_own on public.push_dang_ky
  using ((nhan_su_id = ( SELECT tai_khoan.nhan_su_id
   FROM tai_khoan
  WHERE (tai_khoan.id = (SELECT jwt_uid())))))
  with check ((nhan_su_id = ( SELECT tai_khoan.nhan_su_id
   FROM tai_khoan
  WHERE (tai_khoan.id = (SELECT jwt_uid())))));

-- qlht_doi_qua (~480 dòng)
alter policy qlht_doi_qua_member_sel on public.qlht_doi_qua
  using ((SELECT la_thanh_vien()));
alter policy qlht_doi_qua_sel on public.qlht_doi_qua
  using (((SELECT current_nhan_su_id()) IS NOT NULL));

-- qlht_log (~1017 dòng)
alter policy qlht_log_member_sel on public.qlht_log
  using ((SELECT la_thanh_vien()));

-- qlht_qua (~11 dòng)
alter policy qlht_qua_member_sel on public.qlht_qua
  using ((SELECT la_thanh_vien()));
alter policy qlht_qua_sel on public.qlht_qua
  using (((SELECT current_nhan_su_id()) IS NOT NULL));

-- qlht_qua_nhap (~26 dòng)
alter policy qlht_qua_nhap_member_sel on public.qlht_qua_nhap
  using ((SELECT la_thanh_vien()));
alter policy qlht_qua_nhap_sel on public.qlht_qua_nhap
  using (((SELECT current_nhan_su_id()) IS NOT NULL));

-- qlht_qua_order (~10 dòng)
alter policy qlht_qua_order_member_sel on public.qlht_qua_order
  using ((SELECT la_thanh_vien()));
alter policy qlht_qua_order_sel on public.qlht_qua_order
  using (((SELECT current_nhan_su_id()) IS NOT NULL));

-- qlht_smoke_test (~0 dòng)
alter policy qlht_smoke_insert on public.qlht_smoke_test
  with check ((nguoi_tao = (SELECT current_nhan_su_id())));
alter policy qlht_smoke_select on public.qlht_smoke_test
  using (((SELECT current_nhan_su_id()) IS NOT NULL));
alter policy qlht_smoke_update on public.qlht_smoke_test
  using ((nguoi_tao = (SELECT current_nhan_su_id())))
  with check ((nguoi_tao = (SELECT current_nhan_su_id())));

-- qlht_xu_ledger (~7036 dòng)
alter policy qlht_xu_ledger_ins on public.qlht_xu_ledger
  with check (((SELECT current_nhan_su_id()) IS NOT NULL));
alter policy qlht_xu_ledger_member_sel on public.qlht_xu_ledger
  using ((SELECT la_thanh_vien()));
alter policy qlht_xu_ledger_sel on public.qlht_xu_ledger
  using (((SELECT current_nhan_su_id()) IS NOT NULL));

-- question_accepted_answers (~0 dòng)
alter policy qaa_staff on public.question_accepted_answers
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- quy_trinh (~0 dòng)
alter policy quy_trinh_member_all on public.quy_trinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- rank_bac (~0 dòng)
alter policy rank_bac_member_all on public.rank_bac
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- rank_cau_hinh (~0 dòng)
alter policy rank_cau_hinh_member_all on public.rank_cau_hinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- rank_thang_mat_et (~0 dòng)
alter policy rank_thang_mat_et_member_all on public.rank_thang_mat_et
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- shop_don (~0 dòng)
alter policy shop_don_member_all on public.shop_don
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- shop_vat_pham (~0 dòng)
alter policy shop_vat_pham_member_all on public.shop_vat_pham
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- soan_cum (~0 dòng)
alter policy soan_cum_member_all on public.soan_cum
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- soan_cum_lich_su (~0 dòng)
alter policy soan_cum_lich_su_member_read on public.soan_cum_lich_su
  using ((SELECT la_thanh_vien()));

-- soan_tab_chung (~0 dòng)
alter policy soan_tab_chung_member_all on public.soan_tab_chung
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- soan_thu_muc (~0 dòng)
alter policy soan_thu_muc_member_all on public.soan_thu_muc
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- sotay_cong_thuc (~0 dòng)
alter policy sotay_cong_thuc_doc on public.sotay_cong_thuc
  using ((SELECT co_chuc_nang('sotay'::text)));
alter policy sotay_cong_thuc_ghi on public.sotay_cong_thuc
  with check ((SELECT co_quyen_ghi('sotay'::text)));
alter policy sotay_cong_thuc_sua on public.sotay_cong_thuc
  using ((SELECT co_quyen_ghi('sotay'::text)))
  with check ((SELECT co_quyen_ghi('sotay'::text)));

-- sotay_ct_chu_de (~0 dòng)
alter policy sotay_ct_chu_de_doc on public.sotay_ct_chu_de
  using ((SELECT co_chuc_nang('sotay'::text)));
alter policy sotay_ct_chu_de_ghi on public.sotay_ct_chu_de
  with check ((SELECT co_quyen_ghi('sotay'::text)));
alter policy sotay_ct_chu_de_sua on public.sotay_ct_chu_de
  using ((SELECT co_quyen_ghi('sotay'::text)))
  with check ((SELECT co_quyen_ghi('sotay'::text)));

-- sotay_ct_hinh (~0 dòng)
alter policy sotay_ct_hinh_doc on public.sotay_ct_hinh
  using ((SELECT co_chuc_nang('sotay'::text)));
alter policy sotay_ct_hinh_ghi on public.sotay_ct_hinh
  with check ((SELECT co_quyen_ghi('sotay'::text)));
alter policy sotay_ct_hinh_sua on public.sotay_ct_hinh
  using ((SELECT co_quyen_ghi('sotay'::text)))
  with check ((SELECT co_quyen_ghi('sotay'::text)));

-- sotay_ct_lich_su (~0 dòng)
alter policy sotay_ct_lich_su_doc on public.sotay_ct_lich_su
  using ((SELECT co_chuc_nang('sotay'::text)));

-- ta_cham_cong (~345 dòng)
alter policy ta_cham_cong_doc on public.ta_cham_cong
  using (((nhan_su_id = (SELECT current_nhan_su_id())) OR (SELECT co_chuc_nang('ta_cong_duyet'::text)) OR (SELECT co_chuc_nang('ta_luong'::text))));

-- ta_cong_log (~1722 dòng)
alter policy ta_cong_log_doc on public.ta_cong_log
  using (((SELECT co_chuc_nang('ta_cong_duyet'::text)) OR (SELECT co_chuc_nang('ta_luong'::text))));

-- ta_cong_viec (~544 dòng)
alter policy ta_cong_viec_doc on public.ta_cong_viec
  using (((nhan_su_id = (SELECT current_nhan_su_id())) OR (SELECT co_chuc_nang('ta_cong_duyet'::text)) OR (SELECT co_chuc_nang('ta_luong'::text))));

-- ta_dinh_muc (~0 dòng)
alter policy ta_dinh_muc_member_all on public.ta_dinh_muc
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ta_don_gia (~0 dòng)
alter policy ta_don_gia_doc on public.ta_don_gia
  using ((SELECT co_chuc_nang('ta_luong'::text)));

-- ta_dot_khai_bu (~0 dòng)
alter policy ta_dot_khai_bu_doc on public.ta_dot_khai_bu
  using ((SELECT la_thanh_vien()));

-- ta_loai_viec (~0 dòng)
alter policy ta_loai_viec_doc on public.ta_loai_viec
  using ((SELECT la_thanh_vien()));

-- ta_luong_ky (~0 dòng)
alter policy ta_luong_ky_doc on public.ta_luong_ky
  using ((SELECT la_thanh_vien()));

-- ta_luong_ky_dong (~0 dòng)
alter policy ta_luong_ky_dong_doc on public.ta_luong_ky_dong
  using (((SELECT co_chuc_nang('ta_luong'::text)) OR (nhan_su_id = (SELECT current_nhan_su_id()))));

-- ta_vang (~0 dòng)
alter policy ta_vang_member_all on public.ta_vang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tai_khoan (~11 dòng)
alter policy tai_khoan_member_all on public.tai_khoan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));
alter policy tai_khoan_self_select on public.tai_khoan
  using ((id = (SELECT jwt_uid())));

-- tai_lieu (~4246 dòng)
alter policy tai_lieu_member_all on public.tai_lieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tai_lieu_cau (~105980 dòng)
alter policy tai_lieu_cau_member_all on public.tai_lieu_cau
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tai_lieu_duyet_log (~400 dòng)
alter policy tai_lieu_duyet_log_staff on public.tai_lieu_duyet_log
  using ((SELECT la_thanh_vien()));

-- tai_lieu_phan (~29007 dòng)
alter policy tai_lieu_phan_member_all on public.tai_lieu_phan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- task_phat_trien (~50 dòng)
alter policy task_pt_sel on public.task_phat_trien
  using ((SELECT la_thanh_vien()));

-- task_phat_trien_log (~163 dòng)
alter policy task_pt_log_sel on public.task_phat_trien_log
  using ((SELECT la_thanh_vien()));

-- team (~1 dòng)
alter policy team_member_all on public.team
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- test_dau_vao_phan_cong (~0 dòng)
alter policy test_dau_vao_phan_cong_member_all on public.test_dau_vao_phan_cong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- test_dau_vao_phan_cong_log (~0 dòng)
alter policy test_dau_vao_phan_cong_log_member_all on public.test_dau_vao_phan_cong_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- test_dau_vao_thoi_luong (~0 dòng)
alter policy test_dau_vao_thoi_luong_member_all on public.test_dau_vao_thoi_luong
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tg_ban_tin (~360 dòng)
alter policy tg_ban_tin_doc on public.tg_ban_tin
  using ((SELECT co_chuc_nang('ta_cong_duyet'::text)));

-- tg_lien_ket (~1 dòng)
alter policy tg_lien_ket_doc on public.tg_lien_ket
  using (((SELECT co_chuc_nang('ta_cong_duyet'::text)) OR (nhan_su_id = (SELECT current_nhan_su_id()))));

-- tg_nhom (~0 dòng)
alter policy tg_nhom_doc on public.tg_nhom
  using ((SELECT co_chuc_nang('ta_cong_duyet'::text)));

-- tg_tin (~924 dòng)
alter policy tg_tin_doc on public.tg_tin
  using ((SELECT co_chuc_nang('ta_cong_duyet'::text)));

-- thanh_tich_loai (~0 dòng)
alter policy thanh_tich_loai_member_all on public.thanh_tich_loai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- thanh_toan (~25 dòng)
alter policy thanh_toan_member_all on public.thanh_toan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- thanh_tuu (~0 dòng)
alter policy thanh_tuu_member_all on public.thanh_tuu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- thanh_tuu_dat (~496 dòng)
alter policy thanh_tuu_dat_doc on public.thanh_tuu_dat
  using (((hoc_sinh_id = (SELECT my_hoc_sinh_id())) OR (SELECT la_thanh_vien())));

-- thi_thu_anh (~0 dòng)
alter policy thi_thu_anh_hs_insert on public.thi_thu_anh
  with check ((thi_thu_anh_ghi_duoc(bai_lam_id, bai_test_cau_id) AND (path ~~ (((SELECT my_hoc_sinh_id()))::text || '/%'::text)) AND (( SELECT count(*) AS count
   FROM thi_thu_anh a
  WHERE ((a.bai_lam_id = thi_thu_anh.bai_lam_id) AND (a.bai_test_cau_id = thi_thu_anh.bai_test_cau_id))) < 8)));
alter policy thi_thu_anh_hs_read on public.thi_thu_anh
  using ((EXISTS ( SELECT 1
   FROM bai_lam bl
  WHERE ((bl.id = thi_thu_anh.bai_lam_id) AND (bl.hoc_sinh_id = (SELECT my_hoc_sinh_id()))))));
alter policy thi_thu_anh_staff on public.thi_thu_anh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- thoi_khoa_bieu (~0 dòng)
alter policy thoi_khoa_bieu_member_all on public.thoi_khoa_bieu
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- thu_thach_luot (~17 dòng)
alter policy thu_thach_luot_member_all on public.thu_thach_luot
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tich_luy_chot_thang (~0 dòng)
alter policy tich_luy_chot_thang_member_all on public.tich_luy_chot_thang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tinh_nang (~0 dòng)
alter policy tinh_nang_doc on public.tinh_nang
  using ((SELECT co_chuc_nang('tinh_nang'::text)));

-- tinh_nang_log (~2 dòng)
alter policy tinh_nang_log_doc on public.tinh_nang_log
  using ((SELECT co_chuc_nang('tinh_nang'::text)));

-- tinh_nang_lop (~0 dòng)
alter policy tinh_nang_lop_doc on public.tinh_nang_lop
  using ((SELECT co_chuc_nang('tinh_nang'::text)));

-- tln_ai_cham_log (~0 dòng)
alter policy tln_ai_cham_log_staff_read on public.tln_ai_cham_log
  using ((EXISTS ( SELECT 1
   FROM tai_khoan tk
  WHERE ((tk.id = (SELECT jwt_uid())) AND (tk.nhan_su_id IS NOT NULL)))));

-- troly_bao_cao_luu (~16 dòng)
alter policy troly_bao_cao_luu_doc on public.troly_bao_cao_luu
  using ((SELECT troly_duoc_dung()));

-- troly_hoi_dap (~0 dòng)
alter policy troly_hoi_dap_member_all on public.troly_hoi_dap
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- troly_nhan_dinh (~0 dòng)
alter policy troly_nhan_dinh_member_all on public.troly_nhan_dinh
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- troly_ra_soat (~0 dòng)
alter policy troly_ra_soat_member_all on public.troly_ra_soat
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- troly_tuan_so_luu (~2 dòng)
alter policy troly_tuan_so_luu_doc on public.troly_tuan_so_luu
  using ((SELECT troly_duoc_dung()));

-- truong_hoc_dm (~0 dòng)
alter policy truong_hoc_dm_member_all on public.truong_hoc_dm
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_ban_do (~0 dòng)
alter policy tsa_ban_do_member_all on public.tsa_ban_do
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_cau_form_tn (~0 dòng)
alter policy tsa_cau_form_tn_member_all on public.tsa_cau_form_tn
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_cau_hoi (~0 dòng)
alter policy tsa_cau_hoi_member_all on public.tsa_cau_hoi
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_cau_hoi_yeu_cau_giai (~0 dòng)
alter policy tsa_cau_hoi_yeu_cau_giai_member_all on public.tsa_cau_hoi_yeu_cau_giai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_chuyen_de_ly_thuyet (~0 dòng)
alter policy tsa_chuyen_de_ly_thuyet_member_all on public.tsa_chuyen_de_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_cum_bai (~0 dòng)
alter policy tsa_cum_bai_member_all on public.tsa_cum_bai
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_cum_tien_de (~0 dòng)
alter policy tsa_cum_tien_de_member_all on public.tsa_cum_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_dang_ly_thuyet (~0 dòng)
alter policy tsa_dang_ly_thuyet_member_all on public.tsa_dang_ly_thuyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_dang_tien_de (~0 dòng)
alter policy tsa_dang_tien_de_member_all on public.tsa_dang_tien_de
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tsa_mcq_rule (~0 dòng)
alter policy tsa_mcq_rule_member_all on public.tsa_mcq_rule
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tu_luyen_dang_lan (~89003 dòng)
alter policy tu_luyen_dang_lan_staff on public.tu_luyen_dang_lan
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- tuyen_sinh_nhan_bao (~0 dòng)
alter policy tuyen_sinh_nhan_bao_member_all on public.tuyen_sinh_nhan_bao
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ung_vien (~7 dòng)
alter policy ung_vien_member_all on public.ung_vien
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ung_vien_log (~31 dòng)
alter policy ung_vien_log_member_all on public.ung_vien_log
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- ung_vien_viec (~15 dòng)
alter policy ung_vien_viec_member_all on public.ung_vien_viec
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- vai_tro (~2 dòng)
alter policy vai_tro_member_all on public.vai_tro
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- vai_tro_chuc_nang (~43 dòng)
alter policy vai_tro_chuc_nang_member_all on public.vai_tro_chuc_nang
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- vh_ops_task (~1129 dòng)
alter policy vh_ops_task_member_all on public.vh_ops_task
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- vi_tri (~97 dòng)
alter policy vi_tri_member_all on public.vi_tri
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- viec_van_hanh_duyet (~0 dòng)
alter policy viec_van_hanh_duyet_member_all on public.viec_van_hanh_duyet
  using ((SELECT la_thanh_vien()))
  with check ((SELECT la_thanh_vien()));

-- xu_thanh_phan (~3109 dòng)
alter policy xu_thanh_phan_sel on public.xu_thanh_phan
  using (((SELECT current_nhan_su_id()) IS NOT NULL));
