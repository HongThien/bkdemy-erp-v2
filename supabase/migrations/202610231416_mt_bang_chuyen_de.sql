-- ============================================================================
-- 202610231416 — mt_bang_chuyen_de
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 23/10): dashboard xem kết quả 1 KỲ THI (MT / khảo sát) theo CHUYÊN ĐỀ — mỗi HS 1 dòng: tên, lớp,
-- mỗi chuyên đề 1 cột (% đạt), điểm, xếp hạng. CEO chốt: phạm vi = 1 đề (gốc, mọi lớp đã gán); % đạt = điểm đạt /
-- điểm tối đa các câu thuộc chuyên đề. Giai đoạn chuyển giao ⇒ dùng CHUYÊN ĐỀ CŨ (ma_chuyen_de ở *_ban_do theo
-- dạng của ô chấm); xong bản đồ mới thì đổi nguồn chuyên đề trong hàm này (1 chỗ).
--   · Ô Đại/KHTN/HGT/Hình học: ma_dang → dai/khtn/hgt/hinh_hoc_ban_do (đo 23/10: không mã dạng nào trùng giữa 4 bảng).
--   · Ô Hình MÔ HÌNH (hinh_baitoan) không có chuyên đề cũ ⇒ cột theo mô hình ("Hình: <tên mô hình>").
--   · Ý Hình đề cũ chỉ đặt điểm CẢ BÀI (diem_toi_da NULL) ⇒ tính theo BÀI: Σ điểm các ý / điểm cả bài, chỉ khi HS đã
--     có điểm đủ mọi ý của bài (thiếu ý ⇒ bài đó chưa tính, không đoán).
--   · Ô chưa chấm / C chưa có điểm ⇒ không vào % (chưa đo ≠ 0, §5). Điểm = điểm MT/khảo sát tổng (diem_thi);
--     xếp hạng trên CẢ ĐỀ (mọi lớp), HS chưa có điểm tổng không xếp.
-- MẤT GÌ: không.
-- ============================================================================

-- Ô Hình của đề cũ (điểm cả bài) trong 1 buổi: bài thứ k + điểm cả bài. Cùng quy ước khớp hàng Hình với _mt_khung_tinh.
create or replace function _mt_o_bai_cu(p_buoi uuid)
returns table (id uuid, k int, tong numeric)
language sql stable as $$
  with doc as (
    select t.id as tl, coalesce(m.cau_hinh -> 'diemByCau', t.cau_hinh -> 'diemByCau', '{}'::jsonb) as dbc
      from buoi_hoc b join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
      left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
     where b.id = p_buoi order by t.created_at desc limit 1
  ),
  hinh as (
    select tc.ma_cau, row_number() over (order by p.thu_tu, tc.thu_tu) as k
      from doc join tai_lieu_phan p on p.tai_lieu_id = doc.tl and p.loai_phan = 'custom'
      join tai_lieu_cau tc on tc.phan_id = p.id
     where tc.ma_cau like 'HINH:%'
  )
  select s.id, h.k::int, (doc.dbc ->> h.ma_cau)::numeric
    from gami_session_problems s
    cross join doc
    join hinh h on h.k = nullif(substring(s.hinh_nhan from '^[0-9]+'), '')::int
   where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and s.hinh_baitoan_id is not null and s.diem_toi_da is null
     and (doc.dbc ? h.ma_cau)
     and not exists (select 1 from jsonb_object_keys(doc.dbc) as kk(k) where kk.k like h.ma_cau || '#%')
$$;

-- Danh sách đề (gốc) đã gán & có chấm — cho ô chọn đề của dashboard.
create or replace function fn_mt_ds_de_da_thi(p_mon text)
returns table (de_id uuid, ten text, khoi text, loai_de text, ngay_moi date, so_lop int)
language sql stable as $$
  select m.id, m.ten, m.khoi, m.cau_hinh -> 'mtMeta' ->> 'loaiDe', max(t.ngay), count(distinct t.lop_id)::int
    from tai_lieu m
    join tai_lieu t on t.loai = 'mt_buoi' and t.nguon_id = m.id
    join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
   where m.loai = 'mt' and m.mon = p_mon
     and exists (select 1 from gami_grades g join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
                  where s.buoi_hoc_id = b.id)
   group by m.id
   order by max(t.ngay) desc, m.ten
   limit 200
$$;

-- Bảng kết quả 1 đề theo chuyên đề. Trả { cot: [{ma, ten}], hs: [{id, ten, lop_id, lop, diem, hang, o: {ma: pct}}] }.
create or replace function fn_mt_bang_chuyen_de(p_de uuid)
returns jsonb language sql stable as $$
  with buoi as (
    select distinct b.id, l.id as lop_id, l.ten_lop
      from tai_lieu t
      join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
     where t.loai = 'mt_buoi' and t.nguon_id = p_de
  ),
  bd as (
    select ma_dang, ma_chuyen_de, ten_chuyen_de from dai_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de from khtn_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de from hgt_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de from hinh_hoc_ban_do
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           coalesce(bd1.ma_chuyen_de, case when mh.id is not null then 'MH:' || mh.ma end, 'KHAC') as cd,
           coalesce(bd1.ten_chuyen_de, case when mh.id is not null then 'Hình: ' || mh.ten end, 'Chưa gán chuyên đề') as ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de from bd where bd.ma_dang = s.ma_dang limit 1) bd1 on s.hinh_baitoan_id is null
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      left join cu on cu.id = s.id
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
    select distinct on (g.hoc_sinh_id) g.hoc_sinh_id, buoi.lop_id, buoi.ten_lop
      from g join buoi on buoi.id = g.buoi_hoc_id
     order by g.hoc_sinh_id, buoi.ten_lop
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
  cot as (select cd, min(ten) as ten, min(problem_no) as tt from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten) order by tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$$;

revoke execute on function _mt_o_bai_cu(uuid), fn_mt_ds_de_da_thi(text), fn_mt_bang_chuyen_de(uuid) from public, anon;
grant execute on function _mt_o_bai_cu(uuid), fn_mt_ds_de_da_thi(text), fn_mt_bang_chuyen_de(uuid) to authenticated;
