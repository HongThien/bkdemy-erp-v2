-- ============================================================================
-- 202609070127 — cuatoi_ta_tien_trinh_quy_trinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 07/09 — "đại cấu trúc Của tôi", Đợt 1 app TA):
--   ① TIẾN TRÌNH: TA nhìn mình thừa/thiếu gì so với định mức tháng, theo TỪNG LỚP
--      (buổi đi trợ giảng · chấm BTVN · chấm ET) + bổ trợ theo TA. KHÔNG dùng để
--      tính lương ở đây (CEO 07/09) — chỉ là bảng nhìn.
--      Định mức để trong BẢNG `ta_dinh_muc` (sửa được), không hardcode trong SQL.
--      Chuẩn buổi = số buổi/tuần của lớp (đếm thứ trong TKB) × `buoi_x_tuan`(=4)
--      → lớp 2b/tuần = 8, 1b/tuần = 4 đúng luật CEO, nhưng lớp 3b/tuần tự ra 12.
--      "Đi trợ giảng" = buổi thường của lớp ĐÃ DIỄN RA (ERP không chấm công nhân
--      sự — proxy theo dữ liệu buổi, đúng như CEO nói "lấy từ dữ liệu buổi học").
--      Bổ trợ = ca bo_tro_yeu mà TA đứng (nguoi_day_tg), giờ = kết thúc − bắt đầu,
--      thiếu giờ thì tính 1h/ca; định mức theo TA (dữ liệu bổ trợ không gắn lớp).
--   ② HƯỚNG DẪN: quy trình BK dạng markdown trong bảng `quy_trinh` (không file) —
--      sửa được từ ERP, lọc theo vai trò, có updated_at. Đợt 1 chỉ UI đọc.
--
-- MẤT GÌ (Luật xoá): không — 2 bảng mới + 1 hàm mới, không đụng gì có sẵn.
-- ============================================================================

-- ── ① Định mức TA (key-value, CEO sửa được; đổi số không cần migration) ──
create table if not exists ta_dinh_muc (
  ma text primary key,
  gia_tri numeric not null,
  mo_ta text,
  updated_at timestamptz not null default now()
);
comment on table ta_dinh_muc is 'Định mức tháng cho TA (Tiến trình "Của tôi"). buoi_x_tuan: chuẩn buổi = số buổi/tuần × giá trị này.';
insert into ta_dinh_muc (ma, gia_tri, mo_ta) values
  ('buoi_x_tuan', 4, 'Chuẩn buổi/lớp/tháng = số buổi/tuần (TKB) × 4'),
  ('btvn',        7, 'Số lần chấm BTVN/lớp/tháng'),
  ('et',          7, 'Số lần chấm ET/lớp/tháng'),
  ('botro_gio',   8, 'Giờ bổ trợ/TA/tháng')
on conflict (ma) do nothing;
alter table ta_dinh_muc enable row level security;
drop policy if exists ta_dinh_muc_member_all on ta_dinh_muc;
create policy ta_dinh_muc_member_all on ta_dinh_muc for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── ② Quy trình / hướng dẫn (markdown trong DB) ──
create table if not exists quy_trinh (
  id uuid primary key default gen_random_uuid(),
  tieu_de text not null,
  tom_tat text,
  noi_dung text not null default '',
  vai_tro text[] not null default '{}',          -- rỗng = mọi vai trò; vd {'ta','gv','ops'}
  thu_tu integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table quy_trinh is 'Quy trình chi tiết BK (box Hướng dẫn trong "Của tôi"). noi_dung = markdown. vai_tro rỗng = hiện cho mọi người.';
alter table quy_trinh enable row level security;
drop policy if exists quy_trinh_member_all on quy_trinh;
create policy quy_trinh_member_all on quy_trinh for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── ① fn_ta_tien_trinh — thừa/thiếu theo lớp + bổ trợ, 1 tháng ──
create or replace function public.fn_ta_tien_trinh(p_ym text)
returns jsonb language plpgsql stable as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den_thuc date;
  k_buoi numeric; k_btvn numeric; k_et numeric; k_botro numeric;
  v_lop jsonb; v_botro jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  v_den_thuc := least(v_den, v_today);   -- "thực" chỉ đếm tới hôm nay, không đếm buổi tương lai

  select gia_tri into k_buoi  from ta_dinh_muc where ma = 'buoi_x_tuan';
  select gia_tri into k_btvn  from ta_dinh_muc where ma = 'btvn';
  select gia_tri into k_et    from ta_dinh_muc where ma = 'et';
  select gia_tri into k_botro from ta_dinh_muc where ma = 'botro_gio';

  with lop_toi as (
    select l.id, l.ten_lop
    from phan_cong_lop pc join lop l on l.id = pc.lop_id
    where pc.nhan_su_id = v_me and pc.vai_tro = 'tg' and l.trang_thai = 'dang_hoc'
  ),
  tuan as (   -- số buổi/tuần = số THỨ khác nhau trong TKB còn hiệu lực trong tháng
    select lt.id as lop_id, count(distinct t.thu) as buoi_tuan
    from lop_toi lt join thoi_khoa_bieu t on t.lop_id = lt.id
    where t.hieu_luc_tu <= v_den and (t.hieu_luc_den is null or t.hieu_luc_den >= v_tu)
    group by lt.id
  ),
  thuc as (
    select lt.id as lop_id,
      count(*) filter (where b.ngay <= v_den_thuc) as buoi_thuc,
      count(*) filter (where b.btvn_dong_at is not null) as btvn_thuc,
      count(*) filter (where b.et_dong_at is not null) as et_thuc
    from lop_toi lt left join buoi_hoc b
      on b.lop_id = lt.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_tu and v_den
    group by lt.id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'lop_id', lt.id, 'ten_lop', lt.ten_lop,
      'buoi_tuan', coalesce(tu.buoi_tuan, 0),
      'buoi_chuan', coalesce(tu.buoi_tuan, 0) * k_buoi, 'buoi_thuc', coalesce(th.buoi_thuc, 0),
      'btvn_chuan', k_btvn, 'btvn_thuc', coalesce(th.btvn_thuc, 0),
      'et_chuan', k_et, 'et_thuc', coalesce(th.et_thuc, 0)
    ) order by lt.ten_lop), '[]'::jsonb)
  into v_lop
  from lop_toi lt left join tuan tu on tu.lop_id = lt.id left join thuc th on th.lop_id = lt.id;

  select jsonb_build_object(
      'chuan_gio', k_botro,
      'so_ca', count(*),
      'thuc_gio', round(coalesce(sum(coalesce(extract(epoch from (b.gio_ket_thuc - b.gio_bat_dau)) / 3600, 1)), 0)::numeric, 1))
  into v_botro
  from buoi_hoc b
  where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy' and b.nguoi_day_tg = v_me
    and b.ngay between v_tu and v_den_thuc;

  return jsonb_build_object('ym', p_ym, 'lop', v_lop, 'botro', v_botro,
    'dinh_muc', jsonb_build_object('buoi_x_tuan', k_buoi, 'btvn', k_btvn, 'et', k_et, 'botro_gio', k_botro));
end $$;
comment on function public.fn_ta_tien_trinh(text) is
  'Tiến trình TA theo tháng: mỗi lớp (buổi/BTVN/ET thực vs chuẩn) + bổ trợ theo TA. Chuẩn đọc từ ta_dinh_muc. KHÔNG dùng tính lương.';
grant execute on function public.fn_ta_tien_trinh(text) to authenticated;
revoke execute on function public.fn_ta_tien_trinh(text) from anon;
