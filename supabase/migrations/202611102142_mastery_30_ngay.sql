-- ============================================================================
-- 202611102142 — mastery_30_ngay
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 10/11): "luật mastery tối đa là 30 ngày thôi. 30 ngày không có lần đánh giá nào hiện không có dữ liệu chứ không
--   tính từ đầu năm đâu. Lịch sử của mỗi nhóm bài cũng hiện 1 tháng. Người dùng muốn xem thêm thì ấn xem thêm, lúc đó DB mới load."
--
-- (1) MASTERY THEO LẦN: chỉ lấy các lần trong 30 ngày tính tới mốc (mốc = p_den nếu có — vd dạng yếu tại mốc D —, không thì now()).
--     Trong 30 ngày: trung bình ≤5 lần gần nhất (Hình–Học 3) như cũ. 30 ngày không có lần nào ⇒ KHÔNG có dòng = chưa đo (§1.5, §5),
--     không lôi lần cũ hơn về. Sửa ĐÚNG MỘT chỗ — _mastery_lan_cap (nguồn công thức duy nhất; cache, đối chiếu, bổ trợ, Dashboard
--     đều đi qua nó). _mastery_lan_d giữ nguyên vì lịch sử ô vẫn cần đọc lần cũ khi bấm "xem thêm".
--     p_since người gọi truyền vào vẫn có hiệu lực nếu muộn hơn mốc 30 ngày (greatest).
--     Bảng chụp mastery_luu_san: lưới đêm 02:00 VN đánh bẩn tất cả ⇒ mỗi đêm chụp lại theo luật mới (lần quá 30 ngày rơi ra theo ngày).
--     Mig KHÔNG đánh bẩn tất cả ngay (giờ HS chơi tối — memory "không chạy truy vấn nặng 17–22h"); tới sáng 11/11 cả kho theo luật mới.
--
-- (2) LỊCH SỬ Ô (popup Dashboard): fn_dbht_o_lich_su đổi tham số p_so_tuan (không dùng) → p_so_ngay (mặc định 30): chỉ trả các lần
--     trong p_so_ngay ngày gần nhất + cờ co_cu (còn lần cũ hơn) để màn hiện nút "Xem thêm" (bấm mới gọi lại với p_so_ngay + 30).
--     Cột "Hiện tại" từng dòng = mastery TẠI ngày của lần đó theo cùng luật (≤5 lần trong 30 ngày tính tới lần đó).
--
-- MẤT GÌ (Luật xoá): DROP fn_dbht_o_lich_su(uuid,text,text,text,integer) để đổi tên tham số (create or replace không đổi tên được);
--   tạo lại ngay cùng chữ ký kiểu. Chỉ là hàm đọc, không dữ liệu nào mất; người gọi duy nhất = src/lib/dashboardHocTap.ts (sửa cùng đợt).
-- ============================================================================

create or replace function public._mastery_lan_cap(p_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[], p_window integer, p_tin_cao integer, p_tin_tb integer)
 returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
 language sql
 stable rows 20000
as $function$
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
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, cap, nut
$function$;

drop function if exists public.fn_dbht_o_lich_su(uuid, text, text, text, integer);
create function public.fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_ngay integer default 30)
 returns jsonb
 language sql
 stable
 set search_path to 'public'
as $function$
  with d as (
    select x.* from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true, null, null) x
     where case p_cap when 'nhom' then x.nhom when 'chu_de' then x.chu_de else x.chuyen_de end = p_ma
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
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', null, 'dang', coalesce(public._kho_ten_dang(p_mon, w.dang), w.dang), 'g', round(w.value, 2)))
                        from d w where w.luot = ld.luot))
            order by ld.k) from ld where ld.t >= (select tu from moc)), '[]'::jsonb)
  )
$function$;
revoke execute on function public.fn_dbht_o_lich_su(uuid, text, text, text, integer) from public, anon;
grant execute on function public.fn_dbht_o_lich_su(uuid, text, text, text, integer) to authenticated;
