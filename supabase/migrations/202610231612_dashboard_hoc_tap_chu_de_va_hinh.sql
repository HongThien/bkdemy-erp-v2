-- ============================================================================
-- 202610231612 — dashboard_hoc_tap_chu_de_va_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: (1) thêm tầng CHỦ ĐỀ (Chủ đề | Chuyên đề | Nhóm bài). (2) HÌNH là kiểu riêng: cột riêng theo cây của Hình
--   (chủ đề → nhóm mô hình → mô hình); tầng nào câu Hình CHƯA có thì dồn chung vào 1 cột "Hình".
--   Trước đây câu Hình bị loại hẳn (không quy được về dạng bài Đại) — 4 tuần ≈ 3,9k câu (bài toán phần Luyện + câu phần Học).
--   Quy câu Hình → mô hình: bài toán (gami.hinh_baitoan_id, hoặc mã dạng = hinh_baitoan.ma trên app) → mo_hinh_id;
--   câu phần Học (hinh_hoc_cau_hoi) → mo_hinh_id nếu có. Mô hình → nhóm mô hình → chủ đề (chủ đề của nhóm, của mô hình,
--   hoặc của bài học phần Học). Ánh xạ tầng: Chủ đề = chủ đề Hình · Chuyên đề = nhóm mô hình · Nhóm bài = mô hình.
--   Mã cột Hình có tiền tố 'H:' (chủ đề Hình nằm chung bảng dai_bdm_chu_de — không được gộp nhầm vào cột chủ đề Đại); cột dồn = 'HINH'.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   DROP rồi tạo lại NGAY hàm _dbht_cau (đổi cột trả về: thêm chu_de_id, ten_dang — create or replace không đổi được kiểu trả).
--   Hàm do chính đợt này tạo (mig 202610231524), chỉ fn_dbht_* gọi; không dữ liệu nào mất.
-- ============================================================================

drop function if exists _dbht_cau(uuid[], date, text);

create function _dbht_cau(p_hs uuid[], p_tu date, p_mon text)
returns table(hoc_sinh_id uuid, ngay date, t timestamptz, kenh text, luot text, thu_tu integer, ma_cau text,
              gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text, chu_de_id text, ten_dang text)
language sql stable set search_path to 'public' as $$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy (+ bản sao câu app — ngày = ngày nộp)
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           sp.hinh_baitoan_id as bt_id,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang, null::uuid,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  k as (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd, bt_id from m),
  -- HÌNH: nhận diện + quy về mô hình / bài học
  hk as (
    select k.kc, k.kd, k.bt_id,
           coalesce(bt1.mo_hinh_id, bt2.mo_hinh_id, hc.mo_hinh_id) as mh_id,
           coalesce(hc.dang_chinh, hb.ma_bai) as hh_bai
      from k
      left join hinh_baitoan bt1 on bt1.id = k.bt_id
      left join hinh_baitoan bt2 on k.bt_id is null and bt2.ma = nullif(k.kd, '')
      left join hinh_hoc_cau_hoi hc on hc.ma_cau = nullif(k.kc, '')
      left join hinh_hoc_bai hb on hb.ma_bai = nullif(k.kd, '')
     where bt1.id is not null or bt2.id is not null or hc.ma_cau is not null or hb.ma_bai is not null
  ),
  hcap as (
    select hk.kc, hk.kd, hk.bt_id,
           coalesce('H:' || mh.id::text, 'HINH') as nhom_id,
           coalesce('H:' || mh.nhom_mh_id, 'HINH') as chuyen_de_id,
           coalesce('H:' || coalesce(nmh.chu_de_id, mh.chu_de_id, hhb.chu_de_id), 'HINH') as chu_de_id,
           coalesce(mh.ten, hhb.ten_bai, 'Hình') as ten_dang
      from hk
      left join hinh_mo_hinh mh on mh.id = hk.mh_id
      left join hinh_nhom_mo_hinh nmh on nmh.id = mh.nhom_mh_id
      left join hinh_hoc_bai hhb on hhb.ma_bai = hk.hh_bai
  ),
  -- ĐẠI + HGT: dạng bài bản đồ mới (cấp 1 cũng theo bản đồ mới)
  dcap as (
    select k.kc, k.kd, k.bt_id, public._do_o_bdm_core(nullif(k.kc, ''), nullif(k.kd, ''), false) as o
      from k
     where (k.kc <> '' or k.kd <> '')
       and not exists (select 1 from hcap where hcap.kc = k.kc and hcap.kd = k.kd and hcap.bt_id is not distinct from k.bt_id)
  ),
  cap as (
    select dcap.kc, dcap.kd, dcap.bt_id, db.id as dang_bai_id, n.id as nhom_id, n.chuyen_de_id, n.chu_de_id, db.ten as ten_dang
      from dcap join dai_bdm_dang_bai db on db.id = dcap.o join dai_bdm_nhom n on n.id = db.nhom_id
    union all
    select kc, kd, bt_id, null, nhom_id, chuyen_de_id, chu_de_id, ten_dang from hcap
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri,
         cap.dang_bai_id, cap.nhom_id, cap.chuyen_de_id, cap.chu_de_id, cap.ten_dang
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '') and cap.bt_id is not distinct from m.bt_id
   where p_tu is null or m.ngay >= p_tu
$$;

create or replace function _dbht_cot(p_cap text, x_nhom text, x_chuyen_de text, x_chu_de text) returns text
language sql immutable as $$
  select case p_cap when 'nhom' then x_nhom when 'chu_de' then x_chu_de else x_chuyen_de end
$$;

-- ── Bảng (thay thân mig 202610231607): p_cap = 'chu_de' | 'chuyen_de' | 'nhom'; cột Hình sau cột Đại, cột "Hình" chung cuối ──
create or replace function fn_dbht_bang(p_mon text, p_khoi text, p_so_tuan integer DEFAULT 4, p_cap text DEFAULT 'chuyen_de')
returns jsonb language sql stable set search_path to 'public' as $$
  with hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, l.ten_lop
  ),
  ca as (   -- mọi lúc: trước cửa sổ chỉ để lấy "đầu kỳ"
    select x.*, _dbht_cot(p_cap, x.nhom_id, x.chuyen_de_id, x.chu_de_id) as cot, x.ngay >= _dbht_tu(p_so_tuan) as trong
      from _dbht_cau((select array_agg(hoc_sinh_id) from hs), null, p_mon) x
  ),
  c as (select * from ca where trong),
  dau as (   -- đầu kỳ = % trên 10 câu gần nhất TRƯỚC cửa sổ (giống fn_dbht_o_lich_su)
    select hoc_sinh_id, cot, round(100 * avg(gia_tri))::int as p from (
      select ca.*, row_number() over (partition by ca.hoc_sinh_id, ca.cot order by ca.ngay desc, _dbht_kenh_tt(ca.kenh) desc, ca.t desc, ca.luot desc, ca.thu_tu desc) as rn
        from ca where not ca.trong) z
     where rn <= 10 group by hoc_sinh_id, cot
  ),
  l1 as (   -- chưa đo trước cửa sổ ⇒ mốc = % sau LƯỢT ĐẦU trong cửa sổ (chỉ khi có ≥2 lượt)
    select hoc_sinh_id, cot, luot, gia_tri,
           dense_rank() over (partition by hoc_sinh_id, cot order by ngay, _dbht_kenh_tt(kenh), t, luot) as lr,
           row_number() over (partition by hoc_sinh_id, cot, luot order by thu_tu desc) as rn
      from c
  ),
  dau2 as (
    select hoc_sinh_id, cot, round(100 * avg(gia_tri) filter (where lr = 1 and rn <= 10))::int as p
      from l1 group by hoc_sinh_id, cot having max(lr) >= 2
  ),
  rk as (
    select c.*, row_number() over (partition by c.hoc_sinh_id, c.cot order by c.ngay desc, _dbht_kenh_tt(c.kenh) desc, c.t desc, c.luot desc, c.thu_tu desc) as rn,
           count(*) over (partition by c.hoc_sinh_id, c.cot) as n
      from c
  ),
  o as (
    select hoc_sinh_id, cot, round(100 * avg(gia_tri))::int as p, max(n) as n
      from rk where rn <= 10 group by hoc_sinh_id, cot
  ),
  od as (   -- d = xu hướng: % hiện tại − mốc (đầu kỳ; không có thì sau lượt đầu); NULL = chưa đủ để nói xu hướng
    select o.*, o.p - coalesce(dau.p, dau2.p) as d, dau.p is not null as co_dau
      from o left join dau using (hoc_sinh_id, cot) left join dau2 using (hoc_sinh_id, cot)
  ),
  cot as (select distinct o.cot from o),
  cot_dai as (   -- cột Đại / HGT: tên + cha + thứ tự theo bản đồ mới
    select cot.cot as ma,
           case p_cap when 'nhom' then n.ten when 'chu_de' then cd.ten else ch.ten end as ten,
           case p_cap when 'nhom' then ch.ten end as cha,
           0 as nhom_cot, cd.thu_tu as t1, coalesce(bo.thu_tu, 0) as t2, case when p_cap = 'nhom' then n.thu_tu else 0 end as t3
      from cot
      left join lateral (select n0.* from dai_bdm_nhom n0 where p_cap = 'nhom' and n0.id = cot.cot) n on true
      left join dai_bdm_chuyen_de ch on p_cap <> 'chu_de' and ch.id = case when p_cap = 'nhom' then n.chuyen_de_id else cot.cot end
      left join lateral (select o2.chu_de_id, o2.thu_tu from dai_bdm_o o2 join dai_bdm_chu_de cd2 on cd2.id = o2.chu_de_id
                          where p_cap <> 'chu_de' and o2.chuyen_de_id = ch.id and (p_cap <> 'nhom' or o2.chu_de_id = n.chu_de_id)
                          order by cd2.thu_tu limit 1) bo on true
      join dai_bdm_chu_de cd on cd.id = case when p_cap = 'chu_de' then cot.cot else bo.chu_de_id end
     where cot.cot not like 'H:%' and cot.cot <> 'HINH'
  ),
  cot_hinh as (   -- cột Hình: chủ đề Hình · nhóm mô hình · mô hình
    select cot.cot as ma, 'Hình · ' || coalesce(mh.ten, nmh.ten, cd.ten) as ten,
           case when p_cap = 'nhom' then coalesce(nmh2.ten, 'Hình') end as cha,
           1 as nhom_cot, coalesce(cd.thu_tu, cd2.thu_tu, 0) as t1, coalesce(nmh.thu_tu, nmh2.thu_tu, 0) as t2, coalesce(mh.thu_tu, 0) as t3
      from cot
      left join hinh_mo_hinh mh on p_cap = 'nhom' and mh.id::text = substr(cot.cot, 3)
      left join hinh_nhom_mo_hinh nmh2 on nmh2.id = mh.nhom_mh_id
      left join hinh_nhom_mo_hinh nmh on p_cap = 'chuyen_de' and nmh.id = substr(cot.cot, 3)
      left join dai_bdm_chu_de cd on p_cap = 'chu_de' and cd.id = substr(cot.cot, 3)
      left join dai_bdm_chu_de cd2 on cd2.id = coalesce(nmh.chu_de_id, nmh2.chu_de_id, mh.chu_de_id)
     where cot.cot like 'H:%'
    union all
    select 'HINH', 'Hình', null, 2, 0, 0, 0 from cot where cot.cot = 'HINH'
  ),
  cot_ten as (select * from cot_dai union all select * from cot_hinh)
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', ma, 'ten', ten, 'cha', cha) order by nhom_cot, t1, t2, t3, ten) from cot_ten), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', hs.hoc_sinh_id, 'ten', x.ho_ten, 'lop_id', hs.lop_id, 'lop', hs.ten_lop,
              'o', coalesce((select jsonb_object_agg(od.cot, jsonb_build_object('p', od.p, 'n', od.n, 'd', od.d, 'dk', od.co_dau)) from od where od.hoc_sinh_id = hs.hoc_sinh_id), '{}'::jsonb))
            order by hs.ten_lop, x.ho_ten) from hs join hoc_sinh x on x.id = hs.hoc_sinh_id), '[]'::jsonb)
  )
$$;

-- ── Lịch sử 1 ô (thay thân): thêm tầng chủ đề; tên dạng lấy từ _dbht_cau (Hình = tên mô hình / bài học) ──
create or replace function fn_dbht_o_lich_su(p_hs uuid, p_mon text, p_cap text, p_ma text, p_so_tuan integer DEFAULT 4)
returns jsonb language sql stable set search_path to 'public' as $$
  with c as (
    select x.*, row_number() over (order by x.ngay, _dbht_kenh_tt(x.kenh), x.t, x.luot, x.thu_tu) as seq
      from _dbht_cau(array[p_hs], null, p_mon) x
     where _dbht_cot(p_cap, x.nhom_id, x.chuyen_de_id, x.chu_de_id) = p_ma
  ),
  truoc as (select * from c where ngay < _dbht_tu(p_so_tuan)),
  dau as (
    select round(100 * avg(gia_tri))::int as p, count(*) as n
      from (select gia_tri from truoc order by seq desc limit 10) z
    having count(*) > 0
  ),
  w as (select c.*, row_number() over (order by seq) as sw from c where ngay >= _dbht_tu(p_so_tuan)),
  lu as (
    select luot, min(ngay) as ngay, min(t) as t, min(kenh) as kenh, sum(gia_tri) as dung, count(*) as tong, max(sw) as cuoi
      from w group by luot
  ),
  lp as (
    select lu.*,
           (select sum(gia_tri) from w where sw <= lu.cuoi) as tl_dung,
           lu.cuoi as tl_tong,
           (select sum(gia_tri) from w where sw between lu.cuoi - 9 and lu.cuoi) as dung10,
           least(lu.cuoi, 10) as tong10
      from lu
  ),
  lq as (select lp.*, round(100 * dung10 / tong10)::int as p from lp),
  ld as (select lq.*, p - coalesce(lag(p) over (order by cuoi), (select p from dau)) as delta from lq)
  select jsonb_build_object(
    'tu', _dbht_tu(p_so_tuan),
    'dau_ky', (select jsonb_build_object('p', p, 'n', n) from dau),
    'luot', coalesce((select jsonb_agg(jsonb_build_object(
              'ngay', ld.ngay, 'kenh', ld.kenh, 'dung', round(ld.dung, 2), 'tong', ld.tong,
              'tl_dung', round(ld.tl_dung, 2), 'tl_tong', ld.tl_tong, 'dung10', round(ld.dung10, 2), 'tong10', ld.tong10,
              'p', ld.p, 'delta', ld.delta,
              'cau', (select jsonb_agg(jsonb_build_object('ma_cau', w.ma_cau, 'dang', w.ten_dang, 'g', round(w.gia_tri, 2)) order by w.sw)
                        from w where w.luot = ld.luot))
            order by ld.cuoi) from ld), '[]'::jsonb)
  )
$$;

revoke execute on function _dbht_cau(uuid[], date, text) from public, anon;
grant execute on function _dbht_cau(uuid[], date, text) to authenticated;
