-- ============================================================================
-- 202609141133 — current_nhan_su_id_bo_auth_users
-- ----------------------------------------------------------------------------
-- VÌ SAO: Fix trước (202609141111 — thêm SD cho fn_ta_dashboard/fn_may_man_*)
--   KHÔNG đủ, TA vẫn báo "permission denied for schema auth". Soi kỹ:
--   current_nhan_su_id() (hàm LÕI mọi chỗ gọi) đang JOIN auth.users + gọi
--   auth.uid() trực tiếp — và OWNER của hàm là claude_build, role này KHÔNG
--   có USAGE trên schema auth (has_schema_privilege('claude_build','auth',
--   'USAGE') = false, verify trực tiếp trên DB). Vì current_nhan_su_id() là
--   SECURITY DEFINER, body của nó LUÔN chạy bằng quyền claude_build bất kể
--   hàm gọi nó có SD hay không → mọi hàm gọi current_nhan_su_id() đều dính,
--   không riêng gì fn_ta_dashboard/fn_may_man_quay.
--
--   Codebase đã có sẵn cách đúng, dùng ở la_thanh_vien()/self_link_account()
--   (migration 0026): đọc thẳng JWT claims qua jwt_uid()/jwt_email()
--   (current_setting('request.jwt.claims')) — KHÔNG đụng schema auth luôn,
--   nên không bao giờ dính lỗi quyền này. current_nhan_su_id() lại không
--   theo pattern đó (có thể do migration 202609131609 — file này CÓ trong sổ
--   DB nhưng KHÔNG còn trong repo, xem `migrate --status` — viết sai cách).
--
-- FIX: viết lại current_nhan_su_id() dùng tai_khoan.id = jwt_uid() (ưu tiên,
--   đúng tên migration thất lạc "uu_tien_tai_khoan") → fallback email khớp
--   qua jwt_email() khi chưa có dòng tai_khoan (3/39 nhân sự đang lam hiện
--   chưa link tai_khoan, verify trực tiếp trên DB) — tương đương ngữ nghĩa
--   bản cũ (auth.users.email = nhan_su.email) nhưng không chạm schema auth.
--
-- MẤT GÌ: không mất data, không đổi bảng. Chỉ replace 1 function.
-- ============================================================================

create or replace function public.current_nhan_su_id()
returns uuid
language sql stable
security definer
set search_path = public
as $$
  select coalesce(
    (select tk.nhan_su_id from public.tai_khoan tk join public.nhan_su ns on ns.id = tk.nhan_su_id
      where tk.id = public.jwt_uid() and ns.trang_thai = 'dang_lam'),
    (select ns.id from public.nhan_su ns
      where public.jwt_email() <> '' and lower(ns.email) = public.jwt_email() and ns.trang_thai = 'dang_lam'
      limit 1)
  );
$$;
