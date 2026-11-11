-- ============================================================================
-- 202611112211 — toi_uu_hs_bxh_luu_san
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11; CLAUDE.md §2.0 "xếp hạng… không cần realtime ⇒ BẢNG TÍNH SẴN, màn chỉ ĐỌC"):
-- fn_bxh (Bảng xếp hạng app HS) mỗi lượt mở tính lại giá trị của MỌI em trong khối/toàn BK rồi mới xếp:
--   A3 "Tỉ lệ đạt" quét toàn bộ bài làm theo dạng của cả khối: đo 11/11 (ROLLBACK) 3–33 s phạm vi khối, 32–78 s toàn BK ⇒ luôn chạm trần 8 s.
--   A5 "Chuỗi" gọi _chuoi_cua cho từng em (0,5–5,8 s). A1/A2 0,1–0,3 s.
-- CÁCH LÀM — giá trị TỪNG EM tính sẵn (giá trị mỗi em KHÔNG phụ thuộc tập em được xếp — chính _bxh_gia_tri tính theo từng em):
--   · bxh_luu (loai, mon, ky, hs) = đúng dòng _bxh_gia_tri trả cho em đó, tính cho TẬP RỘNG NHẤT (mọi em dang_hoc/test, có lớp môn đó nếu bảng gắn môn).
--   · _bxh_lam_moi(ngân sách giây, cũ phút): pg_cron (file *_cron_sql_editor.sql) — bảng nào cũ quá N phút thì tính lại, cũ nhất trước.
--   · fn_bxh: lọc em (khối/toàn BK, môn, _hs_hien), xếp hạng, top 20, hạng của em — GIỮ NGUYÊN; chỉ đổi NGUỒN giá trị:
--       bản tính sẵn còn tươi (≤ 30 phút, cùng kỳ tu/den — qua nửa đêm là kỳ khác ⇒ tự rơi về tính trực tiếp) ⇒ đọc bảng; không ⇒ _bxh_gia_tri như cũ.
--     JSON thêm khoá 'tinh_luc' (lúc tính) khi đọc bảng — màn ghi "số tính lúc HH:MM".
--   · Chỉ A1 · A2 · A3 · A5. B1 (Mock Test) · C1 (Leo tháp) vốn nhẹ ⇒ giữ tính trực tiếp.
--
-- MẤT GÌ: không có dữ liệu thật. _bxh_lam_moi xoá-ghi lại dòng BẢN TÍNH SẴN của đúng bảng đang làm mới (bxh_luu — bảng chụp, dựng lại được bất cứ lúc nào).
-- ============================================================================

create table if not exists public.bxh_luu (
  loai text not null, mon text not null, ky text not null,   -- mon = '*' cho bảng không gắn môn
  hs uuid not null references public.hoc_sinh(id) on delete cascade,
  gia_tri numeric, phu numeric, dat_luc timestamptz,
  primary key (loai, mon, ky, hs)
);
create table if not exists public.bxh_luu_tinh (
  loai text not null, mon text not null, ky text not null,
  tu date not null, den date not null,                       -- kỳ _bxh_ky(ky) lúc tính
  tinh_at timestamptz not null, giay numeric,
  primary key (loai, mon, ky)
);
comment on table public.bxh_luu is 'Giá trị BXH từng em tính sẵn (_bxh_gia_tri). Chỉ _bxh_lam_moi ghi; fn_bxh đọc khi còn tươi. Mig 202611112211.';
alter table public.bxh_luu enable row level security;
alter table public.bxh_luu_tinh enable row level security;
revoke all on public.bxh_luu, public.bxh_luu_tinh from anon, authenticated;

create or replace function public._bxh_lam_moi(p_ngan_sach_giay integer default 40, p_cu_phut integer default 10)
returns integer language plpgsql volatile security definer set search_path = public as $$
declare k record; v_bd timestamptz := clock_timestamp(); v_t timestamptz; v_n integer := 0; v_hs uuid[]; v_tu date; v_den date;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền được làm mới bảng xếp hạng.'; end if;
  for k in
    with lo as (
      select l.ma, l.gan_mon, unnest(l.ky_cho_phep) as ky from bxh_loai l
      where l.active and l.san_sang and l.ma in ('A1', 'A2', 'A3', 'A5')
    ), mon as (
      select distinct lp.mon from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id where hl.trang_thai = 'dang_hoc' and lp.mon is not null
    ), viec as (
      select lo.ma, lo.ky, m.mon as mon_k, lo.gan_mon from lo join mon m on lo.gan_mon
      union all
      select lo.ma, lo.ky, '*', lo.gan_mon from lo where not lo.gan_mon
    )
    select v.*, t.tinh_at from viec v
    left join bxh_luu_tinh t on t.loai = v.ma and t.mon = v.mon_k and t.ky = v.ky
    order by t.tinh_at asc nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay);
    select b.tu, b.den into v_tu, v_den from public._bxh_ky(k.ky) b;
    continue when k.tinh_at is not null and k.tinh_at > now() - make_interval(mins => p_cu_phut)
                  and exists (select 1 from bxh_luu_tinh t where t.loai = k.ma and t.mon = k.mon_k and t.ky = k.ky and t.tu = v_tu and t.den = v_den);
    select array_agg(h.id) into v_hs from hoc_sinh h
    where h.trang_thai in ('dang_hoc', 'test')
      and (not k.gan_mon or exists (select 1 from hoc_sinh_lop hl join lop lp on lp.id = hl.lop_id
                                    where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and lp.mon = k.mon_k));
    v_t := clock_timestamp();
    delete from bxh_luu where loai = k.ma and mon = k.mon_k and ky = k.ky;
    insert into bxh_luu (loai, mon, ky, hs, gia_tri, phu, dat_luc)
    select k.ma, k.mon_k, k.ky, g.hs, g.gia_tri, g.phu, g.dat_luc
    -- từng em một (giá trị mỗi em độc lập): gọi 1 lần cho cả ~300 em ra kế hoạch tồi (A2 mùa 76 s đo 11/11), từng em ~ vài ms
    from unnest(coalesce(v_hs, '{}')) u cross join lateral public._bxh_gia_tri(k.ma, k.mon_k, k.ky, array[u]) g;
    insert into bxh_luu_tinh (loai, mon, ky, tu, den, tinh_at, giay)
    values (k.ma, k.mon_k, k.ky, v_tu, v_den, v_t, round(extract(epoch from clock_timestamp() - v_t)::numeric, 2))
    on conflict (loai, mon, ky) do update set tu = excluded.tu, den = excluded.den, tinh_at = excluded.tinh_at, giay = excluded.giay;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;
revoke all on function public._bxh_lam_moi(integer, integer) from public, anon, authenticated;

-- fn_bxh: nguyên văn bản 11/11 (pg_get_functiondef), chỉ đổi NGUỒN giá trị (khối "nguồn" dưới đây) + khoá 'tinh_luc'.
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
              'hang', t.hang, 'ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop', lc.ten_lop, 'gia_tri', t.gia_tri, 'la_toi', t.hs = v_me) order by t.hang), '[]'::jsonb)
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
