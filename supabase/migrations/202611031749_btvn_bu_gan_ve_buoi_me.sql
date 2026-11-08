-- ============================================================================
-- 202611031749 — btvn_bu_gan_ve_buoi_me
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 03/11 "Dữ liệu BTVN học bù phải được fill vào buổi học và cả report cũng như mastery, hiện tại hình như đang không dùng".
--   Đo thật: BTVN bù (mig 202609291823) nằm ở CA BÙ — 61 lượt / 1.044 câu đã chấm, 74 dòng btvn_ket_qua. MASTERY ĐÃ ĂN (nguồn
--   `_mastery_lan_do` đọc gami_grades mọi buổi, lượt tính theo ngày ca bù). Hai chỗ hỏng:
--   (1) Hiển thị theo BUỔI chỉ đọc buổi thường ⇒ buổi mẹ của em vắng chỉ có "Vắng", BTVN trống (Report PH "Chi tiết theo buổi",
--       tab BTVN của buổi học) — kết quả bù không gắn về đâu. Thêm hàm đọc gắn kết quả BTVN bù về BUỔI MẸ (qua bu_cho_buoi_id,
--       khoá tự nhiên — không nối câu theo vị trí): %, trạng thái nộp, thái độ, ngày bù. % = cùng công thức pctFromAgg của buổi
--       (Σđiểm / (100 × số câu), câu bỏ trống vào mẫu số).
--   (2) Câu BTVN bỏ trống = sai (Thùy 16/10) chỉ áp khi buổi đã "đóng BTVN" — ca bù không có nút đóng chung ⇒ câu bỏ trống của BTVN
--       bù KHÔNG bị tính 0, % BTVN bù bị thổi lên (cả ② Tổng quan). Ca bù coi là xong với em khi TA đã ghi trạng thái nộp — đúng
--       định nghĩa "XONG" của việc Chấm BTVN bù (mig 202609291823).
--   Em bù 2 lần cho cùng buổi mẹ (3 cặp): lấy ca bù CÓ dữ liệu BTVN gần nhất.
--
-- MẤT GÌ (Luật xoá): không — thay thân 1 hàm (nới điều kiện "đã đóng" cho ca bù), thêm 1 hàm đọc.
-- ============================================================================

create or replace function public._btvn_cau_bo_trong(p_hs uuid)
returns table(buoi_hoc_id uuid, ngay date, problem_id uuid, ma_dang text)
language sql stable as $function$
  select b.id, b.ngay, p.id, p.ma_dang
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id
    join gami_session_problems p
      on p.buoi_hoc_id = b.id and p.phase = 'btvn'
     and not p.hidden and not p.ngoai_de
     and (p.hoc_sinh_id is null or p.hoc_sinh_id = h.hoc_sinh_id)
   where h.hoc_sinh_id = p_hs
     -- buổi thường: đã đóng BTVN · ca bù (không có nút đóng chung): TA đã ghi trạng thái nộp cho em = xong (03/11)
     and (b.btvn_dong_at is not null
          or (b.loai = 'bu' and exists (select 1 from btvn_ket_qua k
                                          where k.hoc_sinh_id = p_hs and k.buoi_hoc_id = b.id and k.trang_thai_nop is not null)))
     and b.trang_thai is distinct from 'huy'
     and coalesce((select k.trang_thai_nop from btvn_ket_qua k
                    where k.hoc_sinh_id = p_hs and k.buoi_hoc_id = b.id), '') <> 'xin_phep'
     and exists (select 1 from gami_grades g
                   join gami_session_problems gp on gp.id = g.problem_id
                  where g.hoc_sinh_id = p_hs and gp.buoi_hoc_id = b.id and gp.phase = 'btvn')
     and not exists (select 1 from gami_grades g where g.problem_id = p.id and g.hoc_sinh_id = p_hs)
$function$;

-- Kết quả BTVN bù GẮN VỀ BUỔI MẸ. p_hs null = mọi em của các buổi mẹ (màn buổi học); có p_hs = 1 em (Report PH).
-- Chỉ trả dòng khi ca bù CÓ dữ liệu BTVN (điểm hoặc trạng thái nộp) — §1.5 không đẻ dòng rỗng.
create or replace function public.fn_btvn_bu_theo_buoi_me(p_buoi uuid[], p_hs uuid default null)
returns table(buoi_me_id uuid, hoc_sinh_id uuid, buoi_bu_id uuid, ngay_bu date,
              so_cau integer, pct integer, trang_thai_nop text, thai_do text)
language sql stable set search_path = public as $function$
  with bu as (
    select distinct on (hh.bu_cho_buoi_id, hh.hoc_sinh_id)
           hh.bu_cho_buoi_id as me, hh.hoc_sinh_id as hs, b.id as bu, b.ngay,
           k.trang_thai_nop, k.thai_do,
           g.pts, g.n
      from buoi_hoc_hs hh
      join buoi_hoc b on b.id = hh.buoi_hoc_id and b.loai = 'bu' and b.trang_thai is distinct from 'huy'
      left join btvn_ket_qua k on k.buoi_hoc_id = b.id and k.hoc_sinh_id = hh.hoc_sinh_id
      left join lateral (
        select sum(gg.points) as pts, count(*) as n
          from gami_grades gg join gami_session_problems sp on sp.id = gg.problem_id
         where gg.hoc_sinh_id = hh.hoc_sinh_id and sp.buoi_hoc_id = b.id and sp.phase = 'btvn'
      ) g on true
     where hh.bu_cho_buoi_id = any(p_buoi)
       and (p_hs is null or hh.hoc_sinh_id = p_hs)
       and (g.n > 0 or k.trang_thai_nop is not null)
     order by hh.bu_cho_buoi_id, hh.hoc_sinh_id, b.ngay desc, b.id
  )
  select bu.me, bu.hs, bu.bu, bu.ngay,
         (coalesce(bu.n, 0) + coalesce(t.so, 0))::int,
         case when coalesce(bu.n, 0) + coalesce(t.so, 0) > 0
              then least(100, round(coalesce(bu.pts, 0) / ((coalesce(bu.n, 0) + coalesce(t.so, 0)) * 100) * 100))::int end,
         bu.trang_thai_nop, bu.thai_do
    from bu
    left join lateral (select count(*) as so from public._btvn_cau_bo_trong(bu.hs) x where x.buoi_hoc_id = bu.bu) t on true
$function$;

revoke execute on function public.fn_btvn_bu_theo_buoi_me(uuid[], uuid) from public, anon;
grant execute on function public.fn_btvn_bu_theo_buoi_me(uuid[], uuid) to authenticated, service_role;
