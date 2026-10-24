-- ============================================================================
-- 202610241130 — mastery_moi_kqht_mt_ontap
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 24/10 "chuyển luôn" phần còn đọc bản đồ cũ sau khi rà (PLAN-mastery-ban-do-moi.md "Rà 24/10"):
--   · KQHT (ERP) + màn HS của app GV: số mastery đã có fn_mastery_cells_moi, nhưng TIMELINE lần đo client tự gom theo mã
--     CHÉP (mã cũ) ⇒ bật công tắc là ô NDB không có lịch sử. Tách nguồn đo của _mastery_cells_core ra _mastery_lan_do
--     (MỘT nguồn luật "lượt nào vào mastery, quy về dạng nào" — §2.0 cấm công thức 2 nơi), core đọc lại từ đó;
--     fn_mastery_lan_do_moi trả lần đo đã quy dạng theo công tắc cho client chỉ gom hiển thị.
--   · Bảng kết quả MT theo chuyên đề (fn_mt_bang_ket_qua): bật công tắc ⇒ ô gom theo chuyên đề/chủ đề BẢN ĐỒ MỚI
--     (câu → dạng bài bằng _do_o_bdm, cùng đường với mastery); câu chưa quy được thì theo bản đồ cũ (không để trống cột).
--   · Ôn tập trong BTVN: ứng viên = dạng của giáo trình buổi trước (mã cũ hoặc NDB). Chấm nhu cầu ôn theo LỚP chuyển
--     xuống DB (trước tính ở client — nợ §2.0): fn_ontap_diem_dang. Bật công tắc ⇒ ứng viên mã cũ quy sang các dạng bài
--     mà câu CÒN SỐNG của nó quy về (cùng _do_o_bdm), gộp ô của các dạng bài đó. Tắt ⇒ y hệt cách client tính trước đây.
--   fn_mastery_cells (bản cũ, bổ trợ) KHÔNG đụng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 3 hàm, thay thân _mastery_cells_core (kết quả y hệt, kiểm parity) và fn_mt_bang_ket_qua (tắt = y hệt).
-- ============================================================================

-- 1. Nguồn đo DUY NHẤT của mastery mới: mỗi lượt đo đã lọc nguồn + quy về dạng (cũ / mới theo p_bdm)
create or replace function _mastery_lan_do(p_bdm boolean, p_hs uuid[], p_include_btvn boolean default false,
                                           p_since timestamptz default null, p_den timestamptz default null)
returns table (hoc_sinh_id uuid, ma_dang text, value numeric, t timestamptz, src text)
language sql stable as $$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
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
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as (
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null
                when p_bdm then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))   -- BẢN ĐỒ MỚI (K6–12; cấp 1 + Hình giữ cũ bên trong)
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  )
  select mf.hoc_sinh_id, cap.nhom, mf.value, mf.t, mf.src
  from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
$$;

-- 2. Lõi mastery mới đọc nguồn đo ở (1) — công thức điểm/mức/độ tin giữ nguyên từng chữ
create or replace function _mastery_cells_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean default false,
  p_since timestamptz default null, p_window integer default 5, p_tin_cao integer default 5, p_tin_tb integer default 3, p_den timestamptz default null)
returns table (hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with mg as (select * from public._mastery_lan_do(p_bdm, p_hs, p_include_btvn, p_since, p_den)),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
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

-- 3. Lần đo của 1 HS đã quy dạng THEO CÔNG TẮC — client chỉ gom làm timeline hiển thị (KQHT, màn HS app GV)
create or replace function fn_mastery_lan_do_moi(p_hs uuid, p_include_btvn boolean default false, p_since timestamptz default null)
returns table (ma_dang text, value numeric, t timestamptz, src text)
language sql stable as $$
  select x.ma_dang, x.value, x.t, x.src
    from public._mastery_lan_do(public._mastery_bdm_bat(), array[p_hs], p_include_btvn, p_since, null) x
   order by x.t desc
$$;
revoke execute on function fn_mastery_lan_do_moi(uuid, boolean, timestamptz) from public, anon;
grant execute on function fn_mastery_lan_do_moi(uuid, boolean, timestamptz) to authenticated;

-- 4. Ôn tập BTVN: nhu cầu ôn của LỚP theo từng dạng ứng viên (score = (yếu + 0,5·cần luyện) / số ô đã đo)
create or replace function fn_ontap_diem_dang(p_lop uuid, p_mon text, p_ma_dangs text[])
returns table (ma_dang text, ten_dang text, dat integer, can_luyen integer, yeu integer, total integer, score numeric)
language sql stable as $$
  with hs as (select array_agg(hl.hoc_sinh_id) a from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'),
  bat as (select public._mastery_bdm_bat() b),
  -- ứng viên → các khoá mastery: tắt ⇒ chính nó; bật ⇒ NDB giữ nguyên, mã cũ ⇒ dạng bài mà câu CÒN SỐNG của nó quy về
  dich as (
    select c.ma, c.ma as khoa from unnest(p_ma_dangs) c(ma), bat where not bat.b or c.ma like 'NDB%'
    union
    select c.ma, k.khoa from unnest(p_ma_dangs) c(ma), bat
      cross join lateral (
        select public._do_o_bdm(q.ma_cau, c.ma) as khoa from dai_cau_hoi q where q.dang_chinh = c.ma and q.xoa_at is null
        union select public._do_o_bdm(h.ma_cau, c.ma) from hgt_cau_hoi h where h.dang_chinh = c.ma
        union select public._bdm_dang_cu_mot_dich(c.ma)) k
     where bat.b and c.ma not like 'NDB%' and k.khoa is not null
  ),
  o as (select m.ma_dang, m.muc from hs, public.fn_mastery_cells_moi(hs.a, false) m)
  select d.ma, public._kho_ten_dang(p_mon, d.ma),
         count(*) filter (where o.muc = 'dat')::int, count(*) filter (where o.muc = 'can_luyen')::int,
         count(*) filter (where o.muc = 'yeu')::int, count(*)::int,
         round((count(*) filter (where o.muc = 'yeu') + 0.5 * count(*) filter (where o.muc = 'can_luyen'))::numeric / count(*), 4)
    from (select distinct ma, khoa from dich) d join o on o.ma_dang = d.khoa
   group by d.ma
$$;
revoke execute on function fn_ontap_diem_dang(uuid, text, text[]) from public, anon;
grant execute on function fn_ontap_diem_dang(uuid, text, text[]) to authenticated;

-- 5. Bảng kết quả MT theo chuyên đề/chủ đề — theo công tắc
CREATE OR REPLACE FUNCTION public.fn_mt_bang_ket_qua(p_de uuid, p_cap text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with buoi as (
    select distinct b.id, l.id as lop_id, l.ten_lop
      from tai_lieu t
      join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
      join lop l on l.id = b.lop_id
     where t.loai = 'mt_buoi' and t.nguon_id = p_de
    union
    -- kỳ khảo sát chung của đề (không thuộc lớp)
    select b.id, null::uuid, null::text from buoi_hoc b where b.loai = 'khao_sat' and b.de_id = p_de and b.trang_thai <> 'huy'
  ),
  bd as (
    select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from dai_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from khtn_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from hgt_ban_do
    union all select ma_dang, ma_chuyen_de, ten_chuyen_de, ma_chu_de, ten_chu_de from bdm_ban_do where ma_dang like 'NDB%'  -- bản đồ mới (24/10)
    -- Hình học: không có chủ đề cũ ⇒ chủ đề mới (dai_bdm_chu_de) nếu đã gắn, chưa gắn thì gom "Hình học".
    union all select hb.ma_dang, hb.ma_chuyen_de, hb.ten_chuyen_de, coalesce(hb.chu_de_id, 'HINH'), coalesce(cdm.ten, 'Hình học')
      from hinh_hoc_bai hb left join dai_bdm_chu_de cdm on cdm.id = hb.chu_de_id
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o0 as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           bd1.ma_chuyen_de, bd1.ten_chuyen_de, bd1.ma_chu_de, bd1.ten_chu_de,
           mh.id as mh_id, mh.ma as mh_ma, mh.chu_de_id as mh_chu_de, cdm2.ten as mh_ten_chu_de,
           btrim(regexp_replace(mh.ten, '\s*\mtest\M\s*', ' ', 'gi')) as mh_ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de, bd.ma_chu_de, bd.ten_chu_de from bd where bd.ma_dang = coalesce(case when public._mastery_bdm_bat() then public._do_o_bdm(s.ma_cau, s.ma_dang) end, s.ma_dang) limit 1) bd1 on s.hinh_baitoan_id is null  -- bật công tắc ⇒ câu → dạng bài mới (cùng đường mastery); chưa quy được thì bản đồ cũ
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      left join dai_bdm_chu_de cdm2 on cdm2.id = mh.chu_de_id
      left join cu on cu.id = s.id
  ),
  o as (
    select o0.id, o0.buoi_hoc_id, o0.problem_no, o0.diem_toi_da, o0.bai_k, o0.bai_tong,
           case when p_cap = 'chu_de'
                then coalesce(o0.ma_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_chu_de, 'HINH') end, 'KHAC')
                else coalesce(o0.ma_chuyen_de, case when o0.mh_id is not null then 'MH:' || o0.mh_ma end, 'KHAC') end as cd,
           case when p_cap = 'chu_de'
                then coalesce(o0.ten_chu_de, case when o0.mh_id is not null then coalesce(o0.mh_ten_chu_de, 'Hình học') end, 'Chưa gán chủ đề')
                else coalesce(o0.ten_chuyen_de,
                              case when o0.mh_id is not null then
                                case when coalesce(o0.mh_ten, '') = '' then 'Hình học'
                                     when o0.mh_ten ilike 'hình%' then o0.mh_ten
                                     else 'Hình: ' || o0.mh_ten end end,
                              'Chưa gán chuyên đề') end as ten,
           -- luật CEO 23/10: chỉ CHỦ ĐỀ "Các mô hình … nâng cao" ⇒ Nâng cao (không xét tên chuyên đề)
           coalesce(o0.ten_chu_de, o0.mh_ten_chu_de, '') ilike 'các mô hình%nâng cao%' as nc
      from o0
  ),
  g as (select o.*, gr.hoc_sinh_id, gr.diem_dat from o join gami_grades gr on gr.problem_id = o.id),
  don_vi as (
    select g.hoc_sinh_id, g.cd, g.diem_dat as dat, g.diem_toi_da as toi_da
      from g where g.diem_toi_da is not null and g.diem_dat is not null
    union all
    select g.hoc_sinh_id, g.cd, sum(g.diem_dat), max(g.bai_tong)
      from g where g.bai_tong is not null
     group by g.hoc_sinh_id, g.cd, g.buoi_hoc_id, g.bai_k
    having count(g.diem_dat) = (select count(*) from o o2 where o2.buoi_hoc_id = g.buoi_hoc_id and o2.bai_k = g.bai_k and o2.bai_tong is not null)
  ),
  pct as (
    select hoc_sinh_id, cd, round(100 * sum(dat) / sum(toi_da)) as p
      from don_vi group by hoc_sinh_id, cd having sum(toi_da) > 0
  ),
  hs as (
    -- lớp của em: lớp của buổi (MT) — kỳ khảo sát chung thì lớp hiện tại của em trong môn của đề
    select distinct on (g.hoc_sinh_id) g.hoc_sinh_id, coalesce(buoi.lop_id, lh.id) as lop_id, coalesce(buoi.ten_lop, lh.ten_lop) as ten_lop
      from g join buoi on buoi.id = g.buoi_hoc_id
      left join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.hoc_sinh_id = g.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                            and l.mon = (select mon from tai_lieu where id = p_de)
                          order by hl.ngay_vao desc nulls last limit 1) lh on buoi.lop_id is null
     order by g.hoc_sinh_id, buoi.lop_id nulls last, buoi.ten_lop
  ),
  diem as (
    select dt.hoc_sinh_id, round(avg(dt.diem), 2) as diem
      from diem_thi dt join ky_thi k on k.id = dt.ky_thi_id and k.loai in ('mt_sat_hach', 'khao_sat_thang')
     where k.buoi_hoc_id in (select id from buoi) and dt.diem is not null
     group by dt.hoc_sinh_id
  ),
  xep as (
    select hs.*, x.ho_ten, d.diem,
           case when d.diem is not null then rank() over (order by d.diem desc nulls last) end as hang
      from hs join hoc_sinh x on x.id = hs.hoc_sinh_id left join diem d on d.hoc_sinh_id = hs.hoc_sinh_id
  ),
  cot as (select cd, min(ten) as ten, min(problem_no) as tt, bool_or(nc) as nc from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten, 'nang_cao', nc) order by nc, tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$function$;
