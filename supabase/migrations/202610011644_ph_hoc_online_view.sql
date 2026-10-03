-- ============================================================================
-- 202610011644 — VIEW cho app PH: "Bài tập online" = việc con TỰ LÀM trên app HS.
-- ----------------------------------------------------------------------------
-- Nguồn: bai_lam_cau (dòng ĐÃ CHẤM — verdict not null, §1.5 không có dòng chờ) × bai_lam × bai_test.
-- Phạm vi (khớp fn_theodoi_bang_lam_bai bên ERP, CEO 17/09 + Học từ đầu 19/09):
--   tu_luyen · bo_tro/bo_tro_test · retest · htd_luyen/htd_test  = HS làm NGOÀI lớp.
--   KHÔNG tính et/btvn/giao_trinh/de_thi (làm trên lớp / đã có hộp riêng trong app PH).
-- 1 dòng = (HS × ngày VN × môn × nhóm). Cộng dồn tháng/chuỗi ngày tính ở PH-DB (fn_ph_hoc_online).
-- thoi_gian_giay = Σ (cham_at lớn nhất − nhỏ nhất) của TỪNG lượt làm trong ngày, mỗi lượt cắt tối đa
--   45 phút (bỏ khoảng treo máy) — là ƯỚC TÍNH, app PH hiển thị "khoảng X phút".
-- Quyền: chỉ fdw_bkdemy_web đọc (view chạy quyền owner → bắt buộc revoke anon/authenticated,
--   bài học 202608310020 + CLAUDE.md "AI ÁP đổi posture quyền").
-- MẤT GÌ: không mất gì — chỉ tạo view mới.
-- ============================================================================

create or replace view public.v_ph_hoc_online as
with luot as (
  select bl.id as bai_lam_id,
         bl.hoc_sinh_id,
         (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay,
         bt.mon,
         case bt.loai
           when 'tu_luyen'    then 'tu_luyen'
           when 'bo_tro'      then 'bo_tro'
           when 'bo_tro_test' then 'bo_tro'
           when 'retest'      then 'retest'
           else 'hoc_tu_dau'
         end as nhom,
         count(*) as so_cau,
         count(*) filter (where blc.verdict = 'correct') as so_dung,
         least(greatest(0, extract(epoch from (max(blc.cham_at) - min(blc.cham_at)))::int), 2700) as giay
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
   where blc.verdict is not null
     and bt.loai in ('tu_luyen', 'bo_tro', 'bo_tro_test', 'retest', 'htd_luyen', 'htd_test')
   group by bl.id, bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon, bt.loai
)
select hoc_sinh_id, ngay, mon, nhom,
       count(*)::int            as so_luot,
       sum(so_cau)::int         as so_cau,
       sum(so_dung)::int        as so_dung,
       (sum(so_cau) - sum(so_dung))::int as so_sai,
       sum(giay)::int           as thoi_gian_giay
  from luot
 group by hoc_sinh_id, ngay, mon, nhom;

revoke all on public.v_ph_hoc_online from public, anon, authenticated;

do $$ begin
  if exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    grant select on public.v_ph_hoc_online to fdw_bkdemy_web;
  end if;
end $$;
