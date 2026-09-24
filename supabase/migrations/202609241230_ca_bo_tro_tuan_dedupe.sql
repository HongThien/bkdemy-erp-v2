-- 24/09: dải ngày ở Lịch phòng đếm "6 ca" trong khi ngày chỉ sinh 5 — vì tóm tắt cộng cả dòng lịch trực TRÙNG (cùng TA cùng khung giờ, tách bậc S/A cũ)
-- mà fn_ca_bo_tro_sinh_ngay đã cố ý bỏ qua. Tóm tắt phải áp cùng luật: 1 TA 1 ca/khung giờ.
create or replace function public.fn_ca_bo_tro_tuan(p_tu date, p_den date) returns jsonb
language sql stable security definer set search_path = public as $$
  with d as (select generate_series(p_tu, least(p_den, p_tu + 60), interval '1 day')::date as ngay),
  ca as (select c.ngay, count(*) filter (where c.trang_thai = 'mo') so_ca, coalesce(sum(c.don_vi) filter (where c.trang_thai = 'mo'), 0) tong,
                coalesce(sum(t.don_vi_dung), 0) dung, coalesce(sum(t.don_vi_cho), 0) cho
         from ca_bo_tro c cross join lateral public._ca_bo_tro_tinh(c.id) t where c.ngay between p_tu and p_den group by c.ngay),
  lt as (select d.ngay, count(*) so_lich, coalesce(sum(t.don_vi), 0) tong_lich from d join lich_truc_bo_tro t
         on t.thu = public._thu_cua_ngay(d.ngay) and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
         where not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = d.ngay)
           and not exists (select 1 from ca_bo_tro c where c.ngay = d.ngay and c.trang_thai = 'mo' and c.nhan_su_id = t.nhan_su_id and c.gio_bat_dau < t.gio_ket_thuc and c.gio_ket_thuc > t.gio_bat_dau)
           and not exists (select 1 from lich_truc_bo_tro u where u.id < t.id and u.thu = t.thu and u.nhan_su_id = t.nhan_su_id and u.hieu_luc_tu <= d.ngay and (u.hieu_luc_den is null or u.hieu_luc_den >= d.ngay) and u.gio_bat_dau < t.gio_ket_thuc and u.gio_ket_thuc > t.gio_bat_dau)
         group by d.ngay)
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'ngay', d.ngay, 'so_ca', coalesce(ca.so_ca, 0) + coalesce(lt.so_lich, 0), 'don_vi', coalesce(ca.tong, 0) + coalesce(lt.tong_lich, 0),
    'don_vi_dung', coalesce(ca.dung, 0), 'don_vi_cho', coalesce(ca.cho, 0)) order by d.ngay), '[]'::jsonb) end
  from d left join ca on ca.ngay = d.ngay left join lt on lt.ngay = d.ngay
$$;
