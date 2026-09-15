-- ============================================================================
-- 202609061913 — push_dang_ky_app_scope
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 06/09: app TRỢ GIẢNG (ta) cũng cần push nhắc hàng ngày (23:30, tin chung,
--   khuôn y hệt app Phát triển 10:30). `push_dang_ky` lúc tạo (mig 202609051259) chỉ
--   phục vụ 1 app (pt) — không có cột phân biệt app. Giờ 2 app CÙNG bảng ⇒ phải biết
--   1 dòng thuộc app nào, không thì cron của app này gửi nhầm payload/giờ của app kia
--   cho thiết bị đã đăng ký app khác (Web Push subscribe theo TỪNG ORIGIN + CẶP KHOÁ
--   VAPID riêng — sai app là push service từ chối hoặc gửi nhầm nội dung).
--   `app` KHÔNG phải nhãn môn học (§1.6 không áp — đây là dữ liệu THIẾT BỊ/kỹ thuật,
--   phi-học-tập, đã CHUNG theo đúng luật đó).
--   3 dòng ĐÃ có trong DB (app pt đã có người bật thật) ⇒ mặc định 'pt' cho dữ liệu cũ,
--   ĐÚNG vì lúc đó chỉ tồn tại app pt.
--
--   `fn_pt_push_danh_sach` SỬA TẠI CHỖ (create or replace, KHÔNG đổi tên hàm) — thêm
--   tham số `p_app` CÓ DEFAULT 'pt' nên bản đã deploy của app pt (gọi `fn_pt_push_danh_sach(p_secret)`
--   1 tham số) VẪN CHẠY Y NGUYÊN, không cần đợi redeploy đồng bộ. `app_ta` gọi hàm
--   này với `p_app: 'ta'`. Tên hàm giữ tiền tố `pt` dù giờ dùng chung 2 app — đổi tên
--   sẽ phải đổi CẢ code đã deploy trên Vercel cùng lúc migration chạy, rủi ro hơn lợi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thêm cột (mặc định 'pt', không NULL) + CHECK mới, sửa hàm tại chỗ.
-- ============================================================================

alter table push_dang_ky add column if not exists app text not null default 'pt';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'push_dang_ky_app_check') then
    alter table push_dang_ky add constraint push_dang_ky_app_check check (app in ('pt', 'ta'));
  end if;
end $$;

-- Overload cũ (1 tham số) và bản mới (2 tham số, p_app CÓ default) là HAI CHỮ KÝ KHÁC NHAU
-- với Postgres — giữ cả hai sẽ ĐỤNG ĐỘ ("function is not unique") khi gọi chỉ p_secret vì
-- cả hai đều khớp được. Phải DROP overload cũ rồi mới tạo bản mới thay thế đúng nghĩa.
drop function if exists public.fn_pt_push_danh_sach(text);

create or replace function public.fn_pt_push_danh_sach(p_secret text, p_app text default 'pt')
returns table (id uuid, endpoint text, p256dh text, auth text)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select d.id, d.endpoint, d.p256dh, d.auth
  from push_dang_ky d
  join nhan_su ns on ns.id = d.nhan_su_id
  where ns.trang_thai = 'dang_lam'
    and d.loi_ma is distinct from 410
    and d.app = coalesce(p_app, 'pt')
  order by d.created_at;
end $$;
revoke all on function public.fn_pt_push_danh_sach(text, text) from public;
grant execute on function public.fn_pt_push_danh_sach(text, text) to anon, authenticated;
