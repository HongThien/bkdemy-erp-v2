-- ============================================================================
-- SỔ CHẤM LẠI — spec-test-online §7 "sửa KEY sai (cả lớp)".
--
-- Ca dùng: đáp án SNAPSHOT trong `bai_test_cau.dap_an_key` bị sai ⇒ cả lớp bị chấm
-- oan. Luật spec: KHÔNG liveref, KHÔNG re-chấm ngầm khi sửa kho — phải đi qua thao
-- tác CÓ CHỦ Ý, in before/after và ĐỂ LẠI VẾT. Bảng này là cái vết đó.
--
-- Vì sao cần sổ riêng (không dựa vào trigger per-row): chấm lại là một HÀNH ĐỘNG của
-- người trên cả một câu — thứ cần lưu là "ai, đổi key từ gì sang gì, lật bao nhiêu bài,
-- vì sao", chứ không phải N dòng đổi verdict rời rạc.
--
-- KHÔNG cần resync đo lường: `mastery.ts` đọc THẲNG `bai_lam_cau` (verdict ≠ null) làm
-- nguồn đo, và `et_nop` KHÔNG ghi `gami_grades` (đã verify pg_proc: không nhắc tới bảng
-- đó, cũng không có trigger nào trên bai_lam/bai_lam_cau). Sửa verdict là mastery tự đúng.
-- ============================================================================

create table if not exists bai_test_cham_lai_log (
  id                uuid primary key default gen_random_uuid(),
  bai_test_cau_id   uuid not null references bai_test_cau(id) on delete cascade,
  key_cu            jsonb,
  key_moi           jsonb,
  so_bai            integer not null default 0,  -- tổng bài làm đã chấm lại
  sai_thanh_dung    integer not null default 0,
  dung_thanh_sai    integer not null default 0,
  ly_do             text,
  nguoi             uuid,
  tao_at            timestamptz not null default now()
);

create index if not exists bai_test_cham_lai_log_cau_idx
  on bai_test_cham_lai_log (bai_test_cau_id, tao_at desc);

comment on table bai_test_cham_lai_log is
  'Vết mỗi lượt "chấm lại câu N" sau khi sửa dap_an_key sai (spec test-online §7).';

-- RLS: CHỈ staff. HS không được đọc (biết key cũ/mới = biết đáp án) và tuyệt đối không ghi.
alter table bai_test_cham_lai_log enable row level security;

drop policy if exists bai_test_cham_lai_log_staff on bai_test_cham_lai_log;
create policy bai_test_cham_lai_log_staff on bai_test_cham_lai_log
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
