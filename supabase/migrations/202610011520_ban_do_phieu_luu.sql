-- ============================================================================
-- DỮ LIỆU BẢN ĐỒ PHIÊU LƯU (spec-v1-app-hs.md §4.1 + hợp đồng §13.4 — luồng Số liệu giao luồng Giao diện)
--   chủ đề = LỤC ĐỊA (1 chương, gắn 1 vùng đất/biome) · chuyên đề = KHU VỰC · dạng = MÀN ĐẤU · cụm = QUÁI (dạng chưa có cụm ⇒ 1 quái mang tên dạng)
--   trạng thái màn = mức nắm (HS × dạng) từ fn_mastery_cells (KHÔNG công thức riêng — §2.0): chưa đo / yếu / đạt (CLAUDE §5)
--   da_day = lớp em đã gặp dạng này (bài trên lớp / ET / BTVN / đề thi của lớp) HOẶC em đã có số đo ⇒ false thì Giao diện phủ sương (vẫn vào được)
-- Mọi môn đi qua 1 registry nhánh (_kho_ds_nhanh + _kho_ban_do_dong) — KHÔNG if môn trong hàm bản đồ (§1.6).
-- Gán quái/biome CỐ ĐỊNH: cùng cụm luôn ra cùng loài (băm mã cụm), cùng chủ đề luôn ra cùng vùng đất (thứ tự chủ đề trong khối).
-- Tên loài/vùng khớp tên file hình Đơn 6 (design/DON-HANG-SKIN-HS.md) — mỗi style vẽ bộ hình riêng cùng tên.
-- ============================================================================

-- ── 1. Registry: các nhánh kho của 1 môn (null = nhánh gốc của môn) ──
create or replace function public._kho_ds_nhanh(p_mon text)
returns text[] language sql immutable as $$
  select case when not public._kho_co_mon(p_mon) then '{}'::text[]
              when p_mon = 'KHTN' then array[null::text]
              else array[null::text, 'hinh_gt', 'hinh_hoc'] end
$$;

-- ── 2. Registry: các dạng của 1 môn × khối, chuẩn hoá về 1 hình dạng (bảng bản đồ mỗi nhánh khác cột — gom MỘT chỗ ở đây) ──
create or replace function public._kho_ban_do_dong(p_mon text, p_khoi text)
returns table (nhanh text, cautbl text, ma_chu_de text, ten_chu_de text, ma_chuyen_de text, ten_chuyen_de text,
               ma_dang text, ten_dang text, muc_do smallint)
language plpgsql stable as $$
declare v_nh text; v_bd text;
begin
  foreach v_nh in array public._kho_ds_nhanh(p_mon) loop
    v_bd := public._kho_ban_do_tbl(p_mon, v_nh);
    if v_bd = 'hinh_hoc_bai' then
      -- Hình học: không có tầng chủ đề ⇒ 1 lục địa "Hình học"; chuyên đề thiếu ⇒ 1 khu "Hình học"
      return query execute format($q$
        select %L::text, %L::text, 'HINH_HOC'::text, 'Hình học'::text,
               coalesce(b.ma_chuyen_de, 'HINH_HOC'), coalesce(b.ten_chuyen_de, 'Hình học'),
               b.ma_bai, coalesce(nullif(btrim(b.ten_dang), ''), b.ten_bai), b.muc_do::smallint
        from hinh_hoc_bai b where b.khoi = $1
      $q$, v_nh, public._kho_cau_tbl(p_mon, v_nh)) using p_khoi;
    else
      return query execute format($q$
        select %L::text, %L::text, b.ma_chu_de, b.ten_chu_de, b.ma_chuyen_de, b.ten_chuyen_de, b.ma_dang, b.ten_dang, b.muc_do::smallint
        from %I b where b.khoi = $1
      $q$, v_nh, public._kho_cau_tbl(p_mon, v_nh), v_bd) using p_khoi;
    end if;
  end loop;
end $$;

-- ── 3. Bộ tên loài quái / boss / vùng đất (khớp Đơn 6; thêm loài = thêm tên ở đây + hình ở mọi style) ──
create or replace function public._phieu_luu_bo()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'quai', jsonb_build_array('slime_la', 'slime_lua', 'meo_bang', 'rua_da', 'cu_dem', 'ca_bong', 'nam_ma', 'chim_set',
                              'tho_gio', 'be_nham', 'sao_bien', 'ech_doc', 'dom_dom', 'soi_bang', 'bo_giap', 'ma_lua'),
    'boss', jsonb_build_array('rong_con', 'golem_pha_le', 'phuong_hoang', 'bach_tuoc'),
    'biome', jsonb_build_array('rung', 'bang', 'nui_lua', 'bien_dao', 'sa_mac', 'dam_lay', 'thanh_co', 'troi_sao')
  )
$$;

-- ── 4. Bản đồ của em cho 1 môn ──
create or replace function public.fn_ban_do_phieu_luu(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid; v_khoi text;
  v_bo jsonb := public._phieu_luu_bo();
  v_nq int; v_nb int; v_nbi int;
  v_dong jsonb := '[]';
  v_part jsonb;
  r record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select l.id, l.khoi into v_lop, v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_khoi is null or not public._kho_co_mon(p_mon) then
    return jsonb_build_object('mon', p_mon, 'khoi', v_khoi, 'luc_dia', '[]'::jsonb);
  end if;
  v_nq := jsonb_array_length(v_bo->'quai'); v_nb := jsonb_array_length(v_bo->'boss'); v_nbi := jsonb_array_length(v_bo->'biome');

  -- số câu làm được trên app + cụm, theo từng bảng câu của nhánh (1 truy vấn / nhánh)
  for r in select distinct d.cautbl from public._kho_ban_do_dong(p_mon, v_khoi) d loop
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'so_cau', coalesce(c.n, 0), 'cum', coalesce(k.cum, '[]'::jsonb))), '[]'::jsonb)
      from public._kho_ban_do_dong($1, $2) d
      left join lateral (select count(*) n from %1$I c where c.dang_chinh = d.ma_dang and c.xoa_at is null and %2$s) c on true
      left join lateral (select jsonb_agg(jsonb_build_object('ma', k.ma_cum, 'ten', k.ten) order by k.thu_tu, k.ma_cum) cum
                         from %3$I k where k.ma_dang = d.ma_dang) k on true
      where d.cautbl = %4$L
    $q$, r.cautbl, public._kho_dk_online_hs_sql(r.cautbl), public._kho_cum_tbl(r.cautbl), r.cautbl)
    into v_part using p_mon, v_khoi;
    v_dong := v_dong || v_part;
  end loop;

  return (
    with x as (select (e->>'ma_dang') ma_dang, (e->>'so_cau')::int so_cau, e->'cum' cum from jsonb_array_elements(v_dong) e),
    m as (select ma_dang, score, muc from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)),
    -- Chỉ màn VÀO ĐƯỢC (có câu trên app) hoặc em ĐÃ CÓ SỐ ĐO (vd chỉ làm trên giấy) — bỏ dạng trống/dữ liệu thử.
    -- Mỗi khu vực 1 BOSS: màn khó nhất (mức độ cao nhất, hoà thì mã sau) — quái cuối của màn đó là boss.
    d as (
      select d0.*, array_position(public._kho_ds_nhanh(p_mon), d0.nhanh) as nh_stt,
        row_number() over (partition by d0.ma_chu_de, d0.ma_chuyen_de order by d0.muc_do desc nulls last, d0.ma_dang desc) = 1 as man_boss
      from public._kho_ban_do_dong(p_mon, v_khoi) d0
      where exists (select 1 from x where x.ma_dang = d0.ma_dang and x.so_cau > 0)
         or exists (select 1 from m where m.ma_dang = d0.ma_dang)
    ),
    day as (
      select distinct t.ma_dang from bai_test bt join bai_test_cau t on t.bai_test_id = bt.id
      where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and t.ma_dang is not null
    ),
    -- thứ tự lục địa: nhánh (Đại → Hình GT → Hình học / nhánh gốc môn khác) rồi mã chủ đề
    cd as (select ma_chu_de, row_number() over (order by nh, ma_chu_de) - 1 as stt
           from (select ma_chu_de, min(nh_stt) nh from d group by ma_chu_de) z),
    man as (
      select d.ma_chu_de, d.ten_chu_de, d.ma_chuyen_de, d.ten_chuyen_de, d.ma_dang,
        jsonb_build_object(
          'ma_dang', d.ma_dang, 'ten', d.ten_dang, 'muc_do', d.muc_do, 'nhanh', d.nhanh,
          'so_cau', coalesce(x.so_cau, 0),
          'trang_thai', case when m.ma_dang is null then 'chua_do' when m.muc = 'dat' then 'dat' else 'yeu' end,
          'muc', m.muc,
          'mastery', round(m.score, 2),
          'da_day', (day.ma_dang is not null or m.ma_dang is not null),
          'la_man_boss', d.man_boss,
          'quai', (
            select jsonb_agg(jsonb_build_object('ma', q.ma, 'ten', q.ten,
                     'loai_quai', case when q.boss then v_bo->'boss'->>(abs(hashtext(q.ma)) % v_nb)
                                       else v_bo->'quai'->>(abs(hashtext(q.ma)) % v_nq) end,
                     'la_boss', q.boss) order by q.i)
            from (
              select k.i, k.v->>'ma' as ma, coalesce(k.v->>'ten', d.ten_dang) as ten,
                     d.man_boss and k.i = count(*) over () as boss
              from jsonb_array_elements(case when jsonb_array_length(coalesce(x.cum, '[]')) = 0
                     then jsonb_build_array(jsonb_build_object('ma', d.ma_dang, 'ten', d.ten_dang)) else x.cum end) with ordinality k(v, i)
            ) q)
        ) as j
      from d left join x on x.ma_dang = d.ma_dang left join m on m.ma_dang = d.ma_dang left join day on day.ma_dang = d.ma_dang
    ),
    kv as (
      select ma_chu_de, ten_chu_de, ma_chuyen_de,
        jsonb_build_object('ma', ma_chuyen_de, 'ten', min(ten_chuyen_de),
          'man', jsonb_agg(j || jsonb_build_object('thu_tu', 0) order by ma_dang)) as j
      from man group by ma_chu_de, ten_chu_de, ma_chuyen_de
    ),
    ld as (
      select kv.ma_chu_de, jsonb_build_object('ma', kv.ma_chu_de, 'ten', min(kv.ten_chu_de), 'thu_tu', min(cd.stt) + 1,
          'biome', v_bo->'biome'->>(min(cd.stt)::int % v_nbi),
          'khu_vuc', jsonb_agg(kv.j order by kv.ma_chuyen_de)) as j
      from kv join cd on cd.ma_chu_de = kv.ma_chu_de group by kv.ma_chu_de
    )
    select jsonb_build_object('mon', p_mon, 'khoi', v_khoi,
      'luc_dia', coalesce((select jsonb_agg(
          -- đánh số thứ tự khu vực / màn trong từng tầng (hợp đồng có thu_tu ở mọi tầng)
          ld.j || jsonb_build_object('khu_vuc', (
            select jsonb_agg(k.v || jsonb_build_object('thu_tu', k.i,
                     'man', (select jsonb_agg(mm.v || jsonb_build_object('thu_tu', mm.i) order by mm.i)
                             from jsonb_array_elements(k.v->'man') with ordinality mm(v, i)))
                   order by k.i)
            from jsonb_array_elements(ld.j->'khu_vuc') with ordinality k(v, i)))
          order by (ld.j->>'thu_tu')::int) from ld), '[]'::jsonb))
  );
end $$;

revoke all on function public._kho_ds_nhanh(text) from public, anon, authenticated;
revoke all on function public._kho_ban_do_dong(text, text) from public, anon, authenticated;
revoke all on function public._phieu_luu_bo() from public, anon, authenticated;
revoke all on function public.fn_ban_do_phieu_luu(text) from public, anon;
grant execute on function public.fn_ban_do_phieu_luu(text) to authenticated;
