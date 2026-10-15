-- Bổ trợ Đuổi thống nhất (mig 202610151204): danh sách dạng của đợt xếp theo lúc TẠO nên dạng độ khó 3 nằm lẫn giữa dạng độ khó 2 — người đọc thấy
-- "dạng liền trước đã xong mà dạng này vẫn khoá" (thật ra khoá theo thứ tự độ khó). Sửa: xếp theo thứ tự khoá. Dựng từ bản ĐANG CHẠY.
CREATE OR REPLACE FUNCTION public.fn_duoi_tien_trinh(p_hoc_sinh uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid; r record; d record; v_out jsonb := '[]'::jsonb; v_dangs jsonb; v_buoi jsonb; v_path jsonb;
  v_nh text; v_bd text; v_cd text; v_tcd text; v_md smallint; v_item jsonb; v_tt text; v_mo boolean;
begin
  if p_hoc_sinh is null then v_hs := public.my_hoc_sinh_id();
  else
    if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
    v_hs := p_hoc_sinh;
  end if;
  if v_hs is null then return '[]'::jsonb; end if;

  for r in select bd.id, bd.so_buoi_du_kien, bd.created_at, l.mon, l.ten_lop
           from bo_tro_duoi bd join lop l on l.id = bd.lop_id
           where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi' order by bd.created_at loop
    v_path := public._duoi_lo_trinh(v_hs, r.mon);
    v_dangs := '[]'::jsonb;
    for d in select bdd.ma_dang from bo_tro_duoi_dang bdd where bdd.bo_tro_duoi_id = r.id order by bdd.created_at, bdd.ma_dang loop
      v_item := (select x from jsonb_array_elements(v_path) x where x->>'ma_dang' = d.ma_dang limit 1);
      if v_item is not null then
        v_tt := case when (v_item->>'xong')::boolean then 'xong'
                     when (v_item->>'doc_ly_thuyet')::boolean or (v_item->>'luyen_cau')::int > 0 or (v_item->>'test_lan')::int > 0 then 'dang_hoc'
                     when (v_item->>'mo')::boolean then 'toi_luot'
                     else 'khoa' end;
        v_dangs := v_dangs || jsonb_build_array(v_item || jsonb_build_object('trang_thai', v_tt, 'tren_app', true));
      else
        -- dạng không nằm trong lộ trình app (vd Bài Hình học, hoặc bản đồ không có): vẫn thuộc mục tiêu, học + chấm trên giấy với TA
        v_nh := public._kho_nhanh_cua_dang(r.mon, d.ma_dang);
        v_bd := public._kho_ban_do_tbl(r.mon, v_nh);
        v_cd := null; v_tcd := null; v_md := null;
        begin
          execute format('select ma_chuyen_de, ten_chuyen_de, muc_do from %I where ma_dang = $1 limit 1', v_bd) into v_cd, v_tcd, v_md using d.ma_dang;
        exception when others then null; end;
        v_dangs := v_dangs || jsonb_build_array(jsonb_build_object(
          'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, d.ma_dang), d.ma_dang),
          'ma_chuyen_de', v_cd, 'ten_chuyen_de', coalesce(v_tcd, ''), 'muc_do', v_md,
          'xong', coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false),
          'doc_ly_thuyet', false, 'mo', true, 'tong_cau', 0, 'luyen_cau', 0, 'luyen_dung', 0, 'test_lan', 0, 'test_gan_nhat', null, 'noi_lam', null, 'mo_tay', false,
          'trang_thai', case when coalesce((select td.xong from public._duoi_tien_do_dang(v_hs, r.mon, array[d.ma_dang]) td), false) then 'xong' else 'giay' end,
          'tren_app', false));
      end if;
    end loop;

    -- Xếp theo ĐÚNG thứ tự khoá tuần tự (chuyên đề → độ khó → mã dạng), dạng ngoài lộ trình app xuống cuối — để "chờ dạng trước" đọc được từ danh sách.
    select coalesce(jsonb_agg(x order by (x->>'tren_app')::boolean desc, x->>'ma_chu_de', x->>'ma_chuyen_de',
                                 coalesce((x->>'muc_do')::int, 3), x->>'ma_dang'), '[]'::jsonb)
      into v_dangs from jsonb_array_elements(v_dangs) x;

    select coalesce(jsonb_agg(jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'trang_thai', b.trang_thai,
             'diem_danh', hh.diem_danh, 'xong', (b.danh_gia_xong_at is not null)) order by b.ngay, b.gio_bat_dau nulls last), '[]'::jsonb)
      into v_buoi
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
      where hh.bo_tro_duoi_id = r.id and b.trang_thai <> 'huy';

    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'bo_tro_duoi_id', r.id, 'mon', r.mon, 'lop', r.ten_lop, 'so_buoi_du_kien', r.so_buoi_du_kien, 'created_at', r.created_at,
      'dangs', v_dangs, 'buoi', v_buoi,
      'tong', jsonb_array_length(v_dangs),
      'xong', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'xong'),
      'dang_hoc', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'dang_hoc'),
      'tai_nha', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'nha'),
      'tai_ca', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'noi_lam' = 'ca'),
      'giay', (select count(*) from jsonb_array_elements(v_dangs) x where x->>'trang_thai' = 'giay'),
      'so_buoi_xong', (select count(*) from jsonb_array_elements(v_buoi) x where (x->>'xong')::boolean and x->>'diem_danh' = 'co_mat')));
  end loop;
  return v_out;
end $function$;
