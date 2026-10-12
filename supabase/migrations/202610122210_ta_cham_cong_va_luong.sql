-- ============================================================================
-- 202610122210 — ta_cham_cong_va_luong
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-cham-cong-ta.md, CEO chốt 12/10/2026):
--   Lương trợ giảng đang tính tay qua file sheet. Mục tiêu: toàn bộ dữ liệu + công thức nằm trên ERP.
--   · TA PHẢI chấm công có mặt (đảo quyết định 07/09 "mặc định có mặt, chỉ ghi vắng"); `ta_vang` giữ
--     nguyên, chỉ khai tử sau khi chạy song song xong.
--   · Chấm công = TA bấm trên app TA (iPad, KHÔNG quét QR); hệ thống khớp lịch và gợi ý việc hiện tại,
--     không khớp thì TA tự điền. Hậu kiểm = người duyệt hằng ngày (Trang).
--   · 2 kênh: K1 = ERP (buổi, ca, BTVN thật) là số 1; K2 = chấm công + việc TA khai.
--   · TG: tử số lấy từ CHẤM CÔNG (mỗi dòng ghi cả lớp, mặc định lớp chính). Lớp ngoài phân công = dạy thay,
--     cộng vào lớp chính. BTVN: buổi của lớp mình CÓ DỮ LIỆU THẬT (có câu BTVN, đã đóng) — buổi MT không
--     có BTVN thì không tính.
--   · %TG, %BTVN KHÔNG trần. Sĩ số = trung bình cả tháng theo NGÀY, xếp bậc theo số nguyên gần nhất.
--   · Lương tính RIÊNG, không nhân hiệu suất; gậy phạt (gay_chot_thang.tien_phat) trừ vào Net, không trần.
--   · MỌI đơn giá nằm ở MỘT bảng `ta_don_gia`, chỉ-thêm-dòng, có ngày hiệu lực, CEO xem lại được.
--   Công thức đã chạy tay đúng trên tháng 9/2026. Hàm này là NGUỒN DUY NHẤT từ giờ (CLAUDE.md §2.0).
--
-- MẤT GÌ (Luật xoá): không có drop/alter thu hẹp. Chỉ thêm bảng/hàm mới.
--   Không sửa fn_hsta_* (hiệu suất vẫn chạy, chỉ không còn vào lương).
--
-- CHƯA LÀM (việc sau — spec §7–§8): chốt kỳ lương (snapshot), màn app, gán quyền 2 chức năng
--   `ta_cong_duyet` + `ta_luong` cho Trang (cần xác nhận đúng người), nhập dữ liệu T9 để kiểm chuẩn.
-- ============================================================================

-- ── 1. BẢNG ĐƠN GIÁ: một chỗ, chỉ thêm dòng, có hiệu lực theo ngày ─────────────
create table ta_don_gia (
  id          uuid primary key default gen_random_uuid(),
  ma          text not null,                  -- he_so_tg · he_so_btvn · he_so_bo_tro · chi_tieu_bo_tro_gio ·
                                              -- btvn_lop_8_buoi · btvn_lop_4_buoi · bac_luong · han_duyet_ngay · gia_<loai_viec>
  ten         text not null,
  gia_tri     numeric not null check (gia_tri >= 0),
  don_vi      text not null default '',       -- đ/giờ · đ/buổi · đ/tháng · hệ số · giờ · lần · ngày
  si_tu       integer,                        -- chỉ dòng bac_luong
  si_den      integer,                        -- NULL = không giới hạn trên
  hieu_luc_tu date not null,
  ghi_chu     text not null default '',
  tao_boi     uuid references nhan_su(id),
  tao_at      timestamptz not null default now(),
  check (si_den is null or si_tu is not null and si_den >= si_tu)
);
create unique index ta_don_gia_khoa on ta_don_gia (ma, coalesce(si_tu, -1), hieu_luc_tu);
comment on table ta_don_gia is 'Đơn giá + hệ số lương TA. APPEND-ONLY: đổi giá = thêm dòng mới có hieu_luc_tu; kỳ lương dùng dòng mới nhất có hieu_luc_tu <= đầu kỳ.';

create or replace function _ta_don_gia_chi_them() returns trigger language plpgsql as $$
begin
  raise exception 'ta_don_gia chỉ thêm dòng mới (đổi giá = dòng mới với hieu_luc_tu mới), không sửa/xoá để giữ lịch sử';
end $$;
create trigger ta_don_gia_chi_them before update or delete on ta_don_gia
  for each row execute function _ta_don_gia_chi_them();

insert into ta_don_gia (ma, ten, gia_tri, don_vi, si_tu, si_den, hieu_luc_tu, ghi_chu) values
  ('he_so_tg',            'Hệ số lương: trợ giảng + ET',                    0.4, 'hệ số', null, null, '2026-09-01', 'CEO chốt: package TA'),
  ('he_so_btvn',          'Hệ số lương: chấm BTVN',                         0.2, 'hệ số', null, null, '2026-09-01', ''),
  ('he_so_bo_tro',        'Hệ số lương: bổ trợ',                            0.4, 'hệ số', null, null, '2026-09-01', ''),
  ('chi_tieu_bo_tro_gio', 'Chỉ tiêu bổ trợ / tháng',                        8,   'giờ',   null, null, '2026-09-01', 'Vượt thì nhân lên, không trần'),
  ('btvn_lop_8_buoi',     'Số lần BTVN / tháng của lớp 8 buổi',             7,   'lần',   null, null, '2026-09-01', ''),
  ('btvn_lop_4_buoi',     'Số lần BTVN / tháng của lớp 4 buổi',             3,   'lần',   null, null, '2026-09-01', ''),
  ('bac_luong',           'Bậc lương lớp: 5–8 HS (dưới 5 cũng bậc này)',    1000000, 'đ/tháng', 0,  8,    '2026-09-01', 'Sĩ số TB tháng, làm tròn gần nhất'),
  ('bac_luong',           'Bậc lương lớp: 9–12 HS',                         1200000, 'đ/tháng', 9,  12,   '2026-09-01', ''),
  ('bac_luong',           'Bậc lương lớp: 13–15 HS',                        1400000, 'đ/tháng', 13, 15,   '2026-09-01', ''),
  ('bac_luong',           'Bậc lương lớp: 16–20 HS',                        1600000, 'đ/tháng', 16, 20,   '2026-09-01', ''),
  ('bac_luong',           'Bậc lương lớp: từ 21 HS',                        1800000, 'đ/tháng', 21, null, '2026-09-01', ''),
  ('gia_trong_thi',       'Trông thi lớp khác',                             50000,  'đ/giờ',  null, null, '2026-09-01', 'Trông thi lớp mình nằm trong công TG'),
  ('gia_bo_tro_dac_biet', 'Bổ trợ đặc biệt (kèm riêng), tính riêng',        150000, 'đ/buổi', null, null, '2026-09-01', 'Không tính vào 8 giờ bổ trợ'),
  ('han_duyet_ngay',      'Hạn chót duyệt/sửa công (ngày của tháng sau)',   3,   'ngày',  null, null, '2026-09-01', '');
-- gia_cham_thi, gia_khac: CHƯA có đơn giá → việc đó trả 0 và hiện cờ, cho tới khi CEO thêm dòng.

-- ── 1b. LỊCH SỬ phân công lớp (CEO 12/10: dữ liệu hiện tại tính theo "bây giờ", không thể hiện lịch sử) ──
-- phan_cong_lop KHÔNG sửa. Trigger ghi mọi thêm/xoá/đổi chính từ nay; các dòng đang có được ghi một sự kiện
-- 'them' tại created_at (đó là ngày NHẬP vào ERP, không chắc là ngày bắt đầu thật — chấm công mới là chân lý).
create table phan_cong_lop_log (
  id         uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null,
  lop_id     uuid not null,
  vai_tro    text not null,
  la_chinh   boolean,
  hanh_dong  text not null check (hanh_dong in ('them', 'xoa', 'doi_chinh')),
  ts         timestamptz not null default now(),
  actor      uuid
);
create index phan_cong_lop_log_khoa on phan_cong_lop_log (nhan_su_id, lop_id, vai_tro, ts);
insert into phan_cong_lop_log (nhan_su_id, lop_id, vai_tro, la_chinh, hanh_dong, ts)
select pc.nhan_su_id, pc.lop_id, pc.vai_tro, pc.la_chinh, 'them', pc.created_at from phan_cong_lop pc;

create or replace function _phan_cong_lop_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into phan_cong_lop_log (nhan_su_id, lop_id, vai_tro, la_chinh, hanh_dong, actor)
    values (new.nhan_su_id, new.lop_id, new.vai_tro, new.la_chinh, 'them', public.current_nhan_su_id());
  elsif tg_op = 'DELETE' then
    insert into phan_cong_lop_log (nhan_su_id, lop_id, vai_tro, la_chinh, hanh_dong, actor)
    values (old.nhan_su_id, old.lop_id, old.vai_tro, old.la_chinh, 'xoa', public.current_nhan_su_id());
  elsif new.la_chinh is distinct from old.la_chinh then
    insert into phan_cong_lop_log (nhan_su_id, lop_id, vai_tro, la_chinh, hanh_dong, actor)
    values (new.nhan_su_id, new.lop_id, new.vai_tro, new.la_chinh, 'doi_chinh', public.current_nhan_su_id());
  end if;
  return coalesce(new, old);
end $$;
create trigger phan_cong_lop_log_trg after insert or delete or update of la_chinh on phan_cong_lop
  for each row execute function _phan_cong_lop_ghi_log();
alter table phan_cong_lop_log enable row level security;
create policy phan_cong_lop_log_doc on phan_cong_lop_log for select to authenticated
  using (co_chuc_nang('ta_cong_duyet') or co_chuc_nang('ta_luong'));

-- ── 2. Danh mục loại việc ────────────────────────────────────────────────────
create table ta_loai_viec (
  ma        text primary key,
  ten       text not null,
  nhom      text not null check (nhom in ('package', 'ngoai_package')),
  tinh_vao  text not null check (tinh_vao in ('tg', 'bo_tro', 'bo_tro_dac_biet', 'trong_thi', 'cham_thi', 'khac')),
  don_vi    text not null check (don_vi in ('buoi', 'gio')),
  can_lop   boolean not null default false,
  can_hs    boolean not null default false,
  thu_tu    smallint not null default 0,
  active    boolean not null default true
);
comment on table ta_loai_viec is 'Việc ngoài package lấy đơn giá ở ta_don_gia (ma = gia_<ma loại>). Dạy thay KHÔNG phải loại riêng: là dòng tro_giang ở lớp ngoài phân công.';
insert into ta_loai_viec (ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs, thu_tu) values
  ('tro_giang',       'Trợ giảng lớp học',                 'package',       'tg',              'buoi', true,  false, 10),
  ('bo_tro_bu',       'Bổ trợ bù',                         'package',       'bo_tro',          'gio',  true,  true,  30),
  ('bo_tro_yeu',      'Bổ trợ yếu',                        'package',       'bo_tro',          'gio',  true,  true,  31),
  ('bo_tro_duoi',     'Bổ trợ đuổi',                       'package',       'bo_tro',          'gio',  true,  true,  32),
  ('bo_tro_dinh_ki',  'Bổ trợ định kì (trực bổ trợ khối)', 'package',       'bo_tro',          'gio',  true,  false, 33),
  ('bo_tro_on_thi',   'Bổ trợ ôn thi',                     'package',       'bo_tro',          'gio',  true,  true,  34),
  ('bo_tro_dac_biet', 'Bổ trợ đặc biệt (kèm riêng)',       'ngoai_package', 'bo_tro_dac_biet', 'buoi', false, true,  70),
  ('trong_thi',       'Trông thi',                         'ngoai_package', 'trong_thi',       'gio',  true,  false, 80),
  ('cham_thi',        'Chấm thi',                          'ngoai_package', 'cham_thi',        'gio',  false, false, 90),
  ('khac',            'Việc khác (bắt buộc ghi chú)',      'ngoai_package', 'khac',            'gio',  false, false, 99);

-- ── 3. Chấm công có mặt (K2) + việc trong ngày ──────────────────────────────────
create table ta_cham_cong (
  id            uuid primary key default gen_random_uuid(),
  nhan_su_id    uuid not null references nhan_su(id),
  ngay          date not null,                    -- ngày giờ VN
  vao_at        timestamptz not null default now(),
  ra_at         timestamptz,
  co_so         text,
  cach_xac_thuc text not null default 'app' check (cach_xac_thuc in ('app', 'tay_duyet')),
  trang_thai    text not null default 'dang_lam' check (trang_thai in ('dang_lam', 'xong', 'quen_ra')),
  created_at    timestamptz not null default now(),
  check (ra_at is null or ra_at >= vao_at)
);
create unique index ta_cham_cong_mot_ca_mo on ta_cham_cong (nhan_su_id) where ra_at is null and trang_thai = 'dang_lam';
create index ta_cham_cong_ns_ngay on ta_cham_cong (nhan_su_id, ngay);

create table ta_cong_viec (
  id           uuid primary key default gen_random_uuid(),
  nhan_su_id   uuid not null references nhan_su(id),
  cham_cong_id uuid references ta_cham_cong(id),   -- NULL khi nhập hộ / nhập từ sheet cũ
  ngay         date not null,
  ky           date generated always as (ngay - (extract(day from ngay)::int - 1)) stored,
  loai_viec    text not null references ta_loai_viec(ma),
  lop_id       uuid references lop(id),
  buoi_hoc_id  uuid references buoi_hoc(id),
  ca_bo_tro_id uuid references ca_bo_tro(id),
  gio_bat_dau  time,
  gio_ket_thuc time,
  hoc_sinh     text,
  ghi_chu      text not null default '',
  nguon        text not null check (nguon in ('he_thong', 'tu_khai', 'import_sheet')),
  trang_thai   text not null default 'cho_duyet' check (trang_thai in ('cho_duyet', 'da_duyet', 'tu_choi')),
  duyet_boi    uuid references nhan_su(id),
  duyet_at     timestamptz,
  ly_do_duyet  text,
  created_by   uuid references nhan_su(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (gio_bat_dau is null or gio_ket_thuc is null or gio_ket_thuc > gio_bat_dau)
);
-- Một việc không thể ghi hai lần (khoá tự nhiên, không bám vị trí):
create unique index ta_cong_viec_buoi on ta_cong_viec (nhan_su_id, loai_viec, buoi_hoc_id)
  where buoi_hoc_id is not null and trang_thai <> 'tu_choi';
create unique index ta_cong_viec_ca on ta_cong_viec (nhan_su_id, ca_bo_tro_id)
  where ca_bo_tro_id is not null and trang_thai <> 'tu_choi';
create index ta_cong_viec_ns_ky on ta_cong_viec (nhan_su_id, ky);
create index ta_cong_viec_cho_duyet on ta_cong_viec (ngay) where trang_thai = 'cho_duyet';

create table ta_cong_log (
  id         uuid primary key default gen_random_uuid(),
  bang       text not null,
  row_id     uuid not null,
  hanh_dong  text not null,
  truoc      jsonb,
  sau        jsonb,
  actor      uuid,
  ts         timestamptz not null default now()
);

create or replace function _ta_cong_viec_kiem() returns trigger language plpgsql as $$
declare v ta_loai_viec;
begin
  select * into v from ta_loai_viec where ma = new.loai_viec;
  if not v.active then raise exception 'Loại việc % đã ngừng dùng', new.loai_viec; end if;
  if v.can_lop and new.lop_id is null then raise exception 'Loại việc "%" cần chọn lớp', v.ten; end if;
  if new.loai_viec = 'khac' and btrim(coalesce(new.ghi_chu, '')) = '' then raise exception 'Việc khác phải ghi chú'; end if;
  new.updated_at := now();
  return new;
end $$;
create trigger ta_cong_viec_kiem before insert or update on ta_cong_viec
  for each row execute function _ta_cong_viec_kiem();

create or replace function _ta_cong_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into ta_cong_log (bang, row_id, hanh_dong, truoc, sau, actor)
  values (tg_table_name, coalesce(new.id, old.id), tg_op,
          case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
          case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end,
          public.current_nhan_su_id());
  return coalesce(new, old);
end $$;
create trigger ta_cong_viec_log after insert or update or delete on ta_cong_viec for each row execute function _ta_cong_ghi_log();
create trigger ta_cham_cong_log after insert or update or delete on ta_cham_cong for each row execute function _ta_cong_ghi_log();

-- ── 4. RLS: đọc theo phạm vi, ghi CHỈ qua hàm ─────────────────────────────────
alter table ta_don_gia   enable row level security;
alter table ta_loai_viec enable row level security;
alter table ta_cham_cong enable row level security;
alter table ta_cong_viec enable row level security;
alter table ta_cong_log  enable row level security;
create policy ta_don_gia_doc   on ta_don_gia   for select to authenticated using (co_chuc_nang('ta_luong'));
create policy ta_loai_viec_doc on ta_loai_viec for select to authenticated using (la_thanh_vien());
create policy ta_cham_cong_doc on ta_cham_cong for select to authenticated
  using (nhan_su_id = current_nhan_su_id() or co_chuc_nang('ta_cong_duyet') or co_chuc_nang('ta_luong'));
create policy ta_cong_viec_doc on ta_cong_viec for select to authenticated
  using (nhan_su_id = current_nhan_su_id() or co_chuc_nang('ta_cong_duyet') or co_chuc_nang('ta_luong'));
create policy ta_cong_log_doc  on ta_cong_log  for select to authenticated
  using (co_chuc_nang('ta_cong_duyet') or co_chuc_nang('ta_luong'));

-- ── 5. Hàm GHI ────────────────────────────────────────────────────────────────
create or replace function fn_ta_cham_cong_vao(p_co_so text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_id uuid;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  select id into v_id from ta_cham_cong where nhan_su_id = v_ns and ra_at is null and trang_thai = 'dang_lam';
  if v_id is not null then return v_id; end if;   -- idempotent
  insert into ta_cham_cong (nhan_su_id, ngay, co_so)
  values (v_ns, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_co_so) returning id into v_id;
  return v_id;
end $$;

create or replace function fn_ta_cham_cong_ra() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_id uuid;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  update ta_cham_cong set ra_at = now(), trang_thai = 'xong'
   where nhan_su_id = v_ns and ra_at is null and trang_thai = 'dang_lam' returning id into v_id;
  if v_id is null then raise exception 'Chưa vào ca'; end if;
  return v_id;
end $$;

-- Khai việc. Trợ giảng không chọn lớp ⇒ mặc định LỚP CHÍNH của TA (CEO 12/10). Có buổi/ca khớp ERP ⇒ nguon='he_thong'.
create or replace function fn_ta_khai_viec(p_loai text, p_ngay date, p_lop uuid default null, p_buoi uuid default null,
  p_ca uuid default null, p_bat time default null, p_ket time default null, p_hs text default null, p_ghi_chu text default '')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_cc uuid; v_id uuid; v_lop uuid := p_lop;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  select id into v_cc from ta_cham_cong where nhan_su_id = v_ns and ngay = p_ngay order by vao_at desc limit 1;
  if v_cc is null then raise exception 'Chưa chấm công có mặt ngày %', p_ngay; end if;
  if v_lop is null and p_buoi is not null then select b.lop_id into v_lop from buoi_hoc b where b.id = p_buoi; end if;
  if v_lop is null and p_loai = 'tro_giang' then
    select pc.lop_id into v_lop from phan_cong_lop pc
     where pc.nhan_su_id = v_ns and pc.vai_tro = 'tg' order by pc.la_chinh desc, pc.created_at limit 1;
  end if;
  insert into ta_cong_viec (nhan_su_id, cham_cong_id, ngay, loai_viec, lop_id, buoi_hoc_id, ca_bo_tro_id,
                            gio_bat_dau, gio_ket_thuc, hoc_sinh, ghi_chu, nguon, created_by)
  values (v_ns, v_cc, p_ngay, p_loai, v_lop, p_buoi, p_ca, p_bat, p_ket, p_hs, coalesce(p_ghi_chu, ''),
          case when p_buoi is not null or p_ca is not null then 'he_thong' else 'tu_khai' end, v_ns)
  returning id into v_id;
  return v_id;
end $$;

create or replace function fn_ta_duyet_cong(p_ids uuid[], p_ket_qua text, p_ly_do text default null) returns integer
language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  if not public.co_quyen_ghi('ta_cong_duyet') then raise exception 'Không có quyền duyệt công'; end if;
  if p_ket_qua not in ('da_duyet', 'tu_choi') then raise exception 'Kết quả duyệt không hợp lệ'; end if;
  if p_ket_qua = 'tu_choi' and btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Từ chối phải có lý do'; end if;
  update ta_cong_viec set trang_thai = p_ket_qua, duyet_boi = public.current_nhan_su_id(), duyet_at = now(), ly_do_duyet = p_ly_do
   where id = any(p_ids) and trang_thai <> p_ket_qua;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- CEO đổi giá = THÊM dòng mới có hiệu lực từ ngày chỉ định
create or replace function fn_ta_dat_don_gia(p_ma text, p_gia numeric, p_hieu_luc_tu date, p_ten text default null,
  p_si_tu integer default null, p_si_den integer default null, p_ghi_chu text default '') returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_ten text; v_dv text;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền đổi đơn giá'; end if;
  select d.ten, d.don_vi into v_ten, v_dv from ta_don_gia d where d.ma = p_ma order by d.hieu_luc_tu desc limit 1;
  v_ten := coalesce(p_ten, v_ten, p_ma);
  insert into ta_don_gia (ma, ten, gia_tri, don_vi, si_tu, si_den, hieu_luc_tu, ghi_chu, tao_boi)
  values (p_ma, v_ten, p_gia, coalesce(v_dv, ''), p_si_tu, p_si_den, p_hieu_luc_tu, coalesce(p_ghi_chu, ''), public.current_nhan_su_id())
  returning id into v_id;
  return v_id;
end $$;

-- ── 6. Hàm ĐỌC ────────────────────────────────────────────────────────────────
-- Việc hôm nay của TA theo ERP (K1) để app hiện sẵn sau khi bấm chấm công; không có gì thì TA tự điền.
create or replace function fn_ta_hom_nay(p_at timestamptz default now())
returns table(nguon text, loai_viec text, lop_id uuid, ten_lop text, buoi_hoc_id uuid, ca_bo_tro_id uuid,
              gio_bat_dau time, gio_ket_thuc time, dang_dien_ra boolean, da_khai boolean)
language plpgsql stable security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id();
        v_ngay date := (p_at at time zone 'Asia/Ho_Chi_Minh')::date;
        v_gio time := (p_at at time zone 'Asia/Ho_Chi_Minh')::time;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  return query
  with k1 as (
    -- buổi thường của lớp mình
    select 'buoi_thuong'::text as nguon, 'tro_giang'::text as loai_viec, b.lop_id, l.ten_lop, b.id as buoi_hoc_id,
           null::uuid as ca_bo_tro_id, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b join lop l on l.id = b.lop_id
      join phan_cong_lop pc on pc.lop_id = b.lop_id and pc.nhan_su_id = v_ns and pc.vai_tro = 'tg'
     where b.ngay = v_ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
    union all
    -- ca trực bổ trợ khối đã xếp cho mình
    select 'ca_bo_tro', 'bo_tro_dinh_ki', null::uuid, concat_ws(' ', c.mon, c.khoi), null::uuid, c.id, c.gio_bat_dau, c.gio_ket_thuc
      from ca_bo_tro c
     where c.ngay = v_ngay and c.trang_thai = 'mo' and v_ns in (c.nhan_su_id, c.nhan_su_2_id)
    union all
    -- buổi bù / yếu / đuổi mình dạy
    select 'buoi_bo_tro',
           case b.loai when 'bu' then 'bo_tro_bu' when 'bo_tro_yeu' then 'bo_tro_yeu' else 'bo_tro_duoi' end,
           b.lop_id, l.ten_lop, b.id, null::uuid, b.gio_bat_dau, b.gio_ket_thuc
      from buoi_hoc b left join lop l on l.id = b.lop_id
     where b.ngay = v_ngay and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') and b.trang_thai <> 'huy' and b.nguoi_day = v_ns
  )
  select x.nguon, x.loai_viec, x.lop_id, x.ten_lop, x.buoi_hoc_id, x.ca_bo_tro_id, x.gio_bat_dau, x.gio_ket_thuc,
         (x.gio_bat_dau is not null and x.gio_ket_thuc is not null
            and v_gio between x.gio_bat_dau - interval '30 minutes' and x.gio_ket_thuc + interval '30 minutes'),
         exists (select 1 from ta_cong_viec cv where cv.nhan_su_id = v_ns and cv.trang_thai <> 'tu_choi'
                   and ((x.buoi_hoc_id is not null and cv.buoi_hoc_id = x.buoi_hoc_id and cv.loai_viec = x.loai_viec)
                     or (x.ca_bo_tro_id is not null and cv.ca_bo_tro_id = x.ca_bo_tro_id)))
    from k1 x
   order by x.gio_bat_dau nulls last;
end $$;

create or replace function fn_ta_cong_thang(p_ns uuid, p_ky date)
returns table(id uuid, ngay date, loai_viec text, ten_loai text, ten_lop text, gio_bat_dau time, gio_ket_thuc time,
              gio numeric, hoc_sinh text, ghi_chu text, nguon text, trang_thai text, ly_do_duyet text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not (p_ns = public.current_nhan_su_id() or public.co_chuc_nang('ta_cong_duyet') or public.co_chuc_nang('ta_luong')) then
    raise exception 'Không có quyền xem công của người này';
  end if;
  return query
  select cv.id, cv.ngay, cv.loai_viec, lv.ten, l.ten_lop, cv.gio_bat_dau, cv.gio_ket_thuc,
         round((extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric, 2),
         cv.hoc_sinh, cv.ghi_chu, cv.nguon, cv.trang_thai, cv.ly_do_duyet
    from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec left join lop l on l.id = cv.lop_id
   where cv.nhan_su_id = p_ns and cv.ky = date_trunc('month', p_ky)::date
   order by cv.ngay, cv.gio_bat_dau nulls last;
end $$;

-- Bảng đơn giá để CEO xem lại: dòng đang hiệu lực + lịch sử đổi
create or replace function fn_ta_bang_don_gia(p_ngay date default null)
returns table(ma text, ten text, si_tu integer, si_den integer, gia_tri numeric, don_vi text,
              hieu_luc_tu date, dang_hieu_luc boolean, ghi_chu text, nguoi_dat text, dat_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare v_ngay date := coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date);
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem đơn giá'; end if;
  return query
  select d.ma, d.ten, d.si_tu, d.si_den, d.gia_tri, d.don_vi, d.hieu_luc_tu,
         d.hieu_luc_tu = (select max(d2.hieu_luc_tu) from ta_don_gia d2
                           where d2.ma = d.ma and coalesce(d2.si_tu, -1) = coalesce(d.si_tu, -1) and d2.hieu_luc_tu <= v_ngay),
         d.ghi_chu, n.ho_ten, d.tao_at
    from ta_don_gia d left join nhan_su n on n.id = d.tao_boi
   order by d.ma, d.si_tu nulls first, d.hieu_luc_tu desc;
end $$;

-- ── 7. TÍNH LƯƠNG (nguồn công thức DUY NHẤT) ──────────────────────────────────
-- Gross = Σ lớp [ bậc × (he_so_tg × %TG + he_so_btvn × %BTVN) ] + he_so_bo_tro × giờ bổ trợ ÷ chỉ tiêu × bậc lớp chính
--         + Σ việc ngoài package (đơn giá × số lượng)
-- Net   = Gross − tiền phạt gậy đã chốt của kỳ (không trần).
create or replace function _ta_luong_tinh(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
              ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
language sql stable security definer set search_path = public as $$
with
k as (
  select date_trunc('month', p_ky)::date as tu,
         (date_trunc('month', p_ky)::date + interval '1 month' - interval '1 day')::date as den
),
dg as (   -- đơn giá đang hiệu lực tại đầu kỳ (dòng mới nhất có hieu_luc_tu <= đầu kỳ)
  select distinct on (d.ma, coalesce(d.si_tu, -1)) d.ma, d.si_tu, d.si_den, d.gia_tri
    from ta_don_gia d, k where d.hieu_luc_tu <= k.tu
   order by d.ma, coalesce(d.si_tu, -1), d.hieu_luc_tu desc
),
cfg as (
  select (select gia_tri from dg where ma = 'he_so_tg')            as w_tg,
         (select gia_tri from dg where ma = 'he_so_btvn')          as w_btvn,
         (select gia_tri from dg where ma = 'he_so_bo_tro')        as w_bt,
         (select gia_tri from dg where ma = 'chi_tieu_bo_tro_gio') as chi_tieu,
         (select gia_tri from dg where ma = 'btvn_lop_8_buoi')     as btvn_8,
         (select gia_tri from dg where ma = 'btvn_lop_4_buoi')     as btvn_4
),
ta_sel as (
  select x.nhan_su_id from (
    select pc.nhan_su_id from phan_cong_lop pc where pc.vai_tro = 'tg'
    union
    select cv.nhan_su_id from ta_cong_viec cv, k where cv.ky = k.tu and cv.trang_thai = 'da_duyet'
  ) x where p_ns is null or x.nhan_su_id = p_ns
),
lop_cua as (
  -- Lớp thuộc về TA được phân công (la_chu) giữ BTVN + chỉ tiêu bổ trợ + bậc lương, kể cả khi nhờ người dạy hộ.
  -- Lớp TA có công TG mà không được phân công = dạy hộ: tiền TG của buổi đó đi theo người dạy (CEO 12/10).
  select x.nhan_su_id, x.lop_id, bool_or(x.chu) as la_chu, bool_or(x.la_chinh) as la_chinh
    from (
      select pc.nhan_su_id, pc.lop_id, true as chu, pc.la_chinh
        from phan_cong_lop pc join ta_sel s on s.nhan_su_id = pc.nhan_su_id, k
       where pc.vai_tro = 'tg'
         -- as-of cuối kỳ: phân công SAU kỳ không tính vào kỳ này (vd Tùng 6A3, Vân Anh 7S3 phân ngày 11–12/10)
         and (pc.created_at at time zone 'Asia/Ho_Chi_Minh')::date <= k.den
      union all
      select cv.nhan_su_id, cv.lop_id, false, false
        from ta_cong_viec cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec
        join ta_sel s on s.nhan_su_id = cv.nhan_su_id, k
       where cv.ky = k.tu and cv.trang_thai = 'da_duyet' and lv.tinh_vao = 'tg' and cv.lop_id is not null
    ) x
   group by x.nhan_su_id, x.lop_id
),
lop_stat as (
  select lc.nhan_su_id, lc.lop_id, l.ten_lop, lc.la_chu, lc.la_chinh,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
        and b.ngay between k.tu and k.den)::int as so_buoi,
    (select count(*) from buoi_hoc b, k where b.lop_id = lc.lop_id and b.loai = 'thuong'
        and b.ngay between k.tu and k.den)::int as so_buoi_lich,
    -- BTVN thật (CEO 12/10): buổi lớp mình mà CHÍNH TA này đã chấm (gami_grades.graded_by → tai_khoan → nhan_su)
    -- trong hạn duyệt của kỳ. Buổi MT/thi không có câu BTVN ⇒ không có dòng chấm ⇒ không tính;
    -- BTVN online TA chưa chấm (hoặc chấm sau hạn) ⇒ không tính.
    (select count(*) from buoi_hoc b, k
      where b.lop_id = lc.lop_id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between k.tu and k.den
        and exists (select 1 from gami_grades g
                      join gami_session_problems p on p.id = g.problem_id and p.phase = 'btvn' and not p.hidden
                      join tai_khoan tk on tk.id = g.graded_by
                     where g.buoi_hoc_id = b.id and tk.nhan_su_id = lc.nhan_su_id
                       and g.graded_at < ((k.tu + interval '1 month')
                             + make_interval(days => coalesce((select gia_tri::int from dg where ma = 'han_duyet_ngay'), 3)))
                             ::timestamp at time zone 'Asia/Ho_Chi_Minh'))::int as btvn_lam,
    (select avg(x.c) from k, generate_series(k.tu, k.den, interval '1 day') d(d),
        lateral (select count(*)::int as c from hoc_sinh_lop h
                  where h.lop_id = lc.lop_id and h.ngay_vao <= d.d::date
                    and (h.ngay_roi is null or h.ngay_roi > d.d::date)) x) as si_tb,
    -- TG: từ CHẤM CÔNG đã duyệt (K2), theo ngày. Trông thi ở LỚP MÌNH nằm trong công TG: cùng ngày chỉ tính
    -- một lần vào TG (không trả tiền trông thi riêng — xem ngoai_dong), kể cả khi hôm đó chỉ có dòng trông thi.
    (select count(distinct cv.ngay) from ta_cong_viec cv
        join ta_loai_viec lv on lv.ma = cv.loai_viec, k
      where cv.nhan_su_id = lc.nhan_su_id and cv.lop_id = lc.lop_id and cv.ky = k.tu
        and cv.trang_thai = 'da_duyet' and lv.tinh_vao in ('tg', 'trong_thi'))::int as tg_lam
    from lop_cua lc join lop l on l.id = lc.lop_id
),
lop_bac as (
  select ls.*, coalesce(
      (select b.gia_tri from dg b
        where b.ma = 'bac_luong'
          and round(coalesce(ls.si_tb, 0))::int >= b.si_tu
          and (b.si_den is null or round(coalesce(ls.si_tb, 0))::int <= b.si_den)
        order by b.si_tu desc limit 1),
      (select min(gia_tri) from dg where ma = 'bac_luong')) as luong
    from lop_stat ls
),
chinh as (
  select distinct on (lb.nhan_su_id) lb.nhan_su_id, lb.lop_id as chinh_lop, lb.ten_lop as chinh_ten, lb.luong as chinh_luong
    from lop_bac lb
   -- lớp chính = lớp TA THỰC SỰ có công TG (bằng chứng), rồi mới tới cờ la_chinh trong phân công
   order by lb.nhan_su_id, lb.la_chu desc, (lb.tg_lam > 0) desc, lb.la_chinh desc, lb.luong desc, lb.ten_lop
),
lop_tien as (
  select lb.*, lb.tg_lam as tg_tinh,
         case when lb.so_buoi_lich <= 5 then c.btvn_4 else c.btvn_8 end as btvn_dm,
         c.w_tg, c.w_btvn
    from lop_bac lb, cfg c
),
lop_kq as (
  select lt.*,
         case when lt.so_buoi > 0 then lt.tg_tinh::numeric / lt.so_buoi else 0 end as ti_le_tg,
         case when lt.btvn_dm > 0 then lt.btvn_lam::numeric / lt.btvn_dm else 0 end as ti_le_btvn
    from lop_tien lt
),
lop_tong as (
  select lk.nhan_su_id,
         sum(round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn)))::numeric as tien,
         -- Lớp chủ chỉ vào chỉ tiêu bổ trợ khi TA CÓ HOẠT ĐỘNG ở lớp đó trong kỳ (có công TG hoặc đã chấm BTVN).
         -- Chặn phân công "treo" (phụ, chưa làm gì) làm tăng chỉ tiêu oan; sau này chấm công thay hẳn bước này.
         (count(*) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)))::int as n_chu,
         coalesce(sum(lk.luong) filter (where lk.la_chu and (lk.tg_lam > 0 or lk.btvn_lam > 0)), 0)::numeric as sum_bac_chu,
         (count(*) filter (where lk.tg_lam > 0))::int as n_lop_tg,
         coalesce(sum(lk.luong) filter (where lk.tg_lam > 0), 0)::numeric as sum_bac_tg,
         coalesce(sum(lk.tg_lam) filter (where not lk.la_chu), 0)::int as tg_ho,
         jsonb_agg(jsonb_build_object(
           'lop', lk.ten_lop, 'la_chu', lk.la_chu, 'co_hoat_dong', (lk.tg_lam > 0 or lk.btvn_lam > 0), 'si_tb', round(lk.si_tb::numeric, 2), 'bac', lk.luong,
           'tg_lam', lk.tg_tinh, 'so_buoi', lk.so_buoi, 'ti_le_tg', round(lk.ti_le_tg, 4),
           'btvn_lam', lk.btvn_lam, 'btvn_dinh_muc', lk.btvn_dm, 'ti_le_btvn', round(lk.ti_le_btvn, 4),
           'tien', round(lk.luong * (lk.w_tg * lk.ti_le_tg + lk.w_btvn * lk.ti_le_btvn))) order by lk.ten_lop) as ds
    from lop_kq lk group by lk.nhan_su_id
),
bo as (
  select cv.nhan_su_id,
         sum(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0)::numeric as gio
    from ta_cong_viec cv join ta_loai_viec lv on lv.ma = cv.loai_viec, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet' and lv.tinh_vao = 'bo_tro'
     and cv.gio_bat_dau is not null and cv.gio_ket_thuc is not null
   group by cv.nhan_su_id
),
ngoai_dong as (
  select cv.nhan_su_id, lv.ma as loai, cv.ngay, l.ten_lop,
         case lv.don_vi when 'gio' then coalesce(extract(epoch from (cv.gio_ket_thuc - cv.gio_bat_dau)) / 3600.0, 0)
                        else 1 end as so_luong,
         (select gia_tri from dg where dg.ma = 'gia_' || lv.ma) as don_gia
    from ta_cong_viec cv
    join ta_loai_viec lv on lv.ma = cv.loai_viec
    left join lop l on l.id = cv.lop_id, k
   where cv.ky = k.tu and cv.trang_thai = 'da_duyet' and lv.nhom = 'ngoai_package'
     -- trông thi lớp mình nằm trong công TG, không tính riêng
     and not (lv.tinh_vao = 'trong_thi' and exists (
            select 1 from lop_cua lc where lc.nhan_su_id = cv.nhan_su_id and lc.lop_id = cv.lop_id))
),
ngoai as (
  select nd.nhan_su_id,
         sum(round(nd.so_luong * coalesce(nd.don_gia, 0)))::numeric as tien,
         jsonb_agg(jsonb_build_object('loai', nd.loai, 'ngay', nd.ngay, 'lop', nd.ten_lop,
                   'so_luong', round(nd.so_luong::numeric, 2), 'don_gia', nd.don_gia,
                   'thieu_don_gia', nd.don_gia is null) order by nd.ngay) as ds
    from ngoai_dong nd group by nd.nhan_su_id
),
ket as (
  select s.nhan_su_id,
         coalesce(lt.tien, 0) as package_lop,
         coalesce(bo.gio, 0) as bo_tro_gio,
         -- Mỗi lớp có phần bổ trợ riêng (8 giờ, 40% bậc lớp ấy): chỉ tiêu = 8 × số lớp được phân công (không có thì
         -- theo lớp có TG); tiền = 0,4 × giờ ÷ chỉ tiêu × Σ bậc các lớp đó. Giờ dùng chung, không gắn lớp.
         case when n_bt.n = 0 then 0
              else round(c.w_bt * coalesce(bo.gio, 0) / nullif(c.chi_tieu * n_bt.n, 0) * n_bt.bac) end as bo_tro_tien,
         n_bt.n as n_lop_bt,
         n_bt.bac as bac_bt,
         coalesce(ng.tien, 0) as ngoai_package,
         coalesce((select g.tien_phat from gay_chot_thang g, k where g.ky = k.tu and g.nhan_su_id = s.nhan_su_id), 0) as tien_phat,
         lt.ds as ds_lop, ng.ds as ds_ngoai, ch.chinh_ten, ch.chinh_luong,
         coalesce(lt.tg_ho, 0) as day_thay, c.chi_tieu
    from ta_sel s
    left join lop_tong lt on lt.nhan_su_id = s.nhan_su_id
    left join chinh ch on ch.nhan_su_id = s.nhan_su_id
    left join bo on bo.nhan_su_id = s.nhan_su_id
    left join ngoai ng on ng.nhan_su_id = s.nhan_su_id, cfg c
    cross join lateral (
      select case when coalesce(lt.n_chu, 0) > 0 then lt.n_chu else coalesce(lt.n_lop_tg, 0) end as n,
             case when coalesce(lt.n_chu, 0) > 0 then lt.sum_bac_chu else coalesce(lt.sum_bac_tg, 0) end as bac) n_bt
)
select kt.nhan_su_id, n.ho_ten, kt.package_lop, round(kt.bo_tro_gio, 2), kt.bo_tro_tien, kt.ngoai_package,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package,
       kt.tien_phat,
       kt.package_lop + kt.bo_tro_tien + kt.ngoai_package - kt.tien_phat,
       jsonb_build_object('lop', coalesce(kt.ds_lop, '[]'::jsonb),
                          'bo_tro', jsonb_build_object('gio', round(kt.bo_tro_gio, 2),
                                    'so_lop', kt.n_lop_bt, 'chi_tieu_moi_lop', kt.chi_tieu,
                                    'chi_tieu', kt.chi_tieu * kt.n_lop_bt,
                                    'ti_le', round(kt.bo_tro_gio / nullif(kt.chi_tieu * kt.n_lop_bt, 0), 4),
                                    'tong_bac', kt.bac_bt, 'lop_chinh', kt.chinh_ten, 'tien', kt.bo_tro_tien),
                          'ngoai_package', coalesce(kt.ds_ngoai, '[]'::jsonb),
                          'day_thay', kt.day_thay,
                          'tien_phat', kt.tien_phat)
  from ket kt join nhan_su n on n.id = kt.nhan_su_id
 where p_ns is not null or kt.package_lop + kt.bo_tro_tien + kt.ngoai_package + kt.tien_phat <> 0
 order by n.ho_ten
$$;

create or replace function fn_ta_luong_thang(p_ky date, p_ns uuid default null)
returns table(nhan_su_id uuid, ho_ten text, package_lop numeric, bo_tro_gio numeric, bo_tro_tien numeric,
              ngoai_package numeric, gross numeric, tien_phat numeric, net numeric, chi_tiet jsonb)
language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.co_chuc_nang('ta_luong') or (p_ns is not null and p_ns = public.current_nhan_su_id())) then
    raise exception 'Không có quyền xem lương trợ giảng';
  end if;
  return query select * from public._ta_luong_tinh(p_ky, p_ns);
end $$;

-- ── 8. Quyền thực thi (SQL Editor cấp anon tường minh — revoke cả anon) ───────
revoke execute on function _ta_luong_tinh(date, uuid) from public, anon, authenticated;
revoke execute on function fn_ta_cham_cong_vao(text), fn_ta_cham_cong_ra(),
  fn_ta_khai_viec(text, date, uuid, uuid, uuid, time, time, text, text),
  fn_ta_duyet_cong(uuid[], text, text), fn_ta_dat_don_gia(text, numeric, date, text, integer, integer, text),
  fn_ta_hom_nay(timestamptz), fn_ta_cong_thang(uuid, date), fn_ta_bang_don_gia(date), fn_ta_luong_thang(date, uuid)
  from public, anon;
grant execute on function fn_ta_cham_cong_vao(text), fn_ta_cham_cong_ra(),
  fn_ta_khai_viec(text, date, uuid, uuid, uuid, time, time, text, text),
  fn_ta_duyet_cong(uuid[], text, text), fn_ta_dat_don_gia(text, numeric, date, text, integer, integer, text),
  fn_ta_hom_nay(timestamptz), fn_ta_cong_thang(uuid, date), fn_ta_bang_don_gia(date), fn_ta_luong_thang(date, uuid)
  to authenticated;
