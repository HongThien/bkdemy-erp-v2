-- ============================================================================
-- Gỡ phần thừa của mig 202610121613 (CEO Thùy 12/10 "gỡ đi" — Luật xoá, đã liệt kê + được gật):
-- vùng kiến thức nằm ở CHỦ ĐỀ (dai_bdm_chu_de.nhanh, giữ nguyên); chuyên đề dùng chung nên không cần nhánh.
-- Gỡ đúng 3 thứ, đều do mig 202610121613 tạo, 0 dữ liệu thật (196 dòng đều là mặc định 'toan'):
--   1) trigger  trg_bdm_o_cung_nhanh  trên dai_bdm_o
--   2) hàm      _bdm_o_cung_nhanh()   (đã là no-op từ mig 202610121621)
--   3) cột      dai_bdm_chuyen_de.nhanh (+ CHECK dai_bdm_chuyen_de_nhanh_check đi theo cột)
-- Không hàm nào còn nhắc tới (đã quét pg_proc.prosrc); fn_bdm_cay đã bỏ ch.nhanh ở mig 202610121621.
-- ============================================================================
drop trigger if exists trg_bdm_o_cung_nhanh on public.dai_bdm_o;
drop function if exists public._bdm_o_cung_nhanh();
alter table public.dai_bdm_chuyen_de drop column if exists nhanh;
