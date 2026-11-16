-- ============================================================================
-- exp_san_buoi_bu_khtn_ve_dung_mon
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 16/11 gật "Chuyển sang KHTN". Trước mig 202611161734, fn_dong_phase đóng ET buổi KHÔNG có lớp (bù) tự điền môn 'Toán'
--   ⇒ EXP điểm sàn (attend_floor, 250 / lượt) của em học bù KHTN ghi vào sổ EXP Toán. Đo 16/11: 44 lượt · 11.000 EXP · 31 em · tháng 07–11/2026.
--   Môn đúng của từng lượt = môn lớp của buổi em nghỉ (bu_cho_buoi_id → lớp) — cùng luật đường ghi mới (_bo_tro_mon). Tổng EXP của em không đổi,
--   chỉ chuyển từ sổ Toán sang sổ KHTN. Bảng xếp hạng lưu sẵn tự làm mới theo lịch; giải / huy hiệu tháng ĐÃ CHỐT không tính lại (sổ chốt bất biến).
--
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Sửa cột `mon` của ĐÚNG 44 dòng gami_exp_ledger (khoá bằng số dòng · tổng EXP · md5 danh sách id lúc viết).
-- ============================================================================
do $$
declare v_n int; v_exp numeric; v_khoa text; v_sua int;
begin
  create temp table _sai on commit drop as
    select g.id, public._bo_tro_mon(hh.bo_tro_yeu_id, hh.bo_tro_hinh_id, hh.bo_tro_duoi_id, hh.bu_cho_buoi_id, b.ca_bo_tro_nhe_id, b.ca_bo_tro_id) as mon_dung, g.amount
      from gami_exp_ledger g join buoi_hoc b on b.id = g.ref_buoi_hoc_id
      left join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = g.hoc_sinh_id
     where b.lop_id is null and g.source = 'attend_floor' and g.mon = 'Toán';
  delete from _sai where mon_dung is null or mon_dung = 'Toán';
  select count(*), sum(amount), md5(string_agg(id::text, ',' order by id)) into v_n, v_exp, v_khoa from _sai;
  if v_n <> 44 or v_exp <> 11000 or v_khoa <> 'c5999af3b97c496a37a0ce2545d73de9' or exists (select 1 from _sai where mon_dung <> 'KHTN') then
    raise exception 'Tập dòng cần sửa đã khác lúc đo (16/11): % dòng · % EXP · khoá % — đo lại trước khi áp.', v_n, v_exp, v_khoa;
  end if;
  update gami_exp_ledger g set mon = s.mon_dung from _sai s where g.id = s.id;
  get diagnostics v_sua = row_count;
  if v_sua <> 44 then raise exception 'Sửa % dòng, cần đúng 44.', v_sua; end if;
end $$;
