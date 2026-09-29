-- ============================================================================
-- DÁN 1 LẦN trong Supabase SQL Editor (project ERP) — HS xem ẢNH bài BTVN đã trả trên app HS.
-- Đi kèm migration 202609291943_btvn_tra_hs_xem.sql (phải áp migration TRƯỚC — cần hàm _btvn_hs_xem_anh).
-- Vì sao không nằm trong migration: storage.objects thuộc supabase_storage_admin, role claude_build
-- (npm run migrate) không tạo được policy trên đó — giống scripts/sql_appta_role_bucket.sql.
--
-- Policy chỉ THÊM quyền ĐỌC cho HS: đúng ảnh (gốc hoặc bản TA chấm) thuộc bài của CHÍNH em và bài
-- ĐÃ TRẢ (tra_at is not null). Policy nhân sự btvn_nop_read cũ giữ nguyên. Không có insert/update/delete.
-- MẤT GÌ: không gì. Gỡ lại được bằng: drop policy "btvn_nop_hs_xem_bai_tra" on storage.objects;
-- ============================================================================

drop policy if exists "btvn_nop_hs_xem_bai_tra" on storage.objects;
create policy "btvn_nop_hs_xem_bai_tra" on storage.objects for select to authenticated
  using (bucket_id = 'btvn-nop' and public._btvn_hs_xem_anh(name));

-- Kiểm: phải ra 1 dòng.
select policyname, cmd, roles from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname = 'btvn_nop_hs_xem_bai_tra';
