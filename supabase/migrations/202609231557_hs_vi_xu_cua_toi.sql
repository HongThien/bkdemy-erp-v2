-- ============================================================================
-- 202609231557 — hs_vi_xu_cua_toi
-- ----------------------------------------------------------------------------
-- Thùy 23/09: app HS cần 1 box "Ví xu" (số dư + lịch sử mua hàng + hoạt động
-- kiếm xu/EXP). Toàn bộ hạ tầng đọc xu hiện có (fn_tuqua_so_du, RLS của
-- qlht_xu_ledger/qlht_doi_qua/qlht_qua, RPC fn_gami_exp_chi_tiet_thang) đều
-- CHỈ DÀNH CHO NHÂN SỰ (la_thanh_vien() chỉ true khi tai_khoan.nhan_su_id
-- IS NOT NULL — tài khoản HS có hoc_sinh_id, không có nhan_su_id). Gọi thẳng
-- từ app HS sẽ lỗi ("Chỉ nhân sự được xem số dư xu") hoặc RLS trả 0 dòng im
-- lặng (CLAUDE.md §2.1). Viết RPC mới kiểu "của tôi", đúng khuôn đã có
-- fn_may_man_hs_cua_toi / fn_hs_thanh_tuu_cua_toi (202609112330_may_man_hs.sql):
-- security definer, tự resolve my_hoc_sinh_id(), trả 1 khối jsonb gộp sẵn —
-- client chỉ render, không tính/join gì thêm (§2.0).
--
-- MẤT GÌ: không — chỉ CREATE 1 hàm mới, không đụng bảng/hàm/RLS nào đã có.
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
    select jsonb_build_object('loai', 'xu', 'nguon', x.loai, 'mon', x.mon, 'so', x.amount,
             'created_at', x.created_at, 'ngay', null, 'lop', null), x.created_at
    from qlht_xu_ledger x
    where x.hoc_sinh_id = v_me
      and to_char(x.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = v_ym
  )
  select coalesce(jsonb_agg(x order by t desc), '[]'::jsonb) into v_hoat_dong from dong;

  return jsonb_build_object('ym', v_ym, 'so_du', v_so_du, 'lich_su_mua', v_mua, 'hoat_dong', v_hoat_dong);
end $$;

grant execute on function public.fn_hs_vi_xu_cua_toi(text) to authenticated;
revoke execute on function public.fn_hs_vi_xu_cua_toi(text) from anon;
