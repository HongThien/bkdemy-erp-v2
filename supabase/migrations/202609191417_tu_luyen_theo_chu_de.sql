-- ============================================================================
-- 202609191417 — tu_luyen_theo_chu_de
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 19/09): Tự luyện tách 2 loại — "Tự luyện tổng hợp" (hiện có, HS
--   không chọn được dạng, hệ tự rải theo yếu/ngẫu nhiên) và "Tự luyện theo chủ
--   đề" (MỚI): HS xem danh sách dạng + % đã luyện qua trong kho dạng đó, chọn
--   1 dạng, luyện đúng 10 câu CHỈ của dạng đó. CEO chốt qua hỏi lại (19/09):
--   · "% hoàn thành" = COVERAGE (đã luyện qua bao nhiêu % số câu có trong kho
--     của dạng), KHÔNG phải điểm đúng/sai (mastery vẫn tính riêng, không đổi).
--   · "Số bài tối thiểu bằng số cụm" — CEO tự sửa lại ý: không phải ép số câu,
--     mà là 10 câu/lượt phải RẢI ĐỀU cụm (`ma_cum`) — không được lấy cả 10 câu
--     trong 1 cụm mà bỏ qua cụm khác của cùng dạng.
--   · Danh sách dạng CHỈ trong chương trình/khối lớp hiện tại của HS (giống
--     tự luyện tổng hợp), không phải toàn bộ kho môn.
--
-- KIẾN TRÚC — tái dùng NGUYÊN hạ tầng tự luyện đã có, không xây riêng:
--   · Dispatch môn→bảng: same registry _kho_ban_do_tbl/_kho_cau_tbl/_kho_lt_tbl
--     (mig 202608201111). Toán = COALESCE dai+hgt (mirror hs_dang_evals, mig
--     202609...), KHTN = khtn riêng.
--   · Điều kiện "câu chấm online được" = ĐÚNG _kho_dk_online_hs_sql (mig
--     202609131530 — chỉ trắc_nghiệm/form TN đã duyệt, luật MCQ-only áp dụng
--     luôn cho nhánh chủ đề, không tạo luật riêng).
--   · Snapshot câu = ĐÚNG _kho_snapshot_cau (mig 202609080259) — không copy lại
--     logic, tránh lặp bug "loai_cau bị gán sai" đã vá cho BTVN (mig 202609132030).
--   · Coverage + chống lặp = ĐÚNG bảng tu_luyen_dang_lan có sẵn — "theo chủ đề"
--     và "tổng hợp" ghi CHUNG 1 sổ, nên luyện qua đường nào cũng cộng dồn vào
--     % hoàn thành của dạng (đúng tinh thần "đã luyện qua", không tách nguồn).
--   · bai_test loai vẫn 'tu_luyen' (không thêm loại mới) — mastery/xếp hạng/
--     May mắn đọc theo loai='tu_luyen' xuyên suốt, không cần sửa gì ở đó.
--
-- MẤT GÌ: không mất — chỉ thêm 2 function mới. Không đụng bảng/dữ liệu cũ.
-- ============================================================================

-- ── ① Danh sách dạng (khối hiện tại) + % đã luyện qua ──────────────────────
create or replace function public.tu_luyen_chu_de_ds_dang(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi text;
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_khoi is null then return '[]'::jsonb; end if;

  if p_mon = 'KHTN' then
    v_dk := public._kho_dk_online_hs_sql('khtn_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from khtn_ban_do bd
      join lateral (select count(*) as tong_cau from khtn_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_part;
  else
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;
  end if;

  -- Gắn da_luyen/pct từ sổ tu_luyen_dang_lan (bảng cố định, không cần dynamic SQL).
  -- least(...) chặn pct>100% nếu câu đã luyện bị xoá mềm khỏi kho sau đó (kho co lại, sổ vẫn còn).
  select coalesce(jsonb_agg(
    x || jsonb_build_object(
      'da_luyen', least(coalesce(tl.da_luyen, 0), (x->>'tong_cau')::int),
      'pct', round(least(coalesce(tl.da_luyen, 0), (x->>'tong_cau')::int) * 100.0 / (x->>'tong_cau')::int)
    )
    order by x->>'ten_chuyen_de', x->>'ten_dang'
  ), '[]'::jsonb)
  into v_out
  from jsonb_array_elements(v_out) x
  left join (
    select ma_dang, count(distinct ma_cau) as da_luyen
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon
    group by ma_dang
  ) tl on tl.ma_dang = x->>'ma_dang';

  return v_out;
end $$;
grant execute on function public.tu_luyen_chu_de_ds_dang(text) to authenticated;
revoke execute on function public.tu_luyen_chu_de_ds_dang(text) from anon;

-- ── ② Sinh 1 lượt 10 câu CHỈ trong 1 dạng, rải đều cụm ──────────────────────
create or replace function public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := case when p_ma_dang like 'GT%' then 'hinh_gt' else null end; -- suy nhánh từ tiền tố mã dạng (DG/GT/KG)
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
  i integer;
begin
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
end $$;
grant execute on function public.tu_luyen_chu_de_sinh(text, text) to authenticated;
revoke execute on function public.tu_luyen_chu_de_sinh(text, text) from anon;
