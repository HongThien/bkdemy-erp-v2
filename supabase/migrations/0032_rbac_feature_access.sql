-- ============================================================================
-- Migration 0032 — RBAC FEATURE-ACCESS (Thùy chốt 06-15: role-based, bật/tắt MÀN)
-- ----------------------------------------------------------------------------
-- Lớp ① "feature access" = cổng thô: tài khoản MỞ ĐƯỢC màn nào (khác lớp ②
--   task-scope getMyScope, khác lớp ③ data-scope — KHÔNG đụng tới chúng).
-- Mô hình: "vai trò" (role) = bó chức năng đặt tên · gán role cho VỊ TRÍ ·
--   quyền 1 người = UNION role của MỌI ghế (khớp "quyền đến từ GHẾ", đa-ghế cộng dồn).
-- Anti-NULL §1.5: KHÔNG có dòng vai_tro_chuc_nang = KHÔNG cấp (không lưu cờ false).
-- Founder = la_admin_he_thong bypass (thấy tất + tự gồm leaf mới sau này).
-- ============================================================================

-- 1) Role + role→chức năng (chuc_nang = leaf-id trong cây Admin: hs/lop/ns/bdkt/buoihoc/db_taichinh…)
create table if not exists vai_tro (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,
  mo_ta      text,
  created_at timestamptz not null default now()
);

create table if not exists vai_tro_chuc_nang (
  vai_tro_id uuid not null references vai_tro(id) on delete cascade,
  chuc_nang  text not null,
  primary key (vai_tro_id, chuc_nang)
);

-- 2) Gắn role vào ghế · cờ Founder trên tài khoản
alter table vi_tri    add column if not exists vai_tro_id        uuid references vai_tro(id) on delete set null;
alter table tai_khoan add column if not exists la_admin_he_thong boolean not null default false;

-- 3) RLS — 0026 chỉ phủ member_all cho bảng CÓ SẴN lúc đó; bảng mới phải khai báo tay.
--    Tạm: thành viên đọc/ghi (Founder cấu hình trên web; siết theo la_admin_he_thong sau — nợ §6).
alter table vai_tro            enable row level security;
alter table vai_tro_chuc_nang  enable row level security;
drop policy if exists vai_tro_member_all           on vai_tro;
drop policy if exists vai_tro_chuc_nang_member_all on vai_tro_chuc_nang;
create policy vai_tro_member_all           on vai_tro           for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy vai_tro_chuc_nang_member_all on vai_tro_chuc_nang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- 4) Quyền của NGƯỜI GỌI — 1 rpc/login. Tính ở Postgres (§2), security definer né RLS.
--    Trả 1 dòng: la_admin (Founder bypass) + mảng leaf được phép (qua các ghế của tôi).
create or replace function public.my_quyen()
returns table(la_admin boolean, chuc_nang text[])
language sql stable security definer set search_path = public as $$
  select
    coalesce((select tk.la_admin_he_thong from tai_khoan tk where tk.id = public.jwt_uid()), false),
    coalesce((
      select array_agg(distinct vc.chuc_nang)
      from tai_khoan tk
      join vi_tri v             on v.nhan_su_id = tk.nhan_su_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
      where tk.id = public.jwt_uid()
    ), '{}'::text[]);
$$;
revoke all on function public.my_quyen() from public;
grant  execute on function public.my_quyen() to authenticated;
