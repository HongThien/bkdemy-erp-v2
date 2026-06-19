-- ============================================================================
-- Migration 0044 — NGUỒN LỜI GIẢI (provenance) trên dai_cau_hoi
-- ----------------------------------------------------------------------------
-- §5 "chất lượng data moat" + vision AI quản kho: phải biết LỜI GIẢI do ai tạo.
--   'nguoi' = người tự giải / bóc từ tài liệu có lời giải sẵn (TIN ĐƯỢC)
--   'ai'    = AI tự giải (luồng "chỉ đề+đáp án") hoặc clone biến thể (CẦN DUYỆT)
-- Backfill: clone = ai; còn lại coi là người (data cũ chưa phân biệt).
-- Additive, an toàn dù chưa nhập liệu.
-- ============================================================================
alter table dai_cau_hoi add column if not exists nguon_giai text not null default 'nguoi';
update dai_cau_hoi set nguon_giai = 'ai' where nguon = 'clone' and nguon_giai <> 'ai';
