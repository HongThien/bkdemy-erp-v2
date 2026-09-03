-- ============================================================================
-- 202608300749 — vá fn_completion_theo_lop: `done` phải GIAO với ô kỳ vọng
-- ----------------------------------------------------------------------------
-- VÌ SAO: bản 202608300747 đếm done trên MỌI cặp có dữ liệu — JS gốc chỉ đếm done
--   TRONG ô kỳ vọng (HS co_mat × buổi): HS vắng mà vẫn có bài chấm (ca triangulation
--   §5) không được tính vào tử số. Bắt được khi rà tail hàm client trước khi cắt.
-- MẤT GÌ (Luật xoá): không — replace function.
-- ============================================================================
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
    select distinct x.hoc_sinh_id, x.buoi_hoc_id from (
      select g.hoc_sinh_id, sp.buoi_hoc_id
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
      where p_phase <> 'btvn' and sp.phase = p_phase and sp.buoi_hoc_id in (select id from buoi)
      union all
      select k.hoc_sinh_id, k.buoi_hoc_id from btvn_ket_qua k
      where p_phase = 'btvn' and k.buoi_hoc_id in (select id from buoi)
    ) x
  )
  select l.id,
         (select count(*) from buoi b where b.lop_id = l.id),
         (select count(*) from expected e where e.lop_id = l.id),
         (select count(*) from expected e join done_pairs d
            on d.hoc_sinh_id = e.hoc_sinh_id and d.buoi_hoc_id = e.buoi_hoc_id
          where e.lop_id = l.id) -- done GIAO kỳ vọng — đúng JS gốc
  from lop l where l.mon = p_mon
$$;
