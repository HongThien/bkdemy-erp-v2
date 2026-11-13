-- ============================================================================
-- 202609131617 — fix_email_ha_giang
-- ----------------------------------------------------------------------------
-- VÌ SAO: tách riêng khỏi 202609131609 (fix current_nhan_su_id) vì file đó cần
-- CEO chạy tay qua Supabase SQL Editor (hàm do role postgres sở hữu, claude_build
-- không CREATE OR REPLACE được) — phần sửa email này claude_build sở hữu bảng
-- nhan_su, áp bình thường qua npm run migrate, không cần chờ.
--
-- Nguyễn Hà Giang (NS033): nhan_su.email = 'gianghnwork@gmail.com' nhưng email
-- thật lúc chị ấy tự link tài khoản (ghi lại trong tai_khoan.email tại thời
-- điểm link, 22/07) = 'gianghahnwork@gmail.com' — lệch nhau (thiếu "ah"). Đây
-- là nguyên nhân trực tiếp khiến app trợ giảng không hiện việc của chị ấy
-- (current_nhan_su_id() cũ chỉ nhận diện "tôi" bằng join email).
--
-- MẤT GÌ (Luật xoá): không xoá gì. UPDATE 1 dòng nhan_su.email — sửa lại cho
-- khớp email đăng nhập thật, dữ liệu cũ là sai (thiếu "ah"), không phải xoá
-- thông tin. Bọc trong DO + GET DIAGNOSTICS để chặn cứng nếu khớp sai dòng
-- (0 hoặc >1) — "thà bỏ trống còn hơn đánh sai" (CLAUDE.md §1.5) áp cho cả
-- UPDATE, không riêng INSERT.
-- ============================================================================

do $$
declare
  v_rows int;
begin
  update public.nhan_su
     set email = 'gianghahnwork@gmail.com', updated_at = now()
   where id = '1fbe3d7f-986c-4cac-8e5f-cd5af9ff823b'
     and ma_ns = 'NS033'
     and ho_ten = 'Nguyễn Hà Giang';
  get diagnostics v_rows = row_count;
  if v_rows <> 1 then
    raise exception 'Khớp % dòng (cần đúng 1) khi sửa email nhan_su NS033/Nguyễn Hà Giang — dừng lại, kiểm tra tay.', v_rows;
  end if;
end $$;
