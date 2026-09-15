-- ============================================================================
-- 202608300739 — Phase 3a §2.0: MASTERY suy động → function DB (một nguồn cho mọi scope)
-- ----------------------------------------------------------------------------
-- VÌ SAO: CLAUDE.md §1 nói "mastery suy động" — audit 30/08 phát hiện nó đang suy Ở
--   CLIENT (mastery.ts: 11 vi phạm, engine masteryOfDang chạy trong browser trên hàng
--   nghìn dòng đo; mọi reader — tổng quan HS, ma trận lớp, dashboard đánh giá, trợ lý,
--   ôn tập — đều import từ đây). fn_mastery_cells = MỘT định nghĩa ở Postgres.
--
-- CÔNG THỨC (nguyên văn src/gami/mastery.js + mastery.ts, Thùy chốt 07-10/07-15/18-20/08):
--   · Lần đo: gami_grades (phase et/mt; btvn qua toggle) · bai_lam_cau online (thi
--     et/de_thi ĐÃ NỘP → 'et' · tu_luyen → 'tu_luyen' · còn lại → 'btvn') · bt_grades → 'bt'.
--     ingame + dg KHÔNG vào mastery (07-15: "đánh giá GV phụ thuộc cảm giác").
--   · tu_luyen: cấp 1 (khối 3/4/4T/5/5T) LUÔN vào; cấp khác qua toggle (18-20/08).
--   · Điểm = TB CÓ TRỌNG SỐ của WINDOW lần đo GẦN NHẤT (mt=3 · et=2 · còn lại=1);
--     window/tin theo config (Đại 5/5/3 — Hình sẽ dùng 3/3/2 khi port).
--   · Mức: ≥0.8 đạt · ≥0.5 cần luyện · <0.5 yếu. Tin theo TỔNG n: ≥cao/≥tb/thấp.
--   · KHÔNG có lần đo = KHÔNG có dòng (chưa-đo ≠ yếu — §1.5/§5).
--   Hoà thời gian (chấm bulk cùng timestamp): tie-break tất định (src, value desc, ma_dang)
--   — JS cũ theo thứ tự trả về của PostgREST, hên xui như vụ rank Elo.
--
-- MẤT GÌ (Luật xoá): không — thêm function.
-- ============================================================================

create or replace function public.fn_mastery_cells(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null,
  p_window integer default 5, p_tin_cao integer default 5, p_tin_tb integer default 3)
returns table (hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           g.graded_at as t, sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or g.graded_at >= p_since)
    union all
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           blc.cham_at,
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
      and (p_since is null or blc.cham_at >= p_since)
    union all
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt'
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
  ),
  mf as ( -- gate nguồn: et/mt luôn · btvn/bt/tu_luyen theo toggle · tu_luyen cấp 1 luôn
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn
    from mf
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= p_tin_cao then 'cao' when count(*) >= p_tin_tb then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$$;
grant execute on function public.fn_mastery_cells(uuid[], boolean, timestamptz, integer, integer, integer) to authenticated;

-- Rollup mức per HS (đạt/cần luyện/yếu — chưa-đo = không dòng, đếm ở client theo bản đồ môn nếu cần).
create or replace function public.fn_mastery_rollup(p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null)
returns table (hoc_sinh_id uuid, dat bigint, can_luyen bigint, yeu bigint, tin_thap bigint)
language sql stable as $$
  select c.hoc_sinh_id,
         count(*) filter (where c.muc = 'dat'),
         count(*) filter (where c.muc = 'can_luyen'),
         count(*) filter (where c.muc = 'yeu'),
         count(*) filter (where c.tin = 'thap')
  from public.fn_mastery_cells(p_hs, p_include_btvn, p_since) c
  group by c.hoc_sinh_id
$$;
grant execute on function public.fn_mastery_rollup(uuid[], boolean, timestamptz) to authenticated;
