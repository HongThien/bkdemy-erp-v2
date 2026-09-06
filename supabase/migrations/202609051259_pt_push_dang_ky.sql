-- ============================================================================
-- 202609051259 — pt_push_dang_ky
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 05/09: khu "Giao việc phát triển" tách thành app riêng (pt.bkacademy.edu.vn,
--   khuôn app TA/OPS) và PHẢI có push hàng ngày 10:30 nhắc nhân sự CẬP NHẬT TÌNH
--   TRẠNG công việc. Kênh chốt = Web Push qua PWA (không store, không Firebase).
--
--   Web Push cần lưu "địa chỉ" mỗi thiết bị (endpoint + 2 khoá p256dh/auth do trình
--   duyệt cấp). Đó là dữ liệu THIẾT BỊ, phi-học-tập ⇒ KHÔNG nhãn môn (CLAUDE §1.6),
--   gắn vào nhan_su. 1 người nhiều máy = nhiều dòng. Tắt nhắc = XOÁ dòng của mình
--   (dòng chỉ tồn tại khi thiết bị THẬT đang đăng ký — §1.5 "thiếu = không có dòng").
--   gui_ok_at / loi_at / loi_ma = dấu vết lần gửi gần nhất (sự kiện đã xảy ra; NULL =
--   chưa từng xảy ra, đúng nghĩa "không áp dụng"). loi_ma = 410 nghĩa là push service
--   báo endpoint chết vĩnh viễn ⇒ cron bỏ qua, app tự đăng ký lại khi mở.
--
--   Bảng he_thong_bi_mat: cron trên Vercel gọi RPC bằng ANON key + 1 secret (đúng
--   quyết định CEO 19/08: KHÔNG đặt SUPABASE_SERVICE_ROLE lên Vercel vì key đó bỏ qua
--   MỌI RLS). Secret sinh NGAY TRONG migration bằng hàm băm ngẫu nhiên ⇒ không nằm
--   trong git; CEO SELECT ra dán vào Vercel env CRON_SECRET (xem cuối file). Bảng bật
--   RLS, KHÔNG policy, revoke hết ⇒ chỉ owner/security-definer đọc được.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Bảng mới hoàn toàn.
-- ============================================================================

create table if not exists push_dang_ky (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  thiet_bi    text,                       -- user-agent rút gọn, chỉ để người dùng nhận ra máy nào
  created_at  timestamptz not null default now(),
  gui_ok_at   timestamptz,                -- lần push THÀNH CÔNG gần nhất
  loi_at      timestamptz,                -- lần push LỖI gần nhất
  loi_ma      integer                     -- HTTP status của lần lỗi gần nhất (410 = endpoint chết)
);
create index if not exists idx_push_dang_ky_ns on push_dang_ky(nhan_su_id);

alter table push_dang_ky enable row level security;
-- Chỉ thấy/ghi dòng CỦA MÌNH (map tài khoản → nhân sự qua tai_khoan, như myNhanSuId() ở client).
drop policy if exists push_dang_ky_own on push_dang_ky;
create policy push_dang_ky_own on push_dang_ky for all to authenticated
  using (nhan_su_id = (select nhan_su_id from tai_khoan where id = jwt_uid()))
  with check (nhan_su_id = (select nhan_su_id from tai_khoan where id = jwt_uid()));
grant select, insert, update, delete on push_dang_ky to authenticated;

-- ── Bí mật hệ thống — chỉ security-definer đọc ───────────────────────────────
create table if not exists he_thong_bi_mat (
  khoa        text primary key,
  gia_tri     text not null,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
alter table he_thong_bi_mat enable row level security;
revoke all on he_thong_bi_mat from public, anon, authenticated;

-- Sinh secret cho cron push (chỉ khi chưa có — chạy lại migration không đổi secret đang dùng).
insert into he_thong_bi_mat (khoa, gia_tri, ghi_chu)
values (
  'push_cron',
  encode(sha256((gen_random_uuid()::text || clock_timestamp()::text || random()::text)::bytea), 'hex'),
  'Bearer secret cho api/pt-nhac-viec (Vercel env CRON_SECRET). Lấy: select gia_tri from he_thong_bi_mat where khoa = ''push_cron'';'
)
on conflict (khoa) do nothing;

-- SAU KHI ÁP — CEO làm tay 1 lần (SQL Editor):
--   select gia_tri from he_thong_bi_mat where khoa = 'push_cron';
-- → dán vào Vercel project pt: Environment Variables → CRON_SECRET.
