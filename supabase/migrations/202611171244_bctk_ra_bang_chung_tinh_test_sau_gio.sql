-- ============================================================================
-- 202611171244 — bctk_ra_bang_chung_tinh_test_sau_gio
-- VÌ SAO: Thùy 17/11 — báo cáo tuần trưởng khối, mục Dạng yếu / Nhóm yếu: bản cũ KHÔNG tính bổ trợ sau giờ. fn_bctk_so xét "Ra CÓ BẰNG CHỨNG"
--   (dạng hết yếu nhờ lần đo mới trong kỳ) và "độ phủ đo" (em có lần đo trong kỳ) CHỈ từ gami_grades (ET/MT/BTVN chấm buổi). Bài TEST online / TA nhập
--   (test sau giờ = bai_test.loai 'bo_tro_test' ở buổi bo_tro_nhe, TA nhập Đ/C/S ⇒ bai_lam_cau; test bù · test học từ đầu · ET app…) nằm ở bai_lam_cau — đã vào
--   MASTERY (spec-mastery §2: "mọi bài TEST tính như ET") nên dạng ra khỏi danh sách yếu, nhưng báo cáo xếp dạng đó vào "Rớt cửa sổ" thay vì "Ra có bằng chứng",
--   và em chỉ làm test sau giờ bị tính là "chưa đo trong kỳ".
-- Sửa: thêm nhánh bai_lam_cau (đúng danh sách loại bài TEST mà _mastery_luot_do_quy cho phép; bỏ câu đã có bản sao trong gami_grades; ET/đề thi phải đã nộp)
--   vào ra_bc và do_ky, tính theo lúc chấm (cham_at) trong kỳ — cùng cách gami_grades dùng graded_at.
-- Cách làm: vá 2 đoạn trên thân ĐANG CHẠY của fn_bctk_so, mỗi đoạn khớp đúng 1 chỗ. MẤT GÌ: không xoá gì; số báo cáo CHƯA NỘP đổi, bản đã nộp (snap) giữ nguyên.
-- ============================================================================
do $do$
declare d text; c int;
  cu1 text := replace($a$                 and public._do_o_bdm(p.ma_cau, p.ma_dang) = ra.ma)),$a$, E'\r', '');
  mo1 text := replace($a$                 and public._do_o_bdm(p.ma_cau, p.ma_dang) = ra.ma)
              or exists (   /* 17/11: + bài TEST app / TA nhập (test sau giờ, test bù, ET app…) */
              select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
                join bai_test_cau btc on btc.id = blc.bai_test_cau_id
               where bl.hoc_sinh_id = ra.hoc_sinh_id and blc.verdict is not null and btc.ma_dang is not null
                 and blc.cham_at >= v_tu_ts and blc.cham_at < v_t1_ts
                 and bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test', 'btvn', 'giao_trinh')
                 and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
                 and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
                 and public._do_o_bdm(btc.ma_cau, btc.ma_dang) = ra.ma)),$a$, E'\r', '');
  cu2 text := replace($a$              select 1 from gami_grades g where g.hoc_sinh_id = hs.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts)),$a$, E'\r', '');
  mo2 text := replace($a$              select 1 from gami_grades g where g.hoc_sinh_id = hs.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts)
              or exists (   /* 17/11: + bài TEST app / TA nhập (test sau giờ …) */
              select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
               where bl.hoc_sinh_id = hs.hoc_sinh_id and blc.verdict is not null
                 and blc.cham_at >= v_tu_ts and blc.cham_at < v_t1_ts
                 and bt.loai in ('et', 'de_thi', 'bo_tro_test', 'bu_test', 'htd_test', 'btvn', 'giao_trinh')
                 and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop'))),$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public.fn_bctk_so(jsonb,date)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception 'fn_bctk_so đã đổi: đoạn ra_bc khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu1, mo1);
  c := (length(d) - length(replace(d, cu2, ''))) / length(cu2);
  if c <> 1 then raise exception 'fn_bctk_so đã đổi: đoạn do_ky khớp % chỗ, cần đúng 1', c; end if;
  d := replace(d, cu2, mo2);
  execute d;
end $do$;
