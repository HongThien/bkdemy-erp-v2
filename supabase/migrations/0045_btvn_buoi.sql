-- ============================================================================
-- Migration 0045 — BTVN trong buổi (chấm buổi sau)
-- ----------------------------------------------------------------------------
-- ① per HS×buổi: trạng thái nộp + thái độ làm bài (mở rộng btvn_ket_qua)
-- ② cờ đóng phase BTVN (thưởng EXP hoàn thành; KHÔNG Elo, KHÔNG mastery)
-- ③ canh_bao_yeu = TÍN HIỆU người-confirm "HS X kém dạng Y" (nguồn hỗ trợ).
--    KHÁC data BTVN thô (tham khảo, không vào công thức) — đây là phán đoán TIN của TA.
-- ============================================================================
alter table btvn_ket_qua add column if not exists trang_thai_nop text; -- nop_dung_han|xin_phep|khong_lam|nop_muon
alter table btvn_ket_qua add column if not exists thai_do text;        -- nghiem_tuc|chua_het_suc|chua_nghiem_tuc|chong_doi
alter table buoi_hoc      add column if not exists btvn_dong_at timestamp with time zone;

create table if not exists canh_bao_yeu (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  ma_dang text not null,
  buoi_hoc_id uuid references buoi_hoc(id) on delete set null,
  nguon text not null default 'btvn',
  ghi_chu text,
  created_by uuid,
  created_at timestamp with time zone not null default now()
);
alter table canh_bao_yeu enable row level security;
drop policy if exists canh_bao_yeu_member_all on canh_bao_yeu;
create policy canh_bao_yeu_member_all on canh_bao_yeu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
