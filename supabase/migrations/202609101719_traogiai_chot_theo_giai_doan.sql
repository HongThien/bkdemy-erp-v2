-- ============================================================================
-- 202609101719 — TRAO GIẢI: CHỐT THEO GIAI ĐOẠN từng giải trong lớp (CEO 10/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO): "Chốt riêng giải Xuất sắc. Chốt xong mới tính những HS còn lại để xếp Tiến bộ, rồi chốt Tiến bộ
--   xong mới chốt Chăm chỉ." Ca lộ ra: em đứng thứ 3 Xuất sắc mà lớp chỉ chốt 2 → em đó điểm cao nhưng không hiện ở
--   đâu nữa (đề xuất song song 1659 hoặc tham lam 1631 đều sai bản chất: pool Tiến bộ phải tính SAU KHI Xuất sắc chốt).
-- THIẾT KẾ:
--   · Bảng mới `giai_thuong_lop_giai` (lop_id, thang, loai_giai, chot_at, chot_boi) — có dòng = giải đó ĐÃ CHỐT (§1.5).
--   · Giải "đã chốt" = có dòng HOẶC lớp đặt 0 slot cho giải đó (bỏ qua giai đoạn).
--   · Giải "đang xét" = giải đầu tiên theo thứ tự Xuất sắc → Tiến bộ → Chăm chỉ chưa chốt; các giải sau = "chờ".
--   · fn_traogiai_thang chỉ ĐỀ XUẤT cho giải đang xét; pool = HS chưa có giải nào (đã chốt Xuất sắc thì rời pool).
--   · xác nhận / bỏ / đổi người chỉ cho giải đang xét (bỏ xác nhận cho phép cả giải "chờ" để dọn dòng cũ trước 10/09).
--   · Chốt giải cuối cùng ⇒ tự ghi giai_thuong_lop_thang.hoan_thanh_at (lớp hoàn thành = mọi giải đã chốt).
--     Mở lại giải = chỉ được mở giải CHỐT SAU CÙNG (giải sau nó chưa chốt), và xoá dấu hoàn thành lớp.
--   · Không đụng "Chốt kết quả tháng" (công bố) và slot tuỳ chỉnh (1631).
-- MẤT GÌ (Luật xoá): không. Tạo bảng mới + replace hàm. 24 giải tháng 8 CEO đã chốt vẫn nguyên (chưa có dòng chốt giải
--   nào ⇒ mọi lớp đứng ở giai đoạn Xuất sắc, các slot đã xác nhận vẫn hiện).
-- ============================================================================

create table if not exists giai_thuong_lop_giai (
  lop_id     uuid not null references lop(id),
  thang      date not null,
  loai_giai  text not null check (loai_giai in ('xuat_sac', 'tien_bo', 'cham_chi')),
  chot_at    timestamptz not null default now(),
  chot_boi   uuid references nhan_su(id),
  primary key (lop_id, thang, loai_giai)
);
alter table giai_thuong_lop_giai enable row level security;
drop policy if exists giai_thuong_lop_giai_member_all on giai_thuong_lop_giai;
create policy giai_thuong_lop_giai_member_all on giai_thuong_lop_giai for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on giai_thuong_lop_giai to authenticated;

create or replace function public.fn_traogiai_giai_da_chot(p_lop uuid, p_thang date, p_loai text)
returns boolean language sql stable as $$
  select exists (select 1 from giai_thuong_lop_giai g where g.lop_id = p_lop and g.thang = p_thang and g.loai_giai = p_loai)
      or public.fn_traogiai_slot_max(p_lop, p_thang, p_loai) = 0
$$;
-- Giải đang xét = giải đầu tiên chưa chốt theo thứ tự; NULL = lớp đã chốt hết
create or replace function public.fn_traogiai_giai_dang_xet(p_lop uuid, p_thang date)
returns text language sql stable as $$
  select l from unnest(array['xuat_sac', 'tien_bo', 'cham_chi']) with ordinality as t(l, o)
  where not public.fn_traogiai_giai_da_chot(p_lop, p_thang, l) order by o limit 1
$$;

-- ── Chốt 1 giải của lớp (phải đúng giải đang xét). Chốt giải cuối ⇒ lớp hoàn thành. ──
create or replace function public.fn_traogiai_chot_giai(p_ym text, p_lop uuid, p_loai text)
returns void language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_dang text;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  v_thang := (p_ym || '-01')::date;
  v_dang := public.fn_traogiai_giai_dang_xet(p_lop, v_thang);
  if v_dang is null then raise exception 'Lớp đã chốt đủ 3 giải.'; end if;
  if v_dang <> p_loai then raise exception 'Phải chốt giải "%" trước.', v_dang; end if;
  insert into giai_thuong_lop_giai (lop_id, thang, loai_giai, chot_boi) values (p_lop, v_thang, p_loai, v_me)
  on conflict do nothing;
  if public.fn_traogiai_giai_dang_xet(p_lop, v_thang) is null then
    insert into giai_thuong_lop_thang (lop_id, thang, hoan_thanh_at, hoan_thanh_boi) values (p_lop, v_thang, now(), v_me)
    on conflict (lop_id, thang) do update set hoan_thanh_at = now(), hoan_thanh_boi = excluded.hoan_thanh_boi;
  end if;
end $$;
grant execute on function public.fn_traogiai_chot_giai(text, uuid, text) to authenticated;

-- ── Mở lại 1 giải: chỉ giải chốt SAU CÙNG (giải sau nó chưa chốt). Xoá dấu hoàn thành lớp. ──
create or replace function public.fn_traogiai_mo_lai_giai(p_ym text, p_lop uuid, p_loai text)
returns void language plpgsql as $$
declare v_thang date; v_sau text;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  v_thang := (p_ym || '-01')::date;
  if not exists (select 1 from giai_thuong_lop_giai where lop_id = p_lop and thang = v_thang and loai_giai = p_loai) then return; end if;
  if exists (select 1 from giai_thuong g where g.lop_id = p_lop and g.thang = v_thang and g.cong_bo_at is not null) then
    raise exception 'Tháng này đã công bố kết quả — không mở lại được.';
  end if;
  -- giải đứng SAU p_loai mà đã chốt (có dòng) ⇒ phải mở giải đó trước
  select l into v_sau from unnest(array['xuat_sac', 'tien_bo', 'cham_chi']) with ordinality as t(l, o)
  where o > (select o from unnest(array['xuat_sac', 'tien_bo', 'cham_chi']) with ordinality as u(l, o) where u.l = p_loai)
    and exists (select 1 from giai_thuong_lop_giai g where g.lop_id = p_lop and g.thang = v_thang and g.loai_giai = t.l)
  order by o desc limit 1;
  if v_sau is not null then raise exception 'Phải mở lại giải "%" trước (chốt sau).', v_sau; end if;
  delete from giai_thuong_lop_giai where lop_id = p_lop and thang = v_thang and loai_giai = p_loai;
  delete from giai_thuong_lop_thang where lop_id = p_lop and thang = v_thang;
end $$;
grant execute on function public.fn_traogiai_mo_lai_giai(text, uuid, text) to authenticated;

-- ── Xác nhận: chỉ giải ĐANG XÉT ──
create or replace function public.fn_traogiai_xac_nhan(p_ym text, p_lop uuid, p_hs uuid, p_loai text)
returns uuid language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_mon text; v_id uuid; v_max int; v_da int; v_dang text;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  v_thang := (p_ym || '-01')::date;
  v_dang := public.fn_traogiai_giai_dang_xet(p_lop, v_thang);
  if v_dang is null then raise exception 'Lớp đã chốt đủ 3 giải — mở lại giải trước khi sửa.'; end if;
  if v_dang <> p_loai then
    if public.fn_traogiai_giai_da_chot(p_lop, v_thang, p_loai) then raise exception 'Giải này đã chốt — mở lại trước khi sửa.';
    else raise exception 'Chưa tới lượt giải này — chốt giải "%" trước.', v_dang; end if;
  end if;
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
  exception when unique_violation then
    raise exception 'Học sinh này đã được trao 1 giải khác trong tháng — tải lại trang để xem dữ liệu mới nhất.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_traogiai_xac_nhan(text, uuid, uuid, text) to authenticated;

-- ── Bỏ xác nhận / đổi người: giải chưa chốt (kể cả giải "chờ" — để dọn dòng chốt theo luồng cũ trước 10/09) ──
create or replace function public.fn_traogiai_bo_xac_nhan(p_id uuid)
returns void language plpgsql as $$
declare g record;
begin
  select * into g from giai_thuong where id = p_id;
  if g is null then return; end if;
  if g.cong_bo_at is not null then raise exception 'Giải đã công bố ra app PH/HS — không bỏ xác nhận được.'; end if;
  if exists (select 1 from giai_thuong_lop_giai x where x.lop_id = g.lop_id and x.thang = g.thang and x.loai_giai = g.loai_giai) then
    raise exception 'Giải này đã chốt — mở lại trước khi sửa.';
  end if;
  delete from giai_thuong where id = p_id;
end $$;
grant execute on function public.fn_traogiai_bo_xac_nhan(uuid) to authenticated;

create or replace function public.fn_traogiai_doi_nguoi(p_id uuid, p_hs_moi uuid)
returns uuid language plpgsql as $$
declare g record;
begin
  select * into g from giai_thuong where id = p_id;
  if g is null then raise exception 'Slot này không còn (có thể người khác vừa bỏ xác nhận) — tải lại trang.'; end if;
  if g.cong_bo_at is not null then raise exception 'Giải đã công bố ra app PH/HS — không đổi người được.'; end if;
  if exists (select 1 from giai_thuong_lop_giai x where x.lop_id = g.lop_id and x.thang = g.thang and x.loai_giai = g.loai_giai) then
    raise exception 'Giải này đã chốt — mở lại trước khi sửa.';
  end if;
  delete from giai_thuong where id = p_id;
  return public.fn_traogiai_xac_nhan(to_char(g.thang, 'YYYY-MM'), g.lop_id, p_hs_moi, g.loai_giai);
end $$;
grant execute on function public.fn_traogiai_doi_nguoi(uuid, uuid) to authenticated;

-- ── Đặt slot: không đổi số slot của giải ĐÃ CHỐT ──
create or replace function public.fn_traogiai_dat_slot(p_ym text, p_lop uuid, p_xuat_sac int, p_tien_bo int, p_cham_chi int)
returns void language plpgsql as $$
declare v_me uuid := public.fn_traogiai_actor(); v_thang date; v_loai text; v_muon int; v_da int;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự đang đăng nhập.'; end if;
  v_thang := (p_ym || '-01')::date;
  if p_xuat_sac is null or p_tien_bo is null or p_cham_chi is null then raise exception 'Thiếu số slot.'; end if;
  if least(p_xuat_sac, p_tien_bo, p_cham_chi) < 0 or greatest(p_xuat_sac, p_tien_bo, p_cham_chi) > 6 then raise exception 'Mỗi loại 0–6 slot.'; end if;
  if p_xuat_sac + p_tien_bo + p_cham_chi not between 1 and 6 then raise exception 'Tổng slot phải từ 1 đến 6 (ngân sách 6 giải/lớp/tháng).'; end if;
  foreach v_loai in array array['xuat_sac', 'tien_bo', 'cham_chi'] loop
    v_muon := case v_loai when 'xuat_sac' then p_xuat_sac when 'tien_bo' then p_tien_bo else p_cham_chi end;
    if v_muon <> public.fn_traogiai_slot_max(p_lop, v_thang, v_loai)
       and exists (select 1 from giai_thuong_lop_giai g where g.lop_id = p_lop and g.thang = v_thang and g.loai_giai = v_loai) then
      raise exception 'Giải "%" đã chốt — mở lại trước khi đổi số slot.', v_loai;
    end if;
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

  -- Slot = đã chốt (theo duyet_at) + đề xuất CHỈ cho giải ĐANG XÉT của lớp (CEO 10/09: chốt Xuất sắc xong mới xếp
  -- Tiến bộ từ các em còn lại, rồi mới Chăm chỉ). HS đã chốt giải nào thì rời pool.
  drop table if exists _tg_slot;
  create temp table _tg_slot (lop_id uuid, loai_giai text, hoc_sinh_id uuid, giai_thuong_id uuid, confirmed boolean, slot_index int, cong_bo_at timestamptz) on commit drop;
  insert into _tg_slot
    select d.lop_id, d.loai_giai, d.hoc_sinh_id, d.id, true,
      (row_number() over (partition by d.lop_id, d.loai_giai order by d.duyet_at) - 1)::int, d.cong_bo_at
    from _tg_da d;
  foreach v_loai in array array['xuat_sac', 'tien_bo', 'cham_chi'] loop
    insert into _tg_slot
      select r.lop_id, r.loai_giai, r.hoc_sinh_id, null, false, (c.da_co + r.rk2 - 1)::int, null
      from (
        select x.*, row_number() over (partition by x.lop_id order by x.rk) as rk2
        from _tg_rank x
        where x.loai_giai = v_loai
          -- chỉ loại HS đã CHỐT giải (confirmed); HS mới được ĐỀ XUẤT ở giải khác vẫn hiện — người duyệt chọn
          and not exists (select 1 from _tg_slot s where s.lop_id = x.lop_id and s.hoc_sinh_id = x.hoc_sinh_id and s.confirmed)
      ) r
      join (select l.id as lop_id, (select count(*) from _tg_slot s where s.lop_id = l.id and s.loai_giai = v_loai and s.confirmed)::int as da_co,
                   public.fn_traogiai_slot_max(l.id, v_thang, v_loai) as slot_count
            from _tg_lop l
            where public.fn_traogiai_giai_dang_xet(l.id, v_thang) = v_loai) c
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
      'giaiDangXet', public.fn_traogiai_giai_dang_xet(l.id, v_thang),
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
                   'chotAt', (select g.chot_at from giai_thuong_lop_giai g where g.lop_id = l.id and g.thang = v_thang and g.loai_giai = lo.loai_giai),
                   'trangThai', case when public.fn_traogiai_giai_da_chot(l.id, v_thang, lo.loai_giai) then 'da_chot'
                                     when public.fn_traogiai_giai_dang_xet(l.id, v_thang) = lo.loai_giai then 'dang_xet'
                                     else 'cho' end,
                   'slots', (select coalesce(jsonb_agg(jsonb_build_object(
                               'slotIndex', s.slot_index, 'hocSinhId', s.hoc_sinh_id,
                               'hoTen', coalesce((select h.ho_ten from _tg_hs h where h.lop_id = l.id and h.hoc_sinh_id = s.hoc_sinh_id),
                                                 (select hs.ho_ten from hoc_sinh hs where hs.id = s.hoc_sinh_id), '?'),
                               'maHs', (select hs.ma_hs from hoc_sinh hs where hs.id = s.hoc_sinh_id),
                               'confirmed', s.confirmed, 'giaiThuongId', s.giai_thuong_id, 'congBoAt', s.cong_bo_at) order by s.slot_index), '[]'::jsonb)
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
