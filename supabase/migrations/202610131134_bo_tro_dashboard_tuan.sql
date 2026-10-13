-- Thùy 13/10: "Trong tab bổ trợ muốn có 1 tab Dashboard: thể hiện cycle thực hiện theo từng tuần. Ví dụ tuần 30 chốt 50 ca bổ trợ yếu,
-- thực tế mới đang chạy được 23/50 — để người quản trị nắm được tình hình cụ thể. Hiện 3 tuần gần nhất."
-- Đơn vị đếm = 1 LƯỢT HỌC SINH trong 1 ca (buoi_hoc_hs) của buổi bổ trợ yếu · bù · đuổi có NGÀY nằm trong tuần (T2 → CN).
-- Trạng thái của một lượt (đúng MỘT trong các ô dưới — phân loại ở đây, màn chỉ vẽ):
--   go             đã GỠ khỏi lịch (buổi huỷ, lý do "OPS gỡ…") — đổi lịch, KHÔNG tính vào "chốt"
--   hoan_tat       em có mặt, ca đã đánh giá/đóng xong
--   dang_do        em có mặt, ca chưa đóng xong (đang học · chờ test · chờ đánh giá)
--   vang           điểm danh vắng
--   khong_dien_ra  buổi bị huỷ vì qua ngày không điểm danh / huỷ tay (không phải gỡ lịch)
--   qua_han        đã qua ngày mà chưa điểm danh, buổi còn mở (bù · đuổi không tự huỷ)
--   cho            chưa tới ngày / hôm nay chưa điểm danh
-- CHỐT = mọi lượt trừ `go` · ĐÃ CHẠY = hoan_tat + dang_do. HS test (trang_thai = 'test') không tính.
create or replace function public.fn_bo_tro_dashboard_tuan(p_den date default null, p_so_tuan integer default 3)
returns jsonb
language sql stable security definer set search_path = public as $$
  with hn as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as ngay),
  moc as (select date_trunc('week', coalesce(p_den, (select ngay from hn))::timestamp)::date as t2_cuoi,
                 greatest(1, least(coalesce(p_so_tuan, 3), 12)) as n),
  tuan as (select (m.t2_cuoi - 7 * g.i) as tu, (m.t2_cuoi - 7 * g.i + 6) as den, g.i as lui
           from moc m cross join lateral generate_series(0, m.n - 1) as g(i)),
  luot as (
    select t.tu, b.loai, b.id as buoi_id, b.ngay, b.gio_bat_dau, b.ly_do_huy, hs.ho_ten, hs.ma_hs,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi,
           coalesce(
             (select l.ten_lop from buoi_hoc g join lop l on l.id = g.lop_id where g.id = hh.bu_cho_buoi_id),
             (select l.ten_lop from bo_tro_duoi d join lop l on l.id = d.lop_id where d.id = hh.bo_tro_duoi_id),
             (select l.ten_lop from bo_tro_yeu y join hoc_sinh_lop hl on hl.hoc_sinh_id = y.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
                join lop l on l.id = hl.lop_id and l.mon = y.mon where y.id = hh.bo_tro_yeu_id order by hl.ngay_vao desc limit 1)) as lop,
           case
             when b.trang_thai = 'huy' and b.ly_do_huy ilike 'OPS gỡ%' then 'go'
             when hh.diem_danh = 'vang' then 'vang'
             when hh.diem_danh = 'co_mat' or b.trang_thai = 'hoan_tat' or (b.danh_gia_xong_at is not null and b.trang_thai <> 'huy')
               then case when b.danh_gia_xong_at is not null or b.trang_thai = 'hoan_tat' then 'hoan_tat' else 'dang_do' end
             when b.trang_thai = 'huy' then 'khong_dien_ra'
             when b.ngay < (select ngay from hn) then 'qua_han'
             else 'cho' end as tt
    from tuan t
    join buoi_hoc b on b.ngay between t.tu and t.den and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi')
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
    join hoc_sinh hs on hs.id = hh.hoc_sinh_id and hs.trang_thai is distinct from 'test'
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
  ),
  dem as (
    select tu, loai,
           count(*) filter (where tt <> 'go') as chot,
           count(*) filter (where tt in ('hoan_tat', 'dang_do')) as da_chay,
           count(*) filter (where tt = 'hoan_tat') as hoan_tat,
           count(*) filter (where tt = 'dang_do') as dang_do,
           count(*) filter (where tt = 'vang') as vang,
           count(*) filter (where tt = 'khong_dien_ra') as khong_dien_ra,
           count(*) filter (where tt = 'qua_han') as qua_han,
           count(*) filter (where tt = 'cho') as cho,
           count(*) filter (where tt = 'go') as go
    from luot group by tu, loai
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'tu', t.tu, 'den', t.den, 'dang_chay', (select ngay from hn) between t.tu and t.den, 'tuong_lai', t.tu > (select ngay from hn),
    'loai', (select coalesce(jsonb_object_agg(k.loai, jsonb_build_object(
               'chot', coalesce(d.chot, 0), 'da_chay', coalesce(d.da_chay, 0), 'hoan_tat', coalesce(d.hoan_tat, 0), 'dang_do', coalesce(d.dang_do, 0),
               'vang', coalesce(d.vang, 0), 'khong_dien_ra', coalesce(d.khong_dien_ra, 0), 'qua_han', coalesce(d.qua_han, 0),
               'cho', coalesce(d.cho, 0), 'go', coalesce(d.go, 0))), '{}'::jsonb)
             from (values ('bo_tro_yeu'), ('bu'), ('bo_tro_duoi')) k(loai) left join dem d on d.tu = t.tu and d.loai = k.loai),
    'ds', (select coalesce(jsonb_agg(jsonb_build_object('loai', l.loai, 'tt', l.tt, 'buoi_id', l.buoi_id, 'ngay', l.ngay, 'gio_bat_dau', l.gio_bat_dau,
               'ho_ten', l.ho_ten, 'ma_hs', l.ma_hs, 'lop', l.lop, 'nguoi', l.nguoi, 'ly_do', l.ly_do_huy)
               order by l.ngay, l.gio_bat_dau nulls last, l.ho_ten), '[]'::jsonb) from luot l where l.tu = t.tu)
  ) order by t.tu desc), '[]'::jsonb) end
  from tuan t
$$;
grant execute on function public.fn_bo_tro_dashboard_tuan(date, integer) to authenticated, service_role;
