-- Làm TRỌN việc bỏ cụm khỏi bản đồ mới (Thùy 29/10: "sửa thì sửa đến cùng"). View bdm_cum_bai chỉ là bí danh của bảng cụm CŨ dai_cum_bai
-- (355 cụm toàn dạng T…, 0 dạng NDB có cụm) — là nguồn của cả họ lỗi "tên bảng cụm/tiền đề suy bằng chuỗi". Bỏ view; mọi chỗ còn tra nó phải tự bỏ cụm:
--   _btyeu_ca_cua_hs (đã có nhánh bdm / không-bảng-cụm từ mig 202610291649) · fn_ban_do_phieu_luu (đã có chốt to_regclass) · fn_btyeu_ca_ta (vá ở đây).
-- Không mất dữ liệu: view không chứa dữ liệu; bảng cụm cũ dai_cum_bai giữ nguyên.
CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_ta(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
  rd record; v_nh text; v_mot jsonb; v_cum_src text; v_khong_cum boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(b.mon); v_cautbl := public._kho_cau_tbl(b.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  select jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
           'level', (select level from hs_level where hoc_sinh_id = h.id and mon = b.mon and loai = 'kien_thuc'))
    into v_hs from hoc_sinh h where h.id = b.hoc_sinh_id;

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id
              and not (d.dong_at is not null and public._kho_ten_dang(b.mon, d.ma_dang) is null) -- Thùy 10/10: dạng đã xoá khỏi bản đồ (đã đóng) không hiện nữa
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(b.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(b.mon, v_nh); v_cautbl := public._kho_cau_tbl(b.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
    -- 29/10: bản đồ mới (bdm) KHÔNG có cụm; nhánh nào không có bảng cụm cũng vậy ⇒ không join (trước đây join view bdm_cum_bai của bảng cụm CŨ, giờ view đã bỏ)
    v_khong_cum := (v_nh = 'bdm' or to_regclass('public.' || quote_ident(v_cumtbl)) is null);
    v_cum_src := case when v_khong_cum
                      then '(select null::text as ma_cum, null::text as ten, null::int as thu_tu where false)' else format('%I', v_cumtbl) end;
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''), 'la_hinh_mh', $3,
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce(case when $4 then (select jsonb_build_array(jsonb_build_object('ma_cum', null, 'ten', 'Cả dạng', 'so_cau', sum(td.so_cau), 'so_dung', sum(td.so_dung), 'so_goi_y', sum(td.so_goi_y), 'cau_cuoi_at', max(td.cau_cuoi_at))) from td where td.ma_dang = d.ma_dang having count(*) > 0) end, (select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$s c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cum_src) into v_mot using p_buoi, rd.id, coalesce(v_nh = 'hinh_mo_hinh', false), v_khong_cum;
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  -- Test cuối ca: điểm theo dạng (đã nộp) — chấm ở DB, app chỉ hiện.
  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
           'theo_dang', coalesce((
             select jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'so_cau', x.n, 'so_dung', x.d))
             from (select btc.ma_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') d
                   from bai_test_cau btc left join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = bl.id
                   where btc.bai_test_id = bt.id group by btc.ma_dang) x), '[]'::jsonb))
    into v_test
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' limit 1;

  select jsonb_build_object('bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau,
           'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at)
    into v_retest
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'retest' limit 1;

  select jsonb_build_object('nhan_xet', g.nhan_xet, 'muc_ma', g.muc_ma) into v_dg
    from buoi_danh_gia g where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = b.hoc_sinh_id;

  return jsonb_build_object(
    'buoi_id', b.buoi_id, 'mon', b.mon, 'ngay', b.ngay, 'trang_thai', b.trang_thai, 'diem_danh', b.diem_danh,
    'buoi_hoc_hs_id', b.buoi_hoc_hs_id, 'nguoi_day_tg', b.nguoi_day_tg, 'danh_gia_xong_at', b.danh_gia_xong_at,
    'bo_tro_yeu_id', b.bo_tro_yeu_id, 'hs', v_hs, 'dangs', v_dangs, 'test', v_test, 'retest', v_retest, 'danh_gia', v_dg,
    'case_trang_thai', (select y.trang_thai from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'case_ket_qua', (select y.ket_qua from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'so_dang_con_day', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)),
    'so_lan_huy', (select count(*) from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id
                   where hh2.bo_tro_yeu_id = b.bo_tro_yeu_id and b2.trang_thai = 'huy'));
end $function$;

drop view public.bdm_cum_bai;
