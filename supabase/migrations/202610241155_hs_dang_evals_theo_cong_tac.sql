-- ============================================================================
-- 202610241155 — hs_dang_evals_theo_cong_tac
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Bật công tắc mastery bản đồ mới (24/10) làm hỏng màn "dạng học tập" app HS (hs_dang_hoc_tap): điểm lấy fn_mastery_cells_moi
--   (mã NDB) còn danh sách dạng + 5 lần đo gần nhất lấy hs_dang_evals quy bằng _do_nhom_cua_o (mã cũ) ⇒ ghép không khớp,
--   đo 1 HS K9: 59 dạng chỉ 2 dạng có điểm. nhánh Toán của hs_dang_evals đọc _mastery_lan_do (nguồn đo chung của mastery mới, theo công tắc) + tra tên bản đồ mới.
--   Bản quy _do_o từng dòng đúng nhưng 7–10 s/HS (quy lại mỗi lượt) ⇒ dùng nguồn chung (quy mỗi cặp câu–mã 1 lần).
--   Mig 202610231553 ghi chú "hs_dang_evals theo công tắc" nhưng thân hàm thật vẫn _do_nhom_cua_o — ghi chú sai, kiểm thân hàm mới tin.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay thân hs_dang_evals (nhánh Toán: t = ngày buổi thay ngày chấm, lượt htd_luyen tính như BTVN — khớp đúng điểm).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.hs_dang_evals(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'Toán' then
    -- 24/10: lần đo = ĐÚNG các lượt mà điểm (fn_mastery_cells_moi) dùng — nguồn chung _mastery_lan_do, quy dạng theo công tắc
    -- (mỗi cặp câu–mã chép quy 1 lần ⇒ nhanh); t = ngày buổi như mastery.
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select e.ma_dang, e.value, e.t, e.src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang, bd_moi.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, bd_moi.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do, bd_moi.muc_do) as muc_do
      from public._mastery_lan_do(public._mastery_bdm_bat(), array[v_hs], true, null, null) e
      left join dai_ban_do bd_dai on bd_dai.ma_dang = e.ma_dang and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = e.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = e.ma_dang
      left join bdm_ban_do bd_moi on e.ma_dang like 'NDB%' and bd_moi.ma_dang = e.ma_dang
      where (bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null or bd_moi.ma_dang is not null) -- dạng không còn trong bản đồ ⇒ không hiện
    ) x;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng bản đồ qua REGISTRY, môn là tham số (CLAUDE §1.6)
    execute format($q$
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn') and (l.mon = $2 or (l.mon is null and bd.ma_dang is not null))   -- buổi không gắn lớp: chỉ nhận dạng của CHÍNH môn này (§1.6); trước đây dạng Toán lọt sang KHTN/Anh

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join %1$I bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
        and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join %1$I bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
    $q$, public._kho_ban_do_tbl(p_mon, null)) into v_out using v_hs, p_mon;
  end if;
  return v_out;
end $function$;
