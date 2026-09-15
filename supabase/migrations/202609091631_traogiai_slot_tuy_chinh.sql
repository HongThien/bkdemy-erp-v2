-- ============================================================================
-- 202609091631 — TRAO GIẢI: SỐ SLOT TUỲ CHỈNH theo (lớp × tháng) — CEO 09/09
-- ----------------------------------------------------------------------------
-- VÌ SAO: "nhiều đứa bằng điểm nhau quá — 8S1 có 6 đứa 9.75 thì phải có giải, cấu trúc sẽ là 3 xuất sắc
--   3 tiến bộ". Mặc định vẫn 3/2/1 (không đổi luật cũ), nhưng người duyệt được đặt lại số slot từng loại cho
--   ĐÚNG (lớp, tháng) đó. Tổng slot 1..6 (ngân sách 6 giải/lớp/tháng giữ nguyên — CEO chốt slot cố định,
--   không scale theo sĩ số), mỗi loại 0..6.
-- THIẾT KẾ (§1.5): bảng riêng `giai_thuong_slot` — KHÔNG có dòng = dùng mặc định 3/2/1; đặt đúng 3/2/1 thì
--   XOÁ dòng (không lưu dòng "bằng mặc định"). Không thêm cột vào giai_thuong_lop_thang vì bảng đó thuộc
--   `postgres` (claude_build không ALTER được) và ngữ nghĩa khác (khoá sửa ≠ cấu hình).
-- ⚠ TRIGGER `trg_giai_thuong_check_slot` (3/2/1 cứng) thuộc `postgres` — role migrate KHÔNG thay được.
--   Khối DO cuối file chỉ chạy khi role hiện tại là chủ bảng; trên DB thật nó bỏ qua + raise notice, CEO
--   dán tay đoạn SQL trong notice (cũng in ở cuối file) qua SQL Editor. Tới lúc đó, fn_traogiai_xac_nhan đã
--   kiểm slot theo cấu hình trước, nhưng trigger cũ vẫn chặn khi cấu hình > 3/2/1.
--
-- MẤT GÌ (Luật xoá): không. Tạo bảng mới + create or replace 3 hàm + 1 hàm mới.
-- ============================================================================

create table if not exists giai_thuong_slot (
  lop_id        uuid not null references lop(id),
  thang         date not null,
  xuat_sac      int not null check (xuat_sac between 0 and 6),
  tien_bo       int not null check (tien_bo between 0 and 6),
  cham_chi      int not null check (cham_chi between 0 and 6),
  cap_nhat_boi  uuid references nhan_su(id),
  cap_nhat_at   timestamptz not null default now(),
  primary key (lop_id, thang),
  constraint giai_thuong_slot_tong check (xuat_sac + tien_bo + cham_chi between 1 and 6)
);
alter table giai_thuong_slot enable row level security;
drop policy if exists giai_thuong_slot_member_all on giai_thuong_slot;
create policy giai_thuong_slot_member_all on giai_thuong_slot for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on giai_thuong_slot to authenticated;

-- Slot tối đa của (lớp, tháng, loại): cấu hình riêng nếu có, không thì 3/2/1
create or replace function public.fn_traogiai_slot_max(p_lop uuid, p_thang date, p_loai text)
returns int language sql stable as $$
  select coalesce(
    (select case p_loai when 'xuat_sac' then s.xuat_sac when 'tien_bo' then s.tien_bo when 'cham_chi' then s.cham_chi end
     from giai_thuong_slot s where s.lop_id = p_lop and s.thang = p_thang),
    case p_loai when 'xuat_sac' then 3 when 'tien_bo' then 2 when 'cham_chi' then 1 end)
$$;
create or replace function public.fn_traogiai_tong_slot(p_lop uuid, p_thang date)
returns int language sql stable as $$
  select public.fn_traogiai_slot_max(p_lop, p_thang, 'xuat_sac') + public.fn_traogiai_slot_max(p_lop, p_thang, 'tien_bo') + public.fn_traogiai_slot_max(p_lop, p_thang, 'cham_chi')
$$;

-- Đặt slot cho (lớp, tháng). Không giảm dưới số đã xác nhận; lớp khoá thì không đổi; bằng mặc định ⇒ xoá dòng.
create or replace function public.fn_traogiai_dat_slot(p_ym text, p_lop uuid, p_xuat_sac int, p_tien_bo int, p_cham_chi int)
returns void language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_loai text; v_muon int; v_da int;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  v_thang := (p_ym || '-01')::date;
  perform public.fn_traogiai_kiem_khoa(p_lop, v_thang);
  if p_xuat_sac is null or p_tien_bo is null or p_cham_chi is null then raise exception 'Thiếu số slot.'; end if;
  if least(p_xuat_sac, p_tien_bo, p_cham_chi) < 0 or greatest(p_xuat_sac, p_tien_bo, p_cham_chi) > 6 then raise exception 'Mỗi loại 0–6 slot.'; end if;
  if p_xuat_sac + p_tien_bo + p_cham_chi not between 1 and 6 then raise exception 'Tổng slot phải từ 1 đến 6 (ngân sách 6 giải/lớp/tháng).'; end if;
  foreach v_loai in array array['xuat_sac', 'tien_bo', 'cham_chi'] loop
    v_muon := case v_loai when 'xuat_sac' then p_xuat_sac when 'tien_bo' then p_tien_bo else p_cham_chi end;
    select count(*) into v_da from giai_thuong where thang = v_thang and lop_id = p_lop and loai_giai = v_loai;
    if v_muon < v_da then
      raise exception 'Đang có % giải "%" đã xác nhận — bỏ xác nhận trước khi giảm xuống % slot.', v_da, v_loai, v_muon;
    end if;
  end loop;
  if p_xuat_sac = 3 and p_tien_bo = 2 and p_cham_chi = 1 then
    delete from giai_thuong_slot where lop_id = p_lop and thang = v_thang;
  else
    insert into giai_thuong_slot (lop_id, thang, xuat_sac, tien_bo, cham_chi, cap_nhat_boi)
    values (p_lop, v_thang, p_xuat_sac, p_tien_bo, p_cham_chi, v_me)
    on conflict (lop_id, thang) do update
      set xuat_sac = excluded.xuat_sac, tien_bo = excluded.tien_bo, cham_chi = excluded.cham_chi, cap_nhat_boi = excluded.cap_nhat_boi, cap_nhat_at = now();
  end if;
end $$;
grant execute on function public.fn_traogiai_dat_slot(text, uuid, int, int, int) to authenticated;

-- fn_traogiai_xac_nhan: kiểm slot theo CẤU HÌNH trước khi insert (message rõ; trigger cũ 3/2/1 vẫn đứng sau tới khi CEO thay)
create or replace function public.fn_traogiai_xac_nhan(p_ym text, p_lop uuid, p_hs uuid, p_loai text)
returns uuid language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_mon text; v_id uuid; v_max int; v_da int;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  v_thang := (p_ym || '-01')::date;
  perform public.fn_traogiai_kiem_khoa(p_lop, v_thang);
  select mon into v_mon from lop where id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  if not exists (select 1 from hoc_sinh_lop where lop_id = p_lop and hoc_sinh_id = p_hs and trang_thai = 'dang_hoc') then
    raise exception 'Học sinh không thuộc lớp này.';
  end if;
  v_max := public.fn_traogiai_slot_max(p_lop, v_thang, p_loai);
  select count(*) into v_da from giai_thuong where thang = v_thang and lop_id = p_lop and loai_giai = p_loai;
  if v_da >= v_max then raise exception 'Lớp đã đủ % slot "%" tháng này.', v_max, p_loai; end if;
  begin
    insert into giai_thuong (thang, lop_id, mon, hoc_sinh_id, loai_giai, duyet_boi)
    values (v_thang, p_lop, v_mon, p_hs, p_loai, v_me) returning id into v_id;
  exception
    when unique_violation then
      raise exception 'Học sinh này đã được trao 1 giải khác trong tháng — tải lại trang để xem dữ liệu mới nhất.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_traogiai_xac_nhan(text, uuid, uuid, text) to authenticated;

create or replace function public.fn_traogiai_thang(p_ym text, p_khoi text default null)
returns jsonb language plpgsql as $$
declare
  v_tu date; v_den date; v_thang date; v_ym_truoc text;
  v_lops jsonb; v_summary jsonb; v_khoi jsonb; v_loai text;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  v_thang := (p_ym || '-01')::date; v_tu := v_thang; v_den := (v_thang + interval '1 month')::date;
  v_ym_truoc := to_char(v_thang - interval '1 month', 'YYYY-MM');

  drop table if exists _tg_lop;
  create temp table _tg_lop on commit drop as
    select l.id, l.ten_lop, l.mon, l.khoi
    from lop l where l.trang_thai = 'dang_hoc' and (p_khoi is null or p_khoi = '' or l.khoi = p_khoi);

  drop table if exists _tg_hs;
  create temp table _tg_hs on commit drop as
    select hl.lop_id, hl.hoc_sinh_id, hs.ho_ten, hs.ma_hs
    from hoc_sinh_lop hl join _tg_lop l on l.id = hl.lop_id join hoc_sinh hs on hs.id = hl.hoc_sinh_id
    where hl.trang_thai = 'dang_hoc';

  drop table if exists _tg_buoi;
  create temp table _tg_buoi on commit drop as
    select b.id, b.lop_id from buoi_hoc b join _tg_lop l on l.id = b.lop_id
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= v_tu and b.ngay < v_den;

  drop table if exists _tg_pct;
  create temp table _tg_pct on commit drop as
    select g.hoc_sinh_id, sp.buoi_hoc_id, b.lop_id, sp.phase, sum(g.points) / (count(*) * 100.0) as pct
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join _tg_buoi b on b.id = sp.buoi_hoc_id
    group by g.hoc_sinh_id, sp.buoi_hoc_id, b.lop_id, sp.phase;

  drop table if exists _tg_btvn_giao;
  create temp table _tg_btvn_giao on commit drop as
    select r.hoc_sinh_id, r.buoi_hoc_id, b.lop_id
    from buoi_hoc_hs r join _tg_buoi b on b.id = r.buoi_hoc_id
    where r.diem_danh = 'co_mat'
      and exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = r.buoi_hoc_id and sp.phase = 'btvn');

  -- MT tháng NÀY và tháng TRƯỚC: hạng khối từ fn_rank_diem_mt_lop, hạng lớp = rank() trong roster lớp
  drop table if exists _tg_mt;
  create temp table _tg_mt on commit drop as
    select l.id as lop_id, r.hoc_sinh_id, r.tb, r.rank_now as rank_khoi, r.rank_total as khoi_total,
      rank() over (partition by l.id order by coalesce(r.tb, 0) desc)::int as rank_lop
    from _tg_lop l cross join lateral public.fn_rank_diem_mt_lop(l.id, l.mon, p_ym) r;
  drop table if exists _tg_mt_truoc;
  create temp table _tg_mt_truoc on commit drop as
    select l.id as lop_id, r.hoc_sinh_id, r.tb, r.rank_now as rank_khoi, r.rank_total as khoi_total,
      rank() over (partition by l.id order by coalesce(r.tb, 0) desc)::int as rank_lop
    from _tg_lop l cross join lateral public.fn_rank_diem_mt_lop(l.id, l.mon, v_ym_truoc) r;

  -- Metric per (lớp × HS) — NULL = chưa đo
  drop table if exists _tg_m;
  create temp table _tg_m on commit drop as
    select m0.*,
      case when m0.rank_lop_truoc is not null and m0.rank_lop_nay is not null
        then (m0.rank_lop_truoc - m0.rank_lop_nay) + (m0.rank_khoi_truoc - m0.rank_khoi_nay) end as tien_bo,
      case when m0.rank_lop_truoc is not null and m0.rank_lop_nay is not null
        then (m0.rank_lop_truoc - m0.rank_lop_nay) end as d_lop,
      case when m0.rank_khoi_truoc is not null and m0.rank_khoi_nay is not null
        then (m0.rank_khoi_truoc - m0.rank_khoi_nay) end as d_khoi
    from (
      select h.lop_id, h.hoc_sinh_id, h.ho_ten, h.ma_hs,
        (select mt.tb from _tg_mt mt where mt.lop_id = h.lop_id and mt.hoc_sinh_id = h.hoc_sinh_id limit 1) as mt,
        (select avg(p.pct) from _tg_pct p where p.hoc_sinh_id = h.hoc_sinh_id and p.lop_id = h.lop_id and p.phase = 'et') as et,
        (select avg(p.pct) from _tg_pct p where p.hoc_sinh_id = h.hoc_sinh_id and p.lop_id = h.lop_id and p.phase = 'btvn') as btvn,
        -- hạng chỉ có nghĩa khi tháng đó CÓ điểm (tb not null); chưa thi ⇒ NULL
        (select mt.rank_lop  from _tg_mt mt where mt.lop_id = h.lop_id and mt.hoc_sinh_id = h.hoc_sinh_id and mt.tb is not null limit 1) as rank_lop_nay,
        (select mt.rank_khoi from _tg_mt mt where mt.lop_id = h.lop_id and mt.hoc_sinh_id = h.hoc_sinh_id and mt.tb is not null limit 1) as rank_khoi_nay,
        (select mt.khoi_total from _tg_mt mt where mt.lop_id = h.lop_id and mt.hoc_sinh_id = h.hoc_sinh_id limit 1) as khoi_total,
        (select t.rank_lop  from _tg_mt_truoc t where t.lop_id = h.lop_id and t.hoc_sinh_id = h.hoc_sinh_id and t.tb is not null limit 1) as rank_lop_truoc,
        (select t.rank_khoi from _tg_mt_truoc t where t.lop_id = h.lop_id and t.hoc_sinh_id = h.hoc_sinh_id and t.tb is not null limit 1) as rank_khoi_truoc,
        (select count(*)::int from _tg_btvn_giao g where g.hoc_sinh_id = h.hoc_sinh_id and g.lop_id = h.lop_id) as btvn_tong,
        (select count(*)::int from _tg_btvn_giao g where g.hoc_sinh_id = h.hoc_sinh_id and g.lop_id = h.lop_id
           and exists (select 1 from _tg_pct p where p.hoc_sinh_id = g.hoc_sinh_id and p.buoi_hoc_id = g.buoi_hoc_id and p.phase = 'btvn')) as btvn_ht
      from _tg_hs h
    ) m0;

  drop table if exists _tg_da;
  create temp table _tg_da on commit drop as
    select g.id, g.lop_id, g.hoc_sinh_id, g.loai_giai, g.duyet_at, g.cong_bo_at
    from giai_thuong g join _tg_lop l on l.id = g.lop_id where g.thang = v_thang;

  -- Xếp hạng từng giải (chỉ HS chưa chốt giải nào; chỉ HS có chỉ số của giải đó)
  drop table if exists _tg_rank;
  create temp table _tg_rank on commit drop as
    select lop_id, hoc_sinh_id, 'xuat_sac'::text as loai_giai,
      row_number() over (partition by lop_id order by mt desc nulls last, et desc nulls last, btvn desc nulls last, ho_ten) as rk
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      and (mt is not null or et is not null or btvn is not null)
    union all
    select lop_id, hoc_sinh_id, 'tien_bo',
      row_number() over (partition by lop_id order by tien_bo desc, d_lop desc, mt desc nulls last, ho_ten)
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      -- "cả 2 đều tăng": không hạng nào tụt và tổng lên > 0 — em tụt hạng KHÔNG bao giờ được đề xuất Tiến bộ
      and tien_bo > 0 and d_lop >= 0 and d_khoi >= 0
    union all
    select lop_id, hoc_sinh_id, 'cham_chi',
      row_number() over (partition by lop_id order by btvn_ht desc, btvn desc nulls last, ho_ten)
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      and btvn_ht > 0; -- 0/n buổi không phải "chăm chỉ" (bản 1431 chỉ cần btvn_tong > 0)

  -- Slot = đã chốt (theo duyet_at) + đề xuất THAM LAM theo ưu tiên Xuất sắc > Tiến bộ > Chăm chỉ (1 HS 1 giải)
  drop table if exists _tg_slot;
  create temp table _tg_slot (lop_id uuid, loai_giai text, hoc_sinh_id uuid, giai_thuong_id uuid, confirmed boolean, slot_index int) on commit drop;
  insert into _tg_slot
    select d.lop_id, d.loai_giai, d.hoc_sinh_id, d.id, true,
      (row_number() over (partition by d.lop_id, d.loai_giai order by d.duyet_at) - 1)::int
    from _tg_da d;
  foreach v_loai in array array['xuat_sac', 'tien_bo', 'cham_chi'] loop
    insert into _tg_slot
      select r.lop_id, r.loai_giai, r.hoc_sinh_id, null, false, (c.da_co + r.rk2 - 1)::int
      from (
        select x.*, row_number() over (partition by x.lop_id order by x.rk) as rk2
        from _tg_rank x
        where x.loai_giai = v_loai
          and not exists (select 1 from _tg_slot s where s.lop_id = x.lop_id and s.hoc_sinh_id = x.hoc_sinh_id)
      ) r
      join (select l.id as lop_id, (select count(*) from _tg_slot s where s.lop_id = l.id and s.loai_giai = v_loai and s.confirmed)::int as da_co,
                   public.fn_traogiai_slot_max(l.id, v_thang, v_loai) as slot_count
            from _tg_lop l) c
        on c.lop_id = r.lop_id
      where r.rk2 <= c.slot_count - c.da_co;
  end loop;

  select coalesce(jsonb_agg(x order by x->>'tenLop'), '[]'::jsonb) into v_lops from (
    select jsonb_build_object(
      'lopId', l.id, 'tenLop', l.ten_lop, 'mon', l.mon, 'khoi', l.khoi,
      'siSo', (select count(*) from _tg_hs h where h.lop_id = l.id),
      'hoanThanhAt', lt.hoan_thanh_at, 'hoanThanhBoi', lt.hoan_thanh_boi,
      'daXacNhan', (select count(*) from _tg_da d where d.lop_id = l.id),
      'daCongBo', (select count(*) from _tg_da d where d.lop_id = l.id and d.cong_bo_at is not null),
      'tongSlot', public.fn_traogiai_tong_slot(l.id, v_thang),
      'slotCauHinh', jsonb_build_object(
        'xuat_sac', public.fn_traogiai_slot_max(l.id, v_thang, 'xuat_sac'),
        'tien_bo', public.fn_traogiai_slot_max(l.id, v_thang, 'tien_bo'),
        'cham_chi', public.fn_traogiai_slot_max(l.id, v_thang, 'cham_chi'),
        'tuyChinh', exists (select 1 from giai_thuong_slot s where s.lop_id = l.id and s.thang = v_thang)),
      'roster', (select coalesce(jsonb_agg(jsonb_build_object('id', h.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs) order by h.ho_ten), '[]'::jsonb)
                 from _tg_hs h where h.lop_id = l.id),
      'metricsCuaHs', (select coalesce(jsonb_object_agg(m.hoc_sinh_id, jsonb_build_object(
                         'mt', m.mt, 'et', m.et, 'btvn', m.btvn,
                         'rankLopTruoc', m.rank_lop_truoc, 'rankLopNay', m.rank_lop_nay,
                         'rankKhoiTruoc', m.rank_khoi_truoc, 'rankKhoiNay', m.rank_khoi_nay,
                         'khoiTotal', m.khoi_total, 'tienBo', m.tien_bo,
                         'btvnHoanThanh', m.btvn_ht, 'btvnTong', m.btvn_tong)), '{}'::jsonb)
                       from _tg_m m where m.lop_id = l.id),
      'awards', (select jsonb_agg(jsonb_build_object(
                   'loaiGiai', lo.loai_giai, 'slotCount', public.fn_traogiai_slot_max(l.id, v_thang, lo.loai_giai),
                   'slots', (select coalesce(jsonb_agg(jsonb_build_object(
                               'slotIndex', s.slot_index, 'hocSinhId', s.hoc_sinh_id,
                               'hoTen', coalesce((select h.ho_ten from _tg_hs h where h.lop_id = l.id and h.hoc_sinh_id = s.hoc_sinh_id),
                                                 (select hs.ho_ten from hoc_sinh hs where hs.id = s.hoc_sinh_id), '?'),
                               'maHs', (select hs.ma_hs from hoc_sinh hs where hs.id = s.hoc_sinh_id),
                               'confirmed', s.confirmed, 'giaiThuongId', s.giai_thuong_id) order by s.slot_index), '[]'::jsonb)
                             from _tg_slot s where s.lop_id = l.id and s.loai_giai = lo.loai_giai)
                 ) order by lo.thu_tu)
                 from (values ('xuat_sac', 1), ('tien_bo', 2), ('cham_chi', 3)) lo(loai_giai, thu_tu))
    ) as x
    from _tg_lop l
    left join giai_thuong_lop_thang lt on lt.lop_id = l.id and lt.thang = v_thang
  ) t;

  select jsonb_build_object(
    'soLop', (select count(*) from _tg_lop),
    'tongSlot', (select coalesce(sum(public.fn_traogiai_tong_slot(l.id, v_thang)), 0) from _tg_lop l),
    'daXacNhan', (select count(*) from _tg_da),
    'lopDuSlot', (select count(*) from _tg_lop l where (select count(*) from _tg_da d where d.lop_id = l.id) >= public.fn_traogiai_tong_slot(l.id, v_thang)),
    'lopHoanThanh', (select count(*) from _tg_lop l join giai_thuong_lop_thang lt on lt.lop_id = l.id and lt.thang = v_thang and lt.hoan_thanh_at is not null),
    'daCongBo', (select count(*) from _tg_da where cong_bo_at is not null)
  ) into v_summary;

  select coalesce(jsonb_agg(distinct khoi), '[]'::jsonb) into v_khoi from lop where trang_thai = 'dang_hoc' and khoi is not null;

  return jsonb_build_object('ym', p_ym, 'summary', v_summary, 'khoiOpts', v_khoi, 'lops', v_lops);
end $$;
grant execute on function public.fn_traogiai_thang(text, text) to authenticated;

-- ── Trigger 3/2/1 cứng → đọc cấu hình. CHỈ chạy được khi role hiện tại sở hữu giai_thuong (DB thật: postgres). ──
do $do$
begin
  if (select pg_get_userbyid(relowner) from pg_class where oid = 'public.giai_thuong'::regclass) = current_user then
    execute $fn$
      create or replace function public.giai_thuong_check_slot() returns trigger language plpgsql as $body$
      declare max_slot int; hien_co int;
      begin
        max_slot := public.fn_traogiai_slot_max(new.lop_id, new.thang, new.loai_giai);
        select count(*) into hien_co from giai_thuong where thang = new.thang and lop_id = new.lop_id and loai_giai = new.loai_giai;
        if hien_co >= max_slot then
          raise exception 'Lớp % tháng % đã đủ % slot "%"', new.lop_id, new.thang, max_slot, new.loai_giai;
        end if;
        return new;
      end $body$
    $fn$;
  else
    raise notice 'giai_thuong thuộc %, role % không thay được trigger 3/2/1. CEO dán tay qua SQL Editor (postgres): xem cuối file 202609091631.',
      (select pg_get_userbyid(relowner) from pg_class where oid = 'public.giai_thuong'::regclass), current_user;
  end if;
end $do$;

-- ── ĐOẠN DÁN TAY (SQL Editor, role postgres) — chỉ khi DO block trên bỏ qua ──────────────────────────
-- create or replace function public.giai_thuong_check_slot() returns trigger language plpgsql as $body$
-- declare max_slot int; hien_co int;
-- begin
--   max_slot := public.fn_traogiai_slot_max(new.lop_id, new.thang, new.loai_giai);
--   select count(*) into hien_co from giai_thuong where thang = new.thang and lop_id = new.lop_id and loai_giai = new.loai_giai;
--   if hien_co >= max_slot then
--     raise exception 'Lớp % tháng % đã đủ % slot "%"', new.lop_id, new.thang, max_slot, new.loai_giai;
--   end if;
--   return new;
-- end $body$;
