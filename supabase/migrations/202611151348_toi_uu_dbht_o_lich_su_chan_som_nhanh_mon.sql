-- ============================================================================
-- 202611151348 — toi_uu_dbht_o_lich_su_chan_som_nhanh_mon
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- [15/11 · tối ưu] fn_dbht_o_lich_su (bấm 1 ô ở Dashboard học tập): chặn sớm nhánh "môn một vùng".
-- Vì sao: đo 15/11 — 8 lượt × 2,2 s với người dùng thật; ấm ~0,95 s/lượt. Hàm ghép hai nhánh (Toán | môn một vùng KHTN · Vật lý · Hóa học). Bấm ô TOÁN vẫn
-- chạy trọn _mastery_mon_d của em (~0,58 s) rồi mới lọc "x.mon = p_mon" ⇒ ra 0 dòng. _mastery_mon_d chỉ trả dòng có mon thuộc _mastery_mon_ds() nên thêm
-- "p_mon = any(_mastery_mon_ds())" là TƯƠNG ĐƯƠNG tuyệt đối; điều kiện này không phụ thuộc dòng ⇒ Postgres kiểm một lần và bỏ hẳn nhánh.
-- So cũ–mới 15/11 (mỗi ca một giao dịch, rollback): 160 ca = 42 ô Toán + 30 ô KHTN + 8 ô lệch môn, × 30/90 ngày — LỆCH 0. Ô Toán ấm 1.133 → 433 ms; ô môn một vùng không đổi (682 ms).
-- (Nhánh Toán đã có sẵn chặn tương tự: _kho_ban_do_tbl(p_mon) = 'dai_ban_do'.) Thân hàm lấy từ DB lúc sinh, thay đúng 1 chỗ, có chốt md5 thân cũ.

do $chot$ begin
  if (select md5(prosrc) from pg_proc where oid = 'public.fn_dbht_o_lich_su(uuid, text, text, text, integer)'::regprocedure) <> '83cbc2d236fcab315d443825e448e4a1' then
    raise exception 'Thân hàm fn_dbht_o_lich_su đã đổi so với lúc sinh migration — sinh lại.';
  end if;
end $chot$;

CREATE OR REPLACE FUNCTION public.fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_ngay integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with d as (
    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x
     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
       and public._kho_ban_do_tbl(p_mon) = 'dai_ban_do'
    union all   -- 13/11: môn một vùng
    select x.hoc_sinh_id, x.luot, x.value, x.t, x.src, x.dang, x.nhom, x.chuyen_de, x.chu_de, false
      from public._mastery_mon_d(array[p_hs], true, null, null) x
     where p_mon = any(public._mastery_mon_ds())   -- [15/11] điều kiện KHÔNG phụ thuộc dòng ⇒ Postgres bỏ hẳn nhánh này khi ô là Toán (trước: tính trọn rồi mới lọc)
       and x.mon = p_mon and case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
  ),
  moc as (select now() - make_interval(days => greatest(1, coalesce(p_so_ngay, 30))) as tu),
  lu as (select luot, min(t) as t, min(src) as src, sum(value) as dung, count(*) as tong, avg(value) as p_lan from d group by luot),
  k as (select lu.*, row_number() over (order by t, luot) as k, case when (select bool_or(hh) from d) then 3 else 5 end as cs from lu),
  lq as (   -- "hiện tại" tại lần k = TB ≤cs lần gần nhất trong 30 ngày tính tới lần k (cùng luật _mastery_lan_cap)
    select k.*, w.tl, w.so_lan5
      from k cross join lateral (
        select avg(x.p_lan) as tl, count(*)::int as so_lan5
          from (select x.p_lan from k x where x.k <= k.k and x.t > k.t - interval '30 days' order by x.k desc limit k.cs) x
      ) w
  ),
  ld as (
    select lq.*, round(100 * tl)::int as p, round(100 * p_lan)::int as p_luot,
           round(100 * (p_lan - lag(tl) over (order by k)))::int as delta, round(100 * lag(tl) over (order by k))::int as p_truoc
      from lq
  )
  select jsonb_build_object(
    'tu', ((select tu from moc) at time zone 'Asia/Ho_Chi_Minh')::date, 'dau_ky', null, 'so_ngay', greatest(1, coalesce(p_so_ngay, 30)),
    'co_cu', exists (select 1 from ld where ld.t < (select tu from moc)),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', (ld.t at time zone 'Asia/Ho_Chi_Minh')::date, 'kenh', ld.src, 'dung', round(ld.dung, 2), 'tong', ld.tong, 'so_lan5', ld.so_lan5,
              'p', ld.p, 'p_luot', ld.p_luot, 'p_truoc', ld.p_truoc, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', null, 'dang', coalesce(public._kho_ten_dang(p_mon, w.dang), case when public._kho_ban_do_tbl(p_mon) <> 'dai_ban_do' then (select v.ten from tl_bdm_dang_bai_v v where v.id = w.dang and v.mon = p_mon) end, w.dang), 'g', round(w.value, 2)))
                        from d w where w.luot = ld.luot))
            order by ld.k) from ld where ld.t >= (select tu from moc)), '[]'::jsonb)
  )
$function$;
