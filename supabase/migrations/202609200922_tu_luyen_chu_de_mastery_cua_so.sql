-- ============================================================================
-- 202609200922 — tu_luyen_chu_de_mastery_cua_so
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 20/09, sau khi xem bản đầu "Tự luyện theo chủ đề" 19/09):
--   1. "%" đang hiện SAI Ý — coverage (đã luyện qua bao nhiêu % câu trong kho),
--      CEO muốn = phần trăm ĐÁNH GIÁ (mastery) của dạng đó — tái dùng ĐÚNG công
--      thức đã có `fn_mastery_cells` (WINDOW=5, Đ=1/C=0.5/S=0), KHÔNG bịa công
--      thức riêng (CLAUDE.md §2.0). Ví dụ CEO: "5 lần gần nhất 3Đ 1C 1S = 70%"
--      → (3×1 + 1×0.5 + 1×0)/5 = 0.7 — khớp CHÍNH XÁC fn_mastery_cells.
--   2. Sắp xếp: YẾU NHẤT lên đầu (pct thấp → cao) để HS luyện đúng chỗ cần.
--   3. Toggle "chỉ luyện câu MỚI" — câu chưa làm trong CỬA SỔ hiện tại + cửa sổ
--      trước. "Cửa sổ" = ĐÚNG khái niệm đã có sẵn trong `src/gami/danhgia.js`
--      (spec-danhgia-hoctap.md/PLAN-danhgia-hoctap.md, KHÔNG phải khái niệm
--      mới): nửa tháng cố định, ngày 1-15 = nửa A, 16-cuối tháng = nửa B. "2
--      cửa sổ gần nhất" = cửa sổ hiện tại + cửa sổ liền trước (~1 tháng).
--   4. Rule mới cho "%": nếu KHÔNG có lần đo nào trong cửa sổ hiện tại + cửa sổ
--      trước → hiện "chưa đánh giá được" thay vì dùng dữ liệu CŨ (không chính
--      xác cho HS xem "mình đang yếu gì NGAY BÂY GIỜ"). Lưu ý: đây là gate HIỂN
--      THỊ RIÊNG cho màn này — KHÔNG đụng `fn_mastery_cells`/`danhgia.js` dùng
--      cho bổ trợ/level (nơi đó CỐ Ý giữ điểm cũ khi cửa sổ vắng bài, tránh
--      "tụt hạng giả" — xem comment `dangDoiBucketXau` trong danhgia.js).
--
-- KIẾN TRÚC: tái dùng `fn_mastery_cells` NGUYÊN VẸN (gọi 2 lần: 1 lần không giới
--   hạn thời gian lấy SCORE thật, 1 lần với p_since=đầu-cửa-sổ-trước chỉ để biết
--   dạng có hoạt động GẦN ĐÂY hay không) — không viết công thức mastery riêng.
--   Cửa sổ tính = PORT chính xác `cuaSoCua`/`cuaSoTruoc` (danhgia.js) sang SQL.
--
-- MẤT GÌ: không — CREATE OR REPLACE 2 hàm đã có (chỉ đổi cách tính pct/thứ tự +
--   thêm 1 tham số CÓ DEFAULT), thêm 1 hàm helper mới. Không đụng bảng/dữ liệu.
-- ============================================================================

-- ── Helper: mốc UTC = ĐẦU của "cửa sổ liền trước" (giờ VN) — dùng chung cho cả
--    gate hiển thị lẫn lọc câu mới. Port từ cuaSoCua/cuaSoTruoc (gami/danhgia.js):
--    nửa A = ngày 1-15, nửa B = 16-cuối tháng. "Cửa sổ trước" của nửa A tháng
--    này là nửa B tháng trước (bắt đầu 16 tháng trước); của nửa B là nửa A cùng
--    tháng (bắt đầu ngày 1).
create or replace function public._tu_luyen_dau_cua_so_truoc()
returns timestamptz language sql stable as $$
  select case
    when extract(day from (now() at time zone 'Asia/Ho_Chi_Minh'))::int <= 15
      then ((date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')::date) - interval '1 month') + interval '15 days')::date
    else date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date
  end::timestamp at time zone 'Asia/Ho_Chi_Minh'
$$;

-- ── ① Danh sách dạng + % = MASTERY (không phải coverage) ────────────────────
create or replace function public.tu_luyen_chu_de_ds_dang(p_mon text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi text;
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
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

  -- Gắn da_luyen (coverage — vẫn hiện, chỉ KHÔNG còn dùng làm "%") từ sổ tu_luyen_dang_lan.
  select coalesce(jsonb_agg(
    x || jsonb_build_object('da_luyen', least(coalesce(tl.da_luyen, 0), (x->>'tong_cau')::int))
    order by x->>'ten_chuyen_de', x->>'ten_dang'
  ), '[]'::jsonb)
  into v_out
  from jsonb_array_elements(v_out) x
  left join (
    select ma_dang, count(distinct ma_cau) as da_luyen
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon
    group by ma_dang
  ) tl on tl.ma_dang = x->>'ma_dang';

  -- % = MASTERY thật (fn_mastery_cells, KHÔNG bịa công thức riêng — §2.0). Gọi 2 lần:
  --   (a) không giới hạn thời gian → SCORE thật (WINDOW=5 chuẩn, không bị cắt cụt).
  --   (b) p_since = đầu cửa sổ trước → CHỈ để biết dạng có hoạt động GẦN ĐÂY không.
  --   Dạng KHÔNG có ở (b) ⇒ "chưa đánh giá được" (pct=null), dù (a) có thể vẫn ra số
  --   từ dữ liệu CŨ — không hiện số đó ra màn (không chính xác cho ngữ cảnh "luyện gì bây giờ").
  return (
    with full_score as (
      select ma_dang, score, muc from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)
    ),
    recent as (
      select distinct ma_dang from public.fn_mastery_cells(array[v_hs], true, v_cutoff, 5, 5, 3)
    ),
    lst as (
      select x, fs.score, fs.muc, (r.ma_dang is not null) as gan_day
      from jsonb_array_elements(v_out) x
      left join full_score fs on fs.ma_dang = x->>'ma_dang'
      left join recent r on r.ma_dang = x->>'ma_dang'
    )
    select coalesce(jsonb_agg(
      x || jsonb_build_object(
        'pct', case when gan_day and score is not null then round(score * 100) else null end,
        'muc', case when gan_day then muc else null end
      )
      -- Yếu nhất lên đầu; "chưa đánh giá được" (pct null) xuống CUỐI (không phải yếu, là KHÔNG RÕ).
      order by (case when gan_day and score is not null then 0 else 1 end), score asc, x->>'ten_dang'
    ), '[]'::jsonb)
    from lst
  );
end $$;
grant execute on function public.tu_luyen_chu_de_ds_dang(text) to authenticated;
revoke execute on function public.tu_luyen_chu_de_ds_dang(text) from anon;

-- ── ② Sinh lượt — thêm p_chi_cau_moi: chỉ chọn câu CHƯA luyện trong 2 cửa sổ gần nhất ──
create or replace function public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := case when p_ma_dang like 'GT%' then 'hinh_gt' else null end;
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

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh lặp — cửa sổ loại trừ tuỳ chế độ:
    --   p_chi_cau_moi=true  → câu KHÔNG nằm trong 2 cửa sổ gần nhất (tao_at >= v_cutoff).
    --   p_chi_cau_moi=false → như cũ, tránh 9 lần (batch) gần nhất (lan_thu > v_lan_thu-10).
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1
            and (case when $8 then tao_at >= $7 else lan_thu > $6 - 10 end))
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1
              and (case when $7 then tao_at >= $6 else lan_thu > $5 - 10 end))
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
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

  if v_ok_count = 0 and p_chi_cau_moi then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác (không tạo tu_luyen_dang_lan nên xoá an toàn)
    raise exception 'Em đã luyện hết câu MỚI của dạng này trong 2 kỳ gần nhất — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $$;
grant execute on function public.tu_luyen_chu_de_sinh(text, text, boolean) to authenticated;
revoke execute on function public.tu_luyen_chu_de_sinh(text, text, boolean) from anon;
