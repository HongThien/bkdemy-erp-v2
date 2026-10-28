-- Capacity bổ trợ yếu THEO KHỐI (Thùy 27/10): Capacity = 40% × tổng đơn vị bổ trợ trong lịch bổ trợ (lịch trực) của khối.
-- Chỉ ĐỌC/HIỂN THỊ — không chặn gì (trần 70 / 20 Cao toàn trung tâm giữ nguyên, trg_btyeu_suc_chua).
-- Lịch trực = các dòng lich_truc_bo_tro còn hiệu lực hôm nay (1 tuần điển hình); đơn vị = cột don_vi (3 × phút/30 × số TA).
-- Đã dùng = đơn vị của case ĐANG bổ trợ (bo_tro_yeu + bo_tro_hinh, trang_thai='dang_xu') theo quy tắc _ca_bo_tro_don_vi (L1=1, L2/L3=4); khối lấy theo học sinh (như fn_ca_bo_tro_ung_vien).
create or replace function public.fn_btyeu_capacity_khoi(p_mon text default null)
returns jsonb
language sql stable security definer set search_path to 'public'
as $$
  with lich as (
    select khoi, sum(don_vi)::int dv_lich
    from lich_truc_bo_tro
    where hieu_luc_tu <= current_date and (hieu_luc_den is null or hieu_luc_den >= current_date)
      and (p_mon is null or mon = p_mon) and khoi is not null
    group by khoi),
  cs as (
    select hs.khoi, public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)::int dv, (y.uu_tien = 3) cao
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and (p_mon is null or y.mon = p_mon)
    union all
    select hs.khoi, public._ca_bo_tro_don_vi('hinh', h.hoc_sinh_id, 'Toán')::int, (h.uu_tien = 3)
    from bo_tro_hinh h join hoc_sinh hs on hs.id = h.hoc_sinh_id
    where h.trang_thai = 'dang_xu' and (p_mon is null or p_mon = 'Toán')),
  dung as (select khoi, sum(dv)::int dv, count(*)::int n, count(*) filter (where cao)::int n_cao from cs where khoi is not null group by khoi)
  select coalesce(jsonb_agg(jsonb_build_object(
      'khoi', k.khoi, 'dv_lich', coalesce(l.dv_lich, 0), 'capacity', round(0.4 * coalesce(l.dv_lich, 0), 1),
      'dung', coalesce(d.dv, 0), 'case_n', coalesce(d.n, 0), 'cao_n', coalesce(d.n_cao, 0))
    order by (regexp_replace(k.khoi, '\D', '', 'g'))::int, k.khoi), '[]'::jsonb)
  from (select khoi from lich union select khoi from dung) k
  left join lich l using (khoi) left join dung d using (khoi)
$$;
grant execute on function public.fn_btyeu_capacity_khoi(text) to authenticated;
