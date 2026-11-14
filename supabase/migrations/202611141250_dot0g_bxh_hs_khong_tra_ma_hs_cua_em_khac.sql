-- Đợt 0g — các bảng xếp hạng app HS KHÔNG trả mã HS của em khác. Thùy gật 14/11 "Bỏ ô tick" (ô "Mã HS" ở màn Bảng xếp hạng).
-- Mã HS = tên đăng nhập = mật khẩu mặc định. 4 hàm dưới (security definer, người đăng nhập nào cũng gọi được, tự chọn khối) trả mã của CẢ KHỐI.
-- Sau: chỉ dòng của CHÍNH em đang xem còn mã (dòng khác = null). Xếp hạng, tên, lớp, số liệu không đổi.
-- Bản app cũ chưa deploy lại vẫn chạy: khoá dòng rơi về vị trí / tên; ô tick (nếu còn) hiện "—" cho em khác.
-- KHÔNG bịt được việc đoán mã (mã đánh số tuần tự) — lỗ gốc là mật khẩu mặc định = mã HS, chờ Thùy quyết riêng.
-- Thân sinh từ định nghĩa đang sống (khoá md5), mỗi hàm thay đúng một chỗ.

CREATE OR REPLACE FUNCTION public.fn_bxh(p_loai text, p_mon text, p_pham_vi text DEFAULT 'khoi'::text, p_ky text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  l bxh_loai%rowtype; v_ky text; v_khoi text; v_hs uuid[]; v_tong int; v_top jsonb; v_toi jsonb;
  v_mon_k text; v_luc timestamptz; v_dung_luu boolean := false;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  select * into l from bxh_loai where ma = p_loai and active;
  if not found then raise exception 'Bảng xếp hạng không tồn tại.'; end if;
  if p_pham_vi not in ('khoi', 'toan_bk') then raise exception 'Phạm vi không hợp lệ.'; end if;
  v_ky := coalesce(p_ky, l.ky_mac_dinh);
  if not (v_ky = any(l.ky_cho_phep)) then raise exception 'Kỳ không hợp lệ cho bảng này.'; end if;
  select h.khoi into v_khoi from hoc_sinh h where h.id = v_me;
  if not l.san_sang then
    return jsonb_build_object('ma', l.ma, 'ten', l.ten, 'san_sang', false, 'ghi_chu', coalesce(l.ghi_chu, 'Sắp có'));
  end if;

  select array_agg(h.id) into v_hs from hoc_sinh h
  where h.trang_thai in ('dang_hoc', 'test') and public._hs_hien(h.id)
    and (p_pham_vi = 'toan_bk' or h.khoi is not distinct from v_khoi)
    and (not l.gan_mon or exists (select 1 from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                                  where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and lp.mon = p_mon));

  -- nguồn: bản tính sẵn còn tươi (cùng kỳ, ≤ 30 phút) ⇒ đọc bảng; không ⇒ tính trực tiếp như cũ
  v_mon_k := case when l.gan_mon then p_mon else '*' end;
  if p_loai in ('A1', 'A2', 'A3', 'A5') then
    select t.tinh_at into v_luc from bxh_luu_tinh t cross join public._bxh_ky(v_ky) k
    where t.loai = p_loai and t.mon = v_mon_k and t.ky = v_ky and t.tu = k.tu and t.den = k.den
      and t.tinh_at > now() - interval '30 minutes';
    v_dung_luu := v_luc is not null;
  end if;

  with g as (
    select x.hs, x.gia_tri, x.phu, x.dat_luc from bxh_luu x
    where v_dung_luu and x.loai = p_loai and x.mon = v_mon_k and x.ky = v_ky and x.hs = any(coalesce(v_hs, '{}'))
    union all
    select y.hs, y.gia_tri, y.phu, y.dat_luc from public._bxh_gia_tri(p_loai, p_mon, v_ky, coalesce(v_hs, '{}')) y
    where not v_dung_luu
  ), r as (
    select g.hs, g.gia_tri,
           (row_number() over (order by g.gia_tri desc, g.phu desc nulls last, g.dat_luc asc nulls last, g.hs))::int as hang,
           (count(*) over ())::int as tong
    from g
  )
  select
    (select coalesce(max(r.tong), 0) from r),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'hang', t.hang, 'ten', h.ho_ten, 'ma_hs', case when t.hs = v_me then h.ma_hs end, 'lop', lc.ten_lop, 'gia_tri', t.gia_tri, 'la_toi', t.hs = v_me) order by t.hang), '[]'::jsonb)
       from r t join hoc_sinh h on h.id = t.hs
       left join lateral (select lp.ten_lop from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                          where hl.hoc_sinh_id = t.hs and hl.trang_thai = 'dang_hoc' and (not l.gan_mon or lp.mon = p_mon)
                          order by hl.ngay_vao desc nulls last limit 1) lc on true
       where t.hang <= 20),
    (select jsonb_build_object('hang', t.hang, 'gia_tri', t.gia_tri) from r t where t.hs = v_me)
  into v_tong, v_top, v_toi;

  return jsonb_build_object('ma', l.ma, 'ten', l.ten, 'don_vi', l.don_vi, 'san_sang', true, 'ky', v_ky, 'pham_vi', p_pham_vi, 'khoi', v_khoi,
                            'tong', v_tong, 'top', v_top, 'toi', v_toi)
         || case when v_dung_luu then jsonb_build_object('tinh_luc', v_luc) else '{}'::jsonb end;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_hs_xep_hang_ti_le_dat(p_mon text, p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with roster as (
    select h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h where h.khoi = p_khoi and h.trang_thai in ('dang_hoc', 'test') and public._hs_hien(h.id)
  ),
  do_dang as (
    -- Cho MỖI HS × ma_dang: tổng số câu đã đo + số câu đúng
    select bl.hoc_sinh_id, bc.ma_dang,
           count(*) filter (where blc.verdict is not null) as tong_cau,
           count(*) filter (where blc.verdict = 'correct') as so_dung
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test_cau bc on bc.id = blc.bai_test_cau_id
    join bai_test bt on bt.id = bl.bai_test_id
    where bt.mon = p_mon and bl.hoc_sinh_id in (select hoc_sinh_id from roster)
      and bc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
    group by bl.hoc_sinh_id, bc.ma_dang
  ),
  hs_tong as (
    -- Đếm dạng đạt (tong_cau >= 3 và tỉ lệ >= 0.75) + dạng đã đo
    select hoc_sinh_id,
           count(*) filter (where tong_cau >= 3 and so_dung::numeric / tong_cau >= 0.75) as so_dat,
           count(*) as so_dang
    from do_dang group by hoc_sinh_id
  ),
  tinh as (
    select r.hoc_sinh_id, r.ho_ten, r.ma_hs, r.la_toi,
           coalesce(t.so_dat, 0)::int as so_dat,
           coalesce(t.so_dang, 0)::int as so_dang,
           case when coalesce(t.so_dang, 0) = 0 then null::numeric
                else round(t.so_dat::numeric / t.so_dang * 100, 1) end as ti_le
    from roster r left join hs_tong t on t.hoc_sinh_id = r.hoc_sinh_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma_hs', case when la_toi then ma_hs end, 'ho_ten', ho_ten, 'ti_le', ti_le,
    'so_dat', so_dat, 'so_dang', so_dang, 'la_toi', la_toi
  ) order by ti_le desc nulls last, ho_ten asc), '[]'::jsonb)
  from tinh
$function$;

CREATE OR REPLACE FUNCTION public.hs_xep_hang_tu_luyen(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select case when h.id = public.my_hoc_sinh_id() then h.ma_hs end as ma_hs, h.ho_ten,
           count(*) filter (where blc.verdict = 'correct')::int as so_cau_dung,
           (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h
    join bai_test bt on bt.hoc_sinh_id = h.id and bt.loai = 'tu_luyen'
    join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = h.id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
    where h.khoi = p_khoi and h.trang_thai in ('dang_hoc', 'test') and public._hs_hien(h.id)
    group by h.id, h.ma_hs, h.ho_ten
  ) x
$function$;

CREATE OR REPLACE FUNCTION public.hs_xep_hang_tu_luyen(p_khoi text, p_mon text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select case when h.id = public.my_hoc_sinh_id() then h.ma_hs end as ma_hs, h.ho_ten,
           count(*) filter (where blc.verdict = 'correct')::int as so_cau_dung,
           (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h
    join bai_test bt on bt.hoc_sinh_id = h.id and bt.loai = 'tu_luyen' and bt.mon = p_mon
    join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = h.id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
    where h.khoi = p_khoi and h.trang_thai in ('dang_hoc', 'test') and public._hs_hien(h.id)
    group by h.id, h.ma_hs, h.ho_ten
  ) x
$function$;
