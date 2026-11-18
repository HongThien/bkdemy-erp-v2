-- Thùy 18/11: "Ko có luật đủ 5p nhận xu. Mục tiêu là chơi 5 phút chứ ko liên quan cái này." → "Sửa đi".
-- nt_cau_hinh.xu_phut_toi_thieu = 5 làm fn_nt_xu_dong_bo chỉ tính "ngày chơi" khi ngày đó em chơi ≥ 5 phút
-- ⇒ 116 / 191 em (30 ngày tới 18/11) không ngày nào đủ ⇒ trần xu của các em = 0.
-- Đặt về 0: ngày nào có chơi là ngày chơi. Trần 20 xu / tháng và 4 xu / ngày chơi GIỮ NGUYÊN.
-- Không trả bù tay: xu tháng này của mỗi em tự tính lại ở lượt đồng bộ kế tiếp khi em mở Nông trại.
do $$
declare v_n int;
begin
  update public.nt_cau_hinh set xu_phut_toi_thieu = 0, updated_at = now() where id = 1 and xu_phut_toi_thieu = 5;
  get diagnostics v_n = row_count;
  if v_n <> 1 then raise exception 'nt_cau_hinh: sửa % dòng (giá trị đã đổi?)', v_n; end if;
end $$;
