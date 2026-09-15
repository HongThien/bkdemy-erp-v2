-- ============================================================================
-- 202609151210 — fix_btvn_dong_bo_trung_ma_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 15/09 báo "BTVN 11A1 không hiển thị ĐCS trên ERP"): mở tab BTVN của
--   buổi 11A1.T4.09092026 trên ERP → lỗi console "duplicate key value violates unique
--   constraint gami_grades_problem_id_hoc_sinh_id_key" (409), tab treo mãi "Đang tải
--   BTVN…". Truy gốc: chính đề BTVN 73 câu này bị SINH TRÙNG 1 câu — ma_cau
--   T111060104021 xuất hiện ở CẢ thu_tu 43 và 44. `fn_btvn_online_dong_bo` (mig
--   202609071643) loop qua mọi bai_lam_cau rồi INSERT gami_grades cho cặp
--   (problem_id, hoc_sinh_id) khi CHƯA có dòng — nhưng "chưa có" được xét 1 LẦN lúc
--   SELECT đầu hàm, nên 2 câu trùng ma_cau (cùng problem_id) đều thấy "chưa có" và
--   CẢ HAI đều cố INSERT trong CÙNG 1 transaction → dòng thứ 2 vỡ unique constraint
--   → toàn bộ RPC lỗi, ROLLBACK sạch → không chỉ câu trùng, mà TOÀN BỘ 9 HS/73 câu
--   của buổi đó không đồng bộ được (transaction là 1 khối).
--
--   FIX: đổi INSERT trần thành `ON CONFLICT (problem_id, hoc_sinh_id) DO UPDATE` —
--   câu trùng thứ 2 sẽ ghi ĐÈ (không crash) thay vì insert riêng, giữ lại verdict
--   mới nhất theo vòng lặp (nguồn cùng là auto-sync, không phải ô chấm tay — ô chấm
--   tay được lọc ra TRƯỚC khi vào nhánh insert này, ở điều kiện `r.grade_id is null`,
--   nên WHERE guard bên dưới chỉ là phòng hờ thêm 1 lớp). Không đổi phần "giữ ô chấm
--   tay" (r.grade_id is not null and r.grade_nguon is null → continue) — vẫn nguyên.
--   Đề bị trùng câu là bug DATA riêng (sinh đề), CHƯA sửa ở migration này — chỉ sửa
--   để 1 câu trùng không được phép làm sập đồng bộ của cả buổi. Cùng lỗ tồn tại ở
--   `fn_et_online_dong_bo` (mig 202609031709) — CHƯA sửa, cần rà thêm nếu ET cũng dính.
--
-- MẤT GÌ: không mất — chỉ đổi hành vi khi gặp câu trùng (trước: crash cả buổi; sau:
--   giữ 1 dòng gami_grades duy nhất cho câu đó, ghi verdict theo lượt sync sau cùng).
--   Không drop/delete gì.
-- ============================================================================

create or replace function public.fn_btvn_online_dong_bo(p_buoi uuid)
returns jsonb language plpgsql as $$
declare
  v_lop uuid; v_ngay date; v_dong timestamptz; v_test uuid; v_deadline timestamptz;
  v_moi int := 0; v_cap_nhat int := 0; v_giu_tay int := 0; v_khong_khop int := 0;
  v_khong_trong_buoi int := 0; v_hs_lam int := 0; v_hs_nop int := 0; v_nop_moi int := 0;
  r record;
begin
  select lop_id, ngay, btvn_dong_at into v_lop, v_ngay, v_dong from buoi_hoc where id = p_buoi;
  if v_lop is null then raise exception 'Không thấy buổi %', p_buoi; end if;
  if v_dong is not null then return jsonb_build_object('daDong', true); end if;

  select id, deadline into v_test, v_deadline from bai_test
   where lop_id = v_lop and ngay = v_ngay and loai = 'btvn'
   order by created_at desc limit 1;
  if v_test is null then return jsonb_build_object('khongCoTest', true); end if;

  select count(distinct bl.hoc_sinh_id), count(distinct bl.hoc_sinh_id) filter (where bl.trang_thai = 'da_nop')
    into v_hs_lam, v_hs_nop
    from bai_lam bl where bl.bai_test_id = v_test
     and exists (select 1 from bai_lam_cau x where x.bai_lam_id = bl.id and x.verdict is not null);

  -- ① Ô điểm: mọi phép đo có verdict (bài dở cũng đổ — BTVN chấm ngay từng câu).
  for r in
    select blc.id as blc_id, bl.hoc_sinh_id, blc.verdict,
           p.id as problem_id,
           exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id) as trong_buoi,
           g.id as grade_id, g.bai_lam_cau_id as grade_nguon, g.result as grade_result
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      left join bai_test_cau goc on goc.bai_test_id = bc.bai_test_id and goc.thu_tu = bc.thu_tu and goc.bien_the = 1
      left join gami_session_problems p on p.buoi_hoc_id = p_buoi and p.phase = 'btvn' and p.ma_cau = goc.ma_cau
      left join gami_grades g on g.problem_id = p.id and g.hoc_sinh_id = bl.hoc_sinh_id
     where bl.bai_test_id = v_test
       and blc.verdict in ('correct', 'partial', 'wrong')
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
       where gami_grades.bai_lam_cau_id is not null; -- không đụng ô chấm tay (đề phòng, lý do xem VÌ SAO)
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

  -- ② Trạng thái nộp: HS làm HẾT (da_nop) + trong roster + CHƯA có trạng thái ⇒ tự điền theo hạn.
  for r in
    select bl.hoc_sinh_id, bl.nop_at
      from bai_lam bl
     where bl.bai_test_id = v_test and bl.trang_thai = 'da_nop'
       and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id)
       and not exists (select 1 from btvn_ket_qua k where k.buoi_hoc_id = p_buoi and k.hoc_sinh_id = bl.hoc_sinh_id and k.trang_thai_nop is not null)
  loop
    insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
    values (p_buoi, r.hoc_sinh_id,
            case when v_deadline is not null and r.nop_at is not null and r.nop_at > v_deadline then 'nop_muon' else 'nop_dung_han' end,
            now())
    on conflict (hoc_sinh_id, buoi_hoc_id) do update
      set trang_thai_nop = excluded.trang_thai_nop, updated_at = now()
      where btvn_ket_qua.trang_thai_nop is null;
    v_nop_moi := v_nop_moi + 1;
  end loop;

  return jsonb_build_object('hsLam', v_hs_lam, 'hsNop', v_hs_nop, 'moi', v_moi, 'capNhat', v_cap_nhat,
                            'giuTay', v_giu_tay, 'khongKhopO', v_khong_khop, 'khongTrongBuoi', v_khong_trong_buoi,
                            'nopMoi', v_nop_moi);
end $$;

comment on function public.fn_btvn_online_dong_bo(uuid) is
  'Đổ verdict BTVN online (bai_lam_cau, cả bài dở) vào lưới BTVN của buổi (gami_grades phase btvn) khớp ma_cau + tự điền trạng thái nộp cho HS đã làm hết. Không ghi đè ô/trạng thái TA đã tick, không đụng phase đã đóng. Câu trùng ma_cau trong cùng đề (bug sinh đề) không làm sập cả buổi — ghi đè lẫn nhau qua ON CONFLICT thay vì crash.';
grant execute on function public.fn_btvn_online_dong_bo(uuid) to authenticated;
