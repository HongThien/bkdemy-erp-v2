-- ============================================================================
-- 202610211841 — nguon_ngan_noi_dung_on_tap
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Chuyên đề lớp 8 (Thùy 21/10): đề cương THCS Ngọc Thụy tên "Nội dung ôn tập giữa học kì I…" ⇒ bản rút gọn của mig 202610211813
--   in thành "Nội dung giữa kì I…" (khó hiểu). Nó là đề cương ⇒ in "Đề cương giữa kì I…" như các đề cương khác.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thay thân hàm _nguon_ngan (thêm 1 luật đổi tên).
-- ============================================================================

create or replace function _nguon_ngan(p text) returns text language sql immutable as $$
  select nullif(btrim(
    regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(
      coalesce(p, ''),
      '\s*\([^()]*\)\s*$', ''),            -- ghi chú cuối "(đề chẵn)", "(mã đề A)"…
      '^Đề kiểm tra', 'Đề thi'),
      '^Nội dung ôn tập', 'Đề cương'),      -- "Nội dung ôn tập giữa học kì I" = đề cương
      'ôn tập\s+', '', 'g'),
      'học kì', 'kì', 'g'),
      '\s+Toán\s+\d+T?(\s|$)', '\1', 'g')   -- môn + khối đã rõ từ chuyên đề (Postgres: \b là backspace, không phải ranh giới từ)
  ), '')
$$;
