-- ============================================================================
-- 202608290552 — GẬY CỦA BK (hệ phạt nhân sự)
-- ----------------------------------------------------------------------------
-- VÌ SAO: mỗi lỗi = 1 gậy = 20k (đơn giá lưu lúc CHỐT THÁNG, không hard-code DB).
--   · Gậy TỰ ĐỘNG: máy quét deadline ERP (việc vận hành + việc giao tay) → ĐỀ XUẤT,
--     leader theo cây tổ chức CHỐT (giống pattern trợ lý: máy đề xuất, người quyết).
--   · Gậy THỦ CÔNG: leader đánh cho lỗi ngoài ERP (chọn từ danh mục lỗi).
--   · GỠ GẬY: hoạt động gỡ (dọn vệ sinh, chống đẩy…) = dòng ledger ÂM.
--   · Tháng mới RESET: "gậy hiện tại" = sum ledger theo kỳ tháng (ky) — derive,
--     không cache. Cuối tháng chốt vào gay_chot_thang để đối chiếu tiền phạt.
-- Ledger append-only (mirror qlht_xu_ledger); sửa sai = THU HỒI mềm (thu_hoi_at),
-- không update/delete số liệu. Mọi đổi state ghi vết qua trigger (CLAUDE §4).
-- ============================================================================

-- ── 1) DANH MỤC LỖI (chọn khi đánh gậy) ──────────────────────────────────────
create table if not exists gay_loi (
  id               uuid primary key default gen_random_uuid(),
  ma               text unique,                -- khoá tự nhiên cho lỗi hệ thống cần tìm từ code (vd 'cham_deadline')
  ten              text not null,
  mo_ta            text,
  so_gay_mac_dinh  int not null default 1 check (so_gay_mac_dinh > 0),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ── 2) DANH MỤC HOẠT ĐỘNG GỠ GẬY ────────────────────────────────────────────
create table if not exists gay_hoat_dong (
  id               uuid primary key default gen_random_uuid(),
  ten              text not null,
  mo_ta            text,
  so_gay_mac_dinh  int not null default 1 check (so_gay_mac_dinh > 0),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ── 3) LEDGER GẬY — append-only, dương = đánh, âm = gỡ ──────────────────────
create table if not exists gay_ledger (
  id            uuid primary key default gen_random_uuid(),
  nhan_su_id    uuid not null references nhan_su(id),
  -- kỳ tháng (ngày 1 theo giờ VN) — gậy reset theo tháng nên mọi tổng đều scope theo ky
  ky            date not null default (date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')))::date,
  so_gay        int not null check (so_gay <> 0),
  loai          text not null check (loai in ('tu_dong','thu_cong','go')),
  loi_id        uuid references gay_loi(id),        -- bắt buộc khi đánh (check dưới)
  hoat_dong_id  uuid references gay_hoat_dong(id),  -- bắt buộc khi gỡ (check dưới)
  ly_do         text,
  ref_loai      text,                               -- 'vanhanh' | 'giaoviec' (gậy tự động trỏ về việc gốc)
  ref_id        text,                               -- vh:<buoiId>|<tab>|<nsId> hoặc viec:<id>
  nguoi_tao     uuid not null references nhan_su(id),
  created_at    timestamptz not null default now(),
  -- thu hồi mềm (đánh nhầm) — dòng bị thu hồi KHÔNG tính vào mọi tổng
  thu_hoi_at    timestamptz,
  nguoi_thu_hoi uuid references nhan_su(id),
  thu_hoi_ly_do text,
  constraint gay_ledger_danh_co_loi check (loai = 'go' or loi_id is not null),
  constraint gay_ledger_go_co_hoat_dong check (loai <> 'go' or hoat_dong_id is not null),
  constraint gay_ledger_dau check ((loai = 'go' and so_gay < 0) or (loai <> 'go' and so_gay > 0))
);
create index if not exists idx_gay_ledger_ns_ky on gay_ledger(nhan_su_id, ky);
create index if not exists idx_gay_ledger_ky on gay_ledger(ky);

-- ── 4) ĐỀ XUẤT GẬY TỰ ĐỘNG — máy quét deadline ERP đẻ dòng 'cho', người chốt ─
-- ref_key UNIQUE vĩnh viễn = 1 việc trễ chỉ đề xuất ĐÚNG 1 lần (quét idempotent,
-- chạy lazy lúc mở màn — không pg_cron, xem CLAUDE §2 pattern housekeeping).
create table if not exists gay_de_xuat (
  id             uuid primary key default gen_random_uuid(),
  nhan_su_id     uuid not null references nhan_su(id),
  nguon          text not null check (nguon in ('vanhanh','giaoviec')),
  ref_key        text not null unique,
  mo_ta          text not null,                 -- nhãn việc: "Chấm ET — 7A1 12/08"
  deadline_at    timestamptz,
  tre_phut       int,                           -- độ trễ LÚC PHÁT HIỆN (xong muộn: trễ thật; chưa xong: trễ tới lúc quét)
  trang_thai     text not null default 'cho' check (trang_thai in ('cho','da_danh','bo_qua')),
  so_gay         int not null default 1 check (so_gay > 0),  -- leader sửa được lúc chốt
  nguoi_quyet    uuid references nhan_su(id),
  quyet_at       timestamptz,
  ly_do_bo_qua   text,
  ledger_id      uuid references gay_ledger(id),
  created_at     timestamptz not null default now()
);
create index if not exists idx_gay_de_xuat_trang_thai on gay_de_xuat(trang_thai);
create index if not exists idx_gay_de_xuat_ns on gay_de_xuat(nhan_su_id);

-- ── 5) CHỐT THÁNG — snapshot đối chiếu tiền phạt (mirror hoa_don: header + snapshot) ─
create table if not exists gay_chot_thang (
  ky           date not null,
  nhan_su_id   uuid not null references nhan_su(id),
  so_gay_danh  int not null,                    -- tổng gậy bị đánh trong kỳ
  so_gay_go    int not null,                    -- tổng gậy đã gỡ (số dương)
  so_gay_chot  int not null,                    -- còn lại phải đóng = danh − go (sàn 0)
  don_gia      int not null,                    -- 20000 lưu lúc chốt (đổi giá sau không phá lịch sử)
  tien_phat    int not null,                    -- so_gay_chot × don_gia
  snapshot     jsonb not null,                  -- ledger lines lúc chốt (bất biến, đối chiếu về sau)
  nguoi_chot   uuid not null references nhan_su(id),
  chot_at      timestamptz not null default now(),
  primary key (ky, nhan_su_id)
);

-- ── 6) LOG vết (CLAUDE §4: mọi đổi state — TRIGGER ở DB, app không tự nhớ ghi) ─
create table if not exists gay_log (
  id        uuid primary key default gen_random_uuid(),
  bang      text not null,                      -- 'gay_ledger' | 'gay_de_xuat'
  row_id    uuid not null,
  hanh_dong text not null,                      -- tao | thu_hoi | chot | bo_qua | sua
  truoc     jsonb,
  sau       jsonb not null,
  actor     uuid,
  ts        timestamptz not null default now()
);
create index if not exists idx_gay_log_row on gay_log(bang, row_id);

create or replace function public.log_gay_ledger() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.thu_hoi_at is not null and old.thu_hoi_at is null then hd := 'thu_hoi';
  else hd := 'sua';
  end if;
  insert into gay_log (bang, row_id, hanh_dong, truoc, sau, actor)
  values ('gay_ledger', new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_gay_ledger on gay_ledger;
create trigger trg_log_gay_ledger after insert or update on gay_ledger
  for each row execute function public.log_gay_ledger();

create or replace function public.log_gay_de_xuat() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'da_danh' and old.trang_thai = 'cho' then hd := 'chot';
  elsif new.trang_thai = 'bo_qua'  and old.trang_thai = 'cho' then hd := 'bo_qua';
  else hd := 'sua';
  end if;
  insert into gay_log (bang, row_id, hanh_dong, truoc, sau, actor)
  values ('gay_de_xuat', new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_gay_de_xuat on gay_de_xuat;
create trigger trg_log_gay_de_xuat after insert or update on gay_de_xuat
  for each row execute function public.log_gay_de_xuat();

-- ── 7) SEED danh mục ban đầu (idempotent — CEO sửa/thêm qua UI Danh mục) ─────
insert into gay_loi (ma, ten, so_gay_mac_dinh)
select 'cham_deadline', 'Chậm deadline trên ERP', 1
where not exists (select 1 from gay_loi where ma = 'cham_deadline');
insert into gay_loi (ten, so_gay_mac_dinh)
select 'Sai quy trình', 1
where not exists (select 1 from gay_loi where ten = 'Sai quy trình');
insert into gay_loi (ten, so_gay_mac_dinh)
select 'Quên việc được giao (ngoài ERP)', 1
where not exists (select 1 from gay_loi where ten = 'Quên việc được giao (ngoài ERP)');

insert into gay_hoat_dong (ten, so_gay_mac_dinh)
select x.ten, 1 from (values ('Dọn vệ sinh'), ('Chống đẩy'), ('Chạy bộ')) as x(ten)
where not exists (select 1 from gay_hoat_dong h where h.ten = x.ten);

-- ── 8) RLS — gate thành viên (đúng pattern giaoviec; scope leader check ở app) ─
alter table gay_loi        enable row level security;
alter table gay_hoat_dong  enable row level security;
alter table gay_ledger     enable row level security;
alter table gay_de_xuat    enable row level security;
alter table gay_chot_thang enable row level security;
alter table gay_log        enable row level security;

drop policy if exists gay_loi_member_all        on gay_loi;
drop policy if exists gay_hoat_dong_member_all  on gay_hoat_dong;
drop policy if exists gay_ledger_member_all     on gay_ledger;
drop policy if exists gay_de_xuat_member_all    on gay_de_xuat;
drop policy if exists gay_chot_thang_member_all on gay_chot_thang;
drop policy if exists gay_log_member_all        on gay_log;

create policy gay_loi_member_all        on gay_loi        for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy gay_hoat_dong_member_all  on gay_hoat_dong  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy gay_ledger_member_all     on gay_ledger     for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy gay_de_xuat_member_all    on gay_de_xuat    for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy gay_chot_thang_member_all on gay_chot_thang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy gay_log_member_all        on gay_log        for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

grant select, insert, update on gay_loi        to authenticated;
grant select, insert, update on gay_hoat_dong  to authenticated;
grant select, insert, update on gay_ledger     to authenticated;
grant select, insert, update on gay_de_xuat    to authenticated;
grant select, insert, update on gay_chot_thang to authenticated;
grant select, insert         on gay_log        to authenticated;
