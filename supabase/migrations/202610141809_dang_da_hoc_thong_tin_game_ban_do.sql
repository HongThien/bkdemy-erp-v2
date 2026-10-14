-- ============================================================================
-- dang_da_hoc_thong_tin_game_ban_do — "CHỈ DẠNG LỚP ĐÃ HỌC" mở rộng (Thùy 14/10 "Luôn đi")
-- ----------------------------------------------------------------------------
-- Mig 202610141759 đã lọc Học theo chủ đề + Luyện dạng yếu + Thử thách. Thùy chốt làm tiếp: Thông tin học tập, game, và bản đồ phiêu lưu.
--   · _hs_dang_da_hoc BỔ SUNG bằng chứng: dạng lớp ĐÃ GIAO (bai_test lớp loại giao_trinh/et/btvn/de_thi, kể cả chưa chấm) + mã dạng gốc của nhóm đã đạt.
--   · hs_dang_hoc_tap (màn Thông tin học tập): chỉ dạng lớp đã học.
--   · fn_ban_do_phieu_luu (bản đồ Học tập): màn của dạng lớp chưa dạy KHÔNG hiện (trước: phủ sương nhưng vẫn vào được; nay server cũng chặn ở tu_luyen_chu_de_sinh).
--   · fn_dtv_kho_chu_de + fn_dtv_kho_bo_cau (game: tháp tổng/tháp chủ đề/trận bot): học sinh đăng nhập chỉ thấy chủ đề đủ câu & bốc câu trong phần lớp đã học.
--     Khách/anon (không phải học sinh) và lớp chưa có số đo lớp dạy nào ⇒ như cũ (không lọc).
-- ĐÁNH ĐỔI (nói thẳng): đề tháp theo lớp ⇒ hai lớp cùng khối có thể chơi tập câu khác nhau; BXH tháp là của học sinh cùng phạm vi lớp đã học, không còn "đề giống hệt toàn khối".
-- KHÔNG ĐỤNG: Học từ đầu (htd_*), bù (bu_*), bài chứng minh điền ô (hinh_form_dien — chưa có ánh xạ sang dạng).
-- MẤT GÌ: không xoá gì; create or replace thân 5 hàm (thêm đoạn lọc). Số đo cũ giữ nguyên.
-- ============================================================================
create or replace function public._hs_dang_da_hoc(p_hs uuid, p_mon text) returns text[]
language plpgsql stable security definer set search_path = public as $$
declare v_lop uuid; v_hs uuid[]; v_n integer; v_res text[];
begin
  v_lop := public._hs_lop_tu_luyen(p_hs, p_mon);
  if v_lop is null then return '{}'::text[]; end if;
  select coalesce(array_agg(distinct hl.hoc_sinh_id), '{}'::uuid[]) into v_hs from hoc_sinh_lop hl where hl.lop_id = v_lop and hl.trang_thai = 'dang_hoc';
  if not (p_hs = any(v_hs)) then v_hs := v_hs || p_hs; end if;
  v_n := cardinality(v_hs);
  with ev as (
    select g.hoc_sinh_id, sp.ma_cau, sp.ma_dang
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = any(v_hs) and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn')
    union all
    select bl.hoc_sinh_id, btc.ma_cau, btc.ma_dang
      from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = any(v_hs) and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
    union all
    select tl.hoc_sinh_id, btg.ma_cau, btg.ma_dang
      from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
     where tl.hoc_sinh_id = any(v_hs) and btg.ma_dang is not null
  ), nh as (
    select distinct e.hoc_sinh_id, e.ma_dang as goc,
           coalesce(public._do_nhom_cua_o(nullif(coalesce(e.ma_cau, ''), ''), nullif(coalesce(e.ma_dang, ''), '')), e.ma_dang) as nhom
      from ev e
  ), qua as (
    select n.nhom from nh n where n.nhom is not null group by n.nhom
     having count(distinct n.hoc_sinh_id) >= least(2, v_n) or bool_or(n.hoc_sinh_id = p_hs)
  ), giao as (   -- dạng LỚP ĐÃ GIAO (ET/BTVN/đề thi/giáo trình của lớp), kể cả chưa chấm xong
    select distinct btc.ma_dang from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
     where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and btc.ma_dang is not null
  )
  select coalesce(array_agg(distinct x.d), '{}'::text[]) into v_res from (
    select nhom as d from qua
    union select n.goc from nh n where n.nhom in (select nhom from qua) and n.goc is not null
    union select ma_dang from giao
  ) x;
  return v_res;
end $$;
revoke all on function public._hs_dang_da_hoc(uuid, text) from public;
revoke execute on function public._hs_dang_da_hoc(uuid, text) from anon, authenticated;

CREATE OR REPLACE FUNCTION public.hs_dang_hoc_tap(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_evals jsonb;
  v_hoc text[];
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  v_evals := public.hs_dang_evals(p_mon);
  if jsonb_array_length(v_evals) = 0 then return '[]'::jsonb; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): không hiện dạng em tự luyện mà lớp chưa dạy (lớp chưa có số đo lớp dạy ⇒ không lọc)
  v_hoc := public._hs_dang_da_hoc(v_hs, p_mon);

  with ev as (
    select (e->>'ma_dang') as ma_dang, (e->>'value')::numeric as value,
           (e->>'t')::timestamptz as t, e->>'src' as src,
           e->>'ten_dang' as ten_dang, e->>'ten_chuyen_de' as ten_chuyen_de
    from jsonb_array_elements(v_evals) e
  ),
  ev_rk as (
    select *, row_number() over (partition by ma_dang order by t desc) as rn from ev
  ),
  grp as (
    select ma_dang, max(ten_dang) as ten_dang, max(ten_chuyen_de) as ten_chuyen_de,
      coalesce(jsonb_agg(jsonb_build_object('value', value, 't', t, 'src', src) order by t desc)
        filter (where rn <= 5), '[]'::jsonb) as recent
    from ev_rk where (cardinality(v_hoc) = 0 or ma_dang = any(v_hoc)) group by ma_dang
  ),
  full_score as (
    select ma_dang, score, muc, n from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)
  ),
  recent_chk as (
    select distinct ma_dang from public.fn_mastery_cells(array[v_hs], true, v_cutoff, 5, 5, 3)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma_dang', g.ma_dang, 'ten_dang', g.ten_dang, 'ten_chuyen_de', g.ten_chuyen_de, 'recent', g.recent,
    'score', case when r.ma_dang is not null then fs.score else null end,
    'muc', case when r.ma_dang is not null then fs.muc else null end,
    'n', fs.n
  ) order by
    -- Yếu → cần luyện → đạt → chưa đánh giá (xuống cuối). Trong mỗi nhóm: score thấp trước.
    case when r.ma_dang is null or fs.score is null then 1 else 0 end,
    fs.muc = 'dat', fs.muc = 'can_luyen', fs.score, g.ten_dang
  ), '[]'::jsonb)
  into v_out
  from grp g
  left join full_score fs on fs.ma_dang = g.ma_dang
  left join recent_chk r on r.ma_dang = g.ma_dang;

  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ban_do_phieu_luu(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid; v_khoi text;
  v_bo jsonb := public._phieu_luu_bo();
  v_nq int; v_nb int; v_nbi int;
  v_hoc text[];
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
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): màn của dạng lớp chưa dạy không hiện (trước: phủ sương nhưng vẫn vào được)
  v_hoc := public._hs_dang_da_hoc(v_hs, p_mon);
  v_nq := jsonb_array_length(v_bo->'quai'); v_nb := jsonb_array_length(v_bo->'boss'); v_nbi := jsonb_array_length(v_bo->'biome');

  -- số câu làm được trên app + cụm, theo từng bảng câu của nhánh (1 truy vấn / nhánh)
  for r in select distinct d.cautbl from public._kho_ban_do_dong(p_mon, v_khoi) d loop
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'so_cau', coalesce(c.n, 0), 'cum', coalesce(k.cum, '[]'::jsonb))), '[]'::jsonb)
      from public._kho_ban_do_dong($1, $2) d
      left join lateral (select count(*) n from %1$I c where c.dang_chinh = d.ma_dang and c.xoa_at is null and %2$s) c on true
      left join lateral (%3$s) k on true
      where d.cautbl = %4$L
    $q$, r.cautbl, public._kho_dk_online_hs_sql(r.cautbl),
      -- môn chưa có bảng cụm (Tiếng Anh) ⇒ không cụm (mỗi màn 1 quái mang tên dạng); trước đây lỗi "relation anh_cum_bai does not exist"
      case when to_regclass('public.' || public._kho_cum_tbl(r.cautbl)) is null then 'select null::jsonb as cum'
           else format('select jsonb_agg(jsonb_build_object(''ma'', k.ma_cum, ''ten'', k.ten) order by k.thu_tu, k.ma_cum) cum from %I k where k.ma_dang = d.ma_dang',
                       public._kho_cum_tbl(r.cautbl)) end,
      r.cautbl)
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
      where (cardinality(v_hoc) = 0 or d0.ma_dang = any(v_hoc))
        and (exists (select 1 from x where x.ma_dang = d0.ma_dang and x.so_cau > 0)
         or exists (select 1 from m where m.ma_dang = d0.ma_dang))
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
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_kho_chu_de(p_mon text, p_khoi text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_kq jsonb;
  v_hs uuid := public.my_hoc_sinh_id(); v_hoc text[];
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): học sinh đăng nhập chỉ thấy chủ đề đủ câu TRONG PHẦN LỚP ĐÃ HỌC (khách/anon: như cũ)
  v_hoc := case when v_hs is null then null else nullif(public._hs_dang_da_hoc(v_hs, p_mon), '{}'::text[]) end;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object('ma', ma_chu_de, 'ten', ten_chu_de, 'so_cau', n) order by ma_chu_de), '[]'::jsonb)
    from (select b.ma_chu_de, min(b.ten_chu_de) ten_chu_de, count(*) n from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
          where c.xoa_at is null and b.khoi = $1 and ($2::text[] is null or c.dang_chinh = any($2)) and %3$s group by b.ma_chu_de having count(*) >= 8) t$q$, v_cau, v_bd, _kho_dk_mcq_sql(v_cau))
    using p_khoi, v_hoc into v_kq;
  return v_kq;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_kho_bo_cau(p_mon text, p_khoi text, p_chu_de text, p_so integer, p_seed text, p_tang_dan boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_form text := _kho_form_tn_cua(_kho_cau_tbl(p_mon));
  v_so integer := least(greatest(coalesce(p_so, 15), 1), 200); v_kq jsonb;
  v_hs uuid := public.my_hoc_sinh_id(); v_hoc text[];
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): đề tháp / trận bot của học sinh chỉ bốc câu thuộc phần lớp đã học (khách/anon: như cũ)
  v_hoc := case when v_hs is null then null else nullif(public._hs_dang_da_hoc(v_hs, p_mon), '{}'::text[]) end;
  execute format($q$
    with c0 as (
      select c.ma_cau, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, b.ten_dang, b.muc_do,
             %4$s as form_lc
      from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
      where c.xoa_at is null and b.khoi = $1 and ($2::text is null or b.ma_chu_de = $2) and ($6::text[] is null or c.dang_chinh = any($6)) and %3$s
    ), c1 as (
      select ma_cau, noi_dung, anh_de, loi_giai, ten_dang, muc_do,
        case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o))
             else lua_chon end as opts,
        case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
             else ascii(upper(trim(dap_an))) - 65 end as dung
      from c0
    )
    -- tháp khó dần TỪ TỪ: khoá = mức độ + (thứ tự trong mức)/25 ⇒ cứ ~25 tầng độ khó trung bình lên 1 bậc, vẫn trộn các mức
    , c2 as (
      select c1.*, row_number() over (partition by coalesce(muc_do, 3) order by md5(ma_cau || $3)) r
      from c1 where jsonb_typeof(opts) = 'array' and jsonb_array_length(opts) = 4 and dung between 0 and 3
    )
    select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'de', noi_dung, 'anh', anh_de, 'giai', loi_giai, 'dang', ten_dang,
                                                 'muc', muc_do, 'opts', opts, 'dung', dung) order by rn), '[]'::jsonb)
    from (
      select c2.*, row_number() over (order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)) rn
      from c2
      order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)
      limit $4
    ) t$q$,
    v_cau, v_bd, _kho_dk_mcq_sql(v_cau),
    case when v_form is null then 'null::jsonb'
         else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end)
    using p_khoi, p_chu_de, coalesce(p_seed, ''), v_so, coalesce(p_tang_dan, false), v_hoc
    into v_kq;
  return v_kq;
end $function$;
