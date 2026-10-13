-- Thùy 13/10 (ảnh Lịch phòng — ca Tuệ Nhi 12/10): dòng em ghi "yếu L1 · 1 dạng cần dạy" cạnh ô "Hoàn tất · 12/12" ⇒ người dùng đọc 12/12 là SỐ DẠNG
-- ("lúc chốt có 12 dạng, giờ còn 1"). Thật ra 12/12 = số CÂU luyện đúng trong ca; case có 4 dạng, ca dạy 3, còn 1.
-- Sửa chữ ở fn_ca_bo_tro_ngay (dựng từ bản ĐANG CHẠY): "yếu L1 · ca này dạy 3 dạng · còn 1/4 dạng cần dạy". Ô trạng thái sửa ở màn (ghi rõ "câu").
CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ngay(p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'lich_truc_id', c.lich_truc_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc,
    'phut', (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int,
    'mon', c.mon, 'khoi', c.khoi, 'phong', c.phong, 'so_ta', c.so_ta,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'nhan_su_2_id', c.nhan_su_2_id, 'nhan_su_2_ten', ns2.ho_ten,
    'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'so_hs_xn', t.so_hs_xn, 'so_hs_cho', t.so_hs_cho,
    'trang_thai', c.trang_thai, 'ly_do_huy', c.ly_do_huy, 'toi_da_hs', 3 * c.so_ta,
    'suc_nguoi', public._ca_bo_tro_suc_nguoi(c.id), -- Thùy 09/10: suất theo trọng số lớp (S 0.5 · A 0.75 · B/C 1)
    'day_nguoi', public._ca_bo_tro_suc_nguoi(c.id) >= 3 * c.so_ta, 'day_don_vi', t.don_vi_dung >= c.don_vi,
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
                    -- Thùy 13/10: ghi rõ nghĩa — ca đã xong thì nói ca này dạy mấy dạng; "còn x/y" = case có y dạng, còn x dạng chưa dạy xong (số hiện tại)
                    || case when b.danh_gia_xong_at is not null
                            then ' · ca này dạy ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.day_buoi_id = b.id) || ' dạng' else '' end
                    || ' · còn ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false))
                    || '/' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id) || ' dạng cần dạy' end
           ) order by hh.xac_nhan_ph_at nulls last, hs.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
           left join nhan_su nd on nd.id = b.nguoi_day_tg
           where b.ca_bo_tro_id = c.id and b.trang_thai <> 'huy' and hh.don_vi is not null)
  ) order by c.gio_bat_dau, c.phong nulls last, c.khoi), '[]'::jsonb) end
  from ca_bo_tro c
  left join nhan_su ns on ns.id = c.nhan_su_id left join nhan_su ns2 on ns2.id = c.nhan_su_2_id
  cross join lateral public._ca_bo_tro_tinh(c.id) t
  where c.ngay = p_ngay
$function$;
