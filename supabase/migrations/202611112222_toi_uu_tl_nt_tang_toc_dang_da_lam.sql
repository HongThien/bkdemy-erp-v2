-- ============================================================================
-- NÔNG TRẠI · Tăng tốc bằng Toán — `_hs_dang_em_da_lam` không quy nhóm 2 lần cho cùng một cặp (câu, dạng)
-- (audit timeout 11/11: fn_nt_tang_toc_de 191 lần × 1,9 s, max 8 s).
--
-- Bản cũ: `union select _do_o(nullif(coalesce(ma_cau,''),''), ma_dang) from ev union select _do_o_bdm(ma_cau, ma_dang) from ev
-- where _mastery_bdm_bat()`. Khi bản đồ mới bật, `_do_o` CHÍNH LÀ `_do_o_bdm` và hai đối số trùng nhau (trừ khi ma_cau = '')
-- ⇒ mỗi cặp bị quy nhóm 2 lần (mỗi lần vài tra cứu qua bdm_cau_dang). Bản mới: quy 1 lần, chỉ gọi _do_o_bdm riêng khi
-- ma_cau = '' (đúng ca hai đối số khác nhau — hiện 0 dòng trong gami_session_problems / bai_test_cau). Kết quả giống từng phần tử.
-- Chỉ fn_nt_tang_toc_de gọi hàm này (pg_proc 11/11).
-- Kiểm 12/11 (ROLLBACK, 16 HS khối 4→12, sau mig 202611112136_hs_index_hs…2221): mảng dạng cũ = mới 16/16; tập câu ứng viên
-- của fn_nt_tang_toc_de (md5 danh sách mã) 16/16. Đề bốc ra KHÔNG so được theo setseed: bản cũ chạy 2 lần cùng seed cũng chỉ
-- trùng 9/16 (thứ tự dòng ứng viên không cố định). _hs_dang_em_da_lam 110–290 ⇒ 80–240 ms; tăng tốc 180–390 ⇒ 150–280 ms.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._hs_dang_em_da_lam(p_hs uuid, p_mon text)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with ev as (
    select sp.ma_cau, sp.ma_dang from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
     where g.hoc_sinh_id = p_hs and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn') and l.mon = p_mon
    union
    select btc.ma_cau, btc.ma_dang from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id join bai_lam_cau blc on blc.bai_lam_id = bl.id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = p_hs and bt.mon = p_mon and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
  ),
  -- quy nhóm MỘT lần mỗi cặp (ev là UNION nên đã khử trùng)
  q as materialized (
    select ev.ma_cau, ev.ma_dang, public._do_o(nullif(coalesce(ev.ma_cau, ''), ''), ev.ma_dang) as o1 from ev
  )
  select coalesce(array_agg(distinct d) filter (where d is not null), '{}'::text[]) from (
    select ma_dang d from q
    union select o1 from q
    -- = _do_o_bdm(ma_cau, ma_dang): khi bản đồ mới bật thì _do_o ≡ _do_o_bdm, và đối số chỉ khác o1 khi ma_cau = ''
    union select case when q.ma_cau = '' then public._do_o_bdm(q.ma_cau, q.ma_dang) else q.o1 end from q where public._mastery_bdm_bat()
    union select m.ma_dang from hs_mo_dang m where m.hoc_sinh_id = p_hs and m.mon = p_mon
  ) x
$function$;
