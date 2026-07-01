-- Cột đánh dấu OPS đã nhắn PH "con đã đến" cho HS này trong buổi (NULL = chưa báo).
-- Nút "Báo đến" chỉ nhắn HS MỚI đến (diem_danh='co_mat' & bao_den_at IS NULL) → không lặp lại người đã báo.
alter table public.buoi_hoc_hs add column if not exists bao_den_at timestamptz;
