-- ============================================================================
-- 202610161538 — btvn_cau_bo_trong_tinh_sai
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 16/10): HS làm BTVN trên app bỏ trống nhiều câu, bị đánh thái độ "chưa nghiêm túc"
--   nhưng "% làm đúng BTVN" của buổi vẫn rất cao — vì % = điểm / SỐ CÂU ĐÃ CHẤM, câu bỏ trống
--   không có dòng gami_grades nên rơi khỏi mẫu số. Quyết định: ở con số HIỂN THỊ % BTVN,
--   câu chưa làm = SAI (0 điểm).
--
-- PHẠM VI: CHỈ con số hiển thị % BTVN (Report PH: bảng theo buổi + thẻ "Bài tập về nhà").
--   KHÔNG đụng mastery (§5: "chưa đo" ≠ "yếu") — mastery vẫn chạy trên dòng gami_grades có thật.
--
-- LUẬT "CÂU BỎ TRỐNG" (một nguồn duy nhất — `_btvn_cau_bo_trong`):
--   · phase BTVN của buổi ĐÃ ĐÓNG (btvn_dong_at not null) — chưa đóng thì TA còn đang chấm, chưa chốt;
--   · HS thuộc roster buổi, có ≥1 dòng điểm BTVN của buổi (chưa đụng gì ⇒ không bịa 0% — đã có nhãn
--     khong_lam / xin_phep ở btvn_ket_qua), và KHÔNG xin_phep;
--   · câu: problem phase='btvn', không hidden, không ngoai_de, thuộc chung cả lớp (hoc_sinh_id null)
--     hoặc riêng HS này, và HS CHƯA có dòng gami_grades cho câu đó.
--
-- MẤT GÌ (Luật xoá): không mất — 2 function mới, không bảng/cột nào đổi.
-- ============================================================================

create or replace function public._btvn_cau_bo_trong(p_hs uuid)
returns table (buoi_hoc_id uuid, ngay date, problem_id uuid, ma_dang text)
language sql stable as $$
  select b.id, b.ngay, p.id, p.ma_dang
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id
    join gami_session_problems p
      on p.buoi_hoc_id = b.id and p.phase = 'btvn'
     and not p.hidden and not p.ngoai_de
     and (p.hoc_sinh_id is null or p.hoc_sinh_id = h.hoc_sinh_id)
   where h.hoc_sinh_id = p_hs
     and b.btvn_dong_at is not null
     and b.trang_thai is distinct from 'huy'
     and coalesce((select k.trang_thai_nop from btvn_ket_qua k
                    where k.hoc_sinh_id = p_hs and k.buoi_hoc_id = b.id), '') <> 'xin_phep'
     and exists (select 1 from gami_grades g
                   join gami_session_problems gp on gp.id = g.problem_id
                  where g.hoc_sinh_id = p_hs and gp.buoi_hoc_id = b.id and gp.phase = 'btvn')
     and not exists (select 1 from gami_grades g where g.problem_id = p.id and g.hoc_sinh_id = p_hs)
$$;

-- Số câu bỏ trống theo buổi (Report PH — bảng theo buổi). Mẫu số % = câu đã chấm + số này.
create or replace function public.fn_btvn_bo_trong_theo_buoi(p_hs uuid, p_buoi uuid[])
returns table (buoi_hoc_id uuid, so_bo_trong int)
language sql stable as $$
  select t.buoi_hoc_id, count(*)::int
    from public._btvn_cau_bo_trong(p_hs) t
   where t.buoi_hoc_id = any(p_buoi)
   group by t.buoi_hoc_id
$$;

-- Từng câu bỏ trống (thẻ "Bài tập về nhà" — cần ma_dang để chia cơ bản/nâng cao như các câu đã chấm).
create or replace function public.fn_btvn_cau_bo_trong(p_hs uuid)
returns table (buoi_hoc_id uuid, ngay date, ma_dang text)
language sql stable as $$
  select t.buoi_hoc_id, t.ngay, t.ma_dang from public._btvn_cau_bo_trong(p_hs) t
$$;

revoke execute on function public._btvn_cau_bo_trong(uuid) from public, anon;
revoke execute on function public.fn_btvn_bo_trong_theo_buoi(uuid, uuid[]) from public, anon;
revoke execute on function public.fn_btvn_cau_bo_trong(uuid) from public, anon;
grant execute on function public._btvn_cau_bo_trong(uuid) to authenticated;
grant execute on function public.fn_btvn_bo_trong_theo_buoi(uuid, uuid[]) to authenticated;
grant execute on function public.fn_btvn_cau_bo_trong(uuid) to authenticated;
