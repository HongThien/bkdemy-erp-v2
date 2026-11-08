-- ============================================================================
-- 202610231632 — dashboard_hoc_tap_tang_giam_theo_luot
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10 đổi nghĩa ▲▼ trong cửa sổ lịch sử ô: "phần tăng thêm phải là hiệu của % trong hoạt động đấy trừ đi % trung bình
--   của hoạt động trước đó" — vd hết lần 2 đang 4/6 = 67%, lần 3 làm 3/4 = 75% ⇒ lần 3 tăng 8%.
--   Trước đây delta = % tích luỹ sau lượt − % tích luỹ trước lượt. Giờ: % RIÊNG lượt − % tích luỹ (≤10 câu) ngay trước lượt;
--   lượt đầu so với đầu kỳ, không có đầu kỳ ⇒ không có delta. Tính trên tỉ lệ chưa làm tròn rồi mới làm tròn.
--   Mũi tên ở BẢNG (fn_dbht_bang) giữ nghĩa cũ: % hiện tại − đầu kỳ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: fn_dbht_o_lich_su thay thân; mỗi lượt thêm khoá p_luot, p_truoc.
-- ============================================================================

create or replace function fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_tuan integer DEFAULT 4)
returns jsonb language sql stable set search_path to 'public' as $$
  with c as (
    select x.*, row_number() over (order by x.ngay, _dbht_kenh_tt(x.kenh), x.t, x.luot, x.thu_tu) as seq
      from _dbht_cau(array[p_hs], null, p_mon) x
     where _dbht_cot(p_cap, x.nhom_id, x.chuyen_de_id, x.chu_de_id) = p_ma
  ),
  truoc as (select * from c where ngay < _dbht_tu(p_so_tuan)),
  dau as (
    select round(100 * avg(gia_tri))::int as p, avg(gia_tri) as tl, count(*) as n
      from (select gia_tri from truoc order by seq desc limit 10) z
    having count(*) > 0
  ),
  w as (select c.*, row_number() over (order by seq) as sw from c where ngay >= _dbht_tu(p_so_tuan)),
  lu as (
    select luot, min(ngay) as ngay, min(t) as t, min(kenh) as kenh, sum(gia_tri) as dung, count(*) as tong, max(sw) as cuoi
      from w group by luot
  ),
  lp as (
    select lu.*,
           (select sum(gia_tri) from w where sw <= lu.cuoi) as tl_dung,
           lu.cuoi as tl_tong,
           (select sum(gia_tri) from w where sw between lu.cuoi - 9 and lu.cuoi) as dung10,
           least(lu.cuoi, 10) as tong10
      from lu
  ),
  lq as (select lp.*, round(100 * dung10 / tong10)::int as p from lp),
  -- tăng/giảm = % của RIÊNG lượt này − % tích luỹ ngay TRƯỚC lượt (lượt đầu: − đầu kỳ). Thùy 23/10: trước 4/6 = 67%, lượt làm 3/4 = 75% ⇒ +8
  ld as (
    select lq.*, round(100 * dung / tong)::int as p_luot,
           round(100 * (dung / tong - coalesce(lag(dung10 / tong10) over (order by cuoi), (select tl from dau))))::int as delta,
           round(100 * coalesce(lag(dung10 / tong10) over (order by cuoi), (select tl from dau)))::int as p_truoc
      from lq
  )
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'dau_ky', (select jsonb_build_object('p', p, 'n', n) from dau),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', ld.ngay, 'kenh', ld.kenh, 'dung', round(ld.dung, 2), 'tong', ld.tong,
              'tl_dung', round(ld.tl_dung, 2), 'tl_tong', ld.tl_tong, 'dung10', round(ld.dung10, 2), 'tong10', ld.tong10,
              'p', ld.p, 'p_luot', ld.p_luot, 'p_truoc', ld.p_truoc, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', w.ma_cau, 'dang', w.ten_dang, 'g', round(w.gia_tri, 2)) order by w.sw)
                        from w where w.luot = ld.luot))
            order by ld.cuoi) from ld), '[]'::jsonb)
  )
$$;
