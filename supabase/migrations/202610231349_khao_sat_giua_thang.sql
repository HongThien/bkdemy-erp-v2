-- ============================================================================
-- 202610231349 — khao_sat_giua_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 23/10): BK tổ chức thêm kỳ KHẢO SÁT GIỮA THÁNG (xen kẽ MT cuối tháng) — chủ yếu 5T, 9, 12
-- nhưng lớp nào dùng cũng được. "Ý nghĩa như MT": soạn đề, gán buổi, chấm từng câu, điểm tự cộng, Cơ bản/
-- Nâng cao, Elo — ĐI CHUNG ĐƯỜNG MT (phase 'mt' của buổi). Khác MT đúng 1 chỗ: điểm tổng lưu vào kỳ thi loại
-- 'khao_sat_thang' (đã có sẵn trong CHECK, hệ số 1, chưa từng dùng) thay vì 'mt_sat_hach'. CEO chốt:
--   · Xếp hạng khảo sát RIÊNG (BXH MT không lẫn) → fn_bxh_diem_ks_khoi, theo THÁNG DƯƠNG LỊCH của buổi.
--   · KHÔNG tính Level / thành tựu / xu (các hàm đó lọc 'mt_sat_hach' sẵn; client getLevelXu bỏ loại này).
--   · Báo cáo PH có dòng riêng → fn_ks_diem_thang.
-- Nhận diện kỳ khảo sát: đề gốc (tai_lieu loai='mt') có cau_hinh.mtMeta.loaiDe = 'khao_sat_giua_thang' — đọc từ
-- ĐỀ GỐC (như điểm câu, mig 202610081402), bản lớp chỉ dùng khi mất gốc. Đổi loại đề sau khi đã chấm ⇒ kỳ thi
-- của buổi tự đổi loại theo (giữ nguyên điểm).
-- MẤT GÌ: không xoá gì. Thêm 1 unique index (1 kỳ khảo sát / buổi — giống MT).
-- ============================================================================

-- ── 1. Loại kỳ của buổi theo đề gốc ─────────────────────────────────────────────────────
create or replace function _mt_loai_ky_cua_buoi(p_buoi uuid) returns text
language sql stable as $$
  select case when coalesce(m.cau_hinh -> 'mtMeta' ->> 'loaiDe', t.cau_hinh -> 'mtMeta' ->> 'loaiDe') = 'khao_sat_giua_thang'
              then 'khao_sat_thang' else 'mt_sat_hach' end
    from buoi_hoc b
    join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
    left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
   where b.id = p_buoi
   order by t.created_at desc limit 1
$$;

create unique index if not exists ky_thi_ks_1_per_buoi on ky_thi (buoi_hoc_id)
  where loai = 'khao_sat_thang' and buoi_hoc_id is not null;

-- ── 2. Kỳ thi của buổi: tìm-hoặc-tạo theo đúng loại; đề đổi loại ⇒ kỳ đổi theo ─────────────────
create or replace function _mt_ky_thi(p_buoi uuid) returns uuid
language plpgsql as $$
declare v_id uuid; v_loai_cu text; v_loai text; v_mua text;
begin
  v_loai := coalesce(_mt_loai_ky_cua_buoi(p_buoi), 'mt_sat_hach');
  select id, loai into v_id, v_loai_cu from ky_thi
   where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1;
  if v_id is not null then
    if v_loai_cu <> v_loai then
      update ky_thi set loai = v_loai, he_so = case v_loai when 'khao_sat_thang' then 1 else 2 end,
                        ten = regexp_replace(ten, '^(MT|KS) ', case v_loai when 'khao_sat_thang' then 'KS ' else 'MT ' end)
       where id = v_id;
    end if;
    return v_id;
  end if;
  select m.mua into v_mua from gami_mua m
   where to_char((now() at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM') between m.thang_dau and m.thang_cuoi
   limit 1;
  insert into ky_thi (ten, loai, he_so, mon, khoi, mua, buoi_hoc_id)
  select trim(case v_loai when 'khao_sat_thang' then 'KS ' else 'MT ' end || coalesce(l.ten_lop, '') || ' ' || b.ngay::text),
         v_loai, case v_loai when 'khao_sat_thang' then 1 else 2 end, l.mon, l.khoi, v_mua, b.id
    from buoi_hoc b left join lop l on l.id = b.lop_id where b.id = p_buoi
  on conflict do nothing;
  select id into v_id from ky_thi
   where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1;
  return v_id;
end $$;

-- ── 3. Màn Chấm MT: loai_de đọc từ ĐỀ GỐC (để biết buổi nào là khảo sát) ─────────────────────
create or replace function fn_mt_cham_ds_buoi(p_lop uuid)
returns table (buoi_id uuid, ngay date, ten text, loai_de text, dong boolean, so_hs int, so_hs_xong int)
language sql stable as $$
  with doc as (
    select distinct on (t.ngay) t.ngay, t.ten,
           coalesce(m.cau_hinh -> 'mtMeta' ->> 'loaiDe', t.cau_hinh -> 'mtMeta' ->> 'loaiDe') as loai_de
      from tai_lieu t left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
     where t.loai = 'mt_buoi' and t.lop_id = p_lop and t.ngay is not null
     order by t.ngay, t.created_at desc
  )
  select b.id, d.ngay, d.ten, d.loai_de, b.mt_dong_at is not null,
         (select count(*)::int from buoi_hoc_hs h where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'),
         (select count(*)::int from buoi_hoc_hs h
           where h.buoi_hoc_id = b.id and h.diem_danh = 'co_mat'
             and exists (select 1 from gami_session_problems s where s.buoi_hoc_id = b.id and s.phase = 'mt' and not s.ngoai_de)
             and not exists (select 1 from gami_session_problems s
                              left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = h.hoc_sinh_id
                              where s.buoi_hoc_id = b.id and s.phase = 'mt' and not s.ngoai_de and g.diem_dat is null))
    from doc d
    join lateral (select bb.id, bb.mt_dong_at from buoi_hoc bb
                   where bb.lop_id = p_lop and bb.ngay = d.ngay and bb.loai = 'thuong' and bb.trang_thai <> 'huy'
                   order by bb.created_at limit 1) b on true
   order by d.ngay desc
   limit 100
$$;

-- ── 4. Màn Chấm MT: HS + điểm — kỳ của buổi là MT hoặc khảo sát ─────────────────────────────
create or replace function fn_mt_cham_hs(p_buoi uuid)
returns table (hoc_sinh_id uuid, ho_ten text, diem_danh text, so_cau int, so_cham int, so_thieu_diem int,
               tinh_co_ban numeric, tinh_nang_cao numeric, khung_co_ban numeric, khung_nang_cao numeric,
               nguon text, diem_co_ban numeric, diem_nang_cao numeric, diem numeric, full_diem boolean,
               tl_co_ban numeric, tl_nang_cao numeric, full_thi_lai boolean, diem_thi_lai numeric)
language sql stable as $$
  with ky as (select id, khung_co_ban, khung_nang_cao from ky_thi
               where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1),
  hs as (
    select h.hoc_sinh_id, h.diem_danh from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.diem_danh = 'co_mat'
    union
    select g.hoc_sinh_id, h2.diem_danh from gami_grades g
      join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
      left join buoi_hoc_hs h2 on h2.buoi_hoc_id = p_buoi and h2.hoc_sinh_id = g.hoc_sinh_id
     where g.buoi_hoc_id = p_buoi
  ),
  dem as (
    select hs.hoc_sinh_id,
           count(s.id)::int as so_cau, count(g.id)::int as so_cham, count(g.id) filter (where g.diem_dat is null)::int as so_thieu_diem,
           sum(g.diem_dat) filter (where not s.nang_cao) as cb, sum(g.diem_dat) filter (where s.nang_cao) as nc
      from hs
      left join gami_session_problems s on s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de
      left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = hs.hoc_sinh_id
     group by hs.hoc_sinh_id
  )
  select hs.hoc_sinh_id, x.ho_ten, hs.diem_danh, d.so_cau, d.so_cham, d.so_thieu_diem,
         coalesce(d.cb, 0), coalesce(d.nc, 0), ky.khung_co_ban, ky.khung_nang_cao,
         dt.nguon, dt.diem_co_ban, dt.diem_nang_cao, dt.diem, coalesce(dt.full_diem, false),
         dt.diem_thi_lai_co_ban, dt.diem_thi_lai_nang_cao, coalesce(dt.full_thi_lai, false), dt.diem_thi_lai
    from hs
    join hoc_sinh x on x.id = hs.hoc_sinh_id
    join dem d on d.hoc_sinh_id = hs.hoc_sinh_id
    left join ky on true
    left join diem_thi dt on dt.ky_thi_id = ky.id and dt.hoc_sinh_id = hs.hoc_sinh_id
   order by x.ho_ten
$$;

-- ── 5. BXH KHẢO SÁT theo khối × tháng (dương lịch, theo ngày buổi) — luật y hệt BXH MT ───────────
-- (roster = HS đang học lớp cùng môn+khối · điểm của em đi theo em · TB các kỳ trong tháng · chưa thi = 0đ CHỈ trong rank)
create or replace function fn_bxh_diem_ks_khoi(p_mon text, p_khoi text, p_ym text)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, tb numeric, rank_now int, rank_total int)
language sql stable as $$
  with roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  win as (select (p_ym || '-01')::date as tu, ((p_ym || '-01')::date + interval '1 month')::date as den),
  diem as (
    select dt.hoc_sinh_id, avg(dt.diem) as tb
      from diem_thi dt
      join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'khao_sat_thang' and kt.mon = p_mon
      join buoi_hoc b on b.id = kt.buoi_hoc_id
      cross join win
     where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
       and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
     group by dt.hoc_sinh_id
  ),
  ranked as (
    select r.hoc_sinh_id, r.lop_id, r.ten_lop, d.tb as tb_that,
           rank() over (order by coalesce(d.tb, 0) desc) as rk, count(*) over () as tot
      from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select ra.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ra.lop_id, ra.ten_lop, round(ra.tb_that, 2), ra.rk::int, ra.tot::int
    from ranked ra join hoc_sinh hs on hs.id = ra.hoc_sinh_id
   order by ra.rk, hs.ho_ten
$$;

-- ── 6. Điểm khảo sát của 1 HS trong tháng (báo cáo PH) ────────────────────────────────────────
-- Cùng cách MT trên báo cáo: TB điểm chính / Cơ bản / Nâng cao các kỳ trong tháng; %CB/%NC = Σđiểm / Σkhung
-- (chỉ dòng có khung); thi lại tách riêng; hạng trong khối từ fn_bxh_diem_ks_khoi. Không có kỳ nào ⇒ n = 0.
create or replace function fn_ks_diem_thang(p_hs uuid, p_mon text, p_ym text)
returns jsonb language sql stable as $$
  with d as (
    select dt.*, kt.khung_co_ban as kcb, kt.khung_nang_cao as knc
      from diem_thi dt
      join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'khao_sat_thang' and kt.mon = p_mon
      join buoi_hoc b on b.id = kt.buoi_hoc_id
     where dt.hoc_sinh_id = p_hs
       and b.ngay >= (p_ym || '-01')::date and b.ngay < ((p_ym || '-01')::date + interval '1 month')::date
  ),
  khoi as (
    select l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
     order by hl.ngay_vao desc nulls last limit 1
  ),
  hang as (select r.rank_now, r.rank_total, (select khoi from khoi) as khoi
             from fn_bxh_diem_ks_khoi(p_mon, (select khoi from khoi), p_ym) r where r.hoc_sinh_id = p_hs)
  select jsonb_build_object(
    'n', (select count(*) filter (where diem is not null) from d),
    'tb', (select round(avg(diem), 1) from d),
    'co_ban', (select round(avg(diem_co_ban), 1) from d),
    'nang_cao', (select round(avg(diem_nang_cao), 1) from d),
    'pct_co_ban', (select case when sum(kcb) filter (where diem_co_ban is not null and kcb > 0) > 0
                     then round(100 * sum(diem_co_ban) filter (where kcb > 0) / sum(kcb) filter (where diem_co_ban is not null and kcb > 0)) end from d),
    'pct_nang_cao', (select case when sum(knc) filter (where diem_nang_cao is not null and knc > 0) > 0
                     then round(100 * sum(diem_nang_cao) filter (where knc > 0) / sum(knc) filter (where diem_nang_cao is not null and knc > 0)) end from d),
    'tl_n', (select count(*) filter (where diem_thi_lai is not null) from d),
    'tl_tb', (select round(avg(diem_thi_lai), 1) from d),
    'rank_now', (select rank_now from hang where (select count(*) filter (where diem is not null) from d) > 0),
    'rank_total', (select rank_total from hang where (select count(*) filter (where diem is not null) from d) > 0),
    'khoi', (select khoi from khoi)
  )
$$;

revoke execute on function _mt_loai_ky_cua_buoi(uuid), fn_bxh_diem_ks_khoi(text, text, text), fn_ks_diem_thang(uuid, text, text) from public, anon;
grant execute on function _mt_loai_ky_cua_buoi(uuid), fn_bxh_diem_ks_khoi(text, text, text), fn_ks_diem_thang(uuid, text, text) to authenticated;
