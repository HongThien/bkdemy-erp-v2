-- 0090 — Test đầu vào: Đề test (chuẩn bị trước) + chấm + nhận xét + trả bài.
-- (BKDEMY_TESTDAUVAO_SPEC_DETAIL.md, PLAN đã duyệt 07-07.) Đề test là entity RIÊNG, KHÔNG tái dùng
-- tai_lieu(loai='de_thi') — câu test đầu vào "chấm xong quên", không neo kho lâu dài (§A.2 + §C).
-- ca_test (0087/0088) ĐÃ LÀ "buổi test" của spec — không thêm tầng nhóm-thí-sinh.

-- ── ĐỀ TEST (chuẩn bị trước, theo khối+môn; đổi định kỳ = tạo đề mới, đề cũ giữ lịch sử) ──
create table if not exists de_test (
  id          uuid primary key default gen_random_uuid(),
  khoi        text not null,
  mon         text not null,   -- nhãn môn bắt buộc (CLAUDE.md §1.6)
  ten         text not null,
  active      boolean not null default true, -- false = ngừng dùng (đề mới thay), KHÔNG xoá (giữ lịch sử)
  created_by  uuid,
  created_at  timestamptz not null default now()
);
create index if not exists idx_de_test_khoi_mon on de_test(khoi, mon);

-- Mỗi ý = 1 câu (§A.3): câu Đúng/Sai 8 ý = 8 dòng độc lập, mỗi dòng neo 1 dạng.
create table if not exists de_test_cau (
  id             uuid primary key default gen_random_uuid(),
  de_test_id     uuid not null references de_test(id) on delete cascade,
  thu_tu         int not null,
  nhan           text not null,           -- "Câu 1", "Câu 2a"…
  diem_toi_da    numeric not null default 1,
  dap_an         text,                    -- đối chiếu khi chấm (cột giữa)
  ma_dang        text,                    -- dạng neo — cho biểu đồ chuyên đề (KHÔNG bắt buộc)
  created_at     timestamptz not null default now()
);
create index if not exists idx_de_test_cau_de on de_test_cau(de_test_id);

-- ── MỞ RỘNG ca_test: đề gán + 3 mốc-xong (chấm/nhận xét/trả bài, nối tiếp điểm-danh đã có) ──
alter table ca_test add column if not exists de_test_id       uuid references de_test(id);
alter table ca_test add column if not exists cham_xong_at     timestamptz;
alter table ca_test add column if not exists danh_gia_xong_at timestamptz;
alter table ca_test add column if not exists tra_bai_xong_at  timestamptz;
-- Nhận xét (§STORY 3): kỹ năng (Tốt/Ổn/Kém) + kiến thức 4 dòng (Toán-shaped, nhập tay) + khác (tự do).
-- KHÔNG chuẩn hoá cột riêng — bộ trục khác nhau theo môn (spec §F.2 CHƯA CHỐT), để jsonb linh hoạt.
alter table ca_test add column if not exists nhan_xet jsonb;
-- Lớp đề xuất: REUSE ung_vien.lop_du_kien_id có sẵn (đúng ý "lớp dự kiến/đề xuất") — KHÔNG thêm cột mới.

-- Snapshot câu khi gán đề vào ca_test (§A.2: neo bản chụp, đổi đề sau không hỏng bài đã chấm).
-- de_test_cau_id chỉ là backlink THÔNG TIN (on delete set null) — KHÔNG dùng để tính toán sống.
create table if not exists ca_test_cau (
  id             uuid primary key default gen_random_uuid(),
  ca_test_id     uuid not null references ca_test(id) on delete cascade,
  de_test_cau_id uuid references de_test_cau(id) on delete set null,
  thu_tu         int not null,
  nhan           text not null,
  diem_toi_da    numeric not null default 1,
  dap_an         text,
  ma_dang        text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_ca_test_cau_ca on ca_test_cau(ca_test_id);

-- Kết quả chấm — anti-NULL (§1.5): dòng CHỈ tồn tại khi đã chấm câu đó thật. Đ=full·C=50%·S=0 (§A.4).
create table if not exists ca_test_cau_kq (
  id             uuid primary key default gen_random_uuid(),
  ca_test_cau_id uuid not null unique references ca_test_cau(id) on delete cascade,
  ket_qua        text not null check (ket_qua in ('correct', 'partial', 'wrong')),
  diem           numeric not null,
  cham_boi       uuid,
  cham_at        timestamptz not null default now()
);

-- Thư viện câu mẫu nhận xét (mirror V1 sat_hach_nhan_xet_templates) — gõ-để-tìm, per môn.
create table if not exists nhan_xet_mau (
  id          uuid primary key default gen_random_uuid(),
  mon         text not null,
  nhom        text not null check (nhom in ('ky_nang', 'kien_thuc', 'khac')),
  noi_dung    text not null,
  created_by  uuid,
  created_at  timestamptz not null default now()
);

-- ── RLS: staff-only (la_thanh_vien()), cùng pattern ca_test (0087) ──
alter table de_test        enable row level security;
alter table de_test_cau    enable row level security;
alter table ca_test_cau    enable row level security;
alter table ca_test_cau_kq enable row level security;
alter table nhan_xet_mau   enable row level security;

create policy de_test_member_all        on de_test        for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy de_test_cau_member_all    on de_test_cau    for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy ca_test_cau_member_all    on ca_test_cau    for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy ca_test_cau_kq_member_all on ca_test_cau_kq for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy nhan_xet_mau_member_all   on nhan_xet_mau   for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

grant select, insert, update, delete on de_test        to authenticated;
grant select, insert, update, delete on de_test_cau    to authenticated;
grant select, insert, update, delete on ca_test_cau    to authenticated;
grant select, insert, update, delete on ca_test_cau_kq to authenticated;
grant select, insert, update, delete on nhan_xet_mau   to authenticated;
