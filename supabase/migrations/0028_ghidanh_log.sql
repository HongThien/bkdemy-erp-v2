-- 0028 — track ghi danh đúng chuẩn §4: ngay_roi + LOG lịch sử bằng TRIGGER DB (app không tự nhớ).
-- ngay_vao/ngay_roi = cổng thời gian của data học tập (BTVN/ET chỉ tính từ ngày vào lớp).
alter table hoc_sinh_lop add column if not exists ngay_roi date;

create table if not exists hoc_sinh_lop_log (
  id           uuid primary key default gen_random_uuid(),
  ghi_danh_id  uuid,                -- dòng hoc_sinh_lop liên quan
  hoc_sinh_id  uuid,
  lop_id       uuid,
  hanh_dong    text not null,       -- ghi_danh | roi_lop | ghi_danh_lai | doi_band | sua
  truoc        jsonb,               -- bản ghi cũ (UPDATE)
  sau          jsonb not null,      -- bản ghi mới
  actor        uuid,                -- auth.uid của người thao tác (jwt_uid 0026)
  ts           timestamptz not null default now()
);
alter table hoc_sinh_lop_log enable row level security;
create policy hoc_sinh_lop_log_member_all on hoc_sinh_lop_log for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert on hoc_sinh_lop_log to authenticated;

create or replace function public.log_hoc_sinh_lop() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'ghi_danh';
  elsif new.trang_thai = 'da_roi'   and old.trang_thai = 'dang_hoc' then hd := 'roi_lop';
  elsif new.trang_thai = 'dang_hoc' and old.trang_thai = 'da_roi'   then hd := 'ghi_danh_lai';
  elsif coalesce(new.muc_nang_luc_id::text,'') <> coalesce(old.muc_nang_luc_id::text,'') then hd := 'doi_band';
  else hd := 'sua';
  end if;
  insert into hoc_sinh_lop_log (ghi_danh_id, hoc_sinh_id, lop_id, hanh_dong, truoc, sau, actor)
  values (new.id, new.hoc_sinh_id, new.lop_id, hd,
          case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;

drop trigger if exists trg_log_hoc_sinh_lop on hoc_sinh_lop;
create trigger trg_log_hoc_sinh_lop after insert or update on hoc_sinh_lop
  for each row execute function public.log_hoc_sinh_lop();
