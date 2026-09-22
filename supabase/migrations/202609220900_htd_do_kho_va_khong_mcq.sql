-- ============================================================================
-- 202609220900 — htd_do_kho_va_khong_mcq
-- ----------------------------------------------------------------------------
-- Thùy 21-22/09 (sửa lại spec Bổ trợ đuổi từ đầu, sau khi xem mockup):
--   1. Bài TEST của "Học từ đầu" (htd_test) số câu phụ thuộc ĐỘ KHÓ CỦA DẠNG
--      (`dai_ban_do.muc_do`/`hgt_ban_do.muc_do`/`khtn_ban_do.muc_do`, 1-5, đã verify
--      đủ dữ liệu 118/181/280/91/28 dòng cho mức 1..5): dạng khó (4-5) → 3 câu,
--      dạng dễ hơn (≤3) → 5 câu. muc_do nằm Ở CẤP DẠNG (không phải cấp câu) —
--      không phải "trộn nhiều mức khó trong 1 bài", mà "số câu tuỳ độ khó dạng đó".
--   2. Dạng KHÔNG có câu MCQ hiện RAISE EXCEPTION chặn cứng ("Kho câu tạm hết cho
--      dạng này") → HS bế tắc, đúng bug CEO mô tả. Sửa: hết câu MCQ (theo
--      _kho_dk_online_hs_sql) thì CHUYỂN sang chọn câu BẤT KỲ LOẠI (kho_chuẩn,
--      dùng lại _htd_chon_cau_bat_ky đã có từ mig 202609212145) — HS luôn thấy
--      được đề. App HS render READ-ONLY khi câu không phải trắc nghiệm (xem code
--      client), TA chấm ĐCS qua fn_botro_cham_tay/fn_botro_giay_nop đã có sẵn.
--      KHÔNG phải "nhánh lùi tự động chấm TLN" (CEO 20/09 đã cấm) — đây là
--      hiện-đề + TA chấm tay, khác hẳn bản chất.
--
-- ⚠ `tu_luyen_chu_de_sinh` DÙNG CHUNG cho Tự luyện thường (p_loai='tu_luyen') VÀ
--   Học từ đầu (p_loai='htd_luyen'/'htd_test') — CHỈ sửa 2 nhánh htd_*, nhánh
--   tu_luyen giữ NGUYÊN 100% hành vi cũ (vẫn 10 câu, vẫn chặn cứng khi hết MCQ —
--   ngoài phạm vi yêu cầu này, không tự ý đổi).
--
-- Chỉ sửa ĐÚNG 1 overload (3 tham số p_mon, p_ma_dang, p_loai — bản htdSinh() gọi).
-- KHÔNG đụng overload 2 tham số hay overload có p_chi_cau_moi (dùng cho màn khác).
--
-- Không viết vào tu_luyen_dang_lan cho câu lấy theo đường fallback (bảng đó phục
-- vụ chống-lặp CHO ĐƯỜNG MCQ) — chấp nhận đơn giản hoá, không critical (kho non-MCQ
-- thường ít câu, lặp sớm hơn 1 chút không sai lệch gì, chỉ kém đa dạng).
--
-- MẤT GÌ (Luật xoá): không — CREATE OR REPLACE, không đổi bảng/cột.
-- ============================================================================

-- ── Độ khó (muc_do 1-5) của 1 dạng — tra đúng bảng ban_do theo môn/nhánh ────────────
create or replace function public._kho_muc_do_dang(p_mon text, p_ma_dang text)
returns smallint
language plpgsql stable as $$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $$;

create or replace function public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text DEFAULT 'tu_luyen'::text)
returns jsonb
language plpgsql
security definer
set search_path to 'public' as $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := case when p_ma_dang like 'GT%' then 'hinh_gt' else null end;
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
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

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

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
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
