-- Báo cáo kì: CHỐT LẠI số liệu cho các em có điểm MT tháng 10 (Toán) vừa được cập nhật (Thùy 06/11: "một số học sinh cập nhật MT tháng 10, sửa lại vào bản report thi học kì").
-- VÌ SAO: số liệu báo cáo kì được CHỐT 1 lần vào bc_ky_so_lieu (mig 202611051704, tối 05/11); điểm MT sửa SAU lúc chốt (sáng 06/11: 8 em MT 11B1, 1 em MT 10A1, 1 em MT 6B1)
--   không lên báo cáo — ô T10 trống. Điểm mới còn làm đổi TRUNG BÌNH lần thi + HẠNG THEO KHỐI của cả khối ⇒ bản chốt của em khác cùng khối cũng lệch (thi/hang_ky/phu_luc).
-- LÀM: gọi ĐÚNG hàm chính thức fn_bc_ky_chot_hs (bản chốt cũ tự vào bc_ky_so_lieu_log — hoàn lại được) cho các (em × môn × kì) CHƯA công bố, thuộc khối có điểm thi sửa sau lúc chốt,
--   mà số tính mới KHÁC bản chốt ở 1 trong 3 khoá: thi · hang_ky · phu_luc. Phần GV nhập (nhận xét, điểm năng lực, kế hoạch…) nằm ở bao_cao_ph_ky — KHÔNG đụng.
-- LƯU Ý: chốt lại tính lại TOÀN BỘ số liệu của em đó (kể cả đánh giá kiến thức, kết luận) tới thời điểm hiện tại — đó là cách duy nhất của hàm chính thức.
-- MẤT GÌ (Luật xoá): không — ghi đè bc_ky_so_lieu, bản cũ vào bc_ky_so_lieu_log. Không đụng báo cáo đã công bố (snapshot đóng băng).
do $$
declare
  v_admin uuid; v_email text; r record; v_moi jsonb; v_n int := 0; v_xet int := 0;
begin
  select tk.id, tk.email into v_admin, v_email from tai_khoan tk join nhan_su n on n.id = tk.nhan_su_id
   where n.la_admin_he_thong and tk.email = 'admin@gmail.com';
  if v_admin is null then raise exception 'Không thấy tài khoản admin hệ thống để chốt.'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'email', v_email, 'role', 'authenticated')::text, true);
  for r in
    select s.hoc_sinh_id, s.mon, s.ky_id, s.du_lieu
      from bc_ky_so_lieu s join hoc_sinh h on h.id = s.hoc_sinh_id
     where not exists (select 1 from bao_cao_ph_ky b where b.hoc_sinh_id = s.hoc_sinh_id and b.mon = s.mon and b.ky_id = s.ky_id and b.cong_bo_at is not null)
       and exists (select 1 from diem_thi d join ky_thi k on k.id = d.ky_thi_id
                    where k.mon = s.mon and k.khoi = h.khoi and d.updated_at > s.chot_at)
  loop
    v_xet := v_xet + 1;
    v_moi := public.fn_bc_ky_tinh(r.hoc_sinh_id, r.mon, r.ky_id);
    if (v_moi->'thi') is distinct from (r.du_lieu->'thi') or (v_moi->'hang_ky') is distinct from (r.du_lieu->'hang_ky') or (v_moi->'phu_luc') is distinct from (r.du_lieu->'phu_luc') then
      perform public.fn_bc_ky_chot_hs(r.hoc_sinh_id, r.mon, r.ky_id);
      v_n := v_n + 1;
    end if;
  end loop;
  raise notice 'Báo cáo kì: xét % bản chốt, chốt lại % em (MT tháng 10).', v_xet, v_n;
end $$;
