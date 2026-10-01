-- ============================================================================
-- 202609151316 — fix_et_dong_bo_trung_ma_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 15/09, sau khi vá fn_btvn_online_dong_bo mig 202609151210 — cùng
--   ngày rà thấy fn_et_online_dong_bo dùng CHUNG pattern INSERT trần vào
--   gami_grades không ON CONFLICT): đề ET nào bị sinh trùng 1 ma_cau (như đề BTVN
--   11A1 09/09 vừa dính) và 2 HS trả lời đủ cả 2 vị trí trùng đó → vỡ unique
--   constraint gami_grades_problem_id_hoc_sinh_id_key → vỡ TOÀN BỘ transaction
--   → mất sync của CẢ buổi, không chỉ câu trùng.
--   Đã quét dữ liệu thật (15/09): 2 đề ET đang trùng ma_cau (12A1 03/09, 12B1
--   23/08) — CHƯA phát nổ (12B1 toàn chấm tay chưa từng auto-sync; 12A1 auto-sync
--   đủ 55 ô, tình cờ chưa ai trả lời đủ cả 2 vị trí trùng) — vá TRƯỚC khi có ca
--   thật bị crash, không phải fix sau khi vỡ.
--
-- MẤT GÌ: không mất — chỉ đổi hành vi khi gặp câu trùng (trước: crash cả buổi;
--   sau: giữ 1 dòng gami_grades, ghi verdict theo lượt sync sau cùng). Không đụng
--   luật giữ ô chấm tay. Không drop/delete gì.
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
    select blc.id as blc_id, bl.hoc_sinh_id, blc.verdict, bc.ma_cau,
           p.id as problem_id,
           exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id) as trong_buoi,
           g.id as grade_id, g.bai_lam_cau_id as grade_nguon, g.result as grade_result
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      left join gami_session_problems p on p.buoi_hoc_id = p_buoi and p.phase = 'et' and p.ma_cau = bc.ma_cau
      left join gami_grades g on g.problem_id = p.id and g.hoc_sinh_id = bl.hoc_sinh_id
     where bl.bai_test_id = v_test
       and bl.trang_thai = 'da_nop'
       and blc.verdict in ('correct', 'partial', 'wrong')
       and bc.ma_cau is not null
  loop
    if not r.trong_buoi then v_khong_trong_buoi := v_khong_trong_buoi + 1; continue; end if;
    if r.problem_id is null then v_khong_khop := v_khong_khop + 1; continue; end if;
    if r.grade_id is not null and r.grade_nguon is null then v_giu_tay := v_giu_tay + 1; continue; end if;
    if r.grade_id is null then
      insert into gami_grades (buoi_hoc_id, problem_id, hoc_sinh_id, result, presentation, speed, points, loi, graded_by, bai_lam_cau_id)
      values (p_buoi, r.problem_id, r.hoc_sinh_id, r.verdict, 'clean', 'normal',
              case r.verdict when 'correct' then 100 when 'partial' then 50 else 0 end,
              '[]'::jsonb, public.jwt_uid(), r.blc_id)
      on conflict (problem_id, hoc_sinh_id) do update
         set result = excluded.result, points = excluded.points,
             bai_lam_cau_id = excluded.bai_lam_cau_id, graded_by = excluded.graded_by, graded_at = now()
       where gami_grades.bai_lam_cau_id is not null; -- không đụng ô chấm tay
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

comment on function public.fn_et_online_dong_bo(uuid) is
  'Đổ verdict ET online (bai_lam_cau, đã nộp) vào lưới chấm ET của buổi (gami_grades phase et) khớp ma_cau. Không ghi đè ô chấm tay, không đụng phase đã đóng. Câu trùng ma_cau trong cùng đề (bug sinh đề) không làm sập cả buổi — ghi đè lẫn nhau qua ON CONFLICT thay vì crash.';
grant execute on function public.fn_et_online_dong_bo(uuid) to authenticated;
