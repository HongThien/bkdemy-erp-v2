-- ============================================================================
-- 202609091431 — TRAO GIẢI THÁNG: đưa toàn bộ tính toán xuống Postgres (§2.0 CLAUDE.md)
-- ----------------------------------------------------------------------------
-- VÌ SAO: nhánh feat/trao-giai (22–24/08) viết TRƯỚC luật §2.0 (CEO chốt 30/08) — lib/traogiai.ts
-- kéo gami_grades/gami_session_problems/gami_elo_history/buoi_hoc_hs về browser rồi tự cộng/chia/
-- xếp hạng (~10 query × 46 lớp mỗi lần mở màn). File này chuyển NGUYÊN 3 luật xếp hạng (CEO chốt
-- 22/08, KHÔNG đổi) thành 1 hàm đọc + 6 hàm ghi transactional; client chỉ gọi rpc + format nhãn.
--
-- 3 LUẬT XẾP HẠNG (giữ nguyên tinh thần 22/08, chỉ đổi NGUỒN MT):
--   · Xuất sắc: điểm MT ↓ → ET(%) TB tháng ↓ → BTVN(%) TB tháng ↓.
--     ⚠ MT lấy từ `fn_rank_diem_mt_lop(...).tb` (điểm thang 10 trong diem_thi, cửa sổ 25→10 tháng sau)
--     — đó là NGUỒN CÔNG THỨC DUY NHẤT của MT trên main từ 31/08 (fn_diem_thi_tinh + rank khối), thay
--     cho bản 22/08 tự tính % từ gami_grades phase='mt'.
--   · Tiến bộ : Σ delta Elo (gami_elo_history phase='et') của các buổi thường trong tháng ↓.
--   · Chăm chỉ: số buổi (có giao BTVN + HS có mặt) mà HS CÓ ≥1 dòng chấm BTVN ↓ → BTVN(%) TB ↓.
--   ET%/BTVN% = TB CÁC BUỔI của (Σđiểm / (100 × số câu ĐÃ CHẤM của chính em đó)) — trọng số ngang
--   nhau giữa buổi, y hệt `_ret_acc` trong fn_recompute_exp_thang (không thêm bản công thức thứ 2).
--   Thứ tự ưu tiên Xuất sắc > Tiến bộ > Chăm chỉ; HS đã CHỐT bất kỳ giải nào bị loại khỏi pool đề
--   xuất của mọi giải còn lại (khớp UNIQUE(thang, mon, hoc_sinh_id)). "Chưa đo" = NULL, xếp cuối
--   (nulls last) và KHÔNG được đề xuất khi không có chỉ số nào của giải đó (§1.5: chưa-đo ≠ 0).
--
-- GHI: mọi hàm ghi là SECURITY INVOKER → RLS `giai_thuong_member_all` (la_thanh_vien) vẫn gác.
--   Khoá "Hoàn thành lớp" được kiểm Ở DB trong cùng transaction (không tin state UI). Actor =
--   tai_khoan.nhan_su_id (fn_tuqua_actor) hoặc khớp email (current_nhan_su_id) — không nhận từ client.
--
-- MẤT GÌ (Luật xoá): không. Chỉ create or replace function + grant execute.
-- ============================================================================

-- ── ĐỌC: toàn bộ màn Trao giải cho 1 tháng (mọi lớp đang học, lọc khối tuỳ chọn) ──────────────
create or replace function public.fn_traogiai_thang(p_ym text, p_khoi text default null)
returns jsonb language plpgsql as $$
declare
  v_tu date; v_den date; v_thang date;
  v_lops jsonb; v_summary jsonb; v_khoi jsonb; v_loai text; v_slot_count int;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  v_thang := (p_ym || '-01')::date; v_tu := v_thang; v_den := (v_thang + interval '1 month')::date;

  -- Lớp đang học (lọc khối nếu có)
  drop table if exists _tg_lop;
  create temp table _tg_lop on commit drop as
    select l.id, l.ten_lop, l.mon, l.khoi
    from lop l where l.trang_thai = 'dang_hoc' and (p_khoi is null or p_khoi = '' or l.khoi = p_khoi);

  -- Roster đang học của từng lớp
  drop table if exists _tg_hs;
  create temp table _tg_hs on commit drop as
    select hl.lop_id, hl.hoc_sinh_id, hs.ho_ten, hs.ma_hs
    from hoc_sinh_lop hl join _tg_lop l on l.id = hl.lop_id join hoc_sinh hs on hs.id = hl.hoc_sinh_id
    where hl.trang_thai = 'dang_hoc';

  -- Buổi thường, chưa huỷ, trong tháng
  drop table if exists _tg_buoi;
  create temp table _tg_buoi on commit drop as
    select b.id, b.lop_id from buoi_hoc b join _tg_lop l on l.id = b.lop_id
    where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= v_tu and b.ngay < v_den;

  -- % theo (hs × buổi × phase) trên câu ĐÃ CHẤM của chính em đó
  drop table if exists _tg_pct;
  create temp table _tg_pct on commit drop as
    select g.hoc_sinh_id, sp.buoi_hoc_id, b.lop_id, sp.phase, sum(g.points) / (count(*) * 100.0) as pct
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join _tg_buoi b on b.id = sp.buoi_hoc_id
    group by g.hoc_sinh_id, sp.buoi_hoc_id, b.lop_id, sp.phase;

  -- Buổi có GIAO BTVN (tồn tại problem phase='btvn') × HS có mặt → mẫu số "Chăm chỉ"
  drop table if exists _tg_btvn_giao;
  create temp table _tg_btvn_giao on commit drop as
    select r.hoc_sinh_id, r.buoi_hoc_id, b.lop_id
    from buoi_hoc_hs r join _tg_buoi b on b.id = r.buoi_hoc_id
    where r.diem_danh = 'co_mat'
      and exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = r.buoi_hoc_id and sp.phase = 'btvn');

  -- Elo ET trong tháng (1 dòng/HS/buổi)
  drop table if exists _tg_elo;
  create temp table _tg_elo on commit drop as
    select h.hoc_sinh_id, h.buoi_hoc_id, b.lop_id, h.delta, h.elo_before, h.elo_after, h.created_at
    from gami_elo_history h join _tg_buoi b on b.id = h.buoi_hoc_id
    where h.phase = 'et';

  -- MT: nguồn duy nhất = fn_rank_diem_mt_lop (điểm thang 10, cửa sổ 25→10)
  drop table if exists _tg_mt;
  create temp table _tg_mt on commit drop as
    select l.id as lop_id, r.hoc_sinh_id, r.tb
    from _tg_lop l cross join lateral public.fn_rank_diem_mt_lop(l.id, l.mon, p_ym) r;

  -- Metric per (lớp × HS) — NULL = chưa đo
  drop table if exists _tg_m;
  create temp table _tg_m on commit drop as
    select h.lop_id, h.hoc_sinh_id, h.ho_ten, h.ma_hs,
      (select mt.tb from _tg_mt mt where mt.lop_id = h.lop_id and mt.hoc_sinh_id = h.hoc_sinh_id limit 1) as mt,
      (select avg(p.pct) from _tg_pct p where p.hoc_sinh_id = h.hoc_sinh_id and p.lop_id = h.lop_id and p.phase = 'et') as et,
      (select avg(p.pct) from _tg_pct p where p.hoc_sinh_id = h.hoc_sinh_id and p.lop_id = h.lop_id and p.phase = 'btvn') as btvn,
      (select sum(e.delta)::int from _tg_elo e where e.hoc_sinh_id = h.hoc_sinh_id and e.lop_id = h.lop_id) as elo_delta,
      (select e.elo_before from _tg_elo e where e.hoc_sinh_id = h.hoc_sinh_id and e.lop_id = h.lop_id order by e.created_at asc limit 1) as elo_before,
      (select e.elo_after from _tg_elo e where e.hoc_sinh_id = h.hoc_sinh_id and e.lop_id = h.lop_id order by e.created_at desc limit 1) as elo_after,
      (select count(*)::int from _tg_elo e where e.hoc_sinh_id = h.hoc_sinh_id and e.lop_id = h.lop_id) as elo_buoi,
      (select count(*)::int from _tg_btvn_giao g where g.hoc_sinh_id = h.hoc_sinh_id and g.lop_id = h.lop_id) as btvn_tong,
      (select count(*)::int from _tg_btvn_giao g where g.hoc_sinh_id = h.hoc_sinh_id and g.lop_id = h.lop_id
         and exists (select 1 from _tg_pct p where p.hoc_sinh_id = g.hoc_sinh_id and p.buoi_hoc_id = g.buoi_hoc_id and p.phase = 'btvn')) as btvn_ht
    from _tg_hs h;

  -- Giải đã chốt của tháng
  drop table if exists _tg_da;
  create temp table _tg_da on commit drop as
    select g.id, g.lop_id, g.hoc_sinh_id, g.loai_giai, g.duyet_at, g.cong_bo_at
    from giai_thuong g join _tg_lop l on l.id = g.lop_id where g.thang = v_thang;

  -- Xếp hạng từng giải (chỉ HS chưa chốt giải nào; chỉ HS có ít nhất 1 chỉ số của giải đó)
  drop table if exists _tg_rank;
  create temp table _tg_rank on commit drop as
    select lop_id, hoc_sinh_id, 'xuat_sac'::text as loai_giai,
      row_number() over (partition by lop_id order by mt desc nulls last, et desc nulls last, btvn desc nulls last, ho_ten) as rk
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      and (mt is not null or et is not null or btvn is not null)
    union all
    select lop_id, hoc_sinh_id, 'tien_bo',
      row_number() over (partition by lop_id order by elo_delta desc, ho_ten)
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      and elo_buoi > 0
    union all
    select lop_id, hoc_sinh_id, 'cham_chi',
      row_number() over (partition by lop_id order by btvn_ht desc, btvn desc nulls last, ho_ten)
    from _tg_m m
    where not exists (select 1 from _tg_da d where d.lop_id = m.lop_id and d.hoc_sinh_id = m.hoc_sinh_id)
      and btvn_tong > 0;

  -- Slot = (đã chốt, theo duyet_at) + (đề xuất lấp phần còn trống). Số slot CỐ ĐỊNH 3/2/1 (CEO chốt).
  -- Đề xuất THAM LAM theo ưu tiên Xuất sắc > Tiến bộ > Chăm chỉ: 1 HS chỉ được ĐỀ XUẤT ở đúng 1 giải
  -- (khớp UNIQUE ở DB — không bày ra một đề xuất mà bấm xác nhận là chắc chắn lỗi trùng).
  drop table if exists _tg_slot;
  create temp table _tg_slot (lop_id uuid, loai_giai text, hoc_sinh_id uuid, giai_thuong_id uuid, confirmed boolean, slot_index int) on commit drop;
  insert into _tg_slot
    select d.lop_id, d.loai_giai, d.hoc_sinh_id, d.id, true,
      (row_number() over (partition by d.lop_id, d.loai_giai order by d.duyet_at) - 1)::int
    from _tg_da d;
  for v_loai, v_slot_count in select * from (values ('xuat_sac', 3), ('tien_bo', 2), ('cham_chi', 1)) v(loai_giai, slot_count) loop
    insert into _tg_slot
      select r.lop_id, r.loai_giai, r.hoc_sinh_id, null, false, (c.da_co + r.rk2 - 1)::int
      from (
        select x.*, row_number() over (partition by x.lop_id order by x.rk) as rk2
        from _tg_rank x
        where x.loai_giai = v_loai
          and not exists (select 1 from _tg_slot s where s.lop_id = x.lop_id and s.hoc_sinh_id = x.hoc_sinh_id)
      ) r
      join (select l.id as lop_id, (select count(*) from _tg_slot s where s.lop_id = l.id and s.loai_giai = v_loai and s.confirmed)::int as da_co from _tg_lop l) c
        on c.lop_id = r.lop_id
      where r.rk2 <= v_slot_count - c.da_co;
  end loop;

  select coalesce(jsonb_agg(x order by x->>'tenLop'), '[]'::jsonb) into v_lops from (
    select jsonb_build_object(
      'lopId', l.id, 'tenLop', l.ten_lop, 'mon', l.mon, 'khoi', l.khoi,
      'siSo', (select count(*) from _tg_hs h where h.lop_id = l.id),
      'hoanThanhAt', lt.hoan_thanh_at, 'hoanThanhBoi', lt.hoan_thanh_boi,
      'daXacNhan', (select count(*) from _tg_da d where d.lop_id = l.id),
      'daCongBo', (select count(*) from _tg_da d where d.lop_id = l.id and d.cong_bo_at is not null),
      'roster', (select coalesce(jsonb_agg(jsonb_build_object('id', h.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs) order by h.ho_ten), '[]'::jsonb)
                 from _tg_hs h where h.lop_id = l.id),
      'metricsCuaHs', (select coalesce(jsonb_object_agg(m.hoc_sinh_id, jsonb_build_object(
                         'mt', m.mt, 'et', m.et, 'btvn', m.btvn,
                         'eloDelta', m.elo_delta, 'eloBefore', m.elo_before, 'eloAfter', m.elo_after, 'eloBuoi', m.elo_buoi,
                         'btvnHoanThanh', m.btvn_ht, 'btvnTong', m.btvn_tong)), '{}'::jsonb)
                       from _tg_m m where m.lop_id = l.id),
      'awards', (select jsonb_agg(jsonb_build_object(
                   'loaiGiai', lo.loai_giai, 'slotCount', lo.slot_count,
                   'slots', (select coalesce(jsonb_agg(jsonb_build_object(
                               'slotIndex', s.slot_index, 'hocSinhId', s.hoc_sinh_id,
                               'hoTen', coalesce((select h.ho_ten from _tg_hs h where h.lop_id = l.id and h.hoc_sinh_id = s.hoc_sinh_id),
                                                 (select hs.ho_ten from hoc_sinh hs where hs.id = s.hoc_sinh_id), '?'),
                               'maHs', (select hs.ma_hs from hoc_sinh hs where hs.id = s.hoc_sinh_id),
                               'confirmed', s.confirmed, 'giaiThuongId', s.giai_thuong_id) order by s.slot_index), '[]'::jsonb)
                             from _tg_slot s where s.lop_id = l.id and s.loai_giai = lo.loai_giai)
                 ) order by lo.thu_tu)
                 from (values ('xuat_sac', 3, 1), ('tien_bo', 2, 2), ('cham_chi', 1, 3)) lo(loai_giai, slot_count, thu_tu))
    ) as x
    from _tg_lop l
    left join giai_thuong_lop_thang lt on lt.lop_id = l.id and lt.thang = v_thang
  ) t;

  select jsonb_build_object(
    'soLop', (select count(*) from _tg_lop),
    'tongSlot', (select count(*) from _tg_lop) * 6,
    'daXacNhan', (select count(*) from _tg_da),
    'lopDuSlot', (select count(*) from _tg_lop l where (select count(*) from _tg_da d where d.lop_id = l.id) >= 6),
    'lopHoanThanh', (select count(*) from _tg_lop l join giai_thuong_lop_thang lt on lt.lop_id = l.id and lt.thang = v_thang and lt.hoan_thanh_at is not null),
    'daCongBo', (select count(*) from _tg_da where cong_bo_at is not null)
  ) into v_summary;

  -- Khối có lớp đang học (cho filter) — KHÔNG phụ thuộc p_khoi
  select coalesce(jsonb_agg(distinct khoi), '[]'::jsonb) into v_khoi from lop where trang_thai = 'dang_hoc' and khoi is not null;

  return jsonb_build_object('ym', p_ym, 'summary', v_summary, 'khoiOpts', v_khoi, 'lops', v_lops);
end $$;
grant execute on function public.fn_traogiai_thang(text, text) to authenticated;

-- ── Helper nội bộ: actor + kiểm khoá lớp ──────────────────────────────────────────────────────
create or replace function public.fn_traogiai_actor()
returns uuid language sql stable as $$
  select coalesce(public.fn_tuqua_actor(), public.current_nhan_su_id())
$$;

create or replace function public.fn_traogiai_kiem_khoa(p_lop uuid, p_thang date)
returns void language plpgsql stable as $$
begin
  if exists (select 1 from giai_thuong_lop_thang where lop_id = p_lop and thang = p_thang and hoan_thanh_at is not null) then
    raise exception 'Lớp đã hoàn thành — bấm "Mở lại lớp" trước khi sửa.';
  end if;
end $$;

-- ── GHI mức SLOT ──────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_traogiai_xac_nhan(p_ym text, p_lop uuid, p_hs uuid, p_loai text)
returns uuid language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_mon text; v_id uuid;
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

create or replace function public.fn_traogiai_bo_xac_nhan(p_id uuid)
returns void language plpgsql as $$
declare g record;
begin
  select * into g from giai_thuong where id = p_id;
  if g is null then return; end if; -- đã bị người khác xoá: idempotent
  perform public.fn_traogiai_kiem_khoa(g.lop_id, g.thang);
  if g.cong_bo_at is not null then raise exception 'Giải đã công bố ra app PH/HS — không bỏ xác nhận được.'; end if;
  delete from giai_thuong where id = p_id;
end $$;
grant execute on function public.fn_traogiai_bo_xac_nhan(uuid) to authenticated;

-- Đổi người ở slot ĐÃ chốt = xoá dòng cũ + tạo dòng mới trong CÙNG transaction (giữ trạng thái đã xác nhận)
create or replace function public.fn_traogiai_doi_nguoi(p_id uuid, p_hs_moi uuid)
returns uuid language plpgsql as $$
declare g record;
begin
  select * into g from giai_thuong where id = p_id;
  if g is null then raise exception 'Slot này không còn (có thể người khác vừa bỏ xác nhận) — tải lại trang.'; end if;
  if g.cong_bo_at is not null then raise exception 'Giải đã công bố ra app PH/HS — không đổi người được.'; end if;
  perform public.fn_traogiai_kiem_khoa(g.lop_id, g.thang);
  delete from giai_thuong where id = p_id;
  return public.fn_traogiai_xac_nhan(to_char(g.thang, 'YYYY-MM'), g.lop_id, p_hs_moi, g.loai_giai);
end $$;
grant execute on function public.fn_traogiai_doi_nguoi(uuid, uuid) to authenticated;

-- ── GHI mức LỚP ───────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_traogiai_hoan_thanh_lop(p_ym text, p_lop uuid)
returns void language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor();
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  insert into giai_thuong_lop_thang (lop_id, thang, hoan_thanh_at, hoan_thanh_boi)
  values (p_lop, (p_ym || '-01')::date, now(), v_me)
  on conflict (lop_id, thang) do update set hoan_thanh_at = now(), hoan_thanh_boi = excluded.hoan_thanh_boi;
end $$;
grant execute on function public.fn_traogiai_hoan_thanh_lop(text, uuid) to authenticated;

create or replace function public.fn_traogiai_mo_lai_lop(p_ym text, p_lop uuid)
returns void language plpgsql as $$
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  insert into giai_thuong_lop_thang (lop_id, thang, hoan_thanh_at, hoan_thanh_boi)
  values (p_lop, (p_ym || '-01')::date, null, null)
  on conflict (lop_id, thang) do update set hoan_thanh_at = null, hoan_thanh_boi = null;
end $$;
grant execute on function public.fn_traogiai_mo_lai_lop(text, uuid) to authenticated;

-- ── GHI mức THÁNG: công bố MỌI giải chưa công bố của tháng (toàn trung tâm). Trả số dòng. ─────
create or replace function public.fn_traogiai_chot_thang(p_ym text)
returns integer language plpgsql as $$
declare n integer;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  update giai_thuong set cong_bo_at = now() where thang = (p_ym || '-01')::date and cong_bo_at is null;
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.fn_traogiai_chot_thang(text) to authenticated;
