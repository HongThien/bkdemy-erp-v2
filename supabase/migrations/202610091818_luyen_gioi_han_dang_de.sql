-- ============================================================================
-- 202610091818 — luyen_gioi_han_dang_de: TRẦN SỐ CÂU/NGÀY CHO DẠNG DỄ (chống spam 1 dạng dễ)
-- ----------------------------------------------------------------------------
-- Thùy 09/10: "Cần 1 chế độ ngăn học sinh spam 1 dạng dễ — các dạng dễ học sinh chỉ được làm tối đa 20 câu / 1 ngày".
-- VÌ SAO: dạng dễ làm đi làm lại rất nhanh ⇒ cày lượt học thật (chuỗi · nhiệm vụ · thành tựu · BXH) mà không học thêm gì.
--
-- QUY TẮC (cấu hình ở bảng 1 dòng luyen_gioi_han — đổi không cần deploy):
--   · "Dạng dễ" = mức độ dạng (dai_ban_do/hgt_ban_do/khtn_ban_do/… .muc_do, 1–5, hàm _kho_muc_do_dang) ≤ muc_do_de_toi_da (mặc định 2: 1–2 = dễ).
--     Dạng chưa có mức độ ⇒ KHÔNG giới hạn (không chặn nhầm — thà thiếu còn hơn chặn sai, §1.5).
--   · Mỗi HS × môn × dạng dễ: tối đa tran_cau_ngay (mặc định 20) câu / ngày (giờ VN), tính theo câu ĐÃ SINH vào bài tự luyện
--     (tu_luyen_dang_lan, bai_test.loai='tu_luyen' — gồm Học theo chủ đề, Luyện dạng yếu, Thử thách). Mở bài rồi bỏ dở vẫn tính (chống mở–thoát–mở).
--   · KHÔNG áp cho: Học từ đầu · bổ trợ · ET · BTVN · bài thầy cô giao.
--   · Còn 1–9 câu của hạn mức: lượt đó ngắn lại đúng bằng số còn lại. Hết hạn mức: báo lỗi thân thiện ("đã luyện đủ N câu hôm nay").
--     Luyện dạng yếu (server chọn dạng): dạng dễ đã đủ trần bị LOẠI khỏi danh sách chọn.
-- GỒM: bảng luyen_gioi_han (+ RPC đổi fn_luyen_gioi_han_dat, chặn bằng co_quyen_ghi('tinh_nang')) · _luyen_con_cho_dang · fn_hs_luyen_con_lai ·
--   vá 5 hàm sinh bài (thân lấy từ bản ĐANG CHẠY): tu_luyen_chu_de_sinh ×3 · tu_luyen_sinh · _tu_luyen_chon_dang.
-- MẤT GÌ (Luật xoá): không xoá/thu hẹp gì; 5 hàm chỉ THÊM đoạn kiểm trần (create or replace).
-- ============================================================================

create table if not exists public.luyen_gioi_han (
  id integer primary key default 1 check (id = 1),
  bat boolean not null default true,
  muc_do_de_toi_da smallint not null default 2 check (muc_do_de_toi_da between 0 and 5),
  tran_cau_ngay integer not null default 20 check (tran_cau_ngay between 1 and 1000),
  updated_at timestamptz not null default now()
);
insert into public.luyen_gioi_han (id) values (1) on conflict (id) do nothing;
alter table public.luyen_gioi_han enable row level security;
revoke all on public.luyen_gioi_han from anon, authenticated;

create or replace function public._luyen_con_cho_dang(p_hs uuid, p_mon text, p_ma_dang text)
returns integer
language plpgsql stable security definer set search_path = public as $$
declare c record; v_md smallint; v_da integer;
begin
  select * into c from luyen_gioi_han where id = 1;
  if not found or not c.bat then return null; end if;
  v_md := public._kho_muc_do_dang(p_mon, p_ma_dang);
  if v_md is null or v_md > c.muc_do_de_toi_da then return null; end if;
  select count(*) into v_da
    from tu_luyen_dang_lan l join bai_test b on b.id = l.bai_test_id
   where l.hoc_sinh_id = p_hs and l.mon = p_mon and l.ma_dang = p_ma_dang and b.loai = 'tu_luyen'
     and (l.tao_at at time zone 'Asia/Ho_Chi_Minh')::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  return greatest(0, c.tran_cau_ngay - v_da);
end $$;
revoke all on function public._luyen_con_cho_dang(uuid, text, text) from public;
revoke execute on function public._luyen_con_cho_dang(uuid, text, text) from anon, authenticated;

-- Cho app hiển thị "còn N câu hôm nay" (null = dạng này không bị giới hạn)
create or replace function public.fn_hs_luyen_con_lai(p_mon text, p_ma_dang text)
returns integer
language sql stable security definer set search_path = public as $$
  select public._luyen_con_cho_dang(public.my_hoc_sinh_id(), p_mon, p_ma_dang)
$$;
revoke all on function public.fn_hs_luyen_con_lai(text, text) from public;
revoke execute on function public.fn_hs_luyen_con_lai(text, text) from anon;
grant execute on function public.fn_hs_luyen_con_lai(text, text) to authenticated;

-- Đổi cấu hình (admin): null = giữ nguyên giá trị cũ
create or replace function public.fn_luyen_gioi_han_dat(p_bat boolean default null, p_muc_do_de_toi_da smallint default null, p_tran_cau_ngay integer default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare r luyen_gioi_han;
begin
  if not public.co_quyen_ghi('tinh_nang') then raise exception 'Không có quyền đổi giới hạn luyện' using errcode = '42501'; end if;
  update luyen_gioi_han set bat = coalesce(p_bat, bat), muc_do_de_toi_da = coalesce(p_muc_do_de_toi_da, muc_do_de_toi_da),
         tran_cau_ngay = coalesce(p_tran_cau_ngay, tran_cau_ngay), updated_at = now() where id = 1 returning * into r;
  return to_jsonb(r);
end $$;
revoke all on function public.fn_luyen_gioi_han_dat(boolean, smallint, integer) from public;
revoke execute on function public.fn_luyen_gioi_han_dat(boolean, smallint, integer) from anon;
grant execute on function public.fn_luyen_gioi_han_dat(boolean, smallint, integer) to authenticated;

-- ── Vá 5 hàm sinh bài (thân = bản đang chạy + đoạn kiểm trần) ────────────────
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end); -- suy nhánh từ tiền tố mã dạng (DG/GT/KG)
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
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

  v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang);
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..least(10, coalesce(v_cho, 10)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh 9 lần gần nhất của dạng.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn tránh lặp gần đây.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    -- Tier 3: kho ít câu — chấp nhận lặp (CEO chốt cùng luật tự luyện tổng hợp), chỉ né trùng NGAY trong lượt này.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    -- Dạng hết sạch câu (kho cạn hẳn) → dừng lượt sớm, giữ số câu đã có (không lặp vô ích 10 lần).
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

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
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

  v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang);
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

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
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
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
    raise exception 'Dạng này chưa có câu trắc nghiệm — em học dạng này với thầy cô trên giấy nhé.';
  end if;
  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

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
        and not exists (select 1 from public._hs_cau_lan_gap($3) g where g.ma_cau = c.ma_cau)
      order by %3$s random() limit 1
    $q$, v_cautbl, v_dk, v_uu_tien)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    if v_ma_cau is null then
      -- Hết câu chưa gặp ⇒ câu gặp LÂU NHẤT trước (không bốc ngẫu nhiên câu vừa làm).
      execute format($q$
        select c.ma_cau from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null
          and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, %3$s random() limit 1
      $q$, v_cautbl, v_dk, v_uu_tien)
      into v_ma_cau using v_ma_dang, v_used_batch, v_hs;
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

CREATE OR REPLACE FUNCTION public._tu_luyen_chon_dang(p_hs uuid, p_mon text, p_so integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_dangs text[]; v_all text[]; v_yeu text[]; v_out jsonb := '[]'::jsonb; i int;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- mọi dạng của môn (bản đồ gốc + nhánh hình) — cùng cách fn_nhiem_vu_hoan_thanh lấy danh sách dạng (§1.6)
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;
  select array_agg(m.ma_dang order by m.score asc, m.ma_dang) into v_all
    from public.fn_mastery_cells(array[p_hs], true, null, 5, 5, 3) m
   where m.hoc_sinh_id = p_hs and m.ma_dang = any(v_dangs) and m.score is not null
     -- trần ngày dạng dễ (Thùy 09/10): dạng dễ đã đủ số câu hôm nay thì không chọn nữa
     and coalesce(public._luyen_con_cho_dang(p_hs, p_mon, m.ma_dang), 1) > 0;
  if v_all is null or cardinality(v_all) = 0 then return '[]'::jsonb; end if;   -- chưa có số đo nào ⇒ không có gì để luyện
  v_yeu := v_all[1 : greatest(1, ceil(cardinality(v_all) / 2.0)::int)];
  for i in 1..p_so loop
    v_out := v_out || to_jsonb(case when random() < 0.6 then v_yeu[1 + floor(random() * cardinality(v_yeu))::int]
                                    else v_all[1 + floor(random() * cardinality(v_all))::int] end);
  end loop;
  return v_out;
end $function$;

