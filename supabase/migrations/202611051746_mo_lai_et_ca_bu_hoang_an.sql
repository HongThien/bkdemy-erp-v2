-- Mở lại ET ca bù của Ding Phạm Hoàng An (HS0707) 05/11 (Thùy 05/11: "vì nó chưa làm ET đâu"). TA bấm nhầm "Xác nhận ET" khi em chưa làm ET:
-- fn_dong_phase đã cộng 250 EXP chuyên cần (attend_floor) và đặt buổi 'hoan_tat'. Dùng ĐÚNG hàm mở lại chính thức fn_mo_lai_phase (thu hồi EXP, gỡ et_dong_at, về 'mo').
-- Chặn: chỉ chạy khi ET đang đóng và CHƯA có dòng chấm ET nào (không xoá dữ liệu thật).
do $$
declare v uuid := '98e634dc-218f-42be-947a-dae0f0d37a77'; v_cham int;
begin
  select count(*) into v_cham from gami_grades g join gami_session_problems sp on sp.id = g.problem_id where sp.buoi_hoc_id = v and sp.phase = 'et';
  if v_cham = 0 and exists (select 1 from buoi_hoc where id = v and loai = 'bu' and et_dong_at is not null and danh_gia_xong_at is null) then
    perform public.fn_mo_lai_phase(v, 'et');
  end if;
end $$;
