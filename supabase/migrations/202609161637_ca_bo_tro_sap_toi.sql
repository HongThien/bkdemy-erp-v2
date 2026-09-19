-- Thùy 09-16: (1) "hệ thống tự ghép HS vào các ca bổ trợ" · (2) "1 tab hiện các ca đã có HS assign, ca nào bao nhiêu người
-- để dừng lại". Bổ trợ yếu = 1 buổi/1 HS (PLAN §0 mục 4) nên "ca" = NHÓM buổi cùng (môn, ngày, giờ bắt đầu, phòng, người dạy).
-- Sức chứa đặt trên lịch trực (null = không giới hạn) — tự ghép bỏ qua ca đã đầy; tab Ca bổ trợ hiện n/sức chứa.
alter table public.lich_truc_bo_tro add column if not exists suc_chua smallint check (suc_chua is null or suc_chua > 0);

-- Ca bổ trợ yếu sắp tới trong [p_tu, p_den]: buổi `mo` gộp theo (mon, ngay, gio, phong, nguoi) + số HS + tên HS + lịch trực khớp
-- (cùng môn/thứ/giờ bđ, còn hiệu lực) để lấy sức chứa. Tổng hợp ở Postgres (CLAUDE.md §2.0) — client chỉ render.
create or replace function public.fn_btyeu_ca_sap_toi(p_tu date default null, p_den date default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with kh as (
    select coalesce(p_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as tu,
           coalesce(p_den, (now() at time zone 'Asia/Ho_Chi_Minh')::date + 28) as den
  ),
  b as (
    select y.mon, bh.ngay, bh.gio_bat_dau, bh.gio_ket_thuc, bh.phong, bh.nguoi_day_tg,
           bh.id as buoi_id, hh.hoc_sinh_id, hs.ho_ten, hs.khoi, hh.diem_danh, y.id as case_id
    from buoi_hoc bh
    join buoi_hoc_hs hh on hh.buoi_hoc_id = bh.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh hs on hs.id = hh.hoc_sinh_id, kh
    where bh.loai = 'bo_tro_yeu' and bh.trang_thai = 'mo' and bh.ngay between kh.tu and kh.den
  ),
  g as (
    select mon, ngay, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg,
           count(*)::int as so_hs,
           jsonb_agg(jsonb_build_object('buoi_id', buoi_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'khoi', khoi, 'diem_danh', diem_danh, 'case_id', case_id) order by ho_ten) as hs
    from b group by 1,2,3,4,5,6
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mon', g.mon, 'ngay', g.ngay, 'gio_bat_dau', g.gio_bat_dau, 'gio_ket_thuc', g.gio_ket_thuc, 'phong', g.phong,
    'nguoi_day_tg', g.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'so_hs', g.so_hs, 'hs', g.hs,
    'lich_truc_id', lt.id, 'suc_chua', lt.suc_chua, 'lich_truc_pham_vi', case when lt.id is null then null when lt.lop_id is not null then 'lớp ' || l.ten_lop else 'khối ' || lt.khoi end
  ) order by g.ngay, g.gio_bat_dau nulls last, g.mon), '[]'::jsonb)
  from g
  left join nhan_su ns on ns.id = g.nguoi_day_tg
  left join lateral (
    select t.id, t.suc_chua, t.lop_id, t.khoi from lich_truc_bo_tro t
    where t.mon = g.mon and t.gio_bat_dau = g.gio_bat_dau
      and t.thu = (case extract(isodow from g.ngay)::int when 7 then 8 else extract(isodow from g.ngay)::int + 1 end)
      and t.hieu_luc_tu <= g.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= g.ngay)
      and (t.nhan_su_id is null or t.nhan_su_id = g.nguoi_day_tg)
    order by (t.nhan_su_id = g.nguoi_day_tg) desc nulls last, t.lop_id is not null desc
    limit 1
  ) lt on true
  left join lop l on l.id = lt.lop_id
$$;
grant execute on function public.fn_btyeu_ca_sap_toi(date, date) to authenticated;
