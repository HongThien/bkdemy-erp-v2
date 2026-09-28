-- ============================================================================
-- 202609281857 — huy_hieu_thang_da_chot
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Màn nhân sự "Huy hiệu" cần biết tháng nào đã chốt + đã chốt bao nhiêu em / bao nhiêu sao mới, để hiện nút chốt đúng tháng kế
--   (fn_huy_hieu_chot_thang bắt chốt theo thứ tự). Đếm ở DB (§2.0), client chỉ hiển thị.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không.
-- ============================================================================
create or replace function public.fn_huy_hieu_thang_da_chot(p_mon text)
returns table(thang text, so_em integer, sao_moi integer, chot_at timestamptz)
language sql stable as $$
  select t.thang, count(distinct t.hoc_sinh_id)::int,
         (select count(*) from hs_huy_hieu_dat d where d.mon = p_mon and d.thang_chot = t.thang)::int, max(t.chot_at)
  from hs_thanh_tuu_thang t where t.mon = p_mon
  group by t.thang order by t.thang
$$;
revoke all on function public.fn_huy_hieu_thang_da_chot(text) from public, anon;
grant execute on function public.fn_huy_hieu_thang_da_chot(text) to authenticated;
