-- ============================================================================
-- 202607222255 — danhgia_hoctap_level_botro_yeu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Nền cho module "Đánh giá kết quả học tập" (`spec-danhgia-hoctap.md`; quyết định + phản biện
--   ở `PLAN-danhgia-hoctap.md`, Thùy duyệt 07-22). Verify §8 đã chạy trên DB thật TRƯỚC khi
--   viết file này — kết quả ở `docs/verify-danhgia-hoctap.md`.
--
--   ⭐ VÌ SAO BẢNG BỔ TRỢ YẾU RIÊNG, KHÔNG DÙNG `bo_tro_duoi` (PLAN §1.A — spec trỏ nhầm bảng):
--   `bo_tro_duoi` = bổ trợ ĐUỔI — HS MỚI / vào lớp giữa chừng chậm hơn chương trình lớp
--   (data thật: `nguon` chỉ 'thu_cong'|'tuyen_sinh', `ly_do` "Vào lớp giữa chừng"). Vòng đời:
--   chốt scope dạng + SỐ BUỔI dự kiến → xếp batch cả đợt → học đủ N buổi có mặt → đóng.
--   Bổ trợ YẾU khác hẳn: sinh từ ĐO LƯỜNG (dạng ≤0.5), đóng TỪNG DẠNG khi retest > 0.5, không
--   có khái niệm "số buổi cover hết dạng". Nhét chung 1 bảng sẽ phá `demTabDuoi`, chỉ số
--   "Xếp x/N · Học y/N" và luồng duyệt của team học thuật đang chạy thật.
--   `buoi_hoc.loai` ĐÃ có sẵn 'bo_tro_yeu' trong CHECK (chưa buổi nào dùng) → không cần nới.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG MẤT GÌ. File này chỉ CREATE TABLE IF NOT EXISTS + 1 ADD COLUMN nullable.
--   Không drop, không alter thu hẹp, không đụng dòng dữ liệu nào đang có.
-- ============================================================================

-- ============================================================================
-- 1. LEVEL HỌC SINH — trạng thái HIỆN TẠI (đọc nhanh)
-- ============================================================================
-- ⭐ Level = trạng thái của HỌC SINH, KHÔNG phải của dạng (spec §3). Một HS = MỘT thanh level
--   kiến thức + MỘT thanh level thái độ, hai thanh ĐỘC LẬP HOÀN TOÀN (giỏi vẫn có thể thái độ
--   kém và ngược lại) → tách bằng cột `loai`, không nhồi 2 số vào 1 dòng.
-- ⭐ Mọi dữ liệu HỌC TẬP mang nhãn MÔN (CLAUDE.md §1.6) → `mon` nằm trong khoá.
-- ⚠ §1.5 chống-NULL: KHÔNG seed sẵn cả roster ở L0. "Chưa có dòng" = đang bình thường (L0);
--   chỉ đẻ dòng khi HS thật sự rời L0. Chỗ đọc phải coalesce về 0, không chờ NULL.
create table if not exists hs_level (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  mon text not null,
  loai text not null check (loai in ('kien_thuc', 'thai_do')),
  level smallint not null check (level between 0 and 3),
  updated_at timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, loai)
);
alter table hs_level enable row level security;
drop policy if exists hs_level_member_all on hs_level;
create policy hs_level_member_all on hs_level for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hs_level to authenticated;

-- ============================================================================
-- 2. hs_level_log — LỊCH SỬ DUYỆT = CASE LOG
-- ============================================================================
-- ⭐ Thùy 07-22: "Bản chất việc L1 L2 L3 chính là case log rồi đấy" → KHÔNG dựng entity `case`/
--   `van_de`/`playbook` như BKDEMY_CANHBAO_BOTRO_SPEC. Mỗi lượt duyệt = 1 mắt xích của vòng.
-- ⭐ Thùy 07-22: "Hệ thống chỉ đề xuất thôi còn người duyệt. Ghi lại log của toàn bộ duyệt để
--   sau này analys." → sửa spec §4.1/§4.2 (spec viết máy TỰ lên/xuống level).
--   · ĐỀ XUẤT = PURE-DERIVE, KHÔNG đẻ dòng chờ ở đây (CLAUDE.md §4: không bảng `tasks`, không
--     row placeholder). Bảng này chỉ nhận dòng KHI NGƯỜI ĐÃ BẤM DUYỆT.
--   · Ghi CẢ HAI VẾ trong 1 dòng ⇒ DELTA lộ TỰ ĐỘNG khi `level_chot <> level_may_de_xuat`.
--     Không phải bắt người tự khai "tôi sửa gì" (chỗ spec cũ phải làm thủ công).
-- `ly_do_may` jsonb = SNAPSHOT tín hiệu lúc đề xuất (diện dạng yếu, cờ BTVN-che, chuông đỏ, số
--   lần đo kể từ day_at…). PHẢI đóng băng: mastery là suy-động, đọc lại sau sẽ KHÔNG tái tạo
--   được bối cảnh lúc quyết → không snapshot = mất vĩnh viễn lý do của quyết định.
create table if not exists hs_level_log (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  mon text not null,
  loai text not null check (loai in ('kien_thuc', 'thai_do')),
  level_cu smallint check (level_cu between 0 and 3),
  level_may_de_xuat smallint check (level_may_de_xuat between 0 and 3),
  ly_do_may jsonb not null default '{}'::jsonb,
  level_chot smallint not null check (level_chot between 0 and 3),
  ly_do_nguoi text,
  actor uuid,
  created_at timestamptz not null default now()
);
create index if not exists hs_level_log_hs_idx on hs_level_log (hoc_sinh_id, mon, loai, created_at desc);
-- Truy vấn phân tích chính: "người duyệt KHÁC máy ở đâu" — index riêng phần lệch cho gọn.
create index if not exists hs_level_log_delta_idx on hs_level_log (created_at desc)
  where level_may_de_xuat is not null and level_chot <> level_may_de_xuat;
alter table hs_level_log enable row level security;
drop policy if exists hs_level_log_member_all on hs_level_log;
create policy hs_level_log_member_all on hs_level_log for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hs_level_log to authenticated;

-- ============================================================================
-- 3. BỔ TRỢ YẾU — đợt (case) + scope dạng
-- ============================================================================
-- Đối xứng `bo_tro_duoi(_dang)` về hình dáng nhưng KHÁC vòng đời (xem đầu file).
-- `nguon`: 'ai_de_xuat' (Claude đề xuất → người duyệt, luồng spec §6) · 'thu_cong' (người tự mở)
--          · 'chuong_do' (kênh ③) · 'gv_tien_quyet' (kênh ④).
create table if not exists bo_tro_yeu (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  lop_id uuid references lop(id),
  mon text not null,
  nguon text not null default 'thu_cong',
  ly_do text,
  trang_thai text not null default 'dang_xu' check (trang_thai in ('dang_xu', 'hoan_thanh')),
  actor uuid,
  created_at timestamptz not null default now(),
  hoan_thanh_at timestamptz
);
-- 1 HS chỉ có 1 đợt yếu ĐANG XỬ mỗi môn (đóng rồi mới mở đợt mới) — partial unique như bo_tro_duoi.
create unique index if not exists bo_tro_yeu_dang_xu_uq on bo_tro_yeu (hoc_sinh_id, mon)
  where trang_thai = 'dang_xu';
alter table bo_tro_yeu enable row level security;
drop policy if exists bo_tro_yeu_member_all on bo_tro_yeu;
create policy bo_tro_yeu_member_all on bo_tro_yeu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on bo_tro_yeu to authenticated;

-- Scope DẠNG của đợt. `ma_dang` KHÔNG FK (dạng tách bảng theo môn: dai_ban_do/khtn_ban_do… —
-- cùng lý do `tai_lieu_cau`/`bo_tro_duoi_dang`).
-- ⭐ `day_at` = NEO OUTCOME (spec §5). Verify 07-22: cơ chế y hệt trên `bo_tro_duoi_dang` đang
--   chạy THẬT, populate 9/12 (75%) → sao chép nguyên, không phát minh lại.
--   NULL = CHƯA DẠY (không phải "không áp dụng") — cùng ngoại lệ đã chấp nhận ở 0099.
-- ⭐ `dong_at` = đóng DẠNG khi retest > 0.5 (spec §4.1: KHÔNG đòi tới Đạt 0.8 — bổ trợ xong việc
--   "hiểu bài", phần lên Đạt là của luyện tập). Đóng TỪNG DẠNG, không đóng cả đợt một cục.
create table if not exists bo_tro_yeu_dang (
  id uuid primary key default gen_random_uuid(),
  bo_tro_yeu_id uuid not null references bo_tro_yeu(id) on delete cascade,
  ma_dang text not null,
  created_at timestamptz not null default now(),
  day_buoi_id uuid references buoi_hoc(id),
  day_at timestamptz,
  dong_at timestamptz,
  unique (bo_tro_yeu_id, ma_dang)
);
alter table bo_tro_yeu_dang enable row level security;
drop policy if exists bo_tro_yeu_dang_member_all on bo_tro_yeu_dang;
create policy bo_tro_yeu_dang_member_all on bo_tro_yeu_dang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on bo_tro_yeu_dang to authenticated;

-- Link buổi bổ trợ yếu → đợt (đối xứng `buoi_hoc_hs.bo_tro_duoi_id`). Nullable = "không áp dụng"
-- với mọi buổi không phải bổ trợ yếu — đúng vai NULL cho phép (CLAUDE.md §1.5).
alter table buoi_hoc_hs add column if not exists bo_tro_yeu_id uuid references bo_tro_yeu(id);
