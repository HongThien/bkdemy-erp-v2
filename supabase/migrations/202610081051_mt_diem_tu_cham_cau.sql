-- ============================================================================
-- 202610081051 — mt_diem_tu_cham_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 08/10): bỏ màn "Nhập điểm MT (theo tháng)" — ĐIỂM MT TỔNG (Cơ bản / Nâng cao) không nhập tay
-- nữa mà CỘNG từ chấm từng câu; chấm ở tab MT buổi học hay ở màn Chấm MT phải ra CÙNG một dữ liệu.
--   · Điểm 1 câu: Đ = full điểm câu · S = 0 · C = người chấm tự chọn (không tự gợi ý ½). Luật này sống DUY
--     NHẤT ở trigger dưới đây — mọi đường ghi Đ/C/S (tab MT, chấm hàng loạt, màn Chấm MT) đều đi qua nó.
--   · Cơ bản / Nâng cao tách theo PHẦN: người soạn đánh dấu phần Nâng cao (tai_lieu_phan.nang_cao); mặc định
--     phần có chữ "nâng cao" trong tên.
--   · Điểm tối đa từng ô chấm (diem_toi_da) + ô thuộc phần nâng cao (nang_cao) chép từ đề gán buổi
--     (cau_hinh.diemByCau, key câu Đại = ma_cau, ý Hình = 'HINH:<uuid>#<i>' — 07/10). Ý Hình của đề cũ chỉ đặt
--     điểm cả bài ⇒ diem_toi_da NULL = "người chấm tự cho" (không đoán, không chia đều).
--   · diem_thi chỉ được TÍNH khi HS đã có điểm ĐỦ mọi câu (thiếu = không có số, §1.5). 222 dòng điểm MT
--     nhập tay đang có ⇒ nguon='tay', KHÔNG bao giờ bị ghi đè tự động; người chấm bấm "Dùng điểm tính từ
--     câu" (fn_mt_dung_diem_cau) mới chuyển. Khung CB/NC của kỳ cũng chỉ tự tính khi kỳ không còn dòng tay.
--
-- MẤT GÌ: không xoá/drop gì. Cột mới + trigger mới. Dòng gami_grades có result Đ/S mà diem_dat NULL (chấm
-- qua tab MT trước nay) sẽ được ĐIỀN diem_dat (Đ = điểm tối đa câu, S = 0) khi buổi đó được mở lại — điền
-- vào ô đang trống, không đè số người đã chọn.
-- ============================================================================

-- ── 1. Cột mới ──────────────────────────────────────────────────────────────
alter table tai_lieu_phan add column if not exists nang_cao boolean not null default false;
comment on column tai_lieu_phan.nang_cao is 'MT: phần này tính vào điểm NÂNG CAO (còn lại = Cơ bản). Người soạn đánh dấu; mặc định theo tên phần có chữ "nâng cao".';
update tai_lieu_phan p set nang_cao = true
  from tai_lieu t
 where t.id = p.tai_lieu_id and t.loai in ('mt', 'mt_buoi')
   and (p.tieu_de ilike '%nâng cao%' or p.tieu_de ilike '%nang cao%');

alter table gami_session_problems add column if not exists diem_toi_da numeric;
alter table gami_session_problems add column if not exists nang_cao boolean not null default false;
alter table gami_session_problems add column if not exists ngoai_de boolean not null default false;
comment on column gami_session_problems.diem_toi_da is 'MT: điểm tối đa của ô (chép từ đề gán buổi). NULL = người chấm tự cho (ý Hình đề cũ chỉ đặt điểm cả bài) / phase khác MT.';
comment on column gami_session_problems.nang_cao is 'MT: ô thuộc phần Nâng cao của đề.';
comment on column gami_session_problems.ngoai_de is 'MT: ô không còn trong đề (mồ côi còn điểm) — không tính vào điểm MT.';

alter table diem_thi add column if not exists nguon text not null default 'cau';
alter table diem_thi drop constraint if exists diem_thi_nguon_check;
alter table diem_thi add constraint diem_thi_nguon_check check (nguon in ('tay', 'cau'));
comment on column diem_thi.nguon is 'tay = Cơ bản/Nâng cao nhập tay (không tự ghi đè) · cau = cộng từ chấm từng câu (MT, từ 08/10).';
update diem_thi set nguon = 'tay' where nguon = 'cau' and (diem is not null or diem_co_ban is not null or diem_nang_cao is not null or full_diem);

-- ── 2. Kỳ thi MT của buổi (tìm-hoặc-tạo, đúng khuôn getOrCreateKyThiMTChoBuoi) ──────────────
create or replace function _mt_ky_thi(p_buoi uuid) returns uuid
language plpgsql as $$
declare v_id uuid;
begin
  select id into v_id from ky_thi where buoi_hoc_id = p_buoi and loai = 'mt_sat_hach' order by created_at limit 1;
  if v_id is not null then return v_id; end if;
  insert into ky_thi (ten, loai, he_so, mon, khoi, mua, buoi_hoc_id)
  select trim('MT ' || coalesce(l.ten_lop, '') || ' ' || b.ngay::text), 'mt_sat_hach', 2, l.mon, l.khoi, (select mua from _tt_mua()), b.id
    from buoi_hoc b left join lop l on l.id = b.lop_id where b.id = p_buoi
  on conflict (buoi_hoc_id) where loai = 'mt_sat_hach' and buoi_hoc_id is not null do nothing;
  select id into v_id from ky_thi where buoi_hoc_id = p_buoi and loai = 'mt_sat_hach' order by created_at limit 1;
  return v_id;
end $$;

-- ── 3. Đồng bộ điểm MT tổng của 1 HS × buổi từ điểm từng câu ────────────────────────────────
create or replace function _mt_dong_bo_diem_thi(p_buoi uuid, p_hs uuid) returns void
language plpgsql as $$
declare
  v_ky uuid; v_nguon text; v_n int; v_du int; v_cb numeric; v_nc numeric;
begin
  select count(*), count(g.diem_dat),
         coalesce(sum(g.diem_dat) filter (where not s.nang_cao), 0), coalesce(sum(g.diem_dat) filter (where s.nang_cao), 0)
    into v_n, v_du, v_cb, v_nc
    from gami_session_problems s
    left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = p_hs
   where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de;
  if v_n = 0 then return; end if;
  v_ky := _mt_ky_thi(p_buoi);
  if v_ky is null then return; end if;
  select nguon into v_nguon from diem_thi where ky_thi_id = v_ky and hoc_sinh_id = p_hs;
  if v_nguon = 'tay' then return; end if;                       -- điểm nhập tay: không tự đè
  if v_du = v_n then
    insert into diem_thi (ky_thi_id, hoc_sinh_id, verdict, diem_co_ban, diem_nang_cao, nguon, graded_by, updated_at)
    values (v_ky, p_hs, 'khong_dat', v_cb, v_nc, 'cau', jwt_uid(), now())
    on conflict (ky_thi_id, hoc_sinh_id) do update
      set diem_co_ban = excluded.diem_co_ban, diem_nang_cao = excluded.diem_nang_cao, graded_by = excluded.graded_by, updated_at = now();
  elsif v_nguon = 'cau' then                                    -- đang thiếu điểm câu ⇒ chưa có điểm tổng
    update diem_thi set diem_co_ban = null, diem_nang_cao = null, diem = case when full_diem then diem else null end, updated_at = now()
     where ky_thi_id = v_ky and hoc_sinh_id = p_hs;
  end if;
end $$;

-- ── 4. Trigger điểm 1 câu MT: Đ = full · S = 0 · C = người chấm chọn ────────────────────────
create or replace function _tg_gami_grades_mt_diem() returns trigger
language plpgsql as $$
declare v_phase text; v_max numeric;
begin
  select phase, diem_toi_da into v_phase, v_max from gami_session_problems where id = new.problem_id;
  if v_phase is distinct from 'mt' then return new; end if;
  if tg_op = 'INSERT' then
    if new.diem_dat is not null then return new; end if;        -- người chấm chủ động cho điểm
  elsif new.result is not distinct from old.result or new.diem_dat is distinct from old.diem_dat then
    return new;                                                 -- không đổi Đ/C/S, hoặc người chấm gửi điểm kèm
  end if;
  new.diem_dat := case new.result when 'correct' then v_max when 'wrong' then 0 else null end;
  return new;
end $$;
drop trigger if exists tg_gami_grades_mt_diem on gami_grades;
create trigger tg_gami_grades_mt_diem before insert or update on gami_grades
  for each row execute function _tg_gami_grades_mt_diem();

create or replace function _tg_gami_grades_mt_tong() returns trigger
language plpgsql as $$
declare v_row gami_grades; v_phase text;
begin
  v_row := case when tg_op = 'DELETE' then old else new end;
  if tg_op = 'UPDATE' and new.diem_dat is not distinct from old.diem_dat and new.result is not distinct from old.result then return null; end if;
  select phase into v_phase from gami_session_problems where id = v_row.problem_id;
  if v_phase is distinct from 'mt' then return null; end if;
  perform _mt_dong_bo_diem_thi(v_row.buoi_hoc_id, v_row.hoc_sinh_id);
  return null;
end $$;
drop trigger if exists tg_gami_grades_mt_tong on gami_grades;
create trigger tg_gami_grades_mt_tong after insert or update or delete on gami_grades
  for each row execute function _tg_gami_grades_mt_tong();

-- ── 5. Khung điểm của buổi: chép điểm tối đa + phần nâng cao từ đề gán buổi vào từng ô ──────
-- Gọi sau khi dựng lưới (chuanBiLuoiMT). Điền diem_dat còn TRỐNG của ô Đ/S cũ; Đ đang = điểm tối đa cũ thì
-- theo điểm tối đa mới (người soạn sửa điểm câu). Khung CB/NC của kỳ chỉ tự tính khi kỳ không còn dòng 'tay'.
create or replace function _mt_khung_tinh(p_buoi uuid)
returns table (id uuid, moi numeric, nc boolean, ngoai boolean, tl uuid, dbc jsonb)
language sql stable as $$
  with doc as (
    select t.id as tl, coalesce(t.cau_hinh -> 'diemByCau', '{}'::jsonb) as dbc
      from buoi_hoc b join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
     where b.id = p_buoi order by t.created_at desc limit 1
  ),
  hang as (
    select tc.ma_cau, p.nang_cao, row_number() over (order by p.thu_tu, tc.thu_tu) as rn
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
$$;

create or replace function fn_mt_khung_buoi(p_buoi uuid) returns jsonb
language plpgsql as $$
declare
  v_tl uuid; v_dbc jsonb; v_ky uuid; v_kcb numeric; v_knc numeric; v_n int;
begin
  select count(*), max(k.tl::text)::uuid, (array_agg(k.dbc))[1] into v_n, v_tl, v_dbc from _mt_khung_tinh(p_buoi) k;
  if v_tl is null or v_n = 0 then return jsonb_build_object('so_o', v_n, 'co_de', v_tl is not null); end if;

  -- Ô Đ/S cũ chưa có điểm ⇒ điền; Đ đang bằng điểm tối đa cũ ⇒ theo điểm tối đa mới.
  update gami_grades g set diem_dat = k.moi
    from _mt_khung_tinh(p_buoi) k join gami_session_problems s on s.id = k.id
   where g.problem_id = k.id and g.result = 'correct' and k.moi is not null
     and (g.diem_dat is null or g.diem_dat = s.diem_toi_da) and g.diem_dat is distinct from k.moi;
  update gami_grades g set diem_dat = 0
    from _mt_khung_tinh(p_buoi) k where g.problem_id = k.id and g.result = 'wrong' and g.diem_dat is null;

  update gami_session_problems s set diem_toi_da = k.moi, nang_cao = k.nc, ngoai_de = k.ngoai
    from _mt_khung_tinh(p_buoi) k
   where s.id = k.id and (s.diem_toi_da is distinct from k.moi or s.nang_cao <> k.nc or s.ngoai_de <> k.ngoai);

  -- Khung của kỳ = tổng điểm tối đa theo CB/NC (bài Hình đề cũ: điểm cả bài, tính 1 lần).
  v_ky := _mt_ky_thi(p_buoi);
  select coalesce(sum(x.d) filter (where not x.nc), 0), coalesce(sum(x.d) filter (where x.nc), 0) into v_kcb, v_knc from (
    select s.diem_toi_da as d, s.nang_cao as nc from gami_session_problems s
     where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de and s.diem_toi_da is not null
    union all
    select (v_dbc ->> hh.ma_cau)::numeric, p.nang_cao
      from tai_lieu_phan p join tai_lieu_cau hh on hh.phan_id = p.id
     where p.tai_lieu_id = v_tl and p.loai_phan = 'custom' and hh.ma_cau like 'HINH:%' and (v_dbc ? hh.ma_cau)
       and not exists (select 1 from jsonb_object_keys(v_dbc) as kk(k) where kk.k like hh.ma_cau || '#%')
  ) x;
  if v_ky is not null and not exists (select 1 from diem_thi where ky_thi_id = v_ky and nguon = 'tay') then
    update ky_thi set khung_co_ban = v_kcb, khung_nang_cao = v_knc
     where id = v_ky and (khung_co_ban is distinct from v_kcb or khung_nang_cao is distinct from v_knc);
  end if;
  return jsonb_build_object('so_o', v_n, 'co_de', true, 'khung_co_ban', v_kcb, 'khung_nang_cao', v_knc);
end $$;

-- ── 6. Màn Chấm MT: danh sách buổi MT của lớp + tiến độ ────────────────────────────────────
create or replace function fn_mt_cham_ds_buoi(p_lop uuid)
returns table (buoi_id uuid, ngay date, ten text, loai_de text, dong boolean, so_hs int, so_hs_xong int)
language sql stable as $$
  with doc as (
    select distinct on (t.ngay) t.ngay, t.ten, t.cau_hinh -> 'mtMeta' ->> 'loaiDe' as loai_de
      from tai_lieu t where t.loai = 'mt_buoi' and t.lop_id = p_lop and t.ngay is not null
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

-- ── 7. Màn Chấm MT: HS của buổi + tiến độ + điểm (đang lưu & tính từ câu) ──────────────────
create or replace function fn_mt_cham_hs(p_buoi uuid)
returns table (hoc_sinh_id uuid, ho_ten text, diem_danh text, so_cau int, so_cham int, so_thieu_diem int,
               tinh_co_ban numeric, tinh_nang_cao numeric, khung_co_ban numeric, khung_nang_cao numeric,
               nguon text, diem_co_ban numeric, diem_nang_cao numeric, diem numeric, full_diem boolean,
               tl_co_ban numeric, tl_nang_cao numeric, full_thi_lai boolean, diem_thi_lai numeric)
language sql stable as $$
  with ky as (select id, khung_co_ban, khung_nang_cao from ky_thi where buoi_hoc_id = p_buoi and loai = 'mt_sat_hach' order by created_at limit 1),
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

-- ── 8. Ghi: chấm cả bài 1 HS cùng Đ/C/S (sửa riêng câu lệch sau) ───────────────────────────
create or replace function fn_mt_cham_ca_hs(p_buoi uuid, p_hs uuid, p_result text) returns int
language plpgsql as $$
declare v_n int;
begin
  if p_result not in ('correct', 'partial', 'wrong') then raise exception 'Kết quả không hợp lệ: %', p_result; end if;
  if exists (select 1 from buoi_hoc where id = p_buoi and mt_dong_at is not null) then
    raise exception 'MT buổi này đã đóng — mở lại ở tab MT trong buổi học rồi mới chấm.';
  end if;
  insert into gami_grades (buoi_hoc_id, problem_id, hoc_sinh_id, result, presentation, speed, points, loi, graded_by)
  select p_buoi, s.id, p_hs, p_result, 'clean', 'normal',
         case p_result when 'correct' then 100 when 'partial' then 50 else 0 end, '[]'::jsonb, jwt_uid()
    from gami_session_problems s where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de
  on conflict (problem_id, hoc_sinh_id) do update
    set result = excluded.result, points = excluded.points, loi = '[]'::jsonb, graded_by = excluded.graded_by;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ── 9. Ghi: Full + thi lại của 1 HS (điểm chính CB/NC không nhập tay ở đây) ──────────────────
create or replace function fn_mt_luu_tong(p_buoi uuid, p_hs uuid, p_full boolean, p_tl_cb numeric, p_tl_nc numeric, p_full_tl boolean)
returns void language plpgsql as $$
declare v_ky uuid;
begin
  v_ky := _mt_ky_thi(p_buoi);
  insert into diem_thi (ky_thi_id, hoc_sinh_id, verdict, full_diem, diem_thi_lai_co_ban, diem_thi_lai_nang_cao, full_thi_lai, nguon, graded_by, updated_at)
  values (v_ky, p_hs, 'khong_dat', coalesce(p_full, false), p_tl_cb, p_tl_nc, coalesce(p_full_tl, false), 'cau', jwt_uid(), now())
  on conflict (ky_thi_id, hoc_sinh_id) do update
    set full_diem = excluded.full_diem, diem_thi_lai_co_ban = excluded.diem_thi_lai_co_ban,
        diem_thi_lai_nang_cao = excluded.diem_thi_lai_nang_cao, full_thi_lai = excluded.full_thi_lai,
        graded_by = excluded.graded_by, updated_at = now();
  perform _mt_dong_bo_diem_thi(p_buoi, p_hs);
end $$;

-- ── 10. Ghi: bỏ điểm nhập tay, dùng điểm tính từ câu ───────────────────────────────────────
create or replace function fn_mt_dung_diem_cau(p_buoi uuid, p_hs uuid) returns void
language plpgsql as $$
declare v_ky uuid;
begin
  v_ky := _mt_ky_thi(p_buoi);
  update diem_thi set nguon = 'cau' where ky_thi_id = v_ky and hoc_sinh_id = p_hs and nguon = 'tay';
  perform _mt_dong_bo_diem_thi(p_buoi, p_hs);
  -- Sau khi chuyển: còn thiếu điểm câu ⇒ _mt_dong_bo_diem_thi đã xoá số; kỳ hết dòng 'tay' thì khung tự tính lại.
  perform fn_mt_khung_buoi(p_buoi);
end $$;

-- Quyền: chỉ người đăng nhập (RLS la_thanh_vien() ở bảng vẫn chặn như cũ — hàm chạy quyền người gọi).
revoke execute on function _mt_ky_thi(uuid), _mt_dong_bo_diem_thi(uuid, uuid), _mt_khung_tinh(uuid), fn_mt_khung_buoi(uuid), fn_mt_cham_ds_buoi(uuid),
  fn_mt_cham_hs(uuid), fn_mt_cham_ca_hs(uuid, uuid, text), fn_mt_luu_tong(uuid, uuid, boolean, numeric, numeric, boolean),
  fn_mt_dung_diem_cau(uuid, uuid) from public, anon;
grant execute on function _mt_ky_thi(uuid), _mt_dong_bo_diem_thi(uuid, uuid), _mt_khung_tinh(uuid), fn_mt_khung_buoi(uuid), fn_mt_cham_ds_buoi(uuid),
  fn_mt_cham_hs(uuid), fn_mt_cham_ca_hs(uuid, uuid, text), fn_mt_luu_tong(uuid, uuid, boolean, numeric, numeric, boolean),
  fn_mt_dung_diem_cau(uuid, uuid) to authenticated;

-- ── 11. Lá menu mới "Chấm MT" (Quản lý chất lượng): ai đang có "Kết quả học tập" thì có luôn lá này ──
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select vai_tro_id, 'cham_mt', chi_xem from vai_tro_chuc_nang where chuc_nang = 'ketqua'
on conflict do nothing;
