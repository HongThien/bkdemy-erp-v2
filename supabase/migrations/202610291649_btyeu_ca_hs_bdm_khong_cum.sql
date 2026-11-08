-- Bản đồ mới 4 tầng: dạng là tầng cuối, KHÔNG có cụm (Thùy 29/10). Ca bổ trợ yếu của HS: nhánh bdm (dạng NDB*) bỏ hẳn tra cụm + tiền đề
-- (bdm_cum_bai chỉ là VIEW của bảng cụm CŨ — 355 cụm toàn dạng mã T…, 0/876 dạng NDB có cụm — nên cụm cho NDB luôn rỗng). Giữ cụm cho nhánh cũ có bảng cụm.
-- Không xoá/đổi ma_cum trên 6.579 câu bdm (rác kế thừa từ bản đồ cũ, vô hại vì mọi đường bổ trợ bdm truyền ma_cum = null).
CREATE OR REPLACE FUNCTION public._btyeu_ca_cua_hs(p_hs uuid, p_buoi uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := p_hs; v_td_sql text;
  r record;
  v_bd text; v_cautbl text; v_cumtbl text;
  v_dangs jsonb; v_test jsonb;
  rd record; v_nh text; v_mot jsonb;
begin
  if v_hs is null then return null; end if;
  select b.id, b.gio_bat_dau, b.gio_ket_thuc, b.phong, y.id as case_id, y.mon,
         (select ho_ten from nhan_su where id = b.nguoi_day_tg) as ta_ten
    into r
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai = 'mo'
    and (case when p_buoi is null then (b.ngay = public._btyeu_today() and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null) else b.id = p_buoi end)
  order by b.gio_bat_dau nulls last, b.created_at
  limit 1;
  if r.id is null then return null; end if;

  v_bd := public._kho_ban_do_tbl(r.mon); v_cautbl := public._kho_cau_tbl(r.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = r.case_id and d.dong_at is null
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(r.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(r.mon, v_nh); v_cautbl := public._kho_cau_tbl(r.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
    -- 29/10: KHÔNG phải nhánh nào cũng có bảng tiền đề (bdm_cum_tien_de KHÔNG tồn tại ⇒ cả ca của mọi em có dạng NDB* nổ lỗi, app HS coi như "không có ca").
    v_td_sql := case when to_regclass('public.' || quote_ident(replace(v_cumtbl, '_cum_bai', '_cum_tien_de'))) is not null
                     then format('coalesce((select jsonb_agg(t.tien_de_ma_cum) from %I t where t.ma_cum = k.ma_cum), ''[]''::jsonb)', replace(v_cumtbl, '_cum_bai', '_cum_tien_de'))
                     else '''[]''::jsonb' end;
  -- 29/10 (Thùy: "bản đồ mới 4 tầng, dạng là tầng cuối, KHÔNG có cụm"): nhánh bdm — và nhánh nào không có bảng cụm — KHÔNG tra cụm/tiền đề nữa
  -- (trước đây vẫn tra bdm_cum_bai = view của bảng cụm CŨ ⇒ luôn rỗng cho dạng NDB*, và suy tên bảng tiền đề làm nổ cả ca).
  if v_nh = 'bdm' or to_regclass('public.' || quote_ident(v_cumtbl)) is null then
    execute format($r$
      with td as (select * from public._btyeu_tien_do($1))
      select jsonb_build_object(
        'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
        'da_day_truoc', (d.day_at is not null and d.day_buoi_id is distinct from $1),
        'diem_luc_mo', d.diem_luc_mo,
        'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
        'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
        'cums', '[]'::jsonb)
      from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
      where d.id = $2
    $r$, v_bd) into v_mot using r.id, rd.id;
  else
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'da_day_truoc', (d.day_at is not null and d.day_buoi_id is distinct from $1),
      'diem_luc_mo', d.diem_luc_mo,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      -- Thùy 13/10: cụm KHÔNG có bài dùng được thì không liệt kê (trước hiện "kho chưa có bài" và khoá luôn cả dạng dù dạng có bài chưa chia cụm).
      -- Không cụm nào có bài ⇒ danh sách rỗng ⇒ app hiện 1 ô "Cả dạng". Có cụm có bài mà còn bài nằm ngoài cụm ⇒ thêm mục "Cả dạng" (ma_cum null = luyện cả dạng).
      'cums', coalesce((
        select jsonb_agg(x.j order by x.thu_tu, x.ma_cum nulls last) from (
          select k.thu_tu, k.ma_cum, jsonb_build_object(
            'ma_cum', k.ma_cum, 'ten', coalesce(k.ten, 'Cụm ' || k.thu_tu), 'thu_tu', k.thu_tu,
            'tien_de', %3$s,
            'so_cau_kho', kc.n,
            'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum = k.ma_cum), 0),
            'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum = k.ma_cum), 0)) as j
          from %2$I k
          cross join lateral (select count(*) as n from %4$I c where c.ma_cum = k.ma_cum and c.dang_chinh = d.ma_dang and c.xoa_at is null and %5$s) kc
          where k.ma_dang = d.ma_dang and kc.n > 0
          union all
          select tc.thu_tu, null, jsonb_build_object(
            'ma_cum', null, 'ten', 'Cả dạng (gồm bài chưa chia cụm)', 'thu_tu', tc.thu_tu, 'tien_de', '[]'::jsonb,
            'so_cau_kho', tc.tat_ca,
            'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum is null), 0),
            'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum is null), 0))
          from (select count(*) as tat_ca,
                       count(*) filter (where exists (select 1 from %2$I k2 where k2.ma_cum = c.ma_cum and k2.ma_dang = d.ma_dang)) as trong_cum,
                       (select coalesce(max(k3.thu_tu), 0) + 1 from %2$I k3 where k3.ma_dang = d.ma_dang) as thu_tu
                from %4$I c where c.dang_chinh = d.ma_dang and c.xoa_at is null and %5$s) tc
          where tc.trong_cum > 0 and tc.tat_ca > tc.trong_cum
        ) x), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d
    left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl, v_td_sql, v_cautbl, public._btyeu_dk_dang_sql(v_cautbl, rd.ma_dang))
  into v_mot using r.id, rd.id;
  end if;
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
    into v_test
  from bai_test bt where bt.buoi_hoc_id = r.id and bt.loai = 'bo_tro_test' limit 1;

  return jsonb_build_object(
    'buoi_id', r.id, 'mon', r.mon, 'gio_bat_dau', r.gio_bat_dau, 'gio_ket_thuc', r.gio_ket_thuc, 'phong', r.phong,
    'ta_ten', r.ta_ten, 'dangs', v_dangs, 'test', v_test);
end $function$;
revoke all on function public._btyeu_ca_cua_hs(uuid, uuid) from public, anon, authenticated;
