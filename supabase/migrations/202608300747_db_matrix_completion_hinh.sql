-- ============================================================================
-- 202608300747 — Phase 3b §2.0: MA TRẬN LỚP + HOÀN THÀNH DỮ LIỆU + MASTERY HÌNH → fn DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — getClassMatrix/fetchGradeAgg/getAllClassesCompletion phân trang
--   tay tới 200k-500k dòng gami_grades/buoi_hoc_hs về browser chỉ để GROUP BY; mastery
--   Hình còn nguyên ở client. 3 fn dưới thay trọn: ô ma trận (pct/khong_lam/vang), tỉ lệ
--   hoàn thành per lớp, cells Hình (KP = hinh_baitoan_id, window 3 · tin 3/2 — Thùy 21/08).
-- MẤT GÌ (Luật xoá): không — thêm function.
-- ============================================================================

-- Ô ma trận lớp×phase (chỉ ô CÓ dữ liệu — ô 'none' client tự mặc định khi dựng lưới).
create or replace function public.fn_matrix_lop(p_lop uuid, p_phase text, p_ym text default null)
returns table (hoc_sinh_id uuid, buoi_hoc_id uuid, pct integer, status text)
language sql stable as $$
  with buoi as (
    select id from buoi_hoc b
    where b.lop_id = p_lop and b.loai = 'thuong' and b.trang_thai <> 'huy'
      and case p_phase when 'et' then b.et_dong_at when 'mt' then b.mt_dong_at else b.btvn_dong_at end is not null
      and (p_ym is null or (b.ngay >= (p_ym || '-01')::date and b.ngay < (p_ym || '-01')::date + interval '1 month'))
  ),
  agg as (
    select g.hoc_sinh_id, sp.buoi_hoc_id, sum(g.points) as pts, count(*) as n
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where sp.buoi_hoc_id in (select id from buoi) and sp.phase = p_phase
    group by g.hoc_sinh_id, sp.buoi_hoc_id
  ),
  miss as (
    select k.hoc_sinh_id, k.buoi_hoc_id from btvn_ket_qua k
    where p_phase = 'btvn' and k.buoi_hoc_id in (select id from buoi)
      and k.trang_thai_nop in ('khong_lam', 'xin_phep')
  ),
  vang as (
    select r.hoc_sinh_id, r.buoi_hoc_id from buoi_hoc_hs r
    where r.buoi_hoc_id in (select id from buoi) and r.diem_danh in ('vang', 'vang_phep')
  )
  select a.hoc_sinh_id, a.buoi_hoc_id,
         least(100, round((a.pts / (a.n * 100.0)) * 100))::int, 'done'
  from agg a where a.n > 0
  union all
  select m.hoc_sinh_id, m.buoi_hoc_id, null, 'khong_lam' from miss m
  where not exists (select 1 from agg a where a.hoc_sinh_id = m.hoc_sinh_id and a.buoi_hoc_id = m.buoi_hoc_id and a.n > 0)
  union all
  select v.hoc_sinh_id, v.buoi_hoc_id, null, 'vang' from vang v
  where not exists (select 1 from agg a where a.hoc_sinh_id = v.hoc_sinh_id and a.buoi_hoc_id = v.buoi_hoc_id and a.n > 0)
    and not exists (select 1 from miss m where m.hoc_sinh_id = v.hoc_sinh_id and m.buoi_hoc_id = v.buoi_hoc_id)
$$;
grant execute on function public.fn_matrix_lop(uuid, text, text) to authenticated;

-- Tỉ lệ hoàn thành dữ liệu per lớp (ô kỳ vọng = HS co_mat × buổi đã đóng phase; done = đã có điểm/trạng thái).
create or replace function public.fn_completion_theo_lop(p_mon text, p_phase text, p_ym text)
returns table (lop_id uuid, buoi_count bigint, expected bigint, done bigint)
language sql stable as $$
  with buoi as (
    select b.id, b.lop_id from buoi_hoc b join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy'
      and case p_phase when 'et' then b.et_dong_at when 'mt' then b.mt_dong_at else b.btvn_dong_at end is not null
      and b.ngay >= (p_ym || '-01')::date and b.ngay < (p_ym || '-01')::date + interval '1 month'
  ),
  expected as (
    select bh.lop_id, r.hoc_sinh_id, r.buoi_hoc_id
    from buoi_hoc_hs r join buoi bh on bh.id = r.buoi_hoc_id
    where r.diem_danh = 'co_mat'
  ),
  done_pairs as (
    select distinct bh.lop_id, x.hoc_sinh_id, x.buoi_hoc_id from (
      select g.hoc_sinh_id, sp.buoi_hoc_id
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
      where p_phase <> 'btvn' and sp.phase = p_phase and sp.buoi_hoc_id in (select id from buoi)
      union all
      select k.hoc_sinh_id, k.buoi_hoc_id from btvn_ket_qua k
      where p_phase = 'btvn' and k.buoi_hoc_id in (select id from buoi)
    ) x join buoi bh on bh.id = x.buoi_hoc_id
  )
  select l.id,
         (select count(*) from buoi b where b.lop_id = l.id),
         (select count(*) from expected e where e.lop_id = l.id),
         (select count(*) from done_pairs d where d.lop_id = l.id)
  from lop l where l.mon = p_mon
$$;
grant execute on function public.fn_completion_theo_lop(text, text, text) to authenticated;

-- Mastery HÌNH: KP = hinh_baitoan_id (mô hình), nguồn CHỈ gami_grades (et/mt; btvn qua toggle),
-- window 3 · tin cao 3 / tb 2 (Thùy 21/08 — bài Hình dài, ít lần đo/node).
create or replace function public.fn_mastery_cells_hinh(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null)
returns table (hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with m as (
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           g.graded_at as t, sp.phase as src
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where g.hoc_sinh_id = any(p_hs) and sp.hinh_baitoan_id is not null
      and (sp.phase in ('et', 'mt') or (p_include_btvn and sp.phase = 'btvn'))
      and (p_since is null or g.graded_at >= p_since)
  ),
  rk as (
    select m.*, case m.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by m.hoc_sinh_id, m.hinh_baitoan_id
                              order by m.t desc, m.src, m.value desc) as rn
    from m
  )
  select hoc_sinh_id, hinh_baitoan_id,
         sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0),
         count(*),
         case when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= 3 then 'cao' when count(*) >= 2 then 'tb' else 'thap' end
  from rk group by hoc_sinh_id, hinh_baitoan_id
$$;
grant execute on function public.fn_mastery_cells_hinh(uuid[], boolean, timestamptz) to authenticated;
