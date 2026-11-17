-- ============================================================================
-- 202611171221 — mtt_cau_hinh_hoc_ve_bai
-- VÌ SAO: tờ Mục tiêu tuần 8A1 (16–22/11) Phần 1 trống dù Giáo trình buổi 19/11 "Tính chất Đường phân giác" đã có 8 câu Hình (HHC004408…).
--   _mtt_o_buoi / _mtt_o_lui quy câu → ô bằng _do_o_quy(bdm, false, ma_cau, ''): với câu Hình–Học (hinh_hoc_cau_hoi) không có mã dạng chép
--   (buổi chưa mở ⇒ chưa có gami_session_problems) hàm trả NULL — _do_o_bdm chỉ tra dai_cau_hoi / hgt_cau_hoi. Đo thật: HHC004408 có dang_chinh = HH00144
--   (bài "Tính chất Đường phân giác", ∈ hinh_hoc_bai); cả 9.423 câu Hình đều có dang_chinh ∈ hinh_hoc_bai ⇒ ô của câu Hình–Học = chính dang_chinh của nó
--   (Hình–Học: bài học = ô = nhóm; cùng mã mà _mastery_lan_d ghi lúc đo, vd HH00151 của buổi 15/11).
-- Sửa: khi _do_o_quy trả NULL, câu không kèm mã dạng chép, và câu có trong hinh_hoc_cau_hoi ⇒ lấy dang_chinh của nó. Không đụng _do_o_quy (dùng chung với đo lường).
-- Cách làm: vá 2 đoạn trên thân ĐANG CHẠY, mỗi đoạn khớp đúng 1 chỗ.
-- MẤT GÌ: không xoá gì. Tờ nháp tự tính lại; lớp đã công bố giữ bản khoá.
-- ============================================================================
do $do$
declare d text; c int;
  cu1 text := replace($a$    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd) as n from c) x$a$, E'\r', '');
  mo1 text := replace($a$    from (select coalesce(public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd),
                          case when c.kd = '' then (select h.dang_chinh from hinh_hoc_cau_hoi h where h.ma_cau = nullif(c.kc, '')) end) as n from c) x   /* 17/11: câu Hình–Học chưa có mã dạng chép ⇒ dang_chinh (= bài học = ô) */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_o_buoi(uuid,date,uuid)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu1, ''))) / length(cu1);
  if c <> 1 then raise exception '_mtt_o_buoi đã đổi: khớp % chỗ, cần đúng 1', c; end if;
  execute replace(d, cu1, mo1);
end $do$;

do $do$
declare d text; c int;
  cu2 text := replace($a$    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.ma_cau, '') as n from c) x$a$, E'\r', '');
  mo2 text := replace($a$    from (select coalesce(public._do_o_quy(public._mastery_bdm_bat(), false, c.ma_cau, ''),
                          (select h.dang_chinh from hinh_hoc_cau_hoi h where h.ma_cau = c.ma_cau)) as n from c) x   /* 17/11: câu Hình–Học ⇒ dang_chinh (= bài học = ô) */$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public._mtt_o_lui(uuid,date)'::regprocedure), E'\r', '') into d;
  c := (length(d) - length(replace(d, cu2, ''))) / length(cu2);
  if c <> 1 then raise exception '_mtt_o_lui đã đổi: khớp % chỗ, cần đúng 1', c; end if;
  execute replace(d, cu2, mo2);
end $do$;
