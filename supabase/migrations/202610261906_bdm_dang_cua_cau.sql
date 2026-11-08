-- ============================================================================
-- 202610261906 — bdm_dang_cua_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 "chuyển hẳn sang bản đồ + kho mới". Mig 202610261847 (đổi mã lịch sử đợt 1) đã đổi
--   gami_session_problems.ma_dang sang dạng bài NDB, NHƯNG lưới chấm (client syncDocProblems, gami.ts) mỗi lần mở tab
--   chấm lại "đồng bộ nhãn" ô theo dang_chinh của câu trong KHO CỦA TÀI LIỆU — tài liệu cũ (nhánh Đại) ⇒ mã dạng CŨ ⇒
--   ghi đè ngược NDB về mã cũ, và ô mới của tài liệu cũ vẫn sinh mã cũ.
--   Hàm này cho client hỏi "câu này thuộc dạng bài nào" bằng ĐÚNG đường mastery đang quy (_do_o_bdm — cấp 1, Hình,
--   KHTN… giữ mã cũ), theo công tắc bản đồ (_mastery_bdm_bat). Chỉ trả câu ra được NDB (§1.5: không chắc thì không đổi —
--   client giữ dang_chinh của câu). Một nguồn luật, không chép công thức sang JS (§2.0).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thêm 1 hàm đọc.
-- ============================================================================

create or replace function public.fn_bdm_dang_cua_cau(p_ma_caus text[])
returns table(ma_cau text, ma_dang text)
language sql stable
set search_path = public
as $$
  select x.ma_cau, d.ma_dang
    from (select distinct u as ma_cau from unnest(p_ma_caus) u where u is not null) x
    cross join lateral (select public._do_o_bdm(x.ma_cau, null) as ma_dang) d
   where public.la_thanh_vien() and public._mastery_bdm_bat() and d.ma_dang like 'NDB%'
$$;

comment on function public.fn_bdm_dang_cua_cau(text[]) is
  'Câu → dạng bài NDB theo đúng đường mastery (_do_o_bdm) khi bật bản đồ mới; câu không quy được / cấp 1 / tắt công tắc ⇒ không có dòng. Lưới chấm (gami.ts syncDocProblems) dùng để nhãn ô khớp đổi mã lịch sử (mig 202610261847).';

revoke execute on function public.fn_bdm_dang_cua_cau(text[]) from public, anon;
grant execute on function public.fn_bdm_dang_cua_cau(text[]) to authenticated;
