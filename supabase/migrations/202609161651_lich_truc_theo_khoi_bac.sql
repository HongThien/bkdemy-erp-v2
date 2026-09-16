-- Thùy 09-16 chốt: (1) 1 ca bổ trợ TỐI ĐA 3 HS — đầy là biến mất khỏi mọi chỗ chọn; mọi chỗ hiện ca phải kèm n/3.
-- (2) BK bổ trợ THEO KHỐI + BẬC, không theo lớp; mỗi ca có người trực. Luật bậc (lop_bac.thu_tu: S4 > A3 > B2 > C1):
--     ca bậc cao nhận HS bậc thấp hơn, không ngược lại (ca 7S nhận 7A; ca 7A KHÔNG nhận 7S).
-- (3) Không có ưu tiên "cùng bậc trước" — ai chốt trước chiếm chỗ trước (bổ trợ phải báo PH, chốt là giữ chỗ).
-- Dữ liệu cũ nhập theo lớp → chuyển sang khối + bậc CỦA LỚP ĐÓ (lop.khoi, lop.bac); dòng "cả khối" không bậc → 'S' (nhận mọi bậc).
alter table public.lich_truc_bo_tro add column if not exists bac text references public.lop_bac(ma);
update public.lich_truc_bo_tro t set khoi = l.khoi, bac = l.bac from public.lop l where t.lop_id = l.id and t.bac is null;
update public.lich_truc_bo_tro set bac = 'S' where bac is null;
update public.lich_truc_bo_tro set lop_id = null; -- cột giữ lại (không drop — Luật xoá), không dùng nữa
update public.lich_truc_bo_tro set suc_chua = 3 where suc_chua is null;
alter table public.lich_truc_bo_tro alter column suc_chua set default 3;
alter table public.lich_truc_bo_tro alter column suc_chua set not null;
alter table public.lich_truc_bo_tro drop constraint if exists lich_truc_bo_tro_pham_vi;
alter table public.lich_truc_bo_tro add constraint lich_truc_bo_tro_pham_vi check (khoi is not null and bac is not null);
create index if not exists lich_truc_bo_tro_mon_khoi_bac_idx on public.lich_truc_bo_tro (mon, khoi, bac);

-- Slot áp dụng cho HS: cùng môn + cùng khối (lớp em đang học môn đó; fallback hoc_sinh.khoi) + bậc slot ≥ bậc lớp em.
create or replace function public.fn_lich_truc_cua_hs(p_hoc_sinh uuid, p_mon text, p_ngay date default null)
returns jsonb language sql stable security definer set search_path = public as $$
  with d as (select coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as ngay),
  lops as (
    select l.khoi, l.bac, coalesce(b.thu_tu, 0) as bac_tt
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id left join lop_bac b on b.ma = l.bac
    where hl.hoc_sinh_id = p_hoc_sinh and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon
  ),
  hs as (
    select coalesce((select khoi from lops limit 1), (select khoi from hoc_sinh where id = p_hoc_sinh)) as khoi,
           coalesce((select min(bac_tt) from lops), 0) as bac_tt
  ),
  chon as (
    select t.*, coalesce(tb.thu_tu, 0) as t_tt from lich_truc_bo_tro t left join lop_bac tb on tb.ma = t.bac, d, hs
    where t.mon = p_mon and t.khoi = hs.khoi and coalesce(tb.thu_tu, 0) >= hs.bac_tt
      and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'thu', c.thu, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'khoi', c.khoi, 'bac', c.bac, 'lop_id', null, 'ghi_chu', c.ghi_chu, 'suc_chua', c.suc_chua
  ) order by c.thu, c.gio_bat_dau), '[]'::jsonb)
  from chon c left join nhan_su ns on ns.id = c.nhan_su_id
$$;

-- Ca sắp tới: KHÓA ca = (môn, ngày, giờ bđ, người dạy) — bỏ phòng khỏi khoá (sửa phòng sau không được tách ca). Sức chứa = của lịch
-- trực khớp; ca ngoài lịch trực vẫn tối đa 3 (luật chung).
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
    select mon, ngay, gio_bat_dau, nguoi_day_tg,
           min(gio_ket_thuc) as gio_ket_thuc, min(phong) as phong,
           count(*)::int as so_hs,
           jsonb_agg(jsonb_build_object('buoi_id', buoi_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'khoi', khoi, 'diem_danh', diem_danh, 'case_id', case_id) order by ho_ten) as hs
    from b group by 1,2,3,4
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mon', g.mon, 'ngay', g.ngay, 'gio_bat_dau', g.gio_bat_dau, 'gio_ket_thuc', g.gio_ket_thuc, 'phong', g.phong,
    'nguoi_day_tg', g.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'so_hs', g.so_hs, 'hs', g.hs,
    'lich_truc_id', lt.id, 'suc_chua', coalesce(lt.suc_chua, 3),
    'lich_truc_pham_vi', case when lt.id is null then null else 'khối ' || lt.khoi || lt.bac end
  ) order by g.ngay, g.gio_bat_dau nulls last, g.mon), '[]'::jsonb)
  from g
  left join nhan_su ns on ns.id = g.nguoi_day_tg
  left join lateral (
    select t.id, t.suc_chua, t.khoi, t.bac from lich_truc_bo_tro t
    where t.mon = g.mon and t.gio_bat_dau = g.gio_bat_dau and t.nhan_su_id = g.nguoi_day_tg
      and t.thu = (case extract(isodow from g.ngay)::int when 7 then 8 else extract(isodow from g.ngay)::int + 1 end)
      and t.hieu_luc_tu <= g.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= g.ngay)
    order by t.khoi limit 1
  ) lt on true
$$;
