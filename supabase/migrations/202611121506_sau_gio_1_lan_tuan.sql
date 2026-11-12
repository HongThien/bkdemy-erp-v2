-- ============================================================================
-- 202611121506 — sau_gio_1_lan_tuan
-- VÌ SAO (Thùy 12/11): "1 tuần chỉ bổ trợ sau giờ 1 lần, nên lớp nào đã khởi tạo rồi thì biến mất khỏi danh sách cần khởi tạo".
--   · Em: chờ khởi tạo khi đề xuất MỚI NHẤT còn là L1 đã duyệt, chưa có ca sau giờ (không huỷ) từ thứ Hai tuần này, không còn case mở
--     (_btnhe_da_co_tuan). Tuần sau em còn L1 thì lại vào hàng chờ (mỗi tuần 1 lần). Ca huỷ không tính.
--   · Lớp: có ca sau giờ (không huỷ) ngày ≥ thứ Hai tuần này ⇒ rời "Chờ khởi tạo" (fn_btnhe_cho · fn_btnhe_lop_cho).
--   · Khởi tạo (fn_btnhe_tao): mỗi em tối đa 1 ca sau giờ / tuần (trước 2).
-- MẤT GÌ (Luật xoá): không mất gì — thêm 2 hàm nhỏ, create or replace 4 hàm.
-- ============================================================================

-- thứ Hai tuần này (giờ VN)
create or replace function public._btnhe_dau_tuan() returns date language sql stable as $$
  select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date
$$;
-- em đã có bổ trợ sau giờ TUẦN NÀY (ca không huỷ, ngày ≥ thứ Hai này) hoặc còn case sau giờ đang mở ⇒ không chờ khởi tạo
create or replace function public._btnhe_da_co_tuan(p_hs uuid, p_mon text)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
                  where hh.hoc_sinh_id = p_hs and cn.mon = p_mon and b.loai = 'bo_tro_nhe' and cn.trang_thai <> 'huy' and b.trang_thai <> 'huy'
                    and b.ngay >= public._btnhe_dau_tuan())
      or exists (select 1 from bo_tro_yeu y join buoi_hoc_hs hh on hh.bo_tro_yeu_id = y.id join buoi_hoc b on b.id = hh.buoi_hoc_id
                   join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
                  where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.nguon = 'nhe' and y.trang_thai = 'nhe_mo' and cn.trang_thai <> 'huy')
$$;
revoke execute on function public._btnhe_da_co_tuan(uuid, text) from public, anon;

CREATE OR REPLACE FUNCTION public.fn_btnhe_cho()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
      'de_xuat_id', d.id, 'hoc_sinh_id', d.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'mon', d.mon, 'khoi', d.khoi,
      'lop_id', d.lop_id, 'ten_lop', l.ten_lop, 'nhom', d.nhom, 'uu_tien', d.uu_tien, 'ghi_chu', d.ghi_chu, 'duyet_at', d.duyet_at,
      'so_dang', (select count(*) from public._sau_gio_dang(d.hoc_sinh_id, d.mon)))
    order by d.mon, d.khoi, l.ten_lop, h.ho_ten), '[]'::jsonb)
    from bo_tro_de_xuat d join hoc_sinh h on h.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
   where d.trang_thai = 'da_duyet' and d.muc = 1 and public.la_thanh_vien() and not exists (select 1 from ca_bo_tro_nhe cx where cx.lop_id = d.lop_id and cx.trang_thai <> 'huy' and cx.ngay >= public._btnhe_dau_tuan())   /* 12/11: lớp đã khởi tạo tuần này ⇒ rời danh sách */
     and d.id = (select d2.id from bo_tro_de_xuat d2 where d2.hoc_sinh_id = d.hoc_sinh_id and d2.mon = d.mon order by d2.tao_at desc limit 1)   /* đề xuất MỚI NHẤT còn là L1 */ and public._btnhe_duoc_tao(d.mon, d.khoi)
     and not public._btnhe_da_co_tuan(d.hoc_sinh_id, d.mon)   /* 12/11: 1 tuần 1 lần */
$function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_lop_cho()
 RETURNS TABLE(lop_id uuid, ten_lop text, mon text, khoi text, so_em integer, so_cho integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dx as (
    select distinct on (d.hoc_sinh_id, d.mon) d.*
      from bo_tro_de_xuat d order by d.hoc_sinh_id, d.mon, d.tao_at desc
  ),
  em as (
    select l.id as lop_id, l.ten_lop, l.mon, l.khoi, dx.hoc_sinh_id,
           not public._btnhe_da_co_tuan(dx.hoc_sinh_id, dx.mon)   /* 12/11: 1 tuần 1 lần */ as cho
      from dx join hoc_sinh_lop hl on hl.hoc_sinh_id = dx.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
      join lop l on l.id = hl.lop_id and l.mon = dx.mon and l.trang_thai = 'dang_hoc'
     where dx.trang_thai = 'da_duyet' and dx.muc = 1 and public.la_thanh_vien() and public._btnhe_duoc_tao(l.mon, l.khoi)
       and not exists (select 1 from ca_bo_tro_nhe cx where cx.lop_id = l.id and cx.trang_thai <> 'huy' and cx.ngay >= public._btnhe_dau_tuan())   /* 12/11: lớp đã khởi tạo tuần này ⇒ rời danh sách */
  )
  select lop_id, ten_lop, mon, khoi, count(*)::int, count(*) filter (where cho)::int
    from em group by lop_id, ten_lop, mon, khoi
   order by mon, khoi, ten_lop
$function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_hs_duyet(p_lop uuid)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, cho boolean, duyet_at timestamp with time zone, so_ca_tuan integer, so_dang integer, nhom jsonb, ghi_chu text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare l record; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.'; end if;
  if not public.la_thanh_vien() or not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  with dx as (
    select distinct on (d.hoc_sinh_id) d.*
      from bo_tro_de_xuat d
      join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
     where d.mon = l.mon
     order by d.hoc_sinh_id, d.tao_at desc
  )
  select h.id, h.ho_ten, h.ma_hs,
         not public._btnhe_da_co_tuan(h.id, l.mon)   /* 12/11: 1 tuần 1 lần */,
         dx.duyet_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         (select count(*)::int from public._sau_gio_dang(h.id, l.mon)),
         dx.nhom, dx.ghi_chu
    from dx join hoc_sinh h on h.id = dx.hoc_sinh_id
   where dx.trang_thai = 'da_duyet' and dx.muc = 1
   order by h.ho_ten;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_tao(p_lop uuid, p_kieu text, p_ngay date, p_gio_bat_dau time without time zone, p_phut integer, p_phong text, p_hs uuid[], p_ta uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare l record; v_me uuid := public.current_nhan_su_id(); v_ca uuid; v_kt time; v_tuan date := date_trunc('week', p_ngay)::date;
  v_hs uuid; v_case uuid; v_buoi uuid; v_ten text; v_n int; v_khong text[] := '{}'; v_trung int := 0; v_trung_ds jsonb := '[]'::jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into l from lop where id = p_lop and trang_thai = 'dang_hoc';
  if l.id is null then raise exception 'Không thấy lớp đang học.'; end if;
  if not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Chỉ trưởng khối % · % (hoặc Quản lý chất lượng) tạo được ca Nhẹ cho lớp này.', l.mon, l.khoi; end if;
  if p_kieu not in ('sau_buoi', 'khac') then raise exception 'Loại thời gian phải là sau_buoi | khac.'; end if;
  if p_ngay is null or p_gio_bat_dau is null then raise exception 'Thiếu ngày/giờ.'; end if;
  if coalesce(p_phut, 0) < 10 or p_phut > 90 then raise exception 'Thời lượng 10–90 phút.'; end if;
  if coalesce(cardinality(p_hs), 0) = 0 then raise exception 'Chưa chọn học sinh.'; end if;
  if p_ta is not null and not exists (select 1 from nhan_su where id = p_ta) then raise exception 'TA không hợp lệ.'; end if;
  v_kt := p_gio_bat_dau + make_interval(mins => p_phut);
  if v_kt <= p_gio_bat_dau then raise exception 'Ca vắt qua nửa đêm.'; end if;

  foreach v_hs in array p_hs loop
    select h.ho_ten into v_ten from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
     where hl.lop_id = p_lop and hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc';
    if v_ten is null then raise exception 'Có học sinh không thuộc lớp %.', l.ten_lop; end if;
    select count(*) into v_n from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
     where x.hoc_sinh_id = v_hs and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7;
    if v_n >= 1 then raise exception '% đã có ca sau giờ tuần này — mỗi em 1 lần/tuần.', v_ten; end if;   -- Thùy 12/11 (trước: 2 ca/tuần)
  end loop;

  -- Trùng phòng: CẢNH BÁO, không chặn (spec §8.2) — đếm trên lịch phòng chung, TRƯỚC khi ghi ca này
  if nullif(trim(coalesce(p_phong, '')), '') is not null then
    select count(*), coalesce(jsonb_agg(jsonb_build_object('tieu_de', x.tieu_de, 'gio_bat_dau', to_char(x.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(x.gio_ket_thuc, 'HH24:MI'), 'nguon', x.nguon) order by x.gio_bat_dau), '[]'::jsonb)
      into v_trung, v_trung_ds
      from public.fn_phong_kiem_trung(trim(p_phong), p_ngay, p_gio_bat_dau, v_kt) x;
  end if;

  insert into ca_bo_tro_nhe (lop_id, mon, khoi, kieu, ngay, gio_bat_dau, gio_ket_thuc, phong, truong_khoi_id, ta_id, created_by)
    values (p_lop, l.mon, l.khoi, p_kieu, p_ngay, p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''), v_me, p_ta, public.jwt_uid())
    returning id into v_ca;

  foreach v_hs in array p_hs loop
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, trang_thai, muc, uu_tien)
      values (v_hs, p_lop, l.mon, 'nhe', 'Bổ trợ Nhẹ ' || to_char(p_ngay, 'DD/MM'), 'nhe_mo', 1, 2)
      returning id into v_case;
    if public.fn_btnhe_fill_dang(v_case) = 0 then -- 11/11: dạng sau giờ = nhóm yếu trước (_sau_gio_dang)
      v_khong := v_khong || (select ho_ten from hoc_sinh where id = v_hs);
    end if;
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_nhe_id)
      values ('bo_tro_nhe', null, p_ngay, public._thu_cua_ngay(p_ngay), p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''),
              v_me, 'mo', public.jwt_uid(), v_ca)
      returning id into v_buoi;
    insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_yeu_id) values (v_buoi, v_hs, v_case);
  end loop;

  return jsonb_build_object('ca_id', v_ca, 'so_hs', cardinality(p_hs), 'em_khong_dang', to_jsonb(v_khong), 'trung_phong', v_trung, 'trung_ds', v_trung_ds);
end
$function$;
