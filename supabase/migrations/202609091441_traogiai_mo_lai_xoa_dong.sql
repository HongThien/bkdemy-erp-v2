-- ============================================================================
-- 202609091441 — traogiai: "Mở lại lớp" XOÁ dòng giai_thuong_lop_thang thay vì upsert NULL
-- ----------------------------------------------------------------------------
-- VÌ SAO: §1.5 CLAUDE.md — "thiếu data = KHÔNG có dòng, không phải dòng có ô NULL". Trạng thái
-- "đang làm" của (lớp × tháng) = không có dòng; bản 202609091431 (áp cách đây vài phút, cùng phiên)
-- để lại dòng (hoan_thanh_at NULL, hoan_thanh_boi NULL) sau khi mở lại → dòng rỗng vô nghĩa,
-- đếm/join về sau dễ đọc nhầm. fn_traogiai_thang/fn_traogiai_kiem_khoa đã đọc theo
-- `hoan_thanh_at is not null` nên không đổi gì phía đọc.
--
-- MẤT GÌ (Luật xoá): không mất dữ liệu — hàm chỉ xoá dòng của đúng (lớp, tháng) người dùng bấm
-- "Mở lại lớp", tức dòng đang ở trạng thái "đã hoàn thành" mà họ chủ động mở. DB hiện 0 dòng.
-- ============================================================================
create or replace function public.fn_traogiai_mo_lai_lop(p_ym text, p_lop uuid)
returns void language plpgsql as $$
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  delete from giai_thuong_lop_thang where lop_id = p_lop and thang = (p_ym || '-01')::date;
end $$;
grant execute on function public.fn_traogiai_mo_lai_lop(text, uuid) to authenticated;
