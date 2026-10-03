-- ============================================================================
-- 202610031034 — 10 HỌC SINH TEST (Thùy 03/10: "log vào tài khoản học sinh quá lằng nhằng. Muốn ~10 tài khoản học sinh test để test các
--   tính năng cho dễ mà không ảnh hưởng đến hoạt động học tập")
-- ----------------------------------------------------------------------------
-- VÌ SAO / CÁCH CÔ LẬP:
--   (1) `hoc_sinh.trang_thai = 'test'` (nới CHECK). Mọi danh sách / báo cáo / học phí / cấp tài khoản / xếp hạng đang lọc 'dang_hoc' TỰ loại em test.
--       Hàm phía HS (my_hoc_sinh_id) không đòi chính em phải 'dang_hoc' ⇒ em test vẫn dùng app đủ (đo 03/10: chỉ 2 hàm BXH lọc, đã sửa ở dưới).
--   (2) Em test chỉ ghi danh vào LỚP TEST riêng (tên "TEST · <môn> <khối>", trạng thái `dong`): không buổi học, không học phí, không hiện ở danh
--       sách lớp đang học ⇒ điểm danh / ET / BTVN / bổ trợ / giải tháng / trợ lý (đều đi theo lớp-buổi thật) không bao giờ thấy em test.
--       Lớp có khối + môn thật ⇒ app ra đúng nội dung khối (tự luyện, sổ tay, bản đồ, TSA khối 12 qua mon_mo_ca_khoi).
--   (3) Chỗ tính trên CẢ KHỐI mà không xét trạng thái lớp/em (Rank mùa + đua tháng, album "N bạn đạt", việc trao huy hiệu, gợi ý kết bạn,
--       BXH tự luyện / tỉ lệ đạt, tin Thế giới BK) ⇒ thêm `_hs_hien(hs)`: em THẬT và nhân sự không bao giờ thấy em test; em test thấy cả hai
--       (để thử được BXH/Thế giới có mình trong đó). 1 hàm, không rải `trang_thai <> 'test'`.
--   Thân các hàm sửa lấy từ pg_get_functiondef bản đang chạy (scripts/_gen_mig_hs_test.mjs), chỉ thêm điều kiện.
--   Tài khoản đăng nhập (Supabase Auth, email <mã>@hs.bkdemy.local, mật khẩu = mã HS như quy ước cũ) tạo SAU bằng scripts/tao_tk_hs_test.mjs.
--   NGOÀI phạm vi: app Đấu từ (dautu.html — bảng người chơi riêng dtv_*), đổi quà do nhân sự tạo đơn tay.
--
-- MẤT GÌ (Luật xoá): không mất gì — nới 1 CHECK, thêm 2 hàm, 15 lớp, 10 em, 25 dòng ghi danh; sửa 8 hàm bằng create or replace (giữ chữ ký).
--   Hành vi đổi cho dữ liệu thật: KHÔNG (chưa em nào ở trạng thái 'test'). Dọn em test sau này = đổi trạng thái/xoá theo Luật xoá, hỏi Thùy.
-- ============================================================================

-- (1) trạng thái 'test'
alter table public.hoc_sinh drop constraint hoc_sinh_trang_thai_check;
alter table public.hoc_sinh add constraint hoc_sinh_trang_thai_check
  check (trang_thai = any (array['dang_hoc', 'bao_luu', 'nghi', 'tot_nghiep', 'test']));

create or replace function public._hs_la_test(p_hs uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from hoc_sinh where id = p_hs and trang_thai = 'test')
$$;
-- Người đang xem có được thấy em p_hs không: em thật luôn thấy; em test chỉ khi người xem cũng là em test (nhân sự: không).
create or replace function public._hs_hien(p_hs uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select not public._hs_la_test(p_hs) or public._hs_la_test(public.my_hoc_sinh_id())
$$;
revoke all on function public._hs_la_test(uuid) from public;
revoke execute on function public._hs_la_test(uuid) from anon;
revoke all on function public._hs_hien(uuid) from public;
revoke execute on function public._hs_hien(uuid) from anon;
grant execute on function public._hs_la_test(uuid) to authenticated;
grant execute on function public._hs_hien(uuid) to authenticated;

-- (2) lớp test + 10 em + ghi danh. Bộ khối chọn để phủ mọi kiểu Home: cấp 1 (3, 5) · cấp 2 (6–9, có em 3 môn) · cấp 3 (10–12, khối 12 có TSA).
do $$
declare
  r record; v_lop uuid; v_hs uuid; m text;
begin
  for r in select * from (values
    ('TEST01', 'Test 01 · Khối 3',  '3',  'nam', array['Toán']),
    ('TEST02', 'Test 02 · Khối 5',  '5',  'nu',  array['Toán']),
    ('TEST03', 'Test 03 · Khối 6',  '6',  'nam', array['Toán']),
    ('TEST04', 'Test 04 · Khối 7',  '7',  'nu',  array['Toán', 'KHTN', 'Tiếng Anh']),
    ('TEST05', 'Test 05 · Khối 8',  '8',  'nam', array['Toán', 'KHTN', 'Tiếng Anh']),
    ('TEST06', 'Test 06 · Khối 9',  '9',  'nam', array['Toán', 'KHTN', 'Tiếng Anh']),
    ('TEST07', 'Test 07 · Khối 9',  '9',  'nu',  array['Toán', 'KHTN', 'Tiếng Anh']),
    ('TEST08', 'Test 08 · Khối 10', '10', 'nu',  array['Toán']),
    ('TEST09', 'Test 09 · Khối 11', '11', 'nam', array['Toán']),
    ('TEST10', 'Test 10 · Khối 12', '12', 'nu',  array['Toán'])
  ) x(ma, ten, khoi, gt, mons)
  loop
    insert into hoc_sinh (ma_hs, ho_ten, khoi, gioi_tinh, trang_thai, ngay_nhap_hoc)
      values (r.ma, r.ten, r.khoi, r.gt, 'test', (now() at time zone 'Asia/Ho_Chi_Minh')::date)
      returning id into v_hs;
    foreach m in array r.mons loop
      select id into v_lop from lop where ten_lop = 'TEST · ' || m || ' ' || r.khoi;
      if v_lop is null then
        insert into lop (ten_lop, mon, khoi, trang_thai) values ('TEST · ' || m || ' ' || r.khoi, m, r.khoi, 'dong') returning id into v_lop;
      end if;
      insert into hoc_sinh_lop (hoc_sinh_id, lop_id, ngay_vao, trang_thai)
        values (v_hs, v_lop, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'dang_hoc');
    end loop;
  end loop;
end $$;

-- (3) chặn em test ở các hàm tính trên cả khối / toàn trường
-- fn_rank_mua(p_mon text, p_khoi text, p_ngay date) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.fn_rank_mua(p_mon text, p_khoi text DEFAULT NULL::text, p_ngay date DEFAULT NULL::date)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, khoi text, diem_mua integer, bac smallint, ten_bac text, sao smallint, nguong_bac integer, nguong_sau integer, ghe text, hang_khoi integer, so_em_khoi integer, phong_do numeric)
 LANGUAGE plpgsql
 STABLE
AS $function$
-- plpgsql để tính mùa / tháng TRƯỚC rồi gọi fn_rank_su_kien bằng hằng: truyền cột CTE vào hàm SQL làm planner
-- mất inline ⇒ 35 s thay vì ~0,2 s (đo 28/09).
declare
  v_d date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v_tu text; v_den text;
begin
  select m.thang_dau, least(m.thang_cuoi, to_char(v_d, 'YYYY-MM')) into v_tu, v_den
  from gami_mua m where to_char(v_d, 'YYYY-MM') between m.thang_dau and m.thang_cuoi limit 1;
  if v_tu is null then return; end if;
  return query
  with nay as (select v_d as d),
  mua as (select v_tu as thang_dau),
  cfg as (select * from rank_cau_hinh where mon = p_mon),
  bac as (select rb.bac, rb.ten, round(rb.he_so * cfg.diem_toi_da_thang)::int as nguong from rank_bac rb, cfg where rb.mon = p_mon),
  roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop, l.khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and (p_khoi is null or l.khoi = p_khoi) and public._hs_hien(hl.hoc_sinh_id)
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  diem as (
    select s.hoc_sinh_id, sum(s.diem)::int as d
    from public.fn_rank_su_kien(p_mon, v_tu, v_den) s
    where s.ngay <= v_d
    group by s.hoc_sinh_id
  ),
  -- Mẫu số phong độ: điểm tối đa CÓ THỂ kiếm tới hôm nay. Tháng đã qua: đủ phần ET+BTVN+Thử thách;
  -- tháng đang chạy: theo tỉ lệ ngày. Phần MT (100 × hệ số) chỉ cộng khi cửa sổ MT tháng đó đã đóng (10/T+1).
  mau as (
    select sum(
             (cfg.diem_toi_da_thang - 100 * cfg.mt_he_so)
               * case when (g.d + interval '1 month')::date <= nay.d then 1.0
                      else (nay.d - g.d + 1)::numeric / extract(day from (g.d + interval '1 month' - interval '1 day'))::numeric end
             + case when nay.d >= (g.d + interval '1 month' + interval '9 days')::date then 100 * cfg.mt_he_so else 0 end
           ) as toi_da
    from mua, nay, cfg,
         generate_series((mua.thang_dau || '-01')::date, date_trunc('month', nay.d)::date, interval '1 month') g0(x)
         cross join lateral (select g0.x::date as d) g
  ),
  r as (
    select ro.*, coalesce(di.d, 0) as dm,
           rank() over (partition by ro.khoi order by coalesce(di.d, 0) desc)::int as hk,
           count(*) over (partition by ro.khoi)::int as sk
    from roster ro left join diem di on di.hoc_sinh_id = ro.hoc_sinh_id
  )
  select r.hoc_sinh_id, hs.ho_ten, hs.ma_hs, r.lop_id, r.ten_lop, r.khoi, r.dm,
         b.bac, b.ten,
         case when b.bac >= 9 then 0 else least(3, 1 + floor(3.0 * (r.dm - b.nguong) / nullif(coalesce(bs.nguong, b.nguong + (b.nguong - bt.nguong)) - b.nguong, 0))) end::smallint,
         b.nguong, bs.nguong,
         case when b.bac >= 9 then b.ten end,
         r.hk, r.sk, round(r.dm / nullif(mau.toi_da, 0), 3)
  from r
  join hoc_sinh hs on hs.id = r.hoc_sinh_id
  cross join cfg cross join mau
  cross join lateral (select * from bac where bac.nguong <= r.dm order by bac.bac desc limit 1) b
  left join bac bs on bs.bac = b.bac + 1
  left join bac bt on bt.bac = b.bac - 1
  order by r.khoi, r.hk, hs.ho_ten;
end $function$;

-- fn_rank_dua_thang(p_mon text, p_khoi text, p_ym text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.fn_rank_dua_thang(p_mon text, p_khoi text, p_ym text)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, ten_lop text, diem_thang integer, hang integer, so_em_co_diem integer, et integer, btvn integer, mt integer, thu_thach integer)
 LANGUAGE sql
 STABLE
AS $function$
  with roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.ten_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi and public._hs_hien(hl.hoc_sinh_id)
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  s as (
    select s.hoc_sinh_id, sum(s.diem)::int as d,
           sum(s.diem) filter (where s.nguon = 'et')::int as et, sum(s.diem) filter (where s.nguon = 'btvn')::int as btvn,
           sum(s.diem) filter (where s.nguon = 'mt')::int as mt, sum(s.diem) filter (where s.nguon = 'thu_thach')::int as tt
    from public.fn_rank_su_kien(p_mon, p_ym, p_ym) s
    group by s.hoc_sinh_id
  )
  select ro.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ro.ten_lop, s.d,
         (rank() over (order by s.d desc))::int, (count(*) over ())::int,
         coalesce(s.et, 0), coalesce(s.btvn, 0), coalesce(s.mt, 0), coalesce(s.tt, 0)
  from roster ro join s on s.hoc_sinh_id = ro.hoc_sinh_id and s.d > 0
  join hoc_sinh hs on hs.id = ro.hoc_sinh_id
  order by s.d desc, hs.ho_ten
$function$;

-- fn_hs_album(p_mon text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.fn_hs_album(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  v_mua record; v_khoi text; v_den text;
begin
  if v_hs is null then return null; end if;
  if not exists (select 1 from huy_hieu where mon = p_mon and active) then return null; end if;
  select * into v_mua from gami_mua where v_ym between thang_dau and thang_cuoi limit 1;
  if v_mua.mua is null then return null; end if;
  v_den := least(v_ym, v_mua.hh_thang_cuoi);
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc nulls last limit 1;

  create temp table _thang on commit drop as
    select t.ym, h.huy_hieu_key, h.chuan, h.hoan_hao, h.da_chot
    from (select to_char(g, 'YYYY-MM') as ym from generate_series((v_mua.thang_dau || '-01')::date, (v_den || '-01')::date, interval '1 month') g) t
    cross join lateral public.fn_huy_hieu_thang(p_mon, t.ym, array[v_hs]) h;
  create temp table _nay on commit drop as
    select f.thanh_tuu_key, f.ket_qua from public.fn_thanh_tuu_thang(p_mon, v_ym, array[v_hs]) f
    where v_ym <= v_mua.hh_thang_cuoi;
  create temp table _khoi on commit drop as
    select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_khoi and public._hs_hien(hl.hoc_sinh_id);

  return jsonb_build_object(
    'mon', p_mon, 'mua', v_mua.mua, 'thang', v_ym, 'thang_cuoi', v_mua.hh_thang_cuoi,
    'si_so_khoi', (select count(*) from _khoi),
    'thang_sao', (select jsonb_agg(jsonb_build_object('sao', s.sao, 'so_thang', s.so_thang, 'loai', s.loai_thang, 'ban_cung', s.ban_cung, 'exp', s.exp) order by s.sao)
                  from huy_hieu_thang_sao s where s.mon = p_mon),
    'huy_hieu', (select jsonb_agg(jsonb_build_object(
        'key', hh.key, 'ten', hh.ten, 'bieu_tuong', hh.bieu_tuong, 'ghi_nhan', hh.ghi_nhan, 'cau_chuyen', hh.cau_chuyen,
        'n_chuan', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.chuan), 0),
        'n_hoan_hao', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.hoan_hao), 0),
        'n_chuan_tam', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.chuan and not t.da_chot), 0),
        'sao', coalesce((select max(d.sao) from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = hh.key and d.mua = v_mua.mua), 0),
        'dat', coalesce((select jsonb_agg(jsonb_build_object('sao', d.sao, 'lan', d.lan, 'dat_at', d.dat_at, 'thang_chot', d.thang_chot,
                    'da_trao', exists (select 1 from hs_huy_hieu_trao tr where tr.dat_id = d.id),
                    'so_ban_khoi', (select count(distinct o.hoc_sinh_id) from hs_huy_hieu_dat o join _khoi k on k.hoc_sinh_id = o.hoc_sinh_id
                                    where o.mon = p_mon and o.huy_hieu_key = hh.key and o.sao = d.sao and o.mua = v_mua.mua)) order by d.sao)
                  from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = hh.key and d.mua = v_mua.mua), '[]'::jsonb),
        'lich_su', coalesce((select jsonb_agg(jsonb_build_object('thang', t.ym, 'chuan', t.chuan, 'hoan_hao', t.hoan_hao, 'da_chot', t.da_chot) order by t.ym)
                  from _thang t where t.huy_hieu_key = hh.key), '[]'::jsonb),
        'thang_nay', coalesce((select jsonb_agg(jsonb_build_object('key', dk.thanh_tuu_key, 'ten', tk.ten, 'vai', dk.vai,
                    'ket_qua', (select n.ket_qua from _nay n where n.thanh_tuu_key = dk.thanh_tuu_key)) order by dk.vai, tk.thu_tu)
                  from huy_hieu_dieu_kien dk join thanh_tuu tk on tk.mon = dk.mon and tk.key = dk.thanh_tuu_key
                  where dk.mon = p_mon and dk.huy_hieu_key = hh.key), '[]'::jsonb)
      ) order by hh.thu_tu) from huy_hieu hh where hh.mon = p_mon and hh.active)
  );
end $function$;

-- fn_huy_hieu_viec_trao() — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.fn_huy_hieu_viec_trao()
 RETURNS TABLE(dat_id uuid, hoc_sinh_id uuid, ho_ten text, ma_hs text, ten_lop text, mon text, huy_hieu text, bieu_tuong text, sao smallint, dat_at timestamp with time zone)
 LANGUAGE sql
 STABLE
AS $function$
  select d.id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, l.ten_lop, d.mon, hh.ten, hh.bieu_tuong, d.sao, d.dat_at
  from hs_huy_hieu_dat d
  join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao and s.ban_cung
  join huy_hieu hh on hh.mon = d.mon and hh.key = d.huy_hieu_key
  join hoc_sinh hs on hs.id = d.hoc_sinh_id
  join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and public._hs_hien(d.hoc_sinh_id)
  join lop l on l.id = hl.lop_id and l.mon = d.mon
  join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'gv' and pc.la_chinh and pc.nhan_su_id = public.current_nhan_su_id()
  where d.lan = 1 and not exists (select 1 from hs_huy_hieu_trao t where t.dat_id = d.id)
  order by d.dat_at, l.ten_lop, hs.ho_ten
$function$;

-- fn_ban_be_goi_y(p_tim text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.fn_ban_be_goi_y(p_tim text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_me uuid := public.my_hoc_sinh_id(); v_ban uuid[]; v_lop uuid[]; v_q text := lower(btrim(coalesce(p_tim, '')));
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh'; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_lop := array(select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc');
  return coalesce((select jsonb_agg(r.j order by r.cung_lop desc, r.chung desc, r.ten) from (
    select h.ho_ten ten, (hl_cung.lop_id is not null) cung_lop,
           (select count(*) from public._ban_be_cua(h.id) x where x = any(v_ban)) chung,
           jsonb_build_object('id', h.id, 'nguoi', public._the_gioi_nguoi(h.id, coalesce(hl_cung.ten_lop, lp.ten_lop), false),
             'ly_do', case when hl_cung.lop_id is not null then 'Cùng lớp ' || hl_cung.ten_lop
                           else nullif((select count(*) from public._ban_be_cua(h.id) x where x = any(v_ban)), 0) || ' bạn chung' end,
             'trang_thai', (select case when m.trang_thai in ('cho', 'de_sau') and m.nguoi_gui = v_me then 'da_gui'
                                        when m.trang_thai = 'cho' then 'cho_em' end
                            from ban_be_loi_moi m where least(m.nguoi_gui, m.nguoi_nhan) = least(v_me, h.id) and greatest(m.nguoi_gui, m.nguoi_nhan) = greatest(v_me, h.id))) j
    from hoc_sinh h
    cross join lateral (select x.lop_id, x.ten_lop from public._the_gioi_lop(h.id, null) x) lp
    left join lateral (select hl.lop_id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id  -- lớp CHUNG với em (hiện đúng lớp đó)
                       where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and hl.lop_id = any(v_lop) limit 1) hl_cung on true
    left join the_gioi_cai_dat cd on cd.hoc_sinh_id = h.id
    where h.id <> v_me and not (h.id = any(v_ban)) and public._hs_hien(h.id)
      and case when v_q = '' then hl_cung.lop_id is not null or exists (select 1 from public._ban_be_cua(h.id) x where x = any(v_ban))
               when coalesce(cd.hien, 'ten') = 'ma' then lower(h.ma_hs) = v_q
               else lower(h.ho_ten) like '%' || v_q || '%' or lower(h.ma_hs) = v_q or lower(lp.ten_lop) = v_q end
    limit 30) r), '[]'::jsonb);
end $function$;

-- hs_xep_hang_tu_luyen(p_khoi text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.hs_xep_hang_tu_luyen(p_khoi text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select h.ma_hs, h.ho_ten,
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

-- hs_xep_hang_tu_luyen(p_khoi text, p_mon text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
CREATE OR REPLACE FUNCTION public.hs_xep_hang_tu_luyen(p_khoi text, p_mon text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select h.ma_hs, h.ho_ten,
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

-- fn_hs_xep_hang_ti_le_dat(p_mon text, p_khoi text) — thân từ bản đang chạy, chỉ thêm điều kiện _hs_hien
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
      and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
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
    'ma_hs', ma_hs, 'ho_ten', ho_ten, 'ti_le', ti_le,
    'so_dat', so_dat, 'so_dang', so_dang, 'la_toi', la_toi
  ) order by ti_le desc nulls last, ho_ten asc), '[]'::jsonb)
  from tinh
$function$;

-- _the_gioi_tin — thân từ bản đang chạy, bọc 1 lớp lọc em test
CREATE OR REPLACE FUNCTION public._the_gioi_tin(p_tu timestamp with time zone)
 RETURNS TABLE(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamp with time zone, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from (
  -- Nhất buổi (giải 1 xếp hạng buổi)
  select 'nhat_buoi:' || g.buoi_hoc_id || ':' || g.hoc_sinh_id, 'A', 'hoc', 'nhat_buoi', g.hoc_sinh_id, array[g.hoc_sinh_id], b.lop_id, g.mon,
         coalesce(b.giai_chot_at, g.created_at), jsonb_build_object('ngay', b.ngay)
  from buoi_giai g join buoi_hoc b on b.id = g.buoi_hoc_id
  where g.giai = 1 and coalesce(b.giai_chot_at, g.created_at) >= p_tu
  union all
  -- Nhất game buổi (cá nhân) — Bắn Quà chế độ đội thì tin theo ĐỘI ở dưới
  select 'game:' || l.id, 'A', 'game', 'game_nhat', l.hoc_sinh_id, array[l.hoc_sinh_id], b.lop_id, l.mon, l.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_luot l join buoi_hoc b on b.id = l.buoi_hoc_id
  where l.giai = 1 and l.at >= p_tu
    and not exists (select 1 from buoi_ban_qua q where q.buoi_hoc_id = l.buoi_hoc_id and q.che_do = 'doi' and l.game = 'ban_qua')
  union all
  -- 🧋 trúng trà sữa — tầng S
  select 'tra_sua:' || q.luot_id, 'S', 'mayman', 'tra_sua', q.hoc_sinh_id, array[q.hoc_sinh_id], b.lop_id, l.mon, q.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_qua q join buoi_game_luot l on l.id = q.luot_id join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.qua = 'tra_sua' and q.at >= p_tu
  union all
  -- Đội thắng Bắn Quà (chế độ đội)
  select 'ban_qua:' || q.buoi_hoc_id || ':' || d.doi, 'A', 'game', 'doi_thang', null::uuid,
         array(select h.hoc_sinh_id from buoi_ban_qua_hs h where h.buoi_hoc_id = q.buoi_hoc_id and h.doi = d.doi),
         b.lop_id, q.mon, q.chot_at, jsonb_build_object('doi', d.doi, 'game', 'ban_qua', 'ngay', b.ngay)
  from buoi_ban_qua q join buoi_ban_qua_doi d on d.buoi_hoc_id = q.buoi_hoc_id and d.hang = 1 join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.che_do = 'doi' and q.chot_at >= p_tu
  union all
  -- Huy hiệu: ★4–5 = S, ★1–3 = A
  select 'huy_hieu:' || x.id, case when x.sao >= 4 then 'S' else 'A' end, 'hoc', 'huy_hieu', x.hoc_sinh_id, array[x.hoc_sinh_id], null::uuid, x.mon, x.dat_at,
         jsonb_build_object('key', x.huy_hieu_key, 'ten', hh.ten, 'sao', x.sao)
  from hs_huy_hieu_dat x left join huy_hieu hh on hh.mon = x.mon and hh.key = x.huy_hieu_key
  where x.dat_at >= p_tu
  union all
  -- Giải tháng đã công bố — tầng S
  select 'giai_thang:' || g.id, 'S', 'hoc', 'giai_thang', g.hoc_sinh_id, array[g.hoc_sinh_id], g.lop_id, g.mon, g.cong_bo_at,
         jsonb_build_object('loai_giai', g.loai_giai, 'thang', g.thang)
  from giai_thuong g where g.cong_bo_at >= p_tu
  union all
  -- ET điểm cao (Thùy 29/09: tin phải là THÀNH TÍCH có số, tích cực — bỏ tin "xong N bài"). Chỉ ET từ 5 câu (đo 28 ngày: 41% lượt ET
  -- được 10 điểm nhưng phần lớn là ET 1–3 câu ⇒ không đáng khoe). ET 10 điểm = A (~5/ngày toàn trung tâm) · ET 9–9,5 = B.
  select 'et:' || e.buoi_hoc_id || ':' || e.hoc_sinh_id, case when e.ti_le = 1 then 'A' else 'B' end, 'hoc', 'et_cao',
         e.hoc_sinh_id, array[e.hoc_sinh_id], e.lop_id, e.mon, e.cham_at,
         jsonb_build_object('ngay', e.ngay, 'diem', round(e.ti_le * 10, 1), 'so_cau', e.so_cau)
  from public._et_diem_buoi((p_tu at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date) e
  where e.so_cau >= 5 and e.ti_le >= 0.9 and e.cham_at >= p_tu
  union all
  -- Tự luyện chăm (tầng B): ≥ 50 câu ĐÚNG trong 1 ngày / môn (đo 28 ngày: trung vị 12, top 10% ≈ 59) — 1 tin / em / ngày / môn
  select 'tu_luyen:' || bl.hoc_sinh_id || ':' || (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date || ':' || bt.mon, 'B', 'noluc', 'tu_luyen',
         bl.hoc_sinh_id, array[bl.hoc_sinh_id], null::uuid, bt.mon, max(blc.cham_at),
         jsonb_build_object('ngay', (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, 'so_dung', count(*))
  from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
  where bt.loai = 'tu_luyen' and blc.verdict = 'correct' and blc.cham_at >= p_tu
  group by bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon
  having count(*) >= 50
  union all
  -- 🔥 Chuỗi làm bài (mig 202610011515): mốc 7 = A (Lớp + Bạn bè) · 30/100/200/365 = S (lên Thế giới). Mỗi chuỗi chỉ tin MỐC CAO NHẤT trong cửa sổ.
  select * from (
  select distinct on (m.hoc_sinh_id, m.bat_dau)
         'chuoi:' || m.hoc_sinh_id || ':' || m.bat_dau || ':' || m.moc, case when m.moc >= 30 then 'S' else 'A' end, 'noluc', 'chuoi',
         m.hoc_sinh_id, array[m.hoc_sinh_id], null::uuid, m.mon, m.dat_at, jsonb_build_object('so_ngay', m.moc)
  from chuoi_moc_dat m
  where m.dat_at >= p_tu
  order by m.hoc_sinh_id, m.bat_dau, m.moc desc
  ) chuoi_tin
  union all
  -- ⬆ Lên bậc Rank (mig rank_len_bac): bậc 3–4 = B · 5–6 = A · ≥7 = S (lên Thế giới). Soldier (bậc 2) và Novice không có tin.
  select 'len_bac:' || r.hoc_sinh_id || ':' || r.mua || ':' || r.mon || ':' || r.bac,
         case when r.bac >= 7 then 'S' when r.bac >= 5 then 'A' else 'B' end, 'hoc', 'len_bac',
         r.hoc_sinh_id, array[r.hoc_sinh_id], null::uuid, r.mon, (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours',
         jsonb_build_object('bac', r.bac, 'ten_bac', r.ten_bac)
  from rank_len_bac r
  where r.bac >= 3 and (r.dat_ngay::timestamp at time zone 'Asia/Ho_Chi_Minh') + interval '12 hours' >= p_tu
  ) t(khoa, tang, nhom, kieu, hoc_sinh_id, thanh_vien, lop_id, mon, at, chi_tiet)
  where public._hs_hien(t.hoc_sinh_id) -- mig hs_test: tin của em test chỉ em test thấy
$function$;

