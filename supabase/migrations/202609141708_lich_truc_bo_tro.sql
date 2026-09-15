-- Thùy 09-14: "BK có 1 lịch trực bổ trợ cho từng khối với các khung giờ. Hệ thống đọc lịch này và đề xuất khi OPS xếp
-- bổ trợ yếu" — vd 8B trực T6 15:00–16:00 ⇒ xếp HS 8B tự rơi vào ca này. Ưu tiên khi tự xếp: (1) ca trực KHỚP ca bổ trợ
-- lần trước của em (cùng thứ/giờ) · (2) ca trực gần nhất sắp tới · (3) mặc định cũ (TKB lớp / ca gần nhất).
-- Lịch trực = slot LẶP THEO TUẦN (như thoi_khoa_bieu), scope MÔN (§1.6) + khối HOẶC lớp (lớp thắng khối khi cả 2 có).
create table if not exists public.lich_truc_bo_tro (
  id uuid primary key default gen_random_uuid(),
  mon text not null,
  khoi text,                                   -- '8' · null nếu theo lớp
  lop_id uuid references public.lop(id),       -- lớp cụ thể · null nếu theo khối
  thu smallint not null check (thu between 2 and 8),  -- 2=T2 … 7=T7 · 8=CN (cùng quy ước thoi_khoa_bieu)
  gio_bat_dau time not null,
  gio_ket_thuc time not null,
  phong text,
  nhan_su_id uuid references public.nhan_su(id),      -- người trực (TA/GV) — null = chưa phân
  hieu_luc_tu date not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  hieu_luc_den date,
  ghi_chu text,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint lich_truc_bo_tro_pham_vi check (khoi is not null or lop_id is not null),
  constraint lich_truc_bo_tro_gio check (gio_ket_thuc > gio_bat_dau)
);
create index if not exists lich_truc_bo_tro_mon_khoi_idx on public.lich_truc_bo_tro (mon, khoi);
create index if not exists lich_truc_bo_tro_lop_idx on public.lich_truc_bo_tro (lop_id);
alter table public.lich_truc_bo_tro enable row level security;
drop policy if exists lich_truc_bo_tro_member_all on public.lich_truc_bo_tro;
create policy lich_truc_bo_tro_member_all on public.lich_truc_bo_tro for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- Slot trực ÁP DỤNG cho 1 HS ở 1 môn: lớp em đang học (ưu tiên) → khối của lớp / khối HS. Trả slot còn hiệu lực tại p_ngay.
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
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'khoi', c.khoi, 'lop_id', c.lop_id, 'ghi_chu', c.ghi_chu
  ) order by c.thu, c.gio_bat_dau), '[]'::jsonb)
  from chon c left join nhan_su ns on ns.id = c.nhan_su_id
$$;
grant execute on function public.fn_lich_truc_cua_hs(uuid, text, date) to authenticated;
