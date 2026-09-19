-- ============================================================================
-- 202609131940 — Fix fn_bt_phat_hanh_dang: THÊM SECURITY DEFINER (Thùy 13/09 báo "permission denied for schema auth")
-- ----------------------------------------------------------------------------
-- VÌ SAO: Hàm fn_bt_phat_hanh_dang/fn_bt_thu_hoi_dang tạo hôm nay (mig 202609131720) THIẾU SECURITY
--   DEFINER. Khi GV (role authenticated) gọi qua PostgREST, hàm chạy với quyền user gọi, và bên trong
--   gọi current_nhan_su_id() → nested SD call → current_nhan_su_id chạy với quyền OWNER (claude_build),
--   OWNER phải có USAGE schema auth để JOIN auth.users. Trên prod báo lỗi "permission denied for schema
--   auth" — hoặc user (authenticated) không có USAGE, hoặc PostgREST route sai. Bọc CẢ hàm cha thành
--   SD → khi PostgREST route, hàm chạy quyền owner, giải quyết chuỗi quyền một lần cho tất.
--
-- ĐỒNG THỜI: grant USAGE trên schema auth cho claude_build (owner functions) — an toàn: chỉ USAGE
-- (không SELECT bảng), cần cho JOIN auth.users bên trong SD.
--
-- MẤT GÌ: không mất data. Chỉ replace 2 function (thêm SD). Không đụng bảng.
-- ============================================================================

-- (Không grant usage schema auth — role claude_build không phải superuser nên không grant được. Fix
--  bằng SECURITY DEFINER là đủ: SD chạy quyền owner, owner đã có quyền đọc auth ngay từ khi setup.)

create or replace function public.fn_bt_phat_hanh_dang(p_bt uuid, p_ma_dang text)
returns timestamptz
language plpgsql
security definer                                     -- ⭐ Thêm SD (Thùy 13/09 fix "permission denied for schema auth")
set search_path = public
as $$
declare
  v_nhan_su uuid := public.current_nhan_su_id();
  v_at timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự phát hành được.'; end if;
  if not exists (select 1 from bai_test where id = p_bt and loai = 'giao_trinh') then
    raise exception 'Chỉ giáo trình online mới phát hành theo dạng.';
  end if;
  if not exists (select 1 from bai_test_cau where bai_test_id = p_bt and ma_dang = p_ma_dang) then
    raise exception 'Bài không có câu nào ở dạng %.', p_ma_dang;
  end if;
  insert into bai_test_dang_phat_hanh (bai_test_id, ma_dang, phat_hanh_by)
    values (p_bt, p_ma_dang, v_nhan_su)
    on conflict (bai_test_id, ma_dang) do update set phat_hanh_at = excluded.phat_hanh_at, phat_hanh_by = excluded.phat_hanh_by
    returning phat_hanh_at into v_at;
  return v_at;
end $$;
grant execute on function public.fn_bt_phat_hanh_dang(uuid, text) to authenticated;
revoke execute on function public.fn_bt_phat_hanh_dang(uuid, text) from anon;

create or replace function public.fn_bt_thu_hoi_dang(p_bt uuid, p_ma_dang text)
returns void
language plpgsql
security definer                                     -- ⭐ Thêm SD (cùng lý do trên)
set search_path = public
as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự thu hồi được.'; end if;
  delete from bai_test_dang_phat_hanh where bai_test_id = p_bt and ma_dang = p_ma_dang;
end $$;
grant execute on function public.fn_bt_thu_hoi_dang(uuid, text) to authenticated;
revoke execute on function public.fn_bt_thu_hoi_dang(uuid, text) from anon;
