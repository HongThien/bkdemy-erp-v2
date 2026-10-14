-- ============================================================================
-- 202610141240 — ta_cong_cua_toi
-- ----------------------------------------------------------------------------
-- VÌ SAO: app TA (màn Chấm công · Bảng công) cần cùng thông tin như màn duyệt của Trang: việc nào "đã khớp" ERP,
--   cờ gì, làm hộ ai, trạng thái duyệt + lý do. fn_ta_doi_chieu chỉ cho người có ta_cong_duyet. Không chép công
--   thức sang hàm thứ hai (CLAUDE.md §2.0: một công thức một nơi) ⇒ tách thân thành _ta_doi_chieu(p_tu, p_den, p_ns):
--     · fn_ta_doi_chieu   = cổng quyền duyệt + _ta_doi_chieu(…, NULL)        (mọi TA)
--     · fn_ta_cong_cua_toi = TA đang đăng nhập + _ta_doi_chieu(…, chính mình)
--   Thêm fn_ta_khai_bu_cho_phep(): những ngày TA tự khai bù được LÚC NÀY (24 giờ + đợt mở) — app không tự suy luật.
-- MẤT GÌ: không. Thay thân fn_ta_doi_chieu (giữ chữ ký), thêm 3 hàm.
-- ============================================================================

create or replace function _ta_doi_chieu(p_tu date, p_den date, p_ns uuid)
returns table(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date,
              vao_at timestamptz, ra_at timestamptz, vao_chot timestamptz, ra_chot timestamptz, quen_ra boolean,
              khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text,
              gio_bat_dau time, gio_ket_thuc time, hoc_sinh text, ghi_chu text,
              khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare v_den date := coalesce(p_den, p_tu);
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  return query
  -- CA CÓ MẶT
  select 'ca'::text, cc.id, cc.id, cc.nhan_su_id, ns.ho_ten, cc.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         (cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay),
         cc.khai_bu, cc.nguon, null::text, null::text, null::uuid, null::text, null::time, null::time, null::text, ''::text,
         null::boolean,
         array_remove(array[
           case when cc.ra_at is null and cc.ra_chot is null and cc.ngay < v_homnay then 'quen_ra' end,
           case when cc.khai_bu then 'khai_bu' end,
           case when cc.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when not exists (select 1 from ta_cong_viec v where v.cham_cong_id = cc.id and v.trang_thai <> 'tu_choi') then 'ca_khong_viec' end
         ], null),
         null::text, cc.duyet, cc.ly_do_duyet
    from ta_cham_cong cc join nhan_su ns on ns.id = cc.nhan_su_id
   where cc.ngay between p_tu and v_den and (p_ns is null or cc.nhan_su_id = p_ns)
  union all
  -- VIỆC
  select 'viec'::text, cv.id, cv.cham_cong_id, cv.nhan_su_id, ns.ho_ten, cv.ngay, cc.vao_at, cc.ra_at, cc.vao_chot, cc.ra_chot,
         false, cv.khai_bu, cv.nguon, cv.loai_viec, lv.ten, cv.lop_id, l.ten_lop, cv.gio_bat_dau, cv.gio_ket_thuc, cv.hoc_sinh, cv.ghi_chu,
         kq.khop,
         array_remove(array[
           case when lv.tinh_vao = 'tg' and not kq.khop and exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong' and b.trang_thai = 'huy') then 'buoi_huy' end,
           case when lv.tinh_vao = 'tg' and not exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                        and b.loai = 'thuong') then 'khong_co_buoi' end,
           case when lv.tinh_vao = 'tg' and exists (select 1 from ta_cong_viec o join ta_loai_viec lo on lo.ma = o.loai_viec
                        where o.lop_id = cv.lop_id and o.ngay = cv.ngay and lo.tinh_vao = 'tg' and o.trang_thai <> 'tu_choi'
                          and o.nhan_su_id <> cv.nhan_su_id) then 'hai_ta_cung_buoi' end,
           case when cc.id is not null and cv.gio_bat_dau is not null
                     and cv.gio_bat_dau < (coalesce(cc.vao_chot, cc.vao_at) at time zone 'Asia/Ho_Chi_Minh')::time - interval '15 minutes' then 'truoc_gio_vao' end,
           case when cc.id is not null and cv.gio_ket_thuc is not null and coalesce(cc.ra_chot, cc.ra_at) is not null
                     and cv.gio_ket_thuc > (coalesce(cc.ra_chot, cc.ra_at) at time zone 'Asia/Ho_Chi_Minh')::time + interval '15 minutes' then 'sau_gio_ra' end,
           case when cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null and exists (select 1 from ta_cong_viec o
                        where o.nhan_su_id = cv.nhan_su_id and o.ngay = cv.ngay and o.id <> cv.id and o.trang_thai <> 'tu_choi'
                          and o.gio_bat_dau < cv.gio_ket_thuc and o.gio_ket_thuc > cv.gio_bat_dau) then 'trung_gio' end,
           case when cv.gio_bat_dau < time '07:00' or cv.gio_ket_thuc > time '22:30' then 'ngoai_gio' end,
           case when lv.don_vi = 'gio' and (cv.gio_bat_dau is null or cv.gio_ket_thuc is null) then 'thieu_gio' end,
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay) then 'chua_don_gia' end,
           case when cv.khai_bu then 'khai_bu' end,
           case when cv.nguon = 'nhap_ho' then 'nhap_ho' end,
           case when cc.id is not null and cc.duyet = 'tu_choi' then 'ca_bi_tu_choi' end,
           -- trợ giảng ở lớp mà NGÀY ĐÓ chưa có TA nào được phân công
           case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                     and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id)) then 'lop_chua_co_ta' end
         ], null),
         case when lv.tinh_vao = 'tg' and cv.lop_id is not null
                   and not exists (select 1 from public._ta_tg_tai(cv.ngay, cv.lop_id, cv.nhan_su_id))
                then (select n2.ho_ten from public._ta_tg_tai(cv.ngay, cv.lop_id) t join nhan_su n2 on n2.id = t.nhan_su_id
                       order by t.la_chinh desc, n2.ho_ten limit 1)
              when cv.ca_bo_tro_id is not null and not exists (select 1 from ca_bo_tro c where c.id = cv.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))
                then (select n2.ho_ten from ca_bo_tro c join nhan_su n2 on n2.id = c.nhan_su_id where c.id = cv.ca_bo_tro_id)
         end,
         cv.trang_thai, cv.ly_do_duyet
    from ta_cong_viec cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    join nhan_su ns on ns.id = cv.nhan_su_id
    left join lop l on l.id = cv.lop_id
    left join ta_cham_cong cc on cc.id = cv.cham_cong_id
    cross join lateral (select case
        when lv.tinh_vao = 'tg' then exists (select 1 from buoi_hoc b where b.lop_id = cv.lop_id and b.ngay = cv.ngay
                                              and b.loai = 'thuong' and b.trang_thai <> 'huy')
        when cv.loai_viec = 'bo_tro_dinh_ki' then exists (select 1 from ca_bo_tro c where c.ngay = cv.ngay and c.trang_thai = 'mo'
                                              and (c.id = cv.ca_bo_tro_id or cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = case cv.loai_viec when 'bo_tro_bu' then 'bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den and (p_ns is null or cv.nhan_su_id = p_ns)
   order by 6, 5, 1, 18 nulls first;
end $$;

create or replace function fn_ta_doi_chieu(p_tu date, p_den date default null)
returns table(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date,
              vao_at timestamptz, ra_at timestamptz, vao_chot timestamptz, ra_chot timestamptz, quen_ra boolean,
              khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text,
              gio_bat_dau time, gio_ket_thuc time, hoc_sinh text, ghi_chu text,
              khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('ta_cong_duyet') then raise exception 'Không có quyền xem đối chiếu công'; end if;
  return query select * from public._ta_doi_chieu(p_tu, p_den, null);
end $$;

-- Công của TA đang đăng nhập (ca + việc, kèm đối chiếu) — app TA: màn hôm nay + Bảng công.
create or replace function fn_ta_cong_cua_toi(p_tu date, p_den date default null)
returns table(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date,
              vao_at timestamptz, ra_at timestamptz, vao_chot timestamptz, ra_chot timestamptz, quen_ra boolean,
              khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text,
              gio_bat_dau time, gio_ket_thuc time, hoc_sinh text, ghi_chu text,
              khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id();
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query select * from public._ta_doi_chieu(p_tu, p_den, v_ns);
end $$;

-- Khoảng ngày TA tự khai bù được LÚC NÀY: hôm qua–hôm nay (luật 24 giờ, hàm ghi còn soát giờ chính xác) ∪ đợt mở.
create or replace function fn_ta_khai_bu_cho_phep()
returns table(tu date, den date, han timestamptz, ghi_chu text)
language sql stable security definer set search_path = public as $$
  select ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1), (now() at time zone 'Asia/Ho_Chi_Minh')::date, null::timestamptz, 'Trong 24 giờ'::text
  union all
  select d.tu, least(d.den, (now() at time zone 'Asia/Ho_Chi_Minh')::date), d.han, d.ghi_chu
    from ta_dot_khai_bu d
   where now() <= d.han and d.tu <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
$$;

revoke execute on function _ta_doi_chieu(date, date, uuid) from public, anon, authenticated;
revoke execute on function fn_ta_cong_cua_toi(date, date), fn_ta_khai_bu_cho_phep() from public, anon;
grant execute on function fn_ta_cong_cua_toi(date, date), fn_ta_khai_bu_cho_phep() to authenticated;
