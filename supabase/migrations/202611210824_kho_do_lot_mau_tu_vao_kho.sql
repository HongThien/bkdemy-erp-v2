-- ============================================================================
-- 202611210824 — kho_do_lot_mau_tu_vao_kho
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   spec-giai-bai §C5 + §C10 mục 5: luật tự vào kho (18/11) đã bỏ nhân chứng đáp số; an toàn dựa vào hậu kiểm + ĐO TỈ LỆ LỌT trên mẫu.
--   Cần sổ ghi kết quả mỗi lượt đo: rút mẫu câu đã tự vào kho → model khác GIẢI MÙ (chưa thấy đáp án kho) → so đáp số.
--   Tỉ lệ lọt = số lệch / (khớp + lệch) trong mẫu; > 2% ⇒ batch đó Opus kiểm 100% (§C5).
--   Sổ chỉ THÊM (một dòng = một câu đã có kết quả đo thật — không có dòng "chờ"), không sửa, nên đọc lại được cả lịch sử.
--   Công cụ: scripts/kho/do-lot.mjs. Sổ này CHỈ ĐO — không sửa câu, không rút câu về hàng chờ (đó là quy trình rà E4, chưa được duyệt).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì; chỉ thêm 1 bảng.
-- ============================================================================

create table if not exists public.kho_do_lot (
  id            bigint generated always as identity primary key,
  lo_id         uuid        not null,                       -- một lượt đo
  kho           text        not null,                       -- fn_kho_tbl: toan · hgt · hinh_hoc · khtn · ...
  khoi          text,
  ma_cau        text        not null,
  dap_an_kho    text,                                       -- đáp án đang trong kho lúc đo
  dap_an_giai   text,                                       -- đáp án người giải mù ra
  model_giai    text        not null,                       -- model giải mù (phải KHÁC model đã soạn câu)
  ket_qua       text        not null check (ket_qua in ('khop','lech','khong_giai_duoc')),
  ghi_chu       text,
  nguon_cau     text,                                       -- duyet_nguon của câu lúc đo ('ai' · 'may' · 'nguoi') — để tách tỉ lệ lọt theo đường vào kho
  at            timestamptz not null default now()
);
create index if not exists kho_do_lot_lo_idx on public.kho_do_lot (lo_id);
create index if not exists kho_do_lot_cau_idx on public.kho_do_lot (kho, ma_cau);
comment on table public.kho_do_lot is 'Sổ đo tỉ lệ lọt (spec-giai-bai §C5): mỗi dòng = 1 câu đã tự vào kho được giải mù lại. Chỉ thêm. Chỉ đo, không sửa câu.';
alter table public.kho_do_lot enable row level security;
-- Không policy cho authenticated: sổ chỉ đọc/ghi bằng script (role sở hữu) và claude_ro (migrate.mjs tự thêm policy select).
