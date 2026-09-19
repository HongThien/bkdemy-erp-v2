-- ============================================================================
-- 202609121312 — toan_de_thi_va_toan_de_thi_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Luồng "nhập đề thi" (khác luồng "nhập câu tự do"): 1 file PDF không chỉ chứa
--   câu để bóc về kho, mà CÒN là 1 đề nguyên vẹn (BGD/Sở/Cụm 2025...) — phải
--   giữ được thứ tự câu, phân theo phần I/II/III/IV, timing, mã đề, năm, nguồn
--   → sau này HS luyện tập đúng cấu trúc đề thật (pha 2 tách riêng).
--
--   Tại sao TOÁN 1 bảng đề (không tách dai_de_thi / hgt_de_thi)?
--     Đề Toán TN 2025 GỘP Đại (gồm cả giải tích khối 12 — trong dai_ban_do đã có
--     36 dạng "giải tích") + Hình (trong hgt_ban_do) vào 1 unit thi duy nhất.
--     Tách 2 bảng ⇒ 1 đề thi phải tồn tại ở cả 2 nơi, ghép qua parent_de_id ⇒
--     query lấy đề đầy đủ luôn phải union 2 bảng ⇒ rắc rối vô ích. Gộp về
--     "super-môn Toán" — phần "mỗi môn 1 bảng" của §1.6 CLAUDE.md áp cho cấp
--     Toán/Văn/Anh/KHTN, không cho cấp con dai/hgt.
--
--   toan_de_thi_cau dùng 2 FK nullable (ma_cau_dai / ma_cau_hgt) + CHECK
--   num_nonnulls = 1 thay vì 1 cột text ref + 1 cột dispatch — vì FK cứng chặn
--   được xoá câu đang dùng trong đề, và tránh bẫy "text ref rụng im lặng"
--   (§2 CLAUDE.md — memory `[tham chieu text khong FK bi rụng]`).
--
-- MẤT GÌ: KHÔNG mất gì. Thuần thêm bảng + index + sequence. Không đụng bảng cũ.
-- ============================================================================

-- Sequence cho id đề — 'TD' + 5 số (đủ cho ~99999 đề, quá dư)
create sequence if not exists toan_de_thi_seq;

-- ============================================================================
-- toan_de_thi — 1 dòng = 1 đề Toán
-- ============================================================================
create table if not exists toan_de_thi (
  id                text primary key
                    default ('TD' || lpad(nextval('toan_de_thi_seq')::text, 5, '0')),

  -- Metadata đề
  ten               text not null,                    -- "Đề Tham Khảo BGD 2025 Mã 0104"
  nguon             text not null default 'le',       -- 'bgd' | 'so' | 'cum_chuyen_mon' | 'thi_thu' | 'le'
  ma_de             text,                             -- "0104" (BGD có, đề khác có thể null)
  nam               int,                              -- 2025 (null nếu đề tự soạn không rõ năm)
  khoi              text not null,                    -- '10' | '11' | '12'
  ten_de_goc        text,                             -- basename file gốc (tương tự cột trong <mon>_cau_hoi)
  thoi_gian_phut    int,                              -- 90 | 120 | ...
  ghi_chu           text,

  -- Cấu trúc phần (theo đề TN 2025):
  --   [{"phan":"I","loai":"trac_nghiem","so_cau":12,"diem_moi_cau":0.25},
  --    {"phan":"II","loai":"dung_sai","so_cau":4,"diem_moi_cau":1.0},
  --    {"phan":"III","loai":"tra_loi_ngan","so_cau":6,"diem_moi_cau":0.5}]
  -- Là declarative — thứ tự phần, số câu mỗi phần, điểm ước lượng. Data thực
  -- (câu nào ở phần nào) nằm ở toan_de_thi_cau.
  cau_truc          jsonb not null default '[]'::jsonb,

  -- Duyệt (đối xứng <mon>_cau_hoi)
  da_duyet          boolean not null default false,
  duyet_boi         uuid references nhan_su(id),
  duyet_at          timestamptz,

  created_at        timestamptz not null default now(),
  xoa_at            timestamptz,                       -- kho rác (§2 CLAUDE.md)

  constraint toan_de_thi_nguon_check
    check (nguon in ('bgd','so','cum_chuyen_mon','thi_thu','le')),
  constraint toan_de_thi_khoi_check
    check (khoi in ('10','11','12'))
);

comment on table toan_de_thi is
  'Kho đề thi TOÁN (Đại+Hình). 1 dòng = 1 đề nguyên vẹn (BGD/Sở/Cụm/thi thử/le). Câu chi tiết ở toan_de_thi_cau.';
comment on column toan_de_thi.cau_truc is
  'Cấu trúc declarative các phần: [{phan, loai, so_cau, diem_moi_cau}]. Data thực ở toan_de_thi_cau.';

create index if not exists idx_toan_de_thi_khoi_nam on toan_de_thi(khoi, nam desc);
create index if not exists idx_toan_de_thi_nguon    on toan_de_thi(nguon);
create index if not exists idx_toan_de_thi_da_duyet on toan_de_thi(da_duyet) where xoa_at is null;

-- ============================================================================
-- toan_de_thi_cau — thứ tự câu trong đề, phần I/II/III/IV, điểm
-- ============================================================================
create table if not exists toan_de_thi_cau (
  id            uuid primary key default gen_random_uuid(),
  de_id         text not null references toan_de_thi(id) on delete cascade,

  thu_tu        int  not null,                        -- 1..N trong đề (ordering)
  phan          text not null,                        -- 'I' | 'II' | 'III' | 'IV'

  -- Chính xác 1 trong 2 FK phải non-null. FK cứng chặn xoá câu đang dùng.
  ma_cau_dai    text references dai_cau_hoi(ma_cau) on update cascade on delete restrict,
  ma_cau_hgt    text references hgt_cau_hoi(ma_cau) on update cascade on delete restrict,

  diem          numeric,                              -- điểm câu này (null ⇒ dùng diem_moi_cau của phần)

  created_at    timestamptz not null default now(),

  constraint toan_de_thi_cau_phan_check
    check (phan in ('I','II','III','IV')),
  constraint toan_de_thi_cau_1_of_2_check
    check (num_nonnulls(ma_cau_dai, ma_cau_hgt) = 1),
  constraint toan_de_thi_cau_thu_tu_uniq
    unique (de_id, thu_tu)
);

comment on table toan_de_thi_cau is
  'Câu trong đề Toán — có thứ tự, phần I/II/III/IV. FK cứng tới dai_cau_hoi HOẶC hgt_cau_hoi (num_nonnulls=1). Xoá câu bị chặn nếu đang trong đề.';

create index if not exists idx_toan_de_thi_cau_de       on toan_de_thi_cau(de_id, thu_tu);
create index if not exists idx_toan_de_thi_cau_ma_dai   on toan_de_thi_cau(ma_cau_dai) where ma_cau_dai is not null;
create index if not exists idx_toan_de_thi_cau_ma_hgt   on toan_de_thi_cau(ma_cau_hgt) where ma_cau_hgt is not null;

-- ============================================================================
-- RLS — mặc định deny; policy authenticated all (đối xứng nhap_kho_log,
-- dai_cau_hoi... — kho nội bộ, không public)
-- ============================================================================
alter table toan_de_thi     enable row level security;
alter table toan_de_thi_cau enable row level security;

drop policy if exists "toan_de_thi_authenticated_all"     on toan_de_thi;
create policy "toan_de_thi_authenticated_all"
  on toan_de_thi for all to authenticated
  using (true) with check (true);

drop policy if exists "toan_de_thi_cau_authenticated_all" on toan_de_thi_cau;
create policy "toan_de_thi_cau_authenticated_all"
  on toan_de_thi_cau for all to authenticated
  using (true) with check (true);
