-- ============================================================================
-- 202611121723 — ta_cong_bo_tro_sau_gio
-- VÌ SAO (Thùy 12/11): "Việc bổ trợ Sau giờ là 1 task cần được đưa mặc định vào trong danh sách đầu việc cần chấm công".
--   · Loại việc mới 'bo_tro_sau_gio' (package, tính vào BỔ TRỢ theo giờ như yếu/bù/đuổi — Thùy 11/11: sau giờ là loại bổ trợ riêng).
--   · Đơn vị công = 1 CA sau giờ (cả lớp, ca_bo_tro_nhe), người được công = TA phụ trách ca (ca_bo_tro_nhe.ta_id).
--     Khoá tự nhiên = (TA, lớp, ngày, loại) — ca sau giờ 1 lớp 1 lần/tuần nên không trùng; KHÔNG thêm cột vào ta_cong_viec.
--   · fn_ta_hom_nay: ca sau giờ hôm nay của mình hiện sẵn trong "việc gợi ý" (1 chạm ghi công, giờ lấy từ ca).
--   · _ta_buoi_thieu_cong: ca sau giờ đã qua giờ kết thúc, chưa ai ghi công ⇒ vào danh sách thiếu công / bản tin việc tồn.
--   · _ta_doi_chieu: công 'bo_tro_sau_gio' khớp khi có ca sau giờ (không huỷ) của lớp đó ngày đó.
--   · fn_ta_khai_viec: ghi từ ca sau giờ có thật ⇒ nguon 'he_thong', giờ trống thì lấy giờ ca.
-- MẤT GÌ (Luật xoá): không — thêm 1 dòng ta_loai_viec + create or replace hàm.
-- ============================================================================
insert into ta_loai_viec (ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs, thu_tu)
values ('bo_tro_sau_gio', 'Bổ trợ sau giờ', 'package', 'bo_tro', 'gio', true, false, 36)
on conflict (ma) do nothing;

CREATE OR REPLACE FUNCTION public.fn_ta_hom_nay(p_at timestamp with time zone DEFAULT now())
 RETURNS TABLE(nguon text, loai_viec text, lop_id uuid, ten_lop text, buoi_hoc_id uuid, ca_bo_tro_id uuid, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, dang_dien_ra boolean, da_khai boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public.current_nhan_su_id();
        v_ngay date := (p_at at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (p_at at time zone 'Asia/Ho_Chi_Minh')::time;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query
  with k1 as (
    -- buổi thường của lớp mình TẠI NGÀY ĐÓ; buổi có kỳ thi ⇒ gợi ý trông thi
    select 'buoi_thuong'::text as nguon,
           case when exists (select 1 from ky_thi kt where kt.buoi_hoc_id = b.id) then 'trong_thi' else 'tro_giang' end::text as loai_viec,
           b.lop_id, l.ten_lop, b.id as buoi_hoc_id, null::uuid as ca_bo_tro_id, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b join lop l on l.id = b.lop_id
      join public._ta_tg_tai(v_ngay, null, v_ns) pc on pc.lop_id = b.lop_id
     where b.ngay = v_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
    union all
    -- ca trực bổ trợ khối đã xếp cho mình
    select 'ca_bo_tro', 'bo_tro_dinh_ki', null::uuid, concat_ws(' ', c.mon, c.khoi), null::uuid, c.id, c.gio_bat_dau, c.gio_ket_thuc
      from ca_bo_tro c
     where c.ngay = v_ngay and c.trang_thai = 'mo' and v_ns in (c.nhan_su_id, c.nhan_su_2_id)
    union all
    -- buổi bù / yếu / đuổi mình dạy
    select 'buoi_bo_tro',
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' when 'bo_tro_on_thi' then 'bo_tro_on_thi' else 'bo_tro_duoi' end,
           l.id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_on_thi') and b.trang_thai <> 'huy' and v_ns in (b.nguoi_day, b.nguoi_day_tg)
       and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and v_ns in (c.nhan_su_id, c.nhan_su_2_id))   -- ca yếu nằm trong ca trực của mình: ca trực đã bao
    union all
    -- Thùy 12/11: ca BỔ TRỢ SAU GIỜ mình phụ trách (1 ca = cả lớp)
    select 'ca_sau_gio', 'bo_tro_sau_gio', cn.lop_id, l.ten_lop, null::uuid, null::uuid, cn.gio_bat_dau, cn.gio_ket_thuc
      from ca_bo_tro_nhe cn join lop l on l.id = cn.lop_id
     where cn.ngay = v_ngay and cn.trang_thai <> 'huy' and cn.ta_id = v_ns
       and exists (select 1 from buoi_hoc bn where bn.ca_bo_tro_nhe_id = cn.id and bn.trang_thai <> 'huy')
  )
  select x.nguon, x.loai_viec, x.lop_id, x.ten_lop, x.buoi_hoc_id, x.ca_bo_tro_id, x.gio_bat_dau, x.gio_ket_thuc,
         (x.gio_bat_dau is not null and x.gio_ket_thuc is not null
            and v_gio between x.gio_bat_dau - interval '30 minutes' and x.gio_ket_thuc + interval '30 minutes'),
         exists (select 1 from ta_cong_viec cv where cv.nhan_su_id = v_ns and cv.trang_thai <> 'tu_choi'
                   and ((x.buoi_hoc_id is not null and cv.buoi_hoc_id = x.buoi_hoc_id and cv.loai_viec = x.loai_viec)
                     or (x.ca_bo_tro_id is not null and cv.ca_bo_tro_id = x.ca_bo_tro_id)
                     or (x.nguon = 'ca_sau_gio' and cv.loai_viec = x.loai_viec and cv.lop_id = x.lop_id and cv.ngay = v_ngay)))
    from k1 x
   order by x.gio_bat_dau nulls last;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_buoi_thieu_cong(p_tu date, p_den date)
 RETURNS TABLE(loai text, ngay date, lop_id uuid, ten text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, buoi_hoc_id uuid, ca_bo_tro_id uuid, nhan_su_id uuid, nguoi_phu_trach text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (now() at time zone 'Asia/Ho_Chi_Minh')::time;
        v_tu date := greatest(p_tu, public._ta_moc_cham_cong());
        v_den date := least(coalesce(p_den, p_tu), v_homnay);
begin
  return query
  select 'buoi'::text, b.ngay, b.lop_id, l.ten_lop, b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, ai.id, ai.ho_ten
    from buoi_hoc b join lop l on l.id = b.lop_id
    left join lateral (select n.id, n.ho_ten from public._ta_tg_tai(b.ngay, b.lop_id) t join nhan_su n on n.id = t.nhan_su_id
                        order by t.la_chinh desc, n.ho_ten limit 1) ai on true
   where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and (ai.id is null or not public._la_gv_kiem_ta(ai.id))   -- Thùy 15/10: GV kiêm TA không chấm công
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec
                      where cv.lop_id = b.lop_id and cv.ngay = b.ngay and lv.tinh_vao in ('tg', 'trong_thi') and cv.trang_thai <> 'tu_choi')
  union all
  select 'ca'::text, c.ngay, null::uuid, concat_ws(' ', 'Trực bổ trợ', c.mon, c.khoi), c.gio_bat_dau, c.gio_ket_thuc, null::uuid, c.id,
         c.nhan_su_id, (select n.ho_ten from nhan_su n where n.id = c.nhan_su_id)
    from ca_bo_tro c
   where c.trang_thai = 'mo' and c.ngay between v_tu and v_den and not public._la_gv_kiem_ta(c.nhan_su_id)
     and (c.ngay < v_homnay or c.gio_ket_thuc <= v_gio)
     and not exists (select 1 from ta_cong_viec cv
                      where cv.trang_thai <> 'tu_choi' and cv.ngay = c.ngay
                        and (cv.ca_bo_tro_id = c.id or (cv.loai_viec = 'bo_tro_dinh_ki' and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id))))
  union all
  -- Buổi bổ trợ TA đứng lớp đã diễn ra, có em có mặt, chưa ai ghi công; buổi nằm trong ca trực của chính người đó thì ca trực đã bao.
  select case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' when 'bo_tro_hinh' then 'bo_tro_yeu' when 'bo_tro_on_thi' then 'bo_tro_on_thi' else 'bo_tro_duoi' end,
         b.ngay, l.id, (case b.loai when 'bu' then 'Buổi bù' when 'bo_tro_yeu' then 'Bổ trợ yếu' when 'bo_tro_hinh' then 'Bổ trợ Hình' when 'bo_tro_on_thi' then 'Bổ trợ ôn thi' else 'Bổ trợ đuổi' end) || coalesce(' ' || l.ten_lop, ''),
         b.gio_bat_dau, b.gio_ket_thuc, b.id, null::uuid, n.id, n.ho_ten
    from buoi_hoc b
    join nhan_su n on n.id = coalesce(b.nguoi_day_tg, b.nguoi_day)
    left join lop l on l.id = public._ta_lop_cua_buoi(b.id)
   where b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_on_thi') and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
     and not public._la_gv_kiem_ta(n.id)
     and (b.ngay < v_homnay or b.gio_ket_thuc <= v_gio)
     and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat')
     and not exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and n.id in (c.nhan_su_id, c.nhan_su_2_id))
     and not exists (select 1 from ta_cong_viec cv where cv.buoi_hoc_id = b.id and cv.trang_thai <> 'tu_choi')
  union all
  -- Thùy 12/11: ca BỔ TRỢ SAU GIỜ đã qua giờ kết thúc, chưa ai ghi công (người phụ trách = TA của ca; chưa gán TA ⇒ trống)
  select 'bo_tro_sau_gio'::text, cn.ngay, cn.lop_id, 'Bổ trợ sau giờ ' || l.ten_lop, cn.gio_bat_dau, cn.gio_ket_thuc, null::uuid, null::uuid,
         cn.ta_id, (select n.ho_ten from nhan_su n where n.id = cn.ta_id)
    from ca_bo_tro_nhe cn join lop l on l.id = cn.lop_id
   where cn.trang_thai <> 'huy' and cn.ngay between v_tu and v_den
     and (cn.ta_id is null or not public._la_gv_kiem_ta(cn.ta_id))
     and (cn.ngay < v_homnay or cn.gio_ket_thuc <= v_gio)
     and exists (select 1 from buoi_hoc bn where bn.ca_bo_tro_nhe_id = cn.id and bn.trang_thai <> 'huy')
     and not exists (select 1 from ta_cong_viec cv where cv.loai_viec = 'bo_tro_sau_gio' and cv.lop_id = cn.lop_id and cv.ngay = cn.ngay and cv.trang_thai <> 'tu_choi')
   order by 2, 5 nulls last;
end $function$;

CREATE OR REPLACE FUNCTION public._ta_doi_chieu(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(loai_dong text, id uuid, cham_cong_id uuid, nhan_su_id uuid, ho_ten text, ngay date, vao_at timestamp with time zone, ra_at timestamp with time zone, vao_chot timestamp with time zone, ra_chot timestamp with time zone, quen_ra boolean, khai_bu boolean, nguon text, loai_viec text, ten_loai text, lop_id uuid, ten_lop text, gio_bat_dau time without time zone, gio_ket_thuc time without time zone, hoc_sinh text, ghi_chu text, khop boolean, co text[], lam_ho text, duyet text, ly_do_duyet text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
           case when lv.nhom = 'ngoai_package' and not exists (select 1 from ta_don_gia d where d.ma = 'gia_' || lv.ma and d.hieu_luc_tu <= cv.ngay and d.xoa_at is null) then 'chua_don_gia' end,
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
        when cv.loai_viec in ('bo_tro_bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_on_thi') then exists (
              select 1 from buoi_hoc b
               where b.ngay = cv.ngay and b.trang_thai <> 'huy'
                 and b.loai = any (case cv.loai_viec when 'bo_tro_bu' then array['bu'] when 'bo_tro_on_thi' then array['bo_tro_on_thi'] when 'bo_tro_yeu' then array['bo_tro_yeu', 'bo_tro_hinh'] else array['bo_tro_duoi'] end)
                 and (b.id = cv.buoi_hoc_id or b.nguoi_day = cv.nhan_su_id
                      or exists (select 1 from ca_bo_tro c where c.id = b.ca_bo_tro_id and cv.nhan_su_id in (c.nhan_su_id, c.nhan_su_2_id)))
                 and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'))
        when cv.loai_viec = 'bo_tro_sau_gio' then exists (select 1 from ca_bo_tro_nhe cn where cn.lop_id = cv.lop_id and cn.ngay = cv.ngay and cn.trang_thai <> 'huy'
                     and exists (select 1 from buoi_hoc bn where bn.ca_bo_tro_nhe_id = cn.id and bn.trang_thai <> 'huy'))
        when lv.tinh_vao = 'trong_thi' then exists (select 1 from buoi_hoc b join ky_thi kt on kt.buoi_hoc_id = b.id
                                              where b.lop_id = cv.lop_id and b.ngay = cv.ngay)
        else false end as khop) kq
   where cv.ngay between p_tu and v_den and (p_ns is null or cv.nhan_su_id = p_ns)
   order by 6, 5, 1, 18 nulls first;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ta_khai_viec(p_loai text, p_ngay date, p_lop uuid DEFAULT NULL::uuid, p_buoi uuid DEFAULT NULL::uuid, p_ca uuid DEFAULT NULL::uuid, p_bat time without time zone DEFAULT NULL::time without time zone, p_ket time without time zone DEFAULT NULL::time without time zone, p_hs text DEFAULT NULL::text, p_ghi_chu text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public.current_nhan_su_id(); v_cc uuid; v_id uuid; v_lop uuid := p_lop; v_buoi uuid := p_buoi;
        v_bat time := p_bat; v_ket time := p_ket; v_tinh text; v_sg boolean := false;
        v_homnay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
        v_het timestamptz := ((p_ngay + coalesce(p_ket, time '23:59'))::timestamp at time zone 'Asia/Ho_Chi_Minh');
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  if p_ngay > v_homnay then raise exception 'Không khai trước cho ngày chưa tới'; end if;
  if now() > v_het + interval '24 hours' and not public._ta_duoc_khai_bu(p_ngay) then
    raise exception 'Đã quá 24 giờ kể từ khi việc diễn ra — nhờ quản lý nhập hộ';
  end if;
  select id into v_cc from ta_cham_cong where nhan_su_id = v_ns and ngay = p_ngay and duyet <> 'tu_choi' order by vao_at desc limit 1;
  if v_cc is null then raise exception 'Chưa checkin ngày %', to_char(p_ngay, 'DD/MM'); end if;
  select tinh_vao into v_tinh from ta_loai_viec where ma = p_loai;
  if v_lop is null and v_buoi is not null then v_lop := public._ta_lop_cua_buoi(v_buoi); end if;
  if v_lop is null and p_loai = 'tro_giang' then
    select t.lop_id into v_lop from public._ta_tg_tai(p_ngay, null, v_ns) t order by t.la_chinh desc limit 1;
    if v_lop is null then
      raise exception 'Ngày % bạn chưa được phân công lớp nào — chọn đúng lớp đã trợ giảng', to_char(p_ngay, 'DD/MM');
    end if;
  end if;
  if v_buoi is null and v_tinh in ('tg', 'trong_thi') and v_lop is not null then
    select b.id, coalesce(v_bat, b.gio_bat_dau), coalesce(v_ket, b.gio_ket_thuc) into v_buoi, v_bat, v_ket
      from buoi_hoc b
     where b.lop_id = v_lop and b.ngay = p_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
     order by b.gio_bat_dau nulls last limit 1;
  end if;
  -- Thùy 12/11: ghi từ CA SAU GIỜ có thật của mình ⇒ do hệ thống gợi ý; giờ trống lấy giờ ca
  if p_loai = 'bo_tro_sau_gio' and v_lop is not null then
    select coalesce(v_bat, cn.gio_bat_dau), coalesce(v_ket, cn.gio_ket_thuc), true into v_bat, v_ket, v_sg
      from ca_bo_tro_nhe cn where cn.lop_id = v_lop and cn.ngay = p_ngay and cn.trang_thai <> 'huy' and cn.ta_id = v_ns limit 1;
  end if;
  begin
    insert into ta_cong_viec (nhan_su_id, cham_cong_id, ngay, loai_viec, lop_id, buoi_hoc_id, ca_bo_tro_id,
                              gio_bat_dau, gio_ket_thuc, hoc_sinh, ghi_chu, nguon, khai_bu, created_by)
    values (v_ns, v_cc, p_ngay, p_loai, v_lop, v_buoi, p_ca, v_bat, v_ket, p_hs, coalesce(p_ghi_chu, ''),
            case when v_buoi is not null or p_ca is not null or v_sg then 'he_thong' else 'tu_khai' end, p_ngay < v_homnay, v_ns)
    returning id into v_id;
  exception when unique_violation then
    raise exception 'Việc này đã ghi công rồi';
  end;
  return v_id;
end $function$;
