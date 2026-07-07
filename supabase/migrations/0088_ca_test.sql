-- 0087 — Ca test đầu vào (điểm danh test tuyển sinh). OPS tạo lúc HS THẬT SỰ tới test (đặt lịch
-- trước hoặc walk-in, chưa có web PH tự đăng ký) → ghi nhận BẰNG CHỨNG thật "đã đến test", tách khỏi
-- checklist tick tay `ung_vien_viec` (L6.cham_bai vẫn TẠM tick tay — bảng này set nền cho auto-derive
-- sau này, KHÔNG tự nối luôn ở bước này). Ops-lead tuyển sinh dựa vào đây audit số liệu L5→L6.
-- Chọn ứng viên L5 có sẵn → app set LUÔN ung_vien.level='L6' (đã có mặt = bằng chứng "đến test" đủ).
-- Walk-in mới (chưa từng ở L5) → app tạo ung_vien thẳng level='L6' (đăng ký+đến diễn ra cùng lúc).
-- Bài test = 1 file scan (PDF/ảnh, giống hướng scan-cả-lớp-1-PDF của Story 4 OPS spec) — không cần
-- bảng con nhiều ảnh.

create table if not exists ca_test (
  id               uuid primary key default gen_random_uuid(),
  ung_vien_id      uuid not null references ung_vien(id) on delete cascade,
  mon              text not null,                 -- nhãn môn bắt buộc (CLAUDE.md §1.6), copy từ ung_vien lúc tạo
  ngay             date not null,
  gio_bat_dau      time not null,                 -- OPS tự điền
  thoi_luong_phut  int not null check (thoi_luong_phut in (45, 60, 75, 90, 120)),
  trang_thai       text not null default 'dang_test' check (trang_thai in ('dang_test', 'hoan_thanh')),
  bai_url          text,                          -- set lúc OPS upload bài scan
  hoan_thanh_at    timestamptz,
  created_by       uuid,
  created_at       timestamptz not null default now()
);
create index if not exists idx_ca_test_ngay on ca_test(ngay);
create index if not exists idx_ca_test_ung_vien on ca_test(ung_vien_id);

-- Log (CLAUDE.md §4) — ghi vết tạo / hoàn thành
create table if not exists ca_test_log (
  id          uuid primary key default gen_random_uuid(),
  ca_test_id  uuid not null references ca_test(id) on delete cascade,
  hanh_dong   text not null,   -- tao | hoan_thanh | sua
  truoc       jsonb,
  sau         jsonb not null,
  actor       uuid,
  ts          timestamptz not null default now()
);

alter table ca_test enable row level security;
alter table ca_test_log enable row level security;
create policy ca_test_member_all     on ca_test     for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy ca_test_log_member_all on ca_test_log for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on ca_test     to authenticated;
grant select, insert                 on ca_test_log to authenticated;

create or replace function public.log_ca_test() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'hoan_thanh' and old.trang_thai <> 'hoan_thanh' then hd := 'hoan_thanh';
  else hd := 'sua';
  end if;
  insert into ca_test_log (ca_test_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_ca_test on ca_test;
create trigger trg_log_ca_test after insert or update on ca_test for each row execute function public.log_ca_test();
