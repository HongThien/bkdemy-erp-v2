-- Ca bổ trợ yếu của HS KHÔNG vào được (Thùy 29/10: Hà Linh + Quỳnh Chi, ca 16:30 — "lỗi này gặp rất nhiều rồi, fix rồi mà vẫn bị").
-- GỐC: fn_btyeu_ca_cua_toi tự suy tên bảng tiền đề bằng replace('_cum_bai' → '_cum_tien_de'). Nhánh bản đồ mới (bdm, dạng NDB*) có bdm_cum_bai nhưng KHÔNG có
-- bdm_cum_tien_de ⇒ "relation does not exist" ⇒ cả hàm nổ ⇒ app HS nhận lỗi/null ⇒ nút "Vào ca" ẩn. Từ 24/10 (bật bản đồ mới, 100% case ban_do='moi') mọi em có dạng NDB* dính.
-- SỬA: (1) bảng tiền đề không có ⇒ tien_de = []. (2) Tách thân hàm thành _btyeu_ca_cua_hs(p_hs, p_buoi) để TỰ KIỂM thay mặt từng em;
-- fn_btyeu_ca_cua_toi chỉ còn là vỏ. (3) fn_btyeu_kiem_ca_hs: nhân sự gọi để thấy em nào SẼ không vào được ca (trước giờ im lặng).
CREATE OR REPLACE FUNCTION public._btyeu_ca_cua_hs(p_hs uuid, p_buoi uuid DEFAULT NULL)
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
  where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
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
revoke all on function public._btyeu_ca_cua_hs(uuid, uuid) from public, anon, authenticated; -- nhận hs tuỳ ý ⇒ KHÔNG cho client gọi thẳng

CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_cua_toi()
 RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $f$ select public._btyeu_ca_cua_hs(public.my_hoc_sinh_id()) $f$;

-- Nhân sự: các buổi bổ trợ yếu từ hôm nay tới +p_ngay ngày mà ca của em DỰNG LỖI (bất kể đã điểm danh chưa). Rỗng = ổn.
CREATE OR REPLACE FUNCTION public.fn_btyeu_kiem_ca_hs(p_ngay integer DEFAULT 7)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $f$
declare r record; v_out jsonb := '[]'::jsonb; v_ca jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  for r in select b.id as buoi, b.ngay, b.gio_bat_dau, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
           join hoc_sinh hs on hs.id = hh.hoc_sinh_id
           where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
             and b.ngay between public._btyeu_today() and public._btyeu_today() + greatest(p_ngay, 0)
           order by b.ngay, b.gio_bat_dau, hs.ho_ten loop
    begin
      v_ca := public._btyeu_ca_cua_hs(r.hoc_sinh_id, r.buoi);
      if v_ca is null then raise exception 'Ca trả null (buổi/case không khớp)'; end if;
    exception when others then
      v_out := v_out || jsonb_build_object('buoi_id', r.buoi, 'ngay', r.ngay, 'gio_bat_dau', r.gio_bat_dau, 'hoc_sinh_id', r.hoc_sinh_id, 'ho_ten', r.ho_ten, 'ma_hs', r.ma_hs, 'loi', sqlerrm);
    end;
  end loop;
  return v_out;
end $f$;
grant execute on function public.fn_btyeu_kiem_ca_hs(integer) to authenticated;
