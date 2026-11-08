-- ============================================================================
-- 202611041657 — bao_cao_ky_p1b_so_tong_o_db
-- ----------------------------------------------------------------------------
-- VÌ SAO: soát màn Báo cáo kì theo §2.0 — bản xem trước đang tự tính ở client: dòng "Trung bình" phụ lục (TB điểm em, TB các
--   TB lần thi), cột Chênh từng lần và "Top x%" của hạng kì. Đưa xuống fn_bc_ky_tinh (nằm luôn trong snapshot ⇒ app PH / PDF
--   đọc thẳng, không ai phải tính lại): thi[].chenh · hang_ky.top_pct · tong_thi {tb_em, tb_lan, chenh}. Chênh = hiệu của 2 số
--   ĐÃ làm tròn 1 chữ số (khớp đúng số in trên phiếu). Phần còn lại của hàm giữ nguyên mig 202611041652.
--
-- MẤT GÌ (Luật xoá): không — thay thân 1 hàm, chỉ THÊM trường vào jsonb.
-- ============================================================================

create or replace function public.fn_bc_ky_tinh(p_hs uuid, p_mon text, p_ky uuid)
returns jsonb
language plpgsql stable
set search_path to 'public'
as $function$
declare
  v_ky ky_hoc;
  v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu date; v_het date; v_cuoi date; v_45 date;
  v_lop record; v_hs record; v_gv text; v_bc bao_cao_ph_ky;
  v_out jsonb;
begin
  select * into v_ky from ky_hoc where id = p_ky;
  if v_ky.id is null then raise exception 'Không có kì %', p_ky; end if;
  v_tu   := (v_ky.tu_thang || '-01')::date;
  v_het  := ((v_ky.den_thang || '-01')::date + interval '1 month')::date;   -- hết kì (không gồm)
  v_cuoi := least(v_het - 1, v_homnay);
  v_45   := v_cuoi - 44;                                                  -- 45 ngày tính cả ngày cuối
  select h.id, h.ho_ten, h.ma_hs into v_hs from hoc_sinh h where h.id = p_hs;
  select l.id, l.ten_lop, l.khoi into v_lop
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;
  select ns.ho_ten into v_gv from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
   where pc.lop_id = v_lop.id and pc.vai_tro = 'gv' and pc.la_chinh limit 1;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;

  with c as materialized (
    select x.* from public._dbht_cau(array[p_hs], least(v_tu, v_45), p_mon) x where x.ngay <= v_cuoi
  ),
  -- đơn vị liệt kê = có câu trong kì (hoặc trong 45 ngày)
  dv_cd as (select distinct chu_de_id as ma from c where ngay >= least(v_tu, v_45)),
  dv_ch as (select chuyen_de_id as ma, min(chu_de_id) as chu_de from c group by chuyen_de_id),
  r_cd as (
    select c.chu_de_id as ma, c.gia_tri,
           row_number() over (partition by c.chu_de_id order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn
      from c where c.ngay >= v_45
  ),
  r_ch as (
    select c.chuyen_de_id as ma, c.gia_tri,
           row_number() over (partition by c.chuyen_de_id order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn
      from c where c.ngay >= v_45
  ),
  p_cd as (select ma, round(100 * avg(gia_tri))::int as p, count(*)::int as n from r_cd where rn <= 20 group by ma),
  p_ch as (select ma, round(100 * avg(gia_tri))::int as p, count(*)::int as n from r_ch where rn <= 10 group by ma),
  -- tên + thứ tự theo bản đồ (Đại/HGT · Hình 'H:' · KHTN 'KC…' · 'HINH' = Hình chưa gắn chủ đề)
  t_cd as (
    select dv.ma,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kc.ten, dc.ten, dv.ma) as ten,
           coalesce(kc.thu_tu, dc.thu_tu, 9999) as tt
      from dv_cd dv
      left join khtn_bdm_chu_de kc on kc.id = dv.ma
      left join dai_bdm_chu_de dc on dc.id = case when dv.ma like 'H:%' then substr(dv.ma, 3) else dv.ma end
  ),
  t_ch as (
    select dv.ma, dv.chu_de,
           coalesce(case when dv.ma = 'HINH' then 'Hình' end, kch.ten, nmh.ten, dch.ten, dv.ma) as ten,
           coalesce(tcd.tt, 9999) as tt1,
           coalesce(ko.thu_tu, nmh.thu_tu, dbo.thu_tu, 9999) as tt2
      from dv_ch dv
      left join khtn_bdm_chuyen_de kch on kch.id = dv.ma
      left join hinh_nhom_mo_hinh nmh on dv.ma like 'H:%' and nmh.id::text = substr(dv.ma, 3)
      left join dai_bdm_chuyen_de dch on dch.id = dv.ma
      left join khtn_bdm_o ko on ko.chuyen_de_id = dv.ma and ko.chu_de_id = dv.chu_de
      left join dai_bdm_o dbo on dbo.chuyen_de_id = dv.ma and dbo.chu_de_id = dv.chu_de
      left join t_cd tcd on tcd.ma = dv.chu_de
  ),
  -- LẦN THI trong kì (khối của em)
  kt as (
    select k.id, k.loai, coalesce(k.ngay, b.ngay) as ngay,
           public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, b.ngay)) as thang
      from ky_thi k left join buoi_hoc b on b.id = k.buoi_hoc_id
     where k.loai in ('mt_sat_hach', 'khao_sat_thang') and k.mon = p_mon and k.khoi = v_lop.khoi
       and coalesce(k.ngay, b.ngay) is not null
  ),
  kt2 as (select * from kt where thang between v_ky.tu_thang and v_ky.den_thang),
  d as (
    select kt2.loai, kt2.thang, dt.hoc_sinh_id, avg(dt.diem) as diem, min(kt2.ngay) as ngay
      from diem_thi dt join kt2 on kt2.id = dt.ky_thi_id
     where dt.diem is not null
     group by kt2.loai, kt2.thang, dt.hoc_sinh_id
  ),
  lan as (
    select d.*, rank() over (partition by loai, thang order by diem desc)::int as hang,
           count(*) over (partition by loai, thang)::int as n_mau,
           avg(diem) over (partition by loai, thang) as tb
      from d
  ),
  ky_tb as (
    select hoc_sinh_id, avg(diem) as tb, count(*)::int as so_lan from d group by hoc_sinh_id
  ),
  ky_hang as (
    select hoc_sinh_id, tb, so_lan, rank() over (order by tb desc)::int as hang, count(*) over ()::int as tong from ky_tb
  ),
  cc as (
    select count(*) filter (where h.diem_danh = 'vang')::int as vang,
           count(*) filter (where h.diem_danh = 'vang_phep')::int as vang_phep,
           count(*) filter (where h.diem_danh = 'co_mat')::int as co_mat,
           count(h.diem_danh)::int as tong
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai is distinct from 'huy'
      join lop l on l.id = b.lop_id and l.mon = p_mon
     where h.hoc_sinh_id = p_hs and b.ngay >= v_tu and b.ngay <= v_cuoi
  )
  select jsonb_build_object(
    'phien_ban', 1,
    'tinh_luc', now(),
    'hs', jsonb_build_object('id', v_hs.id, 'ho_ten', v_hs.ho_ten, 'ma_hs', v_hs.ma_hs),
    'lop', jsonb_build_object('id', v_lop.id, 'ten', v_lop.ten_lop, 'khoi', v_lop.khoi),
    'mon', p_mon,
    'gv', v_gv,
    'ky', jsonb_build_object('id', v_ky.id, 'ten', v_ky.ten, 'tu_thang', v_ky.tu_thang, 'den_thang', v_ky.den_thang),
    'cua_so_hoan_thanh', jsonb_build_object('tu', v_45, 'den', v_cuoi, 'n_chu_de', 20, 'n_chuyen_de', 10),
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,
    'hoan_thanh', jsonb_build_object(
      'chu_de', coalesce((select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 20)
                                           order by t.tt, t.ten) from t_cd t left join p_cd p on p.ma = t.ma), '[]'::jsonb),
      'chuyen_de', coalesce((select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'chu_de', tc.ten, 'p', p.p, 'n', coalesce(p.n, 0), 'n_toi_da', 10)
                                              order by t.tt1, t.tt2, t.ten) from t_ch t left join p_ch p on p.ma = t.ma
                                              left join t_cd tc on tc.ma = t.chu_de), '[]'::jsonb)),
    'thi', coalesce((select jsonb_agg(jsonb_build_object(
                       'loai', l.loai,
                       'nhan', case l.loai when 'mt_sat_hach' then 'MT' else 'KS' end || ' T' || ltrim(substr(l.thang, 6, 2), '0'),
                       'thang', l.thang, 'ngay', l.ngay,
                       'diem', round(l.diem, 1), 'tb', round(l.tb, 1), 'chenh', round(l.diem, 1) - round(l.tb, 1), 'n_mau', l.n_mau, 'hang', l.hang)
                     order by l.ngay, l.loai) from lan l where l.hoc_sinh_id = p_hs), '[]'::jsonb),
    'hang_ky', (select jsonb_build_object('hang', k.hang, 'tong', k.tong, 'tb', round(k.tb, 1), 'so_lan', k.so_lan,
                                         'top_pct', greatest(1, round(100.0 * k.hang / k.tong))::int)
                  from ky_hang k where k.hoc_sinh_id = p_hs),
    'tong_thi', (select jsonb_build_object('tb_em', round(avg(l.diem), 1), 'tb_lan', round(avg(l.tb), 1),
                                           'chenh', round(avg(l.diem), 1) - round(avg(l.tb), 1))
                   from lan l where l.hoc_sinh_id = p_hs having count(*) > 0),
    'chuyen_can', (select to_jsonb(cc) from cc)
  ) into v_out;
  return v_out;
end
$function$;
