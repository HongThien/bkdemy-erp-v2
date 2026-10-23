-- Bảng kết quả theo chuyên đề/chủ đề (Thùy 23/10, lượt 2):
--  (1) Cột Hình: tên mô hình bỏ chữ "Test" (mô hình MH.055 "Hình học Test" ⇒ "Hình học"); tên đã bắt đầu bằng "Hình"
--      thì không gắn thêm tiền tố "Hình: " (tránh "Hình: Hình học").
--  (3) Mỗi cột thêm cờ nang_cao: LUẬT CEO — chủ đề "các bài toán thực tế" là NÂNG CAO, còn lại đều CƠ BẢN.
--      Xem theo chuyên đề: chuyên đề thuộc chủ đề thực tế, hoặc chính tên chuyên đề là "… thực tế", cũng là Nâng cao.
--      (Không lấy theo cờ nang_cao của PHẦN đề: đề khảo sát K9 chỉ có 1 phần Tự luận, cờ phần không khớp chủ đề.)
--      Cột xếp Cơ bản trước, Nâng cao sau; trong mỗi nhóm giữ thứ tự câu xuất hiện trong đề.
create or replace function public.fn_mt_bang_ket_qua(p_de uuid, p_cap text)
 returns jsonb
 language sql
 stable
as $function$
  with buoi as (
    select distinct b.id, l.id as lop_id, l.ten_lop
      from tai_lieu t
      join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
     where t.loai = 'mt_buoi' and t.nguon_id = p_de
    union
    -- kỳ khảo sát chung của đề (không thuộc lớp)
    select b.id, null::uuid, null::text from buoi_hoc b where b.loai = 'khao_sat' and b.de_id = p_de and b.trang_thai <> 'huy'
  ),
  bd as (
    select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from dai_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from hgt_ban_do
    -- Hình học: không có chủ đề cũ ⇒ chủ đề mới (dai_bdm_chu_de) nếu đã gắn, chưa gắn thì gom "Hình học".
    union all select hb.ma_dang, hb.ma_chuyen_de, hb.ten_chuyen_de, coalesce(hb.chu_de_id, 'HINH'), coalesce(cdm.ten, 'Hình học')
      from hinh_hoc_bai hb left join dai_bdm_chu_de cdm on cdm.id = hb.chu_de_id
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o0 as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           bd1.ma_chuyen_de, bd1.ten_chuyen_de, bd1.ma_chu_de, bd1.ten_chu_de,
           mh.id as mh_id, mh.ma as mh_ma, mh.chu_de_id as mh_chu_de, cdm2.ten as mh_ten_chu_de,
           btrim(regexp_replace(mh.ten, '\s*\mtest\M\s*', ' ', 'gi')) as mh_ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de, bd.ma_chu_de, bd.ten_chu_de from bd where bd.ma_dang = s.ma_dang limit 1) bd1 on s.hinh_baitoan_id is null
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      left join dai_bdm_chu_de cdm2 on cdm2.id = mh.chu_de_id
      left join cu on cu.id = s.id
  ),
  o as (
    select o0.id, o0.buoi_hoc_id, o0.problem_no, o0.diem_toi_da, o0.bai_k, o0.bai_tong,
           case when p_cap = 'chu_de'
                then coalesce(o0.ma_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_chu_de, 'HINH') end, 'KHAC')
                else coalesce(o0.ma_chuyen_de, case when o0.mh_id is not null then 'MH:' || o0.mh_ma end, 'KHAC') end as cd,
           case when p_cap = 'chu_de'
                then coalesce(o0.ten_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_ten_chu_de, 'Hình học') end, 'Chưa gán chủ đề')
                else coalesce(o0.ten_chuyen_de,
                              case when o0.mh_id is not null then
                                case when coalesce(o0.mh_ten, '') = '' then 'Hình học'
                                     when o0.mh_ten ilike 'hình%' then o0.mh_ten
                                     else 'Hình: ' || o0.mh_ten end end,
                              'Chưa gán chuyên đề') end as ten,
           -- luật CEO 23/10: "thực tế" ⇒ Nâng cao
           (coalesce(o0.ten_chu_de, o0.mh_ten_chu_de, '') ilike '%thực tế%'
             or (p_cap <> 'chu_de' and coalesce(o0.ten_chuyen_de, '') ilike '%thực tế%')) as nc
      from o0
  ),
  g as (select o.*, gr.hoc_sinh_id, gr.diem_dat from o join gami_grades gr on gr.problem_id = o.id),
  don_vi as (
    select g.hoc_sinh_id, g.cd, g.diem_dat as dat, g.diem_toi_da as toi_da
      from g where g.diem_toi_da is not null and g.diem_dat is not null
    union all
    select g.hoc_sinh_id, g.cd, sum(g.diem_dat), max(g.bai_tong)
      from g where g.bai_tong is not null
     group by g.hoc_sinh_id, g.cd, g.buoi_hoc_id, g.bai_k
    having count(g.diem_dat) = (select count(*) from o o2 where o2.buoi_hoc_id = g.buoi_hoc_id and o2.bai_k = g.bai_k and o2.bai_tong is not null)
  ),
  pct as (
    select hoc_sinh_id, cd, round(100 * sum(dat) / sum(toi_da)) as p
      from don_vi group by hoc_sinh_id, cd having sum(toi_da) > 0
  ),
  hs as (
    -- lớp của em: lớp của buổi (MT) — kỳ khảo sát chung thì lớp hiện tại của em trong môn của đề
    select distinct on (g.hoc_sinh_id) g.hoc_sinh_id, coalesce(buoi.lop_id, lh.id) as lop_id, coalesce(buoi.ten_lop, lh.ten_lop) as ten_lop
      from g join buoi on buoi.id = g.buoi_hoc_id
      left join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.hoc_sinh_id = g.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                            and l.mon = (select mon from tai_lieu where id = p_de)
                          order by hl.ngay_vao desc nulls last limit 1) lh on buoi.lop_id is null
     order by g.hoc_sinh_id, buoi.lop_id nulls last, buoi.ten_lop
  ),
  diem as (
    select dt.hoc_sinh_id, round(avg(dt.diem), 2) as diem
      from diem_thi dt join ky_thi k on k.id = dt.ky_thi_id and k.loai in ('mt_sat_hach', 'khao_sat_thang')
     where k.buoi_hoc_id in (select id from buoi) and dt.diem is not null
     group by dt.hoc_sinh_id
  ),
  xep as (
    select hs.*, x.ho_ten, d.diem,
           case when d.diem is not null then rank() over (order by d.diem desc nulls last) end as hang
      from hs join hoc_sinh x on x.id = hs.hoc_sinh_id left join diem d on d.hoc_sinh_id = hs.hoc_sinh_id
  ),
  cot as (select cd, min(ten) as ten, min(problem_no) as tt, bool_or(nc) as nc from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten, 'nang_cao', nc) order by nc, tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$function$;
