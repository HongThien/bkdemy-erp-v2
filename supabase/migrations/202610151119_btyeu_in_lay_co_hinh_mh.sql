-- Thùy 14/10 (bước 2 Hình mô hình): phiếu giấy cần biết câu nào là BÀI HÌNH MÔ HÌNH để in ô "Trình bày lời giải" (thay "Đáp số") và gấp gọn
-- lời giải mẫu ở màn nhập kết quả. Cờ do DB tính (_btyeu_la_hinh_mh), app không đoán từ tiền tố mã. Dựng từ bản ĐANG CHẠY.
CREATE OR REPLACE FUNCTION public.fn_btyeu_in_lay(p_bai_test uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t record; v_bd text; v_caus jsonb;
begin
  if not public.la_thanh_vien() then return null; end if;
  select bt.id, bt.loai, bt.mon, bt.ngay, bt.in_giay_at, bt.buoi_hoc_id, bt.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
         b.gio_bat_dau, b.gio_ket_thuc, b.phong, ns.ho_ten as nguoi_ten,
         exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') as da_nop
    into t
  from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id
  left join buoi_hoc b on b.id = bt.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
  where bt.id = p_bai_test and bt.loai in ('bo_tro', 'bo_tro_test');
  if t.id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(t.mon);
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', k.id, 'thu_tu', k.thu_tu, 'ma_cau', k.ma_cau, 'ma_dang', k.ma_dang, 'ten_dang', coalesce(bd.ten_dang, public._kho_ten_dang(%2$L, k.ma_dang), k.ma_dang),
      'la_hinh_mh', public._btyeu_la_hinh_mh(k.ma_dang), 'loai_cau', k.loai_cau, 'noi_dung', k.noi_dung, 'lua_chon', k.lua_chon, 'anh_de', k.anh_de, 'dap_an_key', k.dap_an_key, 'loi_giai', k.loi_giai,
      'chon', (select blc.dap_an_hs from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1),
      'verdict', (select blc.verdict from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1)
    ) order by k.thu_tu), '[]'::jsonb)
    from bai_test_cau k left join %1$I bd on bd.ma_dang = k.ma_dang where k.bai_test_id = $1
  $q$, v_bd, t.mon) into v_caus using p_bai_test;
  return jsonb_build_object('bai_test_id', t.id, 'loai', t.loai, 'da_nop', t.da_nop, 'mon', t.mon, 'ngay', t.ngay, 'in_giay_at', t.in_giay_at, 'buoi_id', t.buoi_hoc_id,
    'hs', jsonb_build_object('id', t.hoc_sinh_id, 'ho_ten', t.ho_ten, 'ma_hs', t.ma_hs, 'khoi', t.khoi),
    'gio_bat_dau', t.gio_bat_dau, 'gio_ket_thuc', t.gio_ket_thuc, 'phong', t.phong, 'nguoi_ten', t.nguoi_ten, 'caus', v_caus);
end $function$;
