-- ============================================================================
-- 202607232117 — danhgia_ai_job
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Nối CLAUDE API vào module đánh giá (spec §0 "code tính số, CLAUDE PHÁN"; §6
--   "CLAUDE đọc stat sheet của candidate: phân loại + lý do + đề xuất level + confidence").
--   Rule-engine đã xong (`src/gami/danhgia.js`) — đây là vế còn lại.
--
--   ⭐ VÌ SAO QUA BẢNG JOB, KHÔNG GỌI THẲNG TỪ BROWSER:
--   Gọi Anthropic API từ browser buộc phải nhúng API key vào bundle (`VITE_*`).
--   Repo đã chấp nhận điều đó cho Gemini, NHƯNG: (a) Opus 4.8 đắt hơn nhiều lần
--   và (b) đã có tiền lệ cháy tiền vì gọi model đắt (DEVLOG: "vụ 920k" → phải
--   khoá cứng Gemini về Flash). Key lộ = ai cũng đốt được.
--   ⇒ Worker Node (đã có sẵn pattern `linkgen_jobs` + `worker/index.mjs`) giữ key
--   server-side; browser chỉ ghi job + đọc kết quả.
--
--   ⭐ `stat_sheet` do CLIENT tính rồi ghi vào job (không để worker tự tính lại):
--   (a) không nhân đôi logic — stat sheet đã có ở `src/lib/danhgia.ts`;
--   (b) ĐÓNG BĂNG bằng chứng đúng thời điểm hỏi — mastery là suy-động, tính lại
--       sau sẽ ra số khác và không còn đối chiếu được với câu Claude đã trả lời.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG MẤT GÌ. Chỉ CREATE TABLE IF NOT EXISTS + index. Không đụng bảng nào đang có.
-- ============================================================================

create table if not exists danhgia_ai_job (
  id uuid primary key default gen_random_uuid(),
  lop_id uuid not null references lop(id) on delete cascade,
  mon text not null,
  -- Đầu vào: stat sheet SẠCH do code tính (spec §0 — Claude KHÔNG tự cộng trừ trên raw).
  stat_sheet jsonb not null,
  trang_thai text not null default 'pending' check (trang_thai in ('pending', 'processing', 'done', 'failed')),
  attempt integer not null default 0,
  -- Đầu ra: nhận định của Claude (phân loại + lý do + đề xuất + độ tin).
  ket_qua jsonb,
  model text,           -- model đã dùng — để sau đọc log biết ai phán
  usage jsonb,          -- token in/out + cache → soi chi phí THẬT, không đoán
  error text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  done_at timestamptz
);
-- Worker quét job chờ: lấy cũ nhất trước.
create index if not exists danhgia_ai_job_cho_idx on danhgia_ai_job (updated_at)
  where trang_thai in ('pending', 'processing');
create index if not exists danhgia_ai_job_lop_idx on danhgia_ai_job (lop_id, created_at desc);

alter table danhgia_ai_job enable row level security;
drop policy if exists danhgia_ai_job_member_all on danhgia_ai_job;
create policy danhgia_ai_job_member_all on danhgia_ai_job for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on danhgia_ai_job to authenticated;
