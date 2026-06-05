-- ============================================================================
-- Migration 0001 — KHO v2: Canonical Knowledge (Đại + Hình)
-- Theo spec-kho-v2.md. 13 bảng. RLS OFF (spec §1.5 — chưa có staffs trong scope).
-- Project MỚI (phương án B), build trong schema public.
-- ============================================================================

-- ───────────────────────────── SEQUENCES ─────────────────────────────
create sequence if not exists dai_dang_seq;
create sequence if not exists dai_tt_seq;
create sequence if not exists dai_bd_seq;
create sequence if not exists dai_cau_seq;
create sequence if not exists hinh_dang_seq;
create sequence if not exists hinh_mh_seq;
create sequence if not exists hinh_bd_seq;
create sequence if not exists hinh_bai_seq;
create sequence if not exists hinh_y_seq;

-- =============================== NHÁNH ĐẠI ===============================

-- 3.1 Cây tri thức Đại — 4 tầng cứng, lưu phẳng; lá = Dạng
create table dai_ban_do (
  ma_dang        text primary key default 'DG' || lpad(nextval('dai_dang_seq')::text, 5, '0'),
  khoi           text not null,                                   -- '3'..'12', '4T', '5T'
  ma_chuong      text not null,
  ten_chuong     text not null,
  ma_chu_de      text not null,
  ten_chu_de     text not null,
  ma_chuyen_de   text not null,
  ten_chuyen_de  text not null,
  ten_dang       text not null,                                   -- tên Dạng (lá)
  muc_do         smallint not null check (muc_do between 1 and 5),
  created_at     timestamptz not null default now()
);
create index on dai_ban_do (khoi, ma_chuong, ma_chu_de, ma_chuyen_de);

-- 3.2 Danh mục thuộc tính + bảng nối Dạng ↔ thuộc tính
create table dai_danh_muc_thuoc_tinh (
  id    text primary key default 'TT' || lpad(nextval('dai_tt_seq')::text, 4, '0'),
  ten   text not null unique
);

create table dai_dang_thuoc_tinh (
  ma_dang        text not null references dai_ban_do(ma_dang) on delete cascade,
  id_thuoc_tinh  text not null references dai_danh_muc_thuoc_tinh(id) on delete cascade,
  primary key (ma_dang, id_thuoc_tinh)
);

-- 3.3 Danh mục bổ đề Đại + Câu hỏi Đại + nối Câu ↔ bổ đề
create table dai_danh_muc_bo_de (
  id   text primary key default 'BD' || lpad(nextval('dai_bd_seq')::text, 4, '0'),
  ten  text not null unique
);

create table dai_cau_hoi (
  ma_cau      text primary key default 'DC' || lpad(nextval('dai_cau_seq')::text, 6, '0'),
  dang_chinh  text not null references dai_ban_do(ma_dang) on delete restrict,
  loai_cau    text not null,                                      -- tra_loi_ngan | trac_nghiem | dung_sai | tu_luan
  noi_dung    text not null,                                      -- đề bài
  lua_chon    jsonb,                                              -- chỉ trắc nghiệm
  menh_de     jsonb,                                              -- chỉ đúng-sai
  dap_an      text,                                               -- đáp án chuẩn (1 cái)
  loi_giai    text,
  anh_de      text,                                               -- URL
  anh_dap_an  text,                                               -- URL; bắt buộc nếu có anh_de (ràng app)
  created_at  timestamptz not null default now()
);
create index on dai_cau_hoi (dang_chinh);

create table dai_cau_bo_de (
  ma_cau    text not null references dai_cau_hoi(ma_cau) on delete cascade,
  id_bo_de  text not null references dai_danh_muc_bo_de(id) on delete cascade,
  primary key (ma_cau, id_bo_de)
);

-- =============================== NHÁNH HÌNH ===============================

-- 4.1 Cây tri thức Hình — 3 tầng, lá = Dạng-hình
create table hinh_ban_do (
  ma_dang_hinh  text primary key default 'HD' || lpad(nextval('hinh_dang_seq')::text, 5, '0'),
  khoi          text not null,
  ma_mang       text not null,
  ten_mang      text not null,                                    -- tầng 1
  ma_loai_ch    text not null,
  ten_loai_ch   text not null,                                    -- tầng 2: loại câu hỏi
  ten_dang      text not null,                                    -- tầng 3 (lá): câu hỏi + phương pháp
  created_at    timestamptz not null default now()
);
create index on hinh_ban_do (khoi, ma_mang, ma_loai_ch);

-- 4.2 Danh mục 2 chiều phẳng (chiều thứ 3 = cây hinh_ban_do)
create table hinh_danh_muc_mo_hinh (
  id   text primary key default 'MH' || lpad(nextval('hinh_mh_seq')::text, 4, '0'),
  ten  text not null unique
);

create table hinh_danh_muc_bo_de (
  id   text primary key default 'HB' || lpad(nextval('hinh_bd_seq')::text, 4, '0'),
  ten  text not null unique
);

-- 4.3 Bài hình + nối Bài ↔ mô hình
create table hinh_bai (
  ma_bai      text primary key default 'HBai' || lpad(nextval('hinh_bai_seq')::text, 5, '0'),
  muc_do      smallint not null check (muc_do between 1 and 5),   -- độ khó tổng của bài
  noi_dung    text not null,                                      -- đề chung: giả thiết + mô tả hình
  anh_de      text,
  anh_dap_an  text,
  created_at  timestamptz not null default now()
);

create table hinh_bai_mo_hinh (
  ma_bai      text not null references hinh_bai(ma_bai) on delete cascade,
  id_mo_hinh  text not null references hinh_danh_muc_mo_hinh(id) on delete cascade,
  primary key (ma_bai, id_mo_hinh)
);

-- 4.4 Ý — con của Bài + nối Ý ↔ bổ đề
create table hinh_y (
  ma_y        text primary key default 'HY' || lpad(nextval('hinh_y_seq')::text, 6, '0'),
  ma_bai      text not null references hinh_bai(ma_bai) on delete cascade,
  thu_tu      smallint not null,                                  -- 1=a, 2=b, 3=c... + gradient độ khó
  dang_hinh   text not null references hinh_ban_do(ma_dang_hinh) on delete restrict,
  noi_dung_y  text not null,
  dap_an_y    text,
  loi_giai_y  text,
  unique (ma_bai, thu_tu)
);
create index on hinh_y (ma_bai);
create index on hinh_y (dang_hinh);

create table hinh_y_bo_de (
  ma_y      text not null references hinh_y(ma_y) on delete cascade,
  id_bo_de  text not null references hinh_danh_muc_bo_de(id) on delete cascade,
  primary key (ma_y, id_bo_de)
);

-- ───────────────────────── GRANTS (RLS off → cần cấp tường minh cho API roles) ─────────────────────────
-- Frontend dùng publishable key → role anon/authenticated. RLS off nên phải grant trực tiếp.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;
