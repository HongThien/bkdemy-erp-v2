-- ============================================================================
-- 202611131539 — dang_yeu_mot_luat
-- VÌ SAO (Thùy 13/11, nguyên văn): "Bỏ luật cũ đi. chỉ có 1 luật thôi. hủy luật 2 cửa sổ đi chứ sao lại có 2 luật đánh giá được."
--   Trước: "dạng yếu" (dashboard học tập · QLCL · báo cáo tuần · đề xuất bổ trợ yếu — mọi nơi qua _btyeu_dang_theo_nhom / dang_yeu_hien_tai)
--   = dạng CHƯA ĐẠT trong NHÓM YẾU và có lần đo trong 2 cửa sổ gần nhất; còn "nhóm yếu" thì đếm thẳng theo mastery theo lần ⇒ 2 luật trên 1 dòng
--   (Thu Giang 10A1: 6 nhóm yếu nhưng "5 dạng yếu", mastery theo lần thật là 12).
--   Nay MỘT luật: dạng yếu = dạng có mức 'yeu' theo mastery theo lần (_mastery_lan_cap_nhanh, cùng nguồn với nhóm yếu). Bỏ lọc "đo trong 2 cửa sổ"
--   và bỏ lọc "phải nằm trong nhóm yếu" — cả nhánh dạng bản đồ lẫn nhánh bài mô hình Hình. Giữ chữ ký mọi hàm (người gọi không đổi).
--   Số đã chốt/đóng băng (báo cáo tuần đã nộp, _qlcl_dong_bang_tuan) KHÔNG tính lại. Cache dang_yeu_hien_tai: đánh dấu cũ ⇒ cron nền tính lại.
-- MẤT GÌ (Luật xoá): không xoá dòng. dang_yeu_hien_tai.tinh_at lùi về 2000-01-01 (cache, tự tính lại).
-- ============================================================================

CREATE OR REPLACE FUNCTION public._btyeu_dang_theo_nhom(p_hs uuid[], p_mon text, p_den timestamp with time zone, p_tu_ngay date, p_den_ngay date)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, ten_dang text, score numeric, n integer, nhom_id text, nhom_score numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- 13/11 MỘT LUẬT: dạng yếu = mức 'yeu' theo mastery theo lần (như nhóm yếu). p_tu_ngay / p_den_ngay (cửa sổ cũ) không còn dùng — giữ chữ ký.
  with m as materialized (
    select * from public._mastery_lan_cap_nhanh(public._mastery_bdm_bat(), p_hs, true, null, p_den, array['dang', 'nhom'], 5, 5, 3)
  ),
  dg as (
    select m.hoc_sinh_id, m.nut as ma_dang, m.score, m.n, coalesce(hh.ma_bai, db.nhom_id) as nhom
    from m left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
    where m.cap = 'dang' and m.muc = 'yeu'
  )
  select dg.hoc_sinh_id, dg.ma_dang, t.ten_dang::text, dg.score, dg.n::int, dg.nhom, nh.score
  from dg left join m nh on nh.cap = 'nhom' and nh.hoc_sinh_id = dg.hoc_sinh_id and nh.nut = dg.nhom
  cross join lateral (select public._kho_ten_dang(p_mon, dg.ma_dang) as ten_dang) t
  where t.ten_dang is not null and not public._kho_dang_da_xoa_mem(dg.ma_dang)
  order by dg.hoc_sinh_id, dg.score, dg.n desc, dg.ma_dang
$function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so_moi(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not (public.la_thanh_vien() or public._la_tac_vu_nen()) or v_bd is null then return; end if;   -- 11/11: cho phép tác vụ nền (_qlcl_lam_moi_nen, pg_cron)
  if public._mastery_theo_lan_bat() then
    -- 10/11: theo NHÓM yếu (_btyeu_dang_theo_nhom)
    return query select d.ma_dang, d.ten_dang, d.score, d.n from public._btyeu_dang_theo_nhom(array[p_hs], p_mon, null, v_moc, null) d;
  else
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells_bdm(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_o_bdm(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  end if;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'   -- 13/11 một luật: bỏ lọc "đo trong 2 cửa sổ"
    order by (h.n >= 2) desc, h.score;
end $function$;

CREATE OR REPLACE FUNCTION public._dang_yeu_tai_lo(p_hs uuid[], p_mon text, p_moc timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon);
  -- ngày làm mốc cửa sổ: mốc T2 00:00 ⇒ ngày CN (lần đo cuối được tính là của CN)
  v_d date := case when p_moc is null then (now() at time zone 'Asia/Ho_Chi_Minh')::date
                   else ((p_moc - interval '1 second') at time zone 'Asia/Ho_Chi_Minh')::date end;
  v_moc date := public._btyeu_moc_2_cua_so_tai(v_d);
  i integer;
begin
  if v_bd is null or cardinality(coalesce(p_hs, '{}')) = 0 then return; end if;
  if public._mastery_theo_lan_bat() then
    -- 10/11: theo NHÓM yếu. Chia lô 20 em: cả môn một lệnh chậm phi tuyến (đo: 347 em 1 lệnh 172 s, lô 10 em cộng lại 75 s)
    for i in 1..cardinality(p_hs) by 20 loop
      return query select d.hoc_sinh_id, d.ma_dang, d.ten_dang, d.score, d.n
        from public._btyeu_dang_theo_nhom(p_hs[i:i + 19], p_mon, p_moc, v_moc, case when p_moc is null then null else v_d end) d;
    end loop;
  else
  return query execute format($q$
    select m.hoc_sinh_id, m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells_bdm($1, true, null, 5, 5, 3, $4) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang)
    where m.muc = 'yeu'
      and m.ma_dang in (select public._do_o_bdm(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = m.hoc_sinh_id and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2
                                and ($4 is null or coalesce(b.ngay, g.graded_at::date) <= $5)) d)
    order by m.hoc_sinh_id, (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon, p_moc, v_d;
  end if;
  -- dạng = bài mô hình Hình (14/10), cùng luật
  return query
    select h.hoc_sinh_id, hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public._mastery_cells_hinh_tai(p_hs, true, null, p_moc) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'   -- 13/11 một luật: bỏ lọc "đo trong 2 cửa sổ"
    order by h.hoc_sinh_id, (h.n >= 2) desc, h.score;
end $function$;

update dang_yeu_hien_tai set tinh_at = '2000-01-01';   -- cache: cron nền tính lại theo luật mới (cũ nhất trước)
