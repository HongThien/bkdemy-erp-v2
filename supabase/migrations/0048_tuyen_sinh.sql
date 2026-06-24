-- 0048 — Phễu Tuyển sinh (Test đầu vào) L5→L8. Lead RIÊNG (không nhồi hoc_sinh); convert L7→L8 tạo HS.
-- ADR: https://app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233
-- L5 đăng ký test · L6 đến test (chấm/trả bài/chốt lịch) · L7 học thử (xác nhận ĐK) · L8 = hoc_sinh đang học (KHÔNG ở bảng này).

create table if not exists ung_vien (
  id             uuid primary key default gen_random_uuid(),
  ma_uv          text unique,                 -- UV0001… (suggest max+1)
  ho_ten_hs      text not null,
  ho_ten_ph      text,
  sdt_ph         text,
  khoi           text,
  mon            text not null default 'Toán', -- 1 lead = 1 môn test (nhiều môn → nhiều lead)
  nguon          text,                         -- free text, tự thêm (như nhận xét)
  level          text not null default 'L5' check (level in ('L5','L6','L7')),
  trang_thai     text not null default 'dang_chay' check (trang_thai in ('dang_chay','loai','da_convert')),
  ly_do_loai     text,
  diem_test      numeric,                      -- điểm test đầu vào (seam chấm bài sau)
  lop_du_kien_id uuid references lop(id) on delete set null, -- lịch học thử (L6 output)
  ngay_hoc_thu   date,
  ghi_chu        text,
  hoc_sinh_id    uuid references hoc_sinh(id) on delete set null, -- sau convert
  created_by     uuid,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Checklist (anti-NULL §1.5: CÓ dòng = đã xong; bỏ tick = xoá dòng)
create table if not exists ung_vien_viec (
  id          uuid primary key default gen_random_uuid(),
  ung_vien_id uuid not null references ung_vien(id) on delete cascade,
  viec_key    text not null,
  xong_at     timestamptz not null default now(),
  nguoi_xong  uuid,
  unique (ung_vien_id, viec_key)
);

-- Log (§4) — ghi vết tạo / đổi level / loại / convert
create table if not exists ung_vien_log (
  id          uuid primary key default gen_random_uuid(),
  ung_vien_id uuid,
  hanh_dong   text not null,   -- tao | chuyen_level | loai | mo_lai | convert | sua
  truoc       jsonb,
  sau         jsonb not null,
  actor       uuid,
  ts          timestamptz not null default now()
);

alter table ung_vien enable row level security;
alter table ung_vien_viec enable row level security;
alter table ung_vien_log enable row level security;
create policy ung_vien_member_all      on ung_vien      for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy ung_vien_viec_member_all on ung_vien_viec for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy ung_vien_log_member_all  on ung_vien_log  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on ung_vien      to authenticated;
grant select, insert, update, delete on ung_vien_viec to authenticated;
grant select, insert                 on ung_vien_log  to authenticated;

create or replace function public.log_ung_vien() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'loai'       and old.trang_thai <> 'loai'       then hd := 'loai';
  elsif new.trang_thai = 'da_convert' and old.trang_thai <> 'da_convert' then hd := 'convert';
  elsif new.trang_thai = 'dang_chay'  and old.trang_thai = 'loai'        then hd := 'mo_lai';
  elsif new.level <> old.level then hd := 'chuyen_level';
  else hd := 'sua';
  end if;
  insert into ung_vien_log (ung_vien_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_ung_vien on ung_vien;
create trigger trg_log_ung_vien after insert or update on ung_vien for each row execute function public.log_ung_vien();
