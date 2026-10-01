-- Thùy 24/09 (sau khi dùng thử Lịch phòng): "Lịch phòng phải khớp với những ca đã xếp" + "Bổ trợ yếu không còn logic riêng — tính chung 3 loại".
-- (1) fn_ca_bo_tro_sinh_ngay: sinh ca xong thì GẮN buổi đã xếp bằng form riêng (Bù/Đuổi/Yếu) vào ca trực khớp người + giờ, tính đơn vị cho em.
-- (2) Buổi đã học (hoan_tat) vẫn chiếm đơn vị của ca — chỉ buổi huỷ mới trả (trước đây chỉ đếm 'mo').

create or replace function public._ca_bo_tro_tinh(p_ca uuid, p_tru_bhh uuid default null)
returns table (don_vi_dung int, don_vi_cho int, so_hs_xn int, so_hs_cho int)
language sql stable as $$
  select coalesce(sum(hh.don_vi) filter (where hh.xac_nhan_ph_at is not null), 0)::int,
         coalesce(sum(hh.don_vi) filter (where hh.xac_nhan_ph_at is null), 0)::int,
         count(distinct hh.hoc_sinh_id) filter (where hh.xac_nhan_ph_at is not null)::int,
         count(distinct hh.hoc_sinh_id) filter (where hh.xac_nhan_ph_at is null)::int
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
  where b.ca_bo_tro_id = p_ca and b.trang_thai <> 'huy' and hh.don_vi is not null
    and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep') and (p_tru_bhh is null or hh.id <> p_tru_bhh)
$$;

create or replace function public.fn_ca_bo_tro_ngay(p_ngay date) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'lich_truc_id', c.lich_truc_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc,
    'phut', (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int,
    'mon', c.mon, 'khoi', c.khoi, 'phong', c.phong, 'so_ta', c.so_ta,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'nhan_su_2_id', c.nhan_su_2_id, 'nhan_su_2_ten', ns2.ho_ten,
    'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'so_hs_xn', t.so_hs_xn, 'so_hs_cho', t.so_hs_cho,
    'trang_thai', c.trang_thai, 'ly_do_huy', c.ly_do_huy,
    'phong_so_ca', (select count(*) from ca_bo_tro x where x.trang_thai = 'mo' and x.ngay = c.ngay and x.phong = c.phong and x.phong is not null
                    and x.gio_bat_dau < c.gio_ket_thuc and x.gio_ket_thuc > c.gio_bat_dau),
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
             'bhh_id', hh.id, 'buoi_hoc_id', b.id, 'loai', case b.loai when 'bo_tro_duoi' then 'duoi' when 'bu' then 'bu' else 'yeu' end,
             'hoc_sinh_id', hh.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
             'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon limit 1),
             'don_vi', hh.don_vi, 'xac_nhan_ph_at', hh.xac_nhan_ph_at, 'diem_danh', hh.diem_danh,
             'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_day_ten', nd.ho_ten,
             'chi_tiet', case b.loai
               when 'bu' then 'nghỉ ' || to_char((select m.ngay from buoi_hoc m where m.id = hh.bu_cho_buoi_id), 'DD/MM')
               when 'bo_tro_duoi' then 'đuổi · buổi ' || (select count(*) + 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = hh.bo_tro_duoi_id and bb.id <> b.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat')
                                          || coalesce('/' || (select d.so_buoi_du_kien from bo_tro_duoi d where d.id = hh.bo_tro_duoi_id), '')
               else 'yếu L' || coalesce((select l.level from hs_level l where l.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon and l.loai = 'kien_thuc'), 1)
                    || ' · ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) || ' dạng cần dạy' end
           ) order by hh.xac_nhan_ph_at nulls last, hs.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
           left join nhan_su nd on nd.id = b.nguoi_day_tg
           where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy' and hh.don_vi is not null)
  ) order by c.gio_bat_dau, c.phong nulls last, c.khoi), '[]'::jsonb) end
  from ca_bo_tro c
  left join nhan_su ns on ns.id = c.nhan_su_id left join nhan_su ns2 on ns2.id = c.nhan_su_2_id
  cross join lateral public._ca_bo_tro_tinh(c.id) t
  where c.ngay = p_ngay
$$;
grant execute on function public.fn_ca_bo_tro_ngay(date) to authenticated;

create or replace function public.fn_ca_bo_tro_sinh_ngay(p_ngay date) returns integer
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  insert into ca_bo_tro (lich_truc_id, ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  select t.id, p_ngay, t.gio_bat_dau, t.gio_ket_thuc, t.mon, t.khoi, t.phong, t.so_ta, t.nhan_su_id, t.nhan_su_2_id, public.jwt_uid()
  from lich_truc_bo_tro t
  where t.thu = public._thu_cua_ngay(p_ngay) and t.hieu_luc_tu <= p_ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= p_ngay)
    and not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = p_ngay)
    -- lịch trực cũ tách theo BẬC (7S/7A cùng TA cùng giờ) — bậc không còn dùng xếp (CEO 24/09): 1 TA 1 ca/khung giờ, dòng trùng bỏ qua
    and not exists (select 1 from ca_bo_tro c where c.ngay = p_ngay and c.trang_thai = 'mo' and c.nhan_su_id = t.nhan_su_id and c.gio_bat_dau < t.gio_ket_thuc and c.gio_ket_thuc > t.gio_bat_dau)
    and not exists (select 1 from lich_truc_bo_tro u where u.id < t.id and u.thu = t.thu and u.nhan_su_id = t.nhan_su_id and u.hieu_luc_tu <= p_ngay and (u.hieu_luc_den is null or u.hieu_luc_den >= p_ngay) and u.gio_bat_dau < t.gio_ket_thuc and u.gio_ket_thuc > t.gio_bat_dau)
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
  return n;
end $$;
grant execute on function public.fn_ca_bo_tro_sinh_ngay(date) to authenticated;
