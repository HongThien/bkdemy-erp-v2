-- Lấp đầy ca: BÙ tính theo NHÓM CÙNG BÀI (Thùy 10/11: "3 HS cùng học 1 bài cùng bù 1 bài: 1 HS = 4, 2 HS = 6, 3 HS = 6 — độ khó không tăng tỉ lệ thuận").
-- Thay mig 202611101405: trước đó cộng 4 đơn vị cho MỖI em bù. Nhóm = cùng ca + cùng buổi gốc (buoi_hoc_hs.bu_cho_buoi_id); cùng 1 em xếp trùng cùng bài chỉ tính 1 lần.
-- Yếu · đuổi · hình giữ nguyên (theo từng em). CHỈ ảnh hưởng bảng Lấp đầy — luật xếp ở Lịch phòng (fn_ca_bo_tro_xep, don_vi lưu sẵn) CHƯA đổi, chờ Thùy quyết.
create or replace function public.fn_botro_lap_day_ca(p_tu date, p_den date, p_khoi text default null, p_co_mat boolean default false)
returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $$
declare
  v_hqua date := ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1);
  v_den date := least(p_den, ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1));
  v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu or p_den - p_tu > 400 then raise exception 'Khoảng ngày không hợp lệ.'; end if;

  with ca as materialized (
    select c.id, c.ngay, extract(isodow from c.ngay)::int as thu, c.gio_bat_dau, c.gio_ket_thuc, c.khoi, greatest(c.so_ta, 1) as so_ta, c.don_vi,
           concat_ws(' / ', n1.ho_ten, n2.ho_ten) as ta
      from ca_bo_tro c left join nhan_su n1 on n1.id = c.nhan_su_id left join nhan_su n2 on n2.id = c.nhan_su_2_id
     where c.ngay between p_tu and v_den and c.trang_thai <> 'huy' and (p_khoi is null or c.khoi = p_khoi)),
  luot as materialized (   -- 1 dòng / (buổi × em)
    select b.id as buoi, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.loai, b.ca_bo_tro_id, hh.hoc_sinh_id as hs, hh.bu_cho_buoi_id as bai, hs.khoi as khoi_hs, hh.diem_danh,
           coalesce(hh.don_vi, public._ca_bo_tro_don_vi(case b.loai when 'bo_tro_yeu' then 'yeu' when 'bo_tro_duoi' then 'duoi' when 'bu' then 'bu' else 'hinh' end,
                                                         hh.hoc_sinh_id, coalesce(y.mon, 'Toán')))::int as dv
      from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
     where b.ngay between p_tu and v_den and b.trang_thai <> 'huy' and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh')),
  gan as materialized (    -- lượt → ca (gắn sẵn hoặc ghép theo ngày · khối · giờ)
    select l.*, coalesce(
             (select ca.id from ca where ca.id = l.ca_bo_tro_id),
             (select ca.id from ca where ca.ngay = l.ngay and ca.khoi = l.khoi_hs and ca.gio_bat_dau < l.gio_ket_thuc and l.gio_bat_dau < ca.gio_ket_thuc order by ca.gio_bat_dau, ca.id limit 1)) as ca_id
      from luot l),
  em as (                  -- (ca × em)
    select g.ca_id, g.hs, bool_or(g.diem_danh = 'co_mat') as co_mat, min(g.loai) as loai
      from gan g where g.ca_id is not null group by g.ca_id, g.hs),
  dv_khac as (             -- yếu · đuổi · hình: đơn vị theo từng em (như đã lưu / _ca_bo_tro_don_vi)
    select g.ca_id, sum(g.dv)::int as v from gan g
     where g.ca_id is not null and g.loai <> 'bu' and (not p_co_mat or g.diem_danh = 'co_mat') group by g.ca_id),
  dv_bu as (               -- BÙ theo NHÓM CÙNG BÀI (Thùy 10/11): 1 em = 4 · 2 em = 6 · 3 em = 6 (độ khó không tăng tỉ lệ thuận). Nhóm = cùng ca + cùng buổi gốc (bu_cho_buoi_id)
    select q.ca_id, sum(case when q.n = 1 then 4 else 6 end)::int as v from (
      select g.ca_id, coalesce(g.bai, g.buoi) as khoa, count(distinct g.hs) as n from gan g
       where g.ca_id is not null and g.loai = 'bu' and (not p_co_mat or g.diem_danh = 'co_mat') group by g.ca_id, coalesce(g.bai, g.buoi)) q group by q.ca_id),
  ca_so as (
    select ca.*, coalesce(count(em.hs) filter (where not p_co_mat or em.co_mat), 0)::int as h,
           (coalesce(max(dk.v), 0) + coalesce(max(db.v), 0))::int as v,
           coalesce(count(em.hs) filter (where em.loai = 'bo_tro_yeu'), 0)::int as ly, coalesce(count(em.hs) filter (where em.loai = 'bu'), 0)::int as lb,
           coalesce(count(em.hs) filter (where em.loai = 'bo_tro_duoi'), 0)::int as ld, coalesce(count(em.hs) filter (where em.loai = 'bo_tro_hinh'), 0)::int as lh
      from ca left join em on em.ca_id = ca.id left join dv_khac dk on dk.ca_id = ca.id left join dv_bu db on db.ca_id = ca.id group by ca.id, ca.ngay, ca.thu, ca.gio_bat_dau, ca.gio_ket_thuc, ca.khoi, ca.so_ta, ca.don_vi, ca.ta),
  nhom as (select s.*, case when extract(hour from s.gio_bat_dau) < 12 then 1 when extract(hour from s.gio_bat_dau) < 17 then 2 when extract(hour from s.gio_bat_dau) < 18 then 3 else 4 end as gio_nhom from ca_so s)
  select jsonb_build_object(
    'tu', p_tu, 'den', p_den, 'den_tinh', v_den, 'hom_qua', v_hqua,
    'ngay_dau', (select min(ngay) from ca_bo_tro where trang_thai <> 'huy'),
    'tong', (select jsonb_build_object('ca', count(*), 'hs', coalesce(sum(h), 0), 'cap_hs', coalesce(sum(3 * so_ta), 0), 'dv', coalesce(sum(v), 0), 'cap_dv', coalesce(sum(don_vi), 0),
                    'trong', count(*) filter (where h = 0), 'day', count(*) filter (where h >= 3 * so_ta or v >= don_vi),
                    'pct_hs', round(100.0 * coalesce(sum(h), 0) / nullif(sum(3 * so_ta), 0), 1), 'pct_dv', round(100.0 * coalesce(sum(v), 0) / nullif(sum(don_vi), 0), 1)) from nhom),
    'ngoai', (select count(*) from gan where ca_id is null and (p_khoi is null or khoi_hs = p_khoi) and (not p_co_mat or diem_danh = 'co_mat')),
    'khung', coalesce((select jsonb_agg(x order by (x->>'pct_dv')::numeric desc, (x->>'khoi'), (x->>'thu')::int) from (
        select jsonb_build_object('khoi', khoi, 'thu', thu, 'bd', to_char(gio_bat_dau, 'HH24:MI'), 'kt', to_char(gio_ket_thuc, 'HH24:MI'), 'ta', string_agg(distinct ta, ' · '),
               'ca', count(*), 'hs', sum(h), 'cap_hs', sum(3 * so_ta), 'dv', sum(v), 'cap_dv', sum(don_vi), 'trong', count(*) filter (where h = 0),
               'pct_hs', round(100.0 * sum(h) / nullif(sum(3 * so_ta), 0), 1), 'pct_dv', round(100.0 * sum(v) / nullif(sum(don_vi), 0), 1)) as x
          from nhom group by khoi, thu, gio_bat_dau, gio_ket_thuc) q), '[]'::jsonb),
    'khoi', coalesce((select jsonb_agg(x order by (x->>'khoi')) from (
        select jsonb_build_object('khoi', khoi, 'ca', count(*), 'hs', sum(h), 'cap_hs', sum(3 * so_ta), 'dv', sum(v), 'cap_dv', sum(don_vi), 'trong', count(*) filter (where h = 0),
               'pct_hs', round(100.0 * sum(h) / nullif(sum(3 * so_ta), 0), 1), 'pct_dv', round(100.0 * sum(v) / nullif(sum(don_vi), 0), 1)) as x from nhom group by khoi) q), '[]'::jsonb),
    'thu', coalesce((select jsonb_agg(x order by (x->>'thu')::int) from (
        select jsonb_build_object('thu', thu, 'ca', count(*), 'hs', sum(h), 'cap_hs', sum(3 * so_ta), 'dv', sum(v), 'cap_dv', sum(don_vi), 'trong', count(*) filter (where h = 0),
               'pct_hs', round(100.0 * sum(h) / nullif(sum(3 * so_ta), 0), 1), 'pct_dv', round(100.0 * sum(v) / nullif(sum(don_vi), 0), 1)) as x from nhom group by thu) q), '[]'::jsonb),
    'gio', coalesce((select jsonb_agg(x order by (x->>'nhom')::int) from (
        select jsonb_build_object('nhom', gio_nhom, 'ca', count(*), 'hs', sum(h), 'cap_hs', sum(3 * so_ta), 'dv', sum(v), 'cap_dv', sum(don_vi), 'trong', count(*) filter (where h = 0),
               'pct_hs', round(100.0 * sum(h) / nullif(sum(3 * so_ta), 0), 1), 'pct_dv', round(100.0 * sum(v) / nullif(sum(don_vi), 0), 1)) as x from nhom group by gio_nhom) q), '[]'::jsonb),
    'ds', coalesce((select jsonb_agg(jsonb_build_object('ngay', ngay, 'thu', thu, 'bd', to_char(gio_bat_dau, 'HH24:MI'), 'kt', to_char(gio_ket_thuc, 'HH24:MI'), 'khoi', khoi, 'ta', ta, 'so_ta', so_ta,
               'hs', h, 'cap_hs', 3 * so_ta, 'dv', v, 'cap_dv', don_vi, 'pct_hs', round(100.0 * h / (3 * so_ta), 1), 'pct_dv', round(100.0 * v / nullif(don_vi, 0), 1),
               'ly', ly, 'lb', lb, 'ld', ld, 'lh', lh) order by ngay, gio_bat_dau, khoi) from nhom), '[]'::jsonb)
  ) into v_out;
  return v_out;
end $$;
grant execute on function public.fn_botro_lap_day_ca(date, date, text, boolean) to authenticated;
