-- ============================================================================
-- 202610231454 — khao_sat_thi_chung
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 23/10): "MT gán theo lớp nhưng khảo sát THI CHUNG" — kỳ khảo sát không thuộc buổi của lớp nào, và người
-- dùng phải tự thêm đề thi ngay ở lá Chấm MT - Khảo sát. CEO chốt: danh sách chấm = MỌI HS đang học môn đó ở khối của
-- đề (em không thi ⇒ không chấm, không có dòng); kết quả câu vào mastery như MT (phase 'mt'), không Elo/EXP.
-- Mô hình: 1 kỳ khảo sát chung = 1 buoi_hoc loai='khao_sat', lop_id NULL, ngay, de_id = ĐỀ GỐC (tai_lieu loai='mt').
-- Mọi đường chấm MT (lưới ô, điểm câu, điểm tổng, BXH khảo sát, bảng chuyên đề) dùng lại; chỗ nào tìm đề theo
-- (lớp, ngày) thì thêm nhánh "buổi có de_id ⇒ đọc thẳng đề gốc"; môn/khối của kỳ lấy theo đề.
-- MẤT GÌ: không mất dữ liệu. Ràng buộc buoi_hoc_loai_check được THAY bằng bản rộng hơn (thêm 'khao_sat', giữ nguyên
-- mọi giá trị cũ) — drop + add trong cùng transaction.
-- ============================================================================

alter table buoi_hoc add column if not exists de_id uuid references tai_lieu(id);
comment on column buoi_hoc.de_id is 'Kỳ KHẢO SÁT chung (loai=khao_sat): đề gốc (tai_lieu loai=mt). NULL = không áp dụng (buổi lớp).';
alter table buoi_hoc drop constraint if exists buoi_hoc_loai_check;
alter table buoi_hoc add constraint buoi_hoc_loai_check
  check (loai = any (array['thuong', 'bu', 'bo_tro_yeu', 'bo_tro_duoi', 'mt', 'bo_tro_hinh', 'khao_sat']));
alter table buoi_hoc drop constraint if exists buoi_hoc_khao_sat_chung_check;
alter table buoi_hoc add constraint buoi_hoc_khao_sat_chung_check
  check (loai <> 'khao_sat' or (de_id is not null and lop_id is null));
create unique index if not exists buoi_hoc_khao_sat_1_de_ngay on buoi_hoc (de_id, ngay) where loai = 'khao_sat';

CREATE OR REPLACE FUNCTION public._mt_khung_tinh(p_buoi uuid)
 RETURNS TABLE(id uuid, moi numeric, nc boolean, ngoai boolean, tl uuid, dbc jsonb)
 LANGUAGE sql
 STABLE
AS $function$
  with doc as (
    -- Điểm câu lấy từ ĐỀ GỐC (master, nguon_id) — bản lớp chỉ là bản chép lúc gán; mất gốc mới dùng bản lớp.
    -- Kỳ khảo sát chung (buoi_hoc.de_id): đọc thẳng ĐỀ GỐC; buổi lớp: bản gán (lớp, ngày), điểm câu theo đề gốc.
    select x.tl, x.dbc from (
      select d.id as tl, coalesce(d.cau_hinh -> 'diemByCau', '{}'::jsonb) as dbc, 0 as uu, d.created_at
        from buoi_hoc b join tai_lieu d on d.id = b.de_id where b.id = p_buoi
      union all
      select t.id, coalesce(m.cau_hinh -> 'diemByCau', t.cau_hinh -> 'diemByCau', '{}'::jsonb), 1, t.created_at
        from buoi_hoc b join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
        left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
       where b.id = p_buoi and b.de_id is null
    ) x order by x.uu, x.created_at desc limit 1
  ),
  hang as (
    select tc.ma_cau, _mt_phan_nang_cao(p.id) as nang_cao, row_number() over (order by p.thu_tu, tc.thu_tu) as rn
      from doc join tai_lieu_phan p on p.tai_lieu_id = doc.tl and p.loai_phan = 'custom'
      join tai_lieu_cau tc on tc.phan_id = p.id
  ),
  hinh as (
    select h.ma_cau, h.nang_cao, row_number() over (order by h.rn) as k,
           (doc.dbc ? h.ma_cau) and not exists (select 1 from jsonb_object_keys(doc.dbc) as kk(k) where kk.k like h.ma_cau || '#%') as cu
      from hang h cross join doc where h.ma_cau like 'HINH:%'
  ),
  dai as (select distinct on (ma_cau) ma_cau, nang_cao from hang where ma_cau not like 'HINH:%' order by ma_cau, rn),
  o as (
    select s.id, s.ma_cau, s.hinh_baitoan_id,
           nullif(substring(s.hinh_nhan from '^[0-9]+'), '')::int as k,
           (row_number() over (partition by (s.hinh_baitoan_id is not null), substring(s.hinh_nhan from '^[0-9]+') order by s.problem_no) - 1) as yi
      from gami_session_problems s where s.buoi_hoc_id = p_buoi and s.phase = 'mt'
  )
  select o.id,
         case when o.hinh_baitoan_id is null then
                case when d.ma_cau is null then null else coalesce((doc.dbc ->> d.ma_cau)::numeric, 1) end
              when h.ma_cau is null then 1                       -- bài Hình thêm tay ở buổi học (không có hàng trong đề)
              when h.cu then null                                 -- đề cũ: điểm cả bài, người chấm tự cho từng ý
              else coalesce((doc.dbc ->> (h.ma_cau || '#' || o.yi))::numeric, 1) end,
         coalesce(case when o.hinh_baitoan_id is null then d.nang_cao else h.nang_cao end, false),
         (o.hinh_baitoan_id is null and d.ma_cau is null),
         doc.tl, doc.dbc
    from o cross join doc
    left join dai d on o.hinh_baitoan_id is null and d.ma_cau = o.ma_cau
    left join hinh h on o.hinh_baitoan_id is not null and h.k = o.k
$function$;

CREATE OR REPLACE FUNCTION public._mt_o_bai_cu(p_buoi uuid)
 RETURNS TABLE(id uuid, k integer, tong numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with doc as (
    -- Kỳ khảo sát chung (buoi_hoc.de_id): đọc thẳng ĐỀ GỐC; buổi lớp: bản gán (lớp, ngày), điểm câu theo đề gốc.
    select x.tl, x.dbc from (
      select d.id as tl, coalesce(d.cau_hinh -> 'diemByCau', '{}'::jsonb) as dbc, 0 as uu, d.created_at
        from buoi_hoc b join tai_lieu d on d.id = b.de_id where b.id = p_buoi
      union all
      select t.id, coalesce(m.cau_hinh -> 'diemByCau', t.cau_hinh -> 'diemByCau', '{}'::jsonb), 1, t.created_at
        from buoi_hoc b join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
        left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
       where b.id = p_buoi and b.de_id is null
    ) x order by x.uu, x.created_at desc limit 1
  ),
  hinh as (
    select tc.ma_cau, row_number() over (order by p.thu_tu, tc.thu_tu) as k
      from doc join tai_lieu_phan p on p.tai_lieu_id = doc.tl and p.loai_phan = 'custom'
      join tai_lieu_cau tc on tc.phan_id = p.id
     where tc.ma_cau like 'HINH:%'
  )
  select s.id, h.k::int, (doc.dbc ->> h.ma_cau)::numeric
    from gami_session_problems s
    cross join doc
    join hinh h on h.k = nullif(substring(s.hinh_nhan from '^[0-9]+'), '')::int
   where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and s.hinh_baitoan_id is not null and s.diem_toi_da is null
     and (doc.dbc ? h.ma_cau)
     and not exists (select 1 from jsonb_object_keys(doc.dbc) as kk(k) where kk.k like h.ma_cau || '#%')
$function$;

create or replace function _mt_loai_ky_cua_buoi(p_buoi uuid) returns text
language sql stable as $$
  select case when b.loai = 'khao_sat' then 'khao_sat_thang'                     -- kỳ khảo sát chung
              when coalesce(m.cau_hinh -> 'mtMeta' ->> 'loaiDe', t.cau_hinh -> 'mtMeta' ->> 'loaiDe') = 'khao_sat_giua_thang'
              then 'khao_sat_thang' else 'mt_sat_hach' end
    from buoi_hoc b
    left join tai_lieu t on b.de_id is null and t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
    left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
   where b.id = p_buoi
   order by t.created_at desc nulls last limit 1
$$;

CREATE OR REPLACE FUNCTION public._mt_ky_thi(p_buoi uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
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
  select trim(case v_loai when 'khao_sat_thang' then 'KS ' else 'MT ' end || coalesce(l.ten_lop, 'K' || d.khoi, '') || ' ' || b.ngay::text),
         v_loai, case v_loai when 'khao_sat_thang' then 1 else 2 end, coalesce(l.mon, d.mon), coalesce(l.khoi, d.khoi), v_mua, b.id
    from buoi_hoc b left join lop l on l.id = b.lop_id left join tai_lieu d on d.id = b.de_id where b.id = p_buoi
  on conflict do nothing;
  select id into v_id from ky_thi
   where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1;
  return v_id;
end $function$;

-- Danh sách HS của 1 buổi chấm (MT theo lớp | khảo sát chung) + lớp hiện tại của em trong môn đó.
create or replace function fn_mt_cham_hs_v2(p_buoi uuid)
returns table (hoc_sinh_id uuid, ho_ten text, diem_danh text, so_cau int, so_cham int, so_thieu_diem int,
               tinh_co_ban numeric, tinh_nang_cao numeric, khung_co_ban numeric, khung_nang_cao numeric,
               nguon text, diem_co_ban numeric, diem_nang_cao numeric, diem numeric, full_diem boolean,
               tl_co_ban numeric, tl_nang_cao numeric, full_thi_lai boolean, diem_thi_lai numeric,
               lop_id uuid, ten_lop text)
language sql stable as $$
  with bu as (
    select b.id, b.loai, coalesce(l.mon, d.mon) as mon, d.khoi as de_khoi
      from buoi_hoc b left join lop l on l.id = b.lop_id left join tai_lieu d on d.id = b.de_id where b.id = p_buoi
  ),
  ky as (select id, khung_co_ban, khung_nang_cao from ky_thi
          where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1),
  hs as (
    select h.hoc_sinh_id, h.diem_danh from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.diem_danh = 'co_mat'
    union
    -- Kỳ khảo sát chung: mọi HS đang học môn đó ở khối của đề (CEO 23/10).
    select hl.hoc_sinh_id, null::text from bu
      join lop l on l.mon = bu.mon and l.khoi = bu.de_khoi
      join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
     where bu.loai = 'khao_sat'
    union
    select g.hoc_sinh_id, h2.diem_danh from gami_grades g
      join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
      left join buoi_hoc_hs h2 on h2.buoi_hoc_id = p_buoi and h2.hoc_sinh_id = g.hoc_sinh_id
     where g.buoi_hoc_id = p_buoi
  ),
  hs1 as (select distinct on (hoc_sinh_id) hoc_sinh_id, diem_danh from hs order by hoc_sinh_id, diem_danh nulls last),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id join bu on l.mon = bu.mon
     where hl.trang_thai = 'dang_hoc' and hl.hoc_sinh_id in (select hoc_sinh_id from hs1)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  dem as (
    select hs1.hoc_sinh_id,
           count(s.id)::int as so_cau, count(g.id)::int as so_cham, count(g.id) filter (where g.diem_dat is null)::int as so_thieu_diem,
           sum(g.diem_dat) filter (where not s.nang_cao) as cb, sum(g.diem_dat) filter (where s.nang_cao) as nc
      from hs1
      left join gami_session_problems s on s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de
      left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = hs1.hoc_sinh_id
     group by hs1.hoc_sinh_id
  )
  select hs1.hoc_sinh_id, x.ho_ten, hs1.diem_danh, d.so_cau, d.so_cham, d.so_thieu_diem,
         coalesce(d.cb, 0), coalesce(d.nc, 0), ky.khung_co_ban, ky.khung_nang_cao,
         dt.nguon, dt.diem_co_ban, dt.diem_nang_cao, dt.diem, coalesce(dt.full_diem, false),
         dt.diem_thi_lai_co_ban, dt.diem_thi_lai_nang_cao, coalesce(dt.full_thi_lai, false), dt.diem_thi_lai,
         lh.lop_id, lh.ten_lop
    from hs1
    join hoc_sinh x on x.id = hs1.hoc_sinh_id
    join dem d on d.hoc_sinh_id = hs1.hoc_sinh_id
    left join lop_hs lh on lh.hoc_sinh_id = hs1.hoc_sinh_id
    left join ky on true
    left join diem_thi dt on dt.ky_thi_id = ky.id and dt.hoc_sinh_id = hs1.hoc_sinh_id
   order by x.ho_ten
$$;

-- Bản cũ giữ tên/cột (panel Điểm MT ở buổi học dùng) — đọc từ bản mới, 1 nguồn công thức.
create or replace function fn_mt_cham_hs(p_buoi uuid)
returns table (hoc_sinh_id uuid, ho_ten text, diem_danh text, so_cau int, so_cham int, so_thieu_diem int,
               tinh_co_ban numeric, tinh_nang_cao numeric, khung_co_ban numeric, khung_nang_cao numeric,
               nguon text, diem_co_ban numeric, diem_nang_cao numeric, diem numeric, full_diem boolean,
               tl_co_ban numeric, tl_nang_cao numeric, full_thi_lai boolean, diem_thi_lai numeric)
language sql stable as $$
  select hoc_sinh_id, ho_ten, diem_danh, so_cau, so_cham, so_thieu_diem, tinh_co_ban, tinh_nang_cao, khung_co_ban, khung_nang_cao,
         nguon, diem_co_ban, diem_nang_cao, diem, full_diem, tl_co_ban, tl_nang_cao, full_thi_lai, diem_thi_lai
    from fn_mt_cham_hs_v2(p_buoi)
$$;

-- Danh sách kỳ khảo sát chung của 1 môn (mới nhất trước) + tiến độ chấm. Cùng cột với fn_mt_cham_ds_buoi + khối/đề.
create or replace function fn_ks_ds_ky(p_mon text)
returns table (buoi_id uuid, ngay date, ten text, loai_de text, dong boolean, so_hs int, so_hs_xong int, khoi text, de_id uuid)
language sql stable as $$
  select b.id, b.ngay, d.ten, 'khao_sat_giua_thang'::text, false, t.so_hs, t.so_xong, d.khoi, d.id
    from buoi_hoc b join tai_lieu d on d.id = b.de_id
    cross join lateral (select count(*)::int as so_hs,
                               count(*) filter (where h.so_cau > 0 and h.so_cham = h.so_cau and h.so_thieu_diem = 0)::int as so_xong
                          from fn_mt_cham_hs_v2(b.id) h) t
   where b.loai = 'khao_sat' and b.trang_thai <> 'huy' and d.mon = p_mon
   order by b.ngay desc, d.ten
   limit 100
$$;

-- Thêm kỳ khảo sát chung: đề gốc + ngày thi (1 kỳ / đề / ngày — gọi lại trả đúng kỳ đã có).
create or replace function fn_ks_tao_ky(p_de uuid, p_ngay date) returns uuid
language plpgsql as $$
declare v_id uuid;
begin
  if not exists (select 1 from tai_lieu where id = p_de and loai = 'mt') then raise exception 'Không tìm thấy đề.'; end if;
  if p_ngay is null then raise exception 'Chưa chọn ngày thi.'; end if;
  insert into buoi_hoc (loai, lop_id, ngay, de_id, trang_thai) values ('khao_sat', null, p_ngay, p_de, 'mo')
  on conflict (de_id, ngay) where loai = 'khao_sat' do nothing;
  select id into v_id from buoi_hoc where loai = 'khao_sat' and de_id = p_de and ngay = p_ngay;
  return v_id;
end $$;

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
    -- Hình học: không có chủ đề cũ ⇒ chủ đề mới (dai_bdm_chu_de) nếu đã gắn, chưa gắn thì gom "Hình học".
    union all select hb.ma_dang, hb.ma_chuyen_de, hb.ten_chuyen_de, coalesce(hb.chu_de_id, 'HINH'), coalesce(cdm.ten, 'Hình học')
      from hinh_hoc_bai hb left join dai_bdm_chu_de cdm on cdm.id = hb.chu_de_id
  ),
  cu as (select x.* from buoi, lateral _mt_o_bai_cu(buoi.id) x),
  o as (
    select s.id, s.buoi_hoc_id, s.problem_no, s.diem_toi_da, cu.k as bai_k, cu.tong as bai_tong,
           case when p_cap = 'chu_de'
                then coalesce(bd1.ma_chu_de, case when mh.id is not null then coalesce(mh.chu_de_id, 'HINH') end, 'KHAC')
                else coalesce(bd1.ma_chuyen_de, case when mh.id is not null then 'MH:' || mh.ma end, 'KHAC') end as cd,
           case when p_cap = 'chu_de'
                then coalesce(bd1.ten_chu_de, case when mh.id is not null then coalesce(cdm2.ten, 'Hình học') end, 'Chưa gán chủ đề')
                else coalesce(bd1.ten_chuyen_de, case when mh.id is not null then 'Hình: ' || mh.ten end, 'Chưa gán chuyên đề') end as ten
      from buoi
      join gami_session_problems s on s.buoi_hoc_id = buoi.id and s.phase = 'mt' and not s.ngoai_de
      left join lateral (select bd.ma_chuyen_de, bd.ten_chuyen_de, bd.ma_chu_de, bd.ten_chu_de from bd where bd.ma_dang = s.ma_dang limit 1) bd1 on s.hinh_baitoan_id is null
      left join hinh_baitoan bt on bt.id = s.hinh_baitoan_id
      left join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
      left join dai_bdm_chu_de cdm2 on cdm2.id = mh.chu_de_id
      left join cu on cu.id = s.id
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
  cot as (select cd, min(ten) as ten, min(problem_no) as tt from o group by cd)
  select jsonb_build_object(
    'cot', coalesce((select jsonb_agg(jsonb_build_object('ma', cd, 'ten', ten) order by tt, ten) from cot), '[]'::jsonb),
    'hs', coalesce((select jsonb_agg(jsonb_build_object(
              'id', xe.hoc_sinh_id, 'ten', xe.ho_ten, 'lop_id', xe.lop_id, 'lop', xe.ten_lop, 'diem', xe.diem, 'hang', xe.hang,
              'o', coalesce((select jsonb_object_agg(p.cd, p.p) from pct p where p.hoc_sinh_id = xe.hoc_sinh_id), '{}'::jsonb))
            order by xe.hang nulls last, xe.ho_ten) from xep xe), '[]'::jsonb),
    'so_co_diem', (select count(*) from diem)
  )
$function$;

-- Đề đã thi (cho ô chọn đề của bảng chuyên đề): đề gán lớp có chấm + đề có kỳ khảo sát chung có chấm.
create or replace function fn_mt_ds_de_da_thi(p_mon text)
returns table (de_id uuid, ten text, khoi text, loai_de text, ngay_moi date, so_lop int)
language sql stable as $$
  with nguon as (
    select t.nguon_id as de_id, b.id as buoi_id, b.ngay, t.lop_id
      from tai_lieu t join buoi_hoc b on b.lop_id = t.lop_id and b.ngay = t.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
     where t.loai = 'mt_buoi' and t.nguon_id is not null
    union all
    select b.de_id, b.id, b.ngay, null::uuid from buoi_hoc b where b.loai = 'khao_sat' and b.trang_thai <> 'huy'
  )
  select m.id, m.ten, m.khoi, m.cau_hinh -> 'mtMeta' ->> 'loaiDe', max(n.ngay), count(distinct n.lop_id)::int
    from tai_lieu m join nguon n on n.de_id = m.id
   where m.loai = 'mt' and m.mon = p_mon
     and exists (select 1 from gami_grades g join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
                  where s.buoi_hoc_id = n.buoi_id)
   group by m.id
   order by max(n.ngay) desc, m.ten
   limit 200
$$;

revoke execute on function fn_mt_cham_hs_v2(uuid), fn_ks_ds_ky(text), fn_ks_tao_ky(uuid, date) from public, anon;
grant execute on function fn_mt_cham_hs_v2(uuid), fn_ks_ds_ky(text), fn_ks_tao_ky(uuid, date) to authenticated;
