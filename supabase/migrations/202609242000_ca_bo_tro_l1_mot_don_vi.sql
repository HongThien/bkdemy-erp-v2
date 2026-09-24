-- Thùy 24/09 tối: "L1 là bổ trợ 30 phút ⇒ chỉ cần 1 ĐƠN VỊ. Nhưng luật tối đa 1 ca 3 người. Nên (1) đủ người, (2) đủ đơn vị — thì ca đều báo đầy."
-- Đổi giá Yếu L1: 2 → 1 đơn vị (Đuổi 4 · Bù 4 · Yếu L2 4 giữ nguyên). Nắp 3 em/TA giữ nguyên. Ca ĐẦY khi chạm 1 trong 2 ngưỡng.

-- 1. Giá L1 = 1
create or replace function public._ca_bo_tro_don_vi(p_loai text, p_hs uuid, p_mon text) returns smallint
language sql stable as $$
  select case when p_loai in ('duoi', 'bu') then 4
              when coalesce((select l.level from hs_level l where l.hoc_sinh_id = p_hs and l.mon = p_mon and l.loai = 'kien_thuc'), 1) <= 1 then 1
              else 4 end::smallint
$$;

-- 2. Ràng buộc giá trị đơn vị của 1 em: {1, 4}. Dữ liệu đã ghi (L1 = 2 theo giá cũ) đổi về 1 TRƯỚC khi siết.
do $$ declare r record; begin
  for r in select conname from pg_constraint where conrelid = 'public.buoi_hoc_hs'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%don_vi%' loop
    execute format('alter table public.buoi_hoc_hs drop constraint %I', r.conname);
  end loop;
end $$;
update public.buoi_hoc_hs set don_vi = 1 where don_vi = 2;
alter table public.buoi_hoc_hs add constraint buoi_hoc_hs_don_vi_check check (don_vi is null or don_vi in (1, 4));

-- 3. Ứng viên: Yếu L1 cần 1 đv; lý do không vừa ghi rõ "đủ N em" vs "cần x · còn y"
create or replace function public.fn_ca_bo_tro_ung_vien(p_ca uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare c record; t record; v_con int; v_cho_hs int; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - t.so_hs_xn;
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
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_xep_ngay_khac', dang_cho > 0,
        'vua', v_con >= 4 and v_cho_hs > 0 and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'vua', v_con >= 4 and v_cho_hs > 0, 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when level <= 1 then 1 else 4 end,
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'vua', v_con >= (case when level <= 1 then 1 else 4 end) and v_cho_hs > 0,
        'ly_do_khong_vua', case when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' when v_con < (case when level <= 1 then 1 else 4 end) then 'cần ' || (case when level <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu)
  ) into v_out;
  return v_out;
end $$;
grant execute on function public.fn_ca_bo_tro_ung_vien(uuid) to authenticated;

-- 4. Ca của ngày: trả thêm toi_da_hs + 2 cờ đầy (đủ người · đủ đơn vị) — màn chỉ hiện, không tự tính
create or replace function public.fn_ca_bo_tro_ngay(p_ngay date) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'lich_truc_id', c.lich_truc_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc,
    'phut', (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int,
    'mon', c.mon, 'khoi', c.khoi, 'phong', c.phong, 'so_ta', c.so_ta,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'nhan_su_2_id', c.nhan_su_2_id, 'nhan_su_2_ten', ns2.ho_ten,
    'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'so_hs_xn', t.so_hs_xn, 'so_hs_cho', t.so_hs_cho,
    'trang_thai', c.trang_thai, 'ly_do_huy', c.ly_do_huy, 'toi_da_hs', 3 * c.so_ta,
    'day_nguoi', t.so_hs_xn >= 3 * c.so_ta, 'day_don_vi', t.don_vi_dung >= c.don_vi,
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
