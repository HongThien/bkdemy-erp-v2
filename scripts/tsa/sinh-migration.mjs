// Sinh migration tạo kho môn TSA từ tsa.json (bản đồ) + định nghĩa hàm ĐANG CHẠY (thêm đúng 1 nhánh TSA).
//   node scripts/tsa/sinh-migration.mjs <tsa.json> <thư mục chứa fn_*.sql> <file migration ra> <ts1> <ts2>
// fn_*.sql = pg_get_functiondef của các hàm điều phối, lấy từ DB đang chạy (CLAUDE.md: KHÔNG dựng từ file migration cũ).
import { readFileSync, writeFileSync } from 'node:fs'
const [, , tsaJson, fnDir, ra, ts1, ts2] = process.argv
const j = JSON.parse(readFileSync(tsaJson, 'utf8'))
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'"
const KHOI = '12'
const doc = (n) => readFileSync(`${fnDir}/fn_${n}.sql`, 'utf8').replace(/\r\n/g, '\n').trim()
const loi = (m) => { throw new Error('không thấy mốc: ' + m) }

function vaCase(n, tbl) { // thêm 1 dòng when sau dòng của môn Anh
  const s = doc(n)
  const re = /( *)when p_mon = 'Tiếng Anh' then '(anh_[a-z_]+)'\n/
  if (!re.test(s)) loi('Anh trong ' + n)
  return s.replace(re, (m, sp) => `${m}${sp}when p_mon = 'TSA' then '${tbl}'\n`)
}
const hams = []
hams.push(vaCase('_kho_ban_do_tbl', 'tsa_ban_do'))
hams.push(vaCase('_kho_cau_tbl', 'tsa_cau_hoi'))
hams.push(vaCase('_kho_lt_tbl', 'tsa_dang_ly_thuyet'))
hams.push(vaCase('_kho_form_tn_tbl', 'tsa_cau_form_tn'))
hams.push(vaCase('_kho_form_dien_tbl', 'tsa_cau_form_dien'))
{
  const s = doc('_kho_nhanh_cua_dang')
  if (!s.includes("('KHTN', 'Tiếng Anh')")) loi('nhanh_cua_dang')
  hams.push(s.split("('KHTN', 'Tiếng Anh')").join("('KHTN', 'Tiếng Anh', 'TSA')"))
}
{
  const s = doc('_kho_muc_do_dang')
  const a = "  elsif p_mon = 'Tiếng Anh' then\n    select muc_do into v_md from anh_ban_do where ma_dang = p_ma_dang;\n"
  if (!s.includes(a)) loi('muc_do_dang')
  hams.push(s.replace(a, a + "  elsif p_mon = 'TSA' then\n    select muc_do into v_md from tsa_ban_do where ma_dang = p_ma_dang;\n"))
}
{
  const s = doc('_kho_dang_cho'), a = "when 'anh' then 'E' end"
  if (!s.includes(a)) loi('dang_cho')
  hams.push(s.replace(a, "when 'anh' then 'E' when 'tsa' then 'TS' end"))
}
{
  const s = doc('fn_kho_tbl'), a = "when 'anh' then 'anh' end"
  if (!s.includes(a)) loi('fn_kho_tbl')
  hams.push(s.replace(a, "when 'anh' then 'anh' when 'tsa' then 'tsa' end"))
}
{
  const s = doc('count_cau_by_dang'), a = "'anh_cau_hoi')"
  if (!s.includes(a)) loi('count_cau_by_dang')
  hams.push(s.replace(a, "'anh_cau_hoi', 'tsa_cau_hoi')"))
}

// bản đồ: chủ đề = thư mục có file; chuyên đề = file; 1 dạng "tổng hợp" mỗi chuyên đề
const dong = []
let thuTu = 0
for (const cd of j.chuyen_de) {
  const maChuDe = `TS${KHOI}${cd.so_chu_de}`
  const maCd = `${maChuDe}${String(cd.thu_tu).padStart(2, '0')}`
  const maDang = `${maCd}01`
  const tenChuDe = j.chu_de.find((x) => x.so === cd.so_chu_de).ten
  dong.push(`  (${q(maDang)}, ${q(KHOI)}, ${q(maChuDe)}, ${q(tenChuDe)}, ${q(maCd)}, ${q(cd.ten)}, ${q('Tổng hợp — ' + cd.ten)}, 2, 'C', ${q('Chưa chia dạng: gom mọi câu của chuyên đề theo đúng thứ tự tài liệu. Chia dạng ở bước sau (màn Đề xuất).')}, ${q(cd.file_goc)}, ${++thuTu})`)
}

const sql = `-- ============================================================================
-- ${ts1} — tsa_kho_ban_do
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

-- Sổ log dùng chung: nới CHECK thêm 'tsa' (kho_sua_log thuộc postgres ⇒ file riêng ${ts2}_tsa_kho_sua_log_mon_check.sql, ÁP BẰNG SQL EDITOR).
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

-- Nạp bản đồ: 1 dạng "chưa phân" (trigger chặn duyệt) + ${j.chuyen_de.length} chuyên đề × 1 dạng tổng hợp
insert into public.tsa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, thu_tu)
values ('TS${KHOI}000000', '${KHOI}', 'TS${KHOI}00', 'Chưa phân', 'TS${KHOI}0000', 'Chưa phân', 'Chưa phân dạng', 1, 'C', 'Câu chưa chắc thuộc chuyên đề nào. Trigger chặn duyệt tới khi gán dạng thật.', 0);
insert into public.tsa_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan, file_goc, thu_tu) values
${dong.join(',\n')};

-- Hàm điều phối kho cốt lõi: thêm đúng 1 nhánh 'TSA' (dựng từ định nghĩa đang chạy)
${hams.join(';\n\n')};
`
writeFileSync(ra, sql, 'utf8')
console.log('đã sinh', ra, sql.split('\n').length, 'dòng')
