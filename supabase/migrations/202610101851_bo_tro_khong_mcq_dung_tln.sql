-- Thùy 10/10: "Với những dạng không có MCQ thì hệ thống ưu tiên hiển thị TRẢ LỜI NGẮN — như cũ là đang báo không có."
-- Luật mới cho bài làm bổ trợ (yếu · bù): MCQ TRƯỚC; cả dạng 0 MCQ ⇒ câu trả lời ngắn có đáp án (kho_chuan), MỌI mức độ.
-- Thay ngoại lệ 28/09 ("chỉ mức 4–5") và chốt 03/10 ("bù 100% MCQ, 0 MCQ thì khoá"). Đo 01/10: 13 dạng trong case mở có 0 MCQ (vd
-- T309010102/T309010402 của Khánh An: 21 + 14 câu trả lời ngắn) ⇒ trước đây không in, không luyện, không test được.
-- Dựng từ bản ĐANG CHẠY: _btyeu_chon_cau (luyện · test cuối ca · retest · phiếu giấy) · fn_btyeu_giay_nhap (phiếu giấy: câu trả lời ngắn
-- TA chấm 1 = đúng / 0 = sai) · tu_luyen_chu_de_sinh (bu_luyen/bu_test) · fn_hs_bu_dang (co_mcq = có câu dùng được).
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
  execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)$q$, p_cautbl, v_dk) into v_co_mcq using p_ma_dang;
  if not v_co_mcq then v_dk := $d$(c.kho_chuan and c.loai_cau = 'tra_loi_ngan' and c.dap_an is not null)$d$; end if;

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

CREATE OR REPLACE FUNCTION public.fn_btyeu_giay_nhap(p_bai_test_cau uuid, p_chon integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare k record; v_bl uuid; v_tt text; v_verdict text; v_letters text[] := array['A','B','C','D','E','F'];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả bài giấy.'; end if;
  select btc.id, btc.loai_cau, btc.dap_an_key, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.in_giay_at, bt.loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai not in ('bo_tro', 'bo_tro_test') or k.in_giay_at is null then raise exception 'Chỉ nhập tay cho bài bổ trợ IN GIẤY (bài trên app do em tự làm).'; end if;
  if k.loai_cau not in ('trac_nghiem', 'tra_loi_ngan') then raise exception 'Bài giấy chỉ có trắc nghiệm hoặc trả lời ngắn.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa kết quả được nữa.'; end if;
  if p_chon is null then
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id; -- xoá lựa chọn nhập nhầm (dòng do chính luồng nhập tay này tạo)
    return jsonb_build_object('chon', null, 'verdict', null);
  end if;
  -- Thùy 10/10: câu TRẢ LỜI NGẮN trên giấy — TA đối chiếu đáp án rồi chấm: 1 = Đúng · 0 = Sai.
  if k.loai_cau = 'tra_loi_ngan' then
    if p_chon not in (0, 1) then raise exception 'Câu trả lời ngắn: chấm 1 (đúng) hoặc 0 (sai).'; end if;
    v_verdict := case when p_chon = 1 then 'correct' else 'wrong' end;
    insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
      values (v_bl, k.id, to_jsonb(case when p_chon = 1 then 'đúng (TA chấm giấy)' else 'sai (TA chấm giấy)' end), v_verdict, case when v_verdict = 'correct' then coalesce(k.diem, 1) else 0 end, 'manual', now())
      on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual';
    return jsonb_build_object('chon', p_chon, 'verdict', v_verdict);
  end if;
  if p_chon < 0 or p_chon > 5 then raise exception 'Lựa chọn không hợp lệ.'; end if;
  v_verdict := case when v_letters[p_chon + 1] = upper(trim(k.dap_an_key #>> '{}')) then 'correct' else 'wrong' end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, to_jsonb(p_chon), v_verdict, case when v_verdict = 'correct' then coalesce(k.diem, 1) else 0 end, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual';
  return jsonb_build_object('chon', p_chon, 'verdict', v_verdict);
end $function$;

CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text DEFAULT 'tu_luyen'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := case when p_loai in ('bu_luyen', 'bu_test') then public._kho_dk_mcq_sql(v_cautbl) else public._kho_dk_online_hs_sql(v_cautbl) end; -- Thùy 03/10: BÙ = 100% MCQ
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_cho integer; -- số câu CÒN được luyện dạng này hôm nay (null = không giới hạn) — luyen_gioi_han
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  -- Thùy 10/10: bù cũng "MCQ trước, dạng 0 MCQ ⇒ trả lời ngắn có đáp án" (cùng luật _btyeu_chon_cau).
  if p_loai in ('bu_luyen', 'bu_test') then
    declare v_co_mcq boolean;
    begin
      execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)$q$, v_cautbl, v_dk) into v_co_mcq using p_ma_dang;
      if not v_co_mcq then v_dk := $d$(c.kho_chuan and c.loai_cau = 'tra_loi_ngan' and c.dap_an is not null)$d$; end if;
    end;
  end if;
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test', 'bu_luyen', 'bu_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai in ('htd_test', 'bu_test') then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  if p_loai = 'tu_luyen' then v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang); end if;
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..least(v_n, coalesce(v_cho, v_n)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Thùy 21-22/09: dạng KHÔNG có MCQ (v_ok_count=0) + đang ở Học từ đầu → hiện đề THẬT (bất kỳ loại
  -- câu), KHÔNG chặn cứng nữa. App HS render read-only khi câu không phải trắc nghiệm; TA chấm ĐCS.
  -- Tự luyện thường (p_loai='tu_luyen') KHÔNG rơi vào đây — vẫn báo lỗi như cũ (ngoài phạm vi).
  if v_ok_count = 0 and p_loai in ('htd_luyen', 'htd_test') then
    v_fallback := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, '{}', v_n);
    v_thu_tu := 0;
    foreach v_c in array v_fallback loop
      v_thu_tu := v_thu_tu + 1;
      perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_c, v_thu_tu, null);
      v_ok_count := v_ok_count + 1;
    end loop;
  end if;

  if v_ok_count = 0 and p_loai in ('bu_luyen', 'bu_test') then
    delete from bai_test where id = v_bt_id;
    raise exception 'Dạng này chưa có câu trắc nghiệm hay trả lời ngắn trên app — em học dạng này với thầy cô trên giấy nhé.';
  end if;
  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_hs_bu_dang(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); r record; v_out jsonb; v_kq jsonb := '[]'::jsonb; x jsonb; v_tbl text; v_co boolean;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select b.id as bu, b.ngay, hh.bu_cho_buoi_id as me, bm.ngay as ngay_me, l.mon, l.ten_lop into r
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs
    left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join lop l on l.id = bm.lop_id
    where b.id = p_buoi and b.loai = 'bu' limit 1;
  if r.bu is null then raise exception 'Không thấy buổi bù của em.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, x.ma_dang), x.ma_dang)) order by x.thu_tu), '[]'::jsonb)
    into v_out
    from (select p.ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'btvn'))
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by p.ma_dang) x;
  -- Thùy 03/10: bù 100% MCQ ⇒ báo dạng nào CÓ câu trắc nghiệm (cùng điều kiện duy nhất _kho_dk_mcq_sql) — dạng không có thì app ghi rõ 'học trên giấy'.
  for x in select * from jsonb_array_elements(v_out) loop
    v_tbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, x->>'ma_dang'));
    execute format('select exists (select 1 from %I c where c.dang_chinh = $1 and c.xoa_at is null and (%s or (c.kho_chuan and c.loai_cau = ''tra_loi_ngan'' and c.dap_an is not null)))', v_tbl, public._kho_dk_mcq_sql(v_tbl)) into v_co using x->>'ma_dang'; -- Thùy 10/10: MCQ hoặc trả lời ngắn
    v_kq := v_kq || (x || jsonb_build_object('co_mcq', coalesce(v_co, false)));
  end loop;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_kq);
end $function$;
