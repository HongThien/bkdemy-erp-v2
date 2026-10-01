-- Thùy 24/09 — spec-xep-bo-tro-chung.md §8, BƯỚC 2: ca bổ trợ CHUNG theo ĐƠN VỊ (30' × 1 TA).
-- Ca = 1 ca trực của 1 NGÀY (sinh từ lịch trực khi mở ngày, hoặc tạo tay). Buổi của 3 loại (bo_tro_duoi · bu · bo_tro_yeu) gắn ca;
-- em xếp vào = dòng buoi_hoc_hs mang `don_vi` (Đuổi 4 · Bù 4 · Yếu L2 4 · Yếu L1 2) và `xac_nhan_ph_at` (PH đồng ý ⇒ mới TRỪ đơn vị).
-- Chặn ở DB: vượt đơn vị · >3 em/TA · Đuổi vào ca <60' · phòng >2 ca cùng giờ. Máy chỉ chặn, không tự xếp (§4).

-- ── 1. Bảng ca ────────────────────────────────────────────────────────────────────────────────────────────────────────
create table if not exists public.ca_bo_tro (
  id uuid primary key default gen_random_uuid(),
  lich_truc_id uuid references public.lich_truc_bo_tro(id),         -- null = ca ngoài lịch trực (Lộc tạo tay)
  ngay date not null,
  gio_bat_dau time not null,
  gio_ket_thuc time not null,
  mon text not null,
  khoi text,                                                          -- gợi ý lọc ứng viên; null = mọi khối
  phong text,
  so_ta smallint not null default 1 check (so_ta between 1 and 2),
  nhan_su_id uuid references public.nhan_su(id),
  nhan_su_2_id uuid references public.nhan_su(id),
  don_vi smallint generated always as ((3 * (extract(epoch from (gio_ket_thuc - gio_bat_dau)) / 1800)::int * so_ta)::smallint) stored,
  trang_thai text not null default 'mo' check (trang_thai in ('mo', 'huy')),
  ly_do_huy text, huy_at timestamptz, huy_boi uuid,
  created_by uuid, created_at timestamptz not null default now(),
  check (gio_ket_thuc > gio_bat_dau)
);
create unique index if not exists ca_bo_tro_lich_ngay_uq on public.ca_bo_tro(lich_truc_id, ngay) where lich_truc_id is not null;
create index if not exists ca_bo_tro_ngay_idx on public.ca_bo_tro(ngay);
alter table public.ca_bo_tro enable row level security;
drop policy if exists ca_bo_tro_member_all on public.ca_bo_tro;
create policy ca_bo_tro_member_all on public.ca_bo_tro for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

alter table public.buoi_hoc add column if not exists ca_bo_tro_id uuid references public.ca_bo_tro(id);
create index if not exists buoi_hoc_ca_bo_tro_idx on public.buoi_hoc(ca_bo_tro_id) where ca_bo_tro_id is not null;
alter table public.buoi_hoc_hs
  add column if not exists don_vi smallint check (don_vi is null or don_vi in (2, 4)),
  add column if not exists xac_nhan_ph_at timestamptz,
  add column if not exists xac_nhan_boi uuid;

-- ── 2. Phòng: cùng ngày, cùng khung giờ, tối đa 2 ca 'mo' (CEO câu 7) ─────────────────────────────────────────────────
create or replace function public._trg_ca_bo_tro_phong() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.trang_thai <> 'mo' or new.phong is null then return new; end if;
  select count(*) into n from ca_bo_tro c
  where c.id <> new.id and c.trang_thai = 'mo' and c.ngay = new.ngay and c.phong = new.phong
    and c.gio_bat_dau < new.gio_ket_thuc and c.gio_ket_thuc > new.gio_bat_dau;
  if n >= 2 then raise exception 'Phòng % ngày % lúc % đã có 2 ca bổ trợ — tối đa 2 ca/phòng cùng giờ.', new.phong, to_char(new.ngay, 'DD/MM'), to_char(new.gio_bat_dau, 'HH24:MI'); end if;
  return new;
end $$;
drop trigger if exists trg_ca_bo_tro_phong on public.ca_bo_tro;
create trigger trg_ca_bo_tro_phong before insert or update of phong, ngay, gio_bat_dau, gio_ket_thuc, trang_thai on public.ca_bo_tro
  for each row execute function public._trg_ca_bo_tro_phong();

-- ── 3. Helper ─────────────────────────────────────────────────────────────────────────────────────────────────────────
create or replace function public._thu_cua_ngay(p date) returns smallint
language sql immutable as $$ select (case extract(isodow from p)::int when 7 then 8 else extract(isodow from p)::int + 1 end)::smallint $$;

-- Đơn vị của 1 em theo loại (spec §1): đuổi 4 · bù 4 · yếu L2+ 4 · yếu L1 2.
create or replace function public._ca_bo_tro_don_vi(p_loai text, p_hs uuid, p_mon text) returns smallint
language sql stable as $$
  select case when p_loai in ('duoi', 'bu') then 4
              when coalesce((select l.level from hs_level l where l.hoc_sinh_id = p_hs and l.mon = p_mon and l.loai = 'kien_thuc'), 1) <= 1 then 2
              else 4 end::smallint
$$;

-- Tình trạng ca: đơn vị đã xác nhận (trừ thật), đang chờ PH, số em xác nhận. Em vắng/vắng phép = trả đơn vị (câu 14). Buổi huỷ không tính.
create or replace function public._ca_bo_tro_tinh(p_ca uuid, p_tru_bhh uuid default null)
returns table (don_vi_dung int, don_vi_cho int, so_hs_xn int, so_hs_cho int)
language sql stable as $$
  select coalesce(sum(hh.don_vi) filter (where hh.xac_nhan_ph_at is not null), 0)::int,
         coalesce(sum(hh.don_vi) filter (where hh.xac_nhan_ph_at is null), 0)::int,
         count(distinct hh.hoc_sinh_id) filter (where hh.xac_nhan_ph_at is not null)::int,
         count(distinct hh.hoc_sinh_id) filter (where hh.xac_nhan_ph_at is null)::int
  from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
  where b.ca_bo_tro_id = p_ca and b.trang_thai = 'mo' and hh.don_vi is not null
    and coalesce(hh.diem_danh, '') not in ('vang', 'vang_phep') and (p_tru_bhh is null or hh.id <> p_tru_bhh)
$$;

-- TA của lớp em (vai 'tg', ưu tiên la_chinh) — mặc định người dạy cho Bù/Đuổi nếu TA đó đang trực ca (câu 6).
create or replace function public._ta_cua_lop(p_lop uuid) returns uuid
language sql stable as $$
  select pc.nhan_su_id from phan_cong_lop pc where pc.lop_id = p_lop and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last, pc.created_at limit 1
$$;

-- ── 4. Sinh ca của 1 ngày từ lịch trực (idempotent — gọi khi Lộc mở ngày) ───────────────────────────────────────────
create or replace function public.fn_ca_bo_tro_sinh_ngay(p_ngay date) returns integer
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  insert into ca_bo_tro (lich_truc_id, ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  select t.id, p_ngay, t.gio_bat_dau, t.gio_ket_thuc, t.mon, t.khoi, t.phong, t.so_ta, t.nhan_su_id, t.nhan_su_2_id, public.jwt_uid()
  from lich_truc_bo_tro t
  where t.thu = public._thu_cua_ngay(p_ngay) and t.hieu_luc_tu <= p_ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= p_ngay)
    and not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = p_ngay)
    -- lịch trực cũ tách theo BẬC (7S/7A cùng TA cùng giờ) — bậc không còn dùng xếp (CEO 24/09): 1 TA 1 ca/khung giờ, dòng trùng bỏ qua
    and not exists (select 1 from ca_bo_tro c where c.ngay = p_ngay and c.trang_thai = 'mo' and c.nhan_su_id = t.nhan_su_id and c.gio_bat_dau < t.gio_ket_thuc and c.gio_ket_thuc > t.gio_bat_dau)
    and not exists (select 1 from lich_truc_bo_tro u where u.id < t.id and u.thu = t.thu and u.nhan_su_id = t.nhan_su_id and u.hieu_luc_tu <= p_ngay and (u.hieu_luc_den is null or u.hieu_luc_den >= p_ngay) and u.gio_bat_dau < t.gio_ket_thuc and u.gio_ket_thuc > t.gio_bat_dau)
  on conflict do nothing;
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.fn_ca_bo_tro_sinh_ngay(date) to authenticated;

-- ── 5. Đọc: ca của 1 ngày (+ em đã xếp) · tóm tắt theo ngày ───────────────────────────────────────────────────────────
create or replace function public.fn_ca_bo_tro_ngay(p_ngay date) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'lich_truc_id', c.lich_truc_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc,
    'phut', (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int,
    'mon', c.mon, 'khoi', c.khoi, 'phong', c.phong, 'so_ta', c.so_ta,
    'nhan_su_id', c.nhan_su_id, 'nhan_su_ten', ns.ho_ten, 'nhan_su_2_id', c.nhan_su_2_id, 'nhan_su_2_ten', ns2.ho_ten,
    'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'so_hs_xn', t.so_hs_xn, 'so_hs_cho', t.so_hs_cho,
    'trang_thai', c.trang_thai, 'ly_do_huy', c.ly_do_huy,
    'phong_so_ca', (select count(*) from ca_bo_tro x where x.trang_thai = 'mo' and x.ngay = c.ngay and x.phong = c.phong and x.phong is not null
                    and x.gio_bat_dau < c.gio_ket_thuc and x.gio_ket_thuc > c.gio_bat_dau),
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
             'bhh_id', hh.id, 'buoi_hoc_id', b.id, 'loai', case b.loai when 'bo_tro_duoi' then 'duoi' when 'bu' then 'bu' else 'yeu' end,
             'hoc_sinh_id', hh.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi,
             'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon limit 1),
             'don_vi', hh.don_vi, 'xac_nhan_ph_at', hh.xac_nhan_ph_at, 'diem_danh', hh.diem_danh,
             'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_day_ten', nd.ho_ten,
             'chi_tiet', case b.loai
               when 'bu' then 'nghỉ ' || to_char((select m.ngay from buoi_hoc m where m.id = hh.bu_cho_buoi_id), 'DD/MM')
               when 'bo_tro_duoi' then 'đuổi · buổi ' || (select count(*) + 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = hh.bo_tro_duoi_id and bb.id <> b.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat')
                                          || coalesce('/' || (select d.so_buoi_du_kien from bo_tro_duoi d where d.id = hh.bo_tro_duoi_id), '')
               else 'yếu L' || coalesce((select l.level from hs_level l where l.hoc_sinh_id = hh.hoc_sinh_id and l.mon = c.mon and l.loai = 'kien_thuc'), 1)
                    || ' · ' || (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) || ' dạng cần dạy' end
           ) order by hh.xac_nhan_ph_at nulls last, hs.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
           left join nhan_su nd on nd.id = b.nguoi_day_tg
           where b.ca_bo_tro_id = c.id and b.trang_thai = 'mo' and hh.don_vi is not null)
  ) order by c.gio_bat_dau, c.phong nulls last, c.khoi), '[]'::jsonb) end
  from ca_bo_tro c
  left join nhan_su ns on ns.id = c.nhan_su_id left join nhan_su ns2 on ns2.id = c.nhan_su_2_id
  cross join lateral public._ca_bo_tro_tinh(c.id) t
  where c.ngay = p_ngay
$$;
grant execute on function public.fn_ca_bo_tro_ngay(date) to authenticated;

-- Tóm tắt dải ngày: số ca (đã sinh + lịch trực chưa sinh), đơn vị dùng / tổng.
create or replace function public.fn_ca_bo_tro_tuan(p_tu date, p_den date) returns jsonb
language sql stable security definer set search_path = public as $$
  with d as (select generate_series(p_tu, least(p_den, p_tu + 60), interval '1 day')::date as ngay),
  ca as (select c.ngay, count(*) filter (where c.trang_thai = 'mo') so_ca, coalesce(sum(c.don_vi) filter (where c.trang_thai = 'mo'), 0) tong,
                coalesce(sum(t.don_vi_dung), 0) dung, coalesce(sum(t.don_vi_cho), 0) cho
         from ca_bo_tro c cross join lateral public._ca_bo_tro_tinh(c.id) t where c.ngay between p_tu and p_den group by c.ngay),
  lt as (select d.ngay, count(*) so_lich, coalesce(sum(t.don_vi), 0) tong_lich from d join lich_truc_bo_tro t
         on t.thu = public._thu_cua_ngay(d.ngay) and t.hieu_luc_tu <= d.ngay and (t.hieu_luc_den is null or t.hieu_luc_den >= d.ngay)
         where not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = d.ngay) group by d.ngay)
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'ngay', d.ngay, 'so_ca', coalesce(ca.so_ca, 0) + coalesce(lt.so_lich, 0), 'don_vi', coalesce(ca.tong, 0) + coalesce(lt.tong_lich, 0),
    'don_vi_dung', coalesce(ca.dung, 0), 'don_vi_cho', coalesce(ca.cho, 0)) order by d.ngay), '[]'::jsonb) end
  from d left join ca on ca.ngay = d.ngay left join lt on lt.ngay = d.ngay
$$;
grant execute on function public.fn_ca_bo_tro_tuan(date, date) to authenticated;

-- ── 6. Ứng viên của 1 ca — 3 tab, đã sắp ưu tiên (§5) ─────────────────────────────────────────────────────────────────
-- Đuổi: chưa đuổi buổi nào trước · vào sớm hơn trước. Bù (G2): buổi nghỉ cũ hơn trước. Yếu: ưu tiên Cao→Thấp, case mở lâu hơn trước.
-- `vua` = còn đủ đơn vị (đã xác nhận) + chưa kín 3 em/TA + (Đuổi cần ca ≥60'). Chờ PH KHÔNG giữ chỗ (câu 13).
create or replace function public.fn_ca_bo_tro_ung_vien(p_ca uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare c record; t record; v_con int; v_cho_hs int; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - t.so_hs_xn;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;

  with
  duoi as (
    select d.id as ref_id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, d.created_at,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat') as da_hoc,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) as dang_cho,
           d.so_buoi_du_kien
    from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
    where d.trang_thai = 'can_duoi' and d.dang_duyet_at is not null and l.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.ngay = c.ngay)
  ),
  bu as (
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join lop l on l.id = b.lop_id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
    where hh.diem_danh in ('vang', 'vang_phep') and b.loai = 'thuong' and b.trang_thai <> 'huy' and l.mon = c.mon and (c.khoi is null or l.khoi = c.khoi)
      and not exists (select 1 from bang_khong_bu k where k.buoi_hoc_hs_id = hh.id)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                      where x.hoc_sinh_id = hh.hoc_sinh_id and x.bu_cho_buoi_id = hh.buoi_hoc_id and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
  ),
  yeu as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id,
           coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 1) as level,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false)) as so_dang
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_xep_ngay_khac', dang_cho > 0,
        'vua', v_con >= 4 and v_cho_hs > 0 and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'kín ' || 3 * c.so_ta || ' em' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'vua', v_con >= 4 and v_cho_hs > 0, 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'kín ' || 3 * c.so_ta || ' em' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when level <= 1 then 2 else 4 end,
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'vua', v_con >= (case when level <= 1 then 2 else 4 end) and v_cho_hs > 0,
        'ly_do_khong_vua', case when v_cho_hs <= 0 then 'kín ' || 3 * c.so_ta || ' em' when v_con < (case when level <= 1 then 2 else 4 end) then 'cần ' || (case when level <= 1 then 2 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu)
  ) into v_out;
  return v_out;
end $$;
grant execute on function public.fn_ca_bo_tro_ung_vien(uuid) to authenticated;

-- ── 7. Ghi: xếp · xác nhận PH · gỡ · huỷ ca ─────────────────────────────────────────────────────────────────────────
-- Xếp em vào ca (trạng thái CHỜ PH — chưa trừ đơn vị). p_ref: đuổi = bo_tro_duoi.id · bù = buoi_hoc_hs.id lần nghỉ · yếu = bo_tro_yeu.id.
create or replace function public.fn_ca_bo_tro_xep(p_ca uuid, p_loai text, p_hoc_sinh uuid, p_ref uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c record; v_buoi uuid; v_bhh uuid; v_dv smallint; v_nguoi uuid; v_lop uuid; v_ta uuid; v_bu_cho uuid; v_phut int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('duoi', 'bu', 'yeu') then raise exception 'Loại phải là duoi | bu | yeu.'; end if;
  select * into c from ca_bo_tro where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if c.trang_thai <> 'mo' then raise exception 'Ca đã huỷ.'; end if;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;
  if p_loai = 'duoi' and v_phut < 60 then raise exception 'Bổ trợ đuổi cần đủ 1 tiếng — ca này chỉ % phút.', v_phut; end if;
  v_dv := public._ca_bo_tro_don_vi(p_loai, p_hoc_sinh, c.mon);

  -- lớp của em (để tìm TA lớp) + kiểm tra ref thuộc đúng em
  if p_loai = 'duoi' then
    select lop_id into v_lop from bo_tro_duoi where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'can_duoi';
    if not found then raise exception 'Đợt đuổi không hợp lệ.'; end if;
  elsif p_loai = 'bu' then
    select b.lop_id, b.id into v_lop, v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if not found then raise exception 'Lần nghỉ không hợp lệ.'; end if;
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.hoc_sinh_id = p_hoc_sinh and x.bu_cho_buoi_id = v_bu_cho and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
      then raise exception 'Lần nghỉ này đã có buổi bù còn hiệu lực.'; end if;
  else
    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  end if;
  -- người dạy mặc định (câu 6): yếu = người trực; bù/đuổi = TA lớp em nếu đang trực ca này, không thì người trực
  v_ta := case when v_lop is null then null else public._ta_cua_lop(v_lop) end;
  v_nguoi := case when p_loai <> 'yeu' and v_ta is not null and v_ta in (c.nhan_su_id, c.nhan_su_2_id) then v_ta else c.nhan_su_id end;

  if p_loai = 'bu' then
    select id into v_buoi from buoi_hoc where ca_bo_tro_id = p_ca and loai = 'bu' and trang_thai = 'mo' order by created_at limit 1;
  end if;
  if v_buoi is null then
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_id)
    values (case p_loai when 'duoi' then 'bo_tro_duoi' when 'bu' then 'bu' else 'bo_tro_yeu' end, null, c.ngay, public._thu_cua_ngay(c.ngay),
            c.gio_bat_dau, c.gio_ket_thuc, c.phong, v_nguoi, 'mo', public.jwt_uid(), p_ca)
    returning id into v_buoi;
  end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_duoi_id, bu_cho_buoi_id, bo_tro_yeu_id, don_vi)
  values (v_buoi, p_hoc_sinh, case when p_loai = 'duoi' then p_ref end, v_bu_cho, case when p_loai = 'yeu' then p_ref end, v_dv)
  returning id into v_bhh;
  return jsonb_build_object('buoi_hoc_id', v_buoi, 'bhh_id', v_bhh, 'don_vi', v_dv, 'nguoi_day_tg', v_nguoi);
end $$;
grant execute on function public.fn_ca_bo_tro_xep(uuid, text, uuid, uuid) to authenticated;

-- PH đã đồng ý ⇒ Lộc xác nhận ⇒ TRỪ đơn vị. Chặn vượt đơn vị / kín em. "Ai chốt trước chiếm chỗ".
create or replace function public.fn_ca_bo_tro_xac_nhan(p_bhh uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r record; c record; t record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hh.*, b.ca_bo_tro_id, b.trang_thai as buoi_tt into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.ca_bo_tro_id is null then raise exception 'Không thấy lượt xếp.'; end if;
  if r.buoi_tt <> 'mo' then raise exception 'Buổi đã huỷ.'; end if;
  if r.xac_nhan_ph_at is not null then return jsonb_build_object('da_xac_nhan', true); end if;
  select * into c from ca_bo_tro where id = r.ca_bo_tro_id for update;
  select * into t from public._ca_bo_tro_tinh(c.id, p_bhh);
  if t.don_vi_dung + r.don_vi > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ai chốt trước chiếm chỗ trước.', c.don_vi - t.don_vi_dung, r.don_vi; end if;
  if t.so_hs_xn >= 3 * c.so_ta then raise exception 'Ca đã kín % em (3 em/TA).', 3 * c.so_ta; end if;
  update buoi_hoc_hs set xac_nhan_ph_at = now(), xac_nhan_boi = public.jwt_uid() where id = p_bhh;
  return jsonb_build_object('da_xac_nhan', true, 'don_vi_dung', t.don_vi_dung + r.don_vi, 'don_vi', c.don_vi);
end $$;
grant execute on function public.fn_ca_bo_tro_xac_nhan(uuid) to authenticated;

-- Gỡ em khỏi ca (chưa diễn ra): yếu/đuổi = huỷ buổi (giữ dấu); bù = bỏ dòng, buổi bù trống thì huỷ. Trả đơn vị.
create or replace function public.fn_ca_bo_tro_go(p_bhh uuid, p_ly_do text default null) returns void
language plpgsql security definer set search_path = public as $$
declare r record; n int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hh.*, b.loai, b.ca_bo_tro_id into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.ca_bo_tro_id is null then raise exception 'Không thấy lượt xếp.'; end if;
  if r.diem_danh is not null then raise exception 'Em đã điểm danh — ca đã diễn ra, không gỡ được.'; end if;
  if r.loai = 'bu' then
    delete from buoi_hoc_hs where id = p_bhh;
    select count(*) into n from buoi_hoc_hs where buoi_hoc_id = r.buoi_hoc_id;
    if n = 0 then update buoi_hoc set trang_thai = 'huy', ly_do_huy = coalesce(p_ly_do, 'Gỡ khỏi ca bổ trợ (Lịch phòng)'), updated_at = now() where id = r.buoi_hoc_id; end if;
  else
    update buoi_hoc set trang_thai = 'huy', ly_do_huy = coalesce(p_ly_do, 'Gỡ khỏi ca bổ trợ (Lịch phòng)'), updated_at = now() where id = r.buoi_hoc_id;
  end if;
end $$;
grant execute on function public.fn_ca_bo_tro_go(uuid, text) to authenticated;

-- Huỷ cả ca (TA nghỉ…): mọi buổi 'mo' trong ca → huỷ; em về hàng chờ của từng loại.
create or replace function public.fn_ca_bo_tro_huy(p_ca uuid, p_ly_do text) returns integer
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update ca_bo_tro set trang_thai = 'huy', ly_do_huy = p_ly_do, huy_at = now(), huy_boi = public.jwt_uid() where id = p_ca and trang_thai = 'mo';
  if not found then raise exception 'Ca không mở.'; end if;
  update buoi_hoc set trang_thai = 'huy', ly_do_huy = 'Ca bổ trợ huỷ: ' || coalesce(p_ly_do, ''), updated_at = now() where ca_bo_tro_id = p_ca and trang_thai = 'mo';
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function public.fn_ca_bo_tro_huy(uuid, text) to authenticated;

-- Tạo ca ngoài lịch trực (Lộc tạo tay).
create or replace function public.fn_ca_bo_tro_tao(p_ngay date, p_gio_bd time, p_gio_kt time, p_mon text, p_khoi text, p_phong text, p_so_ta integer, p_ns uuid, p_ns2 uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ns is null then raise exception 'Ca phải có người trực.'; end if;
  if p_so_ta = 2 and (p_ns2 is null or p_ns2 = p_ns) then raise exception 'Ca 2 TA phải có người trực thứ 2 khác người 1.'; end if;
  insert into ca_bo_tro (ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  values (p_ngay, p_gio_bd, p_gio_kt, p_mon, nullif(p_khoi, ''), nullif(p_phong, ''), coalesce(p_so_ta, 1), p_ns, case when p_so_ta = 2 then p_ns2 end, public.jwt_uid())
  returning id into v;
  return v;
end $$;
grant execute on function public.fn_ca_bo_tro_tao(date, time, time, text, text, text, integer, uuid, uuid) to authenticated;
