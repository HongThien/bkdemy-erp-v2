-- ============================================================================
-- 202611131554 — bo_theo_doi_va_retest
-- VÌ SAO (Thùy 13/11): "Bỏ hết những logic trước đây mâu thuẫn với hiện tại" → chọn bỏ 2 mục: (1) danh sách THEO DÕI + Duyệt 2 vòng
--   (đã thay bằng trưởng khối đề xuất → trưởng bộ môn duyệt từ 10/11) · (2) RETEST tầng 2 (HOLD từ 29/09).
--   (1) Hoàn tất ca / hết hạn 14 ngày VẪN ghi em vào bo_tro_theo_doi (nguồn sau_bo_tro) dù không màn nào dùng ⇒ _btyeu_vao_theo_doi_sau_case
--       thành no-op (1 chỗ, cả fn_btyeu_hoan_tat lẫn _btyeu_dong_case_het_han đi qua nó). 30 em đang 'theo_doi' ⇒ kết thúc 'go'
--       (ly_do_ket_thuc ghi rõ) — các báo cáo đếm "đang theo dõi" (fn_bctk_so, fn_qlcl_dang_yeu_hs) tự về 0.
--   (2) Retest: công tắc _btyeu_retest_bat() vẫn false (mọi nhánh retest trong ~15 hàm + app đã tắt theo nó); 25 bài retest treo 'mo'
--       (ngày đã qua từ lâu) ⇒ đóng 'dong'.
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Đổi trạng thái: 30 dòng bo_tro_theo_doi theo_doi → go · 25 bai_test retest mo → dong.
--   Bảng + màn cũ (DuyetBoTroYeuScreen — còn cho WidgetDangYeu mượn khối ET/BTVN) GIỮ làm lịch sử.
-- ============================================================================
create or replace function public._btyeu_vao_theo_doi_sau_case(p_case uuid, p_ly_do text, p_bat_buoc boolean default false, p_tinh_yeu boolean default true)
returns boolean language plpgsql security definer set search_path to 'public' as $$
begin
  -- 13/11 Thùy: bỏ danh sách Theo dõi — sau ca không còn đưa em vào theo dõi; tuần sau trưởng khối chốt lại từ Dashboard học tập.
  return false;
end $$;

update bo_tro_theo_doi set trang_thai = 'go', ket_thuc_at = now(),
       ly_do_ket_thuc = 'Bỏ danh sách Theo dõi (Thùy 13/11) — quyết định bổ trợ chuyển sang trưởng khối đề xuất → trưởng bộ môn duyệt'
 where trang_thai = 'theo_doi';

update bai_test set trang_thai = 'dong', dong_at = coalesce(dong_at, now())
 where loai = 'retest' and trang_thai = 'mo';
