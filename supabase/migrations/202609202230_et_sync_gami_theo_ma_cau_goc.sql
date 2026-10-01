-- ============================================================================
-- 202609202230 — et_sync_gami_theo_ma_cau_goc
-- ----------------------------------------------------------------------------
-- BỤG THẬT (Thùy 20/09, tối, lớp 10A1 đang học): "5 học sinh làm đúng nhưng
--   trên ERP chỉ hiện dữ liệu của 2 học sinh thôi."
--
-- NGUYÊN NHÂN (verify DB live, ET 10A1 · 20/09/2026, bai_test_id 27bdbfa9):
--   `fn_et_online_dong_bo` (mig 202609031709) đổ verdict từ `bai_lam_cau` (ET
--   online) sang `gami_grades` (lưới chấm ET của buổi, tab ET BuoiHocScreen)
--   bằng cách khớp `bai_test_cau.ma_cau = gami_session_problems.ma_cau`.
--   `gami_session_problems` cho phase='et' CHỈ chứa 5 `ma_cau` GỐC (mã đề 1,
--   nạp từ tài liệu qua `syncDocProblems`). Nhưng `buildMaDe` (made.ts) sinh
--   mã đề 2/3 bằng CÂU KHÁC HẲN (ma_cau riêng, cùng cụm bài — xem cumKey),
--   KHÔNG PHẢI cùng câu khác nội dung. Tối đó 5 HS nộp: 2 em nhận mã đề 1
--   (ma_cau khớp gốc → sync đúng) — 3 em nhận mã đề 2/3 (ma_cau KHÁC hẳn 5 mã
--   gốc → `p.ma_cau = bc.ma_cau` không khớp bất kỳ ô nào → rơi vào nhánh
--   `khongKhopO`, bị BỎ QUA lặng lẽ, không vào `gami_grades`). Đây là lỗ hổng
--   có từ lúc viết mig 202609031709 (03/09) — lúc đó chưa tính ca ET nhiều mã
--   đề đụng `ma_cau` khác nhau ở cùng vị trí.
--
-- FIX: trước khi khớp `gami_session_problems`, quy `bc.ma_cau` về MA_CAU GỐC
--   qua chính `tai_lieu.cau_hinh->'etMaDe'` (map ma_cau gốc → [đề2, đề3], đã
--   có sẵn — không suy đoán, không thêm bảng). Câu là mã đề 1 thì `ma_cau` đã
--   là gốc (tự khớp, không đổi hành vi cũ). Câu là mã đề 2/3 → tra ngược
--   trong `etMaDe` tìm đúng key gốc chứa nó, dùng key đó để khớp
--   `gami_session_problems`. ET chỉ 1 mã đề (đa số, `etMaDe` null/rỗng) →
--   coalesce về chính `bc.ma_cau` → hành vi y hệt trước đây.
--
-- MẤT GÌ: không — CREATE OR REPLACE 1 hàm, không đổi bảng/cột.
--
-- ⚠ GHI CHÚ 21/09: file này từng bị 1 `git pull --rebase origin main` từ
--   phiên khác cuốn mất khỏi working tree trước khi kịp commit (đã ÁP LIVE
--   từ 20/09, sổ migration vẫn còn, chỉ mất file git) — recreate nguyên văn.
-- ============================================================================

create or replace function public.fn_et_online_dong_bo(p_buoi uuid)
returns jsonb language plpgsql as $$
declare
  v_lop uuid; v_ngay date; v_dong timestamptz; v_test uuid; v_cau_hinh jsonb;
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

  select tl.cau_hinh into v_cau_hinh from bai_test bt join tai_lieu tl on tl.id = bt.nguon_tai_lieu_id where bt.id = v_test;

  select count(distinct bl.hoc_sinh_id) into v_hs_nop
    from bai_lam bl where bl.bai_test_id = v_test and bl.trang_thai = 'da_nop';

  for r in
    select y.blc_id, y.hoc_sinh_id, y.verdict, y.ma_cau_goc,
           p.id as problem_id,
           exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = y.hoc_sinh_id) as trong_buoi,
           g.id as grade_id, g.bai_lam_cau_id as grade_nguon, g.result as grade_result
      from (
        select blc.id as blc_id, bl.hoc_sinh_id, blc.verdict,
               -- Mã đề 2/3 dùng câu KHÁC hẳn (ma_cau riêng) — quy về ma_cau GỐC qua etMaDe
               -- để khớp đúng cột trong lưới chấm buổi (chỉ dựng theo mã đề 1).
               coalesce(
                 (select ek.key from jsonb_each(coalesce(v_cau_hinh->'etMaDe', '{}'::jsonb)) ek
                    where ek.key = bc.ma_cau
                       or exists (select 1 from jsonb_array_elements_text(ek.value) vv where vv = bc.ma_cau)
                  limit 1),
                 bc.ma_cau
               ) as ma_cau_goc
          from bai_lam_cau blc
          join bai_lam bl on bl.id = blc.bai_lam_id
          join bai_test_cau bc on bc.id = blc.bai_test_cau_id
         where bl.bai_test_id = v_test
           and bl.trang_thai = 'da_nop'
           and blc.verdict in ('correct', 'partial', 'wrong')
           and bc.ma_cau is not null
      ) y
      left join gami_session_problems p on p.buoi_hoc_id = p_buoi and p.phase = 'et' and p.ma_cau = y.ma_cau_goc
      left join gami_grades g on g.problem_id = p.id and g.hoc_sinh_id = y.hoc_sinh_id
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
  'Đổ verdict ET online (bai_lam_cau, đã nộp) vào lưới chấm ET của buổi (gami_grades phase et), khớp qua ma_cau GỐC (quy đổi qua etMaDe nếu HS làm mã đề 2/3). Không ghi đè ô chấm tay, không đụng phase đã đóng.';
