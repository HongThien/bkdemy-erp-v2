-- ============================================================================
-- 202611112136 — toi_uu_hs_index_hs
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11 — reports/audit-timeout-11-11.md; CLAUDE.md §2.0):
-- Các hàm app HS lọc "của em" theo hoc_sinh_id nhưng 3 bảng không có index theo hoc_sinh_id ⇒ mỗi lượt gọi QUÉT CẢ BẢNG:
--   · buoi_hoc_hs (≈14k dòng) — fn_hs_lich_bo_tro + fn_btyeu_ca_cua_toi: app HS gọi mỗi 15 s ở màn chính
--     (24.468 + 24.614 lần); pg_stat_user_tables: 53.905 lượt seq scan × ~13k dòng.
--   · bai_lam (≈15k dòng) — _luot_tinh (nền của chuỗi / nhiệm vụ / ĐHT / thành tựu / BXH) lọc bl.hoc_sinh_id = any(..),
--     trang_thai = 'da_nop', nop_at trong cửa sổ; chỉ có index (bai_test_id, hoc_sinh_id) nên không dùng được.
--   · diem_thi — thành tựu TT12 lọc dt.hoc_sinh_id.
-- Chỉ THÊM index, không đổi hàm, không đổi số.
--
-- MẤT GÌ: không có (chỉ create index if not exists).
-- ============================================================================

create index if not exists buoi_hoc_hs_hoc_sinh_idx on public.buoi_hoc_hs (hoc_sinh_id);
create index if not exists bai_lam_hs_da_nop_idx on public.bai_lam (hoc_sinh_id, nop_at) where trang_thai = 'da_nop';
create index if not exists diem_thi_hoc_sinh_idx on public.diem_thi (hoc_sinh_id);
-- fn_hs_home_912: hạng Elo trong lớp đếm hoc_sinh_lop theo lop_id (chỉ có index (hoc_sinh_id, lop_id)); 242k lượt seq scan
create index if not exists hoc_sinh_lop_lop_dang_hoc_idx on public.hoc_sinh_lop (lop_id) where trang_thai = 'dang_hoc';
