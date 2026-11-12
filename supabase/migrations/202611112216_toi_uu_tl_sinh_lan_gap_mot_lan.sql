-- ============================================================================
-- TỰ LUYỆN — đọc lịch sử gặp câu của em MỘT lần mỗi lượt sinh (audit timeout 11/11, CLAUDE.md §2.0).
--
-- fn_tu_luyen_sinh_tu_dong (778 lần × 4,4 s, max 8 s) = _tu_luyen_chon_dang + tu_luyen_sinh. Trong tu_luyen_sinh, MỖI dạng
-- (10 dạng/lượt) chạy 1–2 truy vấn chọn câu, mỗi truy vấn tự gọi lại `_hs_cau_lan_gap(em)` — gộp toàn bộ tu_luyen_dang_lan +
-- bai_lam_cau × bai_test_cau của em (em khối 9: ~6.300 dòng, 15.000 khối đệm) ⇒ tới 20 lần quét cả lịch sử/lượt.
-- EXPLAIN lúc DB nghẽn 11/11: một truy vấn chọn câu 8,2 s, trong đó 5,9 s là _hs_cau_lan_gap.
-- tu_luyen_chu_de_sinh (2 bản: chi_cau_moi / p_loai) cùng kiểu, tới 3 lần/câu × 5–10 câu.
--
-- Sửa: đọc _hs_cau_lan_gap MỘT lần ngay sau khi tạo bai_test, giữ trong 2 mảng (mã câu, lúc gặp cuối); truy vấn chọn câu so
-- với mảng. CÙNG NGHĨA từng chữ:
--   · NOT EXISTS (g.ma_cau = c.ma_cau)  ⇒ not (c.ma_cau = any(mảng đã bỏ NULL))   (NULL không bao giờ khớp)
--   · c.ma_cau NOT IN (select g.ma_cau …) ⇒ c.ma_cau <> all(mảng giữ NULL)          (NOT IN ≡ <> ALL, kể cả khi có NULL)
--   · left join _hs_cau_lan_gap g        ⇒ left join unnest(mã, lúc) g
--   Câu vừa chọn trong lượt được ghi thêm vào tu_luyen_dang_lan nhưng cũng nằm trong v_used_batch (bị loại ở mọi truy vấn)
--   ⇒ tra lại hay dùng mảng đầu lượt cho ra cùng câu.
-- Kiểm 11/11 (ROLLBACK, setseed cố định, 12 HS khối 3→12): tập câu chọn ra khớp 12/12 cho cả 3 hàm (0 lệch).
--   fn_tu_luyen_sinh_tu_dong: khối đệm/lượt 40k–300k ⇒ 30k–89k (−25…−80%); thời gian (DB rảnh, phiên ấm) 320–830 ⇒ 280–680 ms.
-- Kiểm lại 12/11 sau mig 202611112136_hs_index_hs…2221: 3 hàm khớp 12/12 · 12/12 · 12/12; tu_luyen_sinh_tu_dong 380–1.090 ⇒ 345–665 ms
--   (ấm), khối đệm 42k–338k ⇒ 34k–95k.
-- Phần còn lại giữ nguyên từng chữ (pg_get_functiondef 11/11, đối chiếu lại 12/11: chưa ai sửa).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);   -- ⭐ ĐỔI Ở ĐÂY: dùng hàm HS-only (bỏ TLN)
  v_ftbl text := public._kho_form_tn_cua(v_cautbl);
  v_uu_tien text;
  v_thu_tu integer := 0;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_gap text[];            -- 11/11: lịch sử gặp câu của em, đọc MỘT lần/lượt (trước: _hs_cau_lan_gap gọi lại trong từng truy vấn chọn câu)
  v_gap_luc timestamptz[];
  v_ma_cau text;
  v_ok_count integer := 0;
  v_nh text;
  v_cho integer;
  v_bi_chan boolean := false; -- có dạng bị bỏ vì đã đủ trần ngày (luyen_gioi_han)
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  -- 11/11: đọc _hs_cau_lan_gap MỘT lần. Trong vòng lặp các câu vừa chọn được ghi thêm vào tu_luyen_dang_lan nhưng cũng đã nằm
  -- trong v_used_batch (bị loại ở mọi truy vấn) ⇒ kết quả chọn câu y hệt khi tra lại mỗi lần.
  select coalesce(array_agg(g.ma_cau), '{}'::text[]), coalesce(array_agg(g.lan_cuoi), '{}'::timestamptz[])
    into v_gap, v_gap_luc from public._hs_cau_lan_gap(v_hs) g;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
    -- TRẦN NGÀY CHO DẠNG DỄ (Thùy 09/10): dạng dễ đã đủ số câu hôm nay ⇒ bỏ qua (tu_luyen_dang_lan đã ghi các câu vừa sinh trong lượt này nên đếm đúng).
    v_cho := public._luyen_con_cho_dang(v_hs, p_mon, v_ma_dang);
    if v_cho is not null and v_cho <= 0 then v_thu_tu := v_thu_tu - 1; v_bi_chan := true; continue; end if;
    -- 29/09: client (tuluyen.ts / thu_thach_sinh) KHÔNG truyền p_nhanh mà rút dạng từ MỌI nhánh ⇒ bảng câu theo
    -- nhánh của CHÍNH dạng này (Đại/KHTN: null ⇒ bảng gốc như cũ). Trước đây dạng Hình/HGT tra dai_cau_hoi ⇒ bị bỏ qua.
    if p_nhanh is null then
      v_nh := public._kho_nhanh_cua_dang(p_mon, v_ma_dang);
      v_cautbl := public._kho_cau_tbl(p_mon, v_nh);
      v_lttbl := public._kho_lt_tbl(p_mon, v_nh);
      v_dk := public._kho_dk_online_hs_sql(v_cautbl);
      v_ftbl := public._kho_form_tn_cua(v_cautbl);
      v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;
    end if;
    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;
    v_ma_cau := null;
    execute format($q$
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and %2$s
        and c.ma_cau <> all($2)
        and not (c.ma_cau = any($3))
      order by %3$s random() limit 1
    $q$, v_cautbl, v_dk, v_uu_tien)
    into v_ma_cau using v_ma_dang, v_used_batch, array_remove(v_gap, null), p_mon, v_lan_thu;
    if v_ma_cau is null then
      -- Hết câu chưa gặp ⇒ câu gặp LÂU NHẤT trước (không bốc ngẫu nhiên câu vừa làm).
      execute format($q$
        select c.ma_cau from %1$I c
        left join unnest($3::text[], $4::timestamptz[]) g(ma_cau, lan_cuoi) on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null
          and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, %3$s random() limit 1
      $q$, v_cautbl, v_dk, v_uu_tien)
      into v_ma_cau using v_ma_dang, v_used_batch, v_gap, v_gap_luc;
    end if;
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 and v_bi_chan then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng
    raise exception 'Các dạng này em đã luyện đủ số câu của hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean DEFAULT false)
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
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_gap text[];            -- 11/11: lịch sử gặp câu của em, đọc MỘT lần/lượt (trước: _hs_cau_lan_gap gọi lại trong từng truy vấn chọn câu)
  v_gap_luc timestamptz[];
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_cho integer; -- số câu CÒN được luyện dạng này hôm nay (null = không giới hạn) — luyen_gioi_han
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): em không luyện được dạng lớp chưa dạy (server chặn, không chỉ ẩn ở màn)
  if not public._dang_da_hoc_ok(v_hs, p_mon, p_ma_dang) then raise exception 'Dạng này lớp em chưa học tới nên chưa luyện được. Em chọn dạng khác nhé!'; end if;

  v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang);
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  -- 11/11: đọc _hs_cau_lan_gap MỘT lần. Trong vòng lặp các câu vừa chọn được ghi thêm vào tu_luyen_dang_lan nhưng cũng đã nằm
  -- trong v_used_batch (bị loại ở mọi truy vấn) ⇒ kết quả chọn câu y hệt khi tra lại mỗi lần.
  select coalesce(array_agg(g.ma_cau), '{}'::text[]), coalesce(array_agg(g.lan_cuoi), '{}'::timestamptz[])
    into v_gap, v_gap_luc from public._hs_cau_lan_gap(v_hs) g;

  for i in 1..least(10, coalesce(v_cho, 10)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + câu em CHƯA GẶP ở bất kỳ bài nào (01/10, spec-v1-app-hs §2).
    -- Tier 2: bỏ ràng buộc cụm, vẫn chỉ câu chưa gặp. Tier 3 (chỉ khi tắt "Chỉ câu mới"): câu gặp LÂU NHẤT trước.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau <> all($4)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_gap, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau <> all($3)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_gap, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join unnest($3::text[], $4::timestamptz[]) g(ma_cau, lan_cuoi) on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_gap, v_gap_luc;
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

  if v_ok_count = 0 and p_chi_cau_moi then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác (không tạo tu_luyen_dang_lan nên xoá an toàn)
    raise exception 'Em đã làm hết câu MỚI của dạng này — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
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
  v_gap text[];            -- 11/11: lịch sử gặp câu của em, đọc MỘT lần/lượt (trước: _hs_cau_lan_gap gọi lại trong từng truy vấn chọn câu)
  v_gap_luc timestamptz[];
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
      if not v_co_mcq then v_dk := public._kho_dk_tln_sql(); end if;
    end;
  end if;
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test', 'bu_luyen', 'bu_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): em không luyện được dạng lớp chưa dạy (server chặn, không chỉ ẩn ở màn)
  if p_loai = 'tu_luyen' and not public._dang_da_hoc_ok(v_hs, p_mon, p_ma_dang) then raise exception 'Dạng này lớp em chưa học tới nên chưa luyện được. Em chọn dạng khác nhé!'; end if;

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

  -- 11/11: đọc _hs_cau_lan_gap MỘT lần. Trong vòng lặp các câu vừa chọn được ghi thêm vào tu_luyen_dang_lan nhưng cũng đã nằm
  -- trong v_used_batch (bị loại ở mọi truy vấn) ⇒ kết quả chọn câu y hệt khi tra lại mỗi lần.
  select coalesce(array_agg(g.ma_cau), '{}'::text[]), coalesce(array_agg(g.lan_cuoi), '{}'::timestamptz[])
    into v_gap, v_gap_luc from public._hs_cau_lan_gap(v_hs) g;

  for i in 1..least(v_n, coalesce(v_cho, v_n)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau <> all($4)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_gap, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau <> all($3)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_gap, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join unnest($3::text[], $4::timestamptz[]) g(ma_cau, lan_cuoi) on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_gap, v_gap_luc;
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
