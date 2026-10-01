-- Thùy 30/09 (Khánh Chi 10B1, ca đuổi 15:00 TA Ngô Ngọc Huyền — app TA KHÔNG có dòng ca 30/09; hôm qua y hệt với ca bù của Cường):
-- ô "Bổ trợ đuổi" app TA đọc CA từ đây (khuôn fn_bu_ca_cua_toi) thay vì suy từ danh sách việc chấm (getMyTasks — đường đó rơi ca trên
-- máy thật mà giả lập SQL không tái hiện được). TA thấy ca mình đứng (nguoi_day_tg, chưa gán TA thì GV) · admin thấy MỌI ca đuổi.
-- Phạm vi: nợ cũ ≤ 7 ngày chưa đóng (còn em chưa điểm danh / có mặt) + hôm nay (kể cả đã xong) + 7 ngày tới.
create or replace function public.fn_duoi_ca_cua_toi() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);
  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_out from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi_day_ten,
           coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns as cua_toi,
           b.danh_gia_xong_at,
           (select jsonb_agg(jsonb_build_object('ho_ten', h.ho_ten, 'lop', l.ten_lop, 'diem_danh', hh.diem_danh) order by h.ho_ten)
              from buoi_hoc_hs hh join hoc_sinh h on h.id = hh.hoc_sinh_id
              left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id left join lop l on l.id = d.lop_id
              where hh.buoi_hoc_id = b.id) as hs
    from buoi_hoc b
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
    where b.loai = 'bo_tro_duoi' and b.trang_thai = 'mo'
      and (v_admin or coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns)
      and b.ngay between v_today - 7 and v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)
      and (b.ngay >= v_today or exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and (x.diem_danh is null or x.diem_danh = 'co_mat')))
  ) x;
  return v_out;
end $$;
revoke all on function public.fn_duoi_ca_cua_toi() from public;
revoke execute on function public.fn_duoi_ca_cua_toi() from anon;
grant execute on function public.fn_duoi_ca_cua_toi() to authenticated;
