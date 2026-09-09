-- Phím tắt CÁ NHÂN cho mẫu công thức (ô nhập MathLive) — { [templateId]: 'Ctrl+Alt+F' }.
-- Dữ liệu cá nhân (không nhãn môn, như giao_dien). Không có bộ mặc định → default '{}'.
alter table nhan_su
  add column if not exists phim_tat_cong_thuc jsonb not null default '{}'::jsonb;
comment on column nhan_su.phim_tat_cong_thuc is
  'Phím tắt cá nhân cho mẫu công thức: {templateId: "Ctrl+Alt+F"} (src/lib/math/templates.ts). Không bộ mặc định.';
