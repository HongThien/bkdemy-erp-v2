-- ============================================================================
-- 0080 — GIAO VIỆC & ĐO HIỆU SUẤT PHÁT TRIỂN (BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md).
-- ----------------------------------------------------------------------------
-- SCOPE v1 (chốt với Thùy 07-05, THU HẸP so với spec gốc):
--  · Lương nhân sự HIỆN KHÔNG tính trong ERP (mỗi NS có base lương riêng ngoài
--    hệ thống) — §5/§6 (lương/cấp bậc/promotion gate) HOÃN, chưa có gì để "hoà
--    vào" (spec giả định sai — luong_bac/gami_exp_ledger là CƠ CHẾ CỦA HỌC SINH,
--    không phải nhân sự — verify schema xác nhận KHÔNG có bảng lương nhân sự nào).
--  · Ưu tiên v1: ĐO HOẠT ĐỘNG (nhân sự A tháng này làm gì, tốt/không, đạt %) +
--    LUỒNG GIAO VIỆC PHÁT TRIỂN end-to-end (giao→làm→nghiệm thu+bằng chứng→%).
--  · Vận hành (frontline) + khối-lượng trách-nhiệm-thường-trực + skill/probe: HOÃN
--    (v1 chỉ đo việc PHÁT TRIỂN qua bảng `viec`; nối vận hành là việc kế tiếp).
--  · Hiệu suất kỳ: KHÔNG dựng bảng materialize riêng — tính pure-derive từ `viec`
--    lúc đọc (giống getPhieuAo/mastery — đúng nguyên tắc CLAUDE.md §1 "suy động").
-- ============================================================================

-- ── 1) LOẠI VIỆC (registry) ──────────────────────────────────────────────────
create table if not exists loai_viec (
  id               uuid primary key default gen_random_uuid(),
  ten              text not null,
  phuong_thuc_cham text not null check (phuong_thuc_cham in ('frontline','phat_trien')),
  task_nho         boolean not null default false,   -- true = miễn bằng chứng bắt buộc
  thang_kl         jsonb not null default '[]',       -- bảng định lượng: [{ma,ten,kl}] chọn lúc giao
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
alter table loai_viec enable row level security;
create policy loai_viec_member_all on loai_viec for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on loai_viec to authenticated;

-- ── 2) VIỆC (instance) — v1 chỉ dùng cho loại phat_trien; frontline nối sau ──
create table if not exists viec (
  id                 uuid primary key default gen_random_uuid(),
  loai_viec_id       uuid not null references loai_viec(id),
  tieu_de            text not null,
  mo_ta              text,
  nguoi_giao         uuid not null references nhan_su(id),
  khoi_luong         numeric not null,               -- chốt LÚC GIAO, đóng băng (đổi ở review-hiệu-chỉnh riêng)
  trang_thai         text not null default 'giao' check (trang_thai in ('giao','dang_lam','cho_nghiem_thu','dat','tra_lai')),
  tien_do            numeric,                        -- 0-100, leader chốt lúc nghiệm thu
  chat_luong         numeric,                        -- 0-100, leader chốt lúc nghiệm thu
  phan_tram          numeric,                        -- % gộp cuối cùng (null tới khi nghiệm thu)
  bang_chung         text,                           -- url/file — bắt buộc trừ khi loai_viec.task_nho
  ky_tinh            text,                           -- 'YYYY-MM' = THÁNG NGHIỆM THU (mốc tính), set lúc đạt
  han_nghiem_thu     date,                           -- deadline của NGƯỜI GIAO (chống lỗ đen)
  created_at         timestamptz not null default now(),
  hoan_thanh_at      timestamptz,                    -- NS bấm "hoàn thành"
  nghiem_thu_at      timestamptz,                    -- leader chốt nghiệm thu
  ghi_chu_nghiem_thu text
);
create index if not exists idx_viec_loai on viec(loai_viec_id);
create index if not exists idx_viec_nguoi_giao on viec(nguoi_giao);
create index if not exists idx_viec_ky on viec(ky_tinh);
alter table viec enable row level security;
create policy viec_member_all on viec for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on viec to authenticated;

-- ── 3) NGƯỜI LÀM (junction 1-N — 1 việc giao cho ≥1 người) ──────────────────
create table if not exists viec_nguoi_lam (
  viec_id     uuid not null references viec(id) on delete cascade,
  nhan_su_id  uuid not null references nhan_su(id),
  primary key (viec_id, nhan_su_id)
);
alter table viec_nguoi_lam enable row level security;
create policy viec_nguoi_lam_member_all on viec_nguoi_lam for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on viec_nguoi_lam to authenticated;

-- ── 4) LOG (mọi đổi trạng thái phải có vết — CLAUDE.md §4) ──────────────────
create table if not exists viec_log (
  id        uuid primary key default gen_random_uuid(),
  viec_id   uuid not null references viec(id) on delete cascade,
  hanh_dong text not null,        -- tao | doi_trang_thai | nghiem_thu
  truoc     jsonb,
  sau       jsonb not null,
  actor     uuid,
  ts        timestamptz not null default now()
);
alter table viec_log enable row level security;
create policy viec_log_member_all on viec_log for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert on viec_log to authenticated;

create or replace function public.log_viec() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.trang_thai in ('dat','tra_lai') and old.trang_thai = 'cho_nghiem_thu' then hd := 'nghiem_thu';
  elsif new.trang_thai <> old.trang_thai then hd := 'doi_trang_thai';
  else hd := 'sua';
  end if;
  insert into viec_log (viec_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_viec on viec;
create trigger trg_log_viec after insert or update on viec
  for each row execute function public.log_viec();
