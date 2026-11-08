-- _hs_dang_da_hoc (dạng LỚP đã học — lọc câu Leo tháp / trận bot) làm nhanh, GIỮ NGUYÊN kết quả.
-- Đo 03/11: 12A1 mất 8,6–9,2 s (trần PostgREST 8 s) vì `_do_o` bị gọi trên TỪNG dòng sự kiện (1461 dòng)
-- trong khi chỉ có 274 cặp (mã câu, mã dạng) khác nhau; câu ĐÃ XOÁ của dạng cũ khối 12 phải dò ~7000 câu
-- anh em mỗi lần (~100 ms/lần). Giờ: quy nhóm 1 lần cho mỗi cặp rồi nối lại vào sự kiện.
-- `_do_o` chỉ đọc (mã câu, mã dạng) nên kết quả trùng khớp; đã so mảng trả về trước/sau cho mọi lớp Toán/KHTN.
create or replace function public._hs_dang_da_hoc(p_hs uuid, p_mon text)
 returns text[]
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
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
end $function$;
