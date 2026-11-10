-- BỔ TRỢ YẾU THEO NHÓM (Thùy 10/11) — luyện NHÓM yếu thay vì DẠNG yếu. Đi sau mig 202611101427_mastery_theo_lan.
-- "Nhóm quyết, dạng thực thi": nhóm bài YẾU (mastery theo lần) quyết định em có cần bổ trợ phần đó không; vào case vẫn là các DẠNG
-- của nhóm (bo_tro_yeu_dang) ⇒ chọn câu (_btyeu_chon_cau), luyện · test · retest · phiếu giấy · app TA/HS KHÔNG phải sửa.
-- Luật (mọi chỗ đang hỏi "dạng yếu của em" — đổ dạng lúc mở case, đề xuất dạng mới, còn yếu, chụp đầu tuần, QLCL, bổ trợ nhẹ):
--   · nhóm YẾU (<0,5, 5 lần gần nhất) + nhóm có đo trong 2 cửa sổ gần nhất (như luật cũ của dạng);
--   · dạng vào case = mọi dạng ĐÃ ĐO của nhóm chưa ĐẠT, xếp dạng yếu nhất trước; nhóm yếu mà mọi dạng đều đạt ⇒ vẫn lấy dạng thấp nhất (nhóm phải được luyện);
--   · dạng chưa đo không vào (chưa đo ≠ yếu, §5);
--   · dạng KHÔNG quy được nhóm (môn chưa có nhóm, vd KHTN bản đồ cũ) ⇒ giữ luật cũ theo dạng (dạng yếu + có đo gần đây);
--   · Hình–Học: nhóm = bài = dạng ⇒ như cũ. Hình–Luyện (bài mô hình) giữ đường riêng, không đổi.
-- "Còn yếu" (_btyeu_dang_con_yeu) tự theo luật mới ⇒ dạng thôi còn yếu khi NHÓM ra khỏi yếu hoặc chính dạng đã đạt.
-- Gắn công tắc mastery_theo_lan: tắt ⇒ về luật dạng yếu cũ nguyên văn.

-- 1. Công thức theo lần tính MỘT LƯỢT cho nhiều cấp (dạng + nhóm cùng lúc, đọc lượt đo 1 lần). _mastery_lan_core thành lớp mỏng.
create or replace function public._mastery_lan_cap(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                   p_since timestamp with time zone, p_den timestamp with time zone, p_caps text[],
                                                   p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, cap text, nut text, score numeric, n bigint, muc text, tin text)
-- rows 20000: ước lượng thật (cả môn ~20k ô) — để mặc định 1000 thì planner tưởng nhỏ, nối lại bằng nested loop (đo 10/11: lô 60 em +3 s)
language sql stable rows 20000 as $$
  with d as materialized (
    select l.hoc_sinh_id, l.luot, l.value, l.t, l.ma_dang as dang, coalesce(hh.ma_bai, db.nhom_id) as nhom, (hh.ma_bai is not null) as hh
    from public._mastery_luot_do_quy(p_bdm, false, p_hs, p_include_btvn, p_since, p_den) l
    left join hinh_hoc_bai hh on hh.ma_bai = l.ma_dang
    left join dai_bdm_dang_bai db on db.id = l.ma_dang
    where l.src <> 'tu_luyen' or l.cap1          -- Thùy 10/11: bỏ tự luyện, trừ cấp 1
  ),
  lan as (
    select hoc_sinh_id, 'dang'::text as cap, dang as nut, luot, bool_or(hh) as hh, avg(value) as p, max(t) as t
    from d where 'dang' = any(p_caps) group by hoc_sinh_id, dang, luot
    union all
    select hoc_sinh_id, 'nhom', nhom, luot, bool_or(hh), avg(value), max(t)
    from d where 'nhom' = any(p_caps) and nhom is not null group by hoc_sinh_id, nhom, luot
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
         count(*) as n,                               -- n = SỐ LẦN
         case when avg(p) filter (where rn <= cs) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= cs) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, cap, nut
$$;

create or replace function public._mastery_lan_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                    p_since timestamp with time zone, p_den timestamp with time zone, p_cap text,
                                                    p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, nut text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  select c.hoc_sinh_id, c.nut, c.score, c.n, c.muc, c.tin
  from public._mastery_lan_cap(p_bdm, p_hs, p_include_btvn, p_since, p_den, array[p_cap], p_window, p_tin_cao, p_tin_tb) c
$$;

-- 2. LUẬT DUY NHẤT "dạng cần bổ trợ" theo nhóm. Nguồn đo = mọi nguồn trừ tự luyện (như bổ trợ cũ: include_btvn = true).
--    p_tu_ngay / p_den_ngay = khoảng "có đo gần đây" (ngày buổi); p_den = mốc cắt mastery (null = tới giờ).
create or replace function public._btyeu_dang_theo_nhom(p_hs uuid[], p_mon text, p_den timestamp with time zone, p_tu_ngay date, p_den_ngay date)
returns table(hoc_sinh_id uuid, ma_dang text, ten_dang text, score numeric, n integer, nhom_id text, nhom_score numeric)
language sql stable security definer set search_path = public as $$
  with m as materialized (
    select * from public._mastery_lan_cap(public._mastery_bdm_bat(), p_hs, true, null, p_den, array['dang', 'nhom'], 5, 5, 3)
  ),
  dg as materialized (
    select m.hoc_sinh_id, m.nut as ma_dang, m.score, m.n, m.muc, coalesce(hh.ma_bai, db.nhom_id) as nhom
    from m left join hinh_hoc_bai hh on hh.ma_bai = m.nut left join dai_bdm_dang_bai db on db.id = m.nut
    where m.cap = 'dang'
  ),
  nh as (select m.hoc_sinh_id, m.nut as nhom, m.score, m.muc from m where m.cap = 'nhom'),
  -- có đo gần đây: theo dạng HIỆN TẠI của câu (đo đi theo câu, 12/10) — quy 1 lần mỗi cặp câu–mã chép
  cap_gan as materialized (
    select distinct g.hoc_sinh_id, p.ma_cau, p.ma_dang
    from gami_grades g join gami_session_problems p on p.id = g.problem_id
    left join buoi_hoc b on b.id = g.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and p.ma_dang is not null
      and coalesce(b.ngay, g.graded_at::date) >= p_tu_ngay
      and (p_den_ngay is null or coalesce(b.ngay, g.graded_at::date) <= p_den_ngay)
  ),
  quy as materialized (
    select x.ma_cau, x.ma_dang, public._do_o_bdm(x.ma_cau, x.ma_dang) as md
    from (select distinct ma_cau, ma_dang from cap_gan) x
  ),
  gan as materialized (
    select distinct cg.hoc_sinh_id, q.md, coalesce(hh.ma_bai, db.nhom_id) as nhom
    from cap_gan cg join quy q on coalesce(q.ma_cau, '') = coalesce(cg.ma_cau, '') and q.ma_dang = cg.ma_dang
    left join hinh_hoc_bai hh on hh.ma_bai = q.md left join dai_bdm_dang_bai db on db.id = q.md
    where q.md is not null
  ),
  ung as (
    select dg.hoc_sinh_id, dg.ma_dang, dg.score, dg.n, dg.muc, dg.nhom, nh.score as nhom_score,
           row_number() over (partition by dg.hoc_sinh_id, dg.nhom order by dg.score, dg.n desc, dg.ma_dang) as rn
    from dg join nh on nh.hoc_sinh_id = dg.hoc_sinh_id and nh.nhom = dg.nhom and nh.muc = 'yeu'
    join (select distinct gan.hoc_sinh_id, gan.nhom from gan where gan.nhom is not null) gn on gn.hoc_sinh_id = dg.hoc_sinh_id and gn.nhom = dg.nhom
  ),
  chon as (
    select u.hoc_sinh_id, u.ma_dang, u.score, u.n, u.nhom, u.nhom_score from ung u where u.muc <> 'dat' or u.rn = 1
    union all
    select dg.hoc_sinh_id, dg.ma_dang, dg.score, dg.n, null, null
    from dg join (select distinct gan.hoc_sinh_id, gan.md from gan) gd on gd.hoc_sinh_id = dg.hoc_sinh_id and gd.md = dg.ma_dang
    where dg.nhom is null and dg.muc = 'yeu'
  )
  select c.hoc_sinh_id, c.ma_dang, t.ten_dang::text, c.score, c.n::int, c.nhom, c.nhom_score
  from chon c cross join lateral (select public._kho_ten_dang(p_mon, c.ma_dang) as ten_dang) t
  where t.ten_dang is not null and not public._kho_dang_da_xoa_mem(c.ma_dang)
  order by c.hoc_sinh_id, coalesce(c.nhom_score, c.score), c.nhom, c.score
$$;

-- 3. Dạng yếu 2 cửa sổ của 1 em (đổ dạng lúc mở case · còn yếu · QLCL · bổ trợ nhẹ)
create or replace function public.fn_btyeu_dang_yeu_2_cua_so_moi(p_hs uuid, p_mon text)
returns table(ma_dang text, ten_dang text, score numeric, n integer)
language plpgsql stable security definer set search_path to 'public' as $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
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
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$;

-- 4. Dạng yếu tại một mốc cho cả lô (chụp đầu tuần / KPI báo cáo tuần)
create or replace function public._dang_yeu_tai_lo(p_hs uuid[], p_mon text, p_moc timestamp with time zone)
returns table(hoc_sinh_id uuid, ma_dang text, ten_dang text, score numeric, n integer)
language plpgsql stable security definer set search_path to 'public' as $function$
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
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = h.hoc_sinh_id and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc
                    and (p_moc is null or coalesce(b.ngay, g.graded_at::date) <= v_d))
    order by h.hoc_sinh_id, (h.n >= 2) desc, h.score;
end $function$;

-- 5. Đề xuất dạng mới cho case đang xử (nút "🤖 +N dạng yếu mới")
create or replace function public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record; v_lan boolean := public._mastery_theo_lan_bat();
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    if v_lan then
      -- 10/11: dạng thuộc NHÓM yếu, nhóm có đo từ ngày mở case
      for r in
        select y.id as case_id, y.hoc_sinh_id, d.ma_dang, d.ten_dang, d.score, d.n
        from bo_tro_yeu y
        cross join lateral public._btyeu_dang_theo_nhom(array[y.hoc_sinh_id], v_mon, null, (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date, null) d
        where y.mon = v_mon and y.trang_thai = 'dang_xu' and (p_case is null or y.id = p_case)
          and not exists (select 1 from bo_tro_yeu_dang x where x.bo_tro_yeu_id = y.id and x.ma_dang = d.ma_dang)
        order by y.id, coalesce(d.nhom_score, d.score), d.score
      loop
        if p_thuc_hien then
          insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
            values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
          if found then v_n := v_n + 1; end if;
        end if;
        v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
      end loop;
    else
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at, y.ban_do from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells_bdm((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu'),
      gan as materialized (
        select cs.case_id, public._do_o_bdm(d.ma_cau, d.ma_dang) as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang)
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
    end if;
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

revoke all on function public._mastery_lan_cap(boolean, uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) from public, anon;
grant execute on function public._mastery_lan_cap(boolean, uuid[], boolean, timestamptz, timestamptz, text[], integer, integer, integer) to authenticated, service_role;
revoke all on function public._btyeu_dang_theo_nhom(uuid[], text, timestamptz, date, date) from public, anon;
grant execute on function public._btyeu_dang_theo_nhom(uuid[], text, timestamptz, date, date) to authenticated, service_role;
