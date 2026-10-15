-- ============================================================================
-- 202610151355 — ĐĂNG KÝ LỊCH TEST (Thùy 15/10). Spec: spec-dang-ky-test.md
-- ----------------------------------------------------------------------------
-- LUỒNG: Lộc dựng KHUNG lịch test cố định theo tuần → PH vào web chọn lớp/trường/môn, mỗi môn
--   chọn 1 khung + giờ bắt đầu (bước 15') → hệ báo giờ xong dự kiến (= bắt đầu + thời lượng bài
--   test của lớp×môn) → tạo ung_vien L5 (mỗi môn 1 lead, §1.6) + 1 dòng HẸN → hòm thư người nhận.
--   Lộc nhập thay PH (Zalo/điện thoại) đi qua CÙNG hàm ghi `_ts_dang_ky_test`.
-- VÌ SAO HẸN LÀ BẢNG RIÊNG, KHÔNG TẠO ca_test: ca_test ra đời khi em ĐÃ CÓ MẶT (Ops điểm danh, L5→L6).
--   Tạo ca_test lúc đăng ký = "insert trước, điền sau" (§1.5) và phá hàng đợi Điểm danh test.
--   "Đã đến" = SUY từ việc có ca_test của (ung_vien, môn); "lỡ hẹn" = suy từ giờ xong đã qua.
-- THỜI LƯỢNG: bảng riêng (lớp × môn). Chưa khai = KHÔNG có dòng ⇒ môn đó chưa mở trên web,
--   màn Lộc nêu thành việc cần làm (must-exist: lớp×môn đang có lớp học / does-exist: thời lượng).
--   KHÔNG seed: lịch sử ca_test mỗi khối dùng 2–3 thời lượng khác nhau, đoán = đánh sai.
-- TRƯỜNG: danh mục nháp gom tay từ hoc_sinh.truong_hoc (73 tên, nhiều biến thể) — Lộc sửa được.
--   ung_vien.truong_hoc vẫn lưu TÊN (cùng kiểu hoc_sinh.truong_hoc, convert copy thẳng) ⇒ danh mục
--   dùng kho rác `xoa_at`, không xoá cứng. PH chọn "Trường khác" ⇒ hẹn mang cờ truong_tu_go.
-- HÒM THƯ: dùng loai 'viec' sẵn có (không đụng CHECK hom_thu). Người nhận = bảng tuyen_sinh_nhan_bao.
-- QUYỀN: web gọi qua Edge Function `dang-ky-test` (service_role) ⇒ hàm _web chỉ grant service_role.
-- MẤT GÌ (Luật xoá): không. Chỉ create table/function/trigger/policy + insert danh mục.
-- ============================================================================

-- ── 1. KHUNG LỊCH TEST (mẫu tuần) ───────────────────────────────────────────
create table if not exists public.lich_test_khung (
  id            uuid primary key default gen_random_uuid(),
  thu           smallint not null check (thu between 1 and 7),          -- ISO: 1 = Thứ 2 … 7 = Chủ nhật
  gio_bat_dau   time not null,
  gio_ket_thuc  time not null,
  xoa_at        timestamptz,                                              -- kho rác: hẹn cũ vẫn trỏ được
  created_by    uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (gio_ket_thuc > gio_bat_dau),
  check (extract(minute from gio_bat_dau)::int % 15 = 0 and extract(second from gio_bat_dau) = 0),
  check (extract(minute from gio_ket_thuc)::int % 15 = 0 and extract(second from gio_ket_thuc) = 0)
);
comment on table public.lich_test_khung is 'Khung lịch test cố định theo tuần (Lộc dựng). PH chọn khung + giờ bắt đầu bước 15 phút. Xoá = set xoa_at.';

-- Đóng 1 buổi cụ thể (nghỉ lễ…). Có dòng = buổi đó đóng; mở lại = xoá dòng.
create table if not exists public.lich_test_dong (
  khung_id    uuid not null references public.lich_test_khung(id),
  ngay        date not null,
  ly_do       text,
  created_by  uuid,
  created_at  timestamptz not null default now(),
  primary key (khung_id, ngay)
);

-- ── 2. THỜI LƯỢNG BÀI TEST theo (lớp ở trường × môn) ────────────────────────
create table if not exists public.test_dau_vao_thoi_luong (
  khoi             text not null check (khoi ~ '^(1[0-2]|[1-9])$'),       -- lớp ở trường 1..12
  mon              text not null,
  thoi_luong_phut  integer not null check (thoi_luong_phut = any (array[45, 60, 75, 90, 120])),
  updated_by       uuid,
  updated_at       timestamptz not null default now(),
  primary key (khoi, mon)
);
comment on table public.test_dau_vao_thoi_luong is 'Thời lượng bài test đầu vào theo lớp (ở trường) × môn. Không có dòng = môn đó chưa mở đăng ký trên web.';

-- ── 3. DANH MỤC TRƯỜNG ─────────────────────────────────────────────────────
create table if not exists public.truong_hoc_dm (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null unique check (length(btrim(ten)) between 2 and 120),
  cap         text[] not null default '{}' check (cap <@ array['tieu_hoc', 'thcs', 'thpt']),  -- rỗng = liên cấp/hiện mọi lớp
  xoa_at      timestamptz,
  created_by  uuid,
  created_at  timestamptz not null default now()
);
comment on table public.truong_hoc_dm is 'Danh mục trường cho form đăng ký test. cap rỗng = hiện ở mọi lớp. Xoá = set xoa_at (ung_vien/hoc_sinh lưu tên dạng text).';

insert into public.truong_hoc_dm (ten, cap) values
  ('THCS Tây Mỗ', '{thcs}'), ('THCS Tây Mỗ 1', '{thcs}'), ('THCS Tây Mỗ 2', '{thcs}'), ('THCS Tây Mỗ 3', '{thcs}'),
  ('THCS An Khánh', '{thcs}'), ('THCS Nam Từ Liêm', '{thcs}'), ('THCS Lê Quý Đôn', '{thcs}'),
  ('THCS Nguyễn Văn Huyên', '{thcs}'), ('THCS Đoàn Thị Điểm', '{thcs}'), ('THCS Nam Trung Yên', '{thcs}'),
  ('THCS Nguyễn Quý Đức', '{thcs}'), ('THCS Trần Duy Hưng', '{thcs}'), ('THCS Thanh Xuân', '{thcs}'),
  ('THCS Từ Liêm 2', '{thcs}'), ('THCS Ngôi Sao Hà Nội', '{thcs}'), ('THCS Ngoại Ngữ', '{thcs}'),
  ('THCS Nguyễn Trãi', '{thcs}'), ('THCS Mỹ Đình', '{thcs}'), ('THCS Minh Khai', '{thcs}'),
  ('THPT Mỹ Đình', '{thpt}'), ('THPT Hoài Đức B', '{thpt}'), ('THPT Quang Trung - Hà Đông', '{thpt}'),
  ('THPT Đại Mỗ', '{thpt}'), ('THPT Xuân Phương', '{thpt}'), ('THPT Khoa học Giáo dục', '{thpt}'), ('THPT VIS', '{thpt}'),
  ('Tiểu học Nguyễn Du', '{tieu_hoc}'), ('Tiểu học An Hưng', '{tieu_hoc}'), ('Tiểu học An Khánh B', '{tieu_hoc}'),
  ('Tiểu học Yên Hoà', '{tieu_hoc}'), ('Tiểu học Dương Nội', '{tieu_hoc}'), ('Tiểu học Tây Mỗ 1', '{tieu_hoc}'),
  ('Lômônôxốp Tây Hà Nội', '{}'), ('Lômônôxốp Mỹ Đình', '{}'), ('Lương Thế Vinh', '{}'), ('Nguyễn Tất Thành', '{}'),
  ('Marie Curie', '{}'), ('Marie Curie Văn Phú', '{}'), ('Alpha School', '{}'), ('Vinschool Smart City', '{}'),
  ('Edison Mailand An Khánh', '{}')
on conflict (ten) do nothing;

-- ── 4. HẸN TEST (1 dòng = 1 môn của 1 lần đăng ký) ──────────────────────────
create table if not exists public.dang_ky_test (
  id               uuid primary key default gen_random_uuid(),
  lan_dk_id        uuid not null,                                           -- 1 lần bấm gửi (gom các môn)
  ung_vien_id      uuid not null references public.ung_vien(id),
  mon              text not null,
  khung_id         uuid not null references public.lich_test_khung(id),
  ngay             date not null,
  gio_bat_dau      time not null,
  thoi_luong_phut  integer not null check (thoi_luong_phut = any (array[45, 60, 75, 90, 120])),
  gio_xong         time generated always as (gio_bat_dau + thoi_luong_phut * interval '1 minute') stored,
  nguon            text not null check (nguon in ('web', 'nhap_thay')),
  kenh             text check (kenh in ('zalo', 'dien_thoai', 'truc_tiep', 'khac')),  -- chỉ áp dụng cho nhap_thay
  truong_tu_go     boolean not null default false,
  trang_thai       text not null default 'hen' check (trang_thai in ('hen', 'huy')),
  huy_ly_do        text,
  created_by       uuid,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check ((nguon = 'web') = (kenh is null)),
  check ((trang_thai = 'huy') = (huy_ly_do is not null))
);
create unique index if not exists dang_ky_test_1_hen_moi_uv on public.dang_ky_test (ung_vien_id) where trang_thai = 'hen';
create index if not exists dang_ky_test_ngay on public.dang_ky_test (ngay);
comment on table public.dang_ky_test is 'Hẹn test đầu vào (web hoặc Lộc nhập thay). Đã đến = có ca_test của (ung_vien, môn); lỡ hẹn = suy từ giờ xong đã qua. Ghi qua RPC fn_ts_*.';

-- Người nhận hòm thư khi có đăng ký mới
create table if not exists public.tuyen_sinh_nhan_bao (
  nhan_su_id  uuid primary key references public.nhan_su(id),
  created_at  timestamptz not null default now()
);
insert into public.tuyen_sinh_nhan_bao (nhan_su_id)
select id from public.nhan_su where id = 'b99976e5-e203-4b34-8984-d4a63e03b9e4'   -- Trần Bảo Lộc
on conflict do nothing;

-- Sổ chống spam web (chỉ hàm definer ghi/đọc)
create table if not exists public.dang_ky_test_web_log (
  id          bigint generated always as identity primary key,
  ip          text,
  sdt         text not null,
  created_at  timestamptz not null default now()
);
create index if not exists dang_ky_test_web_log_ip on public.dang_ky_test_web_log (ip, created_at);
create index if not exists dang_ky_test_web_log_sdt on public.dang_ky_test_web_log (sdt, created_at);

-- ── 5. VẾT (§4: mọi đổi state ghi vết bằng trigger) ─────────────────────────
create table if not exists public.lich_test_log (
  id         bigint generated always as identity primary key,
  bang       text not null,
  khoa       text not null,
  hanh_dong  text not null,
  truoc      jsonb,
  sau        jsonb,
  actor      uuid,
  at         timestamptz not null default now()
);

create or replace function public._lich_test_ghi_log() returns trigger
language plpgsql security definer set search_path = public as $$
declare r jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
begin
  insert into lich_test_log (bang, khoa, hanh_dong, truoc, sau, actor)
  values (tg_table_name,
          coalesce(r->>'id', (r->>'khung_id') || '@' || (r->>'ngay'), (r->>'khoi') || '·' || (r->>'mon'), (r->>'nhan_su_id')),
          lower(tg_op),
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end,
          public.jwt_uid());
  return null;
end $$;

create or replace function public._lich_test_cham_updated() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['lich_test_khung', 'lich_test_dong', 'test_dau_vao_thoi_luong', 'dang_ky_test', 'tuyen_sinh_nhan_bao', 'truong_hoc_dm'] loop
    execute format('drop trigger if exists trg_log_%1$s on public.%1$I', t);
    execute format('create trigger trg_log_%1$s after insert or update or delete on public.%1$I for each row execute function public._lich_test_ghi_log()', t);
  end loop;
  foreach t in array array['lich_test_khung', 'test_dau_vao_thoi_luong', 'dang_ky_test'] loop
    execute format('drop trigger if exists trg_updated_%1$s on public.%1$I', t);
    execute format('create trigger trg_updated_%1$s before update on public.%1$I for each row execute function public._lich_test_cham_updated()', t);
  end loop;
end $$;

-- ── 6. RLS ─────────────────────────────────────────────────────────────────
alter table public.lich_test_khung         enable row level security;
alter table public.lich_test_dong          enable row level security;
alter table public.test_dau_vao_thoi_luong enable row level security;
alter table public.truong_hoc_dm           enable row level security;
alter table public.dang_ky_test            enable row level security;
alter table public.tuyen_sinh_nhan_bao     enable row level security;
alter table public.dang_ky_test_web_log    enable row level security;   -- không policy: chỉ hàm definer
alter table public.lich_test_log           enable row level security;

do $$
declare t text;
begin
  -- CRUD dòng đơn từ màn Lộc
  foreach t in array array['lich_test_khung', 'lich_test_dong', 'test_dau_vao_thoi_luong', 'truong_hoc_dm', 'tuyen_sinh_nhan_bao'] loop
    execute format('drop policy if exists %1$s_member_all on public.%1$I', t);
    execute format('create policy %1$s_member_all on public.%1$I for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien())', t);
  end loop;
  -- Hẹn + vết: chỉ đọc, ghi qua RPC
  foreach t in array array['dang_ky_test', 'lich_test_log'] loop
    execute format('drop policy if exists %1$s_member_select on public.%1$I', t);
    execute format('create policy %1$s_member_select on public.%1$I for select to authenticated using (public.la_thanh_vien())', t);
  end loop;
end $$;

-- ── 7. HÀM NỀN ─────────────────────────────────────────────────────────────
create or replace function public._ts_gio_vn() returns timestamp
language sql stable as $$ select (now() at time zone 'Asia/Ho_Chi_Minh') $$;

-- SĐT VN chuẩn 0xxxxxxxxx (nhận +84 / 84 / dấu cách / chấm). Sai dạng ⇒ NULL.
create or replace function public._ts_sdt_chuan(p text) returns text
language sql immutable as $$
  select case when d ~ '^0[35789][0-9]{8}$' then d end
  from (select case when x ~ '^84[0-9]{9}$' then '0' || substr(x, 3) else x end as d
        from (select regexp_replace(coalesce(p, ''), '\D', '', 'g') as x) a) b
$$;

create or replace function public._ts_ten_chuan(p text) returns text
language sql immutable as $$ select regexp_replace(btrim(coalesce(p, '')), '\s+', ' ', 'g') $$;

-- Lớp ở trường của 1 khối BK ('8T' → '8')
create or replace function public._ts_lop_cua_khoi(p_khoi text) returns text
language sql immutable as $$ select nullif(regexp_replace(coalesce(p_khoi, ''), '\D', '', 'g'), '') $$;

-- Môn mở test của từng lớp = môn đang có lớp học ở khối đó; thời lượng NULL = chưa khai (kết quả suy, không lưu)
create or replace function public._ts_mon_theo_lop()
returns table (lop text, mon text, thoi_luong_phut integer)
language sql stable as $$
  select distinct public._ts_lop_cua_khoi(l.khoi), l.mon, t.thoi_luong_phut
  from lop l
  left join test_dau_vao_thoi_luong t on t.khoi = public._ts_lop_cua_khoi(l.khoi) and t.mon = l.mon
  where l.trang_thai = 'dang_hoc' and public._ts_lop_cua_khoi(l.khoi) ~ '^(1[0-2]|[1-9])$'
$$;

-- Các buổi test đang mở trong [p_tu, p_den] (khung chưa xoá, buổi chưa đóng)
create or replace function public._ts_buoi_mo(p_tu date, p_den date)
returns table (khung_id uuid, ngay date, tu time, den time)
language sql stable as $$
  select k.id, d::date, k.gio_bat_dau, k.gio_ket_thuc
  from generate_series(p_tu, p_den, interval '1 day') d
  join lich_test_khung k on k.thu = extract(isodow from d)::int and k.xoa_at is null
  where not exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = d::date)
$$;

-- Giờ bắt đầu hợp lệ của 1 buổi cho 1 thời lượng: bước 15', xong trước hết khung, không sớm hơn p_som
create or replace function public._ts_gio_trong_buoi(p_ngay date, p_tu time, p_den time, p_tl integer, p_som timestamp)
returns table (bat_dau time, xong time)
language sql immutable as $$
  select g::time, (g + p_tl * interval '1 minute')::time
  from generate_series(p_ngay + p_tu, p_ngay + p_den - p_tl * interval '1 minute', interval '15 minutes') g
  where g >= p_som
$$;

-- ── 8. DỮ LIỆU FORM (web + ERP dùng chung) ──────────────────────────────────
-- p_so_ngay: số ngày PH thấy phía trước · p_som_phut: giờ bắt đầu phải cách bây giờ ít nhất bao nhiêu phút
create or replace function public.fn_ts_dk_form(p_so_ngay integer default 14, p_som_phut integer default 60)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_now  timestamp := public._ts_gio_vn();
  v_som  timestamp := v_now + greatest(p_som_phut, 0) * interval '1 minute';
  v_tu   date := v_now::date;
  v_den  date := v_now::date + least(greatest(p_so_ngay, 1), 90) - 1;
  v jsonb;
begin
  with mt as (select * from public._ts_mon_theo_lop()),
  tls as (select distinct thoi_luong_phut tl from mt where thoi_luong_phut is not null),
  buoi as (
    select b.*, (select jsonb_object_agg(tls.tl::text, s.gio)
                 from tls cross join lateral (
                   select jsonb_agg(jsonb_build_object('bat_dau', to_char(g.bat_dau, 'HH24:MI'), 'xong', to_char(g.xong, 'HH24:MI')) order by g.bat_dau) gio
                   from public._ts_gio_trong_buoi(b.ngay, b.tu, b.den, tls.tl, v_som) g) s
                 where s.gio is not null) as gio
    from public._ts_buoi_mo(v_tu, v_den) b
  )
  select jsonb_build_object(
    'hom_nay', v_tu,
    'lop', coalesce((select jsonb_agg(jsonb_build_object('lop', x.lop, 'mon', x.mon) order by x.lop::int) from (
              select lop, jsonb_agg(jsonb_build_object('mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by mon) mon
              from mt where thoi_luong_phut is not null group by lop) x), '[]'::jsonb),
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by lop::int, mon)
                                  from mt where thoi_luong_phut is null), '[]'::jsonb),
    'truong', coalesce((select jsonb_agg(jsonb_build_object('ten', ten, 'cap', cap) order by ten)
                        from truong_hoc_dm where xoa_at is null), '[]'::jsonb),
    'lich', coalesce((select jsonb_agg(jsonb_build_object(
                        'khung_id', khung_id, 'ngay', ngay, 'thu', extract(isodow from ngay)::int,
                        'tu', to_char(tu, 'HH24:MI'), 'den', to_char(den, 'HH24:MI'), 'gio', gio) order by ngay, tu)
                      from buoi where gio is not null), '[]'::jsonb)
  ) into v;
  return v;
end $$;

-- Kiểm 1 slot. Trả NULL nếu hợp lệ, ngược lại câu báo lỗi cho người điền.
create or replace function public._ts_kiem_slot(p_khung uuid, p_ngay date, p_bd time, p_tl integer, p_som timestamp, p_max_ngay integer)
returns text
language plpgsql stable security definer set search_path = public as $$
declare k lich_test_khung;
begin
  select * into k from lich_test_khung where id = p_khung;
  if not found or k.xoa_at is not null then return 'Khung lịch test này không còn mở, bố mẹ chọn lại giúp trung tâm.'; end if;
  if k.thu <> extract(isodow from p_ngay)::int then return 'Ngày đã chọn không khớp khung lịch test.'; end if;
  if p_ngay > public._ts_gio_vn()::date + p_max_ngay then return 'Ngày test quá xa, bố mẹ chọn ngày gần hơn.'; end if;
  if exists (select 1 from lich_test_dong where khung_id = p_khung and ngay = p_ngay) then
    return 'Buổi test ' || to_char(p_ngay, 'DD/MM') || ' đã đóng, bố mẹ chọn buổi khác giúp trung tâm.';
  end if;
  if not exists (select 1 from public._ts_gio_trong_buoi(p_ngay, k.gio_bat_dau, k.gio_ket_thuc, p_tl, p_som) g where g.bat_dau = p_bd) then
    return 'Giờ ' || to_char(p_bd, 'HH24:MI') || ' ngày ' || to_char(p_ngay, 'DD/MM') || ' không còn hợp lệ (đã qua hoặc làm bài sẽ quá giờ đóng cửa), bố mẹ chọn giờ khác.';
  end if;
  return null;
end $$;

-- ── 9. GHI ĐĂNG KÝ (đường chung) ────────────────────────────────────────────
-- p = { ho_ten_hs, sdt_ph, lop, truong, truong_tu_go, nguon_lead?, ghi_chu?, mon: [{mon, khung_id, ngay, gio_bat_dau}] }
create or replace function public._ts_dang_ky_test(
  p jsonb, p_nguon text, p_kenh text, p_tu_nhan_su uuid, p_max_ngay integer, p_som timestamp
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_ten     text := public._ts_ten_chuan(p->>'ho_ten_hs');
  v_sdt     text := public._ts_sdt_chuan(p->>'sdt_ph');
  v_lop     text := btrim(coalesce(p->>'lop', ''));
  v_truong  text := public._ts_ten_chuan(p->>'truong');
  v_tu_go   boolean := coalesce((p->>'truong_tu_go')::boolean, false);
  v_lan     uuid := gen_random_uuid();
  v_uid     uuid := public.jwt_uid();
  v_item    jsonb;
  v_mon     text; v_khung uuid; v_ngay date; v_bd time; v_tl integer; v_err text;
  v_uv      uuid; v_uv_moi boolean; v_ma text; v_hen uuid;
  v_ra      jsonb := '[]'::jsonb;
  v_dong    text := '';
  v_ph_cu   text;
  v_lai     integer := 0;
  r         record;
begin
  if length(v_ten) < 2 or length(v_ten) > 80 then raise exception 'Bố mẹ điền họ tên của con giúp trung tâm.'; end if;
  if v_sdt is null then raise exception 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; end if;
  if v_lop !~ '^(1[0-2]|[1-9])$' then raise exception 'Bố mẹ chọn lớp con đang học.'; end if;
  if length(v_truong) < 2 then raise exception 'Bố mẹ chọn trường của con.'; end if;
  if not v_tu_go and not exists (select 1 from truong_hoc_dm where ten = v_truong and xoa_at is null) then
    raise exception 'Trường đã chọn không còn trong danh sách, bố mẹ chọn lại.';
  end if;
  if jsonb_typeof(p->'mon') <> 'array' or jsonb_array_length(p->'mon') = 0 then raise exception 'Bố mẹ tích ít nhất 1 môn.'; end if;
  if jsonb_array_length(p->'mon') > 4 then raise exception 'Tối đa 4 môn.'; end if;
  if (select count(distinct x->>'mon') from jsonb_array_elements(p->'mon') x) <> jsonb_array_length(p->'mon') then
    raise exception 'Mỗi môn chỉ chọn 1 lịch.';
  end if;

  -- Kiểm từng môn + slot
  create temp table if not exists _ts_dk_tmp (mon text, khung_id uuid, ngay date, bd time, tl integer) on commit drop;
  truncate _ts_dk_tmp;
  for v_item in select * from jsonb_array_elements(p->'mon') loop
    v_mon := v_item->>'mon'; v_khung := (v_item->>'khung_id')::uuid; v_ngay := (v_item->>'ngay')::date; v_bd := (v_item->>'gio_bat_dau')::time;
    select m.thoi_luong_phut into v_tl from public._ts_mon_theo_lop() m where m.lop = v_lop and m.mon = v_mon and m.thoi_luong_phut is not null;
    if v_tl is null then raise exception 'Môn % hiện chưa mở test cho lớp %.', v_mon, v_lop; end if;
    v_err := public._ts_kiem_slot(v_khung, v_ngay, v_bd, v_tl, p_som, p_max_ngay);
    if v_err is not null then raise exception '%: %', v_mon, v_err; end if;
    insert into _ts_dk_tmp values (v_mon, v_khung, v_ngay, v_bd, v_tl);
  end loop;
  -- Các môn không được chồng giờ nhau
  if exists (select 1 from _ts_dk_tmp a join _ts_dk_tmp b on a.mon < b.mon and a.ngay = b.ngay
             where a.bd < b.bd + b.tl * interval '1 minute' and b.bd < a.bd + a.tl * interval '1 minute') then
    raise exception 'Hai môn đang bị trùng giờ nhau, bố mẹ chọn giờ lệch ra giúp trung tâm.';
  end if;

  select string_agg(ho_ten, ', ') into v_ph_cu from phu_huynh where public._ts_sdt_chuan(so_dien_thoai) = v_sdt;

  perform pg_advisory_xact_lock(hashtext('ung_vien.ma_uv'));
  for r in select * from _ts_dk_tmp order by ngay, bd loop
    -- Lead đang chạy cùng SĐT + tên + môn ⇒ dùng lại (đăng ký lại = đổi lịch), không đẻ trùng
    select u.id into v_uv from ung_vien u
     where u.trang_thai = 'dang_chay' and u.mon = r.mon
       and public._ts_sdt_chuan(u.sdt_ph) = v_sdt and lower(public._ts_ten_chuan(u.ho_ten_hs)) = lower(v_ten)
     order by u.created_at desc limit 1;
    v_uv_moi := v_uv is null;
    if v_uv_moi then
      select 'UV' || lpad((coalesce(max((substring(ma_uv from '\d+'))::int), 0) + 1)::text, 4, '0') into v_ma
        from ung_vien where ma_uv ~ '\d';
      insert into ung_vien (ma_uv, ho_ten_hs, sdt_ph, khoi, mon, truong_hoc, nguon, level, ghi_chu, created_by)
      values (v_ma, v_ten, v_sdt, v_lop, r.mon, v_truong,
              case when p_nguon = 'web' then 'web' else nullif(btrim(coalesce(p->>'nguon_lead', '')), '') end,
              'L5', nullif(btrim(coalesce(p->>'ghi_chu', '')), ''), v_uid)
      returning id into v_uv;
    else
      v_lai := v_lai + 1;
      update dang_ky_test set trang_thai = 'huy', huy_ly_do = 'Đăng ký lại lịch mới'
       where ung_vien_id = v_uv and trang_thai = 'hen';
    end if;
    insert into dang_ky_test (lan_dk_id, ung_vien_id, mon, khung_id, ngay, gio_bat_dau, thoi_luong_phut, nguon, kenh, truong_tu_go, created_by)
    values (v_lan, v_uv, r.mon, r.khung_id, r.ngay, r.bd, r.tl, p_nguon, case when p_nguon = 'web' then null else p_kenh end, v_tu_go, v_uid)
    returning id into v_hen;
    v_ra := v_ra || jsonb_build_object('mon', r.mon, 'ngay', r.ngay, 'thu', extract(isodow from r.ngay)::int,
              'gio_bat_dau', to_char(r.bd, 'HH24:MI'), 'gio_xong', to_char(r.bd + r.tl * interval '1 minute', 'HH24:MI'),
              'thoi_luong_phut', r.tl, 'dang_ky_lai', not v_uv_moi);
    v_dong := v_dong || '• ' || r.mon || ': ' || to_char(r.ngay, 'DD/MM') || ' · ' || to_char(r.bd, 'HH24:MI') || '–'
              || to_char(r.bd + r.tl * interval '1 minute', 'HH24:MI') || ' (' || r.tl || '′)'
              || case when v_uv_moi then '' else ' — đăng ký LẠI, lịch cũ đã huỷ' end || E'\n';
  end loop;

  -- Hòm thư người nhận
  for r in select nhan_su_id from tuyen_sinh_nhan_bao loop
    perform public._hom_thu_gui(r.nhan_su_id, 'viec',
      '📅 Đăng ký test: ' || v_ten || ' (lớp ' || v_lop || ')',
      v_dong
        || 'SĐT PH: ' || v_sdt || E'\n'
        || 'Trường: ' || v_truong || case when v_tu_go then ' (PH tự gõ — cần chuẩn hoá)' else '' end || E'\n'
        || 'Nguồn: ' || case when p_nguon = 'web' then 'Web' else 'Nhập thay PH' || coalesce(' (' || p_kenh || ')', '') end
        || coalesce(E'\n⚠ SĐT trùng phụ huynh cũ: ' || v_ph_cu, ''),
      'tuyensinh', p_tu_nhan_su);
  end loop;

  return jsonb_build_object('lan_dk_id', v_lan, 'ho_ten_hs', v_ten, 'lop', v_lop, 'mon', v_ra);
end $$;

-- Web (qua Edge Function, service_role): chống spam theo IP + SĐT
create or replace function public.fn_ts_dang_ky_test_web(p jsonb, p_ip text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_sdt text := public._ts_sdt_chuan(p->>'sdt_ph'); v jsonb;
begin
  if p_ip is not null and (select count(*) from dang_ky_test_web_log where ip = p_ip and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Bố mẹ đã gửi nhiều lần, vui lòng thử lại sau ít phút hoặc nhắn Zalo cho trung tâm.';
  end if;
  if v_sdt is not null and (select count(*) from dang_ky_test_web_log where sdt = v_sdt and created_at > now() - interval '1 day') >= 5 then
    raise exception 'Số điện thoại này đã đăng ký nhiều lần hôm nay, trung tâm sẽ liên hệ lại bố mẹ.';
  end if;
  v := public._ts_dang_ky_test(p, 'web', null, null, 14, public._ts_gio_vn() + interval '60 minutes');
  insert into dang_ky_test_web_log (ip, sdt) values (p_ip, v_sdt);
  return v;
end $$;

-- ERP: Lộc nhập thay PH (cùng luật, nhưng cho chọn xa hơn và sát giờ hơn)
create or replace function public.fn_ts_dang_ky_test_nhap(p jsonb, p_kenh text)
returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền'; end if;
  if p_kenh is null or p_kenh not in ('zalo', 'dien_thoai', 'truc_tiep', 'khac') then raise exception 'Chọn kênh PH báo (Zalo / Điện thoại / Trực tiếp / Khác)'; end if;
  return public._ts_dang_ky_test(p, 'nhap_thay', p_kenh, public.current_nhan_su_id(), 60, public._ts_gio_vn());
end $$;

-- ── 10. MÀN LỘC ────────────────────────────────────────────────────────────
-- Tổng quan: buổi test [p_tu, p_tu + p_so_ngay) kèm hẹn · hẹn lỡ (30 ngày) · trường PH tự gõ · thời lượng còn thiếu
create or replace function public.fn_ts_lich_test_tong_quan(p_tu date default null, p_so_ngay integer default 14)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_now timestamp := public._ts_gio_vn();
  v_tu  date := coalesce(p_tu, v_now::date);
  v_den date := coalesce(p_tu, v_now::date) + least(greatest(p_so_ngay, 1), 90) - 1;
  v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền'; end if;
  with hen as (
    select h.*, u.ma_uv, u.ho_ten_hs, u.sdt_ph, u.khoi as lop, u.truong_hoc, u.level, u.trang_thai as uv_trang_thai,
           exists (select 1 from ca_test c where c.ung_vien_id = h.ung_vien_id and c.mon = h.mon and c.trang_thai <> 'huy') as da_den
    from dang_ky_test h join ung_vien u on u.id = h.ung_vien_id
    where h.trang_thai = 'hen'
  ),
  hen_j as (
    select h.*, jsonb_build_object(
      'id', h.id, 'lan_dk_id', h.lan_dk_id, 'ung_vien_id', h.ung_vien_id, 'ma_uv', h.ma_uv, 'ho_ten_hs', h.ho_ten_hs,
      'sdt_ph', h.sdt_ph, 'lop', h.lop, 'truong', h.truong_hoc, 'mon', h.mon, 'khung_id', h.khung_id, 'ngay', h.ngay,
      'gio_bat_dau', to_char(h.gio_bat_dau, 'HH24:MI'), 'gio_xong', to_char(h.gio_xong, 'HH24:MI'), 'thoi_luong_phut', h.thoi_luong_phut,
      'nguon', h.nguon, 'kenh', h.kenh, 'truong_tu_go', h.truong_tu_go, 'created_at', h.created_at,
      'tinh_trang', case when h.da_den then 'da_den' when (h.ngay + h.gio_xong) < v_now then 'lo_hen' else 'cho' end) j
    from hen h
  ),
  buoi as (
    select k.id khung_id, d::date ngay, k.gio_bat_dau tu, k.gio_ket_thuc den, k.xoa_at is not null khung_da_xoa,
           exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = d::date) dong
    from generate_series(v_tu, v_den, interval '1 day') d
    join lich_test_khung k on k.thu = extract(isodow from d)::int and k.xoa_at is null
    union
    select k.id, h.ngay, k.gio_bat_dau, k.gio_ket_thuc, k.xoa_at is not null,
           exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = h.ngay)
    from hen h join lich_test_khung k on k.id = h.khung_id
    where h.ngay between v_tu and v_den
  )
  select jsonb_build_object(
    'tu', v_tu, 'den', v_den,
    'buoi', coalesce((select jsonb_agg(jsonb_build_object(
               'khung_id', b.khung_id, 'ngay', b.ngay, 'thu', extract(isodow from b.ngay)::int,
               'tu', to_char(b.tu, 'HH24:MI'), 'den', to_char(b.den, 'HH24:MI'), 'dong', b.dong, 'khung_da_xoa', b.khung_da_xoa,
               'hen', coalesce((select jsonb_agg(hj.j order by hj.gio_bat_dau, hj.ho_ten_hs) from hen_j hj
                                where hj.khung_id = b.khung_id and hj.ngay = b.ngay), '[]'::jsonb)) order by b.ngay, b.tu)
             from buoi b), '[]'::jsonb),
    'lo_hen', coalesce((select jsonb_agg(hj.j order by hj.ngay desc, hj.gio_bat_dau) from hen_j hj
                        where hj.j->>'tinh_trang' = 'lo_hen' and hj.ngay >= v_now::date - 30), '[]'::jsonb),
    'truong_tu_go', coalesce((select jsonb_agg(jsonb_build_object('ten', t.ten, 'so_hen', t.n) order by t.n desc, t.ten) from (
                       select h.truong_hoc ten, count(*)::int n from hen h
                       where h.truong_tu_go and h.truong_hoc is not null
                         and not exists (select 1 from truong_hoc_dm d where d.ten = h.truong_hoc and d.xoa_at is null)
                       group by 1) t), '[]'::jsonb),
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by lop::int, mon)
                                  from public._ts_mon_theo_lop() where thoi_luong_phut is null), '[]'::jsonb),
    'mon_theo_lop', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by lop::int, mon)
                              from public._ts_mon_theo_lop()), '[]'::jsonb)
  ) into v;
  return v;
end $$;

-- Lộc đổi lịch 1 hẹn (PH báo qua Zalo)
create or replace function public.fn_ts_hen_doi_lich(p_id uuid, p_khung uuid, p_ngay date, p_gio time)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare h dang_ky_test; v_err text;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền'; end if;
  select * into h from dang_ky_test where id = p_id for update;
  if not found or h.trang_thai <> 'hen' then raise exception 'Hẹn không còn hiệu lực'; end if;
  v_err := public._ts_kiem_slot(p_khung, p_ngay, p_gio, h.thoi_luong_phut, public._ts_gio_vn(), 60);
  if v_err is not null then raise exception '%', v_err; end if;
  if exists (select 1 from dang_ky_test o where o.lan_dk_id = h.lan_dk_id and o.id <> h.id and o.trang_thai = 'hen' and o.ngay = p_ngay
             and o.gio_bat_dau < p_gio + h.thoi_luong_phut * interval '1 minute' and p_gio < o.gio_xong) then
    raise exception 'Trùng giờ với môn khác của cùng em';
  end if;
  update dang_ky_test set khung_id = p_khung, ngay = p_ngay, gio_bat_dau = p_gio where id = p_id;
  return jsonb_build_object('id', p_id, 'khung_id', p_khung, 'ngay', p_ngay, 'gio_bat_dau', to_char(p_gio, 'HH24:MI'),
                            'gio_xong', to_char(p_gio + h.thoi_luong_phut * interval '1 minute', 'HH24:MI'));
end $$;

create or replace function public.fn_ts_hen_huy(p_id uuid, p_ly_do text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền'; end if;
  if length(btrim(coalesce(p_ly_do, ''))) = 0 then raise exception 'Ghi lý do huỷ'; end if;
  update dang_ky_test set trang_thai = 'huy', huy_ly_do = btrim(p_ly_do) where id = p_id and trang_thai = 'hen';
  if not found then raise exception 'Hẹn không còn hiệu lực'; end if;
end $$;

-- Hẹn đang hiệu lực của 1 ứng viên (Điểm danh test điền sẵn ngày/giờ/thời lượng)
create or replace function public.fn_ts_hen_cua_ung_vien(p_ung_vien uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select case when public.la_thanh_vien() then
    (select jsonb_build_object('ngay', ngay, 'gio_bat_dau', to_char(gio_bat_dau, 'HH24:MI'), 'thoi_luong_phut', thoi_luong_phut)
     from dang_ky_test where ung_vien_id = p_ung_vien and trang_thai = 'hen') end
$$;

-- ── 11. QUYỀN HÀM ──────────────────────────────────────────────────────────
do $$
declare f text;
begin
  foreach f in array array[
    'public._lich_test_ghi_log()', 'public._ts_kiem_slot(uuid, date, time, integer, timestamp, integer)',
    'public._ts_dang_ky_test(jsonb, text, text, uuid, integer, timestamp)',
    'public.fn_ts_dk_form(integer, integer)', 'public.fn_ts_dang_ky_test_web(jsonb, text)',
    'public.fn_ts_dang_ky_test_nhap(jsonb, text)', 'public.fn_ts_lich_test_tong_quan(date, integer)',
    'public.fn_ts_hen_doi_lich(uuid, uuid, date, time)', 'public.fn_ts_hen_huy(uuid, text)', 'public.fn_ts_hen_cua_ung_vien(uuid)'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
  end loop;
end $$;
revoke all on function public._ts_dang_ky_test(jsonb, text, text, uuid, integer, timestamp) from authenticated;
revoke all on function public._ts_kiem_slot(uuid, date, time, integer, timestamp, integer) from authenticated;
grant execute on function public.fn_ts_dk_form(integer, integer) to authenticated, service_role;
grant execute on function public.fn_ts_dang_ky_test_web(jsonb, text) to service_role;
grant execute on function public.fn_ts_dang_ky_test_nhap(jsonb, text) to authenticated;
grant execute on function public.fn_ts_lich_test_tong_quan(date, integer) to authenticated;
grant execute on function public.fn_ts_hen_doi_lich(uuid, uuid, date, time) to authenticated;
grant execute on function public.fn_ts_hen_huy(uuid, text) to authenticated;
grant execute on function public.fn_ts_hen_cua_ung_vien(uuid) to authenticated;
