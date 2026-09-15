-- ============================================================================
-- 202609031712 — et_online_dong_bo_ma_de
-- ----------------------------------------------------------------------------
-- VÌ SAO: chạy thật 202609031709 trên 12A1 03/09 ⇒ 4 phép đo "không khớp ô". Soi: ET có
--   3 MÃ ĐỀ (bai_test.co_nhieu_ma_de) — HS mã 2/3 làm câu BIẾN THỂ (ma_cau khác, cùng thu_tu,
--   cùng dạng — made.ts ép khớp form/dạng câu gốc), còn lưới chấm ET của buổi chỉ có ô của câu
--   GỐC (từ doc ET). Khớp thẳng ma_cau ⇒ rụng đúng các câu có biến thể (thu_tu 7: gốc
--   T312010103001, mã 2 = ...002, mã 3 = ...003).
--   Sửa: câu bien_the > 1 quy về câu gốc CÙNG bai_test + CÙNG thu_tu + bien_the = 1 rồi mới tra
--   ô theo ma_cau gốc. Đây KHÔNG phải nối theo vị trí giữa 2 tập độc lập (§2 cấm): thu_tu chung
--   giữa các biến thể là cấu trúc CÓ CHỦ Ý của snapshot (testonline.ts: "cùng thu_tu với câu gốc
--   tương ứng, khác bien_the") — chính là khoá của cặp gốc↔biến thể.
--
-- MẤT GÌ (Luật xoá): không mất — chỉ create or replace function.
-- ============================================================================

create or replace function public.fn_et_online_dong_bo(p_buoi uuid)
returns jsonb language plpgsql as $$
declare
  v_lop uuid; v_ngay date; v_dong timestamptz; v_test uuid;
  v_moi int := 0; v_cap_nhat int := 0; v_giu_tay int := 0; v_khong_khop int := 0;
  v_khong_trong_buoi int := 0; v_hs_nop int := 0;
  r record;
begin
  select lop_id, ngay, et_dong_at into v_lop, v_ngay, v_dong from buoi_hoc where id = p_buoi;
  if v_lop is null then raise exception 'Không thấy buổi %', p_buoi; end if;
  if v_dong is not null then return jsonb_build_object('daDong', true); end if;

  select id into v_test from bai_test
   where lop_id = v_lop and ngay = v_ngay and loai = 'et'
   order by created_at desc limit 1;
  if v_test is null then return jsonb_build_object('khongCoTest', true); end if;

  select count(distinct bl.hoc_sinh_id) into v_hs_nop
    from bai_lam bl where bl.bai_test_id = v_test and bl.trang_thai = 'da_nop';

  for r in
    select blc.id as blc_id, bl.hoc_sinh_id, blc.verdict,
           p.id as problem_id,
           exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id) as trong_buoi,
           g.id as grade_id, g.bai_lam_cau_id as grade_nguon, g.result as grade_result
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      -- câu gốc của vị trí này: bien_the=1 ⇒ chính nó; mã đề 2/3 ⇒ câu cùng thu_tu, bien_the=1
      left join bai_test_cau goc on goc.bai_test_id = bc.bai_test_id and goc.thu_tu = bc.thu_tu and goc.bien_the = 1
      left join gami_session_problems p on p.buoi_hoc_id = p_buoi and p.phase = 'et' and p.ma_cau = goc.ma_cau
      left join gami_grades g on g.problem_id = p.id and g.hoc_sinh_id = bl.hoc_sinh_id
     where bl.bai_test_id = v_test
       and bl.trang_thai = 'da_nop'
       and blc.verdict in ('correct', 'partial', 'wrong')
  loop
    if not r.trong_buoi then v_khong_trong_buoi := v_khong_trong_buoi + 1; continue; end if;
    if r.problem_id is null then v_khong_khop := v_khong_khop + 1; continue; end if;
    if r.grade_id is not null and r.grade_nguon is null then v_giu_tay := v_giu_tay + 1; continue; end if;
    if r.grade_id is null then
      insert into gami_grades (buoi_hoc_id, problem_id, hoc_sinh_id, result, presentation, speed, points, loi, graded_by, bai_lam_cau_id)
      values (p_buoi, r.problem_id, r.hoc_sinh_id, r.verdict, 'clean', 'normal',
              case r.verdict when 'correct' then 100 when 'partial' then 50 else 0 end,
              '[]'::jsonb, public.jwt_uid(), r.blc_id);
      v_moi := v_moi + 1;
    elsif r.grade_result is distinct from r.verdict or r.grade_nguon is distinct from r.blc_id then
      update gami_grades
         set result = r.verdict,
             points = case r.verdict when 'correct' then 100 when 'partial' then 50 else 0 end,
             bai_lam_cau_id = r.blc_id, graded_by = public.jwt_uid(), graded_at = now()
       where id = r.grade_id;
      v_cap_nhat := v_cap_nhat + 1;
    end if;
  end loop;

  return jsonb_build_object('hsNop', v_hs_nop, 'moi', v_moi, 'capNhat', v_cap_nhat,
                            'giuTay', v_giu_tay, 'khongKhopO', v_khong_khop, 'khongTrongBuoi', v_khong_trong_buoi);
end $$;
