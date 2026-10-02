-- ============================================================================
-- 202610021339 — tsa_kho_ban_do
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   TSA (Tư duy ĐH Bách khoa — bộ tài liệu "TSA PNL 2027") là một loại Toán ĐỘC LẬP với chương trình Toán hiện tại.
--   Thùy 02/10: "coi như một MÔN mới, mọi thứ giống Toán hiện tại" ⇒ ADR-mon: mỗi môn 1 trung tâm, BẢNG RIÊNG, không chung content.
--   Cây bản đồ dựng theo đúng tên folder/file của tài liệu: folder = CHỦ ĐỀ (ma_chu_de), file "Chủ đề NN. …" = CHUYÊN ĐỀ (ma_chuyen_de).
--   Tầng DẠNG chưa có ⇒ mỗi chuyên đề có đúng 1 dạng "Tổng hợp" (để câu duyệt được: trigger chặn duyệt dạng chờ) — chia dạng thật ở bước sau.
--   Mã: TS + khối(12) + số folder(2) + số file trong folder(2) + dạng(2). Dạng chờ: TS12000000 (qua _kho_dang_cho('tsa','12')).
--   Bảng dùng chung "hợp đồng cột" với kho các môn (hàm kho/snapshot/đo đọc theo tên cột) — như anh_*/khtn_*.
--
--   ⚠ CỐ Ý KHÔNG mở _kho_co_mon('TSA') (cùng lý do môn Anh 02/10): hàm app HS / tự luyện / đề thi còn nhánh "không phải KHTN thì là Toán".
--     Kho TSA lúc này chỉ dùng ở màn Kho / Duyệt kho.
--   ⚠ loai_cau 'keo_tha': lua_chon = ngân hàng thẻ; chưa có bảng form TN / điền ô.
--
-- MẤT GÌ: không mất dữ liệu. DROP + ADD lại 2 CHECK (kho_doi_dang_log.mon, kho_kiem_lo.kho) — chỉ NỚI thêm 'tsa'. Các hàm điều phối
--   thay bằng định nghĩa đang chạy (pg_get_functiondef 02/10) + đúng 1 nhánh 'TSA'; Toán/KHTN/Hình/Anh giữ nguyên hành vi.
-- ============================================================================

create sequence if not exists public.tsa_dang_seq;
create sequence if not exists public.tsa_cau_seq;

create table public.tsa_ban_do (
  ma_dang        text primary key default ('TS' || lpad(nextval('public.tsa_dang_seq')::text, 8, '0')),
  khoi           text not null,
  ma_chu_de      text not null,          -- CHỦ ĐỀ = folder (Số học · Đại số · …)
  ten_chu_de     text not null,
  ma_chuyen_de   text not null,          -- CHUYÊN ĐỀ = file "Chủ đề NN. …"
  ten_chuyen_de  text not null,
  ten_dang       text not null,
  muc_do         smallint not null,
  bac_toi_thieu  text not null references public.lop_bac(ma),
  created_at     timestamptz not null default now(),
  mo_ta_ngan     text,
  file_goc       text,                   -- tên file tài liệu gốc (không đuôi _GV/_HS) — truy nguồn
  thu_tu         smallint
);
comment on table public.tsa_ban_do is 'Bản đồ kho TSA (Tư duy ĐH Bách khoa). Cây: chủ đề (folder) → chuyên đề (file) → dạng. Môn độc lập với Toán.';

create table public.tsa_dang_ly_thuyet (
  ma_dang      text primary key references public.tsa_ban_do(ma_dang),
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  cap_nhat_at  timestamptz not null default now()
);
create table public.tsa_chuyen_de_ly_thuyet (
  ma_chuyen_de text primary key,
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  khong_can    boolean not null default false,
  cap_nhat_at  timestamptz not null default now()
);

create table public.tsa_cau_hoi (
  ma_cau          text primary key default ('TC' || lpad(nextval('public.tsa_cau_seq')::text, 6, '0')),
  dang_chinh      text not null references public.tsa_ban_do(ma_dang),
  loai_cau        text not null check (loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan', 'keo_tha')),
  noi_dung        text not null,
  lua_chon        jsonb,
  menh_de         jsonb,
  dap_an          text,
  loi_giai        text,
  anh_de          text,
  anh_dap_an      text,
  nguon           text not null default 'le',
  nguon_giai      text not null default 'nguoi',
  parent_ma_cau   text references public.tsa_cau_hoi(ma_cau),
  clone_method    text,
  created_at      timestamptz not null default now(),
  xoa_at          timestamptz,
  ma_cum          text,
  da_duyet        boolean not null default false,
  duyet_boi       uuid references public.nhan_su(id),
  duyet_at        timestamptz,
  giai_method     text,
  loi_giai_ai     text,
  dap_an_ai       text,
  ai_model        text,
  ai_de_xuat_at   timestamptz,
  kiem_may        text check (kiem_may in ('khop', 'nghi', 'khong_kiem_duoc')),
  kiem_may_at     timestamptz,
  kiem_may_boi    text check (kiem_may_boi in ('mcq-auto', 'claude_code', 'nguoi')),
  kiem_may_ghi    text,
  duyet_nguon     text check (duyet_nguon in ('nguoi', 'may', 'ai')),
  dang_ai_de_xuat text,
  kiem_may_lo     uuid references public.kho_kiem_lo(id),
  kho_chuan       boolean generated always as (public._kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored,
  ten_de_goc      text,
  -- riêng TSA: truy nguồn trong tài liệu
  phan_tai_lieu   text check (phan_tai_lieu in ('vi_du', 'ren_luyen', 'bai_tap')),   -- ví dụ minh hoạ · bài rèn luyện · bài tập (file không chia mục)
  so_cau_goc      smallint                                                          -- "Câu N" trong mục đó của tài liệu
);
create index tsa_cau_hoi_dang on public.tsa_cau_hoi (dang_chinh);
create index tsa_cau_hoi_kho_chuan_dang on public.tsa_cau_hoi using btree (dang_chinh) where (kho_chuan and xoa_at is null);
-- Danh tính theo KHOÁ NGUỒN, không theo vị trí: cùng (tài liệu, mục, số câu) chỉ có 1 câu chưa xoá ⇒ chạy lại script nhập không nhân đôi.
create unique index tsa_cau_hoi_khoa_nguon on public.tsa_cau_hoi (ten_de_goc, phan_tai_lieu, so_cau_goc) where xoa_at is null and ten_de_goc is not null;

-- Trigger — y hệt bộ của anh_cau_hoi/khtn_cau_hoi (đối xứng), tham số môn = 'tsa'
create trigger trg_chan_duyet_dang_cho before insert or update of da_duyet, dang_chinh on public.tsa_cau_hoi
  for each row execute function public._trg_chan_duyet_dang_cho();
create trigger trg_kho_cau_duyet_nguon before insert or update of da_duyet, duyet_nguon on public.tsa_cau_hoi
  for each row execute function public._kho_cau_duyet_nguon();
create trigger trg_log_kho_cau_tsa after delete or update on public.tsa_cau_hoi
  for each row execute function public.log_kho_cau();
create trigger trg_log_doi_dang after update of dang_chinh on public.tsa_cau_hoi
  for each row execute function public._trg_log_doi_dang('tsa', 'cau');
create trigger trg_log_kho_sua after update of noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, ma_cum on public.tsa_cau_hoi
  for each row execute function public._trg_log_kho_sua('tsa');
create trigger trg_de_thi_dien_dang after update of dang_chinh on public.tsa_cau_hoi
  for each row execute function public._trg_de_thi_dien_dang();
create trigger trg_tsa_ban_do_sync_ca_test_cau after update of ten_chuyen_de, muc_do on public.tsa_ban_do
  for each row execute function public.tg_ban_do_sync_ca_test_cau();

-- Sổ log dùng chung: nới CHECK thêm 'tsa' (kho_sua_log thuộc postgres ⇒ file riêng 202610021340_tsa_kho_sua_log_mon_check.sql, ÁP BẰNG SQL EDITOR).
alter table public.kho_doi_dang_log drop constraint kho_doi_dang_log_mon_check;
alter table public.kho_doi_dang_log add constraint kho_doi_dang_log_mon_check check (mon = any (array['dai', 'hgt', 'khtn', 'anh', 'tsa']));
alter table public.kho_kiem_lo drop constraint kho_kiem_lo_kho_check;
alter table public.kho_kiem_lo add constraint kho_kiem_lo_kho_check check (kho = any (array['dai', 'khtn', 'hgt', 'anh', 'tsa']));

-- RLS — cùng tư thế với kho Anh/KHTN
alter table public.tsa_ban_do enable row level security;
alter table public.tsa_dang_ly_thuyet enable row level security;
alter table public.tsa_chuyen_de_ly_thuyet enable row level security;
alter table public.tsa_cau_hoi enable row level security;
create policy tsa_ban_do_member_all on public.tsa_ban_do for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_dang_ly_thuyet_member_all on public.tsa_dang_ly_thuyet for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_chuyen_de_ly_thuyet_member_all on public.tsa_chuyen_de_ly_thuyet for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy tsa_cau_hoi_member_all on public.tsa_cau_hoi for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- Nạp bản đồ: 1 dạng "chưa phân" (trigger chặn duyệt) + 16 chuyên đề × 1 dạng tổng hợp
insert into public.tsa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, thu_tu)
values ('TS12000000', '12', 'TS1200', 'Chưa phân', 'TS120000', 'Chưa phân', 'Chưa phân dạng', 1, 'C', 'Câu chưa chắc thuộc chuyên đề nào. Trigger chặn duyệt tới khi gán dạng thật.', 0);
insert into public.tsa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, file_goc, thu_tu) values
  ('TS12010101', '12', 'TS1201', 'Số học', 'TS120101', 'Số nguyên tố, hợp số', 'Tổng hợp — Số nguyên tố, hợp số', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 01. Số nguyên tố, hợp số', 1),
  ('TS12010201', '12', 'TS1201', 'Số học', 'TS120102', 'Số chính phương', 'Tổng hợp — Số chính phương', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 02. Số chính phương', 2),
  ('TS12010301', '12', 'TS1201', 'Số học', 'TS120103', 'Phép chia hết, UCLN, BCNN', 'Tổng hợp — Phép chia hết, UCLN, BCNN', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 03. Phép chia hết, UCLN, BCNN', 3),
  ('TS12010401', '12', 'TS1201', 'Số học', 'TS120104', 'Số các chữ số của một số', 'Tổng hợp — Số các chữ số của một số', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 04. Số các chữ số của một số', 4),
  ('TS12010501', '12', 'TS1201', 'Số học', 'TS120105', 'Chữ số tận cùng của một lũy thừa', 'Tổng hợp — Chữ số tận cùng của một lũy thừa', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 05. Chữ số tận cùng của một lũy thừa', 5),
  ('TS12010601', '12', 'TS1201', 'Số học', 'TS120106', 'Đồng dư thức', 'Tổng hợp — Đồng dư thức', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 06. Đồng dư thức', 6),
  ('TS12010701', '12', 'TS1201', 'Số học', 'TS120107', 'Phương trình nghiệm nguyên và các nguyên lý Dirichle, cực hạn, bất biến', 'Tổng hợp — Phương trình nghiệm nguyên và các nguyên lý Dirichle, cực hạn, bất biến', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 07. Phương trình nghiệm nguyên và các nguyên lý Dirichle, cực hạn, bất biến', 7),
  ('TS12020101', '12', 'TS1202', 'Đại số', 'TS120201', 'Hàm số lượng giác', 'Tổng hợp — Hàm số lượng giác', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 01. Hàm số lượng giác', 8),
  ('TS12020201', '12', 'TS1202', 'Đại số', 'TS120202', 'Phương trình lượng giác', 'Tổng hợp — Phương trình lượng giác', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 02. Phương trình lượng giác', 9),
  ('TS12020301', '12', 'TS1202', 'Đại số', 'TS120203', 'Bài tập bổ trợ về dãy số, cấp số cộng, cấp số nhân', 'Tổng hợp — Bài tập bổ trợ về dãy số, cấp số cộng, cấp số nhân', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 03. Bài tập bổ trợ về dãy số, cấp số cộng, cấp số nhân', 10),
  ('TS12020401', '12', 'TS1202', 'Đại số', 'TS120204', 'Bài tập dãy hình và các câu trong đề TSA chính thức', 'Tổng hợp — Bài tập dãy hình và các câu trong đề TSA chính thức', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 03. Bài tập dãy hình và các câu trong đề TSA chính thức', 11),
  ('TS12020501', '12', 'TS1202', 'Đại số', 'TS120205', 'Dãy số, cấp số cộng, cấp số nhân', 'Tổng hợp — Dãy số, cấp số cộng, cấp số nhân', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 03. Dãy số, cấp số cộng, cấp số nhân', 12),
  ('TS12020601', '12', 'TS1202', 'Đại số', 'TS120206', 'Giới hạn hàm số', 'Tổng hợp — Giới hạn hàm số', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 04. Giới hạn hàm số', 13),
  ('TS12020701', '12', 'TS1202', 'Đại số', 'TS120207', 'Hàm số liên tục', 'Tổng hợp — Hàm số liên tục', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 05. Hàm số liên tục', 14),
  ('TS12020801', '12', 'TS1202', 'Đại số', 'TS120208', 'Các quy tắc đếm cơ bản', 'Tổng hợp — Các quy tắc đếm cơ bản', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 06. Các quy tắc đếm cơ bản', 15),
  ('TS12020901', '12', 'TS1202', 'Đại số', 'TS120209', 'Hoán vị - tổ hợp - chỉnh hợp', 'Tổng hợp — Hoán vị - tổ hợp - chỉnh hợp', 2, 'C', 'Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).', 'Chủ đề 07. Hoán vị - tổ hợp - chỉnh hợp', 16);

-- Hàm điều phối kho cốt lõi: thêm đúng 1 nhánh 'TSA' (dựng từ định nghĩa đang chạy)
CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_mon = 'Tiếng Anh' then 'anh_ban_do'
              when p_mon = 'TSA' then 'tsa_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              else 'dai_ban_do' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_cau_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_mon = 'Tiếng Anh' then 'anh_cau_hoi'
              when p_mon = 'TSA' then 'tsa_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              else 'dai_cau_hoi' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_lt_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_mon = 'Tiếng Anh' then 'anh_dang_ly_thuyet'
              when p_mon = 'TSA' then 'tsa_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_form_tn_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_tn'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_tn'
              when p_mon = 'TSA' then 'tsa_cau_form_tn'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_tn'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_tn'
              else 'dai_cau_form_tn' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_form_dien_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_dien'
              when p_mon = 'Tiếng Anh' then 'anh_cau_form_dien'
              when p_mon = 'TSA' then 'tsa_cau_form_dien'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_dien'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_dien'
              else 'dai_cau_form_dien' end
$function$;

CREATE OR REPLACE FUNCTION public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon not in ('KHTN', 'Tiếng Anh', 'TSA') and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              else null end
$function$;

CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'Tiếng Anh' then
    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;
  elsif p_mon = 'TSA' then
    select muc_do into v_md from tsa_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$;

CREATE OR REPLACE FUNCTION public._kho_dang_cho(p_tbl text, p_khoi text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' when 'anh' then 'E' when 'tsa' then 'TS' end
         || lpad(p_khoi, 2, '0') || '000000'
$function$;

CREATE OR REPLACE FUNCTION public.fn_kho_tbl(p_mon text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_mon when 'toan' then 'dai' when 'khtn' then 'khtn' when 'hgt' then 'hgt' when 'hinh_hoc' then 'hinh_hoc' when 'anh' then 'anh' when 'tsa' then 'tsa' end
$function$;

CREATE OR REPLACE FUNCTION public.count_cau_by_dang(p_tbl text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi', 'anh_cau_hoi', 'tsa_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I where xoa_at is null group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $function$;
