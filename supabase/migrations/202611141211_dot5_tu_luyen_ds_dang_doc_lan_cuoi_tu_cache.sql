-- Đợt 5 — màn DANH SÁCH DẠNG TỰ LUYỆN của HS (tu_luyen_chu_de_ds_dang): bỏ lượt tính lại mastery từ lịch sử. Thùy gật 14/11 "Sửa màn tự luyện".
-- Đo 14/11 (vai HS thật, đã trừ mạng): cả hàm 143–228 ms, trong đó 131–217 ms là MỘT lượt
--   fn_mastery_cells_moi(hs, true, <đầu cửa sổ trước>) — tính lại mastery từ lịch sử làm bài chỉ để biết "dạng này em có đo gần đây không".
--   Lượt đó không dùng được cache vì cache không lưu thời điểm đo gần nhất. Đọc mastery toàn bộ (cache) chỉ 2–3 ms.
-- Làm: (1) hàm tính mastery trả thêm lần đo gần nhất của từng nút (_mastery_lan_cap_t = thân cũ + max(t); _mastery_lan_cap thành vỏ bọc, chữ ký giữ nguyên)
--      (2) mastery_luu_san thêm cột lan_cuoi, fn_mastery_lam_moi ghi cột đó  (3) _tu_luyen_mastery_dang: điểm + gan_day trong một lượt đọc
--      (4) tu_luyen_chu_de_ds_dang dùng (3).  "Gần đây" = lan_cuoi >= greatest(mốc, now() − 30 ngày) — đúng cửa sổ mà lượt gọi cũ tính.
-- KHÔNG đổi công thức điểm / mức / độ tin. Em chưa sạch hoặc dòng cache chưa có lan_cuoi ⇒ tính trực tiếp (một lượt, vẫn rẻ hơn hai lượt cũ).
-- Thân 3 hàm sinh từ định nghĩa đang sống (khoá md5), thay đúng từng khối.

-- (1a) hàm tính có thêm cột
CREATE OR REPLACE FUNCTION public._mastery_lan_cap_t(p_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 RETURNS TABLE(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text, t_cuoi timestamp with time zone)
 LANGUAGE sql
 STABLE ROWS 20000
AS $function$
  with d as materialized (
    -- Thùy 10/11: mastery tối đa 30 ngày tính tới mốc (p_den hoặc bây giờ)
    select * from public._mastery_lan_d(p_bdm, p_hs, p_include_btvn,
                                        greatest(p_since, coalesce(p_den, now()) - interval '30 days'), p_den)
  ),
  lan as (
    select hoc_sinh_id, 'dang'::text as cap, dang as nut, luot, bool_or(hh) as hh, avg(value) as p, max(t) as t
    from d where 'dang' = any(p_caps) group by hoc_sinh_id, dang, luot
    union all
    select hoc_sinh_id, 'nhom', nhom, luot, bool_or(hh), avg(value), max(t)
    from d where 'nhom' = any(p_caps) and nhom is not null group by hoc_sinh_id, nhom, luot
    union all
    select hoc_sinh_id, 'chuyen_de', chuyen_de, luot, bool_or(hh), avg(value), max(t)
    from d where 'chuyen_de' = any(p_caps) and chuyen_de is not null group by hoc_sinh_id, chuyen_de, luot
    union all
    select hoc_sinh_id, 'chu_de', chu_de, luot, bool_or(hh), avg(value), max(t)
    from d where 'chu_de' = any(p_caps) and chu_de is not null group by hoc_sinh_id, chu_de, luot
  ),
  rk as (
    select lan.*,
           row_number() over (partition by hoc_sinh_id, cap, nut order by t desc, luot desc) as rn,
           -- Hình–Học (CEO 14/10): thang 3 thay 5, độ tin 3/2
           case when hh then least(p_window, 3)  else p_window  end as cs,
           case when hh then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from lan
  )
  select hoc_sinh_id, cap, nut,
         avg(p) filter (where rn <= cs) as score,     -- mọi lần ngang nhau
         count(*) as n,                               -- n = SỐ LẦN (trong 30 ngày)
         case when avg(p) filter (where rn <= cs) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= cs) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end,
         max(t)                                       -- [14/11] lần đo gần nhất của nút trong cửa sổ
  from rk
  group by hoc_sinh_id, cap, nut
$function$;

-- (1b) vỏ bọc giữ chữ ký cũ — mọi nơi gọi _mastery_lan_cap không đổi
create or replace function public._mastery_lan_cap(p_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language sql
 stable rows 20000
as $function$
  select m.hoc_sinh_id, m.cap, m.nut, m.score, m.n, m.muc, m.tin
  from public._mastery_lan_cap_t(p_bdm, p_hs, p_include_btvn, p_since, p_den, p_caps, p_window, p_tin_cao, p_tin_tb) m
$function$;

-- (2) cột lan_cuoi đã thêm ở migration 202611141210 (tách riêng để không giữ khoá bảng)

CREATE OR REPLACE FUNCTION public.fn_mastery_lam_moi(p_giay integer DEFAULT 20)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_t0 timestamptz := clock_timestamp(); v_moc timestamptz := clock_timestamp() - interval '2 minutes';
        v_bdm boolean := public._mastery_bdm_bat(); v_lo uuid[]; v_xong uuid[] := '{}';
begin
  if not public._mastery_theo_lan_bat() then return 0; end if;
  if not pg_try_advisory_xact_lock(hashtext('fn_mastery_lam_moi')) then return -1; end if;   -- đang có lượt khác chạy
  loop
    exit when clock_timestamp() - v_t0 > make_interval(secs => greatest(1, least(coalesce(p_giay, 20), 240)));
    -- em bẩn (nhật ký mới hơn mốc), cũ nhất trước; bỏ em vừa làm trong lượt này
    select coalesce(array_agg(z.hs), '{}') into v_lo
    from (select l.hoc_sinh_id as hs, min(l.at) as tu
            from mastery_ban_log l left join mastery_luu_san_tinh t on t.hoc_sinh_id = l.hoc_sinh_id
           where (t.hoc_sinh_id is null or l.at > t.moc) and not (l.hoc_sinh_id = any(v_xong))
           group by l.hoc_sinh_id order by min(l.at) limit 20) z;
    if cardinality(v_lo) = 0 then
      select coalesce(array_agg(h.id), '{}') into v_lo
      from (select h.id from hoc_sinh h
            where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id)
              and not (h.id = any(v_xong))
            order by h.id limit 20) h;
    end if;
    if cardinality(v_lo) = 0 then   -- 10/11: bản chụp cũ thiếu cấp chuyên đề/chủ đề (mig 202611101756) ⇒ chụp lại dần, cũ nhất trước
      select coalesce(array_agg(z.hoc_sinh_id), '{}') into v_lo
      from (select t.hoc_sinh_id from mastery_luu_san_tinh t
            where exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'nhom')
              and not exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = t.hoc_sinh_id and s.cap = 'chuyen_de')
              and not (t.hoc_sinh_id = any(v_xong))
            order by t.tinh_at limit 20) z;
    end if;
    exit when cardinality(v_lo) = 0;
    -- [14/11] ghi PHẦN KHÁC BIỆT (trước: xoá hết dòng của em rồi chèn lại — ~135 dòng / em / lượt dù không đổi gì)
    with moi as materialized (
      select m.hoc_sinh_id, false as btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin, m.t_cuoi as lan_cuoi
        from public._mastery_lan_cap_t(v_bdm, v_lo, false, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
      union all
      select m.hoc_sinh_id, true, m.cap, m.nut, m.score, m.n, m.muc, m.tin, m.t_cuoi
        from public._mastery_lan_cap_t(v_bdm, v_lo, true, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m where m.score is not null
    ), xoa as (   -- nút không còn trong kết quả mới
      delete from mastery_luu_san s
       where s.hoc_sinh_id = any(v_lo)
         and not exists (select 1 from moi m where m.hoc_sinh_id = s.hoc_sinh_id and m.btvn = s.btvn and m.cap = s.cap and m.nut = s.nut)
    )
    insert into mastery_luu_san (hoc_sinh_id, btvn, cap, nut, score, n, muc, tin, lan_cuoi)
    select m.hoc_sinh_id, m.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin, m.lan_cuoi from moi m
    on conflict (hoc_sinh_id, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin, lan_cuoi = excluded.lan_cuoi
      where (mastery_luu_san.score, mastery_luu_san.n, mastery_luu_san.muc, mastery_luu_san.tin, mastery_luu_san.lan_cuoi)
            is distinct from (excluded.score, excluded.n, excluded.muc, excluded.tin, excluded.lan_cuoi);
    -- 13/11: cache môn MỘT VÙNG (KHTN · Vật lý · Hóa học) cùng lượt, cùng sổ em bẩn — chỉ em có lớp môn đó đang học
    with moi as materialized (
      select m.hoc_sinh_id, m.mon, b.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin
        from (values (false), (true)) b(btvn)
        cross join lateral public._mastery_mon_cap(
          array(select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                 where hl.hoc_sinh_id = any(v_lo) and hl.trang_thai = 'dang_hoc' and l.mon = any(public._mastery_mon_ds())),
          b.btvn, null, null, array['dang', 'nhom', 'chuyen_de', 'chu_de'], 5, 5, 3) m
       where m.score is not null
    ), xoa as (
      delete from mastery_luu_san_mon s
       where s.hoc_sinh_id = any(v_lo)
         and not exists (select 1 from moi m where m.hoc_sinh_id = s.hoc_sinh_id and m.mon = s.mon and m.btvn = s.btvn and m.cap = s.cap and m.nut = s.nut)
    )
    insert into mastery_luu_san_mon (hoc_sinh_id, mon, btvn, cap, nut, score, n, muc, tin)
    select m.hoc_sinh_id, m.mon, m.btvn, m.cap, m.nut, m.score, m.n, m.muc, m.tin from moi m
    on conflict (hoc_sinh_id, mon, btvn, cap, nut) do update
      set score = excluded.score, n = excluded.n, muc = excluded.muc, tin = excluded.tin
      where (mastery_luu_san_mon.score, mastery_luu_san_mon.n, mastery_luu_san_mon.muc, mastery_luu_san_mon.tin)
            is distinct from (excluded.score, excluded.n, excluded.muc, excluded.tin);
    insert into mastery_luu_san_tinh (hoc_sinh_id, tinh_at, moc) select unnest(v_lo), now(), v_moc
      on conflict (hoc_sinh_id) do update set tinh_at = excluded.tinh_at, moc = excluded.moc;
    v_xong := v_xong || v_lo;
  end loop;
  -- dọn nhật ký cũ đã nằm dưới mốc (không đụng dòng mới đang chèn)
  delete from mastery_ban_log l using mastery_luu_san_tinh t
   where t.hoc_sinh_id = l.hoc_sinh_id and l.at <= t.moc and l.at < clock_timestamp() - interval '10 minutes';
  return (select count(distinct l.hoc_sinh_id) from mastery_ban_log l left join mastery_luu_san_tinh t on t.hoc_sinh_id = l.hoc_sinh_id
           where t.hoc_sinh_id is null or l.at > t.moc)::int
       + (select count(*) from hoc_sinh h where h.trang_thai = 'dang_hoc' and not exists (select 1 from mastery_luu_san_tinh t where t.hoc_sinh_id = h.id))::int;
end $function$;

-- (3) điểm + gần đây của MỘT em, cấp dạng, gồm BTVN — đúng tham số màn tự luyện đang dùng (cửa sổ 5, độ tin 5/3)
create or replace function public._tu_luyen_mastery_dang(p_hs uuid, p_moc timestamp with time zone)
 returns table(ma_dang text, score numeric, muc text, gan_day boolean)
 language plpgsql
 stable
 set search_path to 'public'
as $function$
declare v_s timestamptz := greatest(p_moc, now() - interval '30 days');   -- _mastery_lan_cap cũng chặn 30 ngày
begin
  if not public._mastery_theo_lan_bat() then
    -- công thức cũ theo câu (công tắc tắt): giữ nguyên hai lượt gọi như trước
    return query
      select f.ma_dang, f.score, f.muc,
             exists (select 1 from public.fn_mastery_cells_moi(array[p_hs], true, p_moc, 5, 5, 3) r where r.ma_dang = f.ma_dang)
        from public.fn_mastery_cells_moi(array[p_hs], true, null, 5, 5, 3) f;
  elsif cardinality(public._mastery_hs_sach(array[p_hs])) = 1
        and not exists (select 1 from mastery_luu_san s where s.hoc_sinh_id = p_hs and s.btvn and s.cap = 'dang' and s.lan_cuoi is null) then
    return query
      select s.nut, s.score, s.muc, s.lan_cuoi >= v_s
        from mastery_luu_san s where s.hoc_sinh_id = p_hs and s.btvn and s.cap = 'dang';
  else
    return query
      select m.nut, m.score, m.muc, m.t_cuoi >= v_s
        from public._mastery_lan_cap_t(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang'], 5, 5, 3) m;
  end if;
end $function$;
revoke all on function public._tu_luyen_mastery_dang(uuid, timestamp with time zone) from public, anon, authenticated;

-- (4) màn danh sách dạng
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_ds_dang(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi text;
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select l.khoi into v_khoi from lop l where l.id = public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228
  if v_khoi is null then return '[]'::jsonb; end if;

  if p_mon = 'Toán' and 'bdm' = any(public._kho_ds_nhanh_khoi(p_mon, v_khoi)) then
    -- BẢN ĐỒ MỚI (mastery K6–12 bật công tắc — PLAN-mastery-ban-do-moi.md): dạng bài mới + câu theo bdm_cau_hoi
    -- 10/11: số câu theo dạng đọc BẢNG TÍNH SẴN (mig 202611102121); khối chưa có bản tính ⇒ tính 1 lần ngay
    if not exists (select 1 from tu_luyen_so_cau s where s.ban_do = 'bdm' and s.khoi = v_khoi) then
      perform public._tu_luyen_so_cau_tinh(v_khoi);
    end if;
    select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', s.tong_cau
      )), '[]'::jsonb)
      into v_part
      from bdm_ban_do bd
      join tu_luyen_so_cau s on s.ban_do = 'bdm' and s.ma_dang = bd.ma_dang
     where bd.khoi = v_khoi and s.tong_cau > 0;
    v_out := v_out || v_part;
  elsif p_mon = 'Toán' then
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
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng lấy qua REGISTRY, không gõ tên bảng (CLAUDE §1.6)
    v_dk := public._kho_dk_online_hs_sql(public._kho_cau_tbl(p_mon, null));
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from %1$I bd
      join lateral (select count(*) as tong_cau from %2$I c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %3$s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, public._kho_ban_do_tbl(p_mon, null), public._kho_cau_tbl(p_mon, null), v_dk) into v_part using v_khoi;
    v_out := v_part;
  end if;

  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10, khối 4T thấy phân số khi lớp chưa dạy): lọc danh sách chủ đề theo _hs_dang_da_hoc.
  --   Lớp chưa có số đo lớp dạy nào (lớp mới/lớp thử) ⇒ không lọc (chưa biết lớp học tới đâu).
  declare v_hoc text[];
  begin
    v_hoc := public._hs_dang_da_hoc(v_hs, p_mon);
    if cardinality(v_hoc) > 0 then
      select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from jsonb_array_elements(v_out) x where x->>'ma_dang' = any(v_hoc);
    end if;
  end;

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
    -- [14/11] một lượt đọc: điểm + "có đo gần đây không" (lần đo gần nhất lưu sẵn trong cache mastery) — xem _tu_luyen_mastery_dang
    with md as materialized (
      select m.ma_dang, m.score, m.muc, m.gan_day from public._tu_luyen_mastery_dang(v_hs, v_cutoff) m
    ),
    lst as (
      select x, md.score, md.muc, coalesce(md.gan_day, false) as gan_day
      from jsonb_array_elements(v_out) x
      left join md on md.ma_dang = x->>'ma_dang'
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
end $function$;

-- Mọi em tính lại một lượt để có lan_cuoi (bộ điều phối làm dần, ~140 ms / em; trong lúc chờ hàm đọc tự tính trực tiếp).
select public.fn_mastery_danh_dau_tat_ca();
