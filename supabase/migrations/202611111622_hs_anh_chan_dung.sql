-- ẢNH CHÂN DUNG HỌC SINH cho ảnh vinh danh đăng FB (Thùy 11/11: "cần có chỗ upload ảnh HS lên và ghép vào").
-- KHÔNG dùng hoc_sinh.anh_url: đó là avatar em tự chọn trên app (thẻ cầu thủ, giấy khen…), ghi đè sẽ đổi avatar app của em.
-- Không phải dữ liệu học tập ⇒ không nhãn môn (§1.6). Chưa có ảnh = KHÔNG có dòng (§1.5). Một em một ảnh hiện hành;
-- tải ảnh mới = cập nhật dòng, file cũ để nguyên trong bucket (Luật xoá).
create table if not exists public.hoc_sinh_anh_chan_dung (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id),
  url text not null,
  cap_nhat_boi uuid references public.nhan_su(id) default public.current_nhan_su_id(),
  cap_nhat_at timestamptz not null default now()
);
alter table public.hoc_sinh_anh_chan_dung enable row level security;
drop policy if exists hs_anh_chan_dung_member_all on public.hoc_sinh_anh_chan_dung;
create policy hs_anh_chan_dung_member_all on public.hoc_sinh_anh_chan_dung
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
revoke all on public.hoc_sinh_anh_chan_dung from anon;

-- fn_vinh_danh_hs (mig 202611111437) trả thêm anhChanDung — ưu tiên khi ghép; anhUrl (avatar app) chỉ còn là dự phòng.
create or replace function public.fn_vinh_danh_hs(p_hs uuid, p_mon text, p_ym text)
returns jsonb
language plpgsql
stable
as $$
declare
  v_lop uuid; v_lop_ten text; v_khoi text;
  v_den timestamptz; v_tu date; v_den_mt date;
  v_tb numeric; v_rk_khoi int; v_tot_khoi int; v_rk_lop int; v_tot_lop int;
  v_ky text; v_dat int; v_do int;
  v_ho_ten text; v_anh text; v_ma_hs text; v_giai text;
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;

  select h.ho_ten, h.anh_url, h.ma_hs into v_ho_ten, v_anh, v_ma_hs from hoc_sinh h where h.id = p_hs;
  if v_ho_ten is null then raise exception 'Không thấy học sinh.'; end if;

  select l.id, l.ten_lop, l.khoi into v_lop, v_lop_ten, v_khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;

  v_tu := (p_ym || '-25')::date;
  v_den_mt := ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date;   -- < ngày 11/(M+1)
  v_den := least(now(), make_timestamptz(extract(year from v_den_mt)::int, extract(month from v_den_mt)::int,
                                         extract(day from v_den_mt)::int, 0, 0, 0, 'Asia/Ho_Chi_Minh'));

  if v_lop is not null then
    select r.tb, r.rank_now, r.rank_total into v_tb, v_rk_khoi, v_tot_khoi
      from public.fn_rank_diem_mt_lop(v_lop, p_mon, p_ym) r where r.hoc_sinh_id = p_hs;
    select r.rank_now, r.rank_total into v_rk_lop, v_tot_lop
      from public.fn_rank_diem_mt(p_hs, array[v_lop], p_mon, p_ym) r;
  end if;

  select kt.ten into v_ky
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
   where dt.hoc_sinh_id = p_hs and dt.diem is not null and b.ngay >= v_tu and b.ngay < v_den_mt
   order by b.ngay desc limit 1;

  with m as (
    select x.nut, x.muc
      from public._mastery_lan_cap(public._mastery_bdm_bat(), array[p_hs], false, v_den - interval '30 days', v_den,
                                   array['dang'], 5, 5, 3) x
     where x.cap = 'dang'
  ), d as (
    select m.* from m join public._tq_dang_info(p_mon, (select array_agg(distinct nut) from m)) di on di.ma_dang = m.nut
  )
  select count(*) filter (where muc = 'dat'), count(*) into v_dat, v_do from d;

  select g.loai_giai into v_giai from giai_thuong g
   where g.hoc_sinh_id = p_hs and g.mon = p_mon and g.thang = (p_ym || '-01')::date
   order by g.duyet_at limit 1;

  return jsonb_build_object(
    'hoTen', v_ho_ten, 'anhChanDung', (select a.url from hoc_sinh_anh_chan_dung a where a.hoc_sinh_id = p_hs), 'maHs', v_ma_hs, 'anhUrl', v_anh, 'mon', p_mon, 'ym', p_ym,
    'lopId', v_lop, 'lop', v_lop_ten, 'khoi', v_khoi, 'loaiGiai', v_giai,
    'kyThi', v_ky, 'diemTest', round(v_tb, 1),
    'hangLop', v_rk_lop, 'tongLop', v_tot_lop, 'hangKhoi', v_rk_khoi, 'tongKhoi', v_tot_khoi,
    'dangDat', v_dat, 'dangDo', v_do,
    'masteryPct', case when v_do > 0 then round(100.0 * v_dat / v_do) end,
    'mocMastery', v_den
  );
end
$$;

