-- ============================================================================
-- LÁT A — "LƯỢT HỌC THẬT" + luật KHÔNG RA LẠI CÂU ĐÃ GẶP (spec-v1-app-hs.md §2, Thùy chốt 01/10/2026)
--
-- Đo 30 ngày (1.869 lượt tự luyện 10 câu): 0–2 câu đúng ≈ 3,4 giây/câu (bấm bừa) · 5–8 đúng ≈ 16–19 giây/câu (làm thật) ·
-- 9–10 đúng ≈ 5 giây/câu với 64% câu ĐÃ GẶP (nhớ đáp án). Nguyên nhân phần sau: hàm sinh câu chỉ tránh câu của 10 lượt gần
-- nhất CỦA RIÊNG DẠNG ĐÓ trong tự luyện, không biết câu em đã gặp ở ET/BTVN/bài trên lớp; hết thì bốc ngẫu nhiên.
--
-- Luật mới:
--   ① Không ra lại câu em ĐÃ GẶP ở bất kỳ bài nào trên app khi kho dạng đó còn câu mới. Hết câu mới ⇒ câu gặp LÂU NHẤT trước.
--   ② 1 lượt luyện thêm (bai_test.loai = 'tu_luyen' — gồm Tổng hợp, Chủ đề, Thử thách) là "lượt học thật" khi:
--      số câu ≥ 5 · đúng ≥ 50% (10 câu ⇒ ≥ 5) · trung bình ≥ 6 giây/câu (từ lúc mở lượt tới câu cuối ÷ số câu).
--      ET, BTVN, bài trên lớp, Học từ đầu KHÔNG phải lượt luyện thêm (Thùy 01/10: chuỗi chỉ tính Tự luyện + Thử thách).
--   ③ "Câu đúng mới" = câu đúng mà trước đó em CHƯA từng làm đúng (dùng cho số đếm nhiệm vụ / giải đấu sau này).
-- Chuỗi làm bài (lát B), nhiệm vụ, cổng game đọc CÙNG 1 nguồn: public._luot_hoc_that().
-- ============================================================================

-- ── 1. Ngưỡng (1 chỗ duy nhất — đổi số thì đổi ở đây) ──
create or replace function public._luot_hoc_that_nguong()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'so_cau_toi_thieu', 5,     -- lượt ít hơn 5 câu (kho thiếu) không xét
    'ti_le_dung', 0.5,         -- Thùy 01/10: 10 câu đúng ≥ 5
    'giay_tb_toi_thieu', 6     -- Thùy 01/10: "dưới 6s trung bình" = bấm bừa
  )
$$;

-- ── 2. Câu em đã gặp (mọi bài trên app) + lần gặp gần nhất ──
-- Nguồn: câu đã được ra cho em ở tự luyện (tu_luyen_dang_lan, kể cả chưa trả lời) ∪ mọi câu em đã trả lời ở mọi bài.
create or replace function public._hs_cau_lan_gap(p_hs uuid)
returns table (ma_cau text, lan_cuoi timestamptz)
language sql stable as $$
  select x.ma_cau, max(x.luc)
  from (
    select l.ma_cau, l.tao_at as luc
    from public.tu_luyen_dang_lan l
    where l.hoc_sinh_id = p_hs
    union all
    select t.ma_cau, blc.cham_at
    from public.bai_lam bl
    join public.bai_lam_cau blc on blc.bai_lam_id = bl.id
    join public.bai_test_cau t on t.id = blc.bai_test_cau_id
    where bl.hoc_sinh_id = p_hs and t.ma_cau is not null
  ) x
  group by x.ma_cau
$$;

-- ── 4. Lượt học thật (nguồn DUY NHẤT cho chuỗi / nhiệm vụ / cổng game) ──
create or replace function public._luot_hoc_that(p_hs uuid, p_tu timestamptz, p_den timestamptz)
returns table (
  bai_lam_id uuid, mon text, nop_at timestamptz, ngay date, thu_thach boolean,
  so_cau integer, dung integer, dung_moi integer, giay_tb numeric, tinh boolean, ly_do text
)
language sql stable as $$
  with ng as (select public._luot_hoc_that_nguong() j),
  l as (
    select bl.id, bt.mon, bl.nop_at, bl.bat_dau_at, coalesce(bt.thu_thach, false) tt
    from public.bai_lam bl
    join public.bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = p_hs and bl.trang_thai = 'da_nop' and bt.loai = 'tu_luyen'
      and bl.nop_at >= p_tu and bl.nop_at < p_den
  ),
  c as (
    select l.id,
      count(*)::int as so_cau,
      count(*) filter (where blc.verdict = 'correct')::int as dung,
      count(*) filter (where blc.verdict = 'correct' and not exists (
        select 1 from public.bai_lam bl2
        join public.bai_lam_cau b2 on b2.bai_lam_id = bl2.id
        join public.bai_test_cau t2 on t2.id = b2.bai_test_cau_id
        where bl2.hoc_sinh_id = p_hs and bl2.id <> l.id and t2.ma_cau = t.ma_cau
          and b2.verdict = 'correct' and b2.cham_at < blc.cham_at))::int as dung_moi,
      extract(epoch from max(blc.cham_at) - l.bat_dau_at) / nullif(count(*), 0) as giay_tb
    from l
    join public.bai_lam_cau blc on blc.bai_lam_id = l.id
    join public.bai_test_cau t on t.id = blc.bai_test_cau_id
    group by l.id, l.bat_dau_at
  )
  select l.id, l.mon, l.nop_at, (l.nop_at at time zone 'Asia/Ho_Chi_Minh')::date, l.tt,
    c.so_cau, c.dung, c.dung_moi, round(c.giay_tb::numeric, 1),
    (c.so_cau >= (ng.j->>'so_cau_toi_thieu')::int
      and c.dung >= ceil(c.so_cau * (ng.j->>'ti_le_dung')::numeric)
      and c.giay_tb >= (ng.j->>'giay_tb_toi_thieu')::numeric),
    case
      when c.so_cau < (ng.j->>'so_cau_toi_thieu')::int then 'it_cau'
      when c.dung < ceil(c.so_cau * (ng.j->>'ti_le_dung')::numeric) then 'duoi_nguong'
      when c.giay_tb < (ng.j->>'giay_tb_toi_thieu')::numeric then 'qua_nhanh'
    end
  from l join c on c.id = l.id cross join ng
$$;

-- ── 5. Cho app HS: 1 lượt em vừa nộp có được tính không (màn kết quả báo "lượt này em làm nhanh quá, chưa tính") ──
create or replace function public.fn_luot_hoc_that_ket_qua(p_bai_lam_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select to_jsonb(r) into v
  from public._luot_hoc_that(v_hs, '-infinity', 'infinity') r
  where r.bai_lam_id = p_bai_lam_id;
  return coalesce(v, jsonb_build_object('tinh', false, 'ly_do', 'khong_phai_luot_luyen'))
    || jsonb_build_object('nguong', public._luot_hoc_that_nguong());
end $$;

-- ── 3. Ba hàm sinh câu: bỏ "tránh 10 lượt gần nhất của dạng", thay bằng "không ra câu đã gặp ở BẤT KỲ bài nào khi kho còn câu mới" ──
-- Thân hàm lấy NGUYÊN bản đang chạy (pg_get_functiondef 01/10), chỉ thay các đoạn loại trừ câu + bậc cuối "hết kho".

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
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
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
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
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
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai = 'htd_test' then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..v_n loop
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

  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- ── 6. Quyền: hàm nội bộ (_*) không cho gọi thẳng qua API — lộ lịch sử câu của em khác. ──
-- Revoke cả anon TƯỜNG MINH (CLAUDE §2.1: áp bằng SQL Editor thì anon được grant riêng, revoke public không đủ).
revoke all on function public._luot_hoc_that_nguong() from public, anon, authenticated;
revoke all on function public._hs_cau_lan_gap(uuid) from public, anon, authenticated;
revoke all on function public._luot_hoc_that(uuid, timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.fn_luot_hoc_that_ket_qua(uuid) from public, anon;
grant execute on function public.fn_luot_hoc_that_ket_qua(uuid) to authenticated;
