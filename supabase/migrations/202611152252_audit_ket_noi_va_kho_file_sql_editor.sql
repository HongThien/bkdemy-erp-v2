-- ============================================================================
-- 202611152252 — audit_ket_noi_va_kho_file_sql_editor  ⚠ CHẠY Ở SQL EDITOR (không qua `npm run migrate`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 15/11 "làm sao để m có quyền check nhỉ". Khi mổ số kết nối DB (đỉnh 58/60 tối 11/11, 45/60 sau tối ưu), `claude_build` bị mù hai chỗ:
--   (1) `pg_stat_activity` chỉ cho thấy tên vai + tên ứng dụng của kết nối người khác, KHÔNG thấy đang chạy hay nằm im, mở từ bao giờ;
--   (2) không đọc được schema `storage` ⇒ không biết lúc Storage lên 15 kết nối có phải do script đẩy ảnh lên kho hay không.
--   Cùng khuôn với 3 hàm audit đã có (`_audit_pss`, `_audit_cron_job`, `_audit_cron_runs`): hàm CHỈ ĐỌC, chủ `postgres` (thấy được các thứ trên),
--   chỉ `claude_build` (và service_role) gọi được. Chỉ trả SỐ ĐẾM đã gom nhóm — không trả câu lệnh đang chạy, không trả tên file.
--   Phải chạy bằng `postgres` ở SQL Editor vì hàm cần quyền của `postgres`; hàm tạo ở SQL Editor dính quyền mặc định cho anon ⇒ thu lại tường minh.
--   Sau khi Thùy chạy: Claude gọi thử hai hàm, chạy `check:kien-truc`, rồi `migrate.mjs --ghi-so`.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì. Thêm 2 hàm chỉ đọc.
-- ============================================================================

-- (1) Kết nối đang mở, gom theo vai × ứng dụng × loại tiến trình × trạng thái.
create or replace function public._audit_ket_noi()
 returns table(vai text, ung_dung text, loai text, trang_thai text, so integer, im_lau_nhat_s integer, gd_lau_nhat_s integer, mo_lau_nhat_s integer)
 language sql
 security definer
 set search_path to ''
as $function$
  select coalesce(a.usename::text, '(nền)'), coalesce(nullif(a.application_name, ''), '(trống)'), a.backend_type, coalesce(a.state, '-'),
         count(*)::int,
         round(extract(epoch from max(now() - a.state_change)))::int,
         round(extract(epoch from max(now() - a.xact_start)))::int,
         round(extract(epoch from max(now() - a.backend_start)))::int
    from pg_catalog.pg_stat_activity a
   group by 1, 2, 3, 4
$function$;
revoke all on function public._audit_ket_noi() from public, anon, authenticated;
grant execute on function public._audit_ket_noi() to claude_build;

-- (2) Số file mới trong kho file theo từng 10 phút × bucket (khong_chu = file không gắn người đăng nhập nào: đẩy bằng khoá dịch vụ / script).
create or replace function public._audit_kho_file_moi(p_tu timestamptz, p_den timestamptz)
 returns table(luc timestamptz, bucket text, so_file integer, khong_chu integer)
 language sql
 security definer
 set search_path to ''
as $function$
  select date_bin(interval '10 minutes', o.created_at, timestamptz '2026-01-01 00:00+07'), o.bucket_id,
         count(*)::int, (count(*) filter (where o.owner_id is null))::int
    from storage.objects o
   where o.created_at >= p_tu and o.created_at < p_den
   group by 1, 2
$function$;
revoke all on function public._audit_kho_file_moi(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public._audit_kho_file_moi(timestamptz, timestamptz) to claude_build;
