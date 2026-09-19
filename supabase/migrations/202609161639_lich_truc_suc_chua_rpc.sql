-- 09-16: RPC lịch trực trả thêm suc_chua (cột mới ở 202609161637) — tự ghép cần biết ca đầy chưa.
create or replace function public.fn_lich_truc_cua_hs(p_hoc_sinh uuid, p_mon text, p_ngay date default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with d as (select coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as ngay),
  lops as (
    select l.id, l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = p_hoc_sinh and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon
  ),
  khois as (select khoi from lops where khoi is not null union select khoi from hoc_sinh where id = p_hoc_sinh and khoi is not null),
  theo_lop as (
    select t.* from lich_truc_bo_tro t, d where t.mon = p_mon and t.lop_id in (select id from lops)
      and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
  ),
  theo_khoi as (
    select t.* from lich_truc_bo_tro t, d where t.mon = p_mon and t.lop_id is null and t.khoi in (select khoi from khois)
      and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
  ),
  chon as (select * from theo_lop union all select * from theo_khoi where not exists (select 1 from theo_lop))
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'thu', c.thu, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'khoi', c.khoi, 'lop_id', c.lop_id, 'ghi_chu', c.ghi_chu, 'suc_chua', c.suc_chua
  ) order by c.thu, c.gio_bat_dau), '[]'::jsonb)
  from chon c left join nhan_su ns on ns.id = c.nhan_su_id
$$;
grant execute on function public.fn_lich_truc_cua_hs(uuid, text, date) to authenticated;
