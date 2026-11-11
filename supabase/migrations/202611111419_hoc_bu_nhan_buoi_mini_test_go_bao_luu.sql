-- ============================================================================
-- hoc_bu_nhan_buoi_mini_test_go_bao_luu — HỌC BÙ buổi MINI TEST ra rỗng ⇒ sửa; gỡ luật Bảo lưu (Thùy 11/11)
-- ----------------------------------------------------------------------------
-- Thùy: "Đào Minh Quân vẫn đi học bổ trợ nhưng trợ giảng vẫn báo không hiện câu của bài toán tổng hiệu."
-- Gốc lỗi (đo thật): fn_hs_bu_dang (màn "Học bù" app HS) chỉ lấy dạng của buổi gốc ở phase ingame/et/btvn.
--   Buổi 4T1 31/10 là buổi MINI TEST — 16 dạng, toàn phase 'mt' (tổng hiệu NDB01541·01623–01626, TBC, dãy số…)
--   ⇒ bù buổi đó ra "Buổi này chưa có dạng bài nào trên app" ⇒ em vắng buổi MT thì bù không có câu. Lỗi cho MỌI em, mọi khối.
-- NAY: + phase 'mt' (xếp sau ET, trước BTVN). Câu vẫn chọn qua tu_luyen_chu_de_sinh bu_luyen/bu_test như cũ.
-- GỠ luật Bảo lưu ở mig 202611101833 (Thùy: không làm kiểu bảo lưu): _hs_dang_da_hoc bỏ 2 dòng 'bao_luu' ⇒ đúng thân trước 10/11;
--   _hs_lop_tu_luyen bỏ nhánh lớp-gần-nhất của em bảo lưu ⇒ đúng thân cũ. Minh Quân vẫn mở cả khối 4T qua hs_mo_dang (mig 202611101825).
-- MẤT GÌ: không xoá dữ liệu. Chỉ thay thân 3 hàm.
-- ============================================================================
CREATE OR REPLACE FUNCTION public._hs_lop_tu_luyen(p_hs uuid, p_mon text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(
    (select hl.lop_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
      where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
      order by hl.ngay_vao desc limit 1),
    (select m.lop_id from mon_mo_ca_khoi m join hoc_sinh h on h.khoi = m.khoi
      where h.id = p_hs and m.mon = p_mon))
$function$;

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
    from (select public._do_o(p.ma_cau, p.ma_dang) as ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 when 'mt' then 1500 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'mt', 'btvn'))   -- 11/11: + 'mt' — buổi MINI TEST (vd 4T1 31/10: tổng hiệu, TBC…) trước đây bù ra rỗng
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by 1) x
     where x.ma_dang is not null;   -- bản đồ mới: câu chưa quy được thì không hiện
  -- Thùy 03/10: bù 100% MCQ ⇒ báo dạng nào CÓ câu trắc nghiệm (cùng điều kiện duy nhất _kho_dk_mcq_sql) — dạng không có thì app ghi rõ 'học trên giấy'.
  for x in select * from jsonb_array_elements(v_out) loop
    v_tbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, x->>'ma_dang'));
    execute format('select exists (select 1 from %I c where c.dang_chinh = $1 and c.xoa_at is null and (%s or %s))', v_tbl, public._kho_dk_mcq_sql(v_tbl), public._kho_dk_tln_sql()) into v_co using x->>'ma_dang'; -- Thùy 10/10: MCQ hoặc trả lời ngắn
    v_kq := v_kq || (x || jsonb_build_object('co_mcq', coalesce(v_co, false)));
  end loop;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_kq);
end $function$
;

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
  with ev as materialized (
    select g.hoc_sinh_id, coalesce(sp.ma_cau, '') as k, sp.ma_dang
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = any(v_hs) and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn')
    union all
    select bl.hoc_sinh_id, coalesce(btc.ma_cau, ''), btc.ma_dang
      from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = any(v_hs) and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
    union all
    select tl.hoc_sinh_id, coalesce(btg.ma_cau, ''), btg.ma_dang
      from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
     where tl.hoc_sinh_id = any(v_hs) and btg.ma_dang is not null
  ), cap as materialized (   -- quy nhóm MỘT lần cho mỗi cặp (mã câu, mã dạng), không phải mỗi lượt đo
    select p.k, p.ma_dang, coalesce(public._do_o(nullif(p.k, ''), nullif(p.ma_dang, '')), p.ma_dang) as nhom
      from (select distinct e.k, e.ma_dang from ev e) p
  ), nh as materialized (
    select distinct e.hoc_sinh_id, e.ma_dang as goc, c.nhom
      from ev e join cap c on c.k = e.k and c.ma_dang = e.ma_dang
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
  -- MỞ RIÊNG cho em (Thùy 23/10): chỉ cộng khi đang có lọc (rỗng = không lọc, cộng vào sẽ thành lọc)
  if cardinality(v_res) > 0 then
    select array(select distinct d from unnest(v_res || coalesce((select array_agg(m.ma_dang) from hs_mo_dang m
                                                                   where m.hoc_sinh_id = p_hs and m.mon = p_mon), '{}'::text[])) d)
      into v_res;
  end if;
  return v_res;
end $function$
;
