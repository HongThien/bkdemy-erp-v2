-- ============================================================================
-- 202610231607 — dashboard_hoc_tap_xu_huong_o
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: "cần mũi tên trendy hiện luôn ở ô % để nhìn phát ra luôn xu hướng". Mỗi ô thêm d = % hiện tại − MỐC:
--   mốc = đầu kỳ (% trên 10 câu gần nhất trước cửa sổ — cùng định nghĩa dòng "Đầu kỳ" của cửa sổ lịch sử) ⇒ d khớp tổng các
--   ▲▼ trong cửa sổ. Em chưa từng đo trước cửa sổ ⇒ mốc = % sau lượt ĐẦU trong cửa sổ (cần ≥2 lượt), cờ dk=false để UI ghi rõ.
--   Một lượt, không đầu kỳ ⇒ d NULL (chưa nói được xu hướng).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: fn_dbht_bang thay thân, chữ ký giữ; ô thêm 2 khoá d, dk.
-- ============================================================================

create or replace function fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer DEFAULT 4, p_cap text DEFAULT 'chuyen_de')
returns jsonb language sql stable set search_path to 'public' as $$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (   -- mọi lúc: trước cửa sổ chỉ để lấy "đầu kỳ"
    select x.*, case when p_cap = 'nhom' then x.nhom_id else x.chuyen_de_id end as cot, x.ngay >= _dbht_tu(p_so_tuan) as trong
      from _dbht_cau((select array_agg(hoc_sinh_id) from hs), null, p_mon) x
  ),
  c as (select * from ca where trong),
  dau as (   -- đầu kỳ = % trên 10 câu gần nhất TRƯỚC cửa sổ (giống fn_dbht_o_lich_su)
    select hoc_sinh_id, cot, round(100 * avg(gia_tri))::int as p from (
      select ca.*, row_number() over (partition by ca.hoc_sinh_id, ca.cot order by ca.ngay desc, _dbht_kenh_tt(ca.kenh) desc, ca.t desc, ca.luot desc, ca.thu_tu desc) as rn
        from ca where not ca.trong) z
     where rn <= 10 group by hoc_sinh_id, cot
  ),
  l1 as (   -- chưa đo trước cửa sổ ⇒ mốc = % sau LƯỢT ĐẦU trong cửa sổ (chỉ khi có ≥2 lượt)
    select hoc_sinh_id, cot, luot, gia_tri,
           dense_rank() over (partition by hoc_sinh_id, cot order by ngay, _dbht_kenh_tt(kenh), t, luot) as lr,
           row_number() over (partition by hoc_sinh_id, cot, luot order by thu_tu desc) as rn
      from c
  ),
  dau2 as (
    select hoc_sinh_id, cot, round(100 * avg(gia_tri) filter (where lr = 1 and rn <= 10))::int as p
      from l1 group by hoc_sinh_id, cot having max(lr) >= 2
  ),
  rk as (
    select c.*, row_number() over (partition by c.hoc_sinh_id, c.cot order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn,
           count(*) over (partition by c.hoc_sinh_id, c.cot) as n
      from c
  ),
  o as (
    select hoc_sinh_id, cot, round(100 * avg(gia_tri))::int as p, max(n) as n
      from rk where rn <= 10 group by hoc_sinh_id, cot
  ),
  od as (   -- d = xu hướng: % hiện tại − mốc (đầu kỳ; không có thì sau lượt đầu); NULL = chưa đủ để nói xu hướng
    select o.*, o.p - coalesce(dau.p, dau2.p) as d, dau.p is not null as co_dau
      from o left join dau using (hoc_sinh_id, cot) left join dau2 using (hoc_sinh_id, cot)
  ),
  cot as (
    select distinct o.cot from o
  ),
  cot_ten as (
    select cot.cot as ma,
           case when p_cap = 'nhom' then n.ten else ch.ten end as ten,
           case when p_cap = 'nhom' then ch.ten end as cha,
           cd.thu_tu as t1, bo.thu_tu as t2, case when p_cap = 'nhom' then n.thu_tu else 0 end as t3
      from cot
      left join dai_bdm_nhom n on p_cap = 'nhom' and n.id = cot.cot
      join dai_bdm_chuyen_de ch on ch.id = case when p_cap = 'nhom' then n.chuyen_de_id else cot.cot end
      join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de cd2 on cd2.id = o2.chu_de_id
                     where o2.chuyen_de_id = ch.id and (p_cap <> 'nhom' or o2.chu_de_id = n.chu_de_id)
                     order by cd2.thu_tu limit 1) bo on true
      join dai_bdm_chu_de cd on cd.id = bo.chu_de_id
  )
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'o', coalesce((select jsonb_object_agg(od.cot, jsonb_build_object('p', od.p, 'n', od.n, 'd', od.d, 'dk', od.co_dau)) from od where od.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten) from hs join hoc_sinh x on x.id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$$;
