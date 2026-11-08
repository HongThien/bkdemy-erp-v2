-- ============================================================================
-- 202610241225 — mastery_lan_do_cap_materialized
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Sau khi bật công tắc, đề xuất dạng mới cho ca bổ trợ (56 HS) mất 17 s; mastery mới của 56 HS 10 s. Đo: quy dạng 11.700 cặp
--   câu–mã chỉ 1,5 s, nhưng CTE `cap` bị Postgres inline (tham chiếu 1 lần) ⇒ hàm quy dạng chạy cho TỪNG lượt đo (38.000).
--   Ép `materialized`. Kết quả y hệt (kiểm parity), chỉ nhanh hơn — mọi chỗ dùng mastery mới hưởng theo.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay thân _mastery_lan_do (1 từ khoá).
-- ============================================================================

CREATE OR REPLACE FUNCTION public._mastery_lan_do(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamp with time zone, src text)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as materialized (   -- 24/10: KHÔNG để Postgres inline — inline thì quy dạng chạy lại cho TỪNG lượt đo (38k) thay vì từng cặp câu–mã (12k)
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null
                when p_bdm then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))   -- BẢN ĐỒ MỚI (K6–12; cấp 1 + Hình giữ cũ bên trong)
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  )
  select mf.hoc_sinh_id, cap.nhom, mf.value, mf.t, mf.src
  from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
$function$;
