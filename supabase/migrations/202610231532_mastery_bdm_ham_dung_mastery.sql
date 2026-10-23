-- ============================================================================
-- 202610231532 — mastery_bdm_ham_dung_mastery
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Mastery K6–12 sang bản đồ mới (PLAN-mastery-ban-do-moi.md, bước 2). Các hàm dùng mastery tự quy lượt đo về ô bằng
--   `_do_nhom_cua_o` và dựng DANH SÁCH DẠNG từ bảng bản đồ cũ ⇒ khi bật công tắc, ô mastery mang mã NDB… không khớp nữa
--   (lọc `ma_dang = any(v_dangs)` rơi hết, "dạng lớp đã học" lệch khoá, tên dạng không tra được).
--   ⇒ (1) `_do_o` = quy ô THEO CÔNG TẮC (tắt = `_do_nhom_cua_o` y cũ; bật = `_do_o_bdm`) thay chỗ `_do_nhom_cua_o` trong: dạng lớp đã học,
--   bổ trợ yếu (dạng yếu 2 cửa sổ, đề xuất dạng mới), bù, nhật ký đo của em; (2) danh sách dạng cộng thêm `bdm_ban_do` (tự luyện chọn
--   dạng, thành tựu tháng — mã NDB chỉ xuất hiện trong mastery khi công tắc bật); (3) `_kho_ds_nhanh_khoi(môn, khối)` = danh sách
--   nhánh THEO KHỐI: Toán K6–12 + công tắc bật ⇒ ['bdm', 'hinh_hoc'] (Đại + HGT gộp trong bản đồ mới), còn lại = `_kho_ds_nhanh` —
--   dùng cho bản đồ phiêu lưu (`_kho_ban_do_dong`) và danh sách dạng tự luyện theo chủ đề.
--   Công tắc TẮT ⇒ mọi hàm cho kết quả y hệt trước (kiểm `scripts/_test_mastery_bdm_b2.mjs`).
--   Đã biết, chấp nhận (Thùy "sai sót chấp nhận được"): bản đồ phiêu lưu sắp chủ đề theo mã (chưa theo thứ tự bản đồ mới); dấu
--   "đã dạy" của màn đọc mã dạng chép trong bài test (mã cũ) nên dạng bài mới chưa có dấu này.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thay THÂN 10 hàm (chữ ký giữ nguyên) + thêm 2 hàm.
-- ============================================================================

create or replace function public._do_o(p_ma_cau text, p_ma_dang_chep text) returns text
language sql stable as $$
  select case when public._mastery_bdm_bat() then public._do_o_bdm(p_ma_cau, p_ma_dang_chep)
              else public._do_nhom_cua_o(p_ma_cau, p_ma_dang_chep) end
$$;

create or replace function public._kho_ds_nhanh_khoi(p_mon text, p_khoi text) returns text[]
language sql stable as $$
  select case when p_mon = 'Toán' and public._mastery_bdm_bat() and coalesce(p_khoi, '') not in ('', '3', '4', '4T', '5', '5T')
              then array['bdm', 'hinh_hoc']
              else public._kho_ds_nhanh(p_mon) end
$$;

-- _hs_dang_da_hoc
CREATE OR REPLACE FUNCTION public._hs_dang_da_hoc(p_hs uuid, p_mon text)
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
           coalesce(public._do_o(nullif(coalesce(e.ma_cau, ''), ''), nullif(coalesce(e.ma_dang, ''), '')), e.ma_dang) as nhom
      from ev e
  ), qua as (
    select n.nhom from nh n where n.nhom is not null group by n.nhom
     having count(distinct n.hoc_sinh_id) >= least(2, v_n) or bool_or(n.hoc_sinh_id = p_hs)
  ), giao as (   -- dạng LỚP ĐÃ GIAO (ET/BTVN/đề thi/giáo trình của lớp), kể cả chưa chấm xong
    select distinct btc.ma_dang, btc.ma_cau from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
     where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and btc.ma_dang is not null
  )
  select coalesce(array_agg(distinct x.d), '{}'::text[]) into v_res from (
    select nhom as d from qua
    union select n.goc from nh n where n.nhom in (select nhom from qua) and n.goc is not null
    union select ma_dang from giao
    union select public._do_o_bdm(g.ma_cau, g.ma_dang) from giao g where public._mastery_bdm_bat()   -- bản đồ mới: dạng bài của câu đã giao
  ) x;
  return v_res;
end $function$;

-- fn_btyeu_dang_yeu_2_cua_so
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_o(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$;

-- fn_btyeu_de_xuat_dang_moi
CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu'),
      -- 12/10: dạng CÓ ĐO sau khi mở case, tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — 1 lần cho mỗi cặp câu–mã chép của từng case
      gan as materialized (
        select cs.case_id, public._do_o(d.ma_cau, d.ma_dang) as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gan where gan.case_id = cs.case_id and gan.md = m.ma_dang)
      order by cs.case_id, (m.n >= 3) desc, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
    -- 14/10: bài mô hình Hình yếu, có đo SAU khi mở case (ET/BTVN/MT) hoặc từ kết quả bổ trợ — cùng luật dạng thường.
    for r in
      select y.id as case_id, y.hoc_sinh_id, hb.ma as ma_dang, public._kho_ten_dang(v_mon, hb.ma) as ten_dang, h.score, h.n
      from bo_tro_yeu y
      cross join lateral public.fn_mastery_cells_hinh(array[y.hoc_sinh_id], true) h
      join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = v_mon
      where y.mon = v_mon and y.trang_thai = 'dang_xu' and (p_case is null or y.id = p_case) and h.muc = 'yeu'
        and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.ma_dang = hb.ma)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = y.hoc_sinh_id and p.hinh_baitoan_id = hb.id and g.graded_at > y.created_at)
      order by y.id, (h.n >= 2) desc, h.score
    loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$;

-- fn_hs_bu_dang
CREATE OR REPLACE FUNCTION public.fn_hs_bu_dang(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); r record; v_out jsonb; v_kq jsonb := '[]'::jsonb; x jsonb; v_tbl text; v_co boolean;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select b.id as bu, b.ngay, hh.bu_cho_buoi_id as me, bm.ngay as ngay_me, l.mon, l.ten_lop into r
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs
    left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join lop l on l.id = bm.lop_id
    where b.id = p_buoi and b.loai = 'bu' limit 1;
  if r.bu is null then raise exception 'Không thấy buổi bù của em.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, x.ma_dang), x.ma_dang)) order by x.thu_tu), '[]'::jsonb)
    into v_out
    from (select public._do_o(p.ma_cau, p.ma_dang) as ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'btvn'))
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by 1) x;
  -- Thùy 03/10: bù 100% MCQ ⇒ báo dạng nào CÓ câu trắc nghiệm (cùng điều kiện duy nhất _kho_dk_mcq_sql) — dạng không có thì app ghi rõ 'học trên giấy'.
  for x in select * from jsonb_array_elements(v_out) loop
    v_tbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, x->>'ma_dang'));
    execute format('select exists (select 1 from %I c where c.dang_chinh = $1 and c.xoa_at is null and (%s or %s))', v_tbl, public._kho_dk_mcq_sql(v_tbl), public._kho_dk_tln_sql()) into v_co using x->>'ma_dang'; -- Thùy 10/10: MCQ hoặc trả lời ngắn
    v_kq := v_kq || (x || jsonb_build_object('co_mcq', coalesce(v_co, false)));
  end loop;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_kq);
end $function$;

-- hs_dang_evals
CREATE OR REPLACE FUNCTION public.hs_dang_evals(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'Toán' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select r.md as ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_bdm.ten_dang, bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang) as ten_dang,
             coalesce(bd_bdm.ten_chuyen_de, bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end) as ten_chuyen_de,
             coalesce(bd_bdm.muc_do, bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      cross join lateral (select public._do_o(p.ma_cau, p.ma_dang) as md) r -- 12/10: đo đi theo câu
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      left join bdm_ban_do bd_bdm on bd_bdm.ma_dang = r.md
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)
        and (bd_bdm.ma_dang is not null or bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em

      union all
      select r.md, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_bdm.ten_dang, bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_bdm.ten_chuyen_de, bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_bdm.muc_do, bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      cross join lateral (select public._do_o(bc.ma_cau, bc.ma_dang) as md) r
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      left join bdm_ban_do bd_bdm on bd_bdm.ma_dang = r.md
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
        and bt.loai <> 'htd_luyen'
        and (bd_bdm.ma_dang is not null or bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em

      union all
      select r.md, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_bdm.ten_dang, bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_bdm.ten_chuyen_de, bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_bdm.muc_do, bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      cross join lateral (select public._do_o(bg.ma_cau, bg.ma_dang) as md) r
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      left join bdm_ban_do bd_bdm on bd_bdm.ma_dang = r.md
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
        and (bd_bdm.ma_dang is not null or bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em
    ) x;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng bản đồ qua REGISTRY, môn là tham số (CLAUDE §1.6)
    execute format($q$
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn') and (l.mon = $2 or (l.mon is null and bd.ma_dang is not null))   -- buổi không gắn lớp: chỉ nhận dạng của CHÍNH môn này (§1.6); trước đây dạng Toán lọt sang KHTN/Anh

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join %1$I bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join %1$I bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
    $q$, public._kho_ban_do_tbl(p_mon, null)) into v_out using v_hs, p_mon;
  end if;
  return v_out;
end $function$;

-- _tu_luyen_chon_dang
CREATE OR REPLACE FUNCTION public._tu_luyen_chon_dang(p_hs uuid, p_mon text, p_so integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_dangs text[]; v_hoc text[]; v_all text[]; v_yeu text[]; v_out jsonb := '[]'::jsonb; i int;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- mọi dạng của môn (bản đồ gốc + nhánh hình) — cùng cách fn_nhiem_vu_hoan_thanh lấy danh sách dạng (§1.6)
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I union select ma_dang from bdm_ban_do) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): Luyện dạng yếu + Thử thách không chọn dạng lớp chưa dạy (kể cả dạng em tự luyện trước đó).
  v_hoc := public._hs_dang_da_hoc(p_hs, p_mon);
  if cardinality(v_hoc) > 0 then v_dangs := array(select x from unnest(v_dangs) x where x = any(v_hoc)); end if;
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

-- fn_thanh_tuu_thang
CREATE OR REPLACE FUNCTION public.fn_thanh_tuu_thang(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, thanh_tuu_key text, ket_qua text)
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm
declare
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_tu timestamptz := (p_ym || '-01')::date::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den timestamptz := (((p_ym || '-01')::date + interval '1 month')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mua record; v_hs uuid[]; v_dangs text[]; v_khoi text; v_ym text;
begin
  select * into v_mua from gami_mua where p_ym between thang_dau and thang_cuoi limit 1;
  -- em "học tháng đó" = có dòng điểm danh ở buổi lớp môn trong tháng
  select array_agg(distinct h.hoc_sinh_id) into v_hs
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.mon = p_mon and b.ngay between v_ms and v_me and b.trang_thai <> 'huy'
    and (p_hs is null or h.hoc_sinh_id = any(p_hs));
  if v_hs is null then return; end if;
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I union select ma_dang from bdm_ban_do) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;

  -- Bảng đua tháng: chỉ các khối có em trong danh sách (1 HS ⇒ 1 khối)
  create temp table _dua (hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_khoi in select distinct l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id = any(v_hs) and l.khoi is not null loop
    insert into _dua select d.hoc_sinh_id, d.hang, d.so_em_co_diem from public.fn_rank_dua_thang(p_mon, v_khoi, p_ym) d;
  end loop;
  -- MT: tháng này + mốc (tháng MT đầu tiên của em trong mùa)
  create temp table _mt (ym text, hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series((coalesce(v_mua.thang_dau, p_ym) || '-01')::date, v_ms, interval '1 month') g loop
    insert into _mt select v_ym, m.hoc_sinh_id, m.hang, m.so_em from public.fn_mt_hang_thang(p_mon, v_ym) m where m.hoc_sinh_id = any(v_hs);
  end loop;

  return query
  with
  hs as materialized (select unnest(v_hs) as hs),
  dd as materialized (select h.hoc_sinh_id as hs, count(*) filter (where h.diem_danh = 'co_mat') as co, count(*) filter (where h.diem_danh in ('vang', 'vang_phep')) as vang
         from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and h.hoc_sinh_id = any(v_hs)
         group by 1),
  bt as materialized (select k.hoc_sinh_id as hs, count(*) as n, count(*) filter (where k.trang_thai_nop = 'nop_dung_han') as dh
         from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and k.trang_thai_nop is not null and k.hoc_sinh_id = any(v_hs)
         group by 1),
  bai as materialized (   -- tỉ lệ đúng từng bài (em × buổi × phase) — cùng quy đổi mastery
    select g.hoc_sinh_id as hs, sp.phase, g.buoi_hoc_id, avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as tl
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and g.hoc_sinh_id = any(v_hs)
    group by 1, 2, 3),
  tl as materialized (select bl.hoc_sinh_id as hs, count(*) as n
         from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt2 on bt2.id = bl.bai_test_id
         where bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
           and blc.cham_at >= v_tu and blc.cham_at < v_den
         group by 1),
  tt as materialized (select t.hoc_sinh_id as hs, count(distinct t.ngay) filter (where t.pass) as ngay_pass, count(*) filter (where t.so_dung = t.so_cau) as so_full
         from thu_thach_luot t where t.mon = p_mon and t.ngay between v_ms and v_me and t.hoc_sinh_id = any(v_hs) group by 1),
  mt_nay as materialized (select * from _mt where ym = p_ym),
  mt_moc as materialized (select distinct on (m.hoc_sinh_id) m.hoc_sinh_id, m.ym, m.hang, m.so_em from _mt m order by m.hoc_sinh_id, m.ym),
  ms0 as materialized (select m.hoc_sinh_id as hs, m.ma_dang from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_tu) m
          where m.muc = 'yeu' and m.ma_dang = any(v_dangs)),
  ms1 as materialized (select m.hoc_sinh_id as hs, m.ma_dang, m.muc, m.tin from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_den) m
          where m.ma_dang = any(v_dangs)),
  msdo as materialized (select distinct m.hoc_sinh_id as hs from public.fn_mastery_cells(v_hs, false, v_tu, 5, 5, 3, v_den) m where m.ma_dang = any(v_dangs)),
  ll as materialized (select h.hs,
                exists (select 1 from ms0 join ms1 on ms1.hs = ms0.hs and ms1.ma_dang = ms0.ma_dang
                        where ms0.hs = h.hs and ms1.muc = 'dat' and ms1.tin in ('tb', 'cao')) as lap,
                not exists (select 1 from ms1 where ms1.hs = h.hs and ms1.muc = 'yeu') and exists (select 1 from msdo where msdo.hs = h.hs) as sach
         from hs h),
  tk as materialized (select * from thanh_tuu where mon = p_mon and active)
  select h.hs, tk.key,
    case
      when tk.mo_tu is not null and v_me < tk.mo_tu then 'khong_ap_dung'
      when tk.loai_chi_so = 'mt_hon_moc' and (select mm.ym from mt_moc mm where mm.hoc_sinh_id = h.hs) = p_ym then 'khong_ap_dung'
      when case tk.loai_chi_so
        when 'diem_danh_du'        then coalesce((select dd.co >= 1 and dd.vang = 0 from dd where dd.hs = h.hs), false)
        when 'btvn_dung_han_du'    then coalesce((select bt.n >= 1 and bt.dh = bt.n from bt where bt.hs = h.hs), false)
        when 'tu_luyen_cau_dung'   then coalesce((select tl.n >= (tk.tham_so->>'n')::int from tl where tl.hs = h.hs), false)
        when 'thu_thach_ngay_pass' then coalesce((select tt.ngay_pass >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'thu_thach_luot_full' then coalesce((select tt.so_full >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'et_ti_le_bai'        then coalesce((select count(*) >= 1 and count(*) filter (where bai.tl >= (tk.tham_so->>'ti_le')::numeric)
                                                         >= (tk.tham_so->>'phan')::numeric * count(*)
                                                  from bai where bai.hs = h.hs and bai.phase = 'et'), false)
        when 'btvn_ti_le_tb'       then coalesce((select avg(bai.tl) >= (tk.tham_so->>'ti_le')::numeric from bai where bai.hs = h.hs and bai.phase = 'btvn'), false)
        when 'mt_top_pct'          then coalesce((select m.hang <= ceil((tk.tham_so->>'pct')::numeric * m.so_em) from mt_nay m where m.hoc_sinh_id = h.hs), false)
        when 'mt_hon_moc'          then coalesce((select m.hang::numeric / m.so_em < mc.hang::numeric / mc.so_em
                                                         or m.hang <= ceil((tk.tham_so->>'top_pct')::numeric * m.so_em)
                                                  from mt_nay m join mt_moc mc on mc.hoc_sinh_id = m.hoc_sinh_id where m.hoc_sinh_id = h.hs), false)
        when 'lap_lo'              then coalesce((select ll.lap or ll.sach from ll where ll.hs = h.hs), false)
        when 'dua_thang_top_pct'   then coalesce((select d.hang <= ceil((tk.tham_so->>'pct')::numeric * d.so_em) from _dua d where d.hoc_sinh_id = h.hs), false)
        when 'giai_thuong'         then exists (select 1 from hs_giai_thuong g where g.hoc_sinh_id = h.hs and g.mon = p_mon and g.thang = v_ms)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $function$;

-- _kho_ban_do_dong
CREATE OR REPLACE FUNCTION public._kho_ban_do_dong(p_mon text, p_khoi text)
 RETURNS TABLE(nhanh text, cautbl text, ma_chu_de text, ten_chu_de text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, muc_do smallint)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nh text; v_bd text;
begin
  foreach v_nh in array public._kho_ds_nhanh_khoi(p_mon, p_khoi) loop
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
end $function$;

-- fn_ban_do_phieu_luu
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

-- tu_luyen_chu_de_ds_dang
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
    v_dk := public._kho_dk_online_hs_sql('bdm_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from bdm_ban_do bd
      join lateral (select count(*) as tong_cau from bdm_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
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
end $function$;
