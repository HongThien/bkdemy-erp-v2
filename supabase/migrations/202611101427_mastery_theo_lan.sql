-- MASTERY THEO LẦN (Thùy 10/11) — đổi đơn vị đo từ CÂU sang LẦN (một bài làm), như Đánh giá cuối cấp.
-- Cấp NHÓM bài là chính (fn_mastery_nhom), cấp DẠNG là phụ (mọi hàm cũ đọc theo ma_dang giữ nguyên chữ ký).
-- Luật đã chốt (so trên dữ liệu thật: reports/so-mastery-theo-lan.html):
--   · 1 lần = 1 bài làm: buổi (phase + buổi) · bài làm app (bai_lam) · phiếu bổ trợ (tai_lieu). % lần = TB giá trị các câu của lần thuộc nút.
--   · mức = TB % của p_window lần gần nhất (mặc định 5; Hình–Học 3) — mọi lần NGANG NHAU, KHÔNG trọng số nguồn.
--   · BỎ tự luyện (trừ HS cấp 1 — như hiện nay cấp 1 luôn tính tự luyện).
--   · ngưỡng giữ 80/50 (dat / can_luyen / yeu); độ tin theo SỐ LẦN (5/3, Hình–Học 3/2).
-- CÔNG TẮC `mastery_theo_lan` (he_thong_cong_tac), TẠO Ở TRẠNG THÁI TẮT ⇒ áp migration này không đổi con số nào.
-- Bật ⇒ _mastery_cells_core (nguồn của fn_mastery_cells_moi / _bdm và ~20 hàm đọc theo dạng) chuyển sang theo lần.
-- Một nguồn lượt đo duy nhất: _mastery_luot_do_quy (thêm khoá lần + cờ cấp 1); _mastery_lan_do_quy thành lớp mỏng bên trên.

-- 1. Công tắc (tắt)
insert into he_thong_cong_tac (ma, bat, mo_ta)
values ('mastery_theo_lan', false,
        'Mastery đo theo LẦN (một bài làm) thay vì theo CÂU; cấp nhóm bài là chính (fn_mastery_nhom). Bỏ tự luyện (trừ cấp 1), không trọng số nguồn. Tắt = theo câu như cũ.')
on conflict (ma) do nothing;

create or replace function public._mastery_theo_lan_bat()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select bat from he_thong_cong_tac where ma = 'mastery_theo_lan'), false)
$$;

-- 2. Nguồn lượt đo duy nhất — y hệt _mastery_lan_do_quy cũ, thêm `luot` (khoá lần) và `cap1`.
create or replace function public._mastery_luot_do_quy(p_bdm boolean, p_khtn_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                       p_since timestamp with time zone, p_den timestamp with time zone)
returns table(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamp with time zone, src text, luot text, cap1 boolean)
language sql stable as $$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI; lần = phase + buổi (ET / MT / BTVN của một buổi)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau,
           sp.phase || ':' || coalesce(sp.buoi_hoc_id::text, 'd' || (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date::text) as luot
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: lần = một bài làm
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau,
           'bl:' || bl.id
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at; lần = một phiếu (tai_lieu)
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau,
           'bt:' || tl.id
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.*, h.cap1 from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = quy theo (câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as materialized (   -- 24/10: KHÔNG để Postgres inline — inline thì quy dạng chạy lại cho TỪNG lượt đo
    select d.kc, d.kd, public._do_o_quy(p_bdm, p_khtn_bdm, d.kc, d.kd) as nhom
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  )
  select mf.hoc_sinh_id, cap.nhom, mf.value, mf.t, mf.src, mf.luot, mf.cap1
  from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
$$;

-- lớp mỏng: chữ ký + kết quả giữ nguyên cho mọi chỗ đang gọi (_mastery_lan_do, fn_tong_quan_hs…)
create or replace function public._mastery_lan_do_quy(p_bdm boolean, p_khtn_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                      p_since timestamp with time zone, p_den timestamp with time zone)
returns table(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamp with time zone, src text)
language sql stable as $$
  select hoc_sinh_id, ma_dang, value, t, src from public._mastery_luot_do_quy(p_bdm, p_khtn_bdm, p_hs, p_include_btvn, p_since, p_den)
$$;

-- 3. Công thức THEO LẦN — một chỗ duy nhất cho cả 2 cấp (p_cap = 'dang' | 'nhom').
--    Nhóm: Hình–Học ⇒ nhóm = bài (= dạng); Đại/HGT ⇒ dai_bdm_dang_bai.nhom_id. Dạng không quy được nhóm ⇒ không vào cấp nhóm (§1.5).
create or replace function public._mastery_lan_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                    p_since timestamp with time zone, p_den timestamp with time zone, p_cap text,
                                                    p_window integer, p_tin_cao integer, p_tin_tb integer)
returns table(hoc_sinh_id uuid, nut text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with d as (
    select l.hoc_sinh_id, l.luot, l.value, l.t,
           case when p_cap = 'nhom' then coalesce(hh.ma_bai, db.nhom_id) else l.ma_dang end as nut,
           (hh.ma_bai is not null) as hh
    from public._mastery_luot_do_quy(p_bdm, false, p_hs, p_include_btvn, p_since, p_den) l
    left join hinh_hoc_bai hh on hh.ma_bai = l.ma_dang
    left join dai_bdm_dang_bai db on p_cap = 'nhom' and db.id = l.ma_dang
    where l.src <> 'tu_luyen' or l.cap1          -- Thùy 10/11: bỏ tự luyện, trừ cấp 1
  ),
  lan as (
    select hoc_sinh_id, nut, luot, bool_or(hh) as hh, avg(value) as p, max(t) as t
    from d where nut is not null
    group by hoc_sinh_id, nut, luot
  ),
  rk as (
    select lan.*,
           row_number() over (partition by hoc_sinh_id, nut order by t desc, luot desc) as rn,
           -- Hình–Học (CEO 14/10): làm ít hơn Đại ⇒ thang 3 thay 5, độ tin 3/2 — giữ nguyên, chỉ đổi câu → lần
           case when hh then least(p_window, 3)  else p_window  end as cs,
           case when hh then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from lan
  )
  select hoc_sinh_id, nut,
         avg(p) filter (where rn <= cs) as score,     -- mọi lần ngang nhau (Thùy 10/11: không trọng số nguồn)
         count(*) as n,                               -- n = SỐ LẦN
         case when avg(p) filter (where rn <= cs) >= 0.8 then 'dat'
              when avg(p) filter (where rn <= cs) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, nut
$$;

-- 4. Bản THEO CÂU cũ — giữ nguyên văn (đường lùi khi tắt công tắc)
create or replace function public._mastery_cells_cau(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false,
    p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5,
    p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
returns table(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with mg as (select * from public._mastery_lan_do(p_bdm, p_hs, p_include_btvn, p_since, p_den)),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$$;

-- 5. _mastery_cells_core = bộ chia theo công tắc. Chữ ký + kết quả giữ nguyên ⇒ mọi hàm đang gọi không phải sửa.
--    Theo lần: n = số LẦN (không còn là số câu).
create or replace function public._mastery_cells_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false,
    p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5,
    p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
returns table(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language plpgsql stable as $$
begin
  if public._mastery_theo_lan_bat() then
    return query select * from public._mastery_lan_core(p_bdm, p_hs, p_include_btvn, p_since, p_den, 'dang', p_window, p_tin_cao, p_tin_tb);
  else
    return query select * from public._mastery_cells_cau(p_bdm, p_hs, p_include_btvn, p_since, p_window, p_tin_cao, p_tin_tb, p_den);
  end if;
end
$$;

-- 6. Cấp NHÓM (chính) — luôn theo lần, theo bản đồ đang bật. Bổ trợ nhóm yếu sẽ đọc hàm này (việc sau).
create or replace function public.fn_mastery_nhom(p_hs uuid[], p_include_btvn boolean DEFAULT false,
    p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5,
    p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
returns table(hoc_sinh_id uuid, nhom_id text, score numeric, n bigint, muc text, tin text)
language sql stable set search_path = public as $$
  select * from public._mastery_lan_core(public._mastery_bdm_bat(), p_hs, p_include_btvn, p_since, p_den, 'nhom', p_window, p_tin_cao, p_tin_tb)
$$;

revoke all on function public._mastery_theo_lan_bat() from public, anon;
revoke all on function public._mastery_luot_do_quy(boolean, boolean, uuid[], boolean, timestamptz, timestamptz) from public, anon;
revoke all on function public._mastery_lan_core(boolean, uuid[], boolean, timestamptz, timestamptz, text, integer, integer, integer) from public, anon;
revoke all on function public._mastery_cells_cau(boolean, uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) from public, anon;
revoke all on function public.fn_mastery_nhom(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) from public, anon;
grant execute on function public._mastery_theo_lan_bat() to authenticated, service_role;
grant execute on function public._mastery_luot_do_quy(boolean, boolean, uuid[], boolean, timestamptz, timestamptz) to authenticated, service_role;
grant execute on function public._mastery_lan_core(boolean, uuid[], boolean, timestamptz, timestamptz, text, integer, integer, integer) to authenticated, service_role;
grant execute on function public._mastery_cells_cau(boolean, uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) to authenticated, service_role;
grant execute on function public.fn_mastery_nhom(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) to authenticated, service_role;
