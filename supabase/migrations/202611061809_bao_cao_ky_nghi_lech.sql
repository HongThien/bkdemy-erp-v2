-- Báo cáo kì: PHÁT HIỆN em có bản chốt số liệu CÓ THỂ LỆCH (Thùy 06/11, sau vụ MT tháng 10 sửa muộn: bản chốt tối 05/11 thiếu điểm T10 + hạng khối sai).
-- Rẻ (chỉ SQL, không tính lại báo cáo): em ĐÃ chốt, CHƯA công bố, mà có điểm thi (MT/khảo sát cùng môn, cùng khối, tháng thuộc kì — cùng cách gán tháng của fn_bc_ky_tinh)
-- được ghi/sửa SAU lúc chốt. Cùng KHỐI vì hạng + trung bình lần thi tính theo khối nên 1 em đổi điểm là cả khối lệch. Có thể báo dư (điểm đổi nhưng không đổi hạng) — chốt lại vô hại.
-- Chốt lại = fn_bc_ky_chot_hs như cũ (admin, bản cũ vào log). Hàm này CHỈ ĐỌC.
create or replace function public.fn_bc_ky_nghi_lech(p_hs uuid[], p_mon text, p_ky uuid)
returns uuid[]
language sql stable security definer set search_path to 'public'
as $$
  select case when not public.la_thanh_vien() then '{}'::uuid[] else coalesce((
    select array_agg(s.hoc_sinh_id)
      from bc_ky_so_lieu s
      join hoc_sinh h on h.id = s.hoc_sinh_id
      join ky_hoc kh on kh.id = s.ky_id
     where s.hoc_sinh_id = any(p_hs) and s.mon = p_mon and s.ky_id = p_ky
       and not exists (select 1 from bao_cao_ph_ky b where b.hoc_sinh_id = s.hoc_sinh_id and b.mon = s.mon and b.ky_id = s.ky_id and b.cong_bo_at is not null)
       and exists (select 1 from diem_thi d
                     join ky_thi k on k.id = d.ky_thi_id
                     left join buoi_hoc bh on bh.id = k.buoi_hoc_id
                    where k.mon = s.mon and k.khoi = h.khoi and d.updated_at > s.chot_at
                      and public._bc_ky_thang_thi(k.loai, coalesce(k.ngay, bh.ngay)) between kh.tu_thang and kh.den_thang)
  ), '{}'::uuid[]) end
$$;
grant execute on function public.fn_bc_ky_nghi_lech(uuid[], text, uuid) to authenticated;

-- Bắt kịp ngay lúc áp: 17 em Toán khối 12 vừa có điểm MT 12B1 2026-11-01 ghi sau lúc chốt (17:52–17:56 06/11) ⇒ chốt lại (hàm chính thức, bản cũ vào log; không đụng báo cáo đã công bố).
do $$
declare v_admin uuid; v_email text; r record; v_hs uuid[]; v_n int := 0; v_ky uuid;
begin
  select tk.id, tk.email into v_admin, v_email from tai_khoan tk join nhan_su n on n.id = tk.nhan_su_id where n.la_admin_he_thong and tk.email = 'admin@gmail.com';
  if v_admin is null then raise exception 'Không thấy tài khoản admin hệ thống để chốt.'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'email', v_email, 'role', 'authenticated')::text, true);
  for v_ky in select id from ky_hoc loop
    select coalesce(array_agg(hoc_sinh_id), '{}') into v_hs from bc_ky_so_lieu where mon = 'Toán' and ky_id = v_ky;
    for r in select unnest(public.fn_bc_ky_nghi_lech(v_hs, 'Toán', v_ky)) as hs loop
      perform public.fn_bc_ky_chot_hs(r.hs, 'Toán', v_ky); v_n := v_n + 1;
    end loop;
  end loop;
  raise notice 'Báo cáo kì: chốt lại % em nghi lệch (Toán).', v_n;
end $$;
