-- ============================================================================
-- 202609200947 — may_man_hs_quay_thieu_security_definer
-- ----------------------------------------------------------------------------
-- BUG THẬT (CEO test HS0440 20/09): bấm "Quay ngay" ở màn May mắn → lỗi
--   "new row violates row-level security policy for table may_man_hs_luot".
--
-- NGUYÊN NHÂN (đã verify DB live, pg_proc): `fn_may_man_hs_quay` (mig
--   202609112330) THIẾU `security definer` — trong khi 2 hàm còn lại của CÙNG
--   migration (`fn_may_man_hs_du_dieu_kien`, `fn_may_man_hs_cua_toi`) ĐỀU CÓ.
--   Rõ ràng là sai sót lúc viết (bỏ sót đúng 1 hàm), không phải cố ý.
--   Hệ quả: hàm chạy với quyền NGƯỜI GỌI (`authenticated`, qua PostgREST),
--   KHÔNG bypass RLS. Bảng `may_man_hs_luot` chỉ có 2 policy SELECT
--   (`may_man_hs_luot_self`, `may_man_hs_luot_staff_read`) — KHÔNG có policy
--   INSERT nào cho `authenticated` (comment cũ trong mig 202609112330 giả định
--   "ghi qua fn_may_man_hs_quay (security definer...)" — nhưng hàm lại thiếu
--   đúng từ khoá đó). INSERT trong hàm ⇒ RLS chặn ⇒ lỗi trên.
--
-- FIX: thêm `security definer set search_path = public` — ĐÚNG pattern 2 hàm
--   anh em cùng migration, KHÔNG đổi 1 dòng logic nào khác (thân hàm lấy
--   NGUYÊN VĂN từ `pg_get_functiondef` DB live, xác nhận khớp file migration
--   gốc — không có drift).
--
-- MẤT GÌ: không — CREATE OR REPLACE, chỉ thêm 2 từ khoá vào khai báo hàm.
-- ============================================================================

create or replace function public.fn_may_man_hs_quay()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_active numeric;
  p50 numeric; p100 numeric; p150 numeric; p200 numeric;
  v_dk jsonb; v_bl_id uuid; v_mon text;
  v_rnd numeric; v_exp integer;
  l may_man_hs_luot;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai_hs:' || v_me::text));
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay em đã quay rồi — mai quay tiếp nhé!'; end if;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  if not coalesce((v_dk->>'du')::boolean, false) then
    raise exception 'Can lam 1 luot tu luyen 10 cau dung >= % phan tram de quay.', coalesce((v_dk->>'nguong_pct')::int, 70);
  end if;
  v_bl_id := (v_dk->>'bai_lam_id')::uuid;
  v_mon := v_dk->>'mon';
  select gia_tri into p50  from may_man_hs_cau_hinh where ma = 'ti_le_50';
  select gia_tri into p100 from may_man_hs_cau_hinh where ma = 'ti_le_100';
  select gia_tri into p150 from may_man_hs_cau_hinh where ma = 'ti_le_150';
  select gia_tri into p200 from may_man_hs_cau_hinh where ma = 'ti_le_200';
  v_rnd := random() * 100;
  -- Ưu tiên xét giải hiếm trước: [0,p200) → 200 · [p200, p200+p150) → 150 · … · phần còn lại → 50.
  v_exp := case
    when v_rnd < p200                       then 200
    when v_rnd < p200 + p150                then 150
    when v_rnd < p200 + p150 + p100         then 100
    else                                          50
  end;
  insert into may_man_hs_luot (hoc_sinh_id, ngay, exp, rnd, mon, bai_lam_id)
    values (v_me, v_today, v_exp, v_rnd, v_mon, v_bl_id)
    returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'exp', l.exp, 'mon', l.mon);
end $$;
grant execute on function public.fn_may_man_hs_quay() to authenticated;
revoke execute on function public.fn_may_man_hs_quay() from anon;
