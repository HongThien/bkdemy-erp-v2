-- spec-bo-tro.md §12.0 — Thùy 17/11 chốt spec Bổ trợ rồi "Hiện tại có lệch gì ko thì fix luôn đã".

-- ── (câu 5) BỎ TRẦN 70 em / 20 Cao. Gỡ trigger chặn lúc mở case; hàm kiểm lúc duyệt giữ chữ ký (client + _btk_duyet_chay còn gọi), luôn trả null.
--    _btyeu_tran_dang / _btyeu_tran_cao + trigger bên bo_tro_hinh để nguyên — đi cùng việc gỡ Bổ trợ Hình (Luật xoá, chờ gật).
drop trigger if exists trg_btyeu_suc_chua on public.bo_tro_yeu;
create or replace function public.fn_btyeu_kiem_suc_chua(p_hs uuid, p_mon text, p_uu_tien integer)
 returns text language sql stable security definer set search_path to 'public'
as $$ select null::text   -- Thùy 17/11: bỏ trần — không còn chặn theo số em đang bổ trợ $$;

-- ── (câu 4) L3 · L4 vào ứng viên ca khối như L2 (trước: chỉ L2 · L3).
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
  if not public._mon_duoc_xem(c.mon) then raise exception 'Ca môn % ngoài quyền môn của bạn.', c.mon; end if;   -- 16/11
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
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi, hh.buoi_hoc_id as bai
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
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 2) -- Thùy 17/11: L2 · L3 · L4 cùng một đường ca khối (chỉ khác người dạy); L1 sau giờ; L0 = không bổ trợ
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
      -- Thùy 12/11: trần TUẦN = đơn vị của mức (L2 = 2 · L3 = 4); đủ thì không hiện ứng viên
      and public._btyeu_dv_tuan(y.hoc_sinh_id, y.mon, c.ngay) + public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon) <= public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)
  ),
  hinh as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at, y.muc, y.ly_do,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id
    from bo_tro_hinh y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_hinh_id = y.id and bb.loai = 'bo_tro_hinh' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
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
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop,
        'don_vi', public._ca_bo_tro_dv_bu_moi_em(public._ca_bo_tro_n_bu(p_ca, bai, hoc_sinh_id) + 1), 'them_dv', public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id),
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) and v_cho_hs >= public._bt_trong_so_lop(lop_id), 'ly_do_khong_vua', case when v_con < public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) then 'cần ' || public._ca_bo_tro_dv_them_bu(p_ca, bai, hoc_sinh_id) || ' · còn ' || v_con when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon),
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) then 'cần ' || (public._ca_bo_tro_don_vi('yeu', hoc_sinh_id, c.mon)) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu),
    'hinh', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'hinh', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when muc <= 1 then 1 else 4 end,
        'chi_tiet', 'Hình L' || muc || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · mở ' || to_char(created_at, 'DD/MM') || coalesce(' · ' || left(ly_do, 60), ''),
        'uu_tien', uu_tien, 'level', muc,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'trong_so', public._bt_trong_so_lop(lop_id),
        'vua', v_con >= (case when muc <= 1 then 1 else 4 end) and v_cho_hs >= public._bt_trong_so_lop(lop_id),
        'ly_do_khong_vua', case when v_cho_hs < public._bt_trong_so_lop(lop_id) then 'hết suất (còn ' || trim(to_char(v_cho_hs, 'FM990.99')) || ', em cần ' || trim(to_char(public._bt_trong_so_lop(lop_id), 'FM0.99')) || ')' when v_con < (case when muc <= 1 then 1 else 4 end) then 'cần ' || (case when muc <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from hinh)
  ) into v_out;
  return v_out;
end $function$;

-- ── (lệch kỹ thuật 2) Hạn 14 ngày tự chạy: trước chỉ chạy khi có người mở màn Xếp (lần gần nhất 10/11). Bản nền không cần phiên đăng nhập.
create or replace function public._btyeu_het_han_chay() returns integer
language plpgsql security definer set search_path to 'public' as $$
declare r record; v_dong int := 0;
begin
  if not pg_try_advisory_xact_lock(hashtext('btyeu_het_han_14_ngay')) then return 0; end if;
  for r in select y.id from bo_tro_yeu y
            where y.trang_thai = 'dang_xu' and y.created_at <= now() - interval '14 days'
              and not exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                               where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat')
            order by y.created_at limit 200 loop
    if public._btyeu_dong_case_het_han(r.id) then v_dong := v_dong + 1; end if;
  end loop;
  return v_dong;
end $$;
revoke all on function public._btyeu_het_han_chay() from public, anon, authenticated;

-- ── (câu 2) MỨC thuộc LƯỢT CHỐT TUẦN: em không còn case mở (ca khối / sau giờ) và không có đề xuất gửi / duyệt trong tuần ⇒ về L0
--    (L0 = không có dòng hs_level, §1.5). Lịch sử giữ ở hs_level_log.
create or replace function public._bt_muc_het_tuan() returns integer
language plpgsql security definer set search_path to 'public' as $$
declare v_dau timestamptz := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh'; v_n int;
begin
  with het as (
    select l.hoc_sinh_id, l.mon, l.level from hs_level l
     where l.loai = 'kien_thuc'
       and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = l.hoc_sinh_id and y.mon = l.mon and y.trang_thai in ('dang_xu', 'nhe_mo'))
       and not exists (select 1 from bo_tro_de_xuat d where d.hoc_sinh_id = l.hoc_sinh_id and d.mon = l.mon
                        and d.trang_thai in ('cho_duyet', 'da_duyet') and coalesce(d.duyet_at, d.gui_at, d.tao_at) >= v_dau)
  ), ghi as (
    insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
    select hoc_sinh_id, mon, 'kien_thuc', level, null, jsonb_build_object('nguon', 'het_tuan'), 0, 'Hết lượt chốt tuần — không còn case mở, không có lượt duyệt trong tuần', null from het
    returning hoc_sinh_id, mon
  )
  delete from hs_level l using ghi g where l.hoc_sinh_id = g.hoc_sinh_id and l.mon = g.mon and l.loai = 'kien_thuc';
  get diagnostics v_n = row_count;
  return v_n;
end $$;
revoke all on function public._bt_muc_het_tuan() from public, anon, authenticated;

-- đăng ký bộ điều phối (K4 — không cron riêng): mỗi ngày 1 lượt lúc 01h VN
insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu) values
  ('btyeu_het_han', 'Bổ trợ yếu: đóng case quá 14 ngày', 'public._btyeu_het_han_chay()', 1200, array[1], 30, 20, true, 'spec-bo-tro §12.2 mục 2 — trước chỉ chạy khi mở màn Xếp'),
  ('bt_muc_het_tuan', 'Bổ trợ: mức về L0 khi hết lượt chốt tuần', 'public._bt_muc_het_tuan()', 1200, array[1], 30, 10, true, 'spec-bo-tro §12.0 câu 2 (Thùy 17/11)')
on conflict (ma) do nothing;
