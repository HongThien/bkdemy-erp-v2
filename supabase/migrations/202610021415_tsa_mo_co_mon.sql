-- ============================================================================
-- 202610021415 — tsa_mo_co_mon
-- VÌ SAO: mở chốt kho TSA cho học sinh. ÁP SAU KHI DEPLOY APP HS MỚI (có màn kéo thả + môn TSA) — bản app cũ không biết câu kéo thả.
--   Dựng từ định nghĩa ĐANG CHẠY (02/10 chiều: phiên Anh đã mở 'Tiếng Anh' ⇒ ('Toán','KHTN','Tiếng Anh')), chỉ THÊM 'TSA'.
--   ⚠ Trước khi áp: kiểm lại `select pg_get_functiondef('public._kho_co_mon(text)'::regprocedure)` — nếu đã khác thì dựng lại, đừng áp file cũ.
-- MẤT GÌ: không mất gì (thêm 'TSA' vào danh sách môn có kho).
-- ============================================================================
create or replace function public._kho_co_mon(p_mon text)
 returns boolean language sql immutable
as $function$
  select p_mon in ('Toán', 'KHTN', 'Tiếng Anh', 'TSA')
$function$;
