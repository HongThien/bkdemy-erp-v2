-- ============================================================================
-- MỞ CỔNG kho Tiếng Anh cho app HS (Thùy 02/10: "Mở chức năng luyện tập tiếng anh trên app học sinh đi" — app HS đã deploy
-- bản có khối ngữ liệu + chữ gạch chân, mig 202610021403 đã áp).
-- Dựng từ định nghĩa ĐANG CHẠY lúc áp: ('Toán', 'KHTN') → thêm 'Tiếng Anh', không bỏ môn nào.
-- ⚠ Mig TSA 202610021415 (chưa áp) ghi cứng ('Toán','KHTN','TSA') — áp nguyên văn sau file này là ĐÓNG Anh; phiên TSA đã hẹn dựng lại
--    từ định nghĩa đang chạy (scripts/tsa/sinh-migration-hocsinh.mjs) trước khi áp.
-- MẤT GÌ: không mất gì.
-- ============================================================================
CREATE OR REPLACE FUNCTION public._kho_co_mon(p_mon text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select p_mon in ('Toán', 'KHTN', 'Tiếng Anh')
$function$;
