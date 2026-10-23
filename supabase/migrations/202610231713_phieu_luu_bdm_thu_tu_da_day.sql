-- ============================================================================
-- 202610231713 — phieu_luu_bdm_thu_tu_da_day
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Bản đồ phiêu lưu app HS theo bản đồ mới (Thùy 23/10: "đổi được"; PLAN-mastery-ban-do-moi.md) còn 2 chỗ đã ghi "chấp nhận":
--   (1) lục địa / khu / màn xếp theo MÃ (NCD…/NDB… — vô nghĩa) ⇒ xếp theo THỨ TỰ bản đồ mới (chủ đề → chuyên đề → nhóm → dạng bài,
--   từ view bdm_ban_do); (2) dấu "đã dạy" đọc mã dạng CHÉP trong bài test (mã cũ) ⇒ màn dạng bài mới không bao giờ có dấu ⇒ khi
--   nhánh bản đồ mới (K6–12 + công tắc) cộng thêm dạng bài của câu lớp đã giao (_do_o_bdm).
--   Màn bản đồ cũ không có dòng trong bdm_ban_do ⇒ thứ tự NULL ⇒ xếp y như trước (theo mã); "đã dạy" chỉ cộng khi bật ⇒ TẮT y hệt.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay thân fn_ban_do_phieu_luu (chữ ký giữ nguyên).
-- ============================================================================

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
    m as (select ma_dang, score, muc from public.fn_mastery_cells_moi(array[v_hs], true, null, 5, 5, 3)),
    -- Chỉ màn VÀO ĐƯỢC (có câu trên app) hoặc em ĐÃ CÓ SỐ ĐO (vd chỉ làm trên giấy) — bỏ dạng trống/dữ liệu thử.
    -- Mỗi khu vực 1 BOSS: màn khó nhất (mức độ cao nhất, hoà thì mã sau) — quái cuối của màn đó là boss.
    d as (
      select d0.*, array_position(public._kho_ds_nhanh_khoi(p_mon, v_khoi), d0.nhanh) as nh_stt,
        row_number() over (partition by d0.ma_chu_de, d0.ma_chuyen_de order by d0.muc_do desc nulls last, d0.ma_dang desc) = 1 as man_boss
      from public._kho_ban_do_dong(p_mon, v_khoi) d0
      where (cardinality(v_hoc) = 0 or d0.ma_dang = any(v_hoc))
        and (exists (select 1 from x where x.ma_dang = d0.ma_dang and x.so_cau > 0)
         or exists (select 1 from m where m.ma_dang = d0.ma_dang))
    ),
    day as (
      select distinct t.ma_dang from bai_test bt join bai_test_cau t on t.bai_test_id = bt.id
      where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and t.ma_dang is not null
      union   -- bản đồ mới: dạng bài của câu lớp đã giao (bài test chép mã dạng CŨ)
      select distinct public._do_o_bdm(t.ma_cau, t.ma_dang) from bai_test bt join bai_test_cau t on t.bai_test_id = bt.id
      where 'bdm' = any(public._kho_ds_nhanh_khoi(p_mon, v_khoi))
        and bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and t.ma_dang is not null
    ),
    -- thứ tự trên BẢN ĐỒ MỚI (chủ đề / chuyên đề / nhóm / dạng bài); dạng bản đồ cũ không có dòng ⇒ NULL ⇒ xếp như cũ (theo mã)
    tt as (select b.ma_dang, b.thu_tu_chu_de, b.thu_tu_chuyen_de, b.thu_tu_nhom, b.thu_tu_dang from bdm_ban_do b
           where b.ma_dang in (select d.ma_dang from d)),
    -- thứ tự lục địa: nhánh (Đại → Hình GT → Hình học / nhánh gốc môn khác) rồi mã chủ đề
    cd as (select ma_chu_de, row_number() over (order by nh, tcd nulls last, ma_chu_de) - 1 as stt
           from (select d.ma_chu_de, min(d.nh_stt) nh, min(tt.thu_tu_chu_de) tcd from d left join tt on tt.ma_dang = d.ma_dang group by d.ma_chu_de) z),
    man as (
      select d.ma_chu_de, d.ten_chu_de, d.ma_chuyen_de, d.ten_chuyen_de, d.ma_dang,
        tt.thu_tu_chuyen_de, tt.thu_tu_nhom, tt.thu_tu_dang,
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
             left join tt on tt.ma_dang = d.ma_dang
    ),
    kv as (
      select ma_chu_de, ten_chu_de, ma_chuyen_de, min(thu_tu_chuyen_de) as tcd,
        jsonb_build_object('ma', ma_chuyen_de, 'ten', min(ten_chuyen_de),
          'man', jsonb_agg(j || jsonb_build_object('thu_tu', 0) order by thu_tu_nhom nulls last, thu_tu_dang nulls last, ma_dang)) as j
      from man group by ma_chu_de, ten_chu_de, ma_chuyen_de
    ),
    ld as (
      select kv.ma_chu_de, jsonb_build_object('ma', kv.ma_chu_de, 'ten', min(kv.ten_chu_de), 'thu_tu', min(cd.stt) + 1,
          'biome', v_bo->'biome'->>(min(cd.stt)::int % v_nbi),
          'khu_vuc', jsonb_agg(kv.j order by kv.tcd nulls last, kv.ma_chuyen_de)) as j
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
