-- Thùy 10/10: "Trong ca bổ trợ yếu vẫn hiện những dạng đã bị xoá ở bản đồ kiến thức — fix đoạn đồng bộ này."
-- Gốc (đo): dạng T107010102 bị GỘP vào T107010101 ngày 06/10 (18/18 câu đổi dạng, có log kho_doi_dang_log) rồi XOÁ khỏi dai_ban_do — đường
-- xoá lá bản đồ (client .delete()) KHÔNG đồng bộ bảng trỏ dạng bằng text (khác fn_dai_chuyen_dang có đồng bộ) ⇒ 3 case đang mở (Lê Bảo Châu ·
-- Nguyễn Đăng Đức · Nguyễn Thái Anh) còn giữ mã chết: ca hiện dạng không tên, không câu.
-- Sửa: _btyeu_dong_bo_dang_ban_do() — với dạng của case ĐANG MỞ (chưa đóng dạng) không còn trong bản đồ của môn:
--   · có đúng MỘT dạng nhận toàn bộ câu của dạng cũ (kho_doi_dang_log, loai 'cau') và dạng đó còn trong bản đồ, case chưa có dạng đó ⇒ ĐỔI MÃ;
--   · còn lại (case đã có dạng mới, hoặc không rõ câu đi đâu) ⇒ ĐÓNG dạng (dong_at) — không xoá dòng, giữ vết đã dạy/điểm.
-- Tự chạy: sau khi XOÁ dòng ở dai/hgt/hinh_hoc/khtn_ban_do, và sau khi ghi log đổi dạng (câu chuyển đi SAU khi xoá bản đồ vẫn bắt được).
-- fn_btyeu_ca_ta (dựng từ bản ĐANG CHẠY): không liệt kê dạng đã đóng mà đã xoá khỏi bản đồ. Case đã hoàn thành: giữ nguyên lịch sử.
create or replace function public._btyeu_dong_bo_dang_ban_do() returns jsonb
language plpgsql security definer set search_path = public as $$
declare r record; v_moi text; v_doi int := 0; v_dong int := 0;
begin
  for r in select d.id, d.bo_tro_yeu_id, d.ma_dang, y.mon
           from bo_tro_yeu_dang d join bo_tro_yeu y on y.id = d.bo_tro_yeu_id
           where y.trang_thai = 'dang_xu' and d.dong_at is null and public._kho_ten_dang(y.mon, d.ma_dang) is null
  loop
    select case when count(distinct l.dang_moi) = 1 then min(l.dang_moi) end into v_moi
      from kho_doi_dang_log l where l.dang_cu = r.ma_dang and l.loai = 'cau' and l.dang_moi is not null;
    if v_moi is not null and public._kho_ten_dang(r.mon, v_moi) is null then v_moi := null; end if;
    if v_moi is not null and not exists (select 1 from bo_tro_yeu_dang x where x.bo_tro_yeu_id = r.bo_tro_yeu_id and x.ma_dang = v_moi) then
      update bo_tro_yeu_dang set ma_dang = v_moi where id = r.id; v_doi := v_doi + 1;
    else
      update bo_tro_yeu_dang set dong_at = now() where id = r.id; v_dong := v_dong + 1;
    end if;
  end loop;
  return jsonb_build_object('doi_ma', v_doi, 'dong', v_dong);
end $$;
revoke all on function public._btyeu_dong_bo_dang_ban_do() from public;

create or replace function public._trg_btyeu_dong_bo_dang_ban_do() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public._btyeu_dong_bo_dang_ban_do();
  return null;
end $$;

drop trigger if exists trg_dai_ban_do_xoa_dong_bo_btyeu on public.dai_ban_do;
create trigger trg_dai_ban_do_xoa_dong_bo_btyeu after delete on public.dai_ban_do for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();
drop trigger if exists trg_hgt_ban_do_xoa_dong_bo_btyeu on public.hgt_ban_do;
create trigger trg_hgt_ban_do_xoa_dong_bo_btyeu after delete on public.hgt_ban_do for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();
drop trigger if exists trg_hinh_hoc_ban_do_xoa_dong_bo_btyeu on public.hinh_hoc_ban_do;
create trigger trg_hinh_hoc_ban_do_xoa_dong_bo_btyeu after delete on public.hinh_hoc_ban_do for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();
drop trigger if exists trg_khtn_ban_do_xoa_dong_bo_btyeu on public.khtn_ban_do;
create trigger trg_khtn_ban_do_xoa_dong_bo_btyeu after delete on public.khtn_ban_do for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();
drop trigger if exists trg_kho_doi_dang_log_dong_bo_btyeu on public.kho_doi_dang_log;
create trigger trg_kho_doi_dang_log_dong_bo_btyeu after insert on public.kho_doi_dang_log for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();

CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_ta(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
  rd record; v_nh text; v_mot jsonb;
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
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce((select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$I c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl) into v_mot using p_buoi, rd.id;
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

-- Đồng bộ các dòng đang lệch (đo 10/10: 3 dòng T107010102 → 2 đổi mã sang T107010101, 1 đóng vì case đã có T107010101).
do $$
declare v jsonb;
begin
  v := public._btyeu_dong_bo_dang_ban_do();
  if (v->>'doi_ma')::int + (v->>'dong')::int > 3 then raise exception 'Số dòng lệch khác lúc đo (3): %', v; end if;
  raise notice 'Đồng bộ dạng đã xoá: %', v;
end $$;
