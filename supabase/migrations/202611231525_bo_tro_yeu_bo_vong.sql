-- ============================================================================
-- 202611231525 — bo_tro_yeu_bo_vong
-- VÌ SAO (Thùy 23/11, nhìn thẻ "Đang bổ trợ · vòng 3"): "ko còn vòng gì nữa cả. Hệ thống bổ trợ mới 1 tuần được xếp 1 lần, không hết cũng chỉ 1 lần, không có trường hợp nào quay về chỗ cần xếp."
--   "Vòng" = 1 + số case đứng trước nối qua case_truoc_id (đếm bằng WITH RECURSIVE cho từng dòng) — khái niệm của thời "retest / mở case nối tiếp", không còn nghĩa trong luật 1 em · 1 lần xếp · 1 tuần.
--   Gỡ khỏi 3 hàm đọc: fn_btyeu_case_xep_lich, fn_btyeu_chi_tiet_case, _phong_hoi_cc_bo_tro_case (chỉ bỏ khoá 'vong' trong jsonb trả về; dựng lại từ định nghĩa ĐANG CHẠY).
--   Cột bo_tro_yeu.case_truoc_id GIỮ (lịch sử các case nối nhau) — chỉ không còn đếm ra "vòng".
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. Mất khoá 'vong' trong kết quả 3 hàm (client bỏ đọc trong cùng commit).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_btyeu_case_xep_lich(p_mon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_ht desc nulls first, x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, y.hoan_thanh_at as x_ht, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien, 'trang_thai', y.trang_thai,
      'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may, 'so_dang_bao_dong', dc.bao_dong,
      'so_dang_chua_day', dc.can_day,
      'giai_doan', case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh' when dc.can_day > 0 or not public._btyeu_retest_bat() then 'dang_bo_tro' when dc.cho_retest > 0 and public._btyeu_retest_bat() then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', bh.da_hoc, 'so_buoi_khong_dien_ra', bh.khong_dien_ra, 'khong_dien_ra_gan_nhat', bh.khong_dien_ra_gan_nhat,
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) filter (where public._btyeu_retest_bat()) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may,
             count(*) filter (where d.nguon = 'bao_dong' and d.day_at is null) as bao_dong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    join lateral (
      select count(*) filter (where b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null) as da_hoc,
             count(*) filter (where b.trang_thai = 'huy') as khong_dien_ra,
             max(b.ngay) filter (where b.trang_thai = 'huy') as khong_dien_ra_gan_nhat
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'
    ) bh on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where (p_mon is null or y.mon = p_mon) and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[])) and   -- 16/11: quyền môn
          (y.trang_thai = 'hoan_thanh' or (dc.tong > 0 and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 1))) -- Thùy 28/09: màn Xếp hiện L1/L2/L3, ẩn L0
  ) s
$function$
;

CREATE OR REPLACE FUNCTION public.fn_btyeu_chi_tiet_case(p_case uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then null else jsonb_build_object(
    'case', jsonb_build_object('id', y.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon, 'nguon', y.nguon, 'ly_do', y.ly_do,
              'trang_thai', y.trang_thai, 'uu_tien', y.uu_tien, 'created_at', y.created_at, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua, 'ghi_chu_dong', y.ghi_chu_dong,
              'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
              'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
              'mo_boi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = y.actor)),
    'dang', (select coalesce(jsonb_agg(jsonb_build_object(
               'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(y.mon, d.ma_dang), d.ma_dang), 'nguon', d.nguon, 'them_at', d.created_at,
               'diem_luc_mo', d.diem_luc_mo, 'so_lan_do_luc_mo', d.so_lan_do_luc_mo, 'day_at', d.day_at, 'retest_diem', d.retest_diem, 'retest_at', d.retest_at,
               'dat', d.dat, 'dong_at', d.dong_at,
               'tt', case when d.dong_at is not null then 'xong' when d.day_at is null then 'chua_day' when d.dat = false then 'day_lai' when public._btyeu_retest_bat() then 'cho_retest' else 'da_day' end
             ) order by d.dong_at nulls first, d.day_at nulls first, d.created_at), '[]'::jsonb) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id),
    'buoi', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'nguoi', ns.ho_ten,
               'trang_thai', b.trang_thai, 'ly_do_huy', b.ly_do_huy, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at, 'che_do', hh.btyeu_che_do,
               'ca_truc', b.ca_bo_tro_id is not null
             ) order by b.ngay desc, b.gio_bat_dau desc nulls last), '[]'::jsonb)
             from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
             where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'),
    'retest', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', t.ngay, 'so_cau', t.so_cau,
               'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'),
               'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = t.id and blc.verdict = 'correct')
             ) order by t.ngay desc), '[]'::jsonb)
             from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon
               and (public._btyeu_retest_bat() or exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'))
               and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
    'duyet', (select coalesce(jsonb_agg(jsonb_build_object(
               'at', g.created_at, 'level_cu', g.level_cu, 'level_may', g.level_may_de_xuat, 'level_chot', g.level_chot,
               'ly_do_may', g.ly_do_may -> 'lyDo', 'kenh', g.ly_do_may -> 'kenh', 'ly_do_nguoi', g.ly_do_nguoi,
               'nguoi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = g.actor)
             ) order by g.created_at desc), '[]'::jsonb)
             from hs_level_log g where g.hoc_sinh_id = y.hoc_sinh_id and g.mon = y.mon and g.loai = 'kien_thuc'
               and g.created_at >= y.created_at - interval '1 day' and (y.hoan_thanh_at is null or g.created_at <= y.hoan_thanh_at + interval '1 day'))
  ) end
  from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
  where y.id = p_case and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
$function$
;

CREATE OR REPLACE FUNCTION public._phong_hoi_cc_bo_tro_case(p jsonb, p_lop uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_loai text := lower(btrim(coalesce(p->>'loai', '')));
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'dang_xu'));
  v_khoi text := nullif(btrim(p->>'khoi'), '');
  v_hs text := nullif(public.fn_bo_dau(btrim(coalesce(p->>'ten_hoc_sinh', ''))), '');
  v_ten text[]; v_mon text[]; m text; v_ds jsonb := '[]'::jsonb; v jsonb;
  v_tu date; v_den date;
  c_tran constant int := 60;
begin
  if v_loai not in ('yeu', 'hinh', 'bu', 'duoi', 'nhe') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'loai phải là: yeu | hinh | bu | duoi | nhe.');
  end if;
  if v_tt not in ('dang_xu', 'hoan_thanh') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: dang_xu | hoan_thanh.');
  end if;
  select coalesce(array_agg(ten_lop), '{}') into v_ten from lop where id = any(p_lop);
  v_mon := public._phong_hoi_mon_cua_lop(p_lop);

  if v_loai = 'yeu' then
    foreach m in array v_mon loop
      v_ds := v_ds || coalesce((select jsonb_agg(x) from jsonb_array_elements(public.fn_btyeu_case_xep_lich(m)) x
                                 where x->>'trang_thai' = v_tt and public._phong_hoi_o_ok(x->>'mon', x->>'khoi', v_khoi)
                                   and (v_hs is null or public.fn_bo_dau(x->>'ho_ten') ilike '%' || v_hs || '%')), '[]'::jsonb);
    end loop;
    select jsonb_build_object(
      'loai', 'yeu', 'trang_thai', v_tt, 'so_case', jsonb_array_length(v_ds),
      'theo_giai_doan', (select coalesce(jsonb_object_agg(g.k, g.n), '{}'::jsonb) from (
          select x->>'giai_doan' as k, count(*)::int as n from jsonb_array_elements(v_ds) x group by 1) g),
      'theo_khoi', (select coalesce(jsonb_object_agg(g.k, g.n), '{}'::jsonb) from (
          select (x->>'mon') || ' ' || (x->>'khoi') as k, count(*)::int as n from jsonb_array_elements(v_ds) x group by 1) g),
      'so_case_chua_co_ca_cho_hoc', (select count(*) from jsonb_array_elements(v_ds) x
                                      where x->>'trang_thai' = 'dang_xu' and jsonb_typeof(x->'buoi_cho_hoc') is distinct from 'object'),
      'case', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select jsonb_build_object('ho_ten', x->>'ho_ten', 'ma_hs', x->>'ma_hs', 'mon', x->>'mon', 'khoi', x->>'khoi',
                   'uu_tien', (x->>'uu_tien')::int, 'nguon', x->>'nguon', 'giai_doan', x->>'giai_doan', 'level', x->'level', 'mo_ngay', ((x->>'created_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date,
                   'so_dang', x->'so_dang', 'so_dang_can_day', x->'so_dang_can_day', 'so_dang_cho_retest', x->'so_dang_cho_retest', 'so_dang_xong', x->'so_dang_xong',
                   'so_buoi_da_hoc', x->'so_buoi_da_hoc', 'so_buoi_khong_dien_ra', x->'so_buoi_khong_dien_ra',
                   'ca_cho_hoc', case when jsonb_typeof(x->'buoi_cho_hoc') = 'object' then jsonb_build_object(
                       'ngay', x->'buoi_cho_hoc'->>'ngay', 'gio', left(x->'buoi_cho_hoc'->>'gio_bat_dau', 5),
                       'ta_phu_trach', x->'buoi_cho_hoc'->>'nguoi_ten', 'qua_ngay', x->'buoi_cho_hoc'->'qua_ngay') end,
                   'retest_ngay', x->>'retest_ngay', 'ket_qua', x->>'ket_qua',
                   'dong_ngay', ((x->>'hoan_thanh_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date) as r
            from jsonb_array_elements(v_ds) x
           order by (x->>'uu_tien')::int desc nulls last, x->>'created_at' limit c_tran) z),
      'da_cat', jsonb_array_length(v_ds) > c_tran,
      'ghi_chu', jsonb_build_array(
        'Cùng nguồn màn Bổ trợ › Yếu (fn_btyeu_case_xep_lich). Case theo MÔN + khối của HS. uu_tien 3 = cao.',
        'giai_doan: dang_bo_tro (còn dạng cần dạy) · cho_retest / retest … (đã dạy, chờ retest) · hoan_thanh. ca_cho_hoc = ca đã xếp sắp tới (trống = CHƯA XẾP CA).',
        format('Danh sách "case" cắt ở %s, ưu tiên cao trước; số đếm đủ.', c_tran))) into v;

  elsif v_loai = 'hinh' then
    if not ('Toán' = any(v_mon)) then
      return jsonb_build_object('loai', 'hinh', 'thong_diep', 'Bổ trợ Hình chỉ có ở môn Toán — ngoài bộ môn của bạn.');
    end if;
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_ds
      from jsonb_array_elements(public.fn_bthinh_danh_sach(v_tt, 1000)->'ds') x
     where (x->>'lop' = any(v_ten) or (x->>'lop' is null and public._phong_hoi_o_ok('Toán', x->>'khoi', v_khoi)))
       and (v_khoi is null or x->>'khoi' = v_khoi)
       and (v_hs is null or public.fn_bo_dau(x->>'ho_ten') ilike '%' || v_hs || '%');
    select jsonb_build_object(
      'loai', 'hinh', 'trang_thai', v_tt, 'so_case', jsonb_array_length(v_ds),
      'theo_giai_doan', (select coalesce(jsonb_object_agg(g.k, g.n), '{}'::jsonb) from (
          select x->>'giai_doan' as k, count(*)::int as n from jsonb_array_elements(v_ds) x group by 1) g),
      'case', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select jsonb_build_object('ho_ten', x->>'ho_ten', 'khoi', x->>'khoi', 'lop', x->>'lop', 'muc', x->'muc', 'uu_tien', x->'uu_tien',
                   'giai_doan', x->>'giai_doan', 'so_buoi_da_hoc', x->'so_buoi_da_hoc', 'vong_tiep', x->'vong_tiep',
                   'mo_ngay', ((x->>'created_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date,
                   'ca_cho_hoc', case when jsonb_typeof(x->'buoi_cho') = 'object' then jsonb_build_object(
                       'ngay', x->'buoi_cho'->>'ngay', 'gio', left(x->'buoi_cho'->>'gio_bat_dau', 5), 'ta_phu_trach', x->'buoi_cho'->>'nguoi_day_ten') end,
                   'ket_qua', x->>'ket_qua') as r
            from jsonb_array_elements(v_ds) x limit c_tran) z),
      'da_cat', jsonb_array_length(v_ds) > c_tran,
      'ghi_chu', jsonb_build_array('Cùng nguồn màn Bổ trợ › Hình (fn_bthinh_danh_sach). giai_doan: can_xep (chưa xếp ca) · da_xep · hoan_thanh.')) into v;

  elsif v_loai = 'bu' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_ds
      from jsonb_array_elements(public.fn_bu_lan_nghi_can_xep()) x
     where x->>'lop' = any(v_ten) and (v_hs is null or public.fn_bo_dau(x->>'ho_ten') ilike '%' || v_hs || '%');
    select jsonb_build_object(
      'loai', 'bu', 'so_luot_can_xep', jsonb_array_length(v_ds),
      'theo_lop', (select coalesce(jsonb_object_agg(g.k, g.n), '{}'::jsonb) from (
          select x->>'lop' as k, count(*)::int as n from jsonb_array_elements(v_ds) x group by 1) g),
      'luot', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select jsonb_build_object('ho_ten', x->>'ho_ten', 'lop', x->>'lop', 'ngay_nghi', x->>'ngay',
                   'so_lan_da_xep', x->'soLanDaXep', 'ly_do_quay_lai', x->>'lyDoQuayLai') as r
            from jsonb_array_elements(v_ds) x order by x->>'ngay' limit c_tran) z),
      'da_cat', jsonb_array_length(v_ds) > c_tran,
      'ghi_chu', jsonb_build_array(
        'Cùng nguồn hàng đợi màn Bổ trợ › Bù (fn_bu_lan_nghi_can_xep): lượt nghỉ buổi thường CHƯA có buổi bù còn hiệu lực và chưa ghi "không bù".',
        'so_lan_da_xep > 0 = đã xếp mà trượt (buổi bù huỷ / em vắng buổi bù) — ly_do_quay_lai cho biết vì sao.',
        'Chỉ trả hàng đợi CẦN XẾP (trang_thai không áp dụng cho bù). Ca bù đã chạy xem bo_tro_tuan loai=bu.')) into v;

  elsif v_loai = 'duoi' then
    v := public._troly_cc_bo_tro(jsonb_build_object('loai', 'duoi', 'ten_hoc_sinh', p->>'ten_hoc_sinh', '_lop', to_jsonb(p_lop)));

  else  -- nhe
    v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
    v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 14);
    if v_den - v_tu > 62 then v_tu := v_den - 62; end if;
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_ds
      from jsonb_array_elements(public.fn_btnhe_ds(v_tu, v_den)) x where (x->>'lop_id')::uuid = any(p_lop);
    select jsonb_build_object(
      'loai', 'nhe', 'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den), 'so_ca', jsonb_array_length(v_ds),
      'theo_trang_thai', (select coalesce(jsonb_object_agg(g.k, g.n), '{}'::jsonb) from (
          select x->>'trang_thai' as k, count(*)::int as n from jsonb_array_elements(v_ds) x group by 1) g),
      'ca', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (
          select jsonb_build_object('ngay', x->>'ngay', 'gio', left(x->>'gio_bat_dau', 5), 'lop', x->>'ten_lop', 'kieu', x->>'kieu',
                   'trang_thai', x->>'trang_thai', 'ta', x->>'ta_ten', 'truong_khoi', x->>'truong_khoi_ten',
                   'hs', (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', h->>'ho_ten', 'diem_danh', h->>'diem_danh',
                            'co_test', h->'co_test', 'test_da_nop', h->'test_da_nop', 'ket_qua', h->>'ket_qua')), '[]'::jsonb)
                          from jsonb_array_elements(x->'hs') h)) as r
            from jsonb_array_elements(v_ds) x limit c_tran) z),
      'da_cat', jsonb_array_length(v_ds) > c_tran,
      'ghi_chu', jsonb_build_array('Cùng nguồn màn Bổ trợ nhẹ (fn_btnhe_ds): ca bổ trợ nhẹ trưởng khối tạo trong giờ lớp. Khoảng tối đa 62 ngày, mặc định 14 ngày.')) into v;
  end if;
  return v;
end $function$
;
