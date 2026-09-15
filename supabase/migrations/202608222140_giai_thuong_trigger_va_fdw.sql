-- ============================================================================
-- 202608222140 — giai_thuong_trigger_va_fdw
-- ----------------------------------------------------------------------------
-- VÌ SAO: (1) ép cứng ở DB số slot/loại giải mỗi lớp/tháng (3 xuất sắc/2 tiến
-- bộ/1 chăm chỉ) — không tin tưởng app luôn tính đúng. (2) mở cho cầu FDW
-- bkdemy-ph đọc (mirror đúng pattern buoi_hoc/gami_grades: RLS bật + policy
-- fdw_bkdemy_web_read + policy authenticated dùng la_thanh_vien() + grant).
--
-- MẤT GÌ: không xoá gì, chỉ thêm trigger/RLS/policy/grant.
-- ============================================================================

create or replace function giai_thuong_check_slot() returns trigger as $$
declare
  max_slot int;
  hien_co int;
begin
  max_slot := case new.loai_giai
    when 'xuat_sac' then 3
    when 'tien_bo' then 2
    when 'cham_chi' then 1
  end;
  select count(*) into hien_co
  from giai_thuong
  where thang = new.thang and lop_id = new.lop_id and loai_giai = new.loai_giai;
  if hien_co >= max_slot then
    raise exception 'Lớp % tháng % đã đủ % slot "%"', new.lop_id, new.thang, max_slot, new.loai_giai;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_giai_thuong_check_slot
  before insert on giai_thuong
  for each row execute function giai_thuong_check_slot();

alter table giai_thuong enable row level security;

create policy giai_thuong_member_all on giai_thuong
  for all to authenticated
  using (la_thanh_vien())
  with check (la_thanh_vien());

create policy fdw_bkdemy_web_read on giai_thuong
  for select to fdw_bkdemy_web
  using (true);

grant select on giai_thuong to fdw_bkdemy_web;
