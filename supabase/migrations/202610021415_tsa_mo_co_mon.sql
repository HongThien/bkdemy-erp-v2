-- ============================================================================
-- 202610021415 — tsa_mo_co_mon
-- VÌ SAO: mở chốt kho TSA cho học sinh. ÁP SAU KHI DEPLOY APP HS MỚI (có màn kéo thả + môn TSA) — bản app cũ không biết câu kéo thả.
--   Dựng từ định nghĩa ĐANG CHẠY của _kho_co_mon: nếu phiên Anh đã mở 'Tiếng Anh' trước thì danh sách đã có 'Tiếng Anh' — thêm 'TSA' vào, KHÔNG ghi đè.
--   ⚠ Hai phiên cùng sửa 1 hàm: ai áp SAU phải dựng lại từ định nghĩa đang chạy (chạy lại scripts/tsa/sinh-migration-hocsinh.mjs), đừng áp file cũ.
-- MẤT GÌ: không mất gì (thêm 'TSA' vào danh sách môn có kho).
-- ============================================================================
CREATE OR REPLACE FUNCTION public._kho_co_mon(p_mon text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select p_mon in ('Toán', 'KHTN', 'TSA')
$function$;
