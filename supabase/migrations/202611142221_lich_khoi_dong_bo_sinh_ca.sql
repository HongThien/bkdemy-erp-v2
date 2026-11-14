-- LỊCH KHỐI ↔ LỊCH PHÒNG KHÔNG ĐỒNG BỘ (Thùy 14/11: "khi trùng phòng hệ thống có cảnh báo, còn lại vẫn cho phép cùng phòng").
-- Đo: 18 ca của Lịch khối (11/11–27/11) KHÔNG BAO GIỜ xuất hiện ở Lịch phòng — fn_ca_bo_tro_sinh_ngay (cả "Chốt tuần" gọi nó) bỏ im lặng dòng lịch trùng NGƯỜI + giờ với ca khác,
-- trong khi lúc LƯU Lịch khối (fn_lich_truc_kiem_trung) trùng đó chỉ là cảnh báo (cùng giờ, người trực nhiều khối) nên vẫn được lưu. Lưu được mà không sinh được = lệch.
-- SỬA: bỏ 2 điều kiện bỏ-im-lặng; chỉ bỏ dòng GIỐNG HỆT (mon · khối · thứ · giờ · TA · TA2 · phòng) có id nhỏ hơn. Vá luôn: sau khi ghép buổi vào ca, tính lại đơn vị bù theo nhóm.
-- KHÔNG đổi: luật tối đa 2 ca/phòng cùng giờ (trigger + 'chan' lúc lưu) — chờ Thùy xác nhận có muốn nới không.
CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_sinh_ngay(p_ngay date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare n int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  insert into ca_bo_tro (lich_truc_id, ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  select t.id, p_ngay, t.gio_bat_dau, t.gio_ket_thuc, t.mon, t.khoi, t.phong, t.so_ta, t.nhan_su_id, t.nhan_su_2_id, public.jwt_uid()
  from lich_truc_bo_tro t
  where t.thu = public._thu_cua_ngay(p_ngay) and t.hieu_luc_tu <= p_ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= p_ngay)
    and not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = p_ngay)
    -- Thùy 14/11: MỌI dòng Lịch khối lưu được thì PHẢI có ca ở Lịch phòng. Trùng người / trùng giờ chỉ là CẢNH BÁO lúc lưu (fn_lich_truc_kiem_trung), không được bỏ im lặng lúc sinh ca
    -- (trước đây 2 điều kiện "1 TA 1 ca/khung giờ" + "id nhỏ hơn" làm 18 ca biến khỏi Lịch phòng). CHỈ bỏ dòng GIỐNG HỆT dòng có id nhỏ hơn (lưu 2–3 lần) — nên xoá dòng thừa ở Lịch khối.
    and not exists (select 1 from lich_truc_bo_tro u where u.id < t.id and u.mon = t.mon and u.khoi = t.khoi and u.thu = t.thu and u.gio_bat_dau = t.gio_bat_dau and u.gio_ket_thuc = t.gio_ket_thuc
                      and u.nhan_su_id is not distinct from t.nhan_su_id and u.nhan_su_2_id is not distinct from t.nhan_su_2_id and u.phong is not distinct from t.phong
                      and u.hieu_luc_tu <= p_ngay and (u.hieu_luc_den is null or u.hieu_luc_den >= p_ngay))
  on conflict do nothing;
  get diagnostics n = row_count;

  -- Thùy 24/09 "Lịch phòng phải khớp với những ca đã xếp": buổi Bù/Đuổi/Yếu xếp bằng form riêng (chưa gắn ca) mà trùng NGƯỜI TRỰC + GIAO GIỜ
  -- với 1 ca trực của ngày ⇒ gắn vào ca đó (khớp giờ bắt đầu gần nhất). Không khớp ca nào ⇒ để nguyên, màn hiện ở khu "Lịch riêng".
  with ghep as (
    select distinct on (b.id) b.id as buoi_id, c.id as ca_id
    from buoi_hoc b join ca_bo_tro c on c.ngay = b.ngay and c.trang_thai = 'mo' and b.nguoi_day_tg in (c.nhan_su_id, c.nhan_su_2_id)
      and b.gio_bat_dau < c.gio_ket_thuc and coalesce(b.gio_ket_thuc, b.gio_bat_dau + interval '30 minutes') > c.gio_bat_dau
    where b.ngay = p_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.ca_bo_tro_id is null and b.gio_bat_dau is not null
    order by b.id, abs(extract(epoch from (b.gio_bat_dau - c.gio_bat_dau)))
  )
  update buoi_hoc b set ca_bo_tro_id = g.ca_id from ghep g where b.id = g.buoi_id;
  -- Em trong buổi vừa gắn: tính đơn vị theo loại; xếp bằng đường cũ = đã chốt với PH từ lúc xếp ⇒ coi như đã xác nhận (xac_nhan_ph_at = lúc tạo buổi).
  update buoi_hoc_hs hh set
    don_vi = case b.loai when 'bu' then 4 when 'bo_tro_duoi' then 4 else public._ca_bo_tro_don_vi('yeu', hh.hoc_sinh_id, c.mon) end,
    xac_nhan_ph_at = coalesce(hh.xac_nhan_ph_at, b.created_at)
  from buoi_hoc b join ca_bo_tro c on c.id = b.ca_bo_tro_id
  where hh.buoi_hoc_id = b.id and b.ngay = p_ngay and hh.don_vi is null and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep');
  -- 14/11: đơn vị bù theo NHÓM cùng lớp cùng buổi (mig 202611140851) — bước trên đặt cứng 4 cho em mới gắn, tính lại cho các ca của ngày
  perform public._ca_bo_tro_cap_nhat_dv_bu(c.id) from ca_bo_tro c where c.ngay = p_ngay and c.trang_thai = 'mo';
  return n;
end $function$;
