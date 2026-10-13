-- Thùy 13/10 (ảnh iPad): dạng "Tìm x vận dụng Thứ tự thực hiện phép tính – Quy tắc chuyển vế" (T107010403) trong ca bổ trợ yếu báo "kho chưa có bài",
-- nút luyện bị khoá. Đo: dạng có 70 bài trắc nghiệm dùng được nhưng TẤT CẢ chưa gán cụm (ma_cum null); dạng lại có 1 cụm (tạo 06/10) chưa có bài nào.
-- Màn ca của em chỉ liệt kê CỤM ⇒ thấy 1 cụm rỗng ⇒ khoá cả dạng. Toàn trường (case đang mở, nhánh Đại): 13 dạng bị khoá hẳn kiểu này (40 lượt HS–dạng),
-- 9 dạng có vài cụm rỗng, 798 bài dùng được nằm ngoài cụm. "ma_cum null = CHƯA PHÂN, không phải không có bài" (§1.5).
-- Sửa fn_btyeu_ca_cua_toi (dựng từ bản ĐANG CHẠY): chỉ liệt kê cụm CÓ bài dùng được (đúng điều kiện chọn câu của bổ trợ); không cụm nào có bài ⇒ danh sách
-- rỗng ⇒ app hiện ô "Cả dạng"; có cụm có bài mà còn bài ngoài cụm ⇒ thêm mục "Cả dạng (gồm bài chưa chia cụm)". Không cần deploy app (app đang chạy đọc được).
-- _btyeu_dk_dang_sql: điều kiện chọn câu của MỘT dạng (trắc nghiệm trước; dạng 0 trắc nghiệm ⇒ trả lời ngắn) — _btyeu_chon_cau dùng lại, hết chép 2 nơi.
create or replace function public._btyeu_dk_dang_sql(p_cautbl text, p_ma_dang text) returns text
language plpgsql stable security definer set search_path = public as $$
declare v_dk text := public._kho_dk_mcq_sql(p_cautbl); v_co boolean;
begin
  execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)$q$, p_cautbl, v_dk) into v_co using p_ma_dang;
  if not v_co then v_dk := public._kho_dk_tln_sql(); end if;
  return v_dk;
end $$;
revoke all on function public._btyeu_dk_dang_sql(text, text) from public;

CREATE OR REPLACE FUNCTION public._btyeu_chon_cau(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
 RETURNS text[]
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_out text[] := '{}'; v_more text[]; v_dk text := public._kho_dk_mcq_sql(p_cautbl);
        v_bd text := replace(p_cautbl, '_cau_hoi', '_ban_do'); v_muc smallint; v_co_mcq boolean;
begin
  -- Thùy 10/10: MCQ TRƯỚC; cả dạng 0 MCQ ⇒ dùng câu TRẢ LỜI NGẮN có đáp án (MỌI mức độ — thay ngoại lệ "chỉ mức 4–5" ngày 28/09).
  v_dk := public._btyeu_dk_dang_sql(p_cautbl, p_ma_dang); -- 13/10: một nguồn (màn ca của em cũng đếm bằng đúng điều kiện này)

  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and ($2::text is null or c.ma_cum = $2)
        and %2$s
        and c.ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl, v_dk) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then -- cạn câu chưa gặp ⇒ lặp lại câu cùng loại đã làm
    execute format($q$
      select coalesce(array_agg(ma_cau), '{}') from (
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null
          and ($2::text is null or c.ma_cum = $2)
          and %2$s
          and c.ma_cau <> all($3)
        order by random() limit $4) s
    $q$, p_cautbl, v_dk) into v_more using p_ma_dang, p_ma_cum, v_out, p_n - coalesce(array_length(v_out, 1), 0);
    v_out := v_out || v_more;
  end if;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
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
  where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.ngay = public._btyeu_today()
    and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null
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
            'tien_de', coalesce((select jsonb_agg(t.tien_de_ma_cum) from %3$I t where t.ma_cum = k.ma_cum), '[]'::jsonb),
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
  $q$, v_bd, v_cumtbl, replace(v_cumtbl, '_cum_bai', '_cum_tien_de'), v_cautbl, public._btyeu_dk_dang_sql(v_cautbl, rd.ma_dang))
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
