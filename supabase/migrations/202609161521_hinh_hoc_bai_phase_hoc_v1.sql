-- ============================================================================
-- 202609161521 — HÌNH HỌC · PHASE HỌC KIẾN THỨC (Bài) v1  (CEO 16/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 16/09): học hình chia 2 phase — HỌC KIẾN THỨC (mới) và LUYỆN TẬP (cũ).
--   - Phase LUYỆN giữ nguyên cấu trúc Mô hình/Dạng/Bổ đề/Bài toán/Biến thể/Chuỗi cách giải
--     hiện có (`hinh_mo_hinh`, `hinh_dang`, `hinh_bo_de`, `hinh_baitoan`, `hinh_baitoan_bien_the`…).
--   - Phase HỌC dùng đơn vị "Bài" — clone gần y hệt cấu trúc DẠNG bên Đại:
--     Bài  ↔ Dạng     · Lý thuyết Bài ↔ Lý thuyết Dạng
--     Cụm  ↔ Cụm bài  · Câu           ↔ Câu hỏi Đại
--     Khác Đại: KHÔNG có tầng cây Chủ đề/Chuyên đề bên NGOÀI Bài — Bài đứng phẳng theo khối
--     (CEO: "1 tầng thôi, 1 Bài Hình = 1 Dạng Đại"). Bên trong Bài vẫn có Cụm.
--   - Câu phẳng: 1 câu = 1 đề + 1 lời giải + 1 ảnh (nếu có), KHÔNG có biến thể/bổ đề/chuỗi ý.
--   - Nhãn `mo_hinh_id` OPTIONAL trên câu → cho phép câu Bài học đóng góp 1 data point
--     mastery vào mô hình phase luyện (không thông cứng 2 phase, xem HANDOFF/spec).
--
-- ⭐ TÊN BẢNG `hinh_hoc_*` — KHÔNG động `hinh_bai` cũ:
--   `hinh_bai` đã tồn tại và giữ "bài toán mẫu của mô hình" phase LUYỆN (có `mo_hinh_id` NOT NULL,
--    trạng thái `tam`/`chinh`). Đó là 1 khái niệm khác. Đặt tên khác để 2 khái niệm sống song song,
--    không đè nhau. Sau khi UI mới stable + CEO chuẩn hoá dữ liệu cũ mới bàn merge/rename.
--
-- ⭐ NULLABLE CÓ CHỦ Ý (CLAUDE.md §1.5 "thà bỏ trống còn hơn đánh sai"):
--   - `hinh_hoc_cau_hoi.ma_cum` NULL = "chưa ai phân cụm" (KHÔNG phải cụm rỗng) — như dai_cau_hoi.
--   - `hinh_hoc_cau_hoi.mo_hinh_id` NULL = "chưa/không gán nhãn mô hình" — mastery signal optional.
--   - `hinh_hoc_bai_ly_thuyet.file_url`/`ten_file` NULL: cho phép lý thuyết CHỈ có `noi_dung` inline
--     (soi gương `dai_dang_ly_thuyet` từ 0009_lythuyet_noidung.sql — không bắt buộc file kèm).
--
-- ⭐ RLS on + policy `<t>_member_all` với `la_thanh_vien()` — copy nguyên mẫu 202608131918.
--
-- MẤT GÌ: không. Chỉ THÊM 4 bảng + 3 sequence. Không xoá/sửa cột nào đang có, không backfill data.
-- ============================================================================

-- ── 1. SEQUENCES ─────────────────────────────────────────────────────────────
create sequence if not exists hinh_hoc_bai_seq;
create sequence if not exists hinh_hoc_cum_seq;
create sequence if not exists hinh_hoc_cau_seq;

-- ── 2. BÀI ───────────────────────────────────────────────────────────────────
-- Bài đứng độc lập, phẳng theo khối. Không có tầng cha (Chủ đề/Chuyên đề).
-- `thu_tu` để sort trong khối; `bac_toi_thieu` soi gương Đại (đọc từ dai_ban_do.bac_toi_thieu).
create table if not exists hinh_hoc_bai (
  ma_bai          text primary key default 'HH' || lpad(nextval('hinh_hoc_bai_seq')::text, 5, '0'),
  khoi            text not null,                                        -- '6'..'12', '4T', '5T'
  ten_bai         text not null,
  thu_tu          smallint not null default 1,
  bac_toi_thieu   text references lop_bac(ma) on delete set null,       -- optional, như Đại
  da_duyet        boolean not null default false,
  duyet_boi       uuid references nhan_su(id) on delete set null,
  duyet_at        timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists hinh_hoc_bai_khoi_idx on hinh_hoc_bai (khoi, thu_tu);

-- ── 3. LÝ THUYẾT BÀI ─────────────────────────────────────────────────────────
-- 1-1 với Bài (ép PK = ma_bai). Có dòng = có lý thuyết; không dòng = chưa (§1.5, soi gương 0004).
-- `noi_dung` inline + `file_url`/`ten_file` optional (từ 0009 Đại đã nới).
create table if not exists hinh_hoc_bai_ly_thuyet (
  ma_bai       text primary key references hinh_hoc_bai(ma_bai) on delete cascade,
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  cap_nhat_at  timestamptz not null default now()
);

-- ── 4. CỤM BÀI ───────────────────────────────────────────────────────────────
-- Clone `dai_cum_bai`. `ten` NULL = chưa đặt, UI suy "Cụm {thu_tu}".
create table if not exists hinh_hoc_cum_bai (
  ma_cum      text primary key default 'HHCUM' || lpad(nextval('hinh_hoc_cum_seq')::text, 5, '0'),
  ma_bai      text not null references hinh_hoc_bai(ma_bai) on delete cascade,
  ten         text,
  thu_tu      smallint not null default 1,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create index if not exists hinh_hoc_cum_bai_bai_idx on hinh_hoc_cum_bai (ma_bai);

-- ── 5. CÂU HỎI ───────────────────────────────────────────────────────────────
-- Clone `dai_cau_hoi` phần CỐT LÕI. KHÔNG copy: parent_ma_cau/clone_method (không biến thể AI),
--   ai_*/kiem_may_* (chưa dùng ngay — thêm sau khi cần), menh_de/lua_chon (Hình chủ yếu tự luận).
-- Vẫn có: da_duyet, xoa_at (kho rác — resolve tài liệu cũ).
-- `ma_cum` on delete set null → xoá cụm KHÔNG mất câu, câu về rổ "chưa phân cụm".
-- `mo_hinh_id` on delete set null → xoá mô hình KHÔNG mất câu, chỉ mất nhãn.
create table if not exists hinh_hoc_cau_hoi (
  ma_cau        text primary key default 'HHC' || lpad(nextval('hinh_hoc_cau_seq')::text, 6, '0'),
  ma_bai        text not null references hinh_hoc_bai(ma_bai) on delete restrict,
  ma_cum        text references hinh_hoc_cum_bai(ma_cum) on delete set null,
  mo_hinh_id    uuid references hinh_mo_hinh(id) on delete set null,     -- nhãn optional cho mastery signal
  khoi          text not null,
  noi_dung      text not null,                                            -- đề bài
  dap_an        text,
  loi_giai      text,
  anh_de        text,                                                     -- URL ảnh đề (dùng KHO_BUCKET)
  anh_dap_an    text,                                                     -- URL ảnh đáp án
  thu_tu        smallint not null default 1,                              -- sort trong Bài / Cụm
  da_duyet      boolean not null default false,
  duyet_boi     uuid references nhan_su(id) on delete set null,
  duyet_at      timestamptz,
  xoa_at        timestamptz,                                              -- kho rác — resolve tài liệu cũ
  created_at    timestamptz not null default now()
);
create index if not exists hinh_hoc_cau_hoi_bai_idx on hinh_hoc_cau_hoi (ma_bai);
create index if not exists hinh_hoc_cau_hoi_cum_idx on hinh_hoc_cau_hoi (ma_cum);
create index if not exists hinh_hoc_cau_hoi_mo_hinh_idx on hinh_hoc_cau_hoi (mo_hinh_id) where mo_hinh_id is not null;

-- ── 6. RLS — copy nguyên mẫu `<t>_member_all` (202608131918 §4) ──────────────
do $$
declare t text;
begin
  foreach t in array array['hinh_hoc_bai', 'hinh_hoc_bai_ly_thuyet', 'hinh_hoc_cum_bai', 'hinh_hoc_cau_hoi']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_all', t);
    execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())',
                   t || '_member_all', t);
  end loop;
end $$;

-- ── 7. GRANTS ────────────────────────────────────────────────────────────────
grant select, insert, update, delete on hinh_hoc_bai, hinh_hoc_bai_ly_thuyet, hinh_hoc_cum_bai, hinh_hoc_cau_hoi
  to authenticated;
grant usage on sequence hinh_hoc_bai_seq, hinh_hoc_cum_seq, hinh_hoc_cau_seq to authenticated;

-- ── 8. RPC ĐẾM CÂU THEO BÀI ─────────────────────────────────────────────────
-- Soi gương 0062_count_cau_by_dang: GROUP BY ở Postgres, trả jsonb — tránh PostgREST max-rows
-- cắt cụt danh sách câu khi kho lớn (§2.0 CLAUDE.md: mọi tổng hợp phải ở DB).
create or replace function public.count_cau_by_bai_hh(p_khoi text)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public'
as $$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  select coalesce(jsonb_object_agg(ma_bai, n), '{}'::jsonb)
    into result
    from (select ma_bai, count(*) n from hinh_hoc_cau_hoi
           where xoa_at is null and khoi = p_khoi
           group by ma_bai) t;
  return result;
end $$;

revoke all on function public.count_cau_by_bai_hh(text) from public;
grant execute on function public.count_cau_by_bai_hh(text) to authenticated;
