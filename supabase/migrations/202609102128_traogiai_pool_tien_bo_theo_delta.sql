-- ============================================================================
-- 202609102128 — TRAO GIẢI: nới pool "Tiến bộ" — mọi HS có MT cả 2 tháng đều vào pool (CEO 10/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: bản 202609091548/1631/1719 pool Tiến bộ = "cả 2 hạng đều tăng" (ΔLớp≥0 AND ΔKhối≥0 AND tổng>0).
--   Ca lộ: 7S3 tháng 8 — em thứ 3 Xuất sắc (Nguyễn Văn Anh Quân, MT 7.25) chốt Xuất sắc 2/3 xong thì rơi
--   khỏi mọi pool vì tụt hạng nhẹ (lớp 3→3, khối 15→17). CEO: "A cho đơn giản đi, t chọn thủ công mà" —
--   nới pool về đúng chữ 22/08 "cả 2 đều tăng NHIỀU NHẤT trong lớp" = XẾP HẠNG theo Δ, không LOẠI em tụt hạng.
--   Slot_max ràng buộc phía trên; CEO chỉnh người trong dropdown khi cần.
-- MẤT GÌ (Luật xoá): không. Replace 1 hàm.
-- ============================================================================

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
      -- Pool = mọi HS có MT cả 2 tháng (chưa có giải khác), xếp theo Δ giảm dần; slot_max ràng buộc trên,
      -- CEO chọn thủ công trong dropdown khi cần bỏ em tụt hạng (CEO chốt 10/09 — trả về luật gốc 22/08).
      and tien_bo is not null
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
