-- Thùy 09/10: (1) "Mới có thêm iPad nên capacity bổ trợ tăng từ 50 lên 70" ⇒ _btyeu_tran_dang() = 70 (trần Cao 20 giữ nguyên).
-- (2) "Học sinh có trọng số bổ trợ: lớp S 0.5, lớp A 0.75, lớp B/C 1 — trước 1 ca tối đa 3 HS, giờ toàn S thì 6 HS"
--     ⇒ chỗ NGƯỜI của ca = 3 SUẤT/TA; mỗi em chiếm suất = trọng số bậc lớp của em (lớp gốc của lượt: bù = lớp buổi nghỉ ·
--     đuổi = lớp đợt đuổi · yếu = lớp case, không có thì lớp đang học môn của ca). Lớp chưa gán bậc = 1. ĐƠN VỊ (30'×TA) giữ nguyên.
--     Sửa 4 hàm (dựng từ bản ĐANG CHẠY): fn_ca_bo_tro_ngay · fn_ca_bo_tro_ung_vien · fn_ca_bo_tro_xep · fn_ca_bo_tro_xac_nhan.
create or replace function public._btyeu_tran_dang() returns integer language sql immutable as $$ select 70 $$;

create or replace function public._bt_trong_so_lop(p_lop uuid) returns numeric language sql stable set search_path = public as $$
  select coalesce((select case l.bac when 'S' then 0.5 when 'A' then 0.75 else 1 end from lop l where l.id = p_lop), 1)::numeric
$$;

-- Trọng số của 1 lượt trong ca: lớp gốc của lượt (bù/đuổi/yếu), không có thì lớp đang học môn của ca.
create or replace function public._ca_bo_tro_trong_so_bhh(p_bhh uuid) returns numeric language sql stable set search_path = public as $$
  select public._bt_trong_so_lop(coalesce(bm.lop_id, d.lop_id, y.lop_id,
           (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
             where hl.hoc_sinh_id = hh.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = c.mon order by l.created_at desc limit 1)))
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join ca_bo_tro c on c.id = b.ca_bo_tro_id
  left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where hh.id = p_bhh
$$;

-- Tổng suất người đã dùng của ca (mỗi em tính 1 lần — em có 2 lượt trong cùng ca lấy trọng số lớn nhất); cùng bộ lọc _ca_bo_tro_tinh.
create or replace function public._ca_bo_tro_suc_nguoi(p_ca uuid, p_tru_bhh uuid default null) returns numeric language sql stable set search_path = public as $$
  select coalesce(sum(w), 0)::numeric from (
    select hh.hoc_sinh_id, max(public._ca_bo_tro_trong_so_bhh(hh.id)) as w
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    where b.ca_bo_tro_id = p_ca and b.trang_thai <> 'huy' and hh.don_vi is not null and hh.xac_nhan_ph_at is not null
      and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep') and (p_tru_bhh is null or hh.id <> p_tru_bhh)
    group by hh.hoc_sinh_id) x
$$;

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
$function$;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ung_vien(p_ca uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_con int; v_cho_hs numeric; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca); -- Thùy 09/10: suất còn lại theo trọng số lớp
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;

  with
  duoi as (
    select d.id as ref_id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, d.created_at,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat') as da_hoc,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) as dang_cho,
           d.so_buoi_du_kien
    from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
    where d.trang_thai = 'can_duoi' and d.dang_duyet_at is not null and l.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.ngay = c.ngay)
  ),
  bu as (
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join lop l on l.id = b.lop_id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
    where hh.diem_danh in ('vang', 'vang_phep') and b.loai = 'thuong' and b.trang_thai <> 'huy' and l.mon = c.mon and (c.khoi is null or l.khoi = c.khoi)
      and not exists (select 1 from bang_khong_bu k where k.buoi_hoc_hs_id = hh.id)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                      where x.hoc_sinh_id = hh.hoc_sinh_id and x.bu_cho_buoi_id = hh.buoi_hoc_id and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
  ),
  yeu as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id,
           coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 1) as level,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false)) as so_dang
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 1) -- Thùy 28/09: L1/L2/L3 đều xếp; L0 = không bổ trợ
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'toi_da_hs', 3 * c.so_ta, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'da_xep_ngay_khac', dang_cho > 0,
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id) and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= 4 and v_cho_hs >= public._bt_trong_so_lop(lop_id), 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when level <= 1 then 1 else 4 end,
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (case when level <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when level <= 1 then 1 else 4 end) then 'cần ' || (case when level <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu)
  ) into v_out;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_xep(p_ca uuid, p_loai text, p_hoc_sinh uuid, p_ref uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_buoi uuid; v_bhh uuid; v_dv smallint; v_nguoi uuid; v_lop uuid; v_ta uuid; v_bu_cho uuid; v_phut int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('duoi', 'bu', 'yeu') then raise exception 'Loại phải là duoi | bu | yeu.'; end if;
  select * into c from ca_bo_tro where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if c.trang_thai <> 'mo' then raise exception 'Ca đã huỷ.'; end if;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;
  if p_loai = 'duoi' and v_phut < 60 then raise exception 'Bổ trợ đuổi cần đủ 1 tiếng — ca này chỉ % phút.', v_phut; end if;
  v_dv := public._ca_bo_tro_don_vi(p_loai, p_hoc_sinh, c.mon);
  -- Thùy 24/09: Lộc chốt với PH RỒI mới điền ⇒ xếp = đã chốt ⇒ trừ đơn vị NGAY, chặn luôn lúc xếp (không còn bước "chờ PH / Xác nhận").
  select * into t from public._ca_bo_tro_tinh(p_ca);
  if t.don_vi_dung + v_dv > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ca đã đủ đơn vị.', c.don_vi - t.don_vi_dung, v_dv; end if;

  -- lớp của em (để tìm TA lớp) + kiểm tra ref thuộc đúng em
  if p_loai = 'duoi' then
    select lop_id into v_lop from bo_tro_duoi where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'can_duoi';
    if not found then raise exception 'Đợt đuổi không hợp lệ.'; end if;
  elsif p_loai = 'bu' then
    select b.lop_id, b.id into v_lop, v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if not found then raise exception 'Lần nghỉ không hợp lệ.'; end if;
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.hoc_sinh_id = p_hoc_sinh and x.bu_cho_buoi_id = v_bu_cho and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
      then raise exception 'Lần nghỉ này đã có buổi bù còn hiệu lực.'; end if;
  else
    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  end if;
  -- Thùy 09/10: suất theo TRỌNG SỐ LỚP (S 0.5 · A 0.75 · B/C 1), 3 suất/TA. Em đã có lượt trong ca này (vd 2 lần bù) không tính thêm.
  if not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where bb.ca_bo_tro_id = p_ca and bb.trang_thai <> 'huy'
                 and x.hoc_sinh_id = p_hoc_sinh and x.don_vi is not null and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
     and public._ca_bo_tro_suc_nguoi(p_ca) + public._bt_trong_so_lop(v_lop) > 3 * c.so_ta then
    raise exception 'Ca hết suất: còn % suất, em cần % (lớp bậc %).', 3 * c.so_ta - public._ca_bo_tro_suc_nguoi(p_ca), public._bt_trong_so_lop(v_lop),
      coalesce((select bac from lop where id = v_lop), '?');
  end if;
  -- người dạy mặc định (câu 6): yếu = người trực; bù/đuổi = TA lớp em nếu đang trực ca này, không thì người trực
  v_ta := case when v_lop is null then null else public._ta_cua_lop(v_lop) end;
  v_nguoi := case when p_loai <> 'yeu' and v_ta is not null and v_ta in (c.nhan_su_id, c.nhan_su_2_id) then v_ta else c.nhan_su_id end;

  if p_loai = 'bu' then
    select id into v_buoi from buoi_hoc where ca_bo_tro_id = p_ca and loai = 'bu' and trang_thai = 'mo' order by created_at limit 1;
  end if;
  if v_buoi is null then
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_id)
    values (case p_loai when 'duoi' then 'bo_tro_duoi' when 'bu' then 'bu' else 'bo_tro_yeu' end, null, c.ngay, public._thu_cua_ngay(c.ngay),
            c.gio_bat_dau, c.gio_ket_thuc, c.phong, v_nguoi, 'mo', public.jwt_uid(), p_ca)
    returning id into v_buoi;
  end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_duoi_id, bu_cho_buoi_id, bo_tro_yeu_id, don_vi, xac_nhan_ph_at, xac_nhan_boi)
  values (v_buoi, p_hoc_sinh, case when p_loai = 'duoi' then p_ref end, v_bu_cho, case when p_loai = 'yeu' then p_ref end, v_dv, now(), public.jwt_uid())
  returning id into v_bhh;
  return jsonb_build_object('buoi_hoc_id', v_buoi, 'bhh_id', v_bhh, 'don_vi', v_dv, 'nguoi_day_tg', v_nguoi);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_xac_nhan(p_bhh uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; c record; t record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hh.*, b.ca_bo_tro_id, b.trang_thai as buoi_tt into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.ca_bo_tro_id is null then raise exception 'Không thấy lượt xếp.'; end if;
  if r.buoi_tt <> 'mo' then raise exception 'Buổi đã huỷ.'; end if;
  if r.xac_nhan_ph_at is not null then return jsonb_build_object('da_xac_nhan', true); end if;
  select * into c from ca_bo_tro where id = r.ca_bo_tro_id for update;
  select * into t from public._ca_bo_tro_tinh(c.id, p_bhh);
  if t.don_vi_dung + r.don_vi > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ai chốt trước chiếm chỗ trước.', c.don_vi - t.don_vi_dung, r.don_vi; end if;
  if public._ca_bo_tro_suc_nguoi(c.id, p_bhh) + public._ca_bo_tro_trong_so_bhh(p_bhh) > 3 * c.so_ta then
    raise exception 'Ca hết suất (3 suất/TA · lớp S 0.5 · A 0.75 · B/C 1).'; end if; -- Thùy 09/10
  update buoi_hoc_hs set xac_nhan_ph_at = now(), xac_nhan_boi = public.jwt_uid() where id = p_bhh;
  return jsonb_build_object('da_xac_nhan', true, 'don_vi_dung', t.don_vi_dung + r.don_vi, 'don_vi', c.don_vi);
end $function$;
