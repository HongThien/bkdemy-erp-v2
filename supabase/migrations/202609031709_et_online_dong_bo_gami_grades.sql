-- ============================================================================
-- 202609031709 — et_online_dong_bo_gami_grades
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 03/09: "Dữ liệu ET của học sinh làm từ điện thoại chưa thấy đi thẳng vào
--   chỗ nhập liệu ET buổi học"):
--   · Spec test-online §6/§110 nói ET online phải sync verdict sang gami_grades(phase='et')
--     nhưng CHƯA BAO GIỜ được build: et_nop chỉ ghi bai_lam_cau, không trigger, không RPC
--     (DEVLOG 17/08 đã verify pg_proc). Mastery đọc thẳng bai_lam_cau nên KHÔNG thiếu; thiếu
--     là LƯỚI CHẤM ET của buổi (tab ET BuoiHocScreen) + Elo/EXP (fn_dong_phase đọc gami_grades).
--     12A1 03/09: 5 HS nộp, 34 phép đo, 7 ô ET khớp ma_cau, 0 điểm.
--   · Bài học DEVLOG 17/08: "bai_lam_cau → gami_grades là đường một chiều KHÔNG DẤU VẾT" —
--     nối lại thì PHẢI có khoá nguồn. ⇒ cột gami_grades.bai_lam_cau_id (NULL = chấm tay).
--   · Danh tính ô ↔ câu = ma_cau (mig 0106), KHÔNG theo vị trí (CLAUDE.md §2).
--   · Luật ghi đè: ô chấm TAY (bai_lam_cau_id null) KHÔNG BAO GIỜ bị ghi đè — GV sửa tay là
--     quyết định cuối; ô đã sync thì sync lại được (chấm lại key → verdict mới → theo).
--   · Phase đã đóng (et_dong_at) KHÔNG đụng — Elo đã tính; muốn cập nhật phải "Mở lại" (§4).
--   · Chỉ HS có trong roster buổi (buoi_hoc_hs) — HS nộp mà không trong buổi = mâu thuẫn để
--     người xem (trả về đếm `khongTrongBuoi`), không tự thêm vào buổi.
--   · points: cùng công thức problemPoints (exp.js): BASE 100 × result{1/0.5/0} × clean 1 ×
--     normal 1 ⇒ 100/50/0. (Đã có tiền lệ 2 nơi; ghi rõ ở đây để tìm ra khi đổi hằng số.)
--
-- MẤT GÌ (Luật xoá): không mất. ADD COLUMN nullable + 1 function mới.
-- ============================================================================

alter table gami_grades add column if not exists bai_lam_cau_id uuid references bai_lam_cau(id) on delete set null;
comment on column gami_grades.bai_lam_cau_id is
  'Nguồn nếu dòng này sync từ ET online (bai_lam_cau). NULL = chấm tay. Sync KHÔNG ghi đè dòng NULL.';
create index if not exists gami_grades_bai_lam_cau_idx on gami_grades(bai_lam_cau_id) where bai_lam_cau_id is not null;

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

comment on function public.fn_et_online_dong_bo(uuid) is
  'Đổ verdict ET online (bai_lam_cau, đã nộp) vào lưới chấm ET của buổi (gami_grades phase et) khớp ma_cau. Không ghi đè ô chấm tay, không đụng phase đã đóng.';
grant execute on function public.fn_et_online_dong_bo(uuid) to authenticated;
