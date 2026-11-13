-- ============================================================================
-- 202609131609 — fix_current_nhan_su_id_uu_tien_tai_khoan
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy báo TA Lộ Thị Dương + Nguyễn Hà Giang không thấy việc trên app trợ
-- giảng, 13/09): current_nhan_su_id() — hàm DUY NHẤT dùng bên trong fn_viec_buoi_thuong
-- để trả lời "buổi này là việc của AI" — xác định "tôi" bằng JOIN email
-- (auth.users.email = nhan_su.email), KHÁC với mọi nơi còn lại của hệ thống
-- (la_thanh_vien(), getMyProfile() phía client) vốn đi qua bảng link tai_khoan
-- (tai_khoan.id = auth.uid() → tai_khoan.nhan_su_id). Hai đường xác định danh
-- tính khác nhau cho cùng 1 khái niệm "tôi" → lệch nhau âm thầm, không lỗi.
--
-- Nguyễn Hà Giang (NS033): nhan_su.email = 'gianghnwork@gmail.com' nhưng email
-- thật lúc tài khoản chị ấy tự link (ghi lại trong tai_khoan.email tại thời điểm
-- link, 22/07) = 'gianghahnwork@gmail.com' — lệch nhau (thiếu "ah"). current_nhan_su_id()
-- trả NULL cho chị ấy ⇒ fn_viec_buoi_thuong không khớp dòng nào ⇒ app hiện "Không
-- có việc" dù DB có ~216 dòng việc thật (135 dòng chưa đóng đã kiểm tra trực tiếp
-- qua fn_viec_buoi_thuong(null,null,true)). Email fix nằm ở migration RIÊNG
-- (202609131645_fix_email_ha_giang.sql) — bảng nhan_su claude_build sở hữu, áp
-- bình thường qua npm run migrate.
--
-- Lộ Thị Dương (NS035): tự báo lại 13/09 "không hiện task ET/BTVN, cũng không
-- hiện hiệu suất" — 2 triệu chứng khác nhau nhưng CÙNG 1 gốc, vì fn_ta_tien_trinh
-- (màn hiệu suất/"Của tôi") CŨNG gọi current_nhan_su_id() y hệt fn_viec_buoi_thuong.
-- nhan_su.updated_at = 12/09 (1 ngày trước khi báo) — có khả năng email bị sửa
-- đúng lúc đó làm lệch khỏi email đăng nhập thật, nhưng nhan_su KHÔNG có
-- trigger/bảng lịch sử (khác luật §4 "mọi đổi state ghi vết") nên không truy lại
-- được giá trị cũ — không đoán, không sửa email lần này.
-- ⭐ Không CẦN sửa email của bạn ấy để hết bug: tai_khoan của Lộ Thị Dương ĐÃ
-- link đúng (nhan_su_id = 993ca32c...) từ lúc tạo tài khoản — con đường ưu tiên
-- MỚI (tai_khoan trước, email fallback sau) ở dưới tự khớp đúng người, KHÔNG
-- cần biết email đăng nhập thật là gì. Chỉ cần áp ĐÚNG function bên dưới là bạn
-- ấy hết bug — không phải chờ CEO tra email qua Supabase Dashboard nữa.
--
-- SỬA TẬN GỐC (file này): current_nhan_su_id() giờ ưu tiên tai_khoan.nhan_su_id
-- (khớp cách la_thanh_vien() đã làm) — email-join CHỈ còn là fallback cho ai
-- CHƯA link tai_khoan. Sửa nhan_su.email sau này (đổi email cá nhân, sửa lỗi
-- chính tả...) sẽ không còn làm "mất việc" âm thầm cho người đã link tài khoản.
--
-- ⚠ FILE NÀY KHÔNG CHẠY ĐƯỢC QUA `npm run migrate`: current_nhan_su_id() do
-- role `postgres` sở hữu (tạo tay qua SQL Editor từ trước — đúng điểm mù
-- CLAUDE.md §2.1 đã ghi, claude_build không CREATE OR REPLACE được hàm người
-- khác sở hữu). CEO cần paste NGUYÊN KHỐI CREATE OR REPLACE bên dưới vào
-- Supabase SQL Editor (đang đăng nhập postgres) để chạy tay, sau đó báo lại
-- để đánh dấu đã-áp trong sổ `_migrations` (node scripts/migrate.mjs --baseline
-- 202609131609_fix_current_nhan_su_id_uu_tien_tai_khoan.sql).
--
-- MẤT GÌ (Luật xoá): không xoá gì. CREATE OR REPLACE current_nhan_su_id() —
-- cùng chữ ký (không tham số, trả uuid), chỉ đổi thân hàm, thêm 1 nhánh ưu
-- tiên; nhánh email-join cũ GIỮ NGUYÊN làm fallback, không bỏ hành vi nào
-- đang chạy đúng.
-- ============================================================================

create or replace function public.current_nhan_su_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select tk.nhan_su_id
      from tai_khoan tk
      join nhan_su ns on ns.id = tk.nhan_su_id
      where tk.id = auth.uid()
        and ns.trang_thai = 'dang_lam'
      limit 1
    ),
    (
      select ns.id
      from nhan_su ns
      join auth.users au on lower(au.email) = lower(ns.email)
      where au.id = auth.uid()
        and ns.trang_thai = 'dang_lam'
      limit 1
    )
  );
$$;
comment on function public.current_nhan_su_id() is
  'Nhân sự đang đăng nhập. Ưu tiên tai_khoan.nhan_su_id (link bền, không lệch khi sửa nhan_su.email sau này) — fallback email-join cho ai chưa link. Sửa 202609131609 sau bug Hà Giang/Lộ Thị Dương (app TA không hiện việc vì current_nhan_su_id() cũ chỉ đi email-join, lệch khỏi la_thanh_vien()/getMyProfile()).';
grant execute on function public.current_nhan_su_id() to authenticated;
revoke execute on function public.current_nhan_su_id() from anon;
