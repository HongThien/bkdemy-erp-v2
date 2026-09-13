-- ============================================================================
-- 202609131705 (tạo 1636, đổi tên vì phiên khác đã áp template rỗng 1636 vào sổ) — TEST ĐẦU VÀO: bảng PHÂN CÔNG người chấm / người trả bài theo (khối × môn)
--                + trigger gán mặc định vào ca_test lúc tạo (CEO 13/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO đổi luồng — Ops KHÔNG chọn người chấm/trả bài từng ca nữa; có tab "Phân công" riêng
--   (bảng khối → người chấm → người trả bài). Ca test mới tự lấy từ bảng này, và người được phân công
--   thấy ngay ở "Việc của tôi" khi ca xuất hiện.
-- CÁCH: gán ở TẦNG DB bằng trigger BEFORE INSERT trên ca_test (§2.0 "trạng thái suy từ bảng khác =
--   trigger") — mọi đường tạo ca (ERP desktop, app Ops, script) đều được gán, không lệ thuộc client nhớ.
--   Chỉ điền khi cột đang NULL (đường cũ truyền tay vẫn thắng). Khối lấy từ ung_vien.khoi + môn của ca.
-- MÔN: bảng có nhãn `mon` (§1.6 — phân công chấm Toán ≠ KHTN); UI hiện theo từng môn, hàng = khối.
-- VẾT: mọi đổi phân công ghi log (trigger) — §4 "mọi đổi state ghi vết bắt buộc".
-- MẤT GÌ (Luật xoá): không. Chỉ create table/function/trigger/policy.
-- ============================================================================

create table if not exists public.test_dau_vao_phan_cong (
  khoi              text not null,
  mon               text not null,
  nguoi_cham_id     uuid references public.nhan_su(id) on delete set null,
  nguoi_tra_bai_id  uuid references public.nhan_su(id) on delete set null,
  updated_at        timestamptz not null default now(),
  updated_by        uuid,
  primary key (khoi, mon)
);
comment on table public.test_dau_vao_phan_cong is 'Phân công mặc định người chấm / người trả bài test đầu vào theo (khối × môn). Trigger tg_ca_test_phan_cong gán vào ca_test lúc tạo.';
alter table public.test_dau_vao_phan_cong enable row level security;
drop policy if exists test_dau_vao_phan_cong_member_all on public.test_dau_vao_phan_cong;
create policy test_dau_vao_phan_cong_member_all on public.test_dau_vao_phan_cong
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

create table if not exists public.test_dau_vao_phan_cong_log (
  id     uuid primary key default gen_random_uuid(),
  khoi   text not null,
  mon    text not null,
  truoc  jsonb,
  sau    jsonb,
  actor  uuid,
  ts     timestamptz not null default now()
);
alter table public.test_dau_vao_phan_cong_log enable row level security;
drop policy if exists test_dau_vao_phan_cong_log_member_all on public.test_dau_vao_phan_cong_log;
create policy test_dau_vao_phan_cong_log_member_all on public.test_dau_vao_phan_cong_log
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

create or replace function public.log_test_dau_vao_phan_cong() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := public.jwt_uid();
  insert into public.test_dau_vao_phan_cong_log (khoi, mon, truoc, sau, actor)
  values (new.khoi, new.mon, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_test_dau_vao_phan_cong on public.test_dau_vao_phan_cong;
create trigger trg_log_test_dau_vao_phan_cong before insert or update on public.test_dau_vao_phan_cong
  for each row execute function public.log_test_dau_vao_phan_cong();

-- ── Gán mặc định vào ca_test lúc tạo (chỉ điền cột đang NULL) ────────────────────────────────────
create or replace function public.fn_ca_test_phan_cong_mac_dinh() returns trigger
language plpgsql as $$
declare
  v_khoi text;
  v_cham uuid;
  v_tra  uuid;
begin
  if new.nguoi_cham_id is not null and new.nguoi_tra_bai_id is not null then return new; end if;
  select khoi into v_khoi from public.ung_vien where id = new.ung_vien_id;
  if v_khoi is null then return new; end if;
  select nguoi_cham_id, nguoi_tra_bai_id into v_cham, v_tra
  from public.test_dau_vao_phan_cong where khoi = v_khoi and mon = new.mon;
  if not found then return new; end if;
  if new.nguoi_cham_id is null then new.nguoi_cham_id := v_cham; end if;
  if new.nguoi_tra_bai_id is null then new.nguoi_tra_bai_id := v_tra; end if;
  return new;
end $$;
drop trigger if exists tg_ca_test_phan_cong on public.ca_test;
create trigger tg_ca_test_phan_cong before insert on public.ca_test
  for each row execute function public.fn_ca_test_phan_cong_mac_dinh();
