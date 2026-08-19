-- Report PH: cổng "Chốt & công bố". cong_bo_at NULL = nháp (PH KHÔNG thấy); NOT NULL = đã công bố.
-- App PH (bkdemy-ph) chỉ đọc dòng cong_bo_at IS NOT NULL (view lọc bên đó).
-- GV sửa = tự lưu như cũ; chỉ khi bấm "Chốt & công bố" mới set cong_bo_at → mới lên app.

alter table public.bao_cao_ph add column if not exists cong_bo_at timestamptz;

-- Backfill: report hiện có (PH đang thấy realtime) → đánh dấu đã công bố luôn, khỏi biến mất khi lên tính năng.
update public.bao_cao_ph set cong_bo_at = coalesce(updated_at, now()) where cong_bo_at is null;
