-- ============================================================================
-- 202609191526 — hs_dang_evals_fix_overload_trung (SỬA LỖI TỰ GÂY, phát hiện khi test tay)
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202609191521 viết `create or replace function hs_dang_evals(p_mon text)`
-- — SAI chữ ký, bản chuẩn (từ mig 202609121500, 12/09) là `(p_mon text, p_nhanh text
-- default null)`. Postgres không "replace" khác chữ ký — TẠO THÊM 1 overload song song
-- → gọi `hs_dang_evals('Toán')` (1 tham số, đúng cách client vẫn gọi) ra lỗi
-- "function ... is not unique" — RPC MASTERY DÙNG XUYÊN SUỐT APP bị vỡ ngay lập tức.
-- Bắt được khi test tay trước khi commit, CHƯA kịp lên git/production.
--
-- FIX: re-create ĐÚNG chữ ký 2 tham số (giữ nguyên p_nhanh chưa dùng tới, y hệt bản
-- gốc — không tự ý xoá tham số người khác thêm) kèm fix loại 'htd_luyen' khỏi mastery;
-- DROP bản 1-tham số sai tôi vừa tạo.
--
-- MẤT GÌ: drop 1 function overload tôi mới tạo lúc nãy (chưa ai kịp dùng, cùng phiên
-- này) — không có dữ liệu, không ảnh hưởng gì khác. KHÔNG đụng bản 2-tham số gốc ngoài
-- việc thêm điều kiện lọc htd_luyen.
-- ============================================================================

drop function if exists public.hs_dang_evals(text);

create or replace function public.hs_dang_evals(p_mon text, p_nhanh text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'KHTN' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join khtn_ban_do bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'KHTN' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join khtn_ban_do bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'KHTN'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join khtn_ban_do bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'KHTN'
    ) x;
  else
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = p.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bc.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bg.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
    ) x;
  end if;
  return v_out;
end $$;
grant execute on function public.hs_dang_evals(text, text) to authenticated;
