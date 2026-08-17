-- ============================================================================
-- 202608171357 — phong_va_hoat_dong_phong
-- ----------------------------------------------------------------------------
-- VÌ SAO: quản lý phòng học kiểu khách sạn — biết phòng nào giờ nào có ai dùng,
-- tránh trùng. `phong` là cột text tự do rải ở thoi_khoa_bieu/buoi_hoc, không danh
-- mục, "6 phòng" chỉ hard-code trong TKBScreen.tsx (ROOMS). Nay: (1) bảng `phong`
-- làm danh mục chuẩn (TKB/bổ trợ vẫn lưu `ma_phong` dạng text ở 2 bảng cũ — KHÔNG
-- đổi sang FK, xem ghi chú ở cuối file); (2) bảng `hoat_dong_phong` cho nguồn thứ 3
-- (hoạt động phát sinh: họp nội bộ / học tập ngoài lịch / việc khác) — hoàn toàn
-- mới, chưa từng có; (3) log trạng thái theo mẫu 0028/0080 (mọi đổi state phải có
-- trigger ghi vết, CLAUDE.md §4).
--
-- MẤT GÌ: không xoá/thu hẹp gì — chỉ thêm bảng mới. Seed 6 phòng hiện có
-- (P101/P102/P201/P202/P301/P302) đúng thứ tự cũ trong TKBScreen.tsx.
-- ============================================================================

-- ── Danh mục phòng ──────────────────────────────────────────────────────────
create table if not exists phong (
  id              uuid primary key default gen_random_uuid(),
  ma_phong        text not null unique,          -- "P101" — khớp giá trị lưu trong buoi_hoc.phong / thoi_khoa_bieu.phong
  ten_phong       text not null,
  suc_chua        int,
  thu_tu          int not null,                  -- thứ tự hiển thị lưới
  dang_hoat_dong  boolean not null default true,  -- đóng phòng = false, KHÔNG xoá (tham chiếu TEXT không FK, cấm xoá cứng — §2)
  ghi_chu         text,
  created_at      timestamptz not null default now()
);
alter table phong enable row level security;
create policy phong_member_all on phong for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on phong to authenticated;

insert into phong (ma_phong, ten_phong, thu_tu) values
  ('P101', 'P101', 1), ('P102', 'P102', 2),
  ('P201', 'P201', 3), ('P202', 'P202', 4),
  ('P301', 'P301', 5), ('P302', 'P302', 6)
on conflict (ma_phong) do nothing;

-- ── Hoạt động phát sinh (nguồn thứ 3 chiếm phòng, ngoài TKB/bổ trợ) ─────────
create table if not exists hoat_dong_phong (
  id            uuid primary key default gen_random_uuid(),
  phong_id      uuid not null references phong(id),
  ngay          date not null,
  gio_bat_dau   time not null,
  gio_ket_thuc  time not null,
  loai          text not null check (loai in ('hop_noi_bo','hoc_tap_ngoai_lich','viec_khac')),
  tieu_de       text not null,
  mon           text,               -- chỉ có nghĩa khi loai='hoc_tap_ngoai_lich'; NULL = không áp dụng (§1.5)
  ghi_chu       text,
  nguoi_tao_id  uuid references nhan_su(id),
  trang_thai    text not null default 'xac_nhan' check (trang_thai in ('xac_nhan','huy')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table hoat_dong_phong enable row level security;
create policy hoat_dong_phong_member_all on hoat_dong_phong for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoat_dong_phong to authenticated;

-- Log trạng thái — mẫu 0028_ghidanh_log.sql / 0080_giaoviec.sql (trigger DB, app không tự nhớ ghi).
create table if not exists hoat_dong_phong_log (
  id                 uuid primary key default gen_random_uuid(),
  hoat_dong_phong_id uuid,
  hanh_dong          text not null,   -- tao | huy | mo_lai | sua
  truoc              jsonb,
  sau                jsonb not null,
  actor              uuid,
  ts                 timestamptz not null default now()
);
alter table hoat_dong_phong_log enable row level security;
create policy hoat_dong_phong_log_member_all on hoat_dong_phong_log for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert on hoat_dong_phong_log to authenticated;

create or replace function public.log_hoat_dong_phong() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai = 'huy' and old.trang_thai = 'xac_nhan' then hd := 'huy';
  elsif new.trang_thai = 'xac_nhan' and old.trang_thai = 'huy' then hd := 'mo_lai';
  else hd := 'sua';
  end if;
  insert into hoat_dong_phong_log (hoat_dong_phong_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;

drop trigger if exists trg_log_hoat_dong_phong on hoat_dong_phong;
create trigger trg_log_hoat_dong_phong after insert or update on hoat_dong_phong
  for each row execute function public.log_hoat_dong_phong();

-- Ghi chú kiến trúc: buoi_hoc.phong / thoi_khoa_bieu.phong VẪN là text (lưu ma_phong),
-- KHÔNG đổi sang FK uuid trong đợt này — refactor đó động vào dữ liệu lịch sử + mọi
-- query/trigger đang đọc 2 cột đó, ngoài phạm vi "quản lý phòng". Khi gộp lịch 3 nguồn,
-- client join qua phong.ma_phong = buoi_hoc.phong (danh mục chỉ ~6-20 dòng).
