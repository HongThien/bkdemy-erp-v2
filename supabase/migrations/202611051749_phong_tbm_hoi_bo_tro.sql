-- ============================================================================
-- 202611051749 — phong_tbm_hoi_bo_tro
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 — "Trưởng bộ môn có quyền truy cập dữ liệu bổ trợ của môn đó". Màn Bổ trợ ở ERP
--   trưởng bộ môn đã mở được (lá botro · botroyeu · botro_duoi); còn thiếu ở Ô HỎI phòng trưởng bộ môn
--   (mig 202611051536). Thêm 3 công cụ, khoá theo môn y hệt 5 công cụ cũ (cửa fn_phong_hoi_goi ghi đè
--   phạm vi lớp; model không chọn được).
--
-- KHÔNG công thức mới (CLAUDE.md §2.0) — mỗi công cụ bọc hàm đọc của màn Bổ trợ, chỉ LỌC theo lớp/môn
--   của người hỏi, rút gọn cột, và đếm các dòng hàm đó đã phân loại sẵn:
--     bo_tro_tuan   → fn_bo_tro_dashboard_tuan (từng lượt + trạng thái tt do hàm gốc phân loại; ở đây chỉ
--                     đếm theo (loại, tt) — không suy "chốt/đã chạy" lại).
--     bo_tro_case   → yeu: fn_btyeu_case_xep_lich · hinh: fn_bthinh_danh_sach · bu: fn_bu_lan_nghi_can_xep
--                     · duoi: _troly_cc_bo_tro (vá thêm lọc `_lop`) · nhe: fn_btnhe_ds.
--     bo_tro_retest → fn_btyeu_retest_theo_doi.
--   Lọc: dòng có lớp ⇒ lớp thuộc phạm vi; dòng chỉ có (môn, khối HS) ⇒ _phong_trong_pham_vi(môn, khối).
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. fn_phong_hoi_danh_muc / fn_phong_hoi_goi thay thân (thêm 3 công cụ);
--   _troly_cc_bo_tro thay thân bằng bản y hệt + lọc `_lop` tuỳ chọn (chỉ thu hẹp, Trợ lý cũ không đổi).
-- ============================================================================

-- Môn của các lớp trong phạm vi (để gọi hàm bổ trợ nhận tham số môn).
create or replace function public._phong_hoi_mon_cua_lop(p_lop uuid[])
returns text[] language sql stable security definer set search_path to 'public' as $$
  select coalesce(array_agg(distinct l.mon), '{}') from lop l where l.id = any(p_lop)
$$;
revoke execute on function public._phong_hoi_mon_cua_lop(uuid[]) from public, anon, authenticated;

-- Dòng KHÔNG có lớp (case yếu / Hình theo môn + khối HS): trong phạm vi khi ô (môn, khối) thuộc người hỏi
-- và khối khớp bộ lọc khối (nếu có).
create or replace function public._phong_hoi_o_ok(p_mon text, p_khoi text, p_loc_khoi text)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select public._phong_trong_pham_vi(p_mon, p_khoi)
     and (public._phong_mon_cua_toi() is null or p_mon = any(public._phong_mon_cua_toi()))
     and (nullif(btrim(p_loc_khoi), '') is null or p_khoi = btrim(p_loc_khoi))
$$;
revoke execute on function public._phong_hoi_o_ok(text, text, text) from public, anon, authenticated;

-- ── 1. Bổ trợ theo TUẦN: ca đã chốt / đã chạy / vắng / không diễn ra / quá hạn, TA phụ trách ──
create or replace function public._phong_hoi_cc_bo_tro_tuan(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_ten text[]; v jsonb; d jsonb;
  v_den date := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_n int := greatest(1, least(coalesce(nullif(p->>'so_tuan', '')::int, 1), 8));
  v_loai text := nullif(btrim(p->>'loai'), '');
  c_tran constant int := 80;
begin
  if v_loai is not null and v_loai not in ('bo_tro_yeu', 'bu', 'bo_tro_duoi', 'bo_tro_hinh') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'loai phải là: bo_tro_yeu | bu | bo_tro_duoi | bo_tro_hinh (bỏ trống = mọi loại).');
  end if;
  select coalesce(array_agg(ten_lop), '{}') into v_ten from lop where id = any(p_lop);
  d := public.fn_bo_tro_dashboard_tuan(v_den, v_n);
  with t as (
    select (w->>'tu')::date as tu, (w->>'den')::date as den, (w->>'dang_chay')::boolean as dang_chay, w->'ds' as ds
      from jsonb_array_elements(d) w
  ),
  l as (
    select t.tu, r->>'loai' as loai, r->>'tt' as tt, (r->>'ngay')::date as ngay, left(r->>'gio_bat_dau', 5) as gio,
           r->>'ho_ten' as ho_ten, r->>'lop' as lop, r->>'nguoi' as ta_phu_trach, r->>'ly_do' as ly_do_huy
      from t, jsonb_array_elements(t.ds) r
     where r->>'lop' = any(v_ten) and (v_loai is null or r->>'loai' = v_loai)
  )
  select jsonb_build_object(
    'tuan', (select coalesce(jsonb_agg(jsonb_build_object(
        'tu', t.tu, 'den', t.den, 'dang_chay', t.dang_chay,
        'dem_theo_loai_va_tt', (select coalesce(jsonb_object_agg(g.loai, g.j), '{}'::jsonb) from (
            select x.loai, jsonb_object_agg(x.tt, x.n) as j
              from (select loai, tt, count(*)::int as n from l where l.tu = t.tu group by loai, tt) x group by x.loai) g)
      ) order by t.tu desc), '[]'::jsonb) from t),
    'theo_ta_phu_trach', (select coalesce(jsonb_agg(to_jsonb(g) order by g.so_luot desc), '[]'::jsonb) from (
        select coalesce(ta_phu_trach, '(chưa gán)') as ta_phu_trach, count(*)::int as so_luot,
               jsonb_object_agg(tt, n) as theo_tt
          from (select ta_phu_trach, tt, count(*)::int as n from l group by 1, 2) z group by 1) g),
    'luot_can_chu_y', (select coalesce(jsonb_agg(to_jsonb(r) order by r.ngay desc, r.gio), '[]'::jsonb) from (
        select loai, tt, ngay, gio, ho_ten, lop, ta_phu_trach, ly_do_huy from l
         where tt in ('qua_han', 'vang', 'khong_dien_ra', 'dang_do') order by ngay desc limit c_tran) r),
    'da_cat', (select count(*) > c_tran from l where tt in ('qua_han', 'vang', 'khong_dien_ra', 'dang_do')),
    'ghi_chu', jsonb_build_array(
      'Cùng nguồn màn Bổ trợ › Dashboard tuần (fn_bo_tro_dashboard_tuan). Mỗi lượt = 1 HS trong 1 ca bổ trợ (yếu · bù · đuổi · Hình) của tuần T2→CN.',
      'tt: hoan_tat (đã chạy, đã đóng) · dang_do (đã chạy, chưa đóng đánh giá) · vang (HS vắng) · khong_dien_ra (ca huỷ) · qua_han (ngày ca đã qua mà chưa ghi gì) · cho (chưa tới ngày) · go (OPS gỡ khỏi lịch — không tính là đã chốt).',
      'Chỉ lượt gắn được với LỚP thuộc bộ môn của bạn (lớp của buổi gốc / đợt đuổi / lớp đang học cùng môn). Ca bổ trợ nhẹ không nằm ở đây — hỏi bo_tro_case loai=nhe.',
      format('luot_can_chu_y (quá hạn · vắng · không diễn ra · chưa đóng) cắt ở %s dòng, mới nhất trước.', c_tran))
  ) into v;
  return v;
end $$;
revoke execute on function public._phong_hoi_cc_bo_tro_tuan(jsonb, uuid[]) from public, anon, authenticated;

-- ── 2. CASE bổ trợ: yếu · Hình · bù · đuổi · nhẹ ───────────────────────────
create or replace function public._phong_hoi_cc_bo_tro_case(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
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
                   'uu_tien', (x->>'uu_tien')::int, 'nguon', x->>'nguon', 'giai_doan', x->>'giai_doan', 'level', x->'level', 'vong', x->'vong',
                   'mo_ngay', ((x->>'created_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh')::date,
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
end $$;
revoke execute on function public._phong_hoi_cc_bo_tro_case(jsonb, uuid[]) from public, anon, authenticated;

-- ── 3. RETEST tồn ───────────────────────────────────────────────────────────
create or replace function public._phong_hoi_cc_bo_tro_retest(p jsonb, p_lop uuid[])
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_mon text[] := public._phong_hoi_mon_cua_lop(p_lop); m text; v_ds jsonb := '[]'::jsonb; v jsonb;
  v_khoi text := nullif(btrim(p->>'khoi'), '');
  v_so_ngay int := greatest(1, least(coalesce(nullif(p->>'so_ngay_da_nop', '')::int, 14), 60));
  c_tran constant int := 60;
begin
  foreach m in array v_mon loop
    v_ds := v_ds || coalesce((select jsonb_agg(x) from jsonb_array_elements(public.fn_btyeu_retest_theo_doi(m, v_so_ngay)) x
                               where ((x->>'lop_id')::uuid = any(p_lop) or (x->>'lop_id' is null and public._phong_hoi_o_ok(x->>'mon', x->>'khoi', v_khoi)))
                                 and (v_khoi is null or x->>'khoi' = v_khoi)), '[]'::jsonb);
  end loop;
  select jsonb_build_object(
    'so_bai', jsonb_array_length(v_ds),
    'so_chua_nop', (select count(*) from jsonb_array_elements(v_ds) x where not coalesce((x->>'da_nop')::boolean, false)),
    'so_qua_han_chua_nop', (select count(*) from jsonb_array_elements(v_ds) x where coalesce((x->>'qua_han')::boolean, false)),
    'bai', (select coalesce(jsonb_agg(r), '[]'::jsonb) from (
        select jsonb_build_object('ngay', x->>'ngay', 'ho_ten', x->>'ho_ten', 'khoi', x->>'khoi', 'lop', x->>'lop', 'mon', x->>'mon',
                 'ta_lop', x->>'ta_lop', 'ta_ca_bo_tro', x->>'ca_nguoi', 'da_nop', x->'da_nop', 'qua_han', x->'qua_han', 'tre_ngay', x->'tre_ngay',
                 'so_cau', x->'so_cau', 'so_dung', x->'so_dung') as r
          from jsonb_array_elements(v_ds) x
         order by coalesce((x->>'da_nop')::boolean, false), (x->>'tre_ngay')::int desc nulls last limit c_tran) z),
    'da_cat', jsonb_array_length(v_ds) > c_tran,
    'ghi_chu', jsonb_build_array(
      'Cùng nguồn màn Bổ trợ › Yếu › Retest (fn_btyeu_retest_theo_doi): bài retest CHƯA nộp + bài đã nộp trong so_ngay_da_nop ngày gần nhất.',
      'qua_han = ngày retest đã qua mà chưa nộp; tre_ngay = trễ bao nhiêu ngày. ta_lop = TA chính của lớp; ta_ca_bo_tro = người dạy ca bổ trợ trước retest.')
  ) into v;
  return v;
end $$;
revoke execute on function public._phong_hoi_cc_bo_tro_retest(jsonb, uuid[]) from public, anon, authenticated;

-- ── 4. Danh mục + cửa gọi: thêm 3 công cụ bổ trợ ──
CREATE OR REPLACE FUNCTION public.fn_phong_hoi_danh_muc()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mon text[];
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn hỏi được' using errcode = '42501'; end if;
  v_mon := public._phong_mon_cua_toi();
  return jsonb_build_object(
    'pham_vi', jsonb_build_object(
      'mon', coalesce(to_jsonb(v_mon), '"mọi môn"'::jsonb),
      'khoi', (select coalesce(jsonb_agg(distinct l.mon || ' ' || l.khoi), '[]'::jsonb) from lop l
                where l.id = any(public._phong_hoi_lop(null)) and l.trang_thai = 'dang_hoc')),
    'cong_cu', $cat$[
  {"name":"tro_giang",
   "mo_ta":"Danh sách TRỢ GIẢNG trong phạm vi bộ môn: lớp, khối, hiệu suất tháng đang chạy, số việc tuần này (đang làm/xong/trễ/quá hạn), gậy tháng. Dùng khi hỏi 'có những TA nào', 'ai hiệu suất thấp', 'ai đang trễ việc'.",
   "tham_so":{"type":"object","properties":{
     "khoi":{"type":"string","description":"Khối, vd 8 hoặc 5T. Bỏ trống = mọi khối trong phạm vi."}}}},
  {"name":"luong_tro_giang",
   "mo_ta":"LƯƠNG trợ giảng theo tháng (chỉ phần thuộc bộ môn của người hỏi): tiền theo lớp, bổ trợ (giờ + tiền), ngoài package, gross, tiền phạt, net; kỳ đã chốt hay tạm tính. Hỏi 1 TA thì có chi tiết từng lớp (sĩ số TB, bậc, tỉ lệ thời gian, tỉ lệ BTVN).",
   "tham_so":{"type":"object","properties":{
     "thang":{"type":"string","description":"YYYY-MM. Bỏ trống = tháng này."},
     "ten_tro_giang":{"type":"string","description":"Tên TA nguyên văn người dùng gõ. Bỏ trống = mọi TA."},
     "khoi":{"type":"string","description":"Khối. Bỏ trống = mọi khối."}}}},
  {"name":"cong_tro_giang",
   "mo_ta":"CÔNG & DUYỆT CÔNG của trợ giảng: ca checkin/checkout, việc đã ghi công, trạng thái duyệt (chờ/đã duyệt/từ chối), cờ mâu thuẫn (quên checkout, ngoài giờ, trùng giờ, buổi huỷ…), và buổi/ca bổ trợ đã diễn ra mà CHƯA ai ghi công.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = đầu tháng của den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_tro_giang":{"type":"string"},
     "trang_thai_duyet":{"type":"string","enum":["cho_duyet","da_duyet","tu_choi","co_co","tat_ca"],"description":"Lọc danh sách dòng. co_co = dòng có cờ. Bỏ trống = tat_ca."},
     "khoi":{"type":"string"}}}},
  {"name":"viec_van_hanh",
   "mo_ta":"Việc sau buổi học theo NGƯỜI (GV và trợ giảng): ai còn nợ khâu nào (đánh giá/nhận xét, chấm bài trên lớp, ET, BTVN, MT) của buổi nào, hạn, đã đóng đúng hạn/trễ. vai = tg là trợ giảng.",
   "tham_so":{"type":"object","properties":{
     "ten_nhan_vien":{"type":"string","description":"Bỏ trống = mọi người."},
     "ten_lop":{"type":"string"},
     "khoi":{"type":"string"},
     "tu_ngay":{"type":"string","description":"Ngày BUỔI HỌC, YYYY-MM-DD. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "trang_thai":{"type":"string","enum":["chua_xong","qua_han","da_xong","tat_ca"],"description":"Bỏ trống = chua_xong."}}}},
  {"name":"tinh_trang_buoi",
   "mo_ta":"DỮ LIỆU ĐÃ ĐIỀN của từng BUỔI HỌC: điểm danh (có mặt/vắng/chưa điểm danh), ET (có đề, đã đóng, bao nhiêu em có điểm), BTVN buổi trước đã nhập chưa, đánh giá + nhận xét, MT; buổi đóng mà không có dữ liệu; lớp có lịch mà chưa mở buổi.",
   "tham_so":{"type":"object","properties":{
     "tu_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = bằng den_ngay (hỏi 1 ngày)."},
     "den_ngay":{"type":"string","description":"YYYY-MM-DD. Bỏ trống = hôm nay."},
     "ten_lop":{"type":"string"},
     "khoi":{"type":"string"},
     "chi_buoi_co_van_de":{"type":"boolean","description":"true = chỉ buổi thiếu/đóng khống. Bỏ trống: ≤7 ngày liệt kê hết, dài hơn chỉ buổi có vấn đề."}}}},
  {"name":"bo_tro_tuan",
   "mo_ta":"BỔ TRỢ theo TUẦN (yếu · bù · đuổi · Hình): mỗi tuần đếm lượt HS theo trạng thái (đã chạy/đóng, chưa đóng, HS vắng, ca không diễn ra, quá hạn chưa ghi, chờ), theo TA phụ trách ca, và danh sách lượt cần chú ý. Dùng cho 'tuần này bổ trợ chạy thế nào', 'ca nào chưa đóng', 'TA nào phụ trách ca bổ trợ'.",
   "tham_so":{"type":"object","properties":{
     "den_ngay":{"type":"string","description":"YYYY-MM-DD, ngày bất kỳ trong tuần cuối cần xem. Bỏ trống = tuần này."},
     "so_tuan":{"type":"integer","description":"Số tuần lùi lại (1–8). Bỏ trống = 1."},
     "loai":{"type":"string","enum":["bo_tro_yeu","bu","bo_tro_duoi","bo_tro_hinh"],"description":"Bỏ trống = mọi loại."}}}},
  {"name":"bo_tro_case",
   "mo_ta":"CASE / HÀNG ĐỢI bổ trợ của bộ môn: yeu = case HS yếu (giai đoạn, số dạng cần dạy/chờ retest, ca sắp tới, CHƯA XẾP CA) · hinh = case bổ trợ Hình · bu = lượt nghỉ CẦN XẾP BÙ · duoi = đợt học đuổi · nhe = ca bổ trợ nhẹ trong giờ lớp.",
   "tham_so":{"type":"object","properties":{
     "loai":{"type":"string","enum":["yeu","hinh","bu","duoi","nhe"]},
     "trang_thai":{"type":"string","enum":["dang_xu","hoan_thanh"],"description":"Cho yeu/hinh. Bỏ trống = dang_xu (đang xử lý)."},
     "khoi":{"type":"string"},
     "ten_hoc_sinh":{"type":"string","description":"Lọc theo tên HS (không dấu cũng được)."},
     "tu_ngay":{"type":"string","description":"Chỉ cho nhe. Bỏ trống = 14 ngày trước den_ngay."},
     "den_ngay":{"type":"string","description":"Chỉ cho nhe. Bỏ trống = hôm nay."}},
     "required":["loai"]}},
  {"name":"bo_tro_retest",
   "mo_ta":"RETEST của bổ trợ yếu: bài retest chưa nộp (quá hạn bao nhiêu ngày) và bài đã nộp gần đây (số câu đúng), kèm TA lớp và người dạy ca bổ trợ.",
   "tham_so":{"type":"object","properties":{
     "khoi":{"type":"string"},
     "so_ngay_da_nop":{"type":"integer","description":"Lấy bài ĐÃ nộp trong bao nhiêu ngày gần nhất (1–60). Bỏ trống = 14."}}}}
]$cat$::jsonb);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_phong_hoi_goi(p_cong_cu text, p_tham_so jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare p jsonb := coalesce(p_tham_so, '{}'::jsonb); v_lop uuid[]; v jsonb;
begin
  -- Gác NGOÀI khối bắt lỗi: bị chặn quyền phải nổ, không nuốt thành "lỗi thực thi".
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn hỏi được' using errcode = '42501'; end if;
  if jsonb_typeof(p) <> 'object' then p := '{}'::jsonb; end if;
  v_lop := public._phong_hoi_lop(p->>'khoi');
  -- Phạm vi do DB đặt, model không chọn được: ghi đè `_lop` (kể cả model tự điền).
  p := (p - '_lop') || jsonb_build_object('_lop', to_jsonb(v_lop));
  begin
    if p_cong_cu in ('viec_van_hanh', 'tinh_trang_buoi', 'bo_tro_case') then
      perform set_config('troly.noi_bo', '1', true);   -- công cụ Trợ lý gác bằng troly_duoc_dung(); cửa này đã gác TBM
    end if;
    v := case p_cong_cu
      when 'tro_giang'       then public._phong_hoi_cc_tro_giang(p, v_lop)
      when 'luong_tro_giang' then public._phong_hoi_cc_luong(p, v_lop)
      when 'cong_tro_giang'  then public._phong_hoi_cc_cong(p, v_lop)
      when 'viec_van_hanh'   then public._troly_cc_viec_van_hanh(p)
      when 'tinh_trang_buoi' then public._troly_cc_tinh_trang_buoi(p - 'mon')
      when 'bo_tro_tuan'     then public._phong_hoi_cc_bo_tro_tuan(p, v_lop)
      when 'bo_tro_case'     then public._phong_hoi_cc_bo_tro_case(p, v_lop)
      when 'bo_tro_retest'   then public._phong_hoi_cc_bo_tro_retest(p, v_lop)
      else jsonb_build_object('loi', 'khong_co_cong_cu', 'thong_diep', format('Không có công cụ "%s".', p_cong_cu))
    end;
    perform set_config('troly.noi_bo', '', true);
    return v;
  exception when others then
    perform set_config('troly.noi_bo', '', true);
    return jsonb_build_object('loi', 'loi_thuc_thi', 'thong_diep', sqlerrm);
  end;
end $function$;

-- ── 5. Công cụ Trợ lý bo_tro nhận phạm vi lớp `_lop` (chỉ thu hẹp) ──
CREATE OR REPLACE FUNCTION public._troly_cc_bo_tro(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_pv uuid[] := case when jsonb_typeof(p->'_lop') = 'array' then array(select jsonb_array_elements_text(p->'_lop')::uuid) end;  -- phạm vi lớp nội bộ (Phòng TBM), chỉ thu hẹp
  v_loai text := lower(btrim(coalesce(p->>'loai', '')));
  v_hs jsonb; v_id uuid; v jsonb; v_tu date; c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_loai not in ('bu', 'duoi', 'yeu') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'Tham số loai phải là: bu | duoi | yeu.');
  end if;
  if nullif(btrim(p->>'ten_hoc_sinh'), '') is not null then
    v_hs := public._troly_chon_hs(p->>'ten_hoc_sinh', p->>'ten_lop');
    if v_hs ? 'loi' then return v_hs; end if;
    v_id := (v_hs->>'id')::uuid;
  end if;

  if v_loai = 'bu' then
    v_tu := public._troly_ngay(p->>'tu_ngay', public._troly_hom_nay() - 30);
    with t as (
      select hs.ho_ten, hs.ma_hs, l.ten_lop, b.ngay as ngay_vang, h.diem_danh,
             case when kb.id is not null then 'khong_bu:' || kb.loai
                  when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                                  and bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') then 'da_hoc_bu'
                  when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                                where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                                  and bb.trang_thai = 'mo') then 'da_xep_chua_hoc'
                  when exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id) then 'da_xep_nhung_truot'
                  else 'chua_xep' end as tinh_trang
      from buoi_hoc_hs h
      join buoi_hoc b on b.id = h.buoi_hoc_id and b.trang_thai <> 'huy' and b.loai = 'thuong'
      join lop l on l.id = b.lop_id
      join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
      left join bang_khong_bu kb on kb.buoi_hoc_hs_id = h.id
      where h.diem_danh in ('vang', 'vang_phep') and b.ngay >= v_tu
        and (v_id is null or hs.id = v_id)
        and (v_pv is null or b.lop_id = any(v_pv))
    )
    select jsonb_build_object(
      'loai', 'bu', 'tu_ngay', v_tu, 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_tinh_trang', (select coalesce(jsonb_object_agg(g.tinh_trang, g.n), '{}'::jsonb)
                                 from (select tinh_trang, count(*)::int as n from t group by 1) g),
      'luot', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select * from t where v_id is not null or tinh_trang in ('chua_xep', 'da_xep_nhung_truot', 'da_xep_chua_hoc')
          order by ngay_vang, ho_ten limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or tinh_trang in ('chua_xep', 'da_xep_nhung_truot', 'da_xep_chua_hoc')),
      'ghi_chu', jsonb_build_array(
        'Mỗi dòng = 1 lượt vắng buổi thường của HS đang học. da_xep_nhung_truot = đã xếp bù nhưng buổi bù bị huỷ hoặc em vắng buổi bù.',
        'Danh sách "luot" chỉ liệt kê lượt CÒN PHẢI XỬ (trừ khi hỏi riêng 1 em); tong_theo_tinh_trang thì đếm đủ mọi lượt.',
        'Hạn xếp bù 48h và hàng đợi chính thức xem ở màn Bổ trợ › Bù; cách phân loại ở đây giản lược hơn màn đó.')
    ) into v;

  elsif v_loai = 'duoi' then
    with t as (
      select hs.ho_ten, hs.ma_hs, l.ten_lop, d.trang_thai, d.ly_do, d.so_buoi_du_kien,
             (d.created_at at time zone 'Asia/Ho_Chi_Minh')::date as mo_ngay,
             (d.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date as hoan_thanh_ngay,
             (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy')::int as so_buoi_da_xep,
             (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and x.diem_danh = 'co_mat')::int as so_buoi_da_hoc,
             (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id)::int as so_dang,
             (select count(*) from bo_tro_duoi_dang x where x.bo_tro_duoi_id = d.id and x.day_at is not null)::int as so_dang_da_day
      from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
      where (v_id is null or hs.id = v_id)
        and (v_pv is null or d.lop_id = any(v_pv))
    )
    select jsonb_build_object(
      'loai', 'duoi', 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                                 from (select trang_thai, count(*)::int as n from t group by 1) g),
      'dot', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select t.*, case when t.trang_thai = 'can_duoi' then public._troly_hom_nay() - t.mo_ngay end as so_ngay_da_mo
          from t where v_id is not null or t.trang_thai = 'can_duoi'
          order by t.mo_ngay limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or trang_thai = 'can_duoi'),
      'ghi_chu', jsonb_build_array(
        'can_duoi = đợt đang mở. so_buoi_du_kien trống = chưa ai chốt kế hoạch nên chưa xếp lịch được.',
        'Danh sách "dot" chỉ liệt kê đợt ĐANG MỞ (trừ khi hỏi riêng 1 em).',
        'Hệ không lưu ai chịu trách nhiệm từng đợt.')
    ) into v;

  else
    with t as (
      select hs.ho_ten, hs.ma_hs, y.mon, l.ten_lop, y.trang_thai, y.muc, y.uu_tien, y.ket_qua, y.nguon, left(y.ly_do, 160) as ly_do,
             (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date as mo_ngay,
             (y.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date as hoan_thanh_ngay,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id)::int as so_dang,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.day_at is not null)::int as so_dang_da_day,
             (select count(*) from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.dat = true)::int as so_dang_dat,
             (select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', public._troly_ten_dang(x.ma_dang)->>'ten',
                        'da_day', x.day_at is not null, 'dat', x.dat) order by x.created_at), '[]'::jsonb)
                from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and v_id is not null) as cac_dang
      from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id left join lop l on l.id = y.lop_id
      where (v_id is null or hs.id = v_id)
        and (v_pv is null or y.lop_id = any(v_pv) or (y.lop_id is null and y.mon in (select lp.mon from lop lp where lp.id = any(v_pv))))
    )
    select jsonb_build_object(
      'loai', 'yeu', 'hoc_sinh', v_hs->>'ho_ten',
      'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                                 from (select trang_thai, count(*)::int as n from t group by 1) g),
      'tong_ket_qua_case_da_dong', (select coalesce(jsonb_object_agg(coalesce(g.ket_qua, '(chưa ghi)'), g.n), '{}'::jsonb)
                                 from (select ket_qua, count(*)::int as n from t where trang_thai = 'hoan_thanh' group by 1) g),
      'dang_xu_theo_mon', (select coalesce(jsonb_object_agg(g.mon, g.n), '{}'::jsonb)
                                 from (select mon, count(*)::int as n from t where trang_thai = 'dang_xu' group by 1) g),
      'case', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
          select t.*, case when t.trang_thai = 'dang_xu' then public._troly_hom_nay() - t.mo_ngay end as so_ngay_da_mo
          from t where v_id is not null or t.trang_thai = 'dang_xu'
          order by t.uu_tien desc, t.mo_ngay limit c_tran) r),
      'da_cat', (select count(*) > c_tran from t where v_id is not null or trang_thai = 'dang_xu'),
      'so_canh_bao_yeu_30_ngay', (select count(*) from canh_bao_yeu c
                                   where c.created_at > now() - interval '30 days' and (v_id is null or c.hoc_sinh_id = v_id)),
      'ghi_chu', jsonb_build_array(
        'dang_xu = case đang mở. Danh sách "case" chỉ liệt kê case ĐANG MỞ (trừ khi hỏi riêng 1 em), ưu tiên cao trước.',
        'Lịch ca bổ trợ, kết quả test cuối ca và retest xem ở màn Bổ trợ › Yếu — công cụ này chưa gồm.')
    ) into v;
  end if;
  return v;
end $function$;
