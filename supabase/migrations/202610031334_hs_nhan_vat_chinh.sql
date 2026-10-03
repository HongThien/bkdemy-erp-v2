-- NHÂN VẬT CHÍNH CỦA HỌC SINH (Thùy 03/10: "cho chọn nhân vật ngay khi bấm Học tập — nhân vật này dùng cho mọi hoạt động của app, coi như nhân vật chính").
-- 4 class: su_tu (Chiến binh Sư tử) · cao (Pháp sư Cáo) · ninja · elf (Tinh linh Elf) — ảnh: public/bk-ui/hs/skin/rpg/nhanvat/, mã khớp src/screens/hocsinh/skin/nhanVatChinh.ts.
-- Dữ liệu TÀI KHOẢN (không phải học tập) ⇒ KHÔNG nhãn môn, chung mọi môn (CLAUDE §1.6).
-- CLAUDE §1.5: chưa chọn = KHÔNG có dòng (không phải dòng NULL) — app thấy null ⇒ hiện màn chọn, tạm dùng nhà thám hiểm theo giới tính.
-- CLAUDE §4: đổi nhân vật có vết — trigger tự ghi hs_nhan_vat_chinh_log (actor + lúc + cũ/mới), app không tự ghi log.
-- Chỉ đọc/ghi qua 2 RPC (security definer, khoá theo my_hoc_sinh_id()) — bảng bật RLS, không policy cho client.

create table if not exists public.hs_nhan_vat_chinh (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  nhan_vat text not null check (nhan_vat in ('su_tu', 'cao', 'ninja', 'elf')),
  chon_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.hs_nhan_vat_chinh enable row level security;

create table if not exists public.hs_nhan_vat_chinh_log (
  id bigint generated always as identity primary key,
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  actor uuid,
  at timestamptz not null default now(),
  cu text,
  moi text not null
);
alter table public.hs_nhan_vat_chinh_log enable row level security;
create index if not exists hs_nhan_vat_chinh_log_hs_idx on public.hs_nhan_vat_chinh_log (hoc_sinh_id, at desc);

create or replace function public._hs_nhan_vat_chinh_ghi_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.nhan_vat is not distinct from new.nhan_vat then return new; end if;
  insert into hs_nhan_vat_chinh_log (hoc_sinh_id, actor, cu, moi)
  values (new.hoc_sinh_id, public.jwt_uid(), case when tg_op = 'UPDATE' then old.nhan_vat end, new.nhan_vat);
  return new;
end $$;
drop trigger if exists hs_nhan_vat_chinh_log_trg on public.hs_nhan_vat_chinh;
create trigger hs_nhan_vat_chinh_log_trg after insert or update on public.hs_nhan_vat_chinh
  for each row execute function public._hs_nhan_vat_chinh_ghi_log();

-- Đọc: nhân vật chính của em (null = chưa chọn)
create or replace function public.fn_hs_nhan_vat_cua_toi()
returns text language sql stable security definer set search_path = public as $$
  select n.nhan_vat from hs_nhan_vat_chinh n where n.hoc_sinh_id = public.my_hoc_sinh_id()
$$;

-- Ghi: chọn / đổi nhân vật chính (upsert) — trả lại mã vừa lưu
create or replace function public.fn_hs_chon_nhan_vat(p_nhan_vat text)
returns text language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh mới chọn được nhân vật'; end if;
  if p_nhan_vat is null or p_nhan_vat not in ('su_tu', 'cao', 'ninja', 'elf') then raise exception 'Nhân vật không hợp lệ: %', p_nhan_vat; end if;
  insert into hs_nhan_vat_chinh (hoc_sinh_id, nhan_vat) values (v_hs, p_nhan_vat)
  on conflict (hoc_sinh_id) do update set nhan_vat = excluded.nhan_vat, updated_at = now();
  return p_nhan_vat;
end $$;

-- Quyền: chỉ HS đã đăng nhập gọi RPC (CLAUDE §2.1 — revoke anon tường minh phòng khi áp bằng SQL Editor)
revoke all on function public.fn_hs_nhan_vat_cua_toi() from public;
revoke all on function public.fn_hs_chon_nhan_vat(text) from public;
revoke all on function public._hs_nhan_vat_chinh_ghi_log() from public;
revoke execute on function public.fn_hs_nhan_vat_cua_toi() from anon;
revoke execute on function public.fn_hs_chon_nhan_vat(text) from anon;
grant execute on function public.fn_hs_nhan_vat_cua_toi() to authenticated;
grant execute on function public.fn_hs_chon_nhan_vat(text) to authenticated;
