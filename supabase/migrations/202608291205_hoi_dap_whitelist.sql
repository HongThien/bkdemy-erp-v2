-- ============================================================================
-- 202608291205 — hoi_dap_whitelist: TẠM THỜI chỉ 3 người được dùng Hỏi hệ thống
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO 29/08 — pilot tính năng với nhóm nhỏ trước khi mở cả trung tâm
--   (bot trả tiền API per-token + câu trả lời chưa được kiểm nghiệm rộng).
--   Whitelist đặt Ở MỘT CHỖ = hàm `hoi_dap_duoc_dung()`: RLS chặn THẬT ở DB,
--   client gọi CÙNG hàm này (rpc) chỉ để ẩn/hiện tab — ẩn UI không phải rào,
--   rào là policy. Mở rộng sau = 1 migration MỚI thay hàm, client khỏi đụng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Policy cũ `hoi_dap_nhan_su_member_doc/hoi_dap_nhan_su_member_hoi/
--   hoi_dap_bot_member_doc` (mở cho mọi thành viên) bị THAY bằng bản whitelist —
--   thành viên ngoài 3 người dưới đây tạm mất quyền đọc/hỏi. Không mất dữ liệu.
-- ============================================================================

-- 3 tài khoản pilot (tai_khoan.id = auth.uid), chốt với CEO 29/08:
--   Đào Xuân Thùy · Phạm Thị Thùy Trang · Trần Bảo Lộc
create or replace function public.hoi_dap_duoc_dung() returns boolean
language sql stable as $$
  select public.jwt_uid() in (
    '1a531947-5174-449b-9191-615ef6adb4a1'::uuid,  -- Đào Xuân Thùy
    '31ffe8dc-9310-4ce9-b27e-c6c1c6263d43'::uuid,  -- Phạm Thị Thùy Trang
    'bdb64e2c-809c-419c-88a8-f0d48683e664'::uuid   -- Trần Bảo Lộc
  )
$$;
comment on function public.hoi_dap_duoc_dung is
  'Whitelist pilot Hỏi hệ thống (TẠM THỜI, CEO 29/08). Nguồn chân lý duy nhất: RLS hoi_dap_* và UI (rpc) cùng đọc hàm này. Mở rộng = migration mới thay hàm.';
grant execute on function public.hoi_dap_duoc_dung() to authenticated;

drop policy if exists hoi_dap_nhan_su_member_doc on hoi_dap_nhan_su;
create policy hoi_dap_nhan_su_member_doc on hoi_dap_nhan_su for select to authenticated
  using (public.hoi_dap_duoc_dung());
drop policy if exists hoi_dap_nhan_su_member_hoi on hoi_dap_nhan_su;
create policy hoi_dap_nhan_su_member_hoi on hoi_dap_nhan_su for insert to authenticated
  with check (public.hoi_dap_duoc_dung() and nguoi = public.jwt_uid());

drop policy if exists hoi_dap_bot_member_doc on hoi_dap_bot;
create policy hoi_dap_bot_member_doc on hoi_dap_bot for select to authenticated
  using (public.hoi_dap_duoc_dung());
