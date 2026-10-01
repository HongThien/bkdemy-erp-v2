-- ============================================================================
-- 202609231622 — hs_vi_xu_bo_giao_dich_mua
-- ----------------------------------------------------------------------------
-- Thùy 23/09 (sau khi xem màn Ví xu): "Màn hoạt động ko hiện hoạt động tiêu.
-- Chỉ hiện hoạt động kiếm và bị phạt thôi. Mua đã hiện ở màn giao dịch rồi."
-- Tab "Hoạt động" của fn_hs_vi_xu_cua_toi (202609231557) đang UNION cả
-- qlht_xu_ledger.loai='doi_qua'/'hoan' — 2 loại này là giao dịch MUA (trừ khi
-- đổi quà, hoàn khi huỷ đổi) đã hiện đủ ở tab "Mua hàng" (lich_su_mua, đọc
-- thẳng qlht_doi_qua) rồi, lặp lại ở "Hoạt động" là dư/gây rối vì đây là màn
-- CHỈ để hiểu "vì sao được/mất điểm" (kiếm/phạt), không phải sổ giao dịch.
-- Fix: bớt đúng 1 điều kiện lọc trong CTE dong (không đụng gì khác) — 'xu'
-- giờ chỉ còn chot_thang/chot_lai (kiếm từ quy đổi EXP) + cong_tay (kiếm) +
-- tru_tay (phạt).
--
-- MẤT GÌ: không — CREATE OR REPLACE cùng hàm, chỉ thêm 1 điều kiện lọc, không
-- đổi tham số/cột trả về/logic so_du hay lich_su_mua.
-- ============================================================================

create or replace function public.fn_hs_vi_xu_cua_toi(p_ym text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ym text := coalesce(p_ym, to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'));
  v_so_du integer;
  v_mua jsonb;
  v_hoat_dong jsonb;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;

  select coalesce(sum(amount), 0)::int into v_so_du
  from qlht_xu_ledger where hoc_sinh_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'ten_qua', q.ten, 'anh_url', q.anh_url, 'so_luong', d.so_luong,
    'xu_tru', d.xu_tru, 'trang_thai', d.trang_thai, 'created_at', d.created_at, 'giao_luc', d.giao_luc
  ) order by d.created_at desc), '[]'::jsonb) into v_mua
  from (
    select * from qlht_doi_qua where hoc_sinh_id = v_me order by created_at desc limit 30
  ) d
  join qlht_qua q on q.id = d.qua_id;

  with cua_so as (
    select ((v_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((v_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ),
  dong as (
    select jsonb_build_object('loai', 'exp', 'nguon', l.source, 'mon', l.mon, 'so', l.amount,
             'created_at', l.created_at, 'ngay', b.ngay, 'lop', lp.ten_lop) as x, l.created_at as t
    from gami_exp_ledger l
    cross join cua_so w
    left join buoi_hoc b on b.id = l.ref_buoi_hoc_id
    left join lop lp on lp.id = b.lop_id
    where l.hoc_sinh_id = v_me and (
      (l.source in ('exp_et', 'exp_btvn', 'exp_btvn_thang') and l.note = v_ym)
      or (l.source = 'attend_floor' and l.created_at >= w.tu and l.created_at < w.den)
    )
    union all
    select jsonb_build_object('loai', 'may_man', 'nguon', 'may_man', 'mon', m.mon, 'so', m.exp,
             'created_at', m.created_at, 'ngay', m.ngay, 'lop', null), m.created_at
    from may_man_hs_luot m
    where m.hoc_sinh_id = v_me and to_char(m.ngay, 'YYYY-MM') = v_ym
    union all
    -- CHỈ kiếm/phạt (chot_thang/chot_lai = quy đổi EXP→xu · cong_tay/tru_tay = tay) —
    -- doi_qua/hoan là giao dịch mua, đã hiện ở lich_su_mua (Thùy 23/09).
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and x.loai in ('chot_thang', 'chot_lai', 'cong_tay', 'tru_tay')
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $$;

grant execute on function public.fn_hs_vi_xu_cua_toi(text) to authenticated;
revoke execute on function public.fn_hs_vi_xu_cua_toi(text) from anon;
