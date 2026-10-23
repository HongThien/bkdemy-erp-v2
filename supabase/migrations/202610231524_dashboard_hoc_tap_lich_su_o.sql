-- ============================================================================
-- 202610231524 — dashboard_hoc_tap_lich_su_o
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: dựng lại lá Dashboard học tập = bảng giống MT - Khảo sát (Tên · Lớp · mỗi Chuyên đề / Nhóm bài BẢN ĐỒ MỚI
--   1 cột, % trong 2–4 tuần gần nhất), bấm ô ⇒ lịch sử thay đổi của ô đó theo từng lượt.
--   Đây là KÊNH SONG SONG với mastery để so bên nào phản ánh đúng hơn — công thức KHÁC mastery có chủ ý:
--     · không trọng số, mỗi câu nặng như nhau, giá trị câu = điểm đạt / điểm tối đa (không có điểm ⇒ Đ 1 · nửa 0.5 · S 0)
--     · % của ô = trên TỐI ĐA 10 CÂU GẦN NHẤT trong cửa sổ
--     · câu trước cửa sổ KHÔNG tính, nhưng "đầu kỳ" = % trên 10 câu gần nhất trước cửa sổ — chỉ để tính tăng/giảm lượt đầu
--   Kênh (Thùy chốt 23/10): ET · BTVN (giấy + app + giáo trình) · MT/khảo sát · TEST bổ trợ (yếu · retest · bù · đuổi).
--   KHÔNG tính: luyện bổ trợ (bo_tro / bu_luyen / htd_luyen), tự luyện, game (ingame), ôn thi / thi thử.
--   Quy câu → ô bằng _do_o_bdm (cùng hàm mastery bản đồ mới) để hai kênh so công bằng.
--   Ngày của lượt = ngày em làm: ET/MT/BTVN giấy = ngày buổi; bài trên app = ngày nộp (chưa có thì ngày chấm).
--   gami_grades có bai_lam_cau_id = bản sao của câu làm trên app ⇒ bỏ, lấy bản gốc ở bai_lam_cau (không đếm 2 lần).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: chỉ thêm 3 hàm mới.
-- ============================================================================

-- ── 1. Mọi câu đã đo của nhóm HS (kênh dashboard), đã quy về ô bản đồ mới. p_tu NULL = mọi thời điểm ──
create or replace function _dbht_cau(p_hs uuid[], p_tu date, p_mon text)
returns table(hoc_sinh_id uuid, ngay date, t timestamptz, kenh text, luot text, thu_tu integer, ma_cau text,
              gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text)
language sql stable set search_path to 'public' as $$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy
    select g.hoc_sinh_id, bh.ngay, coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn') and g.bai_lam_cau_id is null
       and (p_tu is null or bh.ngay >= p_tu)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  cap as (
    select d.kc, d.kd, public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, '')) as o
      from (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd from m
             where ma_cau is not null or ma_dang is not null) d
     where not public._btyeu_la_hinh_mh(nullif(d.kd, ''))
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri, db.id, n.id, n.chuyen_de_id
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '')
    join dai_bdm_dang_bai db on db.id = cap.o
    join dai_bdm_nhom n on n.id = db.nhom_id
$$;

-- cùng 1 ngày: MT / ET làm trên lớp trước, BTVN về nhà sau, test bổ trợ cuối
create or replace function _dbht_kenh_tt(p_kenh text) returns integer language sql immutable as $$
  select case p_kenh when 'mt' then 1 when 'et' then 2 when 'btvn' then 3 else 4 end
$$;

create or replace function _dbht_tu(p_so_tuan integer) returns date language sql stable as $$
  select (now() at time zone 'Asia/Ho_Chi_Minh')::date - 7 * greatest(1, least(coalesce(p_so_tuan, 4), 8)) + 1
$$;

-- ── 2. Bảng: HS của khối (lớp môn đang học) × ô (chuyên đề | nhóm bài) có dữ liệu trong cửa sổ ──
-- Trả { tu, cot: [{ma, ten, cha}], hs: [{id, ten, lop_id, lop, o: {ma: {p, n}}}] }  — p = % trên ≤10 câu gần nhất, n = số câu trong cửa sổ
create or replace function fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer DEFAULT 4, p_cap text DEFAULT 'chuyen_de')
returns jsonb language sql stable set search_path to 'public' as $$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  c as (
    select x.*, case when p_cap = 'nhom' then x.nhom_id else x.chuyen_de_id end as cot
      from _dbht_cau((select array_agg(hoc_sinh_id) from hs), _dbht_tu(p_so_tuan), p_mon) x
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
              'o', coalesce((select jsonb_object_agg(o.cot, jsonb_build_object('p', o.p, 'n', o.n)) from o where o.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten) from hs join hoc_sinh x on x.id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$$;

-- ── 3. Lịch sử 1 ô: đầu kỳ + từng lượt trong cửa sổ ──
-- Trả { tu, dau_ky: {p, n} | null, luot: [{ngay, kenh, dung, tong, tl_dung, tl_tong, dung10, tong10, p, delta, cau: [{ma_cau, dang, nhom, g}]}] }
--   dung/tong = của riêng lượt · tl_* = cộng dồn trong cửa sổ (chưa cắt) · *10 = trên ≤10 câu gần nhất (ra p) · delta = p − p lượt trước (lượt đầu: − đầu kỳ)
create or replace function fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_tuan integer DEFAULT 4)
returns jsonb language sql stable set search_path to 'public' as $$
  with c as (
    select x.*, row_number() over (order by x.ngay, _dbht_kenh_tt(x.kenh), x.t, x.luot, x.thu_tu) as seq
      from _dbht_cau(array[p_hs], null, p_mon) x
     where (case when p_cap = 'nhom' then x.nhom_id else x.chuyen_de_id end) = p_ma
  ),
  truoc as (select * from c where ngay < _dbht_tu(p_so_tuan)),
  dau as (
    select round(100 * avg(gia_tri))::int as p, count(*) as n
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
  lq as (
    select lp.*, round(100 * dung10 / tong10)::int as p from lp
  ),
  ld as (
    select lq.*, p - coalesce(lag(p) over (order by cuoi), (select p from dau)) as delta from lq
  )
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'dau_ky', (select jsonb_build_object('p', p, 'n', n) from dau),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', ld.ngay, 'kenh', ld.kenh, 'dung', round(ld.dung, 2), 'tong', ld.tong,
              'tl_dung', round(ld.tl_dung, 2), 'tl_tong', ld.tl_tong, 'dung10', round(ld.dung10, 2), 'tong10', ld.tong10,
              'p', ld.p, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', w.ma_cau, 'dang', db.ten, 'nhom', n.ten, 'g', round(w.gia_tri, 2)) order by w.sw)
                        from w join dai_bdm_dang_bai db on db.id = w.dang_bai_id join dai_bdm_nhom n on n.id = w.nhom_id
                       where w.luot = ld.luot))
            order by ld.cuoi) from ld), '[]'::jsonb)
  )
$$;

revoke execute on function _dbht_cau(uuid[], date, text) from public, anon;
revoke execute on function fn_dbht_bang(text, text, integer, text) from public, anon;
revoke execute on function fn_dbht_o_lich_su(uuid, text, text, text, integer) from public, anon;
grant execute on function _dbht_cau(uuid[], date, text) to authenticated;
grant execute on function fn_dbht_bang(text, text, integer, text) to authenticated;
grant execute on function fn_dbht_o_lich_su(uuid, text, text, text, integer) to authenticated;
