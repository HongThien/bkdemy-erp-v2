-- Sửa fn_troly_phong_lay (mig 202611031255): chỉ lấy lớp của ô (môn × khối) CÒN lớp đang học — đúng luật của fn_troly_ca_nhan_lay
-- (lớp ⋈ fn_pham_vi_cua_toi, mà ô trong đó suy từ lớp đang học). Bản 1255 lấy mọi ô ⇒ đếm thừa lớp của ô đã đóng (72 thay vì 67);
-- số việc không đổi (ô đã đóng không có việc), chỉ con số "số lớp" sai.
create or replace function public.fn_troly_phong_lay(p_so_ngay integer DEFAULT 14)
 returns jsonb
 language plpgsql security definer set search_path to 'public'
as $$
declare
  v_khoi text[];
  v_lops text[];
begin
  select coalesce(array_agg(distinct l.khoi), '{}'), coalesce(array_agg(l.ten_lop), '{}') into v_khoi, v_lops
    from lop l
   where l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi)
     and exists (select 1 from lop d where d.mon = l.mon and d.khoi = l.khoi and d.trang_thai = 'dang_hoc');
  if cardinality(v_lops) = 0 then raise exception 'Phòng của bạn chưa có khối nào.' using errcode = '42501'; end if;
  return public._troly_bc_theo_lop(p_so_ngay, v_khoi, v_lops,
    'Báo cáo các khối của bộ môn' || coalesce(' ' || array_to_string(public._phong_mon_cua_toi(), ' · '), ''),
    'Lọc từ báo cáo Sư phạm toàn trung tâm theo lớp thuộc bộ môn của phòng. Cảnh báo bất thường chung chưa lọc được theo khối nên không hiện ở đây.');
end $$;
