-- ============================================================================
-- 202611171404 — bctk_hai_chieu_yeu
-- VÌ SAO (Thùy 17/11, nguyên văn): "Kiểm tra xem trong tính năng báo cáo tuần. dạng yếu và nhóm yếu đã cập nhật theo logic mới chưa ... Phải có 2 chiều :
--   1. đầu tuần - cuối tuần 2. phát sinh mới. Tách riêng 2 cái này để ko lẫn, ví dụ đầu tuần trước 80 nhóm yếu sau bổ trợ giảm còn 70 nhưng học kiến thức
--   bị thành 90 . lý thuyết là có tăng nhưng thực tế bổ trợ có tác dụng. Fix đi".
--   Hiện trạng đo 17/11: báo cáo + Tình hình chung CÙNG đọc ảnh chụp dang_yeu_dau_tuan (một nguồn). Nhưng (1) chỉ dạng có "vào/ra" và chỉ toàn khối; nhóm chỉ
--   đầu·cuối·giảm ⇒ 80→90 trông như "tăng"; (2) ảnh tuần 09/11 phần DẠNG chụp 10/11 bằng luật 2 cửa sổ CŨ (Toán 1.494), ảnh 16/11 theo luật MỚI (1.921) ⇒
--   báo cáo tuần 09–15/11 so 2 luật khác nhau.
--   Sửa: fn_bctk_so thêm khối 'hai_chieu' {dang, nhom} cho toàn khối + từng lớp: dau=|A| · con_yeu=|A∩B| · het_yeu=|A∖B| · roi (em thôi học) · phat_sinh=|B∖A| ·
--   cuoi=|B|; phien_ban 3. Chụp lại ảnh tuần 09/11 bằng hàm chụp hiện hành (_dang_yeu_chup_tuan — một luật cho cả dạng + nhóm).
-- MẤT GÌ (Luật xoá): ảnh chụp tuần 09/11 (dang_yeu_dau_tuan, mọi môn) bị thay bằng bản tính lại tại mốc 09/11 00:00 theo luật hiện hành
--   (ảnh là bộ đệm — spec-van-hanh-tuan §5.6). Báo cáo ĐÃ NỘP giữ snap cũ (phien_ban 1/2 = luật cũ).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_bctk_so(p_o jsonb, p_tu date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_den date := p_tu + 6;
  v_t1 date := p_tu + 7;                                                       -- ảnh cuối kỳ = ảnh đầu tuần sau
  v_tu_ts timestamptz := (p_tu::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v_t1_ts timestamptz := (v_t1::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v jsonb;
begin
  with o as (select x->>'mon' as mon, x->>'khoi' as khoi from jsonb_array_elements(p_o) x),
  lop_o as (
    select l.id, l.ten_lop, l.mon, l.khoi from lop l join o on o.mon = l.mon and o.khoi = l.khoi
     where l.trang_thai = 'dang_hoc'
        or exists (select 1 from buoi_hoc b where b.lop_id = l.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den)
  ),
  -- 1. ET chấm đúng hạn — theo buổi, lần đóng ĐẦU ≤ hạn (cùng cách Gậy / Hiệu suất TA); chỉ việc đã tới hạn hoặc đã đóng
  et_viec as (
    select distinct on (v.buoi_id) v.lop_id, v.buoi_id, v.han, public._viec_dong_dau(v.buoi_id, 'et', v.dong_at) as dd
      from public.fn_viec_buoi_thuong_lh(p_tu, v_den) v
     where v.tab = 'et' and v.vai = 'tg' and not v.et_online and v.lop_id in (select id from lop_o)
       and (v.dong_at is not null or v.han <= now())
  ),
  -- 1+2. điểm ET / BTVN theo LƯỢT (cùng nguồn bảng Học tập tuần) — trung bình toàn khối trên lượt, không trên trung bình lớp
  mx as (
    select lo.id as lop_id, p.pha, m.pct
      from lop_o lo cross join (values ('et'), ('btvn')) p(pha)
      cross join lateral public._troly_matrix(lo.id, p.pha, p_tu, v_den) m
     where m.status = 'done' and m.pct is not null
  ),
  -- 2. nộp BTVN (không tính xin phép)
  nop as (
    select b.lop_id, k.trang_thai_nop as t from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id
     where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den
       and b.lop_id in (select id from lop_o) and k.trang_thai_nop is not null
  ),
  -- HS của ô trong kỳ (một em một lớp mỗi môn)
  hs as (
    select distinct on (hl.hoc_sinh_id, lo.mon) hl.hoc_sinh_id, lo.id as lop_id, lo.mon
      from hoc_sinh_lop hl join lop_o lo on lo.id = hl.lop_id
     where hl.ngay_vao <= v_den and (hl.ngay_roi is null or hl.ngay_roi >= p_tu)
     order by hl.hoc_sinh_id, lo.mon, hl.ngay_vao desc
  ),
  -- 3+4. ảnh dạng yếu đầu / cuối kỳ
  dau as (select z.*, hs.lop_id from dang_yeu_dau_tuan z join hs on hs.hoc_sinh_id = z.hoc_sinh_id and hs.mon = z.mon where z.tuan = p_tu),
  cuoi as (select z.*, hs.lop_id from dang_yeu_dau_tuan z join hs on hs.hoc_sinh_id = z.hoc_sinh_id and hs.mon = z.mon where z.tuan = v_t1),
  a as (select d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from dau d, jsonb_array_elements(d.dang) e),
  b as (select d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from cuoi d, jsonb_array_elements(d.dang) e),
  ra as (select a.* from a
          where not exists (select 1 from b where b.hoc_sinh_id = a.hoc_sinh_id and b.mon = a.mon and b.ma = a.ma)
            and exists (select 1 from cuoi c where c.hoc_sinh_id = a.hoc_sinh_id and c.mon = a.mon)),
  ra_bc as (select ra.* from ra where exists (     -- hết yếu NHỜ lần đo mới trong kỳ
              select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
               where g.hoc_sinh_id = ra.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts
                 and public._do_o_bdm(p.ma_cau, p.ma_dang) = ra.ma)
              or exists (   /* 17/11: + bài TEST app / TA nhập (test sau giờ, test bù, ET app…) */
              select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
                join bai_test_cau btc on btc.id = blc.bai_test_cau_id
               where bl.hoc_sinh_id = ra.hoc_sinh_id and blc.verdict is not null and btc.ma_dang is not null
                 and blc.cham_at >= v_tu_ts and blc.cham_at < v_t1_ts
                 and bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test', 'btvn', 'giao_trinh')
                 and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
                 and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
                 and public._do_o_bdm(btc.ma_cau, btc.ma_dang) = ra.ma)),
  do_ky as (select hs.hoc_sinh_id from hs where exists (
              select 1 from gami_grades g where g.hoc_sinh_id = hs.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts)
              or exists (   /* 17/11: + bài TEST app / TA nhập (test sau giờ …) */
              select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
               where bl.hoc_sinh_id = hs.hoc_sinh_id and blc.verdict is not null
                 and blc.cham_at >= v_tu_ts and blc.cham_at < v_t1_ts
                 and bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test', 'btvn', 'giao_trinh')
                 and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop'))),
  -- 5. bổ trợ Yếu + Nhẹ đã thực hiện (em có mặt), quy môn qua ca
  bt as (
    select b.id as buoi_id, b.loai, x.hoc_sinh_id
      from buoi_hoc b
      left join ca_bo_tro cy on cy.id = b.ca_bo_tro_id
      left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
      join buoi_hoc_hs x on x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat'
      join hs on hs.hoc_sinh_id = x.hoc_sinh_id and hs.mon = coalesce(cy.mon, cn.mon)
     where b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den
  ),
  lop_so as (
    select lo.id, lo.ten_lop, lo.mon, lo.khoi,
      (select count(*) from et_viec e where e.lop_id = lo.id) as et_viec,
      (select count(*) from et_viec e where e.lop_id = lo.id and e.dd is not null and e.dd <= e.han) as et_dung,
      (select count(*) from mx where mx.lop_id = lo.id and mx.pha = 'et') as et_luot,
      (select round(avg(mx.pct), 1) from mx where mx.lop_id = lo.id and mx.pha = 'et') as et_tb,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t <> 'xin_phep') as bt_can,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t = 'nop_dung_han') as bt_dung,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t = 'nop_muon') as bt_muon,
      (select count(*) from mx where mx.lop_id = lo.id and mx.pha = 'btvn') as bt_luot,
      (select round(avg(mx.pct), 1) from mx where mx.lop_id = lo.id and mx.pha = 'btvn') as bt_tb,
      (select sum(d.so_dang_yeu) from dau d where d.lop_id = lo.id) as dy_dau,
      (select sum(d.so_dang_yeu) from cuoi d where d.lop_id = lo.id) as dy_cuoi,
      (select count(*) filter (where d.so_nhom_yeu > 0) from dau d where d.lop_id = lo.id) as hy_dau,
      (select count(*) filter (where d.so_nhom_yeu > 0) from cuoi d where d.lop_id = lo.id) as hy_cuoi,
      (select sum(d.so_nhom_yeu) from dau d where d.lop_id = lo.id) as ny_dau,
      (select sum(d.so_nhom_yeu) from cuoi d where d.lop_id = lo.id) as ny_cuoi,
      (select count(*) from hs where hs.lop_id = lo.id) as si_so
    from lop_o lo
  ),
  -- 17/11 Thùy: HAI CHIỀU tách riêng (dạng + nhóm, toàn khối + từng lớp). A = yếu ở ảnh đầu tuần, B = yếu ở ảnh cuối tuần (ảnh T2 tuần sau).
  --   Chiều 1 đầu→cuối (hiệu quả bổ trợ): dau=|A| · con_yeu=|A∩B| · het_yeu=|A∖B| (em còn ảnh cuối) · roi=yếu của em không còn ảnh cuối (thôi học/chuyển lớp).
  --   Chiều 2 phát sinh mới: phat_sinh=|B∖A|. cuoi=|B| = con_yeu + phat_sinh.
  hc_a as (select 'dang' as cap, d.lop_id, d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from dau d, jsonb_array_elements(d.dang) e
           union all select 'nhom', d.lop_id, d.hoc_sinh_id, d.mon, e->>'nhom' from dau d, jsonb_array_elements(coalesce(d.nhom, '[]'::jsonb)) e),
  hc_b as (select 'dang' as cap, d.lop_id, d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from cuoi d, jsonb_array_elements(d.dang) e
           union all select 'nhom', d.lop_id, d.hoc_sinh_id, d.mon, e->>'nhom' from cuoi d, jsonb_array_elements(coalesce(d.nhom, '[]'::jsonb)) e),
  hc_x as materialized (
    select a.cap, a.lop_id, 'a' as k,
           exists (select 1 from hc_b b where b.cap = a.cap and b.hoc_sinh_id = a.hoc_sinh_id and b.mon = a.mon and b.ma = a.ma) as chung,
           exists (select 1 from cuoi c where c.hoc_sinh_id = a.hoc_sinh_id and c.mon = a.mon) as co_cuoi
      from hc_a a
    union all
    select b.cap, b.lop_id, 'b',
           exists (select 1 from hc_a a where a.cap = b.cap and a.hoc_sinh_id = b.hoc_sinh_id and a.mon = b.mon and a.ma = b.ma), true
      from hc_b b),
  hc_g as (select cap, lop_id,
                  count(*) filter (where k = 'a')::int as dau,
                  count(*) filter (where k = 'a' and chung)::int as con_yeu,
                  count(*) filter (where k = 'a' and not chung and co_cuoi)::int as het_yeu,
                  count(*) filter (where k = 'a' and not co_cuoi)::int as roi,
                  count(*) filter (where k = 'b' and not chung)::int as phat_sinh,
                  count(*) filter (where k = 'b')::int as cuoi
             from hc_x group by grouping sets ((cap), (cap, lop_id))),
  co as (select exists (select 1 from dau) as co_dau, exists (select 1 from cuoi) as co_cuoi)
  select jsonb_build_object(
    'tu', p_tu, 'den', v_den, 'o', p_o, 'phien_ban', 3, 'hs_yeu_theo', 'nhom',   /* 17/11 Thùy: HS yếu = ≥ 1 NHÓM yếu (bản phien_ban 1 = theo dạng) */
    'co_anh_dau', co.co_dau, 'co_anh_cuoi', co.co_cuoi,     -- false = chưa có ảnh (chưa chụp) ⇒ số dạng yếu / HS yếu tương ứng không áp dụng
    'tong', public._bctk_nhom(
        (select count(*) from et_viec), (select count(*) from et_viec e where e.dd is not null and e.dd <= e.han),
        (select count(*) from mx where mx.pha = 'et'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'et'),
        (select count(*) from nop where nop.t <> 'xin_phep'), (select count(*) from nop where nop.t = 'nop_dung_han'),
        (select count(*) from nop where nop.t = 'nop_muon'),
        (select count(*) from mx where mx.pha = 'btvn'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'btvn'),
        case when co.co_dau then (select coalesce(sum(so_dang_yeu), 0) from dau) end,
        case when co.co_cuoi then (select coalesce(sum(so_dang_yeu), 0) from cuoi) end,
        case when co.co_dau then (select count(*) from dau where so_nhom_yeu > 0) end,
        case when co.co_cuoi then (select count(*) from cuoi where so_nhom_yeu > 0) end,
        (select count(*) from hs))
      || public._bctk_ny(case when co.co_dau then (select coalesce(sum(so_nhom_yeu), 0) from dau) end,
                         case when co.co_cuoi then (select coalesce(sum(so_nhom_yeu), 0) from cuoi) end)   /* 17/11: chỉ số Nhóm yếu */
      || jsonb_build_object('hai_chieu', case when co.co_dau and co.co_cuoi then (
        select jsonb_object_agg(cp.cap, jsonb_build_object('dau', coalesce(g.dau, 0), 'con_yeu', coalesce(g.con_yeu, 0), 'het_yeu', coalesce(g.het_yeu, 0),
                 'roi', coalesce(g.roi, 0), 'phat_sinh', coalesce(g.phat_sinh, 0), 'cuoi', coalesce(g.cuoi, 0),
                 'ti_le_het_yeu', public._bctk_pct(coalesce(g.het_yeu, 0), coalesce(g.dau, 0))))
          from (values ('dang'), ('nhom')) cp(cap)
          left join hc_g g on g.cap = cp.cap and g.lop_id is null) end)   /* 17/11: hai chiều toàn khối */
      || jsonb_build_object(
        'dong_chay', case when co.co_dau and co.co_cuoi then jsonb_build_object(
            'vao', (select count(*) from b where not exists (select 1 from a where a.hoc_sinh_id = b.hoc_sinh_id and a.mon = b.mon and a.ma = b.ma)),
            'ra_bang_chung', (select count(*) from ra_bc),
            'ra_cua_so', (select count(*) from ra) - (select count(*) from ra_bc)) end,
        'do_phu', jsonb_build_object('so_hs', (select count(*) from hs), 'so_hs_co_do', (select count(*) from do_ky),
                                     'ti_le', public._bctk_pct((select count(*) from do_ky), (select count(*) from hs))),
        'bo_tro', jsonb_build_object(
            'ca_yeu', (select count(distinct buoi_id) from bt where loai = 'bo_tro_yeu'),
            'ca_nhe', (select count(distinct buoi_id) from bt where loai = 'bo_tro_nhe'),
            'luot_hs', (select count(*) from bt),
            'hs_yeu_dau', case when co.co_dau then (select count(*) from dau where so_nhom_yeu > 0) end,
            'hs_yeu_duoc_bt', case when co.co_dau then (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0) end,
            'do_phu', case when co.co_dau then public._bctk_pct(
                (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0),
                (select count(*) from dau where so_nhom_yeu > 0)) end,
            'het_yeu_sau_ca', case when co.co_dau and co.co_cuoi then (
                select count(distinct bt.hoc_sinh_id) from bt
                  join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0
                  join cuoi c on c.hoc_sinh_id = bt.hoc_sinh_id and c.mon = d.mon and c.so_nhom_yeu = 0) end)),
    'lop', (select coalesce(jsonb_agg(
              jsonb_build_object('lop_id', s.id, 'ten_lop', s.ten_lop, 'mon', s.mon, 'khoi', s.khoi)
              || public._bctk_nhom(s.et_viec, s.et_dung, s.et_luot, s.et_tb, s.bt_can, s.bt_dung, s.bt_muon, s.bt_luot, s.bt_tb,
                                   case when co.co_dau then coalesce(s.dy_dau, 0) end, case when co.co_cuoi then coalesce(s.dy_cuoi, 0) end,
                                   case when co.co_dau then s.hy_dau end, case when co.co_cuoi then s.hy_cuoi end, s.si_so)
              || public._bctk_ny(case when co.co_dau then coalesce(s.ny_dau, 0) end, case when co.co_cuoi then coalesce(s.ny_cuoi, 0) end)
              || jsonb_build_object('hai_chieu', case when co.co_dau and co.co_cuoi then (
        select jsonb_object_agg(cp.cap, jsonb_build_object('dau', coalesce(g.dau, 0), 'con_yeu', coalesce(g.con_yeu, 0), 'het_yeu', coalesce(g.het_yeu, 0),
                 'roi', coalesce(g.roi, 0), 'phat_sinh', coalesce(g.phat_sinh, 0), 'cuoi', coalesce(g.cuoi, 0),
                 'ti_le_het_yeu', public._bctk_pct(coalesce(g.het_yeu, 0), coalesce(g.dau, 0))))
          from (values ('dang'), ('nhom')) cp(cap)
          left join hc_g g on g.cap = cp.cap and g.lop_id = s.id) end)   /* 17/11: hai chiều từng lớp */
              order by s.mon, coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi, s.ten_lop), '[]'::jsonb) from lop_so s),
    -- 4. HS còn yếu cuối kỳ + trạng thái xử lý (chưa xử lý xếp đầu)
    'hs_con_yeu', (select coalesce(jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ten_lop', lo.ten_lop, 'mon', c.mon, 'so_dang_yeu', c.so_dang_yeu, 'so_nhom_yeu', c.so_nhom_yeu,
              'nhom', (select coalesce(jsonb_agg(e->>'ten_nhom'), '[]'::jsonb) from jsonb_array_elements(c.nhom) e),
              'dang', (select coalesce(jsonb_agg(e->>'ten_dang'), '[]'::jsonb) from jsonb_array_elements(c.dang) e),
              'xu_ly', xl.xu_ly)
              order by (xl.xu_ly = 'chua') desc, c.so_nhom_yeu desc, c.so_dang_yeu desc, h.ho_ten), '[]'::jsonb)
            from cuoi c
            join hoc_sinh h on h.id = c.hoc_sinh_id
            join lop_o lo on lo.id = c.lop_id
            cross join lateral (select case
                when exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = c.hoc_sinh_id and y.mon = c.mon and y.trang_thai = 'dang_xu') then 'bo_tro_yeu'
                when exists (select 1 from bt where bt.hoc_sinh_id = c.hoc_sinh_id and bt.loai = 'bo_tro_nhe') then 'ca_nhe'
                when exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = c.hoc_sinh_id and t.mon = c.mon and t.trang_thai = 'theo_doi') then 'theo_doi'
                else 'chua' end as xu_ly) xl
           where c.so_nhom_yeu > 0)
  ) into v
  from co;
  return v;
end $function$;

-- chụp lại ảnh tuần 09/11 theo luật hiện hành
select public._dang_yeu_chup_tuan(date '2026-11-09');
