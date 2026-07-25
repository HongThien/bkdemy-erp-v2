-- ============================================================================
-- 202607241919 — kho_hinh_v3
-- ----------------------------------------------------------------------------
-- VÌ SAO: dựng nhánh Hình theo spec-kho-hinh-v3 — 4 tầng (họ mô hình › lưới mô hình ›
--   lưới bài toán nhỏ › kho bài vật lý). Model Hình CŨ (spec-kho-v2: bài→ý→dạng-hình)
--   sai tầng: nó coi "bài" là đơn vị tri thức, không có trục giả thiết (mô hình) lẫn
--   trục suy luận (cấp/tiền đề) nên không tra ngược, không sinh được lời giải liền mạch.
--
-- MẤT GÌ: 6 bảng model Hình CŨ + 4 sequence của chúng. Đếm live 2026-07-24 qua
--   DATABASE_URL: hinh_bai=0, hinh_y=0, hinh_bai_mo_hinh=0, hinh_y_bo_de=0,
--   hinh_danh_muc_bo_de=0, hinh_danh_muc_mo_hinh=0 dòng → KHÔNG mất dòng dữ liệu nào.
--   Thùy duyệt drop (2026-07-24). `hinh_ban_do` (87 dòng, tab Hình hiện tại) GIỮ NGUYÊN.
--   Code dính: api.ts countYByDangHinh (đọc hinh_y.dang_hinh) → sửa kèm commit này.
-- ============================================================================

-- ⚠ migrate.mjs áp LẠI mọi file mỗi lần chạy ⇒ drop phải có CỔNG NHẬN DIỆN SHAPE CŨ,
--   nếu không lần chạy thứ hai sẽ xoá sạch hinh_bai/hinh_y MỚI (đã có data thật).
--   Nhận diện: chỉ bảng hinh_y CŨ mới có cột `dang_hinh`. Đọc pg_catalog (information_schema
--   lọc theo quyền của role — CLAUDE.md §2.1).
do $$
begin
  if exists (
    select 1 from pg_attribute a
      join pg_class c on c.oid = a.attrelid
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'hinh_y'
       and a.attname = 'dang_hinh' and not a.attisdropped
  ) then
    drop table if exists hinh_y_bo_de;
    drop table if exists hinh_bai_mo_hinh;
    drop table if exists hinh_y;
    drop table if exists hinh_bai;
    drop table if exists hinh_danh_muc_bo_de;
    drop table if exists hinh_danh_muc_mo_hinh;
    drop sequence if exists hinh_bai_seq;
    drop sequence if exists hinh_y_seq;
    drop sequence if exists hinh_bd_seq;
    drop sequence if exists hinh_mh_seq;
  end if;
end $$;

-- ══════════ CATALOG ══════════
-- Dạng bài = 2 tầng (loại câu hỏi › cách xử lý). Gắn ở CÁCH GIẢI, không gắn ở ý.
create sequence if not exists hinh_dang_v3_seq;
create table if not exists hinh_dang (
  id       uuid primary key default gen_random_uuid(),
  mon      text not null default 'Toán',
  ma       text not null unique default ('DH.' || lpad(nextval('hinh_dang_v3_seq')::text, 3, '0')),
  ten      text not null,
  cap      text not null check (cap in ('loai_ch', 'dang')),
  cha_id   uuid references hinh_dang(id),
  thu_tu   int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists hinh_dang_cha_idx on hinh_dang(cha_id);

-- Bổ đề = danh mục PHẲNG (nhãn chẩn đoán, không phải trục đo ngang hàng mô hình/dạng).
create sequence if not exists hinh_bo_de_seq;
create table if not exists hinh_bo_de (
  id        uuid primary key default gen_random_uuid(),
  mon       text not null default 'Toán',
  ma        text not null unique default ('BD.' || lpad(nextval('hinh_bo_de_seq')::text, 3, '0')),
  ten       text not null,
  phat_bieu text,
  thu_tu    int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ══════════ ② LƯỚI MÔ HÌNH ══════════
-- Node = bó giả thiết. Con = cha + giả thiết mới. `ma` là MÃ TRƠ (cấm mã hoá thứ bậc).
create sequence if not exists hinh_mo_hinh_seq;
create table if not exists hinh_mo_hinh (
  id             uuid primary key default gen_random_uuid(),
  mon            text not null default 'Toán',
  ma             text not null unique default ('MH.' || lpad(nextval('hinh_mo_hinh_seq')::text, 3, '0')),
  ten            text not null,
  gia_thiet      text not null,
  gia_thiet_them text,
  anh_cau_hinh   text,
  la_goc_ho      boolean not null default false,
  cap_mo_hinh    smallint check (cap_mo_hinh between 1 and 4),
  khoi           text,
  ghi_chu        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists hinh_mo_hinh_goc_idx on hinh_mo_hinh(la_goc_ho);

-- DAG: cho phép nhiều cha. Chặn chu trình ở tầng service.
create table if not exists hinh_mo_hinh_cha (
  mo_hinh_id uuid not null references hinh_mo_hinh(id) on delete cascade,
  cha_id     uuid not null references hinh_mo_hinh(id) on delete cascade,
  primary key (mo_hinh_id, cha_id),
  check (mo_hinh_id <> cha_id)
);
create index if not exists hinh_mo_hinh_cha_cha_idx on hinh_mo_hinh_cha(cha_id);

-- ══════════ ③ LƯỚI BÀI TOÁN NHỎ ══════════
-- Node = một tính chất / "ý chuẩn". `cap` = số tính chất phải CM trước nó — TOÀN CỤC, không reset theo mô hình.
create sequence if not exists hinh_baitoan_seq;
create table if not exists hinh_baitoan (
  id           uuid primary key default gen_random_uuid(),
  mon          text not null default 'Toán',
  ma           text not null unique default ('BT.' || lpad(nextval('hinh_baitoan_seq')::text, 3, '0')),
  phat_bieu    text not null,
  mo_hinh_id   uuid not null references hinh_mo_hinh(id),  -- mô hình TỐI THIỂU (§2 luật 6)
  cap          smallint not null,                          -- NHẬP TAY, toàn cục
  de_bai_chuan text,
  anh_chuan    text,
  ghi_chu      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists hinh_baitoan_mo_hinh_idx on hinh_baitoan(mo_hinh_id);
create index if not exists hinh_baitoan_cap_idx on hinh_baitoan(cap);

-- v1 mỗi node điền 1 cách (ngắn nhất); cấu trúc mở sẵn cho nhiều cách.
create table if not exists hinh_cach_giai (
  id           uuid primary key default gen_random_uuid(),
  baitoan_id   uuid not null references hinh_baitoan(id) on delete cascade,
  ten          text,
  dang_id      uuid not null references hinh_dang(id),  -- ĐÚNG 1, trỏ LÁ (cap='dang')
  loi_giai     text,
  anh_loi_giai text,
  la_mac_dinh  boolean not null default false,
  thu_tu       int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists hinh_cach_giai_baitoan_idx on hinh_cach_giai(baitoan_id);

-- Tiền đề THUỘC CÁCH GIẢI (không thuộc bài toán). ĐI XUYÊN MÔ HÌNH tự do.
create table if not exists hinh_cach_tien_de (
  cach_id    uuid not null references hinh_cach_giai(id) on delete cascade,
  tien_de_id uuid not null references hinh_baitoan(id) on delete cascade,
  primary key (cach_id, tien_de_id)
);
create index if not exists hinh_cach_tien_de_tien_de_idx on hinh_cach_tien_de(tien_de_id);

create table if not exists hinh_cach_bo_de (
  cach_id  uuid not null references hinh_cach_giai(id) on delete cascade,
  bo_de_id uuid not null references hinh_bo_de(id) on delete cascade,
  primary key (cach_id, bo_de_id)
);
create index if not exists hinh_cach_bo_de_bo_de_idx on hinh_cach_bo_de(bo_de_id);

-- ══════════ ④ KHO BÀI VẬT LÝ ══════════
-- Bài = tổ hợp ý đã dùng thực tế + nguồn. KHÔNG phải node của lưới nào.
create sequence if not exists hinh_bai_v3_seq;
create table if not exists hinh_bai (
  id         uuid primary key default gen_random_uuid(),
  mon        text not null default 'Toán',
  ma_bai     text not null unique default ('HH.' || lpad(nextval('hinh_bai_v3_seq')::text, 4, '0')),
  de_bai     text not null,          -- NGUYÊN VĂN đề gốc (KHÔNG chuẩn hoá chữ cái)
  anh_de     text not null,          -- BẮT BUỘC
  nguon      text,
  khoi       text,
  trang_thai text not null default 'tam' check (trang_thai in ('tam', 'chinh')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists hinh_bai_trang_thai_idx on hinh_bai(trang_thai);

-- Ý = BẢN THỂ HIỆN của một bài toán nhỏ: nguyên văn + hình của đề gốc + con trỏ tới node ③.
create table if not exists hinh_y (
  id            uuid primary key default gen_random_uuid(),
  bai_id        uuid not null references hinh_bai(id) on delete cascade,
  thu_tu        int not null,
  nhan_hien_thi text,
  noi_dung      text not null,
  dap_an        text,
  loi_giai      text,                -- NULL → rơi về bậc tham chiếu (node)
  anh_loi_giai  text,                -- NULL → rơi về anh_chuan của node
  da_duyet      boolean not null default false,
  baitoan_id    uuid references hinh_baitoan(id),   -- NULL = chưa gán
  co_thieu_node boolean not null default false,
  mo_ta_thieu   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (bai_id, thu_tu)
);
create index if not exists hinh_y_bai_idx on hinh_y(bai_id);
create index if not exists hinh_y_baitoan_idx on hinh_y(baitoan_id);
create index if not exists hinh_y_thieu_node_idx on hinh_y(co_thieu_node) where co_thieu_node;

-- ══════════ RLS — theo DB THẬT, không theo spec ══════════
-- Dump pg_tables 2026-07-24: 101/104 bảng public ENABLE RLS; dai_* đều có 1 policy
-- `<tbl>_member_all` FOR ALL TO authenticated USING la_thanh_vien(). Mirror y hệt.
-- (Spec §6.2 ghi "bảng dữ liệu DISABLE RLS, chỉ `staffs` ENABLE" — đó là convention v1;
--  v2 KHÔNG có bảng `staffs`. Theo lệnh "dump rồi làm, không đoán" ⇒ theo dump.)
do $$
declare t text;
begin
  foreach t in array array['hinh_dang','hinh_bo_de','hinh_mo_hinh','hinh_mo_hinh_cha','hinh_baitoan',
                           'hinh_cach_giai','hinh_cach_tien_de','hinh_cach_bo_de','hinh_bai','hinh_y']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
  end loop;
end $$;
