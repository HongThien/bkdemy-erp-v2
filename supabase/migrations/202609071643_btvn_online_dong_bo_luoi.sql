-- ============================================================================
-- 202609071643 — btvn_online_dong_bo_luoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 07/09: "bài tập về nhà học sinh làm trên app chưa tự nhảy vào phần BTVN
--   trong buổi học trên ERP"): cùng lỗ với ET online (mig 202609031709) — HS làm BTVN trên app
--   ghi `bai_lam_cau` (chấm ngay từng câu, reveal-ngay), tab BTVN của buổi đọc `gami_grades`
--   phase='btvn' + `btvn_ket_qua` → 0 đường nối. 10A1 03/09: 5 HS nộp, 140 phép đo, 28 ô, 0 điểm,
--   TA phải tick tay "nộp" cho 7 HS rồi đóng.
--   KHÁC ET: (1) BTVN chấm NGAY từng câu ⇒ lấy MỌI phép đo có verdict, kể cả bài đang dở (không
--   đòi da_nop); (2) BTVN không có mã đề (bien_the=1) nhưng vẫn quy về câu gốc cho đồng nhất;
--   (3) trạng thái nộp `btvn_ket_qua.trang_thai_nop`: HS đã làm HẾT (bai_lam da_nop) và CHƯA có
--   trạng thái ⇒ tự điền `nop_dung_han` / `nop_muon` (nop_at so với bai_test.deadline; không hạn
--   ⇒ đúng hạn). Bài dở KHÔNG tự điền (TA quyết), trạng thái TA đã tick KHÔNG bị đè.
--   Luật ghi đè ô điểm y hệt ET: ô chấm TAY (bai_lam_cau_id null) không đụng; ô đã sync thì sync lại.
--   Phase đã đóng (btvn_dong_at) không đụng — EXP đã thưởng; "Mở lại" rồi tab tự đổ.
--
-- MẤT GÌ (Luật xoá): không mất — 1 function mới. Ghi thêm dòng gami_grades/btvn_ket_qua khi gọi.
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
  'Đổ verdict BTVN online (bai_lam_cau, cả bài dở) vào lưới BTVN của buổi (gami_grades phase btvn) khớp ma_cau + tự điền trạng thái nộp cho HS đã làm hết. Không ghi đè ô/trạng thái TA đã tick, không đụng phase đã đóng.';
grant execute on function public.fn_btvn_online_dong_bo(uuid) to authenticated;
